# ICSI438 — Reusable Commands

[Home](../COURSE-HOME.md) · [Troubleshooting](TROUBLESHOOTING.md)

## Existing seminar builds

Доорх командууд existing README/build source-оос батлагдсан; энэ indexing task-д **ажиллуулаагүй**. Compile artifact өөрчилдөг тул зөвхөн тухайн seminar ажиллах үед хэрэглэнэ.

Nogoolin root working directory:

```bash
python3 docs/ICSI438/sem2/latex/build.py
python3 docs/ICSI438/sem3/latex/build.py
python3 docs/ICSI438/sem4/latex/build.py
```

Purpose: existing editable TeX → PDF. Expected: semN дотор шинэ PDF, tmp дотор intermediate. `--from-markdown` нь зүгээр compile биш: TeX гар засварыг дарж бичих intentional regeneration; default weekly check-д хэрэглэхгүй. [Sem2](../sem2/README.md), [Sem3](../sem3/README.md), [Sem4](../sem4/README.md).

ICSI438 root working directory, Sem1:

```bash
python3 sem1/latex/export_markdown.py
bash sem1/latex/build.sh
pdfunite sem1/01_documentation_types.pdf sem1/02_audience_persona.pdf sem1/03_curse_of_knowledge.pdf sem1/04_writer_in_the_middle.pdf sem1/sem1_merged.pdf
```

Export нь Markdown/200-word source-ийг шинэчилж reflection word count шалгана; build 4 PDF үүсгэнэ; pdfunite дарааллаар merged гаргана. Export/merge нь файл бичдэг. Source: [course AGENTS](../AGENTS.md), [Sem1](../sem1/README.md). Sem1 README-ийн ICSI405 working-dir тайлбар хуучирсан; бодит root нь Nogoolin/docs/ICSI438.

## Read-only artifact checks

Poppler tool help болон this task-ийн бодит хэрэглээгээр батлагдсан:

```bash
pdfinfo '<path-to-pdf>'
pdftotext -layout '<path-to-pdf>' '<temporary-text-file>'
```

`pdfinfo` page count/metadata өгнө. `-layout` column spacing хадгалдаг боловч visual correctness батлахгүй. Output file course note биш; transient text-ийг durable wiki руу бүхлээр хуулахгүй. Parser амжилттай бол OCR хэрэггүй.

## Future W10 pipeline — source guidance only

A handout PDF х.11 commands; одоогоор install/execute/CI verification хийгдээгүй. Tool versions/flags-ийг тухайн ажилд дахин шалгана:

```bash
mkdocs build --strict
vale --config=.vale.ini docs/
lychee --offline --no-progress ./site
```

Strict build, prose style lint, offline link check гэсэн 3 local gate; GitHub PR merge gate нь remote configuration ба бодит CI evidence шаарддаг. Энэ нь өөрөө push/merge хийх зөвшөөрөл биш.

## Sem6 — strict code reference build

Working directory: Nogoolin root. Verified 2026-10-06.

```bash
npm run verify --prefix docs/ICSI438/sem6/tools
```

Runs scoped symbol inventory, snippet/behavior/reflection tests and TypeDoc with
warning-as-error. Writes HTML/JSON and a short verification log. New checkout needs
`npm ci --prefix docs/ICSI438/sem6/tools` first. Local success does not prove GitLab
CI/Pages publication. [Sem6 evidence](../sem6/README.md).
