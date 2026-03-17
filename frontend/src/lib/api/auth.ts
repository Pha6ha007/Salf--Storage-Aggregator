import api from '../api';
import type {
  RegisterDto,
  LoginDto,
  ResetPasswordDto,
  AuthResponse,
  UserResponse,
  MessageResponse,
} from '@/types/auth';

export const authApi = {
  /**
   * Register a new user
   * POST /api/v1/auth/register
   */
  register: async (data: RegisterDto): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  /**
   * Login user
   * POST /api/v1/auth/login
   * Sets httpOnly cookies (auth_token, refresh_token)
   */
  login: async (data: LoginDto): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', data);
    return response.data;
  },

  /**
   * Logout user
   * POST /api/v1/auth/logout
   * Clears cookies
   */
  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  },

  /**
   * Refresh access token using refresh_token cookie
   * POST /api/v1/auth/refresh
   * Returns new auth_token in cookie
   */
  refresh: async (): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/refresh');
    return response.data;
  },

  /**
   * Request password reset
   * POST /api/v1/auth/forgot-password
   * Always returns success (to prevent email enumeration)
   */
  forgotPassword: async (email: string): Promise<MessageResponse> => {
    const response = await api.post<MessageResponse>('/auth/forgot-password', {
      email,
    });
    return response.data;
  },

  /**
   * Confirm password reset with token from email
   * POST /api/v1/auth/reset-password
   */
  resetPassword: async (data: ResetPasswordDto): Promise<MessageResponse> => {
    const response = await api.post<MessageResponse>('/auth/reset-password', data);
    return response.data;
  },

  /**
   * Get current authenticated user
   * GET /api/v1/users/me
   * Requires auth_token cookie
   */
  getMe: async (): Promise<UserResponse> => {
    const response = await api.get<UserResponse>('/users/me');
    return response.data;
  },
};
