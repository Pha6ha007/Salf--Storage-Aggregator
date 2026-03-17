'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SearchBar } from '@/components/SearchBar';
import { WarehouseCard } from '@/components/WarehouseCard';
import { FilterSidebar, FilterValues } from '@/components/FilterSidebar';
import { WarehouseMap } from '@/components/WarehouseMap';
import { warehousesApi } from '@/lib/api/warehouses';
import type { WarehouseSearchParams } from '@/types/warehouse';

export function CatalogClient() {
  const searchParams = useSearchParams();
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  const [filters, setFilters] = useState<FilterValues>({
    emirate: searchParams.get('emirate') || '',
    boxSize: searchParams.get('boxSize') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    features: [],
  });

  const buildSearchParams = (): WarehouseSearchParams => {
    const params: WarehouseSearchParams = {
      limit: pageSize,
      page: currentPage,
      sortBy: 'rating',
      sortOrder: 'desc',
      status: 'active',
    };
    if (filters.emirate) params.emirate = filters.emirate;
    if (filters.minPrice) params.minPrice = Number(filters.minPrice);
    if (filters.maxPrice) params.maxPrice = Number(filters.maxPrice);
    if (filters.boxSize) params.boxSize = filters.boxSize;
    return params;
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ['warehouses', filters, currentPage],
    queryFn: () => warehousesApi.list(buildSearchParams()),
  });

  const handleFilterChange = (newFilters: FilterValues) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const totalPages = data ? Math.ceil(data.meta.total / pageSize) : 0;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow bg-gray-50">
        <div className="bg-white border-b">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
            <SearchBar variant="compact" />
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Storage Facilities</h1>
              {data && (
                <p className="text-gray-600 mt-1">
                  {data.meta.total} {data.meta.total === 1 ? 'facility' : 'facilities'} found
                </p>
              )}
            </div>
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded-md font-medium ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
              >
                List View
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`px-4 py-2 rounded-md font-medium ${viewMode === 'map' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
              >
                Map View
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="hidden lg:block">
              <FilterSidebar onFilterChange={handleFilterChange} initialFilters={filters} />
            </div>

            <div className="lg:col-span-3">
              <div className="md:hidden mb-4 flex gap-2">
                <button onClick={() => setViewMode('list')} className={`flex-1 px-4 py-2 rounded-md font-medium ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}>List</button>
                <button onClick={() => setViewMode('map')} className={`flex-1 px-4 py-2 rounded-md font-medium ${viewMode === 'map' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}>Map</button>
              </div>

              {isLoading && (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
                  <p className="mt-4 text-gray-600">Loading warehouses...</p>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                  <p className="text-red-800">Failed to load warehouses. Please try again later.</p>
                </div>
              )}

              {!isLoading && !error && viewMode === 'list' && data && (
                <>
                  {data.data.length === 0 ? (
                    <div className="bg-white rounded-lg p-12 text-center">
                      <p className="text-gray-600 text-lg">No storage facilities found matching your criteria.</p>
                      <p className="text-gray-500 mt-2">Try adjusting your filters or search terms.</p>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {data.data.map((warehouse) => (
                          <WarehouseCard key={warehouse.id} warehouse={warehouse} />
                        ))}
                      </div>
                      {totalPages > 1 && (
                        <div className="mt-8 flex justify-center gap-2">
                          <button
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Previous
                          </button>
                          <span className="px-4 py-2">Page {currentPage} of {totalPages}</span>
                          <button
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            disabled={currentPage >= totalPages}
                            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Next
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </>
              )}

              {!isLoading && !error && viewMode === 'map' && data && (
                <div className="bg-white rounded-lg overflow-hidden shadow-md">
                  <WarehouseMap warehouses={data.data} />
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
