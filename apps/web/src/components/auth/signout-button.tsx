'use client';

import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

// FR-AUTH-011 / UC-A-004: revokes the refresh token server-side and clears
// the session cookies (docs/phase-0/08 §5.8).
//
// Two zones, two token sets (design.md): `dark` for the admin sidebar
// (default — unchanged since Phase 1), `light` for white catalog pages such
// as /profile, where the dark-zone tokens would be nearly invisible.
export function SignOutButton({ variant = 'dark' }: { variant?: 'dark' | 'light' }) {
  const router = useRouter();

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  }

  const className =
    variant === 'light'
      ? 'rounded-full border border-[var(--hair)] px-5 py-2 text-sm font-semibold text-[var(--ink)] transition-colors hover:border-[var(--act)]'
      : 'w-full rounded-full border border-[var(--n-line)] px-4 py-2 text-xs text-[var(--n-muted)] transition-colors hover:text-[var(--saff)]';

  return (
    <button type="button" onClick={() => void signOut()} className={className}>
      Гарах
    </button>
  );
}
