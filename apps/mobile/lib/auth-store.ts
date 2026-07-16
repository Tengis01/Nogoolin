import { create } from 'zustand';
import type { Session } from '@supabase/supabase-js';
import { supabase } from './supabase';

// Zustand session store (FR-MOB-008). `initialize` subscribes once at app
// start (app/_layout.tsx) and keeps the store in sync with GoTrue.
interface AuthState {
  session: Session | null;
  initialized: boolean;
  initialize: () => void;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  initialized: false,

  initialize: () => {
    void supabase.auth.getSession().then(({ data }) => {
      set({ session: data.session, initialized: true });
    });
    supabase.auth.onAuthStateChange((_event, session) => {
      set({ session, initialized: true });
    });
  },

  signOut: async () => {
    await supabase.auth.signOut(); // revokes refresh token (FR-AUTH-011)
  },
}));
