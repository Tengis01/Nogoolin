import { z } from 'zod';
import { inquiryStatusSchema, phoneSchema } from './common.js';

// Entity — public.inquiries (docs/04 §3.7)
export const inquirySchema = z.object({
  id: z.string().uuid(),
  product_id: z.string().uuid().nullable(),
  customer_name: z.string(),
  phone: z.string(),
  message: z.string().nullable(),
  status: inquiryStatusSchema,
  created_at: z.string().datetime({ offset: true }),
});
export type Inquiry = z.infer<typeof inquirySchema>;

// POST /inquiries (docs/08 §4.4 + §7.2 — exact constraints)
export const inquiryInputSchema = z.object({
  customer_name: z.string().min(2),
  phone: phoneSchema,
  message: z.string().optional(),
  product_id: z.string().uuid().nullable().optional(),
});
export type InquiryInput = z.infer<typeof inquiryInputSchema>;

// PATCH /admin/inquiries/:id/status (docs/08 §7.2)
export const inquiryStatusPatchSchema = z
  .object({
    status: inquiryStatusSchema,
  })
  .strict();
export type InquiryStatusPatch = z.infer<typeof inquiryStatusPatchSchema>;
