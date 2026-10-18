claud

# Nogoolin — Shared agent instructions

This is the canonical project instruction file for every AI agent.
CLAUDE.md is an entry point; agent-context/ indexes evidence and history.
Follow the user's current instructions and applicable nested AGENTS.md.

## Start with a small context

1. Read [MEMORY.md](agent-context/MEMORY.md), the summary in
   [PROGRESS.md](agent-context/PROGRESS.md), and the queue plus latest dated
   entries in [TASKS.md](agent-context/TASKS.md). Do not load the full task/error
   history on every turn; search older entries only when relevant.
2. Read only the task's source files and nested instructions. For coursework,
   start at [ICSI438](https://gitlab.com/Tengis01/icsi438-nogoolin/-/blob/main/COURSE-HOME.md) and its AGENTS.md.
3. Use the owner's [AI rules](../00-Vault/AI-RULES.md),
   [workflow](../00-Vault/WORKFLOW.md) and [ignore guidance](../00-Vault/AI-IGNORE.md)
   when relevant. [Design rules](../00-Vault/DESIGN-RULES.md) are scoped defaults;
   preserve the product's approved design and the separate course PDF profile.
   If an external vault file is unavailable, report that limitation rather
   than inventing its contents.

## Choose the right source

- **Implementation facts:** inspect current source, migrations, package/lock
  files and relevant tests. A comment, roadmap, generated doc or old pass
  count alone does not prove behavior. Report commands actually run, their
  scope and limitations; never present a previous run as current verification.
- **Intended behavior:** use explicit owner decisions and the relevant specs.
  [DECISIONS.md](agent-context/DECISIONS.md) records accepted changes;
  [requirements](docs/requirements/srs-v1.0.md) and
  [architecture](docs/architecture/README.md) contain scoped course drafts.
  Preserve draft/review/planned labels; a course artifact is not automatic
  approval to change the product.
- **Legacy material:** [Phase 0](docs/phase-0/README.md) is the original design.
  Within that baseline, 07-uiux-wireframes > 02-requirements > prototype.
  Later explicit owner decisions can supersede it (e.g. D-07 defers the
  per-product 360° viewer). Never silently resolve a material spec/code conflict:
  state intended vs actual behavior and keep the unresolved gap visible.
- **History/examples:** TASKS.md, ERRORS.md, archived progress, sample code,
  seeded audit failures and OpenSpec demo proposals are not current facts or
  implementation authorization. Never invent interviews, peer feedback,
  model provenance, test results, deployments or submissions.

## Product constraints

- Finalized stack: Fastify + TypeScript API (`backend/api`, port 3001,
  `/api/v1/`); Next.js/React/Tailwind web (`apps/web`); React Native + Expo
  prebuild/CNG + dev client (`apps/mobile`, not Expo Go); Supabase
  PostgreSQL/Auth/Storage; shared Zod (`packages/validation-schemas`);
  shared types (`packages/shared-types`); pnpm workspaces. Read package and
  lock files for versions; do not assume “latest stable”. Flutter/Express
  references in older material are superseded.
- Layered monolith: Controller → Service → Repository. Validate requests
  with Zod; business logic belongs in services, DB queries in repositories.
  No raw SQL interpolation or unsolicited microservices.
- Local-first Supabase until Phase 6 (ADR-011). Do not create cloud projects
  or credentials implicitly. Vercel/Railway/EAS/Cloudflare are deployment
  targets, not evidence of live deployment. Check runtime state when needed.
- Migrations are in `supabase/migrations/`; never edit an applied migration.
  Use a new migration for schema changes. Preserve RLS and append-only
  audit logging; verify the actual schema/policies for the task.
- Keep `delivery_enabled=false` until the owner authorizes activation.
  Designed order/delivery tables do not prove checkout/API implementation;
  the current cart service is a saved list, not checkout. Gate delivery
  behavior at the service layer when implementing it.
- Before web/Three.js changes read [design.md](agent-context/design.md) and
  relevant [asset contracts](agent-context/ASSET_SPECS.md). Deity stays fixed;
  no lateral camera translation: use camera.setViewOffset with the approved
  config. Preserve v4 tokens, skip within 1 s, static fallback,
  prefers-reduced-motion and the single-row category list. Do not interpret
  reaching Phase 3 as approval to add red; D-02 remains deferred.
- Do not resolve deferred D-01…D-07 by assumption. Consult the decision log
  and report missing assets, unanswered choices or implementation gaps.

## Scope and safety

- Check Git status and preserve existing user changes. Make focused edits;
  do not force-push, reset hard, delete branches or rewrite history.
- Never read, expose, copy or commit secrets/credential/env files without
  explicit authorization, including files named as examples. Do not source
  .env for builds. Service-role credentials stay server-only; maintain the
  env template when an authorized config change requires it.
- Do not deploy, publish, submit coursework, send messages or merge/push
  without task authorization. The planned branch convention is main /
  develop / feature/*; check actual branches instead of assuming they exist.
- Use OpenSpec for substantial product features/refactors or ambiguous
  architecture/API/schema changes. Focused documentation corrections need
  no new proposal. A draft/demo proposal is not approval to implement.
- Fetch narrow current official documentation via the existing find-docs /
  Context7 workflow when a library version/API matters. Prefer local source
  for project behavior; do not install tooling implicitly.

## Commands and verification

Root package.json defines `pnpm run dev:web`, `dev:api`, `dev:mobile`,
`build`, `lint`, `type-check` and `test`; run from the repo root. Recheck
package scripts before relying on them. API has real integration tests;
web/mobile/validation-schemas test scripts currently say “no tests yet”,
and lint scripts currently perform TypeScript checks. A successful placeholder
or a skipped integration suite is not passing runtime coverage.

Run checks appropriate to the changed scope. Browser-verify UI changes and
relevant loading/empty/error/success states. For approved course PDF layouts,
follow the nested targeted-QA policy; do not generate routine screenshots.
Report unavailable checks explicitly.

## Maintain knowledge once

- Append a concise dated result and next step to TASKS.md after each task;
  record actual errors with cause/fix in ERRORS.md. These are historical logs.
- Update PROGRESS.md only when product progress actually changes. Course
  progress belongs in the existing course tracker. Keep dated evidence and
  local completion separate from publication/review/grade.
- Update the relevant domain file only when that domain changes. Link to
  canonical rules/specs instead of copying stack, status or lessons into
  multiple entry points. Do not dump chat transcripts or bulk logs.
- OpenSpec workflow bodies live in `.agents/skills/*/SKILL.md`; the matching
  `.hermes/skills/` files are discovery adapters that read those same bodies.
  Maintain the shared workflow once; preserve both tools' entry points.
