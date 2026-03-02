export type WarehouseStatus = 'draft' | 'pending_moderation' | 'active' | 'inactive' | 'blocked';
export type BoxStatus = 'available' | 'reserved' | 'occupied' | 'maintenance';

export interface Warehouse {
  id: string;
  name: string;
  description: string | null;
  address: string;
  emirate: string;
  district: string | null;
  latitude: number;
  longitude: number;
  status: WarehouseStatus;
  rating: number | null;
  totalReviews: number;
  features: string[] | null;
  operatingHours: Record<string, unknown> | null;
  operatorId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;

  // Related data
  media?: Media[];
  boxes?: Box[];
  operator?: {
    id: string;
    businessName: string | null;
    contactEmail: string | null;
    contactPhone: string | null;
  };
}

export interface Box {
  id: string;
  warehouseId: string;
  boxNumber: string;
  size: string;
  pricePerMonth: number;
  status: BoxStatus;
  features: string[] | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface Media {
  id: string;
  warehouseId: string;
  url: string;
  type: string;
  order: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface Review {
  id: string;
  warehouseId: string;
  userId: string;
  bookingId: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  user?: {
    id: string;
    email: string;
  };
}

export interface WarehouseSearchParams {
  query?: string;
  emirate?: string;
  minPrice?: number;
  maxPrice?: number;
  boxSize?: string;
  latitude?: number;
  longitude?: number;
  radius?: number;
  sort?: 'rating' | 'price_asc' | 'price_desc' | 'distance';
  limit?: number;
  offset?: number;
}

export interface WarehouseListResponse {
  data: Warehouse[];
  total: number;
  limit: number;
  offset: number;
}
