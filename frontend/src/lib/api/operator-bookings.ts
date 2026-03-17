import api from '@/lib/api';
import type { BookingStatus } from '@/types/booking';

interface BookingsQueryParams {
  status?: 'all' | BookingStatus;
  page?: number;
  per_page?: number;
  warehouse_id?: number;
}

interface Booking {
  id: number;
  booking_number: string;
  status: BookingStatus;
  warehouse: {
    id: number;
    name: string;
  };
  box: {
    id: number;
    boxNumber: string;
    size: string;
  };
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  startDate: string;
  endDate: string;
  durationMonths: number;
  monthlyPrice: number;
  priceTotal: number;
  createdAt: string;
  updatedAt: string;
}

interface BookingsListResponse {
  data: Booking[];
  pagination?: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
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
  /**
   * List bookings for operator's warehouses
   * GET /api/v1/operator/bookings
   */
  list: async (params?: BookingsQueryParams): Promise<BookingsListResponse> => {
    const queryParams = new URLSearchParams();
    if (params?.status && params.status !== 'all') {
      queryParams.append('status', params.status);
    }
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.per_page) queryParams.append('per_page', params.per_page.toString());
    if (params?.warehouse_id) queryParams.append('warehouse_id', params.warehouse_id.toString());

    const response = await api.get<BookingsListResponse | Booking[]>(
      `/operator/bookings?${queryParams.toString()}`
    );
    // Backend may return array directly or { data: [], pagination: {} }
    const raw = response.data;
    if (Array.isArray(raw)) {
      return { data: raw, pagination: undefined };
    }
    return raw as BookingsListResponse;
  },

  /**
   * Get single booking (operator view)
   * GET /api/v1/operator/bookings/:id
   */
  getById: async (id: number): Promise<ApiResponse<Booking>> => {
    const response = await api.get<ApiResponse<Booking>>(`/operator/bookings/${id}`);
    return response.data;
  },

  /**
   * Confirm pending booking
   * POST /api/v1/operator/bookings/:id/confirm
   */
  confirm: async (id: number, data?: ConfirmBookingDto): Promise<ApiResponse<Booking>> => {
    const response = await api.post<ApiResponse<Booking>>(
      `/operator/bookings/${id}/confirm`,
      data
    );
    return response.data;
  },

  /**
   * Reject pending booking
   * PUT /api/v1/operator/bookings/:id/reject
   */
  reject: async (id: number, data?: RejectBookingDto): Promise<ApiResponse<Booking>> => {
    const response = await api.put<ApiResponse<Booking>>(
      `/operator/bookings/${id}/reject`,
      data
    );
    return response.data;
  },

  /**
   * Mark booking as completed
   * POST /api/v1/operator/bookings/:id/complete
   */
  complete: async (id: number): Promise<ApiResponse<Booking>> => {
    const response = await api.post<ApiResponse<Booking>>(
      `/operator/bookings/${id}/complete`
    );
    return response.data;
  },

  /**
   * Cancel booking (operator)
   * POST /api/v1/operator/bookings/:id/cancel
   */
  cancel: async (id: number, reason?: string): Promise<ApiResponse<Booking>> => {
    const response = await api.post<ApiResponse<Booking>>(
      `/operator/bookings/${id}/cancel`,
      { cancelReason: reason }
    );
    return response.data;
  },
};
