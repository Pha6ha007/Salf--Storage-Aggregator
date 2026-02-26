# AI Chat Assistant (RAG + LLM) — Deep Technical Specification (MVP v1)

**Document ID:** DOC-007  
**Version:** 1.0 (MVP v1 Hardened)  
**Last Updated:** December 2025  
**Document Type:** Supporting / Deep Technical Specification

---

## Document Role & Scope

### **Classification**
- **Type:** Supporting / Deep Technical Specification
- **Priority:** Non-Canonical (informative, not binding)
- **Scope:** MVP v1 focused with illustrative post-MVP patterns

### **Purpose**
This document provides **reference implementation patterns** and **architectural guidance** for the AI Chat Assistant module. It describes a **target implementation approach** but does not mandate full implementation of all components in MVP v1.

### **Key Principles**

✅ **Supporting Capability** — AI Chat Assistant is a **supporting feature**, not a core platform component  
✅ **Partial Implementation Acceptable** — MVP v1 can implement simplified versions or defer advanced features  
✅ **Illustrative, Not Prescriptive** — Code examples and architectures are reference patterns, not requirements  
✅ **Architecture Subordination** — This module operates within the existing backend architecture and does not introduce new independent services  
✅ **API Non-Canonical** — API contracts described here are conceptual; the canonical API source is the API Blueprint (`api_design_blueprint_mvp_v1.md`)

### **What This Document IS:**
- ✅ A guide for developers implementing AI chat functionality
- ✅ A reference for best practices in RAG + LLM systems
- ✅ An exploration of possible implementation patterns
- ✅ A roadmap showing what *could* be built beyond MVP

### **What This Document IS NOT:**
- ❌ A mandatory feature list for MVP v1
- ❌ A canonical API contract (see API Blueprint)
- ❌ A guarantee of accuracy metrics or system capabilities
- ❌ An independent microservice specification
- ❌ A commitment to implement all described features

### **MVP v1 Reality Check**
In MVP v1, the AI Chat Assistant may be:
- A basic Q&A system with simple keyword matching
- A thin wrapper around LLM with minimal RAG
- A rule-based system with limited AI capabilities
- Deferred to post-MVP entirely if resources constrain

**All of the above are valid MVP v1 implementations.** This document provides guidance for teams that choose to implement more sophisticated AI capabilities, but sophisticated AI is **not mandatory** for MVP v1 success.

---

## Document Structure

This specification is organized into 14 sections across 5 logical parts:

**Part 1: Introduction & Architecture** (Sections 1-2)
- Introduction, use cases, MVP limitations, architecture overview

**Part 2: Knowledge Sources & Retrieval** (Sections 3-5)
- Knowledge sources, RAG retrieval layer, query understanding

**Part 3: LLM Generation & Safety** (Sections 6-8)
- LLM response generation, safety mechanisms, input specifications

**Part 4: Outputs, Metrics & Learning** (Sections 9-11)
- Output specifications, quality metrics, model training approaches

**Part 5: Fallback, Integration & Future** (Sections 12-14)
- Fallback strategies, backend integration, post-MVP capabilities

---

## MVP v1 Scope Boundaries

### **What IS in MVP v1 Scope (Minimum Viable Implementation)**

The following represents the **minimum acceptable** AI Chat Assistant for MVP v1:

#### Core Capabilities:
1. **Basic Q&A Functionality**
   - Text input/output chat interface
   - Single-turn requests (no multi-turn dialogue required)
   - Russian language only
   - Anonymous and authenticated user support

2. **Simple Knowledge Retrieval**
   - Keyword-based or basic vector search over platform documents
   - Retrieval of relevant FAQ answers
   - Simple relevance scoring

3. **LLM Integration**
   - Integration with Claude Sonnet 4 or similar LLM
   - Basic prompt templates
   - Response generation from retrieved context

4. **Essential Safety**
   - Basic input validation (length, content type)
   - Simple fallback responses when no answer found
   - Rate limiting by user role

5. **Minimal Monitoring**
   - Request/response logging
   - Basic error tracking
   - Simple usage metrics

### **What MAY be Simplified or Deferred in MVP v1**

The following features are **optional enhancements** and can be simplified or omitted entirely in MVP v1:

#### Optional/Future Enhancements:
- ❓ Advanced embedding models (can use simpler text search)
- ❓ Sophisticated chunking strategies (can use fixed-size chunks)
- ❓ Cross-encoder reranking (can use cosine similarity only)
- ❓ Intent classification (can route by keywords)
- ❓ Named Entity Recognition (can use regex patterns)
- ❓ Confidence scoring (can omit or use simple thresholds)
- ❓ Anti-hallucination detection (can rely on prompt engineering only)
- ❓ PII filtering (can defer if not handling sensitive data)
- ❓ Chat history persistence (can implement as session-only)
- ❓ Feedback loops (can collect manually)
- ❓ A/B testing infrastructure (can defer)
- ❓ Advanced metrics (can use basic logging only)

### **What is OUT of MVP v1 Scope (Post-MVP Only)**

The following capabilities are **explicitly post-MVP** and should not be attempted in v1:

#### Deferred to Future Versions:
- ❌ Multi-turn dialogue with session memory
- ❌ Voice input/output
- ❌ Multi-language support beyond Russian
- ❌ Real-time learning / model fine-tuning
- ❌ Automated operator assistance with predictive suggestions
- ❌ Image understanding
- ❌ Sentiment analysis
- ❌ User profiling and behavioral prediction
- ❌ Dynamic pricing recommendations
- ❌ Workflow automation integrations
- ❌ Custom LLM fine-tuning
- ❌ Reinforcement Learning from Human Feedback (RLHF)

---

## Technical Architecture Subordination

### **Relationship to Core Platform**

The AI Chat Assistant is **subordinate** to the core backend platform and operates within its constraints:

#### Architecture Integration:
- **NOT an independent microservice** — operates as a module within the main backend or as a thin service layer
- **Uses existing infrastructure:**
  - Authentication & authorization (no separate auth)
  - Logging (uses platform logging strategy)
  - Monitoring (uses platform monitoring tools)
  - Rate limiting (integrates with platform rate limiter)
  - Database connections (shares connection pools)
  - Error handling (follows platform error patterns)

#### Service Boundaries:
- AI Chat does NOT introduce new:
  - Databases (uses existing PostgreSQL, Redis)
  - Auth mechanisms (reuses platform auth)
  - API gateways (uses existing API layer)
  - Monitoring stacks (uses existing Prometheus/Grafana)
  - Deployment pipelines (follows platform deployment)

#### Data Flow:
- All AI requests flow through the standard API Gateway
- AI responses follow the same error/response patterns as other endpoints
- AI logs integrate with the existing logging infrastructure
- AI metrics feed into the existing monitoring dashboards

**Key Principle:** If implementing AI Chat requires creating new infrastructure, services, or deployment patterns — it's out of MVP scope. The AI module adapts to the existing platform, not vice versa.

---

## API Contract Disclaimer

### **API Endpoints Described in This Document**

This document describes **conceptual API patterns** for the AI Chat Assistant. These are **illustrative examples** to guide implementation, not canonical API contracts.

**Source of Truth for APIs:**
- ✅ `api_design_blueprint_mvp_v1.md` — Canonical API specification
- ✅ Backend implementation plan — Service layer contracts
- ❌ This document (DOC-007) — Reference only

**If there is a conflict:**
1. API Blueprint takes precedence
2. Backend implementation plan provides implementation details
3. This document provides context and patterns only

**Implementation Freedom:**
- Teams may implement AI endpoints differently than described here
- Request/response schemas may vary from examples
- Error codes and handling may follow platform patterns instead

---

## Code Examples Disclaimer

**All code examples in this document are illustrative and for reference only.**

### Important Notes:
- ✅ Code demonstrates **possible approaches**, not requirements
- ✅ Actual implementation may differ significantly
- ✅ Teams should adapt patterns to their tech stack and constraints
- ❌ Code is **not production-ready** and requires adaptation
- ❌ No guarantee of completeness or correctness
- ❌ Not intended for copy-paste implementation

**Before using any code example:**
1. Validate against your tech stack
2. Add proper error handling
3. Implement security controls
4. Add logging and monitoring
5. Test thoroughly in your environment
6. Adapt to your coding standards

---

# Part 1: Introduction and Architecture

## 1. Introduction

### 1.1. Purpose of AI Chat Assistant

**AI Chat Assistant** is an optional supporting capability based on **Retrieval-Augmented Generation (RAG)** and **Large Language Model (LLM)** technology, designed to enhance user experience and reduce operator workload on the self-storage aggregator platform.

**Potential Goals (if fully implemented):**

1. **Reduce operator load** — automate responses to common questions (target: 60-80% of repetitive queries)
2. **Improve conversion** — help users find warehouses and boxes through guided recommendations
3. **Enhance UX** — provide instant answers 24/7 without operator wait times
4. **Ensure consistency** — ground all responses in actual platform documentation
5. **Support operators** — assist with pricing, warehouse management, analytics queries

**Key Principles (if implementing sophisticated AI):**
- ✅ **Fact-based responses only** — avoid generating information not found in source documents
- ✅ **Transparency** — provide source attribution for answers
- ✅ **Safety** — implement content filtering and inappropriate query detection
- ✅ **Scalability** — design to handle growing request volumes

**MVP v1 Reality:** In practice, MVP v1 may implement a much simpler FAQ bot or keyword-based Q&A system. Full RAG + LLM sophistication is optional.

---

### 1.2. Core Use Cases

#### 1.2.1. Helping Users Find Storage

**User Story:**
> "I need to store furniture from a two-bedroom apartment during renovation (3 months). Which warehouse fits?"

**Potential AI Functionality (if fully implemented):**
1. **Analyze query** → extract: `items=[furniture], duration=[3 months], room_count=[2]`
2. **Retrieve knowledge** from knowledge base:
   - Average volume for 2-bedroom apartment: 15-20 m³
   - Recommended box size: L (12-15 m²) or XL (20+ m²)
   - Warehouses with available boxes in user's region
3. **Generate response** with recommendations

**MVP v1 Simplification:**
- Can use simple keyword matching: "2-bedroom" → suggest L/XL boxes
- Can return pre-written FAQ answer about box sizes
- Can redirect to human operator for personalized advice

**Success Metrics (if implemented):**
- Recommendation relevance: >70% (aspirational: 85%)
- Conversion to warehouse view: >25% (aspirational: 40%)
- Conversion to booking: >10% (aspirational: 15%)

---

#### 1.2.2. Operator Support (Pricing, Management)

**Operator Story:**
> "How should I price 6 m² boxes in central Moscow?"

**Potential AI Functionality (if fully implemented):**
1. **Determine context** → operator, topic=pricing, location=Moscow center
2. **Retrieve data**:
   - Median price p50 for 6 m² boxes in center: 4200₽/month
   - Pricing guidelines from documentation
   - Competitor pricing data
3. **Generate structured response** with recommendations

**MVP v1 Simplification:**
- Can provide static pricing guidelines document
- Can show pre-calculated market statistics
- Can direct to manual pricing tools

**Success Metrics (if implemented):**
- Reduction in pricing setup time: 50-70%
- Pricing accuracy (±10% from optimum): >80%
- Operator satisfaction: >4.0/5

---

#### 1.2.3. Admin Support (Platform Questions)

**Admin Story:**
> "How does the warehouse moderation system work?"

**Potential AI Functionality (if fully implemented):**
1. **Retrieve** relevant section from admin documentation
2. **Format response** with step-by-step explanation

**MVP v1 Simplification:**
- Can provide direct link to admin documentation
- Can show static FAQ entry
- Can use simple keyword search over docs

**Success Metrics (if implemented):**
- Response speed: <3 sec
- Answer completeness: >80%
- Escalation to support needed: <10%

---

### 1.3. MVP v1 Limitations

**MVP focuses on minimal viable functionality with the following constraints:**

#### Functional Limitations:
1. **Text-only chat** — no voice input/output
2. **Single-turn requests** — no multi-turn dialogue (context not preserved between requests)
3. **Basic personalization** — considers only user role (user/operator/admin) and location
4. **Russian language only** — no multi-language support
5. **Static knowledge base** — manually updated documents (no real-time learning)

#### Technical Constraints:
1. **Rate limits (recommended):**
   - Anonymous users: 5 requests/hour
   - Authenticated users: 20 requests/hour
   - Operators: 50 requests/hour
   - Admins: 100 requests/hour
   *(Note: Actual limits determined by platform rate limiting strategy)*

2. **Request sizes (suggested):**
   - Max query length: 500 characters
   - Max context size: 8K tokens
   - Response timeout: 30 seconds

3. **Data retention (if chat history implemented):**
   - Chat history: 30 days (optional feature)
   - Logs: 90 days (follows platform logging policy)
   - Embeddings cache: 24 hours (if using vector DB)

4. **Quality targets (aspirational):**
   - Target retrieval precision@5: >80%
   - Max hallucination rate: 3%
   - Min confidence threshold: 0.6

**Note:** These are suggested targets for full implementation. MVP v1 may operate with lower quality metrics while validating the feature's value.

---

## Post-MVP / Advanced Capabilities (Non-Binding)

### **Future Enhancement Roadmap**

The following capabilities are **out of MVP v1 scope** and provided for future planning only. They are **not commitments** and represent possible evolution paths.

**⚠️ IMPORTANT:** None of these features should be implemented in MVP v1. They are documented to show the growth potential of the AI Chat Assistant module.

---

#### Phase 2: Enhanced Context (3-6 months post-MVP)
- ✨ **Multi-turn dialogue** — conversation context retention
- ✨ **Session memory** — user preference preservation
- ✨ **Proactive suggestions** — system-initiated relevant questions

#### Phase 3: Advanced Personalization (6-9 months post-MVP)
- ✨ **User profiling** — personalization based on search history
- ✨ **Behavioral patterns** — need prediction based on past behavior
- ✨ **Dynamic pricing** — real-time price optimization recommendations

#### Phase 4: Operator Automation (9-12 months post-MVP)
- ✨ **Automated responses** — 90% automation of standard queries
- ✨ **Predictive assistance** — real-time operator suggestions
- ✨ **Workflow automation** — CRM integration, automatic notifications

#### Phase 5: Advanced Features (12+ months post-MVP)
- ✨ **Voice input/output** — voice interface
- ✨ **Multi-language support** — English, Chinese
- ✨ **Image understanding** — warehouse photo analysis for validation
- ✨ **Sentiment analysis** — user mood detection

**Future Research Directions (Non-committal):**
- Fine-tuning custom LLM on self-storage domain
- Reinforcement Learning from Human Feedback (RLHF)
- Federated learning for privacy-preserving personalization

---

## 2. Architecture Overview

### 2.1. High-Level Components

**Note:** This architecture represents a **reference pattern** for a sophisticated implementation. MVP v1 may use a significantly simplified architecture.

The AI Chat Assistant can be built with **modular components** that clearly separate concerns:

```
┌─────────────────────────────────────────────────────────────────┐
│                    AI CHAT ASSISTANT (Reference Pattern)         │
│                   (Can be simplified for MVP v1)                 │
└─────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
         ┌────────────────────────────────────────────┐
         │      Query Preprocessor (Optional)          │
         │  • Normalization                           │
         │  • Intent Detection (can use keywords)     │
         │  • Entity Extraction (can use regex)       │
         └────────────────┬───────────────────────────┘
                          │
                          ▼
         ┌────────────────────────────────────────────┐
         │   Retrieval Layer - RAG (Recommended)       │
         │  • Vector DB (Qdrant) OR simple search     │
         │  • Embedding Model (can use simpler)       │
         │  • Top-K Retrieval (can be keyword-based)  │
         └────────────────┬───────────────────────────┘
                          │
                          ▼
         ┌────────────────────────────────────────────┐
         │      Ranking Layer (Optional)               │
         │  • Cosine Similarity (basic)               │
         │  • Cross-Encoder (advanced, optional)      │
         │  • Relevance Filtering                     │
         └────────────────┬───────────────────────────┘
                          │
                          ▼
         ┌────────────────────────────────────────────┐
         │     LLM Response Generator (Core)           │
         │  • Model: Claude Sonnet 4 (recommended)    │
         │  • Prompt Templates (simple acceptable)    │
         │  • Context Window: 8K tokens               │
         │  • Temperature: 0.3 (suggested)            │
         └────────────────┬───────────────────────────┘
                          │
                          ▼
         ┌────────────────────────────────────────────┐
         │    Safety Layer (Recommended, optional)     │
         │  • Source Attribution (can be basic)       │
         │  • Confidence Scoring (optional)           │
         │  • Content Filtering (basic validation)    │
         │  • Fact Verification (optional)            │
         └────────────────┬───────────────────────────┘
                          │
                          ▼
         ┌────────────────────────────────────────────┐
         │       Logging (Uses Platform Logger)        │
         │  • Request/Response Logging                │
         │  • Metrics Collection                      │
         │  • Error Tracking                          │
         └────────────────┬───────────────────────────┘
                          │
                          ▼
         ┌────────────────────────────────────────────┐
         │     Feedback Loop (Post-MVP)                │
         │  • User ratings (👍/👎)                    │
         │  • Operator annotations                     │
         │  • Model improvement cycle                 │
         └────────────────────────────────────────────┘
```

**Architectural Notes:**
- Modules shown are **optional components** for a full implementation
- MVP v1 can omit or simplify any layer except LLM Response Generator
- All components integrate with existing platform infrastructure
- No new databases or services should be introduced in MVP

---

### 2.1.1. Query Preprocessor (Optional Component)

**Purpose:** Initial processing and understanding of user queries

**Note:** This component is optional for MVP v1. Simple keyword matching or direct LLM processing may suffice.

**Potential Functions:**
1. **Normalization (basic):**
   - Lowercase transformation
   - Remove extra whitespace/punctuation
   - Expand abbreviations (м², кв.м → square meters)

2. **Intent Detection (can be simplified):**
   - Classification of query type through simple rules or ML classifier:
     - `SEARCH_WAREHOUSE` — warehouse search
     - `SEARCH_BOX` — box selection
     - `PRICING_QUERY` — price questions
     - `INFO_QUERY` — information request
     - `OPERATOR_SUPPORT` — operator assistance
     - `BOOKING_HELP` — booking assistance
     - `OTHER` — unclassified

3. **Entity Extraction (optional NER):**
   - Location: "Moscow", "m. Tverskaya", "CAO"
   - Box Size: "6 m²", "large box", "XL"
   - Price: "3000 rubles", "up to 5000₽"
   - Duration: "3 months", "six months", "for summer"
   - Features: "climate control", "24/7 access"

**Technology Stack (if implemented):**
- Framework: spaCy / Stanza (for Russian) OR simple regex
- Models: `ru_core_news_lg` (spaCy) or custom patterns
- Intent classifier: Simple keyword rules OR DistilBERT-based classifier

**Example Implementation (Illustrative):**

```python
# ILLUSTRATIVE CODE - NOT PRODUCTION READY
# This is a reference pattern, actual implementation may differ

# Input
query = "Мне нужен бокс 6 кв м в центре до 4к руб на 3 месяца"

# Simplified Output
{
  "normalized_query": "мне нужен бокс 6 квадратных метров в центре до 4000 dirhamй на 3 месяца",
  "intent": "SEARCH_BOX",
  "confidence": 0.92,
  "entities": {
    "box_size": {"value": 6, "unit": "m2"},
    "location": {"value": "центр", "type": "district"},
    "price": {"value": 4000, "currency": "RUB", "operator": "<="},
    "duration": {"value": 3, "unit": "months"}
  }
}
```

**MVP v1 Simplification:**
- Can use simple regex for entity extraction
- Can skip intent classification and route all queries to LLM
- Can perform minimal or no normalization

---

### 2.1.2. Retrieval Layer (RAG) - Recommended

**Purpose:** Find relevant documents from knowledge base

**Note:** This is a recommended component but can be simplified significantly for MVP v1.

**Components (if fully implemented):**
1. **Vector Database:** Qdrant (open-source) or simpler alternatives
2. **Embedding Model:** `intfloat/multilingual-e5-large` (or simpler)
   - Russian language support: excellent
   - Vector dimensionality: 1024
   - Context length: 512 tokens

3. **Indexing Pipeline:**
   ```
   Documents → Chunking → Embedding → Storage
   ```

4. **Retrieval Strategy:**
   - **Semantic Search** (recommended): cosine similarity in vector space
   - **Keyword Search** (acceptable): traditional BM25
   - **Hybrid Search** (optional): semantic + keyword
   - **Top-K Retrieval**: returns top 5-10 most relevant chunks

**Storage Architecture (Illustrative):**
```
Vector Database (if using Qdrant)
├── Collection: warehouses
│   ├── Payload: {warehouse_id, name, location, description}
│   └── Vector: embedding[1024]
├── Collection: boxes
│   ├── Payload: {box_id, size, price, features}
│   └── Vector: embedding[1024]
├── Collection: faq
│   ├── Payload: {question, answer, category}
│   └── Vector: embedding[1024]
├── Collection: operator_docs
│   ├── Payload: {topic, content, section}
│   └── Vector: embedding[1024]
└── Collection: platform_policies
    ├── Payload: {policy_name, content, version}
    └── Vector: embedding[1024]
```

**Example Query (Illustrative):**

```python
# ILLUSTRATIVE CODE - NOT PRODUCTION READY
# Actual implementation will vary based on chosen vector DB

# Query embedding
query_vector = embedding_model.encode("как выбрать размер бокса")

# Semantic search
results = vector_db.search(
    collection_name="faq",
    query_vector=query_vector,
    limit=10,
    score_threshold=0.6  # suggested minimum relevance
)

# Output format example
[
  {
    "id": "faq_42",
    "score": 0.87,
    "payload": {
      "question": "Как подобрать размер бокса?",
      "answer": "Рекомендуем ориентироваться на объем вещей...",
      "category": "box_selection"
    }
  },
  # ...more results
]
```

**MVP v1 Simplifications:**
- Can use PostgreSQL full-text search instead of vector DB
- Can use simple keyword matching
- Can pre-compute common questions and answers
- Can skip embeddings entirely and use rule-based retrieval

---

### 2.1.3. Ranking Layer (Optional - Advanced)

**Purpose:** Improve retrieval quality through reranking

**Note:** This is an advanced component and can be omitted in MVP v1. Simple cosine similarity may suffice.

**Two-Stage Ranking (if implemented):**

**Stage 1: Coarse Ranking (Fast)**
- Method: Cosine similarity in embedding space
- Speed: ~10ms for top-100 candidates
- Recall: high (~95%)

**Stage 2: Fine Ranking (Accurate)**
- Method: Cross-Encoder model
- Model: `cross-encoder/ms-marco-MiniLM-L-12-v2` (can be fine-tuned)
- Speed: ~50ms for top-10 reranking
- Precision: significantly higher than bi-encoder

**Workflow (Illustrative):**
```
1. Bi-Encoder Retrieval → Top-100 candidates
2. Cross-Encoder Reranking → Top-10 most relevant
3. Relevance Filtering → Remove scores < 0.6
4. Diversity Filtering → Ensure topic variety (MMR algorithm)
```

**Example Implementation (Illustrative):**

```python
# ILLUSTRATIVE CODE - NOT PRODUCTION READY
# This demonstrates a possible reranking approach

from sentence_transformers import CrossEncoder

# Stage 1: Bi-encoder retrieval
candidates = vector_db.search(query_vector, limit=100)

# Stage 2: Cross-encoder reranking (optional)
cross_encoder = CrossEncoder('cross-encoder/ms-marco-MiniLM-L-12-v2')
query_doc_pairs = [(query, doc['payload']['content']) for doc in candidates]
rerank_scores = cross_encoder.predict(query_doc_pairs)

# Sort by rerank scores
reranked_docs = sorted(
    zip(candidates, rerank_scores), 
    key=lambda x: x[1], 
    reverse=True
)[:10]

# Filter by threshold
final_docs = [doc for doc, score in reranked_docs if score > 0.6]
```

**Metrics (if implemented):**
- Improvement in Precision@5: +15-20% vs. bi-encoder only
- Latency overhead: +50ms (acceptable within timeout)

**MVP v1 Note:** Skip cross-encoder reranking. Use simple cosine similarity or even skip ranking entirely.

---

### 2.1.4. LLM Response Generator (Core Component)

**Purpose:** Generate natural language responses based on retrieved context

**Note:** This is the **core component** that should be implemented even in minimal MVP v1 versions.

**Recommended Model:** Anthropic Claude Sonnet 4 (`claude-sonnet-4-20250514`)
- Context window: 200K tokens (use max 8K for MVP efficiency)
- Output limit: 4K tokens
- Temperature: 0.3 (low for consistency) - can be adjusted
- Top-p: 0.9

**Prompt Engineering Strategy (Illustrative):**

**System Prompt Template Example:**
```
Ты — AI-ассистент платформы агрегатора складов самостоятельного хранения в России.

ТВОИ ЗАДАЧИ:
1. Помогать пользователям найти подходящий склад и бокс
2. Отвечать на вопросы о ценах, условиях, услугах
3. Поддерживать операторов складов в управлении бизнесом
4. Предоставлять информацию администраторам

ПРАВИЛА (рекомендуемые):
- ✅ Отвечай на основе предоставленного контекста
- ❌ Старайся не выдумывать цены, адреса, характеристики
- ✅ Если информации недостаточно, можешь сказать "Уточните, пожалуйста..."
- ✅ Желательно указывать источники
- ✅ Будь вежливым и профессиональным

ФОРМАТ ОТВЕТА (suggested):
1. Прямой ответ на вопрос
2. Детали / Рекомендации (если есть)
3. Источники информации (если возможно)

КОНТЕКСТ:
Роль пользователя: {user_role}
Локация: {user_location}
```

**User Message Template Example:**
```
ВОПРОС ПОЛЬЗОВАТЕЛЯ:
{user_query}

РЕЛЕВАНТНЫЕ ДОКУМЕНТЫ (если найдены):
{retrieved_docs}

Пожалуйста, ответь на вопрос, используя информацию из документов.
```

**Full Prompt Example (Illustrative):**

```python
# ILLUSTRATIVE CODE - NOT PRODUCTION READY
# This shows a possible prompt structure

system_prompt = f"""
Ты — AI-ассистент платформы агрегатора складов...
[full system prompt]

КОНТЕКСТ ЗАПРОСА:
Роль пользователя: user
Локация: Dubai, ЦАО
Тип запроса: SEARCH_BOX
"""

user_message = f"""
ВОПРОС ПОЛЬЗОВАТЕЛЯ:
{query}

РЕЛЕВАНТНЫЕ ДОКУМЕНТЫ:

[Документ 1: box_size_guidelines.md]
Для хранения мебели из 2-комнатной квартиры рекомендуем боксы 
размером L (12-15 м²) или XL (20+ м²). Средний объем мебели: 15-20 м³.

[Документ 2: warehouse_catalog.json]
{{
  "warehouse_id": 42,
  "name": "СклаДом на Ленинском",
  "location": "Москва, Ленинский проспект 52",
  "available_boxes": [
    {{"size": "L", "area_m2": 15, "price": 3500, "available": 3}}
  ],
  "rating": 4.8
}}

Пожалуйста, ответь на вопрос.
"""

# API call (illustrative)
response = claude_api.generate(
    model="claude-sonnet-4-20250514",
    system=system_prompt,
    messages=[{"role": "user", "content": user_message}],
    max_tokens=1024,
    temperature=0.3
)
```

**Output Example:**
```
Для хранения мебели из двухкомнатной квартиры рекомендую бокс 
размером L (12-15 м²). Вот подходящий вариант:

📦 "СклаДом на Ленинском"
- Размер: L (15 м²)
- Цена: 3500₽/мес
- Доступно: 3 бокса
- Рейтинг: 4.8/5

Источники: [box_size_guidelines.md, warehouse_catalog.json]
```

**MVP v1 Simplifications:**
- Can use simpler prompts
- Can skip context enrichment
- Can use smaller context windows
- Source attribution can be optional

---

### 2.1.5. Safety Layer (Recommended - Optional)

**Purpose:** Prevent hallucinations and ensure response safety

**Note:** This layer is recommended but can be simplified or deferred in MVP v1. Basic prompt engineering may provide sufficient safety.

**Potential Components:**

**1. Source Attribution Enforcement (Optional)**
- Each fact should reference a source
- Parse LLM response to check for source links
- If no sources → can optionally reject response or allow it

**2. Confidence Scoring (Optional - Advanced)**

```python
# ILLUSTRATIVE CODE - NOT PRODUCTION READY
# This shows a possible confidence calculation approach

def calculate_confidence(response, retrieved_docs, query):
    """
    Calculate confidence score for response.
    This is an example approach and can be simplified or omitted.
    """
    scores = {
        "retrieval_relevance": max(doc.score for doc in retrieved_docs),
        "source_coverage": count_sources_in_response(response) / len(retrieved_docs),
        "answer_overlap": semantic_similarity(response, retrieved_docs),
        # Advanced: hallucination detection can be skipped in MVP
    }
    
    # Weighted average (weights can be adjusted)
    confidence = (
        0.4 * scores["retrieval_relevance"] +
        0.3 * scores["source_coverage"] +
        0.3 * scores["answer_overlap"]
    )
    
    return confidence
```

**3. Content Filtering (Basic Recommended)**
- PII detection (if handling sensitive data) - can use simple patterns
- Inappropriate content detection - can use basic keyword filters
- Malicious query detection - can use simple heuristics

**4. Fact Verification (Advanced - Optional)**
- Cross-reference response facts against retrieved docs
- Can be implemented using NLI (Natural Language Inference) models
- MVP v1: Can skip this entirely and rely on prompt engineering

**MVP v1 Approach:**
- Implement basic input validation (length, format)
- Use well-crafted prompts to minimize hallucinations
- Skip advanced safety mechanisms unless critical
- Rely on human-in-the-loop for quality control initially

---

### 2.1.6. Logging Layer (Integrates with Platform)

**Purpose:** Track requests, responses, and system behavior

**Note:** AI Chat logging should integrate with the platform's existing logging infrastructure, not create a separate system.

**Integration Points:**
- Uses platform's logging service (see Logging Strategy canonical doc)
- Follows platform log levels and formats
- Sends logs to platform's log aggregation (e.g., existing ELK/Loki setup)

**What to Log (Recommended):**
1. **Request logs:**
   - User ID, role, session ID
   - Query text (may need PII scrubbing)
   - Timestamp, IP address (if logged per platform policy)

2. **Processing logs:**
   - Retrieved documents (IDs and scores)
   - Intent detection result (if implemented)
   - LLM model and parameters used
   - Processing time for each stage

3. **Response logs:**
   - Generated response text (may need PII scrubbing)
   - Confidence score (if calculated)
   - Sources referenced

4. **Error logs:**
   - Error type and message
   - Stack trace (for internal errors)
   - Recovery action taken

**Storage (Uses Platform Database):**
```sql
-- ILLUSTRATIVE SCHEMA - NOT CANONICAL
-- Actual schema should align with platform database spec

CREATE TABLE ai_chat_messages (
    id UUID PRIMARY KEY,
    user_id UUID,
    session_id UUID,
    query TEXT,
    response TEXT,
    confidence_score FLOAT,
    retrieved_doc_ids JSONB,
    processing_time_ms INT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_ai_chat_user ON ai_chat_messages(user_id);
CREATE INDEX idx_ai_chat_created ON ai_chat_messages(created_at);
```

**Metrics Collection (Uses Platform Monitoring):**
- Request count by user role
- Average response time
- Error rate
- Confidence score distribution
- (Advanced) Hallucination rate if tracking is implemented

**MVP v1 Note:** Use minimal logging initially. Can expand based on needs.

---

### 2.1.7. Feedback Loop (Post-MVP Feature)

**Purpose:** Collect user feedback for system improvement

**Note:** This is a post-MVP feature and not required for initial launch.

**Potential Feedback Mechanisms (Future):**
- 👍/👎 buttons on responses
- Optional text feedback
- Operator annotations of response quality
- Implicit feedback (user actions after receiving answer)

**Uses (Post-MVP):**
- Identify low-quality responses
- Retrain intent classifiers
- Improve retrieval algorithms
- Fine-tune prompt templates
- Build training datasets for custom models

**MVP v1:** Can be completely omitted. Collect feedback manually if needed.

---

### 2.2. Sequence Diagram (Illustrative)

**Note:** This diagram shows a possible request flow for a full implementation. MVP v1 may have a simpler flow.

```
┌──────────┐                                                      
│  User    │                                                      
│  Request │                                                      
└────┬─────┘                                                      
     │                                                            
     │ 1. HTTP POST /api/v1/ai/chat                              
     ▼                                                            
┌────────────────┐                                                
│  API Gateway   │  ← Uses platform auth & rate limiting        
│  (Platform)    │                                                
└────┬───────────┘                                                
     │ 2. Validate & route                                       
     ▼                                                            
┌────────────────────┐                                            
│  Query             │  ← Optional: Can skip in simple MVP       
│  Preprocessor      │                                            
└────┬───────────────┘                                            
     │ 3. Normalize, detect intent, extract entities             
     ▼                                                            
┌────────────────────┐                                            
│  Retrieval Layer   │  ← Can be keyword search in simple MVP    
│  (RAG)             │                                            
└────┬───────────────┘                                            
     │ 4. Search knowledge base                                  
     ▼                                                            
┌────────────────────┐                                            
│  Ranking Layer     │  ← Optional: Can skip in MVP              
└────┬───────────────┘                                            
     │ 5. Rerank results (optional)                              
     ▼                                                            
┌────────────────────┐                                            
│  LLM Generator     │  ← Core: This component is essential      
└────┬───────────────┘                                            
     │ 6. Generate response with retrieved context               
     ▼                                                            
┌────────────────────┐                                            
│  Safety Layer      │  ← Recommended: Basic checks advisable    
└────┬───────────────┘                                            
     │ 7. Validate response (optional checks)                    
     ▼                                                            
┌────────────────────┐                                            
│  Logging           │  ← Uses platform logger                   
└────┬───────────────┘                                            
     │ 8. Log request/response                                   
     ▼                                                            
┌────────────────┐                                                
│  Response      │                                                
│  to User       │                                                
└────────────────┘                                                
```

**Flow Notes:**
- Steps 3, 5, 7 are optional and can be omitted in MVP v1
- Step 4 can be simplified to keyword search or FAQ lookup
- Step 6 (LLM Generator) is the minimum required component
- All steps integrate with existing platform infrastructure

---

# Part 2: Knowledge Sources, Retrieval & Query Understanding

## 3. Knowledge Sources

### 3.1. Documents for Indexing (Recommended)

**Note:** The knowledge base can be as simple or sophisticated as MVP v1 requires. Starting with a small, curated set of documents is acceptable.

**Recommended Document Types (Priority Order):**

#### Priority 1 - Essential (Recommended for MVP v1):
1. **FAQ (Frequently Asked Questions)**
   - Format: Structured Q&A pairs
   - Coverage: Common user questions (50-100 entries acceptable)
   - Update frequency: Weekly or as needed
   - Example topics: box sizes, pricing basics, access hours

2. **Warehouse Catalog**
   - Format: JSON or structured data
   - Content: Basic warehouse information (name, location, box sizes, prices)
   - Update frequency: Real-time or daily sync
   - Source: Platform database

#### Priority 2 - Useful (Can defer if needed):
3. **Platform Policies**
   - Format: Markdown or plain text
   - Content: Terms of service, cancellation policies, payment terms
   - Update frequency: When policies change
   - Volume: 20-50 document chunks

4. **Operator Guidelines**
   - Format: Markdown documentation
   - Content: How to manage warehouse, set prices, handle bookings
   - Update frequency: Monthly or as needed
   - Volume: 50-100 document chunks

#### Priority 3 - Optional (Post-MVP):
5. **User Guides**
   - How to book, how to access storage, moving tips
   - Can be deferred to post-MVP

6. **Admin Documentation**
   - Internal platform documentation
   - Lower priority unless admin support is critical

**MVP v1 Simplification:**
- Start with just FAQ and basic warehouse data
- Can use pre-written answers without sophisticated retrieval
- Can manually curate small knowledge base (<100 entries)

---

### 3.2. Data Formats (Flexible)

**Supported Formats (Examples):**
- **Structured:** JSON, CSV (warehouse/box data from database)
- **Semi-structured:** Markdown, HTML (documentation)
- **Unstructured:** Plain text (policies, FAQs)

**MVP v1 Note:** Simple text files or JSON exports are sufficient. No need for sophisticated format handling initially.

---

### 3.3. Knowledge Base Update Process (Simplified Acceptable)

**Recommended Update Strategies:**

**Strategy 1: Manual Updates (Acceptable for MVP)**
- Admin manually updates FAQ/documentation files
- System reindexes when notified
- Frequency: Weekly or as needed

**Strategy 2: Scheduled Sync (Better)**
- Nightly batch job syncs from database
- Re-indexes changed documents only
- Suitable for warehouse/box data

**Strategy 3: Real-time Updates (Advanced - Optional)**
- Webhook-triggered updates on data changes
- Incremental indexing
- Post-MVP feature

**MVP v1 Approach:** Manual updates with weekly reindexing is acceptable. Can improve later based on needs.

---

### 3.4. MVP Constraints

**Knowledge Base Scale (MVP v1 Targets):**
- Warehouses: 200-500 entries
- Boxes: 5K-10K entries
- FAQ: 50-150 Q&A pairs
- Documents: <100K total chunks (can be much less initially)

**MVP v1 Note:** Even smaller knowledge bases (10-20 FAQs, 50 warehouses) are acceptable for initial testing and validation.

---

## 4. Retrieval Layer (RAG)

### 4.1. Embedding Model Selection (Recommended)

**Recommended Model:** `intfloat/multilingual-e5-large`
- **Rationale:** Good Russian support, open-source, well-tested
- **Size:** 560M parameters
- **Vector dimensions:** 1024
- **Context length:** 512 tokens
- **Performance:** Strong on semantic search tasks

**Alternative Options (If Needed):**
- **Lighter:** `intfloat/multilingual-e5-base` (smaller, faster, slightly lower quality)
- **Commercial:** OpenAI embeddings (paid, good quality)
- **No embeddings:** Skip vector search entirely, use keyword matching

**MVP v1 Decision:**
- Can use simpler embedding models
- Can skip embeddings and use PostgreSQL full-text search
- Can use keyword-based matching only

---

### 4.2. Chunking Strategy (Illustrative)

**Purpose:** Break documents into retrievable chunks

**Recommended Parameters (Can be adjusted):**
- **Chunk size:** 400 tokens (~300-500 words)
- **Overlap:** 50 tokens (helps maintain context at boundaries)
- **Max chunk length:** 512 tokens (model limit)

**Chunking Methods:**

**Method 1: Fixed-Size (Simple):**
```python
# ILLUSTRATIVE CODE - NOT PRODUCTION READY

def chunk_text_fixed(text, chunk_size=400, overlap=50):
    """
    Simple fixed-size chunking.
    This is a basic example - production code would be more robust.
    """
    tokens = text.split()  # Simplified tokenization
    chunks = []
    
    for i in range(0, len(tokens), chunk_size - overlap):
        chunk = ' '.join(tokens[i:i + chunk_size])
        chunks.append(chunk)
    
    return chunks
```

**Method 2: Semantic (Better - Optional):**
- Split on paragraph boundaries
- Keep logical sections together
- More sophisticated but requires more logic

**MVP v1 Simplification:**
- Fixed-size chunking is acceptable
- Can even skip chunking for short documents
- Can use document-level retrieval instead of chunk-level

---

### 4.3. Embedding Pipeline (Illustrative)

**Process Flow (if implementing embeddings):**

```
1. Document Ingestion → Load raw documents
2. Preprocessing → Clean, normalize text
3. Chunking → Split into retrievable units
4. Embedding → Generate vectors for each chunk
5. Indexing → Store in vector database
```

**Example Implementation (Illustrative):**

```python
# ILLUSTRATIVE CODE - NOT PRODUCTION READY
# This shows a possible embedding pipeline structure

from sentence_transformers import SentenceTransformer
from qdrant_client import QdrantClient

# Initialize models (example)
embedding_model = SentenceTransformer('intfloat/multilingual-e5-large')
vector_db = QdrantClient(host='localhost', port=6333)

def index_documents(documents):
    """
    Index documents into vector database.
    This is an illustrative pattern only.
    """
    for doc in documents:
        # Chunk document
        chunks = chunk_text_fixed(doc['content'])
        
        # Generate embeddings
        embeddings = embedding_model.encode(chunks)
        
        # Store in vector DB
        for i, (chunk, embedding) in enumerate(zip(chunks, embeddings)):
            vector_db.upsert(
                collection_name=doc['type'],  # e.g., 'faq', 'warehouses'
                points=[{
                    'id': f"{doc['id']}_chunk_{i}",
                    'vector': embedding.tolist(),
                    'payload': {
                        'doc_id': doc['id'],
                        'chunk_text': chunk,
                        'metadata': doc.get('metadata', {})
                    }
                }]
            )
```

**MVP v1 Note:** Can skip this entire pipeline and use simpler retrieval methods.

---

### 4.4. Top-K Retrieval (Standard RAG Pattern)

**Approach:** Retrieve the K most relevant documents/chunks for a query

**Recommended K values:**
- **K = 5-10:** Standard for most queries
- **K = 3:** For focused, specific questions
- **K = 15-20:** For broad, exploratory questions

**Retrieval Methods:**

**Option 1: Vector Similarity (Recommended if using embeddings)**
```python
# ILLUSTRATIVE CODE - NOT PRODUCTION READY

def retrieve_relevant_docs(query, k=10, score_threshold=0.6):
    """
    Retrieve top-K relevant documents using vector search.
    This is an illustrative example.
    """
    # Embed query
    query_vector = embedding_model.encode(query)
    
    # Search vector DB
    results = vector_db.search(
        collection_name='knowledge_base',
        query_vector=query_vector.tolist(),
        limit=k,
        score_threshold=score_threshold
    )
    
    return results
```

**Option 2: Keyword Search (Simpler, Acceptable for MVP)**
```python
# ILLUSTRATIVE CODE - NOT PRODUCTION READY

def retrieve_by_keywords(query, k=10):
    """
    Simple keyword-based retrieval using database.
    This is an acceptable MVP approach.
    """
    # Use PostgreSQL full-text search
    results = db.execute("""
        SELECT id, content, 
               ts_rank(search_vector, plainto_tsquery('russian', %s)) as score
        FROM knowledge_base
        WHERE search_vector @@ plainto_tsquery('russian', %s)
        ORDER BY score DESC
        LIMIT %s
    """, (query, query, k))
    
    return results
```

**MVP v1 Choice:**
- Option 2 (keyword search) is perfectly acceptable
- Can even use simple SQL LIKE queries initially
- Vector search can be added later if needed

---

### 4.5. Result Ranking (Optional Enhancement)

**Purpose:** Improve relevance of retrieved results

**Ranking Factors (if implemented):**
1. **Similarity score** (primary) - from retrieval
2. **Recency** (optional) - newer docs weighted higher
3. **Source authority** (optional) - official docs weighted higher
4. **User context** (optional) - personalization factors

**Simple Ranking Formula (Illustrative):**
```python
# ILLUSTRATIVE CODE - NOT PRODUCTION READY

def calculate_rank_score(doc, query, user_context):
    """
    Example ranking function. Can be much simpler in MVP.
    """
    score = 0.0
    
    # Primary: similarity score
    score += doc['similarity_score'] * 0.7
    
    # Secondary: recency (optional)
    if doc.get('updated_at'):
        days_old = (datetime.now() - doc['updated_at']).days
        recency_score = max(0, 1 - (days_old / 365))
        score += recency_score * 0.2
    
    # Tertiary: source authority (optional)
    if doc.get('source_type') == 'official':
        score += 0.1
    
    return score
```

**MVP v1 Note:** Simple similarity score ranking is sufficient. Additional factors can be added post-MVP.

---

## 5. Query Understanding

### 5.1. Query Normalization (Basic Recommended)

**Purpose:** Standardize query format for better matching

**Basic Normalization Steps (Recommended):**
1. **Lowercase:** Convert to lowercase
2. **Trim whitespace:** Remove leading/trailing spaces
3. **Remove special chars:** Keep alphanumeric and basic punctuation
4. **Expand abbreviations:** (optional) м² → квадратных метров

**Example (Illustrative):**
```python
# ILLUSTRATIVE CODE - NOT PRODUCTION READY

import re

def normalize_query(query):
    """
    Basic query normalization.
    This is a simple example - can be expanded or simplified as needed.
    """
    # Lowercase
    query = query.lower()
    
    # Remove extra whitespace
    query = re.sub(r'\s+', ' ', query).strip()
    
    # Expand common abbreviations (optional)
    query = query.replace('кв.м', 'квадратных метров')
    query = query.replace('м²', 'квадратных метров')
    query = query.replace('кв м', 'квадратных метров')
    
    return query
```

**MVP v1 Note:** Even basic normalization (lowercase + trim) can help. Advanced normalization can be added later.

---

### 5.2. Intent Detection (Optional Feature)

**Purpose:** Classify the type of user request

**Intent Categories (Illustrative):**
- `SEARCH_WAREHOUSE` — finding a warehouse
- `SEARCH_BOX` — finding a storage box
- `PRICING_QUERY` — questions about prices
- `INFO_QUERY` — general information requests
- `OPERATOR_SUPPORT` — operator assistance
- `BOOKING_HELP` — booking-related questions
- `COMPLAINT` — complaints or issues
- `OTHER` — uncategorized

**Implementation Options:**

**Option 1: Rule-Based (Simple, Acceptable for MVP)**
```python
# ILLUSTRATIVE CODE - NOT PRODUCTION READY

def detect_intent_simple(query):
    """
    Simple keyword-based intent detection.
    This is acceptable for MVP and easy to maintain.
    """
    query = query.lower()
    
    if any(word in query for word in ['найти', 'поиск', 'где', 'склад']):
        return 'SEARCH_WAREHOUSE'
    elif any(word in query for word in ['бокс', 'размер', 'объем']):
        return 'SEARCH_BOX'
    elif any(word in query for word in ['цена', 'стоимость', 'сколько']):
        return 'PRICING_QUERY'
    elif any(word in query for word in ['как забронировать', 'booking']):
        return 'BOOKING_HELP'
    else:
        return 'INFO_QUERY'
```

**Option 2: ML-Based (Advanced, Post-MVP)**
- Train a classifier (e.g., DistilBERT)
- Requires labeled training data
- Higher accuracy but more complex

**MVP v1 Recommendation:** Use simple keyword-based intent detection or skip intent detection entirely. LLM can handle varied intents without explicit classification.

---

### 5.3. Entity Extraction (NER) - Optional

**Purpose:** Extract structured information from queries

**Common Entities:**
- **Location:** Cities, districts, addresses
- **Box Size:** Dimensions, area measurements
- **Price:** Amounts, budgets, ranges
- **Duration:** Time periods, dates
- **Features:** Climate control, 24/7 access, security features

**Implementation Options:**

**Option 1: Regex Patterns (Simple)**
```python
# ILLUSTRATIVE CODE - NOT PRODUCTION READY

import re

def extract_entities_simple(query):
    """
    Simple regex-based entity extraction.
    Acceptable for MVP with common patterns.
    """
    entities = {}
    
    # Extract price (examples: "3000 dirhamй", "до 5000₽")
    price_match = re.search(r'(\d+)\s*(рубл|₽|руб)', query)
    if price_match:
        entities['price'] = int(price_match.group(1))
    
    # Extract box size (examples: "6 м²", "10 кв.м")
    size_match = re.search(r'(\d+)\s*(м²|кв\.?м)', query)
    if size_match:
        entities['box_size_m2'] = int(size_match.group(1))
    
    # Extract duration (examples: "3 месяца", "полгода")
    if 'месяц' in query:
        duration_match = re.search(r'(\d+)\s*месяц', query)
        if duration_match:
            entities['duration_months'] = int(duration_match.group(1))
    
    return entities
```

**Option 2: NER Model (Advanced, Optional)**
- Use spaCy with Russian model (`ru_core_news_lg`)
- Train custom NER for domain-specific entities
- Post-MVP enhancement

**MVP v1 Note:** Simple regex extraction is sufficient. Can skip entity extraction entirely and let LLM handle it.

---

### 5.4. Query Classification (Optional)

**Purpose:** Route queries to appropriate handlers

**Classification Dimensions (if implemented):**
- **User role:** Anonymous, User, Operator, Admin
- **Query complexity:** Simple (FAQ), Medium (needs retrieval), Complex (needs human)
- **Query language:** Russian (MVP), Other (future)

**MVP v1 Note:** Can skip classification. All queries can go through the same LLM handler initially.

---

# Part 3: LLM Generation, Safety & Input Specifications

## 6. LLM Response Generation

### 6.1. Prompt Template Structure (Illustrative)

**Three-Part Prompt Pattern (Recommended):**

1. **System Prompt** — Defines assistant role and rules
2. **Context** — Retrieved documents and user information
3. **User Query** — The actual question

**Example Structure:**

```
[System Prompt]
You are an AI assistant for a self-storage aggregator platform...

[Context]
User Role: {role}
Location: {location}
Retrieved Documents:
- Document 1: ...
- Document 2: ...

[User Query]
{user_question}
```

**Implementation (Illustrative):**

```python
# ILLUSTRATIVE CODE - NOT PRODUCTION READY
# This demonstrates a possible prompt structure

def build_prompt(query, retrieved_docs, user_context):
    """
    Build prompt for LLM.
    Actual implementation may vary significantly.
    """
    system_prompt = """
Ты — AI-ассистент платформы агрегатора складов самостоятельного хранения.

ТВОИ ЗАДАЧИ:
- Помогать пользователям найти подходящий склад
- Отвечать на вопросы о ценах и услугах
- Использовать только информацию из предоставленных документов

ПРАВИЛА:
- Отвечай кратко и по делу
- Если информации нет — скажи об этом
- Указывай источники информации
"""
    
    context = f"""
КОНТЕКСТ:
Роль: {user_context['role']}
Локация: {user_context.get('location', 'не указана')}

ДОКУМЕНТЫ:
"""
    
    for i, doc in enumerate(retrieved_docs, 1):
        context += f"\n[Документ {i}]\n{doc['content']}\n"
    
    user_message = f"\nВОПРОС: {query}\n\nПожалуйста, ответь на основе документов выше."
    
    return system_prompt, context + user_message
```

---

### 6.2. Generation Rules (Recommended Guidance)

**Suggested Rules for LLM (via prompt engineering):**

1. **Fact-based responses:** Use only information from retrieved documents
2. **Source attribution:** Reference sources when possible
3. **Admit uncertainty:** If no relevant info found, say so clearly
4. **Concise answers:** Aim for 2-4 sentences for simple questions
5. **Professional tone:** Be helpful, polite, professional

**Example Instruction Fragment:**
```
ВАЖНО:
- Отвечай только на основе предоставленных документов
- Если информации недостаточно, скажи: "К сожалению, у меня нет информации по этому вопросу"
- НИКОГДА не выдумывай цены, адреса или другие факты
- Указывай источники в конце ответа: [источник1, источник2]
```

**MVP v1 Note:** Start with simple rules. Refine prompts based on observed output quality.

---

### 6.3. Model Parameters (Suggested Settings)

**Recommended Configuration:**

```python
# ILLUSTRATIVE CONFIGURATION

llm_config = {
    'model': 'claude-sonnet-4-20250514',  # or latest available
    'temperature': 0.3,  # Low for consistency (0.0-0.5 range acceptable)
    'max_tokens': 1024,  # Adjust based on needed response length
    'top_p': 0.9,  # Standard value
    'top_k': 40,  # Optional, model-dependent
}
```

**Parameter Explanations:**
- **Temperature:** 
  - 0.0-0.3: More deterministic, consistent (recommended for factual Q&A)
  - 0.7-1.0: More creative (better for open-ended tasks)
  
- **Max tokens:** 
  - 512-1024: Standard for most answers
  - 2048-4096: For detailed explanations

**MVP v1 Note:** Default model settings often work well. Tune based on actual output quality.

---

### 6.4. Context Window Management (Recommended)

**Challenge:** Retrieved documents + prompt may exceed context limits

**Strategies:**

**Strategy 1: Prioritization (Recommended)**
```python
# ILLUSTRATIVE CODE

def select_top_docs(retrieved_docs, max_tokens=4000):
    """
    Select documents that fit within token budget.
    This is a simple example.
    """
    selected = []
    token_count = 0
    
    for doc in sorted(retrieved_docs, key=lambda x: x['score'], reverse=True):
        doc_tokens = estimate_tokens(doc['content'])
        if token_count + doc_tokens <= max_tokens:
            selected.append(doc)
            token_count += doc_tokens
        else:
            break
    
    return selected
```

**Strategy 2: Summarization (Advanced, Optional)**
- Summarize long documents before including
- Adds latency but saves context space
- Post-MVP enhancement

**MVP v1 Note:** Simple truncation or top-N selection is sufficient.

---

### 6.5. Response Formatting Guidelines (Suggested)

**Recommended Output Structure:**

1. **Direct Answer** (1-2 sentences)
2. **Supporting Details** (if relevant)
3. **Recommendations** (if applicable)
4. **Sources** (optional but recommended)

**Example Desired Output:**
```
Для хранения мебели рекомендую бокс размером L (12-15 м²).

Подходящие склады в вашем районе:
1. "СклаДом" — 3500₽/мес, рейтинг 4.8
2. "МойСклад" — 3200₽/мес, рейтинг 4.6

Источники: [warehouse_catalog, pricing_data]
```

**MVP v1 Note:** Let LLM format naturally initially. Add formatting rules as needed based on output quality.

---

## 7. Safety Layer

### 7.1. Anti-Hallucination Logic (Recommended)

**Goal:** Reduce instances of LLM generating false information

**Approaches:**

**Approach 1: Prompt Engineering (Essential, Easy)**
- Include strong instructions in system prompt
- Emphasize "use only provided documents"
- Explicitly forbid making up facts

**Approach 2: Response Validation (Optional)**
```python
# ILLUSTRATIVE CODE

def check_for_sources(response):
    """
    Simple check: Does response reference sources?
    This is a basic validation example.
    """
    source_indicators = ['[', 'источник', 'документ', 'согласно']
    has_sources = any(indicator in response.lower() for indicator in source_indicators)
    
    if not has_sources:
        # Can optionally reject or flag response
        return False, "No sources referenced"
    
    return True, "OK"
```

**Approach 3: NLI-Based Detection (Advanced, Post-MVP)**
- Use Natural Language Inference model
- Check if response is entailed by retrieved docs
- Requires additional model and latency

**MVP v1 Recommendation:** Use strong prompt engineering. Skip advanced detection mechanisms.

---

### 7.2. Content Filtering (Basic Recommended)

**Purpose:** Detect and handle inappropriate content

**Categories to Filter:**

1. **PII (Personal Identifiable Information)** — If handling
   - Phone numbers, addresses, emails
   - Can use regex patterns

2. **Inappropriate Language**
   - Profanity, offensive language
   - Can use keyword lists

3. **Malicious Queries**
   - SQL injection attempts
   - XSS patterns

**Simple Implementation (Illustrative):**
```python
# ILLUSTRATIVE CODE

def basic_content_filter(text):
    """
    Basic content filtering.
    This is a minimal example - production filters would be more robust.
    """
    # Check for common inappropriate patterns
    inappropriate_keywords = ['bad_word1', 'bad_word2']  # Populate appropriately
    
    for keyword in inappropriate_keywords:
        if keyword in text.lower():
            return False, "Inappropriate content detected"
    
    # Check for obvious malicious patterns
    malicious_patterns = ['<script>', 'DROP TABLE', 'SELECT * FROM']
    for pattern in malicious_patterns:
        if pattern in text:
            return False, "Potentially malicious query"
    
    return True, "OK"
```

**MVP v1 Note:** Basic input validation (length, format) may be sufficient initially. Add filters as needed.

---

### 7.3. Fallback Responses (Essential)

**When to Use Fallback:**
- No relevant documents found
- Low confidence score
- Error in LLM generation
- Content filter triggered

**Fallback Response Types:**

**Type 1: No Information Found**
```
К сожалению, у меня нет информации по вашему вопросу. 
Пожалуйста, обратитесь к оператору для помощи.
```

**Type 2: Need Clarification**
```
Не совсем понял ваш вопрос. Могли бы вы уточнить, 
что именно вы хотите узнать?
```

**Type 3: Technical Error**
```
Извините, произошла техническая ошибка. 
Попробуйте повторить запрос или обратитесь в поддержку.
```

**MVP v1 Note:** Simple, graceful fallback messages are essential. Avoid exposing technical errors to users.

---

### 7.4. Confidence Threshold Policy (Optional)

**Purpose:** Only show responses with sufficient confidence

**Suggested Threshold:** 0.6 (60%)
- Responses below threshold → use fallback
- Responses above threshold → return to user

**Implementation (Illustrative):**
```python
# ILLUSTRATIVE CODE

CONFIDENCE_THRESHOLD = 0.6

def should_return_response(confidence_score):
    """
    Decide whether to return AI response or fallback.
    This is a simple example of threshold logic.
    """
    if confidence_score < CONFIDENCE_THRESHOLD:
        return False, "Low confidence"
    return True, "OK"
```

**MVP v1 Note:** Confidence scoring can be omitted initially. Can add based on observed quality issues.

---

## 8. Input Specifications

### 8.1. Request Schema (Conceptual)

**Note:** This is a conceptual schema. Actual API contract is defined in the API Blueprint (canonical source).

**Example Request Body:**
```json
{
  "query": "string (1-500 chars)",
  "user_context": {
    "user_id": "uuid (optional)",
    "role": "user|operator|admin",
    "location": "string (optional)",
    "language": "ru (fixed for MVP)"
  },
  "options": {
    "include_sources": true,
    "max_results": 3,
    "streaming": false
  }
}
```

**Field Descriptions:**
- **query** (required): User's question or request
- **user_context** (optional): Contextual information
- **options** (optional): Request preferences

---

### 8.2. Input Validation (Recommended)

**Validation Rules:**

1. **Query Length:**
   - Min: 3 characters
   - Max: 500 characters (adjustable)
   - Reject if outside range

2. **Content Type:**
   - Only text input accepted in MVP
   - No images, files, URLs (unless specifically supported)

3. **Character Encoding:**
   - UTF-8 required
   - Reject invalid encodings

4. **Rate Limiting:**
   - Apply per-role limits (see API rate limiting spec)
   - Return 429 if exceeded

**Example Validation (Illustrative):**
```python
# ILLUSTRATIVE CODE

def validate_chat_request(request_data):
    """
    Validate incoming chat request.
    This is a basic example - production validation would be more comprehensive.
    """
    errors = []
    
    query = request_data.get('query', '')
    
    if len(query) < 3:
        errors.append("Query too short (min 3 chars)")
    
    if len(query) > 500:
        errors.append("Query too long (max 500 chars)")
    
    if not query.strip():
        errors.append("Query cannot be empty")
    
    return len(errors) == 0, errors
```

---

### 8.3. Request Size Limits (Suggested)

**Recommended Limits:**
- **Query text:** 500 characters
- **Total request size:** 10 KB
- **Context metadata:** 2 KB

**MVP v1 Note:** Conservative limits help control costs and prevent abuse. Can adjust based on usage patterns.

---

### 8.4. Authentication & Authorization (Uses Platform)

**Note:** AI Chat uses the platform's existing auth system.

**Authentication:**
- Uses platform JWT tokens
- Anonymous requests allowed (with strict rate limits)
- Authenticated requests have higher limits

**Authorization by Role:**
- **Anonymous:** FAQ access only
- **User:** Full chat functionality
- **Operator:** All features + operator-specific docs
- **Admin:** All features + admin docs

**MVP v1 Note:** Follow platform auth patterns. No separate auth for AI Chat.

---

# Part 4: Outputs, Metrics & Training

## 9. Output Specifications

### 9.1. Response Schema (Conceptual)

**Note:** Conceptual schema. API Blueprint is the canonical source.

**Example Response Body:**
```json
{
  "response": {
    "text": "string",
    "confidence": 0.85,
    "sources": [
      {"type": "faq", "id": "faq_123", "title": "..."},
      {"type": "warehouse", "id": "wh_456", "title": "..."}
    ]
  },
  "metadata": {
    "processing_time_ms": 1250,
    "retrieved_docs_count": 5,
    "model_used": "claude-sonnet-4"
  },
  "suggestions": [
    "Related question 1?",
    "Related question 2?"
  ]
}
```

**Field Descriptions:**
- **response.text**: The AI-generated answer
- **response.confidence**: Quality score (0-1), optional
- **response.sources**: Referenced documents, optional
- **metadata**: Processing information, optional
- **suggestions**: Related questions, optional/post-MVP

---

### 9.2. Confidence Score Calculation (Optional Feature)

**Purpose:** Indicate response quality/reliability

**Note:** This is an advanced feature and can be omitted in MVP v1.

**Possible Confidence Factors:**
```python
# ILLUSTRATIVE CODE - Advanced feature, not required for MVP

def calculate_confidence(response, retrieved_docs, query):
    """
    Calculate confidence score for response.
    This is an illustrative example of factors that could be considered.
    """
    score = 0.0
    
    # Factor 1: Retrieval quality (40% weight)
    if retrieved_docs:
        max_retrieval_score = max(doc['score'] for doc in retrieved_docs)
        score += 0.4 * max_retrieval_score
    
    # Factor 2: Source coverage (30% weight)
    sources_in_response = count_source_references(response)
    if sources_in_response > 0:
        coverage = min(1.0, sources_in_response / len(retrieved_docs))
        score += 0.3 * coverage
    
    # Factor 3: Response completeness (30% weight)
    # Check if response directly answers the query
    completeness = assess_completeness(response, query)  # 0-1
    score += 0.3 * completeness
    
    return round(score, 2)
```

**MVP v1 Note:** Can omit confidence scoring entirely. Add only if users/operators request it.

---

### 9.3. Source Attribution (Recommended)

**Purpose:** Show which documents were used for the answer

**Formats:**

**Format 1: Inline (Simple)**
```
... рекомендую бокс размером L (12-15 м²) [warehouse_guidelines]...
```

**Format 2: End of Response (Better)**
```
[Response text]

Источники:
- Руководство по выбору боксов
- Каталог складов
- Данные о ценах
```

**Format 3: Structured (Best)**
```json
"sources": [
  {
    "id": "doc_123",
    "type": "guideline",
    "title": "Руководство по выбору боксов",
    "url": "/docs/guidelines/box-selection"
  }
]
```

**MVP v1 Note:** Simple end-of-response attribution is acceptable. Structured format can be added later.

---

### 9.4. Error Responses (Essential)

**Common Error Scenarios:**

**Error 1: No Answer Found**
```json
{
  "error": {
    "code": "NO_ANSWER_FOUND",
    "message": "К сожалению, я не нашел ответа на ваш вопрос",
    "suggestion": "Попробуйте переформулировать вопрос или обратитесь к оператору"
  }
}
```

**Error 2: Rate Limit Exceeded**
```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Превышен лимит запросов",
    "retry_after": 3600
  }
}
```

**Error 3: Invalid Input**
```json
{
  "error": {
    "code": "INVALID_INPUT",
    "message": "Запрос слишком короткий (минимум 3 символа)",
    "field": "query"
  }
}
```

**MVP v1 Note:** Follow platform error response patterns. Maintain consistency with other API endpoints.

---

## 10. Quality Metrics

### 10.1. Retrieval Precision@K (Target: ≥80%)

**Definition:** Proportion of relevant documents in top-K results

**Formula:**
```
Precision@K = (Relevant docs in top-K) / K
```

**Measurement (if tracking):**
- Manual review of sample queries
- Operator feedback on result quality
- A/B testing different retrieval strategies

**MVP v1 Note:** Can skip formal metrics initially. Track informally based on user feedback.

---

### 10.2. Hallucination Rate (Target: <3%)

**Definition:** Percentage of responses containing fabricated information

**Measurement (if tracking):**
- Manual review of responses
- Check for facts not present in source documents
- Operator annotations of incorrect answers

**MVP v1 Note:** Manual spot-checking is acceptable. Automated detection is complex and post-MVP.

---

### 10.3. User Satisfaction (Target: ≥4.2/5)

**Measurement:**
- Thumbs up/down feedback (if implemented)
- Optional 1-5 star rating
- Follow-up survey questions

**MVP v1 Note:** Simple feedback mechanism (thumbs up/down) is easy to implement and valuable.

---

### 10.4. Response Latency (Target: p50=1.5s, p95=3.0s)

**Measurement:**
- Track processing time for each request
- Calculate percentiles (p50, p90, p95, p99)
- Monitor trends over time

**Target Breakdown:**
- Retrieval: 0.3-0.5s
- LLM generation: 0.8-1.2s
- Post-processing: 0.1-0.2s
- Total: 1.2-2.0s (typical)

**MVP v1 Note:** Basic timing logs are sufficient. Sophisticated monitoring can be added later.

---

## 11. Model Training & Improvement

### 11.1. Knowledge Base Updates (Essential Process)

**Update Frequency:**
- **Static content** (policies, guides): As needed
- **Dynamic content** (warehouse data): Daily sync recommended
- **FAQ**: Weekly review and updates

**Update Process (Simplified):**
1. Content changes identified
2. Documents re-indexed (manual or automated)
3. Vector embeddings regenerated (if using)
4. New version deployed

**MVP v1 Note:** Manual updates weekly is acceptable. Automate as volume grows.

---

### 11.2. Intent Classifier Training (Post-MVP)

**Note:** This is an advanced feature for post-MVP.

**If implementing ML-based intent detection:**
1. Collect labeled training data (queries + intent labels)
2. Train classifier on labeled data
3. Evaluate on test set
4. Deploy new model version
5. Monitor performance and retrain as needed

**MVP v1 Note:** Skip ML training. Use rule-based intent detection or none at all.

---

### 11.3. Feedback Loop Integration (Post-MVP)

**Purpose:** Use user feedback to improve system

**Feedback Types (Future):**
- Explicit: Thumbs up/down, ratings, comments
- Implicit: Click-through rates, conversation continuation
- Operator annotations: Corrections, quality flags

**Uses (Post-MVP):**
- Identify problematic queries
- Improve retrieval algorithms
- Refine prompt templates
- Build training datasets

**MVP v1 Note:** Collect feedback if easy, but don't build improvement loops yet.

---

### 11.4. A/B Testing Framework (Post-MVP)

**Purpose:** Test improvements systematically

**What to Test (Future):**
- Different prompt templates
- Retrieval strategies
- LLM models
- Ranking algorithms

**MVP v1 Note:** Not needed initially. Can add after MVP stabilizes.

---

# Part 5: Fallback, Integration & Future

## 12. Fallback & Degraded Mode

### 12.1. Vector DB Unavailable (Fallback Plan)

**Scenario:** Vector database is down or slow

**Fallback Options:**

**Option 1: Cached Results (Best)**
- Keep recent query→response cache in Redis
- Return cached answer if query matches
- Validity: 24-48 hours

**Option 2: Keyword Fallback**
- Fall back to PostgreSQL full-text search
- Quality lower but functional

**Option 3: Static FAQs**
- Return pre-written FAQ answers only
- Minimal functionality but reliable

**MVP v1 Note:** Have at least one fallback option. Option 3 (static FAQs) is simplest and most reliable.

---

### 12.2. LLM Service Unavailable (Critical Fallback)

**Scenario:** LLM API is down or rate-limited

**Fallback Options:**

**Option 1: Rule-Based Responses (Recommended)**
- Pattern matching for common questions
- Pre-written responses for frequent queries
- Example: "How to book?" → Return booking guide link

**Option 2: Redirect to Human Support**
```
"К сожалению, AI-ассистент временно недоступен. 
Пожалуйста, обратитесь к оператору через форму поддержки."
```

**Option 3: Degraded Service Notice**
```
"AI-ассистент работает в ограниченном режиме. 
Некоторые функции могут быть недоступны."
```

**MVP v1 Note:** Option 2 (redirect to support) is simplest and safest.

---

### 12.3. No Relevant Documents Found

**Scenario:** Retrieval returns no results or very low scores

**Responses:**

**Response 1: Request Clarification**
```
"Не совсем понял ваш вопрос. Могли бы вы уточнить или 
переформулировать? Например: 'Какой размер бокса нужен 
для мебели из 2-комнатной квартиры?'"
```

**Response 2: Suggest Topics**
```
"К сожалению, не нашел информации по этому вопросу. 
Могу помочь с:
- Выбором размера бокса
- Поиском склада в вашем районе
- Вопросами о ценах"
```

**Response 3: Escalate to Human**
```
"Для получения ответа на этот вопрос лучше обратиться 
к оператору. Могу соединить вас?"
```

**MVP v1 Note:** All three responses are useful. Can combine them intelligently.

---

### 12.4. Graceful Degradation Strategy

**Four Degradation Levels:**

**Level 0: Full Service (Target)**
- All components functioning
- Full RAG pipeline
- LLM generation with quality checks

**Level 1: Reduced Quality (Acceptable)**
- Skip reranking
- Reduce retrieved doc count
- Simplify response validation

**Level 2: Minimal Service (Fallback)**
- Keyword search only
- Pre-written responses
- No LLM generation

**Level 3: Offline (Last Resort)**
- Static error message
- Contact information for support
- Status page link

**MVP v1 Note:** Plan for levels 0, 2, and 3. Level 1 is optimization for later.

---

## 13. Backend & UI Integration

### 13.1. API Endpoints (Conceptual - Not Canonical)

**Note:** These are conceptual patterns. See API Blueprint for canonical contracts.

**Endpoint 1: Send Chat Message**
```
POST /api/v1/ai/chat

Request:
{
  "query": "string",
  "user_context": {...}
}

Response:
{
  "response": {
    "text": "string",
    "confidence": 0.85
  }
}
```

**Endpoint 2: Get Chat History (Optional)**
```
GET /api/v1/ai/chat/history?user_id={id}&limit=20

Response:
{
  "messages": [
    {"id": "msg_1", "query": "...", "response": "...", "timestamp": "..."},
    ...
  ]
}
```

**Endpoint 3: Submit Feedback (Post-MVP)**
```
POST /api/v1/ai/chat/{message_id}/feedback

Request:
{
  "rating": 1,  # -1 (thumbs down) or 1 (thumbs up)
  "comment": "string (optional)"
}
```

**MVP v1 Note:** Endpoint 1 is essential. Others are optional enhancements.

---

### 13.2. Rate Limiting (Uses Platform Rate Limiter)

**Note:** AI Chat integrates with platform rate limiting. See API Rate Limiting spec for details.

**Suggested Limits (from spec):**
- Anonymous: 5 requests/hour
- User: 20 requests/hour
- Operator: 50 requests/hour
- Admin: 100 requests/hour

**MVP v1 Note:** Follow platform rate limiting strategy. No separate limits for AI Chat.

---

### 13.3. Chat History Storage (Optional Feature)

**Schema Example (Illustrative):**
```sql
-- ILLUSTRATIVE SCHEMA - NOT CANONICAL
-- See full_database_specification_mvp_v1 for canonical schemas

CREATE TABLE ai_chat_sessions (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    last_activity TIMESTAMP DEFAULT NOW()
);

CREATE TABLE ai_chat_messages (
    id UUID PRIMARY KEY,
    session_id UUID REFERENCES ai_chat_sessions(id),
    user_id UUID,
    query TEXT NOT NULL,
    response TEXT,
    confidence_score FLOAT,
    retrieved_docs JSONB,
    processing_time_ms INT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_ai_chat_user ON ai_chat_messages(user_id);
CREATE INDEX idx_ai_chat_session ON ai_chat_messages(session_id);
```

**Retention Policy:**
- Chat history: 30 days (user-facing)
- Logs: 90 days (analytics)
- Aggregated metrics: 2 years

**MVP v1 Note:** Chat history storage is optional. Can be session-only (not persisted) initially.

---

### 13.4. UX Requirements for Chat Interface

**Essential UI Elements:**

1. **Chat Input Box**
   - Placeholder: "Задайте вопрос..." / "Ask a question..."
   - Character counter (500 max)
   - Send button + Enter key support

2. **Message Display**
   - User messages: Right-aligned, distinct color
   - AI responses: Left-aligned, different color
   - Timestamps (optional)
   - Loading indicator while processing

3. **Error Handling**
   - Show friendly error messages
   - Retry button for failed requests
   - Clear indication of degraded service

**Optional UI Elements (Nice to Have):**
- Suggested questions/prompts
- Thumbs up/down feedback buttons
- "Ask operator" escalation button
- Chat history view
- Copy response button

**MVP v1 Note:** Keep UI minimal initially. Can enhance based on user feedback.

---

## 14. Post-MVP / Advanced Capabilities (Non-Binding)

**IMPORTANT:** All features in this section are **out of MVP v1 scope**. They are documented for future planning only and represent **non-binding** exploration of possible system evolution.

---

### 14.1. Multi-Turn Dialogue (Post-MVP)

**Concept:** Remember conversation context across multiple messages

**Implementation Approach (Illustrative):**
- Store conversation history in session
- Pass previous messages to LLM as context
- Manage context window size (truncate old messages)

**Benefits:**
- Natural follow-up questions
- Better user experience
- More sophisticated assistance

**Complexity:** Medium
**Timeline:** 3-6 months post-MVP

---

### 14.2. Voice Input/Output (Post-MVP)

**Concept:** Allow users to speak queries and hear responses

**Implementation Approach:**
- Integrate speech-to-text API (e.g., Google Speech API, Whisper)
- Integrate text-to-speech API (e.g., Google TTS, ElevenLabs)
- Handle audio streaming

**Benefits:**
- Accessibility
- Hands-free operation
- Broader user reach

**Complexity:** High
**Timeline:** 9-12 months post-MVP

---

### 14.3. Predictive Operator Assistance (Post-MVP)

**Concept:** AI suggests responses to operators in real-time

**Implementation:**
- Monitor operator chat conversations
- Generate suggested responses
- Operator can accept/modify/reject

**Benefits:**
- Faster operator response time
- Consistent quality
- Training tool for new operators

**Complexity:** High
**Timeline:** 6-9 months post-MVP

---

### 14.4. Full Support Automation (Post-MVP)

**Concept:** AI handles support tickets end-to-end

**Capabilities:**
- Classify support tickets
- Route to appropriate handler
- Respond automatically to common issues
- Escalate complex cases to humans

**Complexity:** Very High
**Timeline:** 12+ months post-MVP

---

### 14.5. Multi-Language Support (Post-MVP)

**Concept:** Support English, Chinese, other languages

**Implementation:**
- Language detection in queries
- Multi-lingual knowledge base
- Language-specific prompt templates
- Translation integration if needed

**Complexity:** Medium-High
**Timeline:** 6-9 months post-MVP

---

### 14.6. Advanced Personalization (Post-MVP)

**Concept:** Tailor responses based on user history and preferences

**Features:**
- User profile building from interaction history
- Preference learning (location, price range, features)
- Personalized recommendations
- Predictive suggestions

**Complexity:** High
**Timeline:** 9-12 months post-MVP

---

# Document Conclusion

## Summary

This document provides a **reference implementation guide** for the AI Chat Assistant module as a supporting capability within the self-storage aggregator platform.

**Key Takeaways:**

1. **MVP v1 Flexibility:** The AI Chat Assistant can be implemented as simply or sophisticatedly as resources allow. A basic FAQ bot is acceptable; full RAG+LLM is optional enhancement.

2. **Architecture Subordination:** All AI components integrate within existing platform infrastructure. No new independent services or databases should be introduced.

3. **Implementation Freedom:** Code examples are illustrative. Teams should adapt patterns to their tech stack, constraints, and priorities.

4. **Post-MVP Features:** Sections 14 and various "advanced" subsections describe future possibilities only. They are non-binding explorations.

5. **Quality Over Speed:** It's better to ship a simple, reliable AI assistant than a complex, unstable one. Start small, iterate based on feedback.

## Implementation Checklist

**Minimum MVP v1 (Essential):**
- ✅ Basic chat API endpoint
- ✅ LLM integration (Claude or similar)
- ✅ Simple knowledge retrieval (keyword search acceptable)
- ✅ Input validation and rate limiting
- ✅ Error handling and fallback responses
- ✅ Basic logging integration

**Recommended MVP v1 (If Resources Allow):**
- ☐ Vector-based semantic search
- ☐ Prompt engineering for quality responses
- ☐ Source attribution in responses
- ☐ Basic confidence scoring
- ☐ Chat history persistence
- ☐ User feedback mechanism

**Post-MVP (Future):**
- ☐ Multi-turn dialogue
- ☐ Advanced personalization
- ☐ Operator assistance features
- ☐ Multi-language support
- ☐ Voice interface
- ☐ Automated training loops

## Final Notes

**For Product Managers:**
- Manage expectations: MVP v1 AI will be limited
- Set realistic quality targets
- Plan iterative improvements based on user feedback

**For Engineers:**
- Prioritize reliability over sophistication
- Integrate with existing platform infrastructure
- Keep implementation simple initially
- Iterate based on actual usage patterns

**For Stakeholders:**
- AI Chat is a supporting feature, not a core platform requirement
- MVP v1 success ≠ perfect AI
- ROI will be measured after launch and iteration

---

**End of Document DOC-007**

**Version:** 1.0 (MVP v1 Hardened)  
**Classification:** Supporting / Deep Technical Specification  
**Status:** Ready for Review

---

