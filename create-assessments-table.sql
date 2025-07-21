-- Create assessments table
CREATE TABLE IF NOT EXISTS assessments (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  client_name VARCHAR(255) NOT NULL,
  location VARCHAR(500) NOT NULL,
  assessment_type VARCHAR(100) NOT NULL,
  status VARCHAR(50) DEFAULT 'Scheduled',
  priority VARCHAR(50) DEFAULT 'Medium',
  scheduled_date DATE NOT NULL,
  completed_date DATE,
  assigned_to VARCHAR(255),
  description TEXT,
  findings TEXT,
  recommendations TEXT,
  risk_level VARCHAR(50),
  estimated_duration_hours INTEGER,
  actual_duration_hours INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create assessment_templates table
CREATE TABLE IF NOT EXISTS assessment_templates (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  template_type VARCHAR(100) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create assessment_services table for tracking which services are included in assessments
CREATE TABLE IF NOT EXISTS assessment_services (
  id BIGSERIAL PRIMARY KEY,
  assessment_id BIGINT REFERENCES assessments(id) ON DELETE CASCADE,
  service_name VARCHAR(255) NOT NULL,
  is_included BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_assessments_client_name ON assessments USING gin(to_tsvector('english', client_name));
CREATE INDEX IF NOT EXISTS idx_assessments_location ON assessments USING gin(to_tsvector('english', location));
CREATE INDEX IF NOT EXISTS idx_assessments_status ON assessments(status);
CREATE INDEX IF NOT EXISTS idx_assessments_type ON assessments(assessment_type);
CREATE INDEX IF NOT EXISTS idx_assessments_scheduled_date ON assessments(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_assessments_assigned_to ON assessments(assigned_to);

-- Enable Row Level Security (RLS)
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_services ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Allow authenticated users to read assessments" ON assessments
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to insert assessments" ON assessments
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update assessments" ON assessments
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete assessments" ON assessments
  FOR DELETE USING (auth.role() = 'authenticated');

-- Template policies
CREATE POLICY "Allow authenticated users to read assessment_templates" ON assessment_templates
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to insert assessment_templates" ON assessment_templates
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update assessment_templates" ON assessment_templates
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete assessment_templates" ON assessment_templates
  FOR DELETE USING (auth.role() = 'authenticated');

-- Services policies
CREATE POLICY "Allow authenticated users to read assessment_services" ON assessment_services
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to insert assessment_services" ON assessment_services
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update assessment_services" ON assessment_services
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete assessment_services" ON assessment_services
  FOR DELETE USING (auth.role() = 'authenticated');

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_assessments_updated_at 
    BEFORE UPDATE ON assessments 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_assessment_templates_updated_at 
    BEFORE UPDATE ON assessment_templates 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample assessment templates
INSERT INTO assessment_templates (title, description, template_type) VALUES
('Standard Commercial Site Assessment', 'Comprehensive template for typical commercial properties.', 'Commercial'),
('High-Risk Facility Assessment', 'Specialized template for critical infrastructure or high-threat environments.', 'High-Risk'),
('Retail Security Assessment', 'Focused on loss prevention and customer safety for retail spaces.', 'Retail'),
('Residential Community Assessment', 'Tailored for HOAs and residential complexes.', 'Residential')
ON CONFLICT (id) DO NOTHING;

-- Insert sample assessments
INSERT INTO assessments (title, client_name, location, assessment_type, status, priority, scheduled_date, assigned_to, description) VALUES
('TechCorp Industries Security Review', 'TechCorp Industries', 'Downtown Office Complex', 'New Site', 'In Progress', 'High', '2025-07-15', 'John Smith', 'Comprehensive security assessment for new corporate headquarters'),
('Metro Hospital Emergency Department', 'Metro Hospital', 'Emergency Department', 'Existing Site', 'Completed', 'Medium', '2025-06-12', 'Sarah Johnson', 'Security assessment for emergency department expansion'),
('Retail Plaza Security Evaluation', 'Retail Plaza LLC', 'Shopping Center', 'New Site', 'Scheduled', 'Low', '2025-08-01', 'Mike Rodriguez', 'Loss prevention and customer safety assessment for retail complex')
ON CONFLICT (id) DO NOTHING;

-- Insert sample assessment services
INSERT INTO assessment_services (assessment_id, service_name, is_included) VALUES
(1, 'Physical Security Guards', true),
(1, 'Access Control Systems', true),
(1, 'CCTV Surveillance', true),
(1, 'Alarm Systems & Monitoring', false),
(2, 'Physical Security Guards', true),
(2, 'Access Control Systems', true),
(2, 'Emergency Response Planning', true),
(3, 'CCTV Surveillance', true),
(3, 'Loss Prevention Services', true),
(3, 'Mobile Patrol Services', false)
ON CONFLICT (id) DO NOTHING; 