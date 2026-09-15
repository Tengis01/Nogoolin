'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import type { Inquiry } from '@nogoolin/validation-schemas';
import { ApiError } from '@/lib/api/client';
import { fetchMyInquiries } from '@/lib/api/inquiry';
import { formatDateTime, formatInquiryNumber } from '@/lib/inquiry-display';
import { InquiryStatusBadge } from './inquiry-status-badge';

// The signed-in customer's own inquiry history — GET /inquiries/mine.
// Guest inquiries (customer_id NULL) never appear here, by design.

export function InquiryHistory() {
  const [inquiries, setInquiries] = useState<Inquiry[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    setInquiries(null);
    try {
      setInquiries(await fetchMyInquiries());
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Сервертэй холбогдож чадсангүй');
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (error) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-[18px] border border-[var(--saff-deep)] bg-[color-mix(in_srgb,var(--saff-deep)_6%,white)] py-12">
        <p className="text-sm font-semibold text-[var(--saff-deep)]">⚠ {error}</p>
        <button
          type="button"
          onClick={() => void load()}
          className="rounded-full border border-[var(--hair)] bg-white px-5 py-2 text-xs font-semibold text-[var(--ink)] transition-colors hover:border-[var(--act)]"
        >
          Дахин оролдох
        </button>
      </div>
    );
  }

  if (inquiries === null) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-[18px] border border-[var(--hair)] py-16">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--hair)] border-t-[var(--act)]" />
        <p className="text-sm text-[var(--muted)]">Ачаалж байна…</p>
      </div>
    );
  }

  if (inquiries.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-[18px] border border-[var(--hair)] py-16 text-center">
        <svg viewBox="0 0 100 100" fill="none" width={56} height={56} className="text-[var(--saff-deep)] opacity-40">
          <circle cx="50" cy="50" r="46" stroke="currentColor" strokeOpacity=".45" strokeWidth="1.6" />
          <circle cx="50" cy="50" r="34" stroke="currentColor" strokeOpacity=".9" strokeWidth="2.4" strokeDasharray="2.5 5" />
          <circle cx="50" cy="50" r="21" stroke="currentColor" strokeOpacity=".3" strokeWidth="1.2" />
        </svg>
        <p className="text-sm text-[var(--muted)]">Та одоогоор хүсэлт илгээгээгүй байна.</p>
        <Link
          href="/products"
          className="rounded-full bg-[var(--act)] px-6 py-2.5 text-sm font-semibold text-[var(--act-text)] transition-colors hover:bg-[var(--act-hover)]"
        >
          Каталог үзэх
        </Link>
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {inquiries.map((inq) => (
        <li
          key={inq.id}
          className="rounded-[18px] border border-[var(--hair)] bg-[var(--paper)] p-5"
        >
          <div className="mb-2 flex flex-wrap items-center gap-3">
            <span className="font-mono text-[12.5px] tracking-wider text-[var(--saff-deep)]">
              {formatInquiryNumber(inq.id, inq.created_at)}
            </span>
            <InquiryStatusBadge status={inq.status} />
            <span className="ml-auto text-xs text-[var(--muted)]">
              {formatDateTime(inq.created_at)}
            </span>
          </div>

          {inq.product ? (
            <Link
              href={`/products/${inq.product.slug}`}
              className="text-[15px] text-[var(--ink)] transition-colors hover:text-[var(--act)]"
            >
              {inq.product.name}
            </Link>
          ) : (
            <p className="text-[15px] text-[var(--muted)]">Ерөнхий хүсэлт</p>
          )}

          {inq.message && (
            <p className="mt-2 whitespace-pre-wrap text-sm leading-[1.75] text-[var(--muted)]">
              {inq.message}
            </p>
          )}
        </li>
      ))}
    </ul>
  );
}
