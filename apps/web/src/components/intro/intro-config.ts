// ══════════════════════════════════════════════════════════════════
// LOCKED intro/hero parameters — agent-context/design.md + docs/07
// (WF-INTRO-02/03, WF-HERO-01/02, WF-MO-01…03). Values are exact; do
// not "tune by eye". Any change here is a design-lock change.
// ══════════════════════════════════════════════════════════════════

// ── DEITY MODEL SWAP POINT (Task 5) ────────────────────────────────
// The ONLY line that changes when the real Green Tara GLB arrives:
// set to its public URL (e.g. Supabase Storage `model-assets` bucket).
// null → the procedural placeholder from WF-INTRO-03 renders instead
// (icosahedron + wireframe hint; the hint disappears automatically for
// GLB mode, per spec "removed when GLB arrives").
export const DEITY_GLB_URL: string | null = null;

// ── GLB REQUIREMENTS (for the 3D artist producing the asset) ──────
// • File: single .glb, Draco-compressed via
//   `gltf-pipeline -i in.glb -o out.glb --draco.compressionLevel 10`
//   FINAL SIZE ≤ 5MB (NFR-PERF-005 hard limit; FR-3D-009).
// • Up axis: +Y (glTF standard). Forward: model faces +Z — the camera
//   arrives at azimuth 0 looking down −Z toward the origin, so the
//   deity must look "at" +Z to face the viewer head-on.
// • Scale: real-world meters. Expected bounding box ≈ 1.6w × 2.2h × 1.2d
//   units, standing height ~2.2 (docs/07 §3.1.4 "mount at this
//   position/height (~2.2 units)").
// • Origin: bottom-center of the figure at (0,0,0) in the file; the
//   scene lifts it onto the pedestal (DEITY_POSITION below). The model
//   itself must be centered on x=0/z=0 — placement is scene-side only.
// • No animations, no cameras, no lights inside the GLB.
// • Materials: PBR metallic-roughness; textures ≤2048px, prefer KTX2.
// • After swap: re-tune composition per deferred decision D-04
//   (VIEW_OFFSET_FRACTION + DEITY_SCALE are the tuning knobs).
export const DEITY_POSITION: [number, number, number] = [0, 1.5, 0];
export const DEITY_SCALE = 1;

// ── Camera arc (WF-INTRO-02) — single 5s arc, orbit/spiral prohibited
export const ARC = {
  azimuthFrom: 0.85, // rad (~49°, upper-right)
  azimuthTo: 0,      // front-center
  radiusFrom: 16,
  radiusTo: 6.2,
  heightFrom: 7.5,
  heightTo: 2.2,
  durationMs: 5000,
} as const;

// Camera aim — fixed for the entire lifetime (WF-MO-03)
export const LOOK_AT: [number, number, number] = [0, 1.4, 0];

// ── Morph (WF-HERO-01): dolly ALONG THE AXIS only — no angular change
export const MORPH = {
  durationMs: 1100,
  radiusDelta: -0.9,  // 6.2 → 5.3
  heightDelta: -0.35, // 2.2 → 1.85
  heroVhDesktop: 35,
  heroVhMobile: 42,   // ≤700px
} as const;

// ── Asymmetric projection (WF-HERO-02 ⚠ CRITICAL) ─────────────────
// Deity right-placement is done EXCLUSIVELY via camera.setViewOffset —
// lateral camera translation is PROHIBITED (documented v4 bug:
// ~10–20° apparent rotation + halo parallax). Negative offsetX pushes
// the subject toward the right of the frame.
export const VIEW_OFFSET_FRACTION = { desktop: 0.18, mobile: 0.1 } as const;
export const MOBILE_BREAKPOINT = 700; // px

// ── Timings ────────────────────────────────────────────────────────
export const LOADING_MS = 900;       // WF-INTRO-01 loading phase
export const TITLE_FADE_DELAYS = [0.1, 0.32, 0.58] as const; // s (WF-INTRO-04)
export const TITLE_FADE_OUT_MS = 500; // WF-HERO-05

// ── Scene palette (dark-zone tokens; radial gradient, NEVER flat) ──
export const SCENE = {
  bg0: '#245842',        // gradient center (bright spot)
  bg1: '#1B4634',        // gradient edge = clearColor = fog
  fogNear: 9,
  fogFar: 27,
  deityColor: '#D9AB3F',
  deityEmissive: '#2A2008',
  wireframeColor: '#F2C94C',
  haloColor: '#F2C94C',
  pedestalColor: '#173F30',
  groundColor: '#143528',
  particleColor: '#F2C94C',
  ambientColor: '#2A5643',
  keyLightColor: '#FFE9B0',
  rimLightColor: '#3FC98A',
} as const;

// smootherstep — the ONLY easing used for camera + morph (WF-MO-03)
export function smootherstep(t: number): number {
  const x = Math.min(1, Math.max(0, t));
  return x * x * x * (x * (6 * x - 15) + 10);
}

export const INTRO_SEEN_KEY = 'nogoolin-intro-seen'; // sessionStorage (WF-INTRO-08)

// Intro state machine (WF-INTRO-01):
// loading → playing → ready → morph → home; skip/reduced-motion/
// no-WebGL/returning-visitor jump straight to home.
export type IntroPhase = 'loading' | 'playing' | 'ready' | 'morph' | 'home';

/** mutable per-frame channel between the orchestrator and the camera rig */
export interface IntroTimeline {
  phase: IntroPhase;
  /** performance.now() when the current phase began */
  phaseStart: number;
  /** breathing/particles disabled under prefers-reduced-motion */
  motionEnabled: boolean;
  /** live camera readout for the debug overlay (written by the rig) */
  debug: { az: number; radius: number; y: number; offsetE: number };
}
