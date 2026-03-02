# DESIGN_SYSTEM.md — StorageCompare.ae
# Visual Design Reference for Frontend Development

## Brand Identity

**Style:** "Neighbor meets Bayut" — clean, trustworthy, mobile-first
**Mood:** Professional but warm. Not cheap, not luxury. Reliable and convenient.
**Audience:** UAE expats (85%) + locals. English primary, Arabic future.

---

## Color Palette (Tailwind Config)

```javascript
// tailwind.config.ts — extend colors
colors: {
  // Primary — Trust blue
  primary: {
    50:  '#EFF6FF',
    100: '#DBEAFE',
    200: '#BFDBFE',
    300: '#93C5FD',
    400: '#60A5FA',
    500: '#3B82F6',
    600: '#1A56DB',  // ← MAIN PRIMARY
    700: '#1E40AF',
    800: '#1E3A8A',
    900: '#1E3050',
  },
  // Accent — UAE Gold / Amber
  accent: {
    50:  '#FFFBEB',
    100: '#FEF3C7',
    200: '#FDE68A',
    300: '#FCD34D',
    400: '#FBBF24',
    500: '#F59E0B',  // ← MAIN ACCENT (CTAs, highlights)
    600: '#D97706',
    700: '#B45309',
    800: '#92400E',
    900: '#78350F',
  },
  // Neutrals
  surface: '#F8FAFC',    // Card backgrounds, alt sections
  border:  '#E2E8F0',    // Borders, dividers
  // Text
  'text-primary':   '#1E293B',  // Main text (dark gray, not black)
  'text-secondary': '#64748B',  // Secondary text
  'text-muted':     '#94A3B8',  // Placeholder, disabled
  // Semantic
  success: { 500: '#10B981', 600: '#059669' },
  error:   { 500: '#EF4444', 600: '#DC2626' },
  warning: { 500: '#F59E0B', 600: '#D97706' },
  info:    { 500: '#3B82F6', 600: '#2563EB' },
}
```

---

## Typography

```javascript
// tailwind.config.ts — extend fontFamily
fontFamily: {
  sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
}
```

**Install Inter:**
```bash
npm install @fontsource/inter
```

```typescript
// layout.tsx
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
```

**Type Scale:**
```
Hero title:    text-5xl md:text-6xl font-bold        (48-64px)
Page title:    text-3xl md:text-4xl font-bold         (36-40px)
Section title: text-2xl md:text-3xl font-semibold     (28-32px)
Card title:    text-lg md:text-xl font-semibold        (20-24px)
Body:          text-base font-normal                   (16px)
Small:         text-sm font-normal                     (14px)
Caption:       text-xs font-medium                     (12px)
```

---

## Component Styles

### Buttons
```
Primary:     bg-primary-600 text-white hover:bg-primary-700 rounded-lg px-6 py-3 font-semibold
Accent CTA:  bg-accent-500 text-white hover:bg-accent-600 rounded-lg px-6 py-3 font-semibold
Secondary:   bg-white text-primary-600 border border-primary-600 hover:bg-primary-50 rounded-lg
Ghost:       text-primary-600 hover:bg-primary-50 rounded-lg
Danger:      bg-error-500 text-white hover:bg-error-600 rounded-lg
```

### Cards
```
Warehouse card: bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-border
                overflow-hidden (for image at top)
                
Card image:     aspect-[4/3] object-cover w-full
Card body:      p-4 space-y-2
Card title:     text-lg font-semibold text-text-primary
Card subtitle:  text-sm text-text-secondary
Card price:     text-lg font-bold text-primary-600
Card badge:     inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
```

### Inputs
```
Default:  w-full rounded-lg border border-border bg-white px-4 py-3 text-text-primary
          placeholder:text-text-muted
          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
Select:   Same + appearance-none + custom chevron
```

### Badges / Pills
```
Status pending:    bg-amber-100 text-amber-700
Status confirmed:  bg-green-100 text-green-700
Status cancelled:  bg-red-100 text-red-700
Feature pill:      bg-primary-50 text-primary-700 rounded-full px-3 py-1 text-xs font-medium
Verified badge:    bg-green-50 text-green-700 border border-green-200
```

### Map
```
Desktop catalog: grid grid-cols-5 → 3 cols cards + 2 cols map (sticky)
Mobile catalog:  full-width list + FAB button to toggle map
Map container:   rounded-xl overflow-hidden border border-border h-[calc(100vh-160px)] sticky top-20
```

---

## Page Layouts

### Header (sticky)
```
Desktop: 
  [Logo: StorageCompare.ae]  [Search (compact)]  [For Operators]  [Login / User Menu]
  Height: h-16
  Style: bg-white border-b border-border shadow-sm sticky top-0 z-50

Mobile:
  [Hamburger]  [Logo]  [Login avatar]
  Bottom nav: [Search] [Favorites] [Bookings] [Profile]
```

### Hero (Home page only)
```
bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700
text-white
py-20 md:py-32
Center-aligned search form on top
Background: subtle pattern or abstract storage illustration (not photo)
```

### Sections
```
Standard section:   py-16 md:py-24 bg-white
Alternate section:  py-16 md:py-24 bg-surface
```

### Footer
```
bg-gray-900 text-gray-300
py-12
Grid: 4 columns (About, For Renters, For Operators, Contact)
Bottom: © 2026 StorageCompare.ae | Privacy | Terms
```

---

## Icons

Use `lucide-react` (already in project via shadcn/ui):
```
Search:        <Search />
Map:           <MapPin />
Star:          <Star />
Clock:         <Clock />
Shield:        <ShieldCheck />
Box:           <Package />
Heart:         <Heart />
Phone:         <Phone />
Mail:          <Mail />
ChevronRight:  <ChevronRight />
Filter:        <SlidersHorizontal />
Grid/List:     <LayoutGrid /> / <List />
```

---

## Spacing System

Based on 4px grid:
```
0.5: 2px    (border gaps)
1:   4px    (tight spacing)
2:   8px    (inline elements)
3:   12px   (compact padding)
4:   16px   (default padding)
6:   24px   (card padding)
8:   32px   (section gaps)
12:  48px   (large gaps)
16:  64px   (section padding)
20:  80px   (hero padding)
```

---

## Responsive Breakpoints

```
Mobile-first approach:
sm:  640px   (large phones)
md:  768px   (tablets)
lg:  1024px  (laptop)
xl:  1280px  (desktop)
2xl: 1536px  (large desktop)

Content max-width: max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
```

---

## Key UX Patterns

### Search (Hero)
```
3 fields in a row (desktop) / stacked (mobile):
[📍 Emirate/District ▼] [📦 Box Size ▼] [🔍 Search]

Emirate dropdown: Dubai, Abu Dhabi, Sharjah, Ajman, RAK, Fujairah, UAQ
Box size: Any, Small (1-3m²), Medium (3-6m²), Large (6-12m²), XL (12m²+)
```

### Warehouse Card
```
┌──────────────────────────┐
│  [Photo 4:3]             │
│  ✓ Verified        ♥     │
├──────────────────────────┤
│  Al Quoz Secure Storage  │
│  ⭐ 4.5 (23) · Al Quoz   │
│  [S] [M] [L]             │
│  From 150 AED/month      │
└──────────────────────────┘
```

### Booking Flow (3 steps)
```
Step 1: Select box → size, price shown
Step 2: Dates → start date + duration picker
Step 3: Confirm → summary + submit

Progress bar at top. Total price always visible in sidebar.
```

### Trust Elements
```
- "Verified" badge on warehouses (green checkmark)
- Star ratings with review count
- "X warehouses in Y emirates" counter
- Feature pills: 24/7 Access, Climate Control, CCTV, etc.
- Operator response time: "Usually responds in 2 hours"
```

---

## shadcn/ui Setup

```bash
npx shadcn@latest init
# When asked:
# Style: Default
# Base color: Slate  
# CSS variables: Yes

# Install components:
npx shadcn@latest add button card input select badge dialog dropdown-menu
npx shadcn@latest add sheet tabs separator skeleton avatar
npx shadcn@latest add form label textarea popover command
```

Override shadcn theme in `globals.css`:
```css
@layer base {
  :root {
    --primary: 221 83% 48%;           /* #1A56DB */
    --primary-foreground: 0 0% 100%;
    --accent: 38 92% 50%;             /* #F59E0B */
    --accent-foreground: 0 0% 100%;
    --background: 0 0% 100%;
    --foreground: 215 25% 17%;        /* #1E293B */
    --muted: 210 40% 96%;
    --muted-foreground: 215 16% 47%;
    --border: 214 32% 91%;            /* #E2E8F0 */
    --ring: 221 83% 48%;
    --radius: 0.5rem;
  }
}
```

---

## Do's and Don'ts

### ✅ Do
- Use lots of white space
- Keep cards clean with minimal info
- Show prices prominently (AED/month)
- Use map for geographic discovery
- Mobile-first: design for 375px first
- Load fast: skeleton screens, lazy images
- Use `next/image` for optimized photos

### ❌ Don't
- No carousel/slider heroes
- No dark backgrounds for content sections
- No more than 3-4 items in top navigation
- No walls of text — use pills, badges, icons
- No custom scrollbars or fancy animations
- No autoplay anything
- Don't use pure black (#000000) for text
