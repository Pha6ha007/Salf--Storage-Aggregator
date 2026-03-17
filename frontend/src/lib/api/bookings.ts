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
   * GET /api/v1/bookings  (also accessible via /users/me/bookings alias)
   */
  list: async (params?: BookingsQueryParams): Promise<BookingsListResponse> => {
    const queryParams = new URLSearchParams();

    if (params?.status && params.status !== 'all') {
      queryParams.append('status', params.status);
    }
    if (params?.sort) queryParams.append('sort', params.sort);
    if (params?.order) queryParams.append('order', params.order);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.per_page) queryParams.append('per_page', params.per_page.toString());

    const response = await api.get<BookingsListResponse>(
      `/bookings?${queryParams.toString()}`
    );
    return response.data;
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
