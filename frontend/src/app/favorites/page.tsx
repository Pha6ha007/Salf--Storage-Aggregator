'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Heart } from 'lucide-react';
import { toast } from 'sonner';
import { favoritesApi } from '@/lib/api/favorites';
import { EmptyState } from '@/components/EmptyState';
import { WarehouseCard } from '@/components/WarehouseCard';

export default function FavoritesPage() {
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['favorites', { page }],
    queryFn: () => favoritesApi.list({ page, per_page: 12 }),
  });

  const removeFavoriteMutation = useMutation({
    mutationFn: favoritesApi.remove,
    onMutate: async (warehouseId) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: ['favorites'] });
      const previousFavorites = queryClient.getQueryData(['favorites', { page }]);

      queryClient.setQueryData(['favorites', { page }], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          data: old.data.filter((fav: any) => fav.warehouse_id !== warehouseId),
        };
      });

      return { previousFavorites };
    },
    onSuccess: () => {
      toast.success('Removed from favorites');
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
    onError: (error, warehouseId, context) => {
      // Rollback optimistic update
      if (context?.previousFavorites) {
        queryClient.setQueryData(['favorites', { page }], context.previousFavorites);
      }
      toast.error('Failed to remove from favorites');
    },
  });

  const handleRemoveFavorite = (warehouseId: number) => {
    removeFavoriteMutation.mutate(warehouseId);
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex items-baseline justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">My Favorites</h1>
          <p className="mt-2 text-text-secondary">
            {data?.pagination.total || 0} saved warehouses
          </p>
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-text-secondary">Loading favorites...</p>
        </div>
      )}

      {/* Error */}
      {isError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600">Failed to load favorites</p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !isError && data?.data.length === 0 && (
        <EmptyState
          icon={Heart}
          title="No favorites yet"
          description="Start adding warehouses to your favorites to find them easily later."
          actionLabel="Browse Warehouses"
          actionHref="/catalog"
        />
      )}

      {/* Favorites Grid */}
      {!isLoading && !isError && data && data.data.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="favorites-list">
            {data.data.map((favorite) => (
              <div key={favorite.warehouse_id} className="relative">
                <WarehouseCard
                  warehouse={{
                    id: favorite.warehouse.id.toString(),
                    name: favorite.warehouse.name,
                    emirate: favorite.warehouse.address.city,
                    district: favorite.warehouse.address.district,
                    rating: favorite.warehouse.rating,
                    totalReviews: favorite.warehouse.review_count,
                    minPrice: favorite.warehouse.price_from,
                    verified: true,
                    availableSizes: [],
                    photoUrl: favorite.warehouse.photo || '',
                  }}
                />
                <button
                  onClick={() => handleRemoveFavorite(favorite.warehouse_id)}
                  className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow"
                  data-testid="favorite-remove-button"
                  aria-label="Remove from favorites"
                >
                  <Heart className="h-5 w-5 fill-red-500 text-red-500" />
                </button>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {data.pagination.total_pages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={!data.pagination.has_previous}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-sm text-text-secondary">
                Page {data.pagination.page} of {data.pagination.total_pages}
              </span>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={!data.pagination.has_next}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
