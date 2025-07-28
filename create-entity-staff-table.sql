-- Create entity_staff table for staff at different entities/sites
CREATE TABLE IF NOT EXISTS entity_staff (
  id BIGSERIAL PRIMARY KEY,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  employee_id VARCHAR(100) UNIQUE,
  entity_id BIGINT REFERENCES sites(id) ON DELETE SET NULL,
  department VARCHAR(255),
  position VARCHAR(255) NOT NULL,
  employee_type VARCHAR(100) DEFAULT 'Full-time' CHECK (employee_type IN ('Full-time', 'Part-time', 'Contractor', 'Temporary', 'Intern')),
  status VARCHAR(50) DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive', 'On Leave', 'Terminated', 'Suspended')),
  hire_date DATE DEFAULT CURRENT_DATE,
  termination_date DATE,
  email VARCHAR(255),
  phone VARCHAR(50),
  emergency_contact JSONB DEFAULT '{}',
  supervisor_id BIGINT REFERENCES entity_staff(id) ON DELETE SET NULL,
  access_level VARCHAR(50) DEFAULT 'Standard' CHECK (access_level IN ('Standard', 'Elevated', 'Administrative', 'Restricted')),
  security_clearance VARCHAR(50) DEFAULT 'None' CHECK (security_clearance IN ('None', 'Basic', 'Secret', 'Top Secret', 'Special Access')),
  background_check_status VARCHAR(50) DEFAULT 'Pending' CHECK (background_check_status IN ('Pending', 'In Progress', 'Approved', 'Rejected', 'Expired')),
  background_check_expiry DATE,
  drug_test_status VARCHAR(50) DEFAULT 'Pending' CHECK (drug_test_status IN ('Pending', 'Passed', 'Failed', 'Expired')),
  drug_test_expiry DATE,
  training_completion JSONB DEFAULT '{}',
  performance_rating DECIMAL(3,2) DEFAULT 0.00,
  compliance_score INTEGER DEFAULT 100 CHECK (compliance_score >= 0 AND compliance_score <= 100),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create entity_staff_assignments table for role assignments
CREATE TABLE IF NOT EXISTS entity_staff_assignments (
  id BIGSERIAL PRIMARY KEY,
  entity_staff_id BIGINT REFERENCES entity_staff(id) ON DELETE CASCADE,
  site_id BIGINT REFERENCES sites(id) ON DELETE CASCADE,
  role_title VARCHAR(255) NOT NULL,
  assignment_start_date DATE NOT NULL,
  assignment_end_date DATE,
  is_primary_role BOOLEAN DEFAULT true,
  hours_per_week INTEGER DEFAULT 40,
  salary DECIMAL(12,2),
  status VARCHAR(50) DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive', 'Completed', 'Terminated')),
  performance_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(entity_staff_id, site_id, role_title)
);

-- Create entity_staff_incidents table for incident tracking
CREATE TABLE IF NOT EXISTS entity_staff_incidents (
  id BIGSERIAL PRIMARY KEY,
  entity_staff_id BIGINT REFERENCES entity_staff(id) ON DELETE CASCADE,
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

-- Create entity_staff_performance_logs table for performance tracking
CREATE TABLE IF NOT EXISTS entity_staff_performance_logs (
  id BIGSERIAL PRIMARY KEY,
  entity_staff_id BIGINT REFERENCES entity_staff(id) ON DELETE CASCADE,
  site_id BIGINT REFERENCES sites(id) ON DELETE SET NULL,
  log_date DATE NOT NULL,
  performance_score DECIMAL(3,2),
  attendance_rate DECIMAL(5,2),
  incident_count INTEGER DEFAULT 0,
  training_hours_completed DECIMAL(5,2) DEFAULT 0,
  compliance_score INTEGER DEFAULT 100,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create entity_staff_access_logs table for access tracking
CREATE TABLE IF NOT EXISTS entity_staff_access_logs (
  id BIGSERIAL PRIMARY KEY,
  entity_staff_id BIGINT REFERENCES entity_staff(id) ON DELETE CASCADE,
  site_id BIGINT REFERENCES sites(id) ON DELETE SET NULL,
  access_type VARCHAR(50) NOT NULL CHECK (access_type IN ('Entry', 'Exit', 'Area Access', 'System Login', 'System Logout')),
  access_point VARCHAR(255),
  access_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  access_method VARCHAR(50) DEFAULT 'Card' CHECK (access_method IN ('Card', 'Biometric', 'Key', 'Manual', 'System')),
  access_result VARCHAR(50) DEFAULT 'Granted' CHECK (access_result IN ('Granted', 'Denied', 'Suspicious', 'Error')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_entity_staff_entity_id ON entity_staff(entity_id);
CREATE INDEX IF NOT EXISTS idx_entity_staff_status ON entity_staff(status);
CREATE INDEX IF NOT EXISTS idx_entity_staff_position ON entity_staff(position);
CREATE INDEX IF NOT EXISTS idx_entity_staff_department ON entity_staff(department);
CREATE INDEX IF NOT EXISTS idx_entity_staff_access_level ON entity_staff(access_level);
CREATE INDEX IF NOT EXISTS idx_entity_staff_security_clearance ON entity_staff(security_clearance);
CREATE INDEX IF NOT EXISTS idx_entity_staff_background_check_status ON entity_staff(background_check_status);
CREATE INDEX IF NOT EXISTS idx_entity_staff_drug_test_status ON entity_staff(drug_test_status);
CREATE INDEX IF NOT EXISTS idx_entity_staff_performance_rating ON entity_staff(performance_rating);
CREATE INDEX IF NOT EXISTS idx_entity_staff_supervisor_id ON entity_staff(supervisor_id);

CREATE INDEX IF NOT EXISTS idx_entity_staff_assignments_staff_id ON entity_staff_assignments(entity_staff_id);
CREATE INDEX IF NOT EXISTS idx_entity_staff_assignments_site_id ON entity_staff_assignments(site_id);
CREATE INDEX IF NOT EXISTS idx_entity_staff_assignments_status ON entity_staff_assignments(status);
CREATE INDEX IF NOT EXISTS idx_entity_staff_assignments_role_title ON entity_staff_assignments(role_title);

CREATE INDEX IF NOT EXISTS idx_entity_staff_incidents_staff_id ON entity_staff_incidents(entity_staff_id);
CREATE INDEX IF NOT EXISTS idx_entity_staff_incidents_site_id ON entity_staff_incidents(site_id);
CREATE INDEX IF NOT EXISTS idx_entity_staff_incidents_severity ON entity_staff_incidents(severity);
CREATE INDEX IF NOT EXISTS idx_entity_staff_incidents_status ON entity_staff_incidents(status);
CREATE INDEX IF NOT EXISTS idx_entity_staff_incidents_reported_date ON entity_staff_incidents(reported_date);

CREATE INDEX IF NOT EXISTS idx_entity_staff_performance_logs_staff_id ON entity_staff_performance_logs(entity_staff_id);
CREATE INDEX IF NOT EXISTS idx_entity_staff_performance_logs_site_id ON entity_staff_performance_logs(site_id);
CREATE INDEX IF NOT EXISTS idx_entity_staff_performance_logs_log_date ON entity_staff_performance_logs(log_date);

CREATE INDEX IF NOT EXISTS idx_entity_staff_access_logs_staff_id ON entity_staff_access_logs(entity_staff_id);
CREATE INDEX IF NOT EXISTS idx_entity_staff_access_logs_site_id ON entity_staff_access_logs(site_id);
CREATE INDEX IF NOT EXISTS idx_entity_staff_access_logs_access_time ON entity_staff_access_logs(access_time);
CREATE INDEX IF NOT EXISTS idx_entity_staff_access_logs_access_result ON entity_staff_access_logs(access_result);

-- Enable Row Level Security (RLS)
ALTER TABLE entity_staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE entity_staff_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE entity_staff_incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE entity_staff_performance_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE entity_staff_access_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Allow authenticated users to read entity_staff" ON entity_staff
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to insert entity_staff" ON entity_staff
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update entity_staff" ON entity_staff
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete entity_staff" ON entity_staff
  FOR DELETE USING (auth.role() = 'authenticated');

-- Policies for entity_staff_assignments
CREATE POLICY "Allow authenticated users to read entity_staff_assignments" ON entity_staff_assignments
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to insert entity_staff_assignments" ON entity_staff_assignments
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update entity_staff_assignments" ON entity_staff_assignments
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete entity_staff_assignments" ON entity_staff_assignments
  FOR DELETE USING (auth.role() = 'authenticated');

-- Policies for entity_staff_incidents
CREATE POLICY "Allow authenticated users to read entity_staff_incidents" ON entity_staff_incidents
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to insert entity_staff_incidents" ON entity_staff_incidents
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update entity_staff_incidents" ON entity_staff_incidents
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete entity_staff_incidents" ON entity_staff_incidents
  FOR DELETE USING (auth.role() = 'authenticated');

-- Policies for entity_staff_performance_logs
CREATE POLICY "Allow authenticated users to read entity_staff_performance_logs" ON entity_staff_performance_logs
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to insert entity_staff_performance_logs" ON entity_staff_performance_logs
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update entity_staff_performance_logs" ON entity_staff_performance_logs
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete entity_staff_performance_logs" ON entity_staff_performance_logs
  FOR DELETE USING (auth.role() = 'authenticated');

-- Policies for entity_staff_access_logs
CREATE POLICY "Allow authenticated users to read entity_staff_access_logs" ON entity_staff_access_logs
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to insert entity_staff_access_logs" ON entity_staff_access_logs
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update entity_staff_access_logs" ON entity_staff_access_logs
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete entity_staff_access_logs" ON entity_staff_access_logs
  FOR DELETE USING (auth.role() = 'authenticated');

-- Create triggers for updated_at
CREATE TRIGGER update_entity_staff_updated_at BEFORE UPDATE ON entity_staff
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_entity_staff_assignments_updated_at BEFORE UPDATE ON entity_staff_assignments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_entity_staff_incidents_updated_at BEFORE UPDATE ON entity_staff_incidents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO entity_staff (first_name, last_name, employee_id, entity_id, department, position, employee_type, status, email, phone, access_level, security_clearance, performance_rating, compliance_score) VALUES
('Robert', 'Anderson', 'ENT001', 1, 'Operations', 'Operations Manager', 'Full-time', 'Active', 'robert.anderson@corporate.com', '+1-555-0201', 'Administrative', 'Secret', 4.3, 96),
('Jennifer', 'Martinez', 'ENT002', 1, 'Human Resources', 'HR Director', 'Full-time', 'Active', 'jennifer.martinez@corporate.com', '+1-555-0202', 'Elevated', 'Basic', 4.1, 94),
('Michael', 'Brown', 'ENT003', 2, 'IT', 'Systems Administrator', 'Full-time', 'Active', 'michael.brown@hospital.com', '+1-555-0203', 'Elevated', 'Secret', 4.4, 97),
('Lisa', 'Davis', 'ENT004', 2, 'Administration', 'Administrative Assistant', 'Full-time', 'Active', 'lisa.davis@hospital.com', '+1-555-0204', 'Standard', 'None', 3.9, 92)
ON CONFLICT (id) DO NOTHING;

-- Verify the table was created
SELECT 'Entity staff table created successfully!' as status; 