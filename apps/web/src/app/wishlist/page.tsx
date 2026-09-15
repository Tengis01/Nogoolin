import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { PublicFooter, PublicNav } from '@/components/public/nav';
import { WishlistGrid } from '@/components/public/wishlist-grid';

// Saved products — /wishlist (Phase 4 "wishlist / cart draft").
// Auth-gated with the same server-side pattern as /admin (Phase 1):
// no session → /login?next=/wishlist.
//
// NOT a cart: no totals, no checkout, no order creation anywhere on this page.

export const metadata = {
  title: 'Хадгалсан бүтээгдэхүүн — Ногоолин',
  robots: { index: false, follow: false },
};

export default async function WishlistPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login?next=/wishlist');

  return (
    <>
      <PublicNav />
      <main className="mx-auto min-h-screen max-w-[1200px] px-[5vw] py-8">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--saff-deep)]">
          Миний жагсаалт
        </p>
        <h1 className="mb-8 mt-1 text-[clamp(26px,3.2vw,38px)] leading-tight text-[var(--ink)]">
          Хадгалсан бүтээгдэхүүн
        </h1>
        <WishlistGrid />
      </main>
      <PublicFooter />
    </>
  );
}
