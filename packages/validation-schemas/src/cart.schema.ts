import { z } from 'zod';
import { stockStatusSchema } from './common.js';

// Phase 4 "Wishlist / cart draft" (roadmap §6). A simple per-user
// save-for-later list — NOT an order: no quantity, price, or checkout.
// New entity: docs/phase-0/04 has no cart table (owner-approved 2026-07-26,
// migration 0007). Keep this distinct from the delivery-gated
// orders/order_items flow.

// Compact product summary joined onto a cart item for list rendering.
const cartProductSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  name_en: z.string().nullable(),
  slug: z.string(),
  price: z.number(),
  stock_status: stockStatusSchema,
  status: z.string(),
  image_url: z.string().nullable(),
});

// Entity — public.cart_items
export const cartItemSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  product_id: z.string().uuid(),
  created_at: z.string().datetime({ offset: true }),
  product: cartProductSchema.nullable().optional(),
});
export type CartItem = z.infer<typeof cartItemSchema>;

// POST /cart — add a product to the current user's save list.
export const cartItemInputSchema = z
  .object({
    product_id: z.string().uuid(),
  })
  .strict();
export type CartItemInput = z.infer<typeof cartItemInputSchema>;
