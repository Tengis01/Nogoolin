# Progress — Actual Repo State

> Mirrors `docs/10-roadmap.md` checklists but reflects what is REALLY done in
> this repo. Update when tasks complete. Last verified: **2026-07-16**.

## Phase 0 — Documentation & Planning ✅ COMPLETE (2026-07-05)

All 10 spec docs (EN + MN) exist in `docs/`. Conflict precedence
07 > 02 > prototypes. Finalized decisions in `DECISIONS.md`.

## Phase 1 — Foundation ✅ COMPLETE (2026-07-17)

> Caveat: code-complete and build-verified (all packages type-check; web
> production build passes; expo prebuild generates the native project), but
> END-TO-END RUNTIME verification against the local Supabase stack is still
> pending — Docker wasn't running during development (ERRORS.md 2026-07-16).
> First action of Phase 2: `pnpm exec supabase start` + auth smoke test.

### Week 1 — Repo & Infrastructure
- [x] Monorepo skeleton (`apps/web`, `apps/mobile`, `backend/api`, `packages/*`,
      `database/migrations`) — folder structure + stub package.jsons only
- [x] Root `package.json` + `pnpm-workspace.yaml` + `tsconfig.base.json`
- [x] `.gitignore` / `.env.example` (placeholders) / README stub / CLAUDE.md
- [~] Branch strategy: `main` + `feature/xxx` in use; **`develop` branch not
      created yet**; feature branches not yet merged to `main`
- [ ] GitHub Projects Kanban board (not verifiable from repo — assumed not done)
- [x] Docker multi-stage build (`backend/api/Dockerfile`, non-root, pnpm deploy)
- [x] `docker-compose.yml` for local dev (api service, hot-reload, cloud Supabase)
- [x] GitHub Actions skeletons (`web-deploy.yml`, `api-deploy.yml`,
      `mobile-build.yml`) — structure only; deploy details are Phase 6 TODOs

### Week 2 — Backend & Database
- [x] Fastify + TS base structure (port 3001, Controller→Service→Repository) —
      plugins (helmet/cors/rate-limit), env config, supabase client factory,
      DB-agnostic repository interfaces, health + public-settings exemplar routes
- [x] Supabase CLI local stack initialized (`supabase/config.toml`, 15-min JWT);
      **cloud project deliberately deferred to Phase 6** (ADR-011)
- [x] DB schema migrations (11 entities) — 3 files in `supabase/migrations/`
- [x] RLS policies per docs/08 §6 (all tables + is_admin() + auth trigger)
- [x] `packages/validation-schemas` Zod schemas (entities + input schemas)
- [x] `pnpm-lock.yaml` generated; api + validation-schemas type-check clean
- [ ] Migrations verified against a running local stack — blocked: Docker
      Desktop daemon not running (see ERRORS.md 2026-07-16); run
      `pnpm exec supabase start` once Docker is up

### Week 3 — Auth & Admin Scaffold
- [x] Email auth: signup/login/logout/password-reset (web via @supabase/ssr
      cookies + middleware refresh; mobile via supabase-js + AsyncStorage)
- [x] OAuth scaffold: Google + Facebook wired in config.toml via env();
      "not configured" UI state until real credentials exist; redirect URLs
      documented in README
- [x] JWT + RBAC: requireAuth/requireAdmin hooks (docs/08 §5.4), admin scope
      `/api/v1/admin/*` with UNAUTHORIZED_ACCESS audit logging
- [x] Next.js `/admin` protected scaffold (server-side role check, sidebar)
- [x] Expo app init: SDK 52, dev client/CNG (prebuild verified), expo-router,
      Zustand auth store, login/signup screens
- [x] `.env.example` finalized (grouped: api / supabase / oauth / cors /
      rate-limit / web / mobile)
- Token config: 15-min access JWT + 7-day sessions (timebox) + refresh
  rotation — supabase/config.toml

### Remaining polish (non-blocking)
- Runtime auth smoke test against running local stack (see caveat above)
- Real eslint configs (lint currently aliases `tsc --noEmit`)
- Mobile session storage: AsyncStorage now; docs/08 §5.2 wants encrypted
  storage — TODO(Phase 2) noted in apps/mobile/lib/supabase.ts

## Phase 2 — Product System ✅ COMPLETE (2026-07-19)

### Week 3 close-out (`feature/public-catalog`)
- [x] Public listing /products (WF-LIST-01…07): sticky solid nav, single-row
      category chips w/ right fade, 300ms-debounced multi-script search
      (server-side FR-PUB-014), auto-fill grid cards, numbered pagination
      12/page, exact empty-state copy, skeleton loading (route-grouped so it
      doesn't break 404 statuses)
- [x] Detail /products/[slug] (WF-DET-01…05): breadcrumb, gallery w/
      thumbnails, price/stock/CTA row (inquiry CTA disabled until Phase 4),
      tabs w/ numbered usage steps; Үзүүлэлт tab omitted (no schema field)
- [x] SEO: per-product title/description/OG image, canonical, Product
      JSON-LD, dynamic sitemap.xml (walks all pages), robots.txt
      (disallow /admin); next/image with remotePatterns
- [x] Mobile: /products list (chips, debounced search, 2-col grid,
      pull-to-refresh, load-more) + /products/[slug] (paged swipe gallery
      w/ dots, price, stock, description, numbered usage steps) — types via
      TYPE-ONLY imports from validation-schemas (no duplication, no Metro
      runtime cost)
- [x] Verified vs live stack (seeded 8 published + 1 draft): SSR content,
      NO draft leakage (listing + detail both 404), search hits in all 3
      scripts, category filter, 404 statuses, sitemap 14 urls
- [x] Perf/SEO (Lighthouse 12, mobile sim slow-4G 150ms/1.6Mbps, 4× CPU):
      detail SEO **92** (target ≥90 ✓; sole deduction is a false-negative
      meta-description audit — tag verified in SSR HTML AND post-JS DOM),
      detail Perf 100 (LCP 1.9s); listing Perf 96 / SEO 100 — FCP 0.9s,
      Speed Index 1.4s, LCP 2.2s under sim (≈<2s on real 4G target)

## Phase 3 — Premium Experience 🔄 IN PROGRESS ⚠ HIGHEST-RISK PHASE
Non-negotiables recap: deity never moves; NO lateral camera translate
(setViewOffset only); locked arc numbers; skip ≤1s; fallbacks. See
design.md + MEMORY.md rule 3 before ANY Three.js change.

### Done (2026-07-20) — intro camera system (`feature/intro-camera-system`)
- [x] Persistent-canvas hero (WF-HERO-01): ONE R3F canvas across
      loading→playing→ready→morph→home; container height JS-animated
      100vh→35vh (42vh ≤700px) with the same smootherstep as the camera
- [x] Camera arc (WF-INTRO-02): 5s, az 0.85→0, r 16→6.2, y 7.5→2.2,
      smootherstep, lookAt(0,1.4,0) fixed; position derived ONLY from
      (az,r,y) spherical → lateral translate structurally impossible
- [x] setViewOffset right-placement (WF-HERO-02): −0.18w/−0.10w ramped
      with morph easing, reapplied per frame w/ current size, never cleared;
      instant paths apply e=1
- [x] Morph dolly: r −0.9, y −0.35 along axis, zero angular change
- [x] WF-INTRO-03 placeholder scene: icosahedron deity + wireframe hint,
      halo torus, pedestal, ground, fog, 360 drifting particles, breathing
      lights (exact formulas); CSS radial gradient bg (never flat)
- [x] Fallback/a11y (WF-INTRO-05…09): skip from first frame (plain DOM,
      never blocked by lazy three.js), reduced-motion → static home,
      WebGL-less static hero, sessionStorage returning-visitor, scroll
      lock until home; replay-intro without reload (WF-HERO-06)
- [x] GLB swap point: intro-config.ts DEITY_GLB_URL (one line) + full
      asset requirements doc for the artist (≤5MB Draco, +Y up, faces +Z,
      ~2.2 units tall, bottom-center origin)
- [x] Verified at runtime (headless Chrome virtual-time): arc endpoint
      az 0.0000 / r 6.200 / y 2.200 / x-drift 0.000; midpoint internally
      consistent (az 0.5504 ⇒ e 0.3525 ⇒ r 12.545, y 5.632 — exact);
      ?debug=camera overlay ships for visual verification

### Remaining in Phase 3
- [ ] Green Tara GLB (external asset) → set DEITY_GLB_URL → D-04 re-tune
- [ ] Home white catalog section (WF-HOME-01…04) below the hero
- [ ] 360° product viewer + GLB upload endpoint/admin UI
- [ ] Mobile Rive intro (separate task, after web validation)

## Phase 2 (archive of week 1–2 log)

### Done (2026-07-19) — Category/Product/Image API (`feature/product-category-api`)
- [x] Phase 1 runtime closeout: local stack RUNNING (docker engine socket,
      not Docker Desktop — see ERRORS.md); all migrations applied; RLS
      verified true on all 11 tables (docs/09 §4.5 query); storage buckets
      `product-images` + `model-assets` created (also declared in config.toml)
- [x] Category CRUD API per 06-api-spec (public GET /categories,
      /categories/{slug}; admin POST/PATCH/DELETE with 409 CATEGORY_NOT_EMPTY)
- [x] Product CRUD API per 06-api-spec (public list w/ filters + sort +
      pagination meta, detail by slug published-only; admin list all statuses,
      create draft, patch incl. publish/archive, delete soft/hard)
- [x] Multi-script search at the QUERY level: generated tsvector column
      (name + name_en + search_tags, migration 0004) + Latin→Cyrillic
      transliteration util; verified in Cyrillic/English/Latin
- [x] Image upload: multipart → Supabase Storage → product_images rows;
      per-file validation (type+MIME+5MB), batch partial-rejection,
      PATCH sort/alt, DELETE (storage object + row)
- [x] Audit logging on every admin mutation (FR-AUD-001)
- [x] Migrations 0004–0006 (search vector, storage policies, table grants)
- [x] Integration tests: 21 passing against the live local stack (happy
      paths, 401/403 matrix, 400 validation, 404/409, search, upload) —
      idempotent across runs; suite self-skips when the stack is down

### Remaining in Phase 2
- [x] Admin web UI: built 2026-07-19, wired to the LIVE API same day
      (`feature/admin-ui`): thin client in apps/web/src/lib/api (Bearer token
      from Supabase session, 401→login redirect, XHR upload w/ progress),
      loading/error/empty states, shared-Zod client validation, category
      reorder + toggle persisted via PATCH, product filters/pagination
      server-side, image upload → real Storage endpoint with retry-on-fail.
      Mock data DELETED. New API endpoint: GET /admin/categories (incl.
      inactive + product_count; 06-spec gap, required by FR-ADM-005).
      NOT yet done: product EDIT page (no admin get-by-id endpoint exists;
      Засах button is a stub) and in-browser manual smoke test
- [ ] Public web: product listing + detail pages wired to the API
- [ ] Mobile: listing + detail core screens
- [ ] SEO pass on listing/detail (meta, OG, sitemap)
- [ ] GLB (model-assets) upload endpoint — Phase 3 with the 360° viewer
## Phase 3 — Premium Experience ⬜ NOT STARTED (highest-risk phase)
## Phase 4 — Soft Order / Inquiry ⬜ NOT STARTED
## Phase 5 — Delivery-Ready Structure ⬜ NOT STARTED
## Phase 6 — Launch Preparation ⬜ NOT STARTED
