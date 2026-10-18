# Nogoolin documentation — Document Register

**Doc ID:** DOC-00 · **Хувилбар:** v1.0 draft · **Огноо:** 2026-10-18 · **Owner:** Тэнгис

Энэ бол төслийн бүх **албан ёсны баримтын** нэгдсэн бүртгэл. Хичээлийн (ICSI438) хувилбар бүр нь [icsi438-nogoolin](https://gitlab.com/Tengis01/icsi438-nogoolin) repo-д `semN_merged.pdf` хэлбэрээр хэвээр үлдэнэ. Харин төслийн хүчинтэй хувилбар нь **зөвхөн энд** бүртгэгдэнэ.

## Ойлголтын ялгаа

- **Шаардлага** гэдэг нь систем юу хийх, ямар чанартай байхыг заасан нэг, шалгаж болох өгүүлбэр. Шаардлага нь [SRS v2](requirements/srs-v2.md) дотор ID-тайгаар амьдарна.
- **Баримт** гэдэг нь тодорхой уншигчид зориулсан бичвэр (SRS, arc42, API spec, тест төлөвлөгөө, runbook гэх мэт). SRS бол олон баримтын зөвхөн нэг нь.
- **Шаардлагын ойлгомжтой байдал** нь нэг л утгаар уншигдах (unambiguous) гэсэн үг. Үүнийг [SRS v2-ийн 5 шалгуураар](requirements/srs-v2.md#7-шаардлагын-чанарын-шалгалт) шалгана.
- **Баримтын ойлгомжтой байдал** нь бүтэц, уншигч, нэр томьёо, навигаци, уншихад хялбар байдал юм. Үүнийг доорх [баримтын checklist](#баримтын-ойлгомжтой-байдлын-checklist)-ээр шалгана.

## Бүртгэл

**Төрөл** баганыг W01-ийн баримтын ангиллаар бөглөнө: User / Developer / Operations / Process.

**Төлөв:**

| Төлөв | Утга |
|---|---|
| draft | Бичигдсэн, review хийгдээгүй |
| review | Review хийгдэж байгаа |
| approved | Owner баталсан |
| legacy | Эх материал болж үлдсэн, орлогдсон |
| planned | Байхгүй, бичигдэхээр төлөвлөсөн |

### Project — `project/`

| Doc ID | Нэр | Төрөл | Уншигч | Хувилбар | Төлөв | Эх семинар | Байршил |
|---|---|---|---|---|---|---|---|
| PRJ-01 | Төслийн зорилго (SMART) | Process | Owner, багш | v0.1 | draft | Төслийн менежмент | [project/project-goals.md](project/project-goals.md) |
| PRJ-02 | Roadmap v2 (PH0–PH8) | Process | Owner, багш | v0.1 | draft | Төслийн менежмент | [project/roadmap.md](project/roadmap.md) |
| PRJ-03 | Vision | Process | Бүгд | 1.4.0 | legacy (эх) | — | [phase-0/01-vision.md](phase-0/01-vision.md) |
| PRJ-04 | Master plan | Process | AI agent, хөгжүүлэгч | — | legacy | — | [premium_religious_product_platform_master_plan.md](premium_religious_product_platform_master_plan.md) |
| PRJ-05 | Шийдвэрийн бүртгэл (ADR, D-xx) | Developer | Хөгжүүлэгч | append-only | approved | Sem4 | [../agent-context/DECISIONS.md](../agent-context/DECISIONS.md) |
| PRJ-06 | Stakeholder ба persona | Process | Owner, багш | — | planned | Sem1 W01–W02, Sem2 | `project/stakeholders.md` (эх: [persona-and-pivot](https://gitlab.com/Tengis01/icsi438-nogoolin/-/blob/main/sem2/wiki/persona-and-pivot.md)) |
| PRJ-07 | Sprint review / metric memo | Process | Багш | — | planned | W12, W13 | `project/` |

### Requirements — `requirements/`

| Doc ID | Нэр | Төрөл | Уншигч | Хувилбар | Төлөв | Эх семинар | Байршил |
|---|---|---|---|---|---|---|---|
| REQ-01 | **SRS v2** (ISO/IEC/IEEE 29148) | Developer | Хөгжүүлэгч, тестер, багш | v2.0 | draft | Sem3 | [requirements/srs-v2.md](requirements/srs-v2.md) |
| REQ-02 | Traceability v2 | Developer | Хөгжүүлэгч, тестер | v2.0 | draft | Sem2–3 | [requirements/traceability-v2.md](requirements/traceability-v2.md) |
| REQ-03 | Хуучин → шинэ ID mapping | Developer | Хөгжүүлэгч | v2.0 | draft | — | [requirements/id-mapping.md](requirements/id-mapping.md) |
| REQ-04 | Scope Charter | Process | Owner, багш | v0.2 | legacy (SRS v2 §1.3 орлосон) | Sem2 | [requirements/scope-charter.md](requirements/scope-charter.md) |
| REQ-05 | SRS v1.0 (15 FR + 5 NFR) | Developer | — | v1.0 | legacy | Sem3 | [requirements/srs-v1.0.md](requirements/srs-v1.0.md) |
| REQ-06 | M2-ын 5 шаардлага | Developer | — | v0.1 | legacy | Sem2 | [requirements/requirements.md](requirements/requirements.md) |
| REQ-07 | Traceability v1.0 / M2 | Developer | — | v1.0 / v0.2 | legacy | Sem2–3 | [v1.0](requirements/traceability-matrix-v1.0.md), [M2](requirements/traceability-matrix.md) |
| REQ-08 | SRS загвар | Process | Баримт бичигч | v0.2 | approved | Sem2 | [requirements/srs-template.md](requirements/srs-template.md) |
| REQ-09 | Phase 0 шаардлага (118 FR + 59 NFR) | Developer | — | — | legacy (эх) | — | [phase-0/02-requirements.md](phase-0/02-requirements.md) |
| REQ-10 | Use case | Developer | Хөгжүүлэгч | — | legacy (эх) | — | [phase-0/03-use-cases.md](phase-0/03-use-cases.md) |

### Architecture — `architecture/`

| Doc ID | Нэр | Төрөл | Уншигч | Хувилбар | Төлөв | Эх семинар | Байршил |
|---|---|---|---|---|---|---|---|
| ARC-01 | arc42 + C4 | Developer | Хөгжүүлэгч, reviewer | v0.1 | draft (PH2-т D-08/SRS v2-тай нийцүүлнэ) | Sem4 | [architecture/arc42-nogoolin.md](architecture/arc42-nogoolin.md) |
| ARC-02 | MADR (ADR-003, 005, 007, IF-01) | Developer | Хөгжүүлэгч | — | draft | Sem4 | [architecture/README.md](architecture/README.md) |
| ARC-03 | Architecture traceability | Developer | Хөгжүүлэгч | — | draft | Sem4 | [architecture/architecture-traceability.md](architecture/architecture-traceability.md) |
| ARC-04 | SDD загвар | Process | Баримт бичигч | v0.2 | approved | Sem2 | [architecture/sdd-template.md](architecture/sdd-template.md) |
| ARC-05 | ER, sequence диаграм | Developer | Хөгжүүлэгч | — | legacy (эх) | — | [diagrams/README.md](diagrams/README.md), [phase-0/04](phase-0/04-er-diagram.md), [phase-0/05](phase-0/05-sequence-diagrams.md) |
| ARC-06 | Security design | Developer | Хөгжүүлэгч | — | legacy (эх) | — | [phase-0/08-security.md](phase-0/08-security.md) |

### Design — `design/`

| Doc ID | Нэр | Төрөл | Уншигч | Хувилбар | Төлөв | Эх семинар | Байршил |
|---|---|---|---|---|---|---|---|
| DES-01 | Design reference v4 | Developer | Хөгжүүлэгч | v4 | legacy (D-08-аар орлогдсон, production-д хүчинтэй) | — | [../agent-context/design.md](../agent-context/design.md) |
| DES-02 | Prototype C (үндсэн чиглэл) | User/Developer | Owner, хөгжүүлэгч | — | approved (D-08) | — | [nogoolin-prototype-c.html](nogoolin-prototype-c.html) |
| DES-03 | Wireframe v1 (WF-*) | Developer | Хөгжүүлэгч | 1.0.0 | legacy (v2 нь PH2-т) | — | [phase-0/07-uiux-wireframes.md](phase-0/07-uiux-wireframes.md) |
| DES-04 | DESIGN.md (C token шатлал) | Developer | Хөгжүүлэгч | — | planned (PH2) | — | `design/DESIGN.md` |
| DES-05 | Component contract | Developer | Хөгжүүлэгч | — | planned (PH2) | — | `design/components.md` |
| DES-06 | Microcopy guide | User/Developer | Хөгжүүлэгч | — | planned | W07 | `design/microcopy.md` |
| DES-07 | Prototype A, B | — | — | — | legacy | — | [A](nogoolin-prototype-a-v4.html), [B](nogoolin-prototype-b-codex.html) |

### API — `api/`

| Doc ID | Нэр | Төрөл | Уншигч | Хувилбар | Төлөв | Эх семинар | Байршил |
|---|---|---|---|---|---|---|---|
| API-01 | OpenAPI (Phase 0) | Developer | Хөгжүүлэгч, client | — | legacy (одоогийн contract) | — | [phase-0/06-api-spec.yaml](phase-0/06-api-spec.yaml) |
| API-02 | OpenAPI 3 (бодит route-тай нийцсэн) | Developer | Хөгжүүлэгч, client | — | planned (PH2; эх нь Sem5-ийн 5 route) | Sem5 | `api/openapi.yaml` (эх: [sem5/openapi](https://gitlab.com/Tengis01/icsi438-nogoolin/-/blob/main/sem5/openapi/openapi.yaml)) |
| API-03 | API workspace тэмдэглэл | Developer | Хөгжүүлэгч | — | draft | Sem5 | [api/README.md](api/README.md) |

### Developer — `developer/`

| Doc ID | Нэр | Төрөл | Уншигч | Хувилбар | Төлөв | Эх семинар | Байршил |
|---|---|---|---|---|---|---|---|
| DEV-01 | Agent/хөгжүүлэгчийн дүрэм | Developer | AI agent, хөгжүүлэгч | — | approved | — | [../AGENTS.md](../AGENTS.md) |
| DEV-02 | Code reference (TypeDoc, JSDoc) | Developer | Хөгжүүлэгч | — | planned (эх нь Sem6) | Sem6 | `developer/` (эх: [sem6/api-reference](https://gitlab.com/Tengis01/icsi438-nogoolin/-/blob/main/sem6/api-reference.md)) |
| DEV-03 | Local setup / contributing | Developer | Шинэ хөгжүүлэгч | — | planned | W11 | `developer/setup.md` |

### Quality — `quality/`

| Doc ID | Нэр | Төрөл | Уншигч | Хувилбар | Төлөв | Эх семинар | Байршил |
|---|---|---|---|---|---|---|---|
| QA-01 | Тестийн стратеги, төлөвлөгөө, S1–S4 | Process | Хөгжүүлэгч, тестер | — | planned (PH6; QA хичээлийн агуулга ирэхэд) | QA хичээл | `quality/test-plan.md` |
| QA-02 | Usability protocol | Process | Тестер | — | planned | — | `quality/usability-protocol.md` |
| QA-03 | Perf baseline (raw sample) | Developer | Хөгжүүлэгч | — | planned (PH2) | — | `quality/perf-baseline.md` |
| QA-04 | Docs CI (mkdocs, Vale, lychee) | Developer | Хөгжүүлэгч | — | planned | W10 | `mkdocs.yml`, CI |

### Operations — `operations/`

| Doc ID | Нэр | Төрөл | Уншигч | Хувилбар | Төлөв | Эх семинар | Байршил |
|---|---|---|---|---|---|---|---|
| OPS-01 | Deployment design | Operations | Хөгжүүлэгч | — | legacy (эх) | — | [phase-0/09-deployment.md](phase-0/09-deployment.md) |
| OPS-02 | Runbook (deploy, rollback, нууц утгын дүрэм) | Operations | Operator | — | planned (PH7) | W11 | `operations/runbook.md` |

### Лавлах эх (хичээлийн гаралт биш)

| Эх | Ашиглах газар |
|---|---|
| Owner-ийн vault `00-Vault/ADVANCED-WEB-GUIDE.md` (ICSI496-аас гаргасан инженерийн дүрэм, repo-оос гадуур) | SRS v2 NFR, PH5/PH6 review checklist. Лабын файл төсөлд үүсгэхгүй. |

## Хичээлийн ажил → албан ёсны баримт

| Хичээлийн ажил (ICSI438) | Албан ёсны баримт |
|---|---|
| Sem1 W01: баримтын төрөл, persona, curse of knowledge | Бүртгэлийн «Төрөл», «Уншигч» багана. PRJ-06 (planned). Sem1 нь өөр төсөл (RAG chatbot) дээр хийгдсэн тул зөвхөн аргачлалыг авна. |
| Sem2: scope charter, SRS/SDD загвар, 5 шаардлага, traceability | REQ-04, REQ-08, ARC-04. Шаардлагууд нь REQ-01-д шилжсэн (REQ-03-ийн mapping). |
| Sem3: SRS v1.0 | REQ-01 SRS v2. v1.0 нь REQ-05 legacy. |
| Sem4: arc42, C4, MADR | ARC-01…ARC-03 |
| Sem5: OpenAPI 3.0 | API-02 (planned) |
| Sem6: GitLab, TypeDoc/JSDoc | DEV-02 (planned) |
| W07 microcopy | DES-06 (planned) |
| W09 DoD update | Roadmap v2-ийн phase DoD |
| W10 mkdocs/Vale/lychee | QA-04. Хавтасны бүтэц нь mkdocs nav-д шууд тохирно. |
| W11 maintenance | DEV-03, OPS-02 |
| W12–W13 metric memo, sprint review | PRJ-07 |

## Баримтын ойлгомжтой байдлын checklist

Баримт бүрийг «approved» болгохоос өмнө шалгана. Энэ нь шаардлагын 5 шалгуураас тусдаа.

- [ ] Эхэнд Doc ID, уншигч, хувилбар, огноо, owner, төлөв байна.
- [ ] Эхний догол мөрөнд энэ баримт юуны тухай, хэнд зориулсныг хэлсэн.
- [ ] Нэр томьёо баримт даяар нэг утгатай. Phase нь `PH`, алдааны түвшин нь `S1–S4`, priority нь MoSCoW.
- [ ] Гарчгийн шатлал логик. Урт баримт агуулгын хүснэгттэй.
- [ ] Дотоод холбоос эвдрэлгүй (lychee эсвэл script).
- [ ] Хэмжээгүй, review хийгээгүй зүйлийг хийсэн гэж бичээгүй.
- [ ] Эх сурвалж болон орлосон хувилбарыг заасан.

## Хавтасны бүтэц

```
docs/
  README.md        ← энэ бүртгэл
  project/         зорилго, roadmap, stakeholder
  requirements/    SRS v2, traceability, mapping (+ legacy v1.0, M2)
  architecture/    arc42, ADR, C4
  design/          DESIGN.md, components, microcopy, wireframe v2   (planned)
  api/             OpenAPI
  developer/       code reference, setup                             (planned)
  quality/         тест, usability, perf                             (planned)
  operations/      runbook                                           (planned)
  phase-0/         legacy эх материал (01–10, EN/MN). Холбоосыг эвдэхгүйн тулд байранд нь үлдээв.
```

Хуучин баримтуудын 360° viewer, email талбар, cloud, stack-ийн тайлбарыг [шийдвэрүүд](../agent-context/DECISIONS.md) болон бодит кодтой тулгаж уншина.
