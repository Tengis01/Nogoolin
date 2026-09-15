import { z } from 'zod';
import { slugSchema } from './common.js';

// Entity — public.categories (docs/phase-0/04 §3.2)
export const categorySchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  slug: slugSchema,
  description: z.string().nullable(),
  sort_order: z.number().int(),
  is_active: z.boolean(),
  created_at: z.string().datetime({ offset: true }),
  updated_at: z.string().datetime({ offset: true }),
});
export type Category = z.infer<typeof categorySchema>;

// POST /admin/categories (docs/phase-0/08 §7.2: name required)
export const categoryInputSchema = z.object({
  name: z.string().min(1).max(120),
  slug: slugSchema.optional(), // auto-generated from name when absent
  description: z.string().max(2000).optional(),
  sort_order: z.number().int().min(0).optional(),
  is_active: z.boolean().optional(),
});
export type CategoryInput = z.infer<typeof categoryInputSchema>;

// PATCH /admin/categories/:id — all fields optional
export const categoryPatchSchema = categoryInputSchema.partial();
export type CategoryPatch = z.infer<typeof categoryPatchSchema>;
