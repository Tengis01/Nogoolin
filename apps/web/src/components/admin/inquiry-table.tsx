'use client';

import { Fragment, useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import type { Inquiry, InquiryStatus, Product } from '@nogoolin/validation-schemas';
import {
  fetchAdminInquiries,
  updateInquiryStatus,
  type AdminInquiryQuery,
} from '@/lib/api/inquiry';
import { fetchAdminProducts, type PaginationMeta } from '@/lib/api/admin';
import { ApiError } from '@/lib/api/client';
import { formatDateTime, formatInquiryNumber } from '@/lib/inquiry-display';
import { InquiryStatusBadge } from '@/components/public/inquiry-status-badge';
import { EmptyState, ErrorState, InlineError, LoadingState } from './async-state';
import { ActionButton, inputClass, selectClass } from './ui';

// Admin inquiry inbox — FR-ADM-006, FR-INQ-004/005/006.
// Same shape as CategoryTable/ProductTable (Phase 2): server-side filters +
// pagination, shared loading/error/empty states, inline mutation errors.
// Wired to GET /admin/inquiries and PATCH /admin/inquiries/{id}/status.

// FR-INQ-005 lifecycle: new → contacted → closed. The action offered is the
// next step; `closed` is terminal but can be reopened to `contacted`.
const NEXT_STATUS: Record<InquiryStatus, { to: InquiryStatus; label: string } | null> = {
  new: { to: 'contacted', label: 'Холбогдсон' },
  contacted: { to: 'closed', label: 'Хаах' },
  closed: null,
};

export function InquiryTable() {
  const [inquiries, setInquiries] = useState<Inquiry[] | null>(null);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [mutationError, setMutationError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  const [statusFilter, setStatusFilter] = useState<'' | InquiryStatus>('');
  const [productFilter, setProductFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [page, setPage] = useState(1);

  // reset to page 1 whenever a filter changes
  useEffect(() => {
    setPage(1);
  }, [statusFilter, productFilter, dateFrom, dateTo]);

  const load = useCallback(async () => {
    setLoadError(null);
    setInquiries(null);
    const query: AdminInquiryQuery = {
      page,
      status: statusFilter,
      product_id: productFilter || undefined,
      date_from: dateFrom || undefined,
      date_to: dateTo || undefined,
    };
    try {
      const res = await fetchAdminInquiries(query);
      setInquiries(res.data);
      setMeta(res.meta);
    } catch (err) {
      setLoadError(err instanceof ApiError ? err.message : 'Сервертэй холбогдож чадсангүй');
    }
  }, [page, statusFilter, productFilter, dateFrom, dateTo]);

  useEffect(() => {
    void load();
  }, [load]);

  // product filter options — degrades to "all products" if this fails
  useEffect(() => {
    fetchAdminProducts({ page: 1 })
      .then((res) => setProducts(res.data))
      .catch(() => setProducts([]));
  }, []);

  async function setStatus(inquiry: Inquiry, status: InquiryStatus) {
    setMutationError(null);
    setBusyId(inquiry.id);
    try {
      await updateInquiryStatus(inquiry.id, status);
      await load();
    } catch (err) {
      setMutationError(err instanceof ApiError ? err.message : 'Төлөв шинэчилж чадсангүй');
    } finally {
      setBusyId(null);
    }
  }

  const filtersActive = Boolean(statusFilter || productFilter || dateFrom || dateTo);

  return (
    <div>
      <InlineError message={mutationError} />

      {/* filters — all applied server-side via query params (FR-INQ-006) */}
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <select
          className={selectClass}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as '' | InquiryStatus)}
          aria-label="Төлвөөр шүүх"
        >
          <option value="">Бүх төлөв</option>
          <option value="new">Шинэ</option>
          <option value="contacted">Холбогдсон</option>
          <option value="closed">Хаагдсан</option>
        </select>
        <select
          className={selectClass}
          value={productFilter}
          onChange={(e) => setProductFilter(e.target.value)}
          aria-label="Бүтээгдэхүүнээр шүүх"
        >
          <option value="">Бүх бүтээгдэхүүн</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <label className="flex items-center gap-2 text-xs text-[var(--muted)]">
          Эхлэх
          <input
            type="date"
            className={`${inputClass} w-auto`}
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            aria-label="Эхлэх огноо"
          />
        </label>
        <label className="flex items-center gap-2 text-xs text-[var(--muted)]">
          Дуусах
          <input
            type="date"
            className={`${inputClass} w-auto`}
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            aria-label="Дуусах огноо"
          />
        </label>
        {filtersActive && (
          <button
            type="button"
            onClick={() => {
              setStatusFilter('');
              setProductFilter('');
              setDateFrom('');
              setDateTo('');
            }}
            className="text-xs font-semibold text-[var(--muted)] underline underline-offset-4 transition-colors hover:text-[var(--act)]"
          >
            Шүүлтүүр цэвэрлэх
          </button>
        )}
      </div>

      {loadError ? (
        <ErrorState message={loadError} onRetry={() => void load()} />
      ) : inquiries === null ? (
        <LoadingState />
      ) : inquiries.length === 0 ? (
        <EmptyState
          message={
            filtersActive
              ? 'Илэрц олдсонгүй. Шүүлтүүрээ өөрчилнө үү.'
              : 'Одоогоор хүсэлт ирээгүй байна.'
          }
        />
      ) : (
        <div className="overflow-x-auto rounded-[18px] border border-[var(--hair)] bg-[var(--paper)]">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--hair)] text-xs uppercase tracking-wider text-[var(--muted)]">
                <th className="px-4 py-3">Дугаар</th>
                <th className="px-4 py-3">Бүтээгдэхүүн</th>
                <th className="px-4 py-3">Илгээгч</th>
                <th className="px-4 py-3">Утас</th>
                <th className="px-4 py-3">Төлөв</th>
                <th className="px-4 py-3">Огноо</th>
                <th className="px-4 py-3 text-right">Үйлдэл</th>
              </tr>
            </thead>
            <tbody>
              {inquiries.map((inq) => {
                const next = NEXT_STATUS[inq.status];
                const isOpen = expanded === inq.id;
                const busy = busyId === inq.id;

                return (
                  // key belongs on the Fragment — it is the array element
                  <Fragment key={inq.id}>
                    <tr className="border-b border-[var(--hair)] last:border-0">
                      <td className="px-4 py-2.5 font-mono text-xs text-[var(--saff-deep)]">
                        {formatInquiryNumber(inq.id, inq.created_at)}
                      </td>
                      <td className="px-4 py-2.5">
                        {inq.product ? (
                          <Link
                            href={`/products/${inq.product.slug}`}
                            className="text-[var(--ink)] transition-colors hover:text-[var(--act)]"
                          >
                            {inq.product.name}
                          </Link>
                        ) : (
                          <span className="text-[var(--muted)]">Ерөнхий хүсэлт</span>
                        )}
                      </td>
                      <td className="px-4 py-2.5">
                        <span className="text-[var(--ink)]">{inq.customer_name}</span>
                        {/* guest vs registered — customer_id is NULL for guests */}
                        <span className="ml-2 rounded-full border border-[var(--hair)] px-2 py-0.5 text-[10px] font-semibold text-[var(--muted)]">
                          {inq.customer_id ? 'Бүртгэлтэй' : 'Зочин'}
                        </span>
                      </td>
                      <td className="px-4 py-2.5">
                        <a
                          href={`tel:${inq.phone}`}
                          className="text-[var(--ink)] transition-colors hover:text-[var(--act)]"
                        >
                          {inq.phone}
                        </a>
                      </td>
                      <td className="px-4 py-2.5">
                        <InquiryStatusBadge status={inq.status} />
                      </td>
                      <td className="px-4 py-2.5 text-xs text-[var(--muted)]">
                        {formatDateTime(inq.created_at)}
                      </td>
                      <td className="px-4 py-2.5 text-right">
                        <div className="inline-flex gap-2">
                          <ActionButton
                            title={isOpen ? 'Хаах' : 'Дэлгэрэнгүй үзэх'}
                            onClick={() => setExpanded(isOpen ? null : inq.id)}
                          >
                            {isOpen ? 'Хураах' : 'Дэлгэрэнгүй'}
                          </ActionButton>
                          {next && (
                            <ActionButton
                              title={`Төлөв «${next.label}» болгох`}
                              onClick={() => void setStatus(inq, next.to)}
                            >
                              {busy ? '…' : next.label}
                            </ActionButton>
                          )}
                          {inq.status === 'closed' && (
                            <ActionButton
                              title="Дахин нээх"
                              onClick={() => void setStatus(inq, 'contacted')}
                            >
                              {busy ? '…' : 'Дахин нээх'}
                            </ActionButton>
                          )}
                        </div>
                      </td>
                    </tr>

                    {/* expanded detail — full message (FR-ADM-006 "view detail") */}
                    {isOpen && (
                      <tr className="border-b border-[var(--hair)] last:border-0">
                        <td colSpan={7} className="bg-[var(--paper-alt)] px-4 py-4">
                          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                            Хүсэлтийн агуулга
                          </p>
                          {inq.message ? (
                            <p className="whitespace-pre-wrap text-sm leading-[1.75] text-[var(--ink)]">
                              {inq.message}
                            </p>
                          ) : (
                            <p className="text-sm text-[var(--muted)]">Агуулга оруулаагүй.</p>
                          )}
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* pagination from server meta */}
      {meta && meta.total_pages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-3 text-sm">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="rounded-full border border-[var(--hair)] px-4 py-1.5 text-[var(--ink)] transition-colors hover:border-[var(--act)] disabled:opacity-40"
          >
            ←
          </button>
          <span className="text-[var(--muted)]">
            {meta.page} / {meta.total_pages} ({meta.total})
          </span>
          <button
            type="button"
            disabled={page >= meta.total_pages}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-full border border-[var(--hair)] px-4 py-1.5 text-[var(--ink)] transition-colors hover:border-[var(--act)] disabled:opacity-40"
          >
            →
          </button>
        </div>
      )}
    </div>
  );
}
