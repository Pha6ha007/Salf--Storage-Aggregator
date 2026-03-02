'use client';

import Link from 'next/link';
import { ChatWarehouse } from '@/types/chat';
import { RatingStars } from '@/components/RatingStars';

interface ChatWarehouseCardProps {
  warehouse: ChatWarehouse;
}

export function ChatWarehouseCard({ warehouse }: ChatWarehouseCardProps) {
  return (
    <div className="px-4 py-2">
      <Link
        href={warehouse.link || `/warehouse/${warehouse.id}`}
        className="block bg-white border border-gray-200 rounded-lg p-3 hover:border-blue-500 hover:shadow-md transition-all"
      >
        <div className="space-y-2">
          {/* Warehouse Name */}
          {warehouse.name && (
            <h4 className="font-semibold text-gray-900 text-sm line-clamp-1">
              {warehouse.name}
            </h4>
          )}

          {/* Location */}
          {warehouse.district && (
            <p className="text-xs text-gray-600">{warehouse.district}</p>
          )}

          {/* Price and Rating */}
          <div className="flex items-center justify-between">
            {warehouse.price && (
              <div className="text-sm font-semibold text-blue-600">
                AED {warehouse.price}
                <span className="text-xs text-gray-500">/mo</span>
              </div>
            )}

            {warehouse.rating && (
              <div className="flex items-center space-x-1">
                <RatingStars rating={warehouse.rating} size="sm" />
                <span className="text-xs text-gray-600">
                  {typeof warehouse.rating === 'number' ? warehouse.rating.toFixed(1) : parseFloat(warehouse.rating).toFixed(1)}
                </span>
              </div>
            )}
          </div>

          {/* View Details Link */}
          <div className="text-xs text-blue-600 font-medium">
            View details →
          </div>
        </div>
      </Link>
    </div>
  );
}
