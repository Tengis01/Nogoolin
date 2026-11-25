---
title: "Эхний хүсэлтээ илгээх: Nogoolin-ийн зорилтот урсгал"
type: tutorial
status: planned
---

> **Төлөвлөсөн урсгал.** Nogoolin-д одоогоор эхнээс нь дуустал бүрэн ажилладаг урсгал
> байхгүй. Энэ хуудас нь [UC-G-007](https://github.com/Tengis01/Nogoolin/blob/56b7c4eab4f5be154e70b091b5e1ed885057db81/docs/phase-0/03-use-cases.md#uc-g-007--submit-product-inquiry),
> README болон `56b7c4e` commit-ийн кодын бүтцэд тулгуурлаж, урсгал бүрэн болсон үед
> шинэ хэрэглэгч юу хийх ёстойг тайлбарлана. Командуудыг энэ хувилбар дээр эхнээс нь
> дуустал ажиллуулж шалгаагүй.

Энэ tutorial-ийн төгсгөлд таны компьютер дээр Nogoolin-ийн API ажиллаж, локал
database-д `new` төлөвтэй нэг inquiry (худалдан авах хүсэлт) үүссэн байх ёстой.
Нийт 8 алхамтай.

## Урьдчилсан шаардлага

Эхлэхээсээ өмнө доорх бүгдийг шалгана уу.

| Шаардлага | Хувилбар | Шалгах команд |
|---|---|---|
| Git | дурын | `git --version` |
| Node.js | 20 эсвэл түүнээс дээш | `node --version` |
| pnpm | 9.x (`packageManager: pnpm@9.15.0`) | `pnpm --version` |
| Docker | ажиллаж байгаа, таны хэрэглэгч эрхтэй | `docker info --format '{{.ServerVersion}}'` |
| curl | дурын | `curl --version` |

Мөн `3001`, `54321`–`54324` портууд чөлөөтэй байх ёстой. `docker info` нь
`permission denied` гэж хариулбал Docker-т хандах эрхээ эхлээд тохируулна уу.

## Алхмууд

### 1. Кодыг татаж, тайлбарласан хувилбар руу шилжих

```bash
git clone https://github.com/Tengis01/Nogoolin.git
cd Nogoolin
git checkout 56b7c4eab4f5be154e70b091b5e1ed885057db81
```

### 2. Dependency суулгах

```bash
pnpm install
```

### 3. Локал Supabase асаах

```bash
pnpm exec supabase start
```

Энэ команд Docker дээр Postgres, Auth, Storage, Studio-г асааж, `supabase/migrations/`
доторх migration-уудыг ажиллуулна. Төгсгөлд нь `anon key` болон `service_role key`
хэвлэгдэнэ.

### 4. Орчны хувьсагчийн файл үүсгэх

```bash
cp .env.example .env
```

`.env`-ийг нээж, 3-р алхмын гаралтаас хоёр утгыг хуулна:

```bash
SUPABASE_ANON_KEY=replace_with_anon_key_from_step_3
SUPABASE_SERVICE_ROLE_KEY=replace_with_service_role_key_from_step_3
```

`SUPABASE_SERVICE_ROLE_KEY` нь RLS-ийг тойрдог server-only түлхүүр. `.env`-ийг
git-д commit хийж болохгүй.

### 5. API асаах

API нь `.env`-ийг өөрөө уншдаггүй тул эхлээд shell-д ачаална:

```bash
set -a && source .env && set +a
pnpm dev:api
```

Тохиргоо дутуу бол API `Invalid environment configuration — ...` гэж ямар
хувьсагч дутсаныг хэлээд зогсох ёстой.

### 6. API амьд эсэхийг шалгах

Шинэ terminal нээгээд:

```bash
curl -s http://localhost:3001/api/v1/health
```

Хүлээгдэж буй хариу: `{"status":"ok", ...}`.

### 7. Эхний хүсэлтээ илгээх

```bash
curl -i -X POST http://localhost:3001/api/v1/inquiries \
  -H 'Content-Type: application/json' \
  -d '{"customer_name":"Тест хэрэглэгч","phone":"99112233","message":"Ногоон Дарь эх байгаа юу?"}'
```

Хүлээгдэж буй хариу нь `201 Created` бөгөөд body-д `"status":"new"` болон шинэ `id`
байна. Төлөвлөгөөгөөр нэг IP-аас цагт 3 хүсэлт илгээх хязгаартай; хэтэрвэл
`429 RATE_LIMIT_EXCEEDED` ирнэ.

### 8. Үр дүнгээ database-аас харах

Browser-оор <http://127.0.0.1:54323> (Supabase Studio) нээж, **Table Editor →
inquiries** хүснэгтийг сонгоно. 7-р алхмын `id`-тай, `status = new` мөр харагдах ёстой.

## Та юу хийсэн бэ

Зорилтот урсгалаар бол та Nogoolin-ийн backend-ийг (Postgres, Auth, API) локал асааж,
зочин хэрэглэгчийн нэрээр inquiry үүсгэнэ. Энэ мөр дараагийн how-to-нуудын эхлэл болно.

## Дараагийн алхам

- [Шинэ хүсэлтийг хариуцаж хаах](../how-to/handle-inquiry.md)
- [Бүтээгдэхүүнийг каталогт нийтлэх](../how-to/publish-product.md)
- [Public API reference](../../api/public-api.md#post-inquiries)
