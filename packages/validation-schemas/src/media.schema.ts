import { z } from 'zod';
import { mediaTypeSchema } from './common.js';

// Entity — public.product_images (docs/04 §3.4)
export const productImageSchema = z.object({
  id: z.string().uuid(),
  product_id: z.string().uuid(),
  image_url: z.string(),
  alt_text: z.string().nullable(), // NFR-SEO-009
  sort_order: z.number().int(),
  created_at: z.string().datetime({ offset: true }),
});
export type ProductImage = z.infer<typeof productImageSchema>;

export const productImageInputSchema = z.object({
  alt_text: z.string().max(200).optional(),
  sort_order: z.number().int().min(0).optional(),
});
export type ProductImageInput = z.infer<typeof productImageInputSchema>;

// Entity — public.media_assets (docs/04 §3.5, standalone site-wide assets)
export const mediaAssetSchema = z.object({
  id: z.string().uuid(),
  type: mediaTypeSchema,
  url: z.string(),
  file_name: z.string(),
  size: z.number().int().nullable(), // bytes
  mime_type: z.string().nullable(),
  created_at: z.string().datetime({ offset: true }),
});
export type MediaAsset = z.infer<typeof mediaAssetSchema>;
