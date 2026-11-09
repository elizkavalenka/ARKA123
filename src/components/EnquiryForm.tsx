import { useCallback, useState, type FormEvent, type ReactNode } from 'react';
import { ArrowRight, Check, ChevronDown } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import TurnstileField from '@/components/TurnstileField';
import { EVENT_FORMATS, type EventFormat } from '@/data/site';

type FormValues = {
  name: string;
  contact: string;
  eventDate: string;
  eventFormat: EventFormat;
  comment: string;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error';

const INITIAL_VALUES: FormValues = {
  name: '',
  contact: '',
  eventDate: '',
  eventFormat: EVENT_FORMATS[0],
  comment: '',
};

const INPUT_CLASS =
  'w-full border-0 border-b border-stone-600/50 bg-transparent px-0 py-3 text-base text-charcoal placeholder:text-stone-600 transition-colors duration-300 focus:border-brand focus:outline-none';

const FIELD_ORDER: (keyof FormValues)[] = ['name', 'contact', 'eventDate', 'comment'];

const fieldId = (field: keyof FormValues) => `enquiry-${field}`;
const errorId = (field: keyof FormValues) => `enquiry-${field}-error`;

function todayIsoDate() {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 10);
}

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};
  if (values.name.trim().length < 2) {
    errors.name = 'Укажите имя (не меньше 2 символов).';
  }
  if (values.contact.trim().length < 3) {
    errors.contact = 'Укажите телефон или Telegram для связи.';
  }
  if (values.eventDate && values.eventDate < todayIsoDate()) {
    errors.eventDate = 'Дата не может быть в прошлом.';
  }
  if (values.comment.trim().length > 1000) {
    errors.comment = 'Комментарий не должен превышать 1000 символов.';
  }
  return errors;
}

export default function EnquiryForm() {
  const [values, setValues] = useState<FormValues>(INITIAL_VALUES);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<SubmitStatus>('idle');
  const [captchaToken, setCaptchaToken] = useState('');
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState('');
  const handleCaptchaToken = useCallback((token: string) => setCaptchaToken(token), []);

  const updateField = <K extends keyof FormValues>(field: K, value: FormValues[K]) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === 'submitting') return;

    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      const firstInvalid = FIELD_ORDER.find((field) => nextErrors[field]);
      if (firstInvalid) {
        document.getElementById(fieldId(firstInvalid))?.focus();
      }
      return;
    }

    if (!consent || !captchaToken) {
      setStatus('error');
      return;
    }

    setStatus('submitting');
    try {
      const { error } = await supabase.functions.invoke('submit-enquiry', {
        body: {
          name: values.name.trim(),
          contact: values.contact.trim(),
          eventDate: values.eventDate || null,
          eventFormat: values.eventFormat,
          comment: values.comment.trim() || null,
          captchaToken,
          website,
        },
      });

      if (error) {
        setStatus('error');
        return;
      }

      setValues(INITIAL_VALUES);
      setCaptchaToken('');
      setConsent(false);
      setWebsite('');
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="flex flex-col items-start gap-6 py-10" role="status">
        <span className="flex h-14 w-14 items-center justify-center bg-brand text-white">
          <Check className="h-7 w-7" strokeWidth={1.5} />
        </span>
        <div>
          <h3 className="text-[28px] font-medium leading-[1.15] text-charcoal">Заявка отправлена</h3>
          <p className="mt-4 text-base leading-[1.625] text-stone-700">
            Спасибо! Мы свяжемся с вами, чтобы уточнить детали и свободные даты.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setStatus('idle')}
          className="border border-brand px-6 py-3.5 text-sm font-medium text-brand transition-colors duration-300 hover:bg-brand hover:text-white"
        >
          Отправить еще одну заявку
        </button>
      </div>
    );
  }

  const submitting = status === 'submitting';

  return (
    <form onSubmit={handleSubmit} noValidate className="grid gap-8">
      <div aria-hidden="true" className="absolute -left-[10000px] h-px w-px overflow-hidden">
        <label htmlFor="enquiry-website">Не заполняйте это поле</label>
        <input id="enquiry-website" tabIndex={-1} autoComplete="off" value={website} onChange={(event) => setWebsite(event.target.value)} />
      </div>
      <div className="grid gap-8 sm:grid-cols-2">
        <Field field="name" label="Имя" required error={errors.name}>
          <input
            id={fieldId('name')}
            type="text"
            name="name"
            required
            aria-required="true"
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={errors.name ? errorId('name') : undefined}
            autoComplete="name"
            value={values.name}
            onChange={(event) => updateField('name', event.target.value)}
            maxLength={120}
            className={INPUT_CLASS}
          />
        </Field>
        <Field field="contact" label="Телефон или Telegram" required error={errors.contact}>
          <input
            id={fieldId('contact')}
            type="text"
            name="contact"
            required
            aria-required="true"
            aria-invalid={errors.contact ? true : undefined}
            aria-describedby={errors.contact ? errorId('contact') : undefined}
            autoComplete="tel"
            value={values.contact}
            onChange={(event) => updateField('contact', event.target.value)}
            maxLength={120}
            className={INPUT_CLASS}
          />
        </Field>
      </div>

      <div className="grid gap-8 sm:grid-cols-2">
        <Field field="eventDate" label="Дата мероприятия" error={errors.eventDate}>
          <input
            id={fieldId('eventDate')}
            type="date"
            name="event_date"
            aria-invalid={errors.eventDate ? true : undefined}
            aria-describedby={errors.eventDate ? errorId('eventDate') : undefined}
            min={todayIsoDate()}
            value={values.eventDate}
            onChange={(event) => updateField('eventDate', event.target.value)}
            className={INPUT_CLASS}
          />
        </Field>

        <Field field="eventFormat" label="Формат мероприятия">
          <div className="relative">
            <select
              name="event_format"
              value={values.eventFormat}
              onChange={(event) => updateField('eventFormat', event.target.value as EventFormat)}
              className={`${INPUT_CLASS} cursor-pointer appearance-none pr-8`}
            >
              {EVENT_FORMATS.map((format) => (
                <option key={format} value={format}>
                  {format}
                </option>
              ))}
            </select>
            <ChevronDown
              aria-hidden
              className="pointer-events-none absolute right-0 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-700"
              strokeWidth={1.5}
            />
          </div>
        </Field>
      </div>

      <Field field="comment" label="Комментарий" error={errors.comment}>
        <textarea
          id={fieldId('comment')}
          name="comment"
          aria-invalid={errors.comment ? true : undefined}
          aria-describedby={errors.comment ? errorId('comment') : undefined}
          rows={3}
          maxLength={1000}
          value={values.comment}
          onChange={(event) => updateField('comment', event.target.value)}
          placeholder="Расскажите о формате встречи, количестве гостей и пожеланиях к залу"
          className={`${INPUT_CLASS} resize-y`}
        />
      </Field>

      <div className="grid gap-4">
        <TurnstileField onToken={handleCaptchaToken} />
        <label className="flex items-start gap-3 text-sm leading-6 text-stone-700">
          <input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} className="mt-1 h-4 w-4 accent-brand" />
          <span>Я даю согласие на обработку персональных данных в соответствии с <a href="/privacy" target="_blank" rel="noreferrer" className="underline underline-offset-2">Политикой обработки персональных данных</a>.</span>
        </label>
      </div>

      {status === 'error' && (
        <p role="alert" className="text-sm text-red-800">
          Не удалось отправить заявку. Проверьте соединение и попробуйте еще раз.
        </p>
      )}

      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-xs text-sm leading-[1.6] text-stone-600">
          Поля, отмеченные звёздочкой, обязательны. Для отправки заявки подтвердите согласие и пройдите проверку.
        </p>
        <button
          type="submit"
          disabled={submitting || !consent || !captchaToken}
          className="group inline-flex min-w-[240px] items-center justify-between gap-6 bg-brand px-6 py-4 text-sm font-medium text-white transition-colors duration-300 hover:bg-ink-900 disabled:cursor-wait disabled:opacity-70"
        >
          {submitting ? 'Отправляем...' : 'Отправить заявку'}
          <ArrowRight
            className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
            strokeWidth={1.5}
          />
        </button>
      </div>
    </form>
  );
}

type FieldProps = {
  field: keyof FormValues;
  label: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
};

function Field({ field, label, required = false, error, children }: FieldProps) {
  return (
    <div className="grid gap-1">
      <label className="grid gap-1">
        <span className="eyebrow text-stone-700">
          {label}
          {required && <span className="text-red-800"> *</span>}
        </span>
        {children}
      </label>
      {error && (
        <span id={errorId(field)} role="alert" className="text-sm text-red-800">
          {error}
        </span>
      )}
    </div>
  );
}
