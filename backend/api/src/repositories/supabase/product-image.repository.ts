import type { SupabaseClient } from '@supabase/supabase-js';
import type { ProductImage } from '@nogoolin/validation-schemas';
import type { ProductImageRepository } from '../types.js';

// Admin-only writes (service_role after requireAdmin) — see
// category.repository.ts for the client-role rationale.
export function createSupabaseProductImageRepository(
  writeClient: SupabaseClient,
): ProductImageRepository {
  return {
    async findById(productId, imageId) {
      const { data, error } = await writeClient
        .from('product_images')
        .select('*')
        .eq('id', imageId)
        .eq('product_id', productId)
        .maybeSingle();
      if (error) throw new Error(`image lookup failed: ${error.message}`);
      return (data as ProductImage) ?? null;
    },

    async nextSortOrder(productId) {
      const { data, error } = await writeClient
        .from('product_images')
        .select('sort_order')
        .eq('product_id', productId)
        .order('sort_order', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw new Error(`sort order lookup failed: ${error.message}`);
      return data ? (data.sort_order as number) + 1 : 0;
    },

    async insert(record) {
      const { data, error } = await writeClient
        .from('product_images')
        .insert(record)
        .select('*')
        .single();
      if (error) throw new Error(`image insert failed: ${error.message}`);
      return data as ProductImage;
    },

    async update(imageId, patch) {
      const { data, error } = await writeClient
        .from('product_images')
        .update(patch)
        .eq('id', imageId)
        .select('*')
        .single();
      if (error) throw new Error(`image update failed: ${error.message}`);
      return data as ProductImage;
    },

    async delete(imageId) {
      const { error } = await writeClient
        .from('product_images')
        .delete()
        .eq('id', imageId);
      if (error) throw new Error(`image delete failed: ${error.message}`);
    },
  };
}
