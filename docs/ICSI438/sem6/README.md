# Seminar 6 — Code Documentation ба AI Audit

**Тэнгис · Nogoolin · 2026-10-06 · v0.1 local draft.** Энэ нь ажил хийсэн огноо;
семинарын календарийн огноог таамаглаагүй.
[Handout](<Sprint 06 Lab Instructions - GitLab & Code Documentation.pdf>) х.1–2 нь
үндсэн шаардлага. Lecture 6 материал одоогоор байхгүй.
[Course home](../COURSE-HOME.md) · [Progress](../WEEKLY-PROGRESS.md).

GitHub Sem6: <https://github.com/Tengis01/Nogoolin/tree/main/docs/ICSI438/sem6>.

## Зорилго ба хамрах хүрээ

JSDoc тайлбар → TypeDoc reference → strict build → audit/test гэсэн workflow-г
Nogoolin-ийн зургаан backend service модульд хэрэгжүүлэв. Reference нь 44 symbol
(6 factory, 23 method, 6 service type, 2 interface, 7 field)-ийг хамарна.
Repository-wide exported symbol coverage гэж мэдүүлэхгүй. Controller registration,
hooks, concrete database adapters, app bootstrap/frontend болон shared schemas нь
энэ reference-ийн entrypoint биш; imported contract хэвээр ашигласан.

UE-6-ийн Python class-ийн оронд одоогийн TypeScript factory service хэрэглэсэн.
Handout-ийн JSDoc/TypeDoc сонголттой нийцнэ; literal Python/Sphinx файлын шаардлага
болон independent manual authoring-ийг бүрэн биелсэн гэж үзэхгүй.

Өмнөх эх: [Sem3 SRS](../../requirements/srs-v1.0.md),
[Sem4 architecture](../../architecture/arc42-nogoolin.md),
[Sem5 HTTP contract](../sem5/openapi/openapi.yaml).

## Багц ба procedure

- [Хэвлэх PDF](sem6_merged.pdf), [тайлан Markdown](wiki/sem6-report.md),
  [засварлах TeX](latex/sem6_merged.tex) — NUM нүүр, approved ICSI438 хэв маяг.
- [API reference](reference/index.html), [reference index](api-reference.md),
  [44-symbol inventory](evidence/public-symbols.md) — generated HTML ба scope.
- [Bhatti audit](bhatti_audit_table.md), [diff](audit/manual-vs-ai.diff),
  [baseline](audit/manual_docstring.ts), [controlled AI draft](audit/ai_docstring.ts),
  [prompt](audit/prompt.md), [гарал](audit/provenance.md).
- [Tests](tools/test-documentation.mjs), [verification log](evidence/verification.txt),
  [comment-only proof](evidence/comment-only.json).
- [GitLab CI](gitlab-ci.yml), [root include](../../../.gitlab-ci.yml),
  [mobile session issue draft](issues/mobile-session-storage.md).

Service-ийн body/signature-г хадгалж comment нэмсэн. Factory бүр dependency,
method бүр input/result/error/example тайлбартай. Non-exported helper-үүдэд public
reference-ээс хасах шалтгааныг нэмсэн. Inquiry-ийн lifecycle comment transition
enforcement мэт ойлгогдох эрсдэлтэй байсан тул бодит implementation-тэй нийцүүлэв.
Mobile TODO-д local tracking path нэмсэн; auth/storage behavior өөрчлөгдөөгүй.

## Орчин ба команд

Node **26.9.0**, npm **11.19.1**, TypeDoc **0.28.14**, TypeScript **5.7.3**,
Zod **3.24.1**, @types/node **22.10.2**. Тусгаар tools dependency/lockfile ашигласан;
монорепогийн бүх dependency-г суулгаагүй. CI image нь Node 22; Docker runner дээр
ажиллаагүй тул image runtime-ийн үр дүнг local Node 26-аар орлохгүй.

Working directory: **Nogoolin root**.

```bash
# Шинэ checkout-ийн tool dependencies.
npm ci --prefix docs/ICSI438/sem6/tools --ignore-scripts --no-audit --no-fund

# Inventory/check → 9 test → TypeDoc HTML; verification.txt хадгална.
npm run verify --prefix docs/ICSI438/sem6/tools

# Гараар зассан TeX-ийг хөрвүүлэх; Markdown дахин экспортлохгүй.
python3 docs/ICSI438/sem6/latex/build.py

# Markdown-оос зориуд дахин үүсгэх; TeX гар засварыг дарж бичнэ.
python3 docs/ICSI438/sem6/latex/build.py --from-markdown

# Тусдаа GitLab repo-д хэрэгтэй 35 allowlisted source/config файл export хийх.
node docs/ICSI438/sem6/tools/export-gitlab.mjs
```

`sem6.code-workspace` эсвэл Nogoolin root-ийг VS Code-д нээхэд TeX хадгалмагц LaTeX
Workshop хөрвүүлнэ. Markdown → TeX нь зөвхөн explicit export. Local HTML нь
`reference/index.html`; PDF screenshot дахин үүсгээгүй.

GitLab export нь `tmp/gitlab-bundle/` дотор **тусдаа repo-ийн root бүтэцтэй** source
үүсгэнэ. Тэнд мөн дээрх npm ci/verify команд ажиллана. Дотоод source import хэрэгтэй
тул sem6 хавтсыг дангаар нь хуулбал build хийхгүй. Export нь environment/credential,
бүтэн application эсвэл `.git` хуулдаггүй. Тусдаа GitLab project-д push хийгдээгүй.

## Configuration ба verification

TypeDoc нь service entrypoint-ууд, compiler error, undocumented function/method/type,
invalid link болон warning-as-error шалгалттай. `notExported` нь scope-оос гаднах
repository/schema contract-ын warning-д зориулан унтарсан; global warning-as-error
унтраагаагүй. Custom AST check нь parameter нэр/дараалал, returns/throws/example,
interface field-ийн summary-г шалгана.

| Шалгуур | Бодит байдал |
|---|---|
| US-6.1 scoped public symbol documentation | Зургаан service-д **44/44**; бүх repo-ийн public coverage нээлттэй |
| Жишээнүүдийн type-check | Factory/type/interface/method-ийн 37 snippet compiler check давсан |
| Inquiry behavior | 7 local-double test давсан; Supabase/live auth test биш |
| Bonus reflection | Seeded ghost method/type илрүүлсэн; corrected list зөвшөөрсөн |
| Нийт automated test | **9/9** давсан |
| Strict TypeDoc | HTML/JSON үүссэн, **0 warning**, compiler error байхгүй |
| Comment-only change | Зургаан service-ийн before/after emitted JavaScript ижил |
| Standalone GitLab source bundle | Cached clean install + 44/44 check + 9/9 test + TypeDoc build давсан |
| GitLab CI config | YAML parse/local include/job relationship шалгасан; remote CI Lint биш |
| Audit ≥2 corrections | Controlled draft-ийн 3 claim-ийг эхтэй тулгасан; independent human review биш |
| Invented API discovery | Seeded negative fixture; real GPT-4/Claude hallucination нотолгоо байхгүй |
| TODO/FIXME integrity | TS/TSX эхэд 1 TODO; issue draft-тай холбосон, бодит GitLab ID байхгүй |
| Live Pages / pipeline green | GitLab project байхгүй; ажиллуулаагүй |
| Published / Submitted / Grade | Not done / Not done / Unknown |

## Асуудал ба шийдэл

1. Анхны tsconfig-ийн root relative path нэг түвшнээр зөрсөн. Sem6 → Nogoolin нь
   `../../..` болохыг зассан; TypeDoc source resolve/build давсан.
2. Extracted snippet `.ts` нь course root-ийн CommonJS context-д орж ESM import
   diagnostic гаргасан. Temporary snippet-ийг `.mts` болгосон; type-check давсан.
3. Sandbox npm child process-д EPERM өгсөн. Approved verifier run-аар check/test/build
   бүрэн хийсэн. Tool lookup/download мөн approved network access хэрэглэсэн.
4. GitLab project байхгүй. CI, standalone source export, issue draft бэлэн;
   pipeline/Pages/issue дугаарыг баталгаажаагүй.
5. “Six Principles” нэр handout-д задраагүй. Номын Ch.3/7-оос зургаан operational
   checklist гаргаж, номын яг албан taxonomy мэт бичээгүй.

## Сурсан зүйл ба дараагийн бэлтгэл

Зөв хэлбэртэй JSDoc нь зөв claim гэсэн баталгаа биш. Controller/service/repository-ийн
хариуцлагыг тайлбарт мөн ялгах хэрэгтэй. Type-check нь snippet-ийн signature-ийг,
local test нь сонгосон behavior-ийг шалгадаг; live database verification өөр ажил.
Нэг domain example болон warning-as-error build нь тайлбарыг кодтой хамт хадгалахад
тусалдаг. Seeded detector test-ийг бодит AI hallucination олсон нотолгоо болгож болохгүй.

Reusable reference: [TypeDoc validation](https://typedoc.org/documents/Options.Validation.html),
[GitLab Pages](https://docs.gitlab.com/user/project/pages/getting_started/pages_from_scratch/).
Номын хэрэглэсэн chapter/page болон reflection нь тайлан/audit-д бий.

Дараа нь independent manual/model comparison-ийн нотолгоог нөхөх; GitLab project
байгуулсан үед export-ийг ашиглаж CI/Pages/issue-ийг бодитоор шалгах. Sem7-ийн тусгай
handout орвол түүнийг эх болгож error microcopy-ийн old/new/reason бэлтгэнэ.
