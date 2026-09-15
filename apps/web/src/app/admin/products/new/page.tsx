import { ProductForm } from '@/components/admin/product-form';

export const metadata = { title: 'Шинэ бүтээгдэхүүн — Ногоолин админ' };

export default function AdminNewProductPage() {
  return (
    <div>
      <p className="mb-1 text-xs font-semibold uppercase tracking-[0.28em] text-[var(--saff-deep)]">
        Каталог
      </p>
      <h1 className="mb-6 text-3xl text-[var(--ink)]">Шинэ бүтээгдэхүүн</h1>
      <ProductForm />
    </div>
  );
}
