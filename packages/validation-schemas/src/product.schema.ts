import { z } from 'zod';
import { productStatusSchema, slugSchema, stockStatusSchema } from './common.js';

// Entity — public.products (docs/04 §3.3, FR-PROD-001)
export const productSchema = z.object({
  id: z.string().uuid(),
  category_id: z.string().uuid(),
  name: z.string(), // Cyrillic Mongolian
  name_en: z.string().nullable(), // FR-PUB-013
  slug: slugSchema,
  price: z.number(),
  short_description: z.string().nullable(),
  full_description: z.string().nullable(),
  usage_instruction: z.string().nullable(), // markdown (FR-PROD-010)
  status: productStatusSchema,
  stock_status: stockStatusSchema,
  is_featured: z.boolean(),
  model_3d_url: z.string().nullable(), // FR-MEDIA-007
  search_tags: z.array(z.string()).nullable(), // FR-PUB-013
  created_at: z.string().datetime({ offset: true }),
  updated_at: z.string().datetime({ offset: true }),
});
export type Product = z.infer<typeof productSchema>;

// POST /admin/products (docs/08 §7.2: name, category_id, price required)
export const productInputSchema = z.object({
  name: z.string().min(1).max(200),
  name_en: z.string().max(200).optional(),
  slug: slugSchema.optional(), // auto-generated from name when absent (FR-PROD-007)
  category_id: z.string().uuid(),
  price: z.number().positive(),
  short_description: z.string().max(500).optional(),
  full_description: z.string().max(10000).optional(),
  usage_instruction: z.string().max(10000).optional(),
  status: productStatusSchema.optional(), // defaults to 'draft' in DB
  stock_status: stockStatusSchema.optional(),
  is_featured: z.boolean().optional(),
  model_3d_url: z.string().url().optional(),
  search_tags: z.array(z.string().min(1)).max(30).optional(), // FR-PUB-015
});
export type ProductInput = z.infer<typeof productInputSchema>;

// PATCH /admin/products/:id — all fields optional (06-api-spec ProductPatchInput)
export const productPatchSchema = productInputSchema.partial();
export type ProductPatch = z.infer<typeof productPatchSchema>;

// GET /products query params (FR-PROD-012/013, WF-LIST)
export const productListQuerySchema = z.object({
  category: slugSchema.optional(),
  q: z.string().max(200).optional(), // multi-script search (FR-PUB-014)
  featured: z.coerce.boolean().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
});
export type ProductListQuery = z.infer<typeof productListQuerySchema>;
