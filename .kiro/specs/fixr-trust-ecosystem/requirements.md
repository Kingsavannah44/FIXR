# Requirements Document

## Introduction

The **FIXR Trust Ecosystem** is a cross-cutting module added to the FIXR Africa platform that addresses fraud, accountability, and efficiency gaps in housing, construction, and other service categories. The module introduces a verified-owner registry, an escrow payment layer, a project-monitoring system, and a category-extensible problem-solution framework. It integrates with the existing Node.js/Express backend, PostgreSQL schema, M-Pesa payments, Firebase Auth, JWT middleware, and React/Tailwind frontend.

---

## Glossary

- **Trust_Ecosystem**: The FIXR module that enforces identity verification, escrow, project monitoring, and bundled services across all platform categories.
- **Owner**: A landlord, property owner, or project sponsor who has completed identity verification.
- **Tenant**: A user seeking to rent or occupy a property listed on FIXR.
- **Fundi**: A craftsman, artisan, or skilled tradesperson engaged in a construction or renovation project.
- **Engineer**: A licensed professional (civil, structural, electrical, etc.) supervising a construction project.
- **Supervisor**: An Owner-appointed or FIXR-assigned site manager responsible for daily project oversight.
- **FIXR_Supervisor**: A FIXR-employed or FIXR-contracted quality agent who verifies and audits Supervisor reports.
- **Listing**: A rental property advertised on FIXR by a verified Owner.
- **Escrow_Account**: A ring-fenced wallet balance held by FIXR on behalf of a Tenant until release conditions are met.
- **Release_Condition**: A set of criteria (both-party confirmation, dispute expiry, or admin override) that triggers escrow fund release to the Owner.
- **Project**: A construction or renovation job tracked in the FIXR project-monitoring module.
- **Progress_Update**: A time-stamped record (text, photos, status) submitted by a Fundi or Supervisor against a Project.
- **Milestone**: A named, scheduled checkpoint in a Project with a defined completion criterion.
- **Category_Module**: A self-contained feature unit that maps a FIXR category (Housing, Construction, Transport, Events, etc.) to a problem-solution configuration.
- **Bundled_Service**: An ancillary service (cleaning, waste management, maintenance, fire safety, ambulance dispatch, CCTV setup) offered alongside a Listing.
- **KYC**: Know-Your-Customer identity verification process (government ID + phone + liveness check).
- **Dispute**: A formal disagreement raised by a Tenant or Owner that halts automatic escrow release.
- **Notification**: A push, email, or SMS alert sent to relevant users when platform events occur.
- **Dashboard**: A role-specific web interface displaying relevant data and actions.
- **API**: Application Programming Interface — the REST endpoints exposed by the FIXR backend.

---

## Requirements

### Requirement 1: Owner Identity Verification (KYC)

**User Story:** As a property owner, I want to complete identity verification once, so that my listings carry a verified badge that builds tenant trust.

#### Acceptance Criteria

1. WHEN an Owner submits a KYC request with a government ID image, selfie, and phone number, THE Trust_Ecosystem SHALL create a pending verification record linked to the Owner's user account.
2. WHEN an admin reviews and approves a KYC submission, THE Trust_Ecosystem SHALL mark the Owner's `is_verified` flag as `true` and issue a verification badge visible on all associated Listings.
3. IF an Owner attempts to create a Listing while `is_verified` is `false`, THEN THE Trust_Ecosystem SHALL reject the request with a descriptive error indicating verification is required.
4. WHEN a KYC submission is rejected by an admin, THE Trust_Ecosystem SHALL notify the Owner with the rejection reason and allow resubmission.
5. THE Trust_Ecosystem SHALL store KYC documents with end-to-end encryption and restrict access to admin roles only.
6. WHEN an Owner's verification status changes, THE Trust_Ecosystem SHALL send a Notification to the Owner via their registered email and phone.

---

### Requirement 2: Verified Property Listings

**User Story:** As a tenant, I want to browse only verified property listings, so that I am protected from fraudulent adverts.

#### Acceptance Criteria

1. THE Trust_Ecosystem SHALL expose a listings API that returns only Listings whose Owner has `is_verified = true` by default.
2. WHEN a Tenant views a Listing, THE Trust_Ecosystem SHALL display the Owner's verified badge, full name (as on government ID), and contact availability status.
3. WHEN a Listing is created by a verified Owner, THE Trust_Ecosystem SHALL require title, location, rent amount, property type, photos (minimum one), and available bundled services.
4. IF a required Listing field is missing or invalid, THEN THE Trust_Ecosystem SHALL return a structured validation error listing each missing field.
5. WHERE a Listing includes Bundled_Services, THE Trust_Ecosystem SHALL display service names, pricing, and provider details alongside the property information.
6. WHEN an Owner deactivates a Listing, THE Trust_Ecosystem SHALL prevent it from appearing in any search result and cancel any pending Escrow_Accounts associated with that Listing.

---

### Requirement 3: Escrow Payment System

**User Story:** As a tenant, I want my rental deposit held securely in escrow until I confirm the property is as advertised, so that I am protected from losing money to fraud.

#### Acceptance Criteria

1. WHEN a Tenant initiates a deposit payment for a Listing, THE Trust_Ecosystem SHALL create an Escrow_Account holding the funds in a ring-fenced wallet balance separate from the Owner's available balance.
2. WHEN both the Tenant and Owner confirm the tenancy agreement, THE Trust_Ecosystem SHALL release the escrowed funds to the Owner's wallet and update the Escrow_Account status to `released`.
3. WHEN a Tenant raises a Dispute within 72 hours of deposit, THE Trust_Ecosystem SHALL freeze the Escrow_Account and notify both parties and an admin.
4. IF a Dispute is not raised and neither party confirms within 7 days of deposit, THEN THE Trust_Ecosystem SHALL automatically release the escrow funds to the Owner and close the Escrow_Account.
5. WHEN an admin resolves a Dispute in the Tenant's favour, THE Trust_Ecosystem SHALL refund the full escrowed amount to the Tenant's wallet within one business day.
6. WHEN an admin resolves a Dispute in the Owner's favour, THE Trust_Ecosystem SHALL release the escrowed amount to the Owner's wallet.
7. THE Trust_Ecosystem SHALL record every escrow state transition (created, confirmed, disputed, released, refunded) with a timestamp, actor, and reason.
8. WHEN an escrow payment is initiated via M-Pesa, THE Trust_Ecosystem SHALL use the existing M-Pesa STK Push service and tag the resulting payment record with `type = 'escrow'`.

---

### Requirement 4: Tenant–Owner Direct Communication

**User Story:** As a tenant, I want to message the property owner directly through FIXR, so that I can ask questions and negotiate terms without involving unverified middlemen.

#### Acceptance Criteria

1. WHEN a Tenant sends a message to an Owner via a Listing, THE Trust_Ecosystem SHALL create a message thread linked to that Listing and store the message with sender, timestamp, and content.
2. WHEN a new message arrives in a thread, THE Trust_Ecosystem SHALL send a Notification to the recipient via push and email.
3. THE Trust_Ecosystem SHALL enforce that only the Tenant or Owner of a Listing thread may read or send messages in that thread.
4. IF a user attempts to access a message thread they are not a party to, THEN THE Trust_Ecosystem SHALL return a 403 Forbidden error.
5. WHEN a message thread is created, THE Trust_Ecosystem SHALL generate a unique thread identifier and link it to the associated Listing.
6. THE Trust_Ecosystem SHALL store all message content encrypted at rest.

---

### Requirement 5: Bundled Property Services

**User Story:** As a landlord, I want to offer bundled services (cleaning, waste management, maintenance, fire safety, ambulance, CCTV) with my property listing, so that I can attract tenants with a comprehensive package.

#### Acceptance Criteria

1. THE Trust_Ecosystem SHALL maintain a catalogue of Bundled_Service types: `cleaning`, `waste_management`, `maintenance`, `fire_safety`, `ambulance`, `cctv_setup`.
2. WHEN an Owner creates or edits a Listing, THE Trust_Ecosystem SHALL allow the Owner to attach zero or more Bundled_Services with a price and provider description for each.
3. WHEN a Tenant books a Listing, THE Trust_Ecosystem SHALL allow the Tenant to select which Bundled_Services to include, and add their costs to the escrow amount.
4. WHEN a Bundled_Service is selected at booking time, THE Trust_Ecosystem SHALL record the service, price, and provider against the tenancy record.
5. IF an Owner removes a Bundled_Service that is already part of a confirmed tenancy, THEN THE Trust_Ecosystem SHALL preserve the original service record for that tenancy and notify the Tenant of the change.

---

### Requirement 6: Project Creation and Participant Management

**User Story:** As a property owner or project sponsor, I want to create a construction project on FIXR and assign fundis, engineers, and supervisors, so that all parties work within a structured accountability framework.

#### Acceptance Criteria

1. WHEN an Owner creates a Project, THE Trust_Ecosystem SHALL require project name, description, location, start date, estimated end date, and budget.
2. WHEN a Project is created, THE Trust_Ecosystem SHALL assign it a unique Project ID and set its initial status to `planning`.
3. WHEN an Owner assigns a Fundi, Engineer, or Supervisor to a Project, THE Trust_Ecosystem SHALL create a project membership record with the user's role on that Project.
4. IF a user assigned to a Project does not hold a valid FIXR account, THEN THE Trust_Ecosystem SHALL reject the assignment and return a descriptive error.
5. WHEN a Project transitions from `planning` to `active`, THE Trust_Ecosystem SHALL send Notifications to all assigned project members.
6. THE Trust_Ecosystem SHALL enforce that only the Owner or a FIXR_Supervisor may change a Project's status.

---

### Requirement 7: Daily Progress Updates

**User Story:** As a fundi or supervisor, I want to submit daily progress reports with photos, so that the project owner and FIXR have real-time visibility into site activity.

#### Acceptance Criteria

1. WHEN a Fundi or Supervisor submits a Progress_Update, THE Trust_Ecosystem SHALL record the update with timestamp, submitter ID, Project ID, text description, and zero or more photo URLs.
2. WHEN a Progress_Update is submitted, THE Trust_Ecosystem SHALL send a Notification to the Project Owner and all Engineers on that Project.
3. THE Trust_Ecosystem SHALL allow exactly one Progress_Update per Fundi per Project per calendar day.
4. IF a Fundi attempts to submit a second Progress_Update on the same calendar day for the same Project, THEN THE Trust_Ecosystem SHALL reject the submission with a descriptive error.
5. WHEN a Project Owner reviews a Progress_Update, THE Trust_Ecosystem SHALL record the review timestamp and reviewer ID.
6. THE Trust_Ecosystem SHALL expose an API endpoint that returns all Progress_Updates for a Project ordered by submission timestamp descending.

---

### Requirement 8: Milestone Tracking and Alerts

**User Story:** As a project owner, I want to define project milestones and receive real-time alerts when they are reached, delayed, or at risk, so that I can take corrective action immediately.

#### Acceptance Criteria

1. WHEN an Owner or Engineer creates a Milestone for a Project, THE Trust_Ecosystem SHALL record the milestone name, target date, and completion criteria.
2. WHEN a Milestone's target date passes without being marked complete, THE Trust_Ecosystem SHALL send a delay Notification to the Owner, Engineer, and FIXR_Supervisor.
3. WHEN a Supervisor marks a Milestone as complete, THE Trust_Ecosystem SHALL record the completion timestamp, mark the Milestone as `completed`, and send a Notification to the Owner.
4. IF a Project has more than 30% of its Milestones overdue, THEN THE Trust_Ecosystem SHALL escalate by sending a high-priority Notification to the Owner and flagging the Project for FIXR_Supervisor review.
5. THE Trust_Ecosystem SHALL expose a Project dashboard API endpoint that returns the Project summary including status, budget, completion percentage, upcoming Milestones, and overdue Milestones.

---

### Requirement 9: FIXR Supervisor Oversight

**User Story:** As a FIXR quality assurance agent, I want to audit supervisor reports and flag accountability issues, so that project owners receive honest, tamper-proof progress data.

#### Acceptance Criteria

1. WHEN a FIXR_Supervisor audits a Progress_Update, THE Trust_Ecosystem SHALL record the audit result (`approved`, `flagged`, `requires_revision`) with the auditor's ID, timestamp, and notes.
2. WHEN a Progress_Update is flagged by a FIXR_Supervisor, THE Trust_Ecosystem SHALL send a Notification to the Supervisor who submitted it and to the Project Owner.
3. THE Trust_Ecosystem SHALL prevent Supervisors from editing a Progress_Update after it has been audited by a FIXR_Supervisor.
4. IF a Supervisor has three or more flagged Progress_Updates within a single Project, THEN THE Trust_Ecosystem SHALL automatically suspend that Supervisor from submitting further updates on that Project and notify the Owner.
5. THE Trust_Ecosystem SHALL expose an audit history API endpoint for each Project accessible only to the Project Owner and FIXR_Supervisor roles.

---

### Requirement 10: Category Module Framework

**User Story:** As a FIXR platform developer, I want a standardised module structure for each service category, so that new categories can be added without modifying existing category logic.

#### Acceptance Criteria

1. THE Trust_Ecosystem SHALL define a Category_Module configuration schema with fields: `category_id`, `category_name`, `problem_statement`, `solution_components`, `required_roles`, and `enabled`.
2. WHEN a new Category_Module configuration is registered via the admin API, THE Trust_Ecosystem SHALL validate all required fields and persist the module, making its routes and data models available without restarting the service.
3. WHEN a Category_Module is disabled, THE Trust_Ecosystem SHALL return a 503 Service Unavailable response for all API endpoints belonging to that module.
4. THE Trust_Ecosystem SHALL ship with pre-configured Category_Modules for: `housing`, `construction`, `transport`, `learning`, `events`.
5. WHEN the admin queries the module registry API, THE Trust_Ecosystem SHALL return a list of all registered Category_Modules with their `enabled` status and `solution_components` summary.
6. IF a request is made to a Category_Module API endpoint and the module's `enabled` flag is `false`, THEN THE Trust_Ecosystem SHALL return a 503 error with a message indicating the module is temporarily unavailable.

---

### Requirement 11: Notification Service

**User Story:** As a platform user, I want to receive timely push, email, and SMS notifications for all relevant trust and project events, so that I am always informed and can act quickly.

#### Acceptance Criteria

1. THE Trust_Ecosystem SHALL support three Notification channels: `push`, `email`, and `sms`.
2. WHEN a notification event is triggered, THE Trust_Ecosystem SHALL dispatch the Notification on all channels that the recipient user has enabled in their preferences.
3. WHEN a Notification fails to deliver on one channel, THE Trust_Ecosystem SHALL log the failure with channel, recipient ID, event type, and timestamp, and retry delivery up to three times with exponential backoff.
4. THE Trust_Ecosystem SHALL expose a user-facing API endpoint that returns the recipient's 50 most recent Notifications ordered by timestamp descending.
5. WHEN a user marks a Notification as read, THE Trust_Ecosystem SHALL update the `read_at` timestamp on that Notification record.
6. IF a Notification event requires urgent action (Dispute raised, Milestone overdue, Supervisor suspended), THEN THE Trust_Ecosystem SHALL mark it as `priority = high` and send it on all enabled channels regardless of user channel preferences.

---

### Requirement 12: Owner and Tenant Dashboards

**User Story:** As an owner or tenant, I want a personalised dashboard that shows all my active listings, escrow balances, project statuses, and notifications in one place, so that I can manage everything efficiently.

#### Acceptance Criteria

1. WHEN an Owner accesses the Owner Dashboard, THE Trust_Ecosystem SHALL display: active Listings count, total escrowed funds, total released funds, active Projects, overdue Milestones count, and unread Notifications.
2. WHEN a Tenant accesses the Tenant Dashboard, THE Trust_Ecosystem SHALL display: active Listing enquiries, Escrow_Account balances by Listing, open Disputes, and unread Notifications.
3. THE Trust_Ecosystem SHALL provide a single API endpoint per dashboard role that aggregates all required data in a single response.
4. WHEN dashboard data is requested, THE Trust_Ecosystem SHALL return a response within 2 000 milliseconds under normal load conditions.
5. WHEN real-time events (new message, escrow update, milestone alert) occur, THE Trust_Ecosystem SHALL push a websocket event to connected Dashboard clients for instant UI updates.
