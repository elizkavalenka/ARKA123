/*
# Restrict enquiries INSERT to the server-side Edge Function

## Why
The original policy granted a public INSERT with `WITH CHECK (true)` to the
`anon` and `authenticated` roles. That let a client call the table directly
and bypass the Cloudflare Turnstile / honeypot checks that only run inside the
`submit-enquiry` Edge Function.

## What changes
- Drop the public INSERT policy and revoke the INSERT grant from `anon` and
  `authenticated`.
- Row Level Security stays enabled. The `service_role` used by the
  `submit-enquiry` Edge Function bypasses RLS, so the form keeps working while
  direct client inserts are no longer possible.

No SELECT / UPDATE / DELETE access is granted to public roles, so submitted
requests remain unreadable from the site.
*/

DROP POLICY IF EXISTS "anon_insert_enquiries" ON enquiries;

REVOKE INSERT ON enquiries FROM anon, authenticated;
