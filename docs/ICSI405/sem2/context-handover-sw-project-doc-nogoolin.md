# Context Handover — Software Project Documentation (ICSI405) x Nogoolin

## Course
- "Software Project Documentation" (ICSI405), NUM, Summer 2026, lecturer Ph.D. Batnyam Battulga
- 15-week course, milestones M1–M10 (M3/M7/M10 mandatory)
- Currently: **Week 2, M2 due Friday** (SRS/SDD template + traceability matrix)

## Project pivot decision (already made)
- Seminar 1 (Week 1) work — US-1.1 (Doc Types Matrix), US-1.2 (Persona Card), US-1.3 (Before/After README audit), US-1.4 + UE-1 (Writer-in-the-Middle reflection) — was built around **rag_chatbot** (internship project). Already submitted, not being redone.
- Starting **Week 2, switching the main course project to Nogoolin** (premium religious product catalog platform, solo portfolio project — real production target: Fastify + Next.js + Supabase, Railway/Vercel, GitHub Actions CI/CD).
- Reason: Nogoolin needs far more real work, and later milestones (M4 arc42, M5 OpenAPI, M8 diagrams, M9 Docs-as-Code CI/CD) map directly onto infrastructure Nogoolin already has planned/in progress — much richer material than rag_chatbot.
- Decision: document this pivot as a short ADR-style note in this week's Scope Charter — not silently swap projects.

## Key observation / feedback given
- Nogoolin's existing Phase 0 material (**9 docs, 01–09, EN+MN, done 2026-07-05, pre-dates this course**) is a mix of business vision, persona/UX notes, and tech-stack decisions — it is **not** a clean IEEE-830 SRS. It must be **mined as source material**, not treated as SRS directly:
  - Business/vision/roadmap content → feeds the **Scope Charter** (included/excluded/postponed)
  - Tech stack choices (Fastify, Supabase, Next.js, etc.) → belongs in **SDD**, not SRS
  - Persona/UX content → feeds External Interface Requirements
  - Any requirement-like sentences → must be rewritten as testable FR/NFR (input/action/output/pass-fail boundary), not copied verbatim

## Repo structure decision
Work directly in the **Nogoolin main repo** (no separate course repo) — this repo becomes the real deliverable, useful for portfolio purposes:
```
docs/
  requirements/   ← SRS, traceability matrix, FR/NFR
  architecture/   ← arc42, C4, ADRs
  api/            ← OpenAPI spec
  diagrams/       ← PlantUML/Mermaid source
  course/         ← course-only scaffolding: persona card, quiz/retrospective answers,
                     before/after audit, peer-review draft — kept separate from real docs
```
If the course requires Confluence submission, link out to the repo rather than duplicating content there.

## Week 2 (M2) plan — 7 steps
1. **Pivot justification** — 3–4 sentences at the top of the Scope Charter explaining the rag_chatbot → Nogoolin switch
2. **Quick Nogoolin persona + 2–3 pain points** (not a full persona card redo) — needed because US-2.3 requires a requirement to trace back to a Week 1 persona pain point. Candidates pulled from Nogoolin's own `decisions.md`:
   - IDOR prevention rule (`.eq('user_id', req.user.id)` mandatory on every query)
   - Green Tara 3D asset (GLB/.riv) not ready yet — architecture built against placeholders
   - Stack pivot history (Flutter→RN Expo, Express→Fastify)
3. **US-2.1 — IEEE 830 section mapping**: map each section to `complete / planned (Wxx) / n-a (justified)`, sourced from the Phase 0 docs (01–09) + 10-roadmap.md
4. **US-2.2 — 5 requirements** (FR-XX/NFR-XX): ID, priority (must/shall/may — no "should"), named verification method (Test/Inspection/Analysis). Draft candidates: FR-01 inquiry submission, FR-02 wishlist, NFR-01 IDOR enforcement (must, Inspection), NFR-02 3D hero placeholder fallback (Test), NFR-03 CI/CD pre-deploy test gate (Inspection)
5. **US-2.3 — Traceability Matrix** (8 columns: ID, Source, Owner, Verification, Dependency, Risk, Status, Last-Reviewed) — link NFR-01 to the IDOR pain point above; link other requirements to real Nogoolin files/decisions (source column should point to actual repo files, not invented ones)
6. **UE-2 — Scope Charter** (1 page): Included (inquiry+wishlist flow, IDOR security, Docker build), Excluded (360° product viewer — justified as disproportionate effort for solo dev), Postponed (Phase 5 order/delivery, Phase 6 App Store + cloud Supabase link) — using Chinchilla's scoping reflection questions
7. **Peer review + submit before Friday** — DoD: SRS-Template published, 5 testable requirements, traceability matrix with persona link, peer-review draft sent to a neighboring team

## Next action
Pick up at step 1 or 2 — draft the pivot justification paragraph and the 2–3 Nogoolin pain points, then move into `docs/requirements/` for the IEEE 830 mapping and the 5 requirements.
