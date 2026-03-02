import { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

/**
 * Create a new QueryClient for testing
 */
export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

/**
 * Custom render function that wraps components with necessary providers
 */
export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) {
  const queryClient = createTestQueryClient();

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );
  }

  return {
    ...render(ui, { wrapper: Wrapper, ...options }),
    queryClient,
  };
}

/**
 * Mock warehouse data for testing
 */
export const mockWarehouse = {
  id: 'warehouse-123',
  name: 'Test Storage Facility',
  description: 'A test warehouse for unit testing',
  address: '123 Test Street, Dubai',
  emirate: 'Dubai',
  district: 'JLT',
  latitude: 25.2048,
  longitude: 55.2708,
  businessName: 'Test Storage Co',
  totalReviews: 10,
  averageRating: 4.5,
  priceRange: { min: 150, max: 500 },
  availableBoxes: 25,
  totalBoxes: 100,
  features: ['24/7 Access', 'Climate Control', 'CCTV'],
  images: [
    { id: 'img-1', url: '/test-image-1.jpg', alt: 'Test Image 1' },
    { id: 'img-2', url: '/test-image-2.jpg', alt: 'Test Image 2' },
  ],
};

/**
 * Mock user data for testing
 */
export const mockUser = {
  id: 'user-123',
  email: 'test@example.com',
  firstName: 'John',
  lastName: 'Doe',
  phone: '+971501234567',
  role: 'user',
};

/**
 * Mock booking data for testing
 */
export const mockBooking = {
  id: 'booking-123',
  userId: 'user-123',
  boxId: 'box-123',
  warehouseId: 'warehouse-123',
  status: 'confirmed',
  startDate: '2024-03-01',
  endDate: '2024-04-01',
  monthlyPrice: 300,
  totalPrice: 300,
  warehouse: {
    name: 'Test Storage Facility',
    address: '123 Test Street, Dubai',
  },
  box: {
    name: 'Medium Box 1',
    size: 'Medium',
  },
};

/**
 * Create mock API response for testing
 */
export function createMockApiResponse<T>(data: T) {
  return {
    data,
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {} as any,
  };
}

/**
 * Create mock API error for testing
 */
export function createMockApiError(message: string, statusCode: number = 400) {
  return {
    response: {
      data: {
        statusCode,
        error: 'Bad Request',
        message,
      },
      status: statusCode,
      statusText: 'Bad Request',
      headers: {},
      config: {} as any,
    },
  };
}

// Re-export everything from @testing-library/react
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
