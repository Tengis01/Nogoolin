'use client';

import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

// FR-AUTH-011 / UC-A-004: revokes the refresh token server-side and clears
// the session cookies (docs/08 §5.8).
export function SignOutButton() {
  const router = useRouter();

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={() => void signOut()}
      className="w-full rounded-full border border-[var(--n-line)] px-4 py-2 text-xs text-[var(--n-muted)] transition-colors hover:text-[var(--saff)]"
    >
      Гарах
    </button>
  );
}
