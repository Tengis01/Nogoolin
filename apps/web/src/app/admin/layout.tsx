import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { SignOutButton } from '@/components/auth/signout-button';

// FR-ADM-001/002: every /admin route requires an authenticated admin.
// Server-side check on each request — unauthenticated → /login,
// authenticated non-admin → home. The role comes from public.users via the
// user's own session (RLS lets a user read their own row); the API enforces
// the same rule independently (defense in depth, NFR-SEC-009).
export default async function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login?next=/admin');
  }

  const { data: profile } = await supabase
    .from('users')
    .select('role, full_name')
    .eq('id', user.id)
    .single();
  if (profile?.role !== 'admin') {
    redirect('/');
  }

  // Feature pages (products/categories/inquiries/settings) arrive in Phase 2+
  const navItems = [
    { href: '/admin', label: 'Хянах самбар' },
    { href: '/admin#products', label: 'Бүтээгдэхүүн (Phase 2)' },
    { href: '/admin#categories', label: 'Ангилал (Phase 2)' },
    { href: '/admin#inquiries', label: 'Хүсэлтүүд (Phase 4)' },
    { href: '/admin#settings', label: 'Тохиргоо (Phase 5)' },
  ];

  return (
    <div className="flex min-h-screen bg-[var(--paper-alt)]">
      <aside className="flex w-60 flex-col justify-between bg-[var(--n-bg1)] p-5">
        <div>
          <p className="mb-8 text-sm tracking-[0.14em] text-[var(--n-text)]">
            ◎ НОГООЛИН <span className="text-[var(--saff)]">админ</span>
          </p>
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="rounded-lg px-3 py-2 text-sm text-[var(--n-muted)] transition-colors hover:bg-white/5 hover:text-[var(--saff)]"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex flex-col gap-3">
          <p className="truncate text-xs text-[var(--n-muted)]">
            {profile.full_name ?? user.email}
          </p>
          <SignOutButton />
        </div>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
