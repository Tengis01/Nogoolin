import { CategoryTable } from '@/components/admin/category-table';

export const metadata = { title: 'Ангилал — Ногоолин админ' };

export default function AdminCategoriesPage() {
  return (
    <div>
      <p className="mb-1 text-xs font-semibold uppercase tracking-[0.28em] text-[var(--saff-deep)]">
        Каталог
      </p>
      <h1 className="mb-6 text-3xl text-[var(--ink)]">Ангилал</h1>
      <CategoryTable />
    </div>
  );
}
