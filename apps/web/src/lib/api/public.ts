import type { Category, Product } from '@nogoolin/validation-schemas';

// Server-side fetchers for the PUBLIC catalog endpoints (no auth — the API
// returns published data only; RLS + status filter enforce it server-side).
// Used by Server Components, generateMetadata, and sitemap.ts (NFR-SEO-007:
// listing/detail are server-rendered).

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api/v1';

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

export interface PublicProductQuery {
  page?: number;
  category_slug?: string;
  search?: string;
}

export async function fetchPublishedProducts(
  query: PublicProductQuery,
): Promise<{ data: Product[]; meta: PaginationMeta }> {
  const params = new URLSearchParams();
  if (query.page && query.page > 1) params.set('page', String(query.page));
  if (query.category_slug) params.set('category_slug', query.category_slug);
  if (query.search?.trim()) params.set('search', query.search.trim());
  const qs = params.toString();

  const res = await fetch(`${API_URL}/products${qs ? `?${qs}` : ''}`, {
    // fresh on every request — listing reflects admin publishes immediately
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`products fetch failed: ${res.status}`);
  return (await res.json()) as { data: Product[]; meta: PaginationMeta };
}

/** null when no PUBLISHED product has this slug (drafts/archived → 404) */
export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  const res = await fetch(`${API_URL}/products/${encodeURIComponent(slug)}`, {
    next: { revalidate: 60 }, // ISR-style caching for detail pages
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`product fetch failed: ${res.status}`);
  const body = (await res.json()) as { data: Product };
  return body.data;
}

export async function fetchActiveCategories(): Promise<Category[]> {
  const res = await fetch(`${API_URL}/categories`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error(`categories fetch failed: ${res.status}`);
  const body = (await res.json()) as { data: Category[] };
  return body.data;
}

export function siteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
}
