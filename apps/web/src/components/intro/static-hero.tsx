'use client';

// WF-INTRO-07: canvas-free fallback when WebGL is unavailable — radial
// gradient + halo SVG right + hero copy left, straight to the home state.
export function StaticHero({ heightVh }: { heightVh: number }) {
  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        height: `${heightVh}vh`,
        background: 'radial-gradient(ellipse at 50% 30%, #245842 0%, #1B4634 78%)',
      }}
    >
      <div className="absolute right-[8%] top-1/2 -translate-y-1/2">
        <svg viewBox="0 0 100 100" fill="none" width={180} height={180} className="text-[var(--saff)]">
          <circle cx="50" cy="50" r="46" stroke="currentColor" strokeOpacity=".45" strokeWidth="1.6" />
          <circle cx="50" cy="50" r="34" stroke="currentColor" strokeOpacity=".9" strokeWidth="2.4" strokeDasharray="2.5 5" />
          <circle cx="50" cy="50" r="21" stroke="currentColor" strokeOpacity=".3" strokeWidth="1.2" />
        </svg>
      </div>
      <HeroCopy />
    </div>
  );
}

// WF-HERO-03: left copy — eyebrow → h2 → CTA row; never overlaps the deity
export function HeroCopy() {
  return (
    <div className="absolute left-[5vw] top-1/2 max-w-[min(48%,560px)] -translate-y-1/2 max-[700px]:bottom-5 max-[700px]:top-auto max-[700px]:max-w-[88%] max-[700px]:translate-y-0">
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.28em] text-[var(--saff)]">
        Шашны бүтээгдэхүүний цахим лавлах
      </p>
      <h2 className="mb-4 text-[clamp(22px,3.2vw,42px)] leading-[1.12] text-[var(--n-text)] max-[700px]:text-[clamp(19px,5.5vw,26px)]">
        Сүсэг бишрэлд зориулсан сонгомол бүтээгдэхүүн
      </h2>
      <div className="flex gap-3">
        <a
          href="/products"
          className="rounded-full bg-[var(--act)] px-7 py-2.5 text-sm font-semibold text-[var(--act-text)] transition-colors hover:bg-[var(--act-hover)]"
        >
          Каталог үзэх
        </a>
        <a
          href="/products"
          className="rounded-full border border-[var(--n-line)] px-7 py-2.5 text-sm font-semibold text-[var(--n-text)] transition-colors hover:border-[var(--saff)] max-[700px]:hidden"
        >
          Ангилал
        </a>
      </div>
    </div>
  );
}
