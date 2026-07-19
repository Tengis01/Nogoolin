import { ProductTable } from '@/components/admin/product-table';

export const metadata = { title: 'Бүтээгдэхүүн — Ногоолин админ' };

export default function AdminProductsPage() {
  return (
    <div>
      <p className="mb-1 text-xs font-semibold uppercase tracking-[0.28em] text-[var(--saff-deep)]">
        Каталог
      </p>
      <h1 className="mb-6 text-3xl text-[var(--ink)]">Бүтээгдэхүүн</h1>
      <ProductTable />
    </div>
  );
}
