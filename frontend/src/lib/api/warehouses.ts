import api from '../api';
import type {
  Warehouse,
  Box,
  Review,
  Media,
  WarehouseSearchParams,
  WarehouseListResponse,
} from '@/types/warehouse';

export const warehousesApi = {
  // Get list of warehouses with filters
  list: async (params: WarehouseSearchParams): Promise<WarehouseListResponse> => {
    const queryParams = new URLSearchParams();

    if (params.query) queryParams.append('query', params.query);
    if (params.emirate) queryParams.append('emirate', params.emirate);
    if (params.minPrice) queryParams.append('minPrice', params.minPrice.toString());
    if (params.maxPrice) queryParams.append('maxPrice', params.maxPrice.toString());
    if (params.boxSize) queryParams.append('boxSize', params.boxSize);
    if (params.latitude) queryParams.append('latitude', params.latitude.toString());
    if (params.longitude) queryParams.append('longitude', params.longitude.toString());
    if (params.radius) queryParams.append('radius', params.radius.toString());
    if (params.sort) queryParams.append('sort', params.sort);
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.offset) queryParams.append('offset', params.offset.toString());

    const response = await api.get<WarehouseListResponse>(
      `/warehouses?${queryParams.toString()}`
    );
    return response.data;
  },

  // Get single warehouse by ID
  getById: async (id: string): Promise<Warehouse> => {
    const response = await api.get<Warehouse>(`/warehouses/${id}`);
    return response.data;
  },

  // Get boxes for a warehouse
  getBoxes: async (warehouseId: string): Promise<Box[]> => {
    const response = await api.get<Box[]>(`/warehouses/${warehouseId}/boxes`);
    return response.data;
  },

  // Get media for a warehouse
  getMedia: async (warehouseId: string): Promise<Media[]> => {
    const response = await api.get<Media[]>(`/warehouses/${warehouseId}/media`);
    return response.data;
  },

  // Get reviews for a warehouse
  getReviews: async (warehouseId: string): Promise<Review[]> => {
    const response = await api.get<Review[]>(`/warehouses/${warehouseId}/reviews`);
    return response.data;
  },
};
