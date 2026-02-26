# User & Operator Documentation (MVP v1)

**Self-Storage Aggregator Platform**

---

## Document Information

| Field | Value |
|-------|-------|
| **Document ID** | DOC-087 |
| **Version** | 1.1 |
| **Status** | 🟢 GREEN (Canonical) |
| **Last Updated** | December 16, 2025 |
| **Project** | Self-Storage Aggregator MVP v1 |
| **Purpose** | User and Operator Capabilities Guide |

**Changelog v1.1:**
- Removed specific timelines and SLAs (verification times, response times)
- Removed technical implementation details (hashing, backup specifics)
- Generalized size category thresholds (removed m² specifications)
- Softened platform commitments with "aims to" language
- Added proper document references (DOC-002, DOC-016, DOC-036, DOC-046, DOC-078)
- Removed concrete percentages and formulas

---

## 1. Purpose & Scope

### 1.1. Document Purpose

This document explains what users and operators can do with the Self-Storage Aggregator platform in MVP v1. It describes capabilities, permissions, and limitations in plain language for non-technical stakeholders.

**This document is NOT:**
- A user interface specification
- A marketing document
- A technical implementation guide
- A helpdesk manual with step-by-step instructions

### 1.2. Intended Audience

- Product owners and managers
- Business stakeholders
- Customer support teams
- Training coordinators
- New operators joining the platform

### 1.3. MVP v1 Scope

This document covers only features available in the initial platform release (MVP v1). Features marked for future releases are explicitly excluded.

---

## 2. User Roles Overview

The platform supports four distinct user roles, each with specific permissions and capabilities.

### 2.1. Guest (Unauthenticated Visitor)

**Access Level:** Public pages only

**Who They Are:**
- First-time visitors exploring the platform
- People researching storage options without commitment
- Users who haven't registered yet

**What They Can Access:**
- Public warehouse listings
- Warehouse details and pricing
- Search and filtering tools
- Interactive map view
- AI Box Finder recommendations

**What They Cannot Do:**
- Create booking requests
- Save favorites
- Write reviews
- Access personal dashboard

### 2.2. Registered User

**Access Level:** Authenticated user features

**Who They Are:**
- Individuals looking for storage solutions
- People who have completed registration
- Users actively booking or managing storage

**What They Get Beyond Guest Access:**
- Ability to create booking requests
- Personal dashboard showing booking history
- Favorites management
- Review submission after completed bookings
- Profile management

### 2.3. Operator

**Access Level:** Business management tools + all user features

**Who They Are:**
- Warehouse owners
- Storage facility managers
- Business representatives managing properties

**What They Get Beyond User Access:**
- Operator dashboard with business metrics
- Warehouse and box inventory management
- Booking request processing
- Customer communication tools
- Basic business analytics

**Important:** In MVP v1, there is a single unified operator role. Team management and sub-roles are not available.

### 2.4. Administrator

**Access Level:** Full system access

**Who They Are:**
- Platform administrators
- System moderators
- Support staff with elevated permissions

**What They Get Beyond Operator Access:**
- Content moderation tools
- User and operator management
- System configuration access
- Platform-wide analytics
- Log review capabilities

---

## 3. User Capabilities (MVP v1)

This section describes what registered users can do on the platform.

### 3.1. Search & Discovery

**Location-Based Search:**
Users can search for warehouses by entering a location (city, district, or address). The system provides autocomplete suggestions and filters results based on proximity.

**Filtering Options:**
- Price range (monthly rental cost)
- Box size categories (S, M, L, XL)
- Warehouse features (24/7 access, video surveillance, climate control, parking)
- Additional services (packing materials, delivery, insurance)

**Sorting Options:**
- Price (low to high or high to low)
- Rating (highest first)
- Distance (nearest first)
- Availability (most available boxes first)

**Map View:**
Users can view warehouses on an interactive map, with clustering for areas with multiple locations. Selecting a marker shows warehouse summary information.

### 3.2. AI Box Finder

Users can describe what items they need to store (for example: "sofa, bed, 10 boxes of books") and receive an AI-powered recommendation for the appropriate box size.

**How It Works:**
- User provides a description of items
- AI analyzes the volume and space requirements
- System recommends one or more suitable box sizes
- User sees reasoning behind the recommendation
- Alternative sizes are suggested if available

**Fallback Behavior:**
If the AI service is temporarily unavailable, the system provides rule-based recommendations based on common storage scenarios.

### 3.3. Viewing Warehouse Information

Users can view comprehensive information about any warehouse:

**Basic Information:**
- Name, location, and contact details
- Photo gallery with main and additional images
- Operating hours and access rules
- Available amenities and security features
- Overall rating and review count

**Box Availability:**
- List of available box sizes
- Dimensions (length, width, height, area)
- Monthly rental prices
- Current availability (number of boxes)
- Size category labels (S, M, L, XL)

**Customer Reviews:**
- Ratings from previous customers
- Written reviews with dates
- Average rating calculation
- Number of reviews submitted

### 3.4. Favorites Management

Users can save warehouses to their favorites list for easy access later. This allows comparison and quick return to interesting options without searching again.

**Capabilities:**
- Add warehouse to favorites from any listing or detail page
- Remove warehouse from favorites
- View all saved warehouses in favorites section
- Favorites persist across sessions

### 3.5. Booking Requests

Users can create booking requests for available storage boxes.

**Booking Process:**
1. User selects a warehouse and specific box
2. User chooses rental start date and duration (in months)
3. System calculates total price based on monthly rate and duration
4. User provides contact information and any special requirements
5. System creates booking request with "pending" status

**Important:** Bookings require operator confirmation. Users cannot directly reserve boxes—they submit requests that operators must approve.

**Booking Information Collected:**
- Selected box and warehouse
- Desired start date
- Rental duration (minimum 1 month)
- Contact phone number
- Optional notes or special requests

### 3.6. Managing Bookings

Users can view and manage their booking requests through a personal dashboard.

**Booking Dashboard Shows:**
- All booking requests (pending, confirmed, active, cancelled, completed)
- Booking reference numbers
- Warehouse and box details
- Rental period and pricing
- Current status
- Operator contact information

**Available Actions:**
- View detailed booking information
- Cancel pending or confirmed bookings (with reason)
- View cancellation reasons if operator declined a request

**Status Meanings:**
- **Pending:** Waiting for operator confirmation
- **Confirmed:** Operator approved; booking will start on scheduled date
- **Active:** Currently renting; storage period in progress
- **Cancelled:** Booking was cancelled (by user or operator)
- **Completed:** Rental period ended; box returned

**Cancellation Rules:**
- Users can cancel pending bookings anytime
- Users can cancel confirmed bookings before start date
- Users cannot cancel active bookings (must contact operator)

### 3.7. Writing Reviews

After a booking is completed, users can write a review for the warehouse.

**Review Capabilities:**
- Submit rating (1 to 5 stars)
- Write text review describing experience
- Reviews appear publicly on warehouse detail pages
- Users can review only after completing a booking at that warehouse

**Review Guidelines:**
Reviews should be honest assessments based on actual experience. The platform does not allow multiple reviews per booking.

### 3.8. Profile Management

Users can view and update their personal information:

**Editable Information:**
- Full name
- Phone number
- Email address (requires verification if changed)
- Password

**Account Actions:**
- View account creation date
- Review email verification status
- Request password reset
- Access booking history

---

## 4. Operator Capabilities (MVP v1)

This section describes what operators can do on the platform.

### 4.1. Operator Onboarding & Verification

**Registration Process:**

New operators complete a multi-step registration:

1. **Initial Registration:**
   - Provide email, password, name, phone
   - Submit company name and tax identification number (INN)
   - Agree to terms of service and privacy policy
   - Receive operator account with "pending" status

2. **Profile Completion:**
   - Submit legal company information (registration details, legal form)
   - Provide bank account details for future payments
   - Upload required documents (tax certificates, registration documents, charter)
   - Designate contact person for platform communications

3. **Verification:**
   - Platform administrators review submitted documents
   - Verification process varies based on document completeness
   - Upon approval, account status changes to "active"
   - Operator can then create warehouses

**Account Statuses:**
- **Pending Verification:** Documents submitted; awaiting admin review
- **Active:** Verified and operational; can manage warehouses
- **Suspended:** Temporarily disabled (policy violations, payment issues)

### 4.2. Operator Dashboard

Operators access a dedicated dashboard showing key business metrics.

**Available Metrics (MVP v1):**
- Number of pending booking requests
- Number of active bookings
- Total warehouses managed
- Total boxes across all warehouses
- Number of rented boxes
- Occupancy rate

**Important Limitation:** Revenue tracking, financial analytics, and trend analysis are not available in MVP v1.

### 4.3. Warehouse Management

Operators can create and manage their warehouse listings.

**Creating a Warehouse:**

Operators provide:
- Warehouse name and description
- Full address with coordinates
- Contact phone and email
- Operating hours and access rules
- Photo gallery (minimum 1 photo required)
- Features and amenities (24/7 access, security, climate control, parking, etc.)
- Available services (packing materials, delivery, insurance, etc.)

**Warehouse Statuses:**
- **Draft:** Being edited; not visible to users
- **Published:** Live and visible in public search results
- **Archived:** Hidden from search but data preserved

**Editing Warehouses:**
Operators can update any warehouse information at any time. Changes to published warehouses take effect immediately.

**Publishing Rules:**
To publish a warehouse, operators must:
- Complete all required fields
- Upload at least one photo
- Add at least one box to the inventory
- Have an "active" operator account status

### 4.4. Box Inventory Management

Operators define the storage boxes available at each warehouse.

**Creating Boxes:**

For each box, operators specify:
- Dimensions (length, width, height in meters)
- Size category (S, M, L, XL) - auto-assigned based on area
- Monthly rental price
- Quantity available (number of identical boxes)
- Optional description or notes

**System Calculations:**
The system calculates floor area, volume, and assigns size categories based on dimensions provided.

**Size Categories:**
- **S (Small):** Small storage spaces
- **M (Medium):** Medium-sized storage spaces
- **L (Large):** Large storage spaces
- **XL (Extra Large):** Extra-large storage spaces

**Editing Boxes:**
Operators can update prices, quantities, and dimensions. Changes affect new bookings immediately but don't impact existing active bookings.

**Removing Boxes:**
Boxes can only be removed if they have no active bookings. Boxes with booking history are archived rather than deleted.

### 4.5. Booking Request Management

Operators receive and process booking requests from users.

**Booking Request List:**
Operators see all booking requests for their warehouses, with filtering by status:
- Pending requests requiring action
- Confirmed bookings
- Active rentals
- Cancelled and completed bookings

**Request Information Includes:**
- User name and contact details
- Requested box and warehouse
- Desired start date and duration
- Total estimated price
- Any special notes from the user
- Request submission timestamp

**Processing Actions:**

**Confirming a Request:**
- Operator reviews request details
- If accepting, operator confirms the booking
- Status changes to "confirmed"
- User receives notification
- Box availability count decreases by 1

**Declining a Request:**
- Operator selects cancellation option
- Must provide reason for declination
- Status changes to "cancelled"
- Reason is stored and visible to user
- Box availability is not affected

**Common Declination Reasons:**
- Box already booked by another customer
- Requested dates unavailable
- Unable to accommodate special requirements
- Facility maintenance scheduled

### 4.6. Viewing Active Bookings

Operators can view all currently active rentals across their warehouses.

**Active Booking Information:**
- Customer name and contact
- Box and warehouse location
- Rental start and end dates
- Remaining rental time
- Total price and payment status (not processed in MVP v1)
- Booking reference number

**Available Actions:**
- View full booking details
- Contact customer using provided information
- View booking history and changes

**Important:** Payment processing and financial management are not available in MVP v1. Operators handle payments through external arrangements.

### 4.7. Customer Communication

**Contact Information Access:**
Once a booking is confirmed, operators can access:
- Customer full name
- Phone number
- Email address
- Special notes or requirements

**Communication Channels:**
Operators contact customers directly using:
- Phone calls
- Email
- In-person at facility

**Platform Communication:**
The platform sends automated notifications for:
- Booking request received
- Booking confirmed
- Booking cancelled
- (Future: booking start reminders)

---

## 5. Shared Rules & Limitations

### 5.1. Permission Boundaries

**What Guests Cannot Do:**
- Create bookings
- Save favorites
- Write reviews
- Access personal data
- Contact operators through the platform

**What Users Cannot Do:**
- Manage warehouses or boxes
- Process booking requests
- View other users' personal information
- Access operator dashboard
- Bypass operator approval for bookings

**What Operators Cannot Do:**
- Modify bookings created by other operators
- Access warehouses they don't own
- View other operators' business metrics
- Process payments through the platform (MVP v1)
- Respond to reviews (MVP v1)

### 5.2. Data Visibility Rules

**Public Data (No Authentication Required):**
- Warehouse names, descriptions, photos
- Box sizes, prices, availability counts
- Operating hours and contact information
- Warehouse features and services
- Average ratings and review counts
- Review text and ratings

**Private Data (Authentication Required):**
- User full names, phone numbers, email addresses
- Booking details and history
- Favorite warehouse lists
- Personal profile information
- Specific booking request notes

**Operator-Only Data:**
- Customer contact information (only for confirmed bookings)
- Pending booking request details
- Business metrics (limited to own warehouses)
- Document uploads for verification

### 5.3. Booking Constraints

**Minimum Rental Period:** 1 month

**Booking Lead Time:** Bookings can start as early as the next day, subject to operator availability and confirmation.

**Maximum Concurrent Bookings:** Users can have multiple active bookings, but cannot book the same box twice simultaneously.

**Cancellation Windows:**
- Users can cancel pending bookings anytime without restriction
- Users can cancel confirmed bookings before start date
- Users cannot self-cancel active bookings (must contact operator)

**Confirmation Requirements:**
- All bookings require operator confirmation before becoming active
- Operators are encouraged to respond to requests promptly
- Unconfirmed requests remain "pending" until acted upon

### 5.4. System Limitations (MVP v1)

**Features NOT Available in MVP v1:**

**For Users:**
- Direct online payment processing
- Warehouse comparison side-by-side
- Contract generation and e-signing
- Real-time availability updates
- In-platform messaging with operators
- Automatic booking extensions or renewals
- Multiple booking in one transaction
- Discount codes or promotional pricing

**For Operators:**
- Online payment collection and management
- Revenue and financial analytics
- Team member invitations and role management
- Response to customer reviews
- Dynamic pricing or AI price recommendations
- Automated inventory management
- Booking calendar view
- Advanced reporting and exports
- Multi-facility dashboard aggregation

**Platform-Wide:**
- Mobile applications (iOS/Android)
- Multi-language support
- Real-time notifications (push, SMS for all events)
- AI-powered search with semantic understanding
- Automated contract generation
- Integration with external booking systems
- Warehouse comparison features

### 5.5. Data Accuracy Responsibility

**Operator Responsibilities:**
Operators are responsible for maintaining accurate information about:
- Warehouse availability and operating hours
- Box dimensions and pricing
- Feature descriptions and amenities
- Photo accuracy and recency
- Contact information

**Platform Responsibilities:**
The platform aims to provide:
- Accurate booking status tracking
- Price calculations based on operator inputs
- Search and filtering functionality
- Data security and privacy protection
- System uptime and performance

**User Responsibilities:**
Users are responsible for:
- Providing accurate contact information
- Timely response to operator communications
- Honest reviews based on actual experience
- Notifying operators of changes or issues

---

## 6. Error Handling & Support Expectations

### 6.1. Common Issues & Resolution

**Account Access Issues:**
- Forgotten password: Use password reset functionality
- Email not verified: Check spam folder or request new verification email
- Account locked: Contact platform support

**Booking Issues:**
- Request not confirmed: Contact operator directly using listed phone/email
- Cannot cancel booking: Review cancellation rules; contact operator if needed
- Incorrect pricing: Verify box details with operator

**Operator Issues:**
- Cannot publish warehouse: Ensure all required fields and photos are provided
- Verification delayed: Check document completeness and status
- Box not appearing: Verify warehouse is published and box quantity > 0

### 6.2. Support Channels

**User Support:**
- Platform support email for technical issues
- Direct operator contact for booking-related questions
- FAQ section for common questions

**Operator Support:**
- Dedicated operator support line
- Email support for verification and technical issues
- Onboarding assistance during initial setup

**Response Time Expectations:**
The platform aims to respond to support requests in a timely manner, with priority given to urgent technical issues and verification inquiries. Response times vary based on request type and current support volume.

### 6.3. Feedback & Improvement

Users and operators can provide feedback about platform functionality through:
- Review system (for warehouse-specific feedback)
- Support contact form (for platform suggestions)
- Operator dashboard feedback section

The platform team reviews feedback regularly to identify improvement opportunities for future releases.

---

## 7. Security & Privacy Awareness

### 7.1. User Data Protection

**What the Platform Protects:**
- Personal information (names, emails, phone numbers)
- Password data (encrypted and never visible)
- Booking history and preferences
- Payment information (when feature is released)
- Communication records

**How Data is Protected:**
The platform aims to protect data through:
- Encrypted connections for all data transmission
- Secure password storage using industry-standard methods
- Access control based on user roles and permissions
- Regular security audits and updates
- Data resilience measures

### 7.2. Privacy Commitments

**Data Sharing:**
- Personal data handling follows our privacy policy
- Contact information shared only between users and operators for confirmed bookings
- Aggregate data (anonymized) may be used for platform improvements
- Email addresses used only for platform communications

**Data Retention:**
- Active accounts: Data retained as per platform policy
- Deleted accounts: Personal data removed according to data retention policy (see DOC-036)
- Booking history: Retained for legal and operational requirements
- Reviews: Remain visible after account deletion (anonymized)

### 7.3. User Control & Rights

**What Users Can Control:**
- Profile information editing
- Email notification preferences (when available)
- Favorite warehouse list management
- Review visibility (can request removal)
- Account deletion (soft delete with data removal)

**What Users Can Request:**
- Export of personal data
- Correction of inaccurate information
- Deletion of account and associated data
- Review removal (subject to platform policies)

### 7.4. Operator Compliance

Operators must comply with:
- Accurate representation of facilities and services
- Honest communication with customers
- Respect for user privacy and data
- Fair treatment of all booking requests
- Timely response to user inquiries

Platform administrators monitor operator behavior and may suspend accounts for policy violations.

---

## 8. Non-Goals (Explicitly Out of Scope)

### 8.1. Features NOT in MVP v1

The following capabilities are explicitly excluded from the initial release and will not be available to users or operators:

**Advanced AI Features:**
- AI chatbot for customer support
- AI-powered price optimization
- Automated description generation for warehouses
- Smart search with natural language understanding

**Financial & Payment Features:**
- Online payment processing through the platform
- Automated invoicing and receipts
- Subscription or recurring billing
- Refund processing
- Payment dispute resolution
- Financial reporting and analytics

**Collaboration & Communication:**
- In-platform messaging system between users and operators
- Team management for operators
- Role delegation (owner, manager, staff)
- Shared operator accounts
- Multi-user warehouse management

**Advanced Booking Features:**
- Recurring bookings or auto-renewal
- Package deals or bulk discounts
- Promotional codes and special offers
- Booking insurance or protection plans
- Contract generation and digital signing
- Calendar integration
- Booking modification without cancellation

**Extended Analytics:**
- Revenue trends and forecasting
- Customer behavior analytics
- Market pricing comparisons
- Competitive analysis tools
- Conversion funnel analysis
- Detailed traffic statistics

**Mobile & Platform Extensions:**
- Native mobile applications (iOS/Android)
- Progressive web app (PWA) features
- Desktop applications
- Browser extensions
- API access for third-party integrations

**Enhanced User Experience:**
- Side-by-side warehouse comparison
- Augmented reality box visualization
- Virtual tours of warehouses
- Real-time availability updates
- Saved search alerts
- Personalized recommendations based on history

**Operator Tools:**
- Review response functionality
- Automated customer follow-ups
- Lead scoring and prioritization
- Advanced CRM features beyond basic lead tracking
- Bulk operations for box management
- Inventory import/export tools

### 8.2. Platform Scope Boundaries

**What This Platform Is:**
A marketplace connecting users seeking storage with operators offering warehouse space, with basic booking request management.

**What This Platform Is NOT:**
- A payment processor or financial service
- A property management system
- A legal contract generator
- A customer relationship management (CRM) suite
- A logistics or moving service coordinator
- An insurance provider
- A real-time inventory management system

---

## 9. Relationship to Other Documents

This document is aligned with and informed by the following canonical specifications:

### 9.1. Core Specifications

**Functional Specification (DOC-001):**
Defines complete product requirements, user stories, and acceptance criteria. This document summarizes user-facing aspects in plain language.

**Technical Architecture Document (DOC-002 / DOC-086):**
Describes system architecture and technical implementation. This document focuses on capabilities rather than technical details.

**API Detailed Specification (DOC-016):**
Defines all API endpoints, data structures, and technical contracts. This document describes user actions that trigger API calls.

### 9.2. Supporting Documents

**Frontend Architecture Specification (DOC-046):**
Defines user interface structure and components. This document describes what users can do, not how interfaces appear.

**Database Specification:**
Defines data models and relationships. This document describes data entities from user perspective.

**Security & Compliance Plan (DOC-078):**
Defines security measures and role-based access control. This document explains security from user perspective.

**Data Retention Policy (DOC-036):**
Defines data retention rules and timelines. This document references retention from user perspective.

**Operator Onboarding & Verification:**
Detailed operator registration and verification process. This document summarizes onboarding steps.

### 9.3. User-Focused Documents

**User Stories (DOC-090):**
Detailed acceptance criteria for each feature. This document provides high-level overview of those features.

**UX Flows (DOC-091):**
Detailed user interaction flows. This document describes capabilities without UI specifics.

### 9.4. Reading Order for Stakeholders

For non-technical stakeholders seeking to understand the platform:

1. **This document** - High-level capabilities overview
2. Functional Specification - Detailed feature descriptions
3. User Stories - Specific acceptance criteria
4. UX Flows - Visual workflow representations

For operators joining the platform:

1. **This document** - Capabilities and limitations
2. Operator Onboarding & Verification - Detailed registration process
3. Functional Specification - Complete feature set

For support teams:

1. **This document** - Capabilities and common issues
2. Error Handling Specification - Technical error resolution
3. User Stories - Expected behavior for features

---

## 10. Document Maintenance

### 10.1. Version Control

This document will be updated when:
- New features are added to MVP scope
- User or operator capabilities change
- Limitations or constraints are modified
- Security or privacy policies are updated

### 10.2. Change Tracking

All changes will be documented in the changelog at document start, including:
- Date of change
- Section affected
- Description of modification
- Reason for change

### 10.3. Feedback Process

Stakeholders can request clarifications or corrections by:
- Submitting questions through designated channels
- Providing feedback on unclear sections
- Reporting inconsistencies with other documents

---

## Appendix: Quick Reference

### User Actions by Role

| Action | Guest | User | Operator | Admin |
|--------|-------|------|----------|-------|
| Search warehouses | ✅ | ✅ | ✅ | ✅ |
| View warehouse details | ✅ | ✅ | ✅ | ✅ |
| Use AI Box Finder | ✅ | ✅ | ✅ | ✅ |
| Create booking | ❌ | ✅ | ✅ | ✅ |
| Save favorites | ❌ | ✅ | ✅ | ✅ |
| Write reviews | ❌ | ✅ | ✅ | ✅ |
| Manage warehouses | ❌ | ❌ | ✅ | ✅ |
| Process booking requests | ❌ | ❌ | ✅ | ✅ |
| View business metrics | ❌ | ❌ | ✅ | ✅ |
| Moderate content | ❌ | ❌ | ❌ | ✅ |
| Manage users | ❌ | ❌ | ❌ | ✅ |

### Common Booking Statuses

| Status | Meaning | User Actions | Operator Actions |
|--------|---------|--------------|------------------|
| Pending | Awaiting operator response | Cancel | Confirm or Decline |
| Confirmed | Approved, not yet started | Cancel | View details |
| Active | Currently renting | View only | Contact user |
| Cancelled | Booking terminated | View details | View details |
| Completed | Rental period ended | Write review | View history |

### Key Contact Points

**For Users:**
- Technical issues: Platform support
- Booking questions: Contact operator directly
- General inquiries: Support email

**For Operators:**
- Verification status: Operator support
- Technical assistance: Support line
- Platform questions: Support email

---

**End of Document**
