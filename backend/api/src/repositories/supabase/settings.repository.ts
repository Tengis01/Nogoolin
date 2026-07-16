import type { SupabaseClient } from '@supabase/supabase-js';
import type { SettingsRepository } from '../types.js';
import type { PublicSettings } from '@nogoolin/validation-schemas';

// Supabase implementation of SettingsRepository.
// Only repositories touch the database (NFR-MAIN-001); queries go through
// the query builder — no raw SQL interpolation ever (NFR-SEC-004).
export function createSupabaseSettingsRepository(
  client: SupabaseClient,
): SettingsRepository {
  return {
    async getPublicSettings(): Promise<PublicSettings> {
      const { data, error } = await client
        .from('system_settings')
        .select('value')
        .eq('key', 'delivery_enabled')
        .single();
      if (error) throw new Error(`settings lookup failed: ${error.message}`);
      return { delivery_enabled: data.value === true };
    },

    async setDeliveryEnabled(enabled: boolean): Promise<void> {
      const { error } = await client
        .from('system_settings')
        .update({ value: enabled })
        .eq('key', 'delivery_enabled');
      if (error) throw new Error(`settings update failed: ${error.message}`);
    },
  };
}
