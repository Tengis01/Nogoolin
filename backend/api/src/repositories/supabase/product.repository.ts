import type { SupabaseClient } from '@supabase/supabase-js';
import type { Product } from '@nogoolin/validation-schemas';
import type { ProductRepository, SearchTerms } from '../types.js';

// Join expansion per 06-api-spec Product schema (images + category).
const SELECT_WITH_JOINS = '*, images:product_images(*), category:categories(*)';

// PostgREST .or() filter strings are comma/paren-delimited — strip syntax
// characters from user-supplied terms (defense in depth; queries stay
// parameterized via the query builder otherwise, NFR-SEC-004).
function sanitizeTerm(term: string): string {
  return term.replace(/[,()"{}]/g, ' ').replace(/\s+/g, ' ').trim();
}

// Multi-script search (FR-PUB-014, SEQ-003): websearch full-text match on
// the generated `search_vector` column (simple config, name + name_en +
// search_tags) for the raw query AND its Cyrillic transliteration.
function searchOrFilter(search: SearchTerms): string | null {
  const clauses: string[] = [];
  for (const term of [search.raw, search.transliterated]) {
    if (!term) continue;
    const clean = sanitizeTerm(term);
    if (!clean) continue;
    clauses.push(`search_vector.wfts(simple).${clean}`);
  }
  return clauses.length > 0 ? clauses.join(',') : null;
}

// The generated tsvector column is an implementation detail — never
// serialized in API responses.
function stripVector(row: Record<string, unknown>): Product {
  delete row['search_vector'];
  return row as unknown as Product;
}

export function createSupabaseProductRepository(
  readClient: SupabaseClient,
  writeClient: SupabaseClient,
): ProductRepository {
  return {
    async listPublished(query, search) {
      // category_slug filters on the joined table → needs an inner join
      const select = query.category_slug
        ? '*, images:product_images(*), category:categories!inner(*)'
        : SELECT_WITH_JOINS;

      let q = readClient
        .from('products')
        .select(select, { count: 'exact' })
        .eq('status', 'published');

      if (query.category_id) q = q.eq('category_id', query.category_id);
      if (query.category_slug) q = q.eq('category.slug', query.category_slug);
      if (query.stock_status) q = q.eq('stock_status', query.stock_status);
      if (query.is_featured !== undefined) q = q.eq('is_featured', query.is_featured);

      if (search) {
        const orFilter = searchOrFilter(search);
        if (orFilter) q = q.or(orFilter);
      }

      if (query.sort === 'price_asc') q = q.order('price', { ascending: true });
      else if (query.sort === 'price_desc') q = q.order('price', { ascending: false });
      else q = q.order('created_at', { ascending: false }); // newest (default)

      q = q.order('sort_order', {
        referencedTable: 'product_images',
        ascending: true,
      });

      const from = (query.page - 1) * query.limit;
      const { data, count, error } = await q.range(from, from + query.limit - 1);
      if (error) throw new Error(`product list failed: ${error.message}`);
      return {
        data: (data as Record<string, unknown>[]).map(stripVector),
        total: count ?? 0,
      };
    },

    async listAll(query) {
      let q = writeClient
        .from('products')
        .select(SELECT_WITH_JOINS, { count: 'exact' });

      if (query.status) q = q.eq('status', query.status);
      if (query.category_id) q = q.eq('category_id', query.category_id);
      if (query.search) {
        const clean = sanitizeTerm(query.search);
        // Admin search: single-script substring on name/name_en is enough
        // (06-api-spec: "admin search, single-script ok")
        if (clean) q = q.or(`name.ilike.%${clean}%,name_en.ilike.%${clean}%`);
      }

      q = q
        .order('created_at', { ascending: false })
        .order('sort_order', { referencedTable: 'product_images', ascending: true });

      const from = (query.page - 1) * query.limit;
      const { data, count, error } = await q.range(from, from + query.limit - 1);
      if (error) throw new Error(`admin product list failed: ${error.message}`);
      return {
        data: (data as Record<string, unknown>[]).map(stripVector),
        total: count ?? 0,
      };
    },

    async findPublishedBySlug(slug) {
      const { data, error } = await readClient
        .from('products')
        .select(SELECT_WITH_JOINS)
        .eq('slug', slug)
        .eq('status', 'published')
        .order('sort_order', { referencedTable: 'product_images', ascending: true })
        .maybeSingle();
      if (error) throw new Error(`product lookup failed: ${error.message}`);
      return data ? stripVector(data as Record<string, unknown>) : null;
    },

    async findById(id) {
      const { data, error } = await writeClient
        .from('products')
        .select(SELECT_WITH_JOINS)
        .eq('id', id)
        .maybeSingle();
      if (error) throw new Error(`product lookup failed: ${error.message}`);
      return data ? stripVector(data as Record<string, unknown>) : null;
    },

    async slugExists(slug) {
      const { count, error } = await writeClient
        .from('products')
        .select('id', { count: 'exact', head: true })
        .eq('slug', slug);
      if (error) throw new Error(`slug check failed: ${error.message}`);
      return (count ?? 0) > 0;
    },

    async create(data) {
      const { data: row, error } = await writeClient
        .from('products')
        .insert(data)
        .select(SELECT_WITH_JOINS)
        .single();
      if (error) throw new Error(`product create failed: ${error.message}`);
      return stripVector(row as Record<string, unknown>);
    },

    async update(id, patch) {
      const { data: row, error } = await writeClient
        .from('products')
        .update(patch)
        .eq('id', id)
        .select(SELECT_WITH_JOINS)
        .maybeSingle();
      if (error) throw new Error(`product update failed: ${error.message}`);
      return row ? stripVector(row as Record<string, unknown>) : null;
    },

    async hardDelete(id) {
      // product_images rows cascade (FK ON DELETE CASCADE)
      const { error } = await writeClient.from('products').delete().eq('id', id);
      if (error) throw new Error(`product delete failed: ${error.message}`);
    },
  };
}
