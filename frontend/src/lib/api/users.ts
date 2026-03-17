import api from '../api';
import type { User } from '@/types/auth';

export interface UpdateProfileDto {
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatarUrl?: string | null;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
  newPasswordConfirmation: string;
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
  getMe: async (): Promise<User> => {
    const response = await api.get<User>('/users/me');
    return response.data;
  },

  updateProfile: async (data: UpdateProfileDto): Promise<User> => {
    const response = await api.patch<User>('/users/me', data);
    return response.data;
  },

  /**
   * Change password
   * PATCH /api/v1/users/me/password
   */
  changePassword: async (data: ChangePasswordDto): Promise<MessageResponse> => {
    const response = await api.patch<MessageResponse>('/users/me/password', data);
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
