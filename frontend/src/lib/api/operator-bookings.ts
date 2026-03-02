import api from '@/lib/api';
import type { BookingStatus } from '@/types/booking';

interface BookingsQueryParams {
  status?: 'all' | BookingStatus;
  page?: number;
  per_page?: number;
  warehouse_id?: string;
}

interface Booking {
  id: number;
  booking_number: string;
  status: BookingStatus;
  warehouse: {
    id: string;
    name: string;
  };
  box: {
    id: string;
    number: string;
    size: string;
  };
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  start_date: string;
  end_date: string;
  duration_months: number;
  price_per_month: number;
  total_price: number;
  deposit?: number;
  created_at: string;
  updated_at: string;
}

interface BookingsListResponse {
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

interface ApiResponse<T> {
  data: T;
}

interface ConfirmBookingDto {
  notes?: string;
}

interface RejectBookingDto {
  reason?: string;
}

export const operatorBookingsApi = {
  // List bookings for operator's warehouses
  list: async (params?: BookingsQueryParams): Promise<BookingsListResponse> => {
    const queryParams = new URLSearchParams();
    if (params?.status && params.status !== 'all') {
      queryParams.append('status', params.status);
    }
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.per_page) queryParams.append('per_page', params.per_page.toString());
    if (params?.warehouse_id) queryParams.append('warehouse_id', params.warehouse_id);

    const response = await api.get<BookingsListResponse>(
      `/operators/me/bookings?${queryParams.toString()}`
    );
    return response.data;
  },

  // Get single booking
  getById: async (id: number): Promise<ApiResponse<Booking>> => {
    const response = await api.get<ApiResponse<Booking>>(`/operators/bookings/${id}`);
    return response.data;
  },

  // Confirm pending booking
  confirm: async (id: number, data?: ConfirmBookingDto): Promise<ApiResponse<Booking>> => {
    const response = await api.patch<ApiResponse<Booking>>(
      `/operators/bookings/${id}/confirm`,
      data
    );
    return response.data;
  },

  // Reject pending booking
  reject: async (id: number, data?: RejectBookingDto): Promise<ApiResponse<Booking>> => {
    const response = await api.patch<ApiResponse<Booking>>(
      `/operators/bookings/${id}/reject`,
      data
    );
    return response.data;
  },

  // Mark booking as completed
  complete: async (id: number): Promise<ApiResponse<Booking>> => {
    const response = await api.patch<ApiResponse<Booking>>(
      `/operators/bookings/${id}/complete`
    );
    return response.data;
  },
};
