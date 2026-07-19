'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { ProductImage } from '@nogoolin/validation-schemas';

// WF-DET-01: media area 4/3.2, radius 20, hairline; primary photo default,
// thumbnail row below when multiple. (The 360° viewer toggle joins in
// Phase 3 with the GLB work — image gallery is the fallback, FR-PUB-011.)
export function ProductGallery({
  images,
  productName,
}: {
  images: ProductImage[];
  productName: string;
}) {
  const [selected, setSelected] = useState(0);
  const current = images[selected];

  return (
    <div>
      <div className="relative aspect-[4/3.2] overflow-hidden rounded-[20px] border border-[var(--hair)] bg-[var(--paper-alt)]">
        {current ? (
          <Image
            src={current.image_url}
            alt={current.alt_text ?? productName}
            fill
            sizes="(max-width: 880px) 100vw, 55vw"
            priority
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <svg viewBox="0 0 100 100" fill="none" width={110} height={110} className="text-[var(--saff-deep)] opacity-40">
              <circle cx="50" cy="50" r="46" stroke="currentColor" strokeOpacity=".45" strokeWidth="1.6" />
              <circle cx="50" cy="50" r="34" stroke="currentColor" strokeOpacity=".9" strokeWidth="2.4" strokeDasharray="2.5 5" />
              <circle cx="50" cy="50" r="21" stroke="currentColor" strokeOpacity=".3" strokeWidth="1.2" />
            </svg>
          </div>
        )}
      </div>
      {images.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {images.map((img, i) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setSelected(i)}
              aria-label={`Зураг ${i + 1}`}
              className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border transition-colors ${
                i === selected ? 'border-[var(--act)]' : 'border-[var(--hair)]'
              }`}
            >
              <Image
                src={img.image_url}
                alt={img.alt_text ?? `${productName} ${i + 1}`}
                fill
                sizes="64px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
