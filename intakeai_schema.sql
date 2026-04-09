-- ============================================================
-- IntakeAI — HIPAA-Compliant Supabase Database Schema
-- ============================================================
-- Run this in your Supabase SQL Editor
-- All tables use Row Level Security (RLS)
-- ============================================================


-- ── EXTENSIONS ────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";


-- ── PRACTICES ─────────────────────────────────────────────
-- Each medical practice is a tenant
CREATE TABLE practices (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          TEXT NOT NULL,
  address       TEXT,
  phone         TEXT,
  email         TEXT,
  npi_number    TEXT,                        -- National Provider Identifier
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE practices ENABLE ROW LEVEL SECURITY;


-- ── PROVIDERS ─────────────────────────────────────────────
-- Doctors and staff within a practice
CREATE TABLE providers (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  practice_id   UUID NOT NULL REFERENCES practices(id) ON DELETE CASCADE,
  user_id       UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- Supabase Auth user
  first_name    TEXT NOT NULL,
  last_name     TEXT NOT NULL,
  role          TEXT NOT NULL CHECK (role IN ('physician', 'nurse', 'admin', 'front_desk')),
  npi_number    TEXT,
  is_active     BOOLEAN DEFAULT TRUE,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE providers ENABLE ROW LEVEL SECURITY;

-- Providers can only see their own practice's providers
CREATE POLICY "providers_same_practice" ON providers
  FOR ALL USING (
    practice_id = (
      SELECT practice_id FROM providers
      WHERE user_id = auth.uid() LIMIT 1
    )
  );


-- ── PATIENTS ──────────────────────────────────────────────
-- Core patient demographics (PHI - handle with care)
CREATE TABLE patients (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  practice_id     UUID NOT NULL REFERENCES practices(id) ON DELETE CASCADE,
  first_name      TEXT NOT NULL,
  last_name       TEXT NOT NULL,
  date_of_birth   DATE NOT NULL,
  sex             TEXT CHECK (sex IN ('male', 'female', 'non-binary', 'prefer_not_to_say')),
  phone           TEXT,
  email           TEXT,
  address         TEXT,
  mrn             TEXT,                      -- Medical Record Number (practice-assigned)
  is_active       BOOLEAN DEFAULT TRUE,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW(),

  -- Ensure MRN is unique per practice
  UNIQUE(practice_id, mrn)
);

ALTER TABLE patients ENABLE ROW LEVEL SECURITY;

-- Providers can only access patients in their practice
CREATE POLICY "patients_same_practice" ON patients
  FOR ALL USING (
    practice_id = (
      SELECT practice_id FROM providers
      WHERE user_id = auth.uid() LIMIT 1
    )
  );

-- Index for fast name + DOB lookup (common search pattern)
CREATE INDEX idx_patients_name ON patients (practice_id, last_name, first_name);
CREATE INDEX idx_patients_dob  ON patients (practice_id, date_of_birth);
CREATE INDEX idx_patients_mrn  ON patients (practice_id, mrn);


-- ── APPOINTMENTS ──────────────────────────────────────────
CREATE TABLE appointments (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  practice_id     UUID NOT NULL REFERENCES practices(id) ON DELETE CASCADE,
  patient_id      UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  provider_id     UUID REFERENCES providers(id) ON DELETE SET NULL,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  visit_type      TEXT NOT NULL CHECK (visit_type IN (
                    'new_patient', 'follow_up', 'annual_physical',
                    'urgent_care', 'telehealth', 'other'
                  )),
  status          TEXT DEFAULT 'scheduled' CHECK (status IN (
                    'scheduled', 'checked_in', 'in_progress',
                    'completed', 'cancelled', 'no_show'
                  )),
  notes           TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "appointments_same_practice" ON appointments
  FOR ALL USING (
    practice_id = (
      SELECT practice_id FROM providers
      WHERE user_id = auth.uid() LIMIT 1
    )
  );

CREATE INDEX idx_appointments_date     ON appointments (practice_id, appointment_date);
CREATE INDEX idx_appointments_patient  ON appointments (patient_id);
CREATE INDEX idx_appointments_provider ON appointments (provider_id);
CREATE INDEX idx_appointments_status   ON appointments (practice_id, status);


-- ── INTAKE FORMS ──────────────────────────────────────────
-- Raw intake form submission per appointment
CREATE TABLE intake_forms (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  appointment_id      UUID NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
  patient_id          UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  practice_id         UUID NOT NULL REFERENCES practices(id) ON DELETE CASCADE,

  -- Visit
  visit_reason        TEXT,
  symptoms            TEXT,
  symptom_duration    TEXT,
  pain_scale          INTEGER CHECK (pain_scale BETWEEN 0 AND 10),

  -- History
  chronic_conditions  TEXT[],               -- Array: ['Diabetes', 'Hypertension']
  prior_surgeries     TEXT,
  family_history      TEXT,
  smoking_status      TEXT CHECK (smoking_status IN ('never', 'former', 'current')),
  alcohol_use         TEXT CHECK (alcohol_use IN ('none', 'occasional', 'moderate', 'heavy')),

  -- Medications & Allergies
  current_medications TEXT,
  known_allergies     TEXT,
  supplements         TEXT,

  -- Metadata
  submitted_at        TIMESTAMPTZ DEFAULT NOW(),
  ip_address          INET,                 -- For audit trail (anonymized in reports)
  form_version        TEXT DEFAULT '1.0',
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE intake_forms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "intake_forms_same_practice" ON intake_forms
  FOR ALL USING (
    practice_id = (
      SELECT practice_id FROM providers
      WHERE user_id = auth.uid() LIMIT 1
    )
  );

CREATE INDEX idx_intake_appointment ON intake_forms (appointment_id);
CREATE INDEX idx_intake_patient     ON intake_forms (patient_id);


-- ── AI CLINICAL SUMMARIES ─────────────────────────────────
-- Stores AI-generated summaries separately for auditing
CREATE TABLE clinical_summaries (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  intake_form_id      UUID NOT NULL REFERENCES intake_forms(id) ON DELETE CASCADE,
  appointment_id      UUID NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
  patient_id          UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  practice_id         UUID NOT NULL REFERENCES practices(id) ON DELETE CASCADE,

  summary_text        TEXT NOT NULL,        -- The AI-generated clinical summary
  ai_model            TEXT DEFAULT 'claude-sonnet-4-20250514',
  generated_at        TIMESTAMPTZ DEFAULT NOW(),
  generated_by        UUID REFERENCES providers(id), -- Which provider triggered it

  -- Review tracking
  reviewed_by         UUID REFERENCES providers(id),
  reviewed_at         TIMESTAMPTZ,
  review_notes        TEXT,
  is_finalized        BOOLEAN DEFAULT FALSE,

  created_at          TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE clinical_summaries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "summaries_same_practice" ON clinical_summaries
  FOR ALL USING (
    practice_id = (
      SELECT practice_id FROM providers
      WHERE user_id = auth.uid() LIMIT 1
    )
  );

CREATE INDEX idx_summaries_appointment ON clinical_summaries (appointment_id);
CREATE INDEX idx_summaries_patient     ON clinical_summaries (patient_id);


-- ── AUDIT LOG ─────────────────────────────────────────────
-- HIPAA requires logging all access to PHI
-- Retain for minimum 6 years
CREATE TABLE audit_log (
  id            BIGSERIAL PRIMARY KEY,
  practice_id   UUID REFERENCES practices(id),
  user_id       UUID,                       -- auth.uid() at time of action
  provider_id   UUID REFERENCES providers(id),
  action        TEXT NOT NULL,              -- 'view', 'create', 'update', 'delete', 'export'
  resource_type TEXT NOT NULL,              -- 'patient', 'intake_form', 'summary', etc.
  resource_id   UUID,                       -- ID of the record accessed
  patient_id    UUID,                       -- Patient whose data was accessed (if applicable)
  ip_address    INET,
  user_agent    TEXT,
  metadata      JSONB,                      -- Extra context (search terms, export format, etc.)
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Audit log is append-only — no RLS UPDATE/DELETE
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "audit_log_insert" ON audit_log
  FOR INSERT WITH CHECK (true);             -- Anyone can write audit events

CREATE POLICY "audit_log_select" ON audit_log
  FOR SELECT USING (
    practice_id = (
      SELECT practice_id FROM providers
      WHERE user_id = auth.uid() LIMIT 1
    )
  );

CREATE INDEX idx_audit_practice  ON audit_log (practice_id, created_at DESC);
CREATE INDEX idx_audit_patient   ON audit_log (patient_id, created_at DESC);
CREATE INDEX idx_audit_user      ON audit_log (user_id, created_at DESC);


-- ── INTAKE TOKENS ─────────────────────────────────────────
-- Secure one-time links sent to patients for intake form
CREATE TABLE intake_tokens (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  appointment_id  UUID NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
  patient_id      UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  practice_id     UUID NOT NULL REFERENCES practices(id) ON DELETE CASCADE,
  token           TEXT NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(32), 'hex'),
  expires_at      TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '48 hours'),
  used_at         TIMESTAMPTZ,              -- NULL = not yet used
  is_active       BOOLEAN DEFAULT TRUE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE intake_tokens ENABLE ROW LEVEL SECURITY;

-- Tokens are public-readable (patient uses link without auth)
-- but only practice can create/manage them
CREATE POLICY "intake_tokens_public_read" ON intake_tokens
  FOR SELECT USING (
    is_active = TRUE
    AND expires_at > NOW()
    AND used_at IS NULL
  );

CREATE INDEX idx_tokens_token      ON intake_tokens (token);
CREATE INDEX idx_tokens_appointment ON intake_tokens (appointment_id);


-- ── AUTO-UPDATE TIMESTAMPS ────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER practices_updated_at  BEFORE UPDATE ON practices  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER providers_updated_at  BEFORE UPDATE ON providers  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER patients_updated_at   BEFORE UPDATE ON patients   FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER appointments_updated_at BEFORE UPDATE ON appointments FOR EACH ROW EXECUTE FUNCTION update_updated_at();


-- ── HELPER VIEW: TODAY'S QUEUE ────────────────────────────
CREATE VIEW todays_queue AS
SELECT
  a.id                AS appointment_id,
  a.appointment_time,
  a.visit_type,
  a.status,
  p.id                AS patient_id,
  p.first_name,
  p.last_name,
  p.date_of_birth,
  p.phone,
  i.visit_reason,
  i.pain_scale,
  i.chronic_conditions,
  i.submitted_at      AS intake_submitted_at,
  cs.id               AS summary_id,
  cs.is_finalized     AS summary_finalized
FROM appointments a
JOIN patients p       ON p.id = a.patient_id
LEFT JOIN intake_forms i      ON i.appointment_id = a.id
LEFT JOIN clinical_summaries cs ON cs.appointment_id = a.id
WHERE a.appointment_date = CURRENT_DATE
ORDER BY a.appointment_time ASC;


-- ============================================================
-- SETUP COMPLETE
-- Next steps:
-- 1. Enable Supabase Auth (Email + MFA)
-- 2. Sign BAA with Supabase
-- 3. Configure storage bucket for documents (if needed)
-- 4. Set up pg_cron for audit log archiving (6-year retention)
-- ============================================================
