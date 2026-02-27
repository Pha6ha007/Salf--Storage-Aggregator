import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1',
  withCredentials: true, // Cookie-based auth
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - could trigger logout
      if (typeof window !== 'undefined') {
        // Only in browser
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
