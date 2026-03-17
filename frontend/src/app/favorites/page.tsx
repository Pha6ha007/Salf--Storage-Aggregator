'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Heart, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { favoritesApi } from '@/lib/api/favorites';
import { EmptyState } from '@/components/EmptyState';
import { WarehouseCard } from '@/components/WarehouseCard';

export default function FavoritesPage() {
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['favorites'],
    queryFn: () => favoritesApi.list({ page: 1, per_page: 50 }),
  });

  const removeMutation = useMutation({
    mutationFn: favoritesApi.remove,
    onSuccess: () => {
      toast.success('Removed from favorites');
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
    onError: () => toast.error('Failed to remove from favorites'),
  });

  const favorites = data?.data ?? [];

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-text-primary">My Favorites</h1>
        <p className="mt-2 text-text-secondary">
          {data?.pagination.total ?? 0} saved warehouses
        </p>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
        </div>
      )}

      {isError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600">Failed to load favorites. Please try again.</p>
        </div>
      )}

      {!isLoading && !isError && favorites.length === 0 && (
        <EmptyState
          icon={Heart}
          title="No favorites yet"
          description="Browse warehouses and heart the ones you like to save them here."
          actionLabel="Browse Warehouses"
          actionHref="/catalog"
        />
      )}

      {!isLoading && !isError && favorites.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((favorite) => (
            <div key={favorite.warehouse_id} className="relative">
              <WarehouseCard
                warehouse={{
                  id: favorite.warehouse.id.toString(),
                  name: favorite.warehouse.name,
                  emirate: favorite.warehouse.emirate,
                  rating: favorite.warehouse.rating,
                  totalReviews: favorite.warehouse.review_count,
                  primaryPhoto: favorite.warehouse.primary_image ?? undefined,
                }}
                isFavorite={true}
                onFavoriteClick={() => removeMutation.mutate(favorite.warehouse_id)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
