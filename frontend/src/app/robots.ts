import { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://salf-storage-aggregator.vercel.app';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/catalog', '/warehouse/', '/about', '/faq', '/pricing', '/contact', '/ai/'],
        disallow: [
          '/operator/',
          '/admin/',
          '/dashboard',
          '/bookings',
          '/favorites',
          '/profile',
          '/api/',
          '/auth/',
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
