# FIXR Africa 🌍

> Kenya's all-in-one platform connecting students, gig workers, professionals, SMEs, farmers, cooperatives, government, and diaspora.

## Project Structure

```
FIXR/
├── fixr-backend/          # Node.js + Express + PostgreSQL API
│   ├── src/
│   │   ├── index.js       # App entry point
│   │   ├── db/            # PostgreSQL client + schema + migrations
│   │   ├── routes/        # auth, users, gigs, learning, payments, ai, analytics
│   │   ├── middleware/     # JWT auth, role guard
│   │   └── services/      # M-Pesa Daraja API
│   └── render.yaml        # Render deployment config
│
├── fixr-frontend/         # React + Tailwind + Vite
│   ├── src/
│   │   ├── pages/         # Home, Register, Login, GigMarketplace, LearningCenter...
│   │   ├── components/    # Navbar, UI primitives
│   │   ├── context/       # AuthContext (JWT)
│   │   └── api/           # Axios client
│   └── netlify.toml       # Netlify deployment config
│
├── ARCHITECTURE.md        # System diagram + workflow + DPA compliance
└── WIREFRAMES.md          # ASCII wireframes for all key pages
```

## Quick Start

### Backend
```bash
cd fixr-backend
cp .env.example .env        # fill in your values
npm install
npm run db:migrate          # runs schema.sql against your PostgreSQL
npm run dev                 # starts on :5000
```

### Frontend
```bash
cd fixr-frontend
cp .env.example .env        # set VITE_API_URL=http://localhost:5000/api
npm install
npm run dev                 # starts on :5173
```

## API Endpoints

| Method | Endpoint                          | Auth | Description                  |
|--------|-----------------------------------|------|------------------------------|
| POST   | /api/auth/register                | –    | Register (email/phone)       |
| POST   | /api/auth/login                   | –    | Login                        |
| POST   | /api/auth/google                  | –    | Google OAuth exchange        |
| POST   | /api/auth/firebase                | –    | Firebase ID token exchange   |
| GET    | /api/users/me                     | ✅   | My profile + skills          |
| PATCH  | /api/users/me                     | ✅   | Update profile / skills      |
| GET    | /api/gigs                         | –    | List gigs (filter by cat.)   |
| POST   | /api/gigs                         | ✅   | Post a gig                   |
| POST   | /api/gigs/:id/apply               | ✅   | Apply for gig                |
| GET    | /api/gigs/:id/applications        | ✅   | View applicants (poster)     |
| GET    | /api/learning/courses             | –    | List courses                 |
| POST   | /api/learning/courses/:id/enroll  | ✅   | Enroll in course             |
| PATCH  | /api/learning/courses/:id/progress| ✅   | Update progress + earn pts   |
| POST   | /api/payments/mpesa/stkpush       | ✅   | Initiate M-Pesa STK Push     |
| POST   | /api/payments/mpesa/callback      | –    | M-Pesa webhook               |
| POST   | /api/ai/cv-builder                | ✅   | Generate CV                  |
| POST   | /api/ai/gig-pricing               | ✅   | Get pricing recommendation   |
| GET    | /api/ai/learning-recommendations  | ✅   | Personalized course recs     |
| GET    | /api/analytics/overview           | ✅🔒 | Platform analytics (admin)   |

## Phase Roadmap

- **Phase 1** ✅ Auth + Gig Marketplace + Learning Center + Points
- **Phase 2** ✅ AI Tools (CV, Pricing, Recommendations) + M-Pesa + Business Dashboard
- **Phase 3** 🔜 Admin panel, public API gateway, Redis caching, real-time notifications
- **Phase 4** 🔜 Multi-country (UG, TZ, RW, GH, NG), Flutterwave, i18n, AI gig matching

## Compliance

- Kenya DPA 2022: optional PII fields, consent at registration, right to erasure endpoint
- Data residency: migrate to AWS af-south-1 (Cape Town) for Phase 3+
- Rate limiting: 100 req / 15 min per IP on all `/api` routes

## Deployment

| Service  | Platform | Config          |
|----------|----------|-----------------|
| Frontend | Netlify  | `netlify.toml`  |
| Backend  | Render   | `render.yaml`   |
| Database | Render PostgreSQL or Supabase | `DATABASE_URL` |
