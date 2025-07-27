-- Add sample archived employees for testing
-- Run this in your Supabase SQL Editor

-- Insert sample archived employees
INSERT INTO employees (name, role, type, site, status, compliance, certifications, email, phone, hire_date, notes) VALUES
('Alex Thompson', 'Former Security Officer', 'Standard Officer', 'Corporate HQ Alpha', 'Archived', 85, ARRAY['Basic Security', 'First Aid'], 'alex.thompson@gs3.com', '+1-555-0127', '2022-06-15', 'Left company for personal reasons. Good performance record.'),
('Maria Garcia', 'Former Site Supervisor', 'Supervisor', 'Metro Hospital West', 'Archived', 92, ARRAY['Advanced Security', 'Leadership'], 'maria.garcia@gs3.com', '+1-555-0128', '2021-09-10', 'Relocated to different city. Excellent leadership skills.'),
('David Chen', 'Former Operations Manager', 'Operations Management', 'Regional Office', 'Archived', 95, ARRAY['Management', 'Risk Assessment'], 'david.chen@gs3.com', '+1-555-0129', '2020-12-01', 'Career advancement opportunity. Strong operational background.'),
('Sarah Wilson', 'Former Security Consultant', 'Consultant', 'Multiple', 'Archived', 88, ARRAY['Consulting', 'Risk Analysis'], 'sarah.wilson@gs3.com', '+1-555-0130', '2022-03-20', 'Started own consulting business. Valuable experience gained.')
ON CONFLICT (id) DO NOTHING;

-- Verify the archived employees were added
SELECT name, role, status, notes FROM employees WHERE status = 'Archived'; 