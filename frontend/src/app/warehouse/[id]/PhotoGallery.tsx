'use client';

import { useState, useEffect } from 'react';
import { warehousesApi } from '@/lib/api/warehouses';
import type { Media } from '@/types/warehouse';

interface PhotoGalleryProps {
  warehouseId: string;
}

export function PhotoGallery({ warehouseId }: PhotoGalleryProps) {
  const [media, setMedia] = useState<Media[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    warehousesApi
      .getMedia(warehouseId)
      .then((data) => {
        setMedia(data);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, [warehouseId]);

  if (isLoading) {
    return (
      <div className="w-full h-96 bg-gray-200 animate-pulse flex items-center justify-center">
        <p className="text-gray-500">Loading photos...</p>
      </div>
    );
  }

  if (media.length === 0) {
    return (
      <div className="w-full h-96 bg-gray-200 flex items-center justify-center">
        <p className="text-gray-500">No photos available</p>
      </div>
    );
  }

  const selectedPhoto = media[selectedIndex];

  return (
    <div className="bg-black">
      {/* Main Photo */}
      <div className="relative h-96 md:h-[500px] flex items-center justify-center">
        <img
          src={selectedPhoto.url}
          alt={`Photo ${selectedIndex + 1}`}
          className="max-h-full max-w-full object-contain"
        />

        {/* Navigation Arrows */}
        {media.length > 1 && (
          <>
            <button
              onClick={() =>
                setSelectedIndex((i) => (i === 0 ? media.length - 1 : i - 1))
              }
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              onClick={() => setSelectedIndex((i) => (i === media.length - 1 ? 0 : i + 1))}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </>
        )}

        {/* Photo Counter */}
        <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
          {selectedIndex + 1} / {media.length}
        </div>
      </div>

      {/* Thumbnail Strip */}
      {media.length > 1 && (
        <div className="bg-white border-t">
          <div className="mx-auto max-w-7xl px-4 py-4 overflow-x-auto">
            <div className="flex gap-2">
              {media.map((photo, index) => (
                <button
                  key={photo.id}
                  onClick={() => setSelectedIndex(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 ${
                    index === selectedIndex
                      ? 'border-blue-600'
                      : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  <img
                    src={photo.url}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
