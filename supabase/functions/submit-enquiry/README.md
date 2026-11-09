# submit-enquiry

Edge-функция принимает заявки с формы бронирования, проверяет Turnstile,
сохраняет заявку в таблицу `enquiries` и отправляет уведомление на почту
оператора.

## Куда уходит почта

Письма с заявками пересылаются на **elizkavalenka@gmail.com**
(значение по умолчанию в коде). Чтобы поменять адрес без правки кода —
задайте секрет `NOTIFY_EMAIL`.

## Деплой

```bash
supabase functions deploy submit-enquiry
```

## Секреты (Supabase → Edge Functions → Secrets)

| Секрет | Назначение |
| --- | --- |
| `TURNSTILE_SECRET_KEY` | секретный ключ Cloudflare Turnstile |
| `RESEND_API_KEY` | ключ API сервиса отправки писем Resend |
| `NOTIFY_EMAIL` | получатель уведомлений (по умолчанию `elizkavalenka@gmail.com`) |
| `NOTIFY_FROM` | подтверждённый отправитель в Resend (по умолчанию `onboarding@resend.dev`) |

`SUPABASE_URL` и `SUPABASE_SERVICE_ROLE_KEY` подставляются средой выполнения
автоматически.

```bash
supabase secrets set TURNSTILE_SECRET_KEY=... RESEND_API_KEY=... \
  NOTIFY_EMAIL=elizkavalenka@gmail.com
```

> Если `RESEND_API_KEY` не задан, заявка всё равно сохранится в базе, но письмо
> не отправится (в логах будет предупреждение). Для доставки на Gmail нужен
> рабочий ключ Resend и подтверждённый домен-отправитель.
