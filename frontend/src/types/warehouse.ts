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

// Operator-specific types
export interface Address {
  full_address: string;
  city: string;
  district: string;
  street?: string;
  building?: string;
  landmark?: string;
  latitude: number;
  longitude: number;
  google_place_id?: string;
}

export interface OperatingHours {
  monday?: DayHours;
  tuesday?: DayHours;
  wednesday?: DayHours;
  thursday?: DayHours;
  friday?: DayHours;
  saturday?: DayHours;
  sunday?: DayHours;
  is_24_7?: boolean;
}

export interface DayHours {
  open: string;
  close: string;
  is_closed?: boolean;
}

export interface WarehouseFeatures {
  climate_controlled?: boolean;
  security_cameras?: boolean;
  access_24_7?: boolean;
  parking_available?: boolean;
  loading_dock?: boolean;
  insurance_available?: boolean;
  online_payment?: boolean;
  [key: string]: boolean | undefined;
}

export interface BoxDimensions {
  length: number;
  width: number;
  height: number;
  unit: 'meters' | 'feet';
}

export interface BoxFeatures {
  climate_controlled?: boolean;
  ground_floor?: boolean;
  drive_up_access?: boolean;
  [key: string]: boolean | undefined;
}

export interface CreateWarehouseDto {
  name: string;
  description: string;
  address: Address;
  operating_hours: OperatingHours;
  features: WarehouseFeatures;
}

export interface UpdateWarehouseDto {
  name?: string;
  description?: string;
  address?: Address;
  operating_hours?: OperatingHours;
  features?: WarehouseFeatures;
  status?: WarehouseStatus;
}

export interface CreateBoxDto {
  number: string;
  size: string;
  dimensions: BoxDimensions;
  floor?: number;
  price_per_month: number;
  features?: BoxFeatures;
}

export interface UpdateBoxDto {
  number?: string;
  size?: string;
  dimensions?: BoxDimensions;
  floor?: number;
  status?: BoxStatus;
  price_per_month?: number;
  features?: BoxFeatures;
}

export interface WarehousesQueryParams {
  page?: number;
  per_page?: number;
  status?: WarehouseStatus;
  search?: string;
}

export interface WarehousesListResponse {
  data: Warehouse[];
  pagination: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
    has_next: boolean;
    has_previous: boolean;
  };
}

export interface BoxesListResponse {
  data: Box[];
  pagination: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
    has_next: boolean;
    has_previous: boolean;
  };
}
