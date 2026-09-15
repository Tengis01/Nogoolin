import type { SupabaseClient } from '@supabase/supabase-js';
import type { Inquiry } from '@nogoolin/validation-schemas';
import type { InquiryRepository } from '../types.js';

// Compact product join per 06-api-spec Inquiry.product (id/name/name_en/slug).
const SELECT_WITH_PRODUCT = '*, product:products(id, name, name_en, slug)';

export function createSupabaseInquiryRepository(
  client: SupabaseClient,
): InquiryRepository {
  return {
    async create(data) {
      // status is forced to 'new' by the DB default + RLS check (FR-INQ-003).
      const { data: row, error } = await client
        .from('inquiries')
        .insert({
          customer_name: data.customer_name,
          phone: data.phone,
          message: data.message ?? null,
          product_id: data.product_id ?? null,
          customer_id: data.customer_id,
        })
        .select(SELECT_WITH_PRODUCT)
        .single();
      if (error) throw new Error(`inquiry create failed: ${error.message}`);
      return row as unknown as Inquiry;
    },

    async listAll(query) {
      let q = client
        .from('inquiries')
        .select(SELECT_WITH_PRODUCT, { count: 'exact' });

      if (query.status) q = q.eq('status', query.status);
      if (query.product_id) q = q.eq('product_id', query.product_id);
      if (query.date_from) q = q.gte('created_at', query.date_from);
      if (query.date_to) q = q.lte('created_at', query.date_to);

      q = q.order('created_at', { ascending: false }); // newest first (FR-INQ-004)

      const from = (query.page - 1) * query.limit;
      const { data, count, error } = await q.range(from, from + query.limit - 1);
      if (error) throw new Error(`inquiry list failed: ${error.message}`);
      return { data: (data ?? []) as unknown as Inquiry[], total: count ?? 0 };
    },

    async listByCustomer(customerId) {
      const { data, error } = await client
        .from('inquiries')
        .select(SELECT_WITH_PRODUCT)
        .eq('customer_id', customerId)
        .order('created_at', { ascending: false });
      if (error) throw new Error(`customer inquiry list failed: ${error.message}`);
      return (data ?? []) as unknown as Inquiry[];
    },

    async updateStatus(id, status) {
      const { data: row, error } = await client
        .from('inquiries')
        .update({ status })
        .eq('id', id)
        .select(SELECT_WITH_PRODUCT)
        .maybeSingle();
      if (error) throw new Error(`inquiry status update failed: ${error.message}`);
      return row ? (row as unknown as Inquiry) : null;
    },
  };
}
