-- Create participant_status enum
CREATE TYPE participant_status AS ENUM ('expressed_interest', 'confirmed', 'denied');

-- Create cohorts table
CREATE TABLE cohorts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  is_active BOOLEAN DEFAULT false,
  capacity INTEGER DEFAULT 30,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create admins table
CREATE TABLE admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  is_approved BOOLEAN DEFAULT false,
  is_main_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create participants table
CREATE TABLE participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cohort_id UUID REFERENCES cohorts(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  contact TEXT NOT NULL,
  status participant_status DEFAULT 'expressed_interest',
  form_completed BOOLEAN DEFAULT false,
  tally_data JSONB,
  added_by UUID REFERENCES admins(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_participants_cohort ON participants(cohort_id);
CREATE INDEX idx_participants_status ON participants(status);
CREATE INDEX idx_cohorts_active ON cohorts(is_active);
CREATE INDEX idx_admins_email ON admins(email);

-- Enable RLS
ALTER TABLE cohorts ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE participants ENABLE ROW LEVEL SECURITY;

-- RLS Policies for cohorts (public read, admin write)
CREATE POLICY "Public can read active cohorts" ON cohorts
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can read all cohorts" ON cohorts
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM admins WHERE email = auth.jwt() ->> 'email' AND is_approved = true)
  );

CREATE POLICY "Admins can insert cohorts" ON cohorts
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM admins WHERE email = auth.jwt() ->> 'email' AND is_approved = true AND is_main_admin = true)
  );

CREATE POLICY "Admins can update cohorts" ON cohorts
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM admins WHERE email = auth.jwt() ->> 'email' AND is_approved = true AND is_main_admin = true)
  );

-- RLS Policies for admins
CREATE POLICY "Admins can read all admins" ON admins
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM admins WHERE email = auth.jwt() ->> 'email' AND is_approved = true)
  );

CREATE POLICY "Anyone can insert admin record" ON admins
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Main admin can update admins" ON admins
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM admins WHERE email = auth.jwt() ->> 'email' AND is_main_admin = true)
  );

-- RLS Policies for participants
CREATE POLICY "Admins can read participants" ON participants
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM admins WHERE email = auth.jwt() ->> 'email' AND is_approved = true)
  );

CREATE POLICY "Admins can insert participants" ON participants
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM admins WHERE email = auth.jwt() ->> 'email' AND is_approved = true)
  );

CREATE POLICY "Admins can update participants" ON participants
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM admins WHERE email = auth.jwt() ->> 'email' AND is_approved = true)
  );

-- Function to get confirmed count for public counter
CREATE OR REPLACE FUNCTION get_confirmed_count()
RETURNS INTEGER
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT COUNT(*)::INTEGER
  FROM participants p
  JOIN cohorts c ON p.cohort_id = c.id
  WHERE c.is_active = true AND p.status = 'confirmed';
$$;

-- Create initial cohort
INSERT INTO cohorts (name, is_active, capacity) VALUES ('Kairos 2025', true, 30);
