// Public catalog fetchers (FR-MOB-005: same REST API as web; FR-MOB-009:
// plain fetch). Types come from the shared package — TYPE-ONLY imports so
// Metro never has to bundle the Zod runtime.
import type { Category, Product } from '@nogoolin/validation-schemas';

const API_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:3001/api/v1';

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

export async function fetchProducts(query: {
  page?: number;
  category_slug?: string;
  search?: string;
}): Promise<{ data: Product[]; meta: PaginationMeta }> {
  const params = new URLSearchParams();
  if (query.page && query.page > 1) params.set('page', String(query.page));
  if (query.category_slug) params.set('category_slug', query.category_slug);
  if (query.search?.trim()) params.set('search', query.search.trim());
  const qs = params.toString();
  const res = await fetch(`${API_URL}/products${qs ? `?${qs}` : ''}`);
  if (!res.ok) throw new Error(`products fetch failed: ${res.status}`);
  return (await res.json()) as { data: Product[]; meta: PaginationMeta };
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  const res = await fetch(`${API_URL}/products/${encodeURIComponent(slug)}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`product fetch failed: ${res.status}`);
  const body = (await res.json()) as { data: Product };
  return body.data;
}

export async function fetchCategories(): Promise<Category[]> {
  const res = await fetch(`${API_URL}/categories`);
  if (!res.ok) throw new Error(`categories fetch failed: ${res.status}`);
  const body = (await res.json()) as { data: Category[] };
  return body.data;
}

export function formatPrice(price: number): string {
  return `${price.toLocaleString('en-US')}₮`;
}
