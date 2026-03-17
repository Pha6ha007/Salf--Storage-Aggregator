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
} from '@/types/warehouse';

interface ApiResponse<T> {
  data: T;
}

interface WarehousesListResponse {
  data: Warehouse[];
  pagination: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
  summary?: {
    total_warehouses: number;
    active_warehouses: number;
    total_monthly_revenue: number;
  };
}

interface BoxesListResponse {
  data: Box[];
  pagination?: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
}

interface WarehousesQueryParams {
  page?: number;
  per_page?: number;
  status?: string;
  search?: string;
}

export const warehousesApi = {
  // ── Public endpoints ────────────────────────────────────────────────────────

  /**
   * GET /api/v1/warehouses — search/list public catalog
   */
  list: async (params: WarehouseSearchParams): Promise<WarehouseListResponse> => {
    const queryParams = new URLSearchParams();

    if (params.search) queryParams.append('search', params.search);
    if (params.emirate) queryParams.append('emirate', params.emirate);
    if (params.district) queryParams.append('district', params.district);
    if (params.hasClimateControl !== undefined) queryParams.append('hasClimateControl', params.hasClimateControl.toString());
    if (params.has24x7Access !== undefined) queryParams.append('has24x7Access', params.has24x7Access.toString());
    if (params.hasSecurityCameras !== undefined) queryParams.append('hasSecurityCameras', params.hasSecurityCameras.toString());
    if (params.hasInsurance !== undefined) queryParams.append('hasInsurance', params.hasInsurance.toString());
    if (params.hasParkingSpace !== undefined) queryParams.append('hasParkingSpace', params.hasParkingSpace.toString());
    if (params.minRating) queryParams.append('minRating', params.minRating.toString());
    if (params.latitude) queryParams.append('latitude', params.latitude.toString());
    if (params.longitude) queryParams.append('longitude', params.longitude.toString());
    if (params.radiusKm) queryParams.append('radiusKm', params.radiusKm.toString());
    if (params.status) queryParams.append('status', params.status);
    if (params.minPrice != null) queryParams.append('minPrice', params.minPrice.toString());
    if (params.maxPrice != null) queryParams.append('maxPrice', params.maxPrice.toString());
    if (params.boxSize) queryParams.append('boxSize', params.boxSize);
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);

    const response = await api.get<WarehouseListResponse>(
      `/warehouses?${queryParams.toString()}`
    );
    return response.data;
  },

  /**
   * GET /api/v1/warehouses/:id — public warehouse detail
   */
  getById: async (id: string | number): Promise<Warehouse> => {
    const response = await api.get<Warehouse>(`/warehouses/${id}`);
    return response.data;
  },

  /**
   * GET /api/v1/warehouses/:id/boxes — public box list for warehouse
   */
  getBoxes: async (warehouseId: string | number): Promise<Box[]> => {
    const response = await api.get<Box[]>(`/warehouses/${warehouseId}/boxes`);
    return response.data;
  },

  /**
   * GET /api/v1/warehouses/:id/media
   */
  getMedia: async (warehouseId: string | number): Promise<Media[]> => {
    const response = await api.get<Media[]>(`/warehouses/${warehouseId}/media`);
    return response.data;
  },

  /**
   * GET /api/v1/warehouses/:id/reviews
   */
  getReviews: async (warehouseId: string | number): Promise<Review[]> => {
    const response = await api.get<Review[]>(`/warehouses/${warehouseId}/reviews`);
    return response.data;
  },

  // ── Operator endpoints (/operator/ prefix) ──────────────────────────────────

  /**
   * GET /api/v1/operator/warehouses — list own warehouses
   */
  listOwn: async (params?: WarehousesQueryParams): Promise<WarehousesListResponse> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.per_page) queryParams.append('limit', params.per_page.toString());
    if (params?.status) queryParams.append('status', params.status);
    if (params?.search) queryParams.append('search', params.search);

    const response = await api.get<WarehousesListResponse>(
      `/operator/warehouses?${queryParams.toString()}`
    );
    return response.data;
  },

  /**
   * POST /api/v1/operator/warehouses — create warehouse
   */
  create: async (data: CreateWarehouseDto): Promise<ApiResponse<Warehouse>> => {
    const response = await api.post<ApiResponse<Warehouse>>('/operator/warehouses', data);
    return response.data;
  },

  /**
   * PATCH /api/v1/operator/warehouses/:id — update warehouse
   */
  update: async (id: string | number, data: UpdateWarehouseDto): Promise<ApiResponse<Warehouse>> => {
    const response = await api.patch<ApiResponse<Warehouse>>(`/operator/warehouses/${id}`, data);
    return response.data;
  },

  /**
   * DELETE /api/v1/operator/warehouses/:id — soft delete
   */
  delete: async (id: string | number): Promise<void> => {
    await api.delete(`/operator/warehouses/${id}`);
  },

  /**
   * PATCH /api/v1/operator/warehouses/:id/status — change status
   */
  changeStatus: async (id: string | number, status: string): Promise<ApiResponse<Warehouse>> => {
    const response = await api.patch<ApiResponse<Warehouse>>(
      `/operator/warehouses/${id}/status`,
      { status }
    );
    return response.data;
  },

  /** @deprecated Use changeStatus with 'pending_moderation' */
  publish: async (id: string | number): Promise<ApiResponse<Warehouse>> => {
    return warehousesApi.changeStatus(id, 'pending_moderation');
  },

  /** @deprecated Use changeStatus with 'inactive' */
  unpublish: async (id: string | number): Promise<ApiResponse<Warehouse>> => {
    return warehousesApi.changeStatus(id, 'inactive');
  },
};

export const boxesApi = {
  /**
   * GET /api/v1/operator/warehouses/:warehouseId/boxes — list boxes for warehouse (operator)
   */
  list: async (warehouseId: string | number, page = 1, perPage = 50): Promise<BoxesListResponse> => {
    const response = await api.get<BoxesListResponse>(
      `/operator/warehouses/${warehouseId}/boxes?page=${page}&per_page=${perPage}`
    );
    return response.data;
  },

  /**
   * GET /api/v1/operator/boxes/:id — get single box
   */
  getById: async (boxId: string | number): Promise<ApiResponse<Box>> => {
    const response = await api.get<ApiResponse<Box>>(`/operator/boxes/${boxId}`);
    return response.data;
  },

  /**
   * POST /api/v1/operator/warehouses/:warehouseId/boxes — create box
   */
  create: async (warehouseId: string | number, data: CreateBoxDto): Promise<ApiResponse<Box>> => {
    const response = await api.post<ApiResponse<Box>>(
      `/operator/warehouses/${warehouseId}/boxes`,
      data
    );
    return response.data;
  },

  /**
   * PATCH /api/v1/operator/boxes/:id — update box
   */
  update: async (boxId: string | number, data: UpdateBoxDto): Promise<ApiResponse<Box>> => {
    const response = await api.patch<ApiResponse<Box>>(`/operator/boxes/${boxId}`, data);
    return response.data;
  },

  /**
   * DELETE /api/v1/operator/boxes/:id — delete box
   */
  delete: async (boxId: string | number): Promise<void> => {
    await api.delete(`/operator/boxes/${boxId}`);
  },

  /**
   * POST /api/v1/operator/warehouses/:warehouseId/boxes/bulk — bulk create
   */
  bulkCreate: async (
    warehouseId: string | number,
    boxes: CreateBoxDto[]
  ): Promise<ApiResponse<Box[]>> => {
    const response = await api.post<ApiResponse<Box[]>>(
      `/operator/warehouses/${warehouseId}/boxes/bulk`,
      { boxes }
    );
    return response.data;
  },
};
