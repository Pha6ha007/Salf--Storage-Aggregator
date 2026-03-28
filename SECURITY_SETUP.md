# Security Setup Guide

Инструкции по активации всех security компонентов после деплоя на GitHub + Railway.

---

## 1. GitHub — включить встроенную защиту (5 минут)

Открыть репозиторий → **Settings → Security**:

### Secret scanning
- ☑ Enable secret scanning
- ☑ Enable push protection ← **важно**: блокирует push если в коммите найден ключ

### Dependabot
- ☑ Enable Dependabot alerts
- ☑ Enable Dependabot security updates (автоматические PR с патчами)

Dependabot.yml уже добавлен — он будет создавать PR каждый понедельник для:
- `src/backend` — NestJS зависимости
- `frontend/frontend/my-app` — Next.js зависимости
- `.github/workflows` — GitHub Actions

---

## 2. CodeQL — включить (2 минуты)

Открыть репозиторий → **Settings → Code security → Code scanning**:
- ☑ Enable CodeQL analysis

CodeQL workflow (`security-scanning.yml`) уже добавлен и запускается:
- При каждом push в `main` и `develop`
- При каждом Pull Request
- Каждый понедельник (расписание)

Результаты появляются в **Security → Code scanning alerts**.

---

## 3. Sentry — настроить мониторинг ошибок (10 минут)

### 3.1 Создать проект в Sentry

1. Зайти на https://sentry.io (бесплатный план: 5000 ошибок/месяц)
2. Create Project → **Node.js** → Name: `storagecompare-backend`
3. Скопировать DSN (выглядит как `https://abc123@o123456.ingest.sentry.io/789`)

### 3.2 Добавить DSN в Railway

В Railway → проект → Variables:
```
SENTRY_DSN=https://your-key@sentry.io/your-project-id
APP_VERSION=1.0.0
```

### 3.3 Что Sentry отслеживает

- Все необработанные 500-е ошибки с полным стеком
- Контекст: какой endpoint, какой userId, какие данные запроса
- Чувствительные поля автоматически скрыты: `auth_token`, `refresh_token`, `password`
- Алерты на email/Slack при первом появлении новой ошибки

---

## 4. GitHub Actions — security workflows

Добавлены/обновлены следующие workflows:

### `security-scanning.yml` (новый)
Запускается на каждый PR и push в main:

| Job | Что проверяет | Блокирует деплой |
|-----|--------------|-----------------|
| CodeQL | Уязвимости в коде (injection, XSS, path traversal) | ✅ Да |
| dependency-audit-backend | High/critical в production deps backend | ✅ Да |
| dependency-audit-frontend | High/critical в production deps frontend | ✅ Да |
| TruffleHog | Реальные утечки секретов (проверяет против API) | ✅ Да |
| Pattern scan | Хардкод ключей AWS/Anthropic/Twilio/SendGrid | ✅ Да |
| security-gate | Финальная проверка — все должны пройти | ✅ Да |

### `backend-ci.yml` (обновлён)
Security job теперь **блокирует** на `high/critical` в production deps.

### `frontend-ci.yml` (обновлён)
То же самое для frontend.

---

## 5. Что происходит автоматически после настройки

```
Разработчик делает commit
        ↓
GitHub Actions запускает security-scanning.yml
        ↓
┌─────────────────────────────────────────────┐
│  CodeQL сканирует код                        │
│  TruffleHog ищет утечки ключей              │
│  npm audit проверяет зависимости            │
└─────────────────────────────────────────────┘
        ↓
❌ Найдена проблема → PR заблокирован, нотификация
✅ Всё чисто → PR можно мерджить
        ↓
Каждый понедельник Dependabot создаёт PR
с обновлёнными зависимостями
        ↓
В production любая 500-я ошибка → Sentry
→ email/Slack alert с полным контекстом
```

---

## 6. Проверка что всё работает

После настройки:
```bash
# Проверить что helmet заголовки отдаются
curl -I https://api.storagecompare.ae/api/v1/health

# Должны быть заголовки:
# X-Content-Type-Options: nosniff
# X-Frame-Options: DENY
# Strict-Transport-Security: max-age=31536000
# X-DNS-Prefetch-Control: off

# Проверить что Swagger не открывается в production
curl https://api.storagecompare.ae/api/v1/docs
# Должен вернуть 404
```
