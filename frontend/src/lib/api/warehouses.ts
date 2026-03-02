import api from '@/lib/api';
import type {
  Warehouse,
  Box,
  Review,
  Media,
  WarehouseSearchParams,
  WarehouseListResponse,
  CreateWarehouseDto,
  UpdateWarehouseDto,
  CreateBoxDto,
  UpdateBoxDto,
  WarehousesQueryParams,
  WarehousesListResponse,
  BoxesListResponse,
} from '@/types/warehouse';

interface ApiResponse<T> {
  data: T;
}

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

  // Operator: List own warehouses
  listOwn: async (params?: WarehousesQueryParams): Promise<WarehousesListResponse> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.per_page) queryParams.append('per_page', params.per_page.toString());
    if (params?.status) queryParams.append('status', params.status);
    if (params?.search) queryParams.append('search', params.search);

    const response = await api.get<WarehousesListResponse>(
      `/operators/me/warehouses?${queryParams.toString()}`
    );
    return response.data;
  },

  // Operator: Create warehouse
  create: async (data: CreateWarehouseDto): Promise<ApiResponse<Warehouse>> => {
    const response = await api.post<ApiResponse<Warehouse>>('/operators/me/warehouses', data);
    return response.data;
  },

  // Operator: Update warehouse
  update: async (id: string, data: UpdateWarehouseDto): Promise<ApiResponse<Warehouse>> => {
    const response = await api.patch<ApiResponse<Warehouse>>(`/operators/warehouses/${id}`, data);
    return response.data;
  },

  // Operator: Delete warehouse
  delete: async (id: string): Promise<void> => {
    await api.delete(`/operators/warehouses/${id}`);
  },

  // Operator: Publish warehouse (draft → pending_moderation)
  publish: async (id: string): Promise<ApiResponse<Warehouse>> => {
    const response = await api.patch<ApiResponse<Warehouse>>(
      `/operators/warehouses/${id}/publish`
    );
    return response.data;
  },

  // Operator: Unpublish warehouse (active → inactive)
  unpublish: async (id: string): Promise<ApiResponse<Warehouse>> => {
    const response = await api.patch<ApiResponse<Warehouse>>(
      `/operators/warehouses/${id}/unpublish`
    );
    return response.data;
  },
};

export const boxesApi = {
  // Operator: List boxes for warehouse
  list: async (warehouseId: string, page = 1, perPage = 50): Promise<BoxesListResponse> => {
    const response = await api.get<BoxesListResponse>(
      `/operators/warehouses/${warehouseId}/boxes?page=${page}&per_page=${perPage}`
    );
    return response.data;
  },

  // Operator: Get single box
  getById: async (boxId: string): Promise<ApiResponse<Box>> => {
    const response = await api.get<ApiResponse<Box>>(`/operators/boxes/${boxId}`);
    return response.data;
  },

  // Operator: Create box
  create: async (warehouseId: string, data: CreateBoxDto): Promise<ApiResponse<Box>> => {
    const response = await api.post<ApiResponse<Box>>(
      `/operators/warehouses/${warehouseId}/boxes`,
      data
    );
    return response.data;
  },

  // Operator: Update box
  update: async (boxId: string, data: UpdateBoxDto): Promise<ApiResponse<Box>> => {
    const response = await api.patch<ApiResponse<Box>>(`/operators/boxes/${boxId}`, data);
    return response.data;
  },

  // Operator: Delete box
  delete: async (boxId: string): Promise<void> => {
    await api.delete(`/operators/boxes/${boxId}`);
  },

  // Operator: Bulk create boxes
  bulkCreate: async (
    warehouseId: string,
    boxes: CreateBoxDto[]
  ): Promise<ApiResponse<Box[]>> => {
    const response = await api.post<ApiResponse<Box[]>>(
      `/operators/warehouses/${warehouseId}/boxes/bulk`,
      { boxes }
    );
    return response.data;
  },
};
