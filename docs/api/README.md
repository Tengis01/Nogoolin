# API documentation

| Баримт | Агуулга | Төлөв |
|---|---|---|
| [public-api.md](public-api.md) | Admin биш 11 route-ийн reference (эх: ICSI438 Sem7) | planned урсгал, `56b7c4e`-ийн кодтой тулгасан |
| [openapi.yaml](openapi.yaml) | OpenAPI 3.0.3, хэрэгжсэн 5 operation (эх: ICSI438 Sem5) | draft |
| Code reference (TypeDoc) | `backend/api/src/services`-ийн JSDoc; `pnpm run docs`-ийн site-д «Modules» хэсэг | автоматаар үүснэ |
| [Phase 0 OpenAPI](../phase-0/06-api-spec.yaml) | Анхны бүрэн contract | legacy |

`openapi.yaml`, `public-api.md`-ийг 2026-11-24-нд M9-ийн хүрээнд ICSI438-аас ([`c83be9e`](https://gitlab.com/Tengis01/icsi438-nogoolin/-/tree/c83be9e)) хуулсан.

W5-д `/cart`, `/inquiries/mine`, inquiry `customer_id`, admin filter-ийг [бодит controller](../../backend/api/src/controllers/inquiry.controller.ts), [cart controller](../../backend/api/src/controllers/cart.controller.ts), shared schemas-тай нийцүүлнэ. [SDD §5](../architecture/sdd-template.md#5-интерфэйс-ба-ажиллах-урсгал)-д зөрүү бий. Энэ нь төлөвлөгөө; contract-ийг шинэчилсэн гэж үзэхгүй.
