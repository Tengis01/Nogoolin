'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import {
  ARC,
  INTRO_SEEN_KEY,
  LOADING_MS,
  MOBILE_BREAKPOINT,
  MORPH,
  TITLE_FADE_DELAYS,
  TITLE_FADE_OUT_MS,
  smootherstep,
  type IntroPhase,
  type IntroTimeline,
} from './intro-config';
import { HeroCopy, StaticHero } from './static-hero';

// Three.js bundle loads lazily — it must never block first paint or the
// skip button (WF-INTRO-05: skip visible + working from the first frame).
const IntroScene = dynamic(
  () => import('./intro-scene').then((m) => m.IntroScene),
  { ssr: false },
);

function webglAvailable(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(
      canvas.getContext('webgl2') ?? canvas.getContext('webgl'),
    );
  } catch {
    return false;
  }
}

function heroTargetVh(): number {
  return window.innerWidth <= MOBILE_BREAKPOINT
    ? MORPH.heroVhMobile
    : MORPH.heroVhDesktop;
}

// ════════════════════════════════════════════════════════════════
// Orchestrator for WF-INTRO-01 (state machine) + WF-HERO-01 (morph).
// One <IntroScene> canvas mounts once and persists across every phase —
// only the CONTAINER height animates (JS-driven with the same
// smootherstep as the camera dolly, so canvas resize and camera motion
// share one easing and there is no jump/pop).
// ════════════════════════════════════════════════════════════════
export function HeroIntro() {
  const [phase, setPhase] = useState<IntroPhase | 'boot'>('boot');
  const [webgl, setWebgl] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<IntroTimeline>({
    phase: 'loading',
    phaseStart: 0,
    motionEnabled: true,
    debug: { az: ARC.azimuthFrom, radius: ARC.radiusFrom, y: ARC.heightFrom, offsetE: 0 },
  });
  const morphRaf = useRef(0);
  const [debugOn, setDebugOn] = useState(false);

  const goTo = useCallback((next: IntroPhase) => {
    timelineRef.current.phase = next;
    timelineRef.current.phaseStart = performance.now();
    setPhase(next);
  }, []);

  // ── boot: decide the entry path (client-only checks) ──────────
  useEffect(() => {
    setDebugOn(new URLSearchParams(window.location.search).get('debug') === 'camera');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const seen = sessionStorage.getItem(INTRO_SEEN_KEY) === '1';
    const gl = webglAvailable();
    setWebgl(gl);
    timelineRef.current.motionEnabled = gl && !reducedMotion;

    if (!gl || reducedMotion || seen) {
      // WF-INTRO-06/07/08 — straight to home, offset applied at e=1
      goTo('home');
    } else {
      goTo('loading');
    }
  }, [goTo]);

  // ── phase timers: loading → playing → ready ───────────────────
  useEffect(() => {
    if (phase === 'loading') {
      const t = setTimeout(() => goTo('playing'), LOADING_MS);
      return () => clearTimeout(t);
    }
    if (phase === 'playing') {
      const t = setTimeout(() => goTo('ready'), ARC.durationMs);
      return () => clearTimeout(t);
    }
    if (phase === 'morph') {
      // JS-driven height 100vh→target with the SAME smootherstep as the
      // camera dolly (both compute e from the shared phaseStart)
      const target = heroTargetVh();
      const start = timelineRef.current.phaseStart;
      const step = () => {
        const e = smootherstep((performance.now() - start) / MORPH.durationMs);
        if (containerRef.current) {
          containerRef.current.style.height = `${100 + (target - 100) * e}vh`;
        }
        if (e < 1) {
          morphRaf.current = requestAnimationFrame(step);
        } else {
          goTo('home');
        }
      };
      morphRaf.current = requestAnimationFrame(step);
      return () => cancelAnimationFrame(morphRaf.current);
    }
    return undefined;
  }, [phase, goTo]);

  // ── WF-INTRO-09: scroll locked until home ─────────────────────
  useEffect(() => {
    const locked = phase !== 'home' && phase !== 'boot';
    document.body.style.overflow = locked ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [phase]);

  // Container height is owned IMPERATIVELY here and in the morph driver —
  // never via the React style prop. (A style-prop height gets re-applied on
  // every re-render; at the morph→home commit that wiped the driver's
  // inline height for one paint → a 1-frame 0-height flash. Caught by e2e.)
  useEffect(() => {
    if (!containerRef.current) return;
    if (phase === 'loading' || phase === 'playing' || phase === 'ready') {
      containerRef.current.style.height = '100vh';
    }
    // 'morph' → the rAF driver animates; 'home' → the effect below pins it
  }, [phase]);

  // home: pin the container height (also for resize between vh targets)
  useEffect(() => {
    if (phase !== 'home') return;
    sessionStorage.setItem(INTRO_SEEN_KEY, '1');
    const apply = () => {
      if (containerRef.current) {
        containerRef.current.style.height = `${heroTargetVh()}vh`;
      }
    };
    apply();
    window.addEventListener('resize', apply);
    return () => window.removeEventListener('resize', apply);
  }, [phase]);

  // WF-INTRO-05: skip → shrunk home instantly, no morph
  const skip = useCallback(() => goTo('home'), [goTo]);

  // WF-HERO-06: replay without a page reload
  const replay = useCallback(() => {
    if (containerRef.current) containerRef.current.style.height = '100vh';
    window.scrollTo({ top: 0 });
    goTo('playing');
  }, [goTo]);

  if (phase === 'boot') {
    // pre-hydration shell: full-height gradient, no flash
    return <div className="h-screen w-full" style={gradientStyle} />;
  }

  if (!webgl) {
    return <StaticHero heightVh={heroTargetVh()} />;
  }

  const inIntro = phase === 'loading' || phase === 'playing' || phase === 'ready';

  return (
    <div
      ref={containerRef}
      className="relative h-screen w-full overflow-hidden"
      style={gradientStyle}
    >
      {/* the ONE persistent canvas — never remounted across phases */}
      <IntroScene timeline={timelineRef.current} />

      {/* skip — rendered from the first frame, plain DOM button above the
          canvas, never blocked by 3D loading (WF-INTRO-05) */}
      {inIntro && (
        <button
          type="button"
          onClick={skip}
          className="absolute right-[5vw] top-5 z-20 rounded-full border border-[var(--n-line)] px-5 py-2 text-sm text-[var(--n-muted)] transition-colors hover:text-[var(--saff)]"
        >
          Алгасах →
        </button>
      )}

      {/* brand mark during intro */}
      {inIntro && (
        <p className="absolute left-[5vw] top-5 z-10 text-sm tracking-[0.14em] text-[var(--n-text)]">
          ◎ НОГООЛИН
        </p>
      )}

      {/* loading overlay (900ms) */}
      {phase === 'loading' && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--n-line)] border-t-[var(--saff)]" />
          <p className="text-xs tracking-[0.28em] text-[var(--n-muted)]">АЧААЛЖ БАЙНА</p>
        </div>
      )}

      {/* title block over a bottom scrim (ready; fades out during morph) */}
      {(phase === 'ready' || phase === 'morph') && (
        <div
          className="absolute inset-x-0 bottom-0 z-10 flex flex-col items-center gap-4 pb-14 pt-28 text-center transition-opacity"
          style={{
            background: 'linear-gradient(to top, rgba(20,48,37,.85), transparent)',
            opacity: phase === 'morph' ? 0 : 1,
            transitionDuration: `${TITLE_FADE_OUT_MS}ms`,
          }}
        >
          <p
            className="animate-[fadeUp_.6s_both] text-xs font-semibold uppercase tracking-[0.28em] text-[var(--saff)]"
            style={{ animationDelay: `${TITLE_FADE_DELAYS[0]}s` }}
          >
            Сүсэг бишрэлийн бүтээгдэхүүний цахим лавлах
          </p>
          <h1
            className="animate-[fadeUp_.6s_both] text-[clamp(44px,8vw,84px)] leading-none tracking-[0.14em] text-[var(--n-text)]"
            style={{ animationDelay: `${TITLE_FADE_DELAYS[1]}s` }}
          >
            НОГОО<span className="text-[var(--saff)]">ЛИН</span>
          </h1>
          <button
            type="button"
            onClick={() => goTo('morph')}
            className="animate-[fadeUp_.6s_both] rounded-full bg-[var(--act)] px-9 py-3.5 text-sm font-semibold text-[var(--act-text)] transition-colors hover:bg-[var(--act-hover)]"
            style={{ animationDelay: `${TITLE_FADE_DELAYS[2]}s` }}
          >
            Эхлэх
          </button>
        </div>
      )}

      {/* home state: nav overlay + left hero copy (WF-HERO-03/04) */}
      {phase === 'home' && (
        <>
          <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-[5vw] py-4">
            <p className="text-sm tracking-[0.14em] text-[var(--n-text)]">◎ НОГООЛИН</p>
            <div className="flex gap-6 text-sm text-[var(--n-muted)]">
              <a href="/products" className="transition-colors hover:text-[var(--saff)]">
                Бүтээгдэхүүн
              </a>
              <button
                type="button"
                onClick={replay}
                className="transition-colors hover:text-[var(--saff)]"
              >
                Интро дахин үзэх
              </button>
            </div>
          </div>
          <HeroCopy />
        </>
      )}

      {debugOn && <CameraDebugOverlay timeline={timelineRef.current} />}
    </div>
  );
}

const gradientStyle: React.CSSProperties = {
  // WF-DS-03 rule 4: dark zones are ALWAYS this radial gradient — flat
  // fills are prohibited (read as pitch black). The canvas clears with
  // alpha so this gradient is the scene background.
  background: 'radial-gradient(ellipse at 50% 30%, #245842 0%, #1B4634 78%)',
};

// ── Task 2 verification overlay (?debug=camera) ──────────────────
// Live az/radius/y/offset readout at ~10Hz + spec targets, so the arc
// can be checked against WF-INTRO-02 numbers while it plays.
function CameraDebugOverlay({ timeline }: { timeline: IntroTimeline }) {
  const [, force] = useState(0);
  useEffect(() => {
    const id = setInterval(() => force((n) => n + 1), 100);
    return () => clearInterval(id);
  }, []);
  const d = timeline.debug;
  return (
    <div className="absolute bottom-3 left-3 z-30 rounded-lg bg-black/70 p-3 font-mono text-[11px] leading-relaxed text-[#7CFC9A]">
      <div>phase&nbsp;&nbsp;: {timeline.phase}</div>
      <div>az&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: {d.az.toFixed(4)} rad (spec 0.8500 → 0.0000)</div>
      <div>radius&nbsp;: {d.radius.toFixed(3)} (spec 16.000 → 6.200; morph → 5.300)</div>
      <div>y&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: {d.y.toFixed(3)} (spec 7.500 → 2.200; morph → 1.850)</div>
      <div>offsetE: {d.offsetE.toFixed(3)} (setViewOffset ramp 0 → 1)</div>
      <div>x-drift: {(d.radius * Math.sin(d.az)).toFixed(3)} (must reach 0 — arc only, never lateral)</div>
    </div>
  );
}
