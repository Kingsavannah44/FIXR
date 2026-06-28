-- FIXR Africa PostgreSQL Schema
-- Run: node src/db/migrate.js

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── USERS ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email         VARCHAR(255) UNIQUE,
  phone         VARCHAR(20)  UNIQUE,
  password_hash TEXT,
  google_id     TEXT UNIQUE,
  full_name     VARCHAR(255) NOT NULL,
  role          VARCHAR(50)  NOT NULL CHECK (role IN (
                  'student','gig_worker','professional','sme',
                  'farmer','cooperative','government','diaspora','admin')),
  country       VARCHAR(10)  DEFAULT 'KE',
  bio           TEXT,
  location      VARCHAR(255),
  avatar_url    TEXT,
  points        INTEGER DEFAULT 0,
  is_verified   BOOLEAN DEFAULT FALSE,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ─── SKILLS & PORTFOLIO ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS user_skills (
  id      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  skill   VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS portfolio_items (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
  title       VARCHAR(255),
  description TEXT,
  url         TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── GIG MARKETPLACE ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS gigs (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  poster_id    UUID REFERENCES users(id) ON DELETE CASCADE,
  title        VARCHAR(255) NOT NULL,
  description  TEXT,
  category     VARCHAR(50)  NOT NULL CHECK (category IN (
                 'trades','creative','agribusiness','internship','remote')),
  budget_min   NUMERIC(12,2),
  budget_max   NUMERIC(12,2),
  location     VARCHAR(255),
  is_remote    BOOLEAN DEFAULT FALSE,
  status       VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open','assigned','completed','cancelled')),
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS gig_applications (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  gig_id       UUID REFERENCES gigs(id) ON DELETE CASCADE,
  applicant_id UUID REFERENCES users(id) ON DELETE CASCADE,
  cover_note   TEXT,
  proposed_fee NUMERIC(12,2),
  status       VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending','accepted','rejected')),
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(gig_id, applicant_id)
);

-- ─── LEARNING CENTER ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS courses (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title       VARCHAR(255) NOT NULL,
  description TEXT,
  category    VARCHAR(100),
  level       VARCHAR(20) DEFAULT 'beginner',
  is_ai_gen   BOOLEAN DEFAULT FALSE,
  content_url TEXT,
  points_reward INTEGER DEFAULT 10,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enrollments (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
  course_id   UUID REFERENCES courses(id) ON DELETE CASCADE,
  progress    INTEGER DEFAULT 0,
  completed   BOOLEAN DEFAULT FALSE,
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

-- ─── PAYMENTS ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS payments (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  payer_id        UUID REFERENCES users(id),
  payee_id        UUID REFERENCES users(id),
  gig_id          UUID REFERENCES gigs(id),
  amount          NUMERIC(12,2) NOT NULL,
  currency        VARCHAR(5) DEFAULT 'KES',
  method          VARCHAR(20) CHECK (method IN ('mpesa','card','wallet')),
  status          VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending','success','failed')),
  mpesa_checkout_id TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS wallets (
  id      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  balance NUMERIC(12,2) DEFAULT 0.00
);

-- ─── POINTS / INCENTIVES ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS point_transactions (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
  points      INTEGER NOT NULL,
  reason      VARCHAR(100),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── ANALYTICS (Phase 3) ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS analytics_events (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID REFERENCES users(id) ON DELETE SET NULL,
  event_type VARCHAR(100),
  metadata   JSONB,
  country    VARCHAR(10) DEFAULT 'KE',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_gigs_category ON gigs(category);
CREATE INDEX IF NOT EXISTS idx_gigs_status   ON gigs(status);
CREATE INDEX IF NOT EXISTS idx_enrollments_user ON enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_event ON analytics_events(event_type, country);
