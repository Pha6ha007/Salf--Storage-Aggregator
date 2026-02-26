# DOC-068: Photo Quality Scoring Engine — Deep Tech Specification

**Self-Storage Aggregator Platform**

---

## Document Status

> **Document Role**: 🟡 Deep Tech Specification | Supporting / Non-Canonical  
> **Covers**: MVP v1 (Foundational) + Post-MVP / v2 (Exploratory)  
> **Production Mandatory**: ❌ No  
> **Phase**: MVP v1 section is limited & foundational | v2 section is non-binding & forward-looking  
> **Last Updated**: December 17, 2025
>
> **CRITICAL**: This document describes photo quality assessment mechanisms.  
> - **MVP v1** section defines basic, rule-based validation with human oversight  
> - **Post-MVP / v2** section is exploratory research, NOT a commitment  
> - Photo scores are INPUTS to moderation, NEVER autonomous enforcement  
> - Final moderation decisions governed by DOC-099 & DOC-106

---

## Document Information

| Field | Value |
|-------|-------|
| **Document ID** | DOC-068 |
| **Title** | Photo Quality Scoring Engine — Deep Tech Specification |
| **Version** | 1.0 |
| **Status** | Supporting / Non-Canonical |
| **Audience** | Engineering, ML/AI, Product, Trust & Safety Teams |
| **Scope** | MVP v1 + Post-MVP v2 (Clearly Separated) |
| **Related Documents** | DOC-092 (Warehouse Quality Score), DOC-105 (AI Risk Scoring), DOC-099 (Content Moderation), DOC-106 (Trust & Safety Framework), DOC-063 (Operator Experience), DOC-059 (Multi-Country Architecture), Security & Compliance Plan |

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Document Role & Phase Boundary](#2-document-role--phase-boundary)
3. [MVP v1: Basic Photo Validation](#3-mvp-v1-basic-photo-validation)
4. [Post-MVP / v2: Advanced Quality Assessment (Exploratory)](#4-post-mvp--v2-advanced-quality-assessment-exploratory)
5. [Integration with Trust & Safety](#5-integration-with-trust--safety)
6. [Multi-Country & Compliance Considerations](#6-multi-country--compliance-considerations)
7. [Data Sources & Signal Types](#7-data-sources--signal-types)
8. [Failure Modes & Risk Mitigation](#8-failure-modes--risk-mitigation)
9. [Relationship to Canonical Documents](#9-relationship-to-canonical-documents)
10. [Non-Goals](#10-non-goals)
11. [Open Questions](#11-open-questions)

---

# 1. Introduction

## 1.1. Purpose

This document describes the technical approach to assessing photo quality for warehouse and storage unit listings on the Self-Storage Aggregator platform. Photo quality assessment serves multiple purposes:

- **Content Moderation**: Identifying photos that violate platform policies
- **UX Quality**: Ensuring listings present facilities accurately and professionally
- **Trust Signal**: Contributing one input signal to broader trust and safety systems

**Key Objectives:**
- Define foundational photo validation capabilities for MVP v1
- Explore potential future enhancements for post-MVP phases
- Ensure alignment with trust & safety principles
- Maintain compliance with data protection and fairness requirements

## 1.2. Scope

**MVP v1 (In Scope):**
- Basic technical validation (resolution, format, file size)
- Rule-based quality checks (blur detection, orientation)
- Human-in-the-loop moderation workflow
- UX hints to operators about photo quality

**Post-MVP / v2 (Exploratory, Non-Binding):**
- ML-based quality assessment concepts
- Aesthetic scoring approaches
- Cross-listing comparison methods
- Advanced content analysis

**Out of Scope (All Phases):**
- Automated content rejection without human review
- Biometric identification or facial recognition
- Sensitive attribute inference (demographics, etc.)
- Real-time inference guarantees or SLAs

## 1.3. What This Document Is NOT

This specification explicitly does NOT:

1. **Define Autonomous Moderation**: All significant moderation decisions require human review
2. **Promise Accuracy Metrics**: No guarantees about detection rates or false positive/negative rates
3. **Create Enforcement Rules**: Photo scores are signals, not decisions (see DOC-099, DOC-106)
4. **Establish ML Training Processes**: No production model training or retraining pipelines defined
5. **Introduce New Data Sources**: Uses only existing platform data defined in canonical specs
6. **Guarantee Real-Time Processing**: No latency or performance commitments

---

# 2. Document Role & Phase Boundary

## 2.1. Document Classification

**Type**: Deep Tech Specification  
**Status**: Supporting (Non-Canonical)  
**Binding Nature**:
- MVP v1 section: Foundational requirements for basic validation
- v2 section: Research-oriented exploration, NOT commitments

## 2.2. MVP v1 vs. v2 Separation

### MVP v1 Philosophy
**Approach**: Conservative, rule-based, human-supervised  
**Characteristics**:
- Minimal automation
- High human involvement
- Focus on obvious quality issues
- No enforcement without review

### Post-MVP / v2 Philosophy  
**Approach**: Experimental, ML-assisted, research-oriented  
**Characteristics**:
- May explore ML techniques
- Could investigate advanced analysis
- Experimental, not guaranteed
- Subject to thorough validation before any production use

**Language Discipline**:
- MVP v1: Uses "must," "shall," "required"
- v2: Uses "may," "could," "experimental," "potential"
- v2 NEVER uses: "will," "guarantees," "production-ready"

## 2.3. Relationship to Enforcement

**CRITICAL PRINCIPLE**: Photo quality scores are INPUT SIGNALS, never autonomous decisions.

**Governance Hierarchy**:
1. **DOC-106** (Trust & Safety Framework): Defines principles
2. **DOC-099** (Content Moderation Policy): Defines processes
3. **DOC-068** (This Document): Provides technical signals

**Signal Flow**:
```
Photo Analysis → Quality Score → Human Reviewer → Decision → Action
```

**Never**:
```
Photo Analysis → Auto-Reject ❌
```

---

# 3. MVP v1: Basic Photo Validation

## 3.1. MVP v1 Capabilities (Allowed)

### 3.1.1. Technical Validation

**Purpose**: Ensure photos meet minimum technical requirements for display.

**Checks Performed**:
- **Format Validation**: JPEG, PNG, WEBP only
- **Resolution Requirements**:
  - Minimum: 800x600 pixels
  - Maximum: 4096x4096 pixels
  - Recommended: 1200x900 pixels or higher
- **File Size Limits**:
  - Minimum: 50KB (prevents placeholder images)
  - Maximum: 10MB per image
- **Aspect Ratio**: Between 1:2 and 2:1 (prevents extreme distortions)

**Implementation**: Simple rule-based checks, no ML required.

**User Experience**:
- Instant feedback on upload (client-side validation)
- Clear error messages ("Photo resolution too low: minimum 800x600 required")
- No photos rejected without operator notification

### 3.1.2. Basic Quality Heuristics

**Purpose**: Identify obvious quality issues that harm UX.

**Checks Performed**:
- **Blur Detection**: Simple Laplacian variance threshold
  - Threshold: Variance < 100 suggests blur
  - Action: Flag for human review, show UX hint to operator
- **Brightness Extremes**: Histogram analysis
  - Very dark images (mean pixel value < 30)
  - Very bright images (mean pixel value > 225)
  - Action: UX hint only, no rejection
- **Orientation**: EXIF orientation tag validation
  - Auto-correct orientation based on EXIF data
  - Flag images without EXIF for manual check

**Implementation**: OpenCV or similar image processing library, deterministic algorithms only.

**User Experience**:
- Soft warnings: "This photo appears blurry. Consider uploading a clearer image."
- No forced rejections
- Operator can proceed with photo if they choose

### 3.1.3. Content Policy Violations (Obvious Cases)

**Purpose**: Flag photos that clearly violate content policies.

**Checks Performed**:
- **Completely blank images**: All pixels near-identical
- **Text-heavy images**: More than 70% of image is text overlay
- **Watermarked images**: Large, prominent watermarks from competitors

**Implementation**: Simple pixel analysis and text detection (e.g., Tesseract OCR for text percentage).

**User Experience**:
- Clear policy explanation
- Operator can appeal or replace photo
- Human moderator makes final decision

### 3.1.4. Human-in-the-Loop Workflow

**Process**:
1. Operator uploads photos
2. System runs technical validation + basic heuristics
3. System flags photos meeting criteria for review
4. Flagged photos queued for human moderator
5. Moderator reviews within 24 hours (target)
6. Moderator approves, requests changes, or rejects with explanation
7. Operator notified of decision and reasoning

**Moderator Tools**:
- Side-by-side comparison with similar warehouses
- Access to photo metadata (upload time, device, location)
- Standardized decision criteria from DOC-099
- Audit trail of all decisions

**No Automation**: Human approval required for all rejections.

## 3.2. MVP v1 Restrictions (Prohibited)

**Explicitly NOT Included in MVP v1**:
- ❌ CNN-based quality scoring
- ❌ Aesthetic ranking or "beauty" scores
- ❌ Automated rejection based on quality score alone
- ❌ Cross-listing photo comparison algorithms
- ❌ ML model training or retraining processes
- ❌ Real-time inference pipelines
- ❌ Facial recognition or biometric analysis
- ❌ Scene understanding or object detection

## 3.3. MVP v1 Output Format

**Photo Quality Signal (for each photo)**:
```json
{
  "photo_id": "uuid-string",
  "technical_validation": {
    "format_valid": true,
    "resolution_valid": true,
    "file_size_valid": true,
    "aspect_ratio_valid": true
  },
  "quality_flags": {
    "blur_detected": false,
    "brightness_issue": "none", // "none" | "too_dark" | "too_bright"
    "orientation_corrected": false
  },
  "policy_flags": {
    "blank_image": false,
    "excessive_text": false,
    "watermark_detected": false
  },
  "requires_review": false,
  "review_reason": null,
  "operator_hint": "Photo looks good! Consider adding more photos for better visibility."
}
```

**Integration**: This signal is stored in database and passed to moderators. It does NOT automatically block listings.

---

# 4. Post-MVP / v2: Advanced Quality Assessment (Exploratory)

> **DISCLAIMER**: This section describes potential future research directions. Nothing here constitutes a commitment, requirement, or production specification. All v2 concepts require separate product specification, technical validation, and compliance review before any implementation.

## 4.1. v2 Research Areas (Non-Binding)

### 4.1.1. ML-Based Quality Scoring (Experimental)

**Concept**: Use machine learning to assess photo quality beyond simple heuristics.

**Potential Approaches**:
- **Convolutional Neural Networks**: Could analyze composition, lighting, framing
- **Transfer Learning**: May leverage pre-trained models (e.g., MobileNet, ResNet)
- **Multi-Dimensional Scoring**: Could evaluate separate dimensions (sharpness, lighting, composition, relevance)

**NOT Guaranteed**:
- Accuracy metrics or performance targets
- Specific model architectures
- Training data requirements or availability
- Production deployment timelines

**Language**: "May use," "could explore," "potential approach"

### 4.1.2. Aesthetic Ranking (Conceptual)

**Concept**: Assess visual appeal to help renters evaluate listings.

**Potential Signals**:
- Compositional balance
- Color harmony
- Professional vs. casual photography style
- Consistency across photo set

**Constraints**:
- Must not encode demographic bias
- Must not systematically disadvantage budget facilities
- Requires extensive bias testing before any use
- Explainability essential for operator trust

**Language**: "Conceptual only," "requires validation," "subject to bias review"

### 4.1.3. Cross-Listing Comparison (Exploratory)

**Concept**: Compare photos across listings to detect inconsistencies or fraud.

**Potential Use Cases**:
- Duplicate photo detection (same photo used for multiple warehouses)
- Stock photo identification
- Inconsistency detection (interior vs. exterior mismatches)

**Technical Challenges**:
- Image similarity algorithms (perceptual hashing, feature matching)
- Scale and performance considerations
- False positive management

**Language**: "Exploratory," "potential use case," "technical feasibility TBD"

### 4.1.4. Advanced Content Analysis (Research)

**Concept**: Understand photo content beyond quality metrics.

**Potential Capabilities**:
- Scene classification (interior, exterior, entrance, storage area)
- Facility feature detection (security cameras, climate control, lighting)
- Cleanliness indicators
- Safety hazard identification

**Limitations**:
- No biometric identification
- No sensitive attribute inference
- No autonomous enforcement
- Human review always required

**Language**: "Research topic," "could investigate," "not production-ready"

## 4.2. v2 Implementation Philosophy

**IF v2 capabilities are ever implemented, they must**:
- Be thoroughly tested for bias and fairness
- Maintain human-in-the-loop for all enforcement
- Provide explainability to operators
- Comply with all data protection regulations
- Undergo separate compliance and legal review

**Gradual Rollout**:
1. Internal testing and validation
2. Operator visibility (scores shown but not enforced)
3. Limited enforcement in specific scenarios (with extensive monitoring)
4. Continuous evaluation and adjustment

**Rollback Capability**: Must be able to disable v2 features instantly if issues arise.

---

# 5. Integration with Trust & Safety

## 5.1. Alignment with DOC-106 (Trust & Safety Framework)

**Principle Alignment**:
- **Participant Protection**: Photo quality contributes to content integrity pillar
- **Fairness**: Scoring does not systematically disadvantage any group
- **Human-in-the-Loop**: No autonomous enforcement actions
- **Transparency**: Operators understand why photos are flagged
- **Proportionality**: Enforcement matches severity of issue

**Boundary Clarity**:
- Photo quality engine: Provides technical signals
- Trust & Safety framework: Defines decision principles
- Content moderation (DOC-099): Implements decision processes
- Human moderators: Make final decisions

## 5.2. Photo Score as Input Signal, Not Decision

**Signal Flow**:
```
Photo Quality Signal → Moderator Dashboard → Human Review → Decision
```

**Moderator Context**:
- Photo quality signal is ONE input among many
- Other inputs: operator history, listing details, user reports, policy violations
- Final decision based on holistic evaluation
- Moderator can override quality signal with justification

**Documentation**:
- All moderation decisions logged with reasoning
- Photo quality signal strength recorded
- Moderator actions auditable
- Appeal process available to operators

## 5.3. Relationship to DOC-099 (Content Moderation Policy)

**Content Moderation Defines**:
- What constitutes a policy violation
- Severity levels for different violations
- Enforcement actions (warning, removal, escalation)
- Appeal and remediation processes

**Photo Quality Engine Provides**:
- Technical quality assessment
- Flagging of potential issues
- Supporting evidence for moderators
- UX hints for operators

**Separation of Concerns**:
- Photo engine: "This photo has technical issue X"
- Moderation policy: "Technical issue X warrants action Y"
- Human moderator: "In this context, action Y is appropriate"

---

# 6. Multi-Country & Compliance Considerations

## 6.1. Region-Agnostic Evaluation Rules

**Design Principle**: Photo quality criteria are based on technical and content factors, not regional characteristics.

**Universal Criteria**:
- Resolution requirements same across regions
- Blur detection thresholds region-independent
- Content policy violations (blank images, excessive watermarks) universal

**Regional Variations (Permitted)**:
- Language of UX hints and error messages
- Cultural context for content moderation (what constitutes "professional" may vary)
- Legal requirements (e.g., GDPR right to explanation in EU)

## 6.2. Data Protection Compliance

**Alignment with DOC-059 (Multi-Country Architecture)**:
- Photo storage and processing comply with regional data protection laws
- Data residency requirements respected (photos stored in region where uploaded)
- Cross-border photo analysis limited to metadata only, not image bytes

**Key Protections**:
- **No Biometric Identification**: System does not identify individuals in photos
- **No Sensitive Attributes**: Does not infer race, gender, age, or other protected characteristics
- **Purpose Limitation**: Photos used only for listing quality and moderation
- **User Rights**: Operators can request photo deletion (within retention policy)

**GDPR Considerations (if applicable)**:
- Legal basis: Legitimate interest in maintaining platform quality
- Transparency: Operators informed of quality assessment in Terms of Service
- Right to Explanation: Operators can request reasoning for photo flags
- Data Minimization: Only necessary metadata retained long-term

## 6.3. Non-Discrimination Requirements

**Bias Prevention**:
- Quality criteria do not favor expensive facilities over budget facilities
- Scoring does not correlate with protected demographic attributes
- Regular bias audits if ML models ever deployed

**Fairness Testing** (for any future ML):
- Test across facility types (indoor, outdoor, different sizes)
- Test across regions and cities
- Monitor for disparate impact on operator groups
- Adjust or disable if systematic bias detected

## 6.4. No Biometric or Sensitive Inference

**Explicit Prohibitions**:
- ❌ Facial recognition or identification
- ❌ Demographic inference from photos
- ❌ Tracking individuals across listings or time
- ❌ Any processing of personal data beyond quality assessment

**Technical Safeguards**:
- Image analysis focused on facility characteristics only
- No face detection models deployed
- Metadata stripped before any ML processing (if ever implemented)
- Audit logs for compliance verification

---

# 7. Data Sources & Signal Types

## 7.1. Photo Metadata (Available in MVP v1)

**From Database (warehouses_photos table)**:
- photo_id, warehouse_id, operator_id
- file_path, storage_url, mime_type
- file_size, width, height
- display_order, is_primary
- caption (operator-provided text)
- created_at, updated_at

**From EXIF (if available)**:
- Camera make/model (for quality context)
- Capture timestamp
- GPS coordinates (not used for quality, only for fraud detection if enabled)
- Orientation flag

**From Upload Context**:
- Upload timestamp
- User agent / device type
- Upload success/failure history

## 7.2. Image Analysis Outputs (MVP v1)

**Technical Metrics**:
- Resolution (width x height)
- File size (bytes)
- Aspect ratio
- Format (JPEG, PNG, WEBP)

**Quality Heuristics**:
- Blur score (Laplacian variance)
- Brightness histogram (mean, std dev, distribution)
- Contrast score
- Color space analysis (saturation, vibrancy)

**Content Flags**:
- Blank/near-blank detection (pixel uniformity)
- Text coverage percentage (OCR-based)
- Watermark presence (template matching or simple pattern detection)

## 7.3. Contextual Signals (Available for Moderation)

**Warehouse Context**:
- Operator verification status (from operators.status)
- Warehouse approval status (from warehouses.status)
- Number of existing photos for this warehouse
- Listing age (new vs. established)

**Operator Behavior**:
- Photo upload frequency
- Photo replacement patterns
- Historical moderation outcomes

**User Feedback**:
- User reports about misleading photos
- Review mentions of photo accuracy
- Booking abandonment patterns (if correlated with photo quality)

**Note**: These signals are available to moderators for decision-making context, but not used in automated scoring.

---

# 8. Failure Modes & Risk Mitigation

## 8.1. False Positives (Valid Photos Flagged)

**Risk**: System incorrectly flags high-quality photos as problematic.

**Manifestations**:
- Artistic photos flagged as "too dark" or compositionally weak
- Professional photos flagged due to unusual angles
- Legitimate watermarks (operator branding) flagged as spam

**Impact**:
- Operator frustration and distrust
- Unnecessary moderation workload
- Potential lost listings if operators abandon upload

**Mitigation Strategies**:
- Conservative thresholds for MVP v1 (minimize false positives)
- UX hints are suggestions, not errors
- Human moderators trained to recognize false positives
- Operator feedback mechanism ("This flag was incorrect")
- Regular review of false positive rate

## 8.2. False Negatives (Bad Photos Missed)

**Risk**: System fails to flag photos that violate quality or content policies.

**Manifestations**:
- Blurry or poorly lit photos not flagged
- Misleading photos pass without review
- Competitor watermarks not detected

**Impact**:
- Poor UX for renters
- Trust erosion if listings consistently misleading
- Competitive disadvantage for operators with high-quality photos

**Mitigation Strategies**:
- User reporting mechanism ("Report misleading photo")
- Periodic sampling and manual review of unflagged photos
- Conservative quality bar (some bad photos acceptable to avoid false positives)
- Continuous improvement of detection rules

**Acceptance**: MVP v1 prioritizes minimizing false positives over catching all false negatives.

## 8.3. Bias Amplification

**Risk**: Quality assessment systematically disadvantages certain operators or facility types.

**Examples**:
- Older facilities with vintage aesthetic scored lower than modern facilities
- Budget facilities with basic lighting scored lower than premium facilities
- Photos from smartphones scored lower than professional cameras

**Impact**:
- Unfair marketplace advantage for certain operators
- Potential regulatory issues (discrimination claims)
- Erosion of platform diversity

**Mitigation Strategies**:
- Quality criteria focus on technical adequacy, not luxury indicators
- No "aesthetic beauty" scoring in MVP v1
- Bias audits during any ML model development (v2)
- Regular monitoring of quality scores across facility types and price points
- Adjust criteria if systematic bias detected

## 8.4. Operator Gaming

**Risk**: Operators attempt to manipulate quality scores through artificial means.

**Examples**:
- Using stock photos or photos from other facilities
- Over-processing images to artificially boost scores
- Uploading professional renders instead of actual photos

**Detection**:
- Cross-listing duplicate photo detection (v2 concept)
- Reverse image search integration (potential)
- User reports of misleading photos
- Inconsistency detection (professional photo + amateur facility description)

**Response**:
- Policy violations handled per DOC-099
- Human review always involved
- Operator education about acceptable practices

## 8.5. Technical Failures

**Risk**: Image processing pipeline failures or errors.

**Manifestations**:
- Image analysis service outage
- Corrupted image files during upload
- Timeout errors on large images
- Edge cases causing processing crashes

**Mitigation**:
- Graceful degradation: If analysis fails, allow upload with manual review
- Retry logic for transient failures
- Circuit breaker pattern for downstream service issues
- Monitoring and alerting for processing failures
- Error rate tracking

**Fallback Strategy**: If automated checks unavailable, all photos queued for human review.

## 8.6. Privacy Incidents

**Risk**: Accidental capture or exposure of sensitive information in photos.

**Examples**:
- Personal information visible in photos (documents, screens)
- Individuals unintentionally in frame
- Sensitive business information (customer lists, prices on documents)

**Detection**:
- Text detection (OCR) can flag excessive text
- Human moderators trained to spot privacy issues
- User reports

**Response**:
- Photo removal per DOC-099
- Operator notification and education
- No retention of sensitive imagery

---

# 9. Relationship to Canonical Documents

## 9.1. DOC-092: Warehouse Quality Score Algorithm

**Relationship**:
- DOC-092 describes overall warehouse quality scoring (conceptual)
- Photo quality could be ONE input signal to warehouse quality (if implemented)
- This document (DOC-068) focuses specifically on photo assessment

**Boundary**:
- Photo quality score does NOT directly determine warehouse quality score
- If integration occurs, it requires updates to DOC-092
- Separate systems with defined integration points

**Example Integration (Conceptual, v2)**:
- Warehouse quality score may consider "listing quality" component
- "Listing quality" may include photo quality signal
- Photo quality weight would be defined in DOC-092, not here

## 9.2. DOC-105: AI Risk Scoring & Fraud Detection Engine

**Relationship**:
- DOC-105 may use photo signals for fraud detection (e.g., duplicate photos)
- Photo quality anomalies may be risk indicators
- This document provides photo analysis outputs as inputs to fraud detection

**Boundary**:
- This document: "What is the quality of this photo?"
- DOC-105: "Is this photo part of a fraud pattern?"
- Separate concerns with shared data

**Integration Point**:
- Photo metadata and analysis results available to fraud detection
- Fraud scores available to moderators reviewing flagged photos

## 9.3. DOC-099: Content Moderation & Fraud Protection Policy

**Relationship**:
- DOC-099 DEFINES what constitutes a content policy violation
- This document DETECTS potential violations
- Final decisions governed by DOC-099 processes

**Boundary**:
- This document: Technical detection capabilities
- DOC-099: Policy definitions and enforcement procedures
- Human moderators: Policy application

**Example**:
- DOC-068: "Photo has 85% text coverage"
- DOC-099: "Photos with >70% text coverage violate 'no advertising' policy"
- Moderator: "This specific case is violation / not a violation because [reason]"

## 9.4. DOC-106: Trust & Safety Framework

**Relationship**:
- DOC-106 defines principles governing all trust & safety systems
- Photo quality engine operates under these principles
- Human-in-the-loop, fairness, transparency requirements

**Alignment**:
- Photo signals are inputs, not decisions (Human-in-the-Loop)
- Operators understand why photos flagged (Transparency)
- Scoring does not systematically disadvantage groups (Fairness)
- Enforcement proportional to violation severity (Proportionality)

## 9.5. DOC-063: Operator Experience (OX)

**Relationship**:
- DOC-063 describes operator-facing UX for photo upload
- This document provides backend capabilities supporting that UX

**Integration**:
- Photo upload form shows real-time validation feedback
- UX hints generated by quality assessment displayed to operators
- Moderation outcomes communicated per DOC-063 patterns

**Example**:
- Operator uploads photo → System analyzes → UX hint displayed: "This photo appears dark. Consider retaking in better lighting for best results."

## 9.6. DOC-059: Multi-Country & Multi-Region Architecture

**Relationship**:
- DOC-059 defines data residency and regional considerations
- Photo processing must respect regional boundaries
- Quality criteria may have regional variations

**Compliance**:
- Photos stored in region where uploaded
- Processing respects data residency requirements
- No cross-border transfer of image bytes (only metadata if necessary)

## 9.7. Full Database Specification (CANONICAL)

**Data Sources**:
- **warehouses_photos table**: Primary source of photo metadata
- **warehouses table**: Context about facility
- **operators table**: Operator verification status
- **events_log table**: Photo moderation events

**No New Tables Required**: All data needs met by existing schema in MVP v1.

**Potential v2 Additions** (not committed):
- Photo quality scores table (if scores persisted)
- Photo moderation history table (detailed audit trail)

## 9.8. API Design Blueprint (CANONICAL)

**Existing Endpoints Used**:
- `POST /api/v1/operator/warehouses/{id}/photos`: Photo upload triggers quality analysis
- `GET /api/v1/operator/warehouses/{id}/photos`: Retrieve photos with quality metadata

**No New Endpoints in MVP v1**: Quality analysis integrated into existing upload flow.

**Potential v2 Endpoints** (not committed):
- `GET /api/v1/operator/photos/{id}/quality-report`: Detailed quality breakdown
- `POST /api/v1/admin/photos/{id}/reanalyze`: Trigger re-analysis

## 9.9. Security & Compliance Plan

**Alignment**:
- Photo storage security (encryption at rest, in transit)
- Access controls (operators see only their photos)
- Audit logging (all moderation decisions logged)
- Data retention (photos deleted per retention policy)

**Compliance Requirements**:
- GDPR: Right to explanation for photo flags
- CCPA: Operator can request photo deletion
- Data minimization: Only necessary metadata retained
- No sensitive data inference

---

# 10. Non-Goals

**This document explicitly does NOT**:

1. **Define Autonomous Moderation**:
   - No automated rejection of photos without human review
   - No "auto-approve" based solely on quality score
   - Human moderators always in enforcement loop

2. **Promise Accuracy or Performance**:
   - No SLAs for detection rates
   - No guarantees of false positive/negative rates
   - No real-time processing commitments

3. **Establish ML Production Systems**:
   - No model training pipelines defined
   - No retraining or continuous learning processes
   - No ML infrastructure specifications

4. **Create New Data Sources**:
   - Uses only existing canonical database tables
   - No new mandatory fields or statuses
   - No external data integrations defined

5. **Define Search Ranking Impact**:
   - Photo quality does not directly affect search ranking (separate from DOC-075/076)
   - Any ranking integration requires separate specification

6. **Mandate UI/UX Implementation**:
   - UX suggestions only (detailed UX defined in DOC-063)
   - No binding UI requirements

7. **Provide Legal or Compliance Determinations**:
   - Legal compliance defined in Security & Compliance Plan
   - This document provides technical capabilities only

8. **Commit to v2 Features**:
   - v2 section is exploratory research only
   - No commitment to implement any v2 capabilities
   - No timelines or resource allocations

---

# 11. Open Questions

## 11.1. MVP v1 Open Questions

**Technical Implementation**:
- Which specific image processing library? (OpenCV, Pillow, ImageMagick)
- Processing location? (Edge, API server, separate service)
- Sync vs. async processing? (Balance UX speed with cost)

**Threshold Tuning**:
- What blur threshold minimizes false positives while catching real issues?
- What brightness extremes are actually problematic vs. artistic choices?
- How much text coverage is "excessive"?

**Moderation Workflow**:
- Target review time for flagged photos? (24 hours, 48 hours?)
- Moderator training materials and guidelines?
- Appeal process details?

## 11.2. v2 Feasibility Questions

**Data Readiness**:
- Is there sufficient photo data to train ML models?
- What is typical photo quality distribution?
- Are there enough labeled examples for supervised learning?

**Technical Feasibility**:
- Can ML models run cost-effectively at scale?
- What latency is acceptable for ML-based analysis?
- Edge deployment viable? Cloud only?

**Bias & Fairness**:
- How to test for bias in photo quality assessment?
- What metrics indicate systematic unfairness?
- How to ensure aesthetic scoring doesn't favor expensive facilities?

## 11.3. Product & Business Questions

**User Impact**:
- Do renters value high-quality photos enough to justify investment?
- Will quality hints improve operator photo uploads?
- Does photo quality correlate with booking conversion?

**Operator Perception**:
- Will operators view quality assessment as helpful or punitive?
- How to communicate quality feedback constructively?
- What training or resources do operators need?

**Competitive Context**:
- How do competitors handle photo quality?
- What are user expectations based on other platforms?
- Is photo quality a competitive differentiator?

## 11.4. Compliance Questions

**Regional Variations**:
- Do any regions have specific photo content requirements?
- Are there cultural differences in what constitutes "quality"?
- Legal restrictions on photo processing in any markets?

**Data Protection**:
- Specific GDPR requirements for photo analysis?
- Retention periods for photo quality metadata?
- Cross-border transfer restrictions?

---

# Appendix A: Example Use Cases

## A.1. MVP v1 Use Cases

### Use Case 1: Operator Uploads New Photos

**Scenario**: Operator uploads 5 photos for a new warehouse listing.

**System Behavior**:
1. Each photo validated (format, size, resolution) - instant feedback
2. Basic quality checks run (blur, brightness)
3. Photo 3 flagged as potentially blurry (Laplacian variance: 85)
4. UX hint shown: "Photo 3 appears slightly blurry. Consider uploading a clearer version for best results."
5. Operator chooses to replace Photo 3 or proceed as-is
6. All photos uploaded successfully
7. Listing submitted for moderation (photo quality signal included in moderator dashboard)

**Outcome**: Operator has choice, human moderator makes final call.

### Use Case 2: Automated Flag Triggers Human Review

**Scenario**: Photo uploaded with 80% text coverage (marketing poster photo).

**System Behavior**:
1. OCR detects 80% text coverage
2. System flags photo per "excessive text" rule
3. Photo queued for human moderator review
4. Moderator sees photo + flag reason + warehouse context
5. Moderator determines: "This is actually informational signage at warehouse entrance, acceptable"
6. Photo approved with note in log
7. Operator notified: "Photo approved"

**Outcome**: Automated flag + human judgment = correct decision.

### Use Case 3: User Reports Misleading Photo

**Scenario**: Renter reports that photo does not match actual facility.

**System Behavior**:
1. User submits report with reason
2. Report triggers manual review (per DOC-099)
3. Moderator reviews reported photo + other warehouse photos + reviews
4. Moderator determines photo is from a different facility (stock photo)
5. Photo removed, operator notified, penalty applied per DOC-099
6. Operator can appeal with explanation

**Outcome**: User report + human review = policy enforcement.

## A.2. Conceptual v2 Use Cases (Illustrative Only)

### Use Case 4: ML-Assisted Quality Ranking (Hypothetical)

**Scenario**: Platform explores showing "photo quality" badge for high-quality listings.

**System Behavior** (if ever implemented):
1. ML model analyzes all photos for a warehouse
2. Model generates multi-dimensional quality score (sharpness, composition, lighting)
3. Score compared to platform distribution
4. Warehouses in top 20% eligible for "High-Quality Photos" badge
5. Badge shown in search results (A/B tested for conversion impact)
6. Operators see quality score breakdown in dashboard
7. Continuous monitoring for bias (score distribution by facility type, region, price)

**Outcome**: Potential UX enhancement, requires extensive validation.

### Use Case 5: Cross-Listing Duplicate Detection (Hypothetical)

**Scenario**: Platform explores detecting fraudulent listings using stolen photos.

**System Behavior** (if ever implemented):
1. New warehouse submitted with 5 photos
2. System calculates perceptual hashes for each photo
3. Compares hashes against all existing warehouse photos
4. Finds exact match: Photo 2 is identical to photo from Warehouse XYZ
5. System flags listing for fraud review
6. Human investigator reviews both listings
7. Investigator determines: Same operator, photos correctly reused vs. fraud
8. Appropriate action taken

**Outcome**: Fraud detection signal, human decision.

---

# Appendix B: Technical Implementation Notes (MVP v1)

## B.1. Image Processing Pipeline

**Upload Flow**:
1. **Client-side validation**: Format, size (before upload starts)
2. **Server receives photo**: Store in temporary location
3. **Technical validation**: Resolution, aspect ratio, file size
4. **Quality analysis**: Blur detection, brightness check
5. **Content checks**: Blank detection, text coverage
6. **Store photo**: Move to permanent storage (S3, CDN)
7. **Save metadata**: Write to database with quality signals
8. **Queue for moderation** (if flagged): Add to moderator queue
9. **Return response**: Success + quality hints

**Error Handling**:
- If analysis fails: Photo stored, queued for manual review
- If storage fails: Retry with exponential backoff
- If timeout: Graceful degradation (allow upload, review later)

## B.2. Example Blur Detection Code

```python
import cv2
import numpy as np

def calculate_blur_score(image_path):
    """
    Calculate blur score using Laplacian variance.
    Lower score = more blurry.
    
    Returns:
        float: Blur score (typically 0-1000+)
        bool: is_blurry (True if score < threshold)
    """
    image = cv2.imread(image_path)
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    laplacian_var = cv2.Laplacian(gray, cv2.CV_64F).var()
    
    BLUR_THRESHOLD = 100  # Tunable threshold
    is_blurry = laplacian_var < BLUR_THRESHOLD
    
    return laplacian_var, is_blurry

# Example usage
blur_score, is_blurry = calculate_blur_score("photo.jpg")
if is_blurry:
    hint = "This photo appears blurry. Consider uploading a clearer image."
```

## B.3. Example Brightness Check Code

```python
import cv2
import numpy as np

def check_brightness(image_path):
    """
    Check if image is too dark or too bright.
    
    Returns:
        str: "too_dark" | "too_bright" | "ok"
        float: mean pixel value (0-255)
    """
    image = cv2.imread(image_path)
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    mean_brightness = np.mean(gray)
    
    DARK_THRESHOLD = 30
    BRIGHT_THRESHOLD = 225
    
    if mean_brightness < DARK_THRESHOLD:
        return "too_dark", mean_brightness
    elif mean_brightness > BRIGHT_THRESHOLD:
        return "too_bright", mean_brightness
    else:
        return "ok", mean_brightness

# Example usage
brightness_status, brightness_value = check_brightness("photo.jpg")
if brightness_status == "too_dark":
    hint = "This photo appears very dark. Consider retaking in better lighting."
```

## B.4. Example Text Detection Code

```python
import cv2
import pytesseract
import numpy as np

def calculate_text_coverage(image_path):
    """
    Estimate percentage of image covered by text.
    
    Returns:
        float: Percentage of image that is text (0-100)
        bool: excessive_text (True if > threshold)
    """
    image = cv2.imread(image_path)
    h, w = image.shape[:2]
    total_pixels = h * w
    
    # Run OCR to detect text regions
    data = pytesseract.image_to_data(image, output_type=pytesseract.Output.DICT)
    
    # Calculate bounding boxes of text
    text_pixels = 0
    for i in range(len(data['text'])):
        if int(data['conf'][i]) > 60:  # Confidence threshold
            x, y, w_box, h_box = data['left'][i], data['top'][i], data['width'][i], data['height'][i]
            text_pixels += (w_box * h_box)
    
    text_percentage = (text_pixels / total_pixels) * 100
    
    TEXT_THRESHOLD = 70  # 70% text coverage is excessive
    excessive_text = text_percentage > TEXT_THRESHOLD
    
    return text_percentage, excessive_text

# Example usage
text_pct, has_excessive_text = calculate_text_coverage("photo.jpg")
if has_excessive_text:
    hint = "This image contains mostly text. Please upload photos of the actual facility."
```

---

# Appendix C: Moderation Guidelines (MVP v1)

## C.1. Moderator Decision Criteria

**Photo Approval Checklist**:
- ✅ Photo clearly shows warehouse/storage facility
- ✅ Photo is in focus (minor blur acceptable if content clear)
- ✅ Photo is adequately lit (doesn't need to be perfect)
- ✅ Photo accurately represents the facility
- ✅ No competitor watermarks or branding
- ✅ No misleading angles or staging

**Grounds for Rejection**:
- ❌ Photo from different facility (fraud)
- ❌ Stock photo or clip art
- ❌ Completely unrelated image
- ❌ Inappropriate content (per content policy)
- ❌ Competitor branding/watermarks
- ❌ Intentionally misleading composition

**Grounds for Operator Guidance** (soft warning):
- ⚠️ Photo quality could be improved (blur, lighting)
- ⚠️ More photos recommended
- ⚠️ Angles could better showcase facility

## C.2. Handling Edge Cases

**Case: Artistic/Stylistic Photos**
- Decision: Allow if facility still identifiable
- Rationale: Operator creative freedom
- Example: Black & white photo, artistic angle - OK if facility clear

**Case: Budget Facility, Basic Lighting**
- Decision: Allow if minimally adequate
- Rationale: Don't penalize budget facilities
- Example: Fluorescent lighting, simple composition - OK

**Case: Operator Branding in Photo**
- Decision: Allow moderate branding
- Rationale: Operator identity acceptable
- Example: Company logo in corner - OK | Entire photo is logo - NOT OK

**Case: Construction/Renovation Photos**
- Decision: Allow with operator disclosure
- Rationale: Transparency about facility status
- Example: Photo with caption "Renovation in progress, complete by X date" - OK

---

# Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-12-17 | Technical Documentation Team | Initial specification: MVP v1 (foundational) + v2 (exploratory) with strict phase separation |

---

**END OF DOCUMENT**
