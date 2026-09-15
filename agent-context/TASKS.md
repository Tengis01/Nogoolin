# Tasks — Active Queue

> Kanban for what's happening in this repo right now. After EVERY task, append
> an entry to the Log below (what was done, what's next). Newest log entries
> at top.

## In Progress

*(empty)*

## Backlog (Phase 3 order — ⚠ highest-risk phase, read design.md first)

- [ ] Mobile Rive intro (@rive-app/react-native Nitro) + transition —
      NOT STARTED; build against ASSET_SPECS.md §2 (proposed contract:
      artboard `Intro`, state machine `IntroMachine`, inputs `skip`
      (trigger) / `reducedMotion` (bool), event `finished`)
- [ ] Home white catalog section (WF-HOME-01…04: category row, featured
      grid, info strip) below the persistent hero — intro/hero container
      itself is done, this is the content underneath
- [ ] Green Tara GLB (owner-produced, timeline unknown): drop in via
      DEITY_GLB_URL (one line, re-verified 2026-07-20) → resolve D-04
      composition re-tune (VIEW_OFFSET_FRACTION / DEITY_SCALE knobs)
- [ ] Product edit page in admin (+ GET /admin/products/{id})
- [ ] Manual web-auth smoke test in browser (API RBAC covered by tests)
- [ ] Merge feature branches → `main`; create `develop` branch
      (waiting for owner go-ahead — "wait user to tell" 2026-07-16)
- [ ] Real eslint config; mobile encrypted session storage; native Google
      Sign-In (carried over)

> Phase 4 (soft order/inquiry) can start in PARALLEL with the above —
> nothing here blocks it (owner instruction, 2026-07-20 closeout).

## Done

- [x] 2026-07-26 — PHASE 4 (part) — web UI: inquiry page (WF §3.6 dedicated
      route + WF-INQ-04 success), wishlist save/list/remove, /profile
      (name edit + inquiry history + saved list), admin inquiry inbox.
      All wired to the live API, 0 mock data. 35 browser checks; 1 real bug
      fixed (profile stale-prop dirty check). Mobile still pending.
- [x] 2026-07-26 — PHASE 4 (part) — soft inquiry system + cart draft API
      (`feature/inquiry-api`): migration 0007 (inquiries.customer_id + cart_items),
      8 endpoints (public/customer/admin inquiry + cart), optionalAuth hook,
      shared Zod, 12 new integration tests (34/34 green). Rate-limit 500→429 fix.
      Remaining Phase 4: user profile, mobile inquiry form, web/mobile UI wiring.
- [x] 2026-07-20 — Phase 3 web close-out: E2E-verified intro/hero flow (8/8
      browser checks), 1-frame flash bug fixed, GLB swap re-verified by
      simulation, Draco self-hosted, ASSET_SPECS.md written. Mobile Rive
      confirmed NOT built — status corrected, not closed.
- [x] 2026-07-20 — Intro camera system on placeholder (persistent canvas,
      locked arc, setViewOffset, WF-INTRO-03 scene)
- [x] 2026-07-19 — PHASE 2 COMPLETE: public listing/detail + SEO (Lighthouse
      SEO 92/100, perf 100/96) + mobile listing/detail screens
- [x] 2026-07-19 — Category/Product/Image CRUD API + multi-script search +
      21 integration tests green vs live local stack; local stack finally
      RUNNING (Phase 1 runtime caveat closed)
- [x] 2026-07-17 — Phase 1 complete: auth (email + OAuth scaffold), JWT/RBAC,
      /admin scaffold, Expo app init, .env.example final
- [x] 2026-07-16 — Local Supabase stack + 3 migrations (schema/RLS/seed) +
      Fastify layered scaffold + shared Zod schemas + lockfile
- [x] 2026-07-16 — agent-context/ working-memory layer + CLAUDE.md standing instruction
- [x] 2026-07-16 — Dockerfile (multi-stage, non-root) + docker-compose + 3 CI skeletons
- [x] 2026-07-15 — CLAUDE.md + monorepo skeleton (workspaces, tsconfig base, env template)

---

## Log (append after every task, newest first)

### 2026-07-26 — Phase 4 web UI: inquiry form, wishlist, profile, admin inbox (`feature/inquiry-ui`)
- **Done (web only — mobile untouched per task):** 4 new routes —
  `/products/[slug]/inquiry` (WF §3.6 dedicated page + WF-INQ-04 success),
  `/wishlist`, `/profile`, `/admin/inquiries` — all wired to the REAL Phase 4
  API, zero mock data. Detail-page inquiry CTA (disabled since Phase 2) is now
  live; Save toggle added to product cards + detail; session-aware nav links;
  admin sidebar "Хүсэлтүүд (Phase 4)" → real `/admin/inquiries`.
- **Key decisions (both owner-approved):** (1) inquiry is a DEDICATED ROUTE,
  not embedded — the task's "embed unless the wireframe says otherwise" clause
  resolved to the wireframe, which defines §3.6 as its own page with a sticky
  summary card and points WF-DET-04's CTA at it. (2) email field OMITTED
  despite WF-INQ-01 listing it — no email column/API field exists (FR-INQ-002
  is phone-only) and rendering it would silently discard input. (3) the
  WF-INQ-04 `INQ-YYYY-NNNN` number is DERIVED display-only from
  created_at + uuid (no migration) — swap `formatInquiryNumber` if a real
  sequence is ever added.
- **Validation:** client uses the SHARED `inquiryInputSchema` as its base,
  extended with WF-INQ-01's stricter rules + exact MN strings; a compile-time
  `InquiryFormValues extends InquiryInput` assertion prevents client/server
  drift. Client rules are a strict subset, so anything passing the form passes
  the API. NOTE: this module is web-local — **lift it to
  packages/validation-schemas when the mobile inquiry form is built.**
- **Verified in real Chrome (2 E2E suites, 35 checks):** guest suite 13/14
  (sole miss = pre-existing missing `/favicon.ico`); authenticated suite 21/21
  — save→persist→remove, name pre-fill, auth submission linking customer_id,
  profile history + name edit, admin inbox listing/expand/status-update/
  server-side filters. Rate-limit (429) UI verified separately: shows the
  Mongolian retry message and does NOT fake success.
- **1 real bug found + fixed** (ERRORS.md): the profile save confirmation could
  never render — `dirty` compared against a stale server-render prop. Also
  logged: `next build` breaks if the root `.env` (NODE_ENV=development) is
  sourced — environment footgun, not a code bug.
- **Polish audit:** no red anywhere (zero red-family Tailwind classes, zero red
  keywords); the ONE new color is `--warn: #d98a6a`, the exact value WF-INQ-01
  mandates for invalid fields and which the wireframe itself calls "orange" —
  ⚠ **flagged for owner veto** if it reads as red. All 3 list views have
  loading + error-with-retry + empty states. `prefers-reduced-motion` block
  added to globals.css and verified in-browser (transition-duration → 0s).
- **Not done (next task):** mobile inquiry form + mobile wishlist.

### 2026-07-26 — Phase 4 soft inquiry system + cart draft API (`feature/inquiry-api`)
- **Done (API only, no UI — per task):** the soft inquiry system + a wishlist /
  cart draft, all Controller→Service→Repository. Migration 0007 adds
  `inquiries.customer_id` (nullable, links authenticated submitters; NULL for
  guests) + an `inquiries_select_own` RLS policy, and a new `cart_items` table
  (per-user save list, own-row RLS, explicit grants). New endpoints:
  `POST /inquiries` (guest OR auth via a new `optionalAuth` hook; 3/hr rate
  limit), `GET /inquiries/mine` (auth, own history), `GET /admin/inquiries`
  (status + product_id + date-range filters, newest-first pagination),
  `PATCH /admin/inquiries/{id}/status` (audit-logged), and `GET/POST/DELETE
  /cart`. Added a new authenticated (non-admin) route scope in app.ts.
  Shared Zod: `inquiry.schema` (customer_id, admin list query) + new
  `cart.schema`. **12 new integration tests, 34/34 green** vs the live stack.
- **Owner decisions honored (both diverge from docs/04+08 — flagged):**
  (1) added `customer_id` + customer self-read (docs/phase-0/04 had no such column,
  docs/phase-0/08 was admin-only-read); (2) single `cart_items` table (docs/phase-0/04 has NO
  cart entity — the task's "per 04 CART/CART_ITEM" premise was false).
  Email was NOT added — FR-INQ-002 specifies phone only.
- **2 bugs (ERRORS.md 2026-07-26):** (a) rate-limit responses were 500 not 429
  (@fastify/rate-limit throws the builder payload w/o statusCode; pre-existing
  latent bug in the global limit too) — fixed in the central error handler;
  (b) discovered migration `0006_table_grants.sql` is **0 bytes** (grants live
  only in the manually-patched running DB) → a fresh `supabase db reset` would
  lack grants. Mitigated: 0007 grants its own objects; broader fix flagged.
- **Doc-update recommendations (not yet applied):** record `inquiries.customer_id`
  + `cart_items` in docs/phase-0/04-er-diagram.md and the self-read policy in
  docs/phase-0/08-security.md §6.10; consider an FR for the wishlist.
- **Next:** owner reviews/merges; remaining Phase 4 items = basic user profile,
  mobile inquiry form, and wiring the inquiry form + wishlist into web/mobile UI.

### 2026-07-20 — Working `docker compose up --build` for api+web (uncommitted)
- **Done:** added `apps/web/Dockerfile` (dev-only, single-stage — web
  still deploys via Vercel in prod, per docs/phase-0/09) and a `web` service to
  `docker-compose.yml`; both services set `network_mode: host` (Linux)
  so `next dev`'s own "Network: http://<lan-ip>:3000" log line — and
  Fastify's own listen log — reflect the machine's REAL LAN IP for free,
  no custom scripting needed.
- **3 real bugs found + fixed while actually running it** (details in
  ERRORS.md): (1) `.dockerignore` blanket-excluded `apps/`, blocking the
  new web build; (2) neither Dockerfile copied root `tsconfig.base.json`,
  so `tsc` failed inside the image only; (3) the API container crashed
  at startup — `@supabase/supabase-js` requires native `WebSocket`
  unconditionally, absent on the pinned `node:20-alpine` (Node 22+ only)
  — fixed with a `ws` polyfill, not by touching the locked Node version.
- **Verified live:** both containers build + start clean; `curl`
  confirmed `/api/v1/health` and `/api/v1/categories` (real seeded data)
  on `:3001`, web `200` on both `localhost:3000` and the LAN IP.
- **Not done:** these changes are UNCOMMITTED — this turn was a request
  for testing advice, not an explicit commit instruction, so per the
  git-safety rule (commit only when asked) they're left in the working
  tree on `chore/phase3-closeout` for review.
- **Next:** owner reviews/commits (or asks for a separate branch); mobile
  stays on `pnpm --filter @nogoolin/mobile start`, intentionally not
  containerized (Expo dev client needs the host's Android tooling).

### 2026-07-20 — Phase 3 web close-out (`chore/phase3-closeout`)
- **Task 1 (E2E integration check):** Built a real-Chrome (puppeteer)
  end-to-end suite against the production build — not a code read, an
  actual browser drive. 8/8 checks green: skip button visible + clickable
  within ~450ms of navigation and works instantly during the loading
  phase; skip jumps straight to the exact 35vh shrunk home with scroll
  unlocked; the 5s arc lands at the EXACT spec pose (az 0.0000, r 6.200,
  y 2.200); the morph height was traced at requestAnimationFrame
  resolution against the closed-form smootherstep curve with ZERO
  out-of-envelope samples (see bug below — this caught a real one);
  setViewOffset ramps to e=1 in sync with the morph, landing on
  phase=home; exactly one canvas element exists throughout (never
  remounted); prefers-reduced-motion → instant shrunk home with offset
  pre-applied; a same-tab reload after skipping does not replay the
  intro (sessionStorage). Mobile: **could not test — see Task 2.**
- **Real bug found & fixed:** the rAF height trace showed a one-frame
  collapse to 0px exactly at the morph→home boundary — a genuine visual
  pop, not a measurement artifact. Root cause: the container height had
  two writers (the imperative rAF morph driver AND a React `style` prop
  that set `height: undefined` in the home branch); the phase-change
  re-render clobbered the driver's inline height for one paint. Fixed by
  making height exclusively imperative (removed from the style prop
  entirely). Re-ran the full suite after the fix: 0 deviation. Logged in
  ERRORS.md with a "single-writer rule" prevention note.
- **Task 2 (asset-swap audit) — GLB:** re-verified by SIMULATION, not by
  re-reading old claims: set `DEITY_GLB_URL` to a fake path, ran
  `tsc --noEmit` + `next build` (both green), reverted. Confirmed exactly
  one line changes. While doing this, found and fixed a real gap: drei's
  `useGLTF` defaults to loading the Draco decoder from a Google CDN — a
  hidden runtime dependency the "one-line swap" claim didn't actually
  cover, since the final GLB IS Draco-compressed per spec. Self-hosted
  the decoder at `apps/web/public/draco/` (copied from three's installed
  package) and pointed `useGLTF(url, '/draco/')` at it.
- **Task 2 — Rive:** the task brief asserted a `feature/mobile-rive-intro`
  branch and implementation already existed. Verified this directly
  (`git branch --list`, grep for "rive"/".riv" across apps/mobile): **no
  such branch, no .riv file, no @rive-app dependency — only forward-
  looking code comments from Phase 1/2 ("Phase 3 replaces the plain stack
  entry with the Rive..."), never built.** Corrected the premise rather
  than fabricating an audit of code that doesn't exist. Converted the
  "re-verify the swap point" task into "write the contract the future
  code must satisfy" instead (Task 3).
- **Task 3 (ASSET_SPECS.md):** new file consolidating: GLB requirements
  (format/compression/size, +Y up axis, faces +Z, ~2.2 unit height,
  bottom-center origin, the verified one-line swap procedure, an
  acceptance checklist) and a PROPOSED Rive contract (artboard `Intro` at
  430×932, state machine `IntroMachine`, inputs `skip` trigger +
  `reducedMotion` bool, `finished` event, motion-principle notes, size/
  naming acceptance checklist) — explicitly labeled proposed-not-built so
  it reads correctly for someone learning Rive from scratch.
- **Task 4 (tracking):** PROGRESS.md Phase 3 status corrected to "web
  code-complete, asset-pending" (not "done" — D-04 needs the real GLB,
  Rive isn't started) with Phase 4-can-proceed-in-parallel called out
  explicitly per owner instruction; MEMORY.md "where we are" updated;
  TASKS.md backlog re-scoped (GLB/intro/morph items marked done and
  removed from backlog, Rive item corrected to "NOT STARTED" with the
  ASSET_SPECS.md pointer).
- **Next:** Rive intro build (whenever the owner's .riv or a placeholder
  is ready) + WF-HOME catalog section; Phase 4 can start now in parallel.

### 2026-07-20 — Intro camera system on placeholder (`feature/intro-camera-system`)
- **Done:** apps/web/src/components/intro/: intro-config.ts (ALL locked
  constants + DEITY_GLB_URL single swap point + GLB artist requirements),
  deity.tsx (WF-INTRO-03 placeholder / future GLB via config), intro-scene
  (CameraRig: position ONLY from (az,r,y) spherical; per-frame setViewOffset
  ramp, never cleared; breathing + particles per exact spec formulas),
  hero-intro (state machine, JS morph height driver sharing the camera's
  smootherstep, skip/loading/title/nav/copy overlays, reduced-motion +
  no-WebGL + returning-visitor paths, scroll lock, replay, ?debug=camera
  overlay), static-hero fallback; home page hosts hero + catalog slot.
  Deps: three 0.185, @react-three/fiber 9.6, drei 10.7 (lazy-loaded —
  home first-load stays 110kB, skip never blocked).
- **Verified:** type-check + build green; grep audit = exactly ONE camera
  position write (the arc formula), zero translateX/position.x, zero
  clearViewOffset; headless-Chrome virtual-time runs: endpoint az 0.0000 /
  r 6.200 / y 2.200 / x-drift 0.000; midpoint self-consistent (e=0.3525
  across all three params). No lateral-translate-bug symptoms observed
  (nothing to log in ERRORS beyond process notes).
- **Next:** home white catalog section (WF-HOME), then 360° viewer; GLB
  swap when the art asset lands (one line + D-04 re-tune).

### 2026-07-19 — Public catalog + SEO + mobile screens (`feature/public-catalog`) — PHASE 2 COMPLETE
- **Done:** web /products listing (server-rendered, WF-LIST: single-row
  chips + right fade, ?category/?q/?page URL state, 300ms debounce → API
  `search` param, numbered pagination, exact empty-state copy, skeleton via
  route group `(list)`) and /products/[slug] detail (breadcrumb, gallery +
  thumbnails, tabs w/ parsed numbered usage steps, inquiry CTA disabled til
  Phase 4, not-found page); SEO: generateMetadata (title/desc/OG/canonical),
  Product JSON-LD, dynamic sitemap.ts (walks all pages), robots.ts,
  next/image remotePatterns; mobile: products list (chips/search/2-col grid/
  pull-refresh/load-more) + [slug] detail (paged swipe gallery + dots,
  numbered steps) with TYPE-ONLY shared-schema imports; nav/footer shared
  public components. Seeded demo data (8 published incl. multi-image +
  1 draft) via scratchpad script w/ generated PNGs.
- **Verified:** SSR HTML contains products; NO draft/archived leakage
  (listing excludes, detail 404s); search hits for "Ногоон"/"green tara"/
  "nogoon dar eh"; 404 statuses correct after the route-group fix
  (ERRORS.md); sitemap 14 urls; Lighthouse (mobile, slow-4G sim): detail
  SEO 92 + Perf 100 (LCP 1.9s), listing SEO 100 + Perf 96 (FCP 0.9s,
  SI 1.4s, LCP 2.2s). meta-description audit is a false negative (tag
  verified in SSR HTML and post-JS DOM).
- **Next:** Phase 3 (⚠ highest-risk): GLB prep → 3D intro → shrinking hero
  (setViewOffset!) → 360° viewer → Rive mobile intro.

### 2026-07-19 — Admin UI wired to live API (`feature/admin-ui`)
- **Note:** owner's message said v0.dev components were pasted but none were
  attached — integrated the existing admin components from
  feature/admin-catalog-ui instead (same goal); flagged to owner.
- **Done:** API: GET /admin/categories (all + product_count via
  `products(count)` join; FR-ADM-005, 06-spec gap noted) + integration test
  (22/22 green). Web: lib/api/client.ts (envelope parsing, Bearer from
  Supabase session, 401→/login?next=…, XHR apiUpload with progress) +
  lib/api/admin.ts typed calls; CategoryTable/ProductTable/ProductForm
  rewired — loading/error/empty states, optimistic toggle + drag-reorder
  persisted via PATCH sort_order (revert on failure), server-side product
  filters + debounced search + meta pagination, create-product two-phase
  flow (POST → image upload w/ progress bar, upload-failure state offers
  retry or continue), client validation via the SAME shared Zod schemas,
  409/4xx errors surfaced inline. mock-data.ts deleted. next.config
  extensionAlias fix for NodeNext .js specifiers (ERRORS.md). Verified:
  type-check + next build green; CORS + 401 behavior confirmed against the
  running API.
- **Still mock/stub:** nothing uses mock data; product Засах (edit) button
  is a stub pending an admin get-by-id endpoint.
- **Next:** product edit page (+ GET /admin/products/{id}), manual browser
  smoke test, then public listing/detail (Week 3).

### 2026-07-19 — Admin catalog UI, mock data (`feature/admin-catalog-ui`)
- **Done:** /admin/categories (CategoryTable: drag-reorder, active toggle,
  product-count delete guard, add/edit modal with live slug preview),
  /admin/products (ProductTable: thumbnail/halo placeholder, category +
  status filters, search, publish-toggle/archive/delete with FR-ADM-008
  confirm dialogs), /admin/products/new (ProductForm: Cyrillic name + slug
  preview, category/price/status, markdown description, repeatable
  usage-instruction steps serialized to markdown, drag&drop multi-image
  zone with type/size validation + reorder + primary badge). Shared atoms in
  components/admin/ui.tsx; v4 tokens only, no red (saffron-deep = caution).
  All on MOCK data (lib/admin/mock-data.ts typed with shared schemas).
  Parent-category field from the request was intentionally NOT built —
  schema has no parent_id (docs/04, flat categories); flagged to owner.
  Verified: type-check + next build green (routes dynamic/auth-gated).
- **Next:** wire tables/form to the live API (fetch layer + mutations),
  then public listing/detail pages.

### 2026-07-19 — Catalog API (`feature/product-category-api`) — Phase 2 Week 1
- **Done:** local stack started (DOCKER_HOST workaround, ERRORS.md) — RLS
  true on all 11 tables, buckets created; migrations 0004 search_vector
  (generated tsvector over name+name_en+search_tags, drops old expression
  index), 0005 storage_policies, 0006 table_grants (CLI image grants gap);
  config.toml bucket declarations; validation-schemas updated to spec query
  params (+ productImagePatchSchema, images/category joins on Product);
  API: category/product/product-image/storage repositories + services +
  public/admin controllers, translit + slug utils, ApiError + global error
  envelope, @fastify/multipart; endpoints exactly per 06-api-spec (11 new
  routes); audit log on every admin mutation; /settings/public now {data}-
  enveloped per spec. Tests: 21 integration tests, idempotent, green twice;
  suite self-skips if stack down. All packages type-check.
- **Next:** admin web UI for categories/products, then public listing/detail.

### 2026-07-17 — Auth + admin + mobile init (`feature/auth-admin-scaffold`) — PHASE 1 COMPLETE
- **Done:** config.toml auth finalized (site_url localhost:3000, redirect
  allowlist incl. nogoolin:// deep link, sessions timebox 168h = 7d,
  [auth.external.google/facebook] via env() — placeholders OK);
  API: requireAuth/requireAdmin hooks per docs/phase-0/08 §5.4 + user/audit-log
  repositories + `/api/v1/admin/ping` smoke route; web: Next.js 15 app
  (@supabase/ssr cookies + middleware refresh, login/signup/reset/update
  password, /auth/callback PKCE exchange, OAuth buttons with not-configured
  state, protected /admin layout + dashboard, v4 tokens in globals.css);
  mobile: Expo SDK 52 dev-client/CNG app (expo-router, Zustand auth store,
  login/signup screens, eas.json with development profile); .env.example
  finalized; README OAuth redirect-URL guide + mobile build commands.
  Verified: all 4 packages type-check; `next build` passes (admin/callback
  dynamic, rest static); `expo prebuild -p android` generates native project.
  NOT verified at runtime (Docker still down). NOT pushed.
- **Next:** Phase 2 — runtime smoke test first, then storage buckets +
  category/product CRUD.

### 2026-07-16 — Local DB schema + backend structure (`feature/db-schema-local`)
- **Done:** Supabase CLI added as root dev dep (`pnpm exec supabase ...`);
  `supabase init` (config.toml: project_id nogoolin, jwt_expiry 900);
  3 migrations in `supabase/migrations/` — init_schema (6 enums, 11 tables,
  9 indexes, updated_at triggers), rls_policies (is_admin(), auth trigger,
  22 policies, RLS on all 11 tables), seed_system_settings
  (delivery_enabled=false); `packages/validation-schemas` implemented (9 src
  files: entity + input schemas per docs/phase-0/08 §7.2); `backend/api` layered
  scaffold (env config, supabase client factory, helmet/cors/rate-limit
  plugins, validateBody hook, DB-agnostic repository interfaces + supabase
  settings impl, settings service, health + /settings/public controllers);
  README local-dev docs; .env.example local values; migrations location
  moved database/→supabase/ (ADR-011, CLAUDE.md + workflows updated).
  Both packages type-check clean. NOT pushed (owner: wait for go-ahead).
- **Next:** start Docker → `supabase start` → verify migrations + RLS live.

### 2026-07-16 — Created agent-context/ layer
- **Done:** 9 files (PROJECT_BRIEF, DECISIONS, DB_SCHEMA, design, MEMORY,
  PROGRESS, TASKS, ERRORS, diagrams/×3) condensed from docs/; CLAUDE.md updated
  with session-start + task-end standing instructions. Branch `feature/agent-context`.
- **Next:** merge the three feature branches to `main`, create `develop`, then
  start Phase 1 Week 2 (Fastify init + Supabase).

### 2026-07-16 — Docker + CI/CD scaffolding (`feature/docker-cicd`)
- **Done:** `backend/api/Dockerfile` (builder + lean prod stage, pnpm deploy,
  non-root), `.dockerignore`, `docker-compose.yml` (hot-reload, env from .env,
  no local Postgres — cloud Supabase), 3 GitHub Actions skeletons with path
  filters + lint/typecheck gates. Mobile builds = manual workflow_dispatch (ADR-010).
- **Next:** agent-context/ layer (done — see above).

### 2026-07-15 — Monorepo scaffold (`feature/monorepo-setup`)
- **Done:** CLAUDE.md; folder structure; root package.json + pnpm-workspace.yaml;
  tsconfig.base.json; .gitignore; .env.example (placeholders only); README;
  stub package.jsons for 5 workspaces; layered src/ dirs in backend/api.
- **Next:** Docker + CI/CD scaffolding (done — see above).


### 2026-09-15 — ICSI405 consolidation and M2 documentation draft
- **Done:** Read Downloads handover plus W2 handout/Lecture 02 and Chinchilla pp. 53–55. Moved all 120 ICSI405 course files into `docs/ICSI405/`; original Git metadata preserved at `/home/tengis/Documents/Tengis/.git-recovery-20260915/ICSI405.git`. Kept submitted Seminar 1 content unchanged; updated course AGENTS for the explicit W2 Nogoolin pivot.
- **Done:** Grouped all 19 numbered Phase 0 files (01–10, EN/MN + YAML) into `docs/phase-0/`; repaired navigation and source references, including 16 pre-existing MN filename mismatches. Added docs, API, diagram, Phase 0 and course indexes.
- **Done:** Wrote Mongolian SRS/SDD templates, 5 testable requirements (2 FR + 3 NFR), 8-column traceability, one-page Scope Charter, a transparent W1-to-W2 persona bridge, and a peer-review draft. Exported editable LaTeX plus `docs/ICSI405/sem2/sem2_merged.pdf` (10 pages) and `SRS-Scope-Charter.pdf` (1 page).
- **Verification:** Original course files present; only AGENTS intentionally changed. 5 requirement IDs, 5 matrix rows/8 columns, 27 mapping rows; LaTeX font/overflow checks and visual PDF review. Details in `docs/ICSI405/sem2/tmp/validation-report.json`. No application runtime tests or product implementation changes; code/workflow edits only update documentation references.
- **Scope:** Owner explicitly asked to skip peer-review delivery and Confluence/LMS publication/submission because no recipients/links are available. No messages sent, commits pushed, or deployment performed.
- **Next:** W3 expand scoped SRS and get stakeholder input/persona-bridge review when available. NFR-03 remains a real gap: integration tests skip when local DB is unreachable, and CI does not provision it. Do not infer runtime success from a zero-exit all-skipped run. Later milestones: W4 architecture, W5 API drift reconciliation, W8 diagrams, W9 CI evidence.
