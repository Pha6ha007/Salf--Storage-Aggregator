# Operator Experience (OX) — Deep Specification (MVP v1)
# Main Table of Contents and Document Structure

**Document ID**: DOC-063  
**Platform**: Self-Storage Aggregator  
**Document Version**: MVP v1 (Hardened)  
**Created**: 10 December 2025  
**Updated**: 17 December 2025  
**Language**: English  
**Author**: Claude (Anthropic)  

---

## Document Role & Scope

### Classification
- **Type**: Supporting / UX Deep Specification
- **Status**: NOT Canonical (Supporting Document)
- **Scope**: MVP v1 Only
- **Purpose**: Describes UX, behavior, and operational scenarios for Operator-side interface

### Important Clarifications

⚠️ **This document is NOT a source of truth for**:
- API contracts and endpoints (see DOC-101 — Internal/Admin API Specification)
- System architecture (see Technical Architecture Document)
- AI model specifications (see DOC-092/DOC-105 — AI Scoring & Risk Framework)
- Database schema (see Database Specification)
- Multi-country/region implementation (see DOC-059 — Multi-Country Architecture)

✅ **This document DOES provide**:
- User experience flows and screen descriptions
- Operator interaction patterns and behaviors
- UI/UX requirements and design principles
- Illustrative examples of features (subject to implementation)
- Supporting context for development teams

### Relationship to Canonical Documents

This specification supports and aligns with:
- **DOC-090** — User Stories & Acceptance Criteria (Primary Source)
- **DOC-101** — Internal / Admin API Specification (API Authority)
- **DOC-092 / DOC-105** — AI Scoring & Risk Framework (AI Authority)
- **DOC-059** — Multi-Country & Multi-Region Architecture (Localization Authority)
- **Domain Glossary / Data Dictionary** (Terminology Authority)

### Treatment of Advanced Features

**AI Capabilities**: All AI-related features described herein are:
- Subject to platform capabilities at implementation time
- May be implemented gradually across MVP releases
- Dependent on underlying AI service availability
- Optional enhancements, not core requirements

**Post-MVP Features**: Sections marked "post-MVP" or "future" are:
- Illustrative examples only
- Not commitments for MVP v1 scope
- Subject to roadmap prioritization
- Included for context and planning purposes

**API References**: All API endpoint examples are:
- Reference implementations only
- Must be validated against DOC-101 before implementation
- Subject to change based on architectural decisions
- Not to be considered final contracts

### Multi-Region Considerations

**All examples in this document** (cities, currencies, date formats, addresses, phone numbers) **are illustrative only** and may vary by region. Actual implementation must follow DOC-059 multi-country/region specifications.

**UI examples and formats shown are for Russian market only** and will be adapted for other markets during localization.

### Terminology Alignment

**Key terms used in this document**:
- **Request (Lead/Inquiry)**: Initial customer request, not yet confirmed
- **Booking (Confirmed Reservation)**: Operator-confirmed booking

These terms are aligned with DOC-090 (User Stories) and domain glossary. Where terminology conflicts exist, DOC-090 takes precedence.

---

## About This Document

This document represents **detailed UX specification for Operator Experience (OX)** for self-storage aggregator platform.

This document describes the expected operator user experience on the platform:
- Registration and onboarding
- Adding and managing warehouses
- Managing boxes and prices
- Processing customer requests
- AI tools for workflow optimization (where supported by platform capabilities)
- General supporting API requirements (reference only)
- Security and performance
- Development plans (post-MVP, illustrative)

---

## Document Structure

Document is divided into **4 parts** for convenience:

### **Part 1**: Sections 1-3 (Foundation)
- Introduction and OX architecture
- Navigation and design principles
- Operator onboarding

### **Part 2**: Sections 4-5 (Core Operations)
- Warehouse management
- Box management

### **Part 3**: Sections 6-7 (Business Logic)
- Price management (Pricing UX)
- Request management (Booking Management)

### **Part 4**: Sections 8-13 (Advanced & Technical)
- AI Tools (subject to implementation)
- Errors and UI states
- Backend API Requirements (reference only)
- Security
- Performance
- Future Recommendations (post-MVP, illustrative)

---

## Full Table of Contents

### SECTION 1: Introduction and architecture

**1.1. Who is an operator**
- Definition
- Roles: Owner, Manager, Staff
- Operator business goals

**1.2. Operator business goals on platform**
- Customer acquisition
- Occupancy optimization
- Process automation
- Data-driven decision making

**1.3. Scope MVP v1: what is included, what is not included**
- Included in MVP
- Not included in MVP (post-MVP features, illustrative)

**1.4. OX Architecture**
- Dashboard structure
- Main sections
- Dashboard
- Requests
- Warehouses
- Analytics
- Settings
- AI Tools (where supported)

**1.5. Design principles OX**
- Clarity and understandability
- Manual action minimization
- Routine automation (subject to implementation)
- Pricing transparency

**1.6. Navigation**
- Sidebar menu
- Breadcrumbs
- Quick actions
- Global search
- URL structure
- Responsive behavior

---

### SECTION 2: Operator dashboard

**2.1. Dashboard overview**
- Target purpose
- Main blocks

**2.2. Summary Cards**
- New requests
- Active bookings
- Available boxes
- Monthly revenue

**2.3. Charts and visualization**
- Requests chart
- Conversion

**2.4. AI recommendations on dashboard**
- Pricing recommendations (optional, subject to implementation)
- Warnings (optional)
- Optimization opportunities (optional)

**2.5. Quick Actions**
- Quick actions from dashboard

---

### SECTION 3: Operator onboarding

**3.1. Registration**
- Registration form
- Fields and validation
- Edge cases

**3.2. Contact verification**
- Email verification
- SMS verification
- Error handling

**3.3. Profile completion**
- Optional fields
- Data usage

**3.4. Account moderation**
- MVP approach
- Alternative approach
- Approval criteria

**3.5. Adding first warehouse**
- 5-step wizard
- Step 1: Basic information
- Step 2: Address and location
- Step 3: Photos
- Step 4: Amenities
- Step 5: Review and submit
- Autosave
- Actions after submission

---

### SECTION 4: Warehouse management

**4.1. Warehouse list**
- URL and purpose
- Table view
- Card view
- Filters and sorting
- Warehouse actions
- Status indicators

**4.2. Adding new warehouse**
- Step wizard
- Single-page form
- Autosave

**4.3. Warehouse editing**
- Status access logic
- Types of changes (minor/major)
- Edit form
- Change history

**4.4. Photos and galleries**
- Photo requirements
- Upload UI
- Functions (upload, sort, edit, delete)
- Video support (optional, post-MVP)

**4.5. Warehouse attributes and services**
- Amenities list (MVP)
- Attribute management UI
- Operating hours
- Custom attributes (post-MVP, illustrative)

**4.6. Logical states**
- Transition diagram
- 4.6.1. Draft
- 4.6.2. Pending Moderation
- 4.6.3. Published/Active
- 4.6.4. Hidden
- 4.6.5. Rejected

**4.7. Edge cases**
- Incorrect coordinates
- Duplicate warehouses
- Deletion with active bookings
- Address change with active requests
- Bulk editing (post-MVP)

---

### SECTION 5: Box management

**5.1. Adding boxes**
- URL and entry points
- Page UI
- Add form
- Validation

**5.2. Bulk adding**
- UI
- Creation logic
- Limitations

**5.3. Editing**
- Single box
- Bulk editing (optional)

**5.4. Price management**
- Individual price
- Duration discounts (optional, subject to implementation)
- Final price calculation
- Price change history

**5.5. Availability management**
- Box statuses
- Status transitions
- Management UI
- Automatic change (post-MVP)
- Bulk change (optional)

**5.6. AI recommendation interaction**
- AI Price Recommendation Engine (optional, subject to implementation)
- AI Box Size Recommendation (optional, subject to implementation)
- Operator benefits

**5.7. Logical states**
- 5.7.1. Available
- 5.7.2. Unavailable
- 5.7.3. Archived - post-MVP

---

### SECTION 6: Price management (Pricing UX)

**6.1. Current price view**
- On boxes page
- In box card

**6.2. Price history**
- Why needed
- History UI
- Chart and table
- Impact on requests

**6.3. AI Price Recommendation**
- How it works (subject to implementation)
- Recommendations UI
- Update frequency

**6.4. Price explanation (Explainability)**
- Transparency principle
- Three explanation levels
- Detailed analysis

**6.5. Price impact on catalog positions**
- Ranking algorithm (reference, subject to change)
- Impact display UI

**6.6. Edge cases**
- Price too low
- Price too high

---

### SECTION 7: Request management

**7.1. View all requests**
- URL and purpose
- Page UI
- Table elements
- Color coding

**7.2. Statuses**
- Transition diagram
- 7.2.1. New
- 7.2.2. Confirmed
- 7.2.3. Rejected

**7.3. Request details view**
- Detail page
- Information blocks
- AI analysis (optional, subject to implementation)

**7.4. User communication**
- Phone
- Email
- Internal notes

**7.5. Automatic notifications**
- Triggers
- Notification settings

**7.6. Edge cases**
- Customer request cancellation
- Duplicate requests
- Notification delivery delay

---

### SECTION 8: AI Tools

**Note**: All AI tools are optional and subject to platform capabilities at implementation time.

**8.1. AI tools overview**
- MVP tools list (where supported)

**8.2. Price Analytics Engine**
- Reference to section 6.3-6.4 (optional, subject to implementation)

**8.3. Operator Knowledge Assistant**
- Concept (optional, post-MVP consideration)
- Page UI
- Question types
- Knowledge base

**8.4. AI Card Generator**
- Purpose (optional, subject to implementation)
- Generation UI
- Operation logic

**8.5. Request Quality Analyzer**
- Purpose (optional, subject to implementation)
- Evaluation criteria
- Analysis examples

**8.6. Explainability**
- Principle (where AI features are implemented)
- Explanation levels

---

### SECTION 9: Errors, messages, UI states

**9.1. Error types**
- Validation errors
- API errors
- Business logic errors

**9.2. UI Loading States**
- Skeletons
- Spinners
- Progress bars

**9.3. Empty States**
- No warehouses
- No boxes
- No requests

**9.4. Success States**
- Toast notifications
- Modal confirmations

**9.5. Confirmation Dialogs**
- For irreversible actions

---

### SECTION 10: Backend API Requirements

**⚠️ IMPORTANT**: This section provides reference examples only. **Final API contracts are defined in DOC-101 (Internal/Admin API Specification)**. All endpoints, request/response formats, and error codes described here must be validated against DOC-101 before implementation.

**10.1. General requirements**
- Authentication & Authorization
- Base URL
- Response format

**10.2. Warehouse API**
- Warehouse list
- Creation
- Update
- Deletion
- Submit for moderation
- Photo upload
- Photo management

**10.3. Box API**
- Box list
- Creation
- Bulk creation
- Update
- Bulk update
- Price history

**10.4. Request/Booking API**
- Request list
- Request details
- Confirmation
- Rejection
- Add note

**10.5. AI Tools API**
- Pricing recommendations (optional, subject to implementation)
- Knowledge Assistant (optional, post-MVP)
- Description generation (optional, subject to implementation)

**10.6. Analytics API**
- Dashboard (reference only)

**10.7. Auth API**
- Registration
- Login
- Refresh Token

**10.8. Rate Limiting**
- Limits (defined in DOC-101)
- Overflow handling

---

### SECTION 11: Security & Access Control

**11.1. Access rights (RBAC)**
- Roles
- Rights matrix

**11.2. Unauthorized access protection**
- Backend checks
- Frontend checks

**11.3. System parameter protection**
- Restricted modification fields
- Backend protection

**11.4. Sensitive data protection**
- Customer contacts
- Financial data

**11.5. UI error protection**
- Confirmations
- Double-click protection
- Data loss protection

**11.6. XSS Protection**

**11.7. CSRF Protection**

**11.8. Action logging**

---

### SECTION 12: Performance & UX Optimization

**12.1. Target performance metrics**

**12.2. Page load optimization**
- Code Splitting
- Images
- Caching

**12.3. Map optimization**

**12.4. List optimization**
- Virtualization (optional)
- Pagination vs Infinite Scroll

**12.5. Form optimization**
- Debouncing
- Optimistic updates (optional)

**12.6. Mobile optimization**
- Viewport settings
- Touch targets
- Responsive breakpoints

**12.7. Performance monitoring**
- Frontend
- Backend

---

### SECTION 13: Future Recommendations (post-MVP)

**Note**: All items in this section are illustrative only and not part of MVP v1 scope. They are included for context and future planning purposes.

**13.1. Online payment** (post-MVP)
- Integrations
- Capabilities
- UI flow

**13.2. CRM integration** (post-MVP)
- Systems
- Capabilities

**13.3. Electronic contracts** (post-MVP)
- Functionality
- UI

**13.4. Mobile application** (post-MVP)
- Platforms
- Unique capabilities

**13.5. Smart box access** (post-MVP)
- Lock integration
- Benefits

**13.6. Auto-renewal** (post-MVP)
- Automation

**13.7. Advanced analytics** (post-MVP)
- Additional reports
- Dashboards

**13.8. Marketplace for additional services** (post-MVP)
- Concept
- Partners
- Monetization

**13.9. Publishing on external platforms** (post-MVP)
- Integrations
- Benefits

**13.10. AI response automation** (post-MVP)
- Concept
- Examples
- Benefits

**13.11. Loyalty program** (post-MVP)
- Ideas

**13.12. Social features** (post-MVP)
- Reviews and ratings
- Community

---

## Key technical characteristics

### Technology stack (recommendations):

**Note**: These are recommendations only and may be adjusted based on project decisions.

**Frontend**:
- React 18+ / Next.js 14+
- TypeScript
- React Query / TanStack Query
- Tailwind CSS
- React Hook Form + Zod

**Backend**:
- Node.js (Express / Fastify) or Python (FastAPI)
- PostgreSQL (main DB)
- Redis (caching)
- S3-compatible storage (photos)

**AI/ML** (where applicable):
- OpenAI API / Anthropic Claude API (subject to implementation)
- Python (scikit-learn, pandas)

**Infrastructure**:
- Docker + Kubernetes
- CDN (Cloudflare / AWS CloudFront)
- Monitoring (Grafana + Prometheus)

---

## MVP success metrics

### For operators:
- **Time to add first warehouse**: <15 minutes (target)
- **Conversion registration → first warehouse**: >60% (target)
- **Average request processing time**: <5 minutes (target)
- **Satisfaction score (NPS)**: >40 (target)

### For platform:
- **Warehouse moderation time**: <24 hours (target)
- **Uptime API**: >99.5% (target)
- **P95 API response time**: <500ms (target)
- **Mobile-friendly**: 100% mobile functionality (target)

**Note**: All metrics are targets and subject to adjustment based on platform capabilities and business priorities.

---

## Contacts and support

**Technical support**: support@platform.com  
**Documentation**: https://docs.platform.com  
**Slack**: #operator-support  

**Note**: Contact information is illustrative and will be updated with actual values.

---

## Document versioning

| Version | Date | Changes |
|--------|------|-----------|
| **v1.0** | 10.12.2025 | First complete version (MVP scope) |
| **v1.1 (Hardened)** | 17.12.2025 | Scope hardening: Added Document Role & Scope, clarified AI/API/post-MVP status, multi-region disclaimers, terminology alignment |

---

## Related canonical documents

### Primary Authority Documents:
- **DOC-090** — User Stories & Acceptance Criteria (Feature Authority)
- **DOC-101** — Internal / Admin API Specification (API Authority)
- **DOC-092 / DOC-105** — AI Scoring & Risk Framework (AI Authority)
- **DOC-059** — Multi-Country & Multi-Region Architecture (Localization Authority)
- **Domain Glossary / Data Dictionary** (Terminology Authority)

### Supporting Documents:
- Project Brief Self Storage Aggregator
- Functional Specification MVP v1 Complete
- Technical Specification MVP Self Storage
- Technical Architecture Document FULL
- API Design Blueprint MVP v1
- Wireframes UX Structure
- Backend Implementation Plan
- Competitive Analysis Market Landscape
- CRM Lead Management System
- Legal Checklist Compliance Requirements
- Security and Compliance Plan
- Public Policies Pack

### OX specification files (DOC-063):
- **Part 1**: Sections 1-3 (Foundation)
- **Part 2**: Sections 4-5 (Core Operations)
- **Part 3**: Sections 6-7 (Business Logic)
- **Part 4**: Sections 8-13 (Advanced & Technical)

---

**End of main table of contents**

To work with the full document open the corresponding Part files.

**⚠️ IMPORTANT**: This document is **supporting UX specification**, and not canonical source of truth. All technical decisions must align with corresponding canonical documents (DOC-090, DOC-101, DOC-092, DOC-059).
