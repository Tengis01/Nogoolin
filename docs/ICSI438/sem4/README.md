# Seminar 4 / M4 — arc42 + C4 + ADR

**Тэнгис · Nogoolin · 2026-09-28 · v0.1 draft**

[Week 04 Lab Assignment](<Software Project Documentation - Week 04 Lab Assignment.pdf>)-ийг уншиж §1, §3, §5, хоёр C4 view, Tech Stack/Persistence/Interface гэсэн гурван MADR, W1 persona links, ≥80% FR mapping болон UE-4 deliverable-уудыг гүйцээв. Lecture 04 одоогоор байхгүй; handout-ийг үндсэн шаардлага болгосон.

## Багц

- [Nogoolin arc42 architecture](../../architecture/arc42-nogoolin.md) — lean 12 хэсэг; §3/§5/§6/§9 дэлгэрэнгүй.
- [Architecture traceability](../../architecture/architecture-traceability.md) — Seminar 3-ын FR-01…15, NFR-01…05 гэсэн 20 ID-г architecture/C4/ADR-тай холбосон.
- [ADR-003](../../architecture/adr/adr-003-fastify.md), [ADR-005](../../architecture/adr/adr-005-supabase.md), [M4-IF-01](../../architecture/adr/m4-if-01-rest-interface.md) — бүрэн decision records.
- `diagrams/` — Mermaid flowchart/sequence эхүүд; C4 type/name/technology/responsibility conventions-тай.
- `assets/` — Mermaid-ээс үүссэн 7 SVG (6 architecture view + UE-4 Before).
- `latex/` — editable LaTeX болон build script.
- [UE-4 Before/After](wiki/ue4-rework.md), [1-page refactoring ADR](wiki/ue4-refactoring-adr.md), [reflection](wiki/reflection.md).
- `sem4_merged.pdf` — хэвлэх үндсэн багц.

## C4 зураг

| ID | arc42 хэсэг | Агуулга |
|---|---|---|
| C4-01 | §3 | System Context |
| C4-02 | §5.1 | Container View |
| C4-03 | §5.2 | Fastify API Component View |
| C4-D01 | §6.1 | Inquiry Runtime |
| C4-D02 | §6.2 | Wishlist Runtime |
| C4-D03 | §6.3 | Admin Inquiry Status Runtime |

## Build

PDF build-д Python 3, Pandoc, XeLaTeX/latexmk, Inkscape болон Liberation Serif/Sans font хэрэгтэй. Mermaid эхийг render хийхэд Node.js ба Puppeteer-ийн Chromium нэмэгдэнэ.

Mermaid CLI-г нэг удаа суулгах:

```bash
npm --prefix docs/ICSI438/sem4/tools ci
```

Markdown, Mermaid, TeX болон PDF-ийг зориуд дахин үүсгэх:

```bash
python3 docs/ICSI438/sem4/latex/build.py --from-markdown
```

Одоогийн editable TeX-ийг л compile хийх:

```bash
python3 docs/ICSI438/sem4/latex/build.py
```

Шинэ checkout дээр дээрх compile командыг эхлээд нэг удаа ажиллуулна. Энэ нь хадгалсан SVG-ээс intermediate vector PDF үүсгэдэг тул Mermaid/Chromium шаардахгүй. `tmp/` болон compiler cache нь Git-д орохгүй.

`sem4.code-workspace`-ийг VS Code-д нээвэл `latex/sem4_merged.tex` хадгалах үед LaTeX Workshop PDF-ийг шинэчилнэ. `--from-markdown` нь generated TeX-ийн гар засварыг дарж бичдэг тул зөвхөн canonical Markdown/Mermaid эх өөрчлөгдсөн үед хэрэглэнэ.

## Handout acceptance check

| Шалгуур | Үр дүн |
|---|---|
| arc42 §1/3/5 | Бүрэн агуулгатай, local architecture workspace-д |
| ≥3 actors | Guest, Customer, Admin; W1-ийн нэг persona-тай role mapping |
| ≥2 neighboring systems | Supabase, OAuth providers; data flow label-тай |
| C4 Container ≤8 | 3 Nogoolin deployable app; library container биш |
| 3 MADRs | Tech Stack, Persistence, Interface; persona backward link-тай |
| Building block coverage ≥80% FR | 15/15 = 100%; orphan FR = 0 |
| UE-4 | Before/After Mermaid/SVG ба нэг хуудасны ADR |
| Reflection | Номын page anchor-тай гурван асуулт |
| Publication | Local Git workspace; remote push/LMS submission хийгдээгүй |

W1-д ганц хөгжүүлэгч persona байсан тул гурван role mapping-ийг гурван анхны persona мэт танилцуулаагүй. Багш literal гурван W1 persona шаардах бол энэ ялгааг тодруулах хэрэгтэй.

## Ил тод үлдээсэн төлөв

- Production deployment нь target; cloud Supabase project үүсээгүй.
- Mobile inquiry/wishlist incomplete.
- NFR-03 CI database gate gap хэвээр.
- NFR-05 idempotency key store хэрэгжээгүй.
- Architecture mapping нь шинэ runtime verification evidence биш.


Renderer: Mermaid CLI 11.17.0, dependency versions package-lock.json-д pin хийгдсэн. Chrome executable-г `PUPPETEER_EXECUTABLE_PATH`-аар өгч болно; script Puppeteer cache-аас автоматаар олно. PDF vector assets Inkscape-аар хөрвүүлэгдэнэ. C4 native layout overlap-оос зайлсхийж static view-д typed Mermaid flowchart, dynamic view-д sequence style ашигласан.
