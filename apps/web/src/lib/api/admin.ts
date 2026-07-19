'use client';

import type {
  Category,
  CategoryInput,
  CategoryPatch,
  Product,
  ProductImage,
  ProductInput,
  ProductPatch,
  ProductStatus,
} from '@nogoolin/validation-schemas';
import { apiFetch, apiUpload, getAccessToken } from './client';

// Typed calls onto the Week-1 catalog endpoints (backend/api controllers
// are the source of truth for these shapes).

export interface AdminCategory extends Category {
  product_count: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

// ── categories ─────────────────────────────────────────────────

export async function fetchAdminCategories(): Promise<AdminCategory[]> {
  const res = await apiFetch<{ data: AdminCategory[] }>('/admin/categories', {
    auth: true,
  });
  return res.data;
}

export async function createCategory(input: CategoryInput): Promise<Category> {
  const res = await apiFetch<{ data: Category }>('/admin/categories', {
    method: 'POST',
    body: input,
    auth: true,
  });
  return res.data;
}

export async function updateCategory(
  id: string,
  patch: CategoryPatch,
): Promise<Category> {
  const res = await apiFetch<{ data: Category }>(`/admin/categories/${id}`, {
    method: 'PATCH',
    body: patch,
    auth: true,
  });
  return res.data;
}

export async function deleteCategory(id: string): Promise<void> {
  await apiFetch<void>(`/admin/categories/${id}`, { method: 'DELETE', auth: true });
}

/** persist a drag-reorder: PATCH each category whose sort_order changed */
export async function persistCategoryOrder(
  rows: Array<{ id: string; sort_order: number }>,
  previous: Map<string, number>,
): Promise<void> {
  const changed = rows.filter((r) => previous.get(r.id) !== r.sort_order);
  await Promise.all(
    changed.map((r) => updateCategory(r.id, { sort_order: r.sort_order })),
  );
}

// ── products ───────────────────────────────────────────────────

export interface AdminProductQuery {
  page?: number;
  status?: ProductStatus | '';
  category_id?: string;
  search?: string;
}

export async function fetchAdminProducts(
  query: AdminProductQuery,
): Promise<{ data: Product[]; meta: PaginationMeta }> {
  const params = new URLSearchParams();
  if (query.page && query.page > 1) params.set('page', String(query.page));
  if (query.status) params.set('status', query.status);
  if (query.category_id) params.set('category_id', query.category_id);
  if (query.search?.trim()) params.set('search', query.search.trim());
  const qs = params.toString();
  return apiFetch<{ data: Product[]; meta: PaginationMeta }>(
    `/admin/products${qs ? `?${qs}` : ''}`,
    { auth: true },
  );
}

export async function createProduct(input: ProductInput): Promise<Product> {
  const res = await apiFetch<{ data: Product }>('/admin/products', {
    method: 'POST',
    body: input,
    auth: true,
  });
  return res.data;
}

export async function updateProduct(id: string, patch: ProductPatch): Promise<Product> {
  const res = await apiFetch<{ data: Product }>(`/admin/products/${id}`, {
    method: 'PATCH',
    body: patch,
    auth: true,
  });
  return res.data;
}

export async function deleteProduct(id: string, hard: boolean): Promise<void> {
  await apiFetch<void>(`/admin/products/${id}${hard ? '?hard=true' : ''}`, {
    method: 'DELETE',
    auth: true,
  });
}

// ── images ─────────────────────────────────────────────────────

export interface UploadImagesResult {
  data: ProductImage[];
  rejected: Array<{ filename: string; reason: string }>;
}

export async function uploadProductImages(
  productId: string,
  files: Array<{ file: File; altText?: string }>,
  onProgress: (fraction: number) => void,
): Promise<UploadImagesResult> {
  const token = await getAccessToken();
  const formData = new FormData();
  // field order matters: the API matches alt_texts[i] to files[i]
  for (const { file } of files) formData.append('files', file);
  for (const { file, altText } of files) formData.append('alt_texts', altText ?? file.name);
  return apiUpload<UploadImagesResult>(
    `/admin/products/${productId}/images`,
    formData,
    token,
    onProgress,
  );
}
