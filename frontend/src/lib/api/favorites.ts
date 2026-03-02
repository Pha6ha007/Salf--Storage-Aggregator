import api from '../api';
import type {
  FavoritesListResponse,
  AddFavoriteDto,
  AddFavoriteResponse,
  RemoveFavoriteResponse,
  FavoritesQueryParams,
} from '@/types/favorites';

export const favoritesApi = {
  /**
   * Get user's favorites list
   * GET /api/v1/users/me/favorites
   */
  list: async (params?: FavoritesQueryParams): Promise<FavoritesListResponse> => {
    const queryParams = new URLSearchParams();

    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.per_page) queryParams.append('per_page', params.per_page.toString());

    const response = await api.get<FavoritesListResponse>(
      `/users/me/favorites?${queryParams.toString()}`
    );
    return response.data;
  },

  /**
   * Add warehouse to favorites
   * POST /api/v1/users/me/favorites
   */
  add: async (data: AddFavoriteDto): Promise<AddFavoriteResponse> => {
    const response = await api.post<AddFavoriteResponse>('/users/me/favorites', data);
    return response.data;
  },

  /**
   * Remove warehouse from favorites
   * DELETE /api/v1/users/me/favorites/{warehouse_id}
   */
  remove: async (warehouseId: number): Promise<RemoveFavoriteResponse> => {
    const response = await api.delete<RemoveFavoriteResponse>(
      `/users/me/favorites/${warehouseId}`
    );
    return response.data;
  },
};
