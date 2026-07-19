import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@nogoolin/validation-schemas';

export function formatPrice(price: number): string {
  return `${price.toLocaleString('en-US')}₮`;
}

// WF-HOME-02 / WF-LIST-04 card: image 4/3.4 (halo placeholder when no
// photo), category tag pill, 2-line clamped name, serif saffron-deep price,
// 360° badge for products with a 3D model. Whole card links to the detail.
export function ProductCard({
  product,
  priority = false,
}: {
  product: Product;
  priority?: boolean;
}) {
  const image = product.images?.[0];

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group rounded-[18px] border border-[var(--hair)] bg-[var(--paper)] transition-all duration-[350ms] hover:-translate-y-1 hover:border-[var(--act)] hover:shadow-[0_20px_44px_rgba(23,53,42,0.10)]"
    >
      <div className="relative aspect-[4/3.4] overflow-hidden rounded-t-[18px] bg-[var(--paper-alt)]">
        {image ? (
          <Image
            src={image.image_url}
            alt={image.alt_text ?? product.name}
            fill
            sizes="(max-width: 700px) 50vw, 235px"
            priority={priority}
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <svg viewBox="0 0 100 100" fill="none" width={64} height={64} className="text-[var(--saff-deep)] opacity-40">
              <circle cx="50" cy="50" r="46" stroke="currentColor" strokeOpacity=".45" strokeWidth="1.6" />
              <circle cx="50" cy="50" r="34" stroke="currentColor" strokeOpacity=".9" strokeWidth="2.4" strokeDasharray="2.5 5" />
              <circle cx="50" cy="50" r="21" stroke="currentColor" strokeOpacity=".3" strokeWidth="1.2" />
            </svg>
          </div>
        )}
        {product.model_3d_url && (
          <span className="absolute right-2 top-2 rounded-full bg-[var(--saff)] px-2 py-0.5 text-[10px] font-semibold text-[var(--act-text)]">
            360°
          </span>
        )}
      </div>
      <div className="flex flex-col gap-1.5 p-4">
        {product.category && (
          <span className="self-start rounded-full bg-[color-mix(in_srgb,var(--act)_9%,white)] px-2.5 py-0.5 text-[11px] font-medium text-[var(--act-text)]">
            {product.category.name}
          </span>
        )}
        <p className="line-clamp-2 text-[15.5px] leading-snug text-[var(--ink)]">
          {product.name}
        </p>
        <p className="font-serif text-xl text-[var(--saff-deep)]">
          {formatPrice(product.price)}
        </p>
      </div>
    </Link>
  );
}
