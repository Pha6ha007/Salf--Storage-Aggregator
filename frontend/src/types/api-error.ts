// API Error Types for axios responses

export interface ApiErrorResponse {
  response?: {
    data?: {
      error?: {
        code?: string;
        message?: string;
        details?: Record<string, string[]>;
      };
    };
  };
}
