# MVP Requirements Specification (Full TZ)

**Self-Storage Aggregator Platform**

---

## Document Information

| Field | Value |
|-------|-------|
| **Document ID** | DOC-001 |
| **Document Version** | 1.1 |
| **Date** | December 16, 2025 |
| **Project** | Self-Storage Aggregator |
| **Status** | 🟢 GREEN - Canonical Requirements Baseline |
| **Output Format** | Markdown |
| **Quality Level** | Enterprise / Investor / Development-ready |

---

## Document Control

**Audience:**
- Product Management
- Engineering Leadership
- QA Leadership
- Business Stakeholders
- Investors

**Purpose:** This document serves as the single source of truth for MVP scope, defining what must be built, for whom, and under which constraints. It is used to validate that all technical specifications align with original intent.

**Role in System:** This is a requirements governance document that sits above all technical specifications. It answers **WHAT** and **WHY**, never **HOW**.

**Related Documents:**
- Technical Architecture Document
- API Design Blueprint
- Database Specification
- Frontend Architecture Specification
- Backend Implementation Plan
- Security and Compliance Plan
- CRM Lead Management System Specification

---

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-12-16 | Product Team | Initial canonical version |
| 1.1 | 2025-12-16 | Product Team | Corrected to requirements-only scope, removed technical details |

---

# 1. Introduction

## 1.1. Purpose of the Document

This document defines the complete requirements for the Self-Storage Aggregator MVP v1. It specifies:

- What functionality the system must provide
- Who the users are and what problems are being solved
- What is explicitly included and excluded from scope
- How success will be measured
- What constraints and assumptions govern the project

This document is the requirements baseline against which all technical work is validated.

## 1.2. Scope of MVP

The MVP (Minimum Viable Product) encompasses a marketplace connecting users seeking storage solutions with warehouse operators. The scope includes:

- **Core marketplace functionality:** Search, discovery, and booking request submission
- **Operator tools:** Warehouse and inventory management with manual request processing
- **Single AI capability:** Box size recommendation based on item description
- **Basic CRM:** Manual lead processing for operators

The MVP explicitly excludes online payments, advanced analytics, automation, and revenue-generating marketplace features beyond basic commission structure planning.

## 1.3. Intended Audience

**Primary Readers:**
- Product managers validating scope
- Engineering teams verifying alignment before implementation
- QA teams developing test plans
- Business stakeholders assessing project scope

**Usage:**
- Scope verification and change control
- Technical specification validation
- Acceptance criteria definition
- Investor and stakeholder communication

## 1.4. How This Document is Used in the System

This requirements specification serves as the authoritative source for:

1. **Scope Definition:** Determines what is and is not part of MVP v1
2. **Technical Validation:** All technical documents must trace back to requirements defined here
3. **Change Control:** Any scope changes must be reflected here first
4. **Acceptance:** Product acceptance criteria derive from this document
5. **Alignment:** Engineering, product, and QA teams align on requirements before implementation

**Critical Principle:** This document describes requirements, not solutions. Technical teams determine how to implement these requirements in their respective specifications.

---

# 2. Product Vision & Goals

## 2.1. Product Mission

**Mission Statement:**  
Create a digital marketplace that simplifies the self-storage experience by connecting users with available warehouse space while enabling operators to efficiently manage their inventory and bookings.

**Long-term Vision:**  
Become the leading self-storage aggregator platform, reducing friction in the storage rental process through technology, transparency, and user-centric design.

## 2.2. Problems Being Solved

### For Storage Seekers (Users)

**Problem 1: Discovery Friction**
- Users struggle to find available storage options in their area
- Information is scattered across multiple websites and phone calls
- No centralized way to compare options

**Problem 2: Uncertainty About Space Needs**
- Users don't know what storage size they need
- Leads to either over-spending on too-large spaces or insufficient capacity
- Current solutions rely on guesswork or complex calculations

**Problem 3: Booking Complexity**
- Booking requires phone calls, physical visits, or slow email exchanges
- No standardized booking process
- Limited visibility into availability

### For Storage Operators

**Problem 1: Customer Acquisition**
- Operators struggle to reach potential customers
- Marketing is expensive and fragmented
- No centralized platform for visibility

**Problem 2: Manual Processes**
- Booking management is manual and time-consuming
- No centralized system for inventory and availability tracking
- Lead management is unstructured

**Problem 3: Limited Digital Presence**
- Many operators lack professional websites or online booking
- Difficult to compete with larger operators who have digital infrastructure

## 2.3. Value Proposition

### For Renters (Users)

**Primary Value:**
- **Discovery Made Easy:** Search and compare storage options in one place
- **Informed Decisions:** AI-powered recommendations help choose the right box size
- **Convenience:** Submit booking requests online without phone calls
- **Transparency:** See pricing, availability, photos, and reviews upfront

**Secondary Value:**
- Saved favorites for future reference
- Personal dashboard to track booking status
- Ability to leave reviews and benefit from community feedback

### For Storage Operators

**Primary Value:**
- **Customer Reach:** Access to users actively searching for storage
- **Simplified Management:** Centralized platform for warehouses, inventory, and bookings
- **Reduced Manual Work:** Digital booking requests reduce phone call volume
- **Lead Generation:** Structured CRM to capture and process inquiries

**Secondary Value:**
- Professional online presence without building custom website
- Basic analytics to understand occupancy rates
- Reviews and ratings to build credibility

## 2.4. What MVP is Trying to Validate

The MVP v1 aims to validate the following hypotheses:

**Hypothesis 1: Market Demand**
- Users will use a centralized platform to search for storage options
- Operators are willing to list their warehouses on a third-party platform

**Hypothesis 2: Value of AI Recommendation**
- AI-powered box size recommendation provides meaningful value to users
- Users trust AI recommendations enough to influence their booking decisions

**Hypothesis 3: Booking Request Model**
- Users will submit booking requests even without instant confirmation
- Operators will respond to digital booking requests in a timely manner

**Hypothesis 4: Marketplace Feasibility**
- The marketplace model (connecting supply and demand) is viable for self-storage
- Commission-based revenue model is acceptable to operators (framework validation, not implementation)

**Validation Metrics:**
- User registrations and search activity
- Booking request submission rate
- Operator sign-up and warehouse listing rate
- Booking request response time by operators
- Booking confirmation rate
- User and operator retention over 90 days

---

# 3. Stakeholders & User Roles

## 3.1. Guest

**Definition:** Any visitor to the platform who has not registered or logged in.

**Goals:**
- Explore available storage options without commitment
- Understand pricing and availability
- Evaluate whether the platform meets their needs

**Motivations:**
- Researching storage options
- Comparing offerings before deciding
- Seeking quick information without registration friction

**High-Level Permissions:**
- Browse warehouse listings
- View warehouse details, photos, and pricing
- Search and filter warehouses by location and attributes
- Use AI Box Finder tool
- View reviews and ratings
- Access public pages (home, about, FAQ)

**Limitations:**
- Cannot submit booking requests
- Cannot save favorites
- Cannot leave reviews
- Cannot contact operators directly through platform

## 3.2. User (Renter)

**Definition:** A registered individual seeking storage space.

**Goals:**
- Find suitable storage space for their needs
- Submit booking requests efficiently
- Track booking status
- Manage personal profile and preferences

**Motivations:**
- Need temporary or long-term storage
- Want convenient online booking process
- Desire transparency in pricing and availability
- Seeking trustworthy operators based on reviews

**High-Level Permissions:**
- All guest capabilities
- Create and manage personal account
- Submit booking requests
- View and manage own bookings
- Cancel bookings under allowed conditions
- Save favorite warehouses
- Write reviews for warehouses they've used
- Receive notifications about booking status changes
- Export personal data

**Limitations:**
- Cannot manage warehouses or inventory
- Cannot access operator dashboard
- Cannot process other users' bookings
- Cannot access CRM leads

## 3.3. Operator

**Definition:** A warehouse owner or authorized representative managing storage facilities.

**Goals:**
- List warehouses to attract customers
- Manage inventory and availability
- Process booking requests efficiently
- Maintain relationships with customers
- Understand business performance

**Motivations:**
- Increase occupancy rates
- Reduce vacancy periods
- Streamline operations
- Access new customer segments
- Build online reputation

**High-Level Permissions:**
- All user capabilities
- Create and manage warehouses
- Define and manage box types and pricing
- Upload warehouse photos and descriptions
- View and process booking requests (confirm or cancel)
- View active bookings
- Access basic metrics (occupancy rate, booking count)
- Manage CRM leads
- Update lead status and add notes
- View lead contact information

**Limitations:**
- Can only access own warehouses and bookings
- Cannot access other operators' data
- Cannot modify platform settings
- Cannot access system-wide analytics
- Cannot manage other operators

## 3.4. Admin (Internal)

**Definition:** Internal system administrator with platform-wide access.

**Goals:**
- Maintain platform health and stability
- Moderate content and resolve disputes
- Manage user accounts and operator approvals
- Monitor system performance

**Motivations:**
- Ensure platform quality and integrity
- Protect user experience
- Enforce terms of service
- Support business operations

**High-Level Permissions:**
- All operator and user capabilities
- Access to all warehouses and bookings (read-only)
- User account management
- Operator approval and suspension
- Content moderation
- System configuration (settings, rate limits)
- View system logs and audit trails
- Access platform-wide analytics

**Limitations:**
- Cannot modify bookings on behalf of operators (read-only)
- Cannot impersonate users (audit trail required for admin actions)

---

# 4. In-Scope vs Out-of-Scope

## 4.1. In Scope (MVP v1)

This section defines what **MUST** be included in MVP v1.

### 4.1.1. Core Marketplace Features

**Search and Discovery:**
- Location-based warehouse search with autocomplete
- Multi-criteria filtering (price range, box size, amenities, services)
- Sorting by price, rating, and distance
- Map view with warehouse markers and clustering
- Warehouse detail pages with photos, pricing, reviews, and location

**Booking Functionality:**
- Booking request submission (not instant confirmation)
- Booking request lifecycle management
- Price calculation based on duration and box selection
- User-initiated booking cancellation
- Booking history and status tracking

**Reviews and Ratings:**
- Users can leave reviews and ratings for warehouses they've booked
- Public display of reviews and aggregate ratings
- Review moderation capabilities

**Favorites:**
- Users can save warehouses to favorites
- Favorites accessible from user dashboard

### 4.1.2. User Account Management

- User registration and authentication
- Email-based login
- Password reset functionality
- Profile management (name, phone, email, password)
- Account deletion (soft delete with data retention policy)
- Personal dashboard showing bookings and favorites

### 4.1.3. Operator Capabilities

**Warehouse Management:**
- Create, edit, and delete warehouses
- Upload multiple photos per warehouse
- Set working hours and access type
- Define location and contact information
- Manage warehouse status (draft, published, suspended)

**Box Management:**
- Create, edit, and delete box types
- Define box dimensions and pricing
- Set quantity and availability
- Manage box status (active, inactive, maintenance)

**Booking Management:**
- View all incoming booking requests
- Confirm or cancel booking requests with reason
- View active bookings
- Dashboard with basic metrics:
  - Total bookings count
  - Active bookings count
  - Occupancy rate (percentage)
- No revenue analytics or advanced metrics

**CRM and Lead Management:**
- View leads generated from contact forms
- Manual lead status updates (new, in progress, contacted, booked, rejected, spam)
- Add notes and activities to leads
- Basic filtering by status and warehouse
- No automated lead scoring or assignment

### 4.1.4. AI Capabilities

**Box Size Recommendation (ONLY AI feature in MVP):**
- User describes items needing storage (text input)
- AI analyzes description and recommends appropriate box size(s)
- Reasoning provided to user explaining the recommendation
- Fallback to rule-based logic if AI service is unavailable

**Explicitly NOT Included:**
- AI price analysis
- AI-generated warehouse descriptions
- AI-powered search (semantic/embeddings)
- Chatbot or conversational AI
- AI-based lead scoring

### 4.1.5. Non-Functional Requirements Included

- Role-based access control (guest, user, operator, admin)
- Data isolation between operators
- Rate limiting on API endpoints
- Error handling with user-friendly messages
- Structured logging for debugging and monitoring
- Basic security measures (HTTPS, JWT authentication, password hashing)
- Cookie consent banner
- Privacy policy and terms of service pages
- Data export for user rights compliance

### 4.1.6. Geographic and Language Scope

- **Initial Market:** Russia (Russian Federation)
- **Language:** Russian only for MVP
- **Currency:** Russian Ruble (RUB)
- **Address Format:** Russian address standards
- **Maps Integration:** Google Maps (primary)

## 4.2. Explicitly Out of Scope

This section defines what **MUST NOT** be included in MVP v1. These features are planned for future releases or explicitly excluded.

### 4.2.1. Payment and Billing (v1.1+)

**NOT in MVP:**
- Online payment processing
- Payment gateway integration
- Automated billing
- Invoice generation
- Payment tracking
- Refund processing
- Commission collection mechanism
- Financial reporting and revenue dashboards

**MVP Approach:** Payments are settled offline directly between user and operator. Booking request represents intent, but payment happens outside the platform.

### 4.2.2. Advanced Analytics (v1.1+)

**NOT in MVP:**
- Revenue analytics and financial dashboards
- Conversion funnel tracking
- User behavior analytics (heatmaps, session recordings)
- Predictive analytics
- Demand forecasting
- Comparative market analysis
- A/B testing infrastructure

**MVP Approach:** Operators see basic counts only (total bookings, occupancy rate). No charts, graphs, or trend analysis.

### 4.2.3. Team Management (v1.1+)

**NOT in MVP:**
- Multiple operator sub-roles (owner, manager, staff)
- Team member invitations
- Granular permission management
- Activity logs for team members
- Role-based access within operator accounts

**MVP Approach:** Single operator role per warehouse with full permissions. No team collaboration features.

### 4.2.4. Advanced AI Features (v1.1+)

**NOT in MVP:**
- AI price analysis and recommendations
- Auto-generated warehouse descriptions
- Semantic/embedding-based search
- AI chatbot or conversational assistant
- Review sentiment analysis
- Demand prediction

**MVP Approach:** Only box size recommendation AI feature is included.

### 4.2.5. Automation and Workflow (v1.1+)

**NOT in MVP:**
- Automated booking confirmation
- Automated lead assignment
- Workflow rules and triggers
- Email/SMS campaign automation
- Scheduled reports
- Auto-responses to inquiries

**MVP Approach:** All operator actions are manual. No automation or rules engine.

### 4.2.6. Enhanced Communication (v1.1+)

**NOT in MVP:**
- In-platform messaging between users and operators
- SMS notifications
- Push notifications (mobile)
- Real-time chat
- Video calls or consultations

**MVP Approach:** Email notifications only. Users contact operators via phone/email outside platform.

### 4.2.7. Comparison and Advanced Search (v1.1+)

**NOT in MVP:**
- Side-by-side warehouse comparison tool
- Saved searches
- Search history
- Advanced search with natural language
- Search result personalization

**MVP Approach:** Basic search with filters and sorting only.

### 4.2.8. Mobile Applications (v2.0+)

**NOT in MVP:**
- Native iOS application
- Native Android application
- Mobile-specific features (QR codes, location services)

**MVP Approach:** Responsive web application accessible on mobile browsers.

### 4.2.9. Marketplace Monetization Features (Future)

**NOT in MVP:**
- Subscription plans for operators
- Promoted listings or advertising
- Featured warehouse placements
- Commission collection and distribution
- Dynamic pricing suggestions
- Premium features for operators

**MVP Approach:** Free for operators to list. Commission structure planning only, not implemented.

### 4.2.10. Advanced Compliance Features (Future)

**NOT in MVP:**
- GDPR automated workflows (beyond basic requirements)
- Data residency controls
- Advanced audit trails
- Compliance reporting dashboards
- Automated data retention enforcement

**MVP Approach:** Manual compliance processes, basic data export, basic privacy controls.

---

# 5. Core Functional Requirements

This section describes **WHAT** the system must support, organized by functional domain. Technical implementation details are excluded.

## 5.1. Marketplace Discovery

### 5.1.1. Search Capability

**Requirement:** Users must be able to search for warehouses by location.

**User Need:** Users need to find storage near their home, work, or a specific area.

**Functional Behavior:**
- Accept location text input (address, city, district, metro station)
- Provide autocomplete suggestions as user types
- Support both specific addresses and general areas
- Return warehouses within a configurable radius of the searched location

**Success Criteria:**
- Search returns relevant results
- Autocomplete responds quickly
- Results are sorted by relevance (distance by default)

### 5.1.2. Filtering

**Requirement:** Users must be able to filter warehouse results by multiple criteria.

**Filter Categories:**

**Price Range:**
- Minimum and maximum monthly price
- Filter applies to available boxes within warehouses

**Box Size:**
- Filter by size category (XS, S, M, L, XL, XXL)
- Show only warehouses offering selected sizes

**Amenities:**
- Climate control (temperature and humidity regulated)
- 24/7 access
- Video surveillance
- Security systems
- Loading dock access

**Services:**
- Packing materials available
- Delivery/moving assistance
- Insurance options
- Equipment rental (hand trucks, dollies)

**Availability:**
- Show only warehouses with available boxes

**Functional Behavior:**
- Multiple filters can be applied simultaneously
- Filters update results dynamically without page reload
- Filter state persists during user session

**Success Criteria:**
- Filter application updates results responsively
- No results state handled gracefully with suggestions

### 5.1.3. Sorting

**Requirement:** Users must be able to sort results by different criteria.

**Sort Options:**
- **Price (Low to High):** Sort by lowest monthly price available
- **Price (High to Low):** Sort by highest monthly price
- **Rating (High to Low):** Sort by warehouse rating
- **Distance (Near to Far):** Sort by proximity to search location

**Functional Behavior:**
- Default sort is by rating (highest first)
- Sort persists with filters
- Sort preference saved during session

### 5.1.4. Map View

**Requirement:** Users must be able to view warehouse locations on an interactive map.

**Functional Behavior:**
- Display all search results as markers on map
- Cluster nearby markers to reduce clutter
- Click marker to view warehouse preview card
- Map bounds adjust to show all results
- Synchronize map view with list view (filters apply to both)

**Interaction Requirements:**
- Pan and zoom map controls
- Switch between map and list views
- See warehouse details without leaving map

**Success Criteria:**
- Map loads promptly
- Marker clustering works smoothly
- Preview cards load quickly on marker click

### 5.1.5. Warehouse Visibility

**Requirement:** Warehouses must only be visible if they meet publication criteria.

**Visibility Rules:**
- Warehouse must be in published state
- Warehouse must have at least one active box
- Warehouse must have complete required information (name, address, contact)

**Operator Control:**
- Operators can set warehouse status to control visibility
- Unpublished warehouses not searchable by users

## 5.2. Booking & Requests

### 5.2.1. Booking Request Creation

**Requirement:** Users must be able to submit booking requests for available boxes.

**Request Information Required:**
- Selected box and warehouse
- Rental start date
- Rental duration (in months)
- Contact information (name, phone, email)
- Optional special requests or notes

**Functional Behavior:**
- User selects specific box from warehouse detail page
- System calculates total price based on duration
- User reviews and confirms request
- System validates availability before submission
- Confirmation displayed to user after submission

**Business Rules:**
- Minimum rental duration: 1 month
- Start date must be in the future (at least tomorrow)
- Box must have available quantity at time of submission
- Total price calculation based on monthly rate and duration

**Immediate Outcomes:**
- Booking request created
- User receives confirmation (on-screen and email)
- Operator receives notification of new request
- Box available quantity adjusted

**User Expectations Set:**
- Booking is a request, not instant confirmation
- Operator must review and confirm
- User will be notified of operator decision

### 5.2.2. Booking Request Lifecycle

**Requirement:** Booking requests must transition through defined statuses based on user and operator actions.

**Lifecycle Stages:**

The system supports a booking lifecycle with the following conceptual stages:

**Initial Stage:**
- Request submitted by user
- Awaiting operator review
- User can cancel

**Confirmed Stage:**
- Operator has accepted the request
- Storage space is reserved
- Payment to be arranged offline
- User can cancel with appropriate notice

**Active Stage:**
- Rental period has started
- User is actively using the storage
- Cancellation restricted

**Completion Stage:**
- Rental period has ended
- User has vacated the storage
- Final state

**Cancellation:**
- Request cancelled by user, operator, or system
- Includes cancellation reason
- Available quantity restored

**Expiration:**
- Pending request not acted upon within reasonable timeout
- System automatically expires old requests
- Available quantity restored

**Note:** Detailed status definitions, allowed transitions, and technical state machine logic are defined in the Database Specification and API Design Blueprint. This requirements document describes the conceptual lifecycle only.

**User Visibility:**
- Users see current status in their dashboard
- Status changes trigger email notifications
- Status history visible in booking details

### 5.2.3. Cancellation Rules

**Requirement:** Users and operators must be able to cancel bookings under specific conditions.

**User Cancellation Principles:**
- Users can cancel pending requests without restrictions
- Users can cancel confirmed bookings with reasonable notice before start date
- Users cannot self-cancel active bookings (must contact operator)

**Operator Cancellation Principles:**
- Operators can cancel pending requests with reason
- Operators can cancel confirmed bookings with reason
- Operators can cancel active bookings with proper process

**Cancellation Information Required:**
- Cancellation reason (required for operators, optional for users)
- Record of who cancelled (user, operator, or system)
- Cancellation timestamp

**Post-Cancellation Behavior:**
- Box available quantity restored
- User and operator notified
- Booking marked as cancelled (not deleted)
- Cancellation reason stored for audit

### 5.2.4. Booking Confirmation Process

**Requirement:** Operators must be able to review and confirm or decline booking requests.

**Operator Actions Available:**
- **Confirm:** Accept the booking request
- **Decline:** Reject the request with reason

**Confirmation Requirements:**
- Review booking details (user info, dates, box, price)
- Verify box availability
- Optional: Add internal notes
- Submit decision

**Post-Confirmation Behavior (Confirm):**
- Status changes to confirmed
- User receives confirmation notification
- Booking appears in operator's active bookings
- Confirmation timestamp recorded

**Post-Decline Behavior:**
- Request declined with reason
- User receives notification with reason
- Box available quantity restored
- User can search for alternatives

## 5.3. User Account Capabilities

### 5.3.1. Registration and Authentication

**Requirement:** Users must be able to create accounts and authenticate securely.

**Registration Information Required:**
- Email address (unique)
- Password (minimum security requirements)
- Full name
- Phone number (optional initially)

**Functional Behavior:**
- Email uniqueness validation
- Password strength requirements enforced
- Email verification sent after registration
- Account active after email verification (or immediately for MVP)

**Login Capability:**
- Email and password authentication
- Remember me option (session extension)
- Failed login attempt limiting

**Password Management:**
- Password reset via email
- Password change from profile
- Old password required for password change

### 5.3.2. Profile Management

**Requirement:** Users must be able to view and update their profile information.

**Editable Fields:**
- Full name
- Phone number
- Email address (requires re-verification)
- Password

**Profile Actions:**
- Update profile information
- Change password
- Request account deletion

**Data Visibility:**
- Users can only view and edit their own profile
- Profile data used to pre-fill booking forms

### 5.3.3. Booking History

**Requirement:** Users must be able to view all their bookings (past and present).

**Booking History Display:**
- List of all bookings ordered by date (newest first)
- Filter by status
- Each booking shows: warehouse name, box details, dates, status, price

**Booking Detail View:**
- Complete booking information
- Contact information submitted
- Status history
- Cancellation reason (if applicable)
- Operator contact information

### 5.3.4. Favorites Management

**Requirement:** Users must be able to save warehouses for future reference.

**Functional Behavior:**
- Add warehouse to favorites from detail page or search results
- Remove warehouse from favorites
- View all favorites in dashboard
- No limit on number of favorites

**Favorites Display:**
- List view with warehouse preview cards
- Quick access to warehouse details
- Remove from favorites option

### 5.3.5. Request Tracking

**Requirement:** Users must be able to track status of pending and active booking requests.

**Tracking Information:**
- Current status
- Status change timestamp
- Estimated next steps
- Operator response (if any)
- Cancellation reason (if applicable)

**Notifications:**
- Email notifications on status changes
- Dashboard badge showing pending actions

## 5.4. Operator Capabilities

### 5.4.1. Operator Onboarding

**Requirement:** Operators must be able to register and get approved to list warehouses.

**Registration Process:**
- Operator creates user account
- Switches account type to operator
- Provides operator-specific information:
  - Business name or individual name
  - Contact phone
  - Business verification information (for approval)

**Approval Workflow:**
- Operator account requires admin approval
- Status: Pending → Approved → Can list warehouses
- Operators can create draft warehouses while pending approval but cannot publish

**Business Validation:**
- Admin reviews operator information
- Verification against business registry (manual process)
- Approval or rejection with reason

### 5.4.2. Warehouse Management

**Requirement:** Operators must be able to create, edit, and manage warehouses.

**Warehouse Information Required:**
- Basic Information:
  - Warehouse name
  - Description (optional, text area)
  - Full address
  - City and district
  - Metro station (if applicable)
  - Coordinates (derived from address or manual pin)

- Contact Information:
  - Contact phone (can differ from operator account phone)
  - Contact email (optional)

- Operating Information:
  - Working hours (by day of week)
  - Access type (self-service, managed, 24/7)

- Amenities and Services:
  - Select applicable amenities (checkboxes)
  - Select available services (checkboxes)

- Media:
  - Upload multiple photos (minimum 1 required)
  - Set primary photo

- Status:
  - Draft: Warehouse not visible to users
  - Published: Warehouse visible in search
  - Suspended: Temporarily hidden
  - Closed: Permanently closed

**Functional Behavior:**
- Create new warehouse (starts in draft)
- Edit warehouse information anytime
- Upload/delete photos
- Publish warehouse when ready
- Suspend warehouse temporarily
- Delete warehouse (soft delete)

**Business Rules:**
- Cannot publish warehouse without at least 1 photo and 1 active box
- Cannot delete warehouse with active bookings
- Suspended warehouses hidden from search but existing bookings continue

### 5.4.3. Box Management

**Requirement:** Operators must be able to define and manage box types within warehouses.

**Box Information Required:**
- Box identifier/name (e.g., "Small Box A")
- Size category (XS, S, M, L, XL, XXL)
- Dimensions (length, width, height in meters)
- Monthly price (in rubles)
- Total quantity available
- Status (active, inactive, maintenance)

**Functional Behavior:**
- Create multiple box types per warehouse
- Edit box information (price, quantity, status)
- Set box to inactive (hidden from users)
- Delete box (if no bookings)

**Business Rules:**
- Cannot delete box with active or confirmed bookings
- Available quantity automatically managed based on bookings
- Price changes affect new bookings only (existing bookings immutable)

**Derived Information:**
- Total area (m²) calculated from dimensions
- Total volume (m³) calculated from dimensions
- Available quantity = Total quantity - Confirmed/Active bookings

### 5.4.4. Booking Request Handling

**Requirement:** Operators must be able to view and process incoming booking requests.

**Booking Request Inbox:**
- List of all booking requests for operator's warehouses
- Filter by status (pending, confirmed, active)
- Filter by warehouse
- Sort by date (newest first)
- Visual indicator for new/unread requests

**Request Details View:**
- User contact information
- Selected box and warehouse
- Requested dates and duration
- Total price
- Special requests or notes from user
- Request submission timestamp

**Actions Available:**
- Confirm request
- Cancel request (with reason)
- Add internal notes (not visible to user)

**Notification Preferences:**
- Email notification for new booking requests
- Configurable notification frequency

### 5.4.5. Active Bookings View

**Requirement:** Operators must be able to view all active and confirmed bookings.

**Active Bookings Display:**
- List of confirmed and active bookings
- Filter by status
- Filter by warehouse
- Sort by start date or end date

**Booking Information Shown:**
- Booking number/ID
- User name and contact
- Warehouse and box
- Start and end dates
- Status
- Total price

**Actions Available:**
- View full booking details
- Cancel booking (with reason and confirmation)
- Add internal notes
- Mark as completed (when rental ends)

### 5.4.6. Dashboard and Metrics

**Requirement:** Operators must be able to see basic performance metrics.

**Metrics Displayed (MVP Scope):**
- **Total Bookings:** Count of all bookings (all statuses)
- **Active Bookings:** Count of confirmed + active bookings
- **Occupancy Rate:** Percentage of boxes currently booked
  - Calculation: (Booked boxes / Total boxes) × 100%

**Metrics NOT Included (Out of Scope):**
- Revenue metrics or financial charts
- Conversion rates
- Trend analysis or historical comparisons
- Booking funnel metrics

**Display Format:**
- Simple numeric values with labels
- Occupancy rate as percentage
- No charts or graphs
- Updated in real-time or near real-time

**Scope Clarification:** Dashboard is informational only. No drill-down, no export, no comparative analysis.

## 5.5. CRM & Leads

### 5.5.1. Lead Creation

**Requirement:** System must capture customer inquiries as leads for operator follow-up.

**Lead Sources:**
- Contact forms on warehouse detail pages
- General inquiry forms
- Failed booking attempts (optional capture)

**Lead Information Captured:**
- User name
- Contact phone
- Contact email
- Preferred warehouse (if from warehouse page)
- Preferred box size (if known)
- Message or inquiry text
- Source (form location)
- Timestamp

**Lead Assignment:**
- Leads assigned to the operator of the relevant warehouse
- If no warehouse specified, assigned to general inquiry queue (admin)

### 5.5.2. Lead Status Management

**Requirement:** Operators must be able to manage lead lifecycle to track progress.

**Lead Lifecycle:**

The system supports manual lead lifecycle management for operators. Operators can track leads through various stages from initial contact to resolution. Detailed lead status definitions, allowed transitions, and workflow rules are defined in the CRM Lead Management System Specification.

**Capabilities Required:**
- Update lead status manually
- Track progress from new inquiry to resolution
- Mark leads as spam or invalid
- Record final outcomes (converted to booking, rejected, etc.)

**Status Update Requirements:**
- Operator selects appropriate status
- Optional note explaining status change
- Timestamp recorded for each status change

### 5.5.3. Lead Activities and Notes

**Requirement:** Operators must be able to log activities and add notes to leads.

**Activity Types:**
- Phone call
- Email sent
- Meeting scheduled
- General note

**Activity Information:**
- Activity type
- Date and time
- Description or notes
- Operator who logged activity

**Functional Behavior:**
- Add new activity to lead
- View activity history (chronological)
- Edit recent activities (within 1 hour)
- Activities visible only to operator and admin

### 5.5.4. Manual Lead Processing

**Requirement:** All lead processing must be manual without automation.

**Manual Actions Only:**
- Operator manually reviews each new lead
- Operator manually updates status
- Operator manually logs follow-up activities
- Operator manually identifies spam

**No Automation:**
- No automatic lead assignment
- No automatic status transitions
- No automatic follow-up reminders
- No lead scoring or prioritization algorithm
- No email/SMS automation from CRM

**Rationale:** MVP focuses on core functionality without complex automation. Automation features planned for v1.1+.

---

# 6. AI Capabilities (Business View Only)

## 6.1. Box Size Recommendation

### 6.1.1. Feature Purpose

**Business Goal:** Help users select appropriate storage box size by analyzing their storage needs.

**User Problem Solved:** Users often don't know what size box they need. Traditional methods require manual calculation or guesswork, leading to over-spending or insufficient space.

**AI Solution:** User describes items in natural language; AI recommends suitable box size(s) with reasoning.

### 6.1.2. User Value

**Primary Value:**
- Reduces decision friction
- Provides confidence in size selection
- Saves time compared to manual calculation
- Educational (helps users understand space requirements)

**Secondary Value:**
- Increases booking conversion (users less likely to abandon due to uncertainty)
- Reduces booking errors (wrong size selection)
- Improves user satisfaction

### 6.1.3. When Feature is Triggered

**User Interaction:**
- User accesses AI Box Finder tool (available on home page and search page)
- User enters text description of items to be stored
- User submits query
- System processes and returns recommendation

**Input Requirements:**
- Reasonable text length accepted
- Natural language accepted (no structured format required)

**Example Inputs:**
- "Two-seat sofa, double bed, 10 boxes of books, winter clothes, skis"
- "Small apartment's worth of furniture - bed, table, chairs, TV"
- "Storage for renovation: 15 boxes, kitchen appliances, decorations"

### 6.1.4. AI Recommendation Output

**Information Provided to User:**
- Recommended box size(s)
- Size dimensions and area
- Reasoning explaining why this size is recommended
- Alternative sizes (optional)

**User Experience:**
- Clear, actionable recommendation
- Explanation that helps user understand the suggestion
- Confidence in the recommendation conveyed appropriately

### 6.1.5. Fallback When AI Unavailable

**Situation:** AI service experiences downtime or errors.

**User Experience:**
- User not blocked; alternative provided
- System detects AI failure automatically
- Fallback logic activates transparently

**Fallback Mechanism:**
- Rule-based recommendation logic
- Conservative recommendations (err on larger size)
- Appropriate indicator that recommendation is based on standard guidelines

**User Messaging:**
- Transparent about recommendation source
- No mention of AI failure to avoid concern

**Quality Expectations:**
- Fallback must provide reasonable recommendations
- Fallback should be highly reliable
- Fallback recommendations logged for review

### 6.1.6. AI Feature Boundaries

**What AI Does:**
- Analyzes user's text description
- Recommends box size category
- Provides reasoning for recommendation

**What AI Does NOT Do:**
- Make binding storage commitments
- Guarantee space sufficiency
- Handle booking or payment
- Make decisions on behalf of user
- Access user's previous data or preferences

**User Autonomy:**
- Recommendation is advisory only
- User always makes final selection
- User can ignore AI recommendation
- User responsible for verifying size adequacy

### 6.1.7. Success Metrics

**Effectiveness Indicators:**
- Percentage of users who use AI Box Finder
- Percentage of users who follow AI recommendation
- Conversion rate: AI usage → booking submission
- User satisfaction with AI recommendations (survey)

**Quality Indicators:**
- Accuracy of recommendations (user feedback)
- Fallback activation rate (should be minimal)

**Performance Indicators:**
- Response time
- Availability

---

# 7. Non-Functional Requirements (High-Level)

## 7.1. Performance Expectations

**User-Facing Performance:**
- Page load times should be acceptable for standard broadband connections
- Search results should appear promptly after query submission
- Map rendering should be responsive
- System should respond to user interactions without noticeable delays

**Scalability Expectations:**
- Support expected initial user base
- Plan for growth in first year
- Handle anticipated warehouse and booking volumes

**Degradation Under Load:**
- System should degrade gracefully under high load
- Non-critical features can slow before core features (search, booking)

## 7.2. Availability Expectations

**Uptime Target:**
- High availability appropriate for MVP phase
- Scheduled maintenance windows acceptable with advance notice

**Critical vs Non-Critical:**
- **Critical (must be available):** Search, warehouse details, booking submission, operator dashboard
- **Non-Critical (acceptable short outages):** AI recommendations, reviews, favorites, CRM

**Recovery Expectations:**
- Recovery from failures within reasonable timeframes
- Monitoring and alerting in place

## 7.3. Data Correctness

**Booking Data:**
- Booking status must always be accurate and up-to-date
- No double-booking of the same box for overlapping dates
- Price calculations must be mathematically correct (no rounding errors)

**Inventory Accuracy:**
- Box availability must reflect actual bookings in real-time
- Available quantity cannot go negative
- Inventory updates must be atomic (no race conditions)

**User Data Integrity:**
- User profile changes reflected immediately
- No data loss on updates or deletions
- Audit trail for sensitive operations (account deletion, booking cancellation)

**Geographic Data:**
- Warehouse locations must be accurately geocoded
- Distance calculations must use correct formulas
- Map markers must correspond to correct warehouses

## 7.4. Privacy Expectations

**Personal Data Protection:**
- User data visible only to authorized parties (user themselves, relevant operators, admins)
- Operators cannot see data for other operators' warehouses or customers
- Passwords never stored in plain text
- Sensitive data encrypted at rest and in transit

**Data Minimization:**
- Collect only data necessary for functionality
- No unnecessary tracking or profiling
- User data not sold or shared with third parties

**User Control:**
- Users can view all personal data system holds about them
- Users can request data export
- Users can request account deletion

**Transparency:**
- Privacy policy clearly explains data usage
- Cookie consent banner with opt-in/opt-out controls
- Clear communication about what data is shared with operators

## 7.5. Security Expectations (Principles)

**Authentication Security:**
- Strong password requirements enforced
- Password reset only via verified email
- Failed login attempts limited (rate limiting)
- Session tokens securely generated and stored

**Authorization Security:**
- Role-based access control enforced on all operations
- Users cannot access others' data
- Operators cannot access other operators' data
- Admin actions logged for audit

**Data Security:**
- All connections use HTTPS
- Sensitive data encrypted in database
- File uploads scanned for malware (if applicable)
- SQL injection and XSS protection

**Operational Security:**
- API rate limiting to prevent abuse
- Input validation on all user inputs
- Error messages do not leak sensitive information
- Security patches applied regularly

---

# 8. Constraints & Assumptions

## 8.1. Constraints

### 8.1.1. Budget and Time Constraints

**MVP Timeline:**
- Target completion: 3-4 months from development start
- Tight timeline requires focus on core features only
- No scope creep beyond defined MVP v1

**Budget Limitations:**
- Limited budget for third-party services
- AI usage capped to prevent cost overruns
- Free or low-cost hosting for MVP phase

**Resource Constraints:**
- Small development team (2-3 developers)
- Limited QA resources
- No dedicated DevOps initially

### 8.1.2. Geographic Limitations

**Initial Market:**
- Russia only for MVP
- Russian language only
- Russian address formats and conventions
- Map service integration required

**Currency and Pricing:**
- All prices in Russian Rubles (RUB)
- No currency conversion needed

**Expansion Plans:**
- Other countries and languages planned for v2.0+

### 8.1.3. Manual Operations Allowed

**MVP Philosophy:**
- Accept manual processes where automation is complex
- Operator manually confirms bookings (no instant booking)
- Admin manually approves operator accounts
- Manual lead processing (no automation)
- Manual content moderation

**Rationale:**
- Reduces development complexity
- Faster time to market
- Acceptable for low initial volume

### 8.1.4. Technology Constraints

**AI Provider:**
- Dependent on third-party AI service
- AI costs must be monitored and controlled
- Single AI feature only to limit costs

**Maps Provider:**
- Dependent on map service provider
- Map usage limits apply

**Payment Limitation:**
- No online payments in MVP
- Reduces regulatory complexity and development time
- Acceptable for MVP validation phase

## 8.2. Assumptions

### 8.2.1. User Behavior Assumptions

**Assumption 1: Users Accept Booking Requests (Not Instant Booking)**
- Users are willing to wait for operator confirmation
- Typical response time expected within reasonable timeframe
- If assumption fails: Add instant booking in v1.1

**Assumption 2: Users Trust AI Recommendations**
- Users will use and follow AI box size recommendations
- AI provides meaningful value in decision-making
- If assumption fails: Evaluate AI feature effectiveness, consider removing or improving

**Assumption 3: Mobile-Responsive Web is Sufficient**
- Users don't require native mobile apps initially
- Responsive web app provides acceptable mobile experience
- If assumption fails: Prioritize native apps in v2.0

**Assumption 4: Email Notifications are Sufficient**
- Users don't require SMS or push notifications initially
- Email provides adequate communication channel
- If assumption fails: Add SMS notifications in v1.1

### 8.2.2. Operator Behavior Assumptions

**Assumption 1: Operators Respond to Requests Promptly**
- Operators check dashboard regularly
- Response time to booking requests is reasonable
- If assumption fails: Implement automatic reminders or request expiration

**Assumption 2: Operators Accept Commission Model**
- Operators willing to pay commission on bookings (framework, not implemented in MVP)
- Commission structure acceptable to operators
- If assumption fails: Re-evaluate business model

**Assumption 3: Manual Lead Processing is Acceptable**
- Operators can manage leads without automation initially
- Lead volume low enough for manual handling
- If assumption fails: Prioritize CRM automation in v1.1

**Assumption 4: Operators Provide Accurate Information**
- Operators input correct warehouse details, pricing, and availability
- Photos uploaded are representative
- If assumption fails: Implement admin review and quality checks

### 8.2.3. Technical Assumptions

**Assumption 1: Data Storage Meets Performance Needs**
- Single instance sufficient for MVP scale
- No need for advanced clustering or sharding initially
- If assumption fails: Scale infrastructure

**Assumption 2: Monolith Architecture Acceptable**
- Single application meets needs
- Performance and scalability adequate for MVP
- If assumption fails: Consider distributed architecture in v2.0

**Assumption 3: AI Service Uptime is High**
- Third-party AI provider has high uptime
- Fallback mechanism rarely needed
- If assumption fails: Implement more robust fallback

**Assumption 4: Cloud Hosting Sufficient**
- Cloud VPS or managed hosting meets performance needs
- No need for complex multi-region deployment
- If assumption fails: Scale infrastructure

### 8.2.4. Market Assumptions

**Assumption 1: Demand Exists**
- Users actively searching for self-storage online
- Market size sufficient to validate marketplace model
- If assumption fails: Pivot or discontinue

**Assumption 2: Operators Need Digital Platform**
- Operators see value in online presence and booking requests
- Operators willing to try new platform
- If assumption fails: Re-evaluate operator value proposition

**Assumption 3: Competitive Landscape Favorable**
- No dominant competitor in Russian self-storage aggregation
- Market fragmented enough for new entrant
- If assumption fails: Differentiate or focus on niche

### 8.2.5. Operational Assumptions

**Assumption 1: Manual Moderation Sufficient**
- Content moderation volume manageable manually
- No significant spam or abuse initially
- If assumption fails: Implement automated moderation tools

**Assumption 2: Customer Support Volume Manageable**
- Support inquiries handled via email
- Volume low enough for small team
- If assumption fails: Implement help desk or chatbot

**Assumption 3: No Complex Compliance Initially**
- Basic GDPR/data protection compliance sufficient
- No need for extensive legal team initially
- If assumption fails: Engage legal counsel and enhance compliance

---

# 9. Success Criteria & Acceptance Principles

## 9.1. How MVP Success is Evaluated

### 9.1.1. Validation Metrics

**Primary Success Indicators:**
1. **User Acquisition:**
   - Minimum target for registered users within first quarter post-launch
   - Minimum unique visitors per month
   - Significant percentage of visitors use search functionality

2. **Operator Adoption:**
   - Minimum target for operators onboarded and approved within first quarter
   - Minimum warehouses listed
   - Majority of operators have active boxes (available inventory)

3. **Marketplace Activity:**
   - Minimum booking requests submitted within first quarter
   - Acceptable booking confirmation rate (operators accepting requests)
   - Majority of confirmed bookings reach active status

4. **AI Feature Usage:**
   - Significant percentage of users try AI Box Finder
   - Majority of AI recommendations followed by users
   - High AI service availability

5. **User Engagement:**
   - Average session duration indicates meaningful engagement
   - Multiple warehouses viewed per search session
   - Reasonable percentage of users create favorites

**Secondary Success Indicators:**
- User retention: reasonable return rate within 30 days
- Operator retention: majority of operators still active after first quarter
- Review submission rate: percentage of completed bookings have reviews
- Mobile traffic: significant percentage of users on mobile devices

### 9.1.2. Qualitative Success Factors

**User Satisfaction:**
- Positive Net Promoter Score
- Positive sentiment in user feedback
- Low complaint rate

**Operator Satisfaction:**
- Operators report value from platform
- Operators recommend platform to other operators
- Positive feedback on dashboard and tools

**Product-Market Fit Signals:**
- Users expressing need for features beyond MVP
- Operators requesting enhanced tools
- Word-of-mouth growth without heavy marketing

## 9.2. What "Done" Means at Product Level

### 9.2.1. Functional Completeness

**Feature Implementation:**
- All features in Section 4.1 (In Scope) are implemented
- All core user journeys (search → view → book) work end-to-end
- All operator workflows (list warehouse → manage bookings) functional
- AI Box Finder operational with fallback

**User Experience:**
- All pages and UI components accessible and functional
- Responsive design works on desktop, tablet, and mobile
- Error handling provides user-friendly messages
- No critical bugs or blockers in core flows

**Data Integrity:**
- All booking operations maintain data consistency
- No data loss or corruption
- Audit trails in place for critical operations

### 9.2.2. Quality Standards

**Performance:**
- System performs acceptably under expected load
- No severe performance bottlenecks identified

**Security:**
- Security review completed with no critical vulnerabilities
- Authentication and authorization working correctly
- Data encryption in place
- Privacy controls functional (data export, account deletion)

**Compliance:**
- Privacy policy and terms of service published
- Cookie consent implemented
- Basic data protection requirements met
- Data retention policies documented

### 9.2.3. Operational Readiness

**Deployment:**
- Production environment configured and stable
- Deployment process established
- Backups functional
- Monitoring and alerting in place

**Documentation:**
- User help documentation available
- Operator onboarding guide available
- Admin operational guide available

**Support:**
- Support contact functional
- Support team trained on product
- FAQ page published
- Issue tracking system in place

## 9.3. Acceptance Principles

### 9.3.1. Functional Acceptance

**Principle 1: Core Journeys Must Work**
- All primary user journeys must complete successfully
- Zero critical bugs in core flows
- Acceptable bug threshold for medium-priority issues

**Principle 2: Data Integrity is Non-Negotiable**
- No scenario should result in data loss or corruption
- All booking state transitions must be correct
- Inventory availability must always be accurate

**Principle 3: Role-Based Access is Enforced**
- Users cannot access other users' data
- Operators cannot access other operators' data
- Authorization failures must result in access denial, not errors

### 9.3.2. Quality Acceptance

**Principle 1: User-Facing Quality**
- UI is visually consistent and professional
- Text is free of spelling and grammar errors (Russian)
- Images and media load correctly
- No broken links or 404 errors on public pages

**Principle 2: Performance is Acceptable**
- Response times are acceptable for users
- No operation takes excessive time
- Page load times acceptable on typical connections

**Principle 3: Error Handling is Graceful**
- All error scenarios handled with user-friendly messages
- No unhandled exceptions visible to users
- Fallbacks work when expected

### 9.3.3. Business Acceptance

**Principle 1: Value is Demonstrable**
- Platform can be demonstrated to stakeholders and investors
- Core value proposition is evident in user flow
- Differentiation from competitors is clear

**Principle 2: Scalability Path Exists**
- Architecture can scale significantly without complete rewrite
- Known bottlenecks documented with mitigation plans
- v1.1 roadmap feasible based on MVP foundation

**Principle 3: Risks are Mitigated**
- Critical risks identified and addressed
- Remaining risks documented and accepted by stakeholders
- No blocking issues for launch

---

# 10. Risks & Open Questions

## 10.1. Product Risks

### 10.1.1. Market Risks

**Risk 1: Insufficient User Demand**
- **Description:** Users may not use a centralized platform for storage search
- **Impact:** Low user acquisition, marketplace fails to gain traction
- **Mitigation:** Market research, user interviews, soft launch to test demand
- **Contingency:** Pivot to operator-focused SaaS model if marketplace doesn't work

**Risk 2: Operator Reluctance**
- **Description:** Operators may not want to list on third-party platform
- **Impact:** Low operator adoption, insufficient inventory for users
- **Mitigation:** Operator outreach, demonstrate value, offer free trial period
- **Contingency:** Adjust commission structure or value proposition

**Risk 3: Competitive Pressure**
- **Description:** Established players or new entrants may dominate market
- **Impact:** Difficulty acquiring users and operators
- **Mitigation:** Differentiate through AI features and UX, move quickly
- **Contingency:** Focus on niche segment or geographic area

### 10.1.2. Adoption Risks

**Risk 1: Booking Request Model Acceptance**
- **Description:** Users may expect instant booking, not request-confirm flow
- **Impact:** High abandonment rate after booking submission
- **Mitigation:** Clear messaging about process, fast operator response incentives
- **Contingency:** Implement instant booking in v1.1 if confirmation rates low

**Risk 2: AI Feature Underutilization**
- **Description:** Users may not trust or use AI box size recommendations
- **Impact:** Feature development wasted, differentiation lost
- **Mitigation:** Prominent placement, user education, demonstrate value
- **Contingency:** Simplify AI feature or make it less central

**Risk 3: Mobile Experience Inadequate**
- **Description:** Responsive web may not meet mobile user expectations
- **Impact:** High mobile bounce rate, poor mobile conversion
- **Mitigation:** Thorough mobile testing, optimize mobile UX
- **Contingency:** Prioritize native apps in v2.0

### 10.1.3. Operational Risks

**Risk 1: Operator Response Time Slow**
- **Description:** Operators may not respond to booking requests promptly
- **Impact:** Poor user experience, low conversion, negative reviews
- **Mitigation:** SLA expectations communicated, reminders, request expiration
- **Contingency:** Penalize slow operators (lower search ranking)

**Risk 2: Content Quality Low**
- **Description:** Operators may upload poor photos or inaccurate information
- **Impact:** User distrust, poor conversion, high cancellation rate
- **Mitigation:** Onboarding guidance, quality review before approval
- **Contingency:** Implement stricter review process or quality scores

**Risk 3: Spam and Abuse**
- **Description:** Platform may attract spam bookings or fraudulent operators
- **Impact:** Wasted operator time, poor user experience, reputation damage
- **Mitigation:** Email verification, operator approval process, rate limiting
- **Contingency:** Implement CAPTCHA, enhanced verification

## 10.2. Technical Risks

### 10.2.1. Performance Risks

**Risk 1: Data Storage Bottleneck**
- **Description:** Data storage may not handle expected traffic
- **Impact:** Slow response times, poor user experience
- **Mitigation:** Optimization, caching strategy, load testing
- **Contingency:** Scale infrastructure

**Risk 2: AI Service Costs**
- **Description:** AI API costs may exceed budget if usage high
- **Impact:** Financial unsustainability, need to restrict AI feature
- **Mitigation:** Usage monitoring, rate limiting, caching similar queries
- **Contingency:** Reduce AI feature prominence or implement cost-based throttling

**Risk 3: Map Service Limits**
- **Description:** Map service usage may hit limits
- **Impact:** Map feature unavailable, users cannot view locations
- **Mitigation:** Usage monitoring, caching geocoding results
- **Contingency:** Upgrade plan or reduce map usage

### 10.2.2. Integration Risks

**Risk 1: AI Service Downtime**
- **Description:** Third-party AI provider may experience outages
- **Impact:** AI Box Finder unavailable, user frustration
- **Mitigation:** Robust fallback mechanism, circuit breaker
- **Contingency:** Reduce prominence of AI feature or find alternative provider

**Risk 2: Maps Service Changes**
- **Description:** Map service may change or have issues
- **Impact:** Map functionality breaks
- **Mitigation:** Stay updated on service changes, implement fallback
- **Contingency:** Switch to alternative provider

**Risk 3: Email Delivery Issues**
- **Description:** Email provider may have deliverability issues
- **Impact:** Users and operators not receiving notifications
- **Mitigation:** Use reputable email service, monitor delivery rates
- **Contingency:** Switch email provider or add SMS as backup

### 10.2.3. Security Risks

**Risk 1: Data Breach**
- **Description:** Platform may be target of cyberattack
- **Impact:** User data compromised, legal liability, reputation damage
- **Mitigation:** Security best practices, regular audits, encryption
- **Contingency:** Incident response plan, user notification, legal compliance

**Risk 2: Account Takeover**
- **Description:** User accounts may be compromised through weak passwords
- **Impact:** Unauthorized access, fraudulent bookings
- **Mitigation:** Strong password requirements, failed login limiting, 2FA (future)
- **Contingency:** Account recovery process, security alerts

**Risk 3: Service Disruption Attacks**
- **Description:** Platform may be subject to attacks causing unavailability
- **Impact:** Unavailability, poor user experience
- **Mitigation:** Protection services, rate limiting
- **Contingency:** Activate mitigation, scale infrastructure

## 10.3. Business Risks

### 10.3.1. Financial Risks

**Risk 1: Low Conversion Rate**
- **Description:** Booking request → confirmed booking conversion may be too low
- **Impact:** Insufficient transactions to validate business model
- **Mitigation:** Optimize booking flow, improve operator training
- **Contingency:** Re-evaluate value proposition or commission structure

**Risk 2: Customer Acquisition Cost Too High**
- **Description:** Marketing spend may not yield sufficient user acquisition
- **Impact:** Unsustainable burn rate, need for additional funding
- **Mitigation:** Focus on organic growth, SEO, word-of-mouth
- **Contingency:** Reduce marketing spend, pivot to B2B model

**Risk 3: Operator Churn**
- **Description:** Operators may list initially but stop responding to requests
- **Impact:** Poor user experience, stale inventory
- **Mitigation:** Operator engagement program, regular communication
- **Contingency:** Remove inactive operators, focus on engaged operators

### 10.3.2. Regulatory Risks

**Risk 1: Data Protection Compliance**
- **Description:** GDPR or Russian data protection laws may have stricter requirements than anticipated
- **Impact:** Legal liability, need for extensive compliance work
- **Mitigation:** Legal consultation, implement privacy by design
- **Contingency:** Enhance privacy controls, engage legal counsel

**Risk 2: Marketplace Regulations**
- **Description:** New regulations may affect marketplace operation
- **Impact:** Need to adjust business model or operational processes
- **Mitigation:** Monitor regulatory landscape, legal advice
- **Contingency:** Adapt business model to comply

## 10.4. Explicitly Accepted MVP Risks

The following risks are **accepted** for MVP v1 with the understanding they will be addressed in future versions:

### 10.4.1. Accepted Technical Limitations

1. **Manual Processes:** Manual operator approval, manual lead processing, manual moderation
   - **Accepted because:** Reduces complexity, acceptable for low volume
   - **Addressed in:** v1.1 with automation features

2. **No Online Payments:** Payments settled offline
   - **Accepted because:** Reduces regulatory complexity, faster MVP launch
   - **Addressed in:** v1.1 with payment gateway integration

3. **Single Language:** Russian only
   - **Accepted because:** Focus on initial market
   - **Addressed in:** v2.0 with multi-language support

4. **Single AI Feature:** Only box size recommendation
   - **Accepted because:** Cost control, scope management
   - **Addressed in:** v1.1 with additional AI features if ROI proven

### 10.4.2. Accepted Business Limitations

1. **No Advanced Analytics:** Basic metrics only for operators
   - **Accepted because:** Focus on core functionality first
   - **Addressed in:** v1.1 with analytics dashboard

2. **No Instant Booking:** Request-confirm flow only
   - **Accepted because:** Reduces complexity, allows operator control
   - **Addressed in:** v1.1 if conversion rates low or user feedback strong

3. **Limited Notification Channels:** Email only
   - **Accepted because:** Simplifies infrastructure
   - **Addressed in:** v1.1 with SMS integration

4. **No Team Management:** Single operator role
   - **Accepted because:** Reduces complexity
   - **Addressed in:** v1.1 with sub-roles and permissions

### 10.4.3. Accepted Scale Limitations

1. **Single Instance:** No advanced scaling
   - **Accepted because:** Sufficient for MVP scale
   - **Addressed in:** When scale requires (10x+ growth)

2. **Monolith Architecture:** Single application
   - **Accepted because:** Faster development, sufficient for MVP
   - **Addressed in:** v2.0 if scale or complexity requires distributed architecture

3. **Manual Support:** Email-based support only
   - **Accepted because:** Expected low volume
   - **Addressed in:** When support volume increases

## 10.5. Open Questions

### 10.5.1. Questions Requiring Stakeholder Decision

**Question 1: Commission Structure**
- **Issue:** What commission percentage should operators pay?
- **Options:** 5-15% of booking value
- **Decision Needed By:** Before v1.1 (payment implementation)
- **Impact:** Affects operator adoption and platform revenue

**Question 2: Freemium vs Subscription for Operators**
- **Issue:** Should operators pay monthly subscription or only commission?
- **Options:** Free listings + commission, Monthly fee + lower commission, Tiered plans
- **Decision Needed By:** Before v1.1
- **Impact:** Affects monetization strategy and operator appeal

**Question 3: Instant Booking in v1.1?**
- **Issue:** Should v1.1 add instant booking option?
- **Options:** Keep request-confirm only, Add instant booking as operator option, Replace request-confirm
- **Decision Needed By:** After 3 months MVP user data
- **Impact:** Affects conversion rates and operator workload

### 10.5.2. Questions Requiring Further Research

**Question 1: Optimal Booking Request Timeout**
- **Issue:** How long should pending requests wait before expiring?
- **Current Assumption:** Reasonable timeout period
- **Research Needed:** Operator response time data from MVP
- **Decision Deferred Until:** After initial MVP operation period

**Question 2: Mobile App Necessity**
- **Issue:** Do users require native mobile apps?
- **Current Assumption:** Responsive web sufficient for MVP
- **Research Needed:** Mobile user behavior and feedback
- **Decision Deferred Until:** After MVP data collection period

**Question 3: Additional AI Features ROI**
- **Issue:** Which AI features provide best ROI?
- **Current Assumption:** Box size recommendation most valuable
- **Research Needed:** AI usage patterns and user feedback
- **Decision Deferred Until:** After box finder usage data collection

### 10.5.3. Known Limitations for Future Resolution

**Limitation 1: No Real-Time Availability**
- **Issue:** Availability updates not truly real-time (may be 1-2 minute delay)
- **Impact:** Rare edge case of double booking
- **Workaround:** Validation at booking creation, operator can cancel if needed
- **Future Resolution:** WebSocket real-time updates in v1.1+

**Limitation 2: Limited Search Personalization**
- **Issue:** Search results not personalized to user preferences
- **Impact:** Users may miss relevant results
- **Workaround:** Robust filtering and sorting options
- **Future Resolution:** ML-based personalization in v2.0

**Limitation 3: No Dispute Resolution Process**
- **Issue:** No formal process for resolving user-operator disputes
- **Impact:** Admin must handle manually, no structured workflow
- **Workaround:** Admin reviews on case-by-case basis
- **Future Resolution:** Structured dispute process in v1.1+

---

# 11. Appendix: Document Usage Guide

## 11.1. For Product Managers

**Use this document to:**
- Define and communicate product scope
- Make prioritization decisions
- Evaluate change requests against MVP scope
- Create user stories and acceptance criteria
- Align stakeholders on requirements

**Key Sections:**
- Section 4: In-Scope vs Out-of-Scope (critical for scope management)
- Section 5: Core Functional Requirements (basis for user stories)
- Section 9: Success Criteria (evaluation framework)

## 11.2. For Engineering Teams

**Use this document to:**
- Understand what needs to be built and why
- Validate technical specifications against requirements
- Identify missing requirements or ambiguities
- Prioritize implementation tasks

**Key Sections:**
- Section 5: Core Functional Requirements (what to build)
- Section 7: Non-Functional Requirements (how well it should work)
- Section 8: Constraints & Assumptions (boundary conditions)

**Important:** This document does NOT specify how to implement. Refer to:
- Technical Architecture Document for system design
- API Design Blueprint for endpoint specifications
- Database Specification for data models

## 11.3. For QA Teams

**Use this document to:**
- Develop test plans and test cases
- Define acceptance criteria
- Identify edge cases and negative scenarios
- Validate feature completeness

**Key Sections:**
- Section 5: Core Functional Requirements (test scope)
- Section 9.3: Acceptance Principles (quality gates)
- Section 4.2: Out of Scope (what NOT to test)

## 11.4. For Stakeholders and Investors

**Use this document to:**
- Understand product vision and scope
- Evaluate project feasibility
- Assess market risks and assumptions
- Understand success metrics

**Key Sections:**
- Section 2: Product Vision & Goals (strategic context)
- Section 4.1: In Scope (what's being built)
- Section 9.1: Success Evaluation (how success is measured)
- Section 10: Risks (what could go wrong)

---

# 12. Document Sign-Off

This requirements specification represents the agreed scope for MVP v1. Changes to scope require formal change control process and stakeholder approval.

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Product Owner | | | |
| Engineering Lead | | | |
| QA Lead | | | |
| Business Stakeholder | | | |

---

**END OF DOCUMENT**

**Document Status:** ✅ 🟢 GREEN - Canonical Requirements Baseline  
**Version:** 1.1  
**Last Updated:** December 16, 2025  
**Next Review:** After MVP v1 launch
