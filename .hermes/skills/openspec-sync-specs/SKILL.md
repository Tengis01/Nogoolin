---
name: openspec-sync-specs
description: Sync delta specs from an OpenSpec change to main specs. Use when the user wants to update main specs with changes from a delta spec, without archiving the change. Also use when the user says "openspec sync" or "opsx sync".
allowed-tools: Bash(openspec:*)
license: MIT
compatibility: Requires openspec CLI.
metadata:
  author: openspec
  version: "1.0"
  generatedBy: "1.13.2"
---

# Shared openspec-sync-specs workflow

Before taking action, read the complete workflow in
[the canonical skill](../../../.agents/skills/openspec-sync-specs/SKILL.md)
and follow it in place. This file only preserves Hermes discovery metadata;
do not maintain a second workflow body here.

Hermes invokes this skill as `/openspec-sync-specs`. Canonical examples also
mention Codex's `$skill-name` form; use Hermes's slash form when displaying
invocations. Workflow scope, project/store checks and authorization boundaries
are otherwise identical. If the canonical file is unavailable, report the
missing dependency; do not guess or run a partial workflow.
