import type { MetadataRoute } from 'next';
import { siteUrl } from '@/lib/api/public';

// NFR-SEO-006: /admin is never crawled.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/login', '/signup'],
    },
    sitemap: `${siteUrl()}/sitemap.xml`,
  };
}
