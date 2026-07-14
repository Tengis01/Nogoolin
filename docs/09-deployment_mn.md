# Байршуулалтын Гарын Авлага

**Баримт бичиг:** `docs/09-deployment.mn.md`
**Төсөл:** Ногоолин — Шашны Бүтээгдэхүүний Каталог Платформ
**Хувилбар:** 1.2.0
**Төлөв:** Ноорог
**Зохиогч:** Тэнгис (Хөгжүүлэгч)
**Сүүлд шинэчилсэн:** 2026 оны 7-р сар
**Хамааралтай баримт:** [`docs/06-api-spec.yaml`](./06-api-spec.yaml), [`docs/08-security.mn.md`](./08-security.mn.md)

---

## Өөрчлөлтийн Түүх

| Хувилбар | Огноо | Төрөл | Тайлбар |
|---|---|---|---|
| 1.2.0 | 2026 оны 7-р сар | MINOR | Flutter-ийг React Native + Expo-оор солилоо: мобайл CI/CD, build/түгээлт, локал хэрэгсэл, environment тохиргоо бүгд шинэчлэгдлээ; `flutter-build.yml`-ийг `mobile-build.yml` (EAS Build)-аар орлуулав |
| 1.1.0 | 2026 оны 6-р сар | MINOR | Fastify CLI-г локал хэрэгслүүдэд нэмлээ (§3.2); Dockerfile-д Fastify TypeScript boilerplate-ийн тэмдэглэл шинэчлэгдлээ; docker-compose dev command шинэчлэгдлээ |
| 1.0.0 | 2026 оны 6-р сар | MAJOR | Анхны хувилбар. Supabase, Railway, Vercel, Cloudflare дахь бүрэн үйлдвэрлэлийн байршуулалт, CI/CD pipeline-ууд, анхны admin bootstrap, нэвтрүүлэлтийн өмнөх runbook-ийг хамарна. |

---

## Гарчгийн Жагсаалт

1. [Тойм](#1-тойм)
2. [Дэд Бүтцийн Архитектур](#2-дэд-бүтцийн-архитектур)
3. [Урьдчилсан Нөхцөл](#3-урьдчилсан-нөхцөл)
4. [Supabase Тохируулга](#4-supabase-тохируулга)
5. [Railway Тохируулга (API)](#5-railway-тохируулга-api)
6. [Vercel Тохируулга (Вэб)](#6-vercel-тохируулга-вэб)
7. [Cloudflare DNS Тохируулга](#7-cloudflare-dns-тохируулга)
8. [CI/CD Pipeline-ууд (GitHub Actions)](#8-cicd-pipeline-ууд-github-actions)
9. [Анхны Admin Bootstrap](#9-анхны-admin-bootstrap)
10. [Мобайл Build ба Түгээлт (EAS)](#10-мобайл-build-ба-түгээлт-eas)
11. [Нэвтрүүлэлтийн Өмнөх Runbook](#11-нэвтрүүлэлтийн-өмнөх-runbook)
12. [Нэвтрүүлэлтийн Дараах Хяналт](#12-нэвтрүүлэлтийн-дараах-хяналт)

---

## 1. Тойм

### 1.1 Зорилго

Энэхүү баримт бичиг нь Ногоолиныг үйлдвэрлэлд байршуулах алхам бүрийн гүйцэтгэлийн лавлагаа болно. Дэд бүтцийн стек дахь бүх үйлчилгээг тохируулах дарааллыг (хамаарлууд дээрээс доош урсдаг) хамарна:

```
1. GitHub (репозитор + нууц мэдээлэл)
    ↓
2. Supabase (мэдээллийн сан + auth + storage) — бусад бүх үйлчилгээ үүнд хамаарна
    ↓
3. Railway (API container) — Supabase итгэмжлэлд хамаарна
    ↓
4. Vercel (вэб апп) — Railway API URL + Supabase anon key-д хамаарна
    ↓
5. Cloudflare (DNS + WAF) — домэйнуудыг Vercel болон Railway руу чиглүүлнэ
    ↓
6. GitHub Actions (CI/CD) — Railway + Vercel-д автоматаар байршуулна
```

### 1.2 Орчны Стратеги

| Орчин | Вэб | API | Мэдээллийн сан | Зорилго |
|---|---|---|---|---|
| `local` | `localhost:3000` | `localhost:3001` | Локал Supabase CLI | Өдөр тутмын хөгжүүлэлт |
| `production` | `nogoolin.mn` | `api.nogoolin.mn` | Supabase cloud (Сингапур) | Амьд платформ |

MVP-д **тусдаа staging орчин байхгүй** — нэг хөгжүүлэгчийн хүлээн зөвшөөрсөн хязгаарлалт. CI/CD pipeline нь `main`-д merge хийгдэх бүр шууд үйлдвэрлэлд байршуулна. Feature branch-ууд merge хийхийн өмнө локалаар шалгагдана.

### 1.3 Monorepo Бүтэц (Лавлагаа)

```
nogoolin/
├── apps/
│   ├── web/          → Next.js (Vercel-д байршуулагдана)
│   ├── api/           → Fastify (Railway-д Docker-аар байршуулагдана)
│   └── mobile/       → Expo React Native (EAS Build-аар build хийгдэнэ → APK/IPA)
├── packages/
│   ├── shared-types/
│   └── validation-schemas/
├── supabase/
│   ├── migrations/   → хувилбаржуулсан SQL migration файлууд
│   └── seed.sql      → анхны seed өгөгдөл (delivery_enabled=false гэх мэт)
├── .github/
│   └── workflows/
│       ├── web-deploy.yml
│       ├── api-deploy.yml
│       └── mobile-build.yml
├── docker-compose.yml  → зөвхөн локал хөгжүүлэлт
└── .env.example
```

---

## 2. Дэд Бүтцийн Архитектур

```
┌─────────────────────────────────────────────────────────────────┐
│  Хэрэглэгчид (Монгол хэрэглэгчид, admin)                         │
└───┬───────────────────────────────┬───────────────────────────────┘
    │ Хөтч / React Native апп        │ Admin хөтч
    ▼                                ▼
┌─────────────────────────────────────────────────────────────────┐
│  Cloudflare (DNS + CDN + WAF + DDoS + SSL дуусгавар болгох)       │
│  nogoolin.mn → Vercel                                             │
│  api.nogoolin.mn → Railway                                        │
└───┬───────────────────────────────┬───────────────────────────────┘
    │                                │
    ▼                                ▼
┌──────────────────┐      ┌──────────────────────────────────────┐
│  Vercel           │      │  Railway                              │
│  Next.js вэб апп  │      │  Fastify API (Docker container)      │
│  + admin самбар   │◀────▶│  Port 3001                           │
│  (nogoolin.mn)    │      │  (api.nogoolin.mn)                   │
└──────────────────┘      └──────────────┬───────────────────────┘
                                          │
                                          ▼
                           ┌──────────────────────────────────────┐
                           │  Supabase (Сингапур бүс)              │
                           │  ├── PostgreSQL (RLS идэвхтэй)        │
                           │  ├── Auth (JWT, Google/FB OAuth)      │
                           │  └── Storage                          │
                           │      ├── product-images bucket        │
                           │      └── model-assets bucket          │
                           └──────────────────────────────────────┘
```

### 2.1 Үйлчилгээний Хариуцлага

| Үйлчилгээ | Юу байршуулдаг | Зардлын tier (MVP) |
|---|---|---|
| GitHub | Эх код, CI/CD нууц мэдээлэл, GitHub Actions | Үнэгүй |
| Supabase | PostgreSQL DB, Auth, Storage, RLS | Үнэгүй tier (Сингапур) |
| Railway | Fastify API Docker container | Starter ($5/сар эсвэл ашиглалтад суурилсан) |
| Vercel | Next.js вэб + admin самбар, Edge функцүүд | Үнэгүй tier (Hobby) |
| Cloudflare | DNS, CDN, WAF, DDoS, SSL | Үнэгүй tier |
| Apple Developer | iOS түгээлт (TestFlight / App Store) | $99/жил (Phase 6, нэвтрүүлэлтийг хааж чадахгүй) |
| Google Play | Android түгээлт | $25 нэг удаа (Phase 6, нэвтрүүлэлтийг хааж чадахгүй) |

---

## 3. Урьдчилсан Нөхцөл

Байршуулалт эхлэхийн өмнө дараах бүртгэл болон хэрэгслүүд бэлэн байгааг баталгаажуулна.

### 3.1 Шаардлагатай Бүртгэлүүд

- [ ] **GitHub** бүртгэл — репозиторын эзэн (Тэнгис)
- [ ] **Supabase** бүртгэл — `app.supabase.com`
- [ ] **Railway** бүртгэл — `railway.app`
- [ ] **Vercel** бүртгэл — `vercel.com`
- [ ] **Cloudflare** бүртгэл — `nogoolin.mn` домэйн энд удирдагдана
- [ ] **Google Cloud Console** — Google Sign-In-д зориулсан OAuth 2.0 итгэмжлэл
- [ ] **Facebook Developers** — Facebook OAuth-д зориулсан App ID (S-priority)
- [ ] **Meshy AI** — 3D загвар үүсгэлтэд зориулсан бүртгэл (admin workflow)

### 3.2 Шаардлагатай Локал Хэрэгслүүд

```bash
# Node.js 20+ (LTS)
node --version   # v20.x.x

# pnpm (monorepo package manager)
npm install -g pnpm
pnpm --version   # 9.x.x

# Docker Desktop (локал API хөгжүүлэлтэд)
docker --version

# Supabase CLI (migration ажиллуулахад)
brew install supabase/tap/supabase   # macOS
supabase --version

# Fastify CLI (албан ёсны TypeScript boilerplate scaffold хийхэд)
npm install -g fastify-cli
fastify --version

# EAS CLI (мобайл build/submit-д)
npm install -g eas-cli
eas --version

# Railway CLI (заавал биш, гараар байршуулахад)
npm install -g @railway/cli
```

### 3.3 Домэйн Тохируулга

`nogoolin.mn` домэйн бүртгэгдсэн байх бөгөөд nameserver-ууд §7 (Cloudflare DNS Тохируулга) **өмнө** Cloudflare руу чиглүүлэгдсэн байх ёстой.

---

## 4. Supabase Тохируулга

**Лавлагаа:** NFR-MAIN-007 (хувилбаржуулсан migration), NFR-SEC-008 (RLS идэвхтэй),
`04-er-diagram.mn.md`, `08-security.mn.md` §6

Энэ бол **эхлээд тохируулах үйлчилгээ** — Railway, Vercel, CI/CD бүгд Supabase итгэмжлэлд хамаарна.

### 4.1 Supabase Төсөл Үүсгэх

1. `app.supabase.com` → Шинэ Төсөл
2. Тохиргоо:
   - **Нэр:** `nogoolin-production`
   - **Мэдээллийн сангийн нууц үг:** хүчтэй нууц үг үүсгэж нууц үгийн менежерт хадгална
   - **Бүс:** `Southeast Asia (Singapore)` — Монголд хамгийн ойр
   - **План:** Үнэгүй tier (MVP-д хангалттай)
3. Төсөл provision хийгдэхийг хүлээнэ (~2 минут)
4. **Төслийн Тохиргоо → API** руу очиж дараахийг хуулна:

```bash
# Эдгээрийг тэр дороо хадгална — дараагийн бүх алхамд ашиглагдана
SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
SUPABASE_ANON_KEY=eyJ...          # клиентэд нээлттэй байж болно
SUPABASE_SERVICE_ROLE_KEY=eyJ...  # ХЭЗЭЭ Ч задруулахгүй — RLS-ийг тойрдог
```

### 4.2 Supabase CLI Эхлүүлэх (Локал)

```bash
# Monorepo root-д
supabase init           # supabase/ директор үүсгэнэ (репод аль хэдийн байна)
supabase login          # CLI-г бүртгэлээр баталгаажуулна

# CLI-г үйлдвэрлэлийн төстэй холбоно
supabase link --project-ref xxxxxxxxxxxx  # dashboard URL-аас project ref
```

### 4.3 Мэдээллийн Сангийн Migration-уудыг Ажиллуулах

Migration-ууд `supabase/migrations/`-д байрлаж, дараалан дугаарлагддаг. Анхны migration (`0001_init.sql`) нь `08-security.mn.md` §6-аас бүх policy-тойгоор RLS идэвхжүүлсэн 11 хүснэгтийг үүсгэнэ:

```bash
# Бүх migration-уудыг үйлдвэрлэлийн мэдээллийн санд push хийнэ
supabase db push

# Шалгах — бүх migration-ууд хэрэглэгдсэн гэж харуулах ёстой
supabase migration list
```

**Migration файлын нэрлэх дүрэм:**

```
supabase/migrations/
├── 0001_init.sql              # бүх хүснэгт, enum, индекс, RLS policy
├── 0002_is_admin_function.sql # is_admin() SECURITY DEFINER функц (§6.3)
└── 0003_seed_settings.sql     # system_settings seed мөр
```

> **Дүрэм (NFR-MAIN-007):** аль хэдийн хэрэглэгдсэн migration файлыг хэзээ ч өөрчлөхгүй. Бүх схемийн өөрчлөлтүүд шинэ дугаарлагдсан migration-д ордог. Энэ нь migration түүхийг зөвхөн нэмэлт болон давтагдах боломжтой байлгадаг.

### 4.4 Seed Өгөгдөл

`supabase/seed.sql` нь migration-уудын дараа нэг удаа ажиллаж анхны `system_settings` мөрийг оруулна:

```sql
-- supabase/seed.sql
INSERT INTO public.system_settings (key, value, updated_at)
VALUES ('delivery_enabled', 'false'::jsonb, now())
ON CONFLICT (key) DO NOTHING;
```

```bash
# Үйлдвэрлэлд seed хийнэ
supabase db reset --linked   # ⚠️ зөвхөн шинэ төсөлд — бүх өгөгдлийг устгана
# ЭСВЭЛ аль хэдийн дүүргэгдсэн DB-д seed-ийг гараар ажиллуулна:
supabase db execute --file supabase/seed.sql
```

### 4.5 RLS Идэвхтэй Байгааг Шалгах

Supabase SQL editor-д энэ query-г ажиллуулна (§13.3 of `08-security.mn.md`):

```sql
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
```

Хүлээгдэж буй гаралт — 11 бүх хүснэгт `true` харуулах ёстой:

```
tablename               | rowsecurity
------------------------+-------------
audit_logs              | true
categories              | true
delivery_assignments    | true
inquiries               | true
media_assets            | true
order_items             | true
orders                  | true
product_images          | true
products                | true
system_settings         | true
users                   | true
```

### 4.6 Supabase Auth Тохируулах

#### 4.6.1 Ерөнхий Auth Тохиргоо

**Authentication → Settings** руу очно:

| Тохиргоо | Утга |
|---|---|
| Сайтын URL | `https://nogoolin.mn` |
| Redirect URL-уудын зөвшөөрөгдсөн жагсаалт | `https://nogoolin.mn/auth/callback`, `https://nogoolin.mn/admin/auth/callback` |
| JWT дуусалт | `900` (15 минут — NFR-SEC-013) |
| Refresh Token Сэлгэлт | **Идэвхжүүлэгдсэн** (FR-AUTH-006) |
| Refresh Token Дахин Ашиглалтыг Илрүүлэх | **Идэвхжүүлэгдсэн** |
| Email баталгаажуулалт | MVP-д идэвхгүй (SMTP тохируулагдаагүй) |

#### 4.6.2 Google OAuth (FR-AUTH-002, M-priority)

1. [Google Cloud Console](https://console.cloud.google.com) → APIs & Services → Credentials → OAuth 2.0 Client ID үүсгэх
2. Аппликейшны төрөл: **Web application**
3. Зөвшөөрөгдсөн redirect URI-ууд:
   ```
   https://xxxxxxxxxxxx.supabase.co/auth/v1/callback
   ```
4. **Client ID** болон **Client Secret** хуулна
5. Supabase → Authentication → Providers → Google:
   - Google provider идэвхжүүлнэ
   - Client ID болон Client Secret буулгана
   - Хадгална

#### 4.6.3 Facebook OAuth (FR-AUTH-003, S-priority)

1. [Facebook Developers](https://developers.facebook.com) → Апп үүсгэх → Consumer төрөл
2. **Facebook Login** бүтээгдэхүүн нэмнэ
3. Хүчинтэй OAuth Redirect URI-ууд:
   ```
   https://xxxxxxxxxxxx.supabase.co/auth/v1/callback
   ```
4. Supabase → Authentication → Providers → Facebook:
   - Facebook provider идэвхжүүлнэ
   - App ID болон App Secret буулгана

### 4.7 Storage Bucket-ууд Үүсгэх

**Storage → Шинэ bucket** руу очиж дараахийг үүсгэнэ:

#### Bucket: `product-images`

| Тохиргоо | Утга |
|---|---|
| Нэр | `product-images` |
| Нийтэд нээлттэй | Тийм (зургуудыг CDN URL-ээр нийтэд үйлчилнэ) |
| Зөвшөөрөгдсөн MIME төрлүүд | `image/jpeg`, `image/png`, `image/webp` |
| Хамгийн их файлын хэмжээ | `5242880` (5MB — FR-MEDIA-002) |

#### Bucket: `model-assets`

| Тохиргоо | Утга |
|---|---|
| Нэр | `model-assets` |
| Нийтэд нээлттэй | Тийм (GLB файлуудыг Three.js/model_viewer_plus-д нийтэд үйлчилнэ) |
| Зөвшөөрөгдсөн MIME төрлүүд | `model/gltf-binary`, `application/octet-stream` |
| Хамгийн их файлын хэмжээ | `10485760` (10MB — FR-MEDIA-008) |

#### Storage RLS Policy-ууд

Storage bucket-уудад өөрийн гэсэн RLS policy шаардлагатай. SQL editor-д ажиллуулна:

```sql
-- product-images: нийтэд унших, зөвхөн admin бичих
CREATE POLICY "product_images_public_read"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'product-images');

CREATE POLICY "product_images_admin_write"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'product-images' AND public.is_admin());

CREATE POLICY "product_images_admin_delete"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'product-images' AND public.is_admin());

-- model-assets: нийтэд унших, зөвхөн admin бичих
CREATE POLICY "model_assets_public_read"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'model-assets');

CREATE POLICY "model_assets_admin_write"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'model-assets' AND public.is_admin());

CREATE POLICY "model_assets_admin_delete"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'model-assets' AND public.is_admin());
```

### 4.8 Мэдээллийн Сангийн Trigger: `on_auth_user_created`

Энэ trigger нь шинэ Supabase Auth хэрэглэгч OAuth-аар бүртгүүлэх бүрт `public.users` мөрийг автоматаар үүсгэнэ (UC-SYS-001, SEQ-001):

```sql
-- supabase/migrations/0001_init.sql (хэсэг)

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, role, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    'customer',
    now(),
    now()
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
```

> Энэ trigger нь `SECURITY DEFINER` болгон ажиллана (RLS-ийг тойрдог) учир нь бүртгүүлэх явцад `public.users`-д бичдэг бөгөөд хэрэглэгч хүчинтэй сессгүй байдаг. `08-security.mn.md` §6.2-д заасны дагуу RLS тойрох хоёр хууль ёсны хэрэглээний нэг нь энэ (нөгөө нь `service_role` аудит бүртгэлийн бичлэг).

### 4.9 Supabase Тохируулгын Шалгах Жагсаалт

- [ ] Сингапур бүсд төсөл үүсгэгдсэн
- [ ] `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` хадгалагдсан
- [ ] Бүх migration хэрэглэгдсэн (`supabase migration list` бүгдийг ногоонор харуулна)
- [ ] Seed өгөгдөл хэрэглэгдсэн (`delivery_enabled = false`-тай `system_settings` мөр байна)
- [ ] RLS 11 бүх хүснэгтэд идэвхтэй (§4.5 query бүгдийг `true`-аар батална)
- [ ] `is_admin()` функц байршуулагдсан
- [ ] `on_auth_user_created` trigger байршуулагдсан
- [ ] Auth тохиргоо хийгдсэн (Сайтын URL, redirect URL-ууд, JWT дуусалт, сэлгэлт)
- [ ] Google OAuth тохируулагдаж тестлэгдсэн
- [ ] `product-images` bucket MIME зөвшөөрөгдсөн жагсаалт + RLS policy-тойгоор үүсгэгдсэн
- [ ] `model-assets` bucket MIME зөвшөөрөгдсөн жагсаалт + RLS policy-тойгоор үүсгэгдсэн

---

## 5. Railway Тохируулга (API)

**Лавлагаа:** NFR-MAIN-006 (Docker multi-stage build), NFR-SEC-005 (нууц мэдээлэл env var-аар),
master plan §7.4 (Railway дахь Fastify + TypeScript)

### 5.1 Railway Төсөл Үүсгэх

1. `railway.app` → Шинэ Төсөл → **GitHub repo-оос байршуулах**
2. `nogoolin` monorepo-г сонгоно
3. Railway нь `apps/api/`-д байгаа `Dockerfile`-ийг автоматаар илрүүлнэ
4. Анхны байршуулалтын **өмнө** бүх environment variable-уудыг тохируулна (§5.3) — тэдгүйгээр container эхлэхгүй

### 5.2 Dockerfile (Multi-Stage Build)

```dockerfile
# apps/api/Dockerfile
# Fastify-ийн албан ёсны TypeScript boilerplate бүтэцэд суурилна

# ── 1-р Шат: Build ───────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY packages/ ./packages/
COPY apps/api/ ./apps/api/

RUN npm install -g pnpm && pnpm install --frozen-lockfile

RUN pnpm --filter @nogoolin/api build

# ── 2-р Шат: Үйлдвэрлэл ─────────────────────────────────────────
FROM node:20-alpine AS production

# NFR-MAIN-006: root бус хэрэглэгчээр ажиллана
RUN addgroup -S nogoolin && adduser -S nogoolin -G nogoolin

WORKDIR /app

COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages

USER nogoolin

EXPOSE 3001

ENV NODE_ENV=production

CMD ["node", "dist/index.js"]
```

> **Яагаад multi-stage вэ?** Builder шат нь TypeScript compiler, dev хамаарлууд, эх файлуудыг агуулна. Үйлдвэрлэлийн шат нь зөвхөн compiled JS + үйлдвэрлэлийн хамаарлуудыг агуулна — нэг шаттай build-аас ~150MB болно (~600MB-ийн оронд), халдлагын гадаргуу багасна.

### 5.3 Environment Variable-ууд

Эдгээрийг анхны байршуулалтын **өмнө** Railway → Төсөл → Variables-д тохируулна:

```bash
# ── Сервер ──────────────────────────────────────────────────────
NODE_ENV=production
PORT=3001

# ── Supabase ─────────────────────────────────────────────────────
SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...    # ⚠️ зөвхөн сервер, хэзээ ч задруулахгүй

# ── CORS ─────────────────────────────────────────────────────────
# Зөвшөөрөгдсөн origin-уудын таслалаар тусгаарлагдсан жагсаалт (08-security.mn.md §4.2)
ALLOWED_ORIGINS=https://nogoolin.mn,https://www.nogoolin.mn

# ── Rate limiting ─────────────────────────────────────────────────
RATE_LIMIT_GENERAL_MAX=100
RATE_LIMIT_AUTH_MAX=5
RATE_LIMIT_INQUIRY_MAX=3
```

> **`.env.example` (NFR-MAIN-008)** — monorepo root `.env.example` нь энэ жагсаалтыг хоосон утгуудтайгаар тусгана. Шинэ хувьсагч нэмэгдэх бүрт синхрончлогдоно — PR-ийн Definition of Done зүйл.

### 5.4 Railway Үйлчилгээний Тохиргоо

Railway → Үйлчилгээ → Тохиргоо:

| Тохиргоо | Утга |
|---|---|
| **Root Directory** | `apps/api` |
| **Build Command** | *(Dockerfile-аас автоматаар илрүүлэгдэнэ)* |
| **Start Command** | *(Dockerfile-аас `CMD`-тэй)* |
| **Health Check Path** | `GET /api/v1/health` |
| **Health Check Timeout** | 30с |
| **Restart Policy** | Бүтэлгүй болоход (хамгийн ихдээ 3 дахин эхлүүлэлт) |
| **Private Networking** | Идэвхгүй (Vercel нь Railway-г нийтийн HTTPS-ээр дуудна) |

### 5.5 Health Check Endpoint

Railway нь container амжилттай эхэлснийг батлахад ашигладаг хөнгөн health check route нэмнэ:

```typescript
// apps/api/src/routes/health.route.ts
import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version ?? '1.0.0',
  });
});

export default router;

// apps/api/src/app.ts
app.use('/api/v1/health', healthRouter);
```

Энэ endpoint нь **auth байхгүй**, rate limiting байхгүй, мэдрэмжтэй өгөгдөл буцаахгүй — зөвхөн процесс амьд байгааг баталгаажуулахад оршдог.

### 5.6 Дотоод Домэйн (api.nogoolin.mn)

1. Railway → Үйлчилгээ → Тохиргоо → Домэйнууд → **Дотоод Домэйн Нэмэх**
2. `api.nogoolin.mn` оруулна
3. Railway нь Cloudflare-д нэмэх `CNAME` бичлэгийг харуулна (§7.2)
4. Cloudflare тохируулагдсаны дараа Railway нь Let's Encrypt-ээр TLS автоматаар provision хийнэ

> **Чухал:** Railway TLS provision хийхийг зөвшөөрөхийн тулд анхны тохируулгын үед `api.nogoolin.mn`-д Cloudflare proxy горимыг **DNS only (саарал үүл)** болгоно. TLS батлагдсаны дараа **Proxied (улбар шар үүл)** болгож WAF + DDoS хамгаалалтыг идэвхжүүлнэ (§7.3).

### 5.7 Docker Compose (Локал Хөгжүүлэлт)

```yaml
# docker-compose.yml (monorepo root)
version: '3.9'

services:
  api:
    build:
      context: .
      dockerfile: apps/api/Dockerfile
      target: builder   # локалд builder шатыг ашиглана (hot-reload агуулна)
    ports:
      - "3001:3001"
    environment:
      NODE_ENV: development
      PORT: 3001
      SUPABASE_URL: http://localhost:54321   # локал Supabase CLI
      SUPABASE_ANON_KEY: ${SUPABASE_ANON_KEY}
      SUPABASE_SERVICE_ROLE_KEY: ${SUPABASE_SERVICE_ROLE_KEY}
      ALLOWED_ORIGINS: http://localhost:3000
    volumes:
      - ./apps/api/src:/app/apps/api/src   # hot-reload
      - ./packages:/app/packages
    command: pnpm --filter @nogoolin/api dev
```

```bash
# Локал хөгжүүлэлтийн workflow
supabase start                    # локал Supabase эхлүүлнэ (DB + Auth + Storage)
docker-compose up api             # hot-reload-тай API эхлүүлнэ
# ЭСВЭЛ Docker-гүйгээр:
pnpm --filter @nogoolin/api dev   # tsx watch-г шууд ажиллуулна
```

### 5.8 Railway Тохируулгын Шалгах Жагсаалт

- [ ] Railway төсөл үүсгэгдсэн, GitHub monorepo-той холбогдсон
- [ ] Root directory `apps/api` болгон тохируулагдсан
- [ ] Бүх environment variable тохируулагдсан (§5.3) — аппын эхлэлтийн логт `undefined` алдаа байхгүйг шалгана
- [ ] Анхны байршуулалтын дараа `GET /api/v1/health` `200 OK` буцаана
- [ ] Дотоод домэйн `api.nogoolin.mn` тохируулагдсан (Cloudflare-д CNAME нэмэгдсэн)
- [ ] Railway-ийн TLS гэрчилгээ provision хийгдсэн (хөтчид ногоон цоож)
- [ ] TLS батлагдсаны дараа Cloudflare proxy улбар шар үүл болгон сэлгэгдсэн (§5.6)
- [ ] Container нь root бус хэрэглэгчээр ажиллана (Dockerfile-д `USER nogoolin`)

---

## 6. Vercel Тохируулга (Вэб)

**Лавлагаа:** NFR-REL-001, NFR-SEO-007 (SSR/SSG), master plan §7.1 (Next.js)

### 6.1 Vercel Төсөл Үүсгэх

1. `vercel.com` → Шинэ Төсөл нэмэх → **Git Repository импортлох**
2. `nogoolin` monorepo-г сонгоно
3. Төслийн тохиргоо:

| Тохиргоо | Утга |
|---|---|
| **Framework Preset** | Next.js (автоматаар илрүүлэгдэнэ) |
| **Root Directory** | `apps/web` |
| **Build Command** | `cd ../.. && pnpm --filter @nogoolin/web build` |
| **Output Directory** | `.next` *(анхдагч)* |
| **Install Command** | `pnpm install --frozen-lockfile` |
| **Node.js Version** | 20.x |

> **Monorepo тэмдэглэл:** Vercel-ийн root directory нь `apps/web` болгон тохируулагдсан үед build command нь workspace package-уудыг (`@nogoolin/shared-types`, `@nogoolin/validation-schemas`) шийдвэрлэхийн тулд репозиторын root-оос ажиллах ёстой. `cd ../..` нь pnpm-ийн workspace шийдвэрлэлт зөв ажиллах боломжийг олгодог.

### 6.2 Environment Variable-ууд

Vercel → Төсөл → Тохиргоо → Environment Variables-д тохируулна. **Чухал:** зөвхөн `NEXT_PUBLIC_` угтвартай хувьсагчууд хөтчийн bundle-д нээлттэй болдог — `SUPABASE_SERVICE_ROLE_KEY` **хэзээ ч** энд гарахгүй (`08-security.mn.md` §11.2).

```bash
# ── Нийтэд нээлттэй (хөтчийн bundle-д нээлттэй) ─────────────────
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
NEXT_PUBLIC_API_URL=https://api.nogoolin.mn/api/v1
NEXT_PUBLIC_SITE_URL=https://nogoolin.mn

# ── Зөвхөн сервер (Next.js Server Components / Route Handlers) ───
SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
SUPABASE_ANON_KEY=eyJ...
```

### 6.3 Build Шалгалт (SSR/SSG, NFR-SEO-007)

Анхны байршуулалтын дараа гол route-уудын render горимыг шалгана:

| Route | Хүлээгдэж буй render | Хэрхэн шалгах |
|---|---|---|
| `/` (3D нээлт + нүүр) | SSG (статик) | `next build` гаралт `○ (Static)` харуулна |
| `/products` | SSG + revalidation (ISR) | `● (SSG)` revalidate цагтай |
| `/products/[slug]` | SSG + `generateStaticParams` + ISR | `● (SSG)` бүтээгдэхүүн тус бүрт |
| `/categories/[slug]` | SSG + ISR | `● (SSG)` |
| `/admin/*` | SSR (динамик, auth-гатлагдсан) | `λ (Server)` |

```bash
# Build гаралтын хүснэгтийг шалгахын тулд локалд ажиллуулна
pnpm --filter @nogoolin/web build
```

### 6.4 Дотоод Домэйн (nogoolin.mn)

1. Vercel → Төсөл → Тохиргоо → Домэйнууд → **Нэмэх**
2. `nogoolin.mn` болон `www.nogoolin.mn` оруулна
3. Vercel нь шаардлагатай DNS бичлэгүүдийг (`A` бичлэг эсвэл `CNAME`) харуулна
4. Эдгээрийг Cloudflare-д нэмнэ (§7.2) — Railway-тай ижил саарал-үүл-эхлэлтийн арга (§5.6)

### 6.5 robots.txt болон sitemap.xml (NFR-SEO-005, NFR-SEO-006)

```typescript
// apps/web/src/app/robots.ts
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/admin/',
    },
    sitemap: 'https://nogoolin.mn/sitemap.xml',
  };
}

// apps/web/src/app/sitemap.ts
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products?limit=50`)
    .then(r => r.json());
  const categories = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`)
    .then(r => r.json());

  return [
    { url: 'https://nogoolin.mn', lastModified: new Date() },
    ...products.data.map((p: any) => ({
      url: `https://nogoolin.mn/products/${p.slug}`,
      lastModified: p.updated_at,
    })),
    ...categories.data.map((c: any) => ({
      url: `https://nogoolin.mn/categories/${c.slug}`,
      lastModified: c.updated_at,
    })),
  ];
}
```

Эдгээр нь Next.js App Router-ийн `/robots.txt` болон `/sitemap.xml`-д автоматаар үйлчлэгдэнэ — гараар файл үүсгэх шаардлагагүй.

### 6.6 Vercel Тохируулгын Шалгах Жагсаалт

- [ ] Төсөл импортлогдсон, root directory `apps/web` болгон тохируулагдсан
- [ ] Build command нь monorepo workspace package-уудыг зөв шийдвэрлэнэ
- [ ] Бүх `NEXT_PUBLIC_*` env var тохируулагдсан; `SUPABASE_SERVICE_ROLE_KEY` **байхгүй** батлагдсан
- [ ] Анхны байршуулалт амжилттай; build гаралт хүлээгдэж буй SSG/SSR холимогийг харуулна (§6.3)
- [ ] Дотоод домэйн `nogoolin.mn` + `www.nogoolin.mn` нэмэгдсэн
- [ ] `/robots.txt` нь `/admin/`-г хаасан
- [ ] `/sitemap.xml` нь нийтлэгдсэн бүх бүтээгдэхүүн болон ангиллуудыг агуулна

---

## 7. Cloudflare DNS Тохируулга

**Лавлагаа:** `08-security.mn.md` §3 (1-р Давхарга — Cloudflare WAF)

### 7.1 Сайтыг Cloudflare-д Нэмэх

1. Cloudflare Dashboard → Сайт нэмэх → `nogoolin.mn` оруулна
2. **Үнэгүй** план сонгоно
3. Cloudflare нь одоо байгаа DNS бичлэгүүдийг сканнердана — хянаж үргэлжлүүлнэ
4. Domain registrar-д nameserver-уудыг Cloudflare-ийн хуваарилсан nameserver-уудаар шинэчилнэ
5. Nameserver тархалтыг хүлээнэ (24 цаг хүртэл, ихэнхдээ хурдан)

### 7.2 DNS Бичлэгүүд

| Төрөл | Нэр | Зорилт | Proxy төлөв (анхны) | Proxy төлөв (эцсийн) |
|---|---|---|---|---|
| `A` эсвэл `CNAME` | `nogoolin.mn` | Vercel-ийн хангасан утга | DNS only (саарал) | **Proxied (улбар шар)** |
| `CNAME` | `www` | `cname.vercel-dns.com` | DNS only (саарал) | **Proxied (улбар шар)** |
| `CNAME` | `api` | Railway-ийн хангасан утга | DNS only (саарал) | **Proxied (улбар шар)** |

> **Хоёр шатлалт нэвтрүүлэлт:** Vercel болон Railway нь бодит origin-д Let's Encrypt TLS гэрчилгээ гаргаж авч чадахын тулд **DNS only (саарал үүл)** болгон эхэлнэ. Хоёулаа хүчинтэй HTTPS харуулсаны дараа **Proxied (улбар шар үүл)** болгон сэлгэнэ — Cloudflare-ийн WAF, CDN, DDoS хамгаалалтыг идэвхжүүлнэ (1-р давхарга, `08-security.mn.md` §3).

### 7.3 SSL/TLS Тохиргоо

**SSL/TLS** таб руу очно:

| Тохиргоо | Утга | Яагаад |
|---|---|---|
| SSL/TLS шифрлэлтийн горим | **Full (Strict)** | Vercel/Railway-ийн TLS гэрчилгээг шалгана — Cloudflare-оос origin руу MITM-ийг сэргийлнэ (NFR-SEC-001, `08-security.mn.md` §3.2) |
| Үргэлж HTTPS ашиглах | **Асаалттай** | Бүх `http://`-г `https://` рүү дахин чиглүүлнэ |
| TLS-ийн хамгийн бага хувилбар | **1.2** | NFR-SEC-001 |
| Автоматжуулсан HTTPS Дахин Бичих | **Асаалттай** | Cold content-ийн `http://` холбоосуудыг дахин бичнэ |

### 7.4 WAF Тохиргоо

**Security → WAF** руу очно:

| Тохиргоо | Утга |
|---|---|
| Удирдагдсан Дүрмүүд → Cloudflare Managed Ruleset | **Идэвхжүүлэгдсэн** |
| Удирдагдсан Дүрмүүд → Cloudflare OWASP Core Ruleset | **Идэвхжүүлэгдсэн** |
| Bot Fight Mode | **Идэвхжүүлэгдсэн** (Security → Bots) |

### 7.5 Cache Дүрмүүд

`08-security.mn.md` §3.2-д заасны дагуу `/api/*` болон `/admin/*` нь Cloudflare-ийн edge cache-ийг тойрох ёстой.

**Caching → Cache Rules → Дүрэм үүсгэх** руу очно:

```
Дүрмийн нэр: "API болон admin-д cache тойрч гарах"
Ирж буй хүсэлтүүд тохирох үед:
  (http.request.uri.path contains "/api/") or
  (http.request.uri.path contains "/admin/")
Тэгвэл:
  Cache тэнцэлт: Cache тойрч гарна
```

### 7.6 Rate Limiting Дүрэм (Edge Буфер)

**Security → WAF → Rate limiting rules → Дүрэм үүсгэх** руу очно:

```
Дүрмийн нэр: "API edge rate limit буфер"
Ирж буй хүсэлтүүд тохирох үед:
  (http.request.uri.path contains "/api/v1/")
Тэгвэл:
  Хурд: 1 минутад 300 хүсэлт, IP тус бүр
  Үйлдэл: 60 секундод хаана
```

> Энэ нь Fastify-ийн түвшний хязгаарын (`08-security.mn.md` §4.3) дээрх **бүдүүлэг буфер** юм. 300/мин нь санаатайгаар сул байдаг — зорилго нь хэт хэт ашиглалтыг (жишээ нь, ажиллаж байгаа скрипт) зогсоох явдал, бизнесийн дүрмийг хэрэгжүүлэх биш.

### 7.7 Cloudflare Тохируулгын Шалгах Жагсаалт

- [ ] Сайт Cloudflare-д нэмэгдсэн, registrar-д nameserver-ууд шинэчлэгдсэн
- [ ] `nogoolin.mn`, `www`, `api`-д DNS бичлэгүүд үүсгэгдсэн (эхлээд саарал үүл)
- [ ] Vercel TLS батлагдсан → `nogoolin.mn` болон `www` улбар шар үүл болгон сэлгэгдсэн
- [ ] Railway TLS батлагдсан → `api.nogoolin.mn` улбар шар үүл болгон сэлгэгдсэн
- [ ] SSL/TLS горим **Full (Strict)** болгон тохируулагдсан
- [ ] Always Use HTTPS: Асаалттай
- [ ] TLS-ийн хамгийн бага хувилбар: 1.2
- [ ] WAF Managed Ruleset + OWASP Core Ruleset идэвхжүүлэгдсэн
- [ ] Bot Fight Mode идэвхжүүлэгдсэн
- [ ] `/api/*` болон `/admin/*`-т cache bypass дүрэм идэвхтэй
- [ ] Edge rate limiting дүрэм идэвхтэй (300/мин/IP `/api/v1/*`-д)

---

## 8. CI/CD Pipeline-ууд (GitHub Actions)

**Лавлагаа:** NFR-MAIN-005, master plan §6 (Git сахилга бат — conventional commits,
`main`/`develop`/`feature/xxx` branch-ууд)

### 8.1 Branch Стратегийн Хураангуй

| Branch | Зорилго | Өдөөгч |
|---|---|---|
| `main` | Үйлдвэрлэл | Push → Railway + Vercel-д байршуулна (үйлдвэрлэл) |
| `develop` | Интеграци | Push → зөвхөн тест/lint ажиллуулна, байршуулахгүй |
| `feature/xxx` | Feature ажил | PR → зөвхөн тест/lint ажиллуулна |

> Staging орчин байхгүй (§1.2) — `develop` → `main` merge нь байршуулалтын өдөөгч. Аюулгүйн тор нь локал тест + Нэвтрүүлэлтийн Өмнөх Runbook (§11).

### 8.2 Шаардлагатай GitHub Нууц Мэдээлэл

GitHub → Repository → Settings → Secrets and variables → Actions-д тохируулна:

| Нууц мэдээлэл | Ашиглагддаг газар | Эх |
|---|---|---|
| `RAILWAY_TOKEN` | `api-deploy.yml` | Railway → Account Settings → Tokens |
| `VERCEL_TOKEN` | `web-deploy.yml` | Vercel → Account Settings → Tokens |
| `VERCEL_ORG_ID` | `web-deploy.yml` | Vercel төслийн тохиргоо |
| `VERCEL_PROJECT_ID` | `web-deploy.yml` | Vercel төслийн тохиргоо |
| `SUPABASE_ACCESS_TOKEN` | `api-deploy.yml` (migration шалгалт) | Supabase → Account → Access Tokens |
| `SUPABASE_PROJECT_REF` | `api-deploy.yml` | Supabase төслийн URL |

### 8.3 `web-deploy.yml`

```yaml
# .github/workflows/web-deploy.yml
name: Deploy Web

on:
  push:
    branches: [main]
    paths:
      - 'apps/web/**'
      - 'packages/**'
      - '.github/workflows/web-deploy.yml'
  pull_request:
    branches: [main]
    paths:
      - 'apps/web/**'
      - 'packages/**'

jobs:
  lint-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 9
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm --filter @nogoolin/web lint
      - run: pnpm --filter @nogoolin/web type-check
      - run: pnpm --filter @nogoolin/web build

  deploy:
    needs: lint-and-test
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Vercel-д байршуулна (Үйлдвэрлэл)
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
          working-directory: apps/web
```

### 8.4 `api-deploy.yml`

```yaml
# .github/workflows/api-deploy.yml
name: Deploy API

on:
  push:
    branches: [main]
    paths:
      - 'apps/api/**'
      - 'packages/**'
      - 'supabase/migrations/**'
      - '.github/workflows/api-deploy.yml'
  pull_request:
    branches: [main]
    paths:
      - 'apps/api/**'
      - 'packages/**'

jobs:
  lint-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 9
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm --filter @nogoolin/api lint
      - run: pnpm --filter @nogoolin/api type-check
      - run: pnpm --filter @nogoolin/api test
      - run: pnpm --filter @nogoolin/api build

  # NFR-MAIN-007: шинэ код байршуулахаас өмнө migration цэвэр хэрэглэгдэхийг шалгана
  migration-check:
    needs: lint-and-test
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: supabase/setup-cli@v1
        with:
          version: latest
      - name: Үйлдвэрлэлд migration push хийнэ
        run: supabase db push
        env:
          SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}
          SUPABASE_PROJECT_REF: ${{ secrets.SUPABASE_PROJECT_REF }}

  deploy:
    needs: migration-check
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Railway-д байршуулна
        uses: bervProject/railway-deploy@main
        with:
          railway_token: ${{ secrets.RAILWAY_TOKEN }}
          service: nogoolin-api

      - name: Health check
        run: |
          sleep 30  # container эхлэхийг хүлээнэ
          curl --fail https://api.nogoolin.mn/api/v1/health || exit 1
```

> **Байршуулалтаас өмнөх migration дарааллал:** Migration нь шинэ API container байршуулагдахаас **өмнө** ажиллана, тиймийн тул шинэ код (шинэ багана/хүснэгт query хийж болно) хуучин схемд хэзээ ч ажиллахгүй. `migration-check` бүтэлгүй болвол `deploy` ажиллахгүй — үйлдвэрлэлийн API өмнөх (ажилладаг) хувилбараар ажиллаж үргэлжилнэ.

### 8.5 `mobile-build.yml`

EAS Build нь Expo-ийн cloud дээр ажилладаг тул энэ workflow зөвхөн локал lint/type-check хийгээд remote build **өдөөх** үүрэгтэй — GitHub Actions runner дээр Android SDK эсвэл Xcode суулгах шаардлагагүй (хуучин Flutter workflow бүрэн Flutter SDK суулгадаг байсантай харьцуулбал энэ бол том хялбарчлал).

```yaml
# .github/workflows/mobile-build.yml
name: Build Mobile

on:
  push:
    branches: [main]
    paths:
      - 'apps/mobile/**'
      - 'packages/validation-schemas/**'
      - '.github/workflows/mobile-build.yml'
  pull_request:
    branches: [main]
    paths:
      - 'apps/mobile/**'

jobs:
  lint-and-typecheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - working-directory: apps/mobile
        run: npm run lint
      - working-directory: apps/mobile
        run: npm run typecheck
      - working-directory: apps/mobile
        run: npm test -- --watchAll=false

  eas-build-android:
    needs: lint-and-typecheck
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - uses: expo/expo-github-action@v8
        with:
          eas-version: latest
          token: ${{ secrets.EXPO_TOKEN }}
      - working-directory: apps/mobile
        run: eas build --platform android --profile preview --non-interactive

  # iOS build нь macOS runner шаардахгүй — EAS Build нь Expo-ийн өөрийн
  # cloud дээр compile хийдэг. Apple Developer бүртгэл ($99/жил) зөвхөн
  # Phase 6-д идэвхжих тул анхдагчаар унтраалттай байна.
  # Бэлэн болсны дараа тайлна:
  #
  # eas-build-ios:
  #   needs: lint-and-typecheck
  #   if: github.ref == 'refs/heads/main' && github.event_name == 'push'
  #   runs-on: ubuntu-latest
  #   steps:
  #     - uses: actions/checkout@v4
  #     - uses: actions/setup-node@v4
  #       with:
  #         node-version: '20'
  #     - run: npm ci
  #     - uses: expo/expo-github-action@v8
  #       with:
  #         eas-version: latest
  #         token: ${{ secrets.EXPO_TOKEN }}
  #     - working-directory: apps/mobile
  #       run: eas build --platform ios --profile preview --non-interactive
```

> **MVP хамрах хүрээ (master plan §29):** Android дотоод тестийн build шаардлагатай; iOS TestFlight нь **заавал биш** бөгөөд нэвтрүүлэлтийг хааж чадахгүй. `eas-build-android` job нь `main` push бүрд cloud build өдөөнэ; гарсан APK/AAB-ийг Expo dashboard эсвэл `eas build:list`-ээр авна — дотоод тест (FR-MOB-001, NFR-COM-003)-д хангалттай. `EXPO_TOKEN` нь §8.2-т жагссан зургаан secret-ээс гадна нэмэлт GitHub secret (`eas whoami` / Expo account тохиргооноос үүсгэнэ).


### 8.6 CI/CD Pipeline Хураангуй

| Workflow | Өдөөгч | Хаана байршуулна | Хаалтлагдсан |
|---|---|---|---|
| `web-deploy.yml` | `main`-д push (вэб/package-ийн өөрчлөлт) | Vercel үйлдвэрлэл | lint + type-check + build давна |
| `api-deploy.yml` | `main`-д push (api/package/migration-ийн өөрчлөлт) | Railway үйлдвэрлэл | lint + type-check + тест + build + migration-check давна |
| `mobile-build.yml` | `main`-д push (mobile/schema-ийн өөрчлөлт) | Expo cloud (EAS Build artifact) | lint + typecheck + test давна |

### 8.7 CI/CD Тохируулгын Шалгах Жагсаалт

- [ ] 6 GitHub нууц мэдээлэл тохируулагдсан (§8.2)
- [ ] `web-deploy.yml` — тест PR нь байршуулахгүйгээр lint/build-ийг өдөөнө
- [ ] `web-deploy.yml` — `main`-д push нь Vercel үйлдвэрлэлд байршуулна
- [ ] `api-deploy.yml` — тест PR нь байршуулахгүйгээр lint/test/build-ийг өдөөнө
- [ ] `api-deploy.yml` — `main`-д push нь байршуулахаас өмнө migration-check ажиллуулна
- [ ] `api-deploy.yml` — байршуулалтын дараа health check алхам давна
- [ ] `mobile-build.yml` — `main`-д push-д EAS Android build өдөөгдөнө

---

## 9. Анхны Admin Bootstrap

**Лавлагаа:** `08-security.mn.md` §5.3 — "хэрэглэгчид өөрийн `role`-ийг `admin` болгон тохируулах боломжийг олгодог ямар ч API endpoint байхгүй"

Энэ бол бүх байршуулалтын процесс дахь **нэг гараар, автоматжуулах боломжгүй алхам** юм. Supabase Auth тохируулагдсаны дараа (§4.6) гэхдээ admin самбарыг анх удаа ашиглахаас өмнө нэг удаа хийгдэнэ.

### 9.1 Журам

**Алхам 1 — Ердийн бүртгүүлэх урсгалаар бүртгэл үүсгэнэ:**

Тэнгис нийтийн вэб апп (`https://nogoolin.mn`)-ийг ашиглан бүртгүүлнэ:
- Email + нууц үгээр (FR-AUTH-001), эсвэл
- Google OAuth-аар (FR-AUTH-002)

Энэ нь `auth.users`-д мөр үүсгэж, `on_auth_user_created` trigger (§4.8)-ийн тусламжтайгаар `public.users`-д харгалзах мөр `role = 'customer'` (бүх шинэ бүртгэлийн анхдагч) болгон үүсгэнэ.

**Алхам 2 — Шууд SQL-ээр бүртгэлийг `admin` болгон дэвшүүлнэ:**

Supabase dashboard → SQL Editor-д ажиллуулна:

```sql
-- 1-р алхамд ашигласан email-ээр солино
UPDATE public.users
SET role = 'admin', updated_at = now()
WHERE email = 'tengis@example.com';

-- Шалгана
SELECT id, email, role FROM public.users WHERE email = 'tengis@example.com';
```

> Энэ нь Supabase dashboard-ийн SQL editor ашиглан **мэдээллийн санд шууд бичих** бөгөөд өргөтгөгдсөн (postgres superuser) эрхтэйгээр ажилладаг — RLS-ийг бүрэн тойрдог, энэ нь хүлээгдэж буй бөгөөд `role = 'admin'` тохируулах **цорын ганц** арга юм (§5.3 of `08-security.mn.md`).

**Алхам 3 — Admin хандалтыг шалгана:**

1. `https://nogoolin.mn/admin/sign-in`-д ижил бүртгэлээр нэвтэрнэ
2. `/admin/dashboard`-д дахин чиглүүлэгдэнэ (UC-ADM-001)
3. `GET /api/v1/admin/products` (эсвэл ямар нэгэн admin endpoint) `200` буцаана, `403` биш

**Алхам 4 — Аудит мөрийг шалгана:**

Цаашид **бүх** admin үйлдэл (бүтээгдэхүүний CRUD, хүргэлтийн товч гэх мэт) `audit_logs`-д бичигдэнэ (FR-AUD-001). 2-р алхамын SQL UPDATE нь `audit_logs`-д **бичигдэхгүй** — admin сессийн өмнөх байдал тул — гэхдээ анхны admin хэзээ үүсгэгдсэнийг мэдэх шаардлагатай тохиолдолд Supabase-ийн database activity log (Төсөл → Logs → Postgres Logs)-д харагдана.

### 9.2 Нэмэлт Admin Нэмэх (Bootstrap-ийн Дараа)

Анхны admin оршин тооцоологдсоны дараа **бүх дараагийн үүргийн өөрчлөлт аппликейшнаар явагдана** (FR-USER-004):

```
Одоо байгаа admin нэвтэрнэ
  → /admin/users
  → customer бүртгэл сонгоно
  → үүргийг 'admin' болгон өөрчилнэ
  → PATCH /api/v1/admin/users/{id} { role: 'admin' }
  → requireAdmin() middleware нь дуудагч нь аль хэдийн admin байгааг шалгана
  → audit_logs мөр: USER_ROLE_CHANGE
```

Шууд SQL дэвшүүлэлт (§9.1) нь **зөвхөн хамгийн анхны** admin бүртгэлд ашиглагддаг бөгөөд ашиглахын тулд admin байхгүй байх үед.

### 9.3 Анхны Admin Bootstrap Шалгах Жагсаалт

- [ ] Тэнгисийн бүртгэл ердийн бүртгүүлэлтээр үүсгэгдсэн (email эсвэл Google)
- [ ] `public.users.role` Supabase SQL Editor-ийн тусламжтайгаар `'admin'` болгон шинэчлэгдсэн
- [ ] `/admin/sign-in`-д нэвтрэх нь `/admin/dashboard`-д дахин чиглүүлнэ
- [ ] Дор хаяж нэг admin-д зориулсан `GET` endpoint `200` буцаана
- [ ] 2-р алхамын SQL команд болон цагийн тэмдэглэгч нь мэдээллийн сангаас гадна (жишээ нь хувийн тэмдэглэл) хадгалагдсан

---

## 10. Мобайл Build ба Түгээлт (EAS)

**Лавлагаа:** FR-MOB-001, NFR-COM-003/004, master plan §29 (Phase 6 — "App Store / Play Store нийтийн submission нэвтрүүлэлтийг хааж чадахгүй")

### 10.1 MVP Түгээлт (Дотоод Тест)

MVP-д `mobile-build.yml` (§8.5)-ийн үүсгэсэн Android build нь EAS-аар түгээгддэг — хуучин APK-г гараар хуваалцдаг байснаас хамаагүй хялбар:

1. `eas build:list` ажиллуулна (эсвэл Expo dashboard шалгана) дууссан build-ийг олохын тулд
2. EAS-ийн байршуулсан суулгах холбоосыг шууд дотоод тестлэгчидтэй хуваалцана — APK-г татаж авч дахин байршуулах шаардлагагүй
3. Тестлэгчид Android төхөөрөмж дээрээ холбоосыг нээгээд шууд суулгана (EAS-ийн байршуулсан build нь Expo-ийн гарын үсэгтэй суулгах хуудас өгдөг тул түүхий APK-ийн адил "Үл мэдэгдэх эх үүсвэрээс суулгах"-ыг идэвхжүүлэх шаардлагагүй)

Энэ нь MVP-ийн амжилтын хэмжүүр "Мобайл апп хоёр платформд дотоод тестийг давсан байх" (`01-vision.mn.md` §8)-ийг Android-д хангана. iOS дотоод тест **EAS Submit → TestFlight**-ийг ашиглах бөгөөд өмнөх адил идэвхтэй Apple Developer бүртгэл шаарддаг — энэ шаардлага framework солигдсонтой хамааралгүй.

### 10.2 Phase 6: Нийтийн Store Submission (Нэвтрүүлэлтийг Хааж Чадахгүй)

Нийтийн түгээлтэд бэлэн болоход **EAS Submit** нь Flutter pipeline-д шаардлагатай байсан ихэнх гар ажиллагааг орлоно:

**Android (Google Play, $25 нэг удаа):**
1. Google Play Console бүртгэл үүсгэнэ
2. Үйлдвэрлэлийн binary build хийнэ: `eas build --platform android --profile production`
3. CLI-аас шууд илгээнэ: `eas submit --platform android` (Play Console руу байршуулна — keystore-ийг гараар удирдах шаардлагагүй; EAS анхдагчаар гарын үсгийн credential удирдана)
4. Play Console-д Internal Testing track-аас Үйлдвэрлэлд дэвшүүлнэ

**iOS (Apple App Store, $99/жил):**
1. Apple Developer Program-д элснэ
2. `eas credentials` ажиллуулж EAS-д гарын үсгийн гэрчилгээ + provisioning profile удирдуулна (эсвэл өөрийнхөө өгнө)
3. Build хийнэ: `eas build --platform ios --profile production`
4. Илгээнэ: `eas submit --platform ios` (App Store Connect руу шууд байршуулна — ямар ч алхамд Mac эсвэл Xcode шаардлагагүй)
5. Эхлээд TestFlight-аар гаргаад, дараа нь App Store хяналтын дүгнэлтэд илгээнэ

> **Тэмдэглэл:** EAS Build хоёр платформыг Expo-ийн cloud дээр compile хийдэг тул энэ бүлэг `macos-latest` GitHub runner эсвэл локал Xcode-оос хамаарахгүй болсон — анхны Flutter/GitHub Actions pipeline-тэй харьцуулбал solo dev-ийн ops ачааллыг мэдэгдэхүйц бууруулна.

### 10.3 Мобайлд зориулсан Environment Тохиргоо

```typescript
// apps/mobile/app.config.ts
export default {
  expo: {
    name: 'Nogoolin',
    slug: 'nogoolin',
    extra: {
      supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
      supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY, // зөвхөн anon key — вэбтэй ижил
      apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL ?? 'https://api.nogoolin.mn/api/v1',
    },
    plugins: [
      '@rive-app/react-native', // Rive Expo config plugin
    ],
  },
};
```

```bash
# apps/mobile/.env (app.config.ts-ээр ачаалагдана; client JS bundle-д
# хүрэх ёстой утга бүр EXPO_PUBLIC_ угтвартай байх шаардлагатай)
EXPO_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJ...
EXPO_PUBLIC_API_BASE_URL=https://api.nogoolin.mn/api/v1
```

EAS cloud build-д зориулж ижил утгуудыг commit хийсэн `.env` файл биш **EAS secret** байдлаар тохируулна:

```bash
eas secret:create --name EXPO_PUBLIC_SUPABASE_URL --value https://xxxxxxxxxxxx.supabase.co
eas secret:create --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value eyJ...
```

> React Native апп нь вэб апптай **ижил `SUPABASE_ANON_KEY`** ашигладаг (§6.2) — энэ key нь нийтэд нээлттэй байхаар загварчлагдсан бөгөөд хөтчийн client-тэй адил хүсэлт бүрт RLS-д захирагддаг (`08-security.mn.md` §6.2).


---

## 11. Нэвтрүүлэлтийн Өмнөх Runbook

**Лавлагаа:** `08-security.mn.md` §13 (Аюулгүй Байдлын Шалгах Жагсаалт)-тай байршуулалтын тодорхой шалгалтуудыг нэгтгэнэ. Анхны үйлдвэрлэлийн нэвтрүүлэлтийн өмнө **дарааллаар** гүйцэтгэнэ.

### 11.1 Дэд Бүтцийн Шалгалт

- [ ] Supabase: §4.9-ийн бүх шалгах жагсаалтын зүйл дууссан
- [ ] Railway: §5.8-ийн бүх шалгах жагсаалтын зүйл дууссан
- [ ] Vercel: §6.6-ийн бүх шалгах жагсаалтын зүйл дууссан
- [ ] Cloudflare: §7.7-ийн бүх шалгах жагсаалтын зүйл дууссан
- [ ] CI/CD: §8.7-ийн бүх шалгах жагсаалтын зүйл дууссан
- [ ] Анхны admin bootstrap хийгдсэн (§9.3)

### 11.2 Эцэст хүртэлх Утаны Тест

Сайт амьд байгааг зарлахаас **өмнө** үйлдвэрлэлд эдгээрийг гараар ажиллуулна:

| Тест | Хүлээгдэж буй үр дүн | Лавлагаа |
|---|---|---|
| `https://nogoolin.mn`-д зочилно | 3D нээлт тоглодог (эсвэл fallback), "Эхлэх" гарч ирнэ | FR-3D-001 - 007 |
| `https://nogoolin.mn/products`-д зочилно | Бүтээгдэхүүний grid ачаалагдана (эсвэл бүтээгдэхүүн байхгүй бол хоосон төлөв) | UC-G-002 |
| Бүтээгдэхүүний дэлгэрэнгүй хуудсанд зочилно | Зураг, үнэ, тайлбар render хийгдэнэ; `model_3d_url` тохируулагдсан бол 360° харагч | UC-G-004, UC-G-005 |
| Хүсэлтийн маягт илгээнэ | Амжилтын мессеж; `inquiries` хүснэгтэд мөр гарч ирнэ | UC-G-007 |
| Нэг цагийн дотор 4 дэх удаагийн хүсэлт (ижил IP) | `429 Хэт олон илгээлт` | FR-INQ-007 |
| Bootstrap хийгдсэн admin-аар `/admin/sign-in`-д нэвтэрнэ | `/admin/dashboard`-д дахин чиглүүлнэ | UC-ADM-001 |
| Admin-аар бүтээгдэхүүн үүсгэнэ → Нийтэлнэ | `/products`-д бүтээгдэхүүн харагдана | UC-ADM-002, UC-ADM-004 |
| `/admin/settings`-д хүргэлтийг АСААЖ дараа УНТРААНА | `audit_logs` нь хоёр `DELIVERY_TOGGLE` мөр харуулна | UC-ADM-011, FR-AUD-005 |
| `delivery_enabled = false` байх үед `POST /api/v1/orders` | `403 DELIVERY_DISABLED` | FR-SET-004, UC-SYS-002 |
| Гарч, token-гүйгээр `GET /api/v1/admin/products` оролдоно | `401 UNAUTHORIZED` | NFR-SEC-009 |
| `customer` үүрэгтэй бүртгэлээр нэвтэрч, `GET /api/v1/admin/products` оролдоно | `403 FORBIDDEN`, `audit_logs` нь `UNAUTHORIZED_ACCESS` бүртгэнэ | FR-AUTH-009, UC-ADM-011 Онцгой Урсгал |

### 11.3 Гүйцэтгэлийн Тодорхой Шалгалтууд (NFR-PERF)

- [ ] `https://nogoolin.mn/products` Lighthouse Performance оноо ≥ 80 (NFR-PERF-001) дунд зэргийн "Mobile" симуляц дээр
- [ ] Бүтээгдэхүүний дэлгэрэнгүй хуудас Lighthouse оноо ≥ 85 (NFR-PERF-003)
- [ ] Бүтээгдэхүүний дэлгэрэнгүй хуудас Lighthouse **SEO** оноо ≥ 90 (`01-vision.mn.md` §8)
- [ ] 3D нээлтийн "Танилцуулгыг Алгасах" товч 1 секундын дотор харагдана (FR-3D-005)
- [ ] 3D GLB загвар ≤ 5MB (NFR-PERF-005) — Network таб шалгана

### 11.4 DNS / SSL Эцсийн Шалгалт

- [ ] `https://nogoolin.mn` — хүчинтэй гэрчилгээ, цоож харагдана
- [ ] `https://api.nogoolin.mn/api/v1/health` — хүчинтэй гэрчилгээ, `200` буцаана
- [ ] `http://nogoolin.mn` нь `https://` рүү дахин чиглүүлнэ
- [ ] `https://nogoolin.mn/admin` — `robots.txt` `Disallow: /admin/`-г батална

### 11.5 Нэвтрүүлэлт

- [ ] 11.1–11.4 бүх хэсгүүд шалгагдсан
- [ ] Анхны бодит хэрэглэгчидтэй зарлаж/холбоос хуваалцна
- [ ] Нэвтрүүлэлтийн дараах анхны цагийн Railway + Vercel логуудыг хянана (§12)

---

## 12. Нэвтрүүлэлтийн Дараах Хяналт

**Лавлагаа:** NFR-REL-001, NFR-REL-002 (≥99% uptime зорилт)

### 12.1 Хяналтын Гадаргуу (Нэг Хөгжүүлэгч — SIEM байхгүй)

`08-security.mn.md` §12.1-д заасны дагуу хяналт нь аль хэдийн байгаа тус бүрийн платформын dashboard-уудад тулгуурладаг — MVP-д нэмэлт хэрэгсэл нэмэгдэхгүй:

| Дохио | Хаана харах | Давтамж |
|---|---|---|
| API uptime / алдаанууд | Railway → Deployments → Logs | Өдөр тутам (анхны долоо хоног), дараа нь долоо хоног бүр |
| Вэб uptime / build бүтэлгүй болох | Vercel → Deployments | Байршуулалт бүрт (автоматаар мэдэгдэл) |
| Мэдээллийн сангийн эрүүл мэнд, удаан query | Supabase → Database → Query Performance | Долоо хоног бүр |
| Storage хэрэглээ (үнэгүй tier хязгаарт ойртохоор) | Supabase → Storage → Usage | Сар бүр |
| Аюулгүй байдлын үйл явдлууд | `audit_logs` хүснэгт, `action = 'UNAUTHORIZED_ACCESS'` шүүнэ | Долоо хоног бүр |
| WAF/bot үйл ажиллагаа | Cloudflare → Security → Events | Долоо хоног бүр |
| Rate limit хэтрэлт | Railway log, `RATE_LIMIT_EXCEEDED`-г grep хийнэ | Хэт ашиглалт сэжиглэгдвэл хэрэгтэйгээр |

### 12.2 Долоо Хоногийн Тойм Интеграци

`01-vision.mn.md` §6 (Personal Kanban — "Бям гараг бүр 30 минутын тойм хийнэ")-д заасны дагуу давтагдах шалгах жагсаалтын зүйл нэмнэ:

```
Бямбын Долоо Хоногийн Тойм — Үйл Ажиллагааны Нэмэлт:
[ ] Railway API log-д зохицуулагдаагүй алдааг шалгана
[ ] Supabase storage хэрэглээ (үнэгүй tier-ийн %) шалгана
[ ] audit_logs-д UNAUTHORIZED_ACCESS огцом нэмэгдэлтийг шалгана
[ ] Cloudflare Security Events-д шинэ халдлагын хэлбэрийг шалгана
```

### 12.3 Осол Хариу (Хялбаршуулсан)

Нэг хөгжүүлэгчийн MVP-д "осол хариу" гэдэг нь:

1. **API доош (Railway):** Railway dashboard нь crash log харуулна → Railway-ийн deployment history-оор өмнөх ажилладаг commit-г дахин байршуулна (нэг товчлуур буцааж гаргах) → root cause-ийг локалаар судална
2. **Вэб доош (Vercel):** Vercel → Deployments → сүүлчийн мэдэгдсэн сайн байршуулалт дээр "Promote to Production"
3. **Мэдээллийн сангийн асуудал:** Supabase status хуудас (`status.supabase.com`) эхлээд — Supabase талаас бол хүлээнэ; query-тэй холбоотой бол Query Performance таб шалгана
4. **Аюулгүй байдлын осол (жишээ нь нууц мэдээлэл алдагдсан):** нөлөөлсөн нууц мэдээлэлийг тэр дороо хамаарах dashboard-д сэлгэнэ (Supabase / Railway / Vercel), шинэ утгатай дахин байршуулна (`08-security.mn.md` §11.2 дүрэм 5)

### 12.4 Өргөтгөлийн Өдөөгч (Ирээдүйн Лавлагаа)

Эдгээр нь **MVP-ийн санаа зовоол биш** гэхдээ ирээдүйн Тэнгис `08-security.mn.md` §4.3 (дотор санах ойн rate limiting) болон NFR-SCA-001 (хэвтээ өргөтгөл) дахин хянах цагийг мэдэхийн тулд баримтлагдсан:

| Дохио | Үйлдэл |
|---|---|
| Railway нэг instance CPU/memory тогтмол >70% | Хэвтээгээр байршуулахаас өмнө Railway-ийн босоо өргөтгөлийг (instance тус бүр илүү нөөц) авч үзнэ |
| >1 API instance шаардлагатай | Rate-limit төлвийг дотор санах ойгоос Redis рүү шилжүүлнэ (`08-security.mn.md` §4.3 тэмдэглэл) |
| Supabase үнэгүй tier storage/bandwidth хязгаарт ойртоно | Supabase Pro болгон дэвшүүлнэ |
| `delivery_enabled = true` идэвхжүүлэлт ойртоно | `08-security.mn.md` §13.6 шалгах жагсаалтыг дахин гүйцэтгэнэ |

---

*Өмнөх баримт бичиг: [`docs/08-security.mn.md`](./08-security.mn.md)*
*Энэ нь Phase 0-ийн эцсийн баримт бичиг юм. Phase 1 (Foundation) нь `01-vision.mn.md` §6 замын зургийн дагуу monorepo scaffolding-аар эхэлнэ.*
