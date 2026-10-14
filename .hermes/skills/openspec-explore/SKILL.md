---
name: openspec-explore
description: Enter OpenSpec explore mode - a thinking partner for exploring ideas, investigating problems, and clarifying requirements in a project that uses OpenSpec. Use when the user wants to think through something before or during an OpenSpec change. Also use when the user says "openspec explore" or "opsx explore".
allowed-tools: Bash(openspec:*)
license: MIT
compatibility: Requires openspec CLI.
metadata:
  author: openspec
  version: "1.0"
  generatedBy: "1.13.2"
---

# Shared openspec-explore workflow

Before taking action, read the complete workflow in
[the canonical skill](../../../.agents/skills/openspec-explore/SKILL.md)
and follow it in place. This file only preserves Hermes discovery metadata;
do not maintain a second workflow body here.

Hermes invokes this skill as `/openspec-explore`. Canonical examples also
mention Codex's `$skill-name` form; use Hermes's slash form when displaying
invocations. Workflow scope, project/store checks and authorization boundaries
are otherwise identical. If the canonical file is unavailable, report the
missing dependency; do not guess or run a partial workflow.
