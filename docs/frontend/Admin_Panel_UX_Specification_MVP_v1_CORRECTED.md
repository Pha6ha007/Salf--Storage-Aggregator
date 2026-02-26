# Admin Panel — UX/UI Specification (MVP v1)

**Self-Storage Aggregator Platform**

---

## Document Information

| Field | Value |
|-------|-------|
| **Document Type** | UX/UI Specification (NON-CANONICAL) |
| **Version** | 1.1 (Corrected) |
| **Date** | December 15, 2025 |
| **Status** | UI/UX Specification — Non-Canonical |
| **Audience** | Frontend Developers, Product Team |
| **Change Policy** | UX iteration allowed without affecting canonical requirements |
| **Based On** | Admin_Panel_Deep_Specification_MVP_v1_COMPLETE.md |
| **Corrections Applied** | Task #ADMIN-001 |

---

## ⚠️ CRITICAL: Document Positioning

**This document describes the UX/UI behavior of the Admin (Operator) Panel.**

**Authoritative Sources:**
- **Functional requirements** are defined exclusively in `Functional_Specification_MVP_v1_CORRECTED.md`
- **API behavior** is defined exclusively in `api_design_blueprint_mvp_v1_CANONICAL.md`
- **Data model** is defined exclusively in `full_database_specification_mvp_v1_CANONICAL.md`
- **Architecture** is defined exclusively in `Technical_Architecture_Document_MVP_v1_CANONICAL.md`
- **Security & RBAC** are defined exclusively in `security_and_compliance_plan_mvp_v1.md`

**In case of conflict, canonical documents take precedence.**

This document focuses on:
- User interface layout and component structure
- User interaction patterns and workflows
- Visual design guidance
- Frontend implementation guidelines

This document does NOT define:
- Business requirements (see Functional Spec)
- API contracts (see API Blueprint)
- Database schema (see DB Specification)
- System architecture (see Technical Architecture)

---

## Changelog from Previous Version

| Change ID | Section | Description |
|-----------|---------|-------------|
| ADMIN-001 | All | Converted from requirements doc to UI/UX spec |
| ADMIN-002 | Section 1.2 | Removed admin roles table; reference Functional Spec for RBAC |
| ADMIN-003 | Throughout | Replaced user stories with references to Functional Spec |
| ADMIN-004 | Throughout | Replaced API descriptions with endpoint references |
| ADMIN-005 | Section 1.3 | Removed MVP scope violations (advanced analytics, bulk > 10, etc.) |
| ADMIN-006 | Section 12 | Removed detailed API specifications; link to API Blueprint |
| ADMIN-007 | All Status References | Aligned with canonical booking status machine |
| ADMIN-008 | Section 15 | Removed out-of-scope features (ML, BI integrations, v2+ features) |

---

# 1. Introduction

## 1.1. Role of Admin Panel in System

The Administrative Panel is the management interface for platform administrators to oversee platform operations.

### Core Functions (UI/UX Scope)

| Function | UI Components | Implementation Priority |
|----------|---------------|------------------------|
| **Content Moderation** | Warehouse approval screens, photo review interfaces | 🔴 Critical |
| **Operator Management** | Verification workflows, approval/blocking interfaces | 🔴 Critical |
| **Quality Control** | Complaint management screens, quality metrics dashboards | 🟡 High |
| **Analytics** | Basic metrics dashboard (counts only, no revenue in MVP) | 🟢 Medium |
| **Security** | User/operator blocking interfaces, audit log viewers | 🔴 Critical |

**Note:** Functional requirements for these features are defined in Functional Specification. This document describes only the UI/UX implementation.

### System Architecture Context

```
┌─────────────────────────────────────────────────────────────┐
│                    PLATFORM ARCHITECTURE                     │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Public     │  │   Operator   │  │    Admin     │      │
│  │   Website    │  │   Dashboard  │  │    Panel     │      │
│  │              │  │              │  │              │      │
│  │  • Search    │  │  • Warehouses│  │  • Moderation│      │
│  │  • Catalog   │  │  • Boxes     │  │  • Control   │      │
│  │  • Booking   │  │  • Bookings  │  │  • Analytics │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                 │                  │               │
│         └─────────────────┼──────────────────┘               │
│                           │                                  │
│                  ┌────────▼────────┐                         │
│                  │   Backend API   │                         │
│                  │  (NestJS)       │                         │
│                  └────────┬────────┘                         │
│                           │                                  │
│                  ┌────────▼────────┐                         │
│                  │    PostgreSQL   │                         │
│                  │    + PostGIS    │                         │
│                  └─────────────────┘                         │
└─────────────────────────────────────────────────────────────┘
```

**Reference:** See `Technical_Architecture_Document_MVP_v1_CANONICAL.md` for complete architecture specification.

---

## 1.2. Administrator Roles & Access

**⚠️ CANONICAL SOURCE:** Admin roles and permissions are defined in:
- `Functional_Specification_MVP_v1_CORRECTED.md` — Section "User Roles"
- `security_and_compliance_plan_mvp_v1.md` — Section "Authorization Model"

### MVP v1 Role Summary

In MVP v1, there is a single unified `admin` role with full system access.

**UI Behavior:**
- All admin panel features are accessible to users with `role=admin`
- No role-based UI restrictions within admin panel in MVP v1
- Future versions may introduce specialized admin roles (Content Moderator, Support, etc.)

**API Access:**
- All `/api/v1/admin/*` endpoints require `role=admin`
- See `api_design_blueprint_mvp_v1_CANONICAL.md` for endpoint authorization matrix

---

## 1.3. MVP v1 Scope

**⚠️ CANONICAL SOURCE:** MVP scope is defined in `Functional_Specification_MVP_v1_CORRECTED.md`

### ✅ Included in MVP v1 (UI/UX to Implement)

- ✅ Basic dashboard with count metrics
- ✅ User management (view, block/unblock)
- ✅ Operator verification workflow (approve/reject)
- ✅ Warehouse moderation (approve/reject, basic photo review)
- ✅ Booking list view (read-only)
- ✅ Complaint management (view, respond, status workflow)
- ✅ System logs viewer (search, filter)
- ✅ Platform settings (basic configuration)

### ❌ NOT in MVP v1 (Do Not Implement)

- ❌ AI-powered content moderation
- ❌ Revenue/financial analytics
- ❌ Advanced BI dashboards
- ❌ Bulk operations (> 10 items)
- ❌ CSV export functionality
- ❌ Advanced analytics (cohort analysis, revenue trends)
- ❌ Ticketing system
- ❌ 2FA for admins
- ❌ Audit trail visualization
- ❌ Grafana/Prometheus integration

**Reference:** See Functional Specification for complete scope definition and future roadmap.

---

# 2. Admin Panel Architecture

## 2.1. Module Structure

The admin panel is organized into 8 primary modules (UI perspective):

```
┌─────────────────────────────────────────────────────────────┐
│                    ADMIN PANEL MVP v1                        │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌────────────────────┐  ┌────────────────────┐            │
│  │  1. Dashboard      │  │  2. Users          │            │
│  │                    │  │     Management     │            │
│  │  • Metrics         │  │                    │            │
│  │  • Alerts          │  │  • List            │            │
│  │  • Activity        │  │  • Search          │            │
│  │                    │  │  • Block/Unblock   │            │
│  └────────────────────┘  └────────────────────┘            │
│                                                               │
│  ┌────────────────────┐  ┌────────────────────┐            │
│  │  3. Operators      │  │  4. Warehouses     │            │
│  │     Management     │  │     Moderation     │            │
│  │                    │  │                    │            │
│  │  • Verification    │  │  • Review          │            │
│  │  • Approval        │  │  • Approve/Reject  │            │
│  │  • Blocking        │  │  • Photos          │            │
│  └────────────────────┘  └────────────────────┘            │
│                                                               │
│  ┌────────────────────┐  ┌────────────────────┐            │
│  │  5. Bookings       │  │  6. Complaints     │            │
│  │     (Read-Only)    │  │     & Support      │            │
│  │                    │  │                    │            │
│  │  • View List       │  │  • View Complaints │            │
│  │  • Filters         │  │  • Respond         │            │
│  │  • Details         │  │  • Status Change   │            │
│  └────────────────────┘  └────────────────────┘            │
│                                                               │
│  ┌────────────────────┐  ┌────────────────────┐            │
│  │  7. System Logs    │  │  8. Platform       │            │
│  │     & Audit        │  │     Settings       │            │
│  │                    │  │                    │            │
│  │  • Log Viewer      │  │  • Categories      │            │
│  │  • Search          │  │  • Attributes      │            │
│  │  • Export          │  │  • Global Config   │            │
│  └────────────────────┘  └────────────────────┘            │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

**Reference:** API endpoints for each module are defined in `api_design_blueprint_mvp_v1_CANONICAL.md` under `/api/v1/admin/*`

---

## 2.2. Navigation Structure

### Main Navigation (Sidebar)

```
🏠 Dashboard
   └─ Overview metrics

👥 Users
   ├─ All Users
   └─ Blocked Users

🏢 Operators
   ├─ Pending Verification
   ├─ Approved Operators
   └─ Blocked Operators

🏪 Warehouses
   ├─ Pending Moderation
   ├─ Active Warehouses
   └─ Rejected Warehouses

📋 Bookings
   └─ All Bookings (read-only)

📞 Complaints
   ├─ New Complaints
   ├─ In Progress
   └─ Resolved

📊 Analytics
   └─ Platform Metrics (basic counts only)

⚙️ Settings
   ├─ Categories
   ├─ Attributes
   └─ Global Settings

📜 System Logs
   └─ Activity Logs
```

### UI Design Pattern

**Layout:**
- Fixed sidebar (240px width)
- Top navbar with user menu, notifications
- Main content area (responsive)
- Breadcrumbs for navigation context

**Components:**
- Material-UI or Ant Design recommended
- Consistent color scheme (primary, danger, warning, success)
- Responsive tables with pagination
- Modal dialogs for confirmations
- Toast notifications for feedback

---

# 3. Module 1: Dashboard

## 3.1. Overview Metrics

**UI Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│ Dashboard                                                     │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐         │
│  │  📊 Users    │ │  🏢 Operators│ │  🏪 Warehouses│         │
│  │  1,234       │ │  156         │ │  342          │         │
│  │  +12 today   │ │  +3 pending  │ │  +5 pending   │         │
│  └──────────────┘ └──────────────┘ └──────────────┘         │
│                                                               │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐         │
│  │  📋 Bookings │ │  📞 Complaints│ │  ⚠️  Alerts   │         │
│  │  2,891       │ │  23 open     │ │  2 critical   │         │
│  │  +45 today   │ │  +5 new      │ │  View →       │         │
│  └──────────────┘ └──────────────┘ └──────────────┘         │
│                                                               │
│  Recent Activity                                              │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ 🟢 New operator registered: "SkładOK"       2 min ago   ││
│  │ 🟡 Warehouse needs review: "Склад Вяхино"  15 min ago  ││
│  │ 🔴 Critical complaint: Complaint #5412     1 hour ago  ││
│  │ 🟢 Warehouse approved: "Storage Pro"       2 hours ago ││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

**Data Source:**
- API Endpoint: `GET /api/v1/admin/stats` (see API Blueprint)
- Real-time updates not required in MVP
- Manual refresh button provided

**MVP Metrics (Counts Only):**
- Total users
- Total operators (broken down by status: pending, approved, blocked)
- Total warehouses (broken down by status: draft, pending, active, rejected)
- Total bookings (count only, no revenue)
- Open complaints count
- Critical alerts count

**⚠️ NOT in MVP:**
- Revenue metrics
- Conversion rates
- Retention analysis
- Growth trends over time

---

## 3.2. Activity Feed

**Purpose:** Show recent platform activity for quick admin awareness

**UI Components:**
- Scrollable list (10-20 most recent items)
- Color-coded by urgency (green=info, yellow=warning, red=critical)
- Click item to navigate to relevant screen
- Filter by activity type (optional, nice-to-have)

**Activity Types Displayed:**
- New operator registrations
- Warehouses pending moderation
- Critical complaints
- User/operator blocks
- Admin actions logged

**Data Source:**
- API Endpoint: `GET /api/v1/admin/activity-feed` (see API Blueprint)

---

# 4. Module 2: User Management

**⚠️ FUNCTIONAL REQUIREMENTS:** Defined in Functional Specification

## 4.1. User List View

**UI Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│ Users                                             [+ New User]│
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Search: [____________________] 🔍                           │
│                                                               │
│  Filters: [All] [Active] [Blocked]                          │
│                                                               │
│  ┌──────┬──────────────┬─────────────┬─────────┬──────────┐│
│  │ ID   │ Name         │ Email       │ Role    │ Status   ││
│  ├──────┼──────────────┼─────────────┼─────────┼──────────┤│
│  │ 1234 │ Ahmed Al-Rashid  │ ivan@...    │ user    │ ●Active  ││
│  │ 1235 │ Мария Иванова│ maria@...   │ operator│ ●Active  ││
│  │ 1236 │ Петр Сидоров │ petr@...    │ user    │ ●Blocked ││
│  └──────┴──────────────┴─────────────┴─────────┴──────────┘│
│                                                               │
│  Showing 1-20 of 1,234   [<] 1 2 3 4 ... 62 [>]            │
└─────────────────────────────────────────────────────────────┘
```

**API Endpoint:**
- `GET /api/v1/admin/users` (see API Blueprint)
- Supports pagination, search, filters

**User Actions:**
- Click row → View user details
- Search by name/email
- Filter by role, status
- Bulk actions NOT in MVP v1

---

## 4.2. User Detail View

**UI Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│ User Details: Ahmed Al-Rashid                   [Block] [Delete]│
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Basic Information                                            │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ ID: 1234                                                 ││
│  │ Name: Ahmed Al-Rashid                                        ││
│  │ Email: ivan@example.com       ✓ Verified                ││
│  │ Phone: +7 916 123-45-67                                 ││
│  │ Role: user                                               ││
│  │ Status: Active                                           ││
│  │ Registered: 2025-01-15 14:30                            ││
│  │ Last Login: 2025-12-14 10:22                            ││
│  └─────────────────────────────────────────────────────────┘│
│                                                               │
│  Bookings History                                             │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ #BK-1234  Склад Выхино  2025-02-01  3 months  Confirmed││
│  │ #BK-1189  Storage Pro   2024-11-15  6 months  Completed││
│  └─────────────────────────────────────────────────────────┘│
│                                                               │
│  Activity Log                                                 │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ 2025-12-14 10:22  Login successful                      ││
│  │ 2025-12-13 15:45  Booking created #BK-1234             ││
│  │ 2025-12-10 12:30  Profile updated                       ││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

**API Endpoints:**
- `GET /api/v1/admin/users/{id}` — User details
- `GET /api/v1/admin/users/{id}/bookings` — User booking history
- `GET /api/v1/admin/users/{id}/activity` — Activity log

**Actions:**
- **Block User:** `POST /api/v1/admin/users/{id}/block`
- **Unblock User:** `POST /api/v1/admin/users/{id}/unblock`
- **Delete User (soft):** `DELETE /api/v1/admin/users/{id}`

**⚠️ Business Logic:** Defined in Functional Specification
- Cannot delete user with active bookings
- Block requires confirmation dialog
- Blocking user triggers notification (if notification system enabled)

---

# 5. Module 3: Operator Management

**⚠️ FUNCTIONAL REQUIREMENTS:** Defined in Functional Specification

## 5.1. Operator Verification Workflow

**UI: Pending Operators List**
```
┌─────────────────────────────────────────────────────────────┐
│ Operators › Pending Verification                   [Refresh]│
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────┬──────────────┬─────────────────┬──────┬─────────┐│
│  │ ID   │ Company      │ Owner           │ Date │ Actions ││
│  ├──────┼──────────────┼─────────────────┼──────┼─────────┤│
│  │ 5011 │ СкладОК      │ ivan@skladok.ru │ 2 hr │ Review  ││
│  │ 5012 │ Storage Pro  │ info@spro.ru    │ 1 day│ Review  ││
│  └──────┴──────────────┴─────────────────┴──────┴─────────┘│
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

**API Endpoint:**
- `GET /api/v1/admin/operators?status=pending` (see API Blueprint)

---

## 5.2. Operator Verification Detail

**UI Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│ Operator Verification: СкладОК             [Approve] [Reject]│
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Company Information                                          │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ Company Name: СкладОК                                    ││
│  │ Tax ID (INN): 7707123456                                ││
│  │ Legal Address: Dubai, ул. Примерная, 10                ││
│  │ Contact Email: info@skladok.ru                          ││
│  │ Contact Phone: +7 495 123-45-67                         ││
│  └─────────────────────────────────────────────────────────┘│
│                                                               │
│  Owner Information                                            │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ Name: Иван Иванов                                        ││
│  │ Email: ivan@skladok.ru       ✓ Verified                 ││
│  │ Phone: +7 916 123-45-67                                 ││
│  │ Registered: 2025-12-14 10:00                            ││
│  └─────────────────────────────────────────────────────────┘│
│                                                               │
│  Verification Documents                                       │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ 📄 Tax Registration Certificate.pdf    [View]           ││
│  │ 📄 Business License.pdf                [View]           ││
│  │ 📄 ID Card Scan.pdf                    [View]           ││
│  └─────────────────────────────────────────────────────────┘│
│                                                               │
│  Admin Notes                                                  │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ [Text area for internal notes]                          ││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

**API Endpoints:**
- `GET /api/v1/admin/operators/{id}` — Operator details
- `POST /api/v1/admin/operators/{id}/approve` — Approve operator
- `POST /api/v1/admin/operators/{id}/reject` — Reject with reason

**Approval Action:**
1. Admin reviews documents
2. Clicks [Approve]
3. Confirmation dialog: "Approve operator СкладОК?"
4. API call: `POST /api/v1/admin/operators/{id}/approve`
5. Status changes to `approved`
6. Operator receives email notification (if enabled)

**Rejection Action:**
1. Admin reviews documents
2. Clicks [Reject]
3. Modal dialog: "Reason for rejection:" [text field] [Submit]
4. API call: `POST /api/v1/admin/operators/{id}/reject` with `{"reason": "..."}`
5. Status changes to `rejected`
6. Operator receives email with rejection reason

**⚠️ Business Rules:** See Functional Specification
- Operators must be verified before warehouses are reviewed
- Approved operators can immediately create warehouses

---

## 5.3. Operator Blocking

**UI: Block Operator Button**
- Available on approved operator detail page
- Opens confirmation dialog with reason field
- API: `POST /api/v1/admin/operators/{id}/block`

**Effects of Blocking:**
- Operator cannot login
- All warehouses become hidden (status → `hidden`)
- Active bookings remain active (no auto-cancellation)
- Operator receives notification

**Unblock:**
- Available on blocked operator detail page
- API: `POST /api/v1/admin/operators/{id}/unblock`

---

# 6. Module 4: Warehouse Moderation

**⚠️ FUNCTIONAL REQUIREMENTS:** Defined in Functional Specification

## 6.1. Pending Warehouses List

**UI Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│ Warehouses › Pending Moderation                    [Refresh]│
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────┬─────────────────┬───────────────┬──────┬────────┐│
│  │ ID   │ Name            │ Operator      │ Date │ Actions││
│  ├──────┼─────────────────┼───────────────┼──────┼────────┤│
│  │ W101 │ Склад Выхино    │ СкладОК       │ 3 hr │ Review ││
│  │ W102 │ Storage Premium │ Storage Pro   │ 1 day│ Review ││
│  └──────┴─────────────────┴───────────────┴──────┴────────┘│
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

**API Endpoint:**
- `GET /api/v1/admin/warehouses?status=pending` (see API Blueprint)

---

## 6.2. Warehouse Moderation Detail

**UI Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│ Warehouse Review: Склад Выхино             [Approve] [Reject]│
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Basic Information                                            │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ Name: Склад Выхино                                       ││
│  │ Address: Dubai, ул. Ферганская, 10                     ││
│  │ Operator: СкладОК (ID: 5011)         ✓ Verified         ││
│  │ Description: [Full description text]                     ││
│  └─────────────────────────────────────────────────────────┘│
│                                                               │
│  Photos (Requires Manual Review)                              │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ [Thumbnail 1] [Thumbnail 2] [Thumbnail 3] [...]         ││
│  │ Click to enlarge                                         ││
│  └─────────────────────────────────────────────────────────┘│
│                                                               │
│  Location                                                     │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ [Map showing warehouse location marker]                 ││
│  │ Coordinates: 55.7558, 37.6173                           ││
│  └─────────────────────────────────────────────────────────┘│
│                                                               │
│  Boxes                                                        │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ S (2m²) - 2,500 AED /month - 5 boxes available            ││
│  │ M (5m²) - 4,500 AED /month - 10 boxes available           ││
│  │ L (10m²) - 8,000 AED /month - 3 boxes available           ││
│  └─────────────────────────────────────────────────────────┘│
│                                                               │
│  Admin Notes (Internal)                                       │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ [Text area for notes]                                    ││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

**API Endpoints:**
- `GET /api/v1/admin/warehouses/{id}` — Warehouse details
- `POST /api/v1/admin/warehouses/{id}/approve` — Approve warehouse
- `POST /api/v1/admin/warehouses/{id}/reject` — Reject with reason

**Photo Review Guidelines (UI):**
- Display all uploaded photos in gallery
- Admin manually checks:
  - Quality (not blurry, well-lit)
  - Relevance (actual warehouse, not stock photos)
  - Compliance (no prohibited content)
- ❌ No AI moderation in MVP v1

**Approval:**
1. Admin reviews all info and photos
2. Clicks [Approve]
3. Confirmation: "Approve warehouse Склад Выхино?"
4. API call: `POST /api/v1/admin/warehouses/{id}/approve`
5. Warehouse status → `active` (visible to public)

**Rejection:**
1. Admin finds issues
2. Clicks [Reject]
3. Modal: "Rejection reason:" [dropdown or text] [Submit]
4. Common reasons: "Low quality photos", "Incomplete information", "Prohibited content"
5. API call: `POST /api/v1/admin/warehouses/{id}/reject` with reason
6. Warehouse status → `rejected`
7. Operator notified with reason

**⚠️ Canonical Statuses:**
- See `full_database_specification_mvp_v1_CANONICAL.md` for warehouse status values
- Statuses: `draft`, `pending`, `active`, `rejected`, `hidden`

---

# 7. Module 5: Booking Management (Read-Only)

**⚠️ FUNCTIONAL REQUIREMENT:** Admins have read-only access to bookings in MVP v1

## 7.1. Booking List View

**UI Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│ Bookings (Read-Only)                               [Refresh]│
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Search: [____________________] 🔍                           │
│                                                               │
│  Filters: [All] [Pending] [Confirmed] [Cancelled] [Completed]│
│                                                               │
│  ┌─────────┬────────────┬──────────────┬─────────┬────────┐│
│  │ ID      │ User       │ Warehouse    │ Status  │ Date   ││
│  ├─────────┼────────────┼──────────────┼─────────┼────────┤│
│  │ BK-1234 │ Иван П.    │ Склад Выхино │ Confirm │ 12-14  ││
│  │ BK-1233 │ Мария И.   │ Storage Pro  │ Pending │ 12-13  ││
│  │ BK-1232 │ Петр С.    │ Склад БЦ     │ Cancelled│ 12-12 ││
│  └─────────┴────────────┴──────────────┴─────────┴────────┘│
│                                                               │
│  Showing 1-20 of 2,891   [<] 1 2 3 ... 145 [>]             │
└─────────────────────────────────────────────────────────────┘
```

**API Endpoint:**
- `GET /api/v1/admin/bookings` (see API Blueprint)
- Supports pagination, search, status filter

**⚠️ Canonical Booking Statuses:**
Reference: `full_database_specification_mvp_v1_CANONICAL.md`
- `pending` — Awaiting operator confirmation
- `confirmed` — Operator approved
- `cancelled` — Cancelled by user or operator (replaces old `rejected`)
- `completed` — Rental period ended successfully
- `expired` — Auto-expired (no confirmation within 24h)

**UI Behavior:**
- Click row → View booking details (read-only)
- Filters by status
- Search by booking number, user name, warehouse name
- ❌ No admin actions on bookings in MVP v1
- ❌ No bulk operations

---

## 7.2. Booking Detail View (Read-Only)

**UI Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│ Booking Details: #BK-1234                        [Read-Only]│
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Status: Confirmed                                            │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ Booking Number: BK-1234                                  ││
│  │ Created: 2025-12-13 15:45                               ││
│  │ Confirmed: 2025-12-13 16:20                             ││
│  └─────────────────────────────────────────────────────────┘│
│                                                               │
│  Customer                                                     │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ Name: Ahmed Al-Rashid                                        ││
│  │ Email: ivan@example.com                                  ││
│  │ Phone: +7 916 123-45-67                                 ││
│  └─────────────────────────────────────────────────────────┘│
│                                                               │
│  Warehouse & Box                                              │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ Warehouse: Склад Выхино (ID: W101)                      ││
│  │ Box: M (5m²)                                             ││
│  │ Price: 4,500 AED /month                                    ││
│  └─────────────────────────────────────────────────────────┘│
│                                                               │
│  Booking Details                                              │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ Start Date: 2025-02-01                                   ││
│  │ Duration: 3 months                                       ││
│  │ End Date: 2025-05-01                                    ││
│  │ Total Price: 13,500 AED                                    ││
│  └─────────────────────────────────────────────────────────┘│
│                                                               │
│  Timeline                                                     │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ 2025-12-13 15:45  Booking created (status: pending)     ││
│  │ 2025-12-13 16:20  Confirmed by operator                 ││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

**API Endpoint:**
- `GET /api/v1/admin/bookings/{id}` (see API Blueprint)

**Admin Actions:**
- ❌ Cannot modify booking status in MVP v1
- ❌ Cannot cancel bookings (only operators/users can cancel)
- View-only access for support and monitoring purposes

---

# 8. Module 6: Complaints & Support

**⚠️ FUNCTIONAL REQUIREMENTS:** Defined in Functional Specification

## 8.1. Complaints List

**UI Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│ Complaints                                         [Refresh]│
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Filters: [New] [In Progress] [Resolved]                    │
│                                                               │
│  ┌──────┬─────────────┬──────────────┬──────────┬────────┐│
│  │ ID   │ From        │ Subject      │ Status   │ Date   ││
│  ├──────┼─────────────┼──────────────┼──────────┼────────┤│
│  │ C5412│ Иван П.     │ Склад dirty  │ 🔴 New   │ 1 hr   ││
│  │ C5411│ Мария И.    │ No access    │ 🟡 InProg│ 2 days ││
│  │ C5410│ Петр С.     │ Refund issue │ 🟢 Resolv│ 5 days ││
│  └──────┴─────────────┴──────────────┴──────────┴────────┘│
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

**API Endpoint:**
- `GET /api/v1/admin/complaints` (see API Blueprint)
- Filter by status: `new`, `in_progress`, `resolved`

---

## 8.2. Complaint Detail & Response

**UI Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│ Complaint #C5412                     [Mark In Progress] [Resolve]│
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Status: 🔴 New                                               │
│                                                               │
│  From: Ahmed Al-Rashid (ivan@example.com, +7 916 123-45-67)     │
│  Created: 2025-12-15 10:30                                   │
│  Warehouse: Склад Выхино (W101)                              │
│                                                               │
│  Subject: Склад грязный                                       │
│                                                               │
│  Description:                                                 │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ Здравствуйте! Я забронировал бокс M на вашем складе,    ││
│  │ но при осмотре обнаружил, что он очень грязный.          ││
│  │ Требую уборку или возврат денег.                         ││
│  └─────────────────────────────────────────────────────────┘│
│                                                               │
│  Admin Response:                                              │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ [Text area for admin response]                           ││
│  │                                                           ││
│  │ [Send Response]                                          ││
│  └─────────────────────────────────────────────────────────┘│
│                                                               │
│  History:                                                     │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ 2025-12-15 10:30  Complaint created                      ││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

**API Endpoints:**
- `GET /api/v1/admin/complaints/{id}` — Complaint details
- `POST /api/v1/admin/complaints/{id}/respond` — Send response
- `PUT /api/v1/admin/complaints/{id}/status` — Change status

**Workflow:**
1. Admin views new complaint
2. Clicks [Mark In Progress] → status changes to `in_progress`
3. Admin investigates (may contact operator/user separately)
4. Admin writes response in text area
5. Clicks [Send Response]
6. API call: `POST /api/v1/admin/complaints/{id}/respond` with `{"message": "..."}`
7. User receives email with response
8. When issue resolved, admin clicks [Resolve] → status → `resolved`

**⚠️ Status Values:**
Reference: `full_database_specification_mvp_v1_CANONICAL.md`
- `new` — Just submitted
- `in_progress` — Admin investigating
- `resolved` — Issue closed

---

# 9. Module 7: System Logs

**⚠️ FUNCTIONAL REQUIREMENTS:** Defined in Functional Specification

## 9.1. Log Viewer

**UI Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│ System Logs                                        [Refresh]│
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Date Range: [2025-12-01] to [2025-12-15]      🔍 Search     │
│                                                               │
│  Log Type: [All] [Admin Actions] [User Activity] [Errors]   │
│                                                               │
│  ┌──────────────┬─────────┬──────────────────────────────┐ │
│  │ Timestamp    │ Type    │ Event                        │ │
│  ├──────────────┼─────────┼──────────────────────────────┤ │
│  │ 2025-12-15   │ Admin   │ Warehouse W101 approved by   │ │
│  │ 14:30:00     │         │ admin@example.com            │ │
│  │ 2025-12-15   │ User    │ New booking created #BK-1234 │ │
│  │ 13:45:00     │         │                              │ │
│  │ 2025-12-15   │ Error   │ Payment processing failed    │ │
│  │ 12:00:00     │         │ (txn_5678)                   │ │
│  └──────────────┴─────────┴──────────────────────────────┘ │
│                                                               │
│  Showing 1-50 of 15,234   [<] 1 2 3 ... 305 [>]            │
└─────────────────────────────────────────────────────────────┘
```

**API Endpoint:**
- `GET /api/v1/admin/logs` (see API Blueprint)
- Query params: `start_date`, `end_date`, `type`, `search`

**Log Categories:**
- Admin actions (moderation, blocking, approval)
- User activity (registration, login, bookings)
- Operator activity (warehouse creation, status changes)
- System errors (API errors, payment failures)
- Security events (failed logins, suspicious activity)

**⚠️ Log Retention:**
- MVP v1: 90 days retention
- See `Logging_Strategy_&_Log_Taxonomy_MVP_v1.md` for detailed log specifications

**Export:**
- ❌ CSV export NOT in MVP v1 (planned for v1.5)
- Admins can manually copy-paste if needed

---

# 10. Module 8: Platform Settings

**⚠️ FUNCTIONAL REQUIREMENTS:** Defined in Functional Specification

## 10.1. Category Management

**Purpose:** Manage warehouse categories (e.g., "Climate Controlled", "Drive-Up Access")

**UI Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│ Platform Settings › Categories                 [+ Add Category]│
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌────┬──────────────────┬────────────────────────┬────────┐│
│  │ ID │ Name             │ Description            │ Actions││
│  ├────┼──────────────────┼────────────────────────┼────────┤│
│  │ 1  │ 24/7 Access      │ Round-the-clock access │ Edit   ││
│  │ 2  │ Climate Control  │ Temperature regulated  │ Edit   ││
│  │ 3  │ Video Surveillance│ 24/7 camera monitoring│ Edit   ││
│  └────┴──────────────────┴────────────────────────┴────────┘│
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

**API Endpoints:**
- `GET /api/v1/admin/categories` — List categories
- `POST /api/v1/admin/categories` — Create category
- `PUT /api/v1/admin/categories/{id}` — Update category
- `DELETE /api/v1/admin/categories/{id}` — Delete category

**CRUD Operations:**
- **Create:** Opens modal with name, description fields
- **Edit:** Opens modal to update existing category
- **Delete:** Confirmation required, checks if category in use

---

## 10.2. Attribute Management

**Purpose:** Manage warehouse attributes (features, services)

**UI:** Similar to category management
- List of attributes
- Add/Edit/Delete operations
- Example attributes: "Packing materials", "Insurance available", "Truck rental"

**API Endpoints:**
- `GET /api/v1/admin/attributes`
- `POST /api/v1/admin/attributes`
- `PUT /api/v1/admin/attributes/{id}`
- `DELETE /api/v1/admin/attributes/{id}`

---

## 10.3. Global Settings

**Purpose:** Platform-wide configuration settings

**UI Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│ Platform Settings › Global                          [Save]  │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  General Settings                                             │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ Platform Name: [Self-Storage Aggregator]                ││
│  │ Support Email: [support@storagecompare.ae]                 ││
│  │ Support Phone: [+7 495 123-45-67]                       ││
│  └─────────────────────────────────────────────────────────┘│
│                                                               │
│  Booking Settings                                             │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ Auto-Expire Pending Bookings: [24] hours                ││
│  │ Minimum Booking Duration: [1] month                     ││
│  │ Maximum Booking Duration: [12] months                   ││
│  └─────────────────────────────────────────────────────────┘│
│                                                               │
│  Moderation Settings                                          │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ ☑ Require photo moderation                              ││
│  │ ☑ Auto-approve operators (❌ NOT recommended)           ││
│  └─────────────────────────────────────────────────────────┘│
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

**API Endpoint:**
- `GET /api/v1/admin/settings` — Get all settings
- `PUT /api/v1/admin/settings` — Update settings (bulk)

**Settings Examples:**
- Platform contact info
- Booking duration limits
- Auto-expiry timers
- Moderation toggles

---

# 11. Analytics & Reporting (MVP Scope)

**⚠️ MVP LIMITATION:** Only basic count metrics in MVP v1

## 11.1. Platform Metrics Dashboard

**UI Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│ Analytics                                                     │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Platform Overview (Last 30 Days)                            │
│                                                               │
│  ┌──────────────────┐ ┌──────────────────┐                  │
│  │ New Users        │ │ New Operators    │                  │
│  │ 234              │ │ 12               │                  │
│  │ +15% vs prev     │ │ +20% vs prev     │                  │
│  └──────────────────┘ └──────────────────┘                  │
│                                                               │
│  ┌──────────────────┐ ┌──────────────────┐                  │
│  │ Warehouses Added │ │ Bookings Created │                  │
│  │ 45               │ │ 189              │                  │
│  │ +8% vs prev      │ │ +25% vs prev     │                  │
│  └──────────────────┘ └──────────────────┘                  │
│                                                               │
│  Moderation Queue                                             │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ Pending Operators: 3                                     ││
│  │ Pending Warehouses: 8                                    ││
│  │ Open Complaints: 15                                      ││
│  └─────────────────────────────────────────────────────────┘│
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

**API Endpoint:**
- `GET /api/v1/admin/analytics/summary` (see API Blueprint)

**Metrics Included in MVP:**
- Total counts (users, operators, warehouses, bookings)
- Period comparison (current vs previous 30 days)
- Moderation queue sizes
- Basic growth percentage

**❌ NOT in MVP v1:**
- Revenue analytics
- Conversion funnels
- Cohort analysis
- Retention metrics
- Advanced charts/graphs
- Custom date ranges

**Future (v1.5+):**
- Revenue tracking
- Conversion metrics
- Custom reports
- CSV export

---

# 12. API Reference Summary

**⚠️ IMPORTANT:** This section provides UI-relevant API endpoint references only. Complete API specifications are in `api_design_blueprint_mvp_v1_CANONICAL.md`.

## 12.1. Admin Endpoints Overview

All admin endpoints require `Authorization: Bearer <token>` with `role=admin`.

### User Management
```
GET    /api/v1/admin/users              # List users
GET    /api/v1/admin/users/{id}         # User details
POST   /api/v1/admin/users/{id}/block   # Block user
POST   /api/v1/admin/users/{id}/unblock # Unblock user
DELETE /api/v1/admin/users/{id}         # Soft delete user
```

### Operator Management
```
GET  /api/v1/admin/operators                # List operators
GET  /api/v1/admin/operators/{id}           # Operator details
POST /api/v1/admin/operators/{id}/approve   # Approve operator
POST /api/v1/admin/operators/{id}/reject    # Reject operator
POST /api/v1/admin/operators/{id}/block     # Block operator
POST /api/v1/admin/operators/{id}/unblock   # Unblock operator
```

### Warehouse Moderation
```
GET  /api/v1/admin/warehouses               # List warehouses
GET  /api/v1/admin/warehouses/{id}          # Warehouse details
POST /api/v1/admin/warehouses/{id}/approve  # Approve warehouse
POST /api/v1/admin/warehouses/{id}/reject   # Reject warehouse
```

### Bookings (Read-Only)
```
GET /api/v1/admin/bookings                  # List all bookings
GET /api/v1/admin/bookings/{id}             # Booking details
```

### Complaints
```
GET  /api/v1/admin/complaints                  # List complaints
GET  /api/v1/admin/complaints/{id}             # Complaint details
POST /api/v1/admin/complaints/{id}/respond     # Send response
PUT  /api/v1/admin/complaints/{id}/status      # Update status
```

### Analytics
```
GET /api/v1/admin/stats                        # Dashboard metrics
GET /api/v1/admin/analytics/summary            # Analytics summary
GET /api/v1/admin/activity-feed                # Recent activity
```

### Settings
```
GET    /api/v1/admin/settings                  # Get all settings
PUT    /api/v1/admin/settings                  # Update settings
GET    /api/v1/admin/categories                # List categories
POST   /api/v1/admin/categories                # Create category
PUT    /api/v1/admin/categories/{id}           # Update category
DELETE /api/v1/admin/categories/{id}           # Delete category
```

### Logs
```
GET /api/v1/admin/logs                         # System logs
```

**For complete request/response schemas, validation rules, and error codes:**
→ See `api_design_blueprint_mvp_v1_CANONICAL.md`

---

# 13. Security Considerations (UI/UX)

**⚠️ CANONICAL SOURCE:** Security requirements are fully defined in `security_and_compliance_plan_mvp_v1.md`

## 13.1. Authentication

**UI Behavior:**
- Admin login via standard login form (same as user/operator)
- JWT token stored in `httpOnly` cookie or `localStorage` (implementation decision)
- Token refresh handled transparently
- Auto-logout after token expiry (typically 15 minutes)
- Session timeout warning modal (optional, nice-to-have)

**API:**
- Uses same auth endpoints as other roles: `/api/v1/auth/login`
- Role validation on backend ensures only `role=admin` can access `/admin/*` endpoints

---

## 13.2. RBAC (Role-Based Access Control)

**UI Considerations:**
- All admin panel pages require `role=admin`
- Frontend should check user role before rendering admin routes
- Guard/middleware: Redirect non-admins to public site if they attempt to access `/admin`

**Backend Enforcement:**
- All security is enforced at API level (NEVER trust frontend checks)
- Frontend checks are for UX only

---

## 13.3. Dangerous Actions

**UI Pattern for Critical Actions:**

**Actions requiring confirmation:**
- Block user/operator
- Reject operator application
- Reject warehouse
- Delete user/operator
- Delete category/attribute

**Confirmation Dialog Example:**
```
┌─────────────────────────────────────────┐
│ ⚠️  Confirm Action                      │
├─────────────────────────────────────────┤
│                                         │
│ Are you sure you want to block         │
│ operator "СкладОК"?                     │
│                                         │
│ This action will:                       │
│ • Prevent operator login               │
│ • Hide all their warehouses            │
│ • Notify operator via email            │
│                                         │
│ [Cancel]  [Confirm Block]              │
└─────────────────────────────────────────┘
```

**UI Best Practices:**
- Red color for destructive actions
- Require reason field for rejections/blocks
- Show impact summary before confirmation
- Toast notification after action complete

---

## 13.4. Audit Logging

**UI Implications:**
- All admin actions are automatically logged (backend)
- Logs viewable in System Logs module
- No manual logging required in UI

**What Gets Logged:**
- Admin ID and email
- Action performed (approve, reject, block, etc.)
- Target resource (user ID, warehouse ID, etc.)
- Timestamp
- IP address (backend captures)

---

# 14. UX Requirements & Best Practices

## 14.1. Performance

**Loading States:**
- Show skeleton loaders for tables while data fetches
- Loading spinners for button actions
- Disable buttons during API calls to prevent double-submission

**Pagination:**
- Default page size: 20 items
- Options: 20, 50, 100 items per page
- Jump to page input for large datasets

**Search:**
- Debounce search input (300ms) to avoid excessive API calls
- Show "No results" message when search returns empty

---

## 14.2. Responsive Design

**Breakpoints:**
- Desktop: 1280px+ (primary target for admin panel)
- Tablet: 768px-1279px (functional, but not priority)
- Mobile: <768px (❌ Not optimized for mobile in MVP)

**Recommendation:** Admin panel optimized for desktop use; mobile support can be post-MVP.

---

## 14.3. Keyboard Shortcuts (Nice-to-Have)

**Optional keyboard shortcuts for power users:**
- `Ctrl + K` — Global search
- `Ctrl + /` — Show keyboard shortcuts help
- `G + D` — Go to Dashboard
- `G + U` — Go to Users
- `G + O` — Go to Operators
- `G + W` — Go to Warehouses

**Implementation:**
- Not required for MVP launch
- Can be added incrementally post-MVP

---

## 14.4. Bulk Operations (Limited)

**MVP v1 Constraint:** Maximum 10 items per bulk operation

**Example: Bulk Approve Warehouses:**
```
┌─────────────────────────────────────────────────────────────┐
│ Warehouses › Pending Moderation                              │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  [☑] Select All (10 max)                                     │
│                                                               │
│  ┌─────┬─────────────────┬───────────────┬──────┬─────────┐│
│  │ [ ] │ Name            │ Operator      │ Date │ Actions ││
│  ├─────┼─────────────────┼───────────────┼──────┼─────────┤│
│  │ [☑] │ Склад Выхино    │ СкладОК       │ 3 hr │ Review  ││
│  │ [☑] │ Storage Premium │ Storage Pro   │ 1 day│ Review  ││
│  │ [ ] │ ...             │ ...           │ ...  │ ...     ││
│  └─────┴─────────────────┴───────────────┴──────┴─────────┘│
│                                                               │
│  2 selected   [Approve Selected] [Reject Selected]          │
└─────────────────────────────────────────────────────────────┘
```

**Behavior:**
- Checkbox selection
- Select all limited to 10 items (show warning if > 10)
- Bulk approve/reject buttons enabled only when items selected
- Confirmation dialog shows list of items to be affected

**❌ NOT in MVP:**
- Bulk operations > 10 items
- CSV import for bulk actions
- Advanced filtering before bulk action

---

## 14.5. Notifications & Feedback

**Toast Notifications:**
- Success: Green toast, auto-dismiss after 3s
- Error: Red toast, dismissible manually
- Warning: Yellow toast, auto-dismiss after 5s
- Info: Blue toast, auto-dismiss after 3s

**Examples:**
- ✅ "Warehouse approved successfully"
- ❌ "Failed to block user. Please try again."
- ⚠️ "This action cannot be undone"
- ℹ️ "10 items selected"

**Implementation:**
- Use library like `react-toastify` or `notistack` (React)
- Position: Top-right corner

---

# 15. Future Enhancements (Post-MVP)

**⚠️ OUT OF MVP v1 SCOPE**

This section lists features **NOT** to be implemented in MVP v1 but considered for future versions.

## 15.1. v1.5 Features (3 months post-MVP)

**Planned:**
- CSV export for users, operators, warehouses, bookings
- Bulk operations up to 50 items
- Email templates editor for notifications
- Advanced search filters with save/load
- Dark mode UI toggle

**Estimated Effort:** 2-3 weeks development

---

## 15.2. v2.0 Features (6 months post-MVP)

**Planned:**
- AI-assisted photo moderation (automatic quality detection)
- Two-factor authentication for admins
- Revenue & financial analytics dashboard
- Operator payout management UI
- Advanced role system (Content Moderator, Support, Super Admin)

**Estimated Effort:** 1-2 months development

---

## 15.3. v3.0 Features (Long-term)

**Potential Features (Not Committed):**
- Full BI integration (Grafana dashboards embedded)
- ML-based fraud detection alerts
- Automated workflow rules engine
- CRM integration (Salesforce, HubSpot)
- Multi-language admin panel

**Note:** v3.0 features are speculative and subject to product roadmap changes.

---

# 16. Technical Implementation Guidance

## 16.1. Recommended Tech Stack

**Frontend:**
- React 18+ with TypeScript
- State Management: React Query (TanStack Query) for API data
- UI Library: Material-UI (MUI) or Ant Design
- Routing: React Router v6
- Forms: React Hook Form + Zod validation
- HTTP Client: Axios or native Fetch API

**Styling:**
- Tailwind CSS or MUI's theming system
- Responsive design with mobile-first approach

**Build Tools:**
- Vite or Create React App
- ESLint + Prettier for code quality

---

## 16.2. Project Structure (Recommended)

```
src/
├── pages/
│   ├── Dashboard/
│   │   └── DashboardPage.tsx
│   ├── Users/
│   │   ├── UserListPage.tsx
│   │   └── UserDetailPage.tsx
│   ├── Operators/
│   │   ├── OperatorListPage.tsx
│   │   ├── OperatorVerificationPage.tsx
│   │   └── OperatorDetailPage.tsx
│   ├── Warehouses/
│   │   ├── WarehouseListPage.tsx
│   │   └── WarehouseModerationPage.tsx
│   ├── Bookings/
│   │   ├── BookingListPage.tsx
│   │   └── BookingDetailPage.tsx
│   ├── Complaints/
│   │   ├── ComplaintListPage.tsx
│   │   └── ComplaintDetailPage.tsx
│   ├── SystemLogs/
│   │   └── LogsPage.tsx
│   └── Settings/
│       ├── CategoriesPage.tsx
│       ├── AttributesPage.tsx
│       └── GlobalSettingsPage.tsx
│
├── components/
│   ├── common/
│   │   ├── Button.tsx
│   │   ├── Table.tsx
│   │   ├── Modal.tsx
│   │   └── ConfirmDialog.tsx
│   ├── layout/
│   │   ├── AdminLayout.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Navbar.tsx
│   │   └── Breadcrumbs.tsx
│   └── domain/
│       ├── UserCard.tsx
│       ├── OperatorCard.tsx
│       ├── WarehouseCard.tsx
│       └── ...
│
├── hooks/
│   ├── useAuth.ts
│   ├── useUsers.ts
│   ├── useOperators.ts
│   └── ...
│
├── services/
│   ├── api.ts          # Axios instance with interceptors
│   ├── authService.ts  # Login, logout, token refresh
│   ├── userService.ts  # User API calls
│   └── ...
│
├── types/
│   ├── User.ts
│   ├── Operator.ts
│   ├── Warehouse.ts
│   └── ...
│
├── utils/
│   ├── formatters.ts   # Date, currency formatting
│   ├── validators.ts   # Form validation helpers
│   └── constants.ts    # App-wide constants
│
└── App.tsx
```

---

## 16.3. API Integration Pattern

**Example: Fetching Users with React Query**

```typescript
// hooks/useUsers.ts
import { useQuery } from '@tanstack/react-query';
import { userService } from '@/services/userService';

export function useUsers(filters?: UserFilters) {
  return useQuery({
    queryKey: ['users', filters],
    queryFn: () => userService.getUsers(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// services/userService.ts
import api from './api';

export const userService = {
  async getUsers(filters?: UserFilters) {
    const response = await api.get('/admin/users', { params: filters });
    return response.data;
  },
  
  async blockUser(userId: string) {
    const response = await api.post(`/admin/users/${userId}/block`);
    return response.data;
  },
  
  // ... other user-related API calls
};

// pages/Users/UserListPage.tsx
import { useUsers } from '@/hooks/useUsers';

export function UserListPage() {
  const { data, isLoading, error } = useUsers({ status: 'active' });
  
  if (isLoading) return <Skeleton />;
  if (error) return <ErrorMessage error={error} />;
  
  return (
    <div>
      <h1>Users</h1>
      <UserTable users={data.data} />
    </div>
  );
}
```

**Benefits:**
- Automatic caching and refetching
- Loading and error states handled cleanly
- Optimistic updates for mutations
- Server state separate from UI state

---

## 16.4. Error Handling

**Pattern: Global Error Handler**

```typescript
// services/api.ts
import axios from 'axios';
import { toast } from 'react-toastify';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          toast.error('Session expired. Please login again.');
          // Redirect to login
          window.location.href = '/login';
          break;
        case 403:
          toast.error('You do not have permission to perform this action.');
          break;
        case 404:
          toast.error('Resource not found.');
          break;
        case 422:
          // Validation error
          toast.error(data.message || 'Invalid input.');
          break;
        case 500:
          toast.error('Server error. Please try again later.');
          break;
        default:
          toast.error(data.message || 'An error occurred.');
      }
    } else {
      // Network error
      toast.error('Network error. Please check your connection.');
    }
    
    return Promise.reject(error);
  }
);

export default api;
```

**Error Messages:**
- Show user-friendly messages in UI
- Log detailed errors to console for debugging
- Never expose sensitive error details to users

---

## 16.5. Authentication Flow

```typescript
// hooks/useAuth.ts
import { create } from 'zustand';
import { authService } from '@/services/authService';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  
  login: async (email, password) => {
    const response = await authService.login(email, password);
    const { user, tokens } = response.data;
    
    if (user.role !== 'admin') {
      throw new Error('Access denied. Admin role required.');
    }
    
    localStorage.setItem('token', tokens.access_token);
    localStorage.setItem('refresh_token', tokens.refresh_token);
    
    set({ user, token: tokens.access_token, isAuthenticated: true });
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    set({ user: null, token: null, isAuthenticated: false });
  },
  
  refreshToken: async () => {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) throw new Error('No refresh token');
    
    const response = await authService.refreshToken(refreshToken);
    const { access_token } = response.data;
    
    localStorage.setItem('token', access_token);
    set({ token: access_token });
  },
}));
```

**Protected Route Example:**

```typescript
// components/ProtectedRoute.tsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
}

// App.tsx
<Route path="/admin" element={
  <ProtectedRoute>
    <AdminLayout />
  </ProtectedRoute>
}>
  <Route index element={<DashboardPage />} />
  <Route path="users" element={<UserListPage />} />
  {/* ... other admin routes */}
</Route>
```

---

# 17. Testing Recommendations

## 17.1. Unit Tests

**Test Coverage Priorities:**
1. Critical business logic (approval, rejection, blocking)
2. Form validation
3. Data transformations and formatters
4. Utility functions

**Example: Testing User Blocking:**

```typescript
// userService.test.ts
import { userService } from './userService';
import api from './api';

jest.mock('./api');

describe('userService', () => {
  describe('blockUser', () => {
    it('should call the correct API endpoint', async () => {
      const userId = '123';
      const mockResponse = { data: { success: true } };
      
      (api.post as jest.Mock).mockResolvedValue(mockResponse);
      
      await userService.blockUser(userId);
      
      expect(api.post).toHaveBeenCalledWith(`/admin/users/${userId}/block`);
    });
    
    it('should handle errors gracefully', async () => {
      const userId = '123';
      const mockError = new Error('Network error');
      
      (api.post as jest.Mock).mockRejectedValue(mockError);
      
      await expect(userService.blockUser(userId)).rejects.toThrow('Network error');
    });
  });
});
```

---

## 17.2. Integration Tests

**Focus Areas:**
- Complete user flows (login → navigate → perform action)
- Form submissions with API interactions
- Error handling scenarios

**Example: E2E Test with Playwright:**

```typescript
// e2e/operator-approval.spec.ts
import { test, expect } from '@playwright/test';

test('admin can approve pending operator', async ({ page }) => {
  // Login as admin
  await page.goto('/login');
  await page.fill('input[name="email"]', 'admin@example.com');
  await page.fill('input[name="password"]', 'admin123');
  await page.click('button[type="submit"]');
  
  // Navigate to pending operators
  await page.click('text=Operators');
  await page.click('text=Pending Verification');
  
  // Approve first operator
  await page.click('button:has-text("Review"):first');
  await expect(page.locator('h1')).toContainText('Operator Verification');
  
  await page.click('button:has-text("Approve")');
  await page.click('button:has-text("Confirm")'); // Confirmation dialog
  
  // Verify success
  await expect(page.locator('.toast-success')).toContainText('Operator approved');
});
```

---

## 17.3. Accessibility Testing

**Basic Accessibility Checklist:**
- ✅ All interactive elements keyboard accessible (Tab, Enter, Esc)
- ✅ Proper ARIA labels on icons and buttons
- ✅ Form inputs have associated labels
- ✅ Error messages announced to screen readers
- ✅ Color contrast meets WCAG AA standards
- ✅ Focus indicators visible

**Tools:**
- axe DevTools browser extension
- Lighthouse accessibility audit
- Manual keyboard navigation testing

---

# 18. Deployment & DevOps (UI/UX Considerations)

## 18.1. Environment Configuration

**Frontend Environment Variables:**
```
REACT_APP_API_URL=https://api.storagecompare.ae/api/v1
REACT_APP_ENV=production
REACT_APP_SENTRY_DSN=https://...
REACT_APP_ANALYTICS_ID=G-XXXXXXXXXX
```

**Environments:**
- Development: `http://localhost:3000`
- Staging: `https://admin-staging.storagecompare.ae`
- Production: `https://admin.storagecompare.ae`

---

## 18.2. Build & Deploy

**Build Command:**
```bash
npm run build
```

**Output:**
- Static files in `build/` or `dist/`
- Deploy to CDN or static hosting (Vercel, Netlify, Nginx)

**Deployment Strategy:**
- Blue-green deployment recommended
- Automated deployment via CI/CD (GitHub Actions, GitLab CI)
- Smoke tests post-deployment

---

## 18.3. Monitoring

**Frontend Monitoring:**
- Error tracking: Sentry or similar
- Performance monitoring: Google Analytics, Vercel Analytics
- User session recording: Hotjar (optional)

**Key Metrics to Track:**
- Page load times
- API response times (from frontend perspective)
- Error rates by page
- User flows completion rates

---

# 19. Documentation & Handoff

## 19.1. Developer Documentation

**Required Documentation:**
1. **Setup Guide:** How to clone, install dependencies, run locally
2. **API Integration Guide:** How to add new API endpoints
3. **Component Library:** Storybook for reusable components (optional)
4. **Deployment Guide:** How to build and deploy
5. **Troubleshooting Guide:** Common issues and solutions

---

## 19.2. Product Documentation

**For Product Team:**
- Feature flow diagrams
- User journey maps
- Analytics dashboard guide
- Admin training materials

---

# 20. Appendix

## 20.1. Design Assets

**Required Design Resources:**
- Logo and brand assets
- Color palette (primary, secondary, danger, warning, success)
- Typography system (fonts, sizes, weights)
- Icon library (Material Icons, Heroicons, etc.)
- Image placeholders for mockups

---

## 20.2. External Dependencies

**Key Libraries (Suggested):**
- React Query: Server state management
- React Router: Routing
- Material-UI or Ant Design: UI components
- React Hook Form: Form handling
- Zod: Schema validation
- Axios: HTTP client
- date-fns or Day.js: Date manipulation
- React Toastify: Notifications

---

## 20.3. Glossary of Terms

**Key Terms (UI/UX Context):**
- **Moderation:** Admin review and approval process
- **Pending:** Status indicating item awaits admin action
- **Active:** Status indicating item is live/approved
- **Blocked:** Status indicating item is restricted by admin
- **Read-Only:** User can view but not modify
- **Toast:** Brief notification message

**⚠️ For complete canonical glossary:**
→ See `Unified_Glossary_and_Data_Dictionary_MVP_v1.md`

---

## 20.4. Contact & Support

**For Questions Regarding:**
- Functional Requirements → Product Owner
- API Contracts → Backend Lead
- Database Schema → Database Architect
- UX/UI Clarifications → Frontend Lead / Designer

---

# Document Status & Version History

## Current Status

| Property | Value |
|----------|-------|
| **Type** | UI/UX Specification (NON-CANONICAL) |
| **Status** | Corrected & Aligned with Canonical Docs |
| **Version** | 1.1 |
| **Last Updated** | December 15, 2025 |
| **Review Status** | Pending Frontend Lead Approval |

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Dec 10, 2025 | Initial | Original specification |
| 1.1 | Dec 15, 2025 | Task #ADMIN-001 | Converted to non-canonical UX/UI spec; removed requirement duplicates; aligned with canonical documents |

## Change Policy

**This document (UI/UX Specification) may be updated for:**
- UI/UX improvements and iterations
- Visual design changes
- Frontend implementation optimizations
- Usability enhancements

**This document MUST NOT change:**
- Business requirements (defined in Functional Spec)
- API contracts (defined in API Blueprint)
- Database schema (defined in DB Specification)
- System architecture (defined in Technical Architecture)

**For canonical requirement changes:**
→ Update the appropriate canonical document first, then reflect UI changes here

---

**END OF DOCUMENT**

---

## Quick Reference Card

**Document Purpose:** UI/UX implementation guide for Admin Panel  
**Audience:** Frontend developers, designers  
**Canonical Sources:** Functional Spec, API Blueprint, DB Spec, Architecture  
**Scope:** MVP v1 (basic admin features)  
**Tech Stack:** React + TypeScript + Material-UI/Ant Design  
**Key Limitation:** No revenue analytics, no bulk > 10, no advanced features in MVP  

**Most Important Rule:**  
When in doubt about business logic, API behavior, or data structure → **CHECK THE CANONICAL DOCUMENTS FIRST** before implementing.
