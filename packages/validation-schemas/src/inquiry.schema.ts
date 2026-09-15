import { z } from 'zod';
import { inquiryStatusSchema, phoneSchema } from './common.js';

// Compact product summary joined onto an inquiry (06-api-spec Inquiry.product)
const inquiryProductSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  name_en: z.string().nullable(),
  slug: z.string(),
});

// Entity — public.inquiries (docs/phase-0/04 §3.7 + migration 0007 customer_id)
export const inquirySchema = z.object({
  id: z.string().uuid(),
  product_id: z.string().uuid().nullable(),
  // Authenticated submitter; NULL for guests (FR-INQ-001, migration 0007).
  customer_id: z.string().uuid().nullable(),
  customer_name: z.string(),
  phone: z.string(),
  message: z.string().nullable(),
  status: inquiryStatusSchema,
  created_at: z.string().datetime({ offset: true }),
  // Present on admin/customer list responses (joined), omitted on create echo
  product: inquiryProductSchema.nullable().optional(),
});
export type Inquiry = z.infer<typeof inquirySchema>;

// POST /inquiries (docs/phase-0/08 §4.4 + §7.2 — exact constraints).
// customer_name/phone/message/product_id ONLY — no email (FR-INQ-002).
export const inquiryInputSchema = z.object({
  customer_name: z.string().min(2),
  phone: phoneSchema,
  message: z.string().optional(),
  product_id: z.string().uuid().nullable().optional(),
});
export type InquiryInput = z.infer<typeof inquiryInputSchema>;

// PATCH /admin/inquiries/:id/status (docs/phase-0/08 §7.2)
export const inquiryStatusPatchSchema = z
  .object({
    status: inquiryStatusSchema,
  })
  .strict();
export type InquiryStatusPatch = z.infer<typeof inquiryStatusPatchSchema>;

// GET /admin/inquiries query (06-api-spec: page/limit/status;
// product_id + date range are a Phase-4 superset requested by the owner —
// beyond 06-spec v1.0, noted like GET /admin/categories).
const isoDate = z
  .string()
  .refine((v) => !Number.isNaN(Date.parse(v)), 'Invalid date');

export const adminInquiryListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
  status: inquiryStatusSchema.optional(),
  product_id: z.string().uuid().optional(),
  date_from: isoDate.optional(),
  date_to: isoDate.optional(),
});
export type AdminInquiryListQuery = z.infer<typeof adminInquiryListQuerySchema>;
