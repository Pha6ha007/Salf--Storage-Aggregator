# Frontend Implementation Plan (MVP v1) — Self-Storage Aggregator

**Версия документа:** 1.2 (Security Fixed)  
**Дата создания:** 01 декабря 2024  
**Дата аудита:** 16 декабря 2024  
**Дата security fix:** 16 декабря 2024  
**Проект:** Self-Storage Aggregator MVP v1

---

## Терминология документа

В данном документе используется следующая терминология для обозначения уровня обязательности:

| Термин | Значение |
|--------|----------|
| **MUST** | Обязательно для MVP. Без этого функционал не работает. |
| **SHOULD** | Рекомендуется для MVP. Улучшает качество, но не блокирует релиз. |
| **MAY** | Опционально. Может быть реализовано по усмотрению команды. |
| **POST-MVP** | Не входит в MVP v1. Планируется на следующие версии. |
| **PLACEHOLDER** | Заглушка для MVP. Требует полной реализации в следующих версиях. |

---

## Содержание

1. [Архитектура фронтенда](#1-архитектура-фронтенда)
   - 1.1. Структура проекта
   - 1.2. Страницы и роутинг
   - 1.3. Компоненты (структура и уровни)
   - 1.4. State-management
   - 1.5. Сервисы API и синхронизация с backend
   - 1.6. Работа с картами
   - 1.7. Работа с авторизацией
   - 1.8. Работа с формами и валидацией

2. [UI-слой](#2-ui-слой)
   - 2.1. Принципы дизайн-системы
   - 2.2. UI-компоненты
   - 2.3. Best practices по композиции интерфейсов

3. [Технический стек](#3-технический-стек)
   - 3.1. Framework: Next.js + React
   - 3.2. Библиотека карт
   - 3.3. Работа с API
   - 3.4. State-management
   - 3.5. Оптимизации

4. [План разработки](#4-план-разработки)
   - 4.1. Спринты и фазы
   - 4.2. Интеграции с backend
   - 4.3. Тестирование

5. [Требования к производительности](#5-требования-к-производительности)
   - 5.1. Время загрузки
   - 5.2. Оптимизация карт
   - 5.3. Кэширование
   - 5.4. Пагинация, сортировка и фильтрация

---

# Раздел 1: Архитектура фронтенда

## 1.1. Структура проекта

Проект фронтенда построен на **Next.js 14 (App Router)** с использованием TypeScript. Структура организована по принципу **feature-based architecture** с чёткой изоляцией компонентов по доменам.

> **Frontend clarification:**
> - Структура проекта ниже является **MUST** — все директории и файлы MUST быть созданы согласно этой структуре.
> - Названия директорий и файлов MUST соответствовать указанным (регистр важен).
> - Директория `themes/` в `styles/` является **MAY** — темизация не входит в MVP.

```
frontend/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (public)/                 # Публичные страницы (без auth layout)
│   │   │   ├── page.tsx              # Главная страница
│   │   │   ├── catalog/              # Каталог складов
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/            # Карточка склада
│   │   │   │       └── page.tsx
│   │   │   ├── map/                  # Карта
│   │   │   │   └── page.tsx
│   │   │   ├── booking/              # Бронирование
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx
│   │   │   └── about/
│   │   │       └── page.tsx
│   │   │
│   │   ├── (auth)/                   # Auth страницы
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── register/
│   │   │   │   └── page.tsx
│   │   │   └── reset-password/
│   │   │       └── page.tsx
│   │   │
│   │   ├── (protected)/              # Защищённые страницы (требуют auth)
│   │   │   ├── profile/              # ЛК пользователя
│   │   │   │   ├── page.tsx
│   │   │   │   ├── bookings/
│   │   │   │   ├── favorites/
│   │   │   │   └── settings/
│   │   │   │
│   │   │   └── operator/             # ЛК оператора
│   │   │       ├── page.tsx          # Dashboard
│   │   │       ├── warehouses/       # Управление складами
│   │   │       ├── boxes/            # Управление боксами
│   │   │       ├── bookings/         # Заявки
│   │   │       ├── reviews/          # Отзывы
│   │   │       ├── analytics/        # Аналитика
│   │   │       └── settings/         # Настройки
│   │   │
│   │   ├── layout.tsx                # Root layout
│   │   ├── error.tsx                 # Error boundary
│   │   ├── loading.tsx               # Loading UI
│   │   └── not-found.tsx             # 404
│   │
│   ├── components/                    # Компоненты
│   │   ├── layout/                   # Layout-компоненты
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── MainLayout.tsx
│   │   │   └── OperatorLayout.tsx
│   │   │
│   │   ├── ui/                       # UI-компоненты (базовые)
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
│   │   └── features/                 # Feature-компоненты (по доменам)
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
│   │   ├── authStore.ts              # Авторизация
│   │   ├── filtersStore.ts           # Фильтры каталога
│   │   ├── mapStore.ts               # Состояние карты
│   │   ├── bookingStore.ts           # Процесс бронирования
│   │   └── uiStore.ts                # UI состояние (модалки, тосты)
│   │
│   ├── services/                      # API и внешние сервисы
│   │   ├── api/
│   │   │   ├── client.ts             # Axios instance с interceptors
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
│   │       └── yandexMaps.ts         # Google Maps SDK wrapper
│   │
│   ├── lib/                           # Утилиты и хелперы
│   │   ├── utils.ts                  # Общие утилиты
│   │   ├── validators.ts             # Валидаторы форм
│   │   ├── formatters.ts             # Форматирование (цены, даты)
│   │   ├── constants.ts              # Константы приложения
│   │   └── queryClient.ts            # React Query configuration
│   │
│   ├── types/                         # TypeScript типы
│   │   ├── api.types.ts              # API response/request типы
│   │   ├── warehouse.types.ts
│   │   ├── box.types.ts
│   │   ├── booking.types.ts
│   │   ├── user.types.ts
│   │   └── index.ts
│   │
│   ├── styles/                        # Стили
│   │   ├── globals.css               # Глобальные стили + Tailwind
│   │   ├── variables.css             # CSS переменные (цвета, шрифты)
│   │   └── themes/                   # Темы (если нужны)
│   │
│   └── config/                        # Конфигурация
│       ├── env.ts                    # Environment variables
│       ├── routes.ts                 # Роуты приложения
│       └── api.config.ts             # API endpoints
│
├── public/                            # Статика
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

### Назначение ключевых директорий

| Директория | Назначение |
|------------|------------|
| **`app/`** | Next.js App Router — файловая маршрутизация, layouts, страницы |
| **`components/layout/`** | Общие layout-компоненты (Header, Footer, Sidebar) |
| **`components/ui/`** | Базовые переиспользуемые UI-компоненты (Button, Input, Modal) |
| **`components/features/`** | Доменные компоненты, специфичные для фич (warehouses, booking, map) |
| **`hooks/`** | Custom React hooks для переиспользования логики |
| **`stores/`** | Zustand stores для глобального состояния |
| **`services/api/`** | API-слой: функции для запросов к backend |
| **`lib/`** | Утилиты, хелперы, конфигурация React Query |
| **`types/`** | TypeScript типы и интерфейсы |
| **`styles/`** | Глобальные стили, CSS-переменные |
| **`config/`** | Конфигурационные файлы (env, routes, api endpoints) |

---

## 1.2. Страницы и роутинг

### Структура роутинга

Next.js App Router использует файловую систему для определения роутов. Все страницы находятся в директории `app/`.

> **Frontend clarification:**
> - Route Groups `(public)`, `(auth)`, `(protected)` — это организационная структура, которая НЕ влияет на URL.
> - Middleware защищает роуты на уровне сервера (Edge Runtime).
> - ProtectedRoute компонент — дополнительная клиентская защита для UX.
> - Оба уровня защиты (middleware + ProtectedRoute) **MUST** использоваться вместе для защищённых роутов.

#### Публичные страницы (без авторизации)

| URL | Файл | Описание |
|-----|------|----------|
| `/` | `app/(public)/page.tsx` | Главная страница: поиск, AI-рекомендации |
| `/catalog` | `app/(public)/catalog/page.tsx` | Каталог складов: список, фильтры, сортировка |
| `/catalog/[id]` | `app/(public)/catalog/[id]/page.tsx` | Карточка склада: детали, фото, боксы, отзывы |
| `/map` | `app/(public)/map/page.tsx` | Карта складов с кластерами и фильтрами |
| `/booking/[warehouseId]` | `app/(public)/booking/[warehouseId]/page.tsx` | Форма бронирования бокса |
| `/about` | `app/(public)/about/page.tsx` | О проекте |

#### Страницы авторизации

| URL | Файл | Описание |
|-----|------|----------|
| `/login` | `app/(auth)/login/page.tsx` | Вход в систему |
| `/register` | `app/(auth)/register/page.tsx` | Регистрация (user/operator) |
| `/reset-password` | `app/(auth)/reset-password/page.tsx` | Восстановление пароля |

#### Личный кабинет пользователя (защищённые роуты)

| URL | Файл | Описание |
|-----|------|----------|
| `/profile` | `app/(protected)/profile/page.tsx` | Профиль пользователя |
| `/profile/bookings` | `app/(protected)/profile/bookings/page.tsx` | Мои бронирования |
| `/profile/favorites` | `app/(protected)/profile/favorites/page.tsx` | Избранные склады |
| `/profile/settings` | `app/(protected)/profile/settings/page.tsx` | Настройки профиля |

#### Личный кабинет оператора (защищённые роуты)

| URL | Файл | Описание |
|-----|------|----------|
| `/operator` | `app/(protected)/operator/page.tsx` | Dashboard оператора: метрики, активность |
| `/operator/warehouses` | `app/(protected)/operator/warehouses/page.tsx` | Управление складами |
| `/operator/warehouses/[id]` | `app/(protected)/operator/warehouses/[id]/page.tsx` | Редактирование склада |
| `/operator/warehouses/new` | `app/(protected)/operator/warehouses/new/page.tsx` | Добавление нового склада |
| `/operator/boxes` | `app/(protected)/operator/boxes/page.tsx` | Управление боксами |
| `/operator/bookings` | `app/(protected)/operator/bookings/page.tsx` | Заявки на бронирование |
| `/operator/reviews` | `app/(protected)/operator/reviews/page.tsx` | Управление отзывами |
| `/operator/analytics` | `app/(protected)/operator/analytics/page.tsx` | Аналитика и отчёты |
| `/operator/settings` | `app/(protected)/operator/settings/page.tsx` | Настройки оператора |

### Динамические сегменты

Next.js использует квадратные скобки для динамических параметров:

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

### Группы роутов (Route Groups)

Используются скобки `()` для организации без влияния на URL:

- `(public)` — публичные страницы
- `(auth)` — страницы авторизации
- `(protected)` — защищённые страницы с middleware проверкой

### Middleware для защиты роутов

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

  // Проверка роли для operator routes
  if (request.nextUrl.pathname.startsWith('/operator')) {
    // TODO: Decode JWT и проверить role === 'operator'
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/operator/:path*']
};
```

---

## 1.3. Компоненты (структура и уровни)

Компоненты организованы по трём уровням абстракции:

### 1. Layout-компоненты (структурные)

Отвечают за общую структуру страниц.

**Компоненты:**
- `MainLayout` — общий каркас для публичных страниц (Header + Footer)
- `OperatorLayout` — каркас для ЛК оператора (Sidebar + Header)
- `Header` — навигация, поиск, кнопки auth
- `Footer` — ссылки, контакты
- `Sidebar` — боковое меню (для ЛК оператора)

**Пример:**
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

### 2. Feature-компоненты (доменная логика)

Специфичные для бизнес-доменов компоненты с логикой.

#### Домен: Warehouses
- `WarehouseCard` — карточка склада в каталоге
- `WarehouseList` — список складов с пагинацией
- `WarehouseFilters` — панель фильтров (цена, размер, атрибуты)
- `WarehouseDetails` — полная информация о складе
- `WarehouseGallery` — галерея фото

#### Домен: Boxes
- `BoxCard` — карточка бокса с ценой и доступностью
- `BoxList` — список боксов склада
- `BoxSelector` — выбор бокса при бронировании
- `BoxManager` — управление боксами (для оператора)

#### Домен: Booking
- `BookingForm` — форма бронирования
- `BookingDatePicker` — выбор дат аренды
- `BookingPriceCalculator` — калькулятор цены
- `BookingConfirmation` — подтверждение бронирования
- `BookingList` — список бронирований пользователя

#### Домен: Map
- `MapView` — основной компонент карты (Google Maps)
- `MapMarker` — маркер склада
- `MapCluster` — кластер маркеров
- `MapPopup` — всплывающее окно с информацией о складе
- `MapControls` — кнопки управления картой

#### Домен: Reviews
- `ReviewCard` — карточка отзыва
- `ReviewList` — список отзывов с пагинацией
- `ReviewForm` — форма добавления отзыва
- `ReviewStats` — статистика рейтинга

#### Домен: Operator
- `DashboardMetrics` — метрики dashboard (occupancy, revenue)
- `WarehouseManager` — управление складами
- `BookingRequestList` — список заявок на бронирование
- `BookingRequestCard` — карточка заявки
- `AnalyticsCharts` — графики аналитики

#### Домен: AI

> **Frontend clarification — AI COMPONENTS STATUS:**
> 
> Все AI-компоненты имеют следующий статус для MVP:
> 
> | Компонент | Статус | Описание |
> |-----------|--------|----------|
> | `AIBoxFinder` | **MVP STUB** | Feature-flagged, базовый UI |
> | `AIChat` | **POST-MVP** | Не реализовывать в MVP |
> | `AIRecommendations` | **MVP STUB** | Feature-flagged, базовый UI |
> 
> **Что значит MVP STUB:**
> 1. Компонент **MUST** быть создан с базовым UI
> 2. Компонент **MUST** быть обёрнут в feature flag (`NEXT_PUBLIC_FEATURE_AI_ENABLED`)
> 3. При `FEATURE_AI_ENABLED=false` — компонент НЕ рендерится
> 4. При `FEATURE_AI_ENABLED=true` — компонент отправляет запрос к AI API
> 5. Если AI API недоступен — показать fallback UI (стандартный поиск)
> 
> **Пример feature flag:**
> ```typescript
> export function AIBoxFinder() {
>   if (process.env.NEXT_PUBLIC_FEATURE_AI_ENABLED !== 'true') {
>     return null; // или fallback компонент
>   }
>   // ... AI логика
> }
> ```

- `AIBoxFinder` — виджет AI-подбора бокса — **MVP STUB** (feature-flagged)
- `AIChat` — чат с AI-ассистентом — **POST-MVP**
- `AIRecommendations` — блок рекомендаций — **MVP STUB** (feature-flagged)

### 3. UI-компоненты (базовые)

Переиспользуемые примитивы без бизнес-логики.

**Компоненты:**
- `Button` — кнопка с вариантами (primary, secondary, ghost)
- `Input` — текстовое поле
- `Select` — выпадающий список
- `Checkbox` / `Radio` — чекбоксы и радиокнопки
- `Modal` — модальное окно
- `Card` — карточка контента
- `Badge` — бейдж (статус, метка)
- `Skeleton` — загрузочные placeholder
- `Toast` — уведомления
- `Tabs` — вкладки
- `Dropdown` — выпадающее меню
- `Spinner` — индикатор загрузки

**Пример компонента Button:**
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

Для управления состоянием используется комбинация **React Query** (серверное состояние) + **Zustand** (клиентское состояние).

> **Frontend clarification:**
> - React Query — для ВСЕХ данных, получаемых с сервера (warehouses, boxes, bookings, reviews, user data).
> - Zustand — ТОЛЬКО для клиентского состояния (UI state, фильтры, состояние карты).
> - НЕ дублировать серверные данные в Zustand.
> - НЕ использовать Redux, MobX или другие state managers.

### Принципы распределения состояния

| Тип данных | Инструмент | Примеры |
|------------|------------|---------|
| **Серверные данные** | React Query | Склады, боксы, бронирования, отзывы |
| **Глобальное UI-состояние** | Zustand | Авторизация, модалки, тосты, фильтры |
| **Локальное состояние** | useState/useReducer | Состояние форм, UI-компонентов |
| **URL-параметры** | Next.js searchParams | Фильтры каталога, пагинация, сортировка |

### React Query для серверного состояния

**Настройка:**
```typescript
// lib/queryClient.ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,        // 5 минут
      cacheTime: 10 * 60 * 1000,       // 10 минут
      refetchOnWindowFocus: false,
      retry: 1,
    },
    mutations: {
      retry: 1,
    },
  },
});
```

**Использование для складов:**
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

// Prefetching для быстрой навигации
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

**Мутации (создание бронирования):**
```typescript
// hooks/useBooking.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingsApi } from '@/services/api/bookings.api';

export function useCreateBooking() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: bookingsApi.create,
    onSuccess: () => {
      // Инвалидация кэша бронирований
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      
      // Показать тост
      toast.success('Бронирование создано!');
    },
    onError: (error) => {
      toast.error('Ошибка при создании бронирования');
    },
  });
}
```

### Zustand для глобального состояния

**1. Auth Store (авторизация)**

> **Frontend clarification — AUTH STORE (CANONICAL):**
> 
> **ЕДИНСТВЕННАЯ модель хранения:**
> - `auth_token` — httpOnly cookie, **недоступна JS-коду**, устанавливается сервером
> - `refresh_token` — httpOnly cookie, **недоступна JS-коду**, устанавливается сервером
> - Zustand store хранит **ТОЛЬКО**: `user`, `isAuthenticated`, `isLoading`
> 
> **Zustand НЕ хранит и НЕ знает о токенах.**
> Токены передаются браузером автоматически через cookies.
> Frontend не имеет доступа к значениям токенов.

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
        // Backend устанавливает httpOnly cookies автоматически
        // Frontend получает только user data
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

**2. Filters Store (фильтры каталога)**
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

**3. Map Store (состояние карты)**
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
  center: [55.751244, 37.618423], // Москва
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

**4. UI Store (модалки, тосты)**
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

### Оптимистичные обновления

Для улучшения UX используются оптимистичные обновления:

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

    // Оптимистичное обновление
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

    // Откат при ошибке
    onError: (err, variables, context) => {
      queryClient.setQueryData(['favorites'], context?.previousFavorites);
      toast.error('Ошибка при обновлении избранного');
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });
}
```

---

## 1.5. Сервисы API и синхронизация с backend

### Базовый API клиент (Axios)

> **Frontend clarification — API RESPONSE FORMAT:**
> 
> Backend ВСЕГДА возвращает ответы в следующем формате:
> 
> **Успешный ответ:**
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
> **Ответ с пагинацией:**
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
> **Ответ с ошибкой:**
> ```json
> {
>   "success": false,
>   "error": {
>     "code": "VALIDATION_ERROR",
>     "message": "Описание ошибки",
>     "details": { ... }
>   }
> }
> ```
> 
> Frontend **MUST** обрабатывать все три формата.

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
  withCredentials: true,  // CRITICAL: включает автоматическую передачу httpOnly cookies
});

// Request Interceptor: логирование (опционально)
// НЕ добавляем Authorization header — auth_token передаётся автоматически через cookies
apiClient.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

// Response Interceptor: обработка ошибок
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorResponse>) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    // 401: Сессия истекла — пробуем refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Refresh token передаётся автоматически через httpOnly cookie
        // Backend сам обновляет cookies — frontend не получает токены
        await axios.post(`${API_BASE_URL}/auth/refresh`, {}, { 
          withCredentials: true 
        });
        
        // Повторяем оригинальный запрос — новые cookies уже установлены
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh не удался — выходим из системы
        useAuthStore.getState().logout();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // 403: Недостаточно прав
    if (error.response?.status === 403) {
      toast.error('Недостаточно прав для выполнения действия');
    }

    // 429: Rate limit
    if (error.response?.status === 429) {
      toast.error('Слишком много запросов. Попробуйте позже');
    }

    // 500: Серверная ошибка
    if (error.response?.status === 500) {
      toast.error('Ошибка сервера. Мы уже работаем над её исправлением');
    }

    return Promise.reject(error);
  }
);
```

### API-сервисы по доменам

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
    // Backend устанавливает httpOnly cookies автоматически
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data;
  },

  logout: async () => {
    // Backend очищает httpOnly cookies
    const response = await apiClient.post('/auth/logout');
    return response.data;
  },

  // Refresh происходит автоматически через cookies
  // Frontend НЕ передаёт и НЕ получает токены
  refreshToken: async () => {
    const response = await apiClient.post('/auth/refresh');
    return response.data;
  },

  resetPassword: async (email: string) => {
    const response = await apiClient.post('/auth/reset-password', { email });
    return response.data;
  },
  
  // Получение текущего пользователя (для инициализации)
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

### Типизация API ответов

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

## 1.6. Работа с картами

Для отображения карты используется **Google Maps API** (основная) с возможностью переключения на **Google Maps** (резервная).

> **Frontend clarification — MAP PROVIDER:**
> 
> | Провайдер | Статус |
> |-----------|--------|
> | Google Maps API | **MUST** для MVP |
> | Google Maps | **POST-MVP** (резервный) |
> 
> - Файл `googleMaps.ts` **MAY** быть создан как заглушка
> - Файл `mapProvider.ts` (абстракция) — **SHOULD** для будущей расширяемости
> 
> **MAP RESPONSIBILITY SPLIT:**
> 
> | Ответственность | Backend | Frontend |
> |-----------------|---------|----------|
> | Фильтрация складов по bounds | ✅ | ❌ |
> | Серверная кластеризация | ✅ (опционально) | ❌ |
> | Визуальная кластеризация | ❌ | ✅ (Google Maps SDK) |
> | Рендеринг маркеров/кластеров | ❌ | ✅ |
> | Геолокация пользователя | ❌ | ✅ |

### Структура модуля карты

```
src/
├── services/maps/
│   ├── yandexMaps.ts          # Google Maps SDK wrapper
│   ├── googleMaps.ts          # Google Maps SDK wrapper (резерв)
│   └── mapProvider.ts         # Абстракция над картами
│
├── components/features/map/
│   ├── MapView.tsx            # Основной компонент карты
│   ├── MapMarker.tsx          # Маркер склада
│   ├── MapCluster.tsx         # Кластер маркеров
│   ├── MapPopup.tsx           # Popup с информацией
│   ├── MapControls.tsx        # Кнопки управления
│   └── MapSkeleton.tsx        # Loading state
│
└── hooks/
    └── useMap.ts              # Hook для работы с картой
```

### Google Maps SDK Wrapper

```typescript
// services/maps/yandexMaps.ts
declare global {
  interface Window {
    ymaps: any;
  }
}

export class YandexMapsService {
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

          // Инициализация кластеризатора
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
        <p class="price">от ${warehouse.price_from.toLocaleString()} AED /мес</p>
        <p class="rating">★ ${warehouse.rating} (${warehouse.review_count})</p>
        <a href="/catalog/${warehouse.id}" class="btn-primary">Подробнее</a>
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

### React Hook для карты

```typescript
// hooks/useMap.ts
import { useEffect, useRef, useState } from 'react';
import { YandexMapsService } from '@/services/maps/yandexMaps';
import { useMapStore } from '@/stores/mapStore';

export function useMap(containerId: string) {
  const mapServiceRef = useRef<YandexMapsService | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  
  const { center, zoom, setBounds, selectWarehouse } = useMapStore();

  useEffect(() => {
    const initMap = async () => {
      try {
        const mapService = new YandexMapsService();
        await mapService.init(containerId, center, zoom);

        // Подписка на изменение bounds
        mapService.onBoundsChange((bounds) => {
          setBounds(bounds);
        });

        // Обработчик клика по маркеру
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

### Компонент MapView

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

  // Загрузка кластеров/маркеров
  const { data: mapData, isLoading } = useQuery({
    queryKey: ['map-warehouses', bounds, zoom, filters],
    queryFn: () => mapApi.getClusters(bounds!, zoom, filters),
    enabled: !!bounds && isLoaded,
    staleTime: 5 * 60 * 1000,
  });

  // Обновление маркеров при изменении данных
  useEffect(() => {
    if (!mapService || !mapData) return;

    mapService.clearMarkers();

    // Добавление маркеров складов
    mapData.data.warehouses.forEach((warehouse) => {
      mapService.addMarker(warehouse);
    });
  }, [mapData, mapService]);

  // Подсветка выбранного склада
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
          Загрузка складов...
        </div>
      )}
    </div>
  );
}
```

### Синхронизация карты со списком

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
      {/* ... содержимое карточки ... */}
      <button onClick={handleViewOnMap}>
        Показать на карте
      </button>
    </div>
  );
}
```

### Кластеризация

Google Maps автоматически кластеризует маркеры на основе:
- **Zoom < 10**: кластеры с радиусом 5000м
- **Zoom 10-13**: кластеры с радиусом 1000м
- **Zoom 14-15**: кластеры с радиусом 500м
- **Zoom > 15**: отдельные маркеры

Backend возвращает данные уже с учётом zoom-уровня:
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

## 1.7. Работа с авторизацией

> **Frontend clarification — CANONICAL AUTH FLOW (MVP):**
> 
> Это **ЕДИНСТВЕННЫЙ** поддерживаемый способ авторизации для MVP:
> 
> **1. Login Flow:**
> ```
> User → POST /auth/login (email, password)
>      ← Set-Cookie: auth_token (httpOnly, 15 min)
>      ← Set-Cookie: refresh_token (httpOnly, 7 days)
>      ← { success: true, data: { user: {...} } }
> Frontend → Сохранить user в authStore
> ```
> 
> **2. Request Flow:**
> ```
> Frontend → GET /any-endpoint (cookies отправляются автоматически)
> Backend → Проверяет auth_token из cookie
>        ← 200 OK или 401 Unauthorized
> ```
> 
> **3. Token Refresh Flow:**
> ```
> Frontend → Получает 401 на любой запрос
>         → POST /auth/refresh (refresh_token из cookie автоматически)
>         ← Новые cookies (auth_token, refresh_token)
>         → Повторяет оригинальный запрос
> ```
> 
> **4. Logout Flow:**
> ```
> Frontend → POST /auth/logout
>         ← Cookies очищаются сервером
> Frontend → Очистить authStore
>         → Очистить React Query cache
>         → Редирект на /
> ```
> 
> **АЛЬТЕРНАТИВНЫЕ ПОДХОДЫ — ЗАПРЕЩЕНЫ:**
> - LocalStorage для токенов — **ЗАПРЕЩЕНО** (уязвимость XSS)
> - Bearer token в заголовке — **ЗАПРЕЩЕНО**
> - Хранение токенов в Zustand/Redux — **ЗАПРЕЩЕНО**
> - Чтение токенов из JS-кода — **НЕВОЗМОЖНО** (httpOnly)

### Хранение токенов

**Токены хранятся ТОЛЬКО в httpOnly cookies**, которые:
- Устанавливаются **ТОЛЬКО сервером** (backend)
- **Недоступны** из JavaScript-кода
- Передаются браузером **автоматически** при каждом запросе
- Очищаются **ТОЛЬКО сервером** при logout

> **Frontend clarification:**
> Функции ниже работают **ТОЛЬКО в Server Components и API Routes**.
> В Client Components эти функции **НЕДОСТУПНЫ** — cookies управляются браузером автоматически.
> Frontend-разработчикам **НЕ нужно** вызывать эти функции напрямую.

```typescript
// lib/auth.ts (Server-side ONLY — для API Routes и Server Components)
import { cookies } from 'next/headers';

// Проверка наличия сессии (для Server Components)
export function hasAuthSession(): boolean {
  return !!cookies().get('auth_token')?.value;
}

// Очистка cookies (вызывается из API Route при logout)
export function clearAuthCookies() {
  cookies().delete('auth_token');
  cookies().delete('refresh_token');
}

// ВАЖНО: Frontend НЕ устанавливает cookies напрямую
// Cookies устанавливаются ТОЛЬКО backend при POST /auth/login
```

### Middleware для защиты роутов

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

  // Публичные роуты — пропускаем всех
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Если нет токена и пытается попасть на защищённую страницу
  if (!token && protectedRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Если есть токен и пытается попасть на auth страницы — редирект на главную
  if (token && authRoutes.some(route => pathname === route)) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Проверка роли для operator роутов
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

### ProtectedRoute компонент

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

### Использование в Layout

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

### Автоматическое обновление токена

Обрабатывается в axios interceptor (см. раздел 1.5):

```typescript
// Логика в apiClient interceptor
if (error.response?.status === 401 && !originalRequest._retry) {
  originalRequest._retry = true;
  
  // refresh_token передаётся автоматически через httpOnly cookie
  // Backend обновляет cookies — frontend НЕ получает токены
  await axios.post(`${API_BASE_URL}/auth/refresh`, {}, { withCredentials: true });
  
  // Повторяем запрос — новые cookies уже установлены браузером
  return apiClient(originalRequest);
}
```

> **Frontend clarification:**
> - Frontend **НЕ читает** refresh_token
> - Frontend **НЕ получает** новый auth_token
> - Backend сам обновляет httpOnly cookies
> - Frontend просто повторяет запрос после успешного refresh

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
      // Очистка store
      logoutStore();
      
      // Очистка всех query кэшей
      queryClient.clear();
      
      // Редирект на главную
      router.push('/');
    }
  };

  return { logout };
}
```

---

## 1.8. Работа с формами и валидацией

### Библиотека: React Hook Form + Zod

> **Frontend clarification:**
> - Все схемы валидации **MUST** соответствовать backend валидации
> - При расхождении — приоритет у backend (frontend показывает ошибки от backend)
> - Email и password requirements **MUST** быть согласованы с Security документацией
> 
> **Принципы работы с формами:**
> 1. Валидация на клиенте (Zod) — **MUST**
> 2. Показ ошибок под полями — **MUST**
> 3. Disabled-состояния при отправке — **MUST**
> 4. Loading state на кнопке — **MUST**
> 5. Toast-уведомления — **MUST**
> 6. Server-side errors — **MUST** показывать пользователю

```bash
npm install react-hook-form zod @hookform/resolvers
```

### Схемы валидации (Zod)

```typescript
// lib/validators.ts
import { z } from 'zod';

// Регистрация
export const registerSchema = z.object({
  email: z
    .string()
    .email('Некорректный email')
    .min(1, 'Email обязателен'),
  
  password: z
    .string()
    .min(8, 'Минимум 8 символов')
    .regex(/[A-Z]/, 'Должна быть хотя бы одна заглавная буква')
    .regex(/[a-z]/, 'Должна быть хотя бы одна строчная буква')
    .regex(/[0-9]/, 'Должна быть хотя бы одна цифра')
    .regex(/[^A-Za-z0-9]/, 'Должен быть хотя бы один спецсимвол'),
  
  name: z
    .string()
    .min(2, 'Минимум 2 символа')
    .max(100, 'Максимум 100 символов'),
  
  phone: z
    .string()
    .regex(/^\+7\d{10}$/, 'Формат: +7XXXXXXXXXX'),
  
  agreeToTerms: z
    .boolean()
    .refine(val => val === true, 'Необходимо согласие с условиями'),
});

export type RegisterFormData = z.infer<typeof registerSchema>;

// Бронирование
export const bookingSchema = z.object({
  boxId: z.number().min(1, 'Выберите бокс'),
  
  startDate: z
    .string()
    .min(1, 'Выберите дату начала')
    .refine((date) => new Date(date) >= new Date(), 'Дата не может быть в прошлом'),
  
  durationMonths: z
    .number()
    .min(1, 'Минимум 1 месяц')
    .max(12, 'Максимум 12 месяцев'),
  
  userComment: z
    .string()
    .max(500, 'Максимум 500 символов')
    .optional(),
  
  agreeToTerms: z
    .boolean()
    .refine(val => val === true, 'Необходимо согласие с условиями'),
});

export type BookingFormData = z.infer<typeof bookingSchema>;

// Отзыв
export const reviewSchema = z.object({
  rating: z
    .number()
    .min(1, 'Минимум 1 звезда')
    .max(5, 'Максимум 5 звёзд'),
  
  text: z
    .string()
    .min(10, 'Минимум 10 символов')
    .max(1000, 'Максимум 1000 символов'),
  
  pros: z
    .string()
    .max(500, 'Максимум 500 символов')
    .optional(),
  
  cons: z
    .string()
    .max(500, 'Максимум 500 символов')
    .optional(),
});

export type ReviewFormData = z.infer<typeof reviewSchema>;
```

### Пример формы регистрации

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
      toast.success('Регистрация успешна!');
      router.push('/profile');
    } catch (error) {
      toast.error('Ошибка при регистрации');
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
        label="Пароль"
        type="password"
        {...register('password')}
        error={errors.password?.message}
      />

      <Input
        label="Имя"
        {...register('name')}
        error={errors.name?.message}
      />

      <Input
        label="Телефон"
        placeholder="+79991234567"
        {...register('phone')}
        error={errors.phone?.message}
      />

      <Checkbox
        label="Я согласен с условиями использования"
        {...register('agreeToTerms')}
        error={errors.agreeToTerms?.message}
      />

      <Button 
        type="submit" 
        fullWidth 
        isLoading={isSubmitting}
      >
        Зарегистрироваться
      </Button>
    </form>
  );
}
```

### Пример формы бронирования

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
      toast.success('Заявка отправлена!');
      router.push('/profile/bookings');
    } catch (error) {
      toast.error('Ошибка при создании бронирования');
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
            label="Дата начала аренды"
            value={field.value}
            onChange={field.onChange}
            minDate={new Date()}
            error={errors.startDate?.message}
          />
        )}
      />

      <div>
        <label className="block text-sm font-medium mb-2">
          Срок аренды
        </label>
        <select
          {...register('durationMonths', { valueAsNumber: true })}
          className="w-full border rounded-lg p-2"
        >
          <option value={1}>1 месяц</option>
          <option value={3}>3 месяца (скидка 5%)</option>
          <option value={6}>6 месяцев (скидка 10%)</option>
          <option value={12}>12 месяцев (скидка 15%)</option>
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
        placeholder="Комментарий к заявке (необязательно)"
        className="w-full border rounded-lg p-3"
        rows={3}
      />
      {errors.userComment && (
        <p className="text-red-500 text-sm">{errors.userComment.message}</p>
      )}

      <Checkbox
        label="Я согласен с условиями аренды"
        {...register('agreeToTerms')}
        error={errors.agreeToTerms?.message}
      />

      <Button
        type="submit"
        fullWidth
        size="lg"
        isLoading={isSubmitting}
      >
        Отправить заявку
      </Button>
    </form>
  );
}
```

### Общие принципы работы с формами

1. **Валидация на клиенте** — через Zod схемы
2. **Валидация на сервере** — backend всегда проверяет данные
3. **Показ ошибок** — под полями ввода, красным цветом
4. **Disabled-состояния** — во время отправки формы
5. **Спиннеры** — кнопка submit показывает loading state
6. **Toast-уведомления** — успех/ошибка после отправки

---

# Раздел 2: UI-слой

## 2.1. Принципы дизайн-системы

### Базовые принципы

Дизайн-система построена на следующих принципах:

1. **Консистентность** — единый визуальный язык во всех компонентах
2. **Масштабируемость** — компоненты легко расширяются и переиспользуются
3. **Доступность** — соответствие WCAG 2.1 AA
4. **Производительность** — оптимизация рендеринга, lazy loading
5. **Mobile-first** — адаптивность с приоритетом мобильных устройств

### Цветовая палитра

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

### Типографика

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

## 2.2. UI-компоненты

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

См. подробные реализации в полной версии документа.

### Доменные компоненты

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
      <p>от {warehouse.price_from.toLocaleString()} AED /мес</p>
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
      <p>{box.dimensions.width} × {box.dimensions.length} × {box.dimensions.height} см</p>
      <p>Объём: ~{box.volume_m3} м³</p>
      <div>{box.available_quantity} свободно</div>
      <p className="price">{box.price_per_month.toLocaleString()} AED /мес</p>
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
      <h3>Расчёт стоимости</h3>
      <div>Цена за месяц: {pricePerMonth.toLocaleString()} AED </div>
      {discount > 0 && <div>Скидка: -{discount}%</div>}
      <div className="total">Итого: {totalPrice.toLocaleString()} AED </div>
    </Card>
  );
}
```

## 2.3. Best practices по композиции интерфейсов

### 1. Разделение контейнеров и презентационных компонентов

**Презентационные** — только UI, получают данные через props  
**Контейнерные** — бизнес-логика, API-запросы, state management

### 2. Минимизация проп-дриллинга

- Context API для глубоко вложенных данных
- Custom hooks для переиспользования логики
- Composition через children

### 3. Переиспользование блоков

```typescript
// EmptyState - универсальный компонент для пустых состояний
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

### 4. Адаптивность (Mobile-first)

```typescript
// Responsive grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
  {warehouses.map(w => <WarehouseCard key={w.id} warehouse={w} />)}
</div>

// Responsive Map
export function MapViewResponsive() {
  const { isMd } = useBreakpoint();
  
  if (!isMd) {
    return <Button onClick={() => router.push('/map')}>Показать на карте</Button>;
  }
  
  return <MapView />;
}
```


---

# Раздел 3: Технический стек

## 3.1. Framework: Next.js + React

### Выбор: Next.js 14 (App Router) + React 18

**Аргументация:**
- ✅ SSR для SEO критичных страниц
- ✅ Automatic code splitting
- ✅ Image optimization из коробки
- ✅ Файловая маршрутизация
- ✅ API Routes для BFF
- ✅ TypeScript support

### Конфигурация

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

| Страница | Стратегия | Обоснование |
|----------|-----------|-------------|
| Главная (`/`) | SSR | SEO + динамический контент |
| Каталог (`/catalog`) | SSR | SEO + фильтры в URL |
| Карточка склада (`/catalog/[id]`) | SSR | SEO критично |
| Карта (`/map`) | CSR | Полностью клиентская |
| ЛК (`/profile/*`) | CSR | Требует auth, SEO не нужно |
| Статические (`/about`) | SSG | Не меняется |

## 3.2. Библиотека карт

### Выбор: Google Maps (основная) + Google Maps (fallback)

**Аргументация:**
- ✅ Отличное покрытие РФ/СНГ
- ✅ Бесплатно до 25k запросов/день
- ✅ Встроенная кластеризация
- ✅ Качественная русская документация

```typescript
// Подключение Google Maps
export function loadYandexMapsScript(apiKey: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `https://api-maps.yandex.ru/2.1/?apikey=${apiKey}&lang=ru_RU`;
    script.async = true;
    script.onload = () => resolve();
    document.head.appendChild(script);
  });
}
```

## 3.3. Работа с API

### Выбор: Axios

**Аргументация:**
- ✅ Interceptors для обработки ошибок
- ✅ Timeout из коробки
- ✅ Автоматический JSON
- ✅ Отличная типизация

```typescript
// Базовый клиент
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 30000,
  withCredentials: true,  // CRITICAL: для передачи httpOnly cookies
});

// Request interceptor — НЕ добавляем Authorization header
// auth_token передаётся автоматически через cookies
apiClient.interceptors.request.use((config) => config);

// Response interceptor для refresh token
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Refresh через cookies, см. раздел 1.5
      await axios.post('/auth/refresh', {}, { withCredentials: true });
      return apiClient(error.config);  // Повтор запроса
    }
    return Promise.reject(error);
  }
);
```

## 3.4. State-management

### Выбор: React Query + Zustand

| Инструмент | Назначение |
|------------|------------|
| React Query | Серверное состояние (API данные) |
| Zustand | Глобальное клиентское состояние |

**React Query:**
- ✅ Автоматическое кэширование
- ✅ Background refetching
- ✅ Optimistic updates
- ✅ DevTools

**Zustand:**
- ✅ Минималистичный API
- ✅ Не требует Provider
- ✅ Middleware (persist, devtools)
- ✅ ~1KB размер

```typescript
// React Query setup
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,  // 5 минут
      gcTime: 10 * 60 * 1000,     // 10 минут
      refetchOnWindowFocus: false,
    },
  },
});

// Zustand store — НЕ хранит токены
export const useAuthStore = create(persist(
  (set) => ({
    user: null,
    isAuthenticated: false,
    login: async (email, password) => {
      // Backend устанавливает httpOnly cookies
      const response = await authApi.login(email, password);
      set({ user: response.data.user, isAuthenticated: true });
    },
    logout: () => set({ user: null, isAuthenticated: false }),
  }),
  { name: 'auth-storage' }
));
```

## 3.5. Оптимизации

### 1. Lazy Loading

```typescript
// Динамический импорт тяжёлых компонентов
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
        test: /[\\/]node_modules[\\/](ymaps|@yandex)/,
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
// Prefetch следующей страницы
<Link href="/catalog" prefetch>Каталог</Link>

// Prefetch данных при hover
const handleMouseEnter = () => {
  queryClient.prefetchQuery({
    queryKey: ['warehouse', warehouse.id],
    queryFn: () => warehousesApi.getById(warehouse.id),
  });
};
```


---

# Раздел 4: План разработки

## 4.1. Спринты и фазы

Разработка MVP разбита на **6 спринтов по 2 недели** (всего 12 недель / 3 месяца).

### Roadmap

| Спринт | Недели | Фокус | Ключевые задачи |
|--------|--------|-------|-----------------|
| **1** | 1-2 | Инфраструктура | Setup, UI Kit, дизайн-система |
| **2** | 3-4 | Каталог и поиск | Главная, каталог, фильтры |
| **3** | 5-6 | Детали и карта | Карточка склада, карта с кластерами |
| **4** | 7-8 | Auth и бронирование | Регистрация, форма бронирования, ЛК |
| **5** | 9-10 | Оператор | Dashboard, управление складами/боксами |
| **6** | 11-12 | AI и финализация | AI-модули, оптимизация, тестирование |

### Спринт 1: Инфраструктура (недели 1-2)

**Задачи:**
- [ ] Setup Next.js 14 + TypeScript
- [ ] Настройка ESLint, Prettier, Husky
- [ ] Tailwind CSS + дизайн-система
- [ ] Базовые UI-компоненты (Button, Input, Card, Modal, etc.)
- [ ] Layout компоненты (Header, Footer)
- [ ] State management setup (React Query + Zustand)
- [ ] API client (Axios с interceptors)

**Результат:** ✅ Готовая инфраструктура и UI Kit

### Спринт 2: Каталог (недели 3-4)

**Задачи:**
- [ ] Главная страница с поиском
- [ ] Страница каталога `/catalog`
- [ ] WarehouseCard компонент
- [ ] Фильтры (город, цена, размер, атрибуты)
- [ ] Сортировка и пагинация
- [ ] API интеграция warehouses
- [ ] Mock данные (MSW)

**Результат:** ✅ Рабочий каталог с фильтрами

### Спринт 3: Детали и карта (недели 5-6)

**Задачи:**
- [ ] Страница склада `/catalog/[id]`
- [ ] Галерея фото
- [ ] Список боксов
- [ ] Отзывы (preview)
- [ ] Google Maps интеграция
- [ ] Страница `/map` с кластеризацией
- [ ] Синхронизация карты со списком

**Результат:** ✅ Детальные страницы + работающая карта

### Спринт 4: Auth и бронирование (недели 7-8)

**Задачи:**
- [ ] Страницы `/login` и `/register`
- [ ] Формы с валидацией (Zod)
- [ ] Middleware для защиты роутов
- [ ] BookingForm с калькулятором цены
- [ ] ЛК пользователя `/profile`
- [ ] Список бронирований
- [ ] Избранные склады

**Результат:** ✅ Авторизация + бронирование

### Спринт 5: Оператор (недели 9-10)

**Задачи:**
- [ ] Operator Dashboard `/operator`
- [ ] Метрики и графики
- [ ] Управление складами
- [ ] Wizard создания склада
- [ ] Управление боксами
- [ ] Обработка заявок на бронирование

**Результат:** ✅ ЛК оператора

### Спринт 6: AI и финализация (недели 11-12)

**Задачи:**
- [ ] AIBoxFinder виджет
- [ ] AI-рекомендации
- [ ] ReviewForm
- [ ] Оптимизация производительности
- [ ] E2E тесты (Playwright)
- [ ] Lighthouse аудит (score > 90)
- [ ] Баг-фиксы

**Результат:** ✅ Готовый к релизу MVP

## 4.2. Интеграции с backend

### Фаза 1: Mock API (Спринты 1-2)

```typescript
// MSW для моков
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

### Фаза 2: Staging Backend (Спринты 3-4)

```typescript
// .env.local
NEXT_PUBLIC_API_URL=https://api-staging.storagecompare.ae/v1
NEXT_PUBLIC_USE_MOCKS=false
```

### Фаза 3: Production Backend (Спринты 5-6)

```typescript
// .env.production
NEXT_PUBLIC_API_URL=https://api.storagecompare.ae/v1
```

## 4.3. Тестирование

### Unit тесты (Jest + React Testing Library)

```typescript
// Тестирование UI-компонентов
describe('Button', () => {
  it('рендерится с текстом', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
  
  it('вызывает onClick', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    fireEvent.click(screen.getByText('Click'));
    expect(handleClick).toHaveBeenCalled();
  });
});
```

### Integration тесты

```typescript
// Тестирование форм
describe('BookingForm', () => {
  it('отправляет форму с корректными данными', async () => {
    render(<BookingForm warehouse={mock} box={mock} />);
    
    await user.type(screen.getByLabelText('Комментарий'), 'Test');
    await user.click(screen.getByText('Отправить'));
    
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();
    });
  });
});
```

### E2E тесты (Playwright)

```typescript
// Критичные сценарии
test('процесс бронирования', async ({ page }) => {
  await page.goto('/');
  await page.fill('[placeholder="Город"]', 'Москва');
  await page.click('button:has-text("Найти")');
  await page.click('[data-testid="warehouse-card"]:first-child');
  await page.click('button:has-text("Забронировать")');
  
  // Заполнение формы
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

**Покрытие тестами:**
- Unit тесты: 70%+ для утилит и UI-компонентов
- E2E тесты: критичные флоу (поиск, бронирование, auth)


---

# Раздел 5: Требования к производительности

## 5.1. Время загрузки

### Целевые метрики (Core Web Vitals)

| Метрика | Цель для MVP |
|---------|--------------|
| **LCP** (Largest Contentful Paint) | ≤ 2.5s |
| **FID** (First Input Delay) | ≤ 100ms |
| **CLS** (Cumulative Layout Shift) | ≤ 0.1 |
| **TTFB** (Time to First Byte) | ≤ 800ms |
| **FCP** (First Contentful Paint) | ≤ 1.8s |

### Lighthouse Score

| Категория | Минимум | Цель |
|-----------|---------|------|
| Performance | 85 | **90+** |
| Accessibility | 90 | **95+** |
| Best Practices | 90 | **95+** |
| SEO | 95 | **100** |

### Стратегии оптимизации

#### 1. SSR для критичных страниц

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
// Динамический импорт
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
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  preload: true,
});
```

## 5.2. Оптимизация карт

### 1. Ленивая загрузка библиотеки

```typescript
export function useMapLoader() {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        loadYandexMapsScript();
      }
    });
    
    observer.observe(mapContainerRef.current);
    return () => observer.disconnect();
  }, []);
}
```

### 2. Рендер только видимой области

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

### 3. Debounce для boundschange

```typescript
const debouncedSetBounds = useDebouncedCallback(
  (bounds: BoundingBox) => {
    setBounds(bounds);
  },
  500 // 500ms debounce
);
```

## 5.3. Кэширование

### 1. React Query кэш

```typescript
export function useWarehouses(filters) {
  return useQuery({
    queryKey: ['warehouses', filters],
    queryFn: () => warehousesApi.search(filters),
    staleTime: 5 * 60 * 1000,  // 5 минут
    gcTime: 10 * 60 * 1000,     // 10 минут
  });
}

// Справочники - кэш навсегда
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

### 3. LocalStorage для настроек

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

## 5.4. Пагинация, сортировка и фильтрация

### 1. Серверная пагинация

```typescript
export function useWarehouses(filters) {
  const [page, setPage] = useState(1);
  
  const { data, isLoading } = useQuery({
    queryKey: ['warehouses', { ...filters, page }],
    queryFn: () => warehousesApi.search({ ...filters, page, perPage: 12 }),
    keepPreviousData: true,  // Показываем старые данные при загрузке
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

// Автозагрузка при scroll
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

### 3. Фильтры в URL

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
    // ... заполняем params
    router.push(`/catalog?${params.toString()}`, { scroll: false });
  }, [router]);

  return { filters, updateFilters };
}
```

### 4. Индикация загрузки

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
        <EmptyState title="Не найдено" />
      ) : (
        <WarehouseList warehouses={warehouses} />
      )}
    </div>
  );
}
```

## Мониторинг производительности

### Web Vitals Tracking

```typescript
export function WebVitalsReporter() {
  useReportWebVitals((metric) => {
    // Отправка в Google Analytics
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

**Целевые размеры бандлов:**

| Тип | Размер (gzip) | Макс |
|-----|---------------|------|
| Initial JS | < 100 KB | 150 KB |
| Total JS | < 300 KB | 500 KB |
| CSS | < 30 KB | 50 KB |

---

# Заключение

Данный Frontend Implementation Plan описывает полную архитектуру, технический стек, план разработки и требования к производительности для MVP v1 агрегатора Self-Storage.

---

## Сводка по статусам компонентов

### AI компоненты

| Компонент | Статус MVP | Описание |
|-----------|------------|----------|
| `AIBoxFinder` | **MVP STUB** | Feature-flagged, базовый UI |
| `AIChat` | **POST-MVP** | Не реализовывать в MVP |
| `AIRecommendations` | **MVP STUB** | Feature-flagged, базовый UI |

### Авторизация

| Аспект | Статус | Описание |
|--------|--------|----------|
| httpOnly cookies | **MUST** | **ЕДИНСТВЕННЫЙ** способ хранения токенов |
| Middleware защита | **MUST** | Edge Runtime, jose для JWT |
| ProtectedRoute | **MUST** | Client-side fallback |
| Refresh token flow | **MUST** | Автоматический через cookies |
| withCredentials: true | **MUST** | Для всех axios запросов |
| LocalStorage для токенов | **ЗАПРЕЩЕНО** | Уязвимость XSS |
| Bearer token в header | **ЗАПРЕЩЕНО** | Не использовать |
| Токены в Zustand | **ЗАПРЕЩЕНО** | Store хранит только user data |

### Карты

| Аспект | Статус | Описание |
|--------|--------|----------|
| Google Maps | **MUST** | Основной провайдер |
| Google Maps | **POST-MVP** | Резервный провайдер |
| Клиентская кластеризация | **MUST** | Через Google Maps SDK |
| Серверная кластеризация | **SHOULD** | Для оптимизации (1000+ складов) |

### Страницы

| Группа | Статус |
|--------|--------|
| Публичные (`/`, `/catalog`, `/map`) | **MUST** |
| Auth (`/login`, `/register`) | **MUST** |
| Reset Password | **PLACEHOLDER** для MVP |
| Profile (`/profile/*`) | **MUST** основные, **SHOULD** settings |
| Operator (`/operator/*`) | **MUST** основные, **SHOULD** analytics |

### Производительность

| Метрика | Цель | Статус |
|---------|------|--------|
| LCP | ≤ 2.5s | **MUST** |
| FID | ≤ 100ms | **MUST** |
| CLS | ≤ 0.1 | **MUST** |
| Lighthouse Performance | ≥ 85 | **MUST** |
| Lighthouse SEO | ≥ 95 | **MUST** |

---

**Ключевые достижения документа:**
- ✅ Детальная архитектура фронтенда (структура, роутинг, компоненты, state)
- ✅ Полная дизайн-система и UI Kit
- ✅ Обоснованный технический стек (Next.js 14, React Query, Zustand, Google Maps)
- ✅ Подробный план разработки по спринтам (12 недель)
- ✅ Чёткие требования к производительности (Core Web Vitals, Lighthouse > 90)

**Готовность к передаче frontend-команде:**
- 📋 Структура проекта готова к setup
- 🎨 Дизайн-система и компоненты описаны
- 🔌 API интеграции определены
- 📅 Roadmap на 3 месяца детализирован
- ⚡ Оптимизации и best practices включены

**Следующие шаги:**
1. Setup проекта согласно структуре
2. Реализация UI Kit (Спринт 1)
3. Интеграция с backend API
4. Поэтапная разработка по спринтам
5. Тестирование и оптимизация

---

**Дата создания:** 01 декабря 2024  
**Дата аудита:** 16 декабря 2024  
**Дата security fix:** 16 декабря 2024  
**Версия:** 1.2 (Security Fixed)  
**Статус:** GREEN (Approved)

