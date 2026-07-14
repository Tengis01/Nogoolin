# 07 — UI/UX Wireframes & Design Specification

| Field | Value |
|---|---|
| Document ID | 07-uiux-wireframes |
| Version | 1.0.0 |
| Date | 2026-07-05 |
| Status | Approved (Phase 0) |
| Language | EN (Mongolian version: 07-uiux-wireframes_mn.md) |
| Related documents | 01-vision, 02-requirements (FR-3D-*), 03-use-cases (UC-G-*), 06-api-spec |
| Figma | _(placeholder — add when needed)_ |
| Prototype reference | `docs/prototypes/nogoolin-prototype-a-v4.html`, `nogoolin-prototype-b.jsx` |

---

## 0. Purpose & How to Use This Document

### 0.1 Purpose

This document is the **design source of truth** for the public web surface of the Nogoolin platform. It defines the structure, colors, motion, interactions, and acceptance criteria of every screen at implementation-ready precision.

### 0.2 How Claude Code should consume it

- Every requirement has a **WF-XX-NN** ID. Tasks in `task.md` reference these IDs as subtasks. Example:
  ```markdown
  ## Task: Implement Intro
  - [ ] WF-INTRO-01 … WF-INTRO-09
  - [ ] WF-HERO-01 … WF-HERO-08
  - Acceptance: §8.1, §8.2
  ```
- On any conflict, precedence order is: **this document → 02-requirements → prototype files**. The prototypes contain 2 known deviations from this spec (§7.2) — implement per spec, do not copy the prototype behavior.
- All values (hex, px, vh, rad, sec) are implemented exactly as written. There are no "approximate" values.
- Deferred decisions listed in §6 must **not** be implemented by assumption — expose them as constants/config so the eventual decision is a one-line change.

---

## 1. Design System

### 1.1 Palette v4 (locked) — "Dark intro + white catalog"

The palette splits into two zones. The intro/hero zone is dark silk green; the catalog zone is white. Both zones share one accent system.

**Intro/hero zone tokens (WF-DS-01):**

| CSS variable | Value | Usage |
|---|---|---|
| `--n-bg0` | `#245842` | Center (bright spot) of the background radial gradient |
| `--n-bg1` | `#1B4634` | Gradient edge; Three.js clearColor + fog color |
| `--n-text` | `#F5F2E6` | Headings, primary text (on dark) |
| `--n-muted` | `#A9C7B4` | Secondary text, nav links |
| `--saff` | `#F2C94C` | Saffron yellow — eyebrow, halo, hairlines, the "ЛИН" highlight |
| `--n-line` | `rgba(242,201,76,.32)` | Hairline borders (dark zone) |

**Catalog zone tokens (WF-DS-02):**

| CSS variable | Value | Usage |
|---|---|---|
| `--paper` | `#FFFFFF` | Main background |
| `--paper-alt` | `#F6F8F5` | Alternate section background (info strip, etc.) |
| `--ink` | `#17352A` | Headings, primary text — **never use pure black (#000)** |
| `--muted` | `#6B7D72` | Secondary text |
| `--act` | `#0BB555` | Action color: CTA, links, hover borders, tags, status |
| `--act-text` | `#042F1C` | Text on `--act` backgrounds |
| `--act-hover` | `#12C963` | Primary button hover |
| `--saff-deep` | `#A9861B` | Saffron on white: prices, eyebrows (#F2C94C disappears on light backgrounds, hence deepened) |
| `--hair` | `rgba(20,56,42,.12)` | Hairline borders (white zone) |

**Palette rules (WF-DS-03):**

1. Saffron yellow appears only on **text, hairlines, badges, halo** — never as a large fill area.
2. `--act` (#0BB555) is the single action color. No yellow buttons (collides with warning semantics).
3. There is **no red** in v4. A ceremonial deep-red accent will be revisited in Phase 3 (§6).
4. Dark-zone backgrounds are always a radial gradient: `radial-gradient(ellipse at 50% 30%, var(--n-bg0) 0%, var(--n-bg1) 78%)`. Flat fills are prohibited — flat dark fills were proven to read as "pitch black."
5. Area effect: color decisions are made on full-screen renders, never on small swatches (Phase 0 lesson).

### 1.2 Typography (WF-DS-04)

| Role | Font | Weights | Notes |
|---|---|---|---|
| Display (headings, prices, logo) | Cormorant Garamond | 500/600/700 | Cyrillic support, Google Fonts |
| Body (everything else) | Manrope | 400/500/600/700 | Cyrillic support, Google Fonts |

Size scale (all with `clamp()`, viewport-dependent):

| Element | Value |
|---|---|
| Intro title (НОГООЛИН) | `clamp(44px, 8vw, 84px)`, letter-spacing .14em |
| Hero copy heading | `clamp(22px, 3.2vw, 42px)`, line-height 1.12 |
| Section heading (h2) | `clamp(26px, 3.2vw, 38px)` |
| Detail heading (h1) | `clamp(28px, 3.4vw, 40px)` |
| Eyebrow | 12px, weight 600, letter-spacing .28em, UPPERCASE |
| Body | 14–15px, line-height 1.65–1.85 |
| Price (card) | 20px display serif; (detail) 30px |

### 1.3 Signature element — Halo ring (WF-DS-05)

The brand's recurring mark: an SVG of 3 concentric circles.

```svg
<svg viewBox="0 0 100 100" fill="none">
  <circle cx="50" cy="50" r="46" stroke="currentColor" stroke-opacity=".45" stroke-width="1.6"/>
  <circle cx="50" cy="50" r="34" stroke="currentColor" stroke-opacity=".9"  stroke-width="2.4" stroke-dasharray="2.5 5"/>
  <circle cx="50" cy="50" r="21" stroke="currentColor" stroke-opacity=".3"  stroke-width="1.2"/>
</svg>
```

Usage locations: (1) logo mark, (2) 2D counterpart of the 3D intro halo torus, (3) placeholder for products without photos, (4) empty states, (5) success states. Color via `currentColor` — `--saff` in the dark zone, `--saff-deep` in the white zone.

### 1.4 Shape, shadow, hover (WF-DS-06)

| Element | Rule |
|---|---|
| Buttons | Pill (border-radius 999px), padding 14px 34px (small: 11px 26px) |
| Cards | border-radius 18px (categories: 16px), 1px hairline border |
| Card hover | Border → `--act`, `translateY(-4px)`, shadow `0 20px 44px rgba(23,53,42,.10)` |
| Primary button hover | `--act-hover` + glow `0 0 30px rgba(11,181,85,.35)` + `translateY(-1px)` |
| Input focus | Border → `--act` (white zone) |
| Transition | `all .3s ease` (cards .35s) |

### 1.5 Grid, breakpoints, accessibility (WF-DS-07)

- Max content width **1200px**, horizontal padding **5vw**.
- Breakpoints: **880px** (nav links collapse), **700px** (hero mobile mode, §3.2).
- Under `prefers-reduced-motion: reduce`: all entrance animations, hover transforms, and smooth scroll are disabled; the intro jumps to its end state per §3.1.6.
- All interactive elements are keyboard-reachable with visible focus states.

---

## 2. Motion Principles v2 (locked) (WF-MO-01…03)

The filter for all current and future animation decisions — three rules:

- **WF-MO-01. The deity does not move.** The 3D model (placeholder orb now, Green Tara GLB in Phase 3) performs no rotation, oscillation, or bobbing. The single exception: the Detail page 360° viewer — there **the user** drags to rotate (no auto-rotate).
- **WF-MO-02. The atmosphere "breathes."** The only things allowed to stay alive: particle drift, gentle light-intensity oscillation, gentle halo-opacity oscillation (formulas in §3.1.4). Nothing else.
- **WF-MO-03. The camera moves only with purpose.** Exactly two cases: (a) the intro's single arrival arc, (b) the morph triggered by clicking "Эхлэх" (Start). No idle sway, loops, or autoplay. All camera motion uses smootherstep easing: `e(t) = t³(t(6t−15)+10)`.

---

## 3. Screens — Public Web

Route map (Next.js App Router):

| Route | Screen | Section |
|---|---|---|
| `/` | Intro + Home (one page, shrinking hero) | §3.1–3.3 |
| `/products` | Listing | §3.4 |
| `/products/[slug]` | Detail | §3.5 |
| `/products/[slug]/inquiry` | Inquiry | §3.6 |
| `/categories` | Category index | §3.7 |
| `/about` | About | §3.8 |

### 3.1 Intro — 3D opening screen (UC-G-001, FR-3D-001…009)

#### 3.1.1 State machine (WF-INTRO-01)

```
loading → playing → ready → morph → home
   │         │        │
   └─skip────┴─skip───┘──────────────► home (instant)
reduced-motion / WebGL fallback ─────► home (instant)
```

- `loading`: 900ms placeholder (replaced by real GLB loading in Phase 3). Spinner + "АЧААЛЖ БАЙНА" (LOADING) centered.
- `playing`: camera arrival arc (§3.1.3), 5.0 s.
- `ready`: camera stopped; title block fades up (§3.1.5).
- `morph`: the shrink after clicking "Эхлэх" (Start) (§3.2).
- `home`: shrunk hero + catalog.

#### 3.1.2 ASCII wireframe — fullscreen state (`ready`)

```
┌──────────────────────────────────────────────────────┐
│ ◎ НОГООЛИН                              [Алгасах →]  │ 100vh
│                                                      │
│                      ╭─────╮                         │
│                     ( halo  )    ← 3D scene:         │
│                      │ ● │       deity centered,     │
│                      ╰──┬──╯     pedestal, particles │
│                     ▁▁▁▁▁▁▁▁                         │
│                                                      │
│        СҮСЭГ БИШРЭЛИЙН БҮТЭЭГДЭХҮҮНИЙ ЦАХИМ ЛАВЛАХ   │ ← eyebrow --saff
│                    НОГООЛИН                          │ ← ЛИН = --saff
│                   [ Эхлэх ]                          │ ← btn --act
│ Prototype note (small, bottom-left)                  │
└──────────────────────────────────────────────────────┘
```

#### 3.1.3 Camera arrival arc (WF-INTRO-02)

A single gentle arc — from upper-right to front-center. Orbit/spiral rotation is **prohibited**.

| Parameter | Start | End |
|---|---|---|
| Azimuth (rad) | 0.85 (~49°, upper-right) | 0 (front-center) |
| Radius | 16 | 6.2 |
| Height (y) | 7.5 | 2.2 |
| lookAt | (0, 1.4, 0) fixed | same |
| Duration | 5.0 s, smootherstep | — |

```js
const az = 0.85 * (1 - e);
camera.position.set(r*Math.sin(az), y, r*Math.cos(az));
camera.lookAt(0, 1.4, 0);
```

Once the arc completes, the camera **stops entirely** (WF-MO-03).

#### 3.1.4 Scene composition (WF-INTRO-03)

| Object | Spec |
|---|---|
| Deity (placeholder) | Icosahedron r=1.12 detail=2, MeshStandardMaterial `color #D9AB3F, metalness .85, roughness .3, emissive #2A2008`, position y=1.5. **Phase 3:** mount the Green Tara GLB at this position/height (~2.2 units); remove the wireframe hint |
| Wireframe hint | Icosahedron r=1.24 detail=1, `#F2C94C` wireframe, opacity .12 — signals "placeholder" (removed when GLB arrives) |
| Halo torus | Torus R=2.15, tube .014, `#F2C94C`, position (0, 1.5, −0.55) |
| Pedestal | Cylinder 1.45/1.85/0.35, `#173F30`, roughness .92 |
| Ground | Circle r=30, `#143528` |
| Fog | `Fog(#1B4634, near 9, far 27)`; clearColor `#1B4634` |
| Particles | 360 points, size .035, `#F2C94C`, AdditiveBlending, opacity .6; within a cylinder volume r 1.5–7, y 0–6 |
| Ambient light | `#2A5643`, 0.8 |
| Key light | Point `#FFE9B0`, 1.25, position (6, 7, 5) — same side as the camera's start direction |
| Rim light | Point `#3FC98A`, 0.9, position (−5.5, 3, −4.5) |

Atmosphere breathing formulas (run in all phases, WF-MO-02):

```js
key.intensity        = 1.15 + 0.18*Math.sin(t*0.7);
rim.intensity        = 0.85 + 0.12*Math.sin(t*0.5 + 1.6);
halo.material.opacity = 0.78 + 0.07*Math.sin(t*0.9);
// particles: y += 0.0035/frame, wrap to 0 when y > 6
```

Renderer: `antialias: true`, `pixelRatio = min(devicePixelRatio, 2)`.

#### 3.1.5 Title block (`ready` state) (WF-INTRO-04)

At the bottom, over a bottom-up fading scrim gradient (`rgba(20,48,37,.85) → transparent`):
eyebrow "Сүсэг бишрэлийн бүтээгдэхүүний цахим лавлах" (Digital catalog of devotional goods) → title "НОГООЛИН" ("ЛИН" in `--saff`) → [Эхлэх] (Start) button. All three fade-up with delays 0.1s / 0.32s / 0.58s.

#### 3.1.6 Special paths (WF-INTRO-05…09)

- **WF-INTRO-05 (Skip):** The "Алгасах →" (Skip) button is visible from the first frame (FR-3D-005), active during `loading` and `playing`. Clicking it goes straight to the `home` state (shrunk hero + copy + catalog) without the morph.
- **WF-INTRO-06 (Reduced motion):** Under `prefers-reduced-motion: reduce` the intro does not play; go straight to `home`.
- **WF-INTRO-07 (WebGL fallback, FR-3D-006):** If WebGL cannot be created, render a canvas-free static hero: radial gradient background + halo SVG on the right + hero copy on the left, straight to `home`.
- **WF-INTRO-08 (Returning visitor):** If the intro was already seen in this session, subsequent loads of `/` start directly in the `home` state (sessionStorage flag; UC-G-001 Alt Flow B).
- **WF-INTRO-09 (Scroll lock):** The page cannot scroll before the `home` state (`body.lock { height:100vh; overflow:hidden }`).

### 3.2 Shrinking hero — morph (locked pattern) (WF-HERO-01…08)

Core idea: clicking "Эхлэх" (Start) does **not** swap screens. The fullscreen scene itself shrinks into a hero panel, the deity shifts to the right, copy appears on the left, and the white catalog is revealed below. The canvas is never recreated — one Three.js scene lives for the whole page lifetime.

#### 3.2.1 ASCII wireframe — shrunk state (`home`)

```
┌──────────────────────────────────────────────────────┐
│ ◎ НОГООЛИН        Нүүр Бүтээгдэхүүн Ангилал Бидний…  │ ~35vh
│                                                      │ (dark
│  ШАШНЫ БҮТЭЭГДЭХҮҮНИЙ ЦАХИМ ЛАВЛАХ        ╭────╮     │  green
│  Сүсэг бишрэлд зориулсан                 ( halo )    │  scene)
│  сонгомол бүтээгдэхүүн                    │ ●  │     │
│  [Каталог үзэх] [Ангилал]                 ╰─┬──╯     │ ← deity DEAD-ON
│                                          ▁▁▁▁▁▁      │   frontal
├──────────────────────────────────────────────────────┤
│                  WHITE CATALOG (§3.3)                │
└──────────────────────────────────────────────────────┘
```

#### 3.2.2 Morph parameters (WF-HERO-01)

| Parameter | Value |
|---|---|
| Duration | 1.1 s, smootherstep |
| Hero height | 100vh → **35vh** (desktop), 100vh → **42vh** (≤700px) |
| Dolly (straight approach) | radius −0.9, height −0.35 (along the axis, no angular change) |
| Renderer | Resize + aspect update on every morph frame to the container's new size |

#### 3.2.3 Deity's right-side placement — asymmetric projection (WF-HERO-02) ⚠ CRITICAL

**Prohibited:** Translating the camera laterally. Reason: shifting the camera along x tilts the sight line to the deity by `atan(shift/r) ≈ 18–21°`, and parallax between the deity and the halo behind it makes the deity appear to "rotate." This bug was observed in the v4 prototype (§7.2).

**Correct solution:** The camera stays on the deity's axis (x=0, lookAt(0,1.4,0) unchanged). The framing shift is done with `PerspectiveCamera.setViewOffset()` — the projection window shifts, so the deity remains viewed **perfectly head-on** while sitting on the right side of the frame. Zero angular change, zero parallax.

```js
// e = morph easing (0→1); w,h = hero's current px size
const OFF = window.innerWidth <= 700 ? 0.10 : 0.18; // fraction of frame width
camera.setViewOffset(w, h, -OFF * w * e, 0, w, h);
```

- **Negative** offsetX → the deity shifts toward the right of the frame.
- After the morph the value is kept (never call `clearViewOffset`); re-apply with fresh w,h on every window resize.
- On the instant-home paths (skip / reduced-motion / returning visitor), apply directly with e=1.

#### 3.2.4 Hero copy (left-side text) (WF-HERO-03)

- Position: left 5vw, vertically centered; `max-width: min(48%, 560px)` — never overlaps the deity.
- Content: eyebrow "Шашны бүтээгдэхүүний цахим лавлах" (`--saff`) → h2 "Сүсэг бишрэлд зориулсан сонгомол бүтээгдэхүүн" (Curated goods for devotion) (`--n-text`) → [Каталог үзэх] (View catalog; primary, smooth-scrolls to `#catalog`) + [Ангилал] (Categories; ghost-dark).
- Entrance: as the morph completes, opacity 0→1 + translateY, 0.7s, delay 0.15s.
- Mobile (≤700px): sits at the bottom (bottom 20px), `max-width 88%`, h2 `clamp(19px, 5.5vw, 26px)`, the ghost button may be hidden.

#### 3.2.5 Nav overlay (WF-HERO-04)

In the `home` state a transparent nav fades in over the top of the hero: logo mark left (halo + НОГООЛИН), links right (Нүүр · Бүтээгдэхүүн · Ангилал · Бидний тухай / Home · Products · Categories · About), color `--n-muted`, hover/active `--saff`. At ≤880px the links collapse into a burger menu (white dropdown panel). The nav is absolute within the hero — not sticky (sticky nav for catalog pages is decided in Phase 2).

#### 3.2.6 Other (WF-HERO-05…08)

- **WF-HERO-05:** During the morph, the intro title block fades out over 0.5s.
- **WF-HERO-06:** "Интро дахин үзэх" (Replay intro; footer) — without a page reload: scroll to top, hero to 100vh, viewOffset reset, `playing` phase restarts.
- **WF-HERO-07:** The hero's atmosphere breathing continues in the `home` state (particles, lights, halo) — deity and camera remain still.
- **WF-HERO-08:** When the real GLB arrives in Phase 3, re-check and re-tune the composition inside the 35vh strip (deity height/placement, OFF fraction) (§6).

### 3.3 Home — white catalog section (`/`, below the hero)

Section order: **Categories → Featured products → Info strip → Footer**.

#### 3.3.1 ASCII wireframe

```
├────────────────── (over shrunk hero) ─────────────────┤
│  Ангилал                              Бүгдийг харах → │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐  ← ONE    │
│  │Хүж │ │Эрх │ │Зул │ │Хадаг│ │Бурхан│ │Ном│   ROW    │
│  └────┘ └────┘ └────┘ └────┘ └────┘ └────┘   (§3.3.2)│
│                                                       │
│  Онцлох бүтээгдэхүүн                    Каталог руу → │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐                  │
│  │ photo│ │ photo│ │ photo│ │ photo│                  │
│  │ tag  │ │      │ │      │ │      │                  │
│  │ name │ │      │ │      │ │      │                  │
│  │ ₮    │ │      │ │      │ │      │                  │
│  └──────┘ └──────┘ └──────┘ └──────┘                  │
├───────────────────────────────────────────────────────┤
│  ▒ Info strip (--paper-alt): guide │ quality │ inquiry▒│
├───────────────────────────────────────────────────────┤
│  ◎ НОГООЛИН      Бүтээгдэхүүн · Холбоо барих ·        │
│                  Интро дахин үзэх          © 2026     │
└───────────────────────────────────────────────────────┘
```

#### 3.3.2 Category row — THE SINGLE-ROW RULE (WF-HOME-01) ⚠ CRITICAL

- Category cards sit in **one row at any count**. Wrapping is **prohibited** (the v4 prototype's `auto-fit` grid wraps — that is a bug, §7.2).
- The final category count is undecided — it may be 6, 8, or 10 (§6). The layout must work for any of them.
- Implementation:
  ```css
  .cats { display:flex; flex-wrap:nowrap; gap:14px;
          overflow-x:auto; scrollbar-width:none; }
  .cats::-webkit-scrollbar { display:none; }
  .cat  { flex:1 0 auto; min-width:150px; }
  ```
  - When they fit: cards stretch equally to fill the container (at 1200px, 6 cards ≈ 185px each — they fit).
  - When they don't fit (8–10 cards, or narrow screens): **horizontal scroll**, never wrap (swipe on mobile). Add a right-edge fade gradient (24px, into the background color) to signal overflow.
- Card: 16px radius, hairline border; inside: icon (`--act`, 26px SVG) + name (16px, 600) + count ("14 бүтээгдэхүүн" / 14 products, 12px muted). Click navigates to `/products?category={slug}`.

#### 3.3.3 Featured products (WF-HOME-02)

- Grid: `repeat(auto-fill, minmax(235px, 1fr))`, gap 20px. The first 4 products flagged "featured" in admin (API: `GET /api/v1/products?featured=true&limit=4`).
- Card anatomy (top to bottom): image area (aspect 4/3.4; if no photo, a light radial tint + halo SVG in `--saff-deep` at opacity .4) → tag (category, pill on 9% `--act` tint) → name (15.5px, clamped to 2 lines) → price (display serif, `--saff-deep`, formatted like `12,300,000₮`).
- Products with 3D get a "360°" badge in the image's top-right corner (`--saff` fill, `--act-text` text, 10px).
- The whole card is a link → `/products/[slug]`.

#### 3.3.4 Info strip (WF-HOME-03)

`--paper-alt` background, hairline above and below. 3 columns (stacked on mobile): "Хэрэглэх заавартай" (Comes with usage guides) / "Чанарын баталгаа" (Quality assured) / "Хүсэлт илгээх" (Send an inquiry) — icon (`--act`) + heading + one-sentence description (use the prototype's copy).

#### 3.3.5 Footer (WF-HOME-04)

Hairline on top. Left: logo (halo `--saff-deep` + НОГООЛИН `--ink`); center: links (Бүтээгдэхүүн · Холбоо барих · **Интро дахин үзэх** ← WF-HERO-06); right: "© 2026 Ногоолин". The footer is identical on all public pages (the intro replay link exists only on `/`).

### 3.4 Listing — `/products` (UC-G-002, UC-G-003)

#### 3.4.1 ASCII wireframe

```
┌──────────────────────────────────────────────────────┐
│ [solid nav — white, hairline below]                  │
│ КАТАЛОГ (eyebrow)                                    │
│ Бүтээгдэхүүн (h1)          N бүтээгдэхүүн олдлоо     │
│ (Бүгд)(Хүж)(Эрх)(Зул)(Хадаг)(Бурхан…)→   [🔍 Хайх…] │ ← chips ONE row
│ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐                      │
│ │360° │ │     │ │     │ │     │  … grid …            │
│ └─────┘ └─────┘ └─────┘ └─────┘                      │
│                 (1)(2)(→)                            │
└──────────────────────────────────────────────────────┘
```

#### 3.4.2 Requirements (WF-LIST-01…07)

- **WF-LIST-01 (Nav):** On subpages the nav is solid white, sticky, with a hairline below; links `--muted`, active/hover `--act`. (The transparent hero nav exists only on `/`.)
- **WF-LIST-02 (Chip filters):** "Бүгд" (All) + active categories. One row, wrapping prohibited — same horizontal-scroll rule as WF-HOME-01. Active chip: `--act` border + 10% tint. Selection is reflected in the URL query (`?category=huj`) — directly linkable.
- **WF-LIST-03 (Search):** Pill input with icon, 300ms debounce, filters by name (Phase 2: the API's multi-script search via `?q=`). Border turns `--act` on focus.
- **WF-LIST-04 (Grid):** Same card as WF-HOME-02, `auto-fill minmax(235px,1fr)`. Published products only (API default).
- **WF-LIST-05 (Pagination):** 12/page (FR). Number buttons (idle: hairline circle; active: `--act` border + tint) + arrow. URL carries `?page=N`.
- **WF-LIST-06 (Empty state):** When 0 results: halo SVG (90px, opacity .5) + "Илэрц олдсонгүй. Хайлтаа өөрчлөх эсвэл өөр ангилал сонгоно уу." (No results. Adjust your search or pick another category.) + [Шүүлтүүр арилгах] (Clear filters) ghost button (resets filter+search).
- **WF-LIST-07 (Count):** Under the heading, "N бүтээгдэхүүн олдлоо" (N products found; 13px muted) — updates on every filter change.

### 3.5 Detail — `/products/[slug]` (UC-G-004, 005, 006)

#### 3.5.1 ASCII wireframe

```
┌──────────────────────────────────────────────────────┐
│ Нүүр / Бүтээгдэхүүн / {name}         ← breadcrumb    │
│ ┌────────────────────┐  TAG                          │
│ │                    │  Product name (h1)            │
│ │   photo / 360°     │  380,000₮   ● Бэлэн байгаа    │
│ │                    │  Short description…           │
│ │       [Зураг|360°] │  [Хүсэлт илгээх] [← Каталог]  │
│ └────────────────────┘                               │
│ ─ Дэлгэрэнгүй ─ Хэрэглэх заавар ─ Үзүүлэлт ─         │
│ (active tab content)                                 │
└──────────────────────────────────────────────────────┘
```

Layout: 2 columns `1.1fr / 1fr`, gap 44px; single column at ≤880px (media first).

#### 3.5.2 Media area (WF-DET-01…03)

- **WF-DET-01:** Aspect 4/3.2, radius 20px, hairline border. Default: primary photo. With multiple photos, a thumbnail row below (Phase 2, once photos exist).
- **WF-DET-02 (360° viewer, UC-G-005):** For `has3d` products, a toggle in the bottom-right: [Зураг | 360°] (Photo | 360°). Selecting 360° mounts a Three.js viewer:
  - **The user** drags the model group with the pointer: `rotation.y += dx*0.009`, `rotation.x` clamped to ±0.55; no auto-rotate (the WF-MO-01 exception — user-controlled).
  - Pointer events (one code path for mouse+touch), `touch-action:none` on the canvas, cursor grab/grabbing.
  - Lighting: same family as the intro (ambient `#2A5643` / key `#FFE9B0` / rim `#3FC98A`), transparent clear, product tint gradient behind.
  - On first open, a "↔ Чирж эргүүлнэ үү" (Drag to rotate) hint pill — disappears on the first drag.
  - If WebGL is unavailable, the toggle is hidden (photo only).
- **WF-DET-03:** The viewer model is currently a placeholder orb; in Phase 3 it loads the product GLB (`model_3d_url` field) with a loading spinner.

#### 3.5.3 Info column (WF-DET-04)

Order: tag pill → h1 → price (30px serif `--saff-deep`) → availability status (`--act` dot + "Бэлэн байгаа" / muted "Түр байхгүй" — In stock / Temporarily unavailable) → short description (muted, 1.75 line-height) → CTA row: [Хүсэлт илгээх] (Send inquiry; primary) → `/products/[slug]/inquiry`; [← Каталог руу] (Back to catalog; ghost-light).

#### 3.5.4 Tabs (WF-DET-05)

3 tabs: **Дэлгэрэнгүй тайлбар** (Full description; default) / **Хэрэглэх заавар** (Usage guide) / **Үзүүлэлт** (Specifications). Active tab: text `--act` + 2px `--act` underline. Content 15px, line-height 1.85, max-width 52em.

- Usage guide (UC-G-006): numbered steps — circled number (32px, `--act` border, display serif) + text. Data: `usage_instructions` (list).
- Specifications: 2-column table (Материал / Хэмжээ / Гарал үүсэл — Material / Size / Origin + others), hairline between rows.

### 3.6 Inquiry — `/products/[slug]/inquiry` (UC-G-007)

#### 3.6.1 ASCII wireframe

```
┌──────────────────────────────────────────────────────┐
│ Бүтээгдэхүүн / {name} / Хүсэлт илгээх                │
│ ХҮСЭЛТ (eyebrow)                                     │
│ Бүтээгдэхүүний хүсэлт илгээх (h1)                    │
│ ┌── Form ─────────────────┐  ┌─ Summary (sticky) ───┐│
│ │ Таны нэр *              │  │ [photo]              ││
│ │ Утасны дугаар *         │  │ TAG                  ││
│ │ И-мэйл (заавал биш)     │  │ Name                 ││
│ │ Хүсэлтийн агуулга *     │  │ Price                ││
│ │ (privacy note)          │  └──────────────────────┘│
│ │ [Хүсэлт илгээх] [Буцах] │                          │
│ └─────────────────────────┘                          │
└──────────────────────────────────────────────────────┘
```

Layout: `1.2fr / 0.8fr`, single column at ≤880px (summary on top).

#### 3.6.2 Form & validation (WF-INQ-01…03)

- **WF-INQ-01 (Fields):** No account required (guest). Inputs: white distinguishable from `--paper-alt`, hairline border, radius 14px, focus `--act`.

| Field | Required | Rule | Error message (exact UI string) |
|---|---|---|---|
| Таны нэр (Your name) | ✓ | non-empty (trim) | "Нэрээ оруулна уу" |
| Утасны дугаар (Phone) | ✓ | `^\d{8}$` | "Утасны дугаар 8 оронтой байх ёстой" |
| И-мэйл (Email) | ✗ | if filled, RFC format | "И-мэйл хаяг буруу байна" |
| Хүсэлтийн агуулга (Message) | ✓ | non-empty | "Хүсэлтийн агуулгаа бичнэ үү" |

- Invalid field: border `#D98A6A`, 12.5px orange message below. All fields validate together on submit.
- Note under the form: "Бүртгэл шаардлагагүй. Таны мэдээллийг зөвхөн энэ хүсэлтэд хариу өгөх зорилгоор ашиглана." (No account required. Your details are used only to respond to this inquiry.)
- **WF-INQ-02 (Submit):** `POST /api/v1/inquiries` (06-api-spec) — body: `{ product_id, name, phone, email?, message }`. While submitting: button disabled + spinner; on failure, a general error line above the form.
- **WF-INQ-03 (Summary card):** Sticky (top 100px), radius 20px: photo → small "СОНГОСОН БҮТЭЭГДЭХҮҮН" (Selected product) label → tag → name → price.

#### 3.6.3 Success state (WF-INQ-04)

Replaces the whole form (centered, max-width 34em): check icon in a circle (74px, `--act` border, 0.5s pop animation) → "Хүсэлт илгээгдлээ" (Inquiry sent; h2 serif) → inquiry-number pill (the API's returned number, format `INQ-YYYY-NNNN`) → "Таны хүсэлтийг хүлээн авлаа. Манай ажилтан {phone} дугаараар ажлын 1 өдрийн дотор эргэн холбогдоно." (We received your inquiry. Our staff will call {phone} within 1 business day.) → [Каталог руу буцах] (Back to catalog; primary).

### 3.7 Categories — `/categories` (WF-CAT-01…02)

An index page of all active categories. The nav's "Ангилал" link lands here.

- **WF-CAT-01 (Structure):** Nav (solid) → eyebrow "КАТАЛОГ" + h1 "Ангилал" → grid `auto-fill minmax(260px,1fr)`. Card: the large variant — icon in a circle on the left (48px, 10% `--act` tint background), name (18px), one-sentence description (the category's `description` field), "N бүтээгдэхүүн" count, → arrow bottom-right. Click navigates to `/products?category={slug}`.
- **WF-CAT-02 (Empty category):** A category with 0 products remains visible but carries a muted "Тун удахгүй" (Coming soon) badge. (Admin can unpublish an idle category — then it disappears entirely.)

```
┌──────────────────────────────────────────┐
│ Ангилал (h1)                             │
│ ┌───────────────┐ ┌───────────────┐      │
│ │ (◎) Хүж       │ │ (◎) Эрх       │      │
│ │ 1 sentence…   │ │ …             │      │
│ │ 14 бүтээгдэхүүн →│ 9 бүтээгдэхүүн →│   │
│ └───────────────┘ └───────────────┘      │
└──────────────────────────────────────────┘
```

### 3.8 About — `/about` (WF-ABT-01…03)

The brand-trust page — the shopper learns "who these people are and what makes the goods special."

- **WF-ABT-01 (Structure, top to bottom):**
  1. A slim dark banner (~26vh): radial gradient in the intro palette + centered halo mark + h1 "Бидний тухай" (About us) — static, no 3D.
  2. Story section: 2 columns — an opening sentence in large display serif on the left, 2–3 paragraphs on the right (content to be supplied by Tengis; for now a structural placeholder, no lorem).
  3. Values strip (`--paper-alt`): 3 columns — "Уламжлалыг дээдэлнэ" (We honor tradition) / "Гарал үүсэл нь тодорхой" (Provenance is transparent) / "Зөв хэрэглээг заана" (We teach proper use) — icon + heading + sentence.
  4. Contact block: email, phone, social links (values finalized in Phase 2), [Бүтээгдэхүүн үзэх] (Browse products) CTA.
- **WF-ABT-02:** The copy is static content, not CMS — structured for EN/MN (i18n depends on the Phase 2 decision, §6).
- **WF-ABT-03:** SEO: this page is SSG with a meta description.

---

## 4. Global components (WF-GLB-01…03)

- **WF-GLB-01 (Nav, two modes):** On `/` — transparent inside the hero (§3.2.5); on all other pages — solid white sticky (§3.4.2 WF-LIST-01). Clicking the logo navigates to `/`. The active page's link has a 1px underline.
- **WF-GLB-02 (Burger menu, ≤880px):** Icon toggle (three bars ↔ X), a panel dropping down: vertical links, 15px, hairline between rows. Closes on: link click, outside click.
- **WF-GLB-03 (Footer):** §3.3.5 — identical on all public pages.

---

## 5. Data wiring (screen ↔ API)

| Screen | Endpoint (06-api-spec) |
|---|---|
| Home — categories | `GET /api/v1/categories` |
| Home — featured | `GET /api/v1/products?featured=true&limit=4` |
| Listing | `GET /api/v1/products?category=&q=&page=&limit=12` |
| Detail | `GET /api/v1/products/{slug}` |
| Inquiry | `POST /api/v1/inquiries` |
| Category index | `GET /api/v1/categories` (with counts & descriptions) |

Prototype seed data (9 products, 6 categories, names/prices/descriptions/guides/specs) — the `PRODUCTS` array in `nogoolin-prototype-b.jsx`. May be used as the initial Supabase seed.

---

## 6. Deferred decisions (do not implement by assumption)

| # | Decision | Status | When |
|---|---|---|---|
| D-01 | Final category count (6 / 8 / 10) | Open — layout is ready for any count via the single-row rule (WF-HOME-01) | Phase 2 (content entry) |
| D-02 | Ceremonial deep-red accent (badge/line) | Deferred — no red in v4 | Phase 3 |
| D-03 | Product photography standard | Direction decided: own high-quality photos on white. Lighting/angle/ratio guide to be written separately | Phase 2 |
| D-04 | Hero composition after the GLB lands (OFF fraction, scale) | 0.18 on the placeholder — re-tune on the GLB (WF-HERO-08) | Phase 3 |
| D-05 | i18n (MN/EN dual-language frontend) | MN-only for now; structure kept i18n-ready | Phase 2 |
| D-06 | Sticky nav behavior after scroll on catalog pages | Plain sticky for now (WF-LIST-01) | Refined in Phase 2 |

---

## 7. Prototype reference

### 7.1 Files

| File | Contents | Palette |
|---|---|---|
| `nogoolin-prototype-a-v4.html` | Intro + shrinking hero + Home (white). Standalone — opens directly in a browser | v4 ✓ |
| `nogoolin-prototype-b.jsx` | Listing + Detail (360° viewer) + Inquiry — full working flow | v3 (outdated) — implement UI with the v4 tokens of §1.1 |

### 7.2 Known prototype bugs (spec prevails)

1. **Categories wrap** (A v4, Home): the `auto-fit` grid produces two rows on narrow screens → implement per the single-row rule of WF-HOME-01.
2. **Deity appears to "rotate" ~10–20° during the morph** (A v4): an angle induced by the lateral camera shift + halo parallax → implement per the `setViewOffset` solution of WF-HERO-02. Copying the prototype's lateral-translate approach is prohibited.

---

## 8. Acceptance criteria

### 8.1 Intro
- [ ] Intro plays 900ms loading → 5.0s single-arc camera → still; after the arc, deity and camera never move (only particles/lights/halo breathe)
- [ ] "Алгасах" (Skip) is visible within the first second; clicking it lands directly in the shrunk home state
- [ ] Under `prefers-reduced-motion` the intro does not play
- [ ] Without WebGL, the static fallback hero + catalog work normally
- [ ] Reloading `/` within the same session does not replay the intro
- [ ] Scrolling is locked before the home state

### 8.2 Shrinking hero
- [ ] Clicking "Эхлэх" (Start) never destroys the canvas — one scene shrinks 100vh→35vh (mobile 42vh) in 1.1s
- [ ] During and after the morph the deity is viewed **perfectly head-on** — zero angular change, zero halo parallax (the setViewOffset check)
- [ ] The copy appears on the left as the morph completes and never overlaps the deity (both desktop and 390px mobile)
- [ ] "Интро дахин үзэх" (Replay intro) restarts the intro without a page reload

### 8.3 Home
- [ ] Category cards stay in **one row** at 6/8/10 — no wrapping ever; on overflow, horizontal scroll + right fade
- [ ] 4 featured products come from the API; 3D-enabled ones carry the badge
- [ ] Every color comes from the §1.1 tokens — no hardcoded hex

### 8.4 Listing
- [ ] Chip + search combined filtering is reflected in the URL query (shareable links)
- [ ] 12/page pagination; empty state has a reset button

### 8.5 Detail
- [ ] The 360° viewer rotates only by dragging (no auto-rotate) and does not steal page scroll on touch
- [ ] All 3 tabs complete; the usage guide renders as numbered steps

### 8.6 Inquiry
- [ ] The 4-field validation matches the messages of §3.6.2 exactly
- [ ] After a successful POST, the success state shows the inquiry number
- [ ] An unregistered guest can submit end-to-end

### 8.7 General
- [ ] Lighthouse accessibility ≥ 90 (public pages)
- [ ] No layout breakage from 390px to 1920px
- [ ] Cormorant Garamond/Manrope Cyrillic glyphs render correctly

---

## Version history

| Version | Date | Changes |
|---|---|---|
| 1.0.0 | 2026-07-05 | First approved version: palette v4, motion v2, shrinking hero, single-row rule, setViewOffset solution, 6 screens + 2 new pages (categories, about) |
