# Design Reference — v4 (locked)

> Condensed from `docs/07-uiux-wireframes.md` (v1.0.0, Approved). That doc has
> **highest precedence** on any conflict (07 > 02-requirements > prototypes).
> All values are exact — no "approximate" values, no hardcoded hex outside tokens.

## Palette v4 — "Dark intro + white catalog"

**Dark (intro/hero) zone:**

| Token | Value | Usage |
|---|---|---|
| `--n-bg0` | `#245842` | radial gradient center (bright spot) |
| `--n-bg1` | `#1B4634` | gradient edge; Three.js clearColor + fog |
| `--n-text` | `#F5F2E6` | headings/primary text on dark |
| `--n-muted` | `#A9C7B4` | secondary text, nav links |
| `--saff` | `#F2C94C` | saffron — eyebrow, halo, hairlines, "ЛИН" highlight |
| `--n-line` | `rgba(242,201,76,.32)` | hairlines (dark zone) |

**White (catalog) zone:**

| Token | Value | Usage |
|---|---|---|
| `--paper` | `#FFFFFF` | main background |
| `--paper-alt` | `#F6F8F5` | alternate sections (info strip) |
| `--ink` | `#17352A` | headings/text — **never pure black #000** |
| `--muted` | `#6B7D72` | secondary text |
| `--act` | `#0BB555` | THE single action color (CTA, links, hover, tags) |
| `--act-text` | `#042F1C` | text on `--act` backgrounds |
| `--act-hover` | `#12C963` | primary button hover |
| `--saff-deep` | `#A9861B` | saffron on white (prices, eyebrows — #F2C94C vanishes on light) |
| `--hair` | `rgba(20,56,42,.12)` | hairlines (white zone) |

**Palette rules:** saffron only on text/hairlines/badges/halo, never large fills ·
no yellow buttons · **NO RED in v4** (deep-red revisit = Phase 3, D-02) · dark
backgrounds always radial gradient `radial-gradient(ellipse at 50% 30%, --n-bg0 0%, --n-bg1 78%)`,
flat dark fills prohibited (read as pitch black) · judge colors on full-screen
renders, never swatches.

## Typography

Display: **Cormorant Garamond** 500/600/700 · Body: **Manrope** 400–700 (both
Cyrillic, Google Fonts). Intro title `clamp(44px,8vw,84px)` ls .14em; h2
`clamp(26px,3.2vw,38px)`; eyebrow 12px/600/ls .28em UPPERCASE; body 14–15px
lh 1.65–1.85; card price 20px serif / detail 30px.

## Motion Principles v2 (locked) — the filter for ALL animation decisions

- **WF-MO-01 — The deity does not move.** No rotation/oscillation/bobbing ever.
  Sole exception: detail-page 360° viewer where the USER drags (no auto-rotate).
- **WF-MO-02 — The atmosphere breathes.** Only: particle drift, light-intensity
  oscillation, halo-opacity oscillation. Nothing else stays animated.
- **WF-MO-03 — Camera moves only with purpose.** Exactly two cases: intro
  arrival arc + "Эхлэх" morph. Easing always smootherstep `t³(t(6t−15)+10)`.

**Intro camera arc (5.0 s, single arc, orbit/spiral prohibited):**
azimuth 0.85 rad → 0 · radius 16 → 6.2 · height 7.5 → 2.2 · lookAt (0, 1.4, 0)
fixed. After the arc the camera stops entirely.

**Morph (Эхлэх → shrinking hero, 1.1 s):** one persistent canvas, never
recreated. 100vh → **35vh** desktop / **42vh** ≤700px. Dolly only (radius −0.9,
height −0.35, zero angular change).

## ⚠ CRITICAL — the v4 camera bug (WF-HERO-02)

**Lateral camera translate is PROHIBITED.** Shifting camera x tilts the sight
line ~18–21° and halo parallax makes the deity appear to rotate (documented v4
prototype bug — do not copy the prototype). Correct solution: camera stays on
the deity's axis; right-side framing via asymmetric projection:

```js
const OFF = window.innerWidth <= 700 ? 0.10 : 0.18;
camera.setViewOffset(w, h, -OFF * w * e, 0, w, h); // negative → deity right
```

Never call `clearViewOffset`; re-apply with fresh w,h on resize; instant-home
paths (skip / reduced-motion / returning visitor) apply with e=1.

## Intro special paths (WF-INTRO-05…09)

Skip button visible from first frame (≤1 s, FR-3D-005) · reduced-motion → home
instantly · no WebGL → static hero (gradient + halo SVG) · returning visitor
(sessionStorage) → home directly · scroll locked until `home` state.

## Component conventions

- **Category row NEVER wraps (WF-HOME-01, critical):** one row at any count
  (6/8/10 undecided, D-01). `flex nowrap` + `overflow-x:auto` (hidden scrollbar)
  + 24px right-edge fade on overflow. Prototype's wrapping auto-fit grid is a bug.
- Same single-row rule for listing filter chips (WF-LIST-02).
- **Halo ring** signature SVG (3 concentric circles): logo, empty states, photo
  placeholder, success states. `currentColor`: `--saff` dark / `--saff-deep` white.
- Buttons pill (radius 999px, 14px 34px); cards radius 18px (categories 16),
  hairline border; card hover: border `--act` + translateY(-4px) + soft shadow;
  transitions `.3s ease`.
- Product cards: image 4/3.4, category tag pill, 2-line-clamped name, serif
  price `--saff-deep` (`12,300,000₮` format), "360°" badge top-right if 3D.
- Grid: max 1200px, padding 5vw; breakpoints 880px (nav→burger), 700px (hero mobile).
- Nav: transparent overlay on `/` hero; solid white sticky on all other pages.
- Pagination 12/page; filters/search reflected in URL query (shareable).
- Inquiry form validation messages are EXACT UI strings (07 §3.6.2); phone
  `^\d{8}$`; success shows `INQ-YYYY-NNNN` number.
- `prefers-reduced-motion`: all entrance animations, hover transforms, smooth
  scroll disabled.

## Known prototype bugs (spec prevails — do not copy)

1. Category cards wrap in `nogoolin-prototype-a-v4.html` → single-row rule wins.
2. Deity "rotates" ~10–20° during morph (lateral translate + parallax) →
   setViewOffset solution wins.
