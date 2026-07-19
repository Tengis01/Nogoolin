import type { MetadataRoute } from 'next';
import { fetchActiveCategories, fetchPublishedProducts, siteUrl } from '@/lib/api/public';

// NFR-SEO-005: dynamic sitemap with all published products + active
// categories (served at /sitemap.xml by the App Router).
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const entries: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date() },
    { url: `${base}/products`, lastModified: new Date() },
  ];

  try {
    const [categories, firstPage] = await Promise.all([
      fetchActiveCategories(),
      fetchPublishedProducts({ page: 1 }),
    ]);

    for (const category of categories) {
      entries.push({
        url: `${base}/products?category=${category.slug}`,
        lastModified: new Date(category.updated_at),
      });
    }

    // walk all pages so every published product is present
    let products = firstPage.data;
    for (let page = 2; page <= firstPage.meta.total_pages; page++) {
      const next = await fetchPublishedProducts({ page });
      products = products.concat(next.data);
    }
    for (const product of products) {
      entries.push({
        url: `${base}/products/${product.slug}`,
        lastModified: new Date(product.updated_at),
      });
    }
  } catch {
    // API unreachable at build/request time — serve the static entries
  }

  return entries;
}
