// Booking Types for Self-Storage Aggregator Frontend

export type BookingStatus =
  | 'pending'
  | 'confirmed'
  | 'active'
  | 'completed'
  | 'cancelled'
  | 'rejected';

export type PaymentStatus = 'pending' | 'paid' | 'refunded' | 'failed';

export interface BookingWarehouse {
  id: number;
  name: string;
  address: {
    full_address: string;
    city: string;
    district?: string;
  };
  photo?: string;
  phone?: string;
  email?: string;
}

export interface BookingBox {
  id: number;
  size: string;
  dimensions: {
    width: number;
    length: number;
    height: number;
  };
  number: string;
}

export interface BookingHistoryItem {
  status: BookingStatus;
  timestamp: string;
  actor: 'user' | 'operator' | 'system';
  note?: string;
}

export interface Booking {
  id: number;
  booking_number: string;
  status: BookingStatus;
  warehouse: BookingWarehouse;
  box: BookingBox;
  start_date: string;
  end_date: string;
  duration_months: number;
  price_per_month: number;
  total_price: number;
  deposit?: number;
  contact_name?: string;
  contact_phone?: string;
  contact_email?: string;
  notes?: string;
  payment_status: PaymentStatus;
  cancelled_by?: 'user' | 'operator' | 'system';
  cancel_reason?: string;
  cancelled_at?: string;
  confirmed_at?: string;
  history?: BookingHistoryItem[];
  created_at: string;
  updated_at: string;
}

export interface BookingsListResponse {
  success: boolean;
  data: Booking[];
  pagination: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
    has_next: boolean;
    has_previous: boolean;
  };
}

export interface BookingDetailResponse {
  success: boolean;
  data: Booking;
}

export interface BookingsQueryParams {
  status?: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled' | 'rejected' | 'all';
  sort?: 'created_at' | 'start_date' | 'end_date';
  order?: 'asc' | 'desc';
  page?: number;
  per_page?: number;
}

export interface CancelBookingDto {
  cancel_reason?: string;
}

export interface CancelBookingResponse {
  success: boolean;
  data: Booking;
}
