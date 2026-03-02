import api from '@/lib/api';
import type {
  Operator,
  OperatorSettings,
  OperatorStats,
  UpdateOperatorDto,
  UpdateOperatorSettingsDto,
} from '@/types/operator';

interface ApiResponse<T> {
  data: T;
}

export const operatorsApi = {
  // Get current operator profile
  getProfile: async (): Promise<ApiResponse<Operator>> => {
    const response = await api.get<ApiResponse<Operator>>('/operators/me');
    return response.data;
  },

  // Update operator profile
  updateProfile: async (data: UpdateOperatorDto): Promise<ApiResponse<Operator>> => {
    const response = await api.patch<ApiResponse<Operator>>('/operators/me', data);
    return response.data;
  },

  // Get operator settings
  getSettings: async (): Promise<ApiResponse<OperatorSettings>> => {
    const response = await api.get<ApiResponse<OperatorSettings>>('/operators/me/settings');
    return response.data;
  },

  // Update operator settings
  updateSettings: async (data: UpdateOperatorSettingsDto): Promise<ApiResponse<OperatorSettings>> => {
    const response = await api.patch<ApiResponse<OperatorSettings>>('/operators/me/settings', data);
    return response.data;
  },

  // Get operator statistics
  getStats: async (): Promise<ApiResponse<OperatorStats>> => {
    const response = await api.get<ApiResponse<OperatorStats>>('/operators/me/stats');
    return response.data;
  },
};
