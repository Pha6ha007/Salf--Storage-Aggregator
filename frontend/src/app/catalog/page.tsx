import { Metadata } from 'next';
import { Suspense } from 'react';
import { CatalogClient } from './CatalogClient';

export const metadata: Metadata = {
  title: 'Storage Catalog - Find Self-Storage in UAE | StorageCompare.ae',
  description: 'Browse and compare self-storage facilities across Dubai, Abu Dhabi, and all Emirates. Filter by location, size, price, and features to find your perfect storage space.',
  openGraph: {
    title: 'Storage Catalog - Find Self-Storage in UAE',
    description: 'Browse and compare self-storage facilities across the UAE',
    type: 'website',
  },
};

export default function CatalogPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
      <CatalogClient />
    </Suspense>
  );
}
