-- ============================================================
-- 0008 explicit_table_grants — least-privilege table grants for the
-- API roles (C1 / NFR-SEC-350, audit QA-05).
--
-- Why: 20260719104500_table_grants.sql was left empty, so table access
-- depended on platform default privileges. Older stacks granted ALL on new
-- public tables to anon/authenticated/service_role. That let a customer run
-- `update users set role = 'admin'` on their own row through supabase-js,
-- because `users_update_own` does not restrict columns. Newer stacks grant no
-- DML at all, so a fresh reset broke the app. Grants are now explicit and do
-- not depend on platform defaults. RLS policies are unchanged and still
-- decide which ROWS each role sees.
--
-- Access paths (2026-10-30):
--   * web/mobile clients use supabase-js directly only for public.users
--     (read own row, update full_name);
--   * the API reads the public catalog with the anon key and does every
--     write with service_role after requireAuth/requireAdmin.
-- Append-only (NFR-MAINT-220): never edit this file once applied.
-- ============================================================

-- Start from a known state, whatever the platform defaults were.
revoke all on all tables in schema public from anon, authenticated, service_role;

-- users: own-row read (RLS), only full_name is client-writable.
-- Role/email changes go through service_role (API) only.
grant select on public.users to authenticated;
grant update (full_name) on public.users to authenticated;
grant select, update on public.users to service_role;

-- Public catalog: read for everyone (RLS: active/published only);
-- writes only through the API (service_role after requireAdmin).
grant select on public.categories, public.products, public.product_images,
  public.media_assets, public.system_settings to anon, authenticated;
grant select, insert, update, delete on public.categories, public.products,
  public.product_images, public.media_assets to service_role;
grant select, update on public.system_settings to service_role;

-- inquiries + cart_items: same grants as 20260726120000 (restated so the
-- revoke above does not change behavior).
grant insert on public.inquiries to anon;
grant select, insert, update on public.inquiries to authenticated;
grant select, insert, update, delete on public.inquiries to service_role;
grant select, insert, delete on public.cart_items to authenticated;
grant select, insert, delete on public.cart_items to service_role;

-- audit_logs: append-only for everyone, including service_role
-- (FR-AUD-130); admin reads go through the API.
grant select, insert on public.audit_logs to service_role;

-- orders, order_items, delivery_assignments: no grants while
-- delivery_enabled = false (ADR-002, FR-SET-220). The order feature adds
-- its own grants in a later migration when it is built.
