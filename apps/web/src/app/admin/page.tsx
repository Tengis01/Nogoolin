export const metadata = { title: 'Админ — Ногоолин' };

// Bare-bones dashboard placeholder — real stats (product count, inquiry
// counts, FR-ADM-003) arrive with the Phase 2 CRUD work.
export default function AdminDashboardPage() {
  return (
    <div>
      <p className="mb-1 text-xs font-semibold uppercase tracking-[0.28em] text-[var(--saff-deep)]">
        Хянах самбар
      </p>
      <h1 className="mb-6 text-3xl text-[var(--ink)]">Тавтай морил</h1>
      <div className="rounded-[18px] border border-[var(--hair)] bg-[var(--paper)] p-6 text-sm text-[var(--muted)]">
        Phase 1 scaffold — бүтээгдэхүүн, ангилал, хүсэлтийн удирдлага Phase 2-т
        нэмэгдэнэ.
      </div>
    </div>
  );
}
