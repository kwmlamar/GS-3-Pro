-- Create security_staff table for security company employees
CREATE TABLE IF NOT EXISTS security_staff (
  id BIGSERIAL PRIMARY KEY,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  employee_id VARCHAR(100) UNIQUE,
  security_company_id BIGINT REFERENCES subcontractor_profiles(id) ON DELETE SET NULL,
  position VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive', 'On Leave', 'Terminated', 'Suspended')),
  hire_date DATE DEFAULT CURRENT_DATE,
  termination_date DATE,
  email VARCHAR(255),
  phone VARCHAR(50),
  emergency_contact JSONB DEFAULT '{}',
  certifications TEXT[] DEFAULT '{}',
  training_completion JSONB DEFAULT '{}',
  performance_rating DECIMAL(3,2) DEFAULT 0.00,
  compliance_score INTEGER DEFAULT 100 CHECK (compliance_score >= 0 AND compliance_score <= 100),
  background_check_status VARCHAR(50) DEFAULT 'Pending' CHECK (background_check_status IN ('Pending', 'In Progress', 'Approved', 'Rejected', 'Expired')),
  background_check_expiry DATE,
  drug_test_status VARCHAR(50) DEFAULT 'Pending' CHECK (drug_test_status IN ('Pending', 'Passed', 'Failed', 'Expired')),
  drug_test_expiry DATE,
  uniform_size VARCHAR(50),
  equipment_assigned JSONB DEFAULT '[]',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create security_staff_assignments table for site assignments
CREATE TABLE IF NOT EXISTS security_staff_assignments (
  id BIGSERIAL PRIMARY KEY,
  security_staff_id BIGINT REFERENCES security_staff(id) ON DELETE CASCADE,
  site_id BIGINT REFERENCES sites(id) ON DELETE CASCADE,
  assignment_start_date DATE NOT NULL,
  assignment_end_date DATE,
  shift_type VARCHAR(50) DEFAULT 'Day' CHECK (shift_type IN ('Day', 'Night', 'Graveyard', 'Flexible')),
  hours_per_week INTEGER DEFAULT 40,
  hourly_rate DECIMAL(10,2),
  status VARCHAR(50) DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive', 'Completed', 'Terminated')),
  supervisor_id BIGINT REFERENCES security_staff(id) ON DELETE SET NULL,
  performance_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(security_staff_id, site_id)
);

-- Create security_staff_incidents table for incident tracking
CREATE TABLE IF NOT EXISTS security_staff_incidents (
  id BIGSERIAL PRIMARY KEY,
  security_staff_id BIGINT REFERENCES security_staff(id) ON DELETE CASCADE,
  site_id BIGINT REFERENCES sites(id) ON DELETE SET NULL,
  incident_type VARCHAR(100) NOT NULL,
  severity VARCHAR(50) DEFAULT 'Low' CHECK (severity IN ('Low', 'Medium', 'High', 'Critical')),
  description TEXT,
  reported_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_date TIMESTAMP WITH TIME ZONE,
  status VARCHAR(50) DEFAULT 'Open' CHECK (status IN ('Open', 'In Progress', 'Resolved', 'Closed')),
  resolution_notes TEXT,
  witnesses JSONB DEFAULT '[]',
  evidence_attached JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create security_staff_performance_logs table for performance tracking
CREATE TABLE IF NOT EXISTS security_staff_performance_logs (
  id BIGSERIAL PRIMARY KEY,
  security_staff_id BIGINT REFERENCES security_staff(id) ON DELETE CASCADE,
  site_id BIGINT REFERENCES sites(id) ON DELETE SET NULL,
  log_date DATE NOT NULL,
  performance_score DECIMAL(3,2),
  attendance_rate DECIMAL(5,2),
  incident_count INTEGER DEFAULT 0,
  client_satisfaction_rating INTEGER CHECK (client_satisfaction_rating >= 1 AND client_satisfaction_rating <= 5),
  training_hours_completed DECIMAL(5,2) DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_security_staff_company_id ON security_staff(security_company_id);
CREATE INDEX IF NOT EXISTS idx_security_staff_status ON security_staff(status);
CREATE INDEX IF NOT EXISTS idx_security_staff_position ON security_staff(position);
CREATE INDEX IF NOT EXISTS idx_security_staff_background_check_status ON security_staff(background_check_status);
CREATE INDEX IF NOT EXISTS idx_security_staff_drug_test_status ON security_staff(drug_test_status);
CREATE INDEX IF NOT EXISTS idx_security_staff_performance_rating ON security_staff(performance_rating);

CREATE INDEX IF NOT EXISTS idx_security_staff_assignments_staff_id ON security_staff_assignments(security_staff_id);
CREATE INDEX IF NOT EXISTS idx_security_staff_assignments_site_id ON security_staff_assignments(site_id);
CREATE INDEX IF NOT EXISTS idx_security_staff_assignments_status ON security_staff_assignments(status);
CREATE INDEX IF NOT EXISTS idx_security_staff_assignments_supervisor_id ON security_staff_assignments(supervisor_id);

CREATE INDEX IF NOT EXISTS idx_security_staff_incidents_staff_id ON security_staff_incidents(security_staff_id);
CREATE INDEX IF NOT EXISTS idx_security_staff_incidents_site_id ON security_staff_incidents(site_id);
CREATE INDEX IF NOT EXISTS idx_security_staff_incidents_severity ON security_staff_incidents(severity);
CREATE INDEX IF NOT EXISTS idx_security_staff_incidents_status ON security_staff_incidents(status);
CREATE INDEX IF NOT EXISTS idx_security_staff_incidents_reported_date ON security_staff_incidents(reported_date);

CREATE INDEX IF NOT EXISTS idx_security_staff_performance_logs_staff_id ON security_staff_performance_logs(security_staff_id);
CREATE INDEX IF NOT EXISTS idx_security_staff_performance_logs_site_id ON security_staff_performance_logs(site_id);
CREATE INDEX IF NOT EXISTS idx_security_staff_performance_logs_log_date ON security_staff_performance_logs(log_date);

-- Enable Row Level Security (RLS)
ALTER TABLE security_staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_staff_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_staff_incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_staff_performance_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Allow authenticated users to read security_staff" ON security_staff
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to insert security_staff" ON security_staff
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update security_staff" ON security_staff
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete security_staff" ON security_staff
  FOR DELETE USING (auth.role() = 'authenticated');

-- Policies for security_staff_assignments
CREATE POLICY "Allow authenticated users to read security_staff_assignments" ON security_staff_assignments
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to insert security_staff_assignments" ON security_staff_assignments
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update security_staff_assignments" ON security_staff_assignments
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete security_staff_assignments" ON security_staff_assignments
  FOR DELETE USING (auth.role() = 'authenticated');

-- Policies for security_staff_incidents
CREATE POLICY "Allow authenticated users to read security_staff_incidents" ON security_staff_incidents
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to insert security_staff_incidents" ON security_staff_incidents
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update security_staff_incidents" ON security_staff_incidents
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete security_staff_incidents" ON security_staff_incidents
  FOR DELETE USING (auth.role() = 'authenticated');

-- Policies for security_staff_performance_logs
CREATE POLICY "Allow authenticated users to read security_staff_performance_logs" ON security_staff_performance_logs
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to insert security_staff_performance_logs" ON security_staff_performance_logs
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update security_staff_performance_logs" ON security_staff_performance_logs
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete security_staff_performance_logs" ON security_staff_performance_logs
  FOR DELETE USING (auth.role() = 'authenticated');

-- Create triggers for updated_at
CREATE TRIGGER update_security_staff_updated_at BEFORE UPDATE ON security_staff
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_security_staff_assignments_updated_at BEFORE UPDATE ON security_staff_assignments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_security_staff_incidents_updated_at BEFORE UPDATE ON security_staff_incidents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO security_staff (first_name, last_name, employee_id, security_company_id, position, status, email, phone, certifications, performance_rating, compliance_score) VALUES
('James', 'Wilson', 'SEC001', 1, 'Security Officer', 'Active', 'james.wilson@securecorp.com', '+1-555-0101', ARRAY['Basic Security', 'First Aid', 'Firearms'], 4.2, 95),
('Maria', 'Garcia', 'SEC002', 1, 'Site Supervisor', 'Active', 'maria.garcia@securecorp.com', '+1-555-0102', ARRAY['Advanced Security', 'Leadership', 'Emergency Response'], 4.5, 98),
('David', 'Thompson', 'SEC003', 2, 'Security Officer', 'Active', 'david.thompson@guardian.com', '+1-555-0103', ARRAY['Basic Security', 'CPR', 'Defensive Tactics'], 3.8, 92),
('Sarah', 'Miller', 'SEC004', 2, 'Security Officer', 'Active', 'sarah.miller@guardian.com', '+1-555-0104', ARRAY['Basic Security', 'First Aid'], 4.0, 94)
ON CONFLICT (id) DO NOTHING;

-- Verify the table was created
SELECT 'Security staff table created successfully!' as status; 