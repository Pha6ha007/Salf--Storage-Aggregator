# Frontend Architecture Specification (MVP v1)
# Self-Storage Aggregator

**Document Version:** 1.5  
**Last Updated:** December 16, 2025  
**Status:** Implementation Ready (Auth Contract Aligned with API)

---



---

## 📝 Changelog v1.2 (December 16, 2025)

**OBSOLETE** - This changelog contained incorrect auth model. See v1.5 for correct cookie-based auth per API spec.


## 📝 Changelog v1.3 (December 16, 2025)

**Implementation Clarity Pass - Frontend Developer Perspective**
- ✅ **Auth refresh flow** - Explicit concurrent 401 handling, refresh failure behavior
- ✅ **State management** - Clear source-of-truth boundaries (query cache vs store vs URL)
- ✅ **Maps lifecycle** - Client-only behavior, mount/unmount rules, filter change handling
- ✅ **Error mapping** - Concise API error → UI behavior table
- ✅ **Loading standards** - When to use skeleton vs spinner, local vs global rules
- ✅ **SEO ownership** - Which pages MUST implement SEO in MVP, responsibility levels

**What changed:**
- Section 4.2: Added "Implementation Notes" with concurrent 401 handling
- Section 5: Added "Source of Truth Rules" subsection
- Section 8: Added "Loading State Standards" and "Error Mapping Table"
- Section 9: Added "SEO Ownership Matrix"
- Section 12: Added "Map Lifecycle Rules" subsection

**No architecture changes** - Only implementation clarifications for frontend developers.

---
---

## 📝 Changelog v1.4 (December 16, 2025)

**MVP Decisions & Implementation Clarifications Locked**
- ✅ **SSR/CSR/SSG decisions** - Explicit rendering strategy table per page type (MVP locked)
- ✅ **Source of truth conflict resolution** - URL overrides store, update URL first then refetch
- ✅ **Error/Loading responsibility boundary** - Frontend displays only, no business logic
- ✅ **SEO requirements** - Clear MVP must-have vs optional pages
- ✅ **Maps fallback UX** - Explicit degradation when maps fail
- ✅ **Auth refresh failure** - Clear UX flow with 401 loop prevention

**What changed:**
- Section 1.3: Added MVP Rendering Strategy Decision Table
- Section 5: Enhanced Source of Truth Rules with conflict resolution
- Section 8: Added Responsibility Boundary subsection
- Section 9: Clarified SEO requirements for MVP
- Section 12: Added Maps Fallback & Degradation Rules
- Section 4.2/13: Added Auth Refresh Failure UX Flow

**No rewrites** - Only essential MVP decision blocks added (max 2 pages total).

---


## 📝 Changelog v1.5 (December 16, 2025)

**CRITICAL: Auth Contract Aligned with Canonical API Specification**
- ✅ **Cookie-based authentication** - httpOnly cookies per API Design Blueprint (DOC-015)
- ✅ **Removed body-based auth** - Previous versions incorrectly described localStorage tokens
- ✅ **Frontend never handles tokens** - Backend sets/manages auth_token and refresh_token via Set-Cookie
- ✅ **Aligned with DOC-015 and DOC-016** - Frontend consumes API contract, does not redefine it
- ✅ **Refresh flow corrected** - POST /auth/refresh with empty body, credentials: include
- ✅ **401/403 handling unchanged** - Same UX flow, but uses cookie-based backend

**What changed:**
- Section 4.2: Complete rewrite to cookie-based auth (aligned with API spec)
- Removed all localStorage/sessionStorage token code
- Removed all body-based refresh token handling
- Added withCredentials: true for cookie transmission
- Updated all auth examples to use cookies only

**Migration from v1.4:**
- Remove all token storage code (localStorage, sessionStorage)
- Remove token reading/writing logic
- Add credentials: 'include' or withCredentials: true to API requests
- Backend handles all token management via cookies

**Source of truth:** API Design Blueprint (DOC-015), API Detailed Specification (DOC-016)

**This is the FINAL and CANONICAL auth model for MVP v1.**

---
## Table of Contents

### Architecture Fundamentals
1. **General Frontend Architecture**
2. **Technology Stack**
3. **File Structure and Modules**
4. **Frontend Implementation Decisions (MVP v1)** ← NEW SECTION

### Data Management and UI
5. **State Management Principles**
6. **Data Loading Approach**
7. **UI Component Organization**

### UX and Optimization
8. **Loading and Error State Handling**
9. **SEO Optimization**
10. **Accessibility**

### Performance and Maps
11. **Performance Optimization**
12. **Maps Integration**

### Security and Integration
13. **Token Handling and Security**
14. **API Interaction Diagrams**

---

## 1. Общая архитектура фронтенда

### 1.1. Общая концепция

Фронтенд Self-Storage Aggregator представляет собой **гибридное приложение** на базе Next.js 14+ с использованием App Router, сочетающее следующие подходы к рендерингу:

- **SSR (Server-Side Rendering)** — для SEO-критичных страниц (главная, каталог складов, карточки складов)
- **SSG (Static Site Generation)** — для статического контента (о проекте, FAQ, условия использования)
- **CSR (Client-Side Rendering)** — для интерактивных частей (личные кабинеты, формы бронирования, карта)

**Ключевые принципы архитектуры:**

1. **Performance-first** — оптимизация загрузки, code splitting, lazy loading
2. **Mobile-first** — адаптивный дизайн с приоритетом на мобильных пользователей
3. **Progressive Enhancement** — базовая функциональность работает даже при отключенном JS
4. **Component-driven** — максимальное переиспользование компонентов
5. **Type-safety** — полное покрытие TypeScript для предотвращения ошибок
6. **Accessibility** — соответствие WCAG 2.1 уровня AA (минимум)

---

### 1.2. Роли фронтенда

#### 1.2.1. Публичная часть (поиск и бронирование)

**Основной функционал:**

- **Поиск складов:**
  - Поиск по адресу/городу/станции метро
  - Интеграция с Google Maps для геолокации
  - Отображение результатов на карте и в виде списка
  - Фильтрация по цене, размеру, удобствам
  
- **Карточка склада:**
  - Детальная информация о складе
  - Галерея фотографий
  - Список доступных боксов
  - Отзывы других пользователей
  - AI-помощник для подбора размера бокса
  
- **Бронирование:**
  - Выбор бокса и периода аренды
  - Заполнение контактных данных
  - Создание заявки на бронирование

**Маршруты:**

```
/                          # Главная страница (SSR)
/search                    # Страница поиска с картой и фильтрами (SSR)
/warehouses/[id]           # Карточка склада (SSR)
/about                     # О проекте (SSG)
/contacts                  # Контакты (SSG)
/faq                       # FAQ (SSG)
/terms                     # Условия использования (SSG)
/privacy                   # Политика конфиденциальности (SSG)
```

---

#### 1.2.2. Личный кабинет пользователя

**Основной функционал:**

- Просмотр активных и завершенных бронирований
- Управление избранными складами
- Редактирование профиля
- История операций

**Маршруты:**

```
/dashboard                 # Главная кабинета (CSR + AuthGuard)
/dashboard/bookings        # Мои бронирования (CSR + AuthGuard)
/dashboard/favorites       # Избранные склады (CSR + AuthGuard)
/dashboard/profile         # Редактирование профиля (CSR + AuthGuard)
```

---

#### 1.2.3. Кабинет оператора

**Основной функционал:**

- Управление складами (создание, редактирование, удаление)
- Управление боксами (добавление, изменение статуса)
- Обработка входящих бронирований
- Просмотр аналитики

**Маршруты:**

```
/operator                           # Главная оператора (CSR + RoleGuard)
/operator/warehouses                # Список складов (CSR + RoleGuard)
/operator/warehouses/new            # Создание склада (CSR + RoleGuard)
/operator/warehouses/[id]           # Редактирование склада (CSR + RoleGuard)
/operator/warehouses/[id]/boxes     # Управление боксами (CSR + RoleGuard)
/operator/bookings                  # Входящие бронирования (CSR + RoleGuard)
/operator/analytics                 # Аналитика (CSR + RoleGuard)
```

**ВАЖНО:** Все маршруты оператора используют префикс `/operator/` для четкого разделения от публичных маршрутов.

---

### 1.3. Интеграция с системной архитектурой

#### 1.3.1. Взаимодействие с Backend API

Frontend взаимодействует с Backend через RESTful API:

```
Frontend (Next.js) ←→ API Gateway ←→ Backend Services
```

**API Base URL:**
- Development: `http://localhost:4000/api/v1`
- Production: `https://api.storagecompare.ae/api/v1`

**Основные эндпоинты:**

```typescript
// Поиск
GET    /warehouses              // Поиск складов
GET    /warehouses/:id          // Детали склада
GET    /warehouses/:id/boxes    // Боксы склада

// Бронирования
POST   /bookings                // Создание бронирования
GET    /bookings                // Список бронирований пользователя
GET    /bookings/:id            // Детали бронирования
PATCH  /bookings/:id            // Обновление статуса (оператор)

// Оператор
POST   /operator/warehouses     // Создание склада
PATCH  /operator/warehouses/:id // Обновление склада
DELETE /operator/warehouses/:id // Удаление склада
GET    /operator/bookings       // Входящие бронирования

// Аутентификация
POST   /auth/register           // Регистрация
POST   /auth/login              // Вход
POST   /auth/refresh            // Обновление токена
POST   /auth/logout             // Выход

// AI
POST   /ai/recommend-box        // Рекомендация размера бокса
```

**Детальная спецификация API:** См. `api_design_blueprint_mvp_v1_CANONICAL.md`

---

#### 1.3.2. Стратегия рендеринга

**Публичные страницы (SEO-критичные):**

- **SSR:** Главная, поиск, карточки складов
- **Prefetching:** Данные загружаются на сервере перед рендерингом
- **Hydration:** React подхватывает DOM на клиенте для интерактивности

**Приватные страницы (кабинеты):**

- **CSR:** Полностью client-side rendering
- **Auth Guard:** Проверка авторизации перед рендерингом
- **No SEO:** Не индексируется поисковиками

**Статический контент:**

- **SSG:** Генерируется на этапе build
- **Revalidation:** ISR с периодом 24 часа для редко меняющихся страниц

---



---

### 1.3.3. MVP Rendering Strategy Decision Table (LOCKED)

**For frontend implementation: Explicit rendering strategy per page type in MVP**

| Page Type | Route Example | MVP Rendering | SEO Required | Notes |
|-----------|---------------|---------------|--------------|-------|
| **Homepage** | `/` | SSR | ✅ YES | SEO-critical entry point |
| **City/Catalog Listing** | `/search`, `/catalog` | SSR | ✅ YES | Crawlable warehouse listing |
| **Search with Filters** | `/search?city=Moscow&price_max=10000` | SSR | ⚠️ Canonical only | Filters in URL, canonical to `/search` |
| **Warehouse Details** | `/warehouses/[id]` | SSR | ✅ YES | SEO-critical product page |
| **Static Pages** | `/about`, `/faq`, `/terms` | SSG | ✅ YES | Build-time generation |
| **User Dashboard** | `/dashboard/*` | CSR | ❌ NO (noindex) | Private area, auth-gated |
| **Operator Dashboard** | `/operator/*` | CSR | ❌ NO (noindex) | Private area, auth-gated |
| **Auth Pages** | `/login`, `/register` | CSR | ❌ NO (noindex) | No SEO value |
| **Map Component** | (embedded) | **CSR only** | N/A | MUST use `dynamic(() => import(), { ssr: false })` |

**Critical Rules:**

1. **Maps MUST be CSR-only:**
   ```typescript
   // REQUIRED pattern for all map components
   const InteractiveMap = dynamic(
     () => import('@/components/map/InteractiveMap'),
     { ssr: false, loading: () => <MapSkeleton /> }
   );
   ```

2. **Search with filters:**
   - Server-renders content based on URL params
   - Canonical URL points to base `/search` (no params)
   - Filters update URL → triggers new SSR fetch

3. **Dashboard pages:**
   - Always CSR (use `'use client'` directive)
   - AuthGuard/RoleGuard on client only
   - No SSR needed (private content)

**This table is FINAL for MVP v1. No changes without architecture review.**

---

## 2. Технологический стек

### 2.1. Core Framework

#### Next.js 14.2+ с App Router

**Выбор обоснован:**

- Гибридный рендеринг (SSR/SSG/CSR) из коробки
- App Router — новый стандарт маршрутизации
- Server Components для оптимизации
- Встроенная оптимизация изображений
- API Routes для BFF-слоя
- Автоматический code splitting

**Конфигурация:**

```javascript
// next.config.js
module.exports = {
  reactStrictMode: true,
  swcMinify: true,
  compress: true,
  
  images: {
    domains: ['cdn.storagecompare.ae', 's3.me-south-1.amazonaws.com'],
    formats: ['image/avif', 'image/webp'],
  },
  
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-dialog'],
  },
};
```

---

#### React 18.3+

**Ключевые возможности:**

- Concurrent Rendering для плавного UX
- Automatic Batching для оптимизации ре-рендеров
- Suspense для декларативной загрузки
- Server Components (через Next.js)
- useTransition для недеструктивных обновлений

---

#### TypeScript 5.3+

**Конфигурация:**

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "jsx": "preserve",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

**Правила использования:**

- Strict mode обязателен
- Все типы должны быть явно определены
- No `any` без комментария обоснования
- Использование `unknown` вместо `any` где возможно

---

### 2.2. Управление данными

#### React Query 5.0+ (TanStack Query)

**Основной инструмент для:**

- Кэширование серверных данных
- Автоматическая инвалидация
- Optimistic updates
- Background refetching
- Pagination и infinite scroll

**Конфигурация:**

```typescript
// lib/react-query-config.ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 минут
      gcTime: 10 * 60 * 1000,   // 10 минут
      retry: (failureCount, error: any) => {
        const status = error.response?.status;
        if (status && status >= 400 && status < 500 && status !== 429) {
          return false;
        }
        return failureCount < 3;
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
    },
  },
});
```

---

#### Axios 1.6+

**HTTP клиент с:**

- Централизованной конфигурацией
- Request/Response interceptors
- Автоматической обработкой токенов
- Retry логикой

**Базовая конфигурация:**

```typescript
// lib/api/client.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true, // Для httpOnly cookies
});

export default apiClient;
```

---

### 2.3. State Management

#### Zustand 4.5+

**Используется для:**

- Глобального клиентского состояния (auth, UI, filters)
- Персистентного состояния (localStorage)
- Простых store без boilerplate

**НЕ используется для:**

- Серверных данных (использовать React Query)
- Локального состояния компонентов (использовать useState)

**Пример store:**

```typescript
// stores/auth-store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
```

---

### 2.4. UI Libraries

#### Tailwind CSS 3.4+

**Utility-first CSS framework:**

```javascript
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          // ... остальные оттенки
          600: '#0284c7',
          // ...
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)'],
      },
    },
  },
  plugins: [],
};
```

---

#### Radix UI 1.0+ / shadcn/ui

**Accessible компоненты:**

- Dialog, Dropdown, Select, Accordion, Tabs
- Keyboard navigation из коробки
- ARIA attributes
- Headless компоненты (полная кастомизация)

**Установка компонентов:**

```bash
npx shadcn-ui@latest add button
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add select
```

---

#### Lucide React

**Иконки:**

```typescript
import { Search, Heart, MapPin, User } from 'lucide-react';

// Использование
<Search className="h-5 w-5" />
```

---

### 2.5. Формы и валидация

#### React Hook Form 7.50+

**Для всех форм:**

- Минимальные ре-рендеры
- Встроенная валидация
- Интеграция с Zod

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(schema),
});
```

---

#### Zod 3.22+

**Schema validation:**

```typescript
import { z } from 'zod';

const bookingSchema = z.object({
  box_id: z.number().positive(),
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  duration_months: z.number().min(1).max(12),
  customer: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    phone: z.string().regex(/^\+7\d{10}$/),
  }),
});
```

---

### 2.6. Карты

#### Google Maps API 2.1 (основной)

```bash
npm install @react-google-maps/api
```

**Конфигурация:**

```typescript
export const GOOGLE_MAPS_CONFIG = {
  apikey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  lang: 'ru_RU',
  version: '2.1',
};
```

---

#### 2GIS API (fallback)

Используется как резервный вариант при недоступности Google Maps.

---

## 3. Структура файлов и модули

### 3.1. Общая организация проекта

```
self-storage-frontend/
├── public/                   # Статические файлы
│   ├── images/
│   ├── fonts/
│   └── favicon.ico
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── (public)/         # Публичные страницы
│   │   ├── dashboard/        # Личный кабинет
│   │   ├── operator/         # Кабинет оператора
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/           # Shared компоненты
│   │   ├── ui/               # Базовые UI (shadcn/ui)
│   │   ├── layout/           # Layout компоненты
│   │   └── shared/           # Общие составные компоненты
│   ├── modules/              # Feature модули
│   │   ├── warehouses/
│   │   ├── bookings/
│   │   ├── auth/
│   │   └── map/
│   ├── lib/                  # Утилиты и конфигурация
│   │   ├── api/
│   │   ├── utils/
│   │   ├── hooks/
│   │   └── query-keys.ts
│   ├── stores/               # Zustand stores
│   ├── types/                # TypeScript типы
│   └── styles/               # Глобальные стили
├── next.config.js
├── tailwind.config.js
└── tsconfig.json
```

---

### 3.2. App Router структура

```
src/app/
├── (public)/                 # Route group - публичные страницы
│   ├── page.tsx              # / - Главная (SSR)
│   ├── search/
│   │   └── page.tsx          # /search - Поиск (SSR)
│   ├── warehouses/
│   │   └── [id]/
│   │       └── page.tsx      # /warehouses/:id - Карточка (SSR)
│   ├── about/
│   │   └── page.tsx          # /about - О проекте (SSG)
│   └── layout.tsx            # Layout для публичных страниц
│
├── dashboard/                # Личный кабинет (CSR + AuthGuard)
│   ├── layout.tsx
│   ├── page.tsx              # /dashboard
│   ├── bookings/
│   │   └── page.tsx          # /dashboard/bookings
│   ├── favorites/
│   │   └── page.tsx          # /dashboard/favorites
│   └── profile/
│       └── page.tsx          # /dashboard/profile
│
├── operator/                 # Кабинет оператора (CSR + RoleGuard)
│   ├── layout.tsx
│   ├── page.tsx              # /operator
│   ├── warehouses/
│   │   ├── page.tsx          # /operator/warehouses
│   │   ├── new/
│   │   │   └── page.tsx      # /operator/warehouses/new
│   │   └── [id]/
│   │       ├── page.tsx      # /operator/warehouses/:id
│   │       └── boxes/
│   │           └── page.tsx  # /operator/warehouses/:id/boxes
│   ├── bookings/
│   │   └── page.tsx          # /operator/bookings
│   └── analytics/
│       └── page.tsx          # /operator/analytics
│
├── login/
│   └── page.tsx              # /login
├── register/
│   └── page.tsx              # /register
├── layout.tsx                # Root layout
├── loading.tsx               # Global loading
├── error.tsx                 # Global error
├── not-found.tsx             # 404 page
└── globals.css               # Глобальные стили
```

---

### 3.3. Модульная архитектура

#### Warehouses Module

```
src/modules/warehouses/
├── components/
│   ├── WarehouseCard.tsx
│   ├── WarehouseDetails.tsx
│   ├── WarehouseList.tsx
│   └── WarehouseForm.tsx
├── hooks/
│   ├── useWarehouses.ts
│   ├── useWarehouse.ts
│   ├── useCreateWarehouse.ts
│   └── useUpdateWarehouse.ts
├── api/
│   └── warehouses-api.ts
└── types/
    └── warehouse.types.ts
```

#### Bookings Module

```
src/modules/bookings/
├── components/
│   ├── BookingCard.tsx
│   ├── BookingForm.tsx
│   └── BookingList.tsx
├── hooks/
│   ├── useBookings.ts
│   ├── useCreateBooking.ts
│   └── useUpdateBookingStatus.ts
├── api/
│   └── bookings-api.ts
└── types/
    └── booking.types.ts
```

---

### 3.4. API Client Layer

```
src/lib/api/
├── client.ts                 # Axios instance
├── interceptors/
│   ├── request.interceptor.ts
│   └── response.interceptor.ts
├── warehouses-api.ts
├── bookings-api.ts
├── auth-api.ts
└── upload-api.ts
```

**Пример API модуля:**

```typescript
// lib/api/warehouses-api.ts
import apiClient from './client';
import type { Warehouse, SearchFilters } from '@/types';

export const warehousesApi = {
  search: async (filters: SearchFilters) => {
    const response = await apiClient.get('/warehouses', { params: filters });
    return response.data;
  },
  
  getById: async (id: number) => {
    const response = await apiClient.get(`/warehouses/${id}`);
    return response.data.data;
  },
  
  create: async (data: Partial<Warehouse>) => {
    const response = await apiClient.post('/operator/warehouses', data);
    return response.data.data;
  },
};
```

---

## 4. Frontend Implementation Decisions (MVP v1)

### Цель секции

Эта секция устраняет неопределенности для фронтенд-разработчиков, **не изменяя функциональность MVP**. Все решения ссылаются на существующие backend, API и security спецификации там, где backend поведение критично.

---

### 4.1. Rendering Model

#### A) Оператор Dashboard: CSR с Client-Side Auth

**Решение:**
- Оператор Dashboard рендерится **полностью на клиенте (CSR)**.
- **НЕ используется SSR** для страниц оператора (`/operator/*`).

**Обоснование:**
- Оператор dashboard не требует SEO (private area).
- Упрощает проверку авторизации и role-based access.
- Нет необходимости в server components для приватных данных.

**Реализация:**

```typescript
// app/operator/layout.tsx
'use client';  // Обязательная директива

import { AuthGuard } from '@/components/auth/AuthGuard';
import { RoleGuard } from '@/components/auth/RoleGuard';

export default function OperatorLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard redirectTo="/login">
      <RoleGuard allowedRoles={['operator', 'admin']}>
        <OperatorDashboardLayout>
          {children}
        </OperatorDashboardLayout>
      </RoleGuard>
    </AuthGuard>
  );
}
```

**Client-side auth flow:**
1. Layout монтируется → проверка `isAuthenticated` из Zustand
2. Если `false` → редирект на `/login?redirect=/operator`
3. Если `true` → проверка `userRole`
4. Если роль не `operator`/`admin` → отображение `<PermissionError />`

**Нет SSR auth проверки:** Server-side проверка токена НЕ выполняется для `/operator/*` маршрутов.

---

#### B) Публичные страницы: SSR для SEO

**Решение:**
- Публичные страницы (`/`, `/search`, `/warehouses/[id]`) используют **SSR**.
- Данные prefetch'атся на сервере перед рендерингом.

**Реализация:**

```typescript
// app/(public)/warehouses/[id]/page.tsx
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import { warehousesApi } from '@/lib/api/warehouses-api';
import { queryKeys } from '@/lib/query-keys';

export default async function WarehousePage({ params }: { params: { id: string } }) {
  const queryClient = new QueryClient();
  const warehouseId = Number(params.id);
  
  // Prefetch на сервере
  await queryClient.prefetchQuery({
    queryKey: queryKeys.warehouses.detail(warehouseId),
    queryFn: () => warehousesApi.getById(warehouseId),
  });
  
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <WarehouseDetails id={warehouseId} />
    </HydrationBoundary>
  );
}
```

**Обработка ошибок при SSR:**
- Если API возвращает 404 → Next.js `notFound()` → рендерится `not-found.tsx`
- Если API недоступен (5xx, timeout) → `error.tsx` с возможностью retry

---

### 4.2. Authentication & Tokens (Frontend Perspective)

#### Auth Contract (CANONICAL - Cookie-Based)

**This section describes how frontend consumes the authentication API.**

**Source of truth:** API Design Blueprint (DOC-015), API Detailed Specification (DOC-016)

**Strategy:** **Cookie-based authentication** (httpOnly cookies managed by backend)

**CRITICAL:** Frontend does NOT handle tokens directly. Backend sets and manages all auth cookies.

---

#### A) Cookie-Based Auth Model (CANONICAL)

**How it works:**

| Aspect | Implementation | Responsibility |
|--------|----------------|----------------|
| **Token Storage** | httpOnly cookies (`auth_token`, `refresh_token`) | Backend via Set-Cookie |
| **Token Access** | Frontend NEVER reads tokens | Backend only |
| **Token Transmission** | Automatic via `credentials: 'include'` | Browser |
| **Token Lifecycle** | Backend sets/clears via Set-Cookie | Backend only |

**Frontend responsibilities:**
- Send requests with `credentials: 'include'` (Axios) or `credentials: 'include'` (fetch)
- Handle 401 → trigger refresh
- Handle refresh failure → clear user state, redirect to login
- Display user info from API responses

**Frontend does NOT:**
- Read tokens
- Store tokens in localStorage/sessionStorage
- Send tokens in request body
- Manage token expiry
- Implement token rotation logic

---

#### B) API Integration (Cookie-Based)

**Login Flow:**

```typescript
// POST /auth/login
const loginUser = async (email: string, password: string) => {
  const response = await apiClient.post('/auth/login', 
    { email, password },
    { withCredentials: true } // REQUIRED for cookies
  );
  
  // Backend sets cookies via Set-Cookie:
  // - auth_token (httpOnly, secure, sameSite)
  // - refresh_token (httpOnly, secure, sameSite)
  
  // Frontend only receives user data
  const { user } = response.data.data;
  
  // Store user in Zustand (NOT tokens)
  useAuthStore.getState().setUser(user);
  
  return user;
};
```

**API Response (Login):**

```typescript
// Response body (NO tokens in JSON)
{
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "Ivan Petrov",
      "role": "user"
    }
    // NO tokens field - tokens are in Set-Cookie headers
  }
}

// Response headers contain:
// Set-Cookie: auth_token=...; HttpOnly; Secure; SameSite=Strict; Path=/
// Set-Cookie: refresh_token=...; HttpOnly; Secure; SameSite=Strict; Path=/
```

---

#### C) Axios Configuration (Cookies)

**Setup API client:**

```typescript
// lib/api/client.ts
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // CRITICAL - enables cookie transmission
  headers: {
    'Content-Type': 'application/json',
  },
});
```

**All requests automatically include cookies** - no manual Authorization header needed.

---

#### D) Silent Refresh on 401 (Cookie-Based)

**Правило:**
- **401 Unauthorized** → попытка refresh → retry OR logout
- **403 Forbidden** → НЕТ refresh, показать ошибку доступа

**Flow для 401:**

```
API Request → 401 Unauthorized
   ↓
Check: is refresh already in progress?
   ↓
YES → Add request to queue → Wait for refresh → Retry original request
NO  → Start refresh flow:
      ↓
      POST /auth/refresh (empty body, cookies sent automatically)
      ↓
      Success → Backend sets new cookies → Process queue → Retry
      Failed → Clear user state → Redirect to /login
```

**Code (Response Interceptor):**

```typescript
// lib/api/interceptors/response.interceptor.ts
import { AxiosError } from 'axios';
import { apiClient } from '@/lib/api/client';

let isRefreshing = false;
let failedQueue: Array<{ resolve: Function; reject: Function }> = [];

const processQueue = (error: any = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

export function setupResponseInterceptor() {
  apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest: any = error.config;
      
      // 403 Forbidden - NO refresh
      if (error.response?.status === 403) {
        return Promise.reject(error);
      }
      
      // 401 Unauthorized - try refresh ONCE
      if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          // Queue request
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          }).then(() => {
            return apiClient(originalRequest); // Retry with new cookies
          });
        }
        
        originalRequest._retry = true;
        isRefreshing = true;
        
        try {
          // POST /auth/refresh - empty body, cookies sent automatically
          await apiClient.post('/auth/refresh', {}, {
            withCredentials: true
          });
          
          // Backend set new cookies via Set-Cookie
          // No need to extract or save anything
          
          processQueue(); // Release queue
          return apiClient(originalRequest); // Retry original request
          
        } catch (refreshError) {
          processQueue(refreshError);
          
          // Clear user state
          useAuthStore.getState().logout();
          
          // Redirect to login
          if (typeof window !== 'undefined') {
            window.location.href = '/login?reason=session_expired';
          }
          
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }
      
      return Promise.reject(error);
    }
  );
}
```

**Key points:**
- Refresh request has **empty body**
- Cookies sent automatically via `withCredentials: true`
- Backend returns new cookies via Set-Cookie
- Frontend doesn't touch tokens at all

---

#### E) Auth State Management (User Only)

**Zustand store (NO tokens):**

```typescript
// stores/auth.store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      
      setUser: (user) => set({ 
        user, 
        isAuthenticated: true 
      }),
      
      logout: () => set({ 
        user: null, 
        isAuthenticated: false 
      }),
    }),
    {
      name: 'auth-storage',
      // Only persist user, NOT tokens
      partialize: (state) => ({ 
        user: state.user,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);
```

**IMPORTANT:** Store only persists **user data**, never tokens.

---

#### F) Logout Flow

```typescript
// Logout function
export const logoutUser = async () => {
  try {
    // Call backend to invalidate cookies
    await apiClient.post('/auth/logout', {}, {
      withCredentials: true
    });
    
    // Backend clears cookies via Set-Cookie with expired date
    
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    // Clear user state regardless of API success
    useAuthStore.getState().logout();
    
    // Redirect to login
    window.location.href = '/login';
  }
};
```

---

#### G) Auth Refresh Failure UX (MANDATORY for MVP)

**Refresh Failure Scenarios:**

| Scenario | Frontend Behavior | UX Flow |
|----------|-------------------|---------|
| **Refresh token expired** | Clear user state → redirect /login | User must re-login |
| **Invalid refresh token** | Same as above | Same |
| **Network error during refresh** | Retry once, then redirect | Brief retry, then logout |
| **403 on refresh endpoint** | Clear state → redirect (no retry) | Security violation |

**401 Loop Prevention:**

```typescript
let consecutiveRefreshFailures = 0;
const MAX_REFRESH_ATTEMPTS = 1;

async function attemptRefresh() {
  if (consecutiveRefreshFailures >= MAX_REFRESH_ATTEMPTS) {
    handleRefreshFailure();
    return;
  }
  
  try {
    await apiClient.post('/auth/refresh');
    consecutiveRefreshFailures = 0; // Reset on success
  } catch (error) {
    consecutiveRefreshFailures++;
    handleRefreshFailure();
  }
}

function handleRefreshFailure() {
  useAuthStore.getState().logout();
  
  const currentPath = window.location.pathname;
  window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}&reason=session_expired`;
}
```

---

#### H) Implementation Checklist

**Setup:**
- [ ] Axios configured with `withCredentials: true`
- [ ] Response interceptor handles 401 → refresh → retry
- [ ] Response interceptor handles 403 → no refresh
- [ ] Auth store persists user only (NO tokens)

**Login:**
- [ ] POST /auth/login with `withCredentials: true`
- [ ] Save user from response.data.data.user
- [ ] DO NOT try to read tokens from response

**API Requests:**
- [ ] All requests use apiClient (has withCredentials: true)
- [ ] DO NOT add Authorization header manually
- [ ] Cookies sent automatically by browser

**Refresh:**
- [ ] POST /auth/refresh with empty body
- [ ] withCredentials: true (cookies sent automatically)
- [ ] DO NOT send refresh_token in body
- [ ] Backend sets new cookies, frontend does nothing

**Logout:**
- [ ] POST /auth/logout with withCredentials: true
- [ ] Clear user state in Zustand
- [ ] Redirect to /login

**Error Handling:**
- [ ] 401 → trigger refresh once → retry
- [ ] 403 → show error (no refresh)
- [ ] Refresh failure → clear state → redirect

---

#### I) Backend Dependency (Reference Only)

**Frontend assumes backend implements:**
- Cookie-based JWT auth (auth_token, refresh_token)
- Set-Cookie headers on login/refresh
- Validation of cookies on protected endpoints
- Cookie clearing on logout

**Backend details:** See Security & Compliance Plan (DOC-014)

**Frontend ONLY consumes this API, does not implement token logic.**

---

### 4.3. Error Handling Contract (Frontend Mapping)

#### A) Expected Error Response Shape

**Backend API returns errors in this format (see Error Handling Specification):**

```typescript
interface APIError {
  success: false;
  error: {
    code: string;              // e.g., "validation_error", "not_found"
    message: string;           // Human-readable message (RU)
    details?: Record<string, any>;
    field_errors?: Record<string, string[]>; // For form validation
  };
  meta?: {
    timestamp: string;
    request_id: string;        // For support/debugging
  };
}
```

**Frontend NEVER redefines error structure.** All error shapes are defined in:
- **Error Handling & Fault Tolerance Specification**
- **API Design Blueprint**

---

#### B) Field-Level Errors Mapping

**Form errors are mapped automatically:**

```typescript
// hooks/useCreateBooking.ts
const createBooking = useMutation({
  mutationFn: bookingsApi.create,
  
  onError: (error: any) => {
    const apiError = error.response?.data as APIError;
    
    // Map field errors to React Hook Form
    if (apiError.error.field_errors) {
      Object.entries(apiError.error.field_errors).forEach(([field, messages]) => {
        setError(field as any, {
          type: 'server',
          message: messages[0], // Show first error message
        });
      });
    } else {
      // Generic error → toast
      toast.error(apiError.error.message);
    }
  },
});
```

**Example:**

```
API Response:
{
  "success": false,
  "error": {
    "code": "validation_error",
    "message": "Ошибка валидации",
    "field_errors": {
      "email": ["Неверный формат email"],
      "phone": ["Телефон обязателен"]
    }
  }
}

Frontend Action:
- setError('email', { message: "Неверный формат email" })
- setError('phone', { message: "Телефон обязателен" })
- Display errors under respective input fields
```

---

#### C) Error ID Display

**`request_id` is used for debugging and support:**

```typescript
// Display in error state
function ErrorState({ error }: { error: APIError }) {
  return (
    <div>
      <p>{error.error.message}</p>
      {process.env.NODE_ENV === 'development' && (
        <p className="text-xs text-gray-500">
          Request ID: {error.meta?.request_id}
        </p>
      )}
    </div>
  );
}
```

**In production:**
- `request_id` is logged to console only
- Users see friendly error message
- Support can ask for `request_id` from browser console

---

#### D) Error Codes Handling

**Frontend maps error codes to UI responses:**

| Error Code           | Frontend Action                           |
|----------------------|-------------------------------------------|
| `validation_error`   | Map `field_errors` to form               |
| `not_found`          | Show 404 error state or page             |
| `unauthorized`       | Trigger refresh flow or redirect to login|
| `forbidden`          | Show permission denied error state       |
| `conflict`           | Show specific conflict message (toast)   |
| `rate_limit_exceeded`| Show "Try again in X seconds" message    |
| `internal_error`     | Show generic error with retry button     |

**No logic duplication:** Error handling rules are defined in Error Handling Specification. Frontend only maps to UI.

---

### 4.4. File Uploads (Attachments, Images)

#### A) Upload Flow for MVP

**Решение: Two-step upload flow**

1. **Step 1: Upload file**
   ```
   POST /upload
   Content-Type: multipart/form-data
   Body: file (binary)
   
   Response:
   {
     "success": true,
     "data": {
       "file_id": "uuid-123",
       "url": "https://cdn.storagecompare.ae/uploads/uuid-123.jpg",
       "filename": "warehouse-photo.jpg",
       "size": 245678,
       "mime_type": "image/jpeg"
     }
   }
   ```

2. **Step 2: Submit form with file_id**
   ```
   POST /operator/warehouses
   Body: {
     "name": "Склад №1",
     "photos": ["uuid-123", "uuid-456"]  // Array of file_ids
   }
   ```

**Why two-step:**
- Allows preview before form submission
- Allows removing/reordering photos before saving
- Simplifies form validation
- Supports multiple file uploads

---

#### B) Frontend Upload Implementation

```typescript
// components/FileUpload.tsx
const handleFileUpload = async (file: File) => {
  // Client-side validation
  if (file.size > MAX_FILE_SIZE) {
    toast.error(`Файл слишком большой (макс. ${MAX_FILE_SIZE / 1024 / 1024}MB)`);
    return;
  }
  
  if (!ALLOWED_TYPES.includes(file.type)) {
    toast.error('Недопустимый тип файла');
    return;
  }
  
  // Upload
  const formData = new FormData();
  formData.append('file', file);
  
  try {
    const response = await uploadApi.upload(formData);
    const { file_id, url } = response.data;
    
    // Save file_id for form submission
    setUploadedFiles(prev => [...prev, { file_id, url, filename: file.name }]);
    
    toast.success('Файл загружен');
  } catch (error) {
    toast.error('Ошибка загрузки файла');
  }
};
```

---

#### C) Validation Rules

**Client-side validation (enforced before upload):**

| Rule           | Value                           |
|----------------|---------------------------------|
| Max file size  | 10 MB per file                  |
| Allowed types  | `image/jpeg, image/png, image/webp` |
| Max count      | 10 photos per warehouse         |

**Values come from API specification:** See Upload API section in API Design Blueprint.

**Backend also validates:** Client-side validation is for UX, backend is source of truth.

---

#### D) Upload Progress

```typescript
const uploadFile = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  
  try {
    const response = await axios.post('/upload', formData, {
      onUploadProgress: (progressEvent) => {
        const progress = Math.round(
          (progressEvent.loaded * 100) / (progressEvent.total || 100)
        );
        setUploadProgress(progress);
      },
    });
    
    return response.data.data;
  } catch (error) {
    throw error;
  }
};
```

---

### 4.5. Query & Cache Behavior (React Query)

#### A) Query Keys: Single Source of Truth

**Решение: Centralized query keys in `lib/query-keys.ts`**

```typescript
// lib/query-keys.ts
export const queryKeys = {
  warehouses: {
    all: ['warehouses'] as const,
    lists: () => [...queryKeys.warehouses.all, 'list'] as const,
    list: (filters: SearchFilters) => [...queryKeys.warehouses.lists(), filters] as const,
    details: () => [...queryKeys.warehouses.all, 'detail'] as const,
    detail: (id: number) => [...queryKeys.warehouses.details(), id] as const,
  },
  
  bookings: {
    all: ['bookings'] as const,
    lists: () => [...queryKeys.bookings.all, 'list'] as const,
    user: (userId?: number) => [...queryKeys.bookings.lists(), 'user', userId] as const,
    operator: () => [...queryKeys.bookings.lists(), 'operator'] as const,
    detail: (id: number) => [...queryKeys.bookings.all, 'detail', id] as const,
  },
  
  // ... other entities
};
```

**Rule: NEVER define query keys inline**

❌ **Wrong:**
```typescript
useQuery({ queryKey: ['warehouses', id], ... })
```

✅ **Correct:**
```typescript
useQuery({ queryKey: queryKeys.warehouses.detail(id), ... })
```

---

#### B) Invalidation After Mutations

**General rule: Invalidate related queries after successful mutation**

**Example: Create booking**

```typescript
const createBooking = useMutation({
  mutationFn: bookingsApi.create,
  
  onSuccess: (newBooking) => {
    // Invalidate user bookings list
    queryClient.invalidateQueries({
      queryKey: queryKeys.bookings.user(),
    });
    
    // Invalidate box availability
    queryClient.invalidateQueries({
      queryKey: queryKeys.boxes.detail(newBooking.box_id),
    });
    
    // Invalidate warehouse details (summary)
    queryClient.invalidateQueries({
      queryKey: queryKeys.warehouses.detail(newBooking.warehouse_id),
    });
  },
});
```

**Guideline: Invalidate parent and affected resources, but don't over-invalidate.**

---

#### C) Cache Time Configuration

**По типам данных:**

| Data Type          | staleTime | gcTime   | Reason                          |
|--------------------|-----------|----------|---------------------------------|
| Search results     | 5 min     | 10 min   | Medium frequency updates        |
| Warehouse detail   | 30 min    | 60 min   | Rarely changes                  |
| Box availability   | 1 min     | 5 min    | Frequently changes              |
| User bookings      | 1 min     | 5 min    | Frequently changes              |
| Static data (attrs)| Infinity  | Infinity | Never changes in runtime        |

**No deep optimization required for MVP.** These defaults cover 90% of cases.

---

### 4.6. Routing Consistency

#### A) Operator Routes: Always `/operator/` Prefix

**Rule: ALL operator functionality lives under `/operator/*`**

✅ **Correct:**
```
/operator/warehouses
/operator/warehouses/new
/operator/warehouses/123
/operator/warehouses/123/boxes
/operator/bookings
/operator/analytics
```

❌ **Wrong:**
```
/warehouses  (ambiguous - public or operator?)
/my-warehouses  (inconsistent naming)
/dashboard/warehouses  (mixes user and operator dashboards)
```

**Reason:** Clear separation between:
- Public routes (no auth, SEO)
- User dashboard (auth, personal data)
- Operator dashboard (auth + role, business operations)

---

#### B) Relationship: Public vs Operator

**Public warehouse page:**
```
/warehouses/123  → View as customer (SSR, SEO-optimized)
```

**Operator warehouse management:**
```
/operator/warehouses/123  → Edit as operator (CSR, role-protected)
```

**Same warehouse, different contexts.**

---

#### C) User Dashboard Routes

**User personal area:**
```
/dashboard              → User dashboard home
/dashboard/bookings     → User's bookings (as customer)
/dashboard/favorites    → User's favorite warehouses
/dashboard/profile      → User profile settings
```

**No overlap with `/operator/*` routes.**

---

### 4.7. Summary: Key Frontend Decisions

| Aspect                    | Decision                                   | Reference                      |
|---------------------------|--------------------------------------------|--------------------------------|
| **Operator Dashboard**    | CSR only (no SSR)                          | Section 4.1.A                  |
| **Public Pages**          | SSR for SEO                                | Section 4.1.B                  |
| **Auth Tokens**           | httpOnly cookies (backend-managed)         | Section 4.2.A                  |
| **Token Management**      | Backend via Set-Cookie (frontend reads none) | Section 4.2.A                  |
| **401 Handling**          | Automatic silent refresh with queue        | Section 4.2.B                  |
| **Error Shape**           | See Error Handling Specification           | Section 4.3.A                  |
| **Field Errors**          | Map to React Hook Form via `setError`      | Section 4.3.B                  |
| **File Upload**           | Two-step: upload → file_id → submit        | Section 4.4.A                  |
| **Upload Validation**     | Client-side + backend (10MB, jpeg/png/webp)| Section 4.4.C                  |
| **Query Keys**            | Centralized in `lib/query-keys.ts`         | Section 4.5.A                  |
| **Invalidation**          | Explicit after mutations (related queries) | Section 4.5.B                  |
| **Operator Routes**       | Always `/operator/*` prefix                | Section 4.6.A                  |

---

**Конец секции Frontend Implementation Decisions**

---


## 5. Принципы управления состоянием

### Общая концепция

Управление состоянием в приложении организовано по следующим принципам:

1. **Разделение ответственности:**
   - **Zustand** — для клиентского глобального состояния (auth, UI, filters)
   - **React Query** — для серверного состояния (данные с API)
   - **Local State** — для локального UI состояния компонентов
   - **URL** — для sharable состояния (фильтры, пагинация)

2. **Single Source of Truth:**
   - Каждый тип данных имеет только один источник истины
   - Не дублируем серверные данные в Zustand
   - URL является источником истины для фильтров

3. **Оптимизация производительности:**
   - Селекторы для избежания лишних ре-рендеров
   - Мемоизация вычисляемых значений
   - Ленивая загрузка данных



---

### Важно: Source of Truth Rules (Границы ответственности)

**Для фронтенд-разработчиков: Где хранить какие данные**

**Проблема:** Неясно где хранить данные → дублирование → рассинхронизация

**Решение: Четкие правила источника истины**

| Тип данных | Source of Truth | Почему | Пример |
|------------|-----------------|--------|--------|
| **Серверные данные** | React Query cache | Автоматическая синхронизация, стандартизация | Склады, бронирования, боксы |
| **Auth состояние** | Zustand (user only) | Персистентность user data | user, isAuthenticated (NO tokens) |
| **UI состояние (глобальное)** | Zustand | Нужен доступ из разных компонентов | Открыт ли sidebar, выбранная тема |
| **Фильтры поиска** | URL (searchParams) | Sharable, bookmarkable | ?city=Moscow&price_max=10000 |
| **UI состояние (локальное)** | useState | Изолировано в компоненте | Открыт ли dropdown, текущий tab |
| **Форма** | React Hook Form | Оптимизация, валидация | Значения полей, ошибки |

**Правила (обязательные):**

1. **НЕ дублировать серверные данные в Zustand**
   ```typescript
   // ❌ WRONG - дублирование
   const warehouses = useWarehousesQuery();
   const setWarehouses = useStore(state => state.setWarehouses);
   setWarehouses(warehouses.data); // НЕ ДЕЛАТЬ ЭТО!
   
   // ✅ CORRECT - используем из React Query
   const { data: warehouses } = useWarehousesQuery();
   // warehouses уже в кэше React Query
   ```

2. **Фильтры ВСЕГДА в URL**
   ```typescript
   // ❌ WRONG - фильтры в Zustand
   const filters = useFilterStore();
   
   // ✅ CORRECT - фильтры в URL
   const searchParams = useSearchParams();
   const city = searchParams.get('city');
   const priceMax = searchParams.get('price_max');
   ```

3. **Производные данные вычисляются, не хранятся**
   ```typescript
   // ❌ WRONG - хранение производных
   const warehouses = useWarehousesQuery();
   const [filteredWarehouses, setFiltered] = useState([]);
   useEffect(() => {
     setFiltered(warehouses.filter(...));
   }, [warehouses]);
   
   // ✅ CORRECT - вычисление на лету
   const warehouses = useWarehousesQuery();
   const filteredWarehouses = useMemo(
     () => warehouses.filter(...),
     [warehouses]
   );
   ```

**Граница ответственности:**

**React Query отвечает за:**
- Кэширование серверных данных
- Автоматический refetch
- Обновление при мутациях
- Стейл-тайм управление

**Zustand отвечает за:**
- Auth состояние (user, tokens)
- Глобальное UI состояние
- Персистентное состояние

**URL отвечает за:**
- Фильтры поиска
- Пагинация
- Sharable состояние

**Компонент отвечает за:**
- Локальное UI состояние
- Форма (через React Hook Form)

**Checklist при добавлении нового состояния:**

- [ ] Это серверные данные? → React Query
- [ ] Это auth? → Zustand (user only, tokens in cookies)
- [ ] Это фильтры? → URL (searchParams)
- [ ] Это глобальное UI? → Zustand
- [ ] Это локальное UI? → useState
- [ ] Это форма? → React Hook Form

---

---



**Conflict Resolution Rules (CRITICAL):**

When URL and store both have values:

1. **On page load:** URL is source of truth
   ```typescript
   // ✅ CORRECT - URL overrides store
   const searchParams = useSearchParams();
   const city = searchParams.get('city'); // Use this
   
   const storeCity = useFilterStore(s => s.city); // Ignore on load
   ```

2. **On user action:** Update URL first, then refetch
   ```typescript
   // ✅ CORRECT - URL first, then query refetches
   function handleCityChange(newCity: string) {
     // 1. Update URL
     router.push(`/search?city=${newCity}`);
     
     // 2. React Query automatically refetches based on new URL
     // (no manual setFilters needed)
   }
   ```

3. **URL changes trigger query invalidation:**
   ```typescript
   // React Query uses URL params in query key
   const { data } = useQuery({
     queryKey: ['warehouses', searchParams.toString()],
     queryFn: () => api.search(Object.fromEntries(searchParams))
   });
   // URL change → new queryKey → auto-refetch
   ```

**Rule:** URL is always the source of truth. Store is for temporary UI state only.

---

### 5.1. Глобальное состояние (Zustand)

Zustand используется для управления **клиентским глобальным состоянием**, которое не связано с серверными данными.

#### 5.1.1. Auth Store

**Назначение:** Хранение данных аутентифицированного пользователя и состояния аутентификации.

**Файл:** `stores/auth-store.ts`

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: 'user' | 'operator' | 'admin';
  phone?: string;
  avatar_url?: string;
  email_verified: boolean;
}

interface AuthState {
  // Состояние
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Actions
  setUser: (user: User) => void;
  updateUser: (updates: Partial<User>) => void;
  logout: () => void;
  setLoading: (isLoading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      isLoading: false,
      
      // Actions
      setUser: (user) => set({ 
        user, 
        isAuthenticated: true,
        isLoading: false 
      }),
      
      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),
      
      logout: () => {
        // Очистка состояния
        set({ user: null, isAuthenticated: false });
        
        // Очистка токенов
        if (typeof window !== 'undefined') {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
        }
      },
      
      setLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: 'auth-storage', // Persists user only, NOT tokens
      partialize: (state) => ({ 
        user: state.user,
        isAuthenticated: state.isAuthenticated 
      }), // Сохраняем только user и isAuthenticated
    }
  )
);

// Селекторы для оптимизации
export const useUser = () => useAuthStore((state) => state.user);
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
export const useUserRole = () => useAuthStore((state) => state.user?.role);
export const useIsOperator = () => useAuthStore((state) => state.user?.role === 'operator');
export const useIsAdmin = () => useAuthStore((state) => state.user?.role === 'admin');
```

**Использование в компонентах:**

```typescript
// Пример: Защита маршрутов
function OperatorGuard({ children }: { children: React.ReactNode }) {
  const isOperator = useIsOperator();
  const router = useRouter();
  
  useEffect(() => {
    if (!isOperator) {
      router.push('/login?redirect=/operator');
    }
  }, [isOperator, router]);
  
  if (!isOperator) return <LoadingSpinner />;
  
  return <>{children}</>;
}
```

---

#### 5.1.2. Filter Store

**Назначение:** Хранение состояния фильтров поиска складов.

**Файл:** `stores/filter-store.ts`

```typescript
import { create } from 'zustand';

export interface SearchFilters {
  // Геолокация
  city?: string;
  district?: string;
  metro_station?: string;
  latitude?: number;
  longitude?: number;
  radius?: number; // в км
  
  // Цена
  price_min?: number;
  price_max?: number;
  
  // Размер бокса
  size?: ('S' | 'M' | 'L' | 'XL')[];
  area_min?: number; // м²
  area_max?: number; // м²
  
  // Атрибуты склада
  attributes?: string[]; // ['climate_control', 'access_24_7', 'security', ...]
  
  // Сортировка
  sort?: 'price' | 'rating' | 'distance' | 'created_at';
  order?: 'asc' | 'desc';
  
  // Поисковый запрос
  q?: string;
}

interface FilterState {
  filters: SearchFilters;
  
  // Actions
  setFilters: (filters: Partial<SearchFilters>) => void;
  updateFilter: <K extends keyof SearchFilters>(
    key: K,
    value: SearchFilters[K]
  ) => void;
  removeFilter: (key: keyof SearchFilters) => void;
  clearFilters: () => void;
  resetToDefaults: () => void;
  
  // Computed
  hasActiveFilters: () => boolean;
  getActiveFiltersCount: () => number;
}

const defaultFilters: SearchFilters = {
  sort: 'rating',
  order: 'desc',
  radius: 10, // 10 км по умолчанию
};

export const useFilterStore = create<FilterState>((set, get) => ({
  filters: defaultFilters,
  
  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    })),
  
  updateFilter: (key, value) =>
    set((state) => ({
      filters: { ...state.filters, [key]: value },
    })),
  
  removeFilter: (key) =>
    set((state) => {
      const { [key]: removed, ...rest } = state.filters;
      return { filters: rest };
    }),
  
  clearFilters: () => set({ filters: {} }),
  
  resetToDefaults: () => set({ filters: defaultFilters }),
  
  hasActiveFilters: () => {
    const { filters } = get();
    const activeKeys = Object.keys(filters).filter(
      (key) => !['sort', 'order'].includes(key)
    );
    return activeKeys.length > 0;
  },
  
  getActiveFiltersCount: () => {
    const { filters } = get();
    return Object.keys(filters).filter(
      (key) => 
        !['sort', 'order'].includes(key) && 
        filters[key as keyof SearchFilters] !== undefined
    ).length;
  },
}));

// Селекторы
export const useFilters = () => useFilterStore((state) => state.filters);
export const usePriceRange = () =>
  useFilterStore((state) => ({
    min: state.filters.price_min,
    max: state.filters.price_max,
  }));
export const useSelectedSizes = () => useFilterStore((state) => state.filters.size);
export const useHasActiveFilters = () => useFilterStore((state) => state.hasActiveFilters());
```

**Синхронизация фильтров с URL:**

```typescript
// hooks/useFilterSync.ts
import { useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useFilterStore } from '@/stores/filter-store';

export function useFilterSync() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { filters, setFilters } = useFilterStore();
  
  // Читаем фильтры из URL при монтировании
  useEffect(() => {
    const urlFilters: any = {};
    
    // Строковые параметры
    if (searchParams.get('city')) urlFilters.city = searchParams.get('city');
    if (searchParams.get('district')) urlFilters.district = searchParams.get('district');
    if (searchParams.get('q')) urlFilters.q = searchParams.get('q');
    
    // Числовые параметры
    if (searchParams.get('price_min')) {
      urlFilters.price_min = Number(searchParams.get('price_min'));
    }
    if (searchParams.get('price_max')) {
      urlFilters.price_max = Number(searchParams.get('price_max'));
    }
    if (searchParams.get('radius')) {
      urlFilters.radius = Number(searchParams.get('radius'));
    }
    
    // Массивы
    if (searchParams.get('size')) {
      urlFilters.size = searchParams.get('size')!.split(',');
    }
    if (searchParams.get('attributes')) {
      urlFilters.attributes = searchParams.get('attributes')!.split(',');
    }
    
    // Сортировка
    if (searchParams.get('sort')) urlFilters.sort = searchParams.get('sort');
    if (searchParams.get('order')) urlFilters.order = searchParams.get('order');
    
    if (Object.keys(urlFilters).length > 0) {
      setFilters(urlFilters);
    }
  }, []); // Только при монтировании
  
  // Синхронизируем изменения фильтров с URL
  useEffect(() => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          if (value.length > 0) {
            params.set(key, value.join(','));
          }
        } else {
          params.set(key, String(value));
        }
      }
    });
    
    const queryString = params.toString();
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
    
    // Обновляем URL без перезагрузки и скролла
    router.push(newUrl, { scroll: false });
  }, [filters, pathname, router]);
}
```

**Использование в компонентах:**

```typescript
// Компонент фильтров
function FilterPanel() {
  const { filters, updateFilter, clearFilters, getActiveFiltersCount } = useFilterStore();
  const activeCount = getActiveFiltersCount();
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Фильтры</h3>
        {activeCount > 0 && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Сбросить ({activeCount})
          </Button>
        )}
      </div>
      
      {/* Цена */}
      <PriceRangeFilter
        min={filters.price_min}
        max={filters.price_max}
        onChange={(min, max) => {
          updateFilter('price_min', min);
          updateFilter('price_max', max);
        }}
      />
      
      {/* Размер */}
      <SizeFilter
        selected={filters.size || []}
        onChange={(sizes) => updateFilter('size', sizes)}
      />
      
      {/* Атрибуты */}
      <AttributesFilter
        selected={filters.attributes || []}
        onChange={(attrs) => updateFilter('attributes', attrs)}
      />
    </div>
  );
}

// Компонент поиска с использованием фильтров
function SearchPage() {
  useFilterSync(); // Синхронизация с URL
  
  const filters = useFilters();
  const { data, isLoading } = useWarehouses(filters);
  
  return (
    <div className="flex gap-6">
      <aside className="w-80">
        <FilterPanel />
      </aside>
      <main className="flex-1">
        {isLoading ? (
          <SearchSkeleton />
        ) : (
          <WarehouseList warehouses={data?.data || []} />
        )}
      </main>
    </div>
  );
}
```


#### 5.1.3. UI Store

**Назначение:** Управление состоянием UI элементов (модалки, сайдбары, уведомления).

**Файл:** `stores/ui-store.ts`

```typescript
import { create } from 'zustand';

interface UIState {
  // Mobile menu
  isMobileMenuOpen: boolean;
  
  // Filter panel
  isFilterPanelOpen: boolean;
  
  // Modals
  activeModal: string | null;
  modalData: any;
  
  // Map view
  mapView: 'map' | 'list' | 'split';
  
  // Sidebar (dashboard)
  isSidebarCollapsed: boolean;
  
  // Actions
  openMobileMenu: () => void;
  closeMobileMenu: () => void;
  toggleMobileMenu: () => void;
  
  openFilterPanel: () => void;
  closeFilterPanel: () => void;
  toggleFilterPanel: () => void;
  
  openModal: (modalId: string, data?: any) => void;
  closeModal: () => void;
  
  setMapView: (view: 'map' | 'list' | 'split') => void;
  
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  // Initial state
  isMobileMenuOpen: false,
  isFilterPanelOpen: false,
  activeModal: null,
  modalData: null,
  mapView: 'split',
  isSidebarCollapsed: false,
  
  // Mobile menu actions
  openMobileMenu: () => set({ isMobileMenuOpen: true }),
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),
  toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
  
  // Filter panel actions
  openFilterPanel: () => set({ isFilterPanelOpen: true }),
  closeFilterPanel: () => set({ isFilterPanelOpen: false }),
  toggleFilterPanel: () => set((state) => ({ isFilterPanelOpen: !state.isFilterPanelOpen })),
  
  // Modal actions
  openModal: (modalId, data) => set({ activeModal: modalId, modalData: data }),
  closeModal: () => set({ activeModal: null, modalData: null }),
  
  // Map view actions
  setMapView: (view) => set({ mapView: view }),
  
  // Sidebar actions
  toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
  setSidebarCollapsed: (collapsed) => set({ isSidebarCollapsed: collapsed }),
}));

// Селекторы
export const useActiveModal = () => useUIStore((state) => state.activeModal);
export const useModalData = () => useUIStore((state) => state.modalData);
export const useMapView = () => useUIStore((state) => state.mapView);
```

**Использование в компонентах:**

```typescript
// Мобильное меню
function MobileMenu() {
  const { isMobileMenuOpen, closeMobileMenu } = useUIStore();
  
  return (
    <Sheet open={isMobileMenuOpen} onOpenChange={closeMobileMenu}>
      <SheetContent side="left">
        <nav>
          {/* Меню */}
        </nav>
      </SheetContent>
    </Sheet>
  );
}

// Модальное окно
function BookingModal() {
  const activeModal = useActiveModal();
  const modalData = useModalData();
  const closeModal = useUIStore((state) => state.closeModal);
  
  const isOpen = activeModal === 'booking';
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeModal()}>
      <DialogContent>
        <BookingForm boxId={modalData?.boxId} />
      </DialogContent>
    </Dialog>
  );
}

// Переключение вида карты
function MapViewToggle() {
  const { mapView, setMapView } = useUIStore();
  
  return (
    <div className="flex gap-2">
      <Button
        variant={mapView === 'map' ? 'default' : 'outline'}
        onClick={() => setMapView('map')}
      >
        <Map className="h-4 w-4" />
      </Button>
      <Button
        variant={mapView === 'list' ? 'default' : 'outline'}
        onClick={() => setMapView('list')}
      >
        <List className="h-4 w-4" />
      </Button>
      <Button
        variant={mapView === 'split' ? 'default' : 'outline'}
        onClick={() => setMapView('split')}
      >
        <Columns className="h-4 w-4" />
      </Button>
    </div>
  );
}

// Адаптивный сайдбар
function DashboardSidebar() {
  const { isSidebarCollapsed, toggleSidebar } = useUIStore();
  
  return (
    <aside className={cn(
      'transition-all duration-300',
      isSidebarCollapsed ? 'w-20' : 'w-64'
    )}>
      <Button variant="ghost" onClick={toggleSidebar}>
        {isSidebarCollapsed ? <ChevronRight /> : <ChevronLeft />}
      </Button>
      {/* Меню */}
    </aside>
  );
}
```


### 5.2. Серверное состояние (React Query)

React Query — **единственный источник истины** для всех данных, приходящих с сервера.

**Ключевые принципы:**

1. **Не дублировать серверные данные в Zustand** — это приводит к рассинхронизации
2. **Использовать правильные query keys** — для точной инвалидации
3. **Настраивать stale/cache time** — в зависимости от типа данных
4. **Использовать оптимистичные обновления** — для лучшего UX

#### 5.2.1. Кэширование данных

**Конфигурация кэширования по типам данных:**

```typescript
// lib/react-query.ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 минут по умолчанию
      gcTime: 10 * 60 * 1000, // 10 минут (ранее cacheTime)
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
    },
  },
});
```

**Различные стратегии для разных типов данных:**

```typescript
// Часто меняющиеся данные (доступность боксов, актуальные цены)
export function useBoxAvailability(boxId: number) {
  return useQuery({
    queryKey: ['boxes', boxId, 'availability'],
    queryFn: () => boxesApi.getAvailability(boxId),
    staleTime: 1 * 60 * 1000, // 1 минута - нужна актуальность
    gcTime: 5 * 60 * 1000, // 5 минут в кэше
    refetchInterval: 2 * 60 * 1000, // Auto-refetch каждые 2 минуты
    refetchIntervalInBackground: false, // Не обновлять в фоне
  });
}

// Средне-меняющиеся данные (список складов в поиске)
export function useWarehouses(filters: SearchFilters) {
  return useQuery({
    queryKey: ['warehouses', 'search', filters],
    queryFn: () => warehousesApi.search(filters),
    staleTime: 5 * 60 * 1000, // 5 минут
    gcTime: 10 * 60 * 1000, // 10 минут
    enabled: true,
  });
}

// Редко меняющиеся данные (детали склада, отзывы)
export function useWarehouse(id: number) {
  return useQuery({
    queryKey: ['warehouses', id],
    queryFn: () => warehousesApi.getById(id),
    staleTime: 30 * 60 * 1000, // 30 минут
    gcTime: 60 * 60 * 1000, // 1 час
    enabled: !!id,
  });
}

// Статические данные (список атрибутов, справочники)
export function useWarehouseAttributes() {
  return useQuery({
    queryKey: ['attributes', 'warehouses'],
    queryFn: () => attributesApi.getAll(),
    staleTime: Infinity, // Никогда не устаревают
    gcTime: Infinity, // Хранить всегда в памяти
  });
}

// Данные пользователя (бронирования, профиль)
export function useUserBookings() {
  const { user } = useAuthStore();
  
  return useQuery({
    queryKey: ['bookings', 'user', user?.id],
    queryFn: () => bookingsApi.getUserBookings(),
    staleTime: 1 * 60 * 1000, // 1 минута - важна актуальность
    gcTime: 5 * 60 * 1000,
    enabled: !!user, // Только для авторизованных
    refetchOnWindowFocus: true, // Обновлять при возврате на вкладку
  });
}
```

**Query Keys структура:**

```typescript
// lib/query-keys.ts
export const queryKeys = {
  // Warehouses
  warehouses: {
    all: ['warehouses'] as const,
    lists: () => [...queryKeys.warehouses.all, 'list'] as const,
    list: (filters: SearchFilters) => [...queryKeys.warehouses.lists(), filters] as const,
    details: () => [...queryKeys.warehouses.all, 'detail'] as const,
    detail: (id: number) => [...queryKeys.warehouses.details(), id] as const,
    featured: () => [...queryKeys.warehouses.all, 'featured'] as const,
  },
  
  // Boxes
  boxes: {
    all: ['boxes'] as const,
    lists: () => [...queryKeys.boxes.all, 'list'] as const,
    list: (warehouseId: number, filters?: any) => 
      [...queryKeys.boxes.lists(), warehouseId, filters] as const,
    detail: (id: number) => [...queryKeys.boxes.all, 'detail', id] as const,
    availability: (id: number) => [...queryKeys.boxes.detail(id), 'availability'] as const,
  },
  
  // Bookings
  bookings: {
    all: ['bookings'] as const,
    user: (userId?: number) => [...queryKeys.bookings.all, 'user', userId] as const,
    operator: (operatorId?: number) => 
      [...queryKeys.bookings.all, 'operator', operatorId] as const,
    detail: (id: number) => [...queryKeys.bookings.all, 'detail', id] as const,
  },
  
  // User
  user: {
    current: ['user', 'current'] as const,
    profile: (id: number) => ['user', 'profile', id] as const,
    favorites: (userId: number) => ['user', userId, 'favorites'] as const,
    reviews: (userId: number) => ['user', userId, 'reviews'] as const,
  },
};
```


#### 5.2.2. Invalidation стратегии

**Инвалидация после мутаций:**

```typescript
// hooks/useCreateBooking.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingsApi } from '@/lib/api/bookings-api';
import { queryKeys } from '@/lib/query-keys';
import toast from 'react-hot-toast';

export function useCreateBooking() {
  const queryClient = useQueryClient();
  const router = useRouter();
  
  return useMutation({
    mutationFn: bookingsApi.create,
    
    onSuccess: (newBooking) => {
      // 1. Инвалидируем список бронирований пользователя
      queryClient.invalidateQueries({
        queryKey: queryKeys.bookings.user(),
      });
      
      // 2. Инвалидируем доступность бокса
      queryClient.invalidateQueries({
        queryKey: queryKeys.boxes.availability(newBooking.box_id),
      });
      
      // 3. Инвалидируем детали бокса
      queryClient.invalidateQueries({
        queryKey: queryKeys.boxes.detail(newBooking.box_id),
      });
      
      // 4. Инвалидируем склад (обновить summary боксов)
      queryClient.invalidateQueries({
        queryKey: queryKeys.warehouses.detail(newBooking.warehouse_id),
      });
      
      // 5. Показываем уведомление
      toast.success('Бронирование создано!');
      
      // 6. Редирект на страницу подтверждения
      router.push(`/booking/${newBooking.id}/success`);
    },
    
    onError: (error: any) => {
      const errorMessage = error.response?.data?.error?.message || 
        'Ошибка при создании бронирования';
      toast.error(errorMessage);
    },
  });
}
```

**Частичное обновление кэша (без инвалидации):**

```typescript
// hooks/useToggleFavorite.ts
export function useToggleFavorite() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ warehouseId, isFavorite }: { warehouseId: number; isFavorite: boolean }) =>
      isFavorite
        ? favoritesApi.remove(warehouseId)
        : favoritesApi.add(warehouseId),
    
    onMutate: async ({ warehouseId, isFavorite }) => {
      // Отменяем исходящие запросы для этого склада
      await queryClient.cancelQueries({ 
        queryKey: queryKeys.warehouses.detail(warehouseId) 
      });
      
      // Сохраняем предыдущие данные для rollback
      const previousWarehouse = queryClient.getQueryData(
        queryKeys.warehouses.detail(warehouseId)
      );
      
      // Оптимистично обновляем кэш
      queryClient.setQueryData(
        queryKeys.warehouses.detail(warehouseId),
        (old: any) => ({
          ...old,
          is_favorite: !isFavorite,
        })
      );
      
      // Возвращаем context для rollback
      return { previousWarehouse, warehouseId };
    },
    
    onError: (err, variables, context) => {
      // Откатываем изменения при ошибке
      if (context?.previousWarehouse) {
        queryClient.setQueryData(
          queryKeys.warehouses.detail(context.warehouseId),
          context.previousWarehouse
        );
      }
      toast.error('Не удалось обновить избранное');
    },
    
    onSuccess: (data, variables) => {
      // Инвалидируем список избранного
      queryClient.invalidateQueries({
        queryKey: queryKeys.user.favorites(data.user_id),
      });
    },
    
    onSettled: (data, error, variables) => {
      // В любом случае обновляем данные с сервера
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.warehouses.detail(variables.warehouseId) 
      });
    },
  });
}
```

**Групповая инвалидация:**

```typescript
// hooks/useDeleteWarehouse.ts
export function useDeleteWarehouse() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: warehousesApi.delete,
    
    onSuccess: (_, deletedId) => {
      // 1. Удаляем из кэша конкретный склад
      queryClient.removeQueries({ 
        queryKey: queryKeys.warehouses.detail(deletedId) 
      });
      
      // 2. Инвалидируем все списки складов
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.warehouses.lists() 
      });
      
      // 3. Инвалидируем избранное (если там был этот склад)
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.user.favorites() 
      });
      
      toast.success('Склад удален');
    },
  });
}
```


#### 5.2.3. Prefetching

**Server-side prefetch (Next.js SSR):**

```typescript
// app/warehouses/[id]/page.tsx
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';
import { warehousesApi, boxesApi, reviewsApi } from '@/lib/api';

export default async function WarehousePage({ params }: { params: { id: string } }) {
  const queryClient = new QueryClient();
  const warehouseId = Number(params.id);
  
  // Prefetch всех необходимых данных на сервере
  await Promise.all([
    // Детали склада
    queryClient.prefetchQuery({
      queryKey: queryKeys.warehouses.detail(warehouseId),
      queryFn: () => warehousesApi.getById(warehouseId),
    }),
    
    // Боксы склада
    queryClient.prefetchQuery({
      queryKey: queryKeys.boxes.list(warehouseId),
      queryFn: () => boxesApi.getByWarehouse(warehouseId),
    }),
    
    // Отзывы склада
    queryClient.prefetchQuery({
      queryKey: ['warehouses', warehouseId, 'reviews'],
      queryFn: () => reviewsApi.getByWarehouse(warehouseId),
    }),
  ]);
  
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <WarehouseDetails id={warehouseId} />
    </HydrationBoundary>
  );
}
```

**Client-side prefetch при наведении:**

```typescript
// components/WarehouseCard.tsx
function WarehouseCard({ warehouse }: { warehouse: Warehouse }) {
  const queryClient = useQueryClient();
  
  const prefetchWarehouse = () => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.warehouses.detail(warehouse.id),
      queryFn: () => warehousesApi.getById(warehouse.id),
      staleTime: 10 * 60 * 1000, // 10 минут
    });
  };
  
  return (
    <Link
      href={`/warehouses/${warehouse.id}`}
      onMouseEnter={prefetchWarehouse} // Prefetch при наведении
      onFocus={prefetchWarehouse} // Prefetch при фокусе (keyboard navigation)
    >
      {/* ... */}
    </Link>
  );
}
```

**Prefetch следующей страницы:**

```typescript
// components/WarehouseList.tsx
function WarehouseList() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const filters = useFilters();
  
  const { data } = useWarehouses(filters, page);
  
  // Prefetch следующей страницы
  useEffect(() => {
    if (data?.pagination.has_next) {
      queryClient.prefetchQuery({
        queryKey: queryKeys.warehouses.list({ ...filters, page: page + 1 }),
        queryFn: () => warehousesApi.search({ ...filters, page: page + 1 }),
      });
    }
  }, [page, data, filters, queryClient]);
  
  return (
    <div>
      {/* Список */}
      <Pagination page={page} onPageChange={setPage} />
    </div>
  );
}
```


### 5.3. Локальное состояние компонентов

**Когда использовать `useState`:**

- ✅ UI toggles (показать/скрыть, развернуть/свернуть)
- ✅ Временные значения форм (если не используется React Hook Form)
- ✅ Состояние компонента, не нужное другим компонентам
- ✅ Вычисляемые значения, зависящие от props

**Примеры:**

```typescript
// 1. UI Toggle
function Accordion({ title, children }) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div>
      <button onClick={() => setIsOpen(!isOpen)}>
        {title}
        {isOpen ? <ChevronUp /> : <ChevronDown />}
      </button>
      {isOpen && <div>{children}</div>}
    </div>
  );
}

// 2. Форма с локальным состоянием
function CommentInput({ onSubmit }) {
  const [text, setText] = useState('');
  const [charCount, setCharCount] = useState(0);
  
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);
    setCharCount(newText.length);
  };
  
  const handleSubmit = () => {
    onSubmit(text);
    setText('');
    setCharCount(0);
  };
  
  return (
    <div>
      <textarea
        value={text}
        onChange={handleChange}
        maxLength={500}
        placeholder="Ваш комментарий..."
      />
      <div className="flex justify-between">
        <span className="text-sm text-gray-500">{charCount}/500</span>
        <button onClick={handleSubmit} disabled={text.length === 0}>
          Отправить
        </button>
      </div>
    </div>
  );
}

// 3. Галерея с выбранным изображением
function ImageGallery({ images }: { images: string[] }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  return (
    <div>
      {/* Главное изображение */}
      <div className="relative aspect-video">
        <img
          src={images[selectedIndex]}
          alt=""
          className="w-full h-full object-cover"
          onClick={() => setIsFullscreen(true)}
        />
      </div>
      
      {/* Thumbnails */}
      <div className="flex gap-2 mt-4">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedIndex(idx)}
            className={cn(
              'w-20 h-20 rounded overflow-hidden',
              selectedIndex === idx && 'ring-2 ring-primary'
            )}
          >
            <img src={img} alt="" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
      
      {/* Fullscreen modal */}
      {isFullscreen && (
        <Lightbox
          images={images}
          initialIndex={selectedIndex}
          onClose={() => setIsFullscreen(false)}
        />
      )}
    </div>
  );
}

// 4. Tabs с локальным состоянием
function WarehouseTabs({ warehouseId }: { warehouseId: number }) {
  const [activeTab, setActiveTab] = useState<'boxes' | 'reviews' | 'info'>('boxes');
  
  return (
    <div>
      <div className="flex gap-4 border-b">
        <button
          onClick={() => setActiveTab('boxes')}
          className={cn(
            'pb-2',
            activeTab === 'boxes' && 'border-b-2 border-primary'
          )}
        >
          Боксы
        </button>
        <button
          onClick={() => setActiveTab('reviews')}
          className={cn(
            'pb-2',
            activeTab === 'reviews' && 'border-b-2 border-primary'
          )}
        >
          Отзывы
        </button>
        <button
          onClick={() => setActiveTab('info')}
          className={cn(
            'pb-2',
            activeTab === 'info' && 'border-b-2 border-primary'
          )}
        >
          Информация
        </button>
      </div>
      
      <div className="mt-6">
        {activeTab === 'boxes' && <BoxList warehouseId={warehouseId} />}
        {activeTab === 'reviews' && <ReviewsList warehouseId={warehouseId} />}
        {activeTab === 'info' && <WarehouseInfo warehouseId={warehouseId} />}
      </div>
    </div>
  );
}
```


### 5.4. URL как источник истины

**Принципы:**

1. **Фильтры поиска** — всегда в URL query params
2. **Пагинация** — page/per_page в URL
3. **Сортировка** — sort/order в URL
4. **Табы** — активная вкладка может быть в URL
5. **Модалки** — можно добавлять в URL для шаринга (опционально)

**Преимущества:**

- ✅ Можно поделиться ссылкой с фильтрами
- ✅ Работает кнопка "Назад" в браузере
- ✅ Можно добавить в закладки
- ✅ SEO-friendly (для публичных страниц)

**Реализация:**

```typescript
// hooks/useURLParams.ts
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useCallback } from 'react';

export function useURLParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const updateParams = useCallback((updates: Record<string, string | number | undefined>) => {
    const params = new URLSearchParams(searchParams);
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });
    
    const queryString = params.toString();
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
    
    router.push(newUrl, { scroll: false });
  }, [searchParams, pathname, router]);
  
  const getParam = useCallback((key: string, defaultValue?: string) => {
    return searchParams.get(key) || defaultValue;
  }, [searchParams]);
  
  const getNumericParam = useCallback((key: string, defaultValue?: number) => {
    const value = searchParams.get(key);
    return value ? Number(value) : defaultValue;
  }, [searchParams]);
  
  return {
    updateParams,
    getParam,
    getNumericParam,
    searchParams,
  };
}

// Использование
function SearchPage() {
  const { updateParams, getNumericParam } = useURLParams();
  
  const currentPage = getNumericParam('page', 1);
  const priceMin = getNumericParam('price_min');
  const priceMax = getNumericParam('price_max');
  
  return (
    <div>
      {/* Фильтр цены */}
      <PriceRange
        min={priceMin}
        max={priceMax}
        onChange={(min, max) => {
          updateParams({ price_min: min, price_max: max });
        }}
      />
      
      {/* Пагинация */}
      <Pagination
        page={currentPage}
        onChange={(page) => {
          updateParams({ page });
        }}
      />
    </div>
  );
}
```


### 5.5. Принципы "Single Source of Truth"

**Иерархия источников истины:**

```
1. URL Parameters (для sharable state)
   ↓
2. React Query Cache (для server state)
   ↓
3. Zustand Store (для client global state)
   ↓
4. Local Component State (для UI state)
```

**Правила:**

✅ **ПРАВИЛЬНО:**
- Серверные данные (склады, боксы, бронирования) → **только React Query**
- Фильтры поиска → **URL + Zustand** (синхронизация)
- Аутентификация пользователя → **Zustand** (persist в localStorage)
- UI toggles (модалки, меню) → **Zustand или Local State**
- Временные значения форм → **Local State**

❌ **НЕПРАВИЛЬНО:**
- ❌ Дублировать серверные данные в Zustand
- ❌ Хранить вычисляемые значения в state
- ❌ Хранить данные в нескольких местах одновременно

**Примеры:**

```typescript
// ✅ ПРАВИЛЬНО
function WarehouseList() {
  // Фильтры из Zustand (синхронизированы с URL)
  const filters = useFilters();
  
  // Данные складов из React Query
  const { data: warehouses } = useWarehouses(filters);
  
  return (
    <div>
      {warehouses?.map((warehouse) => (
        <WarehouseCard key={warehouse.id} warehouse={warehouse} />
      ))}
    </div>
  );
}

// ❌ НЕПРАВИЛЬНО - дублирование серверных данных
function WarehouseList() {
  const [warehouses, setWarehouses] = useState([]); // ❌ Дублирование
  
  useEffect(() => {
    fetchWarehouses().then(setWarehouses); // ❌ Ручная загрузка
  }, []);
  
  return <div>{/* ... */}</div>;
}

// ✅ ПРАВИЛЬНО - вычисляемое значение
function BookingForm() {
  const selectedDuration = 3;
  const pricePerMonth = 5000;
  
  // Вычисляем на лету
  const totalPrice = pricePerMonth * selectedDuration;
  
  return <div>Итого: {totalPrice} AED </div>;
}

// ❌ НЕПРАВИЛЬНО - хранение вычисляемого в state
function BookingForm() {
  const [selectedDuration, setSelectedDuration] = useState(3);
  const [pricePerMonth] = useState(5000);
  const [totalPrice, setTotalPrice] = useState(15000); // ❌ Дублирование
  
  useEffect(() => {
    setTotalPrice(pricePerMonth * selectedDuration); // ❌ Лишняя синхронизация
  }, [selectedDuration, pricePerMonth]);
  
  return <div>Итого: {totalPrice} AED </div>;
}
```

**Диаграмма потока данных:**

```
URL (/search?city=Dubai&price_min=3000)
  ↓
Filter Store (Zustand) - синхронизация при загрузке
  ↓
useWarehouses(filters) - React Query hook
  ↓
API Request → Backend → Database
  ↓
React Query Cache (автоматическое кэширование)
  ↓
Component (отображение данных)
```


**Конец Блока 2A (Раздел 4)**








## 6. Подход к загрузке данных

### Общая концепция

Загрузка данных организована по следующим принципам:

1. **Единый API Client** — axios instance с интерсепторами
2. **React Query** — управление серверным состоянием
3. **Типобезопасность** — TypeScript для всех API вызовов
4. **Обработка ошибок** — централизованная и типизированная
5. **Оптимизация** — кэширование, prefetching, pagination


### 6.1. API Client Layer

#### 6.1.1. Базовый axios instance

**Файл:** `lib/api/client.ts`

```typescript
import axios, { AxiosError, AxiosRequestConfig } from 'axios';

// Создаем базовый экземпляр axios
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1',
  timeout: 30000, // 30 секунд
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true, // Для отправки cookies
});

// Экспорт для использования в хуках и API функциях
export default apiClient;

// Вспомогательные функции для работы с разными типами контента

// Для отправки FormData (загрузка файлов)
export const createFormDataClient = () => {
  return axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1',
    timeout: 120000, // 2 минуты для загрузки файлов
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    withCredentials: true,
  });
};

// Для AI запросов (длительный timeout)
export const createAIClient = () => {
  return axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1',
    timeout: 60000, // 60 секунд для AI запросов
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true,
  });
};
```


#### 6.1.2. Интерсепторы

**Request Interceptor - добавление токена и метаданных:**

```typescript
// lib/api/interceptors/request.interceptor.ts
import { AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import { getAccessToken } from '@/lib/auth/tokens';
import { v4 as uuidv4 } from 'uuid';

export function setupRequestInterceptor(client: any) {
  client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // 1. Добавляем токен авторизации
      const token = getAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      // 2. Добавляем request ID для трейсинга
      config.headers['X-Request-ID'] = uuidv4();
      
      // 3. Добавляем timestamp запроса
      config.headers['X-Request-Time'] = new Date().toISOString();
      
      // 4. Добавляем информацию о клиенте (опционально)
      if (typeof window !== 'undefined') {
        config.headers['X-Client-Platform'] = 'web';
        config.headers['X-Client-Version'] = process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0';
      }
      
      // 5. Логируем запрос в dev mode
      if (process.env.NODE_ENV === 'development') {
        console.log(`🚀 API Request:`, {
          method: config.method?.toUpperCase(),
          url: config.url,
          params: config.params,
          data: config.data,
        });
      }
      
      return config;
    },
    (error) => {
      console.error('❌ Request Error:', error);
      return Promise.reject(error);
    }
  );
}
```

**Response Interceptor - обработка ответов и refresh token:**

```typescript
// lib/api/interceptors/response.interceptor.ts
import { AxiosError, AxiosResponse } from 'axios';
import { refreshAccessToken, clearTokens } from '@/lib/auth/tokens';
import toast from 'react-hot-toast';

// Состояние для обработки одновременных запросов с 401
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

export function setupResponseInterceptor(client: any) {
  client.interceptors.response.use(
    (response: AxiosResponse) => {
      // Успешный ответ
      
      // Логируем в dev mode
      if (process.env.NODE_ENV === 'development') {
        console.log(`✅ API Response:`, {
          url: response.config.url,
          status: response.status,
          data: response.data,
        });
      }
      
      return response;
    },
    async (error: AxiosError) => {
      const originalRequest: any = error.config;
      
      // Логируем ошибку
      console.error('❌ API Error:', {
        url: originalRequest?.url,
        status: error.response?.status,
        message: error.message,
      });
      
      // 401 - Unauthorized, пытаемся обновить токен
      if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          // Если уже идет обновление токена, добавляем запрос в очередь
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return client(originalRequest);
            })
            .catch((err) => {
              return Promise.reject(err);
            });
        }
        
        originalRequest._retry = true;
        isRefreshing = true;
        
        try {
          // Пытаемся обновить токен
          const newToken = await refreshAccessToken();
          
          // Обрабатываем очередь запросов
          processQueue(null, newToken);
          
          // Повторяем оригинальный запрос с новым токеном
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return client(originalRequest);
        } catch (refreshError) {
          // Не удалось обновить токен - выход
          processQueue(refreshError, null);
          clearTokens();
          
          // Редирект на страницу входа
          if (typeof window !== 'undefined') {
            window.location.href = '/login?reason=session_expired';
          }
          
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }
      
      // 403 - Forbidden
      if (error.response?.status === 403) {
        toast.error('У вас нет доступа к этому ресурсу');
      }
      
      // 404 - Not Found
      if (error.response?.status === 404) {
        const errorData: any = error.response?.data;
        const errorMessage = errorData?.error?.message || 'Ресурс не найден';
        toast.error(errorMessage);
      }
      
      // 422 - Validation Error
      if (error.response?.status === 422) {
        const errorData: any = error.response?.data;
        const errorMessage = errorData?.error?.message || 'Ошибка валидации данных';
        toast.error(errorMessage);
      }
      
      // 429 - Rate Limit
      if (error.response?.status === 429) {
        toast.error('Слишком много запросов. Попробуйте позже');
      }
      
      // 500+ - Server Error
      if (error.response?.status && error.response.status >= 500) {
        toast.error('Ошибка сервера. Мы уже работаем над решением');
      }
      
      // Network Error
      if (!error.response && error.message === 'Network Error') {
        toast.error('Проблема с подключением к интернету');
      }
      
      return Promise.reject(error);
    }
  );
}
```

**Инициализация интерсепторов:**

```typescript
// lib/api/client.ts (продолжение)
import { setupRequestInterceptor } from './interceptors/request.interceptor';
import { setupResponseInterceptor } from './interceptors/response.interceptor';

// Применяем интерсепторы
setupRequestInterceptor(apiClient);
setupResponseInterceptor(apiClient);

export default apiClient;
```


#### 6.1.3. Обработка ошибок

**Типизация ошибок API:**

```typescript
// types/api.types.ts
export interface APIError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, any>;
    field_errors?: Record<string, string[]>;
  };
  meta?: {
    timestamp: string;
    request_id: string;
  };
}

export interface APISuccess<T> {
  success: true;
  data: T;
  meta?: {
    timestamp: string;
    request_id: string;
  };
  pagination?: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
    has_next: boolean;
    has_previous: boolean;
  };
}

export type APIResponse<T> = APISuccess<T> | APIError;

// Коды ошибок
export enum ErrorCode {
  VALIDATION_ERROR = 'validation_error',
  NOT_FOUND = 'not_found',
  UNAUTHORIZED = 'unauthorized',
  FORBIDDEN = 'forbidden',
  CONFLICT = 'conflict',
  RATE_LIMIT = 'rate_limit_exceeded',
  INTERNAL_ERROR = 'internal_error',
  BAD_REQUEST = 'bad_request',
}
```

**Утилита для обработки ошибок:**

```typescript
// lib/utils/error-handler.ts
import { AxiosError } from 'axios';
import { APIError, ErrorCode } from '@/types/api.types';
import toast from 'react-hot-toast';

export function handleAPIError(error: unknown): string {
  if (error instanceof AxiosError) {
    const apiError = error.response?.data as APIError;
    
    if (apiError?.error) {
      // Специфичная обработка по кодам
      switch (apiError.error.code) {
        case ErrorCode.VALIDATION_ERROR:
          // Показываем ошибки валидации
          if (apiError.error.field_errors) {
            const firstError = Object.values(apiError.error.field_errors)[0][0];
            return firstError;
          }
          return apiError.error.message;
          
        case ErrorCode.NOT_FOUND:
          return apiError.error.message || 'Ресурс не найден';
          
        case ErrorCode.UNAUTHORIZED:
          return 'Требуется авторизация';
          
        case ErrorCode.FORBIDDEN:
          return 'У вас нет доступа к этому ресурсу';
          
        case ErrorCode.CONFLICT:
          return apiError.error.message || 'Конфликт данных';
          
        case ErrorCode.RATE_LIMIT:
          return 'Слишком много запросов. Попробуйте позже';
          
        default:
          return apiError.error.message || 'Произошла ошибка';
      }
    }
    
    // Fallback для ошибок без структурированного ответа
    return error.message || 'Произошла ошибка';
  }
  
  // Для других типов ошибок
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'Неизвестная ошибка';
}

// Функция для показа ошибки через toast
export function showAPIError(error: unknown, defaultMessage?: string) {
  const message = handleAPIError(error);
  toast.error(defaultMessage || message);
}
```

**Использование в React Query:**

```typescript
// hooks/useWarehouses.ts
import { useQuery } from '@tanstack/react-query';
import { warehousesApi } from '@/lib/api/warehouses-api';
import { handleAPIError } from '@/lib/utils/error-handler';
import toast from 'react-hot-toast';

export function useWarehouses(filters: SearchFilters) {
  return useQuery({
    queryKey: ['warehouses', 'search', filters],
    queryFn: () => warehousesApi.search(filters),
    
    onError: (error) => {
      const errorMessage = handleAPIError(error);
      toast.error(errorMessage);
    },
    
    // Альтернативно - не показывать toast автоматически,
    // а обрабатывать в компоненте
    retry: (failureCount, error: any) => {
      // Не повторять при client errors (4xx кроме 408, 429)
      const status = error.response?.status;
      if (status && status >= 400 && status < 500) {
        return status === 408 || status === 429;
      }
      return failureCount < 3;
    },
  });
}
```


### 6.2. React Query конфигурация

#### 6.2.1. Query keys структура

**Иерархическая организация query keys:**

```typescript
// lib/query-keys.ts
import type { SearchFilters } from '@/stores/filter-store';

export const queryKeys = {
  // Warehouses
  warehouses: {
    all: ['warehouses'] as const,
    lists: () => [...queryKeys.warehouses.all, 'list'] as const,
    list: (filters: SearchFilters) => [...queryKeys.warehouses.lists(), filters] as const,
    details: () => [...queryKeys.warehouses.all, 'detail'] as const,
    detail: (id: number) => [...queryKeys.warehouses.details(), id] as const,
    featured: () => [...queryKeys.warehouses.all, 'featured'] as const,
    nearby: (lat: number, lng: number, radius: number) => 
      [...queryKeys.warehouses.all, 'nearby', { lat, lng, radius }] as const,
  },
  
  // Boxes
  boxes: {
    all: ['boxes'] as const,
    lists: () => [...queryKeys.boxes.all, 'list'] as const,
    list: (warehouseId: number, filters?: any) => 
      [...queryKeys.boxes.lists(), warehouseId, filters] as const,
    details: () => [...queryKeys.boxes.all, 'detail'] as const,
    detail: (id: number) => [...queryKeys.boxes.details(), id] as const,
    availability: (id: number) => [...queryKeys.boxes.detail(id), 'availability'] as const,
  },
  
  // Bookings
  bookings: {
    all: ['bookings'] as const,
    lists: () => [...queryKeys.bookings.all, 'list'] as const,
    user: (userId?: number) => [...queryKeys.bookings.lists(), 'user', userId] as const,
    operator: (operatorId?: number) => 
      [...queryKeys.bookings.lists(), 'operator', operatorId] as const,
    details: () => [...queryKeys.bookings.all, 'detail'] as const,
    detail: (id: number) => [...queryKeys.bookings.details(), id] as const,
  },
  
  // Reviews
  reviews: {
    all: ['reviews'] as const,
    warehouse: (warehouseId: number) => 
      [...queryKeys.reviews.all, 'warehouse', warehouseId] as const,
    user: (userId: number) => [...queryKeys.reviews.all, 'user', userId] as const,
  },
  
  // User
  user: {
    current: ['user', 'current'] as const,
    profile: (id: number) => ['user', 'profile', id] as const,
    favorites: (userId: number) => ['user', userId, 'favorites'] as const,
    reviews: (userId: number) => ['user', userId, 'reviews'] as const,
  },
  
  // Operator
  operator: {
    warehouses: (operatorId?: number) => 
      ['operator', operatorId, 'warehouses'] as const,
    analytics: (operatorId: number) => 
      ['operator', operatorId, 'analytics'] as const,
    stats: (operatorId: number, warehouseId?: number) => 
      ['operator', operatorId, 'stats', warehouseId] as const,
  },
  
  // Static data (справочники)
  static: {
    attributes: ['static', 'attributes'] as const,
    cities: ['static', 'cities'] as const,
    districts: (city: string) => ['static', 'districts', city] as const,
    metroStations: (city: string) => ['static', 'metro-stations', city] as const,
  },
  
  // AI
  ai: {
    recommendation: (items: string[], warehouseId: number) => 
      ['ai', 'recommendation', { items, warehouseId }] as const,
    chat: (sessionId: string) => ['ai', 'chat', sessionId] as const,
  },
};

// Примеры использования:

// Инвалидация всех складов
queryClient.invalidateQueries({ queryKey: queryKeys.warehouses.all });

// Инвалидация всех списков складов (но не деталей)
queryClient.invalidateQueries({ queryKey: queryKeys.warehouses.lists() });

// Инвалидация конкретного склада
queryClient.invalidateQueries({ queryKey: queryKeys.warehouses.detail(123) });

// Инвалидация всех бронирований пользователя
queryClient.invalidateQueries({ queryKey: queryKeys.bookings.user() });
```


#### 6.2.2. Stale time и cache time

**Стратегии кэширования по типам данных:**

```typescript
// lib/react-query-config.ts

// 1. ОЧЕНЬ ЧАСТО МЕНЯЮЩИЕСЯ (real-time data)
export const realtimeConfig = {
  staleTime: 30 * 1000, // 30 секунд
  gcTime: 2 * 60 * 1000, // 2 минуты
  refetchInterval: 1 * 60 * 1000, // Auto-refetch каждую минуту
};

// Пример: доступность боксов в реальном времени
export function useBoxAvailability(boxId: number) {
  return useQuery({
    queryKey: queryKeys.boxes.availability(boxId),
    queryFn: () => boxesApi.getAvailability(boxId),
    ...realtimeConfig,
  });
}

// 2. ЧАСТО МЕНЯЮЩИЕСЯ (frequently updated)
export const frequentConfig = {
  staleTime: 2 * 60 * 1000, // 2 минуты
  gcTime: 5 * 60 * 1000, // 5 минут
  refetchOnWindowFocus: true,
};

// Пример: список бронирований пользователя
export function useUserBookings() {
  const { user } = useAuthStore();
  
  return useQuery({
    queryKey: queryKeys.bookings.user(user?.id),
    queryFn: () => bookingsApi.getUserBookings(),
    ...frequentConfig,
    enabled: !!user,
  });
}

// 3. СРЕДНЕ МЕНЯЮЩИЕСЯ (moderately updated)
export const moderateConfig = {
  staleTime: 5 * 60 * 1000, // 5 минут
  gcTime: 10 * 60 * 1000, // 10 минут
  refetchOnWindowFocus: false,
};

// Пример: результаты поиска складов
export function useWarehouses(filters: SearchFilters) {
  return useQuery({
    queryKey: queryKeys.warehouses.list(filters),
    queryFn: () => warehousesApi.search(filters),
    ...moderateConfig,
  });
}

// 4. РЕДКО МЕНЯЮЩИЕСЯ (rarely updated)
export const rareConfig = {
  staleTime: 30 * 60 * 1000, // 30 минут
  gcTime: 60 * 60 * 1000, // 1 час
  refetchOnWindowFocus: false,
};

// Пример: детали склада
export function useWarehouse(id: number) {
  return useQuery({
    queryKey: queryKeys.warehouses.detail(id),
    queryFn: () => warehousesApi.getById(id),
    ...rareConfig,
    enabled: !!id,
  });
}

// 5. СТАТИЧЕСКИЕ ДАННЫЕ (static/reference data)
export const staticConfig = {
  staleTime: Infinity, // Никогда не устаревают
  gcTime: Infinity, // Хранить всегда
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
};

// Пример: справочник атрибутов
export function useWarehouseAttributes() {
  return useQuery({
    queryKey: queryKeys.static.attributes,
    queryFn: () => attributesApi.getAll(),
    ...staticConfig,
  });
}

// 6. USER-SPECIFIC DATA (данные пользователя)
export const userDataConfig = {
  staleTime: 1 * 60 * 1000, // 1 минута
  gcTime: 5 * 60 * 1000, // 5 минут
  refetchOnWindowFocus: true, // Обновлять при возврате
  retry: 1, // Меньше retry для приватных данных
};

// Пример: профиль пользователя
export function useCurrentUser() {
  const { isAuthenticated } = useAuthStore();
  
  return useQuery({
    queryKey: queryKeys.user.current,
    queryFn: () => userApi.getCurrentUser(),
    ...userDataConfig,
    enabled: isAuthenticated,
  });
}
```


#### 6.2.3. Retry политика

**Умные стратегии retry:**

```typescript
// lib/react-query-config.ts

// Функция для определения, стоит ли повторять запрос
export function shouldRetry(failureCount: number, error: any): boolean {
  // Не превышаем максимум попыток
  if (failureCount >= 3) return false;
  
  const status = error.response?.status;
  
  // Не повторяем client errors (4xx)
  if (status && status >= 400 && status < 500) {
    // Исключения: timeout и rate limit можно повторить
    if (status === 408 || status === 429) {
      return failureCount < 2; // Максимум 2 повтора для этих случаев
    }
    return false; // Остальные 4xx не повторяем
  }
  
  // Повторяем server errors (5xx) и network errors
  return true;
}

// Exponential backoff с jitter
export function getRetryDelay(attemptIndex: number): number {
  // Базовая задержка: 1s, 2s, 4s, 8s...
  const baseDelay = Math.min(1000 * 2 ** attemptIndex, 30000);
  
  // Добавляем случайный jitter ±20% для предотвращения thundering herd
  const jitter = baseDelay * 0.2 * (Math.random() - 0.5);
  
  return baseDelay + jitter;
}

// Применение в Query Client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: shouldRetry,
      retryDelay: getRetryDelay,
    },
  },
});

// Кастомная retry логика для специфичных запросов
export function useCriticalData() {
  return useQuery({
    queryKey: ['critical', 'data'],
    queryFn: () => api.getCriticalData(),
    
    // Более агрессивная retry стратегия
    retry: (failureCount, error: any) => {
      // Для критичных данных повторяем даже некоторые 4xx
      const status = error.response?.status;
      
      if (status === 503 || status === 502) {
        // Service Unavailable - повторяем больше раз
        return failureCount < 5;
      }
      
      return shouldRetry(failureCount, error);
    },
    
    retryDelay: (attemptIndex, error: any) => {
      const status = error.response?.status;
      
      // Для rate limit ждем дольше
      if (status === 429) {
        const retryAfter = error.response?.headers['retry-after'];
        if (retryAfter) {
          return Number(retryAfter) * 1000;
        }
        return 60000; // 1 минута по умолчанию
      }
      
      return getRetryDelay(attemptIndex);
    },
  });
}

// Без retry для не критичных запросов
export function useOptionalData() {
  return useQuery({
    queryKey: ['optional', 'data'],
    queryFn: () => api.getOptionalData(),
    retry: false, // Не повторяем вообще
  });
}
```


### 6.3. Работа с мутациями

#### 6.3.1. Optimistic updates

**Оптимистичное обновление для быстрого UX:**

```typescript
// hooks/useToggleFavorite.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { favoritesApi } from '@/lib/api/favorites-api';
import { queryKeys } from '@/lib/query-keys';
import toast from 'react-hot-toast';

export function useToggleFavorite() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ 
      warehouseId, 
      isFavorite 
    }: { 
      warehouseId: number; 
      isFavorite: boolean;
    }) => {
      return isFavorite
        ? favoritesApi.remove(warehouseId)
        : favoritesApi.add(warehouseId);
    },
    
    // Оптимистичное обновление ДО отправки запроса
    onMutate: async ({ warehouseId, isFavorite }) => {
      // 1. Отменяем исходящие запросы для этого склада
      await queryClient.cancelQueries({ 
        queryKey: queryKeys.warehouses.detail(warehouseId) 
      });
      
      // 2. Сохраняем предыдущее состояние для rollback
      const previousWarehouse = queryClient.getQueryData(
        queryKeys.warehouses.detail(warehouseId)
      );
      
      // 3. Оптимистично обновляем UI
      queryClient.setQueryData(
        queryKeys.warehouses.detail(warehouseId),
        (old: any) => {
          if (!old) return old;
          return {
            ...old,
            is_favorite: !isFavorite,
          };
        }
      );
      
      // 4. Также обновляем в списке, если он закэширован
      queryClient.setQueriesData(
        { queryKey: queryKeys.warehouses.lists() },
        (oldData: any) => {
          if (!oldData) return oldData;
          
          return {
            ...oldData,
            data: oldData.data.map((warehouse: any) =>
              warehouse.id === warehouseId
                ? { ...warehouse, is_favorite: !isFavorite }
                : warehouse
            ),
          };
        }
      );
      
      // Возвращаем context для использования в onError
      return { previousWarehouse, warehouseId };
    },
    
    // Откат изменений при ошибке
    onError: (error, variables, context) => {
      if (context?.previousWarehouse) {
        // Восстанавливаем предыдущее состояние
        queryClient.setQueryData(
          queryKeys.warehouses.detail(context.warehouseId),
          context.previousWarehouse
        );
      }
      
      toast.error('Не удалось обновить избранное');
    },
    
    // Успешное выполнение
    onSuccess: (data, variables) => {
      // Можно показать subtle уведомление
      // toast.success('Добавлено в избранное');
    },
    
    // Всегда выполняется после onSuccess или onError
    onSettled: (data, error, variables) => {
      // Обновляем данные с сервера для консистентности
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.warehouses.detail(variables.warehouseId) 
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.user.favorites(),
      });
    },
  });
}
```

**Оптимистичное обновление для списков:**

```typescript
// hooks/useUpdateWarehouse.ts
export function useUpdateWarehouse() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ 
      id, 
      data 
    }: { 
      id: number; 
      data: Partial<Warehouse>;
    }) => {
      return warehousesApi.update(id, data);
    },
    
    onMutate: async ({ id, data }) => {
      // Отменяем запросы
      await queryClient.cancelQueries({ 
        queryKey: queryKeys.warehouses.detail(id) 
      });
      await queryClient.cancelQueries({ 
        queryKey: queryKeys.operator.warehouses() 
      });
      
      // Сохраняем предыдущие данные
      const previousWarehouse = queryClient.getQueryData(
        queryKeys.warehouses.detail(id)
      );
      const previousList = queryClient.getQueryData(
        queryKeys.operator.warehouses()
      );
      
      // Оптимистично обновляем детали
      queryClient.setQueryData(
        queryKeys.warehouses.detail(id),
        (old: any) => ({ ...old, ...data })
      );
      
      // Оптимистично обновляем в списке
      queryClient.setQueryData(
        queryKeys.operator.warehouses(),
        (old: any) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.map((w: any) =>
              w.id === id ? { ...w, ...data } : w
            ),
          };
        }
      );
      
      return { previousWarehouse, previousList, id };
    },
    
    onError: (error, variables, context) => {
      // Откат
      if (context) {
        if (context.previousWarehouse) {
          queryClient.setQueryData(
            queryKeys.warehouses.detail(context.id),
            context.previousWarehouse
          );
        }
        if (context.previousList) {
          queryClient.setQueryData(
            queryKeys.operator.warehouses(),
            context.previousList
          );
        }
      }
      
      toast.error('Не удалось обновить склад');
    },
    
    onSuccess: () => {
      toast.success('Склад успешно обновлен');
    },
    
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.warehouses.detail(variables.id) 
      });
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.operator.warehouses() 
      });
    },
  });
}
```


#### 6.3.2. Invalidation после мутаций

**Создание нового ресурса:**

```typescript
// hooks/useCreateWarehouse.ts
export function useCreateWarehouse() {
  const queryClient = useQueryClient();
  const router = useRouter();
  
  return useMutation({
    mutationFn: warehousesApi.create,
    
    onSuccess: (newWarehouse) => {
      // 1. Инвалидируем список складов оператора
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.operator.warehouses() 
      });
      
      // 2. Предзаполняем кэш новым складом (избегаем лишний запрос)
      queryClient.setQueryData(
        queryKeys.warehouses.detail(newWarehouse.id),
        newWarehouse
      );
      
      // 3. Уведомление
      toast.success('Склад создан!');
      
      // 4. Редирект
      router.push(`/operator/warehouses/${newWarehouse.id}`);
    },
    
    onError: (error) => {
      toast.error('Не удалось создать склад');
    },
  });
}
```

**Удаление ресурса:**

```typescript
// hooks/useDeleteWarehouse.ts
export function useDeleteWarehouse() {
  const queryClient = useQueryClient();
  const router = useRouter();
  
  return useMutation({
    mutationFn: warehousesApi.delete,
    
    onSuccess: (_, deletedId) => {
      // 1. Удаляем из кэша
      queryClient.removeQueries({ 
        queryKey: queryKeys.warehouses.detail(deletedId) 
      });
      
      // 2. Инвалидируем списки
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.operator.warehouses() 
      });
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.warehouses.lists() 
      });
      
      // 3. Инвалидируем зависимые данные
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.boxes.all 
      });
      
      toast.success('Склад удален');
      router.push('/operator/warehouses');
    },
  });
}
```

**Сложные мутации с множественной инвалидацией:**

```typescript
// hooks/useCreateBooking.ts
export function useCreateBooking() {
  const queryClient = useQueryClient();
  const router = useRouter();
  
  return useMutation({
    mutationFn: bookingsApi.create,
    
    onSuccess: (newBooking) => {
      // 1. Инвалидируем бронирования пользователя
      queryClient.invalidateQueries({
        queryKey: queryKeys.bookings.user(),
      });
      
      // 2. Инвалидируем доступность бокса
      queryClient.invalidateQueries({
        queryKey: queryKeys.boxes.availability(newBooking.box_id),
      });
      
      // 3. Инвалидируем детали бокса
      queryClient.invalidateQueries({
        queryKey: queryKeys.boxes.detail(newBooking.box_id),
      });
      
      // 4. Инвалидируем список боксов склада
      queryClient.invalidateQueries({
        queryKey: queryKeys.boxes.list(newBooking.warehouse_id),
      });
      
      // 5. Инвалидируем детали склада (summary боксов)
      queryClient.invalidateQueries({
        queryKey: queryKeys.warehouses.detail(newBooking.warehouse_id),
      });
      
      // 6. Для оператора - инвалидируем входящие бронирования
      queryClient.invalidateQueries({
        queryKey: queryKeys.bookings.operator(),
      });
      
      toast.success('Бронирование создано!');
      router.push(`/booking/${newBooking.id}/success`);
    },
  });
}
```


### 6.4. Пагинация и бесконечная прокрутка

#### Классическая пагинация

```typescript
// hooks/useWarehouses.ts
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';
import { warehousesApi } from '@/lib/api/warehouses-api';

export function useWarehouses(
  filters: SearchFilters,
  page: number = 1,
  perPage: number = 12
) {
  return useQuery({
    queryKey: queryKeys.warehouses.list({ ...filters, page, per_page: perPage }),
    queryFn: () => warehousesApi.search({ ...filters, page, per_page: perPage }),
    keepPreviousData: true, // ВАЖНО: показывать старые данные пока загружаются новые
    staleTime: 5 * 60 * 1000,
  });
}

// В компоненте
function WarehouseListWithPagination() {
  const filters = useFilters();
  const [page, setPage] = useState(1);
  
  const { data, isLoading, isPreviousData, isFetching } = useWarehouses(
    filters,
    page
  );
  
  // Prefetch следующей страницы
  const queryClient = useQueryClient();
  useEffect(() => {
    if (data?.pagination.has_next && !isPreviousData) {
      queryClient.prefetchQuery({
        queryKey: queryKeys.warehouses.list({ ...filters, page: page + 1 }),
        queryFn: () => warehousesApi.search({ ...filters, page: page + 1 }),
      });
    }
  }, [data, page, filters, isPreviousData, queryClient]);
  
  if (isLoading) return <LoadingSkeleton />;
  
  return (
    <div>
      {/* Список складов */}
      <div className={cn(
        'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
        isPreviousData && 'opacity-50' // Индикация загрузки новой страницы
      )}>
        {data?.data.map((warehouse) => (
          <WarehouseCard key={warehouse.id} warehouse={warehouse} />
        ))}
      </div>
      
      {/* Пагинация */}
      <div className="mt-8 flex justify-center">
        <Pagination
          currentPage={page}
          totalPages={data?.pagination.total_pages || 1}
          onPageChange={(newPage) => {
            setPage(newPage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          hasNext={data?.pagination.has_next}
          hasPrevious={data?.pagination.has_previous}
        />
      </div>
      
      {/* Индикатор загрузки */}
      {isFetching && !isLoading && (
        <div className="fixed bottom-4 right-4">
          <div className="bg-primary text-white px-4 py-2 rounded-lg shadow-lg">
            Загрузка...
          </div>
        </div>
      )}
    </div>
  );
}
```


#### Бесконечная прокрутка (Infinite Scroll)

```typescript
// hooks/useInfiniteWarehouses.ts
import { useInfiniteQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';
import { warehousesApi } from '@/lib/api/warehouses-api';

export function useInfiniteWarehouses(filters: SearchFilters, perPage: number = 12) {
  return useInfiniteQuery({
    queryKey: queryKeys.warehouses.list({ ...filters, infinite: true }),
    
    queryFn: ({ pageParam = 1 }) => 
      warehousesApi.search({ ...filters, page: pageParam, per_page: perPage }),
    
    getNextPageParam: (lastPage) => {
      // Возвращаем номер следующей страницы или undefined если страниц больше нет
      if (lastPage.pagination.has_next) {
        return lastPage.pagination.page + 1;
      }
      return undefined;
    },
    
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000,
  });
}

// В компоненте
function InfiniteWarehouseList() {
  const filters = useFilters();
  
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteWarehouses(filters);
  
  // Intersection Observer для автоматической загрузки
  const loadMoreRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!loadMoreRef.current || !hasNextPage || isFetchingNextPage) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      { threshold: 0.1, rootMargin: '100px' } // Загружать за 100px до появления
    );
    
    observer.observe(loadMoreRef.current);
    
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);
  
  if (isLoading) return <LoadingSkeleton />;
  if (isError) return <ErrorState />;
  
  // Подсчет общего количества складов
  const totalCount = data?.pages.reduce(
    (acc, page) => acc + page.data.length,
    0
  ) || 0;
  
  return (
    <div>
      {/* Счетчик */}
      <div className="mb-4 text-gray-600">
        Найдено: {totalCount} {totalCount === 1 ? 'склад' : 'складов'}
      </div>
      
      {/* Список складов */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.pages.map((page, pageIndex) => (
          <React.Fragment key={pageIndex}>
            {page.data.map((warehouse) => (
              <WarehouseCard key={warehouse.id} warehouse={warehouse} />
            ))}
          </React.Fragment>
        ))}
      </div>
      
      {/* Триггер для загрузки */}
      {hasNextPage && (
        <div ref={loadMoreRef} className="mt-8 flex justify-center">
          {isFetchingNextPage ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Загрузка...</span>
            </div>
          ) : (
            <Button onClick={() => fetchNextPage()}>
              Показать ещё
            </Button>
          )}
        </div>
      )}
      
      {/* Сообщение о конце списка */}
      {!hasNextPage && totalCount > 0 && (
        <div className="mt-8 text-center text-gray-500">
          Все склады загружены
        </div>
      )}
    </div>
  );
}
```


### 6.5. Фильтрация и поиск

#### Debounced search

```typescript
// hooks/useDebounce.ts
import { useEffect, useState } from 'react';

export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [value, delay]);
  
  return debouncedValue;
}

// Компонент с debounced search
function SearchBar() {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = useDebounce(searchQuery, 300);
  const { updateFilter } = useFilterStore();
  
  // Обновляем фильтр только когда debounced значение меняется
  useEffect(() => {
    if (debouncedQuery.length >= 2 || debouncedQuery.length === 0) {
      updateFilter('q', debouncedQuery || undefined);
    }
  }, [debouncedQuery, updateFilter]);
  
  // Автокомплит
  const { data: suggestions, isLoading: isLoadingSuggestions } = useQuery({
    queryKey: ['search', 'suggestions', debouncedQuery],
    queryFn: () => searchApi.getSuggestions(debouncedQuery),
    enabled: debouncedQuery.length >= 2,
    staleTime: 5 * 60 * 1000,
  });
  
  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Поиск по городу, району, метро..."
          className="pl-12 pr-4"
        />
        {isLoadingSuggestions && (
          <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin" />
        )}
      </div>
      
      {/* Подсказки */}
      {suggestions && suggestions.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-lg border z-10">
          {suggestions.map((suggestion, idx) => (
            <button
              key={idx}
              onClick={() => {
                setSearchQuery(suggestion);
                updateFilter('q', suggestion);
              }}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-2"
            >
              <MapPin className="h-4 w-4 text-gray-400" />
              <span>{suggestion}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
```


### 6.6. Prefetching стратегии

#### 6.6.1. Server-side prefetch

```typescript
// app/warehouses/[id]/page.tsx
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';

export default async function WarehousePage({ params }: { params: { id: string } }) {
  const queryClient = new QueryClient();
  const warehouseId = Number(params.id);
  
  // Prefetch критичных данных на сервере
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: queryKeys.warehouses.detail(warehouseId),
      queryFn: () => warehousesApi.getById(warehouseId),
    }),
    queryClient.prefetchQuery({
      queryKey: queryKeys.boxes.list(warehouseId),
      queryFn: () => boxesApi.getByWarehouse(warehouseId),
    }),
  ]);
  
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <WarehouseDetails id={warehouseId} />
    </HydrationBoundary>
  );
}
```


#### 6.6.2. Client-side prefetch

```typescript
// Prefetch при наведении
function WarehouseCard({ warehouse }: { warehouse: Warehouse }) {
  const queryClient = useQueryClient();
  
  const prefetchDetails = () => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.warehouses.detail(warehouse.id),
      queryFn: () => warehousesApi.getById(warehouse.id),
    });
  };
  
  return (
    <Link
      href={`/warehouses/${warehouse.id}`}
      onMouseEnter={prefetchDetails}
      onFocus={prefetchDetails}
    >
      {/* ... */}
    </Link>
  );
}
```


#### 6.6.3. Background refresh

```typescript
// Автоматическое обновление в фоне
export function useOperatorBookings() {
  return useQuery({
    queryKey: queryKeys.bookings.operator(),
    queryFn: () => bookingsApi.getOperatorBookings(),
    staleTime: 1 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000, // Каждые 5 минут
    refetchIntervalInBackground: true, // Даже если вкладка неактивна
  });
}
```


**Конец Блока 2B (Раздел 5)**








## 7. Организация UI-компонентов

### Общая концепция

UI-компоненты организованы по следующим принципам:

1. **Atomic Design (адаптированный)** — иерархия от простых к сложным
2. **Композиция над наследованием** — гибкость через composition
3. **Переиспользование** — максимальное использование базовых компонентов
4. **Типобезопасность** — TypeScript для всех props
5. **Доступность** — WCAG 2.1 AA минимум


### 7.1. Принципы организации

#### 7.1.1. Atomic Design (адаптированный)

Мы используем упрощенную версию Atomic Design:

```
Atoms (Атомы) - базовые компоненты
  ↓
Molecules (Молекулы) - простые составные компоненты
  ↓
Organisms (Организмы) - сложные бизнес-компоненты
  ↓
Templates/Pages - страницы и шаблоны
```

**Но с прагматичными отступлениями:**

- Не строгое следование категориям — практичность важнее догм
- Фокус на переиспользовании и композиции
- Избегаем излишней абстракции "ради абстракции"
- Группировка по доменам (modules) важнее строгой категоризации

**Структура компонентов:**

```
src/
├── components/
│   ├── ui/              # Базовые компоненты (atoms) - shadcn/ui
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── dialog.tsx
│   │   └── ...
│   ├── layout/          # Layout компоненты
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Sidebar.tsx
│   │   └── ...
│   └── shared/          # Shared составные компоненты
│       ├── EmptyState.tsx
│       ├── ErrorState.tsx
│       ├── LoadingSpinner.tsx
│       └── ...
├── features/            # Feature-specific компоненты (molecules)
│   ├── search-bar/
│   ├── filter-panel/
│   └── booking-flow/
└── modules/             # Domain модули (organisms)
    ├── warehouses/
    │   └── components/
    │       ├── WarehouseCard.tsx
    │       ├── WarehouseDetails.tsx
    │       └── ...
    ├── bookings/
    │   └── components/
    └── ...
```


#### 7.1.2. Композиция vs наследование

**❌ НЕПРАВИЛЬНО - наследование через props:**

```typescript
// Плохой подход - слишком много props, сложно расширять
interface CardProps {
  title: string;
  description?: string;
  image?: string;
  showActions?: boolean;
  showBadge?: boolean;
  badgeText?: string;
  actionButton?: string;
  onActionClick?: () => void;
  variant?: 'default' | 'compact' | 'detailed';
  // ... еще 10 пропсов
}

function Card({ title, description, image, showActions, ... }: CardProps) {
  // Сложная логика условного рендеринга
}
```

**✅ ПРАВИЛЬНО - композиция через children:**

```typescript
// Хороший подход - гибкая композиция
function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('bg-white rounded-lg shadow', className)}>
      {children}
    </div>
  );
}

function CardHeader({ children, className }: any) {
  return <div className={cn('p-6 pb-4', className)}>{children}</div>;
}

function CardContent({ children, className }: any) {
  return <div className={cn('p-6 pt-0', className)}>{children}</div>;
}

function CardFooter({ children, className }: any) {
  return <div className={cn('flex items-center p-6 pt-0', className)}>{children}</div>;
}

// Использование - полная гибкость
<Card>
  <CardHeader>
    <h3>Название</h3>
    <Badge>Новое</Badge>
  </CardHeader>
  <CardContent>
    <p>Контент</p>
    <img src="..." />
  </CardContent>
  <CardFooter>
    <Button>Действие</Button>
  </CardFooter>
</Card>
```


### 7.2. Базовые компоненты (atoms)

Все базовые компоненты берем из **shadcn/ui** (построены на Radix UI).

#### 7.2.1. Button

```typescript
// components/ui/button.tsx
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary-600 text-white hover:bg-primary-700',
        secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
        outline: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50',
        ghost: 'hover:bg-gray-100 hover:text-gray-900',
        destructive: 'bg-red-600 text-white hover:bg-red-700',
        link: 'text-primary-600 underline-offset-4 hover:underline',
      },
      size: {
        sm: 'h-9 px-3 text-sm',
        md: 'h-10 px-4',
        lg: 'h-12 px-6 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
```

**Использование:**

```typescript
// Различные варианты
<Button variant="default">Забронировать</Button>
<Button variant="outline" size="sm">Отменить</Button>
<Button variant="ghost">Подробнее</Button>
<Button variant="destructive" size="lg">Удалить</Button>

// С иконкой
<Button>
  <Search className="h-4 w-4 mr-2" />
  Найти
</Button>

// Как ссылка
<Button asChild>
  <Link href="/warehouses">Все склады</Link>
</Button>

// Loading состояние
<Button disabled={isLoading}>
  {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
  {isLoading ? 'Загрузка...' : 'Отправить'}
</Button>
```


#### 7.2.2. Input

```typescript
// components/ui/input.tsx
import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <div className="w-full">
        <input
          type={type}
          className={cn(
            'flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm',
            'placeholder:text-gray-400',
            'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-red-500 focus:ring-red-500',
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
```


#### 7.2.3. Dialog (Modal)

```typescript
// components/ui/dialog.tsx
import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = DialogPrimitive.Portal;

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      'fixed inset-0 z-50 bg-black/50',
      'data-[state=open]:animate-in data-[state=closed]:animate-out',
      'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      className
    )}
    {...props}
  />
));
DialogOverlay.displayName = 'DialogOverlay';

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        'fixed left-[50%] top-[50%] z-50 translate-x-[-50%] translate-y-[-50%]',
        'w-full max-w-lg rounded-lg bg-white p-6 shadow-lg',
        'data-[state=open]:animate-in data-[state=closed]:animate-out',
        'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
        'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100">
        <X className="h-4 w-4" />
        <span className="sr-only">Закрыть</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = 'DialogContent';

const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col space-y-1.5 mb-4', className)} {...props} />
);

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn('text-lg font-semibold', className)}
    {...props}
  />
));
DialogTitle.displayName = 'DialogTitle';

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn('text-sm text-gray-600', className)}
    {...props}
  />
));
DialogDescription.displayName = 'DialogDescription';

const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex justify-end gap-2 mt-6', className)} {...props} />
);

export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
```

**Использование:**

```typescript
function BookingDialog({ boxId }: { boxId: number }) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Забронировать</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Бронирование бокса</DialogTitle>
          <DialogDescription>
            Заполните форму для отправки заявки
          </DialogDescription>
        </DialogHeader>
        <BookingForm boxId={boxId} onSuccess={() => setIsOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
```


#### 7.2.4. Card

```typescript
// components/ui/card.tsx
import * as React from 'react';
import { cn } from '@/lib/utils';

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('rounded-lg border bg-white shadow-sm', className)}
      {...props}
    />
  )
);
Card.displayName = 'Card';

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col space-y-1.5 p-6', className)} {...props} />
  )
);
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn('text-2xl font-semibold leading-none tracking-tight', className)}
      {...props}
    />
  )
);
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn('text-sm text-gray-600', className)} {...props} />
  )
);
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
  )
);
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center p-6 pt-0', className)} {...props} />
  )
);
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
```


#### 7.2.5. Select

```typescript
// components/ui/select.tsx
import * as React from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const Select = SelectPrimitive.Root;
const SelectGroup = SelectPrimitive.Group;
const SelectValue = SelectPrimitive.Value;

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      'flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2',
      'text-sm placeholder:text-gray-400',
      'focus:outline-none focus:ring-2 focus:ring-primary-500',
      'disabled:cursor-not-allowed disabled:opacity-50',
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="h-4 w-4 opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = 'SelectTrigger';

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = 'popper', ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        'relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-white shadow-md',
        'data-[state=open]:animate-in data-[state=closed]:animate-out',
        position === 'popper' && 'max-h-96',
        className
      )}
      position={position}
      {...props}
    >
      <SelectPrimitive.Viewport className={cn('p-1')}>
        {children}
      </SelectPrimitive.Viewport>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));
SelectContent.displayName = 'SelectContent';

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      'relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none',
      'focus:bg-gray-100 data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
));
SelectItem.displayName = 'SelectItem';

export { Select, SelectGroup, SelectValue, SelectTrigger, SelectContent, SelectItem };
```

**Использование:**

```typescript
<Select value={sortBy} onValueChange={setSortBy}>
  <SelectTrigger className="w-[180px]">
    <SelectValue placeholder="Сортировка" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="rating">По рейтингу</SelectItem>
    <SelectItem value="price">По цене</SelectItem>
    <SelectItem value="distance">По расстоянию</SelectItem>
  </SelectContent>
</Select>
```


### 7.3. Составные компоненты (molecules)

#### 7.3.1. SearchBar

```typescript
// features/search-bar/SearchBar.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Search, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useDebounce } from '@/lib/hooks/useDebounce';
import { useQuery } from '@tanstack/react-query';
import { searchApi } from '@/lib/api/search-api';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  defaultValue?: string;
  className?: string;
  onSearch?: (query: string) => void;
}

export function SearchBar({ defaultValue = '', className, onSearch }: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState(defaultValue);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  
  // Загрузка подсказок
  const { data: suggestions, isLoading: isLoadingSuggestions } = useQuery({
    queryKey: ['search', 'suggestions', debouncedQuery],
    queryFn: () => searchApi.getSuggestions(debouncedQuery),
    enabled: debouncedQuery.length >= 2,
    staleTime: 5 * 60 * 1000,
  });
  
  useEffect(() => {
    if (suggestions && suggestions.length > 0) {
      setShowSuggestions(true);
    }
  }, [suggestions]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
    
    if (onSearch) {
      onSearch(query);
    } else {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };
  
  const handleSelectSuggestion = (suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    
    if (onSearch) {
      onSearch(suggestion);
    } else {
      router.push(`/search?q=${encodeURIComponent(suggestion)}`);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className={cn('relative', className)}>
      <div className="relative">
        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => suggestions && suggestions.length > 0 && setShowSuggestions(true)}
          placeholder="Город, район, метро..."
          className="pl-12 pr-32 h-14 text-base"
        />
        {isLoadingSuggestions && (
          <Loader2 className="absolute right-28 top-1/2 -translate-y-1/2 h-5 w-5 animate-spin text-gray-400" />
        )}
        <Button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2"
          size="lg"
        >
          <Search className="h-5 w-5 mr-2" />
          Найти
        </Button>
      </div>
      
      {/* Подсказки */}
      {showSuggestions && suggestions && suggestions.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-lg border z-10">
          {suggestions.map((suggestion, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelectSuggestion(suggestion)}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-2 transition"
            >
              <MapPin className="h-4 w-4 text-gray-400" />
              <span className="text-gray-900">{suggestion}</span>
            </button>
          ))}
        </div>
      )}
    </form>
  );
}
```


#### 7.3.2. PriceDisplay

```typescript
// components/shared/PriceDisplay.tsx
import { formatPrice } from '@/lib/utils/format';
import { cn } from '@/lib/utils';

interface PriceDisplayProps {
  price: number;
  period?: 'month' | 'day';
  discountPrice?: number;
  currency?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function PriceDisplay({ 
  price, 
  period = 'month', 
  discountPrice,
  currency = 'AED ',
  className,
  size = 'md',
}: PriceDisplayProps) {
  const hasDiscount = discountPrice && discountPrice < price;
  const discountPercent = hasDiscount 
    ? Math.round(((price - discountPrice) / price) * 100)
    : 0;
  
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
  };
  
  return (
    <div className={cn('flex items-baseline gap-2 flex-wrap', className)}>
      {/* Основная цена */}
      <span className={cn(
        'font-bold',
        sizeClasses[size],
        hasDiscount ? 'line-through text-gray-400' : 'text-primary-600'
      )}>
        {formatPrice(price)} {currency}
      </span>
      
      {/* Цена со скидкой */}
      {hasDiscount && (
        <>
          <span className={cn('font-bold text-primary-600', sizeClasses[size])}>
            {formatPrice(discountPrice!)} {currency}
          </span>
          <span className="text-sm bg-red-100 text-red-800 px-2 py-1 rounded font-medium">
            −{discountPercent}%
          </span>
        </>
      )}
      
      {/* Период */}
      <span className="text-gray-600">
        / {period === 'month' ? 'мес' : 'день'}
      </span>
    </div>
  );
}
```


#### 7.3.3. RatingStars

```typescript
// components/shared/RatingStars.tsx
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RatingStarsProps {
  rating: number; // 0-5
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
  count?: number;
  className?: string;
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
}

export function RatingStars({
  rating,
  maxRating = 5,
  size = 'md',
  showCount = false,
  count,
  className,
  interactive = false,
  onRatingChange,
}: RatingStarsProps) {
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  
  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };
  
  const displayRating = hoverRating ?? rating;
  
  const handleClick = (value: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(value);
    }
  };
  
  return (
    <div className={cn('flex items-center gap-1', className)}>
      {/* Звезды */}
      <div className="flex items-center gap-0.5">
        {Array.from({ length: maxRating }, (_, i) => {
          const starValue = i + 1;
          const isFilled = starValue <= Math.floor(displayRating);
          const isHalf = starValue === Math.ceil(displayRating) && displayRating % 1 !== 0;
          
          return (
            <button
              key={i}
              type="button"
              disabled={!interactive}
              onClick={() => handleClick(starValue)}
              onMouseEnter={() => interactive && setHoverRating(starValue)}
              onMouseLeave={() => interactive && setHoverRating(null)}
              className={cn(
                'relative',
                interactive && 'cursor-pointer hover:scale-110 transition'
              )}
            >
              {/* Заполненная звезда */}
              <Star
                className={cn(
                  sizeClasses[size],
                  isFilled || isHalf ? 'fill-yellow-500 text-yellow-500' : 'text-gray-300'
                )}
              />
              
              {/* Половина звезды */}
              {isHalf && (
                <div className="absolute inset-0 overflow-hidden w-1/2">
                  <Star
                    className={cn(sizeClasses[size], 'fill-yellow-500 text-yellow-500')}
                  />
                </div>
              )}
            </button>
          );
        })}
      </div>
      
      {/* Числовое значение */}
      <span className="text-sm font-medium text-gray-900">
        {rating.toFixed(1)}
      </span>
      
      {/* Количество отзывов */}
      {showCount && count !== undefined && (
        <span className="text-sm text-gray-500">
          ({count})
        </span>
      )}
    </div>
  );
}
```


#### 7.3.4. Pagination

```typescript
// components/shared/Pagination.tsx
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  hasNext?: boolean;
  hasPrevious?: boolean;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  hasNext = true,
  hasPrevious = true,
  className,
}: PaginationProps) {
  // Генерируем массив страниц для отображения
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    
    if (totalPages <= 7) {
      // Если страниц мало, показываем все
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Иначе показываем первую, последнюю и окружение текущей
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    
    return pages;
  };
  
  const pages = getPageNumbers();
  
  return (
    <nav className={cn('flex items-center justify-center gap-1', className)}>
      {/* Предыдущая */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!hasPrevious || currentPage === 1}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      {/* Страницы */}
      {pages.map((page, idx) => {
        if (page === '...') {
          return (
            <div key={`ellipsis-${idx}`} className="px-2">
              <MoreHorizontal className="h-4 w-4 text-gray-400" />
            </div>
          );
        }
        
        const pageNumber = page as number;
        const isActive = pageNumber === currentPage;
        
        return (
          <Button
            key={pageNumber}
            variant={isActive ? 'default' : 'outline'}
            size="icon"
            onClick={() => onPageChange(pageNumber)}
            className={cn(isActive && 'pointer-events-none')}
          >
            {pageNumber}
          </Button>
        );
      })}
      
      {/* Следующая */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNext || currentPage === totalPages}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </nav>
  );
}
```


### 7.4. Комплексные компоненты (organisms)

#### 7.4.1. WarehouseCard

```typescript
// modules/warehouses/components/WarehouseCard.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Star, Clock, Heart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PriceDisplay } from '@/components/shared/PriceDisplay';
import { RatingStars } from '@/components/shared/RatingStars';
import { useToggleFavorite } from '@/modules/warehouses/hooks/useToggleFavorite';
import { cn } from '@/lib/utils';
import type { Warehouse } from '@/types/warehouse.types';

interface WarehouseCardProps {
  warehouse: Warehouse;
  variant?: 'default' | 'compact';
}

export function WarehouseCard({ warehouse, variant = 'default' }: WarehouseCardProps) {
  const toggleFavorite = useToggleFavorite();
  
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite.mutate({ 
      warehouseId: warehouse.id,
      isFavorite: warehouse.is_favorite 
    });
  };
  
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow group">
      <Link href={`/warehouses/${warehouse.id}`}>
        {/* Изображение */}
        <div className="relative h-48 bg-gray-100">
          <Image
            src={warehouse.photos[0]?.url || '/placeholder-warehouse.jpg'}
            alt={warehouse.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Кнопка избранного */}
          <button
            onClick={handleFavoriteClick}
            disabled={toggleFavorite.isPending}
            className="absolute top-3 right-3 p-2 bg-white rounded-full shadow hover:scale-110 transition z-10"
          >
            <Heart
              className={cn(
                'h-5 w-5 transition',
                warehouse.is_favorite 
                  ? 'fill-red-500 text-red-500' 
                  : 'text-gray-600'
              )}
            />
          </button>
          
          {/* Бейджи */}
          <div className="absolute bottom-3 left-3 flex gap-2 flex-wrap">
            {warehouse.is_verified && (
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                ✓ Проверено
              </Badge>
            )}
            {warehouse.attributes.includes('climate_control') && (
              <Badge variant="secondary">Климат-контроль</Badge>
            )}
            {warehouse.attributes.includes('access_24_7') && (
              <Badge variant="secondary">24/7</Badge>
            )}
          </div>
        </div>
        
        <CardContent className="p-4">
          {/* Название */}
          <h3 className="text-lg font-semibold mb-2 group-hover:text-primary-600 transition line-clamp-1">
            {warehouse.name}
          </h3>
          
          {/* Адрес */}
          <div className="flex items-start gap-2 text-sm text-gray-600 mb-3">
            <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
            <span className="line-clamp-2">{warehouse.address.full_address}</span>
          </div>
          
          {/* Рейтинг и время работы */}
          <div className="flex items-center gap-4 text-sm mb-4">
            <RatingStars
              rating={warehouse.rating}
              showCount
              count={warehouse.reviews_count}
              size="sm"
            />
            
            <div className="flex items-center gap-1 text-gray-600">
              <Clock className="h-4 w-4" />
              <span>{warehouse.working_hours || '24/7'}</span>
            </div>
          </div>
          
          {/* Доступные боксы */}
          <div className="text-sm text-gray-600 mb-4">
            Доступно боксов: <span className="font-medium text-gray-900">{warehouse.available_boxes_count}</span>
          </div>
          
          {/* Цена */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div>
              <div className="text-sm text-gray-600 mb-1">от</div>
              <PriceDisplay price={warehouse.price_from} size="md" />
            </div>
            
            <Button variant="outline" size="sm">
              Подробнее
            </Button>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
```


#### 7.4.2. FilterPanel

```typescript
// features/filter-panel/FilterPanel.tsx
'use client';

import { useFilterStore } from '@/stores/filter-store';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

const BOX_SIZES = [
  { value: 'S', label: 'S (до 3 м²)', description: 'Чемодан, велосипед' },
  { value: 'M', label: 'M (3-6 м²)', description: 'Комната 1-2 комн. кв.' },
  { value: 'L', label: 'L (6-10 м²)', description: 'Комната 3 комн. кв.' },
  { value: 'XL', label: 'XL (10+ м²)', description: 'Целая квартира' },
];

const ATTRIBUTES = [
  { value: 'climate_control', label: 'Климат-контроль', icon: '❄️' },
  { value: 'access_24_7', label: 'Доступ 24/7', icon: '🕐' },
  { value: 'security', label: 'Охрана', icon: '🛡️' },
  { value: 'video_surveillance', label: 'Видеонаблюдение', icon: '📹' },
  { value: 'parking', label: 'Парковка', icon: '🅿️' },
  { value: 'elevator', label: 'Лифт', icon: '🛗' },
  { value: 'loading_area', label: 'Зона погрузки', icon: '🚛' },
];

export function FilterPanel({ className }: { className?: string }) {
  const { filters, updateFilter, clearFilters, hasActiveFilters, getActiveFiltersCount } = useFilterStore();
  const activeCount = getActiveFiltersCount();
  
  return (
    <div className={cn('space-y-6', className)}>
      {/* Заголовок */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Фильтры</h3>
        {hasActiveFilters() && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearFilters}
            className="text-primary-600"
          >
            Сбросить ({activeCount})
          </Button>
        )}
      </div>
      
      {/* Цена */}
      <div>
        <Label className="text-base font-medium mb-4 block">Цена за месяц</Label>
        <div className="space-y-4">
          <Slider
            value={[filters.price_min || 0, filters.price_max || 50000]}
            onValueChange={([min, max]) => {
              updateFilter('price_min', min > 0 ? min : undefined);
              updateFilter('price_max', max < 50000 ? max : undefined);
            }}
            min={0}
            max={50000}
            step={500}
            className="py-4"
          />
          <div className="flex justify-between text-sm text-gray-600">
            <span>{filters.price_min || 0} AED </span>
            <span>{filters.price_max || 50000} AED </span>
          </div>
        </div>
      </div>
      
      {/* Размер бокса */}
      <div>
        <Label className="text-base font-medium mb-3 block">Размер бокса</Label>
        <div className="space-y-2">
          {BOX_SIZES.map((size) => {
            const isSelected = filters.size?.includes(size.value as any);
            
            return (
              <div key={size.value} className="flex items-start space-x-2">
                <Checkbox
                  id={`size-${size.value}`}
                  checked={isSelected}
                  onCheckedChange={(checked) => {
                    const currentSizes = filters.size || [];
                    const newSizes = checked
                      ? [...currentSizes, size.value]
                      : currentSizes.filter((s) => s !== size.value);
                    updateFilter('size', newSizes.length > 0 ? newSizes : undefined);
                  }}
                />
                <div className="flex flex-col">
                  <label 
                    htmlFor={`size-${size.value}`} 
                    className="text-sm font-medium cursor-pointer"
                  >
                    {size.label}
                  </label>
                  <span className="text-xs text-gray-500">{size.description}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Атрибуты */}
      <div>
        <Label className="text-base font-medium mb-3 block">Удобства</Label>
        <div className="flex flex-wrap gap-2">
          {ATTRIBUTES.map((attr) => {
            const isSelected = filters.attributes?.includes(attr.value);
            
            return (
              <Badge
                key={attr.value}
                variant={isSelected ? 'default' : 'outline'}
                className={cn(
                  'cursor-pointer px-3 py-1.5 text-sm',
                  isSelected && 'bg-primary-600 hover:bg-primary-700'
                )}
                onClick={() => {
                  const currentAttrs = filters.attributes || [];
                  const newAttrs = isSelected
                    ? currentAttrs.filter((a) => a !== attr.value)
                    : [...currentAttrs, attr.value];
                  updateFilter('attributes', newAttrs.length > 0 ? newAttrs : undefined);
                }}
              >
                <span className="mr-1">{attr.icon}</span>
                {attr.label}
                {isSelected && <X className="ml-1 h-3 w-3" />}
              </Badge>
            );
          })}
        </div>
      </div>
      
      {/* Радиус поиска */}
      {(filters.latitude && filters.longitude) && (
        <div>
          <Label className="text-base font-medium mb-4 block">
            Радиус поиска: {filters.radius || 10} км
          </Label>
          <Slider
            value={[filters.radius || 10]}
            onValueChange={([value]) => updateFilter('radius', value)}
            min={1}
            max={50}
            step={1}
          />
        </div>
      )}
    </div>
  );
}
```


### 7.5. Layout компоненты

#### 7.5.1. Header

```typescript
// components/layout/Header.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUIStore } from '@/stores/ui-store';
import { useUser, useIsAuthenticated } from '@/stores/auth-store';
import { UserMenu } from './UserMenu';
import { MobileMenu } from './MobileMenu';
import { cn } from '@/lib/utils';

const NAVIGATION = [
  { href: '/', label: 'Главная' },
  { href: '/search', label: 'Поиск складов' },
  { href: '/about', label: 'О нас' },
  { href: '/contacts', label: 'Контакты' },
];

export function Header() {
  const pathname = usePathname();
  const isAuthenticated = useIsAuthenticated();
  const user = useUser();
  const { openMobileMenu } = useUIStore();
  
  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b bg-white">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="text-2xl font-bold text-primary-600">
                Self<span className="text-gray-900">Storage</span>
              </div>
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              {NAVIGATION.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'text-sm font-medium transition-colors hover:text-primary-600',
                    pathname === item.href
                      ? 'text-primary-600'
                      : 'text-gray-700'
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            
            {/* Actions */}
            <div className="flex items-center gap-4">
              {/* Operator/Dashboard */}
              {isAuthenticated && user?.role === 'operator' && (
                <Button variant="outline" size="sm" asChild>
                  <Link href="/operator">Кабинет оператора</Link>
                </Button>
              )}
              
              {/* Auth/User Menu */}
              {isAuthenticated ? (
                <UserMenu />
              ) : (
                <div className="hidden md:flex items-center gap-2">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/login">Войти</Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link href="/register">Регистрация</Link>
                  </Button>
                </div>
              )}
              
              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={openMobileMenu}
              >
                <Menu className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Mobile Menu */}
      <MobileMenu navigation={NAVIGATION} />
    </>
  );
}
```


### 7.6. Переиспользование компонентов

#### 7.6.1. Варианты через props

```typescript
// Один компонент - множество вариантов
<Button variant="default" size="md">Стандартная</Button>
<Button variant="outline" size="sm">Контурная</Button>
<Button variant="ghost" size="lg">Прозрачная</Button>

<WarehouseCard warehouse={data} variant="default" />
<WarehouseCard warehouse={data} variant="compact" />
```


#### 7.6.2. Расширение через composition

```typescript
// Расширяем базовый компонент
function FormInput({ 
  label, 
  error, 
  required,
  ...props 
}: InputProps & { label?: string; required?: boolean }) {
  return (
    <div className="space-y-2">
      {label && (
        <Label>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      <Input error={error} {...props} />
    </div>
  );
}

// Использование
<FormInput
  label="Email"
  required
  type="email"
  error={errors.email?.message}
  {...register('email')}
/>
```


#### 7.6.3. Render props pattern

```typescript
// Компонент с render prop
function DataList<T>({ 
  data, 
  renderItem,
  renderEmpty,
  isLoading 
}: {
  data: T[];
  renderItem: (item: T) => React.ReactNode;
  renderEmpty?: () => React.ReactNode;
  isLoading?: boolean;
}) {
  if (isLoading) return <LoadingSkeleton />;
  if (data.length === 0) return renderEmpty?.() || <EmptyState />;
  
  return (
    <div>
      {data.map((item, idx) => (
        <div key={idx}>{renderItem(item)}</div>
      ))}
    </div>
  );
}

// Использование
<DataList
  data={warehouses}
  renderItem={(warehouse) => <WarehouseCard warehouse={warehouse} />}
  renderEmpty={() => <EmptyState message="Склады не найдены" />}
  isLoading={isLoading}
/>
```


**Конец Блока 2C (Раздел 6)**

**Блок 2 ПОЛНОСТЬЮ ЗАВЕРШЕН!**








## 8. Обработка состояний загрузки и ошибок



---

### 🎯 Implementation Standards (Обязательные правила)

**Для фронтенд-разработчиков: Когда использовать какой loading indicator**

#### A) Loading State Standards

| Ситуация | Использовать | Почему | Пример |
|----------|--------------|--------|--------|
| **Initial page load** | Skeleton loader | Показывает структуру, уменьшает CLS | Список складов при первой загрузке |
| **Background refetch** | Ничего или subtle spinner | Не мешает взаимодействию | React Query background refetch |
| **User action** | Spinner + disabled state | Явная обратная связь | Кнопка "Забронировать" при клике |
| **Infinite scroll** | Spinner внизу списка | Понятно что загружается еще | "Загрузка..." внизу |
| **Form submission** | Spinner в кнопке + disabled | Предотвращает двойной submit | Кнопка "Отправить" с spinner |
| **Mutation** | Local spinner | Не блокирует весь UI | Добавление в избранное |
| **Full page transition** | Global loader | Редко, только для навигации | Переход между страницами |

**Правила использования:**

**1. Local vs Global Loading**

```typescript
// ✅ CORRECT - Local loading
function WarehouseCard({ id }) {
  const { data, isLoading } = useWarehouse(id);
  
  if (isLoading) return <WarehouseSkeleton />; // Local
  
  return <div>{data.name}</div>;
}

// ❌ WRONG - Global loading для локальной операции
function WarehouseCard({ id }) {
  const { data, isLoading } = useWarehouse(id);
  
  if (isLoading) {
    setGlobalLoading(true); // НЕ ДЕЛАТЬ!
  }
}
```

**2. Skeleton vs Spinner**

```typescript
// ✅ Use Skeleton - Initial load
const { data, isLoading, isRefetching } = useWarehouses();

if (isLoading) {
  return <WarehouseListSkeleton count={10} />;
}

if (isRefetching) {
  // Background refetch - ничего не показываем
  // или subtle indicator
}

// ✅ Use Spinner - User action
<Button
  onClick={handleSubmit}
  disabled={isPending}
>
  {isPending && <Spinner size="sm" />}
  Забронировать
</Button>
```

**3. Минимальная задержка для UX**

```typescript
// Избегаем flash of loading state для быстрых запросов
const MIN_LOADING_TIME = 300; // ms

const [showLoading, setShowLoading] = useState(false);

useEffect(() => {
  if (isLoading) {
    const timer = setTimeout(() => {
      setShowLoading(true);
    }, MIN_LOADING_TIME);
    
    return () => clearTimeout(timer);
  } else {
    setShowLoading(false);
  }
}, [isLoading]);
```

---

#### B) Error Mapping Table (API Error → UI Behavior)

**Для фронтенд-разработчиков: Что делать с каждым типом ошибки**

| HTTP Status | Error Code | Frontend Behavior | Component | Example |
|-------------|------------|-------------------|-----------|---------|
| **400** | `validation_error` | Map field_errors to form | Form inputs | Email неверного формата |
| **401** | `unauthorized` | Try refresh → redirect /login | Interceptor | Истек токен |
| **403** | `forbidden` | Show "Permission Denied" | ErrorState | Нет доступа к operator |
| **404** | `not_found` | Show "Not Found" page/state | NotFoundError | Склад не найден |
| **409** | `conflict` | Toast with message | Toast | Бокс уже забронирован |
| **422** | `validation_error` | Highlight invalid fields | Form | Некорректные данные |
| **429** | `rate_limit_exceeded` | Show "Try again in X sec" | Toast + disabled | Слишком много запросов |
| **500-599** | `internal_error` | Show retry button | ErrorState | Ошибка сервера |
| **Network Error** | - | Show "Check connection" | NetworkError | Нет интернета |

**Implementation:**

```typescript
// Error handler utility
export function handleAPIError(error: AxiosError, options?: ErrorOptions) {
  const status = error.response?.status;
  const apiError = error.response?.data as APIError;
  
  switch (status) {
    case 400:
    case 422:
      // Field errors → form
      if (apiError.error.field_errors && options?.setError) {
        Object.entries(apiError.error.field_errors).forEach(([field, messages]) => {
          options.setError(field, { message: messages[0] });
        });
      } else {
        toast.error(apiError.error.message);
      }
      break;
      
    case 401:
      // Handled by interceptor - will trigger refresh
      break;
      
    case 403:
      // No refresh - show error
      toast.error('У вас нет доступа к этому ресурсу');
      break;
      
    case 404:
      // Show not found state (handled by component)
      break;
      
    case 409:
      // Conflict - show specific message
      toast.error(apiError.error.message || 'Конфликт данных');
      break;
      
    case 429:
      // Rate limit
      const retryAfter = error.response?.headers['retry-after'] || 60;
      toast.error(`Слишком много запросов. Попробуйте через ${retryAfter} сек.`);
      break;
      
    case 500:
    case 502:
    case 503:
      // Server error - offer retry
      toast.error('Ошибка сервера. Попробуйте позже.', {
        action: {
          label: 'Повторить',
          onClick: options?.retry
        }
      });
      break;
      
    default:
      // Network error or unknown
      if (!error.response) {
        toast.error('Проверьте подключение к интернету');
      } else {
        toast.error('Произошла ошибка');
      }
  }
}

// Usage in mutation
const createBooking = useMutation({
  mutationFn: bookingsApi.create,
  onError: (error) => handleAPIError(error, { setError }),
  onSuccess: () => toast.success('Бронирование создано'),
});
```

**Checklist при обработке ошибок:**

- [ ] 400/422 с field_errors → setError() для каждого поля
- [ ] 400/422 без field_errors → toast.error()
- [ ] 401 → обрабатывается interceptor (не нужно обрабатывать вручную)
- [ ] 403 → toast.error() или ErrorState
- [ ] 404 → NotFoundError компонент
- [ ] 409 → toast.error() с сообщением
- [ ] 429 → toast.error() с retry-after
- [ ] 5xx → ErrorState с кнопкой retry
- [ ] Network → NetworkError компонент

---



---

### 🎯 Responsibility Boundary: Frontend vs Backend

**Critical: Frontend does NOT implement business logic**

| Aspect | Frontend Responsibility | Backend Responsibility |
|--------|-------------------------|------------------------|
| **Error Display** | Show error based on `error_code`, `message`, HTTP status | Define error_code, message, business rules |
| **Validation** | Client-side UX validation (email format, required fields) | Authoritative validation, return `field_errors` |
| **Retry Logic** | User-triggered retry button; transient network retries | Idempotency, duplicate prevention |
| **Business Rules** | Display data as received | Enforce booking rules, availability, pricing |
| **Loading States** | Show skeleton/spinner based on query state | N/A |

**Rules:**

1. **Frontend displays errors, does NOT interpret them:**
   ```typescript
   // ✅ CORRECT - display API message as-is
   toast.error(apiError.error.message);
   
   // ❌ WRONG - frontend decides business logic
   if (error.code === 'box_unavailable') {
     toast.error('This box is no longer available'); // Don't assume
   }
   ```

2. **Retry behavior:**
   - **Transient network errors:** React Query retries automatically (3x with backoff)
   - **User retry button:** Re-sends identical request, no modification
   - **Business errors (409, 422):** No automatic retry, user must change input

3. **Validation:**
   - Client-side: UX only (instant feedback)
   - Server-side: Source of truth (final decision)
   - Always map `field_errors` from API to form:
     ```typescript
     if (apiError.error.field_errors) {
       Object.entries(apiError.error.field_errors).forEach(([field, messages]) => {
         setError(field, { message: messages[0] });
       });
     }
     ```

**Conflict resolution:** If frontend validation passes but backend rejects, backend wins. Display backend error.

**This aligns with:** Error Handling & Fault Tolerance Specification, API Design Blueprint.

---

### 8.1. Loading States

#### 8.1.1. Стратегия отображения загрузки

**Типы loading состояний:**

1. **Initial Loading** — первая загрузка страницы
2. **Background Refetch** — обновление данных в фоне
3. **Pagination Loading** — загрузка новой страницы
4. **Mutation Loading** — выполнение действия
5. **Optimistic Update** — мгновенное обновление UI

**Принципы:**

- Показываем loading только при первой загрузке
- Background refetch — тонкий индикатор или ничего
- Skeleton loaders для контента
- Spinner для быстрых действий (< 2 секунд)
- Progress bar для длительных операций (> 2 секунд)


#### 8.1.2. Skeleton Loaders

**Базовый Skeleton компонент:**

```typescript
// components/shared/Skeleton.tsx
import { cn } from '@/lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
}

export function Skeleton({ 
  className, 
  variant = 'rectangular',
  width,
  height,
  ...props 
}: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse bg-gray-200',
        variant === 'text' && 'rounded h-4',
        variant === 'circular' && 'rounded-full',
        variant === 'rectangular' && 'rounded-lg',
        className
      )}
      style={{ width, height }}
      {...props}
    />
  );
}
```

**WarehouseCard Skeleton:**

```typescript
// modules/warehouses/components/WarehouseCardSkeleton.tsx
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/shared/Skeleton';

export function WarehouseCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      {/* Изображение */}
      <Skeleton className="h-48 w-full rounded-none" />
      
      <CardContent className="p-4 space-y-4">
        {/* Название */}
        <Skeleton className="h-6 w-3/4" />
        
        {/* Адрес */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        
        {/* Рейтинг */}
        <div className="flex items-center gap-2">
          <Skeleton variant="circular" width={16} height={16} />
          <Skeleton className="h-4 w-20" />
        </div>
        
        {/* Цена */}
        <div className="flex items-center justify-between pt-4 border-t">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-9 w-24" />
        </div>
      </CardContent>
    </Card>
  );
}

// Список скелетонов
export function WarehouseListSkeleton({ count = 9 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, idx) => (
        <WarehouseCardSkeleton key={idx} />
      ))}
    </div>
  );
}
```

**Использование в компонентах:**

```typescript
// app/search/page.tsx
function SearchPage() {
  const filters = useFilters();
  const { data, isLoading, isFetching } = useWarehouses(filters);
  
  return (
    <div>
      {isLoading ? (
        <WarehouseListSkeleton />
      ) : (
        <>
          <WarehouseList warehouses={data?.data || []} />
          {isFetching && !isLoading && (
            <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-3">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
          )}
        </>
      )}
    </div>
  );
}
```


#### 8.1.3. Loading Spinners

**Универсальный LoadingSpinner:**

```typescript
// components/shared/LoadingSpinner.tsx
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
}

export function LoadingSpinner({ size = 'md', className, text }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };
  
  return (
    <div className={cn('flex flex-col items-center justify-center gap-2', className)}>
      <Loader2 className={cn('animate-spin text-primary-600', sizeClasses[size])} />
      {text && <p className="text-sm text-gray-600">{text}</p>}
    </div>
  );
}

// Полноэкранный loading
export function FullPageLoader({ text = 'Загрузка...' }: { text?: string }) {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
      <LoadingSpinner size="lg" text={text} />
    </div>
  );
}
```


#### 8.1.4. Progress Bars

**Для длительных операций:**

```typescript
// components/shared/ProgressBar.tsx
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  progress: number; // 0-100
  showLabel?: boolean;
  className?: string;
}

export function ProgressBar({ progress, showLabel = true, className }: ProgressBarProps) {
  return (
    <div className={cn('w-full', className)}>
      <div className="flex justify-between items-center mb-2">
        {showLabel && (
          <span className="text-sm font-medium text-gray-700">
            Загрузка...
          </span>
        )}
        <span className="text-sm text-gray-600">{progress}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-primary-600 h-2.5 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

// Компонент для загрузки файлов
export function FileUploadProgress({ fileName, progress }: any) {
  return (
    <div className="p-4 bg-white rounded-lg shadow border">
      <div className="flex items-center gap-3 mb-2">
        <FileText className="h-5 w-5 text-gray-400" />
        <span className="text-sm font-medium truncate flex-1">{fileName}</span>
      </div>
      <ProgressBar progress={progress} showLabel={false} />
    </div>
  );
}
```


#### 8.1.5. React Suspense

**Использование с Next.js:**

```typescript
// app/warehouses/[id]/page.tsx
import { Suspense } from 'react';
import { WarehouseDetails } from '@/modules/warehouses/components/WarehouseDetails';
import { WarehouseDetailsSkeleton } from '@/modules/warehouses/components/WarehouseDetailsSkeleton';

export default function WarehousePage({ params }: { params: { id: string } }) {
  return (
    <div>
      <Suspense fallback={<WarehouseDetailsSkeleton />}>
        <WarehouseDetails id={Number(params.id)} />
      </Suspense>
    </div>
  );
}
```

**Streaming SSR с loading.tsx:**

```typescript
// app/search/loading.tsx
import { WarehouseListSkeleton } from '@/modules/warehouses/components/WarehouseCardSkeleton';

export default function SearchLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex gap-6">
        <aside className="w-80">
          <div className="space-y-6">
            <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
            <div className="h-64 bg-gray-200 rounded animate-pulse" />
          </div>
        </aside>
        <main className="flex-1">
          <WarehouseListSkeleton />
        </main>
      </div>
    </div>
  );
}
```


### 8.2. Error States

#### 8.2.1. Error Boundary

**Базовый Error Boundary:**

```typescript
// components/shared/ErrorBoundary.tsx
'use client';

import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }
  
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
          <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Что-то пошло не так</h2>
          <p className="text-gray-600 mb-6 text-center max-w-md">
            Произошла ошибка при загрузке этой части приложения.
          </p>
          <div className="flex gap-3">
            <Button onClick={() => this.setState({ hasError: false, error: null })}>
              Попробовать снова
            </Button>
            <Button variant="outline" onClick={() => window.location.href = '/'}>
              На главную
            </Button>
          </div>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <pre className="mt-6 p-4 bg-gray-100 rounded text-xs overflow-auto max-w-2xl">
              {this.state.error.toString()}
            </pre>
          )}
        </div>
      );
    }
    
    return this.props.children;
  }
}
```

**Next.js error.tsx:**

```typescript
// app/error.tsx
'use client';

import { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Global error:', error);
  }, [error]);
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <AlertTriangle className="h-16 w-16 text-red-500 mb-6" />
      <h1 className="text-3xl font-bold mb-2">Ошибка</h1>
      <p className="text-gray-600 mb-8 text-center max-w-md">
        Произошла непредвиденная ошибка. Мы уже работаем над её исправлением.
      </p>
      <div className="flex gap-3">
        <Button onClick={reset}>Попробовать снова</Button>
        <Button variant="outline" onClick={() => window.location.href = '/'}>
          На главную
        </Button>
      </div>
      {process.env.NODE_ENV === 'development' && (
        <pre className="mt-8 p-4 bg-gray-100 rounded text-xs overflow-auto max-w-2xl">
          {error.message}
        </pre>
      )}
    </div>
  );
}
```


#### 8.2.2. Error State Components

**ErrorState компонент:**

```typescript
// components/shared/ErrorState.tsx
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  showHomeButton?: boolean;
  className?: string;
}

export function ErrorState({
  title = 'Ошибка загрузки',
  message = 'Не удалось загрузить данные. Попробуйте обновить страницу.',
  onRetry,
  showHomeButton = false,
  className,
}: ErrorStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center p-8 text-center', className)}>
      <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 mb-6 max-w-md">{message}</p>
      <div className="flex gap-3">
        {onRetry && (
          <Button onClick={onRetry}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Повторить попытку
          </Button>
        )}
        {showHomeButton && (
          <Button variant="outline" onClick={() => window.location.href = '/'}>
            <Home className="h-4 w-4 mr-2" />
            На главную
          </Button>
        )}
      </div>
    </div>
  );
}
```


#### 8.2.3. Empty States

**EmptyState компонент:**

```typescript
// components/shared/EmptyState.tsx
import { PackageOpen, Search, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon?: 'package' | 'search' | 'heart';
  title: string;
  message?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

const ICONS = {
  package: PackageOpen,
  search: Search,
  heart: Heart,
};

export function EmptyState({
  icon = 'package',
  title,
  message,
  action,
  className,
}: EmptyStateProps) {
  const Icon = ICONS[icon];
  
  return (
    <div className={cn('flex flex-col items-center justify-center p-12 text-center', className)}>
      <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        <Icon className="h-10 w-10 text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      {message && <p className="text-gray-600 mb-6 max-w-md">{message}</p>}
      {action && (
        <Button onClick={action.onClick}>{action.label}</Button>
      )}
    </div>
  );
}
```


## 9. SEO оптимизация



---

### 🎯 SEO Ownership Matrix (MVP v1)

**Для фронтенд-разработчиков: Какие страницы ОБЯЗАНЫ иметь SEO в MVP**

| Page | SEO Required | Responsibility | Implementation Level | Reason |
|------|--------------|----------------|---------------------|--------|
| **/ (Home)** | ✅ YES | Page (`page.tsx`) | Metadata + Schema.org | Главная точка входа |
| **/search** | ✅ YES | Page (`page.tsx`) | Metadata + Canonical | Поисковая выдача складов |
| **/warehouses/[id]** | ✅ YES | Page (`page.tsx`) | Full SEO (Metadata + Schema + OG) | Карточка товара |
| **/about** | ✅ YES | Page (`page.tsx`) | Metadata | Статический контент |
| **/contacts** | ✅ YES | Page (`page.tsx`) | Metadata | Контакты компании |
| **/faq** | ✅ YES | Page (`page.tsx`) | Metadata | FAQ |
| **/terms** | ⚠️ MINIMAL | Page (`page.tsx`) | Basic metadata | Юридическая страница |
| **/privacy** | ⚠️ MINIMAL | Page (`page.tsx`) | Basic metadata | Юридическая страница |
| **/dashboard** | ❌ NO | - | robots: noindex | Личный кабинет |
| **/operator/** | ❌ NO | - | robots: noindex | Приватная зона |
| **/login** | ❌ NO | - | robots: noindex | Auth страница |

**Implementation Rules:**

**1. Full SEO (Critical pages: /, /search, /warehouses/[id])**

```typescript
// app/warehouses/[id]/page.tsx
export async function generateMetadata({ params }): Promise<Metadata> {
  const warehouse = await getWarehouse(params.id);
  
  return {
    title: `${warehouse.name} - Аренда склада в ${warehouse.city}`,
    description: warehouse.description.substring(0, 160),
    openGraph: {
      title: warehouse.name,
      description: warehouse.description,
      images: [{ url: warehouse.photos[0] }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: warehouse.name,
      description: warehouse.description,
      images: [warehouse.photos[0]],
    },
    alternates: {
      canonical: `https://storagecompare.ae/warehouses/${params.id}`,
    },
  };
}

// Include Schema.org JSON-LD
export default function WarehousePage({ params }) {
  const warehouse = await getWarehouse(params.id);
  
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "SelfStorage",
    "name": warehouse.name,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": warehouse.city,
      "streetAddress": warehouse.address
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": warehouse.latitude,
      "longitude": warehouse.longitude
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": warehouse.rating,
      "reviewCount": warehouse.reviewCount
    }
  };
  
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
      {/* Page content */}
    </>
  );
}
```

**2. Minimal SEO (Static pages: /about, /terms)**

```typescript
// app/about/page.tsx
export const metadata: Metadata = {
  title: 'О нас - SelfStorage',
  description: 'Агрегатор складов самостоятельного хранения',
  robots: {
    index: true,
    follow: true,
  },
};
```

**3. No SEO (Private pages: /dashboard, /operator)**

```typescript
// app/dashboard/layout.tsx
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};
```

**Responsibility Levels:**

**Page-level responsibility:**
- Each `page.tsx` defines its own `metadata` or `generateMetadata`
- Schema.org JSON-LD included in page component
- Canonical URLs set per page

**Layout-level responsibility:**
- Root layout (`app/layout.tsx`) sets default metadata
- Section layouts can override (e.g., `/dashboard/layout.tsx` sets noindex)

**Mandatory for MVP:**

| SEO Element | Required Pages | Optional Pages |
|-------------|----------------|----------------|
| **Title** | All public pages | All pages |
| **Description** | /, /search, /warehouses/[id] | /about, /contacts |
| **Open Graph** | /warehouses/[id] | /, /search |
| **Twitter Card** | /warehouses/[id] | - |
| **Schema.org** | /warehouses/[id] | /, /search |
| **Canonical URL** | /warehouses/[id], /search | All public |
| **robots.txt** | Generated for all | - |
| **sitemap.xml** | Generated for all public | - |

**Checklist for SEO implementation:**

- [ ] Home page: Metadata + basic Schema.org
- [ ] Search page: Metadata + canonical (handles filters)
- [ ] Warehouse detail: Full SEO (Metadata + OG + Schema)
- [ ] Static pages: Basic metadata
- [ ] Private pages: robots noindex
- [ ] sitemap.xml generated
- [ ] robots.txt generated

---



**MVP Must-Have vs Optional (LOCKED):**

| Page | MVP Requirement | Consequences if Missing |
|------|-----------------|-------------------------|
| **/ (Home)** | MUST HAVE | No organic traffic, failed launch |
| **/search** | MUST HAVE | No warehouse discovery via search |
| **/warehouses/[id]** | MUST HAVE | Individual warehouses not indexed |
| **/about** | OPTIONAL | Low priority, can add post-MVP |
| **/contacts** | OPTIONAL | Direct access only |
| **/terms, /privacy** | MINIMAL | Basic metadata sufficient |

**Search Results with Filters:**
- Behavior: Server-renders content, but uses `canonical` to `/search` (no params)
- Why: Prevent duplicate content for `/search?city=Moscow` vs `/search?city=SPB`
- Implementation:
  ```typescript
  export const metadata: Metadata = {
    alternates: {
      canonical: 'https://storagecompare.ae/search'
    }
  };
  ```

**noindex Pages (MUST set in MVP):**
- `/dashboard/*` - Private user area
- `/operator/*` - Private operator area  
- `/login`, `/register` - No SEO value

Failing to set `noindex` on private pages risks exposing sensitive URLs.

**Priority for MVP Launch:**
1. ✅ Homepage SEO (title, description, OG, Schema.org)
2. ✅ Warehouse details SEO (full SEO + structured data)
3. ✅ Search results SEO (with canonical)
4. ✅ noindex on private pages
5. ⚠️ Static pages (optional, can be basic)

---

### 9.1. Metadata API (Next.js 14)

#### 9.1.1. Статические метаданные

```typescript
// app/page.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Self-Storage — Аренда складов и боксов для хранения вещей',
  description: 'Найдите и забронируйте склад для хранения вещей рядом с вами. Безопасное хранение, гибкие условия, доступные цены.',
  keywords: ['аренда склада', 'хранение вещей', 'self storage', 'бокс для хранения'],
  
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: 'https://storagecompare.ae',
    title: 'Self-Storage — Аренда складов для хранения вещей',
    description: 'Найдите и забронируйте склад для хранения вещей рядом с вами',
    siteName: 'Self-Storage',
    images: [
      {
        url: 'https://storagecompare.ae/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Self-Storage',
      },
    ],
  },
  
  twitter: {
    card: 'summary_large_image',
    title: 'Self-Storage — Аренда складов для хранения вещей',
    description: 'Найдите и забронируйте склад для хранения вещей рядом с вами',
    images: ['https://storagecompare.ae/twitter-image.jpg'],
  },
  
  robots: {
    index: true,
    follow: true,
  },
};
```


#### 9.1.2. Динамические метаданные

```typescript
// app/warehouses/[id]/page.tsx
import type { Metadata } from 'next';
import { warehousesApi } from '@/lib/api/warehouses-api';

export async function generateMetadata({ 
  params 
}: { 
  params: { id: string } 
}): Promise<Metadata> {
  const warehouse = await warehousesApi.getById(Number(params.id));
  
  return {
    title: `${warehouse.name} — Аренда склада в ${warehouse.address.city}`,
    description: `Аренда бокса для хранения вещей на складе "${warehouse.name}". ${warehouse.address.full_address}. Цены от ${warehouse.price_from} AED /мес.`,
    
    openGraph: {
      title: warehouse.name,
      description: `Аренда бокса для хранения на складе в ${warehouse.address.city}`,
      images: warehouse.photos.map(photo => ({
        url: photo.url,
        width: 1200,
        height: 630,
        alt: warehouse.name,
      })),
    },
    
    alternates: {
      canonical: `https://storagecompare.ae/warehouses/${warehouse.id}`,
    },
  };
}
```


### 9.2. Structured Data (Schema.org)

```typescript
// lib/seo/structured-data.ts
export function generateWarehouseStructuredData(warehouse: Warehouse) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SelfStorage',
    name: warehouse.name,
    description: warehouse.description,
    image: warehouse.photos.map(p => p.url),
    
    address: {
      '@type': 'PostalAddress',
      streetAddress: warehouse.address.street,
      addressLocality: warehouse.address.city,
      addressRegion: warehouse.address.district,
      postalCode: warehouse.address.postal_code,
      addressCountry: 'RU',
    },
    
    geo: {
      '@type': 'GeoCoordinates',
      latitude: warehouse.latitude,
      longitude: warehouse.longitude,
    },
    
    aggregateRating: warehouse.reviews_count > 0 ? {
      '@type': 'AggregateRating',
      ratingValue: warehouse.rating,
      reviewCount: warehouse.reviews_count,
    } : undefined,
  };
}
```


### 9.3. Sitemap

```typescript
// app/sitemap.ts
import type { MetadataRoute } from 'next';
import { warehousesApi } from '@/lib/api/warehouses-api';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://storagecompare.ae';
  
  // Статические страницы
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
  ];
  
  // Динамические страницы складов
  const warehouses = await warehousesApi.getAll();
  const warehousePages = warehouses.map((warehouse) => ({
    url: `${baseUrl}/warehouses/${warehouse.id}`,
    lastModified: new Date(warehouse.updated_at),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));
  
  return [...staticPages, ...warehousePages];
}
```


### 9.4. Robots.txt

```typescript
// app/robots.ts
import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/dashboard/', '/operator/', '/admin/'],
      },
    ],
    sitemap: 'https://storagecompare.ae/sitemap.xml',
  };
}
```


## 10. Доступность (Accessibility)

### 10.1. WCAG 2.1 AA Compliance

**Основные требования:**

1. **Perceivable** — информация доступна для восприятия
2. **Operable** — интерфейс работает с клавиатуры
3. **Understandable** — информация понятна
4. **Robust** — совместимость с assistive technologies


### 10.2. Keyboard Navigation

```typescript
// components/shared/FocusTrap.tsx
export function FocusTrap({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    const focusableElements = container.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
    
    firstElement?.focus();
    
    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };
    
    container.addEventListener('keydown', handleTab);
    return () => container.removeEventListener('keydown', handleTab);
  }, []);
  
  return <div ref={containerRef}>{children}</div>;
}
```


### 10.3. ARIA Attributes

```typescript
// Доступная кнопка
<button
  aria-label="Добавить в избранное"
  aria-pressed={isFavorite}
  onClick={handleToggleFavorite}
>
  <Heart className={isFavorite ? 'fill-red-500' : ''} />
</button>

// Live region для динамических обновлений
<div aria-live="polite" aria-atomic="true">
  {searchResults.length} складов найдено
</div>

// Модальное окно
<Dialog
  aria-labelledby="dialog-title"
  aria-describedby="dialog-description"
  role="dialog"
  aria-modal="true"
>
  <DialogTitle id="dialog-title">Заголовок</DialogTitle>
  <DialogDescription id="dialog-description">
    Описание
  </DialogDescription>
</Dialog>
```


### 10.4. Screen Reader Support

```typescript
// Визуально скрытый текст
export function VisuallyHidden({ children }: { children: React.ReactNode }) {
  return (
    <span className="sr-only">
      {children}
    </span>
  );
}

// Использование
<button aria-label="Закрыть">
  <X className="h-5 w-5" aria-hidden="true" />
  <VisuallyHidden>Закрыть</VisuallyHidden>
</button>
```


### 10.5. Цветовой контраст

```typescript
// Минимальные требования WCAG AA:
// - Обычный текст: 4.5:1
// - Крупный текст (18pt+): 3:1
// - UI компоненты: 3:1

// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          600: '#0284c7',  // Контраст с белым: 4.5:1
        },
      },
    },
  },
};
```


**Конец Блока 3 (Разделы 7-9)**








## 11. Оптимизация производительности

### 11.1. Code Splitting & Lazy Loading

#### 11.1.1. Route-based Code Splitting

**Автоматическое в Next.js App Router:**

Next.js автоматически разбивает код по маршрутам:

```typescript
// Каждая страница - отдельный chunk
app/
├── page.tsx                    // chunk: page
├── search/page.tsx             // chunk: search
├── warehouses/[id]/page.tsx    // chunk: warehouses-[id]
└── dashboard/page.tsx          // chunk: dashboard
```


#### 11.1.2. Component-based Lazy Loading

**React.lazy для тяжелых компонентов:**

```typescript
// Lazy loading карты (тяжелая библиотека)
import { lazy, Suspense } from 'react';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

const WarehouseMap = lazy(() => import('@/modules/map/components/WarehouseMap'));

function SearchPage() {
  return (
    <div>
      <Suspense fallback={<LoadingSpinner />}>
        <WarehouseMap warehouses={warehouses} />
      </Suspense>
    </div>
  );
}
```

**Dynamic imports для условного рендеринга:**

```typescript
// Загружаем компонент только когда он нужен
import dynamic from 'next/dynamic';

// Модалка загружается только при открытии
const BookingModal = dynamic(
  () => import('@/modules/bookings/components/BookingModal'),
  {
    loading: () => <LoadingSpinner />,
    ssr: false, // Не рендерить на сервере
  }
);

function WarehouseDetails() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  return (
    <div>
      <Button onClick={() => setIsModalOpen(true)}>
        Забронировать
      </Button>
      
      {isModalOpen && (
        <BookingModal onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
}
```

**Lazy loading для роутов по ролям:**

```typescript
// Оператор дашборд загружается только для операторов
import dynamic from 'next/dynamic';

const OperatorDashboard = dynamic(
  () => import('@/modules/operator/components/OperatorDashboard'),
  { ssr: false }
);

const UserDashboard = dynamic(
  () => import('@/modules/user/components/UserDashboard'),
  { ssr: false }
);

function DashboardPage() {
  const userRole = useUserRole();
  
  if (userRole === 'operator') {
    return <OperatorDashboard />;
  }
  
  return <UserDashboard />;
}
```


#### 11.1.3. Preloading критичных ресурсов

```typescript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/',
        headers: [
          {
            key: 'Link',
            value: '</fonts/inter.woff2>; rel=preload; as=font; crossorigin=anonymous',
          },
        ],
      },
    ];
  },
};
```

**Prefetch для навигации:**

```typescript
// Автоматический prefetch в Next.js Link
<Link href="/warehouses/123" prefetch={true}>
  Посмотреть склад
</Link>

// Программный prefetch
import { useRouter } from 'next/navigation';

function WarehouseCard({ warehouse }) {
  const router = useRouter();
  
  const handleMouseEnter = () => {
    router.prefetch(`/warehouses/${warehouse.id}`);
  };
  
  return (
    <div onMouseEnter={handleMouseEnter}>
      {/* ... */}
    </div>
  );
}
```


### 11.2. Image Optimization

#### 11.2.1. Next.js Image Component

```typescript
// components/OptimizedImage.tsx
import Image from 'next/image';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  priority?: boolean;
  className?: string;
  sizes?: string;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  fill = false,
  priority = false,
  className,
  sizes,
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  
  return (
    <div className={cn('relative overflow-hidden', className)}>
      <Image
        src={hasError ? '/placeholder-warehouse.jpg' : src}
        alt={alt}
        width={width}
        height={height}
        fill={fill}
        priority={priority}
        sizes={sizes}
        quality={85}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setHasError(true);
          setIsLoading(false);
        }}
        className={cn(
          'duration-700 ease-in-out',
          isLoading ? 'scale-110 blur-2xl grayscale' : 'scale-100 blur-0 grayscale-0'
        )}
      />
      
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
    </div>
  );
}
```

**Использование:**

```typescript
// Фиксированные размеры
<OptimizedImage
  src={warehouse.photos[0]?.url}
  alt={warehouse.name}
  width={400}
  height={300}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>

// Fill контейнер
<div className="relative h-48 w-full">
  <OptimizedImage
    src={warehouse.photos[0]?.url}
    alt={warehouse.name}
    fill
    sizes="100vw"
  />
</div>

// Priority для LCP (Largest Contentful Paint)
<OptimizedImage
  src={heroImage}
  alt="Hero"
  width={1200}
  height={600}
  priority
/>
```


#### 11.2.2. Responsive Images

```typescript
// Адаптивные размеры для разных устройств
<OptimizedImage
  src={warehouse.image}
  alt={warehouse.name}
  width={800}
  height={600}
  sizes="(max-width: 640px) 100vw, 
         (max-width: 768px) 50vw, 
         (max-width: 1024px) 33vw, 
         25vw"
/>

// Next.js автоматически генерирует srcSet:
// image.jpg?w=640
// image.jpg?w=750
// image.jpg?w=828
// image.jpg?w=1080
// image.jpg?w=1200
// image.jpg?w=1920
// image.jpg?w=2048
// image.jpg?w=3840
```


#### 11.2.3. Image Gallery с Lazy Loading

```typescript
// components/ImageGallery.tsx
function ImageGallery({ images }: { images: string[] }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  return (
    <div>
      {/* Главное изображение - priority */}
      <div className="relative h-96">
        <OptimizedImage
          src={images[selectedIndex]}
          alt={`Изображение ${selectedIndex + 1}`}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
      
      {/* Thumbnails - lazy loading */}
      <div className="flex gap-2 mt-4 overflow-x-auto">
        {images.map((image, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedIndex(idx)}
            className={cn(
              'relative w-20 h-20 shrink-0',
              idx === selectedIndex && 'ring-2 ring-primary-600'
            )}
          >
            <OptimizedImage
              src={image}
              alt={`Thumbnail ${idx + 1}`}
              fill
              sizes="80px"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
```


### 11.3. Bundle Optimization

#### 11.3.1. Bundle Analyzer

```bash
npm install @next/bundle-analyzer
```

```javascript
// next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  // ... other config
});
```

```json
// package.json
{
  "scripts": {
    "analyze": "ANALYZE=true next build"
  }
}
```


#### 11.3.2. Tree Shaking

**Правильный импорт иконок:**

```typescript
// ❌ ПЛОХО - импортирует весь пакет
import * as Icons from 'lucide-react';

// ✅ ХОРОШО - импортирует только нужные иконки
import { Search, Heart, MapPin } from 'lucide-react';

// ❌ ПЛОХО - импортирует весь lodash
import _ from 'lodash';
const result = _.debounce(fn, 300);

// ✅ ХОРОШО - импортирует только нужную функцию
import debounce from 'lodash/debounce';
const result = debounce(fn, 300);
```


#### 11.3.3. Оптимизация зависимостей

```javascript
// next.config.js
module.exports = {
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
    ],
  },
  
  // Минимизация CSS
  swcMinify: true,
  
  // Компрессия
  compress: true,
};
```


### 11.4. Performance Monitoring

#### 11.4.1. Web Vitals

```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
```

**Кастомный Web Vitals репортинг:**

```typescript
// lib/web-vitals.ts
import { onCLS, onFID, onFCP, onLCP, onTTFB } from 'web-vitals';

function sendToAnalytics(metric: any) {
  // Отправка в аналитику
  if (process.env.NODE_ENV === 'production') {
    fetch('/api/analytics', {
      method: 'POST',
      body: JSON.stringify(metric),
      headers: { 'Content-Type': 'application/json' },
    });
  }
  
  // Логирование в development
  console.log(metric);
}

export function reportWebVitals() {
  onCLS(sendToAnalytics);
  onFID(sendToAnalytics);
  onFCP(sendToAnalytics);
  onLCP(sendToAnalytics);
  onTTFB(sendToAnalytics);
}

// В _app.tsx или layout.tsx
useEffect(() => {
  reportWebVitals();
}, []);
```


#### 11.4.2. Performance Budgets

```javascript
// next.config.js
module.exports = {
  // Warning при превышении размеров
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  
  // Webpack bundle size limits
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.performance = {
        maxAssetSize: 244000, // 244KB
        maxEntrypointSize: 244000,
        hints: 'warning',
      };
    }
    return config;
  },
};
```


### 11.5. Мемоизация и оптимизация ре-рендеров

#### 11.5.1. React.memo

```typescript
// components/WarehouseCard.tsx
import { memo } from 'react';

export const WarehouseCard = memo(function WarehouseCard({ 
  warehouse 
}: { 
  warehouse: Warehouse 
}) {
  return <div>{/* ... */}</div>;
}, (prevProps, nextProps) => {
  // Кастомное сравнение - ре-рендер только если изменился id
  return prevProps.warehouse.id === nextProps.warehouse.id;
});
```


#### 11.5.2. useMemo и useCallback

```typescript
function SearchPage() {
  const filters = useFilters();
  const { data: warehouses } = useWarehouses(filters);
  
  // Мемоизация тяжелых вычислений
  const sortedWarehouses = useMemo(() => {
    if (!warehouses) return [];
    
    return [...warehouses].sort((a, b) => {
      if (filters.sort === 'price') {
        return filters.order === 'asc' 
          ? a.price_from - b.price_from
          : b.price_from - a.price_from;
      }
      
      if (filters.sort === 'rating') {
        return filters.order === 'asc'
          ? a.rating - b.rating
          : b.rating - a.rating;
      }
      
      return 0;
    });
  }, [warehouses, filters.sort, filters.order]);
  
  // Мемоизация колбэков
  const handleWarehouseClick = useCallback((id: number) => {
    router.push(`/warehouses/${id}`);
  }, [router]);
  
  return (
    <div>
      {sortedWarehouses.map((warehouse) => (
        <WarehouseCard
          key={warehouse.id}
          warehouse={warehouse}
          onClick={handleWarehouseClick}
        />
      ))}
    </div>
  );
}
```


#### 11.5.3. Виртуализация длинных списков

```typescript
// Для очень длинных списков используем react-window
import { FixedSizeList } from 'react-window';

function VirtualWarehouseList({ warehouses }: { warehouses: Warehouse[] }) {
  const Row = ({ index, style }: any) => (
    <div style={style}>
      <WarehouseCard warehouse={warehouses[index]} />
    </div>
  );
  
  return (
    <FixedSizeList
      height={800}
      itemCount={warehouses.length}
      itemSize={350}
      width="100%"
    >
      {Row}
    </FixedSizeList>
  );
}
```


### 11.6. Оптимизация шрифтов

```typescript
// app/layout.tsx
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  variable: '--font-inter',
  weight: ['400', '500', '600', '700'],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={inter.variable}>
      <body className="font-sans">
        {children}
      </body>
    </html>
  );
}
```


### 11.7. Middleware для Performance

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  // Cache-Control headers
  if (request.nextUrl.pathname.startsWith('/api/')) {
    response.headers.set('Cache-Control', 'no-store');
  } else if (request.nextUrl.pathname.match(/\.(jpg|jpeg|png|webp|svg|ico)$/)) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  }
  
  // Security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  
  return response;
}
```


## 12. Интеграция с картами



---

### 🎯 Map Lifecycle Rules (Client-Only Behavior)

**Для фронтенд-разработчиков: Критические правила работы с картами**

#### A) Client-Only Rendering (ОБЯЗАТЕЛЬНО)

**Проблема:** Google Maps требует `window` и `document` → ошибка при SSR

**Решение: Dynamic import с ssr: false**

```typescript
// ✅ CORRECT - Client-only map
import dynamic from 'next/dynamic';

const InteractiveWarehouseMap = dynamic(
  () => import('@/components/map/InteractiveWarehouseMap'),
  {
    ssr: false,  // КРИТИЧЕСКИ ВАЖНО
    loading: () => <MapSkeleton />
  }
);

// Usage
export default function SearchPage() {
  return (
    <div>
      <SearchFilters />
      <InteractiveWarehouseMap warehouses={warehouses} />
    </div>
  );
}

// ❌ WRONG - SSR попытается отрендерить карту
import { InteractiveWarehouseMap } from '@/components/map';
// Вызовет ошибку: "window is not defined"
```

**Все map-компоненты ОБЯЗАНЫ:**
- Импортироваться через `dynamic` с `ssr: false`
- Иметь `loading` fallback
- Проверять `typeof window !== 'undefined'` внутри useEffect

---

#### B) Mount/Unmount Rules

**Lifecycle:**

```typescript
function InteractiveWarehouseMap({ warehouses }) {
  const [mapInstance, setMapInstance] = useState(null);
  
  // 1. Mount - create map
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const map = new ymaps.Map('map-container', {
      center: [55.751244, 37.618423],
      zoom: 10,
    });
    
    setMapInstance(map);
    
    // 2. Unmount - destroy map
    return () => {
      if (map) {
        map.destroy();  // ОБЯЗАТЕЛЬНО - prevents memory leaks
        setMapInstance(null);
      }
    };
  }, []); // Empty deps - mount once
  
  // 3. Update markers on data change
  useEffect(() => {
    if (!mapInstance || !warehouses) return;
    
    // Clear old markers
    mapInstance.geoObjects.removeAll();
    
    // Add new markers
    warehouses.forEach(warehouse => {
      const marker = new ymaps.Placemark([warehouse.lat, warehouse.lng]);
      mapInstance.geoObjects.add(marker);
    });
  }, [mapInstance, warehouses]);
  
  return <div id="map-container" style={{ width: '100%', height: '500px' }} />;
}
```

**Critical rules:**

1. **Always destroy on unmount** - `map.destroy()` prevents memory leaks
2. **Single map instance** - Don't recreate map on every render
3. **Separate data updates** - Update markers in separate useEffect from map creation

---

#### C) Behavior on Filter Changes

**Flow:**

```
User changes filters
  ↓
URL updates (?city=Moscow)
  ↓
React Query refetches warehouses
  ↓
warehouses prop updates
  ↓
useEffect triggers marker update
  ↓
Map re-centers (optional)
```

**Implementation:**

```typescript
function InteractiveWarehouseMap({ warehouses, center }) {
  const [mapInstance, setMapInstance] = useState(null);
  
  // Update markers on warehouse change
  useEffect(() => {
    if (!mapInstance || !warehouses) return;
    
    // Debounce if needed
    const timer = setTimeout(() => {
      updateMarkers(mapInstance, warehouses);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [mapInstance, warehouses]);
  
  // Re-center on center change
  useEffect(() => {
    if (!mapInstance || !center) return;
    
    mapInstance.setCenter(center, 12, {
      duration: 300,  // Smooth animation
    });
  }, [mapInstance, center]);
  
  return <div id="map-container" />;
}

function updateMarkers(map, warehouses) {
  // Clear old
  map.geoObjects.removeAll();
  
  // Add new
  warehouses.forEach(warehouse => {
    const marker = new ymaps.Placemark(
      [warehouse.latitude, warehouse.longitude],
      {
        balloonContent: `
          <strong>${warehouse.name}</strong><br>
          ${warehouse.address}<br>
          от ${warehouse.min_price} AED /мес
        `
      }
    );
    
    map.geoObjects.add(marker);
  });
}
```

**Debouncing rules:**

| Event | Debounce | Reason |
|-------|----------|--------|
| Filter change | 300ms | Avoid too many API calls |
| Map bounds change | 500ms | Avoid search-as-you-move spam |
| Marker update | 300ms | Smooth UX |

---

#### D) Error and Fallback Handling

**Scenarios:**

| Error | Frontend Behavior | Component |
|-------|-------------------|-----------|
| **Google Maps script fails to load** | Show fallback map or static image | MapLoadError |
| **Invalid coordinates** | Show error, use default center | Toast + default center |
| **Geolocation denied** | Show info, don't block map | Toast |
| **Network timeout** | Retry or show cached map | Retry button |

**Implementation:**

```typescript
function GoogleMapProvider({ children }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  
  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/2.1/?apikey=${API_KEY}&lang=ru_RU`;
    script.async = true;
    
    script.onload = () => {
      ymaps.ready(() => {
        setIsLoaded(true);
      });
    };
    
    script.onerror = () => {
      setHasError(true);
      console.error('Failed to load Google Maps');
    };
    
    document.head.appendChild(script);
    
    return () => {
      document.head.removeChild(script);
    };
  }, []);
  
  if (hasError) {
    return (
      <MapLoadError 
        message="Не удалось загрузить карту"
        fallback={<StaticMapImage />}
      />
    );
  }
  
  if (!isLoaded) {
    return <MapSkeleton />;
  }
  
  return <>{children}</>;
}
```

**Fallback to 2GIS (if needed):**

```typescript
function useMapProvider() {
  const [provider, setProvider] = useState<'google' | '2gis' | null>(null);
  
  useEffect(() => {
    // Try Google Maps first
    loadGoogleMaps()
      .then(() => setProvider('google'))
      .catch(() => {
        console.warn('Google Maps failed, trying 2GIS');
        load2GISMaps()
          .then(() => setProvider('2gis'))
          .catch(() => setProvider(null));
      });
  }, []);
  
  return provider;
}
```

---

#### E) Performance Considerations

**Clustering:**

```typescript
// Use clustering for 50+ markers
const shouldCluster = warehouses.length >= 50;

if (shouldCluster) {
  const clusterer = new ymaps.Clusterer({
    preset: 'islands#blueClusterIcons',
    groupByCoordinates: false,
    clusterDisableClickZoom: false,
  });
  
  warehouses.forEach(w => {
    const marker = new ymaps.Placemark([w.lat, w.lng]);
    clusterer.add(marker);
  });
  
  map.geoObjects.add(clusterer);
} else {
  // Add markers directly
  warehouses.forEach(w => {
    const marker = new ymaps.Placemark([w.lat, w.lng]);
    map.geoObjects.add(marker);
  });
}
```

**Lazy loading:**

```typescript
// Only load map when user scrolls to it
const { ref, inView } = useInView({
  triggerOnce: true,
  threshold: 0.1,
});

return (
  <div ref={ref}>
    {inView ? (
      <InteractiveWarehouseMap warehouses={warehouses} />
    ) : (
      <MapPlaceholder />
    )}
  </div>
);
```

**Checklist for map implementation:**

- [ ] Dynamic import with `ssr: false`
- [ ] Loading skeleton while map loads
- [ ] Map destroy on unmount
- [ ] Debounced marker updates
- [ ] Error handling with fallback
- [ ] Clustering for 50+ markers (optional)
- [ ] Lazy loading if below fold (optional)

---



---

#### F) Maps Fallback & Degradation (REQUIRED for MVP)

**Problem:** Google Maps script fails (network, quota, blocked)

**Frontend Behavior (MANDATORY):**

1. **Hide map container** - Don't show broken/loading map indefinitely
2. **Show list-only layout** - Warehouses still visible in list view
3. **Display non-blocking warning** - "Карта временно недоступна" (dismissible toast)
4. **No page crash** - Graceful degradation only

**Implementation:**

```typescript
function SearchPage() {
  const [mapError, setMapError] = useState(false);
  const warehouses = useWarehouses();
  
  return (
    <div className="search-layout">
      <SearchFilters />
      
      {!mapError ? (
        <ErrorBoundary
          onError={() => {
            setMapError(true);
            toast.warning('Карта временно недоступна. Используйте список.');
          }}
          fallback={<MapErrorFallback />}
        >
          <InteractiveMap warehouses={warehouses} />
        </ErrorBoundary>
      ) : (
        <div className="map-disabled-notice">
          <InfoIcon />
          <span>Карта недоступна. Склады отображены в списке ниже.</span>
        </div>
      )}
      
      <WarehouseList warehouses={warehouses} />
    </div>
  );
}
```

**Degradation Scenarios:**

| Failure | Frontend Response | User Impact |
|---------|-------------------|-------------|
| **Script load fails** | Hide map, show list only + toast | Can still browse warehouses |
| **API quota exceeded** | Same as above | Same |
| **Invalid coordinates** | Show map, but skip invalid markers + log warning | Map works for valid warehouses |
| **Timeout (10s+)** | Cancel load, fallback to list | Faster page load |

**Critical Rules:**

- **No blocking errors:** Map failure must NOT prevent warehouse browsing
- **No infinite loading:** Timeout after 10 seconds
- **Client-side only:** Already enforced by `ssr: false`
- **User can still search:** List view is fully functional without map

**Map is enhancement, not requirement.** List view is primary UI for MVP.

---

### 12.1. Google Maps API

#### 12.1.1. Подключение и конфигурация

```bash
npm install @react-google-maps/api
```

```typescript
// lib/maps/google-maps-config.ts
export const GOOGLE_MAPS_CONFIG = {
  apikey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  lang: 'ru_RU',
  version: '2.1',
  coordorder: 'latlong' as const,
  load: 'package.full', // или указать конкретные модули
};

export const DEFAULT_MAP_CENTER: [number, number] = [55.751244, 37.618423]; // Dubai
export const DEFAULT_MAP_ZOOM = 10;

// Настройки для разных типов карт
export const MAP_TYPES = {
  default: 'roadmap',
  satellite: 'satellite',
  hybrid: 'hybrid',
};
```


#### 12.1.2. GoogleMap Provider

```typescript
// app/providers.tsx
'use client';

import { GoogleMap } from '@react-google-maps/api';
import { GOOGLE_MAPS_CONFIG } from '@/lib/maps/google-maps-config';

export function MapsProvider({ children }: { children: React.ReactNode }) {
  return (
    <GoogleMap query={GOOGLE_MAPS_CONFIG}>
      {children}
    </GoogleMap>
  );
}

// В root layout
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>
        <QueryClientProvider client={queryClient}>
          <MapsProvider>
            {children}
          </MapsProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
```


### 12.2. Базовый компонент карты

```typescript
// modules/map/components/BaseMap.tsx
'use client';

import { Map } from '@react-google-maps/api';
import { DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM } from '@/lib/maps/google-maps-config';

interface BaseMapProps {
  center?: [number, number];
  zoom?: number;
  children?: React.ReactNode;
  onBoundsChange?: (bounds: any) => void;
  className?: string;
}

export function BaseMap({
  center = DEFAULT_MAP_CENTER,
  zoom = DEFAULT_MAP_ZOOM,
  children,
  onBoundsChange,
  className,
}: BaseMapProps) {
  const handleBoundsChange = (e: any) => {
    const newBounds = e.get('newBounds');
    onBoundsChange?.(newBounds);
  };
  
  return (
    <Map
      defaultState={{
        center,
        zoom,
        controls: ['zoomControl', 'fullscreenControl', 'geolocationControl'],
      }}
      modules={[
        'control.ZoomControl',
        'control.FullscreenControl',
        'control.GeolocationControl',
      ]}
      onBoundsChange={handleBoundsChange}
      width="100%"
      height="100%"
      className={className}
    >
      {children}
    </Map>
  );
}
```


### 12.3. Markers и Placemarks

```typescript
// modules/map/components/WarehouseMarker.tsx
'use client';

import { Placemark } from '@react-google-maps/api';
import type { Warehouse } from '@/types/warehouse.types';

interface WarehouseMarkerProps {
  warehouse: Warehouse;
  onClick?: (warehouse: Warehouse) => void;
  isActive?: boolean;
}

export function WarehouseMarker({ 
  warehouse, 
  onClick,
  isActive = false 
}: WarehouseMarkerProps) {
  const handleClick = () => {
    onClick?.(warehouse);
  };
  
  // Иконка маркера
  const iconContent = `${warehouse.price_from} AED `;
  
  // Balloon (всплывающее окно)
  const balloonContent = `
    <div style="padding: 12px; max-width: 250px;">
      <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600;">
        ${warehouse.name}
      </h3>
      <p style="margin: 0 0 8px 0; font-size: 14px; color: #666;">
        ${warehouse.address.full_address}
      </p>
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div>
          <div style="font-size: 12px; color: #666;">от</div>
          <div style="font-size: 18px; font-weight: 600; color: #0284c7;">
            ${warehouse.price_from} AED <span style="font-size: 12px;">/мес</span>
          </div>
        </div>
        <div style="display: flex; align-items: center; gap: 4px;">
          <span style="color: #fbbf24;">★</span>
          <span style="font-weight: 500;">${warehouse.rating}</span>
          <span style="color: #666; font-size: 12px;">(${warehouse.reviews_count})</span>
        </div>
      </div>
      <a 
        href="/warehouses/${warehouse.id}" 
        style="display: block; margin-top: 12px; text-align: center; padding: 8px; background: #0284c7; color: white; text-decoration: none; border-radius: 6px; font-size: 14px;"
      >
        Подробнее
      </a>
    </div>
  `;
  
  return (
    <Placemark
      geometry={[warehouse.latitude, warehouse.longitude]}
      properties={{
        balloonContent,
        iconContent,
        hintContent: warehouse.name,
      }}
      options={{
        preset: isActive 
          ? 'islands#redStretchyIcon' 
          : 'islands#blueStretchyIcon',
        hideIconOnBalloonOpen: false,
        balloonCloseButton: true,
      }}
      onClick={handleClick}
    />
  );
}
```


### 12.4. Clustering

```typescript
// modules/map/components/WarehouseMapWithClustering.tsx
'use client';

import { Clusterer } from '@react-google-maps/api';
import { BaseMap } from './BaseMap';
import { WarehouseMarker } from './WarehouseMarker';
import type { Warehouse } from '@/types/warehouse.types';

interface WarehouseMapProps {
  warehouses: Warehouse[];
  center?: [number, number];
  zoom?: number;
  onWarehouseClick?: (warehouse: Warehouse) => void;
  activeWarehouseId?: number;
}

export function WarehouseMapWithClustering({
  warehouses,
  center,
  zoom,
  onWarehouseClick,
  activeWarehouseId,
}: WarehouseMapProps) {
  return (
    <BaseMap center={center} zoom={zoom}>
      <Clusterer
        options={{
          preset: 'islands#blueClusterIcons',
          groupByCoordinates: false,
          clusterDisableClickZoom: false,
          clusterHideIconOnBalloonOpen: false,
          geoObjectHideIconOnBalloonOpen: false,
          clusterBalloonContentLayout: 'cluster#balloonCarousel',
          clusterBalloonPanelMaxMapArea: 0,
          clusterBalloonContentLayoutWidth: 250,
          clusterBalloonContentLayoutHeight: 150,
        }}
      >
        {warehouses.map((warehouse) => (
          <WarehouseMarker
            key={warehouse.id}
            warehouse={warehouse}
            onClick={onWarehouseClick}
            isActive={warehouse.id === activeWarehouseId}
          />
        ))}
      </Clusterer>
    </BaseMap>
  );
}
```


### 12.5. Геолокация пользователя

```typescript
// hooks/useGeolocation.ts
import { useState, useEffect } from 'react';

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
  isLoading: boolean;
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    error: null,
    isLoading: false,
  });
  
  const requestLocation = () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    if (!navigator.geolocation) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Геолокация не поддерживается вашим браузером',
      }));
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
          isLoading: false,
        });
      },
      (error) => {
        let errorMessage = 'Не удалось определить местоположение';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Доступ к геолокации запрещен';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Информация о местоположении недоступна';
            break;
          case error.TIMEOUT:
            errorMessage = 'Истекло время ожидания';
            break;
        }
        
        setState({
          latitude: null,
          longitude: null,
          error: errorMessage,
          isLoading: false,
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };
  
  return {
    ...state,
    requestLocation,
  };
}
```

**Использование в компоненте:**

```typescript
function SearchPage() {
  const { latitude, longitude, error, isLoading, requestLocation } = useGeolocation();
  const { updateFilter } = useFilterStore();
  
  const handleUseMyLocation = () => {
    requestLocation();
  };
  
  useEffect(() => {
    if (latitude && longitude) {
      updateFilter('latitude', latitude);
      updateFilter('longitude', longitude);
      toast.success('Местоположение определено');
    }
  }, [latitude, longitude, updateFilter]);
  
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);
  
  return (
    <div>
      <Button onClick={handleUseMyLocation} disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Определение...
          </>
        ) : (
          <>
            <MapPin className="h-4 w-4 mr-2" />
            Рядом со мной
          </>
        )}
      </Button>
    </div>
  );
}
```


### 12.6. Геокодирование

```typescript
// lib/maps/geocoding.ts
import axios from 'axios';

interface GeocodeResult {
  latitude: number;
  longitude: number;
  formatted_address: string;
}

export async function geocodeAddress(address: string): Promise<GeocodeResult | null> {
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/1.x/`,
      {
        params: {
          apikey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
          format: 'json',
          geocode: address,
          lang: 'ru_RU',
        },
      }
    );
    
    const geoObject = response.data.response.GeoObjectCollection.featureMember[0];
    
    if (!geoObject) return null;
    
    const [longitude, latitude] = geoObject.GeoObject.Point.pos.split(' ').map(Number);
    const formatted_address = geoObject.GeoObject.metaDataProperty.GeocoderMetaData.text;
    
    return {
      latitude,
      longitude,
      formatted_address,
    };
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
}

// Reverse geocoding - координаты в адрес
export async function reverseGeocode(
  latitude: number, 
  longitude: number
): Promise<string | null> {
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/1.x/`,
      {
        params: {
          apikey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
          format: 'json',
          geocode: `${longitude},${latitude}`,
          lang: 'ru_RU',
        },
      }
    );
    
    const geoObject = response.data.response.GeoObjectCollection.featureMember[0];
    
    if (!geoObject) return null;
    
    return geoObject.GeoObject.metaDataProperty.GeocoderMetaData.text;
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return null;
  }
}
```

**Использование:**

```typescript
// В компоненте поиска
function SearchBar() {
  const [query, setQuery] = useState('');
  const { updateFilter } = useFilterStore();
  
  const handleSearch = async () => {
    const result = await geocodeAddress(query);
    
    if (result) {
      updateFilter('latitude', result.latitude);
      updateFilter('longitude', result.longitude);
      updateFilter('q', result.formatted_address);
    } else {
      toast.error('Адрес не найден');
    }
  };
  
  return (
    <div>
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Введите адрес..."
      />
      <Button onClick={handleSearch}>Найти</Button>
    </div>
  );
}
```


### 12.7. 2GIS как fallback

```typescript
// lib/maps/map-provider.ts
export type MapProvider = 'google' | '2gis';

export function useMapProvider(): MapProvider {
  const [provider, setProvider] = useState<MapProvider>('google');
  
  useEffect(() => {
    // Проверяем доступность Google Maps
    const checkGoogleMaps = async () => {
      try {
        const response = await fetch('https://maps.googleapis.com/maps/api/2.1/?lang=ru_RU', {
          method: 'HEAD',
        });
        
        if (!response.ok) {
          setProvider('2gis');
          console.warn('Google Maps недоступен, используем 2GIS');
        }
      } catch (error) {
        setProvider('2gis');
        console.warn('Google Maps недоступен, используем 2GIS');
      }
    };
    
    checkGoogleMaps();
  }, []);
  
  return provider;
}
```


### 12.8. Интерактивная карта с поиском

```typescript
// modules/map/components/InteractiveWarehouseMap.tsx
'use client';

import { useState, useEffect } from 'react';
import { WarehouseMapWithClustering } from './WarehouseMapWithClustering';
import { WarehouseCard } from '@/modules/warehouses/components/WarehouseCard';
import { useFilters } from '@/stores/filter-store';
import { useWarehouses } from '@/modules/warehouses/hooks/useWarehouses';

export function InteractiveWarehouseMap() {
  const filters = useFilters();
  const { data: warehouses } = useWarehouses(filters);
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([55.751244, 37.618423]);
  
  // Центрируем карту на основе фильтров
  useEffect(() => {
    if (filters.latitude && filters.longitude) {
      setMapCenter([filters.latitude, filters.longitude]);
    }
  }, [filters.latitude, filters.longitude]);
  
  // Центрируем на первом складе из результатов
  useEffect(() => {
    if (warehouses && warehouses.length > 0 && !filters.latitude) {
      setMapCenter([warehouses[0].latitude, warehouses[0].longitude]);
    }
  }, [warehouses, filters.latitude]);
  
  const handleWarehouseClick = (warehouse: Warehouse) => {
    setSelectedWarehouse(warehouse);
    setMapCenter([warehouse.latitude, warehouse.longitude]);
  };
  
  return (
    <div className="flex gap-4 h-[600px]">
      {/* Карта */}
      <div className="flex-1 relative">
        <WarehouseMapWithClustering
          warehouses={warehouses || []}
          center={mapCenter}
          zoom={12}
          onWarehouseClick={handleWarehouseClick}
          activeWarehouseId={selectedWarehouse?.id}
        />
      </div>
      
      {/* Боковая панель с выбранным складом */}
      {selectedWarehouse && (
        <div className="w-96 overflow-y-auto">
          <WarehouseCard warehouse={selectedWarehouse} />
        </div>
      )}
    </div>
  );
}
```


### 12.9. Маршруты на карте

```typescript
// modules/map/components/RouteMap.tsx
'use client';

import { useEffect, useRef } from 'react';
import { useLoadScript } from '@react-google-maps/api';
import { BaseMap } from './BaseMap';

interface RouteMapProps {
  from: [number, number];
  to: [number, number];
  onRouteCalculated?: (distance: number, duration: number) => void;
}

export function RouteMap({ from, to, onRouteCalculated }: RouteMapProps) {
  const ymaps = useLoadScript(['route']);
  const mapRef = useRef<any>(null);
  const routeRef = useRef<any>(null);
  
  useEffect(() => {
    if (!ymaps || !mapRef.current) return;
    
    // Очищаем предыдущий маршрут
    if (routeRef.current) {
      mapRef.current.geoObjects.remove(routeRef.current);
    }
    
    // Создаем маршрут
    ymaps.route([from, to], {
      mapStateAutoApply: true,
    }).then((route: any) => {
      routeRef.current = route;
      mapRef.current.geoObjects.add(route);
      
      // Получаем информацию о маршруте
      const distance = route.getLength(); // в метрах
      const duration = route.getTime(); // в секундах
      
      onRouteCalculated?.(distance, duration);
    });
    
    return () => {
      if (routeRef.current && mapRef.current) {
        mapRef.current.geoObjects.remove(routeRef.current);
      }
    };
  }, [ymaps, from, to, onRouteCalculated]);
  
  return (
    <BaseMap
      center={from}
      zoom={12}
      onLoad={(map: any) => {
        mapRef.current = map;
      }}
    />
  );
}
```


### 12.10. Оптимизация производительности карты

```typescript
// Ленивая загрузка карты
import dynamic from 'next/dynamic';

const WarehouseMap = dynamic(
  () => import('@/modules/map/components/WarehouseMapWithClustering'),
  {
    loading: () => (
      <div className="w-full h-[600px] bg-gray-100 animate-pulse flex items-center justify-center">
        <LoadingSpinner text="Загрузка карты..." />
      </div>
    ),
    ssr: false, // Карта не рендерится на сервере
  }
);

// Использование
function SearchPage() {
  const [showMap, setShowMap] = useState(false);
  
  return (
    <div>
      <Button onClick={() => setShowMap(true)}>
        Показать на карте
      </Button>
      
      {showMap && <WarehouseMap warehouses={warehouses} />}
    </div>
  );
}
```

**Дебаунс обновлений карты:**

```typescript
function InteractiveMap() {
  const [bounds, setBounds] = useState(null);
  const debouncedBounds = useDebounce(bounds, 500);
  
  // Запрос складов только после остановки движения карты
  const { data: warehouses } = useQuery({
    queryKey: ['warehouses', 'bounds', debouncedBounds],
    queryFn: () => warehousesApi.searchByBounds(debouncedBounds),
    enabled: !!debouncedBounds,
  });
  
  return (
    <BaseMap onBoundsChange={setBounds}>
      {warehouses?.map((warehouse) => (
        <WarehouseMarker key={warehouse.id} warehouse={warehouse} />
      ))}
    </BaseMap>
  );
}
```


**Конец Блока 4 (Разделы 10-11)**





# БЛОК 5 (ФИНАЛЬНЫЙ): Разделы 12-13


## 13. Работа с токенами и безопасность

---

⚠️ **CRITICAL WARNING FOR MVP v1 IMPLEMENTATION**

**DO NOT USE the code examples in this section for MVP v1.**

MVP v1 uses **cookie-based authentication only** (httpOnly cookies managed by backend).

- NO tokens in localStorage
- NO tokens in sessionStorage  
- NO tokens in request/response JSON bodies
- Tokens managed exclusively by backend via Set-Cookie

**For MVP v1 auth implementation, see Section 4.2 (Cookie-Based Auth Model).**

The examples below are **theoretical/alternative approaches only** and are kept for architectural reference.

---

### 13.1. JWT Token Management

#### 13.1.1. Хранение токенов

**Стратегия хранения:**

```typescript
// lib/auth/tokens.ts

// Хранение Access Token - httpOnly cookie (предпочтительно) или localStorage
const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

// Access Token - короткий срок жизни (15 минут)
export function setAccessToken(token: string): void {
  if (typeof window === 'undefined') return;
  
  // Вариант 1: localStorage (проще, но менее безопасно)
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
  
  // Вариант 2: httpOnly cookie (безопаснее, устанавливается сервером)
  // Устанавливается через Set-Cookie header от API
}

export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

// Refresh Token - длинный срок жизни (7 дней)
export function setRefreshToken(token: string): void {
  if (typeof window === 'undefined') return;
  
  // Refresh token ВСЕГДА в httpOnly cookie для безопасности
  // Устанавливается сервером через Set-Cookie
  
  // Для локальной разработки можем хранить в localStorage
  if (process.env.NODE_ENV === 'development') {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  }
}

export function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  
  // В production refresh token недоступен из JS (httpOnly cookie)
  // В development можем читать из localStorage
  if (process.env.NODE_ENV === 'development') {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  }
  
  return null;
}

// Установка обоих токенов
export function setTokens(accessToken: string, refreshToken: string): void {
  setAccessToken(accessToken);
  setRefreshToken(refreshToken);
}

// Очистка всех токенов
export function clearTokens(): void {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  
  // Также очищаем cookies (через запрос к API)
  fetch('/api/auth/logout', { 
    method: 'POST',
    credentials: 'include' 
  });
}

// Проверка валидности токена
export function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp * 1000; // Конвертируем в миллисекунды
    return Date.now() >= exp;
  } catch {
    return true;
  }
}

// Получение данных из токена
export function decodeToken(token: string): any {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return null;
  }
}
```


#### 13.1.2. Refresh Token Flow

```typescript
// lib/auth/refresh.ts
import axios from 'axios';
import { getAccessToken, getRefreshToken, setAccessToken, clearTokens } from './tokens';

let isRefreshing = false;
let refreshPromise: Promise<string> | null = null;

export async function refreshAccessToken(): Promise<string> {
  // Если уже обновляем, возвращаем существующий promise
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }
  
  isRefreshing = true;
  
  refreshPromise = (async () => {
    try {
      const refreshToken = getRefreshToken();
      
      // Запрос на refresh (с credentials для httpOnly cookies)
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true, // Важно для отправки httpOnly cookies
        }
      );
      
      const { access_token } = response.data.data;
      
      // Сохраняем новый access token
      setAccessToken(access_token);
      
      return access_token;
    } catch (error) {
      // Не удалось обновить - выход из системы
      clearTokens();
      throw error;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();
  
  return refreshPromise;
}
```


#### 13.1.3. Автоматический refresh в interceptor

```typescript
// lib/api/interceptors/response.interceptor.ts
import { AxiosError } from 'axios';
import { refreshAccessToken } from '@/lib/auth/refresh';

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

export function setupResponseInterceptor(client: any) {
  client.interceptors.response.use(
    (response: any) => response,
    async (error: AxiosError) => {
      const originalRequest: any = error.config;
      
      // 401 - токен истек
      if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          // Добавляем запрос в очередь
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return client(originalRequest);
            })
            .catch((err) => {
              return Promise.reject(err);
            });
        }
        
        originalRequest._retry = true;
        isRefreshing = true;
        
        try {
          const newToken = await refreshAccessToken();
          processQueue(null, newToken);
          
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return client(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError, null);
          
          // Редирект на логин
          if (typeof window !== 'undefined') {
            window.location.href = '/login?reason=session_expired';
          }
          
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }
      
      return Promise.reject(error);
    }
  );
}
```


### 13.2. XSS Protection

#### 13.2.1. Санитизация пользовательского ввода

```typescript
// lib/security/sanitize.ts
import DOMPurify from 'isomorphic-dompurify';

// Санитизация HTML
export function sanitizeHTML(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
    ALLOWED_ATTR: ['href', 'target'],
  });
}

// Экранирование для текста
export function escapeHTML(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Безопасное отображение пользовательского контента
export function SafeHTML({ html }: { html: string }) {
  return (
    <div
      dangerouslySetInnerHTML={{
        __html: sanitizeHTML(html),
      }}
    />
  );
}
```

**Использование:**

```typescript
// ❌ ОПАСНО - XSS уязвимость
function Comment({ text }: { text: string }) {
  return <div dangerouslySetInnerHTML={{ __html: text }} />;
}

// ✅ БЕЗОПАСНО - санитизация
function Comment({ text }: { text: string }) {
  return <SafeHTML html={text} />;
}

// ✅ БЕЗОПАСНО - React автоматически экранирует
function Comment({ text }: { text: string }) {
  return <div>{text}</div>;
}
```


#### 13.2.2. Content Security Policy (CSP)

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  // Content Security Policy
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline' https://maps.googleapis.com/maps/api;
    style-src 'self' 'unsafe-inline';
    img-src 'self' data: https: blob:;
    font-src 'self' data:;
    connect-src 'self' https://api.storagecompare.ae https://maps.googleapis.com/maps/api;
    frame-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
  `.replace(/\s{2,}/g, ' ').trim();
  
  response.headers.set('Content-Security-Policy', cspHeader);
  
  return response;
}
```


### 13.3. CSRF Protection

```typescript
// lib/security/csrf.ts

// Генерация CSRF токена
export function generateCSRFToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

// Сохранение CSRF токена
export function setCSRFToken(token: string): void {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem('csrf_token', token);
}

export function getCSRFToken(): string | null {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem('csrf_token');
}

// Добавление CSRF токена в запросы
// В axios interceptor
apiClient.interceptors.request.use((config) => {
  const csrfToken = getCSRFToken();
  
  if (csrfToken && ['POST', 'PUT', 'DELETE', 'PATCH'].includes(config.method?.toUpperCase() || '')) {
    config.headers['X-CSRF-Token'] = csrfToken;
  }
  
  return config;
});
```


### 13.4. Secure Headers

```typescript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(self)',
          },
        ],
      },
    ];
  },
};
```


### 13.5. Route Guards

#### 13.5.1. Auth Guard для защищенных страниц

```typescript
// components/auth/AuthGuard.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useIsAuthenticated } from '@/stores/auth-store';
import { FullPageLoader } from '@/components/shared/LoadingSpinner';

interface AuthGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export function AuthGuard({ children, redirectTo = '/login' }: AuthGuardProps) {
  const router = useRouter();
  const isAuthenticated = useIsAuthenticated();
  
  useEffect(() => {
    if (!isAuthenticated) {
      const currentPath = window.location.pathname;
      router.push(`${redirectTo}?redirect=${encodeURIComponent(currentPath)}`);
    }
  }, [isAuthenticated, router, redirectTo]);
  
  if (!isAuthenticated) {
    return <FullPageLoader text="Проверка авторизации..." />;
  }
  
  return <>{children}</>;
}
```

**Использование:**

```typescript
// app/dashboard/layout.tsx
import { AuthGuard } from '@/components/auth/AuthGuard';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <DashboardLayout>{children}</DashboardLayout>
    </AuthGuard>
  );
}
```


#### 13.5.2. Role Guard

```typescript
// components/auth/RoleGuard.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserRole } from '@/stores/auth-store';
import { PermissionError } from '@/components/shared/ErrorState';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: Array<'user' | 'operator' | 'admin'>;
  fallback?: React.ReactNode;
}

export function RoleGuard({ 
  children, 
  allowedRoles,
  fallback = <PermissionError />
}: RoleGuardProps) {
  const userRole = useUserRole();
  const router = useRouter();
  
  const hasAccess = userRole && allowedRoles.includes(userRole);
  
  useEffect(() => {
    if (userRole && !hasAccess) {
      // Логируем попытку несанкционированного доступа
      console.warn(`Unauthorized access attempt by role: ${userRole}`);
    }
  }, [userRole, hasAccess]);
  
  if (!hasAccess) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
}
```

**Использование:**

```typescript
// app/operator/layout.tsx
export default function OperatorLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <RoleGuard allowedRoles={['operator', 'admin']}>
        {children}
      </RoleGuard>
    </AuthGuard>
  );
}
```


### 13.6. Защита от Rate Limiting на клиенте

```typescript
// lib/security/rate-limiter.ts
class ClientRateLimiter {
  private requests: Map<string, number[]> = new Map();
  
  canMakeRequest(key: string, maxRequests: number, windowMs: number): boolean {
    const now = Date.now();
    const timestamps = this.requests.get(key) || [];
    
    // Удаляем старые запросы вне окна
    const validTimestamps = timestamps.filter(ts => now - ts < windowMs);
    
    if (validTimestamps.length >= maxRequests) {
      return false;
    }
    
    validTimestamps.push(now);
    this.requests.set(key, validTimestamps);
    
    return true;
  }
  
  getRemainingTime(key: string, windowMs: number): number {
    const timestamps = this.requests.get(key) || [];
    if (timestamps.length === 0) return 0;
    
    const oldestTimestamp = Math.min(...timestamps);
    const timeUntilReset = windowMs - (Date.now() - oldestTimestamp);
    
    return Math.max(0, timeUntilReset);
  }
}

export const rateLimiter = new ClientRateLimiter();

// Использование
export function useRateLimitedMutation<T>(
  mutationFn: () => Promise<T>,
  options: {
    key: string;
    maxRequests: number;
    windowMs: number;
  }
) {
  const [isBlocked, setIsBlocked] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  
  const executeMutation = async () => {
    if (!rateLimiter.canMakeRequest(options.key, options.maxRequests, options.windowMs)) {
      const timeRemaining = rateLimiter.getRemainingTime(options.key, options.windowMs);
      setIsBlocked(true);
      setRemainingTime(Math.ceil(timeRemaining / 1000));
      
      toast.error(`Слишком много запросов. Попробуйте через ${Math.ceil(timeRemaining / 1000)} сек.`);
      throw new Error('Rate limit exceeded');
    }
    
    return mutationFn();
  };
  
  return { executeMutation, isBlocked, remainingTime };
}
```


## 14. Диаграммы взаимодействия с API

### 14.1. Поток поиска складов

```
┌─────────────┐
│   Клиент    │
└──────┬──────┘
       │
       │ 1. Ввод параметров поиска
       │    (город, цена, размер)
       ▼
┌──────────────────┐
│  FilterStore     │
│  (Zustand)       │
└──────┬───────────┘
       │
       │ 2. Обновление filters
       │
       ▼
┌──────────────────┐
│  useWarehouses   │
│  (React Query)   │
└──────┬───────────┘
       │
       │ 3. GET /api/v1/warehouses
       │    ?city=Dubai&price_max=10000
       │
       ▼
┌──────────────────┐
│   API Gateway    │
└──────┬───────────┘
       │
       │ 4. Rate limiting (100/min)
       │    CORS validation
       │    Logging
       │
       ▼
┌──────────────────┐
│ Warehouse Service│
└──────┬───────────┘
       │
       │ 5. SQL Query
       │    JOIN boxes, addresses
       │    WHERE + LIMIT
       │
       ▼
┌──────────────────┐
│   PostgreSQL     │
└──────┬───────────┘
       │
       │ 6. Результаты
       │
       ▼
┌──────────────────┐
│ Warehouse Service│
└──────┬───────────┘
       │
       │ 7. Response:
       │    {
       │      success: true,
       │      data: [...],
       │      pagination: {...}
       │    }
       │
       ▼
┌──────────────────┐
│   API Gateway    │
└──────┬───────────┘
       │
       │ 8. Response + Headers
       │
       ▼
┌──────────────────┐
│  React Query     │
│  - Кэширует      │
│  - staleTime: 5m │
└──────┬───────────┘
       │
       │ 9. Обновление UI
       │
       ▼
┌──────────────────┐
│ WarehouseList    │
│ Component        │
└──────────────────┘
```


### 14.2. Поток создания бронирования

```
┌─────────────┐
│   Клиент    │
└──────┬──────┘
       │
       │ 1. Заполнение формы
       │    BookingForm
       │
       ▼
┌──────────────────┐
│ React Hook Form  │
│ + Zod Validation │
└──────┬───────────┘
       │
       │ 2. Client-side validation
       │    ✓ Все поля заполнены
       │    ✓ Email корректный
       │
       ▼
┌──────────────────┐
│ useCreateBooking │
│ (React Query)    │
└──────┬───────────┘
       │
       │ 3. POST /api/v1/bookings
       │    Authorization: Bearer {token}
       │    Body: {
       │      box_id, start_date,
       │      duration_months, customer
       │    }
       │
       ▼
┌──────────────────┐
│   API Gateway    │
└──────┬───────────┘
       │
       │ 4. JWT validation
       │    Rate limiting (300/min)
       │
       ▼
┌──────────────────┐
│   Auth Service   │
└──────┬───────────┘
       │
       │ 5. Verify token
       │    Extract user_id
       │
       ▼
┌──────────────────┐
│ Booking Service  │
└──────┬───────────┘
       │
       │ 6. Business logic:
       │    - Проверка доступности бокса
       │    - Расчет цены
       │    - Создание бронирования
       │
       ▼
┌──────────────────┐
│   PostgreSQL     │
│   Transaction    │
└──────┬───────────┘
       │
       │ 7. BEGIN
       │    INSERT INTO bookings
       │    UPDATE boxes SET status
       │    COMMIT
       │
       ▼
┌──────────────────┐
│ Notification     │
│ Service          │
└──────┬───────────┘
       │
       │ 8. Отправка email
       │    (async, queue)
       │
       ▼
┌──────────────────┐
│ Booking Service  │
└──────┬───────────┘
       │
       │ 9. Response:
       │    {
       │      success: true,
       │      data: {
       │        id: 123,
       │        status: "pending",
       │        ...
       │      }
       │    }
       │
       ▼
┌──────────────────┐
│  React Query     │
└──────┬───────────┘
       │
       │ 10. onSuccess:
       │     - Invalidate queries
       │     - Toast notification
       │     - Redirect
       │
       ▼
┌──────────────────┐
│ queryClient      │
│ .invalidateQueries│
└──────┬───────────┘
       │
       │ 11. Обновление кэша:
       │     - ['bookings', 'user']
       │     - ['boxes', boxId]
       │     - ['warehouses', warehouseId]
       │
       ▼
┌──────────────────┐
│ Success Page     │
│ /booking/123/    │
│ success          │
└──────────────────┘
```


### 14.3. Поток аутентификации с refresh

```
┌─────────────┐
│   Клиент    │
└──────┬──────┘
       │
       │ 1. Пользователь вводит
       │    email + password
       │
       ▼
┌──────────────────┐
│   LoginForm      │
└──────┬───────────┘
       │
       │ 2. POST /api/v1/auth/login
       │    Body: { email, password }
       │
       ▼
┌──────────────────┐
│   API Gateway    │
└──────┬───────────┘
       │
       │ 3. Rate limiting
       │    (10 попыток/IP/час)
       │
       ▼
┌──────────────────┐
│   Auth Service   │
└──────┬───────────┘
       │
       │ 4. Verify credentials
       │    - Hash password
       │    - Compare with DB
       │
       ▼
┌──────────────────┐
│   PostgreSQL     │
└──────┬───────────┘
       │
       │ 5. SELECT user
       │    WHERE email = ...
       │
       ▼
┌──────────────────┐
│   Auth Service   │
└──────┬───────────┘
       │
       │ 6. Generate tokens:
       │    - access_token (15 min)
       │    - refresh_token (7 days)
       │
       ▼
┌──────────────────┐
│   API Gateway    │
└──────┬───────────┘
       │
       │ 7. Response:
       │    {
       │      access_token: "...",
       │      refresh_token: "...",
       │      user: {...}
       │    }
       │    Set-Cookie: refresh_token
       │
       ▼
┌──────────────────┐
│   Frontend       │
└──────┬───────────┘
       │
       │ 8. Сохранение:
       │    - access_token → localStorage
       │    - refresh_token → httpOnly cookie
       │    - user → Zustand store
       │
       ▼
┌─────────────────────────────────────┐
│  ... через 15 минут ...             │
└─────────────────────────────────────┘
       │
       │ 9. API request с истекшим токеном
       │
       ▼
┌──────────────────┐
│   API Gateway    │
└──────┬───────────┘
       │
       │ 10. Response: 401 Unauthorized
       │
       ▼
┌──────────────────┐
│ Axios Interceptor│
└──────┬───────────┘
       │
       │ 11. Detect 401
       │     Trigger refresh flow
       │
       ▼
┌──────────────────┐
│ refreshAccessToken│
└──────┬───────────┘
       │
       │ 12. POST /api/v1/auth/refresh
       │     Credentials: include (httpOnly cookie)
       │
       ▼
┌──────────────────┐
│   Auth Service   │
└──────┬───────────┘
       │
       │ 13. Verify refresh_token
       │     Generate new access_token
       │
       ▼
┌──────────────────┐
│   Frontend       │
└──────┬───────────┘
       │
       │ 14. Сохранение нового access_token
       │     Повтор оригинального запроса
       │
       ▼
┌──────────────────┐
│   Success        │
└──────────────────┘
```


### 14.4. Поток создания склада оператором

```
┌─────────────┐
│  Оператор   │
└──────┬──────┘
       │
       │ 1. Заполнение формы
       │    WarehouseForm
       │    (название, адрес, фото)
       │
       ▼
┌──────────────────┐
│ useCreateWarehouse│
└──────┬───────────┘
       │
       │ 2. Загрузка фотографий
       │    POST /api/v1/upload
       │    Content-Type: multipart/form-data
       │
       ▼
┌──────────────────┐
│   File Service   │
└──────┬───────────┘
       │
       │ 3. Сохранение файлов
       │    → S3 / CDN
       │    Генерация URLs
       │
       ▼
┌──────────────────┐
│   Frontend       │
└──────┬───────────┘
       │
       │ 4. POST /api/v1/operator/warehouses
       │    Authorization: Bearer {token}
       │    Body: {
       │      name, address, photos: [urls],
       │      attributes, working_hours
       │    }
       │
       ▼
┌──────────────────┐
│   API Gateway    │
└──────┬───────────┘
       │
       │ 5. JWT validation
       │    Role check (operator/admin)
       │
       ▼
┌──────────────────┐
│ Operator Service │
└──────┬───────────┘
       │
       │ 6. Валидация данных:
       │    - Геокодирование адреса
       │    - Проверка уникальности
       │    - Валидация атрибутов
       │
       ▼
┌──────────────────┐
│ Warehouse Service│
└──────┬───────────┘
       │
       │ 7. BEGIN Transaction
       │    INSERT INTO warehouses
       │    INSERT INTO warehouse_photos
       │    INSERT INTO warehouse_attributes
       │    COMMIT
       │
       ▼
┌──────────────────┐
│   PostgreSQL     │
└──────┬───────────┘
       │
       │ 8. RETURNING warehouse_id
       │
       ▼
┌──────────────────┐
│ Warehouse Service│
└──────┬───────────┘
       │
       │ 9. Response:
       │    {
       │      success: true,
       │      data: {
       │        id: 456,
       │        status: "draft",
       │        ...
       │      }
       │    }
       │
       ▼
┌──────────────────┐
│  React Query     │
└──────┬───────────┘
       │
       │ 10. onSuccess:
       │     - Invalidate operator warehouses
       │     - Set new warehouse in cache
       │     - Toast + Redirect
       │
       ▼
┌──────────────────┐
│ /operator/       │
│ warehouses/456   │
└──────────────────┘
```


### 14.5. Поток работы с AI рекомендациями

```
┌─────────────┐
│   Клиент    │
└──────┬──────┘
       │
       │ 1. Пользователь описывает вещи:
       │    "диван, холодильник, 10 коробок"
       │
       ▼
┌──────────────────┐
│ AIRecommendation │
│ Component        │
└──────┬───────────┘
       │
       │ 2. POST /api/v1/ai/recommend-box
       │    Body: {
       │      items_description: "...",
       │      warehouse_id: 123
       │    }
       │    Timeout: 60s
       │
       ▼
┌──────────────────┐
│   API Gateway    │
└──────┬───────────┘
       │
       │ 3. Rate limiting
       │    (20 запросов/час/user)
       │
       ▼
┌──────────────────┐
│   AI Service     │
└──────┬───────────┘
       │
       │ 4. Анализ описания:
       │    - Парсинг вещей
       │    - Оценка объема
       │    - Подбор размера
       │
       ▼
┌──────────────────┐
│   Box Service    │
└──────┬───────────┘
       │
       │ 5. SELECT available boxes
       │    WHERE warehouse_id = 123
       │    AND size >= calculated
       │    AND status = 'available'
       │    ORDER BY price
       │
       ▼
┌──────────────────┐
│   PostgreSQL     │
└──────┬───────────┘
       │
       │ 6. Возврат подходящих боксов
       │
       ▼
┌──────────────────┐
│   AI Service     │
└──────┬───────────┘
       │
       │ 7. Ранжирование + объяснение:
       │    {
       │      recommended_boxes: [
       │        {
       │          box_id: 789,
       │          confidence: 0.95,
       │          explanation: "...",
       │          estimated_usage: "85%"
       │        }
       │      ]
       │    }
       │
       ▼
┌──────────────────┐
│   Frontend       │
└──────┬───────────┘
       │
       │ 8. Отображение рекомендаций:
       │    - Карточки боксов
       │    - Объяснение выбора
       │    - Кнопка "Забронировать"
       │
       ▼
┌──────────────────┐
│ BoxRecommendation│
│ List             │
└──────────────────┘
```


### 14.6. Error Handling Flow

```
┌─────────────┐
│ API Request │
└──────┬──────┘
       │
       ▼
┌──────────────────┐
│   Try Request    │
└──────┬───────────┘
       │
       ├─── Success (200-299)
       │    │
       │    ▼
       │    ┌──────────────┐
       │    │ React Query  │
       │    │ onSuccess    │
       │    └──────────────┘
       │
       ├─── 400 Bad Request
       │    │
       │    ▼
       │    ┌──────────────┐
       │    │ Validation   │
       │    │ Errors       │
       │    │ → Form       │
       │    └──────────────┘
       │
       ├─── 401 Unauthorized
       │    │
       │    ▼
       │    ┌──────────────┐
       │    │ Refresh Token│
       │    │ Flow         │
       │    └──────┬───────┘
       │           │
       │           ├─ Success → Retry Request
       │           │
       │           └─ Failed → Redirect /login
       │
       ├─── 403 Forbidden
       │    │
       │    ▼
       │    ┌──────────────┐
       │    │ Permission   │
       │    │ Error Page   │
       │    └──────────────┘
       │
       ├─── 404 Not Found
       │    │
       │    ▼
       │    ┌──────────────┐
       │    │ Not Found    │
       │    │ Error State  │
       │    └──────────────┘
       │
       ├─── 429 Rate Limit
       │    │
       │    ▼
       │    ┌──────────────┐
       │    │ Retry After  │
       │    │ X seconds    │
       │    └──────────────┘
       │
       ├─── 500-599 Server Error
       │    │
       │    ▼
       │    ┌──────────────┐
       │    │ Retry Logic  │
       │    │ (3 attempts) │
       │    └──────┬───────┘
       │           │
       │           ├─ Success → Continue
       │           │
       │           └─ Failed → Error State
       │
       └─── Network Error
            │
            ▼
            ┌──────────────┐
            │ Offline      │
            │ Detection    │
            │ + Queue      │
            └──────────────┘
```


**Конец Блока 5 (Разделы 12-13)**


## ДОКУМЕНТАЦИЯ ЗАВЕРШЕНА!

Все 13 разделов Frontend Architecture Specification для Self-Storage Aggregator MVP v1 созданы.

### Структура документации:

1. **Блок 1** (Разделы 1-3) - Общая архитектура, Tech Stack, Структура файлов
2. **Блок 2A** (Раздел 4) - Управление состоянием
3. **Блок 2B** (Раздел 5) - Загрузка данных
4. **Блок 2C** (Раздел 6) - UI компоненты
5. **Блок 3** (Разделы 7-9) - Loading/Error/SEO/Accessibility
6. **Блок 4** (Разделы 10-11) - Performance/Maps
7. **Блок 5** (Разделы 12-13) - Security/API Diagrams
