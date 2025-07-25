-- Create reports table
CREATE TABLE IF NOT EXISTS reports (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  report_type VARCHAR(100) NOT NULL,
  doc_number VARCHAR(100) UNIQUE NOT NULL,
  site_id BIGINT,
  site_name VARCHAR(255),
  officer_id BIGINT,
  officer_name VARCHAR(255),
  report_date DATE NOT NULL,
  status VARCHAR(50) DEFAULT 'Draft',
  priority VARCHAR(50) DEFAULT 'Medium',
  description TEXT,
  findings TEXT,
  recommendations TEXT,
  attachments TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create violations table
CREATE TABLE IF NOT EXISTS violations (
  id BIGSERIAL PRIMARY KEY,
  type VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  severity VARCHAR(50) NOT NULL,
  location VARCHAR(255),
  site_id BIGINT,
  site_name VARCHAR(255),
  reported_by_id BIGINT,
  reported_by_name VARCHAR(255),
  violation_date DATE NOT NULL,
  status VARCHAR(50) DEFAULT 'Open',
  resolution_notes TEXT,
  corrective_actions TEXT,
  attachments TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create observations table
CREATE TABLE IF NOT EXISTS observations (
  id BIGSERIAL PRIMARY KEY,
  type VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  priority VARCHAR(50) DEFAULT 'Medium',
  location VARCHAR(255),
  site_id BIGINT,
  site_name VARCHAR(255),
  observer_id BIGINT,
  observer_name VARCHAR(255),
  observation_date DATE NOT NULL,
  status VARCHAR(50) DEFAULT 'Open',
  follow_up_required BOOLEAN DEFAULT false,
  follow_up_notes TEXT,
  attachments TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create report_templates table
CREATE TABLE IF NOT EXISTS report_templates (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  template_type VARCHAR(100) NOT NULL,
  template_content JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_reports_doc_number ON reports(doc_number);
CREATE INDEX IF NOT EXISTS idx_reports_type ON reports(report_type);
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_date ON reports(report_date);
CREATE INDEX IF NOT EXISTS idx_reports_site ON reports(site_name);
CREATE INDEX IF NOT EXISTS idx_reports_officer ON reports(officer_name);

CREATE INDEX IF NOT EXISTS idx_violations_type ON violations(type);
CREATE INDEX IF NOT EXISTS idx_violations_severity ON violations(severity);
CREATE INDEX IF NOT EXISTS idx_violations_status ON violations(status);
CREATE INDEX IF NOT EXISTS idx_violations_date ON violations(violation_date);
CREATE INDEX IF NOT EXISTS idx_violations_location ON violations(location);

CREATE INDEX IF NOT EXISTS idx_observations_type ON observations(type);
CREATE INDEX IF NOT EXISTS idx_observations_priority ON observations(priority);
CREATE INDEX IF NOT EXISTS idx_observations_status ON observations(status);
CREATE INDEX IF NOT EXISTS idx_observations_date ON observations(observation_date);
CREATE INDEX IF NOT EXISTS idx_observations_location ON observations(location);

CREATE INDEX IF NOT EXISTS idx_report_templates_type ON report_templates(template_type);
CREATE INDEX IF NOT EXISTS idx_report_templates_active ON report_templates(is_active);

-- Enable Row Level Security (RLS)
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE violations ENABLE ROW LEVEL SECURITY;
ALTER TABLE observations ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_templates ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users - Reports
CREATE POLICY "Allow authenticated users to read reports" ON reports
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to insert reports" ON reports
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update reports" ON reports
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete reports" ON reports
  FOR DELETE USING (auth.role() = 'authenticated');

-- Violations policies
CREATE POLICY "Allow authenticated users to read violations" ON violations
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to insert violations" ON violations
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update violations" ON violations
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete violations" ON violations
  FOR DELETE USING (auth.role() = 'authenticated');

-- Observations policies
CREATE POLICY "Allow authenticated users to read observations" ON observations
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to insert observations" ON observations
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update observations" ON observations
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete observations" ON observations
  FOR DELETE USING (auth.role() = 'authenticated');

-- Report templates policies
CREATE POLICY "Allow authenticated users to read report_templates" ON report_templates
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to insert report_templates" ON report_templates
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update report_templates" ON report_templates
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete report_templates" ON report_templates
  FOR DELETE USING (auth.role() = 'authenticated');

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_reports_updated_at 
    BEFORE UPDATE ON reports 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_violations_updated_at 
    BEFORE UPDATE ON violations 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_observations_updated_at 
    BEFORE UPDATE ON observations 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_report_templates_updated_at 
    BEFORE UPDATE ON report_templates 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample report templates
INSERT INTO report_templates (title, description, template_type, template_content) VALUES
('Security Incident Report', 'Standard template for documenting security incidents', 'Incident', 
  '{"sections": ["Incident Details", "Witness Statements", "Evidence Collected", "Actions Taken", "Recommendations"]}'),
('Daily Patrol Report', 'Template for daily security patrol documentation', 'Patrol',
  '{"sections": ["Patrol Route", "Observations", "Issues Found", "Actions Taken", "Equipment Status"]}'),
('Equipment Inspection Template', 'Template for security equipment inspections', 'Inspection',
  '{"sections": ["Equipment Details", "Inspection Results", "Maintenance Required", "Safety Issues", "Recommendations"]}'),
('Violation Report Template', 'Template for documenting security violations', 'Violation',
  '{"sections": ["Violation Details", "Witnesses", "Evidence", "Corrective Actions", "Follow-up Required"]}'),
('Observation Log Template', 'Template for general security observations', 'Observation',
  '{"sections": ["Observation Details", "Location", "Time", "Priority", "Recommendations"]}'),
('Security Assessment Template', 'Comprehensive security assessment template', 'Assessment',
  '{"sections": ["Site Overview", "Security Measures", "Vulnerabilities", "Risk Assessment", "Recommendations"]}')
ON CONFLICT (id) DO NOTHING;

-- Insert sample reports
INSERT INTO reports (title, report_type, doc_number, site_name, officer_name, report_date, status, priority, description) VALUES
('Security Incident Report', 'Incident', 'SIR-2024-001', 'Corporate HQ Alpha', 'John Smith', '2025-01-15', 'Completed', 'High', 'Unauthorized access attempt at main entrance'),
('Daily Patrol Report', 'Patrol', 'DPR-2024-045', 'Metro Hospital East', 'Sarah Johnson', '2025-01-15', 'Under Review', 'Medium', 'Routine patrol completed with minor issues noted'),
('Equipment Inspection Report', 'Inspection', 'EIR-2024-012', 'Regional Office', 'Mike Rodriguez', '2025-01-14', 'Completed', 'Low', 'Monthly security equipment inspection'),
('Security Assessment Report', 'Assessment', 'SAR-2024-003', 'TechCorp Industries', 'Lisa Chen', '2025-01-13', 'Draft', 'High', 'Comprehensive security assessment for new facility')
ON CONFLICT (id) DO NOTHING;

-- Insert sample violations
INSERT INTO violations (type, description, severity, location, site_name, reported_by_name, violation_date, status) VALUES
('Safety Violation', 'Improper PPE usage in restricted area', 'Medium', 'Building A - Floor 3', 'Corporate HQ Alpha', 'Lisa Chen', '2025-01-15', 'Open'),
('Security Breach', 'Unauthorized access attempt', 'High', 'Main Entrance', 'Corporate HQ Alpha', 'John Smith', '2025-01-14', 'Under Investigation'),
('Policy Violation', 'Failure to follow access control procedures', 'Low', 'Parking Garage', 'Metro Hospital East', 'Sarah Johnson', '2025-01-13', 'Resolved'),
('Equipment Misuse', 'Unauthorized use of security equipment', 'Medium', 'Control Room', 'Regional Office', 'Mike Rodriguez', '2025-01-12', 'Open')
ON CONFLICT (id) DO NOTHING;

-- Insert sample observations
INSERT INTO observations (type, description, priority, location, site_name, observer_name, observation_date, status, follow_up_required) VALUES
('Maintenance Issue', 'Lighting malfunction in parking area', 'Medium', 'Parking Lot B', 'Corporate HQ Alpha', 'Sarah Johnson', '2025-01-15', 'Open', true),
('Security Enhancement', 'Recommend additional camera coverage', 'Low', 'East Wing Corridor', 'Metro Hospital East', 'Mike Rodriguez', '2025-01-13', 'Under Review', false),
('Safety Concern', 'Slippery surface near main entrance', 'High', 'Main Entrance', 'Regional Office', 'John Smith', '2025-01-14', 'Resolved', false),
('Operational Improvement', 'Suggest improved patrol route efficiency', 'Low', 'Entire Facility', 'TechCorp Industries', 'Lisa Chen', '2025-01-12', 'Open', true)
ON CONFLICT (id) DO NOTHING; 