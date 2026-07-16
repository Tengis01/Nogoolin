import { z } from 'zod';
import { orderStatusSchema, phoneSchema } from './common.js';

// ── Future entities (W priority) — defined for architectural completeness,
// gated by delivery_enabled at the service layer (FR-SET-004, FR-ORD-008).

// Entity — public.orders (docs/04 §3.8)
export const orderSchema = z.object({
  id: z.string().uuid(),
  customer_id: z.string().uuid(),
  customer_name: z.string(),
  phone: z.string(),
  address: z.string(),
  status: orderStatusSchema,
  total_amount: z.number(),
  created_at: z.string().datetime({ offset: true }),
  updated_at: z.string().datetime({ offset: true }),
});
export type Order = z.infer<typeof orderSchema>;

// Entity — public.order_items (docs/04 §3.9)
export const orderItemSchema = z.object({
  id: z.string().uuid(),
  order_id: z.string().uuid(),
  product_id: z.string().uuid(),
  quantity: z.number().int(),
  unit_price: z.number(), // price snapshot at order time
  created_at: z.string().datetime({ offset: true }),
});
export type OrderItem = z.infer<typeof orderItemSchema>;

// Entity — public.delivery_assignments (docs/04 §3.10)
export const deliveryAssignmentSchema = z.object({
  id: z.string().uuid(),
  order_id: z.string().uuid(),
  delivery_staff_id: z.string().uuid(),
  vehicle_info: z.string().nullable(),
  status: z.string(),
  assigned_at: z.string().datetime({ offset: true }),
  completed_at: z.string().datetime({ offset: true }).nullable(),
});
export type DeliveryAssignment = z.infer<typeof deliveryAssignmentSchema>;

// POST /orders (FR-ORD-002/003)
export const orderInputSchema = z.object({
  customer_name: z.string().min(2),
  phone: phoneSchema,
  address: z.string().min(5),
  items: z
    .array(
      z.object({
        product_id: z.string().uuid(),
        quantity: z.number().int().min(1),
      }),
    )
    .min(1),
});
export type OrderInput = z.infer<typeof orderInputSchema>;

// PATCH /admin/orders/:id/status (FR-ORD-005)
export const orderStatusPatchSchema = z
  .object({
    status: orderStatusSchema,
  })
  .strict();
export type OrderStatusPatch = z.infer<typeof orderStatusPatchSchema>;
