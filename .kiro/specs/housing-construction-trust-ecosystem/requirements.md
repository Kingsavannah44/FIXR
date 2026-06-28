# Requirements: FIXR Housing & Construction Trust Ecosystem

## Overview
FIXR needs a trust + efficiency ecosystem for Housing and Construction categories that eliminates fraud, ensures payment security, provides project accountability, and is modular enough to extend to all other FIXR categories.

---

## Functional Requirements

### 1. Verified Owner Registry (Housing)

- **REQ-H1**: A landlord/property owner must complete identity verification before creating any property listing. Verification requires: national ID number, phone (OTP), and optionally a title deed or business registration document.
- **REQ-H2**: Verified owners receive a trust badge visible on their profile and all their listings.
- **REQ-H3**: Unverified users can browse listings but cannot create listings or initiate rental transactions.
- **REQ-H4**: FIXR admins can approve, reject, or revoke owner verification status. Revocation immediately hides all associated listings.
- **REQ-H5**: The system maintains an audit trail of all verification actions (submitted, approved, rejected, revoked) with timestamps and admin ID.

### 2. Property Listings

- **REQ-H6**: Verified owners can create property listings with: title, description, property type (apartment, house, bedsitter, commercial), rent amount (KES), deposit amount, location (county + area), photos (up to 10), available date, and bundled services offered.
- **REQ-H7**: Each listing displays the owner's verification badge, NationalID-verified status, and trust score.
- **REQ-H8**: Tenants can search and filter listings by: location, property type, price range, available date, and bundled services.
- **REQ-H9**: Tenants can save/bookmark listings.
- **REQ-H10**: Listings support a status of: `active`, `under_offer`, `rented`, `paused`, `removed`.

### 3. Escrow Payment System (Housing)

- **REQ-H11**: When a tenant expresses intent to rent, they initiate an escrow deposit covering: first month rent + security deposit.
- **REQ-H12**: Escrow funds are held by FIXR and not released to the landlord until both parties confirm the transaction (dual confirmation).
- **REQ-H13**: The escrow release conditions are: (a) tenant confirms move-in, AND (b) landlord confirms tenant has moved in. Both confirmations must occur within 14 days of escrow creation or funds are auto-refunded.
- **REQ-H14**: If the landlord cancels after escrow is funded, 100% of funds are refunded to the tenant within 24 hours.
- **REQ-H15**: If the tenant cancels after escrow is funded but before move-in confirmation, the landlord receives a cancellation fee of 10% of the deposit (configurable), and the remainder is refunded to the tenant.
- **REQ-H16**: The escrow system supports M-Pesa, card, and FIXR wallet as funding methods.
- **REQ-H17**: All escrow transactions have a status: `pending_payment`, `funded`, `released`, `refunded`, `disputed`.
- **REQ-H18**: Tenants and landlords can raise a dispute on any escrow transaction. Disputes are reviewed by FIXR admins.

### 4. Bundled Services (Housing)

- **REQ-H19**: Landlords can associate bundled services with a listing from a predefined catalogue: cleaning, waste management, maintenance, fire safety inspection, ambulance access, CCTV setup, internet, security guard, parking.
- **REQ-H20**: Each bundled service shows: name, description, included/paid-extra status, and provider name.
- **REQ-H21**: Tenants see bundled services prominently on the listing detail page.
- **REQ-H22**: The landlord's dashboard shows all active services per property and allows toggling them on/off.

### 5. Tenant–Owner Direct Messaging (Housing)

- **REQ-H23**: Once a tenant saves a listing or initiates an escrow, they can open a direct message thread with the landlord.
- **REQ-H24**: All messages are stored server-side and visible to both parties. FIXR does not intermediary the conversation but retains logs for dispute resolution.
- **REQ-H25**: Message threads are linked to a specific listing (not a general inbox), so context is always clear.
- **REQ-H26**: Both parties receive an in-app notification badge and optionally an email/SMS on new messages.

### 6. Construction Project Module

- **REQ-C1**: A project owner can create a construction project with: name, description, location, project type (residential, commercial, infrastructure, renovation), estimated start/end dates, total budget (KES), and assigned team members.
- **REQ-C2**: Team member roles in a project: `owner`, `engineer`, `supervisor`, `fundi` (craftsman), `fixr_inspector`.
- **REQ-C3**: Each project has a status: `planning`, `in_progress`, `on_hold`, `completed`, `cancelled`.
- **REQ-C4**: Project owners can invite team members by phone or email. Invited users receive a notification and must accept before gaining project access.

### 7. Progress Updates & Reporting (Construction)

- **REQ-C5**: Any team member with the `fundi`, `supervisor`, or `engineer` role can submit a progress update containing: title, description, phase (foundation, structure, roofing, finishing, electrical, plumbing, landscaping, other), percentage complete (0–100), photos (up to 5 per update), and timestamp.
- **REQ-C6**: Progress updates are immutable once submitted — they cannot be edited or deleted, ensuring an honest audit trail.
- **REQ-C7**: The project dashboard displays a chronological feed of all updates with photos, contributor name, role, and timestamp.
- **REQ-C8**: A visual progress bar aggregated across all updates is shown at the project level.
- **REQ-C9**: Project owners and engineers can download a PDF progress report (or JSON export) of all updates.

### 8. Supervision Tracking & FIXR Accountability (Construction)

- **REQ-C10**: FIXR assigns a `fixr_inspector` to high-value projects (budget > KES 500,000) or on-request for any project.
- **REQ-C11**: The `fixr_inspector` submits independent verification updates that are visually distinguished from contractor updates (separate tab and color coding).
- **REQ-C12**: If no progress update has been submitted for a project in 48 hours during `in_progress` status, the system automatically triggers an alert to: project owner, assigned engineer, and FIXR admin.
- **REQ-C13**: Supervisors have a supervision log: each day they are expected to submit at least one update. Missed submissions are flagged on their profile with a "supervision compliance score."
- **REQ-C14**: Milestone tracking: owners can define up to 10 milestones per project (e.g., "Foundation complete by Day 30"). The system tracks milestone status: `pending`, `achieved`, `overdue`.

### 9. Real-Time Alerts & Notifications (Construction)

- **REQ-C15**: The system sends real-time in-app alerts for: new progress update, milestone achieved, milestone overdue, 48-hour inactivity warning, dispute raised, payment released.
- **REQ-C16**: Alerts are delivered in-app (notification bell), and optionally via email. SMS support is architecture-ready (stub) for future integration.
- **REQ-C17**: All alerts have a read/unread status and can be dismissed.

### 10. Category-Based Problem-Solving Framework (Extensibility)

- **REQ-E1**: Each FIXR category (Housing, Construction, Transport, Learning, Events) is implemented as an independent module with its own backend routes, frontend pages, and DB tables — sharing only the users, payments, and wallets infrastructure.
- **REQ-E2**: A category module must implement a standard interface: `{ categoryId, displayName, problemStatement, solutionSummary, routes[], pages[], dbTables[] }`.
- **REQ-E3**: New categories can be registered without modifying existing category code. Only `index.js` (backend route mount) and `App.jsx` (frontend route registration) need to be updated.
- **REQ-E4**: The category registry is documented so any developer can follow the pattern to add a new category in under 1 day.

---

## Non-Functional Requirements

- **REQ-NF1**: All escrow payment operations must be idempotent — retrying the same payment request must not create duplicate transactions.
- **REQ-NF2**: Verification documents (ID photos, title deeds) must not be stored in the main database. They are stored as references (URLs) to a secure object store (currently mocked as a URL string; AWS S3-ready).
- **REQ-NF3**: All API endpoints for Housing and Construction modules must be protected by the existing JWT auth middleware.
- **REQ-NF4**: The mock DB must fully support all new tables and queries so the system runs in demo mode without a real PostgreSQL instance.
- **REQ-NF5**: The UI must follow the existing FIXR design system: dark theme (`bg-dark` = `#0D1B2A`), primary green (`#1B5E20`), accent gold (`#F9A825`), `.card`, `.input`, `.btn-primary`, `.btn-accent` classes.
- **REQ-NF6**: All new pages must be mobile-responsive.
- **REQ-NF7**: The system must handle concurrent escrow operations safely — two tenants cannot both fund escrow for the same listing simultaneously.

---

## User Stories

### Housing
- As a **landlord**, I want to verify my identity so tenants trust my listings are legitimate.
- As a **tenant**, I want my deposit held in escrow so I'm protected if the landlord is fraudulent.
- As a **tenant**, I want to message the landlord directly so I don't need to go through a middleman.
- As a **landlord**, I want to offer bundled services on my listing so I can charge a premium and differentiate.
- As a **FIXR admin**, I want to review verifications and disputes so I can protect users on both sides.

### Construction
- As a **project owner**, I want daily progress updates from my fundi so I know my project isn't stalling.
- As a **fundi**, I want to submit photo updates so my work is documented and I get paid without disputes.
- As an **engineer**, I want to see a milestone tracker so I can flag overdue phases early.
- As a **FIXR inspector**, I want to submit independent verification so owners have a trusted third-party view.
- As a **project owner**, I want automatic alerts if no update is submitted in 48 hours so I can intervene.

---

## Out of Scope (MVP)

- Real SMS gateway integration (architecture-ready stub only)
- File upload to real S3 (URLs are strings in demo mode)
- Real-time WebSocket messaging (polling every 30s in demo mode)
- Construction project payments / contractor payment milestone splits (Phase 2)
- Events and other category modules beyond Housing + Construction (framework documented, not built)
