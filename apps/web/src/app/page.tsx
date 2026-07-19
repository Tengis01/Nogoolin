import Link from 'next/link';
import { HeroIntro } from '@/components/intro/hero-intro';
import { PublicFooter } from '@/components/public/nav';

// `/` — 3D intro + shrinking hero (WF-INTRO/WF-HERO), white zone below.
// The full home catalog section (WF-HOME-01…04: category row, featured
// grid, info strip) lands later in Phase 3 — this section is its slot.
export default function HomePage() {
  return (
    <>
      <HeroIntro />
      <main
        id="catalog"
        className="mx-auto flex max-w-[1200px] flex-col items-center gap-6 px-[5vw] py-16 text-center"
      >
        <h2 className="text-[clamp(26px,3.2vw,38px)] text-[var(--ink)]">
          Каталог
        </h2>
        <p className="max-w-xl text-sm leading-relaxed text-[var(--muted)]">
          Ангиллаар шүүж, кирилл, латин, англиар хайж, бүтээгдэхүүн бүрийн
          дэлгэрэнгүй мэдээлэл, хэрэглэх заавартай танилцана уу.
        </p>
        <Link
          href="/products"
          className="rounded-full bg-[var(--act)] px-8 py-3 text-sm font-semibold text-[var(--act-text)] transition-colors hover:bg-[var(--act-hover)]"
        >
          Бүтээгдэхүүн үзэх
        </Link>
      </main>
      <PublicFooter />
    </>
  );
}
