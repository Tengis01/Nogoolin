# Tasks — Active Queue

> Kanban for what's happening in this repo right now. After EVERY task, append
> an entry to the Log below (what was done, what's next). Newest log entries
> at top.

## In Progress

*(empty)*

## Backlog (Phase 3 order — ⚠ highest-risk phase, read design.md first)

- [ ] Green Tara GLB: Meshy AI workflow → gltf-pipeline Draco (<5MB);
      resolve D-04 composition re-tune on the real model
- [ ] Web 3D intro (WF-INTRO-01…09): state machine, 5s single arc
      (az 0.85→0, r 16→6.2, y 7.5→2.2, smootherstep), skip ≤1s, static
      fallback, reduced-motion, sessionStorage returning-visitor
- [ ] Shrinking hero morph (WF-HERO-01…08): one persistent canvas
      100vh→35vh/42vh, camera.setViewOffset (NEVER lateral translate —
      documented v4 bug), home catalog section (WF-HOME-01…04)
- [ ] 360° product viewer on detail page (drag-only, no auto-rotate;
      GLB upload endpoint /admin/products/{id}/model + admin UI)
- [ ] Mobile Rive intro (@rive-app/react-native Nitro) + transition
- [ ] Product edit page in admin (+ GET /admin/products/{id})
- [ ] Manual web-auth smoke test in browser (API RBAC covered by tests)
- [ ] Merge feature branches → `main`; create `develop` branch
      (waiting for owner go-ahead — "wait user to tell" 2026-07-16)
- [ ] Real eslint config; mobile encrypted session storage; native Google
      Sign-In (carried over)

## Done

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
  API: requireAuth/requireAdmin hooks per docs/08 §5.4 + user/audit-log
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
  files: entity + input schemas per docs/08 §7.2); `backend/api` layered
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
