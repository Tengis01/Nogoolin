# @nogoolin/validation-schemas

Web, API, mobile гурвын хуваалцдаг Zod validation schema-ийн package (`package.json`: «single source of truth»). Client тал дээрх шалгалт нь зөвхөн UX-д зориулагдсан; API нь client шалгасан эсэхээс үл хамааран хүсэлт бүрийг дахин шалгана (`src/index.ts`, docs/phase-0/08 §7.1).

Хэрэглэдэг газар: `backend/api`, `apps/web`, `apps/mobile` (`"@nogoolin/validation-schemas": "workspace:*"`).

## Import

```typescript
import { inquiryInputSchema } from '@nogoolin/validation-schemas';

const result = inquiryInputSchema.safeParse({ customer_name: 'Тэмцээ', phone: '88123456' });
if (!result.success) console.log(result.error.issues);
```

## Гол schema

| Export | Юуг шалгадаг | Дүрэм |
|---|---|---|
| `phoneSchema` | Утасны дугаар | Яг 8 цифр, `^\d{8}$` (D-10); `+976`, зай, зураас хүлээн авахгүй |
| `slugSchema` | URL slug | 1–120 тэмдэгт, жижиг латин үсэг ба цифр, `-`-ээр тусгаарлана |
| `uuidSchema`, `idParamsSchema`, `productImageParamsSchema`, `cartItemParamsSchema` | Path параметр | UUID биш ID нь `400` болно, Postgres-ийн `500` биш |
| `userRoleSchema`, `productStatusSchema`, `inquiryStatusSchema` г.м. | Enum | Postgres enum-ийг давтана (`supabase/migrations`) |
| `inquiryInputSchema` | `POST /inquiries` body | `customer_name` ≥ 2 тэмдэгт, `phone` = `phoneSchema`, `message` сонголтот, `product_id` UUID эсвэл `null`, сонголтот; email байхгүй |
| `inquiryStatusPatchSchema` | `PATCH /admin/inquiries/:id/status` | Зөвхөн `status` (`new`, `contacted`, `closed`), илүү талбар хориотой (`strict`) |
| `adminInquiryListQuerySchema` | `GET /admin/inquiries` query | `page` ≥ 1 (1), `limit` 1–50 (12), `status`, `product_id`, `date_from`, `date_to` сонголтот |

## Шинэ schema нэмэх

1. `src/<name>.schema.ts` файл үүсгэж, хуваалцах дүрмийг (`phoneSchema`, `uuidSchema`, enum) `common.ts`-ээс import хийнэ.
2. `src/index.ts`-д `export * from './<name>.schema.js';` нэмнэ.
3. Enum нэмбэл Postgres enum-тай ижил байлгана.
4. `pnpm --filter @nogoolin/validation-schemas type-check` ажиллуулна. Package-д тест байхгүй (`test` script нь «no tests yet»).

> AI-ийн тусламжтай бичсэн (local Qwen 3.5 9B draft, хүн засаж кодтой тулгасан; ICSI438 Sem11 homework sprint).
