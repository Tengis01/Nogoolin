'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import type { Product, ProductStatus } from '@nogoolin/validation-schemas';
import { MOCK_CATEGORIES, MOCK_PRODUCTS, categoryName } from '@/lib/admin/mock-data';
import {
  ActionButton,
  ConfirmDialog,
  HaloPlaceholder,
  StatusBadge,
  formatDate,
  formatPrice,
  inputClass,
  selectClass,
} from './ui';

type Confirm =
  | { kind: 'archive'; product: Product }
  | { kind: 'delete'; product: Product };

// NOTE: mock data + client-side filtering — wire to GET /admin/products
// (server-side filters/pagination already exist) later.
export function ProductTable() {
  const [rows, setRows] = useState<Product[]>(MOCK_PRODUCTS);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | ProductStatus>('all');
  const [search, setSearch] = useState('');
  const [confirm, setConfirm] = useState<Confirm | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((p) => {
      if (categoryFilter !== 'all' && p.category_id !== categoryFilter) return false;
      if (statusFilter !== 'all' && p.status !== statusFilter) return false;
      if (
        q &&
        !p.name.toLowerCase().includes(q) &&
        !(p.name_en ?? '').toLowerCase().includes(q)
      )
        return false;
      return true;
    });
  }, [rows, categoryFilter, statusFilter, search]);

  function setStatus(id: string, status: ProductStatus) {
    setRows((rs) =>
      rs.map((r) =>
        r.id === id ? { ...r, status, updated_at: new Date().toISOString() } : r,
      ),
    );
  }

  return (
    <div>
      {/* filters */}
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <select
          className={selectClass}
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          aria-label="Ангиллаар шүүх"
        >
          <option value="all">Бүх ангилал</option>
          {MOCK_CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <select
          className={selectClass}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as 'all' | ProductStatus)}
          aria-label="Төлвөөр шүүх"
        >
          <option value="all">Бүх төлөв</option>
          <option value="draft">Ноорог</option>
          <option value="published">Нийтэлсэн</option>
          <option value="archived">Архивласан</option>
        </select>
        <input
          className={`${inputClass} max-w-60`}
          placeholder="Хайх…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Бүтээгдэхүүн хайх"
        />
        <div className="ml-auto">
          <Link
            href="/admin/products/new"
            className="rounded-full bg-[var(--act)] px-6 py-2.5 text-sm font-semibold text-[var(--act-text)] transition-colors hover:bg-[var(--act-hover)]"
          >
            + Бүтээгдэхүүн нэмэх
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto rounded-[18px] border border-[var(--hair)] bg-[var(--paper)]">
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--hair)] text-xs uppercase tracking-wider text-[var(--muted)]">
              <th className="w-14 px-4 py-3" aria-label="Зураг" />
              <th className="px-4 py-3">Нэр</th>
              <th className="px-4 py-3">Ангилал</th>
              <th className="px-4 py-3">Үнэ</th>
              <th className="px-4 py-3">Төлөв</th>
              <th className="px-4 py-3">Шинэчилсэн</th>
              <th className="px-4 py-3 text-right">Үйлдэл</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="border-b border-[var(--hair)] last:border-0">
                <td className="px-4 py-2.5">
                  {p.images && p.images.length > 0 ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.images[0]!.image_url}
                      alt={p.images[0]!.alt_text ?? p.name}
                      className="h-10 w-10 rounded-lg border border-[var(--hair)] object-cover"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--paper-alt)]">
                      <HaloPlaceholder size={26} />
                    </div>
                  )}
                </td>
                <td className="px-4 py-2.5">
                  <span className="font-medium text-[var(--ink)]">{p.name}</span>
                  {p.is_featured && (
                    <span className="ml-2 rounded-full bg-[color-mix(in_srgb,var(--saff-deep)_14%,white)] px-2 py-0.5 text-[10px] font-semibold text-[var(--saff-deep)]">
                      Онцлох
                    </span>
                  )}
                  {p.name_en && (
                    <div className="text-xs text-[var(--muted)]">{p.name_en}</div>
                  )}
                </td>
                <td className="px-4 py-2.5 text-[var(--muted)]">
                  {categoryName(p.category_id)}
                </td>
                <td className="px-4 py-2.5 font-serif text-[var(--saff-deep)]">
                  {formatPrice(p.price)}
                </td>
                <td className="px-4 py-2.5">
                  <StatusBadge status={p.status} />
                </td>
                <td className="px-4 py-2.5 text-xs text-[var(--muted)]">
                  {formatDate(p.updated_at)}
                </td>
                <td className="px-4 py-2.5 text-right">
                  <div className="inline-flex gap-2">
                    <ActionButton title="Засах">Засах</ActionButton>
                    {p.status === 'published' ? (
                      <ActionButton
                        title="Ноорог болгох"
                        onClick={() => setStatus(p.id, 'draft')}
                      >
                        Буулгах
                      </ActionButton>
                    ) : (
                      <ActionButton
                        title="Нийтлэх"
                        onClick={() => setStatus(p.id, 'published')}
                      >
                        Нийтлэх
                      </ActionButton>
                    )}
                    {p.status !== 'archived' && (
                      <ActionButton
                        title="Архивлах"
                        onClick={() => setConfirm({ kind: 'archive', product: p })}
                      >
                        Архивлах
                      </ActionButton>
                    )}
                    <ActionButton
                      title="Бүрмөсөн устгах"
                      onClick={() => setConfirm({ kind: 'delete', product: p })}
                    >
                      Устгах
                    </ActionButton>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-sm text-[var(--muted)]">
                  <div className="mb-3 flex justify-center">
                    <HaloPlaceholder size={56} />
                  </div>
                  Илэрц олдсонгүй. Шүүлтүүрээ өөрчилнө үү.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* FR-ADM-008 — confirm before destructive actions */}
      {confirm?.kind === 'archive' && (
        <ConfirmDialog
          title="Бүтээгдэхүүн архивлах"
          body={`«${confirm.product.name}»-г архивлах уу? Нийтийн каталогоос нуугдана (дараа нь сэргээж болно).`}
          confirmLabel="Архивлах"
          onConfirm={() => {
            setStatus(confirm.product.id, 'archived');
            setConfirm(null);
          }}
          onCancel={() => setConfirm(null)}
        />
      )}
      {confirm?.kind === 'delete' && (
        <ConfirmDialog
          title="Бүрмөсөн устгах"
          body={`«${confirm.product.name}»-г БҮРМӨСӨН устгах уу? Зурагнууд хамт устана, буцаах боломжгүй.`}
          confirmLabel="Бүрмөсөн устгах"
          onConfirm={() => {
            setRows((rs) => rs.filter((r) => r.id !== confirm.product.id));
            setConfirm(null);
          }}
          onCancel={() => setConfirm(null)}
        />
      )}
    </div>
  );
}
