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

*(no entries yet — repo is at scaffolding stage; nothing has been run)*

**Pre-known pitfalls inherited from Phase 0 (not runtime errors, but documented
bugs to avoid):** see `design.md` §Known prototype bugs — (1) category row
wrapping, (2) lateral-camera-translate deity rotation. Both have locked
solutions; if either reproduces, log it here.
