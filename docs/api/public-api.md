---
title: "Public REST API Reference"
type: reference
status: planned
---

> **Зорилтот contract.** Nogoolin-д одоогоор эхнээс нь дуустал ажилладаг урсгал байхгүй.
> Энэ хуудас нь [06-api-spec](https://github.com/Tengis01/Nogoolin/blob/56b7c4eab4f5be154e70b091b5e1ed885057db81/docs/phase-0/06-api-spec.yaml) болон `56b7c4e`
> (2026-11-10) commit-ийн controller, Zod schema-д бичигдсэн contract-ыг тайлбарлана. Хариуг ажиллаж
> буй серверээс авч шалгаагүй.

Хамрах хүрээ: `/api/v1` доорх admin биш 11 route. Admin route-ууд
[Sem5 OpenAPI (Redoc)](https://icsi438-nogoolin-442a5f.gitlab.io/sem5/renderers/redoc.html)-д, service түвшний 44 symbol
[Sem6 TypeDoc](https://icsi438-nogoolin-442a5f.gitlab.io/sem6/reference/index.html)-д байна.

## Prerequisite шалгалт

Аль нэг endpoint дуудахаас өмнө доорх гурвыг шалгана.

| # | Шалгалт | Команд | Хүлээгдэж буй үр дүн |
|---|---|---|---|
| P1 | API асаалттай | `curl -s http://localhost:3001/api/v1/health` | `{"status":"ok",...}` |
| P2 | Base URL | — | `http://localhost:3001/api/v1` (локал) |
| P3 | Access token (🔒 route-д) | `curl -s -X POST 'http://127.0.0.1:54321/auth/v1/token?grant_type=password' -H "apikey: $SUPABASE_ANON_KEY" -H 'Content-Type: application/json' -d '{"email":"your_email@example.com","password":"your_password"}'` | JSON-д `access_token` |

🔒 тэмдэгтэй route-д `Authorization: Bearer <access_token>` header заавал байна.
Access token 15 минутын хугацаатай.

## Нийтлэг алдаа

Бүх алдаа `{ "error": string, "code": string }` хэлбэртэй. Validation алдаанд
нэмэлт `details` талбар ирнэ.

| HTTP | code | Хэзээ | Юу хийх |
|---|---|---|---|
| 400 | `VALIDATION_ERROR` | Body, query эсвэл path параметр schema-д таарахгүй (жишээ нь UUID биш ID) | `details`-аас талбарыг олж засна |
| 401 | `UNAUTHORIZED` | 🔒 route-д token байхгүй, хүчингүй эсвэл хугацаа дууссан | P3-аар шинэ token авна |
| 404 | `*_NOT_FOUND` | Slug эсвэл ID олдоогүй, эсвэл нийтлэгдээгүй | Slug/ID-аа шалгана |
| 429 | `RATE_LIMIT_EXCEEDED` | Ерөнхий хязгаар: 15 минутад 100 хүсэлт/IP | Хүлээгээд дахин илгээнэ |
| 500 | `INTERNAL` | Серверийн тодорхойгүй алдаа | Server log-ийг шалгана |

## GET /health

`GET /api/v1/health` → `200`

**Параметр:** байхгүй. **Буцаах утга:** `{ status: "ok", timestamp: string (ISO 8601), version: string }`.

| HTTP | code | Шалтгаан |
|---|---|---|
| 429 | `RATE_LIMIT_EXCEEDED` | Ерөнхий хязгаар |

**Ашигладаг заавар:** [Tutorial, алхам 6](../user-guide/tutorials/first-inquiry.md).
Эх: [health.controller.ts](https://github.com/Tengis01/Nogoolin/blob/56b7c4eab4f5be154e70b091b5e1ed885057db81/backend/api/src/controllers/health.controller.ts).

## GET /settings/public

`GET /api/v1/settings/public` → `200 { data: { delivery_enabled: boolean } }`

**Параметр:** байхгүй. Хүргэлтийн функц идэвхтэй эсэхийг client-д мэдэгдэнэ.

| HTTP | code | Шалтгаан |
|---|---|---|
| 429 | `RATE_LIMIT_EXCEEDED` | Ерөнхий хязгаар |

**Ашигладаг заавар:** одоогоор how-to байхгүй.
Эх: [settings.controller.ts](https://github.com/Tengis01/Nogoolin/blob/56b7c4eab4f5be154e70b091b5e1ed885057db81/backend/api/src/controllers/settings.controller.ts).

## GET /categories

`GET /api/v1/categories` → `200 { data: Category[] }` — идэвхтэй ангиллууд `sort_order`-оор.

**Параметр:** байхгүй. **Category:** `id, name, slug, description | null, sort_order, is_active, created_at, updated_at`.

| HTTP | code | Шалтгаан |
|---|---|---|
| 429 | `RATE_LIMIT_EXCEEDED` | Ерөнхий хязгаар |

**Ашигладаг заавар:** одоогоор how-to байхгүй.
Эх: [category.controller.ts](https://github.com/Tengis01/Nogoolin/blob/56b7c4eab4f5be154e70b091b5e1ed885057db81/backend/api/src/controllers/category.controller.ts).

## GET /categories/{slug}

`GET /api/v1/categories/{slug}` → `200 { data: Category }`

| Параметр | Байрлал | Төрөл | Заавал | Тайлбар |
|---|---|---|---|---|
| `slug` | path | string | тийм | Ангиллын URL нэр |

| HTTP | code | Шалтгаан |
|---|---|---|
| 404 | `CATEGORY_NOT_FOUND` | Ангилал байхгүй эсвэл идэвхгүй |

**Ашигладаг заавар:** одоогоор how-to байхгүй.

## GET /products

`GET /api/v1/products` → `200 { data: Product[], meta }` — зөвхөн нийтэлсэн бүтээгдэхүүн.

| Параметр | Байрлал | Төрөл | Заавал | Тайлбар |
|---|---|---|---|---|
| `page` | query | integer ≥ 1 | үгүй | Анхдагч 1 |
| `limit` | query | integer 1–50 | үгүй | Анхдагч 12 |
| `category_id` | query | UUID | үгүй | Ангиллаар шүүх |
| `category_slug` | query | slug | үгүй | Ангиллаар шүүх |
| `stock_status` | query | `in_stock` \| `out_of_stock` \| `pre_order` | үгүй | Нөөцөөр шүүх |
| `is_featured` | query | boolean | үгүй | Онцлох бүтээгдэхүүн |
| `search` | query | string ≤ 200 | үгүй | Кирилл, латин, англи хайлт |
| `sort` | query | `newest` \| `price_asc` \| `price_desc` | үгүй | Анхдагч `newest` |

| HTTP | code | Шалтгаан |
|---|---|---|
| 400 | `VALIDATION_ERROR` | Query параметр буруу |

**Ашигладаг заавар:** [Бүтээгдэхүүн нийтлэх](../user-guide/how-to/publish-product.md).
Эх: [product.controller.ts](https://github.com/Tengis01/Nogoolin/blob/56b7c4eab4f5be154e70b091b5e1ed885057db81/backend/api/src/controllers/product.controller.ts).

## GET /products/{slug}

`GET /api/v1/products/{slug}` → `200 { data: Product }` — зураг болон ангиллын хамт.

| Параметр | Байрлал | Төрөл | Заавал | Тайлбар |
|---|---|---|---|---|
| `slug` | path | string | тийм | Бүтээгдэхүүний URL нэр |

| HTTP | code | Шалтгаан |
|---|---|---|
| 404 | `PRODUCT_NOT_FOUND` | Байхгүй эсвэл `published` биш |

**Ашигладаг заавар:** [Бүтээгдэхүүн нийтлэх → Шалгах](../user-guide/how-to/publish-product.md),
[Зураг нэмэх](../user-guide/how-to/add-product-images.md).

## POST /inquiries

`POST /api/v1/inquiries` → `201 { data: Inquiry }` — зочин эсвэл нэвтэрсэн хэрэглэгч.

| Талбар | Төрөл | Заавал | Дүрэм |
|---|---|---|---|
| `customer_name` | string | тийм | ≥ 2 тэмдэгт |
| `phone` | string | тийм | `^\d{8}$` (яг 8 цифр) |
| `message` | string | үгүй | — |
| `product_id` | UUID \| null | үгүй | Өгвөл бүтээгдэхүүн байх ёстой |

Token өгвөл `customer_id` холбогдоно; өгөхгүй бол зочин (`customer_id: null`).
Буцаах `Inquiry`: `id, product_id, customer_id, customer_name, phone, message, status ("new"), created_at`.

| HTTP | code | Шалтгаан |
|---|---|---|
| 400 | `VALIDATION_ERROR` | Нэр богино эсвэл утасны формат буруу |
| 404 | `PRODUCT_NOT_FOUND` | `product_id` олдоогүй |
| 429 | `RATE_LIMIT_EXCEEDED` | Нэг IP-аас цагт 3-аас олон |

**Ашигладаг заавар:** [Tutorial, алхам 7](../user-guide/tutorials/first-inquiry.md),
[Хүсэлт хариуцах](../user-guide/how-to/handle-inquiry.md).
Эх: [inquiry.controller.ts](https://github.com/Tengis01/Nogoolin/blob/56b7c4eab4f5be154e70b091b5e1ed885057db81/backend/api/src/controllers/inquiry.controller.ts).
Тэмдэглэл: 2026-10-30-аас (D-10, `8efd908`) web form, API хоёулаа яг 8 цифр шаардана; `+976`, зай, зураас `400` буцаана.

## GET /inquiries/mine 🔒

`GET /api/v1/inquiries/mine` → `200 { data: Inquiry[] }` — зөвхөн өөрийн хүсэлтүүд.

| HTTP | code | Шалтгаан |
|---|---|---|
| 401 | `UNAUTHORIZED` | Token байхгүй эсвэл хүчингүй |

**Ашигладаг заавар:** одоогоор how-to байхгүй.

## GET /cart 🔒

`GET /api/v1/cart` → `200 { data: CartItem[] }` — «дараа үзэх» жагсаалт, шинэ нь эхэндээ.
Захиалга биш: тоо ширхэг, үнэ, checkout байхгүй.

**Legacy:** SRS v2.7 (D-14, 2026-11-08)-д wishlist-ийн шаардлага Won't болсон; `/cart` endpoint-ууд кодод хэвээр боловч цаашид хөгжүүлэхгүй.

| HTTP | code | Шалтгаан |
|---|---|---|
| 401 | `UNAUTHORIZED` | Token байхгүй эсвэл хүчингүй |

**Ашигладаг заавар:** одоогоор how-to байхгүй.
Эх: [cart.controller.ts](https://github.com/Tengis01/Nogoolin/blob/56b7c4eab4f5be154e70b091b5e1ed885057db81/backend/api/src/controllers/cart.controller.ts).

## POST /cart 🔒

`POST /api/v1/cart` → `201 { data: CartItem }` — давтан нэмэхэд давхардал үүсэхгүй.

| Талбар | Төрөл | Заавал | Дүрэм |
|---|---|---|---|
| `product_id` | UUID | тийм | Өөр талбар зөвшөөрөхгүй (`strict`) |

| HTTP | code | Шалтгаан |
|---|---|---|
| 400 | `VALIDATION_ERROR` | UUID биш эсвэл илүү талбартай |
| 401 | `UNAUTHORIZED` | Token байхгүй эсвэл хүчингүй |
| 404 | `PRODUCT_NOT_FOUND` | Байхгүй эсвэл нийтлэгдээгүй |

**Ашигладаг заавар:** одоогоор how-to байхгүй.

## DELETE /cart/{productId} 🔒

`DELETE /api/v1/cart/{productId}` → `204` — байхгүй зүйлийг устгахад ч `204`.

| Параметр | Байрлал | Төрөл | Заавал | Тайлбар |
|---|---|---|---|---|
| `productId` | path | UUID | тийм | Жагсаалтаас хасах бүтээгдэхүүн |

| HTTP | code | Шалтгаан |
|---|---|---|
| 400 | `VALIDATION_ERROR` | `productId` UUID биш |
| 401 | `UNAUTHORIZED` | Token байхгүй эсвэл хүчингүй |

**Ашигладаг заавар:** одоогоор how-to байхгүй.
