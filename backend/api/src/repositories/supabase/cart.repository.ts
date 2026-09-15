import type { SupabaseClient } from '@supabase/supabase-js';
import type { CartItem, StockStatus } from '@nogoolin/validation-schemas';
import type { CartRepository } from '../types.js';

// Cart item + a compact product summary (with its primary image) for
// rendering the save-for-later list.
const SELECT_WITH_PRODUCT =
  '*, product:products(id, name, name_en, slug, price, stock_status, status, images:product_images(image_url, sort_order))';

interface ProductImageRow {
  image_url: string;
  sort_order: number;
}

// Shape a joined row into the CartItem contract; the primary image is the
// product image with the lowest sort_order (FR-MEDIA-005).
function mapRow(row: Record<string, unknown>): CartItem {
  const p = row['product'] as Record<string, unknown> | null;
  let product: CartItem['product'] = null;
  if (p) {
    const images = (p['images'] as ProductImageRow[] | null) ?? [];
    const primary = [...images].sort((a, b) => a.sort_order - b.sort_order)[0];
    product = {
      id: p['id'] as string,
      name: p['name'] as string,
      name_en: (p['name_en'] as string | null) ?? null,
      slug: p['slug'] as string,
      price: Number(p['price']),
      stock_status: p['stock_status'] as StockStatus,
      status: p['status'] as string,
      image_url: primary?.image_url ?? null,
    };
  }
  return {
    id: row['id'] as string,
    user_id: row['user_id'] as string,
    product_id: row['product_id'] as string,
    created_at: row['created_at'] as string,
    product,
  };
}

export function createSupabaseCartRepository(client: SupabaseClient): CartRepository {
  return {
    async listByUser(userId) {
      const { data, error } = await client
        .from('cart_items')
        .select(SELECT_WITH_PRODUCT)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (error) throw new Error(`cart list failed: ${error.message}`);
      return (data as Record<string, unknown>[]).map(mapRow);
    },

    async add(userId, productId) {
      // Idempotent (UNIQUE(user_id, product_id)): return the existing row
      // rather than erroring, so "add" is safe to call repeatedly.
      const existing = await client
        .from('cart_items')
        .select(SELECT_WITH_PRODUCT)
        .eq('user_id', userId)
        .eq('product_id', productId)
        .maybeSingle();
      if (existing.error) throw new Error(`cart lookup failed: ${existing.error.message}`);
      if (existing.data) return mapRow(existing.data as Record<string, unknown>);

      const { data, error } = await client
        .from('cart_items')
        .insert({ user_id: userId, product_id: productId })
        .select(SELECT_WITH_PRODUCT)
        .single();
      if (error) {
        // Lost a race on the UNIQUE constraint — re-read the winning row.
        if (error.code === '23505') {
          const retry = await client
            .from('cart_items')
            .select(SELECT_WITH_PRODUCT)
            .eq('user_id', userId)
            .eq('product_id', productId)
            .single();
          if (retry.error) throw new Error(`cart add failed: ${retry.error.message}`);
          return mapRow(retry.data as Record<string, unknown>);
        }
        throw new Error(`cart add failed: ${error.message}`);
      }
      return mapRow(data as Record<string, unknown>);
    },

    async remove(userId, productId) {
      const { data, error } = await client
        .from('cart_items')
        .delete()
        .eq('user_id', userId)
        .eq('product_id', productId)
        .select('id');
      if (error) throw new Error(`cart remove failed: ${error.message}`);
      return (data?.length ?? 0) > 0;
    },
  };
}
