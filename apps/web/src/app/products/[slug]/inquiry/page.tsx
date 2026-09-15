import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { fetchProductBySlug } from '@/lib/api/public';
import { createClient } from '@/lib/supabase/server';
import { PublicFooter, PublicNav } from '@/components/public/nav';
import { InquiryForm } from '@/components/public/inquiry-form';
import { formatPrice } from '@/components/public/product-card';

// Inquiry — /products/[slug]/inquiry (WF §3.6, UC-G-007).
//
// A DEDICATED ROUTE, not an embedded section: docs/phase-0/07 §3.6 defines this page
// (own breadcrumb, eyebrow, h1 and a sticky product summary card) and
// WF-DET-04 points the detail CTA here. docs/phase-0/07 has highest precedence.
//
// Guests can submit (FR-INQ-001) — the page is NOT auth-gated. A signed-in
// visitor simply gets their name pre-filled.

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await fetchProductBySlug(slug);
  if (!product) return { title: 'Бүтээгдэхүүн олдсонгүй — Ногоолин' };
  return {
    title: `${product.name} — хүсэлт илгээх — Ногоолин`,
    description: `${product.name} бүтээгдэхүүний талаар хүсэлт илгээх.`,
    // a form page has no SEO value and must never be indexed
    robots: { index: false, follow: true },
  };
}

export default async function InquiryPage({ params }: Props) {
  const { slug } = await params;
  const product = await fetchProductBySlug(slug);
  if (!product) notFound();

  // Pre-fill for signed-in customers (guests get an empty field).
  // RLS lets a user read their own row; failure here is non-fatal.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  let initialName = '';
  if (user) {
    const { data: profile } = await supabase
      .from('users')
      .select('full_name')
      .eq('id', user.id)
      .maybeSingle();
    initialName = (profile?.full_name as string | null) ?? '';
  }

  const image = product.images?.[0];

  return (
    <>
      <PublicNav active="products" />
      <main className="mx-auto min-h-screen max-w-[1200px] px-[5vw] py-8">
        <nav aria-label="Breadcrumb" className="mb-6 text-[13px] text-[var(--muted)]">
          <Link href="/products" className="hover:text-[var(--act)]">Бүтээгдэхүүн</Link>
          <span className="mx-1.5">/</span>
          <Link href={`/products/${product.slug}`} className="hover:text-[var(--act)]">
            {product.name}
          </Link>
          <span className="mx-1.5">/</span>
          <span className="text-[var(--ink)]">Хүсэлт илгээх</span>
        </nav>

        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--saff-deep)]">
          Хүсэлт
        </p>
        <h1 className="mb-8 mt-1 text-[clamp(26px,3.2vw,38px)] leading-tight text-[var(--ink)]">
          Бүтээгдэхүүний хүсэлт илгээх
        </h1>

        {/* WF §3.6.1: 1.2fr / 0.8fr; single column ≤880px with summary on top */}
        <div className="grid gap-10 min-[880px]:grid-cols-[1.2fr_0.8fr]">
          <div className="order-2 min-[880px]:order-1">
            <InquiryForm productId={product.id} initialName={initialName} />
          </div>

          {/* WF-INQ-03 — sticky summary card */}
          <aside className="order-1 min-[880px]:order-2">
            <div className="sticky top-[100px] overflow-hidden rounded-[20px] border border-[var(--hair)] bg-[var(--paper)]">
              <div className="relative aspect-[4/3.2] bg-[var(--paper-alt)]">
                {image ? (
                  <Image
                    src={image.image_url}
                    alt={image.alt_text ?? product.name}
                    fill
                    sizes="(max-width: 880px) 100vw, 340px"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <svg viewBox="0 0 100 100" fill="none" width={64} height={64} className="text-[var(--saff-deep)] opacity-40">
                      <circle cx="50" cy="50" r="46" stroke="currentColor" strokeOpacity=".45" strokeWidth="1.6" />
                      <circle cx="50" cy="50" r="34" stroke="currentColor" strokeOpacity=".9" strokeWidth="2.4" strokeDasharray="2.5 5" />
                      <circle cx="50" cy="50" r="21" stroke="currentColor" strokeOpacity=".3" strokeWidth="1.2" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-2 p-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">
                  Сонгосон бүтээгдэхүүн
                </p>
                {product.category && (
                  <span className="self-start rounded-full bg-[color-mix(in_srgb,var(--act)_9%,white)] px-2.5 py-0.5 text-[11px] font-medium text-[var(--act-text)]">
                    {product.category.name}
                  </span>
                )}
                <p className="text-[15.5px] leading-snug text-[var(--ink)]">{product.name}</p>
                <p className="font-serif text-xl text-[var(--saff-deep)]">
                  {formatPrice(product.price)}
                </p>
              </div>
            </div>
          </aside>
        </div>
      </main>
      <PublicFooter />
    </>
  );
}
