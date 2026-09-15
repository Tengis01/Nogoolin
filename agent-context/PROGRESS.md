# Progress — Actual Repo State

> Mirrors `docs/phase-0/10-roadmap.md` checklists but reflects what is REALLY done in
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
- [x] RLS policies per docs/phase-0/08 §6 (all tables + is_admin() + auth trigger)
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
- [x] JWT + RBAC: requireAuth/requireAdmin hooks (docs/phase-0/08 §5.4), admin scope
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
- Mobile session storage: AsyncStorage now; docs/phase-0/08 §5.2 wants encrypted
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

## Phase 3 — Premium Experience 🟡 WEB CODE-COMPLETE, ASSET-PENDING

**Status (2026-07-20):** web intro/hero system is code-complete and
E2E-verified (8/8 browser-driven checks); NOT closable because (a) D-04
composition re-tune needs the real Green Tara GLB, and (b) the mobile Rive
intro is **NOT implemented** (owner session note claimed a
feature/mobile-rive-intro branch — verified absent: no branch, no .riv, no
rive dependency; only forward-looking comments). Asset contracts live in
ASSET_SPECS.md (GLB locked; Rive proposed) — owner is producing both,
timeline unknown. **Phase 4 engineering can proceed in PARALLEL — asset
production blocks nothing.**

### Phase 3 close-out E2E (chore/phase3-closeout, 2026-07-20)
- [x] Web full flow verified in real Chrome (puppeteer): skip visible
      443ms after navigation (≤1s ✓, works during loading); arc lands at
      exact spec pose; morph height tracks the smootherstep curve at rAF
      resolution with ZERO out-of-envelope samples; setViewOffset ramps to
      1 in sync; single persistent canvas; reduced-motion → instant shrunk
      home; same-tab reload skips intro
- [x] Real bug found & fixed by the E2E: 1-frame 0-height flash at
      morph→home (React style-prop wiped the imperative height — see
      ERRORS.md); container height is now exclusively imperative
- [x] GLB swap re-verified by SIMULATION (not just claim): exactly one
      line in intro-config.ts; type-check + prod build green with URL set
- [x] Draco decoder now SELF-HOSTED (public/draco) — removed drei's hidden
      Google-CDN runtime dependency; mandatory since the final GLB is
      Draco-compressed
- [x] ASSET_SPECS.md written (GLB locked contract + Rive proposed contract)
- [ ] Mobile Rive intro — NOT STARTED (build against ASSET_SPECS.md §2 so
      the .riv the owner produces drops in via one config)

## (previous Phase 3 section)
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
- [ ] Mobile Rive intro (separate task, after web validation)

> 360° per-product viewer REMOVED from Phase 3 scope — deferred post-MVP
> (D-07, 2026-07-20). Detail pages ship with the photo gallery only.

## Phase 4 — Soft Order / Inquiry 🟡 IN PROGRESS (API core done)

**Status (2026-07-26):** the soft inquiry system + wishlist/cart-draft API is
built, applied to the local stack, and E2E-tested (12 new integration tests,
34/34 green). Started in PARALLEL with the Phase 3 asset wait, per owner
instruction. UI (web/mobile) is intentionally NOT built yet — API only, same
as Phase 2 Week 1.

### Done (2026-07-26) — inquiry + cart API (`feature/inquiry-api`)
- [x] Migration 0007: `inquiries.customer_id` (nullable, links auth submitter;
      NULL for guests) + `inquiries_select_own` RLS; new `cart_items` table
      (per-user, own-row RLS, explicit grants). Applied + verified on the
      running stack; version recorded in schema_migrations.
- [x] `POST /inquiries` — guest OR authenticated (new `optionalAuth` hook),
      3/hr rate limit (FR-INQ-001..007); phone only, NO email (FR-INQ-002)
- [x] `GET /inquiries/mine` — customer reads own inquiries (auth scope)
- [x] `GET /admin/inquiries` — newest-first, filter by status/product_id/date
      range, pagination (FR-INQ-004/006, FR-ADM-006)
- [x] `PATCH /admin/inquiries/{id}/status` — lifecycle + audit log (FR-INQ-005)
- [x] `GET/POST/DELETE /cart` — save-for-later list (add is idempotent,
      published-only, remove idempotent); NOT checkout (no qty/price/order)
- [x] Shared Zod (`inquiry.schema` +customer_id/admin-query, new `cart.schema`);
      new authenticated (non-admin) route scope in app.ts
- [x] Fixed a pre-existing latent bug: rate-limit responses were 500 not 429
      (ERRORS.md 2026-07-26)

### Owner-approved divergences from docs (recommend doc updates)
- `inquiries.customer_id` + customer self-read extend docs/phase-0/04 §3.7 +
  docs/phase-0/08 §6.10 (was admin-only-read)
- `cart_items` is a NEW entity — docs/phase-0/04 has no cart table (the task's
  "per 04 CART/CART_ITEM" reference was a false premise)
- ⚠ `0006_table_grants.sql` is 0 bytes — fresh `supabase db reset` would lack
  grants (ERRORS.md 2026-07-26); 0007 self-grants, broader fix pending

### Done (2026-07-26) — web UI (`feature/inquiry-ui`)
- [x] `/products/[slug]/inquiry` — DEDICATED page per WF §3.6 (breadcrumb,
      eyebrow, 1.2fr/0.8fr grid, WF-INQ-03 sticky summary card), guest-capable
      (FR-INQ-001), name pre-filled when signed in, noindex
- [x] WF-INQ-01 validation with EXACT MN strings, all fields validating
      together; client schema extends the SHARED `inquiryInputSchema` with a
      compile-time compatibility assertion (no duplicate logic, no drift)
- [x] WF-INQ-04 success state (74px check + 0.5s pop, INQ number pill, phone
      callback copy, back-to-catalog); 429 rate-limit surfaced in Mongolian
- [x] Detail CTA enabled (was a disabled stub since Phase 2) + Save toggle on
      detail; Save toggle on product cards (card restructured — a <button>
      inside the card <Link> was invalid HTML)
- [x] `/wishlist` — auth-gated saved list w/ remove; NO totals/checkout
- [x] `/profile` — name edit (RLS own-row), inquiry history, saved list
- [x] `/admin/inquiries` — inbox w/ status + product + date-range filters,
      row expand for the full message, status lifecycle actions, guest vs
      registered marker; reuses the Phase 1 admin layout/auth untouched
- [x] Session-aware nav (Хадгалсан / Миний булан / Нэвтрэх)
- [x] Verified in real Chrome: 21/21 authenticated + 13/14 guest checks
      (the 1 miss is a pre-existing missing favicon.ico). Type-check + prod
      build green. `prefers-reduced-motion` verified (transitions → 0s).

### Phase 4 UI notes (owner-approved deviations)
- Inquiry email field OMITTED though WF-INQ-01 lists it — no email column or
  API field exists (FR-INQ-002 is phone-only); rendering it would silently
  discard input. **docs/phase-0/07 §3.6.2 should drop the email row, or a migration +
  API field must be added.**
- The `INQ-YYYY-NNNN` number is DERIVED display-only (created_at year + 4 uuid
  hex chars) — it is NOT sequential. Replace `formatInquiryNumber` if a real
  `inquiry_number` column is ever added.
- New token `--warn: #d98a6a` = the exact invalid-field color WF-INQ-01
  specifies (the wireframe calls it "orange"). It is the only non-v4-palette
  color in the app — ⚠ owner should confirm it does not read as red (D-02).

### Remaining in Phase 4
- [ ] Mobile inquiry form + mobile wishlist (next task) — lift
      `apps/web/src/lib/inquiry-form-schema.ts` into
      `packages/validation-schemas` so both clients share it

## Phase 2 (archive of week 1–2 log)

### Done (2026-07-19) — Category/Product/Image API (`feature/product-category-api`)
- [x] Phase 1 runtime closeout: local stack RUNNING (docker engine socket,
      not Docker Desktop — see ERRORS.md); all migrations applied; RLS
      verified true on all 11 tables (docs/phase-0/09 §4.5 query); storage buckets
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
