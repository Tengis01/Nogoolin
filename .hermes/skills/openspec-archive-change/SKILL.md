---
name: openspec-archive-change
description: Archive a completed OpenSpec change in the experimental workflow. Use when the user wants to finalize and archive a change after implementation is complete. Also use when the user says "openspec archive" or "opsx archive".
allowed-tools: Bash(openspec:*)
license: MIT
compatibility: Requires openspec CLI.
metadata:
  author: openspec
  version: "1.0"
  generatedBy: "1.13.2"
---

# Shared openspec-archive-change workflow

Before taking action, read the complete workflow in
[the canonical skill](../../../.agents/skills/openspec-archive-change/SKILL.md)
and follow it in place. This file only preserves Hermes discovery metadata;
do not maintain a second workflow body here.

Hermes invokes this skill as `/openspec-archive-change`. Canonical examples also
mention Codex's `$skill-name` form; use Hermes's slash form when displaying
invocations. Workflow scope, project/store checks and authorization boundaries
are otherwise identical. If the canonical file is unavailable, report the
missing dependency; do not guess or run a partial workflow.
