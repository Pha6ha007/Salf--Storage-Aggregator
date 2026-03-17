import api from '../api';
import type {
  BookingsListResponse,
  BookingDetailResponse,
  BookingsQueryParams,
  CancelBookingDto,
  CancelBookingResponse,
  CreateBookingDto,
} from '@/types/booking';

export const bookingsApi = {
  /**
   * Create a new booking
   * POST /api/v1/bookings
   */
  create: async (data: CreateBookingDto): Promise<{ booking_number: string; id: number; status: string }> => {
    const response = await api.post('/bookings', data);
    return response.data;
  },

  /**
   * Get user's bookings list
   * GET /api/v1/bookings — returns array (no pagination in MVP)
   */
  list: async (params?: BookingsQueryParams): Promise<{ data: any[]; pagination: null }> => {
    const queryParams = new URLSearchParams();
    if (params?.status && params.status !== 'all') {
      queryParams.append('status', params.status);
    }

    const response = await api.get<any>(`/bookings?${queryParams.toString()}`);
    // Backend returns raw array or wrapped object
    const raw = response.data;
    const data = Array.isArray(raw) ? raw : (raw?.data ?? []);
    return { data, pagination: null };
  },

  /**
   * Get booking details by ID
   * GET /api/v1/bookings/{id}
   */
  getById: async (id: number): Promise<BookingDetailResponse> => {
    const response = await api.get<BookingDetailResponse>(`/bookings/${id}`);
    return response.data;
  },

  /**
   * Cancel booking
   * POST /api/v1/bookings/{id}/cancel
   */
  cancel: async (id: number, data?: CancelBookingDto): Promise<CancelBookingResponse> => {
    const response = await api.post<CancelBookingResponse>(`/bookings/${id}/cancel`, data);
    return response.data;
  },
};
