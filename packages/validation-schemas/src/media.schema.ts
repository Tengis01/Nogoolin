import { z } from 'zod';
import { mediaTypeSchema } from './common.js';

// Entity — public.product_images (docs/phase-0/04 §3.4)
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

// PATCH /admin/products/:id/images/:imageId (06-api-spec — sort_order and/or
// alt_text; reordering makes lowest sort_order the thumbnail, FR-MEDIA-005)
export const productImagePatchSchema = z
  .object({
    sort_order: z.number().int().min(0).optional(),
    alt_text: z.string().max(200).optional(),
  })
  .refine((v) => v.sort_order !== undefined || v.alt_text !== undefined, {
    message: 'At least one of sort_order or alt_text is required',
  });
export type ProductImagePatch = z.infer<typeof productImagePatchSchema>;

// Entity — public.media_assets (docs/phase-0/04 §3.5, standalone site-wide assets)
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
