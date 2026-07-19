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

## Phase 2 — Product System 🔄 IN PROGRESS (Week 1)

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
