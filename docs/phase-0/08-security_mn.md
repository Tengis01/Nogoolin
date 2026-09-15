# Аюулгүй Байдлын Дизайны Баримт Бичиг

**Баримт бичиг:** `docs/phase-0/08-security_mn.md`
**Төсөл:** Ногоолин — Шашны Бүтээгдэхүүний Каталог Платформ
**Хувилбар:** 1.2.0
**Төлөв:** Ноорог
**Зохиогч:** Тэнгис (Хөгжүүлэгч)
**Сүүлд шинэчилсэн:** 2026 оны 7-р сар
**Хамааралтай баримт:** [`docs/phase-0/02-requirements_mn.md`](./02-requirements_mn.md), [`docs/phase-0/04-er-diagram.mn.md`](04-er-diagram.mn.md), [`docs/phase-0/05-sequence-diagrams_mn.md`](./05-sequence-diagrams_mn.md), [`docs/phase-0/06-api-spec.yaml`](06-api-spec.yaml)

---

## Өөрчлөлтийн Түүх

| Хувилбар | Огноо | Төрөл | Тайлбар |
|---|---|---|---|
| 1.2.0 | 2026 оны 7-р сар | MINOR | Мобайл платформ Flutter → React Native + Expo болж шинэчлэгдлээ: client лавлагаанууд, аюулгүй хадгалалт (expo-secure-store), OAuth flow (@react-native-google-signin), мобайлд хуваалцсан Zod схем, CI/CD workflow нэр |
| 1.1.0 | 2026 оны 6-р сар | MINOR | 2-р давхарга Fastify plugin/hook системд бүхэлдээ шинэчлэгдлээ; Express middleware chain-ийг @fastify/helmet, @fastify/cors, @fastify/rate-limit, @fastify/multipart, @fastify/cookie, @fastify/auth-аар орлуулав; auth middleware onRequest hook болов; файл байршуулалтын хэсэг шинэчлэгдлээ |
| 1.0.0 | 2026 оны 6-р сар | MAJOR | Анхны хувилбар. Шаардлагуудын турш (NFR-SEC-001 - NFR-SEC-013) болон SEQ-004-д лавлагдсан 4 давхаргын гүнзгийрсэн аюулгүй байдлын загварыг тодорхой RLS policy, аюулын жагсаалт, нэвтрүүлэлтийн өмнөх аюулгүй байдлын шалгах жагсаалтын хамт албан ёсны баримт бичиг болгосон. |

---

## Гарчгийн Жагсаалт

1. [Тойм](#1-тойм)
2. [Гүнзгийрсэн Аюулгүй Байдлын Архитектур](#2-гүнзгийрсэн-аюулгүй-байдлын-архитектур)
3. [1-р Давхарга: Cloudflare WAF](#3-1-р-давхарга-cloudflare-waf)
4. [2-р Давхарга: Fastify Plugin-ууд ба Hook-ууд](#4-2-р-давхарга-fastify-plugin-ууд-ба-hook-ууд)
5. [3-р Давхарга: JWT Баталгаажуулалт ба RBAC](#5-3-р-давхарга-jwt-баталгаажуулалт-ба-rbac)
6. [4-р Давхарга: Supabase Мөрийн Түвшний Аюулгүй Байдал](#6-4-р-давхарга-supabase-мөрийн-түвшний-аюулгүй-байдал)
7. [Оролтын Шалгалтын Стратеги](#7-оролтын-шалгалтын-стратеги)
8. [Файл Байршуулалтын Аюулгүй Байдал](#8-файл-байршуулалтын-аюулгүй-байдал)
9. [IDOR Урьдчилан Сэргийлэлт](#9-idor-урьдчилан-сэргийлэлт)
10. [Аудит Бүртгэл](#10-аудит-бүртгэл)
11. [Нууц Мэдээлэл Удирдах](#11-нууц-мэдээлэл-удирдах)
12. [Аюулын Загварын Хураангуй](#12-аюулын-загварын-хураангуй)
13. [Нэвтрүүлэлтийн Өмнөх Аюулгүй Байдлын Шалгах Жагсаалт](#13-нэвтрүүлэлтийн-өмнөх-аюулгүй-байдлын-шалгах-жагсаалт)

---

## 1. Тойм

### 1.1 Зорилго

Энэхүү баримт бичиг нь Ногоолины аюулгүй байдлын архитектурыг нэг лавлагаа болгон нэгтгэнэ. Хэдийгээр тусдаа аюулгүй байдлын шаардлагууд [`docs/phase-0/02-requirements_mn.md`](./02-requirements_mn.md)-ийн (4.2 хэсэг, NFR-SEC-001 - NFR-SEC-013) болон [`SEQ-004`](./05-sequence-diagrams_mn.md)-д харагддаг боловч энэхүү баримт бичиг нь дараах зүйлсийн **нэг итгэмжит эх үүсвэр** болно:

- Аюулгүй байдлын давхарга бүр юу хийж, юу хийдэггүй
- Хүснэгт бүрд зориулсан яг тодорхой Supabase RLS policy-ууд
- Нэг хөгжүүлэгчийн MVP-д зориулсан аюулын загвар болон хүлээн зөвшөөрсөн эрсдэлийн байр суурь
- Үйлдвэрлэлийн нэвтрүүлэлтийн өмнө гүйцэтгэх тодорхой шалгах жагсаалт

### 1.2 Хамрах Хүрээ

Аюулгүй байдлыг хамарна:
- Нийтийн вэб (Next.js)
- Администраторын самбар (Next.js `/admin`)
- React Native + Expo мобайл апп
- Fastify + TypeScript REST API (`/api/v1/`)
- Supabase PostgreSQL (RLS), Auth, болон Storage

### 1.3 Аюулгүй Байдлын Философи

> **Аюулгүй байдал нь backend-ийн эхний мөр кодоос өмнө загварчлагддаг** (Төслийн Хязгаарлалт, `01-vision_mn.md` §11).

Энэ нь нэг хөгжүүлэгчийн төсөл тул аюулгүй байдлын загвар дараах зүйлсийг илүүд үздэг:

- **Нэг төгс давхаргаас илүүтэй гүнзгийрсэн аюулгүй байдал** — нэг давхарга буруу тохируулагдсан тохиолдолд ч бусад нь хамгаална.
- **Мэдээллийн сангийн хэрэгжүүлсэн аюулгүй байдал (RLS) хамгийн сүүлийн шугам болгон** — аппликейшны код алдаатай байсан ч RLS нь өгөгдлийн алдагдлаас сэргийлнэ.
- **Нээлттэй биш, хаасан хэлбэрээр бүтэлгүй болох** — эргэлзсэн тохиолдолд систем хандалтыг татгалзана.
- **Аюулгүй байдлын гадаад байдал биш** — нэг хөгжүүлэгч бодитоор тохируулж, хянаж, засвар үйлчилгээ хийж чадахгүй хяналтуудыг нэмэхгүй.

---

## 2. Гүнзгийрсэн Аюулгүй Байдлын Архитектур

Нийтийн болон admin аль ч хүсэлт өгөгдөлд хүрэхийн өмнө дөрвөн бие даасан аюулгүй байдлын давхаргыг дамжина. Давхарга бүр өмнөх давхарга **бүтэлгүй болсон байж болно** гэж үзэж, боломжтой зүйлийг дахин шалгана.

```
┌─────────────────────────────────────────────────────────────────┐
│  Client (Next.js Web / Admin / React Native Mobile)               │
└───────────────────────────┬───────────────────────────────────────┘
                              │ HTTPS (TLS 1.2+, NFR-SEC-001)
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  1-р ДАВХАРГА — Cloudflare WAF / Edge                             │
│  • DDoS шаардлагагүй болгох                                       │
│  • Удирдагдсан WAF дүрмийн цуглуулга (OWASP Core Rule Set)        │
│  • Edge rate limiting (бүдүүлэг, IP-д суурилсан)                 │
│  • TLS дуусгавар болгох, bot fight mode                           │
└───────────────────────────┬───────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  2-р ДАВХАРГА — Fastify Plugin-ууд ба Hook-ууд                   │
│  • @fastify/helmet (аюулгүй headers, NFR-SEC-007)                │
│  • @fastify/cors (зөвшөөрөгдсөн жагсаалт: вэб + admin, NFR-SEC-006)│
│  • @fastify/rate-limit (route config-аар, NFR-SEC-002)           │
│  • Zod preHandler hook (NFR-SEC-003)                             │
└───────────────────────────┬───────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  3-р ДАВХАРГА — JWT Баталгаажуулалт + RBAC                       │
│  • Supabase Auth JWT гарын үсэг + дуусалтыг шалгах (NFR-SEC-013) │
│  • Үүргийн нэхэмжлэлийг гаргаж авах (guest / customer / admin)   │
│  • requireAuth() / requireAdmin() middleware (FR-AUTH-009)       │
└───────────────────────────┬───────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  4-р ДАВХАРГА — Supabase PostgreSQL RLS                           │
│  • Бүх хүснэгтэд Мөрийн Түвшний Аюулгүй Байдал (NFR-SEC-008)    │
│  • Мэдээллийн сангийн түвшинд өмчлөлийн шалгалт (IDOR, NFR-SEC-010)│
│  • audit_logs-т зөвхөн нэмэлт хэрэгжүүлэлт (FR-AUD-003)        │
│  • Supabase client-ээр параметр болгосон query-ууд (NFR-SEC-004) │
└─────────────────────────────────────────────────────────────────┘
```

### 2.1 Давхаргын Хариуцлагын Матриц

| Давхарга | Юуг зогсоодог | Зогсоодоггүй зүйл | Энэ давхарга бүтэлгүй болвол... |
|---|---|---|---|
| 1. Cloudflare WAF | Хэмжээний DDoS, мэдэгдэж байгаа exploit гарын үсэг, bot трафик | Аппликейшны логикийн алдаа, хүчинтэй харагдах хортой хүсэлтүүд | 2-р давхаргын rate limiting + 3-р давхаргын auth хэвээр хэрэглэгдэнэ |
| 2. Fastify Plugin-ууд ба Hook-ууд | Муу хэлбэрт/хэт том хүсэлтүүд, байхгүй headers, route-ийн түвшний хэт ачаалал | Нэвтэрсэн хэрэглэгч өөрийн эрхийг буруу ашиглах | 3-р давхаргын auth хэвээр шаардлагатай; 4-р давхаргын RLS хэвээр хэрэгжинэ |
| 3. JWT/RBAC | Admin route-ууд руу нэвтрээгүй хандалт, дууссан token | RLS policy логикийн алдаа | 4-р давхаргын RLS эцсийн буфер болно |
| 4. Supabase RLS | Апп логикийг тойрсон шууд өгөгдөлд хандалт, IDOR, cross-tenant алдагдал | Үүнээс доор юу ч байхгүй — **сүүлийн хамгаалалтын шугам** | Байхгүй — энэ нь хамгийн доод давхарга |

### 2.2 Лавлагаа: SEQ-004 Алхам бүрийн Тайлбар

[`SEQ-004`](./05-sequence-diagrams_mn.md) нь нэг admin-д зориулсан mutation дээр 4 давхарга дараалан ажиллаж байгаагийн жишээ болно:

```
PATCH /api/v1/admin/settings/delivery
  → 1-р Давхарга: Cloudflare WAF шалгалт
  → 2-р Давхарга: @fastify/helmet, @fastify/cors, @fastify/rate-limit, Zod preHandler
  → 3-р Давхарга: JWT шалгах + role == 'admin' (onRequest hook)
  → 4-р Давхарга: system_settings-ийн RLS-тэй UPDATE
  → Аудит бүртгэлийн мөр бичигдэнэ (FR-AUD-005)
```

3-р давхарга хүсэлтийг татгалзвал `UNAUTHORIZED_ACCESS` аудит бүртгэлийн мөр дахин бичигдэнэ — аюулгүй байдлын үйл явдлууд татгалзалын үед ч бүртгэгдэнэ.

---

## 3. 1-р Давхарга: Cloudflare WAF

**Лавлагаа:** NFR-SEC-001, NFR-SEC-012

### 3.1 Зорилго

Cloudflare нь DNS/CDN/WAF давхарга болгон Vercel (вэб/admin) болон Railway (API) хоёрын өмнө байрлана. Энэ нь бүх хүсэлтийн анхны хандалтын цэг бөгөөд хортой трафикийг аппликейшны дэд бүтэцэд хүрэхийн **өмнө** хааж зогсооно.

### 3.2 Тохиргоо

| Хяналт | Тохиргоо | Тэмдэглэл |
|---|---|---|
| SSL/TLS горим | Full (Strict) | Нэг туйлаас нөгөөд TLS 1.2 хамгийн бага хэмжээгээр хэрэгжүүлнэ (NFR-SEC-001) |
| Үргэлж HTTPS ашиглах | Асаалттай | Бүх HTTP → HTTPS рүү дахин чиглүүлнэ |
| TLS-ийн хамгийн бага хувилбар | 1.2 | Боломжтой газар TLS 1.3 илүүд үзэгдэнэ |
| WAF — Удирдагдсан Дүрмүүд | OWASP Core Rule Set (Cloudflare Managed Ruleset) | Үнэгүй tier нь үндсэн удирдагдсан дүрмийг агуулна |
| Bot Fight Mode | Асаалттай | Үнэгүй tier; `/api/v1/inquiries`-т үндсэн bot трафикийг багасгана |
| Rate Limiting (Edge) | `/api/v1/*`-д бүдүүлэг IP-д суурилсан дүрэм | Fastify rate limiting-ийн дээрх буфер (2-р давхарга) |
| Хөтчийн Бүрэн Байдлын Шалгалт | Асаалттай | Скриптийн халдлагад түгээмэл хэлбэр буруу/байхгүй headers-тэй хүсэлтийг хааж зогсооно |
| Хуудасны Дүрмүүд — Cache | `/api/*` болон `/admin/*`-т cache-г тойрч гарна | Хуучирсан эсвэл мэдрэмжтэй admin хариуд edge дээр cache хийхийг сэргийлнэ |

### 3.3 Cloudflare Хийдэггүй Зүйлс

Cloudflare бол **хамгийн гадна** давхарга бөгөөд санаатайгаар энгийн байдлаар хадгалагддаг:

- Энэ нь хэрэглэгчийн үүрэг, JWT, эсвэл `delivery_enabled`-ийг **мэддэггүй**
- Route-д хуваагдсан rate limiting (2-р давхарга)-ийг орлохгүй
- Оролтын шалгалтын орлуулалт биш

> **Дизайны зарчим:** Cloudflare буруу тохируулагдсан, идэвхгүй болгогдсон, эсвэл тойрогдсон тохиолдолд 2–4-р давхаргууд бие даасан байдлаар хадгалагдах ёстой. Энэ төслийн ямар ч аюулгүй байдлын шийдвэр *зөвхөн* Cloudflare-д тулгуурладаггүй.

---

## 4. 2-р Давхарга: Fastify Plugin-ууд ба Hook-ууд

**Лавлагаа:** NFR-SEC-002, NFR-SEC-003, NFR-SEC-006, NFR-SEC-007

Энэ давхарга нь Fastify + TypeScript API дотор ажиллах бөгөөд route handler логик гүйцэтгэгдэхийн өмнө. Аюулгүй байдлын асуудлыг Fastify-ийн **plugin систем** (эхлүүлэх үед бүртгэгддэг) болон **hook систем** (`onRequest`, `preHandler`) ашиглан глобал эсвэл route тус бүрт хэрэгжүүлнэ. Энэ нь Express-ийн middleware chain-ийг орлоно.

Fastify-ийн албан ёсны TypeScript boilerplate (`fastify-cli`) нь эхлэлийн цэг бөгөөд аюулгүй байдлын plugin-ууд Fastify-ийн санал болгосон encapsulation загварын дагуу `src/plugins/`-д бүртгэгдэнэ.

### 4.1 @fastify/helmet — Аюулгүй Headers (NFR-SEC-007)

```typescript
// apps/api/src/plugins/helmet.ts
import fp from 'fastify-plugin'
import helmet from '@fastify/helmet'
import { FastifyInstance } from 'fastify'

export default fp(async (fastify: FastifyInstance) => {
  await fastify.register(helmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        imgSrc: ["'self'", 'https://*.supabase.co', 'data:'],
        connectSrc: ["'self'", 'https://*.supabase.co'],
        mediaSrc: ["'self'", 'https://*.supabase.co'],
      },
    },
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
  })
})
```

| Header | Утга | Зорилго |
|---|---|---|
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains; preload` | 1 жилийн хугацаанд HTTPS-ийг заавар болгоно (NFR-SEC-001) |
| `X-Content-Type-Options` | `nosniff` | Байршуулсан зураг/GLB-д MIME-нэвт дайралтаас сэргийлнэ |
| `X-Frame-Options` | `DENY` | `/admin`-ийг фрэймд оруулахаас сэргийлнэ (clickjacking) |
| `Content-Security-Policy` | хязгаарлагдмал, Supabase Storage-г зөвшөөрнө | Injected script-ээр XSS-ийг бууруулна |
| `Referrer-Policy` | `no-referrer-when-downgrade` | Helmet-ийн анхдагч зан үйл, MVP-д хангалттай |

### 4.2 @fastify/cors Тохиргоо (NFR-SEC-006)

```typescript
// apps/api/src/plugins/cors.ts
import fp from 'fastify-plugin'
import cors from '@fastify/cors'
import { FastifyInstance } from 'fastify'

const ALLOWED_ORIGINS = [
  'https://nogoolin.mn',
  'https://www.nogoolin.mn',
  'http://localhost:3000', // зөвхөн локал dev — үйлдвэрлэлийн env-д устгагдана
]

export default fp(async (fastify: FastifyInstance) => {
  await fastify.register(cors, {
    origin: (origin, cb) => {
      if (!origin || ALLOWED_ORIGINS.includes(origin)) {
        cb(null, true)
      } else {
        cb(new Error('Not allowed by CORS'), false)
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  })
})
```

> **Тэмдэглэл:** React Native мобайл апп нь хөтчийн нэгэн адил `Origin` header илгээдэггүй тул CORS нь мобайл API хандалтыг хязгаарлахгүй — мобайл хүсэлтүүд 3-р давхаргаар (JWT) баталгаажуулагдана.

### 4.3 @fastify/rate-limit Хүсэлтийн Хязгаарлалт (NFR-SEC-002)

`@fastify/rate-limit` нь глобалаар бүртгэгдэж ерөнхий хязгаарыг тохируулна, нарийн хязгаарлалтыг route тус бүрд override хийнэ. Config нь route дотроо байдаг тул Express-ийн аргаас илүү цэвэр.

```typescript
// apps/api/src/plugins/rateLimit.ts
import fp from 'fastify-plugin'
import rateLimit from '@fastify/rate-limit'
import { FastifyInstance } from 'fastify'

export default fp(async (fastify: FastifyInstance) => {
  // Глобал анхдагч: IP тус бүр 15 минутад 100 хүсэлт
  await fastify.register(rateLimit, {
    max: 100,
    timeWindow: '15 minutes',
    errorResponseBuilder: () => ({
      error: 'Too many requests. Please try again later.',
      code: 'RATE_LIMIT_EXCEEDED',
    }),
  })
})

// Route тус бүрд override хийх жишээ:

// Auth route — 15 минутад 5 хүсэлт (UC-A-001 Онцгой Урсгал)
fastify.post('/auth/sign-in', {
  config: { rateLimit: { max: 5, timeWindow: '15 minutes' } },
}, signInHandler)

// Хүсэлт — цагт 3 хүсэлт (FR-INQ-007, UC-G-007 Онцгой Урсгал)
fastify.post('/inquiries', {
  config: {
    rateLimit: {
      max: 3,
      timeWindow: '1 hour',
      errorResponseBuilder: () => ({
        error: 'Too many submissions. Please try again later.',
        code: 'RATE_LIMIT_EXCEEDED',
      }),
    },
  },
}, inquiryHandler)
```

| Route бүлэг | Хязгаар | Хугацааны цонх | Шаардлага |
|---|---|---|---|
| `/api/v1/*` (ерөнхий) | 100 хүсэлт | 15 мин | NFR-SEC-002 |
| `/api/v1/auth/*` | 5 хүсэлт | 15 мин | NFR-SEC-002, UC-A-001 |
| `POST /api/v1/inquiries` | 3 хүсэлт | 1 цаг | FR-INQ-007, UC-G-007 |

> Rate limit төлөв нь MVP-д **дотор санах ойд** хадгалагддаг (нэг Railway container). API олон instance руу өргөтгөгдвөл (NFR-SCA-001) хуваалцсан хадгалалт руу (жишээ нь Redis) шилжих шаардлагатай — Phase 6+ тэмдэглэл.

### 4.4 Zod Хүсэлтийн Шалгалт — preHandler Hook (NFR-SEC-003)

Route бүр handler гүйцэтгэгдэхийн өмнө Zod `preHandler` hook-оор `request.body`, `request.query`, `request.params`-ийг шалгана. Схемүүд `packages/validation-schemas/`-д байрлаж frontend-тэй хуваалцана (NFR-MAIN-003).

```typescript
// packages/validation-schemas/src/inquiry.schema.ts
import { z } from 'zod'

export const inquiryInputSchema = z.object({
  customer_name: z.string().min(2),
  phone: z.string().regex(/^[0-9+\s-]{8,15}$/),
  message: z.string().optional(),
  product_id: z.string().uuid().nullable().optional(),
})

// apps/api/src/hooks/validate.ts
import { FastifyRequest, FastifyReply } from 'fastify'
import { ZodSchema } from 'zod'

export const validateBody = (schema: ZodSchema) =>
  async (request: FastifyRequest, reply: FastifyReply) => {
    const result = schema.safeParse(request.body)
    if (!result.success) {
      reply.code(400).send({
        error: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details: result.error.flatten(),
      })
      return
    }
    request.body = result.data
  }

// Route-д ашиглах:
fastify.post('/inquiries', {
  preHandler: validateBody(inquiryInputSchema),
}, inquiryHandler)
```

### 4.5 2-р Давхаргын Хураангуй Хүснэгт

| Plugin / Hook | Package | Шаардлага | Хэрэглэгддэг газар |
|---|---|---|---|
| Аюулгүй headers | `@fastify/helmet` | NFR-SEC-007 | Глобал plugin |
| CORS | `@fastify/cors` | NFR-SEC-006 | Глобал plugin |
| Ерөнхий rate limit | `@fastify/rate-limit` | NFR-SEC-002 | Глобал plugin анхдагч |
| Auth rate limit | `@fastify/rate-limit` | NFR-SEC-002 | Route config override |
| Хүсэлтийн rate limit | `@fastify/rate-limit` | FR-INQ-007 | Route config override |
| Body/query шалгалт | `zod` + `preHandler` | NFR-SEC-003 | Route preHandler hook |
| Файл байршуулалт | `@fastify/multipart` | FR-MEDIA-003 | Route plugin |
| Cookie | `@fastify/cookie` | NFR-SEC-013 | Глобал plugin |

---

## 5. 3-р Давхарга: JWT Баталгаажуулалт ба RBAC

**Лавлагаа:** NFR-SEC-009, NFR-SEC-013, FR-AUTH-001 - FR-AUTH-011

### 5.1 Зорилго

3-р давхарга нь controller логик гүйцэтгэгдэхийн өмнө **хүсэлт гаргаж байгаа хүн хэн бэ** (баталгаажуулалт) болон **тэд юу хийхийг зөвшөөрдөг вэ** (зөвшөөрлийн/RBAC) гэдгийг шалгана.

### 5.2 Token-ийн Амьдралын Мөчлөг (NFR-SEC-013)

| Token | Хугацаа | Хадгалалт | Сэлгэлт |
|---|---|---|---|
| Access token (JWT) | 15 минут | httpOnly cookie (вэб/admin) / `expo-secure-store` (мобайл) | Сэлгэгдэхгүй — богино хугацаатай байхаар загварчлагдсан |
| Refresh token | 7 хоног | httpOnly cookie (вэб/admin) / `expo-secure-store` (мобайл) | **Ашиглах болгонд сэлгэгдэнэ** (FR-AUTH-006) |

```
┌──────────────┐   нэвтрэх    ┌──────────────┐
│   Client      │ ───────────▶ │ Supabase Auth │
│ (Вэб/Мобайл) │ ◀─────────── │               │
└──────────────┘  access(15м) │               │
       │          + refresh(7х)└──────────────┘
       │ access token дуусна (15 мин)
       ▼
┌──────────────┐  refresh     ┌──────────────┐
│   Client      │ ───────────▶ │ Supabase Auth │
│               │ ◀─────────── │ сэлгэнэ       │
└──────────────┘  шинэ access └──────────────┘
```

> **Яагаад 15 минут вэ?** Хулгайлагдсан access token хязгаарлагдмал хугацаатай. Refresh token сэлгэлт (FR-AUTH-006) нь хуучирсан refresh token-ийг дахин ашиглахаас сэргийлнэ — Supabase дахин ашигласан болохыг илрүүлвэл бүх сессийн гэр бүлийг цуцална.

### 5.3 Үүрэгүүд (FR-AUTH-008)

| Үүрэг | Хадгалагддаг уу? | Хуваарилагддаг | Тэмдэглэл |
|---|---|---|---|
| `guest` | Үгүй | Анхдагч (нэвтрээгүй) | `public.users`-д хадгалагдахгүй |
| `customer` | Тийм | Бүртгүүлэх үед автоматаар (UC-SYS-001) | Бүх шинэ бүртгэлийн анхдагч үүрэг |
| `admin` | Тийм | Тэнгис Supabase dashboard-аас **гараар тохируулна** | Ямар ч API endpoint-ээр өөрөө тохируулах боломжгүй |
| `delivery_staff` | Нөөцлөгдсөн (W) | Ирээдүй — MVP-д тохируулах боломжгүй | Схем дэмжинэ, кодын зам одоо байхгүй |

> **Чухал дүрэм:** хэрэглэгчид өөрийн `role`-ийг `admin` болгон тохируулах боломжийг олгодог **ямар ч API endpoint байхгүй**. Анхны admin бүртгэл нь гараар bootstrap хийгддэг ([`09-deployment_mn.md`](./09-deployment_mn.md) §9-г үзнэ үү).

### 5.4 Hook Хэрэгжүүлэлт

```typescript
// apps/api/src/hooks/auth.ts
import { FastifyRequest, FastifyReply } from 'fastify'
import { createClient } from '@supabase/supabase-js'
import { auditLogRepo } from '../repositories/auditLog.repo'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

declare module 'fastify' {
  interface FastifyRequest {
    user?: { id: string; role: 'customer' | 'admin' | 'delivery_staff' }
  }
}

/**
 * onRequest hook — JWT гарын үсэг + дуусалтыг шалгаж, user + role-ийг хавсаргана.
 * Token байхгүй эсвэл хүчингүй бол 401 буцаана. Лавлагаа: NFR-SEC-009
 */
export async function requireAuth(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const token =
    request.cookies['sb-access-token'] ??
    request.headers.authorization?.replace('Bearer ', '')

  if (!token) {
    reply.code(401).send({ error: 'Missing access token', code: 'UNAUTHORIZED' })
    return
  }

  const { data, error } = await supabase.auth.getUser(token)
  if (error || !data.user) {
    reply.code(401).send({ error: 'Invalid or expired token', code: 'UNAUTHORIZED' })
    return
  }

  const { data: profile } = await supabase
    .from('users')
    .select('id, role')
    .eq('id', data.user.id)
    .single()

  request.user = { id: data.user.id, role: profile?.role ?? 'customer' }
}

/**
 * onRequest hook — requireAuth-ийн дараа ажиллана.
 * Нэвтэрсэн хэрэглэгч admin биш бол 403 буцаана. Лавлагаа: FR-AUTH-009
 */
export async function requireAdmin(
  request: FastifyRequest,
  reply: FastifyReply
) {
  if (request.user?.role !== 'admin') {
    auditLogRepo.log({
      admin_id: request.user?.id ?? null,
      action: 'UNAUTHORIZED_ACCESS',
      entity_type: 'route',
      entity_id: null,
      metadata: { attempted_route: request.url, method: request.method },
    }).catch(() => {}) // fire-and-forget, 403 хариуг хэзээ ч хааж зогсоохгүй

    reply.code(403).send({ error: 'Admin access required', code: 'FORBIDDEN' })
  }
}
```

### 5.5 Hook-уудыг Route-д Хэрэглэх

[`06-api-spec.yaml`](06-api-spec.yaml)-д заасны дагуу бүх `/admin/*` route нь хоёуланг шаардана (NFR-SEC-009). Fastify-д энэ нь scoped plugin encapsulation-аар хийгдэнэ — scope дотор зарлагдсан hook нь зөвхөн тэр scope-ийн route-уудад хэрэглэгдэнэ:

```typescript
// apps/api/src/routes/admin/products.routes.ts
import { FastifyInstance } from 'fastify'
import { requireAuth, requireAdmin } from '../../hooks/auth'
import { validateBody } from '../../hooks/validate'
import { productInputSchema, productPatchSchema } from '@nogoolin/validation-schemas'
import * as adminProductController from '../../controllers/admin/product.controller'

export default async function productAdminRoutes(fastify: FastifyInstance) {
  // onRequest hook нь энэ scoped plugin-ийн БҮХИЙ route-д хэрэглэгдэнэ
  fastify.addHook('onRequest', requireAuth)
  fastify.addHook('onRequest', requireAdmin)

  fastify.get('/', adminProductController.list)

  fastify.post('/', {
    preHandler: validateBody(productInputSchema),
  }, adminProductController.create)

  fastify.patch('/:id', {
    preHandler: validateBody(productPatchSchema),
  }, adminProductController.update)

  fastify.delete('/:id', adminProductController.remove)
}
```

Нийтийн route-ууд ямар ч auth middleware хэрэглэхгүй (`security: []`) — жишээ нь `GET /products`, `GET /categories`, `POST /inquiries`.

### 5.6 OAuth ба PKCE (FR-AUTH-002, FR-AUTH-004)

| Тал | Вэб (Next.js) | Мобайл (React Native + Expo) |
|---|---|---|
| Урсгал | `supabase-js` `signInWithOAuth`-аар PKCE | Native `signInWithIdToken` (FR-AUTH-002) — **WebView биш** |
| Яагаад PKCE вэ | Зөвшөөрлийн кодын таслан авалтаас сэргийлнэ | Native урсгал нь WebView cookie/сессийн асуудлаас зайлсхийнэ |
| Trigger | UC-A-002 (SEQ-001) | Хамгийн ижил Supabase trigger сервер талаас ажиллана |

Хоёр зам ижил мэдээллийн сангийн trigger (`on_auth_user_created`, UC-SYS-001) дээр нийлдэг — **аюулгүй байдлын баталгаа яг ижил**, trigger нь Postgres-д ажиллах бөгөөд клиентийн кодод биш.

### 5.7 Олон OAuth Provider Холбох (FR-AUTH-007, S-priority)

Supabase Auth нь шалгасан email-ийн дагуу тохиромжтой бүртгэлийг олно. **Дотоод код шаардлагагүй** бөгөөд `auth.users.id` холбогдсон identity даяар тогтвортой хэвээр байдаг.

### 5.8 Гарах (FR-AUTH-011, UC-A-004)

```typescript
await supabase.auth.signOut(); // Supabase-д refresh token-ийг цуцална
// + httpOnly cookie-уудыг цэвэрлэнэ (вэб) / аюулгүй хадгалалт (мобайл)
```

Гарсан access token нь 15 минутын дуусалт хүртэл техникийн хувьд хүчинтэй хэвээр байна — хүлээн зөвшөөрсөн MVP-ийн буулт.

---

## 6. 4-р Давхарга: Supabase Мөрийн Түвшний Аюулгүй Байдал

**Лавлагаа:** NFR-SEC-008, NFR-SEC-010, NFR-SEC-004, FR-AUD-003

### 6.1 Зорилго

RLS бол **сүүлийн хамгаалалтын шугам** (§2.1). Дээрх бүх давхарга тойрогдсон ч Postgres өөрөө хүсэлт гаргаж буй үүрэгт эрх олгоогүй мөрүүдийг буцаахаас эсвэл өөрчлөхөөс татгалзана.

`supabase/migrations/`-д үүсгэсэн бүх хүснэгтэд RLS нь анхны миграцаас **идэвхжүүлэгдсэн** байна (NFR-SEC-008), ирээдүйд зориулсан хүснэгтүүдийг оруулсан (NFR-SCA-003).

### 6.2 Policy-д Ашиглагдах Supabase Үүрэгүүд

| Supabase үүрэг | Харгалзах | Хэрхэн тодорхойлогддог |
|---|---|---|
| `anon` | Guest (нэвтрээгүй) | JWT байхгүй, эсвэл `anon` API түлхүүр |
| `authenticated` | Customer (эсвэл Admin) | Хүчинтэй Supabase Auth JWT, `auth.uid()` боломжтой |
| `service_role` | Backend API (зөвхөн сервер талаас) | Service role түлхүүр — **RLS-ийг бүрэн тойрдог**, зөвхөн итгэмжит сервер үйлдлүүдэд ашиглагддаг |

> Fastify API нь ердийн CRUD-д **`authenticated`** контекст ашиглана тул backend-ийг дамжсан хүсэлтүүдэд ч RLS хэрэгжинэ. `service_role` түлхүүр нь ямар ч клиентэд **хэзээ ч** нээлттэй болгодоггүй.

### 6.3 Туслах Функц: `is_admin()`

```sql
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated, anon;
```

---

### 6.4 Хүснэгт: `users`

**Лавлагаа:** FR-USER-001, FR-USER-002, FR-USER-003, FR-USER-004, FR-USER-005

```sql
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- FR-USER-005: хэрэглэгч зөвхөн өөрийн профайлыг унших; admin бүгдийг унших
CREATE POLICY "users_select_own_or_admin"
  ON public.users FOR SELECT
  TO authenticated
  USING (id = auth.uid() OR is_admin());

-- FR-USER-002: хэрэглэгч өөрийн мөрийг шинэчлэх боломжтой
CREATE POLICY "users_update_own"
  ON public.users FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- FR-USER-004: зөвхөн admin нь хэрэглэгчийн үүргийг өөрчлөх боломжтой
CREATE POLICY "users_update_role_admin_only"
  ON public.users FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- INSERT policy байхгүй — мөрүүд зөвхөн on_auth_user_created trigger-ээр үүснэ (UC-SYS-001)
-- DELETE policy байхгүй — хэрэглэгч устгах нь MVP-д хамрах хүрээнд орохгүй
```

---

### 6.5 Хүснэгт: `categories`

**Лавлагаа:** FR-CAT-003, FR-CAT-007, FR-PUB-005

```sql
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- FR-CAT-007, FR-PUB-005: хэн ч идэвхтэй ангиллыг унших боломжтой
CREATE POLICY "categories_select_active"
  ON public.categories FOR SELECT
  TO anon, authenticated
  USING (is_active = true OR is_admin());

-- Admin: бүрэн CRUD
CREATE POLICY "categories_admin_all"
  ON public.categories FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());
```

---

### 6.6 Хүснэгт: `products`

**Лавлагаа:** FR-PROD-004, FR-PROD-008, FR-PUB-001

```sql
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- FR-PROD-004: зөвхөн `published` бүтээгдэхүүнүүд guest/customer-т харагдана
CREATE POLICY "products_select_published"
  ON public.products FOR SELECT
  TO anon, authenticated
  USING (status = 'published' OR is_admin());

-- Admin: бүрэн CRUD
CREATE POLICY "products_admin_all"
  ON public.products FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());
```

---

### 6.7 Хүснэгт: `product_images`

**Лавлагаа:** FR-MEDIA-004, FR-MEDIA-005, FR-MEDIA-006

```sql
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;

-- Эцэг бүтээгдэхүүн нийтлэгдсэн бол харагдана (эсвэл дуудагч admin)
CREATE POLICY "product_images_select_via_product"
  ON public.product_images FOR SELECT
  TO anon, authenticated
  USING (
    is_admin()
    OR EXISTS (
      SELECT 1 FROM public.products p
      WHERE p.id = product_images.product_id AND p.status = 'published'
    )
  );

-- Admin: бүрэн CRUD
CREATE POLICY "product_images_admin_all"
  ON public.product_images FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());
```

---

### 6.8 Хүснэгт: `media_assets`

**Лавлагаа:** `04-er-diagram.mn.md` §3.5 — сайт даяар ашиглах хөрөнгө (3D нээлтийн загвар, hero зураг)

```sql
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;

-- Сайт даяар ашиглах хөрөнгө нийтэд унших боломжтой — нэвтрээгүй
-- 3D нээлтийн анимацид шаардлагатай (FR-3D-001)
CREATE POLICY "media_assets_select_all"
  ON public.media_assets FOR SELECT
  TO anon, authenticated
  USING (true);

-- Admin: бүрэн CRUD
CREATE POLICY "media_assets_admin_all"
  ON public.media_assets FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());
```

---

### 6.9 Хүснэгт: `system_settings`

**Лавлагаа:** FR-SET-001 - FR-SET-007, FR-PUB-009

```sql
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- FR-PUB-009: delivery_enabled нийтийн тохиргооны endpoint-ээр унших боломжтой
CREATE POLICY "system_settings_select_all"
  ON public.system_settings FOR SELECT
  TO anon, authenticated
  USING (true);

-- FR-SET-003: зөвхөн admin нь тохиргоог шинэчлэх боломжтой
CREATE POLICY "system_settings_update_admin"
  ON public.system_settings FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- INSERT/DELETE байхгүй — мөрүүд migration-аар нэг удаа seed хийгдэж, зөвхөн шинэчлэгддэг.
```

---

### 6.10 Хүснэгт: `inquiries`

**Лавлагаа:** FR-INQ-001 - FR-INQ-007, UC-G-007, UC-ADM-009, UC-ADM-010

```sql
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- FR-INQ-001: guest болон customer нэвтрэлтгүйгээр хүсэлт илгээх боломжтой
CREATE POLICY "inquiries_insert_anyone"
  ON public.inquiries FOR INSERT
  TO anon, authenticated
  WITH CHECK (status = 'new'); -- FR-INQ-003: үргэлж status='new'-тайгаар үүснэ

-- UC-ADM-009: зөвхөн admin нь хүсэлтийн ирэлтийн хайрцгийг харах боломжтой
CREATE POLICY "inquiries_select_admin"
  ON public.inquiries FOR SELECT
  TO authenticated
  USING (is_admin());

-- UC-ADM-010: зөвхөн admin нь хүсэлтийн статусыг шинэчлэх боломжтой
CREATE POLICY "inquiries_update_admin"
  ON public.inquiries FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- DELETE policy байхгүй — хүсэлтүүд admin-ийн түүхэнд хадгалагдана.
```

> **Rate limiting санамж:** `inquiries_insert_anyone` нь ямар ч anon хүсэлтэд оруулахыг зөвшөөрнө. Цагт 3-ын IP-ийн хязгаар (FR-INQ-007) нь **2-р давхаргад** хэрэгжинэ, RLS-д биш — Postgres нь "IP тус бүр хүсэлт" гэсэн ойлголтгүй.

---

### 6.11 Ирээдүйн Хүснэгтүүд: `orders`, `order_items`, `delivery_assignments`

**Лавлагаа:** FR-ORD-001 - FR-ORD-008, NFR-SEC-010 (IDOR), NFR-SCA-003

Анхны миграцаас RLS **идэвхжүүлэгдэж, policy-тойгоор** үүсгэгддэг, хэдийгээр `delivery_enabled = false` байх хугацаанд хоосон байдаг.

```sql
-- ── orders ──────────────────────────────────────────────
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- FR-ORD-007 / NFR-SEC-010: хэрэглэгч зөвхөн өөрийн захиалгыг харах боломжтой
CREATE POLICY "orders_select_own_or_admin"
  ON public.orders FOR SELECT
  TO authenticated
  USING (customer_id = auth.uid() OR is_admin());

-- FR-ORD-001: хэрэглэгч зөвхөн өөрийн захиалга үүсгэх боломжтой.
-- ТЭМДЭГЛЭЛ: delivery_enabled шалгалт (FR-SET-004, UC-SYS-002) нь
-- SERVICE ДАВХАРГАД (Fastify route handler → service) хэрэгжинэ, policy-д биш. Санаатай тусгаарлалт.
CREATE POLICY "orders_insert_own"
  ON public.orders FOR INSERT
  TO authenticated
  WITH CHECK (customer_id = auth.uid());

-- FR-ORD-005: зөвхөн admin захиалгын статусыг шинэчлэнэ
CREATE POLICY "orders_update_admin"
  ON public.orders FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- ── order_items ─────────────────────────────────────────
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "order_items_select_via_order"
  ON public.order_items FOR SELECT
  TO authenticated
  USING (
    is_admin()
    OR EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = order_items.order_id AND o.customer_id = auth.uid()
    )
  );

CREATE POLICY "order_items_insert_via_order"
  ON public.order_items FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = order_items.order_id AND o.customer_id = auth.uid()
    )
  );

-- ── delivery_assignments ────────────────────────────────
ALTER TABLE public.delivery_assignments ENABLE ROW LEVEL SECURITY;

-- Хуваарилагдсан хүргэгч эсвэл admin харах боломжтой
CREATE POLICY "delivery_assignments_select_own_or_admin"
  ON public.delivery_assignments FOR SELECT
  TO authenticated
  USING (delivery_staff_id = auth.uid() OR is_admin());

-- Зөвхөн admin хуваарилалт үүсгэж/шинэчлэнэ
CREATE POLICY "delivery_assignments_admin_write"
  ON public.delivery_assignments FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());
```

---

### 6.12 Хүснэгт: `audit_logs`

**Лавлагаа:** FR-AUD-001 - FR-AUD-005 (зөвхөн нэмэлт)

```sql
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- UC-ADM-012: зөвхөн admin аудит бүртгэлийг харах боломжтой
CREATE POLICY "audit_logs_select_admin"
  ON public.audit_logs FOR SELECT
  TO authenticated
  USING (is_admin());

-- authenticated/anon-д INSERT policy байхгүй.
-- Аудит бүртгэлийн бичлэг нь зөвхөн service_role key-ээр (RLS-ийг тойрдог)
-- гүйцэтгэгддэг, Repository давхаргаас үндсэн үйлдэл амжилттай болсны
-- ДАРАА дуудагддаг (UC-SYS-003).
--
-- ЯМАР Ч үүрэгт UPDATE эсвэл DELETE policy байхгүй — FR-AUD-003
-- "зөвхөн нэмэлт, администраторыг оруулаад хэн ч засах эсвэл устгах боломжгүй"
-- нь UPDATE/DELETE policy-ийн байхгүйгээр хэрэгжинэ. Анхдагч-татгалзалт нь
-- ямар ч үүрэгт одоо байгаа мөрийг өөрчлөх боломжгүй болгодог.
```

---

### 6.13 RLS Policy Хураангуй Хүснэгт

| Хүснэгт | anon SELECT | authenticated SELECT | INSERT | UPDATE | DELETE |
|---|---|---|---|---|---|
| `users` | — | өөрийн мөр, эсвэл admin (бүгд) | зөвхөн trigger (SECURITY DEFINER) | өөрийн мөр / admin (үүрэг) | — |
| `categories` | зөвхөн идэвхтэй | идэвхтэй, эсвэл admin (бүгд) | admin | admin | admin |
| `products` | зөвхөн нийтлэгдсэн | нийтлэгдсэн, эсвэл admin (бүгд) | admin | admin | admin |
| `product_images` | нийтлэгдсэн бүтээгдэхүүнээр | нийтлэгдсэн бүтээгдэхүүнээр, эсвэл admin | admin | admin | admin |
| `media_assets` | бүгд | бүгд | admin | admin | admin |
| `system_settings` | бүгд | бүгд | — (зөвхөн seed) | admin | — |
| `inquiries` | — | зөвхөн admin | anon + authenticated | admin | — |
| `orders` *(ирээдүй)* | — | өөрийн, эсвэл admin | өөрийн (`customer_id`) | admin | — |
| `order_items` *(ирээдүй)* | — | өөрийн захиалгаар, эсвэл admin | өөрийн захиалгаар | — | — |
| `delivery_assignments` *(ирээдүй)* | — | өөрийн хуваарилалт, эсвэл admin | admin | admin | — |
| `audit_logs` | — | зөвхөн admin | зөвхөн service_role | **байхгүй** | **байхгүй** |

---

## 7. Оролтын Шалгалтын Стратеги

**Лавлагаа:** NFR-SEC-003, NFR-SEC-004, NFR-MAIN-003

### 7.1 Шалгалтын Давхаргууд

Оролтын шалгалт **хоёр цэгт** хийгддэг бөгөөд хоёулаа ижил Zod схем ашиглана (`packages/validation-schemas/`, NFR-MAIN-003):

```
┌─────────────────────────────────────────────────────────────────┐
│  CLIENT ТАЛААС (Next.js маягтууд, React Native маягтууд)          │
│  • Вэб БОЛОН мобайлд ижил хуваалцсан Zod схем (validation-schemas)│
│  • Тэр дороо UX хариу — аюулгүй байдлын хил биш                 │
│  • Үргэлж тойрч гарах боломжтой (хөтчийн devtools, өөрчлөгдсөн апп)│
└───────────────────────────┬───────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  СЕРВЕР ТАЛААС (Fastify preHandler Hook — 2-р Давхарга)           │
│  • ЯГ ижил Zod схем, болзолгүйгээр дахин шалгагддаг              │
│  • ЭНЭ бол аюулгүй байдлын хил (NFR-SEC-003)                    │
│  • Client шалгалт бүтэлгүй болсон ≠ сервер шалгалт алгасагдсан  │
└─────────────────────────────────────────────────────────────────┘
```

> **Дүрэм:** client талаас шалгалт хийгдсэн гэж сервер **хэзээ ч** итгэдэггүй. Бүх `POST`/`PATCH` controller нь `validateBody(schema)`-г дуудна.

### 7.2 Схемийн Жагсаалт

| Схем | Хэрэглэгддэг газар | Гол хязгаарлалтууд |
|---|---|---|
| `inquiryInputSchema` | `POST /inquiries` | `phone` regex `^[0-9+\s-]{8,15}$`, `customer_name` хамгийн бага 2 тэмдэгт |
| `productInputSchema` | `POST /admin/products` | `name`, `category_id` (uuid), `price` (эерэг тоо) заавал |
| `productPatchSchema` | `PATCH /admin/products/:id` | Бүх талбар заавал биш (`06-api-spec.yaml` `ProductPatchInput`-г үзнэ) |
| `categoryInputSchema` | `POST /admin/categories` | `name` заавал |
| `categoryPatchSchema` | `PATCH /admin/categories/:id` | Бүх талбар заавал биш |
| `deliveryToggleSchema` | `PATCH /admin/settings/delivery` | `delivery_enabled: boolean` |
| `inquiryStatusSchema` | `PATCH /admin/inquiries/:id/status` | `status` enum: `new \| contacted \| closed` |

### 7.3 Параметр болгосон Query-ууд (NFR-SEC-004)

Бүх мэдээллийн сангийн хандалт нь **Repository давхаргаар** Supabase JS client-ийн query builder ашиглан явагддаг — хэзээ ч raw string concatenation биш:

```typescript
// ✅ ЗӨВ — Supabase query builder, дотооддоо параметр болгогдсон
const { data } = await supabase
  .from('products')
  .select('*')
  .eq('category_id', categoryId)
  .ilike('name', `%${searchTerm}%`);

// ❌ ХОРИОТОЙ — raw SQL string interpolation (энэ кодын баазад хэзээ ч байхгүй)
// const query = `SELECT * FROM products WHERE category_id = '${categoryId}'`;
```

Олон бичгийн системийн full-text хайлтад (FR-PUB-014, SEQ-003) Postgres `plainto_tsquery()` нь `.textSearch()`-ээр дуудагддаг бөгөөд энэ нь мөн параметр болгогдсон байдаг:

```typescript
const { data } = await supabase
  .from('products')
  .select('*')
  .textSearch('name_en', cyrillicQuery, { type: 'plain' });
```

---

## 8. Файл Байршуулалтын Аюулгүй Байдал

**Лавлагаа:** FR-MEDIA-001 - FR-MEDIA-011, NFR-SEC-011

### 8.1 Хоёр Байршуулалтын Төрөл, Хоёр Bucket

| Байршуулалтын төрөл | Bucket | Зөвшөөрөгдсөн төрлүүд | Хамгийн их хэмжээ | Шаардлага |
|---|---|---|---|---|
| Бүтээгдэхүүний зургууд | `product-images` | `jpg`, `jpeg`, `png`, `webp` | 5MB/файл | FR-MEDIA-001/002 |
| 3D загварууд (GLB) | `model-assets` | `.glb`, `.gltf` | 10MB (Draco дараах зорилт ≤5MB) | FR-MEDIA-007/008 |

### 8.2 Шалгалтын Pipeline (NFR-SEC-011)

```
┌────────────────────────────────────────────────────────────────┐
│ 1. CLIENT (хөтч/React Native)                                     │
│    • Байршуулахаас өмнө файлын өргөтгөл + хэмжээ шалгана        │
│    • Зөвхөн UX — зохиомжтой multipart хүсэлтийг зогсоохгүй      │
└──────────────────────────┬─────────────────────────────────────┘
                             ▼
┌────────────────────────────────────────────────────────────────┐
│ 2. СЕРВЕР — Multer + дотоод fileFilter                            │
│    • MIME төрөл БА файлын өргөтгөл хоёуланг шалгана (NFR-SEC-011)│
│    • Хэмжээний хязгаарыг хэрэгжүүлнэ                            │
└──────────────────────────┬─────────────────────────────────────┘
                             ▼
┌────────────────────────────────────────────────────────────────┐
│ 3. СЕРВЕР — Файлын нэрийг цэвэрлэх + өвөрмөц зам (FR-MEDIA-009) │
│    • Зам дамжилтын тэмдэгтүүдийг хасна (../, /, \)              │
│    • UUID-д суурилсан хадгалалтын зам:                           │
│      product-images/{productId}/{uuid}.webp                       │
│      model-assets/{productId}/{uuid}.glb                          │
└──────────────────────────┬─────────────────────────────────────┘
                             ▼
┌────────────────────────────────────────────────────────────────┐
│ 4. SUPABASE STORAGE — bucket-ийн түвшний MIME зөвшөөрөгдсөн жагсаалт│
│    • Bucket тус бүр `allowed_mime_types` тохируулагдсан           │
│    • Аппликейшны кодоос тусдаа эцсийн буфер                      │
└────────────────────────────────────────────────────────────────┘
```

### 8.3 Хэрэгжүүлэлт

```typescript
// apps/api/src/plugins/upload.ts
import fp from 'fastify-plugin'
import multipart from '@fastify/multipart'
import { randomUUID } from 'crypto'
import path from 'path'
import { FastifyInstance } from 'fastify'

const IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MODEL_EXTENSIONS = ['.glb', '.gltf']
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp']

export default fp(async (fastify: FastifyInstance) => {
  await fastify.register(multipart, {
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB дээд хязгаар; route-д нарийн шалгалт хийнэ
    },
  })
})

export function validateImageFile(mimetype: string, filename: string): void {
  const ext = path.extname(filename).toLowerCase()
  if (!IMAGE_MIME_TYPES.includes(mimetype) || !IMAGE_EXTENSIONS.includes(ext)) {
    throw new Error('INVALID_FILE_TYPE')
  }
}

export function validateModelFile(filename: string): void {
  const ext = path.extname(filename).toLowerCase()
  if (!MODEL_EXTENSIONS.includes(ext)) {
    throw new Error('INVALID_FILE_TYPE')
  }
}

export function buildStoragePath(productId: string, originalName: string): string {
  const ext = path.extname(originalName).toLowerCase()
  return `${productId}/${randomUUID()}${ext}`
}
```

### 8.4 Яагаад MIME Төрөл БА Өргөтгөл Хоёулаа?

| Зөвхөн нэг шалгалт | Тойрч гарах техник |
|---|---|
| Зөвхөн өргөтгөл | `malware.php`-ийг `malware.jpg` болгон нэрлэнэ — өргөтгөл давна |
| Зөвхөн MIME төрөл | `Content-Type` нь клиентийн нийлүүлсэн бөгөөд тривиалаар хуурамчаар хийж болдог |
| **Хоёулаа, сервер талаас** | Халдагч өргөтгөл, MIME төрөл, бодит агуулга бүгдийг давахуулах ёстой — Storage файл ажиллуулдаггүйтэй хавсруулан үлдсэн эрсдэл маш бага |

---

## 9. IDOR Урьдчилан Сэргийлэлт

**Лавлагаа:** NFR-SEC-010, master plan §15

### 9.1 Ногоолинд IDOR Хэрхэн Харагддаг вэ

> Insecure Direct Object Reference: хэрэглэгч хүсэлтэд ID-г өөрчилж өөр хэрэглэгчийн өгөгдөлд хандана, учир нь backend нь *баталгаажуулалт*-ыг шалгадаг боловч *өмчлөл*-ийг биш.

Жишээ халдлага (Phase 5+ захиалгууд идэвхтэй болсон үед):

```
A хэрэглэгч нэвтэрсэн (хүчинтэй JWT).
GET /api/v1/orders/{B хэрэглэгчид харьяалагдах захиалгын ID}

❌ ЭМЗЭГ: "нэвтэрсэн үү?" → тийм → захиалга буцаана.
✅ ЗӨВ:    "нэвтэрсэн БА энэ захиалгыг эзэмшдэг үү?" → үгүй → 404.
```

### 9.2 Давхаргын Гүнзгийрсэн Аюулгүй Байдал: Хоёр Давхарга

| Давхарга | Механизм |
|---|---|
| Service давхарга (Fastify) | Бүх repository query-д тусгай `WHERE customer_id = req.user.id` |
| RLS (§6.11) | `orders_select_own_or_admin` policy: `customer_id = auth.uid() OR is_admin()` |

Service давхаргын query нь `customer_id` шүүлтүүрийг мартсан ч RLS нь мөрийг хааж зогсооно.

### 9.3 404 ба 403 — Мэдээлэл Задруулалт

Өмчлөл бүтэлгүй болсон хариулт нь **403 биш 404 буцаана** — тиймийн тул халдагч "энэ захиалга байхгүй" ба "энэ захиалга таных биш" гэдгийг ялгаж чадахгүй, ID enumeration-ийг сэргийлнэ:

```typescript
// apps/api/src/services/order.service.ts (ирээдүй, Phase 5)
async function getOrderForCustomer(orderId: string, customerId: string) {
  const order = await orderRepo.findById(orderId);
  if (!order || order.customer_id !== customerId) {
    throw new NotFoundError('Order not found'); // хоёр тохиолдолд ижил хариу
  }
  return order;
}
```

---

## 10. Аудит Бүртгэл

**Лавлагаа:** FR-AUD-001 - FR-AUD-005, UC-SYS-003

### 10.1 Юу Бүртгэгддэг вэ

| Өдөөгч | `action` утга | `entity_type` | `metadata` жишээ |
|---|---|---|---|
| Бүтээгдэхүүн үүсгэгдсэн | `PRODUCT_CREATE` | `product` | `{ name, status: 'draft' }` |
| Бүтээгдэхүүн нийтлэгдсэн | `PRODUCT_PUBLISH` | `product` | `{ from: 'draft', to: 'published' }` |
| Бүтээгдэхүүн архивлагдсан | `PRODUCT_ARCHIVE` | `product` | `{ from: 'published', to: 'archived' }` |
| Бүтээгдэхүүн бүрмөсөн устгагдсан | `PRODUCT_DELETE` | `product` | `{ name, hard: true }` |
| Ангилал үүсгэгдсэн | `CATEGORY_CREATE` | `category` | `{ name }` |
| Ангилал шинэчлэгдсэн | `CATEGORY_UPDATE` | `category` | `{ changed_fields }` |
| Ангилал идэвхгүй болгогдсон | `CATEGORY_DEACTIVATE` | `category` | `{ is_active: false }` |
| Бүтээгдэхүүний зураг байршуулагдсан | `IMAGE_UPLOAD` | `product_image` | `{ product_id, image_url }` |
| Бүтээгдэхүүний зураг устгагдсан | `IMAGE_DELETE` | `product_image` | `{ product_id, image_url }` |
| 3D загвар байршуулагдсан/солигдсон | `MODEL_UPLOAD` | `product` | `{ product_id, model_3d_url }` (SEQ-005) |
| 3D загвар устгагдсан | `MODEL_REMOVE` | `product` | `{ product_id }` |
| Хүсэлтийн статус өөрчлөгдсөн | `INQUIRY_STATUS_UPDATE` | `inquiry` | `{ from: 'new', to: 'contacted' }` |
| Хүргэлтийн товч өөрчлөгдсөн | `DELIVERY_TOGGLE` | `system_settings` | `{ from: false, to: true }` (FR-AUD-005) |
| Admin бус admin route руу оролдсон | `UNAUTHORIZED_ACCESS` | `route` | `{ attempted_route, user_id_or_null }` |
| Хэрэглэгчийн үүрэг өөрчлөгдсөн | `USER_ROLE_CHANGE` | `user` | `{ target_user_id, from: 'customer', to: 'admin' }` |

### 10.2 Бичих Цаг Хугацаа (UC-SYS-003)

```typescript
// apps/api/src/services/product.service.ts (хэсэг)
async function publishProduct(id: string, adminId: string) {
  const updated = await productRepo.update(id, { status: 'published' });

  // Аудит бичлэг нь үндсэн үйлдэл амжилттай болсны ДАРАА хийгдэнэ.
  // Аудит бичлэг бүтэлгүй болвол бүтээгдэхүүний шинэчлэлт буцаагдахгүй —
  // MVP-д хамгийн сайн оролдлогоор ажилладаг хяналтын хэрэгсэл.
  try {
    await auditLogRepo.log({
      admin_id: adminId,
      action: 'PRODUCT_PUBLISH',
      entity_type: 'product',
      entity_id: id,
      metadata: { to: 'published' },
    });
  } catch (err) {
    logger.error('Audit log write failed', { err, action: 'PRODUCT_PUBLISH', entity_id: id });
  }

  return updated;
}
```

### 10.3 Амжилтгүй Хандалтын Оролдлогууд (UC-ADM-011 Онцгой Урсгал)

```typescript
export async function requireAdmin(
  request: FastifyRequest,
  reply: FastifyReply
) {
  if (request.user?.role !== 'admin') {
    auditLogRepo.log({
      admin_id: request.user?.id ?? null,
      action: 'UNAUTHORIZED_ACCESS',
      entity_type: 'route',
      entity_id: null,
      metadata: { attempted_route: request.url, method: request.method },
    }).catch(() => {}) // fire-and-forget, 403 хариуг хэзээ ч хааж зогсоохгүй

    reply.code(403).send({ error: 'Admin access required', code: 'FORBIDDEN' })
  }
}
```

---

## 11. Нууц Мэдээлэл Удирдах

**Лавлагаа:** NFR-SEC-005, NFR-MAIN-008

### 11.1 Нууц Мэдээллийн Жагсаалт

| Нууц мэдээлэл | Ашиглагддаг газар | Хадгалах газар (үйлдвэрлэл) | Хадгалах газар (локал dev) |
|---|---|---|---|
| `SUPABASE_URL` | API, Вэб | Railway + Vercel env vars | `.env` (gitignored) |
| `SUPABASE_ANON_KEY` | Вэб, Мобайл, API | Vercel env vars, Railway env vars, Expo env vars (`app.config.ts` / EAS secrets) | `.env` / `.env.local` |
| `SUPABASE_SERVICE_ROLE_KEY` | Зөвхөн API — ямар ч клиентэд **хэзээ ч** илгээгдэхгүй | Railway env vars (зөвхөн сервер) | `.env` (gitignored, **хэзээ ч** commit хийгдэхгүй) |
| `GOOGLE_OAUTH_CLIENT_ID` / `SECRET` | Supabase Auth тохиргоо | Supabase dashboard (апп код биш) | Supabase dashboard |
| `FACEBOOK_OAUTH_APP_ID` / `SECRET` (S) | Supabase Auth тохиргоо | Supabase dashboard | Supabase dashboard |
| `CLOUDFLARE_API_TOKEN` | CI/CD (DNS/cache purge) | GitHub Actions secrets | Байхгүй |
| `RAILWAY_TOKEN` | GitHub Actions (`api-deploy.yml`) | GitHub Actions secrets | Байхгүй |
| `VERCEL_TOKEN` | GitHub Actions (`web-deploy.yml`) | GitHub Actions secrets | Байхгүй |

### 11.2 Дүрмүүд (NFR-SEC-005)

1. **Нууц мэдээлэл хэзээ ч эх кодод гарахгүй**, тест fixture, seed script, баримт бичгийн жишээнд ч орохгүй (энэ баримт бичиг болон `06-api-spec.yaml`-ийн бүх жишээнүүд `xxxx.supabase.co` зэрэг placeholder утгуудыг ашигладаг).
2. `.env.example` (NFR-MAIN-008) нь шинэ нууц мэдээлэл нэмэгдэх бүрт шинэчлэгдэх ёстой — PR-ийн Definition of Done зүйл.
3. `SUPABASE_SERVICE_ROLE_KEY` нь хамгийн мэдрэмжтэй нууц мэдээлэл — RLS-ийг бүрэн тойрдог (§6.2). Хэзээ ч ашиглагдахгүй:
   - Next.js клиентийн bundle-д (`NEXT_PUBLIC_` угтвар шаардагдана)
   - Мобайл апп build-д (EAS Build)
   - API-г байршуулахгүй GitHub Actions алхамд
4. `.gitignore` нь эхнээс `.env`, `.env.local`, `.env.*.local`-ийг агуулна.
5. Нууц мэдээлэл санамсаргүйгээр commit хийгдвэл: **тэр дороо харгалзах dashboard-д сэлгэнэ** — `git history` дахин бичих дангаараа хангалтгүй.

### 11.3 Мэдээллийн Сангийн Нөөц Хуулбар (NFR-REL-006)

Supabase-ийн автомат өдөр тутмын нөөц хуулбар төсөл үүсгэхдээ идэвхжүүлэгддэг. PITR нь үнэгүй/starter tier дээр боломжгүй байж болно — MVP-ийн хүлээн зөвшөөрсөн эрсдэл (NFR-REL-006 нь **S** чухалчлалтай). Phase 6+-д гараар `pg_dump` экспорт хийх тооцоологдоно.

---

## 12. Аюулын Загварын Хураангуй

**Лавлагаа:** Master plan §15, NFR-SEC-001 - NFR-SEC-013

| Аюул | Хэрэглэгдсэн хамгаалалт | Давхарга(ууд) | Үлдсэн эрсдэл (MVP) |
|---|---|---|---|
| DDoS / хэмжээний халдлага | Cloudflare | 1 | Бага — үнэгүй tier нь түгээмэл тохиолдлуудыг даана |
| SQL injection | Supabase query builder, raw SQL байхгүй | 4 | Маш бага — raw SQL байгуулдаг кодын зам байхгүй |
| XSS (бүтээгдэхүүний markdown агуулгаар) | Next.js-ийн `rehype-sanitize` | Апп давхарга | Дунд зэрэг — admin зохиосон агуулга итгэмжлэгдсэн; санитаци нь гүнзгийрсэн аюулгүй байдлыг хангана |
| CSRF | `SameSite` cookie + CORS зөвшөөрөгдсөн жагсаалт | 2 | Бага |
| Хэт олон нэвтрэх оролдлого | `authLimiter` (5/15мин) + Supabase Auth хаалт | 1, 2 | Бага |
| Хүсэлтийн spam | `inquiryLimiter` (3/цаг) + Cloudflare Bot Fight Mode | 1, 2 | Дунд зэрэг — эргэлдэгч IP-ууд хийж болно; MVP-д хүлээн зөвшөөрөгдсөн |
| IDOR (ирээдүйн захиалгууд) | Service давхаргын өмчлөлийн шалгалт + RLS | 3, 4 | Бага — идэвхжүүлэлтийн өмнө бүрэн загварчлагдсан (§9) |
| Эрх дээшлүүлэлт (customer → admin) | Өөрөө үйлчлэх үүргийн API байхгүй; `is_admin()` хаалт | 3, 4 | Бага |
| Хортой файл байршуулалт | MIME+өргөтгөлийн шалгалт, Storage-оор зөвхөн үйлчлэх, сервер ажиллуулахгүй | 2 | Бага |
| JWT хулгай (XSS эсвэл төхөөрөмжийн эвдрэл) | httpOnly cookie (вэб), 15 минутын дуусалт, refresh сэлгэлт | 3 | Дунд зэрэг — 15 минутын цонх хүлээн зөвшөөрөгдсөн; httpOnly нь JS-д суурилсан чирэлтийг сэргийлнэ |
| Аудит бүртгэлийн өөрчлөлт | Ямар ч үүрэгт UPDATE/DELETE policy байхгүй | 4 | Маш бага |
| Нууц мэдээлэл алдагдах | `.gitignore`, зөвхөн env-var, service_role нь API-д хязгаарлагдсан | Байхгүй | Бага, хөгжүүлэгчийн сахилга батаас хамаарна (§11.2) |
| `delivery_enabled` тойрч гарах | Service давхаргад шалгагдсан (UC-SYS-002) БА `orders`-ийн RLS өмчлөл | 3, 4 | Бага — хоёр хаалттай |

### 12.1 Тодорхой Хүлээн Зөвшөөрсөн Эрсдэлүүд (Нэг Хөгжүүлэгчийн MVP)

Эдгээрийг баримтлагдсан, алгасаагүй:

- **Cloudflare-ийн удирдагдсан дүрмийн цуглуулгаас гадна WAF дүрэм зохиохгүй** — дотоод WAF дүрмүүд Cloudflare-ийн төлбөртэй план шаарддаг; удирдагдсан дүрмүүд MVP трафикт OWASP Top 10 хэлбэрийг хангалттай хамрана.
- **Дотор санах ойн rate limiting** (§4.3) — нэг Railway instance-д хүлээн зөвшөөрөгдөнө; хэвтээ өргөтгөл шаардагдвал (NFR-SCA-001) дахин авч үзнэ.
- **SIEM / төвлөрсөн аюулгүй байдлын хяналт байхгүй** — Railway + Vercel + Supabase dashboard-ууд нь хяналтын гадаргуу болно.
- **Автоматжуулсан нэвтрэлтийн тест байхгүй** — §13-ийн эсрэг гараар хянах нь MVP-д орлодог; хүргэлтийн товч идэвхжүүлэхийн өмнө бодит гуравдагч тал аудит хийхийг авч үзнэ.

---

## 13. Нэвтрүүлэлтийн Өмнөх Аюулгүй Байдлын Шалгах Жагсаалт

**Лавлагаа:** Phase 6 ("Аюулгүй байдлын хяналт", master plan §29)

Анхны үйлдвэрлэлийн байршуулалтаас өмнө (`09-deployment_mn.md`) болон `delivery_enabled = true` болгохоос өмнө гараар гүйцэтгэнэ.

### 13.1 Дэд Бүтэц

- [ ] Cloudflare SSL/TLS горим **Full (Strict)** болгон тохируулагдсан
- [ ] Cloudflare "Always Use HTTPS" идэвхжүүлэгдсэн
- [ ] Cloudflare WAF Managed Ruleset идэвхжүүлэгдсэн
- [ ] Cloudflare Bot Fight Mode идэвхжүүлэгдсэн
- [ ] `/api/*` болон `/admin/*`-т cache bypass дүрмүүд идэвхтэй
- [ ] Supabase төслийн бүс Сингапур гэж батлагдсан

### 13.2 Аппликейшн

- [ ] `helmet()` глобалаар хэрэглэгдсэн; CSP заавар нь бодит Supabase Storage домэйнтэй харьцуулж шалгагдсан
- [ ] CORS `ALLOWED_ORIGINS` нь **зөвхөн** үйлдвэрлэлийн домэйнуудыг агуулна (`localhost` оруулгагүй)
- [ ] Гурван rate limiter (`general`, `auth`, `inquiry`) бүгд идэвхтэй бөгөөд `curl` loop-оор тестлэгдсэн; 429-ууд зөв босго дээр ажиллаж байгааг батлагдсан
- [ ] Бүх `/admin/*` route нь `requireAuth` + `requireAdmin` ашигладгийг батлагдсан (`06-api-spec.yaml`-тай харьцуулж шалгах — 13 admin зам)
- [ ] Zod схем бүр `POST`/`PATCH` body-д байгааг батлагдсан (§7.2 жагсаалт — 7 схем)

### 13.3 Мэдээллийн Сан (RLS)

- [ ] RLS нь 11 бүх хүснэгтэд **идэвхжүүлэгдсэн**:
      ```sql
      SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname='public';
      -- бүгд rowsecurity = true харуулах ёстой
      ```
- [ ] `is_admin()` функц байршуулагдсан бөгөөд `anon`, `authenticated`-д `EXECUTE` олгогдсон
- [ ] `anon`-ийн хувьд тест: `SELECT * FROM products WHERE status='draft'` → **0 мөр**
- [ ] Admin бус `authenticated`-ийн хувьд тест:
      `UPDATE system_settings SET value='true' WHERE key='delivery_enabled'`
      → RLS зөрчлөөр бүтэлгүй болох ёстой
- [ ] `audit_logs`-т **UPDATE/DELETE policy байхгүйг** батлагдсан:
      ```sql
      SELECT * FROM pg_policies WHERE tablename='audit_logs';
      -- admin-д зориулсан зөвхөн SELECT policy гарах ёстой
      ```
- [ ] Анхны admin бүртгэл шууд SQL/Supabase dashboard-аар bootstrap хийгдсэн (ямар ч API endpoint-ээр биш) — `09-deployment_mn.md`-г үзнэ үү

### 13.4 Нууц Мэдээлэл ба Тохиргоо

- [ ] `.env.example` нь §11.1-ийн бүх хувьсагчтай шинэчлэгдсэн
- [ ] `SUPABASE_SERVICE_ROLE_KEY`-ийн дараах газруудад **байхгүйг** батлагдсан:
  - [ ] Next.js клиентийн bundle (build гаралтад `grep` хийнэ)
  - [ ] Мобайл APK/IPA build artifact-ууд (EAS Build)
  - [ ] Ямар нэгэн `NEXT_PUBLIC_*` хувьсагч
- [ ] Хөгжүүлэлтийн явцад туршилтын утгуудтай ашиглагдсан бол бүх нууц мэдээлэл сэлгэгдсэн
- [ ] GitHub Actions secrets нь гурван workflow-д тохируулагдсан (`web-deploy.yml`, `api-deploy.yml`, `mobile-build.yml`)

### 13.5 Файл Байршуулалт

- [ ] Supabase Storage bucket `product-images`: MIME зөвшөөрөгдсөн жагсаалт тохируулагдсан (jpg/jpeg/png/webp), нийтэд унших, зөвхөн admin бичих
- [ ] Supabase Storage bucket `model-assets`: өргөтгөлийн зөвшөөрөгдсөн жагсаалт (.glb/.gltf), нийтэд унших, зөвхөн admin бичих
- [ ] `.jpg` өргөтгөлтэй нэрлэгдсэн `.php` файл байршуулах тест → 2-р давхаргад (Multer fileFilter) татгалзагдсан

### 13.6 Хүргэлт Асаахаас Өмнө (`delivery_enabled = true`)

- [ ] `orders`, `order_items`, `delivery_assignments`-ийн RLS policy-ууд §6.11-ийн эсрэг дахин шалгагдсан (анхны миграцаас хойш өөрчлөлт ороогүй)
- [ ] `POST /orders` нь `delivery_enabled = false` байх үед `403 DELIVERY_DISABLED` буцаадгийг батлагдсан (UC-SYS-002)
- [ ] `DELIVERY_TOGGLE` аудит бүртгэлийн мөрүүд хоёр чиглэлд (асаах болон унтраах) зөв ажиллаж байгааг батлагдсан
- [ ] IDOR тест: A хэрэглэгч B хэрэглэгчийн захиалгыг `GET /orders/me`-ээр эсвэл захиалгын ID-г таахаар авч чадахгүй

---

*Өмнөх баримт бичиг: [`docs/phase-0/06-api-spec.yaml`](06-api-spec.yaml)*
*Дараагийн баримт бичиг: [`docs/phase-0/09-deployment_mn.md`](./09-deployment_mn.md)*
