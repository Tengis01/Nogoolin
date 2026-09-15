# Seminar 1 — Document RAG Chatbot

Lecture 01 болон Seminar 01 Handout-ийг уншиж, `/home/tengis/Documents/Tengis/rag_chatbot` төслийн код, байгаа README-д тулгуурлан бэлтгэв. Эх төслийг өөрчлөөгүй.

## Гаралт

| PDF | Дасгал | Агуулга |
| --- | --- | --- |
| `01_documentation_types.pdf` | US-1.1 | FastAPI, NumPy, Django REST framework-ийн 4 төрлийн матриц; RAG chatbot-д хэрэглэх кейсүүд |
| `02_audience_persona.pdf` | US-1.2 | Persona, end-end user, 3 бодит community асуудал, өөрийн дүгнэлт |
| `03_curse_of_knowledge.pdf` | US-1.3 | `apps/web/README.md`-ийн 3 эх өгүүлбэр ба Before/After засвар |
| `04_writer_in_the_middle.pdf` | US-1.4, UE-1 | Яг 200 үгийн reflection, 7 чиглэл, weekly reflection, 1 хуудас Corg.ly A–C хавсралт |

Дөрвөн эх `.tex` файл `latex/` дотор бий. `wiki/` дотор Confluence-д оруулах Markdown хувилбарууд, заавал хийх UE-1-ийн нэгтгэсэн `UE1_Corgly_Roleplay.md` байна.

## Дахин хөрвүүлэх

Төслийн үндсэн хавтсаас:

```bash
bash sem1/latex/build.sh
```

XeLaTeX, Liberation Serif/Sans/Mono фонтууд, TeX Live packages шаардлагатай. Build нь завсрын файлуудыг `sem1/tmp/pdfs/`, эцсийн дөрвөн PDF-ийг `sem1/` дотор бичнэ (замууд ICSI405 үндсэн хавтсаас).

## Хамрах хүрээ, үнэн зөв байдлын тэмдэглэл

- Семинарын үндсэн дөрвөн deliverable-ийг тус бүр нэг PDF болгосон. Getting Started / Tutorial / Reference / API нь эхний PDF-ийн ангилал; Lecture-ийн User / Developer / Operations / Process-той адил ангилал гэж үзээгүй.
- Persona-г өөрийн нэрээр, шинэ уншигчийн байр сууринаас бичсэн. Байгууллагын нэрүүд нь кейсийн жишээ.
- Corg.ly-ийн README өгүүлбэрүүд нь сургалтын зохиомол өгүүлбэр; номд байгаа бодит API гэрээ гэж үзээгүй.
- Community-ийн гурван асуудал нь Stack Overflow дээрх бодит эх сурвалжтай. Тэдгээрийг энэ төслийн алдаа болсон гэх нотолгоо болгож ашиглаагүй.
- US-1.4 reflection нь зайгаар тусгаарласан тооллоор 200 үгтэй. `latex/reflection_200_words.txt` нь тоолох эх.
- Confluence-д нийтлээгүй, LMS quiz өгөөгүй. Ярилцлага, peer test хийгээгүй тул тэдгээрийн оронд өөрийн дүгнэлт оруулсан; US-1.2-ын ярилцлагын эшлэл, US-1.3-ын уншигчийн бодит тестийн шалгуур биелээгүй.
- RAG chatbot-ийг ажиллуулж туршаагүй; энэ нь документацийн даалгавар, кодын өөрчлөлт биш.

## Хавтасны шинжилгээ

`book/` — гурван үндсэн ном; `lecture/` — Lecture 01, 02; `sem1/` — Week 01 handout ба энэ ажлын эхүүд; `sem2/` — Week 02 handout. Эх материалуудыг хэвээр хадгалсан.

RAG chatbot-ийн root README байхгүй, web README нь Vite template байна. `docs/PROJECT_BRIEF.md`-ийн Supabase архитектур нь `AGENTS.md`, `docs/LOCAL_SETUP.md`, `docker-compose.yml` дэх local PostgreSQL орчинтой зөрдөг. Эдгээрийг шинэ уншигчийн onboarding болон living documentation-ийн кейс болгосон.
