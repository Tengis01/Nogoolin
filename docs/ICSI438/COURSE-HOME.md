# ICSI438 — Software Project Documentation

## Course Overview

Төслийн шаардлага, архитектур, API, уншигчид чиглэсэн документаци, чанарын шалгалт ба урт хугацааны арчилгааг практик ажлаар судална. Нийлмэл handout W01–W15 дараалалтай. Seminar 1-ийн кейс Document RAG Chatbot; Seminar 2-оос Nogoolin ([course instructions](AGENTS.md)).

## Source Material

- [W01–W10 — 12 хуудас](lecture/Lab-Handouts%20W01%20-%20W10%20Software%20Project%20Documentation%20%281%29.pdf) — документацийн төрөл → SRS → архитектур/API → CI.
- [W11–W15 — 7 хуудас](lecture/Lab-Handouts%20W11%20-%20W15%20Software%20Project%20Documentation.pdf) — maintenance → metrics → sprint review → pitch → reflection.
- Тухайн seminar-ийн дэлгэрэнгүй handout нь өөр шаардлага агуулж болно; [roadmap](COURSE-ROADMAP.md)-ийн ялгаа/зөрүү хэсгийг уншина. Lecture 01–03, гурван ном existing `lecture/`, `book/` дотор хэвээр.

## Course Roadmap

[COURSE-ROADMAP](COURSE-ROADMAP.md) · [Weekly progress](WEEKLY-PROGRESS.md)

## Seminar / Lab Progress

🟡 = материал бэлэн боловч бүх course шалгуур батлагдаагүй; ⬜ = practical work нотолгоо байхгүй; ✅ = зөвхөн тодорхой шалгуурын нотолгоо бүрэн үед. Локал PDF байгаа нь LMS submission/багшийн pass гэсэн үг биш.

| Seminar | Бодит материал | Төлөв |
|---|---|---|
| [Sem1](sem1/README.md) | 4 PDF, merged 6 хуудас, LaTeX/wiki, 200-word reflection | 🟡 Локал багц бэлэн; ярилцлага, reader test, quiz/publication дутуу |
| [Sem2](sem2/README.md) | Scope Charter, SRS/SDD, requirements/traceability draft, merged 7 хуудас | 🟡 Review/ярилцлага/publication pending |
| [Sem3](sem3/README.md) | 15 FR + 5 NFR, 20-row matrix, 5 mock UI, UE-3, merged 17 хуудас | 🟡 v1.0 draft; peer review ба 80% trial execution алгассан |
| [Sem4](sem4/README.md) | arc42/C4, 3 MADR, architecture mapping, UE-4, merged 19 хуудас | 🟡 Локал багц бэлэн; remote submission батлагдаагүй, persona тайлбарын ялгаа бий |
| [Sem5](sem5/README.md) | 5-operation OpenAPI, local Swagger/Redoc, UE-5 Python, audit, PDF | 🟡 Локал багц бэлэн; live sample, 4/5 audit, public hosting дутуу |

Sem6–Sem15-ийн хүлээлтийг [roadmap](COURSE-ROADMAP.md), [progress](WEEKLY-PROGRESS.md)-оос үзнэ. Хоосон seminar хавтас урьдчилан үүсгээгүй.

## Important Knowledge

[Commands](knowledge/COMMANDS.md) · [Concepts](knowledge/CONCEPTS.md) · [Troubleshooting](knowledge/TROUBLESHOOTING.md)

[Documentation standard](LAB-DOCUMENTATION-STANDARD.md) · [Lab template](templates/ICSI438-LAB-TEMPLATE.md) · [Maintainer skill](../../../00-Vault/AI-Skills/icsi438-course-maintainer/SKILL.md)

External resources нь handout/эх баримтын reference; энэ index хийхдээ live шалгаагүй: [arc42 template](https://arc42.org/template), [existing номын сан](book/). Шинэ даалгаварт ашиглахдаа тухайн chapter/page болон одоогийн tool flags-ийг дахин шалгана.

## Current Focus

- Current seminar: Sem5-ийн локал лабораторийн багц бэлэн; course DoD нээлттэй.
- Current topic: OpenAPI 3.0, code sample quality.
- Current problem: Corg.ly-ийн батлагдсан server/response, public hosting, 4/5 audit evidence дутуу; FR-03 phone validation кодтой зөрсөн.
- Next task: [Sem5 README](sem5/README.md)-ийн нээлттэй шалгуурыг бодит sandbox/hosting мэдээлэл ирэхэд нөхөх; W6 handout-ийг унших.
