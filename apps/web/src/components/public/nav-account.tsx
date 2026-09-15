'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

// Session-aware nav links. Guests see "Нэвтрэх"; signed-in customers get
// their saved list and profile. Rendered inside the (server) PublicNav.
//
// Renders nothing until the session is known, so the nav never flashes the
// wrong state on hydration.
export function NavAccountLinks() {
  const [signedIn, setSignedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const supabase = createClient();
    let active = true;
    void supabase.auth.getSession().then(({ data }) => {
      if (active) setSignedIn(Boolean(data.session));
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setSignedIn(Boolean(session));
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  if (signedIn === null) return null;

  if (!signedIn) {
    return (
      <Link
        href="/login"
        className="text-[var(--muted)] transition-colors hover:text-[var(--act)]"
      >
        Нэвтрэх
      </Link>
    );
  }

  return (
    <>
      <Link
        href="/wishlist"
        className="text-[var(--muted)] transition-colors hover:text-[var(--act)]"
      >
        Хадгалсан
      </Link>
      <Link
        href="/profile"
        className="text-[var(--muted)] transition-colors hover:text-[var(--act)]"
      >
        Миний булан
      </Link>
    </>
  );
}
