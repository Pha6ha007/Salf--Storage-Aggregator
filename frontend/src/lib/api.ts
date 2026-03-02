import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1',
  withCredentials: true, // Cookie-based auth
  headers: {
    'Content-Type': 'application/json',
  },
});

// Flag to prevent multiple simultaneous refresh attempts
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: Error | null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

// Response interceptor for auto-refresh on 401
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // If error is 401 and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Skip refresh for auth endpoints, public endpoints that may return 401
      if (
        originalRequest.url?.includes('/auth/login') ||
        originalRequest.url?.includes('/auth/register') ||
        originalRequest.url?.includes('/auth/refresh') ||
        originalRequest.url?.includes('/users/me') ||
        originalRequest.url?.includes('/reviews') || // Reviews may require auth
        originalRequest.url?.includes('/boxes')     // Boxes endpoint may require auth
      ) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Attempt to refresh the token
        await api.post('/auth/refresh');

        // Refresh successful, process queued requests
        processQueue(null);
        isRefreshing = false;

        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed - session expired
        processQueue(refreshError as Error);
        isRefreshing = false;

        // Don't auto-redirect to login - let the page handle 401 errors
        // Only redirect if the original request was to a protected endpoint
        if (typeof window !== 'undefined') {
          const currentPath = window.location.pathname;
          const isProtectedPage =
            currentPath.startsWith('/profile') ||
            currentPath.startsWith('/bookings') ||
            currentPath.startsWith('/favorites') ||
            currentPath.startsWith('/operator');

          if (isProtectedPage && currentPath !== '/auth/login' && currentPath !== '/auth/register') {
            window.location.href = `/auth/login?redirect=${encodeURIComponent(currentPath)}`;
          }
        }

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
