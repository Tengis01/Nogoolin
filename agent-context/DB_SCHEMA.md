# DB Schema — Condensed Reference

> Condensed from `docs/04-er-diagram.md` (v1.0.0) + `docs/08-security.md` §6.
> 11 entities, all `uuid` PKs (IDOR mitigation), RLS enabled on ALL tables from
> the first migration. Future tables created day one, unused until
> `delivery_enabled=true`.

## Entities

| Table | Key fields | Notes |
|---|---|---|
| `users` | id (=auth.users.id), email UK, full_name, **role** | role: `customer` \| `admin` \| `delivery_staff`(future); rows created ONLY by `on_auth_user_created` trigger (SECURITY DEFINER); `guest` is not persisted |
| `categories` | id, name, slug UK, description, sort_order, is_active | deactivated (`is_active=false`) hidden from public |
| `products` | id, category_id FK, name (Cyrillic), **name_en**, slug UK, price, short_description, full_description, usage_instruction (markdown), **status**, **stock_status**, is_featured, model_3d_url, **search_tags** text[] | status: `draft`\|`published`\|`archived` (default draft); stock: `in_stock`\|`out_of_stock`\|`pre_order`; name_en + search_tags power multi-script search (FR-PUB-013/014) |
| `product_images` | id, product_id FK (CASCADE), image_url, alt_text, sort_order | first image (sort_order) = primary/thumbnail |
| `media_assets` | id, type, url, file_name, size, mime_type | standalone (no FK) — site-wide assets e.g. Green Tara intro GLB; type: `image`\|`video`\|`model_3d` |
| `system_settings` | **key** PK (varchar), value jsonb, updated_at | seed row: `delivery_enabled = false` |
| `inquiries` | id, product_id FK (nullable, SET NULL), customer_name, phone, message, **status** | status: `new`\|`contacted`\|`closed` (default new); nullable product_id allows general inquiries |
| `orders` *(future)* | id, customer_id FK→users, customer_name, phone, address, **status**, total_amount | status: `pending`\|`confirmed`\|`delivering`\|`completed`\|`cancelled` |
| `order_items` *(future)* | id, order_id FK (CASCADE), product_id FK, quantity, unit_price | unit_price = price snapshot at order time |
| `delivery_assignments` *(future)* | id, order_id FK, delivery_staff_id FK→users, vehicle_info, status, assigned_at, completed_at | staff role = `delivery_staff` |
| `audit_logs` | id, admin_id FK→users, action, entity_type, entity_id, metadata jsonb | **append-only** (no UPDATE/DELETE policies for any role); e.g. action=`DELIVERY_TOGGLE`, metadata=`{from:false,to:true}` |

## Relationships

| Relationship | Type | Notes |
|---|---|---|
| categories → products | 1:N | exactly one category per product (no junction table, FR-PROD-008) |
| products → product_images | 1:N | cascade delete |
| products → inquiries | 1:N optional | nullable FK, SET NULL on delete |
| products → order_items | 1:N | future |
| orders → order_items | 1:N | cascade delete, future |
| orders → delivery_assignments | 1:N | future |
| users → orders / delivery_assignments / audit_logs | 1:N | future / future / active |
| `media_assets`, `system_settings` | — | standalone, no FKs |

## RLS Policy Summary (docs/08-security.md §6.13)

Helper: `is_admin()` — SECURITY DEFINER fn checking `users.role='admin'` for
`auth.uid()` (avoids infinite RLS recursion on `users`).

| Table | anon SELECT | authenticated SELECT | INSERT | UPDATE | DELETE |
|---|---|---|---|---|---|
| `users` | — | own row, or admin (all) | trigger only | own row / admin (role) | — |
| `categories` | active only | active, or admin (all) | admin | admin | admin |
| `products` | published only | published, or admin (all) | admin | admin | admin |
| `product_images` | via published product | via published product, or admin | admin | admin | admin |
| `media_assets` | all | all | admin | admin | admin |
| `system_settings` | all | all | — (seeded) | admin | — |
| `inquiries` | — | admin only | anon + authenticated (`status='new'` enforced) | admin | — |
| `orders` *(future)* | — | own, or admin | own (`customer_id=auth.uid()`) | admin | — |
| `order_items` *(future)* | — | via own order, or admin | via own order | — | — |
| `delivery_assignments` *(future)* | — | own assignment, or admin | admin | admin | — |
| `audit_logs` | — | admin only | **service_role only** | **none** | **none** |

Key RLS facts:
- API forwards the user's JWT to Supabase (`authenticated` context) — RLS is
  enforced even for requests through the backend.
- `service_role` key bypasses RLS; legitimate uses ONLY: audit-log writes,
  `on_auth_user_created` trigger. Never in clients.
- `delivery_enabled` gate is enforced at the SERVICE layer, not RLS (deliberate:
  RLS = ownership, service = feature activation).
- Inquiry 3/IP/hour limit is Layer 2 (`@fastify/rate-limit`), not RLS.

## Indexes (docs/04 §6)

- GIN full-text on `to_tsvector('simple', name || ' ' || name_en)`; GIN on `search_tags`
- `products(category_id)`, `products(status)`, unique `products(slug)`, unique `categories(slug)`
- `inquiries(status)`, `inquiries(created_at DESC)`, `audit_logs(created_at DESC)`
- future: `orders(customer_id)`, `orders(status)`

Migrations: `database/migrations/`, numbered, **append-only** — never edit an
applied migration.
