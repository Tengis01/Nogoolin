-- ============================================================
-- 0003 seed_system_settings — FR-SET-002
-- delivery_enabled defaults to FALSE and stays false until business
-- operations are ready (delivery toggle principle, NFR-SCA-003).
-- Idempotent: safe on re-run environments.
-- ============================================================

insert into public.system_settings (key, value, updated_at)
values ('delivery_enabled', 'false'::jsonb, now())
on conflict (key) do nothing;
