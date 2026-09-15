-- ============================================================
-- 0007 inquiry_customer_and_cart — Phase 4 (soft inquiry system)
--
-- 1. inquiries.customer_id — links an inquiry to the authenticated
--    submitter (NULL for guests, FR-INQ-001). Enables a customer to
--    read their OWN inquiries and the future "Inquiry history" task.
--    EXTENDS docs/04 §3.7 (no customer_id in the v1.0 ER diagram) and
--    docs/08 §6.10 (admin-only read) — owner-approved 2026-07-26; the
--    ER diagram + security doc should record this column + policy.
-- 2. cart_items — a simple per-user "save for later" list (Phase 4
--    "Wishlist / cart draft", roadmap §6). NOT an order: no quantity,
--    no price, no checkout. docs/04 has no cart entity — this is a new,
--    minimal single-table design (owner-approved 2026-07-26).
--
-- Grants are declared explicitly here because the current Supabase CLI
-- Postgres image does not auto-grant DML to anon/authenticated/service_role
-- on migration-created tables (see ERRORS.md 2026-07-19; 0006_table_grants
-- was applied manually and its file is empty). RLS remains the enforcement
-- layer — grants are only the ceiling.
--
-- Append-only rule (NFR-MAIN-007): never edit this file once applied.
-- ============================================================

-- ── inquiries.customer_id ───────────────────────────────────
alter table public.inquiries
  add column customer_id uuid references public.users (id) on delete set null;

comment on column public.inquiries.customer_id is
  'Authenticated submitter (FR-INQ-001); NULL for guest inquiries. Extends docs/04 §3.7.';

create index idx_inquiries_customer_id on public.inquiries (customer_id);

-- NFR-SEC-010: a customer reads only their OWN inquiries; admin still
-- reads all via the existing inquiries_select_admin policy. Guest rows
-- (customer_id IS NULL) are never returned to non-admins.
create policy "inquiries_select_own"
  on public.inquiries for select
  to authenticated
  using (customer_id = auth.uid());

-- Re-assert inquiries grants (the ceiling). Idempotent; makes the table
-- correct on a fresh `supabase db reset` despite the empty 0006 file.
grant insert on public.inquiries to anon;
grant select, insert, update on public.inquiries to authenticated;
grant select, insert, update, delete on public.inquiries to service_role;

-- ── cart_items (Phase 4 wishlist / cart draft) ──────────────
-- One row per (user, product). No quantity/price/status — this is a
-- save-for-later list, deliberately NOT the future orders/order_items
-- flow (which stays delivery-gated). Rows cascade-delete with the user
-- and with the product.
create table public.cart_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  product_id uuid not null references public.products (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, product_id)
);

create index idx_cart_items_user_id on public.cart_items (user_id);

alter table public.cart_items enable row level security;

-- A user manages ONLY their own saved items (NFR-SEC-010). No admin
-- policy: a private save-list is not part of the admin surface.
create policy "cart_items_select_own"
  on public.cart_items for select
  to authenticated
  using (user_id = auth.uid());

create policy "cart_items_insert_own"
  on public.cart_items for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "cart_items_delete_own"
  on public.cart_items for delete
  to authenticated
  using (user_id = auth.uid());

-- No UPDATE policy — a saved item has nothing mutable (add/remove only).

grant select, insert, delete on public.cart_items to authenticated;
grant select, insert, delete on public.cart_items to service_role;
