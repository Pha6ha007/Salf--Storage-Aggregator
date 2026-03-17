import api from '../api';

export interface CreateReviewDto {
  booking_id: number;
  rating: number;
  comment: string;
}

export interface ReviewResponse {
  id: number;
  warehouseId: number;
  userId: string;
  bookingId: number;
  rating: number;
  comment: string;
  createdAt: string;
}

export const reviewsApi = {
  /**
   * POST /api/v1/warehouses/:id/reviews
   * Requires auth + completed booking for this warehouse
   */
  create: async (warehouseId: number, data: CreateReviewDto): Promise<ReviewResponse> => {
    const response = await api.post<ReviewResponse>(
      `/warehouses/${warehouseId}/reviews`,
      data,
    );
    return response.data;
  },

  /**
   * PUT /api/v1/reviews/:id
   */
  update: async (reviewId: number, data: Partial<CreateReviewDto>): Promise<ReviewResponse> => {
    const response = await api.put<ReviewResponse>(`/reviews/${reviewId}`, data);
    return response.data;
  },

  /**
   * DELETE /api/v1/reviews/:id
   */
  delete: async (reviewId: number): Promise<void> => {
    await api.delete(`/reviews/${reviewId}`);
  },
};
