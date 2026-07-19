# Tasks — Active Queue

> Kanban for what's happening in this repo right now. After EVERY task, append
> an entry to the Log below (what was done, what's next). Newest log entries
> at top.

## In Progress

*(empty)*

## Backlog (Phase 2 order)

- [ ] Web /admin: category + product management UI (uses the new API;
      single-row rule WF-HOME-01 for category display)
- [ ] Web public: product listing + detail pages (multi-script search box,
      chips, pagination — WF-LIST) wired to GET /products
- [ ] Mobile: listing + detail core screens
- [ ] Manual web-auth smoke test: signup → SQL admin promotion (docs/09 §9)
      → /admin loads (API-side RBAC now covered by integration tests)
- [ ] Merge feature branches → `main`; create `develop` branch
      (waiting for owner go-ahead — "wait user to tell" 2026-07-16)
- [ ] GitHub Projects Kanban board
- [ ] Real eslint config (lint currently aliases `tsc --noEmit`)
- [ ] Mobile: encrypted session storage (docs/08 §5.2) + native Google Sign-In

## Done

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
