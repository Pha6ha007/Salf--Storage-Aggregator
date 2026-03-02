'use client';

import { APIProvider, Map, AdvancedMarker, InfoWindow } from '@vis.gl/react-google-maps';
import { useState } from 'react';
import Link from 'next/link';
import type { Warehouse } from '@/types/warehouse';

interface WarehouseMapProps {
  warehouses: Warehouse[];
  height?: string;
}

export function WarehouseMap({ warehouses, height = '600px' }: WarehouseMapProps) {
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(null);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

  // Calculate map center (average of all warehouse locations or Dubai default)
  const center = warehouses.length > 0
    ? {
        lat: warehouses.reduce((sum, w) => sum + w.latitude, 0) / warehouses.length,
        lng: warehouses.reduce((sum, w) => sum + w.longitude, 0) / warehouses.length,
      }
    : { lat: 25.2048, lng: 55.2708 }; // Dubai default

  if (!apiKey) {
    return (
      <div className="flex items-center justify-center bg-gray-100" style={{ height }}>
        <p className="text-gray-600">Google Maps API key not configured</p>
      </div>
    );
  }

  return (
    <APIProvider apiKey={apiKey}>
      <div style={{ height }}>
        <Map
          defaultCenter={center}
          defaultZoom={11}
          mapId="storagecompare-map"
          gestureHandling="greedy"
          disableDefaultUI={false}
        >
          {warehouses.map((warehouse) => (
            <AdvancedMarker
              key={warehouse.id}
              position={{ lat: warehouse.latitude, lng: warehouse.longitude }}
              onClick={() => setSelectedWarehouse(warehouse)}
            />
          ))}

          {selectedWarehouse && (
            <InfoWindow
              position={{
                lat: selectedWarehouse.latitude,
                lng: selectedWarehouse.longitude,
              }}
              onCloseClick={() => setSelectedWarehouse(null)}
            >
              <div className="p-2 max-w-xs">
                <h3 className="font-semibold text-gray-900 mb-1">
                  {selectedWarehouse.name}
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  {selectedWarehouse.emirate}
                  {selectedWarehouse.district && `, ${selectedWarehouse.district}`}
                </p>
                {selectedWarehouse.rating && (
                  <div className="flex items-center gap-1 mb-2">
                    <svg
                      className="w-4 h-4 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-sm font-semibold">
                      {typeof selectedWarehouse.rating === 'number'
                        ? selectedWarehouse.rating.toFixed(1)
                        : parseFloat(selectedWarehouse.rating || '0').toFixed(1)}
                    </span>
                    <span className="text-xs text-gray-500">
                      ({selectedWarehouse.totalReviews})
                    </span>
                  </div>
                )}
                <Link
                  href={`/warehouse/${selectedWarehouse.id}`}
                  className="inline-block mt-2 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                >
                  View Details
                </Link>
              </div>
            </InfoWindow>
          )}
        </Map>
      </div>
    </APIProvider>
  );
}
