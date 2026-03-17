import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'StorageCompare.ae',
    short_name: 'StorageCompare',
    description: "UAE's leading self-storage marketplace — find and compare storage facilities across all Emirates.",
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#1A56DB',
    icons: [
      {
        src: '/favicon.ico',
        sizes: '48x48',
        type: 'image/x-icon',
      },
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    categories: ['business', 'lifestyle'],
    lang: 'en',
    dir: 'ltr',
    orientation: 'portrait-primary',
  };
}
