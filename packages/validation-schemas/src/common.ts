import { z } from 'zod';

// Enums — mirror the Postgres enums in supabase/migrations (docs/04)
export const userRoleSchema = z.enum(['customer', 'admin', 'delivery_staff']);
export const productStatusSchema = z.enum(['draft', 'published', 'archived']);
export const stockStatusSchema = z.enum(['in_stock', 'out_of_stock', 'pre_order']);
export const mediaTypeSchema = z.enum(['image', 'video', 'model_3d']);
export const inquiryStatusSchema = z.enum(['new', 'contacted', 'closed']);
export const orderStatusSchema = z.enum([
  'pending',
  'confirmed',
  'delivering',
  'completed',
  'cancelled',
]);

export type UserRole = z.infer<typeof userRoleSchema>;
export type ProductStatus = z.infer<typeof productStatusSchema>;
export type StockStatus = z.infer<typeof stockStatusSchema>;
export type MediaType = z.infer<typeof mediaTypeSchema>;
export type InquiryStatus = z.infer<typeof inquiryStatusSchema>;
export type OrderStatus = z.infer<typeof orderStatusSchema>;

// URL-safe slug (FR-CAT-005, FR-PROD-007)
export const slugSchema = z
  .string()
  .min(1)
  .max(120)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase, URL-safe, hyphen-separated');

// Inquiry phone rule per docs/08 §7.2
export const phoneSchema = z.string().regex(/^[0-9+\s-]{8,15}$/);
