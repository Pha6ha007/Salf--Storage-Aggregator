import type { Metadata } from 'next';
import { WarehouseClient } from './WarehouseClient';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://salf-storage-aggregator.vercel.app';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://salf-storage-aggregator-production.up.railway.app/api/v1';

export async function generateMetadata(
  { params }: { params: { id: string } }
): Promise<Metadata> {
  try {
    const res = await fetch(`${API_URL}/warehouses/${params.id}`, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error('not found');
    const json = await res.json();
    const warehouse = json.data ?? json;

    const title = `${warehouse.name} — Self-Storage in ${warehouse.emirate}, UAE`;
    const description = warehouse.description
      ? warehouse.description.slice(0, 160)
      : `Book self-storage at ${warehouse.name} in ${warehouse.emirate}. ${warehouse.total_boxes ?? ''} units available starting from ${warehouse.min_price ?? ''} AED/month.`;
    const image = warehouse.primary_image ?? warehouse.media?.[0]?.file_url ?? `${BASE_URL}/og-default.jpg`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: `${BASE_URL}/warehouse/${params.id}`,
        siteName: 'StorageCompare.ae',
        images: [{ url: image, width: 1200, height: 630, alt: warehouse.name }],
        type: 'website',
        locale: 'en_AE',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [image],
      },
    };
  } catch {
    return {
      title: 'Storage Facility — StorageCompare.ae',
      description: 'Find and book self-storage in UAE on StorageCompare.ae',
    };
  }
}

export default function WarehousePage() {
  return <WarehouseClient />;
}
