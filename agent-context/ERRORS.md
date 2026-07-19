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
  then the docs/09 §4.5 RLS check query
- **Prevention:** README "Local Database" section documents the Docker
  prerequisite

**Pre-known pitfalls inherited from Phase 0 (not runtime errors, but documented
bugs to avoid):** see `design.md` §Known prototype bugs — (1) category row
wrapping, (2) lateral-camera-translate deity rotation. Both have locked
solutions; if either reproduces, log it here.
