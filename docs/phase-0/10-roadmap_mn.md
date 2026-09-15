# Хөгжүүлэлтийн Замын Зураг (Development Roadmap)

**Баримт:** `docs/phase-0/10-roadmap_mn.md`
**Төсөл:** Nogoolin — Premium шашны бүтээгдэхүүний каталог платформ
**Хувилбар:** 1.0.0
**Төлөв:** Идэвхтэй
**Зохиогч:** Тэнгис (Solo Developer)
**Сүүлд шинэчилсэн:** 2026-07-14

---

## Өөрчлөлтийн түүх

| Хувилбар | Огноо | Төрөл | Тайлбар |
|---|---|---|---|
| 1.0.0 | 2026-07-14 | MAJOR | Анхны хувилбар. Master plan болон Phase 0-ийн үр дүнг нэгтгэсэн; эцсийн стек (Fastify, React Native + Expo)-ийг тусгасан |

---

## Агуулга

1. [Ерөнхий хугацаа](#1-ерөнхий-хугацаа)
2. [Phase 0 — Баримт бичиг ба Төлөвлөлт ✅](#2-phase-0--баримт-бичиг-ба-төлөвлөлт-)
3. [Phase 1 — Суурь (Foundation) 🔜](#3-phase-1--суурь-foundation-)
4. [Phase 2 — Бүтээгдэхүүний систем](#4-phase-2--бүтээгдэхүүний-систем)
5. [Phase 3 — Premium туршлага](#5-phase-3--premium-туршлага)
6. [Phase 4 — Soft Order / Inquiry систем](#6-phase-4--soft-order--inquiry-систем)
7. [Phase 5 — Хүргэлтэд бэлэн бүтэц](#7-phase-5--хүргэлтэд-бэлэн-бүтэц)
8. [Phase 6 — Нээлтийн бэлтгэл](#8-phase-6--нээлтийн-бэлтгэл)
9. [Нээлтийн дараах замын зураг](#9-нээлтийн-дараах-замын-зураг)
10. [Ажлын дүрмүүд](#10-ажлын-дүрмүүд)

---

## 1. Ерөнхий хугацаа

| Үзүүлэлт | Утга |
|---|---|
| MVP зорилт | Нийт 16 долоо хоног (Phase 0 орсон) |
| Үлдсэн ажил | ~14 долоо хоног (Phase 1–6) |
| Бодит polished зорилт | 20–24 долоо хоног |
| Арга зүй | Personal Kanban (WIP max 2), ням гараг бүр 30 минутын review |

```
Phase 0 ✅ → Phase 1 → Phase 2 → Phase 3 → Phase 4 → Phase 5 → Phase 6 → Нээлт
 (2 д.х)     (3 д.х)   (3 д.х)   (2.5 д.х)  (2.5 д.х)  (1.5 д.х)  (1.5 д.х)
```

Даалгаврын эрэмбийг GitHub Projects самбарт **P0** (заавал) / **P1** (хийвэл зохих) / **P2** (нэмэлт) гэж хөтөлнө.

---

## 2. Phase 0 — Баримт бичиг ба Төлөвлөлт ✅

**Хугацаа:** 2 долоо хоног | **Төлөв:** ДУУССАН (2026-07-05)

### Гүйцэтгэсэн бүтээгдэхүүнүүд

| Баримт | Хувилбар |
|---|---|
| 01-vision | v1.4.0 |
| 02-requirements | v1.4.0 |
| 03-use-cases | v1.0.0 |
| 04-er-diagram (11 entity) | v1.0.0 |
| 05-sequence-diagrams | v1.1.0 |
| 06-api-spec (23 path / 28 operation / 18 schema) | v1.0.0 |
| 07-uiux-wireframes (WF-XX-NN шаардлагын ID) | v1.0.0 |
| 08-security | v1.2.0 |
| 09-deployment | v1.2.0 |

Бүх баримт англи + монгол хос хувилбартай. Зөрчлийн эрэмбэ: `07 doc > 02-requirements > prototypes`.

### Эцэслэсэн шийдвэрүүд (дахин хэлэлцэхгүй)

- **Backend:** Fastify + TypeScript (Express.js-ээс шилжсэн — native TS, гүйцэтгэл, plugin архитектур)
- **Mobile:** React Native + Expo, prebuild/CNG + dev client, Expo Go БИШ (Flutter-ээс шилжсэн — бүх stack нэг TypeScript; Rive-ийн албан ёсны RN Nitro runtime гарснаар Flutter-ийн гол давуу тал арилсан)
- **Web:** Next.js (SEO-д SSR шаардлагатай), Three.js + React Three Fiber
- **Database:** Supabase PostgreSQL (Сингапур region), Supabase Auth (access token 15 мин + refresh 7 хоног, rotation идэвхтэй), Supabase Storage
- **Архитектур:** Layered Monolith (Controller → Service → Repository); repository давхарга нь ирээдүйн DB шилжилтийг тусгаарлана
- **Дизайны lock (v4 palette):** харанхуй intro radial gradient `#245842→#1B4634`, saffron `#F2C94C`, ivory `#F5F2E6`; цагаан каталог ink `#17352A`, action `#0BB555`, saffron-deep `#A9861B`; **Phase 3 хүртэл улаан өнгө хориотой**
- **Хойшлуулсан шийдвэрүүд:** D-01..D-06 (ангиллын тоо 6/8/10, улаан accent-ийн цаг хугацаа, зургийн стандарт, GLB composition re-tune, i18n, sticky nav)

---

## 3. Phase 1 — Суурь (Foundation) 🔜

**Хугацаа:** 3 долоо хоног | **Төлөв:** ДАРААГИЙН | **Зорилго:** Ажиллах техникийн суурь

### 1-р долоо хоног — Repo & Дэд бүтэц

- [ ] Monorepo үүсгэх (`apps/web`, `apps/mobile`, `backend/api`, `packages/*`)
- [ ] GitHub repo + branch стратеги (`main` / `develop` / `feature/xxx`)
- [ ] GitHub Projects Kanban самбар (Backlog → This Week → In Progress → Review → Done)
- [ ] Docker multi-stage build (Fastify) + local dev-д `docker-compose.yml`
- [ ] GitHub Actions skeleton (`web-deploy.yml`, `api-deploy.yml`, `mobile-build.yml` → EAS Build)

### 2-р долоо хоног — Backend & Өгөгдлийн сан

- [ ] Fastify + TypeScript суурь бүтэц (port 3001), давхаргат архитектур: Controller → Service → Repository
- [ ] Supabase project үүсгэх (Сингапур region)
- [ ] DB schema migration бичих (`04-er-diagram`-ийн 11 entity бүгд)
- [ ] `08-security`-ийн дагуу RLS policy-ууд
- [ ] `packages/validation-schemas` (Zod, web + API + mobile хамтран ашиглана)

### 3-р долоо хоног — Auth & Admin scaffold

- [ ] Supabase Auth: email + Google OAuth + Facebook OAuth
- [ ] JWT + RBAC (admin / customer role)
- [ ] Next.js `/admin` хамгаалагдсан route scaffold
- [ ] Expo app init (dev client — Rive болон Google Sign-In нь native module шаарддаг)
- [ ] `.env.example` бүрэн; `08-security` §11.2-ын дагуу нууц мэдээллийн дүрэм мөрдөх

### Амжилтын шалгуур

- [ ] Monorepo, CI/CD, Supabase schema ажиллаж байна
- [ ] Нэвтрэлт ажиллаж байна (email + Google OAuth)
- [ ] Admin scaffold нээгдэж байна

---

## 4. Phase 2 — Бүтээгдэхүүний систем

**Хугацаа:** 3 долоо хоног | **Зорилго:** Ашиглах боломжтой каталог систем

### Даалгаврууд

- [ ] Category CRUD (admin) — ангиллын мөрийн дүрэм: ямар ч тоонд нэг мөр, хэзээ ч wrap хийхгүй; хэтэрвэл horizontal scroll + баруун талын fade
- [ ] Product CRUD (үүсгэх / засах / publish / archive / устгах)
- [ ] Бүтээгдэхүүний зураг upload (Supabase Storage)
- [ ] Хэрэглэх зааврын менежмент
- [ ] Бүтээгдэхүүний listing хуудас (ангиллын filter; олон бичгийн хайлт: Кирилл / Латин / Англи)
- [ ] Бүтээгдэхүүний дэлгэрэнгүй хуудас (зураг, үнэ, тайлбар, хэрэглэх заавар)
- [ ] SEO: цэвэр slug, meta title/description, Open Graph, sitemap
- [ ] Mobile: listing + detail үндсэн дэлгэцүүд

### Амжилтын шалгуур

- [ ] Admin 5 минутын дотор бүтээгдэхүүн үүсгэж, засаж, publish хийж чадна
- [ ] Listing хуудас Монголын дундаж mobile холболтоор 2 секундээс бага хугацаанд ачаална
- [ ] Дэлгэрэнгүй хуудас Lighthouse SEO оноо ≥ 90 авна

---

## 5. Phase 3 — Premium туршлага

**Хугацаа:** 2.5 долоо хоног | **Зорилго:** Premium web болон mobile нээлтийн туршлага
**Эрсдэлийн түвшин: Бүх Phase-ээс ХАМГИЙН ӨНДӨР** (3D математик, платформ хоорондын animation ижилтгэл, зайлсхийх ёстой баримтжуулсан prototype bug-ууд)

### Даалгаврууд

- [ ] Ногоон Дарь Эхийн GLB бэлтгэх; gltf-pipeline Draco-оор шахах (< 5 MB)
- [ ] Three.js / R3F intro: 5 секундын нэг camera arc (az `0.85→0`, r `16→6.2`, y `7.5→2.2`, smootherstep easing)
- [ ] **Дүрэм:** бурхан хэзээ ч хөдлөхгүй; уур амьсгал амьсгална; камер зөвхөн зорилготой хөдөлнө
- [ ] **Дүрэм:** lateral camera translate ХОРИОТОЙ (мэдэгдэж буй v4 bug: бурхан ~10–20° эргэсэн мэт харагдаж, halo parallax үүсдэг); оронд нь `camera.setViewOffset` asymmetric projection ашиглана
- [ ] Бурханы баруун байрлал: `camera.setViewOffset` (offsetX `−0.18w` desktop / `−0.10w` mobile)
- [ ] Эхлэх → shrinking hero: нэг persistent canvas `100vh→35vh` (mobile `42vh`, 1.1 сек)
- [ ] Skip товч (1 секундын дотор харагдана), static fallback, reduced-motion дэмжлэг
- [ ] Дэлгэрэнгүй хуудсанд 360° product viewer (OrbitControls; GLB байхгүй бол зургийн gallery fallback)
- [ ] Mobile Rive intro + шилжилт (албан ёсны Rive RN Nitro runtime)
- [ ] D-04 шийдэх: GLB composition re-tune

### Амжилтын шалгуур

- [ ] 3D intro алдаагүй дуусна; skip товч 1 секундын дотор харагдана
- [ ] v4 prototype-ийн rotation/parallax bug ДАВТАГДАХГҮЙ
- [ ] Fallback бүх төхөөрөмж дээр ажиллана; mobile Rive intro Android, iOS хоёул дээр тоглоно

---

## 6. Phase 4 — Soft Order / Inquiry систем

**Хугацаа:** 2.5 долоо хоног | **Зорилго:** Хүргэлтийн үйл ажиллагаа бэлэн болохоос өмнө хэрэглэгч сонирхлоо илэрхийлэх боломжтой болох

> ⚠️ **Дүрэм:** Энэ шатанд бүрэн checkout ХИЙХГҮЙ — хүргэлтийн үйл ажиллагаа бэлэн биш. Оронд нь soft order / inquiry бүтээнэ.

### Даалгаврууд

- [ ] Бүтээгдэхүүний inquiry form (2 минутын дотор илгээх боломжтой, бүрэн бүртгэл шаардахгүй)
- [ ] Admin inquiry inbox + статусын менежмент
- [ ] Wishlist / cart draft (бүрэн checkout БИШ)
- [ ] Хэрэглэгчийн үндсэн profile
- [ ] Inquiry түүх
- [ ] Mobile inquiry form

### Амжилтын шалгуур

- [ ] Хэрэглэгч 2 минутын дотор inquiry илгээж чадна
- [ ] Admin бүх inquiry-г dashboard-оос харж, хариулж чадна

---

## 7. Phase 5 — Хүргэлтэд бэлэн бүтэц

**Хугацаа:** 1.5 долоо хоног | **Зорилго:** Систем ирээдүйд зөвхөн toggle-оор хүргэлтийг идэвхжүүлэхэд бэлэн болох

### Даалгаврууд

- [ ] `delivery_enabled` toggle (admin panel)
- [ ] Backend-ийн бүх давхаргад `delivery_enabled` enforcement
- [ ] Захиалгын статусын суурь + order management scaffold
- [ ] Хүргэлтийн тохиргооны хуудас
- [ ] Хүргэлтийн ажилтны role (ирээдүйд бэлэн)

**Архитектурын зарчим:** Хүргэлтийн систем schema + API түвшинд бүрэн баригдсан боловч admin toggle-ийн ард идэвхгүй байна — идэвхжүүлэхэд refactor шаардлагагүй.

---

## 8. Phase 6 — Нээлтийн бэлтгэл

**Хугацаа:** 1.5 долоо хоног | **Зорилго:** Web MVP live; mobile build туршилтад бэлэн

### Даалгаврууд

- [ ] Гүйцэтгэлийн оновчлол (зургийн оновчлол, 3D lazy load, боломжтой газарт static rendering)
- [ ] SEO эцсийн шалгалт (sitemap, robots.txt, structured data)
- [ ] Аюулгүй байдлын review (`08-security` §13 checklist)
- [ ] Cloudflare DNS / WAF тохиргоо
- [ ] Vercel web deployment (custom domain)
- [ ] Railway API deployment (Docker, `api.yourdomain.com`)
- [ ] Production орчны хувьсагчид
- [ ] EAS Build: Android internal testing build; iOS TestFlight (сонголттой)
- [ ] Эцсийн баримтжуулалт

> ⚠️ App Store / Play Store-ийн **нийтийн** submission нь нээлтийн blocker БИШ.

### Амжилтын шалгуур

- [ ] Web app Vercel дээр deploy хийгдэж, custom domain-аар хандах боломжтой
- [ ] API Railway дээр Docker-оор ажиллаж байна
- [ ] Mobile app хоёр платформ дээр internal testing давсан

---

## 9. Нээлтийн дараах замын зураг

MVP-ийн хэсэг биш. Нээлтийн дараа эргэн харна:

- Төлбөрийн gateway интеграц
- Захиалгын tracking; хүргэлтийн ажилтны mobile app
- Зургаар хайх (камер → pgvector-оор ижил төстэй бүтээгдэхүүн олох)
- VM / self-hosted Supabase шилжилтийг үнэлэх (repository давхарга нь app дахин бичихгүйгээр үүнийг боломжтой болгоно)
- Үлдсэн хойшлуулсан шийдвэрүүдийг шийдэх (D-05 i18n, D-06 sticky nav)
- Каталог өргөтгөх, loyalty функцууд

---

## 10. Ажлын дүрмүүд

1. Microservices-ээр эхлэхгүй.
2. Backend-ийг over-engineer хийхгүй.
3. Нэг backend нь web, admin, mobile гурвуулангаа үйлчилнэ.
4. Бизнесийн үйл ажиллагаа бэлэн болтол хүргэлтийг идэвхгүй байлгана.
5. Эхлээд каталог, эрт үед admin CRUD-ийг бүтээнэ.
6. 3D intro үргэлж skip болон fallback-тай байна.
7. Аюулгүй байдлыг эхнээс нь шийднэ, дараа нь нэмж наахгүй.
8. Төгс diagram-аас ажилладаг software чухал.
9. Git сахилга бат: `feat:/fix:/docs:/refactor:/test:/chore:` commit; `main` / `develop` / `feature/xxx` branch.
10. Ням гараг бүр: 30 минутын review — хийсэн / дараагийн / саад.

---

*Өмнөх баримт: [`docs/phase-0/09-deployment_mn.md`](09-deployment_mn.md)*
*Энэ баримт нь амьд лавлагаа. Ажил урагшлах тусам Phase-ийн төлөвүүдийг шинэчилнэ.*
