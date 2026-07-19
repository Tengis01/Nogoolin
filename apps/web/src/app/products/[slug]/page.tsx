import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { fetchProductBySlug, siteUrl } from '@/lib/api/public';
import { PublicFooter, PublicNav } from '@/components/public/nav';
import { ProductGallery } from '@/components/public/product-gallery';
import { ProductTabs } from '@/components/public/product-tabs';
import { formatPrice } from '@/components/public/product-card';

// Detail — /products/[slug] (WF-DET-01…05, UC-G-004/005/006).
// Server-rendered with per-product SEO (NFR-SEO-001…004, 007, 008).
// Only PUBLISHED products resolve — drafts/archived 404 via the API.

interface Props {
  params: Promise<{ slug: string }>;
}

// NFR-SEO-001/002/003: unique title, description, and OG tags per product
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await fetchProductBySlug(slug);
  if (!product) return { title: 'Бүтээгдэхүүн олдсонгүй — Ногоолин' };

  const url = `${siteUrl()}/products/${product.slug}`;
  const description =
    product.short_description ?? `${product.name} — Ногоолин цахим лавлах`;

  return {
    title: `${product.name} — Ногоолин`,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: product.name,
      description,
      url,
      type: 'website',
      images: product.images?.[0]
        ? [{ url: product.images[0].image_url, alt: product.images[0].alt_text ?? product.name }]
        : undefined,
    },
  };
}

const STOCK_LABELS: Record<string, { label: string; inStock: boolean }> = {
  in_stock: { label: 'Бэлэн байгаа', inStock: true },
  pre_order: { label: 'Захиалгаар', inStock: true },
  out_of_stock: { label: 'Түр байхгүй', inStock: false },
};

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = await fetchProductBySlug(slug);
  if (!product) notFound(); // UC-G-004 Alternative Flow

  const stock = STOCK_LABELS[product.stock_status] ?? STOCK_LABELS['in_stock']!;

  // Product schema.org JSON-LD (structured data for rich results)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    alternateName: product.name_en ?? undefined,
    description: product.short_description ?? undefined,
    image: product.images?.map((img) => img.image_url),
    url: `${siteUrl()}/products/${product.slug}`,
    category: product.category?.name,
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'MNT',
      availability: stock.inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      url: `${siteUrl()}/products/${product.slug}`,
    },
  };

  return (
    <>
      <PublicNav active="products" />
      <main className="mx-auto min-h-screen max-w-[1200px] px-[5vw] py-8">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* breadcrumb per the WF-DET wireframe */}
        <nav aria-label="Breadcrumb" className="mb-6 text-[13px] text-[var(--muted)]">
          <Link href="/" className="hover:text-[var(--act)]">Нүүр</Link>
          <span className="mx-1.5">/</span>
          <Link href="/products" className="hover:text-[var(--act)]">Бүтээгдэхүүн</Link>
          {product.category && (
            <>
              <span className="mx-1.5">/</span>
              <Link
                href={`/products?category=${product.category.slug}`}
                className="hover:text-[var(--act)]"
              >
                {product.category.name}
              </Link>
            </>
          )}
          <span className="mx-1.5">/</span>
          <span className="text-[var(--ink)]">{product.name}</span>
        </nav>

        {/* 2 columns 1.1fr/1fr gap 44px; single column ≤880px, media first */}
        <div className="grid gap-11 min-[880px]:grid-cols-[1.1fr_1fr]">
          <ProductGallery images={product.images ?? []} productName={product.name} />

          <div className="flex flex-col gap-4">
            {product.category && (
              <span className="self-start rounded-full bg-[color-mix(in_srgb,var(--act)_9%,white)] px-3 py-1 text-xs font-medium text-[var(--act-text)]">
                {product.category.name}
              </span>
            )}
            <h1 className="text-[clamp(28px,3.4vw,40px)] leading-tight text-[var(--ink)]">
              {product.name}
            </h1>
            {product.name_en && (
              <p className="-mt-2 text-sm text-[var(--muted)]">{product.name_en}</p>
            )}
            <p className="font-serif text-3xl text-[var(--saff-deep)]">
              {formatPrice(product.price)}
            </p>
            <p className="flex items-center gap-2 text-sm">
              <span
                className={`inline-block h-2 w-2 rounded-full ${
                  stock.inStock ? 'bg-[var(--act)]' : 'bg-[var(--hair)]'
                }`}
              />
              <span className={stock.inStock ? 'text-[var(--ink)]' : 'text-[var(--muted)]'}>
                {stock.label}
              </span>
            </p>
            {product.short_description && (
              <p className="text-[15px] leading-[1.75] text-[var(--muted)]">
                {product.short_description}
              </p>
            )}
            <div className="mt-2 flex flex-wrap gap-3">
              {/* CTA target /products/[slug]/inquiry ships with Phase 4 */}
              <button
                type="button"
                disabled
                title="Хүсэлтийн систем Phase 4-т нээгдэнэ"
                className="cursor-not-allowed rounded-full bg-[var(--act)] px-8 py-3 text-sm font-semibold text-[var(--act-text)] opacity-50"
              >
                Хүсэлт илгээх
              </button>
              <Link
                href="/products"
                className="rounded-full border border-[var(--hair)] px-8 py-3 text-sm font-semibold text-[var(--ink)] transition-colors hover:border-[var(--act)]"
              >
                ← Каталог руу
              </Link>
            </div>
          </div>
        </div>

        <ProductTabs
          fullDescription={product.full_description}
          usageInstruction={product.usage_instruction}
        />
      </main>
      <PublicFooter />
    </>
  );
}
