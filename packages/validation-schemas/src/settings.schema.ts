import { z } from 'zod';

// Entity — public.system_settings (docs/04 §3.6, key-value jsonb)
export const systemSettingSchema = z.object({
  key: z.string(),
  value: z.unknown(), // jsonb — narrow per setting where needed
  updated_at: z.string().datetime({ offset: true }),
});
export type SystemSetting = z.infer<typeof systemSettingSchema>;

// PATCH /admin/settings/delivery (docs/08 §7.2, FR-SET-003)
export const deliveryToggleSchema = z
  .object({
    delivery_enabled: z.boolean(),
  })
  .strict();
export type DeliveryToggle = z.infer<typeof deliveryToggleSchema>;

// GET /settings/public response (FR-PUB-009)
export const publicSettingsSchema = z.object({
  delivery_enabled: z.boolean(),
});
export type PublicSettings = z.infer<typeof publicSettingsSchema>;
