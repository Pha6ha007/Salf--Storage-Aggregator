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
  /**
   * Register as operator
   * POST /api/v1/operators/register
   */
  register: async (data: {
    email: string;
    password: string;
    password_confirmation: string;
    name: string;
    phone: string;
    company_name: string;
    trade_license_number?: string;
    agree_to_terms: true;
    agree_to_privacy: true;
  }): Promise<{ operator: Operator; message: string }> => {
    const response = await api.post('/operators/register', data);
    return response.data;
  },

  /**
   * Get current operator profile
   * GET /api/v1/operators/me
   */
  getProfile: async (): Promise<Operator> => {
    const response = await api.get<Operator>('/operators/me');
    return response.data;
  },

  /**
   * Update operator profile
   * PUT /api/v1/operators/me
   */
  updateProfile: async (data: UpdateOperatorDto): Promise<Operator> => {
    const response = await api.put<Operator>('/operators/me', data);
    return response.data;
  },

  /**
   * Get operator settings
   * (stored in operator_settings table — no dedicated API endpoint in spec, use profile)
   */
  getSettings: async (): Promise<ApiResponse<OperatorSettings>> => {
    const response = await api.get<ApiResponse<OperatorSettings>>('/operators/me/settings');
    return response.data;
  },

  /**
   * Update operator settings
   */
  updateSettings: async (data: UpdateOperatorSettingsDto): Promise<ApiResponse<OperatorSettings>> => {
    const response = await api.patch<ApiResponse<OperatorSettings>>('/operators/me/settings', data);
    return response.data;
  },

  /**
   * Get operator statistics
   * GET /api/v1/operators/me/statistics
   */
  getStats: async (): Promise<OperatorStats> => {
    const response = await api.get<OperatorStats>('/operators/me/statistics');
    return response.data;
  },
};
