import type { SupabaseClient } from '@supabase/supabase-js';
import type { Category } from '@nogoolin/validation-schemas';
import type { CategoryRepository } from '../types.js';
import { dbError } from '../../lib/db-errors.js';

// Supabase implementation. `readClient` = anon (RLS: active-only for the
// public paths); `writeClient` = service_role, used ONLY after the
// controller-layer requireAdmin hook has passed (RLS stays the safety net
// for clients talking to Supabase directly).
export function createSupabaseCategoryRepository(
  readClient: SupabaseClient,
  writeClient: SupabaseClient,
): CategoryRepository {
  return {
    async listActive() {
      const { data, error } = await readClient
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });
      if (error) throw dbError('categories list', error);
      return data as Category[];
    },

    async listAllWithCounts() {
      const { data, error } = await writeClient
        .from('categories')
        .select('*, products(count)')
        .order('sort_order', { ascending: true });
      if (error) throw dbError('admin categories list', error);
      return (data as Array<Category & { products: Array<{ count: number }> }>).map(
        ({ products, ...category }) => ({
          ...category,
          product_count: products[0]?.count ?? 0,
        }),
      );
    },

    async findBySlug(slug) {
      const { data, error } = await readClient
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .maybeSingle();
      if (error) throw dbError('category lookup', error);
      return (data as Category) ?? null;
    },

    async findById(id) {
      const { data, error } = await writeClient
        .from('categories')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      if (error) throw dbError('category lookup', error);
      return (data as Category) ?? null;
    },

    async slugExists(slug) {
      const { count, error } = await writeClient
        .from('categories')
        .select('id', { count: 'exact', head: true })
        .eq('slug', slug);
      if (error) throw dbError('slug check', error);
      return (count ?? 0) > 0;
    },

    async create(data) {
      const { data: row, error } = await writeClient
        .from('categories')
        .insert(data)
        .select('*')
        .single();
      if (error) throw dbError('category create', error);
      return row as Category;
    },

    async update(id, patch) {
      const { data: row, error } = await writeClient
        .from('categories')
        .update(patch)
        .eq('id', id)
        .select('*')
        .maybeSingle();
      if (error) throw dbError('category update', error);
      return (row as Category) ?? null;
    },

    async delete(id) {
      const { error } = await writeClient.from('categories').delete().eq('id', id);
      if (error) throw dbError('category delete', error);
    },

    async countProducts(categoryId) {
      const { count, error } = await writeClient
        .from('products')
        .select('id', { count: 'exact', head: true })
        .eq('category_id', categoryId);
      if (error) throw dbError('product count', error);
      return count ?? 0;
    },
  };
}
