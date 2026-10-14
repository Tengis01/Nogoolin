---
name: openspec-update-change
description: Update an OpenSpec change by revising its existing planning artifacts and keeping them coherent with one another. Use when the user wants to revise a change's plan, fold new decisions into it, or reconcile its artifacts after an edit. Also use when the user says "openspec update change" or "opsx update". If the user means the openspec update CLI command, which refreshes generated files, run that command instead. Never edits code.
allowed-tools: Bash(openspec:*)
license: MIT
compatibility: Requires openspec CLI.
metadata:
  author: openspec
  version: "1.0"
  generatedBy: "1.13.2"
---

# Shared openspec-update-change workflow

Before taking action, read the complete workflow in
[the canonical skill](../../../.agents/skills/openspec-update-change/SKILL.md)
and follow it in place. This file only preserves Hermes discovery metadata;
do not maintain a second workflow body here.

Hermes invokes this skill as `/openspec-update-change`. Canonical examples also
mention Codex's `$skill-name` form; use Hermes's slash form when displaying
invocations. Workflow scope, project/store checks and authorization boundaries
are otherwise identical. If the canonical file is unavailable, report the
missing dependency; do not guess or run a partial workflow.
