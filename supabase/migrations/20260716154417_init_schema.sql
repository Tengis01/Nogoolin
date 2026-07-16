-- ============================================================
-- 0001 init_schema — all 11 entities per docs/04-er-diagram.md
-- Enums, tables, FKs, indexes, updated_at trigger.
-- RLS is enabled + policies defined in the next migration.
-- Append-only rule (NFR-MAIN-007): never edit this file once applied.
-- ============================================================

-- ── Enums ───────────────────────────────────────────────────
create type public.user_role as enum ('customer', 'admin', 'delivery_staff');
create type public.product_status as enum ('draft', 'published', 'archived');
create type public.stock_status as enum ('in_stock', 'out_of_stock', 'pre_order');
create type public.media_type as enum ('image', 'video', 'model_3d');
create type public.inquiry_status as enum ('new', 'contacted', 'closed');
create type public.order_status as enum ('pending', 'confirmed', 'delivering', 'completed', 'cancelled');

-- ── updated_at helper ────────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ── users (04 §3.1) ─────────────────────────────────────────
-- id matches auth.users.id; rows created only by on_auth_user_created trigger
create table public.users (
  id uuid primary key references auth.users (id),
  email varchar not null unique,
  full_name varchar,
  role public.user_role not null default 'customer',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger users_set_updated_at
  before update on public.users
  for each row execute procedure public.set_updated_at();

-- ── categories (04 §3.2) ────────────────────────────────────
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name varchar not null,
  slug varchar not null unique,
  description text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger categories_set_updated_at
  before update on public.categories
  for each row execute procedure public.set_updated_at();

-- ── products (04 §3.3) ──────────────────────────────────────
create table public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories (id),
  name varchar not null,                 -- Cyrillic Mongolian name
  name_en varchar,                       -- English name (FR-PUB-013)
  slug varchar not null unique,
  price numeric not null,
  short_description text,
  full_description text,
  usage_instruction text,                -- markdown (FR-PROD-010)
  status public.product_status not null default 'draft',
  stock_status public.stock_status not null default 'in_stock',
  is_featured boolean not null default false,
  model_3d_url varchar,                  -- Supabase Storage GLB URL (FR-MEDIA-007)
  search_tags text[],                    -- Latin transliterations + tags (FR-PUB-013)
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger products_set_updated_at
  before update on public.products
  for each row execute procedure public.set_updated_at();

-- ── product_images (04 §3.4) ────────────────────────────────
create table public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  image_url varchar not null,
  alt_text varchar,                      -- NFR-SEO-009
  sort_order integer not null default 0, -- first image = primary (FR-MEDIA-005)
  created_at timestamptz not null default now()
);

-- ── media_assets (04 §3.5) — standalone, site-wide assets ──
create table public.media_assets (
  id uuid primary key default gen_random_uuid(),
  type public.media_type not null,
  url varchar not null,
  file_name varchar not null,
  size integer,                          -- bytes
  mime_type varchar,
  created_at timestamptz not null default now()
);

-- ── system_settings (04 §3.6) ───────────────────────────────
create table public.system_settings (
  key varchar primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);
create trigger system_settings_set_updated_at
  before update on public.system_settings
  for each row execute procedure public.set_updated_at();

-- ── inquiries (04 §3.7) ─────────────────────────────────────
create table public.inquiries (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products (id) on delete set null,
  customer_name varchar not null,
  phone varchar not null,
  message text,
  status public.inquiry_status not null default 'new',
  created_at timestamptz not null default now()
);

-- ── orders (04 §3.8 — W/future, created day one per NFR-SCA-003)
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.users (id),
  customer_name varchar not null,
  phone varchar not null,
  address text not null,
  status public.order_status not null default 'pending',
  total_amount numeric not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger orders_set_updated_at
  before update on public.orders
  for each row execute procedure public.set_updated_at();

-- ── order_items (04 §3.9 — W/future) ────────────────────────
create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  product_id uuid not null references public.products (id),
  quantity integer not null,
  unit_price numeric not null,           -- price snapshot at order time
  created_at timestamptz not null default now()
);

-- ── delivery_assignments (04 §3.10 — W/future) ──────────────
create table public.delivery_assignments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id),
  delivery_staff_id uuid not null references public.users (id),
  vehicle_info varchar,
  status varchar not null,
  assigned_at timestamptz not null default now(),
  completed_at timestamptz
);

-- ── audit_logs (04 §3.11 — append-only, FR-AUD-003) ─────────
create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid not null references public.users (id),
  action varchar not null,               -- e.g. DELIVERY_TOGGLE, PRODUCT_PUBLISH
  entity_type varchar not null,          -- e.g. product, system_settings
  entity_id uuid,
  metadata jsonb,                        -- e.g. { "from": false, "to": true }
  created_at timestamptz not null default now()
);

-- ── Indexes (04 §6) ─────────────────────────────────────────
-- Multi-script search (FR-PUB-014)
create index idx_products_search
  on public.products
  using gin (to_tsvector('simple', coalesce(name, '') || ' ' || coalesce(name_en, '')));

create index idx_products_search_tags
  on public.products using gin (search_tags);

-- Standard lookups (slug uniques already created by UNIQUE constraints)
create index idx_products_category on public.products (category_id);
create index idx_products_status on public.products (status);

-- Inquiry admin filtering (FR-INQ-006)
create index idx_inquiries_status on public.inquiries (status);
create index idx_inquiries_created_at on public.inquiries (created_at desc);

-- Audit log sorting (FR-AUD-004)
create index idx_audit_logs_created_at on public.audit_logs (created_at desc);

-- Future: order lookups
create index idx_orders_customer on public.orders (customer_id);
create index idx_orders_status on public.orders (status);
