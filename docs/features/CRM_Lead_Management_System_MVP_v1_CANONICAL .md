# CRM Lead Management System (MVP v1) — CANONICAL

**Document:** Technical Specification for CRM Lead Management  
**Version:** MVP v1 - CANONICAL  
**Date:** 2025-12-15  
**Status:** 🟢 GREEN - Production Ready

---

## Document Control

**Purpose:** Define the CRM Lead Management system for warehouse operators to capture and manually process customer inquiries.

**Scope:** MVP v1 - Simple lead inbox with manual processing only.

**Canonical Sources:**
- `api_design_blueprint_mvp_v1_CANONICAL.md`
- `Technical_Architecture_Document_MVP_v1_CANONICAL.md`
- `full_database_specification_mvp_v1.md`
- `Functional_Specification_MVP_v1_Complete.md`

**Out of Scope (v2+):**
- ❌ Lead scoring & qualification automation
- ❌ Sales pipeline & funnel metrics
- ❌ Revenue analytics & conversion tracking
- ❌ Automated follow-up chains
- ❌ SLA timers & escalations
- ❌ External CRM integrations (HubSpot, Salesforce, etc.)
- ❌ Email campaign management
- ❌ Predictive ML models

---

## 1. Introduction

### 1.1. What is CRM in MVP v1?

**CRM in MVP v1 is a simple lead inbox** for warehouse operators to:
1. **Receive** customer contact form submissions
2. **View** lead details
3. **Manually update** lead processing status
4. **Log** simple activities (notes, calls)

**CRM in MVP v1 is NOT:**
- ❌ A sales CRM with pipelines
- ❌ An analytics platform
- ❌ An automation engine
- ❌ A marketing tool

### 1.2. Core Principles

**Principle 1: Manual Processing**
- Operators manually review and update leads
- No automatic status transitions
- No auto-assignment
- No auto-scoring

**Principle 2: Simplicity**
- Basic status workflow
- Simple activity logging
- No complex reporting

**Principle 3: Integration**
- Leads come from contact forms
- Operators access via dashboard
- Basic notifications only

---

## 2. System Architecture

### 2.1. Components

```
┌─────────────────────────────────────────┐
│        OPERATOR DASHBOARD               │
│       (Frontend - React)                │
└─────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│         BACKEND API (NestJS)            │
│         Module: crm/                    │
│   ├── crm/leads/                        │
│   ├── crm/contacts/                     │
│   └── crm/activities/                   │
└─────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│        DATABASE (PostgreSQL)            │
│   ├── crm_leads                         │
│   ├── crm_contacts                      │
│   ├── crm_activities                    │
│   ├── crm_status_history                │
│   └── crm_activity_types                │
└─────────────────────────────────────────┘
```

### 2.2. Data Flow

```
User fills contact form
    ↓
POST /api/v1/crm/leads
    ↓
Create lead (status=new)
    ↓
Operator notified (email/in-app)
    ↓
Operator views lead
    ↓
Operator manually updates status
    ↓
Status logged in history
```

---

## 3. Data Model

### 3.1. Tables

**From `full_database_specification_mvp_v1.md`:**

#### crm_leads

Primary lead records.

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| name | VARCHAR(255) | Contact name |
| phone | VARCHAR(20) | Phone number |
| email | VARCHAR(255) | Email (optional) |
| warehouse_id | UUID | Target warehouse (FK) |
| preferred_box_size | ENUM | S, M, L, XL (optional) |
| status | ENUM | Lead status: new, contacted, in_progress, closed |
| closed_reason | VARCHAR(50) | Reason for closure (optional) |
| related_booking_id | UUID | Optional FK to bookings table |
| is_spam | BOOLEAN | Spam flag (default: false) |
| source | VARCHAR(50) | 'website', 'repeat_customer', 'manual' |
| notes | TEXT | Operator notes (optional) |
| created_at | TIMESTAMP | Creation time |
| updated_at | TIMESTAMP | Last update |

**Notes:**
- closed_reason is only set when status = 'closed'
- related_booking_id provides optional reference to booking domain
- is_spam is a flag, not a status value

#### crm_contacts

Contact information (may have multiple leads).

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| name | VARCHAR(255) | Full name |
| phone | VARCHAR(20) | Phone number |
| email | VARCHAR(255) | Email |
| created_at | TIMESTAMP | First contact |
| updated_at | TIMESTAMP | Last update |

#### crm_activities

Activity log for leads.

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| lead_id | UUID | FK to crm_leads |
| activity_type_id | UUID | FK to crm_activity_types |
| notes | TEXT | Activity notes |
| created_by | UUID | Operator who logged |
| created_at | TIMESTAMP | Activity time |

#### crm_status_history

Audit trail for status changes.

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| lead_id | UUID | FK to crm_leads |
| old_status | ENUM | Previous status |
| new_status | ENUM | New status |
| changed_by | UUID | Operator who changed |
| changed_at | TIMESTAMP | Change time |

#### crm_activity_types

Reference table for activity types.

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| name | VARCHAR(100) | 'call_made', 'note_added', 'form_submission' |
| description | VARCHAR(255) | Type description |

### 3.2. Lead Status Enum

**Canonical Status Set:**

```
new          - Lead created, not yet processed
contacted    - Operator reached customer
in_progress  - Operator actively working on lead
closed       - Lead processing complete
```

**Status Transitions:**

```
new → contacted, in_progress
contacted → in_progress, closed
in_progress → contacted, closed
```

**Semantic Meaning:**

| Status | Meaning | Processing State |
|--------|---------|------------------|
| **new** | Lead just arrived, operator has not viewed yet | 🔵 Not Started |
| **contacted** | Operator successfully reached customer | 🟢 Contacted |
| **in_progress** | Operator actively reviewing/preparing | 🟡 In Progress |
| **closed** | Lead processing finished | ⚫ Complete |

**Important:**
- All status changes are manual (operator-initiated)
- Status reflects processing state only
- Business outcomes tracked via metadata

### 3.3. Tracking Business Outcomes

**Metadata Fields:**

```typescript
// When closing a lead
{
  status: 'closed',
  closed_reason?: string,  // 'customer_booked', 'customer_declined', 
                           // 'no_response', 'not_interested', etc.
  related_booking_id?: UUID | null,  // FK to bookings if created
  notes?: string
}
```

**Common closed_reason values:**
- `customer_booked` - Customer created booking
- `customer_declined` - Customer not interested
- `no_response` - Could not reach customer
- `duplicate` - Duplicate lead
- `not_interested` - Customer changed mind
- `out_of_scope` - Request outside capabilities

**Benefits:**
- ✅ Status = processing state
- ✅ Reason = business outcome
- ✅ Clear separation of concerns
- ✅ Optional booking reference

### 3.4. Spam Detection

**Implementation:**

Spam is detected via `is_spam` boolean flag, not a status value.

```sql
-- Mark lead as spam
UPDATE crm_leads 
SET is_spam = true, 
    updated_at = NOW() 
WHERE id = :lead_id;
```

**Filtering:**

```sql
-- Get non-spam leads
SELECT * FROM crm_leads WHERE is_spam = false;
```

**Note:** Spam leads can still have any status (new, contacted, etc.)

---

## 4. API Endpoints

### 4.1. Create Lead

```
POST /api/v1/crm/leads
```

**Authorization:** Not required (public endpoint for contact forms)

**Request Body:**

```json
{
  "name": "Ahmed Al-Rashid",
  "phone": "+971501234567",
  "email": "ivan@example.com",
  "warehouse_id": "550e8400-e29b-41d4-a716-446655440000",
  "preferred_box_size": "M"
}
```

**Response: 201 Created**

```json
{
  "data": {
    "id": "110e8400-e29b-41d4-a716-446655440011",
    "name": "Ahmed Al-Rashid",
    "phone": "+971501234567",
    "email": "ivan@example.com",
    "status": "new",
    "warehouse_id": "550e8400-e29b-41d4-a716-446655440000",
    "preferred_box_size": "M",
    "is_spam": false,
    "created_at": "2025-12-15T14:30:00Z"
  }
}
```

**Business Logic:**
1. Validate input
2. Create lead record with status='new', is_spam=false
3. Create or find matching contact
4. Log activity (type='form_submission')
5. Trigger notification to operator

### 4.2. Get Leads (List)

```
GET /api/v1/crm/leads
```

**Authorization:** Required (operator role)

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| status | enum | Filter: `new`, `contacted`, `in_progress`, `closed` |
| is_spam | boolean | Filter spam leads (default: false) |
| closed_reason | string | Filter by closure reason (optional) |
| warehouse_id | UUID | Filter by warehouse |
| page | integer | Page number |
| per_page | integer | Items per page |

**Response: 200 OK**

```json
{
  "data": [
    {
      "id": "110e8400-e29b-41d4-a716-446655440011",
      "name": "Ahmed Al-Rashid",
      "phone": "+971501234567",
      "email": "ivan@example.com",
      "status": "new",
      "is_spam": false,
      "warehouse": {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "name": "СкладОК Выхино"
      },
      "preferred_box_size": "M",
      "created_at": "2025-12-15T14:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "per_page": 10,
    "total": 1,
    "total_pages": 1
  }
}
```

### 4.3. Get Lead Details

```
GET /api/v1/crm/leads/{id}
```

**Authorization:** Required (operator role)

**Response: 200 OK**

```json
{
  "data": {
    "id": "110e8400-e29b-41d4-a716-446655440011",
    "name": "Ahmed Al-Rashid",
    "phone": "+971501234567",
    "email": "ivan@example.com",
    "status": "closed",
    "closed_reason": "customer_booked",
    "related_booking_id": "dd0e8400-e29b-41d4-a716-446655440008",
    "is_spam": false,
    "warehouse": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "СкладОК Выхино"
    },
    "preferred_box_size": "M",
    "notes": "Customer booked box M for 3 months starting Dec 20",
    "created_at": "2025-12-15T14:30:00Z",
    "updated_at": "2025-12-15T16:00:00Z"
  }
}
```

### 4.4. Update Lead Status

```
PATCH /api/v1/crm/leads/{id}/status
```

**Authorization:** Required (operator role)

**Request Body (simple status update):**

```json
{
  "status": "contacted"
}
```

**Request Body (closing lead):**

```json
{
  "status": "closed",
  "closed_reason": "customer_booked",
  "related_booking_id": "dd0e8400-e29b-41d4-a716-446655440008",
  "notes": "Customer booked box M for 3 months"
}
```

**Validation:**
- Status must be: `new`, `contacted`, `in_progress`, or `closed`
- Status transition must be allowed
- User must have operator role
- If status = 'closed', closed_reason is recommended
- related_booking_id must exist if provided

**Response: 200 OK**

```json
{
  "data": {
    "id": "110e8400-e29b-41d4-a716-446655440011",
    "status": "closed",
    "closed_reason": "customer_booked",
    "related_booking_id": "dd0e8400-e29b-41d4-a716-446655440008",
    "updated_at": "2025-12-15T15:30:00Z"
  }
}
```

**Business Logic:**
1. Validate status transition
2. Update lead status
3. Store closed_reason and related_booking_id if provided
4. Log status change in crm_status_history
5. Return updated lead

### 4.5. Mark Lead as Spam

```
PATCH /api/v1/crm/leads/{id}/spam
```

**Authorization:** Required (operator role)

**Request Body:**

```json
{
  "is_spam": true
}
```

**Response: 200 OK**

```json
{
  "data": {
    "id": "110e8400-e29b-41d4-a716-446655440011",
    "is_spam": true,
    "updated_at": "2025-12-15T15:30:00Z"
  }
}
```

**Note:** This sets the spam flag without changing status.

---

## 5. Operator Workflows

### 5.1. Daily Workflow

**Typical operator day:**

1. **Morning: Check new leads**
   - Open operator dashboard
   - View leads with status='new' and is_spam=false
   - Prioritize by creation time

2. **Process leads:**
   - Click lead to view details
   - Call customer using phone number
   - Update status to 'contacted'
   - Add note about conversation

3. **Follow up:**
   - Check 'in_progress' leads
   - Follow up with customers
   - Close leads with appropriate reason

4. **End of day:**
   - Review any remaining open leads
   - Mark spam if needed

### 5.2. Manual Status Updates

**Workflow Example 1: new → closed (direct)**

```
Operator sees new lead
    ↓
Clicks "View Details"
    ↓
Calls customer
    ↓
Customer agrees to book
    ↓
Operator creates booking:
    POST /api/v1/bookings
    {...}
    ↓
Booking created (separate domain)
    ↓
Operator returns to lead
    ↓
Clicks "Close Lead"
    ↓
Fills form:
    Status: closed
    Reason: customer_booked
    Booking ID: [uuid]
    Notes: "Booked box M, 3 months, 15,000AED "
    ↓
Saves
    ↓
Lead status = closed
```

**Workflow Example 2: new → contacted → in_progress → closed**

```
Day 1:
Operator views lead → status = contacted
Operator adds note: "Spoke with customer, needs to check dates"

Day 2:
Operator follows up → status = in_progress
Operator adds note: "Customer considering M or L box"

Day 3:
Customer decides not to proceed → status = closed
closed_reason = "customer_declined"
notes: "Customer found alternative solution"
```

**No automation:** Operator must manually perform each step.

### 5.3. Activity Logging

**Simple notes only:**

- Operator can add text notes to lead
- No structured fields
- No templates
- No automation

**Example note:**
```
"Called customer 2pm. Interested in M box starting Dec 20. 
Quoted 5000AED /month. Will call back tomorrow to confirm."
```

---

## 6. UI Components (Operator Dashboard)

### 6.1. Leads List View

**Features:**
- Table showing all leads
- Filters: status, is_spam, date range
- Sort by: creation date, status
- Pagination

**Example:**

```
┌─────────────────────────────────────────────────────────────┐
│ CRM Leads                                                   │
├─────────────────────────────────────────────────────────────┤
│ Status: [New ▼]  Spam: [Hide ▼]  Date: [Last 7 days ▼]    │
├─────────────────────────────────────────────────────────────┤
│ Name          Phone          Status        Created         │
├─────────────────────────────────────────────────────────────┤
│ Ahmed Al-Rashid   +7999...       new           14:30          │
│ Мария Сидо... +7985...       contacted     12:15          │
│ Петр Иванов   +7916...       in_progress   11:45          │
└─────────────────────────────────────────────────────────────┘
```

### 6.2. Lead Detail View

**Features:**
- Contact information
- Warehouse & box preference
- Status dropdown
- Close lead form (for status=closed)
- Activity log (read-only history)
- Add note form
- Spam flag toggle

**Example:**

```
┌─────────────────────────────────────────────────────────┐
│ Lead Details                                            │
├─────────────────────────────────────────────────────────┤
│ Name: Ahmed Al-Rashid                                       │
│ Phone: +971 50 123 4567                               │
│ Email: ivan@example.com                                 │
│ Warehouse: СкладОК Выхино                               │
│ Box Size: M (6 m²)                                      │
│                                                         │
│ Status: [contacted ▼] [Update]                         │
│                                                         │
│ [Close Lead]  [Mark as Spam]                           │
│                                                         │
│ Activity Log:                                           │
│ - 15:00 Status changed to 'contacted' by operator      │
│ - 14:30 Lead created from website form                 │
│                                                         │
│ Add Note:                                               │
│ [_____________________________________________]         │
│                                     [Save Note]         │
└─────────────────────────────────────────────────────────┘
```

### 6.3. Close Lead Form

**When operator clicks "Close Lead":**

```
┌─────────────────────────────────────────┐
│ Close Lead                              │
├─────────────────────────────────────────┤
│ Status: closed                          │
│                                         │
│ Reason: [Select reason ▼]              │
│   - customer_booked                     │
│   - customer_declined                   │
│   - no_response                         │
│   - duplicate                           │
│   - not_interested                      │
│   - out_of_scope                        │
│                                         │
│ Booking ID (optional):                  │
│ [__________________________]            │
│                                         │
│ Notes:                                  │
│ [__________________________]            │
│ [__________________________]            │
│                                         │
│          [Cancel]  [Save]               │
└─────────────────────────────────────────┘
```

---

## 7. Notifications

### 7.1. New Lead Notification

**Trigger:** Lead created with status='new'

**Recipients:** Operators assigned to warehouse

**Channels:**
- In-app notification
- Email (optional)

**Content:**
```
New lead from Ahmed Al-Rashid
Phone: +7999...
Warehouse: СкладОК Выхино
Box: M (6 m²)

[View Lead]
```

### 7.2. No Automation

**What CRM does NOT do:**
- ❌ Auto-send follow-up emails
- ❌ Auto-reminders
- ❌ SLA alerts
- ❌ Escalations
- ❌ Auto-assignment
- ❌ Auto-status updates

---

## 8. Security & Access Control

### 8.1. Roles

**operator:**
- Can view leads for their warehouse(s)
- Can update lead status
- Can mark leads as spam
- Can add notes/activities

**admin:**
- Can view all leads
- Can manage operators
- Full access

### 8.2. Data Access

**Operator access rules:**
- Operator can only see leads for warehouses they manage
- Operator cannot see leads from other warehouses
- Enforced at API level: `WHERE warehouse_id IN (operator.warehouses)`

---

## 9. Logging & Audit

### 9.1. Events to Log

**Event Types:**

```
CRM_LEAD_CREATED
CRM_LEAD_STATUS_UPDATED
CRM_ACTIVITY_ADDED
CRM_LEAD_MARKED_SPAM
```

**Log Format:**

```json
{
  "event_type": "CRM_LEAD_STATUS_UPDATED",
  "timestamp": "2025-12-15T15:30:00Z",
  "user_id": "operator-uuid",
  "lead_id": "lead-uuid",
  "old_status": "new",
  "new_status": "contacted"
}
```

### 9.2. Status History

All status changes stored in `crm_status_history` for audit trail.

---

## 10. Integration Points

### 10.1. Contact Form → CRM

**Flow:**

```
User fills form on website
    ↓
POST /api/v1/crm/leads
    ↓
Lead created (status=new, is_spam=false)
    ↓
crm_contacts record created/updated
    ↓
crm_activities record (type=form_submission)
    ↓
Operator notification sent
```

### 10.2. CRM → Bookings (Manual Process)

**Domain Separation:**
- **CRM Domain:** Tracks lead processing
- **Booking Domain:** Tracks reservations
- **No automatic synchronization**

**Operator Workflow:**

```
1. Process Lead in CRM
   ↓
2. Customer agrees to book
   ↓
3. Operator creates booking:
   POST /api/v1/bookings
   {
     "box_id": "uuid",
     "start_date": "2025-12-20",
     "duration_months": 3
   }
   ↓
4. Booking created (status=pending, separate domain)
   ↓
5. Operator manually closes lead:
   PATCH /api/v1/crm/leads/{id}/status
   {
     "status": "closed",
     "closed_reason": "customer_booked",
     "related_booking_id": "booking-uuid",
     "notes": "Booked box M for 3 months"
   }
   ↓
6. Lead closed, optional reference to booking
```

**Key Points:**
- ✅ Two separate API calls
- ✅ Operator performs both manually
- ✅ related_booking_id is optional reference
- ✅ No automatic state synchronization
- ✅ Clean domain separation

---

## 11. Non-Functional Requirements

### 11.1. Performance

- Lead list loads in <1 second
- Status update completes in <500ms
- Support 100 concurrent operators

### 11.2. Scalability

- Support 10,000 leads per warehouse per month
- Soft delete for historical data
- Archive closed leads after 12 months

### 11.3. Availability

- 99.5% uptime target
- Graceful degradation if DB slow

---

## 12. Testing Requirements

### 12.1. Unit Tests

- Lead creation validation
- Status transition validation
- Access control checks
- Spam flag logic

### 12.2. Integration Tests

- Full create-view-update flow
- Multi-operator scenarios
- Notification delivery

### 12.3. E2E Tests

- Operator dashboard flows
- Status update workflows
- Close lead with metadata

---

## 13. Migration & Rollout

### 13.1. Initial Setup

1. Create database tables
2. Seed crm_activity_types reference data
3. Assign operators to warehouses
4. Configure notifications

### 13.2. Data Migration

No historical data migration needed (new system).

---

## 14. Maintenance & Operations

### 14.1. Monitoring

**⚠️ Internal Monitoring Only - No UI Dashboards in MVP**

**Backend metrics (for ops team):**
- New leads per day (capacity planning)
- Average time to first contact (efficiency)
- Status distribution (queue health)
- Operator activity (workload balance)

**Implementation:**
- Log events to events_log table
- Export to Prometheus/Grafana
- No operator-facing dashboards in MVP

### 14.2. Backup

- Daily database backups
- Retain for 30 days

---

## 15. Future Enhancements (v2+)

**Not in MVP, planned for future:**

1. **Lead Scoring** (v1.1)
   - AI-powered quality scoring
   - Priority ranking

2. **Automation** (v1.2)
   - Auto-follow-up emails
   - Reminders
   - SLA timers

3. **Analytics** (v2)
   - Conversion funnels
   - Performance dashboards
   - Revenue tracking

4. **External Integrations** (v2)
   - HubSpot, Salesforce sync
   - Email marketing tools

5. **Advanced Features** (v2)
   - Sales pipelines
   - Team collaboration
   - Advanced reporting

---

## 16. Glossary

| Term | Definition |
|------|------------|
| Lead | A customer inquiry/contact request (not yet a booking) |
| Operator | Warehouse staff who processes leads |
| Status | Current processing state: new, contacted, in_progress, closed |
| closed_reason | Optional metadata explaining why lead was closed |
| Activity | A logged action on a lead (note, call, etc.) |
| Contact | Person information (may have multiple leads over time) |
| related_booking_id | Optional reference linking closed lead to booking |
| is_spam | Boolean flag indicating spam/invalid lead |

**Important Distinctions:**
- **Status** = Processing state (operator's progress)
- **closed_reason** = Business outcome (why closed)
- **Booking** = Separate domain (transaction management)

---

## Document Status

**Status:** 🟢 GREEN - Production Ready

**Alignment:**
- ✅ Aligned with `api_design_blueprint_mvp_v1_CANONICAL.md`
- ✅ Aligned with `Technical_Architecture_Document_MVP_v1_CANONICAL.md`
- ✅ Aligned with `full_database_specification_mvp_v1.md`
- ✅ Aligned with `Functional_Specification_MVP_v1_Complete.md`
- ✅ No scope creep
- ✅ No automation beyond spec
- ✅ Manual processing only
- ✅ Clear domain boundaries

**What This Document Defines:**
- ✅ Simple lead inbox with manual processing
- ✅ Four processing statuses (new, contacted, in_progress, closed)
- ✅ Business outcomes via metadata (closed_reason)
- ✅ Optional booking reference (related_booking_id)
- ✅ Spam detection via boolean flag (is_spam)
- ✅ Basic activity logging
- ✅ Operator workflows
- ✅ Clean separation from Booking domain

**What This Document Does NOT Include:**
- ❌ Sales CRM features
- ❌ Automation
- ❌ Analytics dashboards
- ❌ External integrations
- ❌ Advanced pipelines
- ❌ ML/AI scoring

---

**Last Updated:** 2025-12-15  
**Version:** MVP v1 - CANONICAL  
**Document Owner:** Technical Documentation Engine  
**Review Status:** Final - Ready for Implementation  
**Backend Development:** ✅ Ready  
**Database Implementation:** ✅ Ready  
**Frontend Implementation:** ✅ Ready
