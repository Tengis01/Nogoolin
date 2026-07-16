import { z } from 'zod';

// Entity — public.audit_logs (docs/04 §3.11, append-only FR-AUD-003)
export const auditLogSchema = z.object({
  id: z.string().uuid(),
  admin_id: z.string().uuid(),
  action: z.string(), // e.g. DELIVERY_TOGGLE, PRODUCT_PUBLISH
  entity_type: z.string(), // e.g. product, system_settings
  entity_id: z.string().uuid().nullable(),
  metadata: z.record(z.unknown()).nullable(), // e.g. { from: false, to: true }
  created_at: z.string().datetime({ offset: true }),
});
export type AuditLog = z.infer<typeof auditLogSchema>;
