-- ============================================================
-- 0002 rls_policies — per docs/08-security.md §6 (Layer 4)
-- RLS enabled on ALL 11 tables (NFR-SEC-008), including future
-- order tables (NFR-SCA-003). Policies reference auth.uid().
-- audit_logs: append-only enforced by ABSENCE of UPDATE/DELETE
-- policies (default-deny). Never edit this file once applied.
-- ============================================================

-- ── Helper: is_admin() (08 §6.3) ────────────────────────────
-- SECURITY DEFINER breaks the RLS recursion cycle on public.users.
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.users
    where id = auth.uid() and role = 'admin'
  );
$$;

grant execute on function public.is_admin() to authenticated, anon;

-- ── Trigger: on_auth_user_created (08 §6.4, 09 §4.8, UC-SYS-001)
-- Auto-creates public.users row on Supabase Auth sign-up.
-- SECURITY DEFINER: runs before the user has a session — one of the
-- two legitimate RLS bypasses (the other: service_role audit writes).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, email, full_name, role, created_at, updated_at)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    'customer',
    now(),
    now()
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ── users (08 §6.4) ─────────────────────────────────────────
alter table public.users enable row level security;

-- FR-USER-005: a user reads only their own profile; admin reads all
create policy "users_select_own_or_admin"
  on public.users for select
  to authenticated
  using (id = auth.uid() or is_admin());

-- FR-USER-002: user updates own row (column restriction to full_name
-- is enforced by Zod at the API layer, not RLS)
create policy "users_update_own"
  on public.users for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

-- FR-USER-004: only admin can change a user's role
create policy "users_update_role_admin_only"
  on public.users for update
  to authenticated
  using (is_admin())
  with check (is_admin());

-- No INSERT policy (trigger only); no DELETE policy (out of MVP scope).

-- ── categories (08 §6.5) ────────────────────────────────────
alter table public.categories enable row level security;

-- FR-CAT-007, FR-PUB-005: anyone reads active categories
create policy "categories_select_active"
  on public.categories for select
  to anon, authenticated
  using (is_active = true or is_admin());

create policy "categories_admin_all"
  on public.categories for all
  to authenticated
  using (is_admin())
  with check (is_admin());

-- ── products (08 §6.6) ──────────────────────────────────────
alter table public.products enable row level security;

-- FR-PROD-004: only published products visible to guests/customers
create policy "products_select_published"
  on public.products for select
  to anon, authenticated
  using (status = 'published' or is_admin());

create policy "products_admin_all"
  on public.products for all
  to authenticated
  using (is_admin())
  with check (is_admin());

-- ── product_images (08 §6.7) ────────────────────────────────
alter table public.product_images enable row level security;

-- Visible if parent product is published (or caller is admin)
create policy "product_images_select_via_product"
  on public.product_images for select
  to anon, authenticated
  using (
    is_admin()
    or exists (
      select 1 from public.products p
      where p.id = product_images.product_id and p.status = 'published'
    )
  );

create policy "product_images_admin_all"
  on public.product_images for all
  to authenticated
  using (is_admin())
  with check (is_admin());

-- ── media_assets (08 §6.8) ──────────────────────────────────
alter table public.media_assets enable row level security;

-- Publicly readable — needed by the unauthenticated 3D intro (FR-3D-001)
create policy "media_assets_select_all"
  on public.media_assets for select
  to anon, authenticated
  using (true);

create policy "media_assets_admin_all"
  on public.media_assets for all
  to authenticated
  using (is_admin())
  with check (is_admin());

-- ── system_settings (08 §6.9) ───────────────────────────────
alter table public.system_settings enable row level security;

-- FR-PUB-009: delivery_enabled readable by the public settings endpoint
create policy "system_settings_select_all"
  on public.system_settings for select
  to anon, authenticated
  using (true);

-- FR-SET-003: only admin updates settings
create policy "system_settings_update_admin"
  on public.system_settings for update
  to authenticated
  using (is_admin())
  with check (is_admin());

-- No INSERT/DELETE — rows seeded once via migration, only ever updated.

-- ── inquiries (08 §6.10) ────────────────────────────────────
alter table public.inquiries enable row level security;

-- FR-INQ-001: guests submit without auth; FR-INQ-003: always status='new'.
-- The 3/IP/hour limit is Layer 2 (@fastify/rate-limit), not RLS.
create policy "inquiries_insert_anyone"
  on public.inquiries for insert
  to anon, authenticated
  with check (status = 'new');

-- UC-ADM-009: only admin views the inquiry inbox
create policy "inquiries_select_admin"
  on public.inquiries for select
  to authenticated
  using (is_admin());

-- UC-ADM-010: only admin updates inquiry status
create policy "inquiries_update_admin"
  on public.inquiries for update
  to authenticated
  using (is_admin())
  with check (is_admin());

-- No DELETE policy — inquiries retained for admin history.

-- ── orders (08 §6.11 — future, active policies from day one) ─
alter table public.orders enable row level security;

-- FR-ORD-007 / NFR-SEC-010: customer sees only own orders
create policy "orders_select_own_or_admin"
  on public.orders for select
  to authenticated
  using (customer_id = auth.uid() or is_admin());

-- FR-ORD-001: customer creates orders for themselves only.
-- delivery_enabled gate (FR-SET-004) is enforced at the SERVICE layer,
-- not here — RLS enforces ownership, service enforces feature activation.
create policy "orders_insert_own"
  on public.orders for insert
  to authenticated
  with check (customer_id = auth.uid());

-- FR-ORD-005: only admin updates order status
create policy "orders_update_admin"
  on public.orders for update
  to authenticated
  using (is_admin())
  with check (is_admin());

-- ── order_items (08 §6.11) ──────────────────────────────────
alter table public.order_items enable row level security;

create policy "order_items_select_via_order"
  on public.order_items for select
  to authenticated
  using (
    is_admin()
    or exists (
      select 1 from public.orders o
      where o.id = order_items.order_id and o.customer_id = auth.uid()
    )
  );

create policy "order_items_insert_via_order"
  on public.order_items for insert
  to authenticated
  with check (
    exists (
      select 1 from public.orders o
      where o.id = order_items.order_id and o.customer_id = auth.uid()
    )
  );

-- ── delivery_assignments (08 §6.11) ─────────────────────────
alter table public.delivery_assignments enable row level security;

-- Visible to the assigned staff member or admin
create policy "delivery_assignments_select_own_or_admin"
  on public.delivery_assignments for select
  to authenticated
  using (delivery_staff_id = auth.uid() or is_admin());

-- Only admin creates/updates assignments
create policy "delivery_assignments_admin_write"
  on public.delivery_assignments for all
  to authenticated
  using (is_admin())
  with check (is_admin());

-- ── audit_logs (08 §6.12 — append-only, FR-AUD-003) ─────────
alter table public.audit_logs enable row level security;

-- UC-ADM-012: only admin views the audit log
create policy "audit_logs_select_admin"
  on public.audit_logs for select
  to authenticated
  using (is_admin());

-- NO INSERT policy for authenticated/anon: writes happen exclusively via
-- service_role (bypasses RLS), from the Repository layer AFTER the primary
-- operation succeeds (UC-SYS-003).
-- NO UPDATE/DELETE policy for ANY role: append-only enforced by default-deny.
