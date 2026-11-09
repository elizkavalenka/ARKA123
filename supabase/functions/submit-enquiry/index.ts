// Supabase Edge Function: submit-enquiry
//
// Receives booking enquiries from the site form, verifies the Cloudflare
// Turnstile token, stores the enquiry in the `enquiries` table and forwards a
// notification e-mail to the operator.
//
// Required environment variables (set them with `supabase secrets set ...`):
//   SUPABASE_URL                 - provided automatically in the Edge runtime
//   SUPABASE_SERVICE_ROLE_KEY    - provided automatically in the Edge runtime
//   TURNSTILE_SECRET_KEY         - Cloudflare Turnstile secret key
//   RESEND_API_KEY               - API key for the Resend e-mail service
//   NOTIFY_EMAIL                 - recipient of enquiry notifications
//                                  (defaults to elizkavalenka@gmail.com)
//   NOTIFY_FROM                  - verified sender address for Resend
//                                  (defaults to onboarding@resend.dev)

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const NOTIFY_EMAIL = Deno.env.get('NOTIFY_EMAIL') ?? 'elizkavalenka@gmail.com';
const NOTIFY_FROM = Deno.env.get('NOTIFY_FROM') ?? 'ARKA 123 <onboarding@resend.dev>';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const EVENT_FORMATS = [
  '\u041b\u0435\u043a\u0446\u0438\u0438 \u0438 \u043f\u0440\u0435\u0437\u0435\u043d\u0442\u0430\u0446\u0438\u0438',
  '\u041c\u0430\u0441\u0442\u0435\u0440-\u043a\u043b\u0430\u0441\u0441\u044b \u0438 \u0432\u043e\u0440\u043a\u0448\u043e\u043f\u044b',
  '\u041a\u043e\u0440\u043f\u043e\u0440\u0430\u0442\u0438\u0432\u043d\u044b\u0435 \u043c\u0435\u0440\u043e\u043f\u0440\u0438\u044f\u0442\u0438\u044f',
  '\u0427\u0430\u0441\u0442\u043d\u044b\u0435 \u0438 \u0431\u0440\u0435\u043d\u0434-\u0441\u043e\u0431\u044b\u0442\u0438\u044f',
];

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  });
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

async function verifyTurnstile(token: string, ip: string | null) {
  const secret = Deno.env.get('TURNSTILE_SECRET_KEY');
  if (!secret) {
    // Fail closed: without a configured secret we cannot trust the request.
    return false;
  }
  const form = new FormData();
  form.append('secret', secret);
  form.append('response', token);
  if (ip) form.append('remoteip', ip);

  const res = await fetch(
    'https://challenges.cloudflare.com/turnstile/v0/siteverify',
    { method: 'POST', body: form },
  );
  const data = await res.json();
  return data.success === true;
}

async function sendNotification(enquiry: {
  name: string;
  contact: string;
  eventDate: string | null;
  eventFormat: string;
  comment: string | null;
}) {
  const apiKey = Deno.env.get('RESEND_API_KEY');
  if (!apiKey) {
    console.warn('RESEND_API_KEY is not set \u2014 notification e-mail skipped.');
    return;
  }

  const rows = [
    ['\u0418\u043c\u044f', enquiry.name],
    ['\u041a\u043e\u043d\u0442\u0430\u043a\u0442', enquiry.contact],
    ['\u0414\u0430\u0442\u0430 \u043c\u0435\u0440\u043e\u043f\u0440\u0438\u044f\u0442\u0438\u044f', enquiry.eventDate ?? '\u2014'],
    ['\u0424\u043e\u0440\u043c\u0430\u0442', enquiry.eventFormat],
    ['\u041a\u043e\u043c\u043c\u0435\u043d\u0442\u0430\u0440\u0438\u0439', enquiry.comment ?? '\u2014'],
  ]
    .map(
      ([label, value]) =>
        `<tr><td style="padding:6px 12px;font-weight:600;color:#0f0e0d;">${escapeHtml(
          label,
        )}</td><td style="padding:6px 12px;color:#44403c;">${escapeHtml(
          value,
        )}</td></tr>`,
    )
    .join('');

  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;">
      <h2 style="color:#0f0e0d;">\u041d\u043e\u0432\u0430\u044f \u0437\u0430\u044f\u0432\u043a\u0430 \u0441 \u0441\u0430\u0439\u0442\u0430 ARKA 123</h2>
      <table style="border-collapse:collapse;width:100%;">${rows}</table>
    </div>`;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: NOTIFY_FROM,
      to: [NOTIFY_EMAIL],
      reply_to: enquiry.contact.includes('@') ? enquiry.contact : undefined,
      subject: `ARKA 123 \u2014 \u043d\u043e\u0432\u0430\u044f \u0437\u0430\u044f\u0432\u043a\u0430: ${enquiry.name}`,
      html,
    }),
  });

  if (!res.ok) {
    console.error('Resend error', res.status, await res.text());
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS_HEADERS });
  }
  if (req.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405);
  }

  let payload: Record<string, unknown>;
  try {
    payload = await req.json();
  } catch {
    return json({ error: 'Invalid JSON' }, 400);
  }

  const name = String(payload.name ?? '').trim();
  const contact = String(payload.contact ?? '').trim();
  const eventDate = payload.eventDate ? String(payload.eventDate) : null;
  const eventFormat = String(payload.eventFormat ?? '').trim();
  const commentRaw = payload.comment ? String(payload.comment).trim() : '';
  const comment = commentRaw.length > 0 ? commentRaw : null;
  const captchaToken = String(payload.captchaToken ?? '');
  const website = String(payload.website ?? '');

  // Honeypot: real users never fill this hidden field.
  if (website.trim().length > 0) {
    return json({ ok: true });
  }

  // Server-side validation mirroring the client and DB constraints.
  if (name.length < 2 || name.length > 120) {
    return json({ error: '\u041d\u0435\u043a\u043e\u0440\u0440\u0435\u043a\u0442\u043d\u043e\u0435 \u0438\u043c\u044f' }, 400);
  }
  if (contact.length < 3 || contact.length > 120) {
    return json({ error: '\u041d\u0435\u043a\u043e\u0440\u0440\u0435\u043a\u0442\u043d\u044b\u0439 \u043a\u043e\u043d\u0442\u0430\u043a\u0442' }, 400);
  }
  if (!EVENT_FORMATS.includes(eventFormat)) {
    return json({ error: '\u041d\u0435\u0432\u0435\u0440\u043d\u044b\u0439 \u0444\u043e\u0440\u043c\u0430\u0442' }, 400);
  }
  if (comment && comment.length > 1000) {
    return json({ error: '\u041a\u043e\u043c\u043c\u0435\u043d\u0442\u0430\u0440\u0438\u0439 \u0441\u043b\u0438\u0448\u043a\u043e\u043c \u0434\u043b\u0438\u043d\u043d\u044b\u0439' }, 400);
  }

  const ip =
    req.headers.get('cf-connecting-ip') ??
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    null;

  const captchaOk = await verifyTurnstile(captchaToken, ip);
  if (!captchaOk) {
    return json({ error: '\u041d\u0435 \u043f\u0440\u043e\u0439\u0434\u0435\u043d\u0430 \u043f\u0440\u043e\u0432\u0435\u0440\u043a\u0430 \u0431\u0435\u0437\u043e\u043f\u0430\u0441\u043d\u043e\u0441\u0442\u0438' }, 403);
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  const { error } = await supabase.from('enquiries').insert({
    name,
    contact,
    event_date: eventDate,
    event_format: eventFormat,
    comment,
  });

  if (error) {
    console.error('Insert error', error);
    return json({ error: '\u041d\u0435 \u0443\u0434\u0430\u043b\u043e\u0441\u044c \u0441\u043e\u0445\u0440\u0430\u043d\u0438\u0442\u044c \u0437\u0430\u044f\u0432\u043a\u0443' }, 500);
  }

  // E-mail is best-effort: never fail the user request if notification fails.
  try {
    await sendNotification({ name, contact, eventDate, eventFormat, comment });
  } catch (e) {
    console.error('Notification error', e);
  }

  return json({ ok: true });
});
