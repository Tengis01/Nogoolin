# Seminar 5 — OpenAPI 3.0 ба code sample

**Тэнгис · Nogoolin · 2026-10-01–02 · v0.1 local draft.** [W5 тусгай заавар](<Sprint 05 Lab Instructions - OpenAPI 3.0 & Bhatti Code Samples.pdf>) нь 3 агуулгын хуудас, PDF-д төгсгөлийн 4 дэх хоосон хуудастай. [Course home](../COURSE-HOME.md) · [Weekly progress](../WEEKLY-PROGRESS.md).

GitHub дахь Sem5 хавтас: <https://github.com/Tengis01/Nogoolin/tree/main/docs/ICSI438/sem5>. [renderers/](renderers/) хавтаст `redoc.html` (Redoc), `swagger.html` (Swagger UI) бий.

## Зорилго, эх ба багц

Handout х.1–3-ын дагуу таван route бүхий OpenAPI 3.0.3 spec, code sample audit, Swagger UI/Redoc хоёр renderer, 100 үгийн харьцуулалт, UE-5 гурван Python жишээг локал орчинд бэлдэв. Номын холбогдох санааг Bhatti Ch.5 х.86–94, Chinchilla Ch.6 х.79-өөс тулгав. Энэ ажил нь сургалтын баримт; бүтээгдэхүүний API кодыг өөрчлөөгүй.

- [Хэвлэх PDF](sem5_merged.pdf) · [үндсэн тайлан Markdown](wiki/sem5-report.md) · `latex/sem5_merged.tex` — засварлах TeX эх.
- [OpenAPI YAML](openapi/openapi.yaml) — таван бодит Nogoolin operation, reusable schemas/security, request болон response examples, 4xx/5xx schema.
- [Swagger UI](renderers/swagger.html) · [Redoc](renderers/redoc.html) — нэг YAML-г локал үзэх хоёр хуудас. Swagger assets нь `tools` dependency-д, Redoc HTML нь generated artifact.
- [Photo upload](samples/upload_photo.py) · [Bark translation](samples/translate_bark.py) · [Webhook subscription](samples/subscribe_webhook.py) — UE-5 сургалтын Corg.ly scenario; response-ийг зохиож бичээгүй.

Sem3 [SRS](../../requirements/srs-v1.0.md), Sem4 [architecture](../../architecture/arc42-nogoolin.md) болон [`backend/api`](../../../backend/api/src/app.ts)-ийн route/controller/schema-г эх болгон ашиглав. `docs/phase-0/06-api-spec.yaml` нь хуучин full spec; энэ mini-spec түүнийг албан ёсоор орлоогүй.

## Орчин ба команд

Working directory: **Nogoolin repository root**. Redocly CLI 2.55.0, Node 26.9.0, Python 3 (`requests` 2.33.1), Pandoc, XeLaTeX, latexmk-ээр энэ багцыг үүсгэж шалгасан. Swagger UI 5.33.0 нь `tools/package-lock.json`-д pin хийгдсэн. Шинэ checkout дээр `npm ci --prefix docs/ICSI438/sem5/tools` ажиллуулна.

```bash
redocly lint docs/ICSI438/sem5/openapi/openapi.yaml
redocly build-docs docs/ICSI438/sem5/openapi/openapi.yaml -o docs/ICSI438/sem5/renderers/redoc.html
python3 -m py_compile docs/ICSI438/sem5/samples/*.py
python3 docs/ICSI438/sem5/latex/build.py --from-markdown
python3 -m http.server 8765 --directory docs/ICSI438/sem5
```

Local server-т `http://localhost:8765/renderers/swagger.html` болон `http://localhost:8765/renderers/redoc.html`-ийг нээнэ. Swagger UI-ийн static assets нь локал `node_modules`-оос ачаална. Redoc HTML нь `cdn.redocly.com`-оос runtime script ачаалдаг тул браузерээр нээхэд сүлжээ шаардлагатай. UI-ийн actual browser rendering, “Try it out” хүсэлт болон public URL-ийг энэ ажилд баталгаажаагүй. Swagger request илгээх бол `localhost:3001` API болон local Supabase-ийг ажиллуулж, зөв token-оор аюулгүй test data ашиглах хэрэгтэй.

`--from-markdown` нь sample script-үүдийг Markdown тайланд оруулж TeX-ийг **дахин үүсгэнэ**. `latex/sem5_merged.tex`-ийг гараар зассан бол зөвхөн `python3 docs/ICSI438/sem5/latex/build.py` ажиллуулна. `sem5.code-workspace`-ийг VS Code-д нээхэд LaTeX Workshop TeX хадгалмагц PDF-г compile хийнэ; Markdown нь автоматаар TeX болдоггүй.

## Бодит шалгалт ба үлдсэн зүйл

| Шалгуур | Байдал |
|---|---|
| OpenAPI 3.0.3, ≥5 operation | 5; `redocly lint` valid, **0 error** |
| Reusable security/schema, input, success + 4xx/5xx | YAML-д байгаа; GET requestBody-ийн оронд параметр хэрэглэсэн |
| Request/response жишээ | Байгаа; illustrative, live capture биш |
| Python гурван script | Синтакс шалгасан; Corg.ly server contract/runtime батлагдаагүй |
| Audit ≥4/5 | **3.6/5**; trustworthy нотолгоо дутуу |
| 100 үгийн шийдвэр | 100 үг, build script тоолдог |
| Swagger UI ба Redoc локал эх | HTML/YAML/assets локал HTTP-ээр 200; браузер QA хийгдээгүй |
| Public хоёр URL / functional Try-It-Out | Хийгдээгүй |
| Git commit, CI bonus, workspace upload/submission | Хийгдээгүй |

Redocly built-in recommended config хоёр warning үлдээсэн: local `localhost` server URL (энэ лабораторийн зориудын сонголт), `info.license` байхгүй (repo-ийн лицензийг таамаглаагүй). Энэ нь 0-error шалгуурыг зөрчөөгүй. Бодит response батлагдтал audit 4/5 гэж мэдүүлэхгүй. Public байршуулалт, peer/багшийн feedback, үнэлгээний нотолгоо байхгүй.

**Илэрсэн drift:** Sem3 FR-03 утсыг яг 8 цифр гэж бичсэн, харин бодит Zod `phoneSchema` нь 8–15 тэмдэгт (`+`, зай, `-` орж болно) зөвшөөрдөг. Mini-spec нь кодыг дагасан; энэ ялгааг үндсэн SRS/API шийдвэрт засах хэрэгтэй.

## Сурсан зүйл, асуудал, дараагийн бэлтгэл

OpenAPI schema valid болсон нь example live серверээс гарсан гэсэн баталгаа биш. Ялангуяа Corg.ly handout endpoint-ийн нэрийг өгсөн ч field contract/серверийг өгөөгүй тул copy-paste кодын Trustworthy үнэлгээ доогуур үлдэв. API эх код, Zod schema, YAML гурав зөрөх эсэхийг endpoint бүрээр тулгах нь хэрэгтэй. Дараа нь багшаас жинхэнэ Corg.ly sandbox/response contract эсвэл mock server, public hosting-ийн шаардлага/байршлыг авах; өгөгдсөн үед sample-уудыг ажиллуулж жинхэнэ response, 4/5 audit, renderer browser QA-г нөхнө. Семинар 6-ийн handout орж ирвэл түүн дээр үндэслэн docstring/ethics бэлтгэнэ.
