# ICSI438 Course Roadmap

[Home](COURSE-HOME.md) · [Progress](WEEKLY-PROGRESS.md)

## Эх ба хэрэглээ

A = [W01–W10](lecture/Lab-Handouts%20W01%20-%20W10%20Software%20Project%20Documentation%20%281%29.pdf); B = [W11–W15](lecture/Lab-Handouts%20W11%20-%20W15%20Software%20Project%20Documentation.pdf). Доорх хуудас нь PDF viewer-ийн 1-based page. Эдгээр нь supplied handout-ийн хүлээлт; стандартын clause, tool command, rubric нь бие даан authoritative/current гэж батлагдаагүй.

Existing `sem1`–`sem4` нь илүү дэлгэрэнгүй тусгай handout-аар хийсэн ажил. A-ийн W01 User/Developer/Operations/Process ангиллыг Sem1-ийн Getting Started/Tutorial/Reference/API-тай адилтгахгүй. Week дугаар, seminar deliverable, бүтээгдэхүүний milestone/phase-ийг тусад нь хадгална. Completion нь file байгаа биш, шаардлага + verification + submission нотолгоо.

## Checklist

- [ ] W01 — Doc Types Ethnography — [existing Sem1](sem1/README.md), local материал бэлэн; бүх DoD батлагдаагүй
- [ ] W02 — IEEE 830 vs ISO 29148 — [existing Sem2](sem2/README.md), local материал бэлэн; бүх DoD батлагдаагүй
- [ ] W03 — Rinzler Method — story → testable FR — [existing Sem3](sem3/README.md), local материал бэлэн; бүх DoD батлагдаагүй
- [ ] W04 — arc42 Bausteine Map — [existing Sem4](sem4/README.md), local материал бэлэн; бүх DoD батлагдаагүй
- [ ] W05 — OpenAPI 3.0 Mini-Spec — [Sem5 local draft; live/public DoD pending](sem5/README.md)
- [ ] W06 — Docstrings + Ethics
- [ ] W07 — Microcopy Repair
- [ ] W08 — Midterm Practice
- [ ] W09 — M3 DoD Update + Just-Enough
- [ ] W10 — mkdocs + Vale + lychee CI
- [ ] W11 — Maintenance DoD Check
- [ ] W12 — Metric-Choice Memo
- [ ] W13 — M10 Sprint Review Packet
- [ ] W14 — FinalPitch — 12 min
- [ ] W15 — Reflection Statement

Checklist-ийн эхний дөрвийг зориуд unchecked үлдээсэн: энэ нь хуучин ажлыг үгүйсгэхгүй; нийлмэл handout-ийн бүх шалгуур, external submission-ийг батлаагүй.

## W01 — Doc Types Ethnography

### What I should understand

User / Developer / Operations / Process ангиллын ялгаа.

### What I should be able to do

Нэг real open-source repo-ийн 4 төрлийн URL ба anti-pattern-ийг тайлбарлах.

### Tools / technologies involved

Repository docs, URL references.

### Important concepts

Tribal Knowledge, Hero, Cargo-Cult; repo >100 stars, >5 contributors.

### Expected practical work

4 мөртэй Type/URL/Anti-pattern/Reason хүснэгт, 1 хуудас. Existing Sem1 өөр ангилал ашигласан тул шууд fulfilled гэж үзэхгүй.

### Source

[A, PDF х.2](lecture/Lab-Handouts%20W01%20-%20W10%20Software%20Project%20Documentation%20%281%29.pdf#page=2)

## W02 — IEEE 830 vs ISO 29148

### What I should understand

SRS бүтэц болон requirement quality-г тусад нь харьцуулах.

### What I should be able to do

6 axis бүрт winner + үндэслэл, M3-д тохирох сонголт гаргах.

### Tools / technologies involved

IEEE 830, ISO 29148, SRS template.

### Important concepts

FR, verifiability, traceability, stakeholder tags, priority, architecture.

### Expected practical work

6-axis хүснэгт + 1 decision sentence, ≥3 тодорхой axis detail. Existing scope/SRS draft нь энэ хүснэгтийн нотолгоо биш.

### Source

[A, PDF х.3](lecture/Lab-Handouts%20W01%20-%20W10%20Software%20Project%20Documentation%20%281%29.pdf#page=3)

## W03 — Rinzler Method — story → testable FR

### What I should understand

User story-оос шалгаж болох шаардлага гаргах.

### What I should be able to do

ID/source/priority/verification/owner бүхий FR ба хэмжигдэх failure test бичих.

### Tools / technologies involved

SRS, HTTP/status/time/byte хэмжилт.

### Important concepts

5 required fields; manual test гэсэн ерөнхий үг хангалтгүй.

### Expected practical work

1 FR row; handout-ийн 20 MB, 5 s, HTTP 413 нь example boundary, Nogoolin-ийн батлагдсан шаардлага биш. Pair audit шаардана.

### Source

[A, PDF х.4](lecture/Lab-Handouts%20W01%20-%20W10%20Software%20Project%20Documentation%20%281%29.pdf#page=4)

## W04 — arc42 Bausteine Map

### What I should understand

Architecture-ийн 12 хэсгийн зориулалт.

### What I should be able to do

Хэсэг бүрийг content + reference эсвэл N/A гэж ялгаж, gap тайлбарлах.

### Tools / technologies involved

arc42, architecture document.

### Important concepts

Goals, Constraints, Context, Strategy, Building Blocks, Runtime, Deployment, Cross-cutting, Decisions, Quality, Risks, Glossary.

### Expected practical work

12-row table + gap summary, 1 хуудас. Sem4 arc42/C4/MADR эхүүд холбоотой боловч яг энэ one-page submission батлагдаагүй.

### Source

[A, PDF х.5](lecture/Lab-Handouts%20W01%20-%20W10%20Software%20Project%20Documentation%20%281%29.pdf#page=5)

## W05 — OpenAPI 3.0 Mini-Spec

### What I should understand

Request/response contract ба schema-first документаци.

### What I should be able to do

Нэг FR-ийн endpoint-д params/headers/body, success/error schema, жишээ бичих.

### Tools / technologies involved

OpenAPI YAML; spectral-lint эсвэл Redocly боломжтой бол.

### Important concepts

200 + 4xx + 5xx; status төдий бус schema.

### Expected practical work

Нэг бүрэн endpoint YAML. Existing Sem5 тусгай handout ≥5 endpoint, audit, Swagger UI/Redoc, UE-5 нэмдэг; тэр нь тухайн seminar-ийн дэлгэрэнгүй шаардлага.

### Source

[A, PDF х.6](lecture/Lab-Handouts%20W01%20-%20W10%20Software%20Project%20Documentation%20%281%29.pdf#page=6)

## W06 — Code Documentation ба AI Audit

### What I should understand

Code symbol reference ба HTTP API spec-ийн ялгаа; controller/service-ийн хариуцлага,
source verification, comment claim ба бодит implementation.

### What I should be able to do

Structured docstring, consistent example, strict TypeDoc/Sphinx build, manual/model
comparison, Bhatti audit, TODO issue tracking хийх.

### Tools / technologies involved

JSDoc/TypeDoc эсвэл Google/reST/Sphinx; GitLab CI/Pages/Issues, optional reflection test.

### Important concepts

Explained/Concise/Clear/Usable/Trustworthy; Chinchilla domain consistency;
Use–Verify–Cite; seeded fixture нь observed hallucination биш.

### Expected practical work

Тусгай W6 handout-ийн US-6.1–6.4: бүх public symbols-ийн docs, warning-гүй build,
GitLab Pages URL, diff/audit ≥2 correction, invented API log, TODO issue IDs.
UE-6: нэг public module/class дээр baseline → AI audit → clean renderer integration,
bonus reflection test. [Sem6 local evidence](sem6/README.md)-д 44 service symbols,
9 tests, local reference, CI config, issue draft бий; external ба independent audit
шалгуурууд нээлттэй. Python-oriented UE-6 vs TypeScript option-ийн ялгааг ил тод хадгалсан.

### Source

[Тусгай Sprint 06 handout, х.1–2](<sem6/Sprint 06 Lab Instructions - GitLab & Code Documentation.pdf>).
Нийлмэл [A, PDF х.7](lecture/Lab-Handouts%20W01%20-%20W10%20Software%20Project%20Documentation%20%281%29.pdf#page=7)
нь 3 docstring + 1-page ethics audit гэсэн илүү нарийн хуучин preparation; тусгай
handout-ийн GitLab/public coverage шалгуурыг орлохгүй. Lecture 6 материал байхгүй.

## W07 — Microcopy Repair

### What I should understand

Алдааны consequence + recovery болон jargon-гүй хэл.

### What I should be able to do

3 error message-д old/new/reason бичих.

### Tools / technologies involved

Existing error messages/toasts, arc42 glossary.

### Important concepts

We; consequence/recovery; empty-state 1 sentence+action; onboarding 1 job; no jargon.

### Expected practical work

3-row repair table, шинэ message бүр ≤30 үг, peer Strength/Risk review.

### Source

[A, PDF х.8](lecture/Lab-Handouts%20W01%20-%20W10%20Software%20Project%20Documentation%20%281%29.pdf#page=8)

## W08 — Midterm Practice

### What I should understand

Theory, SRS analysis, pitch-ийн холбоо.

### What I should be able to do

Quiz, SRS analysis, 3-minute pitch бэлдэх.

### Tools / technologies involved

SRS print/live URL, recording; Bhatti Ch2/6/9, Chinchilla Ch2/9.

### Important concepts

Quiz 30% + SRS 40% + pitch 30%; нийт ≥50% гэсэн handout босго.

### Expected practical work

Quiz score sheet + analysis note + pitch recording. W08 graded, attendance required гэж эхэд бичсэн; яг хуанлийн огноо болон retake зөрүүг багшаас батална.

### Source

[A, PDF х.9](lecture/Lab-Handouts%20W01%20-%20W10%20Software%20Project%20Documentation%20%281%29.pdf#page=9)

## W09 — M3 DoD Update + Just-Enough

### What I should understand

Баримтын хэрэгцээ, live availability, CI ба AI source verification.

### What I should be able to do

15 FR-д 4 DoD column нэмэх, хэрэггүй 2 хэсгийг шалтгаантай хасах.

### Tools / technologies involved

SRS, live URL, Vale, lychee, mkdocs strict.

### Important concepts

Reader-first, Live-URL, CI-green, KI-verified; cut-to-ship.

### Expected practical work

2 pages: updated rows + 2 cuts; >30% FR нэг DoD хангахгүй бол sprint-stop signal тайлбарлах.

### Source

[A, PDF х.10](lecture/Lab-Handouts%20W01%20-%20W10%20Software%20Project%20Documentation%20%281%29.pdf#page=10)

## W10 — mkdocs + Vale + lychee CI

### What I should understand

Reproducible docs pipeline, merge gate.

### What I should be able to do

Local checks → branch PR → red-to-green evidence гаргах.

### Tools / technologies involved

MkDocs/Material, Vale, lychee, GitHub Actions; pip/cargo source guidance.

### Important concepts

strict build, prose lint, offline links, gated merge.

### Expected practical work

mkdocs.yml, .vale.ini, .github/workflows/docs.yml, passing doc PR. Энд install/push/CI тохируулаагүй; тусдаа ажил.

### Source

[A, PDF х.11](lecture/Lab-Handouts%20W01%20-%20W10%20Software%20Project%20Documentation%20%281%29.pdf#page=11)

## W11 — Maintenance DoD Check

### What I should understand

Одоо ч уншигчид хэрэгтэй эсэх, deprecated successor, CI, ownership.

### What I should be able to do

Нэг doc-page-г 4 criterion-аар үнэлэх.

### Tools / technologies involved

Existing doc URL, Vale/lychee/mkdocs strict, ownership frontmatter.

### Important concepts

Reader-still-first, Sunset-Header, CI-green, Owner-of-record.

### Expected practical work

1 page: doc+URL, table, Strength/Risk/Owner, peer read. Pass ≥15/20, axis бүр ≥3; conditional 12–14, fail <12 гэж source rubric заасан.

### Source

[B, PDF х.2](lecture/Lab-Handouts%20W11%20-%20W15%20Software%20Project%20Documentation.pdf#page=2)

## W12 — Metric-Choice Memo

### What I should understand

Metric ба chart/form нь claim-тай тохирох ёстой.

### What I should be able to do

Metric/Form/CI Hook/Action дөрвөн field, шалгаж болох action бичих.

### Tools / technologies involved

CI YAML/regex/shell, trend/distribution/threshold/ratio.

### Important concepts

cite-rate, time-to-first-PR, vale-density, lychee-rate; owner/date/test-of-failure.

### Expected practical work

1-page memo; бүх field бөглөсөн, CI hook syntax бодитоор шалгасан; pair form-fit review.

### Source

[B, PDF х.3](lecture/Lab-Handouts%20W11%20-%20W15%20Software%20Project%20Documentation.pdf#page=3)

## W13 — M10 Sprint Review Packet

### What I should understand

Shipped/Measured/Rotated/Sunset/Kept нотолгоо.

### What I should be able to do

5 slot ба Coverage/Freshness/Accountability/Signal self-evaluation хийх.

### Tools / technologies involved

PR URLs, release metric plot, ownership ledger, successor links.

### Important concepts

Empty slot-ийг бодит N/A/no rotation needed тайлбартай ялгах.

### Expected practical work

5 slides + 1 self-evaluation, PDF; ≥15/20, axis бүр ≥3. Хийгдээгүй rotation/PR/metric-ийг зохиохгүй.

### Source

[B, PDF х.4](lecture/Lab-Handouts%20W11%20-%20W15%20Software%20Project%20Documentation.pdf#page=4)

## W14 — FinalPitch — 12 min

### What I should understand

Review packet-ийг нотолгоотой танилцуулах.

### What I should be able to do

8 min pitch + 3 min Q&A + 1 min reflection; 2 peer reviewer feedback авах.

### Tools / technologies involved

mp4/stable recording link, W13 slots, Trend-C plot.

### Important concepts

Strength/Risk/Ask; Coverage/Freshness/Accountability/Signal.

### Expected practical work

12-minute recording + хоёр reviewer-ийн feedback; ≥15/20, axis бүр ≥3 гэж handout заасан.

### Source

[B, PDF х.5](lecture/Lab-Handouts%20W11%20-%20W15%20Software%20Project%20Documentation.pdf#page=5)

## W15 — Reflection Statement

### What I should understand

Worked/Didn’t/Would-change ба биелэхүйц commitment.

### What I should be able to do

Өөрийн evidence-тай reflection, Action/Owner/Date/Test-of-failure бичих.

### Tools / technologies involved

Document URL, W12 metric, PDF/scan/photo.

### Important concepts

Vague positivity, public blame, try-harder anti-pattern-оос зайлсхийх.

### Expected practical work

200-word reflection + 4-field commitment. Эхэд prompt бүр 60 үг, total ≤200 гэж мөн бичсэн; яг required count-ийг submission-аас өмнө тодруулна.

### Source

[B, PDF х.6](lecture/Lab-Handouts%20W11%20-%20W15%20Software%20Project%20Documentation.pdf#page=6)

## Assessment, milestones ба тодруулах зүйл

- A х.1/12, B х.1/7: Friday 18:00 LMS deadline, late 0.5×/day, 7 хоногийн дараа forfeit гэж бичсэн. Эдгээрийг календарь/cron болгоогүй; бодит semester dates тодорхойгүй. Email accepted биш; cloud link stable байх ёстой гэж эхэд заасан.
- A х.12: M3 = W08 pass + W09 DoD; M5 = W04 arc42 + W05 OpenAPI; M7 = W06/W07/W10. Existing Sem3/M3, Sem4/M4 labels-тай автоматаар адилтгахгүй.
- A х.9 нэг correction боломж дурдсан боловч х.12 W08 no repeat гэж байна. Албан retake policy тодруулах шаардлагатай; source-ийн хатуу үр дагаврыг батлагдсан university rule мэт хэрэглэхгүй.
- A overview W09 1-page summary мэт боловч х.10/12 detailed requirement 2 pages; roadmap detailed requirement-ийг тэмдэглэв. B overview one-page гэсэн уриатай ч W13 5+1, W14 recording.
- B х.7 pass ≥15/20 ба axis бүр ≥3; conditional targeted patch, fail rewrite; W12 plain text/Markdown exception гэж тэмдэглэсэн. Rubric wording зөрвөл багшийн тухайн даалгаврын тайлбарыг батална.
- Sem5 тусгай handout нь A-ийн нэг endpoint-оос өргөн: ≥5 endpoint, OpenAPI3.0.3, dual renderer, audit ≥4/5, 100-word report, UE-5. Source/examples дахь Corg.ly URL/score нь бодит сервер/өөрийн тестийн нотолгоо биш. Public deployment/security-sensitive execution нь тусдаа зөвшөөрөл шаарддаг.
- Шинэ tool суулгах, repo push, LMS нийтлэл, production API ажиллуулах нь roadmap унших зөвшөөрөлд хамаарахгүй.
