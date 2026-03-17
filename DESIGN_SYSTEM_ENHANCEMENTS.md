# DESIGN_SYSTEM_ENHANCEMENTS.md — StorageCompare.ae
# Визуальные улучшения поверх DESIGN_SYSTEM.md
# Совместим с существующим Tailwind + shadcn/ui стеком
# GSD: читай этот файл ПОСЛЕ DESIGN_SYSTEM.md при работе над фронтендом.

---

## Философия

Текущий дизайн — solid foundation ("Neighbor meets Bayut"). Улучшения добавляют **premium-ощущение** без потери скорости и доверия. Ориентиры: **Airbnb 2024 + Vercel + Linear**.

**Принцип:** Subtle refinement, not redesign. Каждое улучшение должно быть performance-safe.

**Направление:** Clean glassmorphism + soft 3D + micro-animations. Воздушный, лёгкий, премиальный — Apple UI meets modern fintech.

**Ключевое изменение:** НЕТ плоских карточек из 2012. НЕТ серых/грязных фонов. Всё плавает на белом с полупрозрачным стеклом, мягкой глубиной и пружинной анимацией.

---

## 1. Поверхности — Glass Surface System

### 1.1. ЗАПРЕТ серых фонов

```
ЗАПРЕЩЕНО:
  bg-gray-50, bg-slate-50, bg-surface (#F8FAFC), bg-neutral-50
  Любой solid серый фон для секций, карточек, sidebar

ВМЕСТО ЭТОГО:
  Страница:              bg-white
  Альтернативная секция: bg-gradient-to-b from-white to-blue-50/30
  Hero:                  bg-gradient-to-br from-primary-950 via-primary-800 to-primary-700
  Operator dashboard:    bg-white
  Sidebar:               bg-white/60 backdrop-blur-xl
```

Визуальное разделение секций — через едва заметный градиент white → blue-50 (5-10% непрозрачность). Глаз должен видеть "белое и чистое с мягкой глубиной".

### 1.2. Glass Card (основная поверхность — warehouse cards, stat cards, modals)

```css
.glass-card {
  background: rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.6);
  border-radius: 20px;
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.05),
    0 2px 8px rgba(0, 0, 0, 0.03),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
}
```

**Tailwind эквивалент:**
```
bg-white/70 backdrop-blur-xl border border-white/60 rounded-[20px]
shadow-glass
```

### 1.3. Glass Card Hover (warehouse cards, кликабельные элементы)

```css
.glass-card:hover {
  transform: translateY(-4px);
  box-shadow:
    0 16px 48px rgba(26, 86, 219, 0.10),
    0 4px 12px rgba(0, 0, 0, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 1);
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
              box-shadow 0.3s ease;
}
```

### 1.4. Elevated Card (booking sidebar, operator dashboard widgets)

```css
.elevated-card {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.7);
  border-radius: 24px;
  box-shadow:
    0 12px 40px rgba(0, 0, 0, 0.06),
    0 4px 16px rgba(0, 0, 0, 0.03),
    inset 0 1px 0 rgba(255, 255, 255, 1);
}
```

### 1.5. Header с backdrop blur

```
bg-white/80 backdrop-blur-lg border-b border-border/50
sticky top-0 z-50 supports-[backdrop-filter]:bg-white/60
```

### 1.6. Map overlay cards

```
bg-white/95 backdrop-blur-sm rounded-xl shadow-xl border border-white/30
```

---

## 2. Border Radius Scale

Всё более округлое, чем в base system. Минимум 14px на интерактивных элементах.

```
Buttons:          rounded-2xl   (16px)
Cards:            rounded-[20px]
Modals/sheets:    rounded-3xl   (24px)
Inputs:           rounded-xl    (14px)
Badges/pills:     rounded-full  (9999px)
Images in cards:  rounded-xl    (14px) с overflow-hidden на parent
```

---

## 3. Кнопки — 3D с gradient и цветными тенями

### 3.1. Primary Button (Search, Submit, Confirm)

```css
.btn-primary {
  background: linear-gradient(145deg, #3B82F6, #1A56DB);
  color: white;
  border: none;
  border-radius: 16px;
  padding: 12px 24px;
  font-weight: 600;
  font-size: 14px;
  box-shadow:
    0 4px 14px rgba(26, 86, 219, 0.30),
    0 2px 4px rgba(26, 86, 219, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.20);
  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1),
              box-shadow 0.2s ease;
}
.btn-primary:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow:
    0 8px 24px rgba(26, 86, 219, 0.35),
    0 3px 6px rgba(26, 86, 219, 0.20),
    inset 0 1px 0 rgba(255, 255, 255, 0.25);
}
.btn-primary:active {
  transform: translateY(0) scale(0.98);
  box-shadow: 0 2px 8px rgba(26, 86, 219, 0.25);
}
```

### 3.2. Accent CTA Button (Book Now, Get Started)

```css
.btn-accent {
  background: linear-gradient(145deg, #FBBF24, #F59E0B);
  color: #78350F;
  border: none;
  border-radius: 16px;
  padding: 12px 24px;
  font-weight: 600;
  box-shadow:
    0 4px 14px rgba(245, 158, 11, 0.30),
    0 2px 4px rgba(245, 158, 11, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.35);
}
.btn-accent:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow:
    0 8px 24px rgba(245, 158, 11, 0.35),
    inset 0 1px 0 rgba(255, 255, 255, 0.40);
}
.btn-accent:active {
  transform: translateY(0) scale(0.98);
}
```

### 3.3. Secondary / Ghost Button (Cancel, Back)

```css
.btn-secondary {
  background: rgba(255, 255, 255, 0.65);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  color: #1A56DB;
  border: 1px solid rgba(26, 86, 219, 0.15);
  border-radius: 16px;
  padding: 12px 24px;
  font-weight: 600;
  box-shadow:
    0 2px 8px rgba(0, 0, 0, 0.04),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
}
.btn-secondary:hover {
  background: rgba(26, 86, 219, 0.06);
  border-color: rgba(26, 86, 219, 0.25);
  transform: translateY(-1px);
}
.btn-secondary:active {
  transform: scale(0.98);
}
```

---

## 4. Inputs — стеклянные

### 4.1. Glass Input (формы, фильтры)

```css
.input-glass {
  width: 100%;
  border-radius: 14px;
  padding: 12px 16px;
  font-size: 14px;
  background: rgba(255, 255, 255, 0.55);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.65);
  box-shadow:
    inset 0 2px 4px rgba(0, 0, 0, 0.03),
    0 1px 0 rgba(255, 255, 255, 0.8);
  color: #1E293B;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.input-glass:focus {
  border-color: rgba(59, 130, 246, 0.4);
  box-shadow:
    inset 0 2px 4px rgba(0, 0, 0, 0.03),
    0 0 0 3px rgba(59, 130, 246, 0.12);
}
.input-glass::placeholder {
  color: #94A3B8;
}
```

### 4.2. Hero Search Input (на тёмном gradient hero)

```css
.input-hero {
  border-radius: 14px;
  padding: 12px 16px;
  font-size: 14px;
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.25);
  color: white;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.08);
}
.input-hero::placeholder {
  color: rgba(255, 255, 255, 0.55);
}
.input-hero:focus {
  background: rgba(255, 255, 255, 0.22);
  border-color: rgba(255, 255, 255, 0.45);
  box-shadow:
    inset 0 2px 4px rgba(0, 0, 0, 0.08),
    0 0 0 3px rgba(255, 255, 255, 0.12);
}
```

---

## 5. Badges и Pills — полупрозрачные с blur

### 5.1. Status Badges

```css
.badge-verified {
  background: rgba(16, 185, 129, 0.10);
  color: #059669;
  border: 1px solid rgba(16, 185, 129, 0.18);
  backdrop-filter: blur(6px);
  border-radius: 9999px;
  padding: 3px 12px;
  font-size: 12px;
  font-weight: 500;
}
.badge-pending {
  background: rgba(245, 158, 11, 0.10);
  color: #B45309;
  border: 1px solid rgba(245, 158, 11, 0.18);
}
.badge-confirmed {
  background: rgba(16, 185, 129, 0.10);
  color: #059669;
  border: 1px solid rgba(16, 185, 129, 0.18);
}
.badge-cancelled {
  background: rgba(239, 68, 68, 0.10);
  color: #DC2626;
  border: 1px solid rgba(239, 68, 68, 0.18);
}
```

### 5.2. Feature Pills (размеры боксов, amenities)

```css
.pill {
  background: rgba(26, 86, 219, 0.07);
  color: #1A56DB;
  border: 1px solid rgba(26, 86, 219, 0.12);
  backdrop-filter: blur(4px);
  border-radius: 9999px;
  padding: 4px 14px;
  font-size: 12px;
  font-weight: 500;
  transition: background 0.2s, transform 0.15s;
  cursor: pointer;
}
.pill:hover {
  background: rgba(26, 86, 219, 0.13);
  transform: scale(1.04);
}
.pill-active {
  background: rgba(26, 86, 219, 0.15);
  border-color: rgba(26, 86, 219, 0.30);
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.10);
}
```

---

## 6. Анимации и Transitions

### 6.1. Tailwind config additions

```javascript
theme: {
  extend: {
    transitionTimingFunction: {
      'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
    },
    keyframes: {
      'fade-in': {
        '0%': { opacity: '0', transform: 'translateY(8px)' },
        '100%': { opacity: '1', transform: 'translateY(0)' },
      },
      'fade-in-up': {
        '0%': { opacity: '0', transform: 'translateY(16px)' },
        '100%': { opacity: '1', transform: 'translateY(0)' },
      },
      'slide-in-right': {
        '0%': { opacity: '0', transform: 'translateX(16px)' },
        '100%': { opacity: '1', transform: 'translateX(0)' },
      },
      'scale-in': {
        '0%': { opacity: '0', transform: 'scale(0.95)' },
        '100%': { opacity: '1', transform: 'scale(1)' },
      },
      'shimmer': {
        '0%': { backgroundPosition: '-200% 0' },
        '100%': { backgroundPosition: '200% 0' },
      },
      'pulse-soft': {
        '0%, 100%': { opacity: '1' },
        '50%': { opacity: '0.7' },
      },
    },
    animation: {
      'fade-in': 'fade-in 0.3s ease-out',
      'fade-in-up': 'fade-in-up 0.4s ease-out',
      'slide-in-right': 'slide-in-right 0.3s ease-out',
      'scale-in': 'scale-in 0.2s ease-out',
      'shimmer': 'shimmer 2s infinite linear',
      'pulse-soft': 'pulse-soft 2s infinite ease-in-out',
    },
  },
},
```

### 6.2. Правила анимации

- **Карточки:** hover = translateY(-4px) + shadow expand. НИКОГДА не scale карточки — только translateY.
- **Кнопки:** hover = translateY(-2px) scale(1.02), active = scale(0.98). НИКОГДА opacity для press.
- **Timing:** всегда spring cubic-bezier(0.34, 1.56, 0.64, 1) для интерактивных элементов.
- **Списки:** staggered fade-in с animationDelay: i * 60ms.
- **Страницы:** animate-fade-in на main в layout.tsx.

### 6.3. Staggered Cards

```tsx
{warehouses.map((w, i) => (
  <WarehouseCard
    key={w.id}
    className="animate-fade-in-up"
    style={{ animationDelay: `${i * 60}ms`, animationFillMode: 'both' }}
  />
))}
```

### 6.4. Page transitions

```tsx
<main className="animate-fade-in">{children}</main>
```

---

## 7. Тени — расширенная система

```javascript
// tailwind.config.ts — extend boxShadow
boxShadow: {
  'xs':             '0 1px 2px 0 rgb(0 0 0 / 0.03)',
  'sm':             '0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.06)',
  'md':             '0 4px 6px -1px rgb(0 0 0 / 0.07), 0 2px 4px -2px rgb(0 0 0 / 0.05)',
  'lg':             '0 10px 15px -3px rgb(0 0 0 / 0.08), 0 4px 6px -4px rgb(0 0 0 / 0.04)',
  'xl':             '0 20px 25px -5px rgb(0 0 0 / 0.08), 0 8px 10px -6px rgb(0 0 0 / 0.04)',
  'glow':           '0 0 20px rgb(59 130 246 / 0.15)',
  'glow-accent':    '0 0 20px rgb(245 158 11 / 0.2)',
  'glass':          '0 8px 32px rgba(0,0,0,0.05), 0 2px 8px rgba(0,0,0,0.03), inset 0 1px 0 rgba(255,255,255,0.9)',
  'glass-hover':    '0 16px 48px rgba(26,86,219,0.10), 0 4px 12px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,1)',
  'glass-elevated': '0 12px 40px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.03), inset 0 1px 0 rgba(255,255,255,1)',
  'btn-primary':    '0 4px 14px rgba(26,86,219,0.30), 0 2px 4px rgba(26,86,219,0.15), inset 0 1px 0 rgba(255,255,255,0.20)',
  'btn-accent':     '0 4px 14px rgba(245,158,11,0.30), 0 2px 4px rgba(245,158,11,0.15), inset 0 1px 0 rgba(255,255,255,0.35)',
},
```

---

## 8. Gradient-улучшения

### 8.1. Hero section

```css
.hero-pattern::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 30% 50%, rgba(59, 130, 246, 0.15), transparent 50%),
    radial-gradient(circle at 70% 80%, rgba(245, 158, 11, 0.08), transparent 40%);
}
```

### 8.2. Gradient текст

```
bg-gradient-to-r from-primary-600 via-primary-500 to-accent-500
bg-clip-text text-transparent
```

### 8.3. Gradient border для featured cards

```
relative before:absolute before:inset-0 before:rounded-[20px]
before:p-[1px] before:bg-gradient-to-br before:from-primary-400 before:to-accent-400
before:-z-10
```

---

## 9. Типографика

```javascript
letterSpacing: {
  'tight-hero': '-0.03em',
  'tight': '-0.015em',
},
lineHeight: {
  'heading': '1.15',
  'relaxed-body': '1.7',
},
```

```
Hero title:    text-5xl md:text-6xl font-bold tracking-tight-hero leading-heading
Section title: text-2xl md:text-3xl font-semibold tracking-tight
Body text:     text-base leading-relaxed-body
Цена:          text-2xl font-light text-primary-600 (Inter 300)
```

---

## 10. Skeleton Loading — shimmer

```css
.skeleton-shimmer {
  background: linear-gradient(
    90deg,
    rgba(226, 232, 240, 0.3) 0%,
    rgba(226, 232, 240, 0.12) 40%,
    rgba(226, 232, 240, 0.3) 80%
  );
  background-size: 200% 100%;
  animation: shimmer 1.8s infinite linear;
  border-radius: 12px;
}
```

```tsx
function WarehouseCardSkeleton() {
  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-[20px] border border-white/60 overflow-hidden shadow-glass">
      <div className="aspect-[4/3] skeleton-shimmer" />
      <div className="p-4 space-y-3">
        <div className="h-5 w-3/4 rounded-lg skeleton-shimmer" />
        <div className="h-4 w-1/2 rounded-lg skeleton-shimmer" />
        <div className="h-6 w-1/3 rounded-lg skeleton-shimmer" />
      </div>
    </div>
  );
}
```

---

## 11. Интерактивные улучшения

### 11.1. Tooltip

```bash
npx shadcn@latest add tooltip
```

### 11.2. useInView hook

```tsx
function useInView(ref: RefObject<HTMLElement>, threshold = 0.1) {
  const [isInView, setIsInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsInView(true); },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref, threshold]);
  return isInView;
}
```

### 11.3. AnimatedCounter

```tsx
function AnimatedCounter({ target, duration = 1500 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref);
  useEffect(() => {
    if (!isInView) return;
    const start = performance.now();
    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [isInView, target, duration]);
  return <span ref={ref}>{count}+</span>;
}
```

### 11.4. Toast notifications

```bash
npx shadcn@latest add toast sonner
```

```tsx
import { toast } from 'sonner';
toast.success('Booking confirmed!', { description: 'Check your email for details' });
toast.error('Something went wrong', { description: 'Please try again later' });
```

---

## 12. States

### 12.1. Empty state

```tsx
function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-primary-50 flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-primary-400" />
      </div>
      <h3 className="text-lg font-semibold text-text-primary mb-2">{title}</h3>
      <p className="text-text-secondary max-w-sm mb-6">{description}</p>
      {action}
    </div>
  );
}
```

### 12.2. Success state

```tsx
function SuccessCheck() {
  return (
    <div className="w-20 h-20 rounded-full bg-success-500 flex items-center justify-center animate-scale-in">
      <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
        <path d="M5 13l4 4L19 7"
              strokeDasharray="24" strokeDashoffset="24"
              style={{ animation: 'draw 0.5s 0.3s ease-out forwards' }} />
      </svg>
    </div>
  );
}
```

---

## 13. Dark Mode (подготовка, НЕ MVP)

```css
@layer base {
  :root { /* light — текущее */ }
  .dark {
    --background: 222 47% 11%;
    --foreground: 210 40% 98%;
    --primary: 217 91% 60%;
    --primary-foreground: 0 0% 100%;
    --accent: 38 92% 50%;
    --muted: 217 33% 17%;
    --muted-foreground: 215 20% 65%;
    --border: 217 33% 20%;
    --card: 222 47% 14%;
  }
}
```

Не включать. Подготовить структуру — переключатель добавляется за 1 день.

---

## 14. Каноничные компоненты

### 14.1. Warehouse Card v2 — [полный JSX в секции 14 DESIGN_SYSTEM_ENHANCEMENTS]

Glass surface, 3D hover, spring animation, image scale, gradient overlay, verified badge, favorite button, size pills, light font price.

### 14.2. Hero Search Block — [полный JSX в секции 14]

Dark gradient hero, glow orbs, glass search bar, hero inputs, accent CTA.

### 14.3. Stat Cards — Operator Dashboard — [полный JSX в секции 14]

Glass surface, backdrop blur, centered layout, primary-600 numbers.

---

## 15. Performance бюджет

| Улучшение | Размер | Влияние на LCP |
|-----------|--------|----------------|
| CSS анимации (keyframes) | ~2 KB | Нет |
| backdrop-filter | 0 KB (CSS) | Минимальное на GPU |
| Gradient overlays | 0 KB (CSS) | Нет |
| Glass shadows (custom) | ~1 KB | Нет |
| useInView hook | ~0.5 KB | Нет |
| AnimatedCounter | ~0.3 KB | Нет |
| Sonner (toast) | ~5 KB gzipped | Lazy loaded |
| **Итого** | **~9 KB** | **Незначительное** |

**Запрещено добавлять:**
- Framer Motion (~30 KB) — используем CSS animations
- GSAP (~25 KB) — overkill
- Lottie (~50 KB) — не нужно для MVP
- Тяжёлые particle/3D эффекты

---

## 16. Порядок внедрения

1. **tailwind.config.ts** — shadows (glass, glow, btn-*), animations, timing, border-radius, typography
2. **globals.css** — skeleton-shimmer, hero-pattern, glass utility classes, dark mode prep
3. **Header** — backdrop blur glass
4. **WarehouseCard** — glass surface, 3D hover, image scale + gradient overlay
5. **Hero** — enriched gradient, glow orbs, glass search bar
6. **Buttons** — gradient + colored shadow + inset highlight
7. **Inputs** — glass background
8. **Badges/Pills** — semi-transparent + border + blur
9. **useInView** — scroll animations
10. **Sonner** — toast notifications
11. **Empty/Success states**
12. **Staggered lists** — fade-in-up карточек
13. **Stat cards** — glass surface для dashboard

---

## 17. Правила для GSD

1. **НИКОГДА** bg-gray-50, bg-slate-50, bg-surface или любой solid серый фон.
2. **ВСЕ карточки** — glass surface (backdrop-blur + semi-transparent white + multi-layer shadow + inset highlight).
3. **ВСЕ кнопки** — gradient + цветная тень + inset highlight + spring hover/active.
4. **ВСЕ инпуты** — glass background + inner shadow + blue focus ring.
5. **ВСЕ бейджи** — semi-transparent tinted bg + matching border + backdrop-blur.
6. **Border radius минимум 14px** на интерактивных элементах, 20px на карточках.
7. **Hover** — spring cubic-bezier(0.34, 1.56, 0.64, 1). Никогда linear.
8. **Image overlays** — gradient fade from white/60 at bottom.
9. **Skeleton** — shimmer с полупрозрачным градиентом. Никаких solid серых блоков.
10. **Transitions** — CSS animations. Никаких Framer Motion / GSAP / Lottie.

---

**Результат:** Premium marketplace feel при +9KB бюджета и 0 тяжёлых зависимостей.
