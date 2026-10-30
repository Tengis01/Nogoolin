# apps/mobile — FROZEN (D-11)

Native mobile (React Native + Expo) is deferred by **D-11 (2026-10-30)**. This
release ships a PWA from `apps/web` instead. The code stays here as the base
for later work, but it is not developed and is excluded from root
`build/lint/type-check/test`. It resumes only after the G7 PWA criteria are
met ([goals](../../docs/project/project-goals.md), [decisions](../../agent-context/DECISIONS.md)).

Known state when frozen: `pnpm --filter @nogoolin/mobile type-check` reports one
error (TS2786 on `Stack` in `app/_layout.tsx`), which existed before the freeze.
