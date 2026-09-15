# Errors Log

> Running log of every error/bug hit during development: what broke, root
> cause, fix applied. Append newest first. Keep entries short and factual —
> this file exists so the same bug is never debugged twice.

**Entry template:**

```markdown
### YYYY-MM-DD — <one-line summary>
- **Where:** file/command/service
- **Symptom:** what broke / exact error message
- **Root cause:** why it happened
- **Fix:** what was changed (commit if applicable)
- **Prevention:** rule or check that stops recurrence (if any)
```

---

### 2026-07-26 — profile save confirmation never appeared (stale-prop dirty check) (fixed)
- **Where:** `apps/web/src/components/public/profile-form.tsx` — found by the
  Phase 4 UI E2E, not by reading the code.
- **Symptom:** saving the profile name succeeded server-side, but the
  "✓ Хадгаллаа" confirmation never rendered and the Save button stayed enabled,
  inviting a pointless re-save.
- **Root cause:** `dirty` was computed as `name !== initialName`, where
  `initialName` is a PROP from the server render. It does not change after a
  client-side save, so `dirty` stayed `true` forever; the success line was
  gated on `saved && !dirty`, which could therefore never be true.
- **Fix:** the dirty baseline is now component STATE, updated to the saved
  value on success (so the form becomes clean), plus `router.refresh()` so the
  server-rendered page heading picks up the new name.
- **Prevention:** a "dirty since last save" check must compare against the
  last SAVED value held in state — never against an initial prop, which is a
  snapshot of the last server render.

### 2026-07-26 — `next build` fails when the root `.env` is sourced (env footgun)
- **Where:** `pnpm --filter @nogoolin/web build` after
  `set -a && source .env && set +a` (the local dev workflow).
- **Symptom:** build dies with `<Html> should not be imported outside of
  pages/_document` while prerendering `/404`, plus a "non-standard NODE_ENV"
  warning. Looks like a code bug; is not.
- **Root cause:** the root `.env` sets `NODE_ENV=development` (correct for the
  API and `next dev`). `next build` requires `NODE_ENV=production` — with
  `development` it takes a fallback error-page path that throws.
- **Fix:** none needed in code — run `pnpm --filter @nogoolin/web build`
  WITHOUT sourcing `.env` (Next reads `.env` itself for `NEXT_PUBLIC_*`).
  Verified: identical tree builds clean in the same session.
- **Prevention:** only source `.env` for `dev`/test commands, never for
  `build`. If it keeps biting, drop `NODE_ENV` from `.env` (both the API's Zod
  config and `next dev` already default to development).

### 2026-07-26 — rate-limit responses returned HTTP 500 instead of 429 (fixed)
- **Where:** `backend/api/src/app.ts` global `setErrorHandler`; surfaced by
  the new `POST /inquiries` 3/hr rate-limit test (Phase 4).
- **Symptom:** the request that exceeds the limit returned `500 {code:INTERNAL}`
  instead of `429 {code:RATE_LIMIT_EXCEEDED}`.
- **Root cause:** `@fastify/rate-limit` **throws** the `errorResponseBuilder`
  return value (`{error, code}`) as the error and sets 429 on the *reply*, not
  on the error object. The error handler only checked `err.statusCode` (absent
  here), so it fell through to the 500 branch. **Pre-existing latent bug** — the
  global 100/15min limit would have 500'd too; it had simply never been hit in a
  test.
- **Fix:** added a branch to `setErrorHandler` that maps
  `err.code === 'RATE_LIMIT_EXCEEDED'` (or `reply.statusCode === 429`) to the
  proper `429 {code:'RATE_LIMIT_EXCEEDED'}` envelope. Verified: 34/34 API tests
  green including the new rate-limit test.
- **Prevention:** any plugin that signals a client error via `reply.statusCode`
  (rather than `err.statusCode`) needs explicit handling in the central error
  handler — don't assume thrown values are `Error`s with `statusCode`.

### 2026-07-26 — migration 0006_table_grants.sql is EMPTY (0 bytes) — reset unsafe (flagged)
- **Where:** `supabase/migrations/20260719104500_table_grants.sql`.
- **Symptom:** the file is 0 bytes on disk AND in git HEAD, yet its version row
  exists in `supabase_migrations.schema_migrations` and the commit message
  (`92a99e8`) claims it adds table grants. ERRORS.md 2026-07-19 records that the
  grants + `ALTER DEFAULT PRIVILEGES` were applied to the *running* DB manually
  (via `cat file | docker exec psql` + manual version insert) — they never made
  it into the file.
- **Impact:** the running local DB has grants (works today), but a fresh
  `supabase db reset` would recreate every table WITHOUT DML grants for
  anon/authenticated/service_role → the API would 42501 (the exact bug 0006 was
  meant to fix). Not hit day-to-day because nobody resets the local stack.
- **Mitigation applied:** migration 0007 (this task) grants its OWN new objects
  explicitly (`cart_items` + re-asserts `inquiries` grants), so the Phase-4
  surface is reset-safe regardless. The broader gap (grants for the other 10
  tables) is NOT fixed here.
- **Next action (owner decision):** either backfill the empty 0006 file (murky —
  it's an "applied" migration, though it never had content) OR add a new
  migration that re-declares grants + `ALTER DEFAULT PRIVILEGES` for all tables
  so resets reproduce the DB. Recommend the latter (append-only-clean).

### 2026-07-20 — `docker compose up --build` never actually worked (3 bugs, fixed)
- **Where:** `.dockerignore`, `backend/api/Dockerfile`,
  `backend/api/src/lib/supabase.ts` — found while adding a `web` service
  and actually running `docker compose up --build` for the first time
  (previously only `pnpm --filter @nogoolin/api dev` on the host had been
  verified; the Docker path was written but never run to completion).
- **Bug 1 — Symptom:** `web` build failed, `"/apps/web": not found`.
  **Root cause:** `.dockerignore` blanket-excluded `apps` (written when
  only `backend/api` had a Dockerfile). **Fix:** narrowed to `apps/mobile`
  only.
- **Bug 2 — Symptom:** `api` image build failed at `tsc -p tsconfig.json`
  — `error TS5083: Cannot read file '/app/tsconfig.base.json'`.
  **Root cause:** the Dockerfile's manifest-COPY layer never copied the
  root `tsconfig.base.json` that `backend/api/tsconfig.json` (and
  `apps/web/tsconfig.json`) extend. Invisible locally because `tsc` there
  resolves it straight off the host filesystem. **Fix:** added
  `tsconfig.base.json` to the COPY line in both `backend/api/Dockerfile`
  and the new `apps/web/Dockerfile`.
- **Bug 3 — Symptom:** `api` container crashed at startup:
  `Error: Node.js detected but native WebSocket not found` from
  `@supabase/supabase-js`'s realtime-js, thrown unconditionally inside
  `createClient()`. **Root cause:** the API image is pinned to
  `node:20-alpine` (NFR-MAIN-006, locked); native `WebSocket` only landed
  in Node 22. The host's `pnpm dev` never hit this because the dev shell
  uses Node 24 (nvm) — Docker was the only place running actual Node 20.
  This app never uses Supabase Realtime. **Fix:** added `ws` as a
  dependency and polyfilled `globalThis.WebSocket` (only when absent) in
  `lib/supabase.ts`, before any `createClient()` call — no Node-version or
  architecture change.
- **Verified:** full `docker compose up --build` — both images build,
  both containers start clean, `curl :3001/api/v1/health` and
  `:3001/api/v1/categories` return real data, web responds 200 on both
  `localhost:3000` and the LAN IP, API log lines confirm
  `http://192.168.1.10:3001` alongside localhost.
- **Prevention:** the `docker-build` CI job (added in the earlier
  Docker/CI-scaffolding session) only builds the image — it never starts
  the container, so bug 3 wouldn't have been caught by it either.
  Worth adding a container-smoke-test step in Phase 6 CI.

### 2026-07-20 — apps/mobile type-check fails via workspace-wide `@types/react` leak (NOT FIXED — logged, out of scope)
- **Where:** `pnpm -r type-check` → `apps/mobile` → `app/_layout.tsx(19,8)`
  (`Stack` "cannot be used as a JSX component" / `bigint not assignable to
  ReactNode`)
- **Symptom:** mobile's own `package.json` pins `@types/react: ~18.3.12`
  and its local `node_modules/@types/react` correctly resolves to
  `18.3.31`, yet TypeScript's error trace points at
  `.pnpm/@types+react@19.2.17/.../react/index` — a version mobile never
  declared. Only surfaces when type-checking the WHOLE workspace
  (`pnpm -r type-check`); `apps/web`, `backend/api`, and
  `validation-schemas` each type-check clean standing alone.
- **Root cause:** not simple hoisting — there is no `@types/react` at the
  workspace root `node_modules`, so pnpm's usual isolation is intact; some
  transitive resolution path (candidate: `expo-router` → `react-helmet-async`,
  which peer-warns for react-dom 18 while the workspace has 19 installed
  for `apps/web`) pulls the 19.x types package into mobile's TS program.
  Bisected to first appear at commit `a9b07c6` (added
  `three`/`@react-three/fiber`/`@react-three/drei`, and therefore
  `react@19`/`react-dom@19`, to `apps/web`) — confirmed via `git stash` +
  re-run against the pre-session HEAD (`151cd3c`), where it already fails
  identically. **Verified NOT a regression from this session's edits.**
- **Fix:** none applied — explicitly out of scope for `chore/phase3-closeout`
  ("Do NOT touch mobile/Rive in this task"). Mobile code and dependencies
  were untouched this session.
- **Prevention / next action:** whoever next touches `apps/mobile`
  (the queued Rive-intro task is the natural point) should resolve this
  before adding more mobile code — likely candidates: pin/override
  `@types/react` via `pnpm.overrides` at the workspace root, or isolate
  mobile further from the web/api dependency graph. Until then, treat
  `pnpm --filter @nogoolin/mobile type-check` (run in isolation) as the
  reliable signal for mobile, not the `pnpm -r` aggregate.

### 2026-07-20 — 1-frame 0-height flash at morph→home boundary (fixed)
- **Where:** hero container in apps/web/src/components/intro/hero-intro.tsx
- **Symptom:** E2E rAF trace showed height 900→…→315→**0**→315 — a
  one-paint collapse (visible pop) exactly when the morph completed
- **Root cause:** container height was owned by TWO writers — the rAF morph
  driver (inline style) and the React style prop (`height: undefined` in
  the home branch). The phase='home' re-render re-applied the style prop,
  wiping the inline height for one paint before the home effect re-set it
- **Fix:** `height` removed from the React style prop entirely (className
  h-screen for initial paint); all height writes are imperative in one
  place (phase effect + morph driver + home pin). E2E re-run: 0 deviation
- **Prevention:** any style property animated imperatively must NEVER also
  appear in the element's React style prop — single-writer rule

### 2026-07-19 — 404 pages returned HTTP 200 (streaming + loading.tsx) (fixed)
- **Where:** /products/[slug] for unknown/draft slugs (public catalog)
- **Symptom:** not-found UI rendered but HTTP status was 200 — bad for SEO
  (crawlers would index 404 pages) and violated the API's 404 contract
- **Root cause:** `app/products/loading.tsx` created a Suspense boundary
  wrapping the `[slug]` CHILD segment too; Next streamed a 200 shell before
  `notFound()` threw inside the suspended boundary
- **Fix:** moved listing page + loading.tsx into a route group
  `app/products/(list)/` so the skeleton boundary applies to the listing
  only; verified 404 for unknown AND draft slugs afterwards
- **Prevention:** loading.tsx applies to all child segments — scope it with
  a route group whenever a sibling dynamic segment relies on notFound()

### 2026-07-19 — Next.js webpack can't resolve shared package's .js specifiers (fixed)
- **Where:** apps/web build after importing RUNTIME schemas from
  @nogoolin/validation-schemas (type-only imports had worked — they erase)
- **Symptom:** `Module not found: Can't resolve './media.schema.js'`
- **Root cause:** the shared package uses NodeNext `.js` import specifiers
  (required by the API's tsc); webpack doesn't apply TS's js→ts mapping
- **Fix:** `config.resolve.extensionAlias = { '.js': ['.ts', '.js'] }` in
  apps/web/next.config.ts webpack hook
- **Prevention:** any new consumer bundler of the shared packages needs the
  same alias (metro for mobile may need equivalent when it imports runtime
  schemas)

### 2026-07-19 — Supabase CLI targets dead Docker Desktop socket (workaround)
- **Where:** `pnpm exec supabase start` / all supabase CLI docker commands
- **Symptom:** "Cannot connect to the Docker daemon at
  unix:///home/tengis/.docker/desktop/docker.sock" although `docker` works
- **Root cause:** docker context is `desktop-linux` (Docker Desktop, not
  running); the actual engine listens on /var/run/docker.sock
- **Fix:** prefix supabase CLI calls with
  `DOCKER_HOST=unix:///var/run/docker.sock` (or `docker context use default`)
- **Prevention:** noted here + use the DOCKER_HOST prefix in docs/scripts

### 2026-07-19 — config.toml bucket insert broke TOML parsing (fixed)
- **Where:** `supabase/config.toml` [storage] section
- **Symptom:** "toml: key file_size_limit is already defined" after start
- **Root cause:** bucket tables were inserted BEFORE the template's stray
  `file_size_limit = "50MiB"` line, which TOML then attributed to the last
  bucket table (duplicate key)
- **Fix:** moved the scalar keys above the [storage.buckets.*] tables
- **Prevention:** when inserting TOML tables, always append after ALL scalar
  keys of the parent table

### 2026-07-19 — API roles missing DML grants on migration-created tables (fixed)
- **Where:** service_role UPDATE on public.users → "permission denied"
- **Symptom:** PostgREST 42501 despite service_role's RLS bypass
- **Root cause:** current supabase CLI Postgres image does not grant
  SELECT/INSERT/UPDATE/DELETE to anon/authenticated/service_role on tables
  created via migrations (only TRUNCATE/REFERENCES/TRIGGER present)
- **Fix:** migration 0006_table_grants — explicit grants + ALTER DEFAULT
  PRIVILEGES; RLS remains the enforcement layer (grants are the ceiling)
- **Prevention:** any new schema/table must be covered by the default
  privileges (already handled by 0006)

### 2026-07-19 — `supabase migration up` hung; silent psql stdin no-op (fixed)
- **Where:** applying migration 0006 to the running local DB
- **Symptom:** CLI command timed out at 2 min; then
  `docker exec -i psql < file` reported nothing and did NOT apply
- **Root cause:** CLI hang unexplained (likely docker socket probing); the
  redirect variant silently failed under the sandboxed shell
- **Fix:** `cat file | docker exec -i ... psql` applied it; version row
  inserted into supabase_migrations.schema_migrations manually to keep
  history consistent (verified via pg_class relacl)
- **Prevention:** after applying grants/migrations manually, ALWAYS verify
  effect via a direct query, not by absence of errors

### 2026-07-17 — Type-check failures during web/mobile init (fixed)
- **Where:** `apps/web/src/lib/supabase/server.ts` + `src/middleware.ts`;
  `apps/mobile/lib/supabase.ts`
- **Symptom:** TS7006/TS7031 implicit-any on @supabase/ssr `setAll` cookie
  callbacks; TS2580 `Cannot find name 'process'` in mobile
- **Root cause:** @supabase/ssr 0.6 doesn't infer callback param types under
  `strict`; mobile package lacked `@types/node` for `process.env`
- **Fix:** explicit `CookieToSet[]` param types; added `@types/node` to
  apps/mobile devDependencies. `pnpm -r type-check` green after
- **Prevention:** run `pnpm -r type-check` before every commit touching TS

### 2026-07-16 — Could not verify migrations: Docker daemon not running
- **Where:** `pnpm exec supabase start` prerequisite check (local machine)
- **Symptom:** `failed to connect to the docker API at
  unix:///home/tengis/.docker/desktop/docker.sock` — Docker Desktop installed
  but daemon not running
- **Root cause:** Docker Desktop was not started; Supabase local stack needs it
- **Fix:** none applied automatically (starting system services left to the
  owner). To verify: start Docker Desktop, then `pnpm exec supabase start`,
  then the docs/phase-0/09 §4.5 RLS check query
- **Prevention:** README "Local Database" section documents the Docker
  prerequisite

**Pre-known pitfalls inherited from Phase 0 (not runtime errors, but documented
bugs to avoid):** see `design.md` §Known prototype bugs — (1) category row
wrapping, (2) lateral-camera-translate deity rotation. Both have locked
solutions; if either reproduces, log it here.


### 2026-09-15 — Documentation consolidation QA
- **Broken MN source links:** Full link validation found 16 existing links using `.mn.md` where the actual Phase 0 filename uses `_mn.md`. Fixed the targets to the existing files after relocation; no translated content was rewritten.
- **Initial PDF layout:** One SDD paragraph overflowed by about 4 pt; the SRS ending paragraph created an almost-empty third page. Shortened the SDD sentence, removed redundant SRS planning text already covered in the mapping, and added section-aware page breaks. Rebuilt and visually reviewed the final PDFs; no overflow/missing glyphs remain.
- **Unresolved product gap, documented only:** API integration suites skip when local Supabase is unavailable, while the CI workflow lacks DB setup. NFR-03 specifies a real pre-deploy gate including all-skipped failure; implementation/evidence deferred to W9. No CI or application logic changed in this documentation task.


### 2026-09-15 — TeX save/compile workflow
- **Issue:** Seminar 2 lacked a LaTeX Workshop recipe, and the original build.py unconditionally regenerated TeX from Markdown, risking loss of manual edits.
- **Fix:** Added onSave settings, a focused workspace and .latexmkrc; build.py now compiles existing TeX by default and only regenerates with --from-markdown. Existing TeX hashes were preserved.
- **Environment observation:** The login shell prints a pre-existing missing `/home/tengis/.deno/env` warning from .bashrc/.bash_profile. It did not affect successful latexmk compilation; shell configuration was outside this task and was not changed.
