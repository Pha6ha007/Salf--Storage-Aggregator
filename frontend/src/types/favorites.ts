// Favorites Types for Self-Storage Aggregator Frontend

export interface FavoriteWarehouse {
  id: number;
  name: string;
  description: string;
  address: {
    full_address: string;
    city: string;
    district: string;
  };
  coordinates: {
    lat: number;
    lon: number;
  };
  rating: number;
  review_count: number;
  price_from: number;
  photo?: string;
  features: string[];
}

export interface Favorite {
  warehouse_id: number;
  warehouse: FavoriteWarehouse;
  added_at: string;
}

export interface FavoritesListResponse {
  success: boolean;
  data: Favorite[];
  pagination: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
    has_next: boolean;
    has_previous: boolean;
  };
}

export interface AddFavoriteDto {
  warehouse_id: number;
}

export interface AddFavoriteResponse {
  success: boolean;
  data: {
    warehouse_id: number;
    added_at: string;
  };
}

export interface RemoveFavoriteResponse {
  success: boolean;
  data: {
    message: string;
  };
}

export interface FavoritesQueryParams {
  page?: number;
  per_page?: number;
}
