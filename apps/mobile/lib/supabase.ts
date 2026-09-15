import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// Same Supabase Auth as web (FR-MOB-009: supabase-js + fetch only).
// EXPO_PUBLIC_* vars are inlined at bundle time — anon key only, RLS applies
// to every request (docs/phase-0/09 §10.3).
//
// TODO(Phase 2): move session storage to encrypted storage per docs/phase-0/08 §5.2
// (expo-secure-store has a 2048-byte value limit, so the standard pattern is
// an AES-encrypted AsyncStorage with the key in SecureStore).
export const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true, // 15-min access tokens refresh in-app
      persistSession: true,
      detectSessionInUrl: false, // RN has no URL bar
    },
  },
);
