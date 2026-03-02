import api from '../api';
import type { UserResponse } from '@/types/auth';

export interface UpdateProfileDto {
  name?: string;
  phone?: string;
  avatar?: string | null;
}

export interface ChangePasswordDto {
  current_password: string;
  new_password: string;
  new_password_confirmation: string;
}

export interface DeleteAccountDto {
  password: string;
  reason?: string;
  confirm: boolean;
}

export interface MessageResponse {
  success: boolean;
  data: {
    message: string;
  };
}

export const usersApi = {
  /**
   * Get current user profile (already used in AuthProvider)
   * GET /api/v1/users/me
   */
  getMe: async (): Promise<UserResponse> => {
    const response = await api.get<UserResponse>('/users/me');
    return response.data;
  },

  /**
   * Update user profile
   * PUT /api/v1/users/me
   */
  updateProfile: async (data: UpdateProfileDto): Promise<UserResponse> => {
    const response = await api.put<UserResponse>('/users/me', data);
    return response.data;
  },

  /**
   * Change password
   * PUT /api/v1/users/me/password
   */
  changePassword: async (data: ChangePasswordDto): Promise<MessageResponse> => {
    const response = await api.put<MessageResponse>('/users/me/password', data);
    return response.data;
  },

  /**
   * Delete account (soft delete)
   * DELETE /api/v1/users/me
   */
  deleteAccount: async (data: DeleteAccountDto): Promise<MessageResponse> => {
    const response = await api.delete<MessageResponse>('/users/me', { data });
    return response.data;
  },
};
