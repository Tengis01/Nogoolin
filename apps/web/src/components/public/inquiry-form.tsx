'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Inquiry } from '@nogoolin/validation-schemas';
import { ApiError } from '@/lib/api/client';
import { submitInquiry } from '@/lib/api/inquiry';
import { fieldErrors, inquiryFormSchema, type InquiryFormValues } from '@/lib/inquiry-form-schema';
import { formatInquiryNumber } from '@/lib/inquiry-display';

// WF-INQ-01…04 — the inquiry form and its success state.
// No account required (FR-INQ-001): a guest submits exactly like a signed-in
// customer. When signed in, the name is pre-filled and the API links
// customer_id from the forwarded token.

type Errors = Partial<Record<keyof InquiryFormValues, string>>;

export function InquiryForm({
  productId,
  initialName = '',
}: {
  productId: string;
  /** full_name from the signed-in profile; empty for guests */
  initialName?: string;
}) {
  const [values, setValues] = useState({
    customer_name: initialName,
    phone: '',
    message: '',
  });
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState<Inquiry | null>(null);

  function update(field: keyof typeof values, value: string) {
    setValues((v) => ({ ...v, [field]: value }));
    // clear this field's error as soon as the user edits it
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    // WF-INQ-01: all fields validate together on submit
    const parsed = inquiryFormSchema.safeParse({ ...values, product_id: productId });
    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error));
      return;
    }
    setErrors({});
    setSubmitting(true);
    try {
      const inquiry = await submitInquiry(parsed.data);
      setSent(inquiry);
    } catch (err) {
      if (err instanceof ApiError && err.code === 'RATE_LIMIT_EXCEEDED') {
        // FR-INQ-007 — 3 submissions per IP per hour
        setFormError('Хэт олон хүсэлт илгээсэн байна. 1 цагийн дараа дахин оролдоно уу.');
      } else if (err instanceof ApiError) {
        setFormError(err.message);
      } else {
        setFormError('Сүлжээний алдаа — хүсэлт илгээгдсэнгүй. Дахин оролдоно уу.');
      }
    } finally {
      setSubmitting(false);
    }
  }

  // WF-INQ-04 — success replaces the whole form
  if (sent) {
    return <InquirySuccess inquiry={sent} phone={values.phone} />;
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {formError && (
        <p
          role="alert"
          className="mb-4 rounded-[14px] border border-[var(--warn)] bg-[color-mix(in_srgb,var(--warn)_8%,white)] px-4 py-3 text-[13px] font-semibold text-[var(--warn)]"
        >
          {formError}
        </p>
      )}

      <Field
        label="Таны нэр"
        required
        value={values.customer_name}
        onChange={(v) => update('customer_name', v)}
        error={errors.customer_name}
        autoComplete="name"
      />
      <Field
        label="Утасны дугаар"
        required
        value={values.phone}
        onChange={(v) => update('phone', v)}
        error={errors.phone}
        inputMode="numeric"
        autoComplete="tel"
        placeholder="99112233"
      />
      <Field
        label="Хүсэлтийн агуулга"
        required
        value={values.message}
        onChange={(v) => update('message', v)}
        error={errors.message}
        multiline
      />

      <p className="mb-5 text-xs leading-relaxed text-[var(--muted)]">
        Бүртгэл шаардлагагүй. Таны мэдээллийг зөвхөн энэ хүсэлтэд хариу өгөх зорилгоор
        ашиглана.
      </p>

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center gap-2 rounded-full bg-[var(--act)] px-8 py-3 text-sm font-semibold text-[var(--act-text)] transition-colors hover:bg-[var(--act-hover)] disabled:opacity-60"
        >
          {submitting && (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--act-text)]/30 border-t-[var(--act-text)]" />
          )}
          {submitting ? 'Илгээж байна…' : 'Хүсэлт илгээх'}
        </button>
        <button
          type="button"
          onClick={() => window.history.back()}
          className="rounded-full border border-[var(--hair)] px-8 py-3 text-sm font-semibold text-[var(--ink)] transition-colors hover:border-[var(--act)]"
        >
          Буцах
        </button>
      </div>
    </form>
  );
}

// WF-INQ-01: white input, hairline border, radius 14px, focus --act.
// Invalid: --warn border + 12.5px message below.
function Field({
  label,
  value,
  onChange,
  error,
  required,
  multiline,
  ...rest
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  required?: boolean;
  multiline?: boolean;
  placeholder?: string;
  inputMode?: 'numeric';
  autoComplete?: string;
}) {
  const id = `inq-${label}`;
  const base = `w-full rounded-[14px] border bg-white px-4 py-2.5 text-sm text-[var(--ink)] outline-none transition-colors ${
    error
      ? 'border-[var(--warn)] focus:border-[var(--warn)]'
      : 'border-[var(--hair)] focus:border-[var(--act)]'
  }`;

  return (
    <div className="mb-4">
      <label htmlFor={id} className="mb-1.5 block text-[13px] font-medium text-[var(--ink)]">
        {label}
        {required && <span className="ml-0.5 text-[var(--act)]">*</span>}
      </label>
      {multiline ? (
        <textarea
          id={id}
          rows={5}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-err` : undefined}
          className={`${base} resize-y`}
        />
      ) : (
        <input
          id={id}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-err` : undefined}
          className={base}
          {...rest}
        />
      )}
      {error && (
        <p id={`${id}-err`} className="mt-1 text-[12.5px] text-[var(--warn)]">
          {error}
        </p>
      )}
    </div>
  );
}

// WF-INQ-04 — centered, max-width 34em, 74px check circle with a 0.5s pop.
function InquirySuccess({ inquiry, phone }: { inquiry: Inquiry; phone: string }) {
  return (
    <div className="mx-auto flex max-w-[34em] flex-col items-center text-center">
      <div className="animate-[pop_0.5s_ease-out] flex h-[74px] w-[74px] items-center justify-center rounded-full border-2 border-[var(--act)]">
        <svg viewBox="0 0 24 24" width={34} height={34} fill="none" stroke="var(--act)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="m5 13 4.2 4.2L19 7.5" />
        </svg>
      </div>
      <h2 className="mt-5 font-serif text-[28px] text-[var(--ink)]">Хүсэлт илгээгдлээ</h2>
      <span className="mt-3 rounded-full border border-[var(--hair)] bg-[var(--paper-alt)] px-4 py-1 font-mono text-[13px] tracking-wider text-[var(--saff-deep)]">
        {formatInquiryNumber(inquiry.id, inquiry.created_at)}
      </span>
      <p className="mt-4 text-[15px] leading-[1.75] text-[var(--muted)]">
        Таны хүсэлтийг хүлээн авлаа. Манай ажилтан {phone} дугаараар ажлын 1 өдрийн дотор
        эргэн холбогдоно.
      </p>
      <Link
        href="/products"
        className="mt-6 rounded-full bg-[var(--act)] px-8 py-3 text-sm font-semibold text-[var(--act-text)] transition-colors hover:bg-[var(--act-hover)]"
      >
        Каталог руу буцах
      </Link>
    </div>
  );
}
