'use client';

import React, { createContext, useEffect, useState, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi } from '@/lib/api/auth';
import type {
  User,
  LoginDto,
  RegisterDto,
  AuthContextType,
} from '@/types/auth';

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const queryClient = useQueryClient();

  // Fetch current user on mount (check if session exists via cookie)
  const {
    data: userData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      try {
        const response = await authApi.getMe();
        return response.data;
      } catch {
        // If 401, user is not authenticated - this is expected
        return null;
      }
    },
    retry: false, // Don't retry on 401
    staleTime: 5 * 60 * 1000, // Consider fresh for 5 minutes
  });

  // Update user state when query data changes
  useEffect(() => {
    if (userData) {
      setUser(userData);
    } else if (!isLoading && error) {
      setUser(null);
    }
  }, [userData, isLoading, error]);

  const login = useCallback(
    async (data: LoginDto) => {
      const response = await authApi.login(data);
      setUser(response.data.user);
      // Invalidate and refetch user data
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    },
    [queryClient]
  );

  const register = useCallback(
    async (data: RegisterDto) => {
      const response = await authApi.register(data);
      setUser(response.data.user);
      // Invalidate and refetch user data
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    },
    [queryClient]
  );

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch (error) {
      // Logout failed, but we still clear local state
      console.error('Logout failed:', error);
    } finally {
      setUser(null);
      // Clear all queries
      queryClient.clear();
    }
  }, [queryClient]);

  const refreshUser = useCallback(async () => {
    try {
      const response = await authApi.getMe();
      setUser(response.data);
      queryClient.setQueryData(['currentUser'], response.data);
    } catch {
      setUser(null);
      queryClient.setQueryData(['currentUser'], null);
    }
  }, [queryClient]);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
