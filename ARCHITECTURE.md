# FIXR Africa — System Architecture

## Architecture Diagram (ASCII)

```
┌─────────────────────────────────────────────────────────────────────┐
│                        FIXR AFRICA PLATFORM                         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────────────────┐    ┌───────────────────────────────┐  │
│  │      FRONTEND (React)    │    │     EXTERNAL SERVICES         │  │
│  │  Netlify CDN             │    │  ┌──────────────────────────┐ │  │
│  │  ┌────────────────────┐  │    │  │  M-Pesa Daraja API       │ │  │
│  │  │ Pages              │  │    │  │  (STK Push / Callbacks)  │ │  │
│  │  │ - Home             │  │    │  └──────────────────────────┘ │  │
│  │  │ - Gig Marketplace  │  │    │  ┌──────────────────────────┐ │  │
│  │  │ - Learning Center  │  │    │  │  Google OAuth 2.0        │ │  │
│  │  │ - AI Tools         │◄─┼────┼─►│                          │ │  │
│  │  │ - Business Dashboard│  │    │  └──────────────────────────┘ │  │
│  │  │ - Profile          │  │    │  ┌──────────────────────────┐ │  │
│  │  └────────────────────┘  │    │  │  Future: OpenAI / Gemini │ │  │
│  │  Tailwind CSS            │    │  └──────────────────────────┘ │  │
│  └──────────┬───────────────┘    └───────────────────────────────┘  │
│             │ HTTPS REST (Axios)                                     │
│             ▼                                                        │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │               API GATEWAY (Express + Rate Limiting)           │   │
│  │                   Render.com (Node.js)                        │   │
│  │  ┌─────────┐ ┌──────────┐ ┌───────────┐ ┌────────────────┐  │   │
│  │  │/auth    │ │/gigs     │ │/learning  │ │/payments       │  │   │
│  │  │register │ │list/post │ │courses    │ │mpesa STK push  │  │   │
│  │  │login    │ │apply     │ │enroll     │ │wallet          │  │   │
│  │  │google   │ │filter    │ │progress   │ │callback        │  │   │
│  │  └─────────┘ └──────────┘ └───────────┘ └────────────────┘  │   │
│  │  ┌──────────────────────┐  ┌──────────────────────────────┐  │   │
│  │  │/ai                   │  │/analytics                    │  │   │
│  │  │cv-builder            │  │overview (admin/sme)          │  │   │
│  │  │gig-pricing           │  │country breakdown             │  │   │
│  │  │recommendations       │  │event tracking                │  │   │
│  │  └──────────────────────┘  └──────────────────────────────┘  │   │
│  │                                                               │   │
│  │  Middleware: JWT Auth ─── Role Guard ─── Rate Limiter         │   │
│  └──────────────────────────┬───────────────────────────────────┘   │
│                             │ pg pool                                │
│                             ▼                                        │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │                  PostgreSQL Database                          │   │
│  │  Tables: users · user_skills · portfolio_items               │   │
│  │          gigs · gig_applications                             │   │
│  │          courses · enrollments                               │   │
│  │          payments · wallets · point_transactions             │   │
│  │          analytics_events                                    │   │
│  └──────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

## Phase Roadmap

| Phase | Focus                    | Key Features                                            |
|-------|--------------------------|----------------------------------------------------------|
| 1     | Foundation               | Auth, Gig Marketplace, Learning Center, Points           |
| 2     | AI + Business Tools      | CV Builder, Pricing Advisor, M-Pesa, Business Dashboard  |
| 3     | Scaling                  | Analytics, Rate Limiting, Admin Panel, Public API        |
| 4     | Multi-country Expansion  | 6 countries, AI matching, Verification, Corporate training|

## User Journey Workflow

```
Register/Login
    │
    ▼
Complete Profile (+20 pts)
    │
    ├──► Browse Gig Marketplace
    │        │
    │        ├── Apply for Gigs
    │        │       └── Payment via M-Pesa/Card/Wallet
    │        └── Post Gigs (SME/Business)
    │               └── Review Applications → Accept/Reject
    │
    ├──► Learning Center
    │        │
    │        ├── Browse/Search Courses
    │        ├── AI Recommendations
    │        ├── Enroll → Track Progress
    │        └── Complete → Earn Points (+10 pts)
    │
    ├──► AI Tools
    │        ├── Generate CV from Profile
    │        └── Get Gig Pricing Advice
    │
    ├──► Business Dashboard (SME/Gov/Admin)
    │        ├── Post Gigs
    │        ├── Manage Applications
    │        └── Analytics: Users, Revenue, Gigs, Courses
    │
    └──► Expansion (Phase 4)
             ├── Multi-country (KE, UG, TZ, RW, GH, NG)
             ├── AI Gig Matching
             └── Corporate Training & Contractor Marketplace
```

## Data Sovereignty — Kenya DPA 2022 Compliance

1. **Data Residency**: Host PostgreSQL in an African region (e.g. Render Frankfurt → migrate to AWS af-south-1 Cape Town for Phase 3).
2. **Consent**: Registration form includes explicit consent checkbox. Store `consented_at` timestamp per user.
3. **Right to Erasure**: Add `DELETE /api/users/me` endpoint that hard-deletes or anonymizes user PII.
4. **Data Minimization**: Only collect email/phone/name at registration. Location and bio are optional.
5. **Breach Notification**: Implement logging + alerting (Phase 3) via CloudWatch or Sentry.
6. **Cross-border transfers**: For multi-country Phase 4, ensure per-country data stays in regional DB shards.

## Multi-Country Localization

- `country` column on `users` and `analytics_events` tables enables per-country filtering.
- Currency localization: KES (Kenya), UGX (Uganda), TZS (Tanzania), RWF (Rwanda), GHS (Ghana), NGN (Nigeria).
- M-Pesa available in KE/TZ/UG; add Flutterwave/Paystack for GH/NG in Phase 4.
- i18n: Add `react-i18next` with locale files per country (Swahili for KE/TZ/UG).

## Scalability Recommendations

| Concern              | Solution                                                     |
|----------------------|--------------------------------------------------------------|
| DB bottleneck        | Add read replicas + connection pooling (PgBouncer)           |
| API throughput       | Horizontal scaling on Render or migrate to AWS ECS/Fargate   |
| File uploads         | Use AWS S3 + CloudFront for portfolios/avatars               |
| Real-time features   | Add Socket.io for live gig notifications (Phase 3)           |
| Search               | Add Elasticsearch or pg_search for gig/course full-text      |
| Caching              | Redis for session cache, hot gig listings, leaderboards      |
| AI scale             | Queue OpenAI calls via Bull/Redis job queue                  |
