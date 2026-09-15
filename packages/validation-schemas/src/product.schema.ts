import { z } from 'zod';
import { productStatusSchema, slugSchema, stockStatusSchema } from './common.js';
import { productImageSchema } from './media.schema.js';
import { categorySchema } from './category.schema.js';

// Entity — public.products (docs/phase-0/04 §3.3, FR-PROD-001).
// `images` and `category` are join-expanded in API responses
// (06-api-spec Product schema).
export const productSchema = z.object({
  id: z.string().uuid(),
  category_id: z.string().uuid(),
  category: categorySchema.optional(),
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
  images: z.array(productImageSchema).optional(),
  created_at: z.string().datetime({ offset: true }),
  updated_at: z.string().datetime({ offset: true }),
});
export type Product = z.infer<typeof productSchema>;

// POST /admin/products (06-api-spec ProductInput: name, category_id, price required)
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
  search_tags: z.array(z.string().min(1)).max(30).optional(), // FR-PUB-015
});
export type ProductInput = z.infer<typeof productInputSchema>;

// PATCH /admin/products/:id — all fields optional; model_3d_url settable/
// nullable here (SEQ-005), per 06-api-spec ProductPatchInput
export const productPatchSchema = productInputSchema
  .partial()
  .extend({
    model_3d_url: z.string().url().nullable().optional(),
  });
export type ProductPatch = z.infer<typeof productPatchSchema>;

// Query-string boolean ("true"/"false" strings, not JS booleans)
const queryBool = z
  .enum(['true', 'false'])
  .transform((v) => v === 'true');

// GET /products query params — matches 06-api-spec /products parameters
// exactly (PageParam, LimitParam, category_id, category_slug, stock_status,
// is_featured, search, sort)
export const productListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
  category_id: z.string().uuid().optional(),
  category_slug: slugSchema.optional(),
  stock_status: stockStatusSchema.optional(),
  is_featured: queryBool.optional(),
  search: z.string().max(200).optional(), // multi-script (FR-PUB-014)
  sort: z.enum(['newest', 'price_asc', 'price_desc']).default('newest'),
});
export type ProductListQuery = z.infer<typeof productListQuerySchema>;

// GET /admin/products query params (06-api-spec /admin/products)
export const adminProductListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
  status: productStatusSchema.optional(),
  category_id: z.string().uuid().optional(),
  search: z.string().max(200).optional(),
});
export type AdminProductListQuery = z.infer<typeof adminProductListQuerySchema>;
