-- Create training courses table
CREATE TABLE IF NOT EXISTS training_courses (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(100) NOT NULL DEFAULT 'Core Training',
  duration_hours INTEGER NOT NULL DEFAULT 8,
  status VARCHAR(50) DEFAULT 'Active',
  created_by VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create training enrollments table
CREATE TABLE IF NOT EXISTS training_enrollments (
  id BIGSERIAL PRIMARY KEY,
  course_id BIGINT REFERENCES training_courses(id) ON DELETE CASCADE,
  employee_id BIGINT REFERENCES employees(id) ON DELETE CASCADE,
  enrollment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completion_date TIMESTAMP WITH TIME ZONE,
  status VARCHAR(50) DEFAULT 'Enrolled',
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(course_id, employee_id)
);

-- Create certificates table
CREATE TABLE IF NOT EXISTS certificates (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  template_name VARCHAR(255) DEFAULT 'Standard Template',
  validity_months INTEGER DEFAULT 24,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create certificate issuances table
CREATE TABLE IF NOT EXISTS certificate_issuances (
  id BIGSERIAL PRIMARY KEY,
  certificate_id BIGINT REFERENCES certificates(id) ON DELETE CASCADE,
  employee_id BIGINT REFERENCES employees(id) ON DELETE CASCADE,
  issued_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expiry_date TIMESTAMP WITH TIME ZONE,
  status VARCHAR(50) DEFAULT 'Valid',
  issued_by VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_training_courses_type ON training_courses(type);
CREATE INDEX IF NOT EXISTS idx_training_courses_status ON training_courses(status);
CREATE INDEX IF NOT EXISTS idx_training_enrollments_course_id ON training_enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_training_enrollments_employee_id ON training_enrollments(employee_id);
CREATE INDEX IF NOT EXISTS idx_training_enrollments_status ON training_enrollments(status);
CREATE INDEX IF NOT EXISTS idx_certificate_issuances_certificate_id ON certificate_issuances(certificate_id);
CREATE INDEX IF NOT EXISTS idx_certificate_issuances_employee_id ON certificate_issuances(employee_id);
CREATE INDEX IF NOT EXISTS idx_certificate_issuances_status ON certificate_issuances(status);

-- Enable Row Level Security (RLS)
ALTER TABLE training_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificate_issuances ENABLE ROW LEVEL SECURITY;

-- Create policies for training_courses
CREATE POLICY "Allow authenticated users to read training_courses" ON training_courses
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to insert training_courses" ON training_courses
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update training_courses" ON training_courses
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete training_courses" ON training_courses
  FOR DELETE USING (auth.role() = 'authenticated');

-- Create policies for training_enrollments
CREATE POLICY "Allow authenticated users to read training_enrollments" ON training_enrollments
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to insert training_enrollments" ON training_enrollments
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update training_enrollments" ON training_enrollments
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete training_enrollments" ON training_enrollments
  FOR DELETE USING (auth.role() = 'authenticated');

-- Create policies for certificates
CREATE POLICY "Allow authenticated users to read certificates" ON certificates
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to insert certificates" ON certificates
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update certificates" ON certificates
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete certificates" ON certificates
  FOR DELETE USING (auth.role() = 'authenticated');

-- Create policies for certificate_issuances
CREATE POLICY "Allow authenticated users to read certificate_issuances" ON certificate_issuances
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to insert certificate_issuances" ON certificate_issuances
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update certificate_issuances" ON certificate_issuances
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete certificate_issuances" ON certificate_issuances
  FOR DELETE USING (auth.role() = 'authenticated');

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_training_courses_updated_at 
    BEFORE UPDATE ON training_courses 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_training_enrollments_updated_at 
    BEFORE UPDATE ON training_enrollments 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_certificates_updated_at 
    BEFORE UPDATE ON certificates 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_certificate_issuances_updated_at 
    BEFORE UPDATE ON certificate_issuances 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample training courses
INSERT INTO training_courses (title, description, type, duration_hours, status, created_by) VALUES
('Basic Security Fundamentals', 'Core training covering essential security principles, protocols, and procedures for all security personnel.', 'Core Training', 8, 'Active', 'System Admin'),
('Advanced Threat Assessment', 'Specialized training for identifying, analyzing, and responding to various security threats and risks.', 'Specialized', 16, 'Active', 'System Admin'),
('Emergency Response Procedures', 'Comprehensive training on emergency protocols, crisis management, and incident response procedures.', 'Core Training', 12, 'Active', 'System Admin'),
('Firearms Qualification', 'Specialized firearms training and qualification for authorized security personnel.', 'Specialized', 24, 'Active', 'System Admin'),
('First Aid & CPR Certification', 'Medical emergency response training including first aid, CPR, and AED usage.', 'Core Training', 6, 'Active', 'System Admin'),
('Leadership & Management', 'Advanced training for supervisors and managers covering leadership skills and team management.', 'Management', 20, 'Active', 'System Admin')
ON CONFLICT (id) DO NOTHING;

-- Insert sample certificates
INSERT INTO certificates (name, description, template_name, validity_months) VALUES
('Security Officer Certification', 'Standard certification for security officers covering basic security principles and procedures.', 'Standard Template', 24),
('Firearms Qualification', 'Specialized certification for firearms qualification and safety training.', 'Specialized Template', 12),
('First Aid Certification', 'Medical emergency response certification including first aid and CPR training.', 'Medical Template', 24),
('Supervisor Certification', 'Advanced certification for security supervisors and team leaders.', 'Leadership Template', 36),
('Emergency Response Certification', 'Specialized certification for emergency response and crisis management.', 'Emergency Template', 18)
ON CONFLICT (id) DO NOTHING;

-- Insert sample enrollments (assuming employees exist)
INSERT INTO training_enrollments (course_id, employee_id, status, progress_percentage) VALUES
(1, 1, 'Completed', 100),
(1, 2, 'Completed', 100),
(1, 3, 'Completed', 100),
(2, 1, 'In Progress', 75),
(2, 2, 'Completed', 100),
(3, 1, 'Completed', 100),
(3, 2, 'Completed', 100),
(3, 3, 'Completed', 100),
(4, 1, 'Enrolled', 0),
(5, 1, 'Completed', 100),
(5, 2, 'Completed', 100),
(5, 3, 'Completed', 100)
ON CONFLICT (course_id, employee_id) DO NOTHING;

-- Insert sample certificate issuances
INSERT INTO certificate_issuances (certificate_id, employee_id, issued_date, expiry_date, status, issued_by) VALUES
(1, 1, '2023-01-15', '2025-01-15', 'Valid', 'Training Department'),
(1, 2, '2022-08-20', '2024-08-20', 'Valid', 'Training Department'),
(1, 3, '2021-03-10', '2023-03-10', 'Expired', 'Training Department'),
(2, 1, '2023-06-01', '2024-06-01', 'Valid', 'Firearms Instructor'),
(3, 1, '2023-02-15', '2025-02-15', 'Valid', 'Medical Training'),
(3, 2, '2022-09-10', '2024-09-10', 'Valid', 'Medical Training'),
(3, 3, '2021-04-05', '2023-04-05', 'Expired', 'Medical Training'),
(4, 2, '2022-08-20', '2025-08-20', 'Valid', 'Leadership Training'),
(4, 3, '2021-03-10', '2024-03-10', 'Valid', 'Leadership Training'),
(5, 1, '2023-01-15', '2024-07-15', 'Valid', 'Emergency Response Training'),
(5, 2, '2022-08-20', '2024-02-20', 'Valid', 'Emergency Response Training')
ON CONFLICT (id) DO NOTHING; 