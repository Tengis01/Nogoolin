# Project Instructions

## Project

Religious product catalog, admin, mobile app, and REST API for the Mongolian market.

## Read First

Read only the entries relevant to the task; start with existing project instructions/context.

- [MEMORY.md](agent-context/MEMORY.md)
- [PROGRESS.md](agent-context/PROGRESS.md)
- [TASKS.md](agent-context/TASKS.md)
- [README.md](README.md)
- [CLAUDE.md](CLAUDE.md)
- [README.md](docs/README.md)
- [package.json](package.json)
- [AI-RULES.md](../00-Vault/AI-RULES.md)
- [DESIGN-RULES.md](../00-Vault/DESIGN-RULES.md)
- [WORKFLOW.md](../00-Vault/WORKFLOW.md)
- [AI-IGNORE.md](../00-Vault/AI-IGNORE.md)

## Stack

TypeScript; Next.js/React; Tailwind; Fastify; Expo/React Native; Supabase; pnpm.

## Commands

Run from the working directory shown, relative to this project. These commands were checked against script definitions, not executed during vault setup.

| Command | Working directory | Verified source |
|---|---|---|
| `pnpm run dev:web` | `.` | [package.json](package.json) → `dev:web` |
| `pnpm run dev:api` | `.` | [package.json](package.json) → `dev:api` |
| `pnpm run dev:mobile` | `.` | [package.json](package.json) → `dev:mobile` |
| `pnpm run build` | `.` | [package.json](package.json) → `build` |
| `pnpm run lint` | `.` | [package.json](package.json) → `lint` |
| `pnpm run type-check` | `.` | [package.json](package.json) → `type-check` |
| `pnpm run test` | `.` | [package.json](package.json) → `test` |

Root `test` delegates to packages: API has a real test script; web, mobile, and validation-schemas currently use “no tests yet” placeholders. Package `lint` scripts currently perform TypeScript checks.

## Rules

- Preserve the current architecture and follow existing conventions.
- Make focused, reviewable changes; do not modify unrelated files.
- Never read, expose, copy, or commit secrets, credentials, private keys, or environment files without explicit authorization.
- Check Git status before substantial changes; preserve existing user changes. Do not force push, reset hard, delete branches, or rewrite history.
- Do not change database schemas without a proper migration where a database exists.
- Follow more specific nested instructions when working in their scope.
- Verify work before claiming completion; distinguish checks actually run from checks only documented.
- Preserve existing project-specific guidance in CLAUDE.md and authoritative specs; shared UI preferences are defaults, not a redesign mandate.
- Existing README status and course paths are stale; consult current project context and actual paths. Preserve the nested course AGENTS.md.

## Verification

Applicable configured checks: `pnpm run build` from `.`, `pnpm run lint` from `.`, `pnpm run type-check` from `.`, `pnpm run test` from `.`.

Browser-verify UI changes at relevant viewport sizes and check loading, empty, error, and success states. Report any unavailable check explicitly; do not install browser tooling implicitly.

Review the focused diff and update existing durable project knowledge only when necessary. Do not copy chat transcripts into documentation.
