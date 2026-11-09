/*
# Create enquiries table for space booking requests

1. New Tables
- `enquiries`
  - `id` (uuid, primary key)
  - `name` (text, required, 2-120 characters) - the applicant's name
  - `contact` (text, required, 3-120 characters) - phone number or Telegram handle
  - `event_date` (date, optional) - requested event date
  - `event_format` (text, required) - one of the four event formats offered on the site
  - `comment` (text, optional, up to 1000 characters) - details of the meeting
  - `created_at` (timestamptz) - when the request was submitted

2. Security
- Row level security is enabled on `enquiries`.
- Visitors (anon and signed-in roles) may INSERT a request only.
- No SELECT, UPDATE or DELETE access is granted, so submitted requests are not readable through the public site.

3. Important Notes
- The check constraints keep submissions within sensible lengths and restrict the event format to the published options.
- Requests are reviewed from the database dashboard.
*/

CREATE TABLE IF NOT EXISTS enquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (char_length(name) BETWEEN 2 AND 120),
  contact text NOT NULL CHECK (char_length(contact) BETWEEN 3 AND 120),
  event_date date,
  event_format text NOT NULL CHECK (event_format IN (
    'Лекции и презентации',
    'Мастер-классы и воркшопы',
    'Корпоративные мероприятия',
    'Частные и бренд-события'
  )),
  comment text CHECK (comment IS NULL OR char_length(comment) <= 1000),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;

GRANT INSERT ON enquiries TO anon, authenticated;

DROP POLICY IF EXISTS "anon_insert_enquiries" ON enquiries;
CREATE POLICY "anon_insert_enquiries" ON enquiries FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
