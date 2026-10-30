import type { SupabaseClient } from '@supabase/supabase-js';
import type { UserRepository } from '../types.js';
import { dbError } from '../../lib/db-errors.js';

// Runs on the service_role client: the role lookup must work regardless of
// the caller's own RLS visibility (docs/phase-0/08 §5.4 does the same). Read-only.
export function createSupabaseUserRepository(client: SupabaseClient): UserRepository {
  return {
    async findAuthProfile(id) {
      const { data, error } = await client
        .from('users')
        .select('id, role')
        .eq('id', id)
        .maybeSingle();
      if (error) throw dbError('user profile lookup', error);
      return data ?? null;
    },
  };
}
