# ICSI438 — Troubleshooting Knowledge

[Home](../COURSE-HOME.md) · [Commands](COMMANDS.md)

Эдгээр нь existing материалд тэмдэглэсэн бодит workflow асуудал/шийдэл; энэ task-д шинэ build/runtime тест хийгээгүй.

| Symptom / risk | Documented cause | Solution / evidence | Remaining limit |
|---|---|---|---|
| Дээд Tengis folder нээхэд PDF onSave ажиллахгүй | Nested `.vscode` нь parent workspace-д автоматаар ачаалагдахгүй | Seminar `.code-workspace` эсвэл Nogoolin root нээх; [Sem2 README](../sem2/README.md) | XeLaTeX/latexmk/fonts ба extension өөр машинд хэрэгтэй |
| Build дараа TeX гар засвар алдагдах эрсдэл | `--from-markdown` regeneration нь existing TeX-ийг солино | Default compile; regeneration зөвхөн canonical source-оос зориуд; [Sem2](../sem2/README.md), [Sem3](../sem3/README.md), [Sem4](../sem4/README.md) | Backup ба focused diff шаардлагатай; энэ task-д regeneration хийгээгүй |
| Sem1 merged PDF шинэчлэгдэхгүй | Existing build.sh зөвхөн 4 individual PDF гаргадаг | Дараа нь тогтсон дарааллаар pdfunite; [course AGENTS](../AGENTS.md) | Build/merge хоёр тусдаа алхам |
| C4 native layout overlap | Sem4 README renderer/layout issue тэмдэглэсэн | Typed Mermaid flowchart static + sequence dynamic; SVG → vector PDF; [Sem4](../sem4/README.md) | Diagram өөрчлөгдвөл focused visual review; шийдэл бүх layout-д автоматаар баталгаа биш |
| Handout/book page anchor зөрөх | UE-4 номын local printed pagination handout-оос зөрсөн | Дэд гарчиг болон actual printed/PDF page-аар тулгах; [UE-4](../sem4/wiki/ue4-rework.md) | Book chapter/page-ийг дараагийн ажилд дахин шалгах |

Peer review/submission байхгүй нь software error биш; [weekly progress](../WEEKLY-PROGRESS.md)-ийн open criterion. Хэрэглэгчийн төсөлд тохиолдоогүй community issue-г энд өөрийн incident болгон нэмэхгүй.
