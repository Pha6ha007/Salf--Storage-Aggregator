'use client';

import Link from 'next/link';
import type { Box } from '@/types/warehouse';

interface BoxListProps {
  boxes: Box[];
  warehouseId?: string | number;
}

const STATUS_STYLES: Record<string, string> = {
  available: 'bg-green-100 text-green-800',
  reserved: 'bg-yellow-100 text-yellow-800',
  occupied: 'bg-red-100 text-red-800',
  maintenance: 'bg-gray-100 text-gray-800',
};

const STATUS_LABELS: Record<string, string> = {
  available: 'Available',
  reserved: 'Reserved',
  occupied: 'Occupied',
  maintenance: 'Maintenance',
};

const SIZE_LABELS: Record<string, string> = {
  S: 'Small (1–3 m²)',
  M: 'Medium (3–6 m²)',
  L: 'Large (6–12 m²)',
  XL: 'Extra Large (12+ m²)',
};

export function BoxList({ boxes, warehouseId }: BoxListProps) {
  const sortedBoxes = [...boxes].sort((a, b) => {
    const aPrice = Number(a.priceMonthly ?? a.pricePerMonth ?? 0);
    const bPrice = Number(b.priceMonthly ?? b.pricePerMonth ?? 0);
    return aPrice - bPrice;
  });

  if (boxes.length === 0) {
    return (
      <p className="text-gray-600 text-center py-8">
        No units available at this time. Check back later or contact the operator.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {sortedBoxes.map((box) => {
        const price = Number(box.priceMonthly ?? box.pricePerMonth ?? 0);
        const status = box.status ?? 'available';
        const isAvailable = status === 'available' && (box.availableQuantity ?? 1) > 0;

        return (
          <div
            key={box.id}
            className={`border rounded-lg p-4 transition ${
              isAvailable
                ? 'border-gray-200 hover:border-blue-300 hover:shadow-sm'
                : 'border-gray-100 bg-gray-50 opacity-75'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              {/* Left: unit info */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-gray-900 text-sm">
                    Unit {box.boxNumber}
                  </h3>
                  <span
                    className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                      STATUS_STYLES[status] ?? STATUS_STYLES.available
                    }`}
                  >
                    {STATUS_LABELS[status] ?? status}
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  {SIZE_LABELS[box.size] ?? box.size}
                  {box.name ? ` · ${box.name}` : ''}
                </p>
                {/* Quantity */}
                {(box.availableQuantity ?? 0) > 1 && (
                  <p className="text-xs text-gray-400 mt-1">
                    {box.availableQuantity} units available
                  </p>
                )}
              </div>

              {/* Right: price + action */}
              <div className="text-right flex-shrink-0">
                <div className="mb-2">
                  <span className="text-xl font-bold text-gray-900">
                    AED {price.toLocaleString()}
                  </span>
                  <span className="text-sm text-gray-500">/mo</span>
                </div>

                {isAvailable ? (
                  <Link
                    href={`/bookings/new?boxId=${box.id}${warehouseId ? `&warehouseId=${warehouseId}` : ''}`}
                    className="inline-block px-4 py-1.5 bg-blue-600 text-white text-sm font-semibold rounded-md hover:bg-blue-700 transition"
                  >
                    Book
                  </Link>
                ) : (
                  <span className="inline-block px-4 py-1.5 text-sm text-gray-400 border border-gray-200 rounded-md cursor-not-allowed">
                    Unavailable
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
