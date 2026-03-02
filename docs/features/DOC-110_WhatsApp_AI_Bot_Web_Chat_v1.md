# DOC-110: WhatsApp AI Bot & Web Chat Assistant
# Полная техническая спецификация

**Document ID:** DOC-110
**Project:** Self-Storage Aggregator — StorageCompare.ae
**Version:** 1.0
**Status:** 🟢 Ready for Implementation
**Scope:** Post-MVP v1.1 (First AI feature after frontend completion)
**Priority:** TIER 1 — Game Changer
**Location:** `docs/features/DOC-110_WhatsApp_AI_Bot_Web_Chat_v1.md`

---

## Table of Contents

1. [Purpose & Business Context](#1-purpose--business-context)
2. [Architecture Overview](#2-architecture-overview)
3. [WhatsApp Business API Integration](#3-whatsapp-business-api-integration)
4. [Web Chat Widget](#4-web-chat-widget)
5. [AI Conversation Engine (Core)](#5-ai-conversation-engine-core)
6. [RAG Pipeline](#6-rag-pipeline)
7. [Database Schema Extensions](#7-database-schema-extensions)
8. [API Endpoints](#8-api-endpoints)
9. [NestJS Module Structure](#9-nestjs-module-structure)
10. [Admin Monitoring UI](#10-admin-monitoring-ui)
11. [Security & Rate Limiting](#11-security--rate-limiting)
12. [Multilingual Support](#12-multilingual-support)
13. [Fallback & Graceful Degradation](#13-fallback--graceful-degradation)
14. [Testing Strategy](#14-testing-strategy)
15. [Implementation Roadmap](#15-implementation-roadmap)
16. [Relation to Other Documents](#16-relation-to-other-documents)

---

# 1. Purpose & Business Context

## 1.1. Why WhatsApp + Web Chat?

**WhatsApp** — доминирующий мессенджер в ОАЭ с 96% проникновением среди экспатов. Все конкуренты (The Box, Boxit, Selfstore) используют WhatsApp только для ручной поддержки. AI-бот даёт 24/7 автоматические ответы.

**Web Chat** — fallback для десктоп-пользователей и тех, кто не хочет давать номер телефона. Один AI engine обслуживает оба канала.

## 1.2. Business Goals

| Цель | Метрика | Target |
|------|---------|--------|
| Сократить нагрузку на операторов | % автоматических ответов | 60-80% |
| Увеличить конверсию | Lead-to-booking rate | +15-25% |
| 24/7 доступность | Response time | < 3 секунды |
| Снизить барьер входа | First contact friction | WhatsApp = 1 tap |

## 1.3. Scope

**В скоупе:**
- WhatsApp Business API интеграция (через Twilio — уже подключён)
- Web Chat виджет на сайте (React component)
- AI Conversation Engine (Claude API + RAG)
- Conversation history & analytics
- Admin monitoring dashboard
- Multilingual: English + Arabic (v1.1), Hindi/Tagalog (future)
- Lead capture → CRM integration

**НЕ в скоупе:**
- Выполнение бронирований через бота (только ссылки на формы)
- Обработка платежей
- Telegram / Facebook Messenger (future)
- Voice calls / voice messages
- Автоматическое изменение статуса бронирований

---

# 2. Architecture Overview

## 2.1. High-Level Architecture

```
                  ┌──────────────┐
                  │   WhatsApp   │
                  │   (Twilio)   │
                  └──────┬───────┘
                         │ Webhook POST
                         ▼
┌──────────────┐  ┌──────────────────────────────────────────────┐
│  Web Chat    │  │              BACKEND (NestJS)                 │
│  Widget      │  │                                               │
│  (React)     │──│  ┌──────────────────────────────────────┐    │
│              │WS│  │  ChatGatewayModule                    │    │
└──────────────┘  │  │  ├─ WhatsAppController (webhook)     │    │
                  │  │  ├─ WebChatController (REST)          │    │
                  │  │  └─ ChatWebSocketGateway (WS)         │    │
                  │  └──────────────┬───────────────────────┘    │
                  │                 │                              │
                  │  ┌──────────────▼───────────────────────┐    │
                  │  │  ConversationEngine (core AI logic)   │    │
                  │  │  ├─ IntentClassifier                  │    │
                  │  │  ├─ RAGService (knowledge retrieval)  │    │
                  │  │  ├─ ClaudeService (LLM generation)    │    │
                  │  │  ├─ WarehouseSearchService (live data)│    │
                  │  │  └─ LeadCaptureService (CRM bridge)   │    │
                  │  └──────────────┬───────────────────────┘    │
                  │                 │                              │
                  │  ┌──────────────▼───────────────────────┐    │
                  │  │  Data Layer                           │    │
                  │  │  ├─ chat_sessions (session tracking)  │    │
                  │  │  ├─ ai_conversations (message log)    │    │
                  │  │  ├─ knowledge_chunks (RAG vectors)    │    │
                  │  │  └─ ai_requests_log (Claude API log)  │    │
                  │  └──────────────────────────────────────┘    │
                  └──────────────────────────────────────────────┘
```

## 2.2. Unified AI Engine Principle

Один AI engine обслуживает все каналы. Канал (WhatsApp / Web) определяет только формат ввода/вывода, НЕ логику AI.

```typescript
// Абстракция канала
interface ChatChannel {
  type: 'whatsapp' | 'web';
  sessionId: string;
  userId?: string;           // null для anonymous WhatsApp
  phoneNumber?: string;      // для WhatsApp
  language?: string;         // auto-detected или user preference
}

// Единый вход в AI engine
interface ConversationRequest {
  channel: ChatChannel;
  message: string;
  attachments?: Attachment[];  // photos (future)
  metadata?: Record<string, any>;
}

// Единый выход
interface ConversationResponse {
  text: string;
  suggestions?: string[];        // Quick reply buttons
  warehouses?: WarehouseSummary[];  // Если AI нашёл подходящие
  bookingLink?: string;          // CTA ссылка
  leadCaptured?: boolean;        // Был ли захвачен лид
  confidence: number;            // 0-1
  sources?: string[];            // RAG sources
}
```

---

# 3. WhatsApp Business API Integration

## 3.1. Provider: Twilio WhatsApp

Twilio уже подключён в проекте для SMS (DOC-022, Technical Architecture). Добавление WhatsApp канала через Twilio — минимальные изменения.

**Twilio WhatsApp Sandbox (Development):**
```
Номер: whatsapp:+14155238886 (Twilio sandbox)
Join command: "join <sandbox-keyword>"
```

**Production:**
```
1. Подать заявку на WhatsApp Business Account через Twilio Console
2. Получить выделенный номер: whatsapp:+971XXXXXXXXX
3. Настроить webhook URL
4. Пройти верификацию Meta Business
```

## 3.2. Environment Variables

```env
# Twilio (уже в проекте для SMS)
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# WhatsApp-specific
TWILIO_WHATSAPP_NUMBER=whatsapp:+971XXXXXXXXX
WHATSAPP_WEBHOOK_PATH=/api/v1/chat/whatsapp/webhook

# AI Engine
ANTHROPIC_API_KEY=sk-ant-xxxxx       # уже есть для Box Finder
AI_CHAT_MODEL=claude-sonnet-4-20250514
AI_CHAT_MAX_TOKENS=1024
AI_CHAT_TEMPERATURE=0.3
AI_CHAT_SESSION_TTL_HOURS=24
AI_CHAT_MAX_HISTORY_MESSAGES=20
AI_CHAT_RATE_LIMIT_PER_HOUR=30
```

## 3.3. Webhook Handler

### Incoming Message Flow

```
User sends WhatsApp message
    ↓
Twilio receives → POST to our webhook
    ↓
POST /api/v1/chat/whatsapp/webhook
  Body (form-urlencoded):
    From=whatsapp:+971501234567
    To=whatsapp:+971XXXXXXXXX
    Body=I need storage for furniture near Dubai Marina
    MessageSid=SMxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
    ProfileName=Ahmed
    ↓
WhatsAppController.handleIncoming()
    ↓
1. Validate Twilio signature (security)
2. Extract phone, message, profileName
3. Find or create chat_session by phone number
4. Pass to ConversationEngine.process()
5. Get AI response
6. Send reply via Twilio WhatsApp API
7. Log everything to ai_conversations + ai_requests_log
    ↓
Twilio sends WhatsApp reply to user
```

### Twilio Signature Validation

```typescript
import * as twilio from 'twilio';

function validateTwilioSignature(req: Request): boolean {
  const signature = req.headers['x-twilio-signature'] as string;
  const url = `${process.env.BASE_URL}${process.env.WHATSAPP_WEBHOOK_PATH}`;
  return twilio.validateRequest(
    process.env.TWILIO_AUTH_TOKEN,
    signature,
    url,
    req.body
  );
}
```

### Sending Reply

```typescript
const client = twilio(accountSid, authToken);

async function sendWhatsAppReply(to: string, message: string, buttons?: string[]): Promise<void> {
  if (!buttons || buttons.length === 0) {
    await client.messages.create({
      from: process.env.TWILIO_WHATSAPP_NUMBER,
      to: `whatsapp:${to}`,
      body: message,
    });
    return;
  }

  const buttonText = buttons.map((b, i) => `${i + 1}. ${b}`).join('\n');
  await client.messages.create({
    from: process.env.TWILIO_WHATSAPP_NUMBER,
    to: `whatsapp:${to}`,
    body: `${message}\n\n${buttonText}`,
  });
}
```

### Message Templates (Pre-approved)

WhatsApp requires pre-approved templates for proactive messages. Within 24h conversation window, free-form text is allowed.

**Template 1: Welcome**
```
Hello {{1}}! 👋 I'm the StorageCompare assistant. I can help you find storage, compare prices, and choose the right size. Just tell me what you need!
```

**Template 2: Warehouse Found**
```
I found {{1}} options near {{2}}. View results: {{3}}
```

---

# 4. Web Chat Widget

## 4.1. Component Structure

```
/frontend/src/components/chat/
  ├── ChatWidget.tsx           — Main widget (bubble + window)
  ├── ChatWindow.tsx           — Chat window container
  ├── ChatMessage.tsx          — Single message (user/bot)
  ├── ChatInput.tsx            — Input bar with send button
  ├── ChatSuggestions.tsx      — Quick reply buttons
  ├── ChatWarehouseCard.tsx    — Inline warehouse card in chat
  ├── ChatTypingIndicator.tsx  — "Bot is typing..." dots animation
  └── useChatSession.ts        — Hook for session & message state
```

## 4.2. Design

- **Collapsed:** Floating button bottom-right, 56x56px, `bg-primary-600`, icon `MessageCircle`
- **Open Desktop:** 400x550px, `rounded-2xl shadow-2xl`, glassmorphism header (`bg-primary-600/95 backdrop-blur`)
- **Open Mobile:** Fullscreen overlay, `fixed inset-0`
- **Animation:** `animate-scale-in` (from DESIGN_SYSTEM_ENHANCEMENTS.md)

## 4.3. Communication: REST (MVP), WebSocket (Future)

**MVP — REST:**
```
POST /api/v1/chat/message
{ "session_id": "uuid", "message": "text", "channel": "web", "page_context": {...} }

→ { "response": "...", "suggestions": [...], "warehouses": [...] }
```

**Future — WebSocket:** `WS /api/v1/chat/ws?session=uuid` for typing indicators and streaming.

## 4.4. Context-Aware Greeting

| Page | Greeting |
|------|----------|
| `/` | "Hi! Looking for storage in the UAE? I can help!" |
| `/catalog?city=Dubai` | "Browsing storage in Dubai? I can help narrow your search!" |
| `/warehouse/101` | "Have questions about this warehouse? Ask me anything!" |
| `/bookings` | "Need help with your bookings?" |

---

# 5. AI Conversation Engine (Core)

## 5.1. Intent Classification (Fast, Keyword-Based)

```typescript
enum ChatIntent {
  SEARCH_WAREHOUSE = 'search_warehouse',
  SIZE_RECOMMENDATION = 'size_recommendation',
  PRICE_INQUIRY = 'price_inquiry',
  BOOKING_HELP = 'booking_help',
  OPERATOR_CONTACT = 'operator_contact',
  COMPLAINT = 'complaint',
  FAQ = 'faq',
  GENERAL = 'general',
}
```

## 5.2. System Prompt

```
You are the StorageCompare.ae AI assistant — helpful, friendly, concise.

RULES:
1. Base answers ONLY on provided context (RAG + search results). Never invent data.
2. Prices in AED/month. Box sizes: S (1-3m²), M (3-6m²), L (6-12m²), XL (12m²+).
3. Max 3-4 sentences for simple questions, 6-8 for complex.
4. When suggesting warehouses, include: name, district, price, rating, link.
5. Do NOT make bookings or modify data. Only provide info and links.
6. If unsure, say so. Suggest browsing the catalog or calling support.
7. Detect user language (English/Arabic). Default English.
8. Capture lead data: what they need, where, for how long, budget.
9. When user wants a human: provide operator contact or "Contact Us" link.

FORMAT for warehouses:
📦 {name} — {district}, {city}
   ⭐ {rating} · From {price} AED/month
   👉 {url}
```

## 5.3. Claude API Integration

- **Model:** `claude-sonnet-4-20250514` (balance of speed + quality)
- **Max tokens:** 1024
- **Temperature:** 0.3 (factual, not creative)
- **Context window budget:** ~4K tokens history + ~2K RAG + ~1K system prompt + ~1K response
- **Timeout:** 15 seconds (fallback if exceeded)

## 5.4. Warehouse Search Integration

When intent = SEARCH or PRICE → query existing `GET /warehouses` API internally:

```typescript
// Extract location and size from user message
const params = extractSearchParams(message);
const results = await warehouseService.search({
  city: params.city,
  district: params.district,
  box_size: params.size,
  sort: 'rating',
  limit: 5,
});
// Pass results as context to Claude
```

## 5.5. Lead Capture → CRM

When user provides: location + items/size + duration → auto-create CRM lead:

```typescript
await crmService.createLead({
  source: channel.type,  // 'whatsapp' | 'web'
  source_detail: `chat:${sessionId}`,
  contact_phone: channel.phoneNumber,
  notes: aiGeneratedSummary,
  metadata: { storage_needs, warehouse_interests },
  status: 'new',
});
this.eventEmitter.emit('crm.lead.created', { ... });
```

---

# 6. RAG Pipeline

## 6.1. Knowledge Sources

| Source | Content | Update |
|--------|---------|--------|
| Warehouses | Name, description, features, prices, hours | On `warehouse.updated` event |
| Boxes | Sizes, prices, availability | On `box.updated` event |
| FAQ | Platform Q&A (50-150 items) | Manual via admin |
| Policies | Booking terms, cancellation, refunds | Manual via admin |

## 6.2. Indexing

Uses existing infrastructure from DOC-109 (RAG Auto-Index):
- `knowledge_chunks` table with `embedding vector(1536)` column
- Event listeners auto-reindex on warehouse/box changes
- pgvector for similarity search

**MVP Fallback:** If embeddings not ready, use PostgreSQL `tsvector` full-text search.

---

# 7. Database Schema Extensions

## 7.1. New Table: `chat_sessions`

```sql
CREATE TABLE chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel VARCHAR(20) NOT NULL,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  phone_number VARCHAR(20),
  session_token VARCHAR(100),
  language VARCHAR(5) DEFAULT 'en',
  page_context JSONB DEFAULT '{}',
  lead_captured BOOLEAN DEFAULT FALSE,
  lead_id INTEGER REFERENCES crm_leads(id),
  message_count INTEGER DEFAULT 0,
  last_message_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '24 hours'),

  CONSTRAINT chk_chat_channel CHECK (channel IN ('whatsapp', 'web'))
);

CREATE INDEX idx_chat_sessions_phone ON chat_sessions(phone_number) WHERE phone_number IS NOT NULL;
CREATE INDEX idx_chat_sessions_user ON chat_sessions(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX idx_chat_sessions_token ON chat_sessions(session_token) WHERE session_token IS NOT NULL;
CREATE INDEX idx_chat_sessions_active ON chat_sessions(expires_at) WHERE expires_at > NOW();
```

## 7.2. Extended `ai_conversations` (already exists, add fields)

```sql
-- Add channel and session reference
ALTER TABLE ai_conversations ADD COLUMN channel VARCHAR(20) DEFAULT 'web';
ALTER TABLE ai_conversations ADD COLUMN chat_session_id UUID REFERENCES chat_sessions(id);
ALTER TABLE ai_conversations ADD COLUMN intent VARCHAR(50);
ALTER TABLE ai_conversations ADD COLUMN confidence FLOAT;
ALTER TABLE ai_conversations ADD COLUMN metadata JSONB DEFAULT '{}';

CREATE INDEX idx_ai_conversations_channel ON ai_conversations(channel);
CREATE INDEX idx_ai_conversations_chat_session ON ai_conversations(chat_session_id);
```

## 7.3. `ai_requests_log` — No Changes

Already exists and supports `request_type` field. Use:
- `request_type = 'chat_whatsapp'`
- `request_type = 'chat_web'`

---

# 8. API Endpoints

## 8.1. WhatsApp Webhook

```
POST /api/v1/chat/whatsapp/webhook
Content-Type: application/x-www-form-urlencoded
X-Twilio-Signature: {signature}

Body: From, To, Body, MessageSid, ProfileName

Response: 200 OK (empty — Twilio expects fast response)
```

AI processing happens asynchronously; reply sent via Twilio API after processing.

## 8.2. Web Chat Message

```
POST /api/v1/chat/message
Authorization: Bearer {token} (optional — anonymous allowed)
Content-Type: application/json

Request:
{
  "session_id": "uuid",            // Client-generated, persisted in localStorage
  "message": "I need storage near JLT for 3 months",
  "channel": "web",
  "page_context": {
    "path": "/catalog",
    "warehouseId": null,
    "searchParams": { "city": "Dubai" }
  }
}

Response: 200 OK
{
  "success": true,
  "data": {
    "message_id": "uuid",
    "response": "I found 5 warehouses near JLT! Here are the top options:\n\n📦 StorageHub JLT — JLT, Dubai\n   ⭐ 4.8 · From 350 AED/month\n   👉 https://storagecompare.ae/warehouse/105\n\n📦 SecureStore Marina — Dubai Marina\n   ⭐ 4.5 · From 400 AED/month\n   👉 https://storagecompare.ae/warehouse/108",
    "suggestions": ["Compare prices", "Show on map", "What size do I need?"],
    "warehouses": [
      { "id": 105, "name": "StorageHub JLT", "price_from": 350, "rating": 4.8 },
      { "id": 108, "name": "SecureStore Marina", "price_from": 400, "rating": 4.5 }
    ],
    "session_id": "uuid",
    "intent": "search_warehouse",
    "confidence": 0.92
  }
}
```

## 8.3. Chat History

```
GET /api/v1/chat/history?session_id=uuid&limit=50

Response: 200 OK
{
  "success": true,
  "data": {
    "session": { "id": "uuid", "channel": "web", "created_at": "..." },
    "messages": [
      { "id": "uuid", "role": "assistant", "content": "Hi! ...", "created_at": "..." },
      { "id": "uuid", "role": "user", "content": "I need...", "created_at": "..." },
      { "id": "uuid", "role": "assistant", "content": "I found...", "created_at": "...",
        "metadata": { "intent": "search_warehouse", "warehouses_shown": [105, 108] } }
    ]
  }
}
```

## 8.4. Admin: Chat Sessions List

```
GET /api/v1/admin/chat/sessions
  ?channel=whatsapp
  &has_lead=true
  &page=1&per_page=20

Response: 200 OK
{
  "data": [...],
  "pagination": { "page": 1, "total": 156 },
  "stats": {
    "total_sessions_today": 45,
    "whatsapp_sessions": 30,
    "web_sessions": 15,
    "leads_captured": 12,
    "avg_messages_per_session": 6.3,
    "avg_response_time_ms": 2100
  }
}
```

---

# 9. NestJS Module Structure

```
/backend/src/modules/chat/
  ├── chat.module.ts                    — Module definition
  ├── controllers/
  │   ├── whatsapp.controller.ts        — WhatsApp webhook handler
  │   ├── web-chat.controller.ts        — Web chat REST endpoints
  │   └── chat-admin.controller.ts      — Admin monitoring endpoints
  ├── services/
  │   ├── conversation-engine.service.ts — Core AI logic (shared)
  │   ├── intent-classifier.service.ts   — Intent detection
  │   ├── rag.service.ts                 — RAG retrieval
  │   ├── claude.service.ts              — Claude API wrapper
  │   ├── whatsapp.service.ts            — Twilio WhatsApp API
  │   ├── lead-capture.service.ts        — CRM lead creation
  │   └── chat-session.service.ts        — Session management
  ├── dto/
  │   ├── chat-message.dto.ts
  │   ├── chat-response.dto.ts
  │   └── whatsapp-webhook.dto.ts
  ├── entities/
  │   └── chat-session.entity.ts
  ├── guards/
  │   └── twilio-signature.guard.ts     — Validate Twilio webhook
  └── events/
      └── chat.events.ts                — chat.message.received, chat.lead.captured
```

---

# 10. Admin Monitoring UI

## 10.1. Location

`/admin/chat` (или `/operator/chat` если оператор видит свои диалоги)

## 10.2. Dashboard Metrics

```
┌─────────────────────────────────────────────────────────────┐
│ 💬 Chat Analytics                          Last 24h / 7d / 30d │
├──────────────┬──────────────┬───────────────┬──────────────┤
│ Total Chats  │ WhatsApp     │ Web Chat      │ Leads        │
│ 156          │ 98 (63%)     │ 58 (37%)      │ 34 (22%)     │
├──────────────┼──────────────┼───────────────┼──────────────┤
│ Avg Messages │ Avg Response │ AI Confidence │ Handoff Rate │
│ 6.3/session  │ 2.1s         │ 87%           │ 8%           │
└──────────────┴──────────────┴───────────────┴──────────────┘
```

## 10.3. Conversation Viewer

- List of sessions with: channel icon, phone/user, message count, lead status, timestamp
- Click to open full conversation transcript
- Flag button: mark conversation for review
- Export: download as CSV/JSON

## 10.4. FAQ Management

- CRUD interface for FAQ entries (question + answer)
- Each FAQ auto-indexed to `knowledge_chunks` on save
- Suggested FAQs: AI identifies frequently asked questions without good answers

---

# 11. Security & Rate Limiting

## 11.1. Rate Limits

| Channel | Limit | Per |
|---------|-------|-----|
| WhatsApp (anonymous) | 30 messages/hour | per phone number |
| Web Chat (anonymous) | 20 messages/hour | per session/IP |
| Web Chat (authenticated) | 50 messages/hour | per user |
| Admin API | 100 requests/minute | per admin |

## 11.2. Security Measures

- **WhatsApp:** Twilio signature validation on every webhook
- **Web Chat:** Session token + CORS + rate limiting
- **Content Filtering:** Claude's built-in safety + блокируем PII в логах (mask phone/email)
- **No Prompt Injection:** System prompt is server-side only, never exposed to frontend
- **Data Retention:** Chat history 90 days, then archive. Anonymize after 180 days.

## 11.3. PII Masking in Logs

```typescript
function maskPII(text: string): string {
  return text
    .replace(/\+?\d{10,15}/g, '+***PHONE***')
    .replace(/[\w.-]+@[\w.-]+\.\w+/g, '***EMAIL***')
    .replace(/\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g, '***CARD***');
}
```

---

# 12. Multilingual Support

## 12.1. Language Detection

```typescript
function detectLanguage(text: string): string {
  // Simple Arabic detection (Unicode range)
  if (/[\u0600-\u06FF]/.test(text)) return 'ar';
  // Hindi detection
  if (/[\u0900-\u097F]/.test(text)) return 'hi';
  return 'en';
}
```

## 12.2. Language-Specific System Prompts

Claude natively supports Arabic, Hindi, English. Add language instruction to system prompt:

```
Respond in the same language the user writes in. If Arabic, respond in Arabic.
If the user switches language mid-conversation, follow their lead.
```

## 12.3. Phased Rollout

- **v1.1:** English + Arabic
- **v1.2:** Hindi/Urdu
- **v2.0:** Tagalog, French

---

# 13. Fallback & Graceful Degradation

| Failure | Fallback |
|---------|----------|
| Claude API timeout (>15s) | "I'm having trouble thinking right now. Please try again or browse our catalog: {link}" |
| Claude API error (500) | Same as timeout + log error |
| RAG returns no results | Claude answers from general knowledge with disclaimer |
| WhatsApp webhook down | Messages queued in Twilio (auto-retry) |
| Rate limit exceeded | "You've sent many messages. Please wait a few minutes or call us at {phone}" |
| Intent = OPERATOR_CONTACT | "I'll connect you with a human agent. Contact us: {phone} / {email} / {whatsapp_link}" |
| Session expired (>24h) | Start new session with greeting |

---

# 14. Testing Strategy

## 14.1. Unit Tests

- IntentClassifier: 100% coverage of all intents
- ConversationEngine: Mock Claude API, test context building
- LeadCapture: Verify CRM lead creation
- PII Masking: Edge cases

## 14.2. Integration Tests

- WhatsApp webhook → full pipeline → response
- Web Chat message → full pipeline → response
- RAG indexing on warehouse create/update
- Session creation and expiry

## 14.3. E2E Test Scenarios

| # | Scenario | Steps | Expected |
|---|----------|-------|----------|
| 1 | WhatsApp search | Send "storage near JLT" | Bot returns warehouse list |
| 2 | Size recommendation | Send "what size for 2-bedroom" | Bot recommends M or L |
| 3 | Price inquiry | Send "how much for M box in Dubai" | Bot returns price range |
| 4 | Human handoff | Send "talk to a person" | Bot provides contact info |
| 5 | Lead capture | Provide location + items + duration | CRM lead created |
| 6 | Arabic support | Send message in Arabic | Bot replies in Arabic |
| 7 | Session continuity | Multiple messages | Context maintained |
| 8 | Rate limit | Send 31 messages in 1 hour | Rate limit message |

## 14.4. data-testid Attributes

```
data-testid="chat-widget-button"
data-testid="chat-window"
data-testid="chat-input"
data-testid="chat-send-button"
data-testid="chat-message-bot"
data-testid="chat-message-user"
data-testid="chat-suggestion-button"
data-testid="chat-typing-indicator"
data-testid="chat-close-button"
```

---

# 15. Implementation Roadmap

## Phase 1: Core Engine (Week 1)

```
Day 1-2: Database schema (chat_sessions + alter ai_conversations)
Day 2-3: NestJS ChatModule skeleton + ConversationEngine
Day 3-4: Claude API integration + System Prompt
Day 4-5: Intent classifier + basic RAG (keyword search)
```

## Phase 2: WhatsApp (Week 2)

```
Day 1-2: Twilio WhatsApp webhook controller + signature guard
Day 2-3: WhatsApp reply service
Day 3-4: Session management (phone-based)
Day 4-5: Lead capture → CRM integration + testing
```

## Phase 3: Web Chat (Week 2-3)

```
Day 1-2: Web chat REST endpoint
Day 2-3: ChatWidget React component
Day 3-4: Chat UI (messages, input, suggestions, typing)
Day 4-5: Context-aware greeting + warehouse cards in chat
```

## Phase 4: Admin & Polish (Week 3)

```
Day 1-2: Admin chat monitoring dashboard
Day 2-3: FAQ management UI
Day 3-4: RAG vector pipeline (if not done)
Day 4-5: Arabic support + testing + deployment
```

**Total: ~3 weeks**

---

# 16. Relation to Other Documents

| Document | Relationship |
|----------|-------------|
| **DOC-007** (AI Chat Assistant) | DOC-110 is the implementation specification. DOC-007 is the conceptual design reference. |
| **DOC-109** (AI Readiness Infra) | DOC-110 uses Event Bus, knowledge_chunks, ai_conversations from DOC-109. |
| **DOC-022** (Backend Plan) | Chat module added as new module in NestJS monolith. |
| **DOC-016** (API Specification) | New endpoints added: `/chat/whatsapp/webhook`, `/chat/message`, `/chat/history`. |
| **CRM Spec** | Lead capture integrates with existing CRM lead creation flow. |
| **Technical Architecture** | Twilio integration extended from SMS to WhatsApp channel. |
| **DESIGN_SYSTEM.md** | Web chat widget follows design system (colors, typography, animations). |
| **DESIGN_SYSTEM_ENHANCEMENTS.md** | Glassmorphism header, scale-in animation for chat widget. |

---

# Appendix A: Example Conversations

## A.1. Warehouse Search (WhatsApp)

```
User: Hi, I need storage near Dubai Marina for about 3 months
Bot:  Hi! 👋 I found 4 warehouses near Dubai Marina:

      📦 Marina Storage Plus — Dubai Marina
         ⭐ 4.7 · From 350 AED/month
         Features: Climate Control, 24/7 Access
         👉 storagecompare.ae/warehouse/112

      📦 JBR SecureStore — JBR
         ⭐ 4.5 · From 300 AED/month
         Features: CCTV, Security Guard
         👉 storagecompare.ae/warehouse/118

      What size are you looking for? (S/M/L/XL)

User: I have furniture from a 1-bedroom apartment
Bot:  For a 1-bedroom apartment's furniture, I'd recommend a Medium (M) box
      (3-6 m², typically 2x2x2.5m). This fits a sofa, bed frame, wardrobe,
      and 10-15 boxes.

      At Marina Storage Plus, an M box is 450 AED/month (3 months = 1,350 AED).

      Ready to book? 👉 storagecompare.ae/warehouse/112

User: That sounds good, how do I book?
Bot:  Easy! Here's how:
      1. Visit the warehouse page: storagecompare.ae/warehouse/112
      2. Select "Box M" and your dates
      3. Fill in your contact details
      4. Submit — the operator will confirm within 24 hours

      Or call them directly: +971-4-555-1234
```

## A.2. Web Chat (Context-Aware)

```
[User is on /warehouse/101 page]

Bot:  Have questions about StorageHub Al Quoz? I'm here to help!

User: Is this place climate controlled?
Bot:  Yes! StorageHub Al Quoz offers climate-controlled storage in all units.
      Temperature is maintained between 20-25°C year-round — important
      for Dubai's heat.

      Other features: 24/7 Access, CCTV, Individual Locks.

User: What's the smallest box available?
Bot:  The smallest available box at StorageHub Al Quoz is:

      📦 Box S — 1.5x1.5x2m (4.5 m³)
         💰 200 AED/month
         ✅ 3 available

      Great for personal items, documents, or a few boxes.
      Want to book it? 👉 Select "Box S" above ☝️
```

---

# Appendix B: Cost Estimation

| Component | Monthly Cost (Est.) |
|-----------|-------------------|
| Claude API (~1000 sessions/month, ~6 msg each, ~500 tokens/msg) | ~$30-50 |
| Twilio WhatsApp (per-message pricing) | ~$50-100 |
| pgvector (existing PostgreSQL) | $0 (included) |
| Total | **~$80-150/month** |

Scales linearly. At 10,000 sessions/month → ~$800-1,500/month.

---

**End of DOC-110**
