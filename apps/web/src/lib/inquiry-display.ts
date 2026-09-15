import type { InquiryStatus } from '@nogoolin/validation-schemas';

// Display helpers for inquiries — shared by the public success state, the
// customer's history, and the admin inbox.

/**
 * Human-quotable reference shown in the WF-INQ-04 success pill and the
 * inquiry lists, formatted `INQ-YYYY-XXXX`.
 *
 * DERIVED, display-only (owner decision 2026-07-26): the wireframe specifies
 * a sequential `INQ-YYYY-NNNN`, but no such column exists — the API returns a
 * uuid. Rather than add a migration, the reference is composed from the year
 * of `created_at` plus the first 4 hex characters of the uuid. It is stable
 * and unique enough to quote on a support call, but it is NOT sequential.
 * If a true sequence is ever needed, add an `inquiry_number` column and
 * replace this function — nothing else changes.
 */
export function formatInquiryNumber(id: string, createdAt?: string): string {
  const year = createdAt ? new Date(createdAt).getFullYear() : new Date().getFullYear();
  const suffix = id.replace(/-/g, '').slice(0, 4).toUpperCase();
  return `INQ-${year}-${suffix}`;
}

export const INQUIRY_STATUS_LABELS: Record<InquiryStatus, string> = {
  new: 'Шинэ',
  contacted: 'Холбогдсон',
  closed: 'Хаагдсан',
};

// No red anywhere (design lock v4): `new` uses the action green, `contacted`
// saffron-deep, `closed` a neutral hairline grey.
export const INQUIRY_STATUS_STYLES: Record<InquiryStatus, string> = {
  new: 'border-[var(--act)] bg-[color-mix(in_srgb,var(--act)_12%,white)] text-[var(--act-text)]',
  contacted:
    'border-[var(--saff-deep)] bg-[color-mix(in_srgb,var(--saff-deep)_12%,white)] text-[var(--saff-deep)]',
  closed: 'border-[var(--hair)] bg-[var(--paper-alt)] text-[var(--muted)]',
};

/** date + time — admins need to know when an inquiry arrived, not just the day */
export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
