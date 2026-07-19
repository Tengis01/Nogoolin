import Link from 'next/link';
import { PublicFooter, PublicNav } from '@/components/public/nav';

// UC-G-004 Alternative Flow — no published product with this slug
// (covers drafts, archived, and plain wrong URLs alike).
export default function ProductNotFound() {
  return (
    <>
      <PublicNav active="products" />
      <main className="mx-auto flex min-h-[60vh] max-w-[1200px] flex-col items-center justify-center gap-4 px-[5vw] text-center">
        <svg viewBox="0 0 100 100" fill="none" width={90} height={90} className="text-[var(--saff-deep)] opacity-50">
          <circle cx="50" cy="50" r="46" stroke="currentColor" strokeOpacity=".45" strokeWidth="1.6" />
          <circle cx="50" cy="50" r="34" stroke="currentColor" strokeOpacity=".9" strokeWidth="2.4" strokeDasharray="2.5 5" />
          <circle cx="50" cy="50" r="21" stroke="currentColor" strokeOpacity=".3" strokeWidth="1.2" />
        </svg>
        <h1 className="text-2xl text-[var(--ink)]">Бүтээгдэхүүн олдсонгүй</h1>
        <p className="text-sm text-[var(--muted)]">
          Энэ бүтээгдэхүүн байхгүй эсвэл нийтлэгдээгүй байна.
        </p>
        <Link
          href="/products"
          className="rounded-full bg-[var(--act)] px-8 py-3 text-sm font-semibold text-[var(--act-text)] transition-colors hover:bg-[var(--act-hover)]"
        >
          Каталог руу буцах
        </Link>
      </main>
      <PublicFooter />
    </>
  );
}
