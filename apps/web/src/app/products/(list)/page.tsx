import type { Metadata } from 'next';
import Link from 'next/link';
import {
  fetchActiveCategories,
  fetchPublishedProducts,
  siteUrl,
} from '@/lib/api/public';
import { PublicFooter, PublicNav } from '@/components/public/nav';
import { CategoryChips } from '@/components/public/category-chips';
import { SearchBox } from '@/components/public/search-box';
import { ProductCard } from '@/components/public/product-card';
import { Pagination } from '@/components/public/pagination';

// Listing — /products (WF-LIST-01…07, UC-G-002/003). Server-rendered
// (NFR-SEO-007); filters/search live in the URL query (shareable). The API
// returns PUBLISHED products only — no status handling client-side.

export const metadata: Metadata = {
  title: 'Бүтээгдэхүүн — Ногоолин',
  description:
    'Сүсэг бишрэлийн бүтээгдэхүүний цахим лавлах — ангиллаар шүүж, кирилл, латин, англиар хайх.',
  alternates: { canonical: `${siteUrl()}/products` },
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string; page?: string }>;
}) {
  const { category, q, page } = await searchParams;
  const pageNum = Math.max(1, Number(page) || 1);

  const [categories, result] = await Promise.all([
    fetchActiveCategories(),
    fetchPublishedProducts({
      page: pageNum,
      category_slug: category,
      search: q,
    }),
  ]);

  const baseParams = new URLSearchParams();
  if (category) baseParams.set('category', category);
  if (q) baseParams.set('q', q);

  return (
    <>
      <PublicNav active="products" />
      <main className="mx-auto min-h-screen max-w-[1200px] px-[5vw] py-8">
        <p className="mb-1 text-xs font-semibold uppercase tracking-[0.28em] text-[var(--saff-deep)]">
          Каталог
        </p>
        <div className="mb-5 flex flex-wrap items-end justify-between gap-2">
          <h1 className="text-[clamp(28px,3.4vw,40px)] text-[var(--ink)]">Бүтээгдэхүүн</h1>
          {/* WF-LIST-07 — updates with every filter change */}
          <p className="text-[13px] text-[var(--muted)]">
            {result.meta.total} бүтээгдэхүүн олдлоо
          </p>
        </div>

        <div className="mb-7 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="min-w-0 flex-1">
            <CategoryChips categories={categories} />
          </div>
          <SearchBox />
        </div>

        {result.data.length === 0 ? (
          // WF-LIST-06 — exact empty-state copy + reset button
          <div className="flex flex-col items-center gap-4 py-20 text-center">
            <svg viewBox="0 0 100 100" fill="none" width={90} height={90} className="text-[var(--saff-deep)] opacity-50">
              <circle cx="50" cy="50" r="46" stroke="currentColor" strokeOpacity=".45" strokeWidth="1.6" />
              <circle cx="50" cy="50" r="34" stroke="currentColor" strokeOpacity=".9" strokeWidth="2.4" strokeDasharray="2.5 5" />
              <circle cx="50" cy="50" r="21" stroke="currentColor" strokeOpacity=".3" strokeWidth="1.2" />
            </svg>
            <p className="text-sm text-[var(--muted)]">
              Илэрц олдсонгүй. Хайлтаа өөрчлөх эсвэл өөр ангилал сонгоно уу.
            </p>
            <Link
              href="/products"
              className="rounded-full border border-[var(--hair)] px-6 py-2.5 text-sm font-semibold text-[var(--ink)] transition-colors hover:border-[var(--act)]"
            >
              Шүүлтүүр арилгах
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(235px,1fr))] gap-5 max-[480px]:grid-cols-2">
            {result.data.map((product, i) => (
              <ProductCard key={product.id} product={product} priority={i < 4} />
            ))}
          </div>
        )}

        <Pagination
          page={result.meta.page}
          totalPages={result.meta.total_pages}
          baseParams={baseParams}
        />
      </main>
      <PublicFooter />
    </>
  );
}
