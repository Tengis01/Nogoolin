-- ============================================================
-- 0005 storage_policies — docs/09-deployment.md §4.7
-- Buckets themselves are declared in supabase/config.toml
-- ([storage.buckets.*], created by the CLI). Policies: public read,
-- admin-only write/delete. The API uploads via service_role (bypasses
-- these) — they protect direct-to-Supabase clients.
-- ============================================================

-- product-images: public read, admin write only
create policy "product_images_public_read"
  on storage.objects for select
  to public
  using (bucket_id = 'product-images');

create policy "product_images_admin_write"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'product-images' and public.is_admin());

create policy "product_images_admin_delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'product-images' and public.is_admin());

-- model-assets: public read, admin write only
create policy "model_assets_public_read"
  on storage.objects for select
  to public
  using (bucket_id = 'model-assets');

create policy "model_assets_admin_write"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'model-assets' and public.is_admin());

create policy "model_assets_admin_delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'model-assets' and public.is_admin());
