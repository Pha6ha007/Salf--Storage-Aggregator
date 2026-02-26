# AI Core Design (MVP v1)

**Document ID:** DOC-009  
**Project:** Self-Storage Aggregator MVP  
**Version:** 1.0  
**Status:** 🟢 Canonical  
**Date:** December 2025

---

## 1. Purpose & Scope

### 1.1. Document Purpose

This document establishes the architectural role and conceptual design of the AI Core within the Self-Storage Aggregator platform. It defines what AI capabilities exist, how they integrate with the platform, and the principles governing their behavior.

This is a **design-level document**. It describes the intent, responsibilities, and boundaries of AI modules without specifying implementation details, infrastructure choices, or operational parameters.

### 1.2. What This Document Covers

- Conceptual placement of AI Core within the platform architecture
- List of AI modules included in MVP
- Responsibilities and boundaries of each module
- Interaction patterns between AI Core and other platform components
- Design principles for failure handling and degradation
- Data usage principles and trust boundaries

### 1.3. What This Document Explicitly Does NOT Cover

This document does not address:

- Implementation details or code structures
- Infrastructure components or vendor selections
- Operational parameters such as timing, quotas, or capacity
- Monitoring strategies or observability mechanics
- Security mechanisms or authentication protocols
- Database schemas or API payload formats
- Testing strategies or quality assurance procedures
- Cost models or budget allocations

For these topics, refer to:
- **DOC-016** (API Detailed Specification) for endpoints and payloads
- **DOC-017** (Rate Limiting) for usage constraints
- **DOC-057** (Monitoring & Observability) for operational visibility
- **DOC-036** (Security & Compliance) for security mechanisms
- **DOC-083** (SLO/SLA/SLI) for service level objectives

---

## 2. AI Core Position in Platform Architecture

### 2.1. Architectural Role

AI Core functions as an **advisory layer** within the platform. It provides intelligent recommendations, insights, and assistance to enhance user experience and operational efficiency. It does not make authoritative decisions or enforce business rules.

The AI Core operates as a component integrated into the backend application layer. It is invoked by business logic services when intelligent assistance is required. It is not positioned as a gatekeeper or decision-making authority.

### 2.2. Relationship to Platform Layers

**Frontend Layer:**
- Consumes AI-generated recommendations and insights
- Presents AI outputs to users with appropriate context
- Collects user feedback on AI quality

**Backend Layer:**
- Invokes AI Core modules through internal service interfaces
- Provides context and data to AI modules
- Applies business rules to AI recommendations
- Logs AI interactions for quality monitoring

**Data Layer:**
- AI Core reads from operational data stores
- AI interactions are logged to dedicated storage
- AI does not directly modify core business entities

### 2.3. Integration Philosophy

AI Core is designed as an **optional enhancement** rather than a critical dependency. The platform maintains full functionality in the absence of AI responses. When AI modules are unavailable or produce unusable outputs, the platform gracefully degrades to non-AI workflows.

This philosophy ensures that AI failures do not cascade into platform failures and that users always receive a functional experience.

---

## 3. AI Modules Overview

The MVP includes five distinct AI modules, each serving a specific purpose within the platform's user and operator journeys.

### 3.1. Box Size Recommendation

Assists users in determining appropriate storage box sizes based on natural language descriptions of items to be stored. This module reduces friction in the booking process by translating user needs into actionable size recommendations.

### 3.2. Pricing Intelligence

Provides operators with market context for their pricing decisions. This module analyzes comparative pricing data and generates insights about market positioning. It is advisory only and does not set or enforce prices.

**MVP Scope:** Analysis is based on static market data at the time of request. Predictive or dynamic pricing capabilities are explicitly excluded from MVP.

### 3.3. Content & Description Generation

Assists operators in creating descriptive content for warehouse listings. This module generates text based on warehouse attributes and characteristics. It reduces the burden of content creation while maintaining consistency across listings.

### 3.4. Review & Feedback Analysis

**Status:** Planned for MVP but implementation priority is lower than other modules.

When implemented, this module will analyze user-generated reviews to extract themes, sentiment, and actionable insights. It helps operators understand customer sentiment without manually reviewing every comment.

**MVP Limitation:** Basic sentiment categorization only. Advanced analysis is deferred to future versions.

### 3.5. AI Chat Assistant

Provides conversational assistance to users exploring the platform. This module answers common questions about the platform, warehouses, and booking process. It is supportive rather than transactional—it does not execute bookings or modifications.

**MVP Scope:** Answers are derived from curated knowledge base content. The assistant does not have memory of multi-turn conversations or access to real-time operational data beyond what is explicitly provided in each request.

---

## 4. Module Responsibilities & Boundaries

### 4.1. Box Size Recommendation

**Responsibilities:**

- Interpret natural language descriptions of items requiring storage
- Estimate spatial requirements based on item descriptions
- Map estimated requirements to available box size categories
- Provide confidence indicators for recommendations
- Identify when additional information is needed from the user

**Explicit Non-Responsibilities:**

- Does not guarantee that recommended sizes will meet user needs
- Does not consider item value, fragility, or special storage requirements beyond size
- Does not check real-time box availability
- Does not account for future storage expansion needs
- Does not enforce size selection

**Data Consumed (Conceptual):**

- User's natural language description of items
- Optional: User's location context
- Optional: User's budget constraints
- Warehouse and box catalog data for context

**Output Produced (Conceptual):**

- Ordered list of recommended box sizes
- Confidence indicators for each recommendation
- Explanatory reasoning for recommendations
- Optional: Follow-up questions when input is ambiguous

### 4.2. Pricing Intelligence

**Responsibilities:**

- Aggregate and analyze pricing data across comparable warehouses
- Identify market position of a specific warehouse's pricing
- Generate descriptive insights about pricing relative to market
- Suggest directional pricing considerations
- Highlight pricing anomalies or outliers

**Explicit Non-Responsibilities:**

- Does not set prices
- Does not predict future market trends
- Does not account for operational costs or margins
- Does not consider demand elasticity
- Does not enforce pricing strategies
- Does not access competitor's internal cost structures

**Data Consumed (Conceptual):**

- Current pricing of the subject warehouse
- Pricing of comparable warehouses in the same market
- Warehouse characteristics that influence pricing
- Geographic proximity information

**Output Produced (Conceptual):**

- Market position summary
- Comparative statistics
- Directional insights
- Optional: Suggested considerations for pricing review

### 4.3. Content & Description Generation

**Responsibilities:**

- Generate descriptive text based on warehouse attributes
- Maintain consistent tone and structure across generated content
- Incorporate key features and differentiators into descriptions
- Produce search-optimized text
- Adapt content style based on operator preferences

**Explicit Non-Responsibilities:**

- Does not create content from images or external sources
- Does not verify factual accuracy of input attributes
- Does not translate content across languages
- Does not generate promotional claims or guarantees
- Does not incorporate user reviews into generated content

**Data Consumed (Conceptual):**

- Warehouse attributes and features
- Location and access information
- Service offerings
- Operator preferences for tone and emphasis

**Output Produced (Conceptual):**

- Primary description text
- Key highlights or bullet points
- Search-relevant keywords
- Optional: Multiple content variations

### 4.4. Review & Feedback Analysis

**Responsibilities:**

- Extract themes from user-generated reviews
- Categorize sentiment across review corpus
- Identify frequently mentioned topics
- Highlight actionable feedback patterns
- Aggregate insights across multiple reviews

**Explicit Non-Responsibilities:**

- Does not moderate or filter inappropriate content
- Does not validate factual accuracy of reviews
- Does not respond to reviews
- Does not alter or summarize individual reviews
- Does not compare reviews across competing warehouses

**Data Consumed (Conceptual):**

- User-generated review text
- Associated ratings
- Warehouse context
- Review submission timestamps

**Output Produced (Conceptual):**

- Sentiment distribution
- Common themes
- Notable positive and negative patterns
- Optional: Suggested areas for operational improvement

### 4.5. AI Chat Assistant

**Responsibilities:**

- Answer common questions about platform usage
- Provide information about warehouse features and policies
- Guide users through booking concepts
- Clarify terminology and definitions
- Acknowledge when questions are beyond its scope

**Explicit Non-Responsibilities:**

- Does not execute transactions or bookings
- Does not access user account data
- Does not provide legally binding information
- Does not remember previous conversations beyond what is explicitly provided
- Does not contact users outside the chat interface
- Does not escalate to human operators

**Data Consumed (Conceptual):**

- User's question or statement
- Optional: Context about specific warehouse being viewed
- Curated knowledge base content
- Platform policies and guidelines

**Output Produced (Conceptual):**

- Natural language response
- Optional: Suggested follow-up questions
- Optional: Links to relevant platform resources
- Confidence indicator for response quality

---

## 5. AI API Interaction Model (Conceptual)

### 5.1. Request Initiation

AI modules are invoked by backend services when intelligent assistance is deemed valuable for a user interaction or operator task. Invocation is a deliberate choice by business logic, not an automatic process.

The invoking service provides necessary context and input to the AI module. This context includes the user's intent, relevant data entities, and any constraints that should guide the AI's response.

### 5.2. Response Handling

AI modules return responses that include both primary output and metadata about the response quality. This metadata enables the invoking service to make informed decisions about how to use or present the AI output.

The invoking service retains full authority to:
- Accept, modify, or reject AI recommendations
- Combine AI output with non-AI logic
- Apply business rules as a final filter
- Choose how to present AI output to users

### 5.3. Statelessness Principle

Each AI request is treated as independent. AI modules do not maintain conversational state or user-specific models. Any required context must be provided explicitly with each request.

This design simplifies the AI Core architecture and ensures predictable behavior. It also aligns with the principle that AI is advisory rather than authoritative.

### 5.4. Fallback Philosophy

When an AI module cannot produce a useful response, the invoking service reverts to non-AI logic. This may involve:
- Using simpler heuristics
- Presenting raw data without interpretation
- Offering manual alternatives
- Gracefully degrading the user experience

The platform is designed such that every AI-assisted workflow has a non-AI equivalent. No critical user journey depends exclusively on AI availability.

---

## 6. Failure & Degradation Philosophy

### 6.1. AI as Advisory

AI recommendations are treated as suggestions, not commands. The platform's business logic applies final judgment to all AI outputs. Users and operators maintain ultimate decision-making authority.

This principle means that AI failures do not block user workflows. When AI is unavailable, users receive a slightly diminished experience but retain access to core platform functionality.

### 6.2. Graceful Degradation

When AI modules encounter failures, the system degrades functionality gracefully:

**Transparent Communication:**
Users are informed when AI assistance is unavailable or uncertain. This maintains trust and sets appropriate expectations.

**Progressive Enhancement:**
Core workflows function without AI. AI adds value when available but is not a prerequisite for task completion.

**Quality Indicators:**
AI outputs include confidence or quality indicators. Low-confidence outputs are presented differently or withheld entirely.

### 6.3. Fallback Strategies

Each AI module has a defined fallback approach:

**Box Size Recommendation:**
Falls back to simplified heuristics or allows manual size selection.

**Pricing Intelligence:**
Falls back to presenting raw comparative data without interpretation.

**Content Generation:**
Falls back to template-based content or manual entry.

**Review Analysis:**
Falls back to displaying raw reviews without synthesis.

**Chat Assistant:**
Falls back to directing users to static help resources.

### 6.4. Non-Determinism Awareness

AI outputs may vary for identical inputs. The platform design acknowledges this non-determinism and does not rely on strict reproducibility. User-facing features are designed to accommodate response variation.

When consistency is critical, business logic enforces it independent of AI output.

---

## 7. Data Usage Principles

### 7.1. Data Minimization

AI modules request only the data necessary to fulfill their specific function. Broad data access is avoided in favor of narrow, purpose-specific data provision.

This principle limits the scope of potential data exposure and simplifies reasoning about AI behavior.

### 7.2. Derived vs. Source Data

AI modules prefer working with derived or aggregated data rather than raw operational data. This reduces coupling between AI modules and core business entities.

For example, pricing intelligence works with summarized market data rather than direct access to individual warehouse financial records.

### 7.3. Privacy Awareness

AI modules do not process personally identifiable information unless explicitly required for their function. User-generated content provided to AI modules is handled according to platform privacy policies.

AI modules do not retain user data beyond the scope of a single request. Any long-term learning or adaptation is based on aggregated, anonymized patterns.

### 7.4. Source Attribution

When AI generates content or recommendations based on external data, the system maintains awareness of data provenance. This enables proper attribution and supports transparency about AI reasoning.

### 7.5. Alignment with Compliance

AI data usage aligns with principles established in:
- **DOC-036** (Security & Compliance Plan) for data handling standards
- **DOC-078** (Data Retention Policy) for storage duration principles
- Platform-wide privacy policies for user data protection

---

## 8. Security & Trust Boundaries

### 8.1. Isolation Principles

AI Core operates within defined trust boundaries. It does not have elevated privileges to modify core business data or execute transactions. All state changes are performed by business logic services, not by AI modules directly.

This isolation ensures that AI errors or anomalies cannot corrupt operational data or violate business rules.

### 8.2. Access Control Intent

Access to AI modules follows the same authorization model as the rest of the platform. Users receive AI assistance appropriate to their role and context. Operators see different AI outputs than end users.

AI modules do not implement authorization logic themselves. Authorization is enforced by the invoking service before AI invocation.

### 8.3. Non-Determinism Trust

Users and operators are made aware that AI outputs are advisory and may vary. The platform does not present AI recommendations as absolute truth. This transparency manages expectations and maintains user trust.

### 8.4. External Dependency

AI Core may rely on external services for language model capabilities. This dependency is acknowledged in platform design. The platform architecture ensures that external service failures do not compromise core platform security or data integrity.

Communication with external AI services is treated as any other third-party integration, subject to appropriate security controls and monitoring.

---

## 9. MVP Limitations & Non-Goals

### 9.1. What AI Does NOT Do in MVP

**Complex Multi-Turn Conversations:**
The chat assistant does not maintain conversational memory beyond a single exchange. Multi-turn dialogues are explicitly out of scope.

**Real-Time Learning:**
AI modules do not adapt based on user feedback during MVP. Feedback is collected but not used to modify AI behavior in real-time.

**Predictive Analytics:**
Forecasting future demand, pricing trends, or market conditions is excluded from MVP scope.

**Image Processing:**
AI does not analyze or generate images. All AI interactions are text-based.

**Multi-Language Support:**
MVP AI modules operate in a single language. Translation and multi-language understanding are deferred.

**Personalization:**
AI recommendations are not tailored to individual user history or preferences during MVP. All recommendations are based on the immediate request context only.

**Automated Decision-Making:**
No AI module autonomously executes transactions, approvals, or modifications to platform state.

### 9.2. Deferred to Future Versions

**Advanced Review Analysis:**
Deep semantic analysis, trend detection, and predictive sentiment are planned for post-MVP.

**Pricing Optimization:**
Dynamic pricing recommendations based on demand patterns are planned for future versions.

**Conversational Memory:**
Multi-turn dialogue with context retention is planned for future chat assistant enhancements.

**Custom Content Styles:**
Highly customized content generation based on brand guidelines is deferred.

**Proactive Recommendations:**
AI-initiated suggestions without explicit user requests are out of scope for MVP.

---

## 10. Relationship to Other Documents

### 10.1. MVP Requirements Specification (DOC-001)

The AI modules defined in this document directly support user stories and acceptance criteria outlined in the MVP Requirements Specification. Each AI module addresses specific friction points or enhancement opportunities identified in user research.

This document does not redefine requirements but rather describes the architectural approach to fulfilling AI-related requirements.

### 10.2. High-Level Technical Architecture (DOC-002)

AI Core is positioned within the application layer as defined in the High-Level Technical Architecture. This document elaborates on AI Core's specific role and responsibilities without contradicting broader architectural decisions.

### 10.3. API Design Blueprint (DOC-015)

This document defines the conceptual interface between AI modules and the rest of the platform. Specific endpoint definitions, request/response formats, and protocol details are delegated to the API Design Blueprint and API Detailed Specification.

### 10.4. API Detailed Specification (DOC-016)

Concrete payload structures, field definitions, and data types for AI endpoints are specified in the API Detailed Specification. This document focuses on what AI modules do, while DOC-016 specifies how they are invoked.

### 10.5. SLO / SLA / SLI Definitions (DOC-083)

Service level objectives for AI modules are defined in the SLO/SLA/SLI document. This includes targets for availability, response quality, and user satisfaction. This document establishes design principles that support achieving those objectives but does not duplicate the objectives themselves.

### 10.6. API Rate Limiting Specification (DOC-017)

Usage constraints and quotas for AI endpoints are defined in the Rate Limiting Specification. This document does not address operational limits, focusing instead on the conceptual value and boundaries of each AI module.

### 10.7. Monitoring & Observability Plan (DOC-057)

Operational visibility into AI module behavior is addressed in the Monitoring & Observability Plan. This document establishes the philosophy that AI should be observable and measurable but does not define specific metrics or alerting rules.

### 10.8. Security & Compliance Plan (DOC-036)

Security controls, data protection measures, and compliance considerations for AI modules are detailed in the Security & Compliance Plan. This document establishes trust boundaries and data usage principles that complement the security mechanisms defined in DOC-036.

---

## Document Metadata

**Approved By:**
- Technical Architecture Lead
- Product Owner
- Security & Compliance Lead

**Review Cycle:** Quarterly or upon significant MVP scope changes

**Change Control:** All modifications to this document must be reviewed by the Architecture Review Board to ensure continued alignment with platform-wide principles.

---

**END OF DOCUMENT**
