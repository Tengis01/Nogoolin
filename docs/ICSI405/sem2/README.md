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

## Ctrl+S → PDF автоматаар шинэчлэх

`rag_chatbot/report`-той адил LaTeX Workshop-ийн **onSave → latexmk → XeLaTeX** горим тохируулсан.

1. VS Code-ийн **File → Open Workspace from File…** цэсээр [sem2.code-workspace](sem2.code-workspace)-ийг нээнэ. Эсвэл `Nogoolin` хавтсыг өөрийг нь Open Folder хийнэ; repo-ийн `.vscode/settings.json` мөн тохиргоотой.
2. [latex/sem2_merged.tex](latex/sem2_merged.tex)-ийг нээн засаж **Ctrl+S** дарна.
3. **LaTeX Workshop: View LaTeX PDF file** командаар preview нээнэ. Амжилттай build бүрийн дараа `sem2_merged.pdf` болон нээлттэй preview шинэчлэгдэнэ. Compile дуусахад хэдэн секунд шаардана.

`Tengis` зэрэг дээд хавтсыг дангаар нь нээсэн үед доторх Nogoolin-ийн `.vscode` тохиргоо автоматаар ачаалагдахгүй; дээрх workspace-ийг нээх хэрэгтэй. LaTeX Workshop энэ машинд суусан; өөр машинд workspace-ийн recommended extension-ийг суулгана. XeLaTeX, latexmk, Liberation font мөн шаардлагатай.

**Зам:** үндсэн PDF ба SyncTeX нь `sem2/`, завсрын `.aux/.log/.fls/.xdv` нь `sem2/tmp/pdfs/`. Compile алдаа гарвал LaTeX Workshop-ийн log/error дээр харагдана; алдааг засаж дахин хадгална.

### Терминалаас

Nogoolin root-оос одоогийн хоёр `.tex` эхийг хөрвүүлэх:

```bash
python3 docs/ICSI405/sem2/latex/build.py
```

Зөвхөн нэгдсэн тайланг хөрвүүлэх:

```bash
cd docs/ICSI405/sem2/latex
latexmk
```

**`build.py` одоо анхдагчаар одоогийн `.tex` эхийг хөрвүүлнэ; гар засварыг дарж бичихгүй.** Markdown-оос `.tex`-ийг дахин үүсгэх нь тусдаа, санаатай үйлдэл:

```bash
python3 docs/ICSI405/sem2/latex/build.py --from-markdown
```

`--from-markdown` нь `.tex` дээрх гар засварыг Markdown хувилбараар солино. `Ctrl+S` auto-build энэ flag болон Markdown үүсгэгчийг огт дуудахгүй. `01_…07_*.tex`, `header.tex` нь өмнөх экспортын хэсгүүд; одоогийн нэгдсэн файл тэдгээрийг `input` хийдэггүй тул нэгдсэн тайлангаа **sem2_merged.tex** дээр засна. Тусдаа Scope Charter-ийг `SRS-Scope-Charter.tex` дээр засахад түүний PDF шинэчлэгдэнэ.

Албан ёсны тохиргооны тайлбар: [LaTeX Workshop — Compile](https://github.com/James-Yu/LaTeX-Workshop/wiki/Compile).

## Эх материал

[W2 handout](Software_Project_Documentation_Week_02_Handout.pdf), [Lecture 02](<../lecture/Lecture_02 Why Documentation Documentation Standards.pdf>), Chinchilla бүлэг 5, хэвлэмэл х. 53–55 (номын PDF х. 74–76). Татсан үндсэн prompt-ыг [handover](context-handover-sw-project-doc-nogoolin.md)-т хадгалсан.
