# Accessibility Guidelines (MVP v1)
## Self-Storage Aggregator Platform

**Document ID:** DOC-004  
**Version:** 1.0 (Canonical)  
**Status:** Canonical  
**Date:** December 17, 2025  
**Classification:** Technical Specification

---

## Document Scope & Accessibility Target

### Purpose

This document defines accessibility requirements for the **Self-Storage Aggregator MVP v1** release only. It establishes technical standards for building accessible user interfaces that comply with WCAG 2.1 Level AA for critical user-facing flows.

### Scope Boundaries

**IN SCOPE (MVP v1):**
- WCAG 2.1 Level A compliance (full)
- WCAG 2.1 Level AA compliance (for critical user paths)
- Keyboard navigation for all essential functions
- Screen reader compatibility (NVDA/JAWS)
- Color contrast requirements (4.5:1 for text, 3:1 for UI)
- Semantic HTML and ARIA attributes
- Responsive text scaling
- Form validation accessibility

**OUT OF SCOPE (Post-MVP):**
- WCAG 2.1 Level AAA compliance
- Advanced assistive technology support (voice control, switch access)
- Alternative color schemes beyond default high contrast
- Complex aria-live regions for real-time updates
- Advanced screen magnifier optimization
- Organizational training programs and processes

### Target Compliance Level

**Primary Target:** WCAG 2.1 Level AA  
**Applicable To:** Critical user-facing flows (search, browse, booking, operator dashboard)  
**Testing Coverage:** Essential user journeys only

### Document Authority

This document is subordinate to:
1. Frontend_Architecture_Specification (for technical implementation)
2. Design_System_Overview_MVP_v1 (for UI component standards)
3. Functional_Specification_MVP_v1 (for feature scope)

Any enhancements beyond MVP must be documented separately and approved through the standard change control process.

---

## 1. Introduction

### 1.1. Accessibility Definition

**Accessibility (A11y)** refers to designing and developing web applications that can be used by people with diverse abilities and disabilities. This includes users with:

- Visual impairments (blindness, low vision, color blindness)
- Auditory impairments (deafness, hearing loss)
- Motor impairments (limited hand mobility, inability to use a mouse)
- Cognitive impairments (dyslexia, ADHD, autism spectrum)
- Temporary limitations (injuries, fatigue, situational constraints)

### 1.2. Core Accessibility Principles (POUR)

All accessibility requirements in this document align with the POUR principles:

1. **Perceivable** — Information and UI must be presentable to users in ways they can perceive
2. **Operable** — Interface components and navigation must be operable
3. **Understandable** — Information and UI operation must be understandable
4. **Robust** — Content must be robust enough to be interpreted by assistive technologies

### 1.3. Business Justification

Implementing accessibility in MVP provides:

- **Expanded audience reach:** 15-20% of the population has some form of disability
- **Improved SEO:** Search engines rank accessible sites higher
- **Legal compliance:** Reduces risk of accessibility-related legal issues
- **Better usability:** Accessible interfaces benefit all users

### 1.4. Priority User Scenarios for MVP

The following user flows must be supported where applicable with accessibility features:

| User Flow | Priority | Accessibility Requirements |
|-----------|----------|---------------------------|
| Search for storage facility | Critical | Keyboard navigation, screen reader support, high contrast |
| Browse facility catalog | Critical | Keyboard-accessible filters, ARIA labels on cards |
| View facility details | Critical | Alt text for images, accessible photo gallery |
| Submit booking request | Critical | Form validation for screen readers, clear error messages |
| Operator dashboard | High | Accessible tables, keyboard-accessible forms |
| Map interaction | Medium | Alternative list view, simplified keyboard navigation |

### 1.5. Target Metrics for MVP

| Metric | Target Value | Verification Method |
|--------|--------------|---------------------|
| Lighthouse Accessibility Score | ≥ 90 | Chrome DevTools |
| WAVE Critical Errors | 0 | WAVE Browser Extension |
| Keyboard Navigation Coverage | 100% (critical paths) | Manual testing |
| Screen Reader Compatibility | Functional with NVDA/JAWS | Manual testing |
| Color Contrast Ratio | 4.5:1 (text), 3:1 (UI) | Contrast Checker |

---

## 2. WCAG 2.1 Compliance Requirements

### 2.1. WCAG Levels Overview

WCAG (Web Content Accessibility Guidelines) defines three conformance levels:

| Level | Description | MVP Requirement |
|-------|-------------|-----------------|
| Level A | Minimum accessibility | ✅ Full compliance required |
| Level AA | Recommended for most sites | ✅ Required for critical flows |
| Level AAA | Highest level | ❌ Out of MVP scope |

### 2.2. WCAG 2.1 Level A Requirements (Mandatory for MVP)

All Level A success criteria must be supported where applicable in MVP user-facing features:

| Criterion | ID | Description | MVP Implementation |
|-----------|-----|-------------|-------------------|
| Non-text Content | 1.1.1 | Alt text for images | Required for all facility photos and icons |
| Audio-only/Video-only | 1.2.1 | Alternative for media | Transcripts for video tours (if present) |
| Info and Relationships | 1.3.1 | Semantic HTML5 markup | Use `<header>`, `<nav>`, `<main>`, `<section>`, `<article>` |
| Meaningful Sequence | 1.3.2 | Logical reading order | CSS Grid/Flexbox without breaking DOM order |
| Keyboard Accessible | 2.1.1 | All functionality via keyboard | Support Tab, Enter, Space, Arrow keys |
| No Keyboard Trap | 2.1.2 | Can exit all elements | Esc for modals, Tab for all components |
| Pause, Stop, Hide | 2.2.2 | Control moving content | Disable carousel auto-scroll |
| Three Flashes or Below | 2.3.1 | Avoid flashing content | No flashing elements >3 times/second |
| Bypass Blocks | 2.4.1 | Skip navigation links | "Skip to content" link |
| Page Titled | 2.4.2 | Unique `<title>` per page | Dynamic titles via framework |
| Focus Order | 2.4.3 | Logical tab order | Natural DOM order |
| Link Purpose (In Context) | 2.4.4 | Descriptive link text | "View details for Facility X" vs "View details" |
| Language of Page | 3.1.1 | `<html lang="">` attribute | Set for all pages |
| On Focus | 3.2.1 | Focus doesn't trigger changes | No form auto-submit on Tab |
| On Input | 3.2.2 | Input changes don't auto-submit | Submit only via button click |
| Error Identification | 3.3.1 | Clear error descriptions | "Enter valid email address" |
| Labels or Instructions | 3.3.2 | Labels for input fields | `<label>` associated with `<input>` |
| Parsing | 4.1.1 | Valid HTML | No duplicate IDs, proper tag closure |
| Name, Role, Value | 4.1.2 | Correct ARIA attributes | aria-label, aria-labelledby for custom elements |

### 2.3. WCAG 2.1 Level AA Requirements (Required for Critical Flows)

The following Level AA criteria must be supported where applicable for MVP critical user paths:

| Criterion | ID | Description | MVP Implementation |
|-----------|-----|-------------|-------------------|
| Contrast (Minimum) | 1.4.3 | 4.5:1 for text, 3:1 for UI | Required for all text and UI elements |
| Resize Text | 1.4.4 | 200% zoom without loss of function | Responsive design, em/rem units |
| Images of Text | 1.4.5 | Use real text, not images | No text in images (except logos) |
| Multiple Ways | 2.4.5 | >1 way to find pages | Search + catalog + map + navigation |
| Headings and Labels | 2.4.6 | Descriptive headings/labels | H1-H6 hierarchy, clear labels |
| Focus Visible | 2.4.7 | Clear visual focus indicator | Outline/ring for interactive elements |
| Language of Parts | 3.1.2 | lang attribute for alternate language | Where technically feasible |
| Consistent Navigation | 3.2.3 | Navigation in same order | Consistent menu across pages |
| Consistent Identification | 3.2.4 | Same elements work same way | Uniform buttons, icons |
| Error Suggestion | 3.3.3 | Guidance for error correction | "Enter email as: user@example.com" |
| Error Prevention | 3.3.4 | Confirmation for critical actions | Confirm booking cancellation |
| Status Messages | 4.1.3 | aria-live for dynamic updates | Basic notifications only |

---

## 3. Technical Implementation Requirements

### 3.1. Semantic HTML Structure

All pages must use proper semantic HTML5 elements:

```html
<header>
  <nav aria-label="Main navigation">
    <!-- Navigation items -->
  </nav>
</header>

<main id="main-content">
  <section aria-labelledby="search-heading">
    <h1 id="search-heading">Search Storage Facilities</h1>
    <!-- Search content -->
  </section>
</main>

<footer>
  <!-- Footer content -->
</footer>
```

**Requirements:**
- One `<main>` element per page
- Proper heading hierarchy (H1 → H2 → H3, no skipping levels)
- Landmark regions for major page sections
- No presentational elements (`<div>` and `<span>` for layout only)

### 3.2. Keyboard Navigation Standards

All interactive elements must be keyboard accessible:

**Supported Keys:**
- `Tab` / `Shift+Tab` — Navigate forward/backward
- `Enter` / `Space` — Activate buttons/links
- `Esc` — Close modals/dialogs
- `Arrow keys` — Navigate menus, carousels, lists
- `Home` / `End` — Jump to start/end (where applicable)

**Focus Management:**
- Visible focus indicator (minimum 2px outline or equivalent)
- Logical tab order following visual flow
- Focus trap within modal dialogs
- Focus return to trigger element when closing modals
- Skip links at page start ("Skip to main content")

**Implementation Example:**
```jsx
// Modal with focus trap
<dialog
  role="dialog"
  aria-labelledby="modal-title"
  aria-modal="true"
  onKeyDown={(e) => {
    if (e.key === 'Escape') closeModal();
  }}
>
  <h2 id="modal-title">Booking Confirmation</h2>
  <button onClick={closeModal}>Confirm</button>
  <button onClick={closeModal}>Cancel</button>
</dialog>
```

### 3.3. ARIA Attributes Usage

Use ARIA attributes to enhance accessibility where semantic HTML is insufficient:

**Common ARIA Patterns:**

| Pattern | Implementation | Use Case |
|---------|----------------|----------|
| `aria-label` | `<button aria-label="Close dialog">×</button>` | Non-text buttons |
| `aria-labelledby` | `<section aria-labelledby="section-heading">` | Associate heading with section |
| `aria-describedby` | `<input aria-describedby="email-help">` | Link input to help text |
| `aria-expanded` | `<button aria-expanded="false">Menu</button>` | Collapsible content |
| `aria-hidden` | `<span aria-hidden="true">🔍</span>` | Hide decorative content |
| `aria-live` | `<div aria-live="polite">Status updated</div>` | Dynamic content updates |
| `aria-current` | `<a aria-current="page">Current Page</a>` | Current page in navigation |

**ARIA Restrictions:**
- Prefer semantic HTML over ARIA
- Never override native semantics unnecessarily
- Test with screen readers to verify behavior

### 3.4. Form Accessibility

All forms must meet these requirements:

**Label Association:**
```html
<!-- Explicit association (preferred) -->
<label for="email">Email Address</label>
<input type="email" id="email" name="email" required>

<!-- Implicit association (acceptable) -->
<label>
  Email Address
  <input type="email" name="email" required>
</label>
```

**Error Handling:**
```html
<label for="phone">Phone Number</label>
<input
  type="tel"
  id="phone"
  aria-describedby="phone-error"
  aria-invalid="true"
  required
>
<span id="phone-error" role="alert">
  Please enter a valid 10-digit phone number
</span>
```

**Required Field Indicators:**
- Visual indicator (asterisk or "Required" text)
- `required` attribute on input
- `aria-required="true"` as backup

**Validation Messages:**
- Clear, specific error descriptions
- Associated with inputs via `aria-describedby`
- Announced by screen readers via `role="alert"`

### 3.5. Color and Contrast Requirements

**Minimum Contrast Ratios:**
- Normal text (< 18pt): 4.5:1
- Large text (≥ 18pt or 14pt bold): 3:1
- UI components and graphical objects: 3:1
- Inactive/disabled elements: No requirement

**Color Usage:**
- Never rely on color alone to convey information
- Supplement color with icons, patterns, or text
- Ensure sufficient contrast in all states (default, hover, focus, active)

**Verification:**
- Use Chrome DevTools Contrast Checker
- Test with grayscale filter
- Validate against WCAG contrast formulas

### 3.6. Text and Typography

**Scalability:**
- Use relative units (em, rem, %) for font sizes
- Ensure text remains readable at 200% zoom
- No horizontal scrolling at 200% zoom (where technically feasible)
- Maintain functionality when text spacing is adjusted

**Readability:**
- Minimum font size: 16px for body text
- Line height: 1.5 for body text
- Paragraph width: 80 characters maximum recommended
- Avoid justified text alignment

### 3.7. Images and Media

**Alternative Text:**
```html
<!-- Informative image -->
<img src="warehouse-interior.jpg" alt="Spacious warehouse interior with climate control units">

<!-- Decorative image -->
<img src="decorative-pattern.jpg" alt="" role="presentation">

<!-- Complex image (e.g., chart) -->
<img src="pricing-chart.jpg" alt="Pricing comparison chart" aria-describedby="chart-description">
<div id="chart-description">
  Detailed chart description...
</div>
```

**Media Requirements:**
- Alt text for all informative images
- Empty alt (`alt=""`) for decorative images
- Captions/transcripts for video content (if present in MVP)
- Ensure media players are keyboard accessible

### 3.8. Interactive Components

**Buttons:**
```html
<!-- Standard button -->
<button type="button" onClick={handleClick}>
  Search Facilities
</button>

<!-- Icon-only button -->
<button type="button" aria-label="Close" onClick={handleClose}>
  <svg aria-hidden="true">...</svg>
</button>
```

**Links:**
```html
<!-- Descriptive link -->
<a href="/facility/123">View details for Storage Unit 5x10</a>

<!-- External link -->
<a href="https://example.com" target="_blank" rel="noopener">
  External Site
  <span class="sr-only">(opens in new window)</span>
</a>
```

**Custom Components:**
- Implement proper ARIA roles and states
- Support keyboard interaction patterns
- Provide clear focus indicators
- Test with screen readers

### 3.9. Modal Dialogs and Overlays

**Required Behavior:**
- Focus trapped within modal when open
- Focus returned to trigger element when closed
- Closes on Esc key press
- Background content inert (`aria-hidden="true"`)
- Proper `role="dialog"` and `aria-modal="true"`

**Implementation Pattern:**
```jsx
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="dialog-title"
  onKeyDown={(e) => {
    if (e.key === 'Escape') handleClose();
  }}
>
  <h2 id="dialog-title">Confirm Action</h2>
  <!-- Dialog content -->
  <button onClick={handleConfirm}>Confirm</button>
  <button onClick={handleClose}>Cancel</button>
</div>
```

### 3.10. Responsive Design and Mobile Accessibility

**Touch Targets:**
- Minimum size: 44×44 pixels (iOS) or 48×48 pixels (Android)
- Adequate spacing between touch targets
- Ensure tap targets don't overlap

**Mobile-Specific:**
- Support both portrait and landscape orientations
- Ensure zoom is not disabled (`user-scalable=yes`)
- Test with mobile screen readers (TalkBack, VoiceOver)
- Avoid fixed positioning that interferes with zoom

**Viewport Configuration:**
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=yes">
```

---

## 4. Testing Requirements

### 4.1. Automated Testing

**Required Tools:**
- **Lighthouse** (Chrome DevTools) — Minimum score: 90
- **axe DevTools** (Browser extension) — Zero critical violations
- **WAVE** (Browser extension) — Zero critical errors

**Testing Frequency:**
- Run automated tests on every major feature implementation
- Include accessibility checks in CI/CD pipeline where technically feasible

### 4.2. Manual Testing Requirements

**Keyboard Navigation Testing:**
- Test all interactive elements with keyboard only
- Verify logical tab order
- Ensure focus visibility at all times
- Verify Esc key closes modals
- Test arrow key navigation in carousels/menus

**Screen Reader Testing:**
- Test with NVDA (Windows) or JAWS
- Verify all content is announced correctly
- Check form labels and error messages
- Verify dynamic content updates
- Test at least critical user paths

**Contrast and Color Testing:**
- Verify contrast ratios with DevTools
- Test interface in grayscale mode
- Ensure information isn't conveyed by color alone

**Zoom and Text Scaling:**
- Test at 200% browser zoom
- Verify no loss of functionality
- Check for horizontal scrolling issues

### 4.3. Testing Checklist for MVP Critical Flows

| # | Test Item | Method | Expected Result |
|---|-----------|--------|-----------------|
| 1 | All images have alt text | Automated (WAVE) | Pass |
| 2 | Form labels associated with inputs | Automated (axe) | Pass |
| 3 | Color contrast ≥ 4.5:1 (text) | Automated (Lighthouse) | Pass |
| 4 | Page has H1 heading | Automated (WAVE) | Pass |
| 5 | Skip link present | Manual | Functional |
| 6 | Tab order logical | Manual | Correct sequence |
| 7 | Focus always visible | Manual | Clear indicator |
| 8 | Esc closes modals | Manual | Works |
| 9 | Screen reader announces page title | Screen reader | Correct |
| 10 | Form errors announced | Screen reader | Clear messages |
| 11 | Custom controls keyboard accessible | Manual | Fully operable |
| 12 | No keyboard traps | Manual | Can exit all elements |
| 13 | Dynamic content updates announced | Screen reader | Appropriate timing |
| 14 | Interface usable at 200% zoom | Manual | No functionality loss |
| 15 | Touch targets ≥ 44px (mobile) | Manual | Adequate size |

### 4.4. Acceptance Criteria

A feature or page meets MVP accessibility requirements when:

✅ Lighthouse accessibility score ≥ 90  
✅ Zero critical WAVE errors  
✅ Zero critical axe violations  
✅ All critical user paths keyboard accessible  
✅ Screen reader testing passes for critical flows  
✅ All form inputs have associated labels  
✅ Color contrast meets 4.5:1 minimum  
✅ Testing checklist completed with no blocking issues

---

## 5. Integration with Development Process

### 5.1. Design Phase

Designers should:
- Use accessibility-compliant design system components
- Verify color contrast during design
- Include focus states in mockups
- Document keyboard interaction patterns for custom components

### 5.2. Development Phase

Developers must:
- Implement semantic HTML structure
- Add ARIA attributes where needed
- Test keyboard navigation during development
- Run automated accessibility tests before code review

### 5.3. Quality Assurance Phase

QA engineers should:
- Include accessibility testing in test plans
- Run automated tools on all pages
- Perform manual keyboard navigation testing
- Conduct basic screen reader testing for critical flows
- Verify against accessibility checklist

### 5.4. Definition of Done

Accessibility requirements are part of the Definition of Done. A user story/feature is not complete unless:

- Automated accessibility tests pass
- Manual keyboard testing completed
- Screen reader compatibility verified (for critical flows)
- No critical accessibility violations remain
- Documentation updated if new patterns introduced

---

## 6. Known Limitations and Constraints (MVP)

The following items are acknowledged limitations of MVP v1:

**Limited in MVP:**
- Complex aria-live regions for real-time updates — only basic notifications supported
- Full keyboard navigation of interactive maps — alternative list view provided
- Advanced screen magnifier optimization — basic text scaling supported
- Multiple color themes — single high-contrast default theme only
- Video accessibility features — basic transcripts only (if video present)

**Not Supported in MVP:**
- Voice control/speech input
- Switch access/alternative input devices
- Gesture-based navigation (beyond standard touch)
- WCAG 2.1 Level AAA requirements
- Full real-time collaborative editing accessibility

These limitations do not prevent MVP from achieving WCAG 2.1 Level AA compliance for essential user flows.

---

## 7. Compliance and Legal Considerations

### 7.1. Applicable Standards

MVP must meet or exceed:
- WCAG 2.1 Level A (full compliance)
- WCAG 2.1 Level AA (critical user paths)

### 7.2. Regional Requirements

When operating in specific regions, additional requirements may apply:
- **USA:** Section 508, ADA Title III
- **EU:** EN 301 549, Web Accessibility Directive
- **Russia:** Federal Law No. 419-FZ

**Note:** Regional legal compliance is beyond the scope of this technical document. Legal and compliance teams should evaluate specific requirements based on target markets.

### 7.3. Accessibility Statement

The platform should include an accessibility statement page describing:
- Conformance level (WCAG 2.1 Level AA)
- Known limitations
- Contact information for accessibility feedback
- Date of last evaluation

---

## 8. Maintenance and Updates

### 8.1. Ongoing Requirements

- Run automated accessibility tests regularly
- Address critical accessibility issues promptly
- Document accessibility considerations for new features
- Update accessibility statement as platform evolves

### 8.2. Feedback Mechanism

Provide users with a way to report accessibility issues:
- Dedicated feedback email or form
- Clear process for reporting issues
- Commitment to acknowledge and address reports

### 8.3. Continuous Improvement

While organizational processes are handled separately, the platform should be designed to facilitate:
- Regular automated testing
- Periodic manual audits
- Integration of accessibility into development workflow
- Tracking and resolution of accessibility issues

---

## Appendix: Post-MVP Accessibility Considerations (Non-Canonical)

**⚠️ NOTICE: This appendix describes potential future enhancements and is NOT part of the canonical MVP specification. These items are not commitments and are subject to change based on business priorities.**

### Potential Enhancements Beyond MVP

The following features could enhance accessibility in future releases but are explicitly out of scope for MVP v1:

**Advanced Input Methods:**
- Voice control via Web Speech API
- Switch access support
- Advanced gesture recognition

**Enhanced Visual Options:**
- User-selectable color themes
- Enhanced high-contrast mode (7:1 ratios)
- Customizable text spacing and typography

**Improved Screen Reader Support:**
- Complex aria-live regions for real-time updates
- Enhanced landmark navigation
- Expanded audio descriptions for media

**Interactive Map Accessibility:**
- Full keyboard navigation of map features
- Enhanced alternative list views
- Screen reader announcements for map interactions

**Advanced Media Features:**
- Sign language interpretation
- Extended audio descriptions
- Automatic captioning for user-generated content

**Personalization:**
- User preference storage for accessibility settings
- Adaptive interface based on detected needs
- Simplified/reduced-motion modes

**Higher WCAG Conformance:**
- WCAG 2.1 Level AAA compliance
- WCAG 2.2 or later version compliance
- Emerging accessibility standards

### Assessment Considerations

When prioritizing future enhancements, consider:
- User research and feedback
- Regulatory requirements in target markets
- Technical feasibility and maintenance burden
- Return on investment and impact metrics
- Alignment with overall product roadmap

**These items should be evaluated and scoped separately as part of future planning cycles and do not represent committed features or timelines.**

---

## Document Control

**Change History:**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Dec 17, 2025 | Technical Documentation Team | Initial canonical version (MVP scope hardening) |

**Review Schedule:**
- Review after MVP launch
- Update as needed for post-MVP releases
- Align with WCAG updates and regulatory changes

**Related Documents:**
- Frontend_Architecture_Specification_v1_5_FINAL
- Design_System_Overview_MVP_v1
- Functional_Specification_MVP_v1_Complete
- QA & Testing Strategy (if available)

**Approval:**
- Technical Lead: [Pending]
- Frontend Lead: [Pending]
- Product Owner: [Pending]

---

**END OF DOCUMENT**
