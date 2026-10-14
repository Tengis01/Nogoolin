---
name: openspec-apply-change
description: Implement tasks from an OpenSpec change. Use when the user wants to start implementing, continue implementation, or work through tasks. Also use when the user says "openspec apply", "opsx apply", or "openspec implement".
allowed-tools: Bash(openspec:*)
license: MIT
compatibility: Requires openspec CLI.
metadata:
  author: openspec
  version: "1.0"
  generatedBy: "1.13.2"
---

# Shared openspec-apply-change workflow

Before taking action, read the complete workflow in
[the canonical skill](../../../.agents/skills/openspec-apply-change/SKILL.md)
and follow it in place. This file only preserves Hermes discovery metadata;
do not maintain a second workflow body here.

Hermes invokes this skill as `/openspec-apply-change`. Canonical examples also
mention Codex's `$skill-name` form; use Hermes's slash form when displaying
invocations. Workflow scope, project/store checks and authorization boundaries
are otherwise identical. If the canonical file is unavailable, report the
missing dependency; do not guess or run a partial workflow.
