'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import type { Product, ProductStatus } from '@nogoolin/validation-schemas';
import {
  deleteProduct,
  fetchAdminCategories,
  fetchAdminProducts,
  updateProduct,
  type AdminCategory,
  type PaginationMeta,
} from '@/lib/api/admin';
import { ApiError } from '@/lib/api/client';
import { EmptyState, ErrorState, InlineError, LoadingState } from './async-state';
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

// Wired to GET /admin/products (server-side filters + pagination),
// PATCH/DELETE /admin/products/{id}. Category names come from the joined
// `category` field the API returns on every product.
export function ProductTable() {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [mutationError, setMutationError] = useState<string | null>(null);

  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<'' | ProductStatus>('');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [confirm, setConfirm] = useState<Confirm | null>(null);

  // 300ms debounce on the search input (WF-LIST-03 convention)
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  // reset to page 1 whenever a filter changes
  useEffect(() => {
    setPage(1);
  }, [categoryFilter, statusFilter, debouncedSearch]);

  const load = useCallback(async () => {
    setLoadError(null);
    setProducts(null);
    try {
      const res = await fetchAdminProducts({
        page,
        status: statusFilter,
        category_id: categoryFilter || undefined,
        search: debouncedSearch,
      });
      setProducts(res.data);
      setMeta(res.meta);
    } catch (err) {
      setLoadError(err instanceof ApiError ? err.message : 'Сервертэй холбогдож чадсангүй');
    }
  }, [page, statusFilter, categoryFilter, debouncedSearch]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    fetchAdminCategories()
      .then(setCategories)
      .catch(() => setCategories([])); // filter dropdown degrades gracefully
  }, []);

  async function setStatus(product: Product, status: ProductStatus) {
    setMutationError(null);
    try {
      await updateProduct(product.id, { status });
      await load();
    } catch (err) {
      setMutationError(err instanceof ApiError ? err.message : 'Хадгалж чадсангүй');
    }
  }

  async function handleDelete(product: Product, hard: boolean) {
    setConfirm(null);
    setMutationError(null);
    try {
      await deleteProduct(product.id, hard);
      await load();
    } catch (err) {
      setMutationError(err instanceof ApiError ? err.message : 'Устгаж чадсангүй');
    }
  }

  return (
    <div>
      <InlineError message={mutationError} />

      {/* filters — applied server-side via query params */}
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <select
          className={selectClass}
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          aria-label="Ангиллаар шүүх"
        >
          <option value="">Бүх ангилал</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <select
          className={selectClass}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as '' | ProductStatus)}
          aria-label="Төлвөөр шүүх"
        >
          <option value="">Бүх төлөв</option>
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

      {loadError ? (
        <ErrorState message={loadError} onRetry={() => void load()} />
      ) : products === null ? (
        <LoadingState />
      ) : products.length === 0 ? (
        <EmptyState message="Илэрц олдсонгүй. Шүүлтүүрээ өөрчилнө үү." />
      ) : (
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
              {products.map((p) => (
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
                    {p.category?.name ?? '—'}
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
                      <ActionButton title="Засах (дараагийн алхамд)">Засах</ActionButton>
                      {p.status === 'published' ? (
                        <ActionButton
                          title="Ноорог болгох"
                          onClick={() => void setStatus(p, 'draft')}
                        >
                          Буулгах
                        </ActionButton>
                      ) : (
                        <ActionButton
                          title="Нийтлэх"
                          onClick={() => void setStatus(p, 'published')}
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

      {/* FR-ADM-008 — confirm before destructive actions */}
      {confirm?.kind === 'archive' && (
        <ConfirmDialog
          title="Бүтээгдэхүүн архивлах"
          body={`«${confirm.product.name}»-г архивлах уу? Нийтийн каталогоос нуугдана (дараа нь сэргээж болно).`}
          confirmLabel="Архивлах"
          onConfirm={() => void handleDelete(confirm.product, false)}
          onCancel={() => setConfirm(null)}
        />
      )}
      {confirm?.kind === 'delete' && (
        <ConfirmDialog
          title="Бүрмөсөн устгах"
          body={`«${confirm.product.name}»-г БҮРМӨСӨН устгах уу? Зурагнууд хамт устана, буцаах боломжгүй.`}
          confirmLabel="Бүрмөсөн устгах"
          onConfirm={() => void handleDelete(confirm.product, true)}
          onCancel={() => setConfirm(null)}
        />
      )}
    </div>
  );
}
