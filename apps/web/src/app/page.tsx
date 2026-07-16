import Link from 'next/link';

// Placeholder home — the 3D intro + shrinking hero + catalog arrive in
// Phases 2–3 (WF-INTRO/WF-HERO/WF-HOME). Phase 1 only needs auth to work.
export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-[1200px] flex-col items-center justify-center gap-6 px-[5vw]">
      <h1 className="text-4xl tracking-[0.14em] text-[var(--ink)]">НОГООЛИН</h1>
      <p className="text-sm text-[var(--muted)]">
        Сүсэг бишрэлийн бүтээгдэхүүний цахим лавлах — Phase 1 scaffold
      </p>
      <div className="flex gap-4">
        <Link
          href="/login"
          className="rounded-full bg-[var(--act)] px-8 py-3 text-sm font-semibold text-[var(--act-text)] transition-colors hover:bg-[var(--act-hover)]"
        >
          Нэвтрэх
        </Link>
        <Link
          href="/signup"
          className="rounded-full border border-[var(--hair)] px-8 py-3 text-sm font-semibold text-[var(--ink)] transition-colors hover:border-[var(--act)]"
        >
          Бүртгүүлэх
        </Link>
      </div>
    </main>
  );
}
