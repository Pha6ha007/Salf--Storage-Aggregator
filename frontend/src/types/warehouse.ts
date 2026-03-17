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
  rating: number | string | null;  // Can be string from backend
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

  // Computed/aggregated fields (from backend list endpoint)
  minPrice?: number | null;
  availableSizes?: string[] | null;
  primaryPhoto?: string | null;
  total_boxes?: number;
  available_boxes?: number;
  occupied_boxes?: number;

  // Feature flags (alternative representation of features)
  hasClimateControl?: boolean;
  has24x7Access?: boolean;
  hasSecurityCameras?: boolean;
  hasParkingSpace?: boolean;
  hasInsurance?: boolean;
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
  search?: string;
  emirate?: string;
  district?: string;
  hasClimateControl?: boolean;
  has24x7Access?: boolean;
  hasSecurityCameras?: boolean;
  hasInsurance?: boolean;
  hasParkingSpace?: boolean;
  minRating?: number;
  latitude?: number;
  longitude?: number;
  radiusKm?: number;
  status?: WarehouseStatus;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface WarehouseListResponse {
  data: Warehouse[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
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
  description?: string;
  address: string;
  emirate: string;
  district?: string;
  hasClimateControl?: boolean;
  has24x7Access?: boolean;
  hasSecurityCameras?: boolean;
  hasInsurance?: boolean;
  hasParkingSpace?: boolean;
  workingHours?: Record<string, string>;
  contactPhone?: string;
  contactEmail?: string;
}

export interface UpdateWarehouseDto {
  name?: string;
  description?: string;
  address?: string;
  emirate?: string;
  district?: string;
  hasClimateControl?: boolean;
  has24x7Access?: boolean;
  hasSecurityCameras?: boolean;
  hasInsurance?: boolean;
  hasParkingSpace?: boolean;
  workingHours?: Record<string, string>;
  contactPhone?: string;
  contactEmail?: string;
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
