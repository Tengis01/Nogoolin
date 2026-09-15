import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { PublicFooter, PublicNav } from '@/components/public/nav';
import { ProfileForm } from '@/components/public/profile-form';
import { InquiryHistory } from '@/components/public/inquiry-history';
import { WishlistGrid } from '@/components/public/wishlist-grid';
import { SignOutButton } from '@/components/auth/signout-button';

// Basic user profile — /profile (Phase 4).
// Auth-gated with the Phase 1 server-side pattern (same as /admin):
// no session → /login?next=/profile.

export const metadata = {
  title: 'Миний булан — Ногоолин',
  robots: { index: false, follow: false },
};

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login?next=/profile');

  // RLS `users_select_own_or_admin` lets a user read their own row
  const { data: profile } = await supabase
    .from('users')
    .select('full_name, role')
    .eq('id', user.id)
    .maybeSingle();

  const fullName = (profile?.full_name as string | null) ?? '';
  const isAdmin = profile?.role === 'admin';

  return (
    <>
      <PublicNav />
      <main className="mx-auto min-h-screen max-w-[1200px] px-[5vw] py-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--saff-deep)]">
              Миний булан
            </p>
            <h1 className="mt-1 text-[clamp(26px,3.2vw,38px)] leading-tight text-[var(--ink)]">
              {fullName || user.email}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            {isAdmin && (
              <Link
                href="/admin"
                className="rounded-full border border-[var(--hair)] px-5 py-2 text-sm font-semibold text-[var(--ink)] transition-colors hover:border-[var(--act)]"
              >
                Админ хэсэг
              </Link>
            )}
            <SignOutButton variant="light" />
          </div>
        </div>

        <section className="mb-12">
          <h2 className="mb-4 text-xl text-[var(--ink)]">Хувийн мэдээлэл</h2>
          <ProfileForm email={user.email ?? ''} initialName={fullName} />
        </section>

        <section className="mb-12">
          <h2 className="mb-4 text-xl text-[var(--ink)]">Миний хүсэлтүүд</h2>
          <InquiryHistory />
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-xl text-[var(--ink)]">Хадгалсан бүтээгдэхүүн</h2>
            <Link
              href="/wishlist"
              className="text-sm text-[var(--muted)] transition-colors hover:text-[var(--act)]"
            >
              Бүгдийг үзэх →
            </Link>
          </div>
          <WishlistGrid />
        </section>
      </main>
      <PublicFooter />
    </>
  );
}
