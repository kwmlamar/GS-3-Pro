-- Simple employees table creation script
-- Run this in your Supabase SQL Editor

-- Drop table if it exists (optional - remove this line if you want to keep existing data)
-- DROP TABLE IF EXISTS employees;

-- Create employees table
CREATE TABLE IF NOT EXISTS employees (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(255) NOT NULL,
  type VARCHAR(100) NOT NULL,
  site VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'Active',
  compliance INTEGER DEFAULT 100 CHECK (compliance >= 0 AND compliance <= 100),
  certifications TEXT[] DEFAULT '{}',
  email VARCHAR(255),
  phone VARCHAR(50),
  hire_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Disable RLS for development
ALTER TABLE employees DISABLE ROW LEVEL SECURITY;

-- Insert sample data
INSERT INTO employees (name, role, type, site, status, compliance, certifications, email, phone, hire_date) VALUES
('John Smith', 'Security Officer', 'Standard Officer', 'Corporate HQ Alpha', 'Active', 95, ARRAY['Basic Security', 'First Aid', 'Firearms'], 'john.smith@gs3.com', '+1-555-0123', '2023-01-15'),
('Sarah Johnson', 'Site Supervisor', 'Supervisor', 'Metro Hospital East', 'Active', 98, ARRAY['Advanced Security', 'Leadership', 'Emergency Response'], 'sarah.johnson@gs3.com', '+1-555-0124', '2022-08-20'),
('Mike Rodriguez', 'Operations Manager', 'Operations Management', 'Regional Office', 'Active', 100, ARRAY['Management', 'Risk Assessment', 'ISO 18788'], 'mike.rodriguez@gs3.com', '+1-555-0125', '2021-03-10'),
('Lisa Chen', 'Security Consultant', 'Consultant', 'Multiple', 'Active', 92, ARRAY['Consulting', 'Risk Analysis', 'Training'], 'lisa.chen@gs3.com', '+1-555-0126', '2022-11-05')
ON CONFLICT (id) DO NOTHING;

-- Verify the table was created
SELECT 'Employees table created successfully!' as status; 