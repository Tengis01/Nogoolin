import { z } from 'zod';
import { userRoleSchema } from './common.js';

// Entity — public.users (docs/04 §3.1)
export const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  full_name: z.string().nullable(),
  role: userRoleSchema,
  created_at: z.string().datetime({ offset: true }),
  updated_at: z.string().datetime({ offset: true }),
});
export type User = z.infer<typeof userSchema>;

// FR-USER-002: customer may update only full_name (column restriction
// enforced here, not in RLS — docs/08 §6.4)
export const userProfilePatchSchema = z
  .object({
    full_name: z.string().min(1).max(120),
  })
  .strict();

// FR-USER-004: admin-only role change
export const userRolePatchSchema = z
  .object({
    role: userRoleSchema,
  })
  .strict();
