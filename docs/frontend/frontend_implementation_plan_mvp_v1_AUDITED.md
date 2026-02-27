# Frontend Implementation Plan (MVP v1) — Self-Storage Aggregator

**Document Version:** 1.2 (Security Fixed)
**Creation Date:** December 1, 2024
**Audit Date:** December 16, 2024
**Security Fix Date:** December 16, 2024
**Project:** Self-Storage Aggregator MVP v1

---

## Document Terminology

This document uses the following terminology to indicate the level of requirement:

| Term | Meaning |
|--------|----------|
| **MUST** | Mandatory for MVP. Functionality will not work without this. |
| **SHOULD** | Recommended for MVP. Improves quality but does not block release. |
| **MAY** | Optional. May be implemented at the team's discretion. |
| **POST-MVP** | Not included in MVP v1. Planned for future versions. |
| **PLACEHOLDER** | Placeholder for MVP. Requires full implementation in future versions. |

---

## Table of Contents

1. [Frontend Architecture](#1-frontend-architecture)
   - 1.1. Project Structure
   - 1.2. Pages and Routing
   - 1.3. Components (structure and levels)
   - 1.4. State-management
   - 1.5. API Services and Backend Synchronization
   - 1.6. Working with Maps
   - 1.7. Working with Authentication
   - 1.8. Working with Forms and Validation

2. [UI Layer](#2-ui-layer)
   - 2.1. Design System Principles
   - 2.2. UI Components
   - 2.3. Best Practices for Interface Composition

3. [Technology Stack](#3-technology-stack)
   - 3.1. Framework: Next.js + React
   - 3.2. Maps Library
   - 3.3. Working with API
   - 3.4. State-management
   - 3.5. Optimizations

4. [Development Plan](#4-development-plan)
   - 4.1. Sprints and Phases
   - 4.2. Backend Integrations
   - 4.3. Testing

5. [Performance Requirements](#5-performance-requirements)
   - 5.1. Load Time
   - 5.2. Maps Optimization
   - 5.3. Caching
   - 5.4. Pagination, Sorting and Filtering

---

# Section 1: Frontend Architecture

## 1.1. Project Structure

The frontend project is built on **Next.js 14 (App Router)** using TypeScript. The structure is organized according to the **feature-based architecture** principle with clear component isolation by domains.

> **Frontend clarification:**
> - The project structure below is **MUST** — all directories and files MUST be created according to this structure.
> - Directory and file names MUST match the specified ones (case-sensitive).
> - The `themes/` directory in `styles/` is **MAY** — theming is not included in MVP.

```
frontend/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (public)/                 # Public pages (without auth layout)
│   │   │   ├── page.tsx              # Home page
│   │   │   ├── catalog/              # Warehouse catalog
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/            # Warehouse details page
│   │   │   │       └── page.tsx
│   │   │   ├── map/                  # Map
│   │   │   │   └── page.tsx
│   │   │   ├── booking/              # Booking
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx
│   │   │   └── about/
│   │   │       └── page.tsx
│   │   │
│   │   ├── (auth)/                   # Auth pages
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── register/
│   │   │   │   └── page.tsx
│   │   │   └── reset-password/
│   │   │       └── page.tsx
│   │   │
│   │   ├── (protected)/              # Protected pages (require auth)
│   │   │   ├── profile/              # User dashboard
│   │   │   │   ├── page.tsx
│   │   │   │   ├── bookings/
│   │   │   │   ├── favorites/
│   │   │   │   └── settings/
│   │   │   │
│   │   │   └── operator/             # Operator dashboard
│   │   │       ├── page.tsx          # Dashboard
│   │   │       ├── warehouses/       # Warehouse management
│   │   │       ├── boxes/            # Box management
│   │   │       ├── bookings/         # Booking requests
│   │   │       ├── reviews/          # Reviews
│   │   │       ├── analytics/        # Analytics
│   │   │       └── settings/         # Settings
│   │   │
│   │   ├── layout.tsx                # Root layout
│   │   ├── error.tsx                 # Error boundary
│   │   ├── loading.tsx               # Loading UI
│   │   └── not-found.tsx             # 404
│   │
│   ├── components/                    # Components
│   │   ├── layout/                   # Layout components
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── MainLayout.tsx
│   │   │   └── OperatorLayout.tsx
│   │   │
│   │   ├── ui/                       # UI components (base)
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Skeleton.tsx
│   │   │   ├── Toast.tsx
│   │   │   ├── Tabs.tsx
│   │   │   ├── Dropdown.tsx
│   │   │   └── index.ts
│   │   │
│   │   └── features/                 # Feature components (by domain)
│   │       ├── auth/
│   │       │   ├── LoginForm.tsx
│   │       │   ├── RegisterForm.tsx
│   │       │   └── ProtectedRoute.tsx
│   │       │
│   │       ├── warehouses/
│   │       │   ├── WarehouseCard.tsx
│   │       │   ├── WarehouseList.tsx
│   │       │   ├── WarehouseFilters.tsx
│   │       │   ├── WarehouseDetails.tsx
│   │       │   └── WarehouseGallery.tsx
│   │       │
│   │       ├── boxes/
│   │       │   ├── BoxCard.tsx
│   │       │   ├── BoxList.tsx
│   │       │   ├── BoxSelector.tsx
│   │       │   └── BoxManager.tsx
│   │       │
│   │       ├── booking/
│   │       │   ├── BookingForm.tsx
│   │       │   ├── BookingDatePicker.tsx
│   │       │   ├── BookingPriceCalculator.tsx
│   │       │   ├── BookingConfirmation.tsx
│   │       │   └── BookingList.tsx
│   │       │
│   │       ├── map/
│   │       │   ├── MapView.tsx
│   │       │   ├── MapMarker.tsx
│   │       │   ├── MapCluster.tsx
│   │       │   ├── MapPopup.tsx
│   │       │   └── MapControls.tsx
│   │       │
│   │       ├── reviews/
│   │       │   ├── ReviewCard.tsx
│   │       │   ├── ReviewList.tsx
│   │       │   ├── ReviewForm.tsx
│   │       │   └── ReviewStats.tsx
│   │       │
│   │       ├── operator/
│   │       │   ├── DashboardMetrics.tsx
│   │       │   ├── WarehouseManager.tsx
│   │       │   ├── BoxManager.tsx
│   │       │   ├── BookingRequestList.tsx
│   │       │   ├── BookingRequestCard.tsx
│   │       │   └── AnalyticsCharts.tsx
│   │       │
│   │       └── ai/
│   │           ├── AIBoxFinder.tsx
│   │           ├── AIChat.tsx
│   │           └── AIRecommendations.tsx
│   │
│   ├── hooks/                         # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useDebounce.ts
│   │   ├── useMediaQuery.ts
│   │   ├── useIntersectionObserver.ts
│   │   ├── useLocalStorage.ts
│   │   ├── useMap.ts
│   │   └── useFilters.ts
│   │
│   ├── stores/                        # State management (Zustand)
│   │   ├── authStore.ts              # Authentication
│   │   ├── filtersStore.ts           # Catalog filters
│   │   ├── mapStore.ts               # Map state
│   │   ├── bookingStore.ts           # Booking process
│   │   └── uiStore.ts                # UI state (modals, toasts)
│   │
│   ├── services/                      # API and external services
│   │   ├── api/
│   │   │   ├── client.ts             # Axios instance with interceptors
│   │   │   ├── auth.api.ts
│   │   │   ├── warehouses.api.ts
│   │   │   ├── boxes.api.ts
│   │   │   ├── bookings.api.ts
│   │   │   ├── reviews.api.ts
│   │   │   ├── map.api.ts
│   │   │   ├── operator.api.ts
│   │   │   └── ai.api.ts
│   │   │
│   │   └── maps/
│   │       └── googleMaps.ts         # Google Maps SDK wrapper
│   │
│   ├── lib/                           # Utilities and helpers
│   │   ├── utils.ts                  # Common utilities
│   │   ├── validators.ts             # Form validators
│   │   ├── formatters.ts             # Formatting (prices, dates)
│   │   ├── constants.ts              # Application constants
│   │   └── queryClient.ts            # React Query configuration
│   │
│   ├── types/                         # TypeScript types
│   │   ├── api.types.ts              # API response/request types
│   │   ├── warehouse.types.ts
│   │   ├── box.types.ts
│   │   ├── booking.types.ts
│   │   ├── user.types.ts
│   │   └── index.ts
│   │
│   ├── styles/                        # Styles
│   │   ├── globals.css               # Global styles + Tailwind
│   │   ├── variables.css             # CSS variables (colors, fonts)
│   │   └── themes/                   # Themes (if needed)
│   │
│   └── config/                        # Configuration
│       ├── env.ts                    # Environment variables
│       ├── routes.ts                 # Application routes
│       └── api.config.ts             # API endpoints
│
├── public/                            # Static assets
│   ├── images/
│   ├── icons/
│   └── fonts/
│
├── .env.local                         # Environment variables
├── .env.example
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

### Key Directory Purposes

| Directory | Purpose |
|------------|------------|
| **`app/`** | Next.js App Router — file-based routing, layouts, pages |
| **`components/layout/`** | Common layout components (Header, Footer, Sidebar) |
| **`components/ui/`** | Base reusable UI components (Button, Input, Modal) |
| **`components/features/`** | Domain-specific feature components (warehouses, booking, map) |
| **`hooks/`** | Custom React hooks for logic reuse |
| **`stores/`** | Zustand stores for global state |
| **`services/api/`** | API layer: functions for backend requests |
| **`lib/`** | Utilities, helpers, React Query configuration |
| **`types/`** | TypeScript types and interfaces |
| **`styles/`** | Global styles, CSS variables |
| **`config/`** | Configuration files (env, routes, api endpoints) |

---

## 1.2. Pages and Routing

### Routing Structure

Next.js App Router uses the file system to define routes. All pages are located in the `app/` directory.

> **Frontend clarification:**
> - Route Groups `(public)`, `(auth)`, `(protected)` — this is an organizational structure that does NOT affect the URL.
> - Middleware protects routes at the server level (Edge Runtime).
> - ProtectedRoute component — additional client-side protection for UX.
> - Both protection levels (middleware + ProtectedRoute) **MUST** be used together for protected routes.

#### Public Pages (without authentication)

| URL | File | Description |
|-----|------|----------|
| `/` | `app/(public)/page.tsx` | Home page: search, AI recommendations |
| `/catalog` | `app/(public)/catalog/page.tsx` | Warehouse catalog: list, filters, sorting |
| `/catalog/[id]` | `app/(public)/catalog/[id]/page.tsx` | Warehouse details: details, photos, boxes, reviews |
| `/map` | `app/(public)/map/page.tsx` | Warehouse map with clusters and filters |
| `/booking/[warehouseId]` | `app/(public)/booking/[warehouseId]/page.tsx` | Box booking form |
| `/about` | `app/(public)/about/page.tsx` | About the project |

#### Authentication Pages

| URL | File | Description |
|-----|------|----------|
| `/login` | `app/(auth)/login/page.tsx` | Login |
| `/register` | `app/(auth)/register/page.tsx` | Registration (user/operator) |
| `/reset-password` | `app/(auth)/reset-password/page.tsx` | Password recovery |

#### User Dashboard (protected routes)

| URL | File | Description |
|-----|------|----------|
| `/profile` | `app/(protected)/profile/page.tsx` | User profile |
| `/profile/bookings` | `app/(protected)/profile/bookings/page.tsx` | My bookings |
| `/profile/favorites` | `app/(protected)/profile/favorites/page.tsx` | Favorite warehouses |
| `/profile/settings` | `app/(protected)/profile/settings/page.tsx` | Profile settings |

#### Operator Dashboard (protected routes)

| URL | File | Description |
|-----|------|----------|
| `/operator` | `app/(protected)/operator/page.tsx` | Operator dashboard: metrics, activity |
| `/operator/warehouses` | `app/(protected)/operator/warehouses/page.tsx` | Warehouse management |
| `/operator/warehouses/[id]` | `app/(protected)/operator/warehouses/[id]/page.tsx` | Warehouse editing |
| `/operator/warehouses/new` | `app/(protected)/operator/warehouses/new/page.tsx` | Add new warehouse |
| `/operator/boxes` | `app/(protected)/operator/boxes/page.tsx` | Box management |
| `/operator/bookings` | `app/(protected)/operator/bookings/page.tsx` | Booking requests |
| `/operator/reviews` | `app/(protected)/operator/reviews/page.tsx` | Review management |
| `/operator/analytics` | `app/(protected)/operator/analytics/page.tsx` | Analytics and reports |
| `/operator/settings` | `app/(protected)/operator/settings/page.tsx` | Operator settings |

### Dynamic Segments

Next.js uses square brackets for dynamic parameters:

```typescript
// app/(public)/catalog/[id]/page.tsx
export default async function WarehousePage({ 
  params 
}: { 
  params: { id: string } 
}) {
  const warehouse = await getWarehouse(params.id);
  return <WarehouseDetails warehouse={warehouse} />;
}
```

### Route Groups

Parentheses `()` are used for organization without affecting the URL:

- `(public)` — public pages
- `(auth)` — authentication pages
- `(protected)` — protected pages with middleware verification

### Middleware for Route Protection

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token');
  const isProtectedRoute = request.nextUrl.pathname.startsWith('/profile') ||
                          request.nextUrl.pathname.startsWith('/operator');

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Role check for operator routes
  if (request.nextUrl.pathname.startsWith('/operator')) {
    // TODO: Decode JWT and verify role === 'operator'
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/operator/:path*']
};
```

---

## 1.3. Components (structure and levels)

Components are organized into three levels of abstraction:

### 1. Layout Components (structural)

Responsible for the overall structure of pages.

**Components:**
- `MainLayout` — common framework for public pages (Header + Footer)
- `OperatorLayout` — framework for operator dashboard (Sidebar + Header)
- `Header` — navigation, search, auth buttons
- `Footer` — links, contacts
- `Sidebar` — side menu (for operator dashboard)

**Example:**
```typescript
// components/layout/MainLayout.tsx
export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
```

### 2. Feature Components (domain logic)

Components specific to business domains with logic.

#### Domain: Warehouses
- `WarehouseCard` — warehouse card in catalog
- `WarehouseList` — warehouse list with pagination
- `WarehouseFilters` — filter panel (price, size, attributes)
- `WarehouseDetails` — complete warehouse information
- `WarehouseGallery` — photo gallery

#### Domain: Boxes
- `BoxCard` — box card with price and availability
- `BoxList` — warehouse box list
- `BoxSelector` — box selection during booking
- `BoxManager` — box management (for operator)

#### Domain: Booking
- `BookingForm` — booking form
- `BookingDatePicker` — rental date selection
- `BookingPriceCalculator` — price calculator
- `BookingConfirmation` — booking confirmation
- `BookingList` — user booking list

#### Domain: Map
- `MapView` — main map component (Google Maps)
- `MapMarker` — warehouse marker
- `MapCluster` — marker cluster
- `MapPopup` — popup window with warehouse information
- `MapControls` — map control buttons

#### Domain: Reviews
- `ReviewCard` — review card
- `ReviewList` — review list with pagination
- `ReviewForm` — add review form
- `ReviewStats` — rating statistics

#### Domain: Operator
- `DashboardMetrics` — dashboard metrics (occupancy, revenue)
- `WarehouseManager` — warehouse management
- `BookingRequestList` — booking request list
- `BookingRequestCard` — request card
- `AnalyticsCharts` — analytics charts

#### Domain: AI

> **Frontend clarification — AI COMPONENTS STATUS:**
>
> All AI components have the following status for MVP:
>
> | Component | Status | Description |
> |-----------|--------|----------|
> | `AIBoxFinder` | **MVP STUB** | Feature-flagged, basic UI |
> | `AIChat` | **POST-MVP** | Do not implement in MVP |
> | `AIRecommendations` | **MVP STUB** | Feature-flagged, basic UI |
>
> **What MVP STUB means:**
> 1. Component **MUST** be created with basic UI
> 2. Component **MUST** be wrapped in feature flag (`NEXT_PUBLIC_FEATURE_AI_ENABLED`)
> 3. When `FEATURE_AI_ENABLED=false` — component does NOT render
> 4. When `FEATURE_AI_ENABLED=true` — component sends request to AI API
> 5. If AI API is unavailable — show fallback UI (standard search)
>
> **Feature flag example:**
> ```typescript
> export function AIBoxFinder() {
>   if (process.env.NEXT_PUBLIC_FEATURE_AI_ENABLED !== 'true') {
>     return null; // or fallback component
>   }
>   // ... AI logic
> }
> ```

- `AIBoxFinder` — AI box finder widget — **MVP STUB** (feature-flagged)
- `AIChat` — chat with AI assistant — **POST-MVP**
- `AIRecommendations` — recommendations block — **MVP STUB** (feature-flagged)

### 3. UI Components (base)

Reusable primitives without business logic.

**Components:**
- `Button` — button with variants (primary, secondary, ghost)
- `Input` — text field
- `Select` — dropdown list
- `Checkbox` / `Radio` — checkboxes and radio buttons
- `Modal` — modal window
- `Card` — content card
- `Badge` — badge (status, label)
- `Skeleton` — loading placeholders
- `Toast` — notifications
- `Tabs` — tabs
- `Dropdown` — dropdown menu
- `Spinner` — loading indicator

**Button Component Example:**
```typescript
// components/ui/Button.tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export function Button({ 
  variant = 'primary', 
  size = 'md',
  isLoading,
  children,
  disabled,
  ...props 
}: ButtonProps) {
  return (
    <button
      className={cn(
        'rounded-lg font-medium transition-colors',
        variants[variant],
        sizes[size],
        (disabled || isLoading) && 'opacity-50 cursor-not-allowed'
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Spinner className="mr-2" />}
      {children}
    </button>
  );
}
```

---

## 1.4. State-management

For state management, a combination of **React Query** (server state) + **Zustand** (client state) is used.

> **Frontend clarification:**
> - React Query — for ALL data received from the server (warehouses, boxes, bookings, reviews, user data).
> - Zustand — ONLY for client-side state (UI state, filters, map state).
> - DO NOT duplicate server data in Zustand.
> - DO NOT use Redux, MobX or other state managers.

### State Distribution Principles

| Data Type | Tool | Examples |
|------------|------------|---------|
| **Server data** | React Query | Warehouses, boxes, bookings, reviews |
| **Global UI state** | Zustand | Authentication, modals, toasts, filters |
| **Local state** | useState/useReducer | Form state, UI component state |
| **URL parameters** | Next.js searchParams | Catalog filters, pagination, sorting |

### React Query for Server State

**Configuration:**
```typescript
// lib/queryClient.ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,        // 5 minutes
      cacheTime: 10 * 60 * 1000,       // 10 minutes
      refetchOnWindowFocus: false,
      retry: 1,
    },
    mutations: {
      retry: 1,
    },
  },
});
```

**Usage for Warehouses:**
```typescript
// hooks/useWarehouses.ts
import { useQuery } from '@tanstack/react-query';
import { warehousesApi } from '@/services/api/warehouses.api';

export function useWarehouses(filters: WarehouseFilters) {
  return useQuery({
    queryKey: ['warehouses', filters],
    queryFn: () => warehousesApi.search(filters),
    staleTime: 5 * 60 * 1000,
  });
}

export function useWarehouse(id: string) {
  return useQuery({
    queryKey: ['warehouse', id],
    queryFn: () => warehousesApi.getById(id),
    staleTime: 10 * 60 * 1000,
  });
}

// Prefetching for fast navigation
export function usePrefetchWarehouse() {
  const queryClient = useQueryClient();
  
  return (id: string) => {
    queryClient.prefetchQuery({
      queryKey: ['warehouse', id],
      queryFn: () => warehousesApi.getById(id),
    });
  };
}
```

**Mutations (creating a booking):**
```typescript
// hooks/useBooking.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingsApi } from '@/services/api/bookings.api';

export function useCreateBooking() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: bookingsApi.create,
    onSuccess: () => {
      // Invalidate bookings cache
      queryClient.invalidateQueries({ queryKey: ['bookings'] });

      // Show toast
      toast.success('Booking created!');
    },
    onError: (error) => {
      toast.error('Error creating booking');
    },
  });
}
```

### Zustand for Global State

**1. Auth Store (authentication)**

> **Frontend clarification — AUTH STORE (CANONICAL):**
>
> **THE ONLY storage model:**
> - `auth_token` — httpOnly cookie, **not accessible to JS code**, set by server
> - `refresh_token` — httpOnly cookie, **not accessible to JS code**, set by server
> - Zustand store holds **ONLY**: `user`, `isAuthenticated`, `isLoading`
>
> **Zustand does NOT store and does NOT know about tokens.**
> Tokens are passed automatically by the browser through cookies.
> Frontend does not have access to token values.

```typescript
// stores/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,

      login: async (email, password) => {
        // Backend sets httpOnly cookies automatically
        // Frontend receives only user data
        const response = await authApi.login(email, password);
        set({ 
          user: response.data.user, 
          isAuthenticated: true,
          isLoading: false 
        });
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      updateUser: (userData) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        }));
      },

      setLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
```

**2. Filters Store (catalog filters)**
```typescript
// stores/filtersStore.ts
import { create } from 'zustand';

interface FiltersState {
  city: string;
  priceMin: number;
  priceMax: number;
  sizes: string[];
  attributes: string[];
  sortBy: 'price' | 'rating' | 'distance';
  sortOrder: 'asc' | 'desc';
  
  setCity: (city: string) => void;
  setPriceRange: (min: number, max: number) => void;
  toggleSize: (size: string) => void;
  toggleAttribute: (attr: string) => void;
  setSorting: (sortBy: string, sortOrder: string) => void;
  resetFilters: () => void;
}

export const useFiltersStore = create<FiltersState>((set) => ({
  city: '',
  priceMin: 0,
  priceMax: 50000,
  sizes: [],
  attributes: [],
  sortBy: 'rating',
  sortOrder: 'desc',

  setCity: (city) => set({ city }),
  
  setPriceRange: (priceMin, priceMax) => set({ priceMin, priceMax }),
  
  toggleSize: (size) => set((state) => ({
    sizes: state.sizes.includes(size)
      ? state.sizes.filter(s => s !== size)
      : [...state.sizes, size]
  })),
  
  toggleAttribute: (attr) => set((state) => ({
    attributes: state.attributes.includes(attr)
      ? state.attributes.filter(a => a !== attr)
      : [...state.attributes, attr]
  })),
  
  setSorting: (sortBy, sortOrder) => set({ 
    sortBy: sortBy as any, 
    sortOrder: sortOrder as any 
  }),
  
  resetFilters: () => set({
    city: '',
    priceMin: 0,
    priceMax: 50000,
    sizes: [],
    attributes: [],
    sortBy: 'rating',
    sortOrder: 'desc',
  }),
}));
```

**3. Map Store (map state)**
```typescript
// stores/mapStore.ts
import { create } from 'zustand';

interface MapState {
  center: [number, number];
  zoom: number;
  bounds: BoundingBox | null;
  selectedWarehouseId: number | null;
  hoveredWarehouseId: number | null;
  
  setCenter: (center: [number, number]) => void;
  setZoom: (zoom: number) => void;
  setBounds: (bounds: BoundingBox) => void;
  selectWarehouse: (id: number | null) => void;
  hoverWarehouse: (id: number | null) => void;
}

export const useMapStore = create<MapState>((set) => ({
  center: [55.751244, 37.618423], // Dubai
  zoom: 10,
  bounds: null,
  selectedWarehouseId: null,
  hoveredWarehouseId: null,

  setCenter: (center) => set({ center }),
  setZoom: (zoom) => set({ zoom }),
  setBounds: (bounds) => set({ bounds }),
  selectWarehouse: (id) => set({ selectedWarehouseId: id }),
  hoverWarehouse: (id) => set({ hoveredWarehouseId: id }),
}));
```

**4. UI Store (modals, toasts)**
```typescript
// stores/uiStore.ts
import { create } from 'zustand';

interface UIState {
  modals: Record<string, boolean>;
  toasts: Toast[];
  
  openModal: (id: string) => void;
  closeModal: (id: string) => void;
  showToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  modals: {},
  toasts: [],

  openModal: (id) => set((state) => ({
    modals: { ...state.modals, [id]: true }
  })),

  closeModal: (id) => set((state) => ({
    modals: { ...state.modals, [id]: false }
  })),

  showToast: (toast) => set((state) => ({
    toasts: [...state.toasts, { ...toast, id: crypto.randomUUID() }]
  })),

  removeToast: (id) => set((state) => ({
    toasts: state.toasts.filter(t => t.id !== id)
  })),
}));
```

### Optimistic Updates

Optimistic updates are used to improve UX:

```typescript
// hooks/useFavorite.ts
export function useToggleFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ warehouseId, isFavorite }: { 
      warehouseId: number; 
      isFavorite: boolean 
    }) => {
      return isFavorite 
        ? favoritesApi.remove(warehouseId)
        : favoritesApi.add(warehouseId);
    },

    // Optimistic update
    onMutate: async ({ warehouseId, isFavorite }) => {
      await queryClient.cancelQueries({ queryKey: ['favorites'] });

      const previousFavorites = queryClient.getQueryData(['favorites']);

      queryClient.setQueryData(['favorites'], (old: any) => {
        if (isFavorite) {
          return old.filter((id: number) => id !== warehouseId);
        } else {
          return [...old, warehouseId];
        }
      });

      return { previousFavorites };
    },

    // Rollback on error
    onError: (err, variables, context) => {
      queryClient.setQueryData(['favorites'], context?.previousFavorites);
      toast.error('Error updating favorites');
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });
}
```

---

## 1.5. API Services and Backend Synchronization

### Base API Client (Axios)

> **Frontend clarification — API RESPONSE FORMAT:**
>
> Backend ALWAYS returns responses in the following format:
>
> **Successful response:**
> ```json
> {
>   "success": true,
>   "data": { ... },
>   "meta": {
>     "timestamp": "2024-12-01T12:00:00Z",
>     "request_id": "uuid"
>   }
> }
> ```
>
> **Response with pagination:**
> ```json
> {
>   "success": true,
>   "data": [...],
>   "pagination": {
>     "page": 1,
>     "per_page": 12,
>     "total": 100,
>     "total_pages": 9,
>     "has_next": true,
>     "has_previous": false
>   }
> }
> ```
> 
> **Error response:**
> ```json
> {
>   "success": false,
>   "error": {
>     "code": "VALIDATION_ERROR",
>     "message": "Error description",
>     "details": { ... }
>   }
> }
> ```
>
> Frontend **MUST** handle all three formats.

```typescript
// services/api/client.ts
import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/stores/authStore';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,  // CRITICAL: enables automatic httpOnly cookies transmission
});

// Request Interceptor: logging (optional)
// DO NOT add Authorization header — auth_token is transmitted automatically through cookies
apiClient.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

// Response Interceptor: error handling
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorResponse>) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    // 401: Session expired — try refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Refresh token is transmitted automatically through httpOnly cookie
        // Backend updates cookies itself — frontend does not receive tokens
        await axios.post(`${API_BASE_URL}/auth/refresh`, {}, {
          withCredentials: true
        });

        // Retry original request — new cookies are already set
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed — log out
        useAuthStore.getState().logout();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // 403: Insufficient permissions
    if (error.response?.status === 403) {
      toast.error('Insufficient permissions to perform this action');
    }

    // 429: Rate limit
    if (error.response?.status === 429) {
      toast.error('Too many requests. Please try again later');
    }

    // 500: Server error
    if (error.response?.status === 500) {
      toast.error('Server error. We are already working on fixing it');
    }

    return Promise.reject(error);
  }
);
```

### API Services by Domain

**1. Auth API**
```typescript
// services/api/auth.api.ts
import { apiClient } from './client';

export const authApi = {
  register: async (data: RegisterData) => {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  },

  login: async (email: string, password: string) => {
    // Backend sets httpOnly cookies automatically
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data;
  },

  logout: async () => {
    // Backend clears httpOnly cookies
    const response = await apiClient.post('/auth/logout');
    return response.data;
  },

  // Refresh happens automatically through cookies
  // Frontend does NOT transmit and does NOT receive tokens
  refreshToken: async () => {
    const response = await apiClient.post('/auth/refresh');
    return response.data;
  },

  resetPassword: async (email: string) => {
    const response = await apiClient.post('/auth/reset-password', { email });
    return response.data;
  },
  
  // Get current user (for initialization)
  getCurrentUser: async () => {
    const response = await apiClient.get('/users/me');
    return response.data;
  },
};
```

**2. Warehouses API**
```typescript
// services/api/warehouses.api.ts
import { apiClient } from './client';
import { WarehouseFilters, Warehouse } from '@/types';

export const warehousesApi = {
  search: async (filters: WarehouseFilters) => {
    const params = new URLSearchParams();
    
    if (filters.city) params.append('city', filters.city);
    if (filters.priceMin) params.append('price_min', filters.priceMin.toString());
    if (filters.priceMax) params.append('price_max', filters.priceMax.toString());
    if (filters.sizes?.length) params.append('size', filters.sizes.join(','));
    if (filters.attributes?.length) params.append('attributes', filters.attributes.join(','));
    
    params.append('sort', filters.sortBy || 'rating');
    params.append('order', filters.sortOrder || 'desc');
    params.append('page', (filters.page || 1).toString());
    params.append('per_page', (filters.perPage || 12).toString());

    const response = await apiClient.get(`/warehouses?${params.toString()}`);
    return response.data;
  },

  getById: async (id: string): Promise<Warehouse> => {
    const response = await apiClient.get(`/warehouses/${id}`);
    return response.data.data;
  },

  getNearby: async (lat: number, lon: number, radius: number = 5000) => {
    const response = await apiClient.get('/warehouses/nearby', {
      params: { lat, lon, radius },
    });
    return response.data;
  },
};
```

**3. Boxes API**
```typescript
// services/api/boxes.api.ts
export const boxesApi = {
  getByWarehouse: async (warehouseId: number) => {
    const response = await apiClient.get(`/warehouses/${warehouseId}/boxes`);
    return response.data;
  },

  getById: async (boxId: number) => {
    const response = await apiClient.get(`/boxes/${boxId}`);
    return response.data;
  },

  checkAvailability: async (boxId: number, startDate: string, endDate: string) => {
    const response = await apiClient.get(`/boxes/${boxId}/availability`, {
      params: { start_date: startDate, end_date: endDate },
    });
    return response.data;
  },
};
```

**4. Bookings API**
```typescript
// services/api/bookings.api.ts
export const bookingsApi = {
  create: async (data: CreateBookingData) => {
    const response = await apiClient.post('/bookings', data);
    return response.data;
  },

  getUserBookings: async (status?: string) => {
    const params = status ? { status } : {};
    const response = await apiClient.get('/users/me/bookings', { params });
    return response.data;
  },

  getById: async (id: number) => {
    const response = await apiClient.get(`/bookings/${id}`);
    return response.data;
  },

  cancel: async (id: number, reason: string) => {
    const response = await apiClient.put(`/bookings/${id}/cancel`, { reason });
    return response.data;
  },
};
```

**5. Map API**
```typescript
// services/api/map.api.ts
export const mapApi = {
  getClusters: async (bounds: BoundingBox, zoom: number, filters?: any) => {
    const response = await apiClient.get('/map/warehouses', {
      params: {
        bounds: `${bounds.latMin},${bounds.lonMin},${bounds.latMax},${bounds.lonMax}`,
        zoom,
        ...filters,
      },
    });
    return response.data;
  },
};
```

**6. Operator API**
```typescript
// services/api/operator.api.ts
export const operatorApi = {
  // Warehouses
  getWarehouses: async () => {
    const response = await apiClient.get('/operator/warehouses');
    return response.data;
  },

  createWarehouse: async (data: CreateWarehouseData) => {
    const response = await apiClient.post('/operator/warehouses', data);
    return response.data;
  },

  updateWarehouse: async (id: number, data: Partial<Warehouse>) => {
    const response = await apiClient.put(`/operator/warehouses/${id}`, data);
    return response.data;
  },

  // Bookings
  getBookingRequests: async (warehouseId?: number, status?: string) => {
    const response = await apiClient.get('/operator/bookings', {
      params: { warehouse_id: warehouseId, status },
    });
    return response.data;
  },

  confirmBooking: async (id: number, notes: string) => {
    const response = await apiClient.put(`/operator/bookings/${id}/confirm`, {
      operator_notes: notes,
    });
    return response.data;
  },

  rejectBooking: async (id: number, reason: string) => {
    const response = await apiClient.put(`/operator/bookings/${id}/reject`, {
      reason,
    });
    return response.data;
  },

  // Analytics
  getAnalytics: async (warehouseId?: number, from?: string, to?: string) => {
    const response = await apiClient.get('/operator/analytics', {
      params: { warehouse_id: warehouseId, from, to },
    });
    return response.data;
  },
};
```

### API Response Typing

```typescript
// types/api.types.ts
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: {
    timestamp: string;
    request_id: string;
  };
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
    has_next: boolean;
    has_previous: boolean;
  };
}
```

---

## 1.6. Working with Maps

**Google Maps API** (primary) is used for map display with the ability to switch to **Google Maps** (backup).

> **Frontend clarification — MAP PROVIDER:**
>
> | Provider | Status |
> |-----------|--------|
> | Google Maps API | **MUST** for MVP |
> | Google Maps | **POST-MVP** (backup) |
>
> - File `googleMaps.ts` **MAY** be created as a stub
> - File `mapProvider.ts` (abstraction) — **SHOULD** for future extensibility
>
> **MAP RESPONSIBILITY SPLIT:**
>
> | Responsibility | Backend | Frontend |
> |-----------------|---------|----------|
> | Warehouse filtering by bounds | ✅ | ❌ |
> | Server-side clustering | ✅ (optional) | ❌ |
> | Visual clustering | ❌ | ✅ (Google Maps SDK) |
> | Marker/cluster rendering | ❌ | ✅ |
> | User geolocation | ❌ | ✅ |

### Map Module Structure

```
src/
├── services/maps/
│   ├── googleMaps.ts          # Google Maps SDK wrapper
│   ├── googleMaps.ts          # Google Maps SDK wrapper (backup)
│   └── mapProvider.ts         # Abstraction over maps
│
├── components/features/map/
│   ├── MapView.tsx            # Main map component
│   ├── MapMarker.tsx          # Warehouse marker
│   ├── MapCluster.tsx         # Marker cluster
│   ├── MapPopup.tsx           # Info popup
│   ├── MapControls.tsx        # Control buttons
│   └── MapSkeleton.tsx        # Loading state
│
└── hooks/
    └── useMap.ts              # Hook for working with map
```

### Google Maps SDK Wrapper

```typescript
// services/maps/googleMaps.ts
declare global {
  interface Window {
    ymaps: any;
  }
}

export class GoogleMapsService {
  private map: any = null;
  private clusterer: any = null;
  private markers: Map<number, any> = new Map();

  async init(containerId: string, center: [number, number], zoom: number) {
    return new Promise((resolve, reject) => {
      if (window.ymaps) {
        window.ymaps.ready(() => {
          this.map = new window.ymaps.Map(containerId, {
            center,
            zoom,
            controls: ['zoomControl', 'geolocationControl'],
          });

          // Clusterer initialization
          this.clusterer = new window.ymaps.Clusterer({
            preset: 'islands#invertedVioletClusterIcons',
            groupByCoordinates: false,
            clusterDisableClickZoom: false,
            clusterHideIconOnBalloonOpen: false,
            geoObjectHideIconOnBalloonOpen: false,
            clusterBalloonPanelMaxMapArea: 0,
            clusterBalloonContentLayoutWidth: 250,
            clusterBalloonLeftColumnWidth: 100,
          });

          this.map.geoObjects.add(this.clusterer);

          resolve(this.map);
        });
      } else {
        reject(new Error('Google Maps not loaded'));
      }
    });
  }

  addMarker(warehouse: Warehouse) {
    const placemark = new window.ymaps.Placemark(
      [warehouse.coordinates.lat, warehouse.coordinates.lon],
      {
        balloonContent: this.createBalloonContent(warehouse),
        clusterCaption: warehouse.name,
        warehouseId: warehouse.id,
      },
      {
        preset: 'islands#blueStorageIcon',
        iconColor: warehouse.available_boxes > 0 ? '#4CAF50' : '#9E9E9E',
      }
    );

    placemark.events.add('click', () => {
      this.onMarkerClick(warehouse.id);
    });

    this.markers.set(warehouse.id, placemark);
    this.clusterer.add(placemark);
  }

  removeMarker(warehouseId: number) {
    const marker = this.markers.get(warehouseId);
    if (marker) {
      this.clusterer.remove(marker);
      this.markers.delete(warehouseId);
    }
  }

  clearMarkers() {
    this.clusterer.removeAll();
    this.markers.clear();
  }

  setCenter(center: [number, number], zoom?: number) {
    if (this.map) {
      this.map.setCenter(center, zoom || this.map.getZoom());
    }
  }

  getBounds() {
    if (!this.map) return null;
    
    const bounds = this.map.getBounds();
    return {
      latMin: bounds[0][0],
      lonMin: bounds[0][1],
      latMax: bounds[1][0],
      lonMax: bounds[1][1],
    };
  }

  onBoundsChange(callback: (bounds: BoundingBox) => void) {
    if (this.map) {
      this.map.events.add('boundschange', () => {
        const bounds = this.getBounds();
        if (bounds) callback(bounds);
      });
    }
  }

  highlightMarker(warehouseId: number) {
    const marker = this.markers.get(warehouseId);
    if (marker) {
      marker.options.set('iconColor', '#FF5722');
    }
  }

  resetMarkerHighlight(warehouseId: number) {
    const marker = this.markers.get(warehouseId);
    const warehouse = this.getWarehouseById(warehouseId);
    if (marker && warehouse) {
      marker.options.set(
        'iconColor',
        warehouse.available_boxes > 0 ? '#4CAF50' : '#9E9E9E'
      );
    }
  }

  private createBalloonContent(warehouse: Warehouse): string {
    return `
      <div class="map-balloon">
        <h3>${warehouse.name}</h3>
        <p>${warehouse.address.full_address}</p>
        <p class="price">from ${warehouse.price_from.toLocaleString()} AED /month</p>
        <p class="rating">★ ${warehouse.rating} (${warehouse.review_count})</p>
        <a href="/catalog/${warehouse.id}" class="btn-primary">Details</a>
      </div>
    `;
  }

  private onMarkerClick: (warehouseId: number) => void = () => {};

  setMarkerClickHandler(handler: (warehouseId: number) => void) {
    this.onMarkerClick = handler;
  }

  destroy() {
    if (this.map) {
      this.map.destroy();
      this.map = null;
    }
  }
}
```

### React Hook for Map

```typescript
// hooks/useMap.ts
import { useEffect, useRef, useState } from 'react';
import { GoogleMapsService } from '@/services/maps/googleMaps';
import { useMapStore } from '@/stores/mapStore';

export function useMap(containerId: string) {
  const mapServiceRef = useRef<GoogleMapsService | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  
  const { center, zoom, setBounds, selectWarehouse } = useMapStore();

  useEffect(() => {
    const initMap = async () => {
      try {
        const mapService = new GoogleMapsService();
        await mapService.init(containerId, center, zoom);

        // Subscribe to bounds changes
        mapService.onBoundsChange((bounds) => {
          setBounds(bounds);
        });

        // Marker click handler
        mapService.setMarkerClickHandler((warehouseId) => {
          selectWarehouse(warehouseId);
        });

        mapServiceRef.current = mapService;
        setIsLoaded(true);
      } catch (error) {
        console.error('Failed to initialize map:', error);
      }
    };

    initMap();

    return () => {
      mapServiceRef.current?.destroy();
    };
  }, []);

  return {
    mapService: mapServiceRef.current,
    isLoaded,
  };
}
```

### MapView Component

```typescript
// components/features/map/MapView.tsx
'use client';

import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useMap } from '@/hooks/useMap';
import { useMapStore } from '@/stores/mapStore';
import { useFiltersStore } from '@/stores/filtersStore';
import { mapApi } from '@/services/api/map.api';
import { MapSkeleton } from './MapSkeleton';
import { MapControls } from './MapControls';

export function MapView() {
  const { mapService, isLoaded } = useMap('map-container');
  const { bounds, zoom, selectedWarehouseId } = useMapStore();
  const filters = useFiltersStore();

  // Load clusters/markers
  const { data: mapData, isLoading } = useQuery({
    queryKey: ['map-warehouses', bounds, zoom, filters],
    queryFn: () => mapApi.getClusters(bounds!, zoom, filters),
    enabled: !!bounds && isLoaded,
    staleTime: 5 * 60 * 1000,
  });

  // Update markers when data changes
  useEffect(() => {
    if (!mapService || !mapData) return;

    mapService.clearMarkers();

    // Add warehouse markers
    mapData.data.warehouses.forEach((warehouse) => {
      mapService.addMarker(warehouse);
    });
  }, [mapData, mapService]);

  // Highlight selected warehouse
  useEffect(() => {
    if (!mapService || !selectedWarehouseId) return;

    mapService.highlightMarker(selectedWarehouseId);

    return () => {
      mapService.resetMarkerHighlight(selectedWarehouseId);
    };
  }, [selectedWarehouseId, mapService]);

  if (!isLoaded) {
    return <MapSkeleton />;
  }

  return (
    <div className="relative w-full h-full">
      <div id="map-container" className="w-full h-full" />
      <MapControls />
      
      {isLoading && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white px-4 py-2 rounded-lg shadow-md">
          Loading warehouses...
        </div>
      )}
    </div>
  );
}
```

### Map and List Synchronization

```typescript
// components/features/warehouses/WarehouseCard.tsx
export function WarehouseCard({ warehouse }: { warehouse: Warehouse }) {
  const { selectWarehouse, setCenter } = useMapStore();
  const prefetchWarehouse = usePrefetchWarehouse();

  const handleMouseEnter = () => {
    selectWarehouse(warehouse.id);
    prefetchWarehouse(warehouse.id.toString());
  };

  const handleMouseLeave = () => {
    selectWarehouse(null);
  };

  const handleViewOnMap = () => {
    setCenter([warehouse.coordinates.lat, warehouse.coordinates.lon]);
    setZoom(16);
  };

  return (
    <div 
      className="warehouse-card"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* ... card content ... */}
      <button onClick={handleViewOnMap}>
        Show on map
      </button>
    </div>
  );
}
```

### Clustering

Google Maps automatically clusters markers based on:
- **Zoom < 10**: clusters with 5000m radius
- **Zoom 10-13**: clusters with 1000m radius
- **Zoom 14-15**: clusters with 500m radius
- **Zoom > 15**: individual markers

Backend returns data already considering zoom level:
```json
{
  "data": {
    "warehouses": [...],
    "clusters": [
      {
        "center": [55.751244, 37.618423],
        "count": 12,
        "bounds": {...}
      }
    ]
  }
}
```

---

## 1.7. Working with Authentication

> **Frontend clarification — CANONICAL AUTH FLOW (MVP):**
>
> This is the **ONLY** supported authentication method for MVP:
>
> **1. Login Flow:**
> ```
> User → POST /auth/login (email, password)
>      ← Set-Cookie: auth_token (httpOnly, 15 min)
>      ← Set-Cookie: refresh_token (httpOnly, 7 days)
>      ← { success: true, data: { user: {...} } }
> Frontend → Save user in authStore
> ```
>
> **2. Request Flow:**
> ```
> Frontend → GET /any-endpoint (cookies sent automatically)
> Backend → Verifies auth_token from cookie
>        ← 200 OK or 401 Unauthorized
> ```
>
> **3. Token Refresh Flow:**
> ```
> Frontend → Receives 401 on any request
>         → POST /auth/refresh (refresh_token from cookie automatically)
>         ← New cookies (auth_token, refresh_token)
>         → Retries original request
> ```
>
> **4. Logout Flow:**
> ```
> Frontend → POST /auth/logout
>         ← Cookies cleared by server
> Frontend → Clear authStore
>         → Clear React Query cache
>         → Redirect to /
> ```
>
> **ALTERNATIVE APPROACHES — PROHIBITED:**
> - LocalStorage for tokens — **PROHIBITED** (XSS vulnerability)
> - Bearer token in header — **PROHIBITED**
> - Storing tokens in Zustand/Redux — **PROHIBITED**
> - Reading tokens from JS code — **IMPOSSIBLE** (httpOnly)

### Token Storage

**Tokens are stored ONLY in httpOnly cookies**, which are:
- Set **ONLY by server** (backend)
- **Not accessible** from JavaScript code
- Transmitted by browser **automatically** with each request
- Cleared **ONLY by server** on logout

> **Frontend clarification:**
> Functions below work **ONLY in Server Components and API Routes**.
> In Client Components these functions are **NOT AVAILABLE** — cookies are managed by the browser automatically.
> Frontend developers **DO NOT need** to call these functions directly.

```typescript
// lib/auth.ts (Server-side ONLY — for API Routes and Server Components)
import { cookies } from 'next/headers';

// Check for session existence (for Server Components)
export function hasAuthSession(): boolean {
  return !!cookies().get('auth_token')?.value;
}

// Clear cookies (called from API Route on logout)
export function clearAuthCookies() {
  cookies().delete('auth_token');
  cookies().delete('refresh_token');
}

// IMPORTANT: Frontend does NOT set cookies directly
// Cookies are set ONLY by backend on POST /auth/login
```

### Middleware for Route Protection

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const publicRoutes = ['/', '/catalog', '/map', '/login', '/register'];
const authRoutes = ['/login', '/register'];
const protectedRoutes = ['/profile', '/operator'];

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  const { pathname } = request.nextUrl;

  // Public routes — allow everyone
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // If no token and trying to access protected page
  if (!token && protectedRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If has token and trying to access auth pages — redirect to home
  if (token && authRoutes.some(route => pathname === route)) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Role check for operator routes
  if (pathname.startsWith('/operator')) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      const { payload } = await jwtVerify(token!, secret);

      if (payload.role !== 'operator' && payload.role !== 'admin') {
        return NextResponse.redirect(new URL('/profile', request.url));
      }
    } catch (error) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
```

### ProtectedRoute Component

```typescript
// components/features/auth/ProtectedRoute.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { Spinner } from '@/components/ui/Spinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'user' | 'operator' | 'admin';
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const router = useRouter();
  const { isAuthenticated, user, isLoading } = useAuthStore();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }

    if (!isLoading && requiredRole && user?.role !== requiredRole) {
      router.push('/profile');
    }
  }, [isAuthenticated, user, isLoading, requiredRole, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return null;
  }

  return <>{children}</>;
}
```

### Usage in Layout

```typescript
// app/(protected)/operator/layout.tsx
import { ProtectedRoute } from '@/components/features/auth/ProtectedRoute';
import { OperatorLayout } from '@/components/layout/OperatorLayout';

export default function OperatorLayoutPage({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute requiredRole="operator">
      <OperatorLayout>{children}</OperatorLayout>
    </ProtectedRoute>
  );
}
```

### Automatic Token Refresh

Handled in axios interceptor (see section 1.5):

```typescript
// Logic in apiClient interceptor
if (error.response?.status === 401 && !originalRequest._retry) {
  originalRequest._retry = true;

  // refresh_token is transmitted automatically through httpOnly cookie
  // Backend updates cookies — frontend does NOT receive tokens
  await axios.post(`${API_BASE_URL}/auth/refresh`, {}, { withCredentials: true });

  // Retry request — new cookies are already set by browser
  return apiClient(originalRequest);
}
```

> **Frontend clarification:**
> - Frontend **does NOT read** refresh_token
> - Frontend **does NOT receive** new auth_token
> - Backend updates httpOnly cookies itself
> - Frontend simply retries request after successful refresh

### Logout

```typescript
// hooks/useAuth.ts
export function useAuth() {
  const { logout: logoutStore } = useAuthStore();
  const queryClient = useQueryClient();
  const router = useRouter();

  const logout = async () => {
    try {
      await authApi.logout();
    } finally {
      // Clear store
      logoutStore();

      // Clear all query caches
      queryClient.clear();

      // Redirect to home
      router.push('/');
    }
  };

  return { logout };
}
```

---

## 1.8. Working with Forms and Validation

### Library: React Hook Form + Zod

> **Frontend clarification:**
> - All validation schemas **MUST** match backend validation
> - In case of discrepancy — backend takes priority (frontend shows errors from backend)
> - Email and password requirements **MUST** be aligned with Security documentation
>
> **Form working principles:**
> 1. Client-side validation (Zod) — **MUST**
> 2. Show errors under fields — **MUST**
> 3. Disabled states during submission — **MUST**
> 4. Loading state on button — **MUST**
> 5. Toast notifications — **MUST**
> 6. Server-side errors — **MUST** show to user

```bash
npm install react-hook-form zod @hookform/resolvers
```

### Validation Schemas (Zod)

```typescript
// lib/validators.ts
import { z } from 'zod';

// Registration
export const registerSchema = z.object({
  email: z
    .string()
    .email('Invalid email')
    .min(1, 'Email is required'),

  password: z
    .string()
    .min(8, 'Minimum 8 characters')
    .regex(/[A-Z]/, 'Must have at least one uppercase letter')
    .regex(/[a-z]/, 'Must have at least one lowercase letter')
    .regex(/[0-9]/, 'Must have at least one digit')
    .regex(/[^A-Za-z0-9]/, 'Must have at least one special character'),

  name: z
    .string()
    .min(2, 'Minimum 2 characters')
    .max(100, 'Maximum 100 characters'),

  phone: z
    .string()
    .regex(/^\+971\d{9}$/, 'Format: +971XXXXXXXXX'),

  agreeToTerms: z
    .boolean()
    .refine(val => val === true, 'Must agree to terms'),
});

export type RegisterFormData = z.infer<typeof registerSchema>;

// Booking
export const bookingSchema = z.object({
  boxId: z.number().min(1, 'Select a box'),

  startDate: z
    .string()
    .min(1, 'Select start date')
    .refine((date) => new Date(date) >= new Date(), 'Date cannot be in the past'),

  durationMonths: z
    .number()
    .min(1, 'Minimum 1 month')
    .max(12, 'Maximum 12 months'),

  userComment: z
    .string()
    .max(500, 'Maximum 500 characters')
    .optional(),

  agreeToTerms: z
    .boolean()
    .refine(val => val === true, 'Must agree to terms'),
});

export type BookingFormData = z.infer<typeof bookingSchema>;

// Review
export const reviewSchema = z.object({
  rating: z
    .number()
    .min(1, 'Minimum 1 star')
    .max(5, 'Maximum 5 stars'),

  text: z
    .string()
    .min(10, 'Minimum 10 characters')
    .max(1000, 'Maximum 1000 characters'),

  pros: z
    .string()
    .max(500, 'Maximum 500 characters')
    .optional(),

  cons: z
    .string()
    .max(500, 'Maximum 500 characters')
    .optional(),
});

export type ReviewFormData = z.infer<typeof reviewSchema>;
```

### Registration Form Example

```typescript
// components/features/auth/RegisterForm.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, RegisterFormData } from '@/lib/validators';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Checkbox } from '@/components/ui/Checkbox';

export function RegisterForm() {
  const { register: registerUser } = useAuthStore();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      name: '',
      phone: '',
      agreeToTerms: false,
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerUser(data);
      toast.success('Registration successful!');
      router.push('/profile');
    } catch (error) {
      toast.error('Registration error');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Email"
        type="email"
        {...register('email')}
        error={errors.email?.message}
      />

      <Input
        label="Password"
        type="password"
        {...register('password')}
        error={errors.password?.message}
      />

      <Input
        label="Name"
        {...register('name')}
        error={errors.name?.message}
      />

      <Input
        label="Phone"
        placeholder="+971501234567"
        {...register('phone')}
        error={errors.phone?.message}
      />

      <Checkbox
        label="I agree to the terms of use"
        {...register('agreeToTerms')}
        error={errors.agreeToTerms?.message}
      />

      <Button
        type="submit"
        fullWidth
        isLoading={isSubmitting}
      >
        Register
      </Button>
    </form>
  );
}
```

### Booking Form Example

```typescript
// components/features/booking/BookingForm.tsx
'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { bookingSchema, BookingFormData } from '@/lib/validators';
import { useCreateBooking } from '@/hooks/useBooking';
import { BookingDatePicker } from './BookingDatePicker';
import { BookingPriceCalculator } from './BookingPriceCalculator';

export function BookingForm({ warehouse, box }: BookingFormProps) {
  const createBooking = useCreateBooking();
  
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      boxId: box.id,
      startDate: '',
      durationMonths: 3,
      userComment: '',
      agreeToTerms: false,
    },
  });

  const watchedFields = watch(['startDate', 'durationMonths']);

  const onSubmit = async (data: BookingFormData) => {
    try {
      await createBooking.mutateAsync({
        warehouse_id: warehouse.id,
        ...data,
      });
      toast.success('Request submitted!');
      router.push('/profile/bookings');
    } catch (error) {
      toast.error('Error creating booking');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold mb-2">{box.size_display}</h3>
        <p className="text-sm text-gray-600">
          {warehouse.name}
        </p>
      </div>

      <Controller
        name="startDate"
        control={control}
        render={({ field }) => (
          <BookingDatePicker
            label="Rental start date"
            value={field.value}
            onChange={field.onChange}
            minDate={new Date()}
            error={errors.startDate?.message}
          />
        )}
      />

      <div>
        <label className="block text-sm font-medium mb-2">
          Rental period
        </label>
        <select
          {...register('durationMonths', { valueAsNumber: true })}
          className="w-full border rounded-lg p-2"
        >
          <option value={1}>1 month</option>
          <option value={3}>3 months (5% discount)</option>
          <option value={6}>6 months (10% discount)</option>
          <option value={12}>12 months (15% discount)</option>
        </select>
        {errors.durationMonths && (
          <p className="text-red-500 text-sm mt-1">
            {errors.durationMonths.message}
          </p>
        )}
      </div>

      <BookingPriceCalculator
        pricePerMonth={box.price_per_month}
        durationMonths={watchedFields[1]}
      />

      <textarea
        {...register('userComment')}
        placeholder="Comment on request (optional)"
        className="w-full border rounded-lg p-3"
        rows={3}
      />
      {errors.userComment && (
        <p className="text-red-500 text-sm">{errors.userComment.message}</p>
      )}

      <Checkbox
        label="I agree to the rental terms"
        {...register('agreeToTerms')}
        error={errors.agreeToTerms?.message}
      />

      <Button
        type="submit"
        fullWidth
        size="lg"
        isLoading={isSubmitting}
      >
        Submit request
      </Button>
    </form>
  );
}
```

### General Form Working Principles

1. **Client-side validation** — through Zod schemas
2. **Server-side validation** — backend always validates data
3. **Error display** — under input fields, in red
4. **Disabled states** — during form submission
5. **Spinners** — submit button shows loading state
6. **Toast notifications** — success/error after submission

---

# Section 2: UI Layer

## 2.1. Design System Principles

### Basic Principles

The design system is built on the following principles:

1. **Consistency** — unified visual language across all components
2. **Scalability** — components are easily extended and reused
3. **Accessibility** — WCAG 2.1 AA compliance
4. **Performance** — rendering optimization, lazy loading
5. **Mobile-first** — responsiveness with mobile device priority

### Color Palette

```css
:root {
  /* Primary Colors */
  --color-primary-500: #6366F1;  /* Main */
  --color-primary-600: #4F46E5;
  
  /* Secondary Colors */
  --color-secondary-500: #10B981;  /* Success/Green */
  
  /* Semantic Colors */
  --color-success: #10B981;
  --color-warning: #F59E0B;
  --color-error: #EF4444;
  --color-info: #3B82F6;
}
```

### Typography

```css
:root {
  --font-sans: 'Inter', -apple-system, sans-serif;
  
  /* Font Sizes */
  --text-sm: 0.875rem;     /* 14px */
  --text-base: 1rem;       /* 16px */
  --text-lg: 1.125rem;     /* 18px */
  --text-xl: 1.25rem;      /* 20px */
  --text-2xl: 1.5rem;      /* 24px */
}
```

### Breakpoints (Mobile-first)

```css
:root {
  --breakpoint-sm: 640px;   /* Tablet portrait */
  --breakpoint-md: 768px;   /* Tablet landscape */
  --breakpoint-lg: 1024px;  /* Desktop */
  --breakpoint-xl: 1280px;  /* Large desktop */
}
```

## 2.2. UI Components

### Button

```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
}

export function Button({ variant = 'primary', size = 'md', isLoading, ...props }: ButtonProps) {
  return (
    <button className={cn(baseStyles, variants[variant], sizes[size])} {...props}>
      {isLoading && <Spinner />}
      {children}
    </button>
  );
}
```

### Input, Card, Modal, Badge, Skeleton, Toast, Tabs

See detailed implementations in the full version of the document.

### Domain Components

#### WarehouseCard

```typescript
export function WarehouseCard({ warehouse, onFavoriteToggle, isFavorite }: Props) {
  return (
    <Card hoverable>
      <Image src={warehouse.photo_main} alt={warehouse.name} />
      <button onClick={() => onFavoriteToggle(warehouse.id)}>
        {isFavorite ? '❤️' : '🤍'}
      </button>
      <h3>{warehouse.name}</h3>
      <p>{warehouse.address.full_address}</p>
      <div>★ {warehouse.rating} ({warehouse.review_count})</div>
      <p>from {warehouse.price_from.toLocaleString()} AED /month</p>
    </Card>
  );
}
```

#### BoxCard

```typescript
export function BoxCard({ box, onSelect, isSelected }: Props) {
  return (
    <Card>
      <Badge>{box.size}</Badge>
      <h3>{box.size_display}</h3>
      <p>{box.dimensions.width} × {box.dimensions.length} × {box.dimensions.height} cm</p>
      <p>Volume: ~{box.volume_m3} m³</p>
      <div>{box.available_quantity} available</div>
      <p className="price">{box.price_per_month.toLocaleString()} AED /month</p>
    </Card>
  );
}
```

#### BookingPriceCalculator

```typescript
export function BookingPriceCalculator({ pricePerMonth, durationMonths }: Props) {
  const { discount, totalPrice } = useMemo(() => {
    let discount = 0;
    if (durationMonths >= 12) discount = 15;
    else if (durationMonths >= 6) discount = 10;
    else if (durationMonths >= 3) discount = 5;

    const discountedPrice = pricePerMonth * (1 - discount / 100);
    const totalPrice = discountedPrice * durationMonths;

    return { discount, totalPrice };
  }, [pricePerMonth, durationMonths]);

  return (
    <Card>
      <h3>Price Calculation</h3>
      <div>Price per month: {pricePerMonth.toLocaleString()} AED </div>
      {discount > 0 && <div>Discount: -{discount}%</div>}
      <div className="total">Total: {totalPrice.toLocaleString()} AED </div>
    </Card>
  );
}
```

## 2.3. Best Practices for Interface Composition

### 1. Separation of Container and Presentational Components

**Presentational** — UI only, receive data through props
**Container** — business logic, API requests, state management

### 2. Minimize Prop Drilling

- Context API for deeply nested data
- Custom hooks for logic reuse
- Composition through children

### 3. Block Reuse

```typescript
// EmptyState - universal component for empty states
export function EmptyState({ icon, title, description, action }: Props) {
  return (
    <div className="empty-state">
      {icon && <div>{icon}</div>}
      <h3>{title}</h3>
      <p>{description}</p>
      {action && <Button onClick={action.onClick}>{action.label}</Button>}
    </div>
  );
}
```

### 4. Responsiveness (Mobile-first)

```typescript
// Responsive grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
  {warehouses.map(w => <WarehouseCard key={w.id} warehouse={w} />)}
</div>

// Responsive Map
export function MapViewResponsive() {
  const { isMd } = useBreakpoint();
  
  if (!isMd) {
    return <Button onClick={() => router.push('/map')}>Show on map</Button>;
  }
  
  return <MapView />;
}
```


---

# Section 3: Technology Stack

## 3.1. Framework: Next.js + React

### Choice: Next.js 14 (App Router) + React 18

**Rationale:**
- ✅ SSR for SEO-critical pages
- ✅ Automatic code splitting
- ✅ Image optimization out of the box
- ✅ File-based routing
- ✅ API Routes for BFF
- ✅ TypeScript support

### Configuration

```javascript
// next.config.js
module.exports = {
  reactStrictMode: true,
  images: {
    domains: ['cdn.storagecompare.ae'],
    formats: ['image/webp', 'image/avif'],
  },
  compress: true,
  
  async headers() {
    return [
      {
        source: '/_next/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },
};
```

### SSR vs CSR vs SSG

| Page | Strategy | Rationale |
|----------|-----------|-------------|
| Home (`/`) | SSR | SEO + dynamic content |
| Catalog (`/catalog`) | SSR | SEO + filters in URL |
| Warehouse details (`/catalog/[id]`) | SSR | SEO critical |
| Map (`/map`) | CSR | Fully client-side |
| Dashboard (`/profile/*`) | CSR | Requires auth, SEO not needed |
| Static (`/about`) | SSG | Doesn't change |

## 3.2. Maps Library

### Choice: Google Maps (primary) + Google Maps (fallback)

**Rationale:**
- ✅ Excellent coverage for UAE/GCC
- ✅ Free up to 25k requests/day
- ✅ Built-in clustering
- ✅ Quality documentation

```typescript
// Load Google Maps
export function loadGoogleMapsScript(apiKey: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/2.1/?apikey=${apiKey}&lang=ru_RU`;
    script.async = true;
    script.onload = () => resolve();
    document.head.appendChild(script);
  });
}
```

## 3.3. Working with API

### Choice: Axios

**Rationale:**
- ✅ Interceptors for error handling
- ✅ Timeout out of the box
- ✅ Automatic JSON
- ✅ Excellent typing

```typescript
// Base client
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 30000,
  withCredentials: true,  // CRITICAL: for httpOnly cookies transmission
});

// Request interceptor — DO NOT add Authorization header
// auth_token is transmitted automatically through cookies
apiClient.interceptors.request.use((config) => config);

// Response interceptor for refresh token
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Refresh through cookies, see section 1.5
      await axios.post('/auth/refresh', {}, { withCredentials: true });
      return apiClient(error.config);  // Retry request
    }
    return Promise.reject(error);
  }
);
```

## 3.4. State-management

### Choice: React Query + Zustand

| Tool | Purpose |
|------------|------------|
| React Query | Server state (API data) |
| Zustand | Global client state |

**React Query:**
- ✅ Automatic caching
- ✅ Background refetching
- ✅ Optimistic updates
- ✅ DevTools

**Zustand:**
- ✅ Minimalist API
- ✅ No Provider required
- ✅ Middleware (persist, devtools)
- ✅ ~1KB size

```typescript
// React Query setup
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,  // 5 minutes
      gcTime: 10 * 60 * 1000,     // 10 minutes
      refetchOnWindowFocus: false,
    },
  },
});

// Zustand store — does NOT store tokens
export const useAuthStore = create(persist(
  (set) => ({
    user: null,
    isAuthenticated: false,
    login: async (email, password) => {
      // Backend sets httpOnly cookies
      const response = await authApi.login(email, password);
      set({ user: response.data.user, isAuthenticated: true });
    },
    logout: () => set({ user: null, isAuthenticated: false }),
  }),
  { name: 'auth-storage' }
));
```

## 3.5. Optimizations

### 1. Lazy Loading

```typescript
// Dynamic import of heavy components
const MapView = dynamic(() => import('@/components/features/map/MapView'), {
  loading: () => <MapSkeleton />,
  ssr: false,
});

const BookingModal = dynamic(() => import('@/components/features/booking/BookingModal'));
```

### 2. Code Splitting

```javascript
webpack: (config) => {
  config.optimization.splitChunks = {
    cacheGroups: {
      maps: {
        test: /[\\/]node_modules[\\/](@googlemaps)/,
        name: 'maps',
        chunks: 'all',
      },
    },
  };
  return config;
}
```

### 3. Image Optimization

```typescript
<Image
  src={warehouse.photo_main}
  alt={warehouse.name}
  width={400}
  height={300}
  placeholder="blur"
  loading="lazy"
  sizes="(max-width: 768px) 100vw, 400px"
/>
```

### 4. Prefetching

```typescript
// Prefetch next page
<Link href="/catalog" prefetch>Catalog</Link>

// Prefetch data on hover
const handleMouseEnter = () => {
  queryClient.prefetchQuery({
    queryKey: ['warehouse', warehouse.id],
    queryFn: () => warehousesApi.getById(warehouse.id),
  });
};
```


---

# Section 4: Development Plan

## 4.1. Sprints and Phases

MVP development is divided into **6 sprints of 2 weeks each** (total 12 weeks / 3 months).

### Roadmap

| Sprint | Weeks | Focus | Key Tasks |
|--------|--------|-------|-----------------|
| **1** | 1-2 | Infrastructure | Setup, UI Kit, design system |
| **2** | 3-4 | Catalog and search | Home, catalog, filters |
| **3** | 5-6 | Details and map | Warehouse details, map with clusters |
| **4** | 7-8 | Auth and booking | Registration, booking form, dashboard |
| **5** | 9-10 | Operator | Dashboard, warehouse/box management |
| **6** | 11-12 | AI and finalization | AI modules, optimization, testing |

### Sprint 1: Infrastructure (weeks 1-2)

**Tasks:**
- [ ] Setup Next.js 14 + TypeScript
- [ ] Configure ESLint, Prettier, Husky
- [ ] Tailwind CSS + design system
- [ ] Base UI components (Button, Input, Card, Modal, etc.)
- [ ] Layout components (Header, Footer)
- [ ] State management setup (React Query + Zustand)
- [ ] API client (Axios with interceptors)

**Result:** ✅ Ready infrastructure and UI Kit

### Sprint 2: Catalog (weeks 3-4)

**Tasks:**
- [ ] Home page with search
- [ ] Catalog page `/catalog`
- [ ] WarehouseCard component
- [ ] Filters (city, price, size, attributes)
- [ ] Sorting and pagination
- [ ] Warehouses API integration
- [ ] Mock data (MSW)

**Result:** ✅ Working catalog with filters

### Sprint 3: Details and map (weeks 5-6)

**Tasks:**
- [ ] Warehouse page `/catalog/[id]`
- [ ] Photo gallery
- [ ] Box list
- [ ] Reviews (preview)
- [ ] Google Maps integration
- [ ] `/map` page with clustering
- [ ] Map and list synchronization

**Result:** ✅ Detail pages + working map

### Sprint 4: Auth and booking (weeks 7-8)

**Tasks:**
- [ ] Pages `/login` and `/register`
- [ ] Forms with validation (Zod)
- [ ] Middleware for route protection
- [ ] BookingForm with price calculator
- [ ] User dashboard `/profile`
- [ ] Bookings list
- [ ] Favorite warehouses

**Result:** ✅ Authentication + booking

### Sprint 5: Operator (weeks 9-10)

**Tasks:**
- [ ] Operator Dashboard `/operator`
- [ ] Metrics and charts
- [ ] Warehouse management
- [ ] Warehouse creation wizard
- [ ] Box management
- [ ] Booking request processing

**Result:** ✅ Operator dashboard

### Sprint 6: AI and finalization (weeks 11-12)

**Tasks:**
- [ ] AIBoxFinder widget
- [ ] AI recommendations
- [ ] ReviewForm
- [ ] Performance optimization
- [ ] E2E tests (Playwright)
- [ ] Lighthouse audit (score > 90)
- [ ] Bug fixes

**Result:** ✅ Ready for release MVP

## 4.2. Backend Integrations

### Phase 1: Mock API (Sprints 1-2)

```typescript
// MSW for mocks
import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('/api/v1/warehouses', () => {
    return HttpResponse.json({
      success: true,
      data: mockWarehouses,
      pagination: mockPagination,
    });
  }),
];
```

### Phase 2: Staging Backend (Sprints 3-4)

```typescript
// .env.local
NEXT_PUBLIC_API_URL=https://api-staging.storagecompare.ae/v1
NEXT_PUBLIC_USE_MOCKS=false
```

### Phase 3: Production Backend (Sprints 5-6)

```typescript
// .env.production
NEXT_PUBLIC_API_URL=https://api.storagecompare.ae/v1
```

## 4.3. Testing

### Unit Tests (Jest + React Testing Library)

```typescript
// UI component testing
describe('Button', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    fireEvent.click(screen.getByText('Click'));
    expect(handleClick).toHaveBeenCalled();
  });
});
```

### Integration Tests

```typescript
// Form testing
describe('BookingForm', () => {
  it('submits form with correct data', async () => {
    render(<BookingForm warehouse={mock} box={mock} />);

    await user.type(screen.getByLabelText('Comment'), 'Test');
    await user.click(screen.getByText('Submit'));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();
    });
  });
});
```

### E2E Tests (Playwright)

```typescript
// Critical scenarios
test('booking process', async ({ page }) => {
  await page.goto('/');
  await page.fill('[placeholder="City"]', 'Dubai');
  await page.click('button:has-text("Find")');
  await page.click('[data-testid="warehouse-card"]:first-child');
  await page.click('button:has-text("Book")');

  // Fill form
  await page.click('[data-testid="date-picker"]');
  await page.selectOption('select[name="duration"]', '6');
  await page.check('input[name="agreeToTerms"]');
  await page.click('button[type="submit"]');

  await expect(page).toHaveURL(/\/profile\/bookings/);
});
```

### CI/CD Integration

```yaml
# .github/workflows/test.yml
name: Tests
on: [pull_request, push]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm ci
      - run: npm run test:unit
      
  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run test:e2e
```

**Test coverage:**
- Unit tests: 70%+ for utilities and UI components
- E2E tests: critical flows (search, booking, auth)


---

# Section 5: Performance Requirements

## 5.1. Load Time

### Target Metrics (Core Web Vitals)

| Metric | MVP Target |
|---------|--------------|
| **LCP** (Largest Contentful Paint) | ≤ 2.5s |
| **FID** (First Input Delay) | ≤ 100ms |
| **CLS** (Cumulative Layout Shift) | ≤ 0.1 |
| **TTFB** (Time to First Byte) | ≤ 800ms |
| **FCP** (First Contentful Paint) | ≤ 1.8s |

### Lighthouse Score

| Category | Minimum | Target |
|-----------|---------|------|
| Performance | 85 | **90+** |
| Accessibility | 90 | **95+** |
| Best Practices | 90 | **95+** |
| SEO | 95 | **100** |

### Optimization Strategies

#### 1. SSR for Critical Pages

```typescript
// Server-Side Rendering
export default async function CatalogPage({ searchParams }) {
  const warehouses = await getWarehouses(searchParams);
  return <WarehouseList warehouses={warehouses} />;
}

// Streaming SSR
export default async function WarehousePage({ params }) {
  return (
    <Suspense fallback={<Skeleton />}>
      <WarehouseDetails id={params.id} />
    </Suspense>
  );
}
```

#### 2. Code Splitting

```typescript
// Dynamic import
const MapView = dynamic(() => import('@/components/features/map/MapView'), {
  loading: () => <MapSkeleton />,
  ssr: false,
});
```

#### 3. Image Optimization

```typescript
<Image
  src={warehouse.photo_main}
  alt={warehouse.name}
  width={400}
  height={300}
  priority={false}  // lazy loading
  placeholder="blur"
  sizes="(max-width: 768px) 100vw, 400px"
  quality={85}
/>
```

#### 4. Font Optimization

```typescript
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
});
```

## 5.2. Maps Optimization

### 1. Lazy Library Loading

```typescript
export function useMapLoader() {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        loadGoogleMapsScript();
      }
    });
    
    observer.observe(mapContainerRef.current);
    return () => observer.disconnect();
  }, []);
}
```

### 2. Render Only Visible Area

```typescript
updateVisibleMarkers(warehouses: Warehouse[]) {
  const bounds = this.map.getBounds();

  warehouses.forEach((warehouse) => {
    if (this.isInBounds(warehouse.coordinates, bounds)) {
      this.addMarker(warehouse);
    }
  });
}
```

### 3. Debounce for boundschange

```typescript
const debouncedSetBounds = useDebouncedCallback(
  (bounds: BoundingBox) => {
    setBounds(bounds);
  },
  500 // 500ms debounce
);
```

## 5.3. Caching

### 1. React Query Cache

```typescript
export function useWarehouses(filters) {
  return useQuery({
    queryKey: ['warehouses', filters],
    queryFn: () => warehousesApi.search(filters),
    staleTime: 5 * 60 * 1000,  // 5 minutes
    gcTime: 10 * 60 * 1000,     // 10 minutes
  });
}

// Dictionaries - cache forever
export function useAttributes() {
  return useQuery({
    queryKey: ['attributes'],
    queryFn: () => attributesApi.getAll(),
    staleTime: Infinity,
    gcTime: Infinity,
  });
}
```

### 2. Browser Cache

```javascript
// next.config.js
async headers() {
  return [
    {
      source: '/_next/static/:path*',
      headers: [
        { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
      ],
    },
    {
      source: '/:path*',
      headers: [
        { key: 'Cache-Control', value: 'public, s-maxage=3600, stale-while-revalidate' },
      ],
    },
  ];
}
```

### 3. LocalStorage for Settings

```typescript
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : initialValue;
  });

  const setStoredValue = (newValue: T) => {
    setValue(newValue);
    window.localStorage.setItem(key, JSON.stringify(newValue));
  };

  return [value, setStoredValue];
}
```

## 5.4. Pagination, Sorting and Filtering

### 1. Server-Side Pagination

```typescript
export function useWarehouses(filters) {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['warehouses', { ...filters, page }],
    queryFn: () => warehousesApi.search({ ...filters, page, perPage: 12 }),
    keepPreviousData: true,  // Show old data while loading
  });

  return { warehouses: data?.data, pagination: data?.pagination, page, setPage };
}
```

### 2. Infinite Scroll

```typescript
export function useInfiniteWarehouses(filters) {
  return useInfiniteQuery({
    queryKey: ['warehouses', 'infinite', filters],
    queryFn: ({ pageParam = 1 }) => warehousesApi.search({ ...filters, page: pageParam }),
    getNextPageParam: (lastPage) => 
      lastPage.pagination.has_next ? lastPage.pagination.page + 1 : undefined,
    initialPageParam: 1,
  });
}

// Auto-load on scroll
useEffect(() => {
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && hasNextPage) {
      fetchNextPage();
    }
  });

  observer.observe(triggerRef.current);
  return () => observer.disconnect();
}, [hasNextPage, fetchNextPage]);
```

### 3. Filters in URL

```typescript
export function useFiltersFromUrl() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const filters = useMemo(() => ({
    city: searchParams.get('city') || '',
    priceMin: Number(searchParams.get('price_min')) || 0,
    sizes: searchParams.get('sizes')?.split(',') || [],
  }), [searchParams]);

  const updateFilters = useCallback((newFilters) => {
    const params = new URLSearchParams();
    // ... fill params
    router.push(`/catalog?${params.toString()}`, { scroll: false });
  }, [router]);

  return { filters, updateFilters };
}
```

### 4. Loading Indication

```typescript
export function WarehouseCatalog() {
  const { warehouses, isLoading, isFetching } = useWarehouses(filters);

  return (
    <div className="relative">
      {isFetching && !isLoading && (
        <div className="absolute inset-0 bg-white/50 z-10">
          <Spinner />
        </div>
      )}

      {isLoading ? (
        <WarehouseListSkeleton />
      ) : warehouses.length === 0 ? (
        <EmptyState title="Not found" />
      ) : (
        <WarehouseList warehouses={warehouses} />
      )}
    </div>
  );
}
```

## Performance Monitoring

### Web Vitals Tracking

```typescript
export function WebVitalsReporter() {
  useReportWebVitals((metric) => {
    // Send to Google Analytics
    if (window.gtag) {
      window.gtag('event', metric.name, {
        value: Math.round(metric.value),
        metric_id: metric.id,
      });
    }
  });

  return null;
}
```

### Performance Budgets

```javascript
// next.config.js
webpack: (config, { dev }) => {
  if (!dev) {
    config.performance = {
      maxAssetSize: 250000,        // 250 KB
      maxEntrypointSize: 400000,   // 400 KB
      hints: 'warning',
    };
  }
  return config;
}
```

**Target Bundle Sizes:**

| Type | Size (gzip) | Max |
|-----|---------------|------|
| Initial JS | < 100 KB | 150 KB |
| Total JS | < 300 KB | 500 KB |
| CSS | < 30 KB | 50 KB |

---

# Conclusion

This Frontend Implementation Plan describes the complete architecture, technology stack, development plan and performance requirements for MVP v1 of the Self-Storage aggregator.

---

## Component Status Summary

### AI Components

| Component | MVP Status | Description |
|-----------|------------|----------|
| `AIBoxFinder` | **MVP STUB** | Feature-flagged, basic UI |
| `AIChat` | **POST-MVP** | Do not implement in MVP |
| `AIRecommendations` | **MVP STUB** | Feature-flagged, basic UI |

### Authentication

| Aspect | Status | Description |
|--------|--------|----------|
| httpOnly cookies | **MUST** | **THE ONLY** way to store tokens |
| Middleware protection | **MUST** | Edge Runtime, jose for JWT |
| ProtectedRoute | **MUST** | Client-side fallback |
| Refresh token flow | **MUST** | Automatic through cookies |
| withCredentials: true | **MUST** | For all axios requests |
| LocalStorage for tokens | **PROHIBITED** | XSS vulnerability |
| Bearer token in header | **PROHIBITED** | Do not use |
| Tokens in Zustand | **PROHIBITED** | Store only holds user data |

### Maps

| Aspect | Status | Description |
|--------|--------|----------|
| Google Maps | **MUST** | Primary provider |
| Google Maps | **POST-MVP** | Backup provider |
| Client-side clustering | **MUST** | Via Google Maps SDK |
| Server-side clustering | **SHOULD** | For optimization (1000+ warehouses) |

### Pages

| Group | Status |
|--------|--------|
| Public (`/`, `/catalog`, `/map`) | **MUST** |
| Auth (`/login`, `/register`) | **MUST** |
| Reset Password | **PLACEHOLDER** for MVP |
| Profile (`/profile/*`) | **MUST** basic, **SHOULD** settings |
| Operator (`/operator/*`) | **MUST** basic, **SHOULD** analytics |

### Performance

| Metric | Target | Status |
|---------|------|--------|
| LCP | ≤ 2.5s | **MUST** |
| FID | ≤ 100ms | **MUST** |
| CLS | ≤ 0.1 | **MUST** |
| Lighthouse Performance | ≥ 85 | **MUST** |
| Lighthouse SEO | ≥ 95 | **MUST** |

---

**Key Document Achievements:**
- ✅ Detailed frontend architecture (structure, routing, components, state)
- ✅ Complete design system and UI Kit
- ✅ Justified technology stack (Next.js 14, React Query, Zustand, Google Maps)
- ✅ Detailed sprint-based development plan (12 weeks)
- ✅ Clear performance requirements (Core Web Vitals, Lighthouse > 90)

**Ready for Frontend Team Handoff:**
- 📋 Project structure ready for setup
- 🎨 Design system and components described
- 🔌 API integrations defined
- 📅 3-month roadmap detailed
- ⚡ Optimizations and best practices included

**Next Steps:**
1. Project setup according to structure
2. UI Kit implementation (Sprint 1)
3. Backend API integration
4. Phased development by sprints
5. Testing and optimization

---

**Creation Date:** December 1, 2024
**Audit Date:** December 16, 2024
**Security Fix Date:** December 16, 2024
**Version:** 1.2 (Security Fixed)
**Status:** GREEN (Approved)

