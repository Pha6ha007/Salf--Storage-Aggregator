// Authentication Types for Self-Storage Aggregator Frontend

export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: 'user' | 'operator' | 'admin';
  is_email_verified?: boolean;
  is_phone_verified?: boolean;
  created_at: string;
  updated_at?: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  password_confirmation: string;
  name: string;
  phone: string;
  role?: 'user' | 'operator';
  agree_to_terms: boolean;
  agree_to_privacy: boolean;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface ResetPasswordDto {
  token: string;
  password: string;
  password_confirmation: string;
}

export interface ForgotPasswordDto {
  email: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: User;
  };
  meta: {
    timestamp: string;
    request_id?: string;
  };
}

export interface UserResponse {
  success: boolean;
  data: User;
  meta?: {
    timestamp: string;
    request_id?: string;
  };
}

export interface MessageResponse {
  success: boolean;
  data: {
    message: string;
    email?: string;
  };
  meta?: {
    timestamp: string;
    request_id?: string;
  };
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
  };
  meta?: {
    timestamp: string;
    request_id?: string;
  };
}

// Password strength levels
export type PasswordStrength = 'weak' | 'medium' | 'strong';

// Auth context type
export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginDto) => Promise<void>;
  register: (data: RegisterDto) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}
