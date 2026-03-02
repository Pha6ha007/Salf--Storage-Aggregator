import api from '../api';
import type {
  BookingsListResponse,
  BookingDetailResponse,
  BookingsQueryParams,
  CancelBookingDto,
  CancelBookingResponse,
} from '@/types/booking';

export const bookingsApi = {
  /**
   * Get user's bookings list
   * GET /api/v1/users/me/bookings
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
      `/users/me/bookings?${queryParams.toString()}`
    );
    return response.data;
  },

  /**
   * Get booking details by ID
   * GET /api/v1/users/me/bookings/{id}
   */
  getById: async (id: number): Promise<BookingDetailResponse> => {
    const response = await api.get<BookingDetailResponse>(`/users/me/bookings/${id}`);
    return response.data;
  },

  /**
   * Cancel booking
   * PATCH /api/v1/bookings/{id}/cancel
   */
  cancel: async (id: number, data?: CancelBookingDto): Promise<CancelBookingResponse> => {
    const response = await api.patch<CancelBookingResponse>(`/bookings/${id}/cancel`, data);
    return response.data;
  },
};
