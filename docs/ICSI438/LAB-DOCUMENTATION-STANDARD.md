# ICSI438 Lab Documentation Standard

[Home](COURSE-HOME.md) · [Template](templates/ICSI438-LAB-TEMPLATE.md) · [Course rules](AGENTS.md)

Энэ нь durable Markdown engineering notebook; submission-ийн PDF/LaTeX шаардлагыг орлохгүй. Үндсэн бичвэр монгол кирилл, technical identifiers/path/command англи байж болно. Хамаарахгүй section-ийг N/A гэж тэмдэглэнэ; хоосон filler бөглөхгүй.

## 1. Metadata

Seminar/Lab number, бодит огноо, topic, status, source PDF/page/section. Local artifact, verification, submission/review төлөвийг ялгана.

## 2. Objective

Ямар чадвар сурч, ямар асуудал шийдэхийг 1–2 өгүүлбэрээр бичнэ.

## 3. Required Knowledge

Хэрэгтэй prerequisite, өмнөх seminar-ийн тодорхой section холбоос. Онолыг давтахгүй.

## 4. Environment

Зөвхөн relevant OS/tool/version/package, VM/container/server. Шалгаагүй version-ийг unknown гэж бичнэ; credentials хадгалахгүй.

## 5. Task / Problem

Тухайн handout-ийн шалгуур, required artifact/word count/acceptance evidence. Жишээ болон бодит requirement-ийг ялгана.

## 6. Procedure

Бодитоор хийсэн чухал алхам, яагаад хэрэгтэй, өөрчилсөн файлын холбоос. Existing exercise-ийг хуулбарлахгүй.

## 7. Commands

Команд бүрт working directory, purpose, чухал flags, expected result, actual execution status. Code block хэрэглэнэ; credential утга/бүтэн log оруулахгүй.

## 8. Configuration

Өөрчилсөн relevant setting/file ба үндэслэл. Secret/config бүхлээр хуулбарлахгүй; өмнөх тохиргоог хадгална.

## 9. Results

Бодит artifact, хэрэгтэй богино output, observed result. Expected ≠ actual; screenshot нь runtime test-тэй адил нотолгоо биш.

## 10. Verification

Command/test/service/network/expected behavior, огноо, result, evidence link. Not run / blocked / passed гэдгийг ялгана. Бүх шалгуур батлагдаагүй үед completed биш.

## 11. Problems Encountered

Бодит error/symptom, ямар нөхцөлд гарсан, холбогдох evidence. External issue-ийг өөрийн төсөлд болсон гэж бичихгүй.

## 12. Solutions

Problem бүрийн root cause, fix/workaround, verification. Шийдэгдээгүй бол open гэж үлдээнэ.

## 13. Security / Safety Notes

Хамаарах эрсдэл, local/staging target, data/auth/network хязгаар. Secret, real credential, production/destructive үйлдэл тусдаа зөвшөөрөл шаарддаг.

## 14. What I Learned

Өөрийн practical terms-аар 3–5 өгүүлбэр; хийгээгүй experience зохиохгүй. Exam revision-д хэрэгтэй ялгааг онцолно.

## 15. Reusable Knowledge

Давтагдах command/concept/troubleshooting-ийг knowledge note руу холбоно. Нэг удаагийн artifact-ийг бүү promote хий.

## 16. Next Seminar Preparation

Roadmap-д тулгуурласан богино checklist, шаардлагатай prerequisite, unresolved problem. Schedule зохиохгүй.

## Naming ба эх материал хадгалах

Existing scheme цэвэр: `sem1/`, `sem2/`, `sem3/`, `sem4/`; `sem5/` handout аль хэдийн байгаа. Ирээдүйд **`semN/README.md`**-ийг нэг durable documentation unit болгон ашиглана. `sem-05` эсвэл шинэ `seminars/` давхар hierarchy үүсгэхгүй; хуучныг зөөх/rename хийхгүй.

- Final submission: тухайн `semN/` дотор; байгаа naming-ийг хадгална.
- Засварлах эх: шаардлагатай бол `latex/`, нэмэлт note `wiki/`, diagram source `diagrams/`, хэрэгтэй screenshot/assets `assets/`.
- `files/` эсвэл `screenshots/` зөвхөн бодит материал гарсан үед үүсгэж болно. `tmp/` нь disposable build/QA; agent default context биш.
- Sem1–Sem4 README аль хэдийн сайн index тул энэ стандартад тааруулахын тулд дахин бичихгүй. New/current seminar дээр л хэрэглэнэ.
- Product source `docs/requirements/`, `docs/architecture/` дотор байвал link хийнэ; course руу duplicate үүсгэхгүй. Course task нь product code/deployment өөрчлөх автомат зөвшөөрөл биш.

## Completion ба долоо хоногийн maintenance

🟡 = in progress/draft/local-ready with open criteria; ⬜ = work not evidenced; ✅ = тухайн note-ийн зарласан scope-ийн бүх шалгуур evidence-тай. Тусдаа `Local artifacts / Verified / Peer review / Published / Submitted` төлөв хадгална. Teacher grade/approval байхгүй бол unknown; өөрөө оноо/approval зохиохгүй.

Seminar-ийн дараа current note → WEEKLY-PROGRESS → COURSE-HOME status → хэрэгтэй reusable knowledge → next prep дарааллаар шинэчилж зогсоно. Historical note-уудыг долоо хоног бүр дахин бичихгүй. Log/output-ийг богино excerpt + real file link болгон хадгална; raw chat transcript хэрэггүй.

## Ирээдүйн automation

“Update ICSI438 for today's seminar” хүсэлт нь maintainer skill-ийг ашиглана. Material-аас number/topic тогтоох боломжгүй бол тэр мэдээллийг асууж, independent index check-ийг үргэлжлүүлнэ. Cron/schedule одоогоор байхгүй. Exact schedule, source input болон write scope зөвшөөрсний дараа Hermes recurring job нь энэ skill-ийг invoke хийж, current seminar-ийн reviewable draft/progress update гаргаж болно; interview/test/submission-ийг автоматаар хийгдсэн гэж тэмдэглэхгүй.
