import type { SupabaseClient } from '@supabase/supabase-js';
import type { AuditLogRepository } from '../types.js';

// MUST use the service_role client — audit_logs has no INSERT policy for
// any user role; service_role writes are the designed RLS bypass
// (docs/phase-0/08 §6.12, UC-SYS-003).
export function createSupabaseAuditLogRepository(
  client: SupabaseClient,
): AuditLogRepository {
  return {
    async log(entry) {
      const { error } = await client.from('audit_logs').insert({
        admin_id: entry.admin_id,
        action: entry.action,
        entity_type: entry.entity_type,
        entity_id: entry.entity_id ?? null,
        metadata: entry.metadata ?? null,
      });
      if (error) throw new Error(`audit log write failed: ${error.message}`);
    },
  };
}
