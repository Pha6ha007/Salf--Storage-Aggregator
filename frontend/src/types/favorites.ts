// Favorites Types — matching backend FavoriteResponseDto shape

export interface FavoriteWarehouse {
  id: number;
  name: string;
  address: string;       // flat string, not nested object
  emirate: string;
  rating: number;
  review_count: number;
  primary_image: string | null;
}

export interface Favorite {
  id: number;
  warehouse_id: number;
  warehouse: FavoriteWarehouse;
  created_at: string;
}

export interface FavoritesListResponse {
  data: Favorite[];
  pagination: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
}

export interface AddFavoriteDto {
  warehouse_id: number;   // backend expects snake_case body field
}

export interface AddFavoriteResponse {
  data: Favorite;
}

export interface RemoveFavoriteResponse {
  data: { message: string };
}

export interface FavoritesQueryParams {
  page?: number;
  per_page?: number;
}
