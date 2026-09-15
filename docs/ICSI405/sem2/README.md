# Seminar 2 — Nogoolin / M2

**Тэнгис · 2026-09-15 · Review-д бэлтгэсэн draft**

## Хүлээлгэн өгөх багц

- [Нэгдсэн PDF](sem2_merged.pdf) — Scope Charter, persona нэмэлт, SRS, 5 шаардлага, traceability, SDD, peer-review draft.
- [Нэг хуудаст Scope Charter](SRS-Scope-Charter.pdf).
- [SRS-Template](../../requirements/srs-template.md), [шаардлага](../../requirements/requirements.md), [traceability](../../requirements/traceability-matrix.md), [SDD-Template](../../architecture/sdd-template.md) нь төслийн засварлах үндсэн Markdown эх.
- [Persona/W1 холбоо](wiki/persona-and-pivot.md), [peer-review draft](wiki/peer-review-draft.md) нь хичээлийн нэмэлт.
- `latex/` — засварлах боломжтой LaTeX экспорт ба build хэрэгсэл; `tmp/` — хөрвүүлэлт, QA, шилжүүлэлтийн manifest.

Бүтээгдэхүүний Markdown эхийг `docs/requirements/`, `docs/architecture/`-д байлгах нь татсан үндсэн prompt-ын шийдвэр. Course-only эх болон PDF-үүдийг хэрэглэгчийн зааврын дагуу `docs/ICSI405/sem2/`-т төвлөрүүлэв.

## DoD ба үлдсэн ажил

| Шалгуур | Төлөв / нотолгоо |
|---|---|
| IEEE 830 mapping + SRS/SDD загвар | Draft бэлэн; mapping-ийн мөр бүр нэг төлөвтэй |
| 5 testable FR/NFR; ID, priority, owner, verification | Draft бэлэн; 2 FR + 3 NFR, бүгд must |
| 8 баганат traceability; бодит source | 5 мөртэй draft бэлэн |
| W1 persona pain point холбоо | Шилжилтийг тайлбарласан; багш/reviewer-ийн баталгаажуулалт pending |
| Source interview | Хийгдээгүй; бодит ярилцлагын мэдээллийг нөхнө |
| 1-page Scope Charter | PDF ба Markdown эх бэлэн |
| SRS/Traceability published / Confluence | Локал файл бэлэн; хэрэглэгчийн заавраар нийтлэлтийг алгассан |
| Peer-Review-Draft sent | Draft бэлэн; хэрэглэгчийн заавраар илгээлтийг алгассан |
| Friday submission | Хэрэглэгчийн заавраар LMS submission-ийг алгассан; яг хуанлийн deadline баталгаажаагүй |

**Локал багц бэлэн.** 2026-09-15-нд хэрэглэгч peer-review хүлээн авагч, Confluence/LMS холбоос одоогоор байхгүй тул илгээх/нийтлэх алхмуудыг алгасахыг хүссэн. Хичээлийн гадаад DoD (review/нийтлэл/submission) биелсэн гэж үзэхгүй. Хичээлийн W2 болон бүтээгдэхүүний Phase/Week дугаарыг адилтгахгүй. Энэ ажлаар production deployment, аппын кодын өөрчлөлт, шинэ runtime тест хийгдээгүй. NFR-03 нь CI-ийн бодит gap; өмнөх тестүүдийн түүхэн тайланг шинэ нотолгоо болгож ашиглаагүй.

## Дахин хөрвүүлэх

Nogoolin root-оос:

```bash
python3 docs/ICSI405/sem2/latex/build.py
```

Pandoc + XeLaTeX + Liberation font шаардлагатай. Markdown эхийг өөрчилсний дараа командаар LaTeX/PDF-ийг хамтад нь шинэчилнэ. PDF-ийн visual QA-г `tmp/review/` дэх хуудасны зургуудаар шалгана.

## Эх материал

[W2 handout](Software_Project_Documentation_Week_02_Handout.pdf), [Lecture 02](<../lecture/Lecture_02 Why Documentation Documentation Standards.pdf>), Chinchilla бүлэг 5, хэвлэмэл х. 53–55 (номын PDF х. 74–76). Татсан үндсэн prompt-ыг [handover](context-handover-sw-project-doc-nogoolin.md)-т хадгалсан.
