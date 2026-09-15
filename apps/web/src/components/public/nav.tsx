import Link from 'next/link';
import { NavAccountLinks } from './nav-account';

// WF-LIST-01 / WF-GLB-01: on subpages the nav is solid white, sticky, with
// a hairline below. (The transparent hero nav exists only on `/` — Phase 3.)
export function PublicNav({ active }: { active?: 'products' }) {
  return (
    <nav className="sticky top-0 z-40 border-b border-[var(--hair)] bg-[var(--paper)]">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between px-[5vw] py-3.5">
        <Link href="/" className="flex items-center gap-2 text-sm tracking-[0.14em] text-[var(--ink)]">
          <HaloMark />
          НОГООЛИН
        </Link>
        <div className="flex items-center gap-6 text-sm">
          <Link
            href="/products"
            className={
              active === 'products'
                ? 'text-[var(--act)] underline underline-offset-4'
                : 'text-[var(--muted)] transition-colors hover:text-[var(--act)]'
            }
          >
            Бүтээгдэхүүн
          </Link>
          <NavAccountLinks />
        </div>
      </div>
    </nav>
  );
}

// WF-GLB-03: identical footer on all public pages
export function PublicFooter() {
  return (
    <footer className="border-t border-[var(--hair)] bg-[var(--paper)]">
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-3 px-[5vw] py-6 text-xs text-[var(--muted)]">
        <span className="flex items-center gap-2 text-[var(--ink)]">
          <HaloMark />
          НОГООЛИН
        </span>
        <Link href="/products" className="hover:text-[var(--act)]">
          Бүтээгдэхүүн
        </Link>
        <span>© 2026 Ногоолин</span>
      </div>
    </footer>
  );
}

function HaloMark() {
  return (
    <svg viewBox="0 0 100 100" fill="none" width={22} height={22} className="text-[var(--saff-deep)]">
      <circle cx="50" cy="50" r="46" stroke="currentColor" strokeOpacity=".45" strokeWidth="1.6" />
      <circle cx="50" cy="50" r="34" stroke="currentColor" strokeOpacity=".9" strokeWidth="2.4" strokeDasharray="2.5 5" />
      <circle cx="50" cy="50" r="21" stroke="currentColor" strokeOpacity=".3" strokeWidth="1.2" />
    </svg>
  );
}
