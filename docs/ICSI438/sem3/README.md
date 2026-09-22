# Seminar 3 — Nogoolin SRS v1.0 draft / M3

**Тэнгис · 2026-09-22**

## Багц

- [SRS v1.0 draft](../../requirements/srs-v1.0.md) — 15 FR + 5 NFR, интерфэйс, чанарын checklist.
- [20 мөртэй Traceability Matrix](../../requirements/traceability-matrix-v1.0.md).
- [Human-vs-AI comparison](wiki/human-vs-ai-comparison.md) — эхээр шалгаж зассан 3 AI зөрүү.
- [UE-3 Corg.ly](wiki/ue3-corgly.md) — 5 FR, AI alternative, 3 Concise/Usable зөрүү, diff, нэг хуудасны reflection.
- [Seminar reflection](wiki/reflection.md) — Bhatti, Chinchilla, бодит ажиллагааны зөрүү.
- `assets/` — acceptance criteria-д ашигласан 5 mock UI screenshot.
- `latex/` — editable LaTeX, build script; `tmp/` — build/QA завсрын файл.
- `sem3_merged.pdf` — дээрх үндсэн deliverable-уудын нэгдсэн PDF.

PDF нь A4 portrait хэвлэлийн загвартай: зүүн margin 3 см, дээд/баруун/доод margin тус бүр 2 см. Нүүрэнд МУИС-ийн толгой, лого, хичээлийн нэр болон Seminar 3/M3 мэдээлэл орсон. Үндсэн бичвэр, гарчиг, хүснэгтийн хэмжээ нь Seminar 2-ын хэв маягийг дагана; өргөн traceability болон AI comparison хүснэгтүүдэд зөвхөн тухайн хүснэгтийн жижигрүүлсэн хэмжээ хэрэглэнэ. Агуулга, зураг, хүснэгтийн жагсаалт оруулаагүй.

## Шалгуурын төлөв

| Шалгуур | Төлөв |
|---|---|
| 15 FR | Бэлэн; requirement бүр priority, source, owner, procedure-тай |
| 5 NFR, ≥3 category | Бэлэн; 5 category, хэмжигдэх boundary-тай |
| 5 mock UI acceptance screenshot | Бэлэн |
| 20 traceability row | Бэлэн |
| Human-vs-AI 3 correction | Бэлэн |
| UE-3 | Бэлэн |
| Written reflection | Бэлэн |
| Peer review, 3 comment, v0.9→v1.0 review diff | **Алгассан:** бодит reviewer/comment байхгүй |
| 80% trial test execution | **Алгассан:** үндсэн хэрэгжилт, хугацааны төлөв хүрэлцээгүй |
| Workspace publication/submission | Локал багц; LMS/Confluence холбоос байхгүй, remote publish хийгдээгүй |

SRS нь `v1.0 draft` статустай. `Implemented` гэдэг нь кодын зам байгааг, `verified` гэдэг нь test evidence байгааг илэрхийлнэ; энэ багцад ямар ч requirement-ийг verified гэж зарлаагүй.

## LaTeX build

Одоогийн editable TeX-ийг дахин compile хийх:

```bash
python3 docs/ICSI438/sem3/latex/build.py
```

Markdown эхүүдээс `sem3_report.md` болон `sem3_merged.tex`-ийг зориуд дахин үүсгээд compile хийх:

```bash
python3 docs/ICSI438/sem3/latex/build.py --from-markdown
```

`--from-markdown` нь `latex/sem3_merged.tex` дээрх гар засварыг дарж бичнэ. `sem3.code-workspace`-ийг VS Code-д нээвэл LaTeX Workshop одоогийн TeX-ийг Ctrl+S үед `.latexmkrc`-аар хөрвүүлнэ.

## Эх материал

- [Week 03 Handout](Software_Project_Documentation_Week_03_Handout.pdf)
- [Lecture 03](<../lecture/Lecture_03 SRS ISO_29148.pdf>)
- Bhatti et al., бүлэг 3–4
- Chinchilla, бүлэг 5 ба 9
