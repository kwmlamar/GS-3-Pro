-- Create subcontractor_profiles table for subcontractor management
CREATE TABLE IF NOT EXISTS subcontractor_profiles (
  id BIGSERIAL PRIMARY KEY,
  company_name VARCHAR(255) NOT NULL,
  contact_person VARCHAR(255),
  contact_email VARCHAR(255),
  contact_phone VARCHAR(50),
  service_specialization VARCHAR(100) DEFAULT 'General Security',
  status VARCHAR(50) DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive', 'Pending Review', 'Suspended')),
  vetting_status VARCHAR(50) DEFAULT 'Pending' CHECK (vetting_status IN ('Pending', 'In Progress', 'Approved', 'Rejected', 'Under Review')),
  insurance_coverage JSONB DEFAULT '{}',
  certifications JSONB DEFAULT '[]',
  address JSONB DEFAULT '{}',
  gps_coordinates JSONB DEFAULT '{}',
  contract_start_date DATE,
  contract_end_date DATE,
  hourly_rate DECIMAL(10,2),
  max_workers INTEGER DEFAULT 0,
  current_workers INTEGER DEFAULT 0,
  performance_rating DECIMAL(3,2) DEFAULT 0.00,
  total_incidents INTEGER DEFAULT 0,
  resolved_incidents INTEGER DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create subcontractor_sites table for site assignments
CREATE TABLE IF NOT EXISTS subcontractor_sites (
  id BIGSERIAL PRIMARY KEY,
  subcontractor_id BIGINT REFERENCES subcontractor_profiles(id) ON DELETE CASCADE,
  site_id BIGINT REFERENCES sites(id) ON DELETE CASCADE,
  assigned_workers INTEGER DEFAULT 1,
  start_date DATE NOT NULL,
  end_date DATE,
  status VARCHAR(50) DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive', 'Completed', 'Terminated')),
  contract_terms JSONB DEFAULT '{}',
  performance_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(subcontractor_id, site_id)
);

-- Create subcontractor_incidents table for incident tracking
CREATE TABLE IF NOT EXISTS subcontractor_incidents (
  id BIGSERIAL PRIMARY KEY,
  subcontractor_id BIGINT REFERENCES subcontractor_profiles(id) ON DELETE CASCADE,
  site_id BIGINT REFERENCES sites(id) ON DELETE SET NULL,
  incident_type VARCHAR(100) NOT NULL,
  severity VARCHAR(50) DEFAULT 'Low' CHECK (severity IN ('Low', 'Medium', 'High', 'Critical')),
  description TEXT,
  reported_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_date TIMESTAMP WITH TIME ZONE,
  status VARCHAR(50) DEFAULT 'Open' CHECK (status IN ('Open', 'In Progress', 'Resolved', 'Closed')),
  resolution_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create subcontractor_performance_logs table for performance tracking
CREATE TABLE IF NOT EXISTS subcontractor_performance_logs (
  id BIGSERIAL PRIMARY KEY,
  subcontractor_id BIGINT REFERENCES subcontractor_profiles(id) ON DELETE CASCADE,
  site_id BIGINT REFERENCES sites(id) ON DELETE SET NULL,
  log_date DATE NOT NULL,
  performance_score DECIMAL(3,2),
  attendance_rate DECIMAL(5,2),
  incident_count INTEGER DEFAULT 0,
  client_satisfaction_rating INTEGER CHECK (client_satisfaction_rating >= 1 AND client_satisfaction_rating <= 5),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_subcontractor_profiles_company_name ON subcontractor_profiles USING gin(to_tsvector('english', company_name));
CREATE INDEX IF NOT EXISTS idx_subcontractor_profiles_status ON subcontractor_profiles(status);
CREATE INDEX IF NOT EXISTS idx_subcontractor_profiles_vetting_status ON subcontractor_profiles(vetting_status);
CREATE INDEX IF NOT EXISTS idx_subcontractor_profiles_service_specialization ON subcontractor_profiles(service_specialization);
CREATE INDEX IF NOT EXISTS idx_subcontractor_profiles_performance_rating ON subcontractor_profiles(performance_rating);

CREATE INDEX IF NOT EXISTS idx_subcontractor_sites_subcontractor_id ON subcontractor_sites(subcontractor_id);
CREATE INDEX IF NOT EXISTS idx_subcontractor_sites_site_id ON subcontractor_sites(site_id);
CREATE INDEX IF NOT EXISTS idx_subcontractor_sites_status ON subcontractor_sites(status);

CREATE INDEX IF NOT EXISTS idx_subcontractor_incidents_subcontractor_id ON subcontractor_incidents(subcontractor_id);
CREATE INDEX IF NOT EXISTS idx_subcontractor_incidents_site_id ON subcontractor_incidents(site_id);
CREATE INDEX IF NOT EXISTS idx_subcontractor_incidents_severity ON subcontractor_incidents(severity);
CREATE INDEX IF NOT EXISTS idx_subcontractor_incidents_status ON subcontractor_incidents(status);
CREATE INDEX IF NOT EXISTS idx_subcontractor_incidents_reported_date ON subcontractor_incidents(reported_date);

CREATE INDEX IF NOT EXISTS idx_subcontractor_performance_logs_subcontractor_id ON subcontractor_performance_logs(subcontractor_id);
CREATE INDEX IF NOT EXISTS idx_subcontractor_performance_logs_site_id ON subcontractor_performance_logs(site_id);
CREATE INDEX IF NOT EXISTS idx_subcontractor_performance_logs_log_date ON subcontractor_performance_logs(log_date);

-- Enable Row Level Security (RLS)
ALTER TABLE subcontractor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE subcontractor_sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE subcontractor_incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE subcontractor_performance_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Allow authenticated users to read subcontractor_profiles" ON subcontractor_profiles
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to insert subcontractor_profiles" ON subcontractor_profiles
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update subcontractor_profiles" ON subcontractor_profiles
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete subcontractor_profiles" ON subcontractor_profiles
  FOR DELETE USING (auth.role() = 'authenticated');

-- Policies for subcontractor_sites
CREATE POLICY "Allow authenticated users to read subcontractor_sites" ON subcontractor_sites
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to insert subcontractor_sites" ON subcontractor_sites
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update subcontractor_sites" ON subcontractor_sites
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete subcontractor_sites" ON subcontractor_sites
  FOR DELETE USING (auth.role() = 'authenticated');

-- Policies for subcontractor_incidents
CREATE POLICY "Allow authenticated users to read subcontractor_incidents" ON subcontractor_incidents
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to insert subcontractor_incidents" ON subcontractor_incidents
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update subcontractor_incidents" ON subcontractor_incidents
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete subcontractor_incidents" ON subcontractor_incidents
  FOR DELETE USING (auth.role() = 'authenticated');

-- Policies for subcontractor_performance_logs
CREATE POLICY "Allow authenticated users to read subcontractor_performance_logs" ON subcontractor_performance_logs
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to insert subcontractor_performance_logs" ON subcontractor_performance_logs
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update subcontractor_performance_logs" ON subcontractor_performance_logs
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete subcontractor_performance_logs" ON subcontractor_performance_logs
  FOR DELETE USING (auth.role() = 'authenticated');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_subcontractor_profiles_updated_at BEFORE UPDATE ON subcontractor_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subcontractor_sites_updated_at BEFORE UPDATE ON subcontractor_sites
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subcontractor_incidents_updated_at BEFORE UPDATE ON subcontractor_incidents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 