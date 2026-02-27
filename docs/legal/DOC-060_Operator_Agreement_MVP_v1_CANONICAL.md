# OPERATOR AGREEMENT (MVP v1)
## Self-Storage Aggregator Platform

**Document ID:** DOC-060
**Version:** 1.0 CANONICAL
**Status:** 🟢 Canonical — Master Agreement Template
**Date:** December 2025
**Phase:** MVP v1

---

## Document Role & Scope

### Document Status

**This is a Master Operator Agreement Template** — a jurisdiction-agnostic baseline establishing core commercial and operational terms between the Platform and Storage Operators.

### MVP v1 Limitations

**Platform Capabilities:**
- This agreement describes the intended relationship between Platform and Operator
- Specific capabilities are subject to platform technical availability and may be applied progressively
- Where technical functionality is not yet fully implemented, enforcement occurs manually or is deferred pending implementation
- SLA commitments, automated enforcement, and certain operational features are delivered as platform capabilities mature

**Jurisdiction & Legal Framework:**
- This template serves as a baseline for regional deployment
- Specific legal provisions, applicable law, dispute resolution mechanisms, and regulatory compliance requirements are defined in **Regional Addenda**
- Regional Addenda supersede this template where local law requires specific provisions

### Scope of Application

| Aspect | MVP v1 (This Template) |
|--------|------------------------|
| **Geographic Scope** | Region-agnostic baseline |
| **Legal Framework** | Template requiring regional addenda |
| **Platform Features** | Core MVP functionality as available |
| **Payment Processing** | Offline / outside platform (per MVP scope) |
| **Enforcement** | Manual or progressive automation |
| **Compliance** | Subject to regional requirements |

### References & Dependencies

This agreement must be read in conjunction with the following documents:

| Document | Relationship |
|----------|--------------|
| **DOC-059** | Multi-Country & Multi-Region Technical Architecture — defines regional deployment model |
| **DOC-097** | Payment & Billing Integration Architecture — describes payment abstraction framework |
| **DOC-106** | Trust & Safety Framework — governs rating, review, and enforcement principles |
| **DOC-092** | Warehouse Quality Score Algorithm — informs quality assessment approach |
| **DOC-054** | Legal Checklist & Compliance Requirements — defines compliance boundaries |
| **Regional Addendum** | Region-specific legal provisions (mandatory for production use) |

**Critical Note:** This Master Agreement Template MUST be supplemented with a Regional Addendum before use in any specific jurisdiction. The Regional Addendum defines:
- Applicable law and jurisdiction
- Data protection requirements
- Tax and payment provisions
- Dispute resolution mechanisms
- Local regulatory compliance

---

## 1. General Provisions

### 1.1. Parties to the Agreement

This Agreement (hereinafter referred to as the **"Agreement"**) is entered into between:

**Platform** — the operator of the Self-Storage Aggregator online platform, which provides aggregation of self-storage facility offerings and connects storage operators with potential customers,

and

**Operator** — a legal entity or individual entrepreneur engaged in providing storage services and wishing to list information about their facilities on the Platform.

### 1.2. Subject Matter of the Agreement

The subject matter of this Agreement is to establish the terms and conditions under which:

1. The Platform provides the Operator with access to software and technical services for listing information about storage facilities, units, and services, subject to platform technical availability;

2. The Platform aggregates demand for self-storage services, conducts search activities, and transmits inquiries from potential customers (Users) to the Operator;

3. The Operator undertakes to provide accurate information about their facilities, process received inquiries, and enter into storage contracts directly with Users;

4. The Parties define the procedures for interaction, Platform compensation, and allocation of responsibilities.

The Platform acts exclusively as a technology intermediary and information aggregator. The Platform is not a party to the storage contract between the Operator and User, does not provide storage services independently, and bears no responsibility for the Operator's actions or the quality of services provided by the Operator.

### 1.3. Acceptance of the Agreement

This Agreement constitutes a public offer in accordance with applicable law, as defined by the Regional Addendum.

Acceptance (full and unconditional agreement to the terms) of the Agreement by the Operator occurs through one of the following actions:

- completing the registration process on the Platform and creating an Operator Account;
- signing this Agreement in electronic or written form;
- actual commencement of use of Platform services, including posting information about facilities or receiving inquiries.

Acceptance means that the Operator:
- has familiarized themselves with the terms of this Agreement in full;
- agrees to comply with all terms of the Agreement;
- possesses the necessary rights and authority to enter into the Agreement and conduct storage service activities, as required by applicable local law.

---

## 2. Terms and Definitions

For purposes of this Agreement, the following terms and definitions apply:

### 2.1. Platform

**Platform** — the Self-Storage Aggregator software and technical complex, including the website, mobile applications, API, and other online services that provide aggregation of information about storage facilities, search for suitable offerings for Users, and transmission of inquiries to Operators.

### 2.2. Operator

**Operator** — a legal entity or individual entrepreneur managing one or more self-storage facilities, registered on the Platform, and listing information about their facilities and services to attract customers.

### 2.3. Facility / Property

**Facility** or **Property** — a physical building, structure, or territory equipped to provide self-storage services for customer belongings, managed by the Operator and represented on the Platform.

### 2.4. Unit / Storage Space

**Unit** or **Storage Space** — an individual storage unit (room, cell, container, pallet space, etc.) within a Facility, intended for rental by a User for the purpose of storing personal belongings or goods.

### 2.5. User

**User** — an individual or legal entity using the Platform to search for storage services and intending to enter into or having entered into a storage contract with the Operator.

### 2.6. Lead (Inquiry)

**Lead** (Inquiry) — an initial request from a User, submitted through the Platform, to receive information about storage terms or expressing interest in a specific Facility or Unit. A Lead contains the User's contact information and basic requirement parameters.

**Clarification:** A Lead is NOT a Confirmed Reservation until explicit agreement by both the Operator and User.

### 2.7. Confirmed Reservation

**Confirmed Reservation** — a confirmed agreement between the Operator and User regarding the reservation of a specific Unit for a defined period. A Confirmed Reservation occurs after the Operator's positive response to a Lead and confirmation of terms by the User.

### 2.8. Operator Account

**Operator Account** (hereinafter **"Account"**) — a protected section of the Platform providing the Operator with tools for:
- posting and editing information about Facilities and Units;
- managing prices, availability, and terms;
- receiving and processing Leads;
- viewing statistics and reports;
- communication with the Platform and Users.

### 2.9. Platform Commission

**Platform Commission** — compensation paid by the Operator to the Platform for services provided, including access to services, transmission of Leads, and support. The amount, calculation method, and payment terms of the Commission are determined in accordance with Section 6 of this Agreement and individual parameters established for the Operator in the Operator Account or in separate agreements, subject to regional addendum and applicable tax law.

---

## 3. Rights and Obligations of the Platform

### 3.1. Obligations of the Platform

The Platform undertakes to:

1. **Ensure service operation:**
   - Maintain the functioning of the website, mobile applications, and API with reasonable availability, making commercially reasonable efforts to ensure continuity of operation. Specific SLA parameters may be established by Regional Addendum, where supported by MVP functionality.
   - Conduct scheduled technical maintenance with advance notice to Operators, when technically feasible.

2. **Transmit Leads to the Operator:**
   - Transmit Leads received from Users for Unit rentals to the Operator through the Operator Account, email, or other agreed communication channels, subject to platform technical availability.
   - Ensure correct routing of Leads according to the Facility and Unit parameters specified by the Operator, where supported by platform functionality.

3. **Maintain the Operator Account:**
   - Provide the Operator with access to Operator Account functionality for managing information about Facilities, Units, prices, availability, and processing Leads.
   - Ensure basic technical support for Platform usage issues during business days within reasonable timeframes.

4. **Moderate content (as necessary):**
   - Review information posted by Operators for compliance with the requirements of Section 7 of this Agreement, where supported by platform capacity.
   - Provide recommendations for improving content quality.

5. **Ensure confidentiality:**
   - Comply with applicable personal data protection legislation requirements, as defined by Regional Addendum and applicable data protection law.
   - Not transfer the Operator's contact information to third parties without consent, except as required by law or this Agreement.

### 3.2. Rights of the Platform

The Platform has the right to:

1. **Moderate and control content:**
   - Review information posted by the Operator for compliance with the requirements of this Agreement, legislation, and internal quality standards.
   - Require the Operator to correct inaccurate, incomplete, or outdated information.
   - Reject or remove content violating the Agreement terms, including prohibited materials, misleading information, or content contrary to law.

2. **Suspend or restrict access:**
   - Temporarily or permanently suspend the Operator's access to the Platform upon detection of violations of this Agreement, including but not limited to:
     - provision of knowingly false information;
     - systematic ignoring of Leads;
     - receipt of User complaints regarding service quality or fraudulent actions;
     - violation of Commission payment obligations;
     - attempts to manipulate the system or violate security.
   - Enforcement of restrictions may occur manually or through automated means, subject to platform technical availability and alignment with Trust & Safety Framework (DOC-106).
   - Suspend display of the Operator's Facilities in search results in the presence of technical problems, complaints, or until identified discrepancies are resolved.

3. **Modify Platform functionality:**
   - Make changes to the interface, functionality, and Platform algorithms to improve service quality, security, or legislative compliance.
   - Add new features or discontinue support for outdated capabilities with notice to Operators within reasonable timeframes.

4. **Establish display priorities:**
   - Determine algorithms for ranking and displaying Facilities in search results based on various factors (relevance, content quality, rating, reviews, Platform interaction history, etc.), subject to platform technical implementation.
   - Not disclose the complete ranking algorithm to prevent manipulation.

5. **Collect and analyze data:**
   - Collect and process aggregated data about Platform operation, User behavior, and Operator effectiveness for purposes of improving the service, forming statistics and reports, in accordance with applicable data protection law.
   - Use anonymized data for analytics, research, and marketing.

6. **Request supporting documents:**
   - Require the Operator to provide documents confirming the right to conduct business, ownership or management of Facilities, and compliance with safety requirements, as may be required by applicable law or regulatory requirements.

---

## 4. Rights and Obligations of the Operator

### 4.1. Obligations of the Operator

The Operator undertakes to:

1. **Provide accurate information:**
   - Post complete, accurate, and current information on the Platform about their Facilities, Units, prices, rental terms, and availability.
   - Immediately update information when conditions change (prices, availability, Unit characteristics, etc.).
   - Not mislead Users regarding service characteristics, availability of vacant spaces, contract terms, or other material factors.

2. **Process Leads:**
   - Timely (within **24 hours** of receipt, or within the timeframe established by Regional Addendum) review incoming Leads from Users and provide a response (confirmation, clarification of terms, or reasoned refusal).
   - Observe professional communication standards, being polite, correct, and informative when communicating with Users.
   - Response time requirements are subject to platform technical availability for tracking and may be enforced progressively.

3. **Comply with terms of work with Users:**
   - Enter into storage contracts with Users on terms no less favorable than those indicated on the Platform.
   - Provide Users with services of appropriate quality in accordance with the description posted on the Platform and applicable consumer protection law.
   - Resolve disputes with Users in good faith, in accordance with legislation and the terms of the concluded storage contract.

4. **Pay Platform Commission:**
   - Timely and in full pay the Platform Commission in accordance with Section 6 of this Agreement.
   - Provide necessary documents for calculation and confirmation of the Commission, as required by Regional Addendum and applicable tax law.
   - Payment processing mechanisms are subject to regional payment infrastructure and may vary by region per DOC-097.

5. **Comply with applicable law:**
   - Conduct business in accordance with applicable law, including licensing (if required), compliance with fire safety standards, sanitary rules, and property storage requirements.
   - Ensure safety and security of User property in accordance with concluded storage contracts and applicable standards.

6. **Protect personal data:**
   - Process personal data of Users transmitted through the Platform exclusively for purposes of fulfilling storage contracts and in accordance with applicable data protection law.
   - Ensure confidentiality and security of personal data, not transfer to third parties without lawful grounds.
   - Enter into a Data Processing Agreement with the Platform, if required by Regional Addendum.

7. **Maintain facility quality:**
   - Ensure proper technical condition of Facilities and Units, including cleanliness, functioning of security systems, climate control (if stated), and access.
   - Remedy identified deficiencies within reasonable timeframes.

### 4.2. Rights of the Operator

The Operator has the right to:

1. **Use Platform services:**
   - Receive access to the Operator Account and use the provided tools for managing their Facilities and processing Leads.
   - Receive statistics and analytics on the operation of their Facilities, where supported by platform functionality.

2. **Receive Leads:**
   - Receive Leads from interested Users from the Platform in accordance with the settings and parameters specified by the Operator.

3. **Independently determine terms:**
   - Set prices for Unit rentals in accordance with market conditions and their own strategy, subject to applicable pricing regulations.
   - Determine minimum and maximum rental periods, deposit amount, additional services and their provision terms, within framework defined by applicable law.

4. **Refuse to enter into a contract:**
   - Refuse a User entry into a storage contract with reasonable cause (for example, absence of vacant spaces, mismatch between required conditions and Facility capabilities, incompleteness of provided data), in accordance with applicable non-discrimination law.

5. **Request support:**
   - Contact Platform support regarding technical, operational, and commercial issues.
   - Receive consultations on using Platform functionality.

6. **Receive information:**
   - Be informed of changes in Platform functionality, Agreement terms, ranking algorithms (in general form, without disclosure of details), and other material issues.

---

## 5. Ratings, Reviews, and Reputation

### 5.1. Rating System

The Platform may implement an Operator rating system based on User reviews, Lead processing statistics, number of Confirmed Reservations, and other quality performance indicators.

**MVP v1 Note:** Rating and reputation systems are subject to platform technical availability and may be applied progressively as platform capabilities mature. Implementation aligns with Trust & Safety Framework (DOC-106) and Quality Score Algorithm principles (DOC-092).

**Application of ratings:**
- Ratings may be used for ranking Facilities in search results, where supported by platform functionality.
- A low rating may result in reduced visibility of the Operator's Facilities or temporary access restriction, subject to Trust & Safety Framework enforcement mechanisms.

### 5.2. User Reviews

Users may leave reviews about working with the Operator after completion or during the rental period, where supported by platform functionality.

**Review moderation rules:**
- The Platform reserves the right to moderate reviews, removing those containing profanity, defamation, personal data of third parties, or violating Platform usage terms.
- The Operator has the right to respond to reviews, provide explanations and comments, where supported by platform functionality.

### 5.3. Quality Indicators

The Platform may consider the following indicators when assessing the quality of the Operator's work (subject to platform technical availability):

- **Lead response speed:** Average time from Lead receipt to Operator response.
- **Percentage of Confirmed Reservations:** Share of Leads for which the Operator confirmed a reservation.
- **Information currency:** Frequency of updates to prices, availability, and Facility characteristics.
- **User complaints:** Number and nature of complaints received about the Operator.
- **Cancellations and refusals:** Frequency of reservation cancellations or service refusals without reasonable cause.

**MVP v1 Note:** Measurement and enforcement of quality metrics are implemented progressively as platform analytics capabilities mature, in alignment with DOC-014 (Analytics & Metrics Tracking).

---

## 6. Commission and Payment Terms

### 6.1. Commission Model

The Platform receives compensation from Operators in the form of a Commission for services provided.

**Possible commission models (determined individually and/or in Regional Addendum):**

1. **Lead-based Commission:**
   - The Operator pays a fixed amount for each transmitted Lead from a User, regardless of whether a storage contract is concluded.

2. **Booking-based Commission:**
   - The Operator pays a percentage or fixed amount for each Confirmed Reservation.

3. **Revenue share Commission:**
   - The Operator pays a percentage of the cost of storage services provided (for example, a percentage of rental payment for the storage period), where supported by regional payment infrastructure per DOC-097.

4. **Subscription:**
   - The Operator pays a fixed monthly or annual fee for access to the Platform regardless of the number of Leads or Reservations.

5. **Hybrid model:**
   - A combination of the above models (for example, basic subscription + reservation commission).

**MVP v1 Note:**
- Specific commission model and payment mechanics are defined in Regional Addendum
- Payment collection and invoicing capabilities are subject to regional payment infrastructure availability per DOC-097
- Billing automation is implemented progressively as platform capabilities mature

### 6.2. Commission Amount

The specific Commission amount is determined individually for each Operator and may depend on:

- the chosen commission model;
- volume of Leads and reservations;
- category and location of Facilities;
- level of service and support provided by the Platform;
- regional market conditions, as defined by Regional Addendum;
- active promotions and special terms.

The Commission amount is indicated in the Operator Account or in a separate additional agreement.

### 6.3. Calculation and Payment Procedure

1. **Billing period:**
   - The Commission is calculated for the reporting period (for example, calendar month), unless otherwise specified in Regional Addendum.

2. **Report generation:**
   - At the end of the reporting period, the Platform generates a report indicating the number of transmitted Leads, Confirmed Reservations, and amounts payable, where supported by platform functionality.
   - The report is provided to the Operator through the Operator Account or by email.

3. **Invoice issuance:**
   - Based on the report, the Platform issues an Invoice to the Operator for payment of the Commission, subject to regional invoicing requirements.

4. **Payment terms:**
   - The Operator undertakes to pay the invoice within **[specify period, for example: 10 calendar days]** from the invoice date, or as specified in Regional Addendum.

5. **Payment methods:**
   - Payment is made by bank transfer, through regional payment infrastructure, or by other methods agreed by the Parties and available in the region per DOC-097.

6. **Taxes and fees:**
   - All applicable taxes, fees, and duties are paid by the Parties in accordance with applicable tax law, as defined in Regional Addendum.
   - The Commission is indicated [with VAT / without VAT / as applicable], as required by regional tax regulations.

**MVP v1 Note:** Payment processing, invoicing automation, and tax calculation are subject to regional capabilities and may be implemented manually or semi-automatically during MVP phase.

### 6.4. Consequences of Non-Payment

1. **Notification:**
   - In case of non-payment of the invoice within the established timeframe, the Platform sends the Operator a reminder indicating the amount of debt and payment deadline.

2. **Access restriction:**
   - In case of non-payment within **[specify period, for example: 5 business days]** after the reminder, the Platform has the right to restrict or suspend the Operator's access to services, including cessation of transmission of new Leads and hiding Facilities from search results, subject to platform technical availability for enforcement.

3. **Agreement termination:**
   - In case of systematic non-payment (delay of more than **[specify period]** or non-payment of **[specify number]** invoices in a row), the Platform has the right to terminate the Agreement unilaterally with notice to the Operator.

4. **Debt collection:**
   - The Platform has the right to collect debt in the manner prescribed by applicable law, as defined in Regional Addendum.

---

## 7. Content and Information Requirements

### 7.1. General Requirements

All information posted by the Operator on the Platform must:

- be **accurate, complete, and current**;
- correspond to the actual condition of Facilities and Units;
- not mislead Users regarding characteristics, terms, prices, and availability;
- comply with applicable law requirements, including consumer protection and advertising regulations.

### 7.2. Photographs and Visual Materials

- Photographs must correspond to the actual condition of Facilities and Units at the time of publication.
- It is prohibited to use third-party photographs, images from the internet not related to the Facility, or substantially modified (filters, retouching) images distorting reality.
- Photographs must not contain personal data of third parties (faces of people, vehicle numbers, etc.) without their consent, as required by applicable data protection law.

### 7.3. Service Description

- The description must be clear, informative, and not contain false or misleading information.
- It is necessary to indicate all material terms: Unit sizes, access type, availability of climate control, security, insurance, additional services, etc.
- It is prohibited to use wording guaranteeing absolute safety, complete absence of risks, or promising impossible conditions.

### 7.4. Prohibited Content

The Operator is prohibited from posting on the Platform:

- Inaccurate, knowingly false, or misleading information.
- Content violating third-party rights (copyrights, trademarks, patents, etc.).
- Content containing profanity, insults, threats, discrimination on any basis.
- Content promoting violence, extremism, terrorism, illegal activities.
- Spam, advertising of third-party resources or services not related to the subject of the Agreement.
- Personal data of third parties without their consent, in violation of applicable data protection law.
- Content violating applicable law or generally accepted moral standards.

### 7.5. Content Responsibility

The Operator bears full responsibility for posted content. The Platform does not verify all information before publication but reserves the right to moderate content and require corrections or remove violating materials, where supported by platform moderation capacity.

---

## 8. Confidentiality and Data Protection

### 8.1. Personal Data Processing

Processing of personal data of Users and Operators is carried out in accordance with:

- The Platform's Privacy Policy;
- Applicable data protection law, as defined in Regional Addendum;
- Data Processing Agreement, if required by Regional Addendum.

### 8.2. Roles of the Parties

- **Platform** acts as a data controller for data collected in the process of Platform operation.
- **Operator** acts as a data controller for User data received when entering into and performing storage contracts.

Personal data processing in the context of Platform and Operator interaction is governed by a separate Data Processing Agreement (DPA), where required by applicable data protection law.

### 8.3. Data Protection Obligations

Both Parties undertake to:

- Process personal data exclusively for purposes established by this Agreement and applicable law.
- Ensure confidentiality and security of personal data.
- Not transfer personal data to third parties without lawful grounds or consent of data subjects.
- Notify the other Party of cases of leakage or unauthorized access to personal data within the timeframe established by applicable data protection law (for example, within **24-72 hours**).
- Comply with data subject rights (access, correction, deletion, portability, etc.) in accordance with applicable data protection law.

---

## 9. Liability of the Parties

### 9.1. Platform Liability

The Platform bears responsibility for:

- Ensuring functionality of its services within reasonable availability, subject to MVP technical capabilities and applicable SLA if defined in Regional Addendum.
- Security of personal data processed by the Platform, in accordance with applicable data protection law.
- Compliance with the terms of this Agreement in respect of its obligations.

**Limitation of liability:**

The Platform is NOT liable for:

- Actions or omissions of Operators, quality of storage services provided by them, safety of stored property, or compliance with contracts between Operators and Users.
- Losses of Operators related to changes in Platform functionality, ranking algorithms, cessation of individual services, or temporary technical failures.
- Lost profits of the Operator, failure to receive the expected number of Leads or reservations.
- Actions of third parties (hackers, DDoS attacks, internet provider failures) beyond the Platform's control.
- Errors or inaccuracies in information provided by the Operator.
- Disputes between the Operator and User.

The Platform's aggregate liability to the Operator for all claims arising in connection with performance of this Agreement is limited to an amount equivalent to the Commission paid by the Operator for the last **[specify period, for example: 3 months]**, or as defined in Regional Addendum.

### 9.2. Operator Liability

The Operator bears responsibility for:

- Accuracy and currency of information posted on the Platform.
- Quality of storage services provided and performance of contracts with Users in accordance with applicable consumer protection law.
- Compliance with applicable law when conducting business, including licensing, safety regulations, and compliance requirements.
- Protection of personal data of Users received in the process of interaction, in accordance with applicable data protection law.
- Timely payment of Platform Commission.

The Operator undertakes to compensate the Platform for losses caused by violation of the terms of this Agreement, including fines and sanctions imposed on the Platform as a result of the Operator's actions, subject to applicable liability limitations and dispute resolution procedures defined in Regional Addendum.

### 9.3. Indemnification

The Operator undertakes to defend, indemnify, and hold harmless the Platform, its affiliates, directors, employees, and partners from any claims, lawsuits, losses, liabilities, costs, and expenses (including reasonable legal costs) arising from or in connection with:

- the Operator's violation of the terms of this Agreement;
- the Operator's violation of third-party rights (intellectual property, personal data, etc.);
- provision of inaccurate information by the Operator;
- disputes between the Operator and Users;
- the Operator's violation of applicable law.

Indemnification provisions are subject to limitations and procedures defined in Regional Addendum and applicable law.

---

## 10. Term and Termination of the Agreement

### 10.1. Term

This Agreement enters into force from the moment of acceptance (Section 1.3) and remains in effect indefinitely until terminated by one of the Parties in accordance with the terms of this section.

### 10.2. Termination by the Operator

The Operator has the right to terminate the Agreement at any time by sending written notice to the Platform **[specify period, for example: 30 calendar days]** before the proposed termination date, or as defined in Regional Addendum.

Termination of the Agreement at the initiative of the Operator does not release them from obligations to pay the Commission accrued before the termination date.

### 10.3. Termination by the Platform

The Platform has the right to terminate the Agreement:

1. **With notice:**
   - In the absence of violations by the Operator, the Platform has the right to terminate the Agreement by notifying the Operator **[specify period]** in advance, or as defined in Regional Addendum.

2. **Without notice (immediate termination):**
   - In case of material breach by the Operator of the Agreement terms, including:
     - systematic provision of inaccurate information;
     - gross violation of User rights, fraudulent actions;
     - non-payment of Commission within **[specify period]** after the last reminder;
     - commission of actions damaging the Platform's reputation;
     - violation of applicable law, in violation of regulatory requirements.

### 10.4. Consequences of Termination

Upon termination of the Agreement:

- The Operator loses access to the Operator Account and Platform services.
- Information about the Operator's Facilities is removed from search results and the Platform catalog.
- Transmission of new Leads to the Operator ceases.
- The Operator must complete processing of previously received Leads and fulfill obligations to Users with whom storage contracts were concluded.
- The Operator's financial obligations to pay the Commission remain until full repayment of debt.
- Positive resolution of pending disputes and final settlement obligations are governed by Regional Addendum.

---

## 11. Modification of Agreement Terms

### 11.1. Platform's Right to Modify

The Platform reserves the right to modify the terms of this Agreement unilaterally.

### 11.2. Notice of Modifications

The Platform notifies Operators of Agreement modifications by one of the following methods:

- publication of a new version of the Agreement on the Platform's official website;
- sending a notification to the Operator Account;
- sending a notification to the email specified during registration.

Modifications enter into force no earlier than **[specify period, for example: 14 calendar days]** from the moment of notification, unless a different period is indicated in the notification, or as required by Regional Addendum.

### 11.3. Operator's Consent

Continued use of the Platform after modifications enter into force means the Operator's consent to the new version of the Agreement.

If the Operator does not agree with the modifications, they must cease using the Platform and terminate the Agreement in accordance with Section 10.2 before the modifications enter into force.

---

## 12. Dispute Resolution and Applicable Law

### 12.1. Applicable Law

This Agreement is governed by and interpreted in accordance with **[applicable law as defined by Regional Addendum]**.

**Important Note:** This Master Agreement Template MUST be supplemented with a Regional Addendum that defines:
- Specific governing law and jurisdiction
- Dispute resolution procedures (negotiation, mediation, arbitration, courts)
- Applicable regulatory framework
- Tax treatment and payment provisions

### 12.2. Pre-Litigation Procedure

The Parties undertake to comply with a pre-litigation dispute resolution procedure, as required by applicable law or defined in Regional Addendum.

A claim is sent in written form (including email).

Claim consideration period: **[specify period]**, or as defined in Regional Addendum.

### 12.3. Judicial Procedure

In case of impossibility of resolving the dispute through pre-litigation procedure, disputes are resolved in **[applicable court/arbitration as defined by Regional Addendum]**.

### 12.4. Multi-National Operators

For Operators registered in different countries, applicable law and jurisdiction are determined by Regional Addendum with consideration of international private law principles and conflict of laws rules.

---

## 13. Final Provisions

### 13.1. Entire Agreement

1. **Comprehensive regulation:**
   - This Agreement, including Regional Addendum, appendices, additional agreements, and documents referenced by the Agreement (Privacy Policy, Content Guidelines, DPA, etc.), constitutes the complete agreement between the Parties regarding the subject matter of the Agreement.

2. **Cancellation of previous arrangements:**
   - This Agreement replaces and cancels all previous oral and written arrangements, agreements, correspondence, and negotiations between the Parties on matters governed by the Agreement.

3. **Interpretation:**
   - In case of ambiguity or contradiction between provisions of the Master Agreement Template and Regional Addendum, the Regional Addendum takes precedence for region-specific matters.

### 13.2. Priority Over Correspondence

1. **Official documents:**
   - The terms of this Agreement and Regional Addendum take priority over any informal correspondence between the Parties (email, chat messages, oral arrangements), unless otherwise formalized by a written additional agreement signed by authorized representatives of both Parties.

2. **Modifications and additions:**
   - Any modifications, additions, or deviations from the terms of this Agreement are valid only if they:
     - are formalized in written form (including electronic document flow with electronic signature, as recognized by applicable law);
     - are signed by authorized representatives of both Parties;
     - or are made in accordance with Section 11 (modification of the Agreement by the Platform unilaterally).

3. **Invalidity of oral arrangements:**
   - Oral assurances, promises, or arrangements made by Party representatives have no legal force if not confirmed in writing in the established manner.

### 13.3. Modification of Terms by the Platform

1. **Right of unilateral modification:**
   - The Platform retains the right to modify the terms of this Agreement unilaterally in accordance with the procedure established in Section 11.

2. **Operator notification:**
   - All modifications are brought to the attention of Operators by publication of a new version of the Agreement on the Platform's official website and/or sending notification to the Operator Account and Operator's email.
   - The date of entry into force of modifications is the date indicated in the notification, but not earlier than expiration of the notification period provided in Section 11, or as required by Regional Addendum.

3. **Continued use:**
   - Continued use of the Platform by the Operator after modifications enter into force means consent to the new version of the Agreement.
   - If the Operator does not agree with the modifications, they must cease using the Platform and terminate the Agreement before the modifications enter into force.

4. **Preservation of obligations:**
   - Modification of Agreement terms does not affect obligations arising before modifications enter into force, unless otherwise provided in the modification notification.

### 13.4. Invalidity of Individual Provisions

1. **Preservation of Agreement validity:**
   - In case any provision of this Agreement is found to be invalid, illegal, or without legal force under applicable law as determined by competent authority, such finding does not entail invalidity of the Agreement as a whole.

2. **Replacement of invalid provision:**
   - The invalid provision is replaced by a provision that:
     - is valid and lawful under applicable law;
     - is as close as possible in meaning and economic effect to the original intention of the Parties.

3. **Obligation to negotiate:**
   - The Parties undertake to negotiate in good faith to agree on replacement of the invalid provision within a reasonable timeframe.

### 13.5. Assignment of Rights and Obligations

1. **Prohibition of assignment by Operator:**
   - The Operator may not transfer (assign) their rights and obligations under this Agreement to third parties without prior written consent of the Platform.

2. **Platform's right:**
   - The Platform has the right to transfer its rights and obligations under this Agreement to affiliates, successors, or third parties, notifying the Operator.

3. **Business transfer:**
   - In case of reorganization of the Platform (merger, accession, spin-off, transformation) or business sale, rights and obligations under this Agreement pass to the successor.

### 13.6. Agreement Language

1. **Primary language:**
   - This Master Agreement Template is drafted in English.
   - Regional Addendum may be provided in local language as required by applicable law.
   - In case of translation of the Agreement into other languages, in case of discrepancy between versions, priority is determined by Regional Addendum or applicable law.

2. **Translations for localization:**
   - The Platform may provide translations of the Agreement into Operators' languages for convenience. Legally binding language version is defined in Regional Addendum.

### 13.7. Contact Information

**To contact the Platform:**
- Official website: [specify URL]
- Email for official correspondence: [specify email]
- Support service: [specify support channel]
- Legal address: [specified in Regional Addendum]

**For the Operator:**
- Contact information is indicated in the Operator Account and registration data.

### 13.8. Electronic Document Flow

1. **Recognition of legal force:**
   - The Parties recognize the legal force of electronic documents signed with electronic signature, in accordance with applicable electronic signature law as defined in Regional Addendum.

2. **Acts and reports:**
   - Acts of services rendered, reports, invoices, and other documents may be generated and signed electronically through the Operator Account or electronic document flow system, where supported by platform functionality.

3. **Equivalence of forms:**
   - Electronic documents have equal legal force with paper documents, subject to applicable electronic signature law requirements.

### 13.9. Force Majeure

1. **Circumstances of force majeure:**
   - The Parties are released from liability for partial or complete non-performance of obligations under the Agreement if it resulted from force majeure circumstances arising after conclusion of the Agreement.

2. **Concept of force majeure:**
   - Force majeure circumstances include: natural disasters, military actions, acts of terrorism, epidemics and pandemics, strikes, actions of government authorities making performance of obligations impossible, and other circumstances beyond the Parties' control, as defined by applicable law.

3. **Notification:**
   - The Party for which performance of obligations has become impossible must immediately (within **[specify period, or as defined in Regional Addendum]**) notify the other Party of the occurrence and cessation of force majeure circumstances.

4. **Consequences:**
   - If force majeure circumstances continue for more than **[specify period, or as defined in Regional Addendum]**, either Party has the right to terminate the Agreement unilaterally by written notice to the other Party.

### 13.10. Conclusion

This Agreement reflects the mutual intention of the Parties to build long-term and mutually beneficial cooperation on principles of good faith, transparency, and professionalism.

The Platform undertakes to provide quality services to assist Operators in attracting customers, subject to technical capabilities and progressive implementation of platform features, and the Operator — to ensure a high level of storage services and responsible approach to working with Users.

By accepting this Agreement, the Operator confirms:
- full understanding and agreement with all terms of the Agreement and applicable Regional Addendum;
- possession of necessary rights and authority to enter into the Agreement as required by applicable law;
- readiness to conscientiously fulfill accepted obligations.

---

## Appendix A: Regional Requirements (Regional Addendum Framework)

**Mandatory supplement to this Agreement**

For application of this Master Agreement Template in a specific jurisdiction, a Regional Addendum is MANDATORY, which defines:

### A.1. Legal Parameters

- **Applicable Law:** Specific legislation governing the agreement
- **Jurisdiction:** Courts or arbitration bodies competent to resolve disputes
- **Dispute Resolution Procedure:** Claims procedure, mediation, arbitration
- **Electronic Signature:** Requirements for electronic signatures in the region

### A.2. Compliance and Data Protection

- **Data Protection:** Applicable personal data protection requirements (GDPR, UAE PDPL, etc.)
- **DPA Requirements:** Necessity and form of Data Processing Agreement
- **Cookie Consent:** Requirements for consent to use of cookies
- **User Rights:** Procedures for implementing data subject rights

### A.3. Tax and Payment Terms

- **Taxation:** VAT, income tax, withholding tax
- **Currency:** Settlement currency and conversion rates
- **Payment Methods:** Available payment methods in the region (per DOC-097)
- **Invoicing:** Requirements for invoices and reporting

### A.4. Operational Parameters

- **Response Times:** Regional response time standards
- **Support Hours:** Support operating hours considering time zone
- **Language:** Official language of agreement and communications
- **Local Regulations:** Specific regional requirements (licensing, certification, etc.)

### A.5. Limitations and Exclusions

- **Liability Caps:** Liability limitations in accordance with local law
- **Indemnification Limits:** Limitations on indemnification obligations
- **Force Majeure:** Regional interpretation of force majeure circumstances

**Without Regional Addendum, this Master Agreement Template cannot be applied for operational activities.**

---

**END OF DOCUMENT**

---

**Version:** MVP v1.0 CANONICAL
**Status:** Master Agreement Template — Requires Regional Addendum
**Last Updated:** December 2025
**Next Review:** Quarterly or upon regulatory change

---

## Document Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 CANONICAL | December 2025 | Legal & Architecture Team | Hardened to canonical status: Added Document Role & Scope, abstracted jurisdiction, added MVP limitations, progressive enforcement language, term clarification (Lead vs Confirmed Reservation), References & Dependencies, Regional Addendum framework |

---
