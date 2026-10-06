# ICSI438 Weekly Progress

[Home](COURSE-HOME.md) · [Roadmap](COURSE-ROADMAP.md) · [Standard](LAB-DOCUMENTATION-STANDARD.md)

## Current Status

Current seminar: Sem6 local draft бэлэн; GitLab/independent audit DoD pending.
Current topic: JSDoc/TypeDoc & AI auditing.
Last updated: 2026-10-06 (Sem6 локал багц, test/build verification).

🟡 нь локал ажил байгааг илэрхийлнэ; external DoD pending. ⬜ нь шинэ work-ийн нотолгоо байхгүй. Submission/grade unknown-ийг completed гэж өөрчлөхгүй.

## Seminar Progress

| Seminar | Topic | Status | Documentation | Main Lesson |
|---|---|---|---|---|
| 1 | Doc types, audience, curse of knowledge, writer-in-middle | 🟡 Local ready; interview/reader test/quiz/publish not done | [Sem1](sem1/README.md) | Doc ангилал ба уншигчийн зорилгыг ялгах |
| 2 | Nogoolin Scope/SRS/SDD, FR/NFR, traceability | 🟡 Draft; review/source interview pending | [Sem2](sem2/README.md) | Traceability нь source/owner/verification-тэй байх |
| 3 | 15 FR + 5 NFR, AI comparison, UE-3 | 🟡 v1.0 draft; review ба trial execution not done | [Sem3](sem3/README.md) | Implemented ≠ verified; AI prose-ийг эхээр шалгах |
| 4 | arc42/C4/3 MADR, UE-4 | 🟡 Local ready; external submission unknown | [Sem4](sem4/README.md) | Library ≠ deployable container; mapping ≠ runtime verification |
| 5 | OpenAPI3.0, code sample audit, dual renderers | 🟡 Local draft; live/public DoD pending | [Sem5](sem5/README.md) | YAML valid ≠ live example; FR-03 phone drift |
| 6 | JSDoc/TypeDoc, GitLab CI, AI audit, TODO | 🟡 Local ready; remote/independent audit/public scope pending | [Sem6](sem6/README.md) | Comment claim ≠ implementation; seeded failure ≠ observed hallucination |
| 7 | Microcopy repair | ⬜ Work not evidenced | [W07 source](COURSE-ROADMAP.md) | Roadmap-ийн тухайн section-ийг бэлтгэлд ашиглах |
| 8 | Midterm practice | ⬜ Work not evidenced | [W08 source](COURSE-ROADMAP.md) | Roadmap-ийн тухайн section-ийг бэлтгэлд ашиглах |
| 9 | M3 DoD + just enough | ⬜ Work not evidenced | [W09 source](COURSE-ROADMAP.md) | Roadmap-ийн тухайн section-ийг бэлтгэлд ашиглах |
| 10 | MkDocs/Vale/lychee CI | ⬜ Work not evidenced | [W10 source](COURSE-ROADMAP.md) | Roadmap-ийн тухайн section-ийг бэлтгэлд ашиглах |
| 11 | Maintenance DoD | ⬜ Work not evidenced | [W11 source](COURSE-ROADMAP.md) | Roadmap-ийн тухайн section-ийг бэлтгэлд ашиглах |
| 12 | Metric-choice memo | ⬜ Work not evidenced | [W12 source](COURSE-ROADMAP.md) | Roadmap-ийн тухайн section-ийг бэлтгэлд ашиглах |
| 13 | Sprint review packet | ⬜ Work not evidenced | [W13 source](COURSE-ROADMAP.md) | Roadmap-ийн тухайн section-ийг бэлтгэлд ашиглах |
| 14 | FinalPitch 12 min | ⬜ Work not evidenced | [W14 source](COURSE-ROADMAP.md) | Roadmap-ийн тухайн section-ийг бэлтгэлд ашиглах |
| 15 | 200-word reflection | ⬜ Work not evidenced | [W15 source](COURSE-ROADMAP.md) | Roadmap-ийн тухайн section-ийг бэлтгэлд ашиглах |

## This Week

### Completed

2026-10-06 Sem6-д зургаан service модулийн 44 symbol-ийн JSDoc, TypeDoc HTML/JSON,
controlled AI audit/diff/3 correction, local issue draft, GitLab CI config, standalone
source export, 5-page A4 PDF бэлдэв. Coverage 44/44, 37 snippet type-check, 9/9 tests,
warning-гүй TypeDoc build, comment-only JavaScript equivalence шалгасан. Standalone
bundle-ийн cached install/test/build мөн давсан. Remote GitLab project байхгүй.
Sem5 ба өмнөх ажлын түүхийг тус тусын README/TASKS-д хадгалсан.

### Problems

Sem1 reader/interview/quiz evidence; Sem2 review/interview; Sem3 review ба trial execution; Sem4 persona literal count ба remote submission ялгаа үлдсэн. Sem5-д live Corg.ly contract/response, audit ≥4, public хоёр URL/Swagger Try-It-Out нотолгоо дутуу; SRS FR-03 утасны дүрэм кодтой зөрсөн. Нийлмэл handout vs seminar-specific requirements-ийг багшийн actual assignment-аар тулгана. W08 retake, W15 word count wording зөрүү roadmap-д тэмдэглэгдсэн. Sem6-д GitLab pipeline/Pages/issue ID, independent manual/model comparison, real invented API discovery болон бүх repo public coverage нээлттэй; controlled fixture-ийн үр дүнг бодит AI output мэт тайлагнаагүй.

### Important Lessons

Local PDF, architecture coverage болон runtime verification тусдаа. Source/example/observed result гурвыг ялгах. OpenAPI valid гэдэг response example live гэсэн үг биш. Old coursework-ийг дахин бичих бус index хийх. Docstring-ийн return/auth/transaction claim-ийг кодтой тулгах; seeded detector test-ийг бодит hallucination audit-аас ялгах.

### Commands / Concepts Worth Remembering

[Commands](knowledge/COMMANDS.md) · [Concepts](knowledge/CONCEPTS.md) · [Troubleshooting](knowledge/TROUBLESHOOTING.md)

### Next Week

[Sem6 нээлттэй шалгуур](sem6/README.md)-ийг бодит GitLab project болон independent
review/model output бий болсон үед нөхөх. Sem7 handout-ийг эх болгож microcopy-ийн
old/new/reason бэлтгэх. Sem5-ийн өмнөх runtime/public gaps хэвээр. “Next week” нь
calendar appointment биш; огноо зохиогоогүй.
