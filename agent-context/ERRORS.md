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
