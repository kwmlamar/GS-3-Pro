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

-- Create index for better search performance
CREATE INDEX IF NOT EXISTS idx_employees_name ON employees USING gin(to_tsvector('english', name));
CREATE INDEX IF NOT EXISTS idx_employees_role ON employees USING gin(to_tsvector('english', role));
CREATE INDEX IF NOT EXISTS idx_employees_site ON employees USING gin(to_tsvector('english', site));
CREATE INDEX IF NOT EXISTS idx_employees_type ON employees(type);
CREATE INDEX IF NOT EXISTS idx_employees_status ON employees(status);

-- Enable Row Level Security (RLS)
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users to read all employees
CREATE POLICY "Allow authenticated users to read employees" ON employees
  FOR SELECT USING (auth.role() = 'authenticated');

-- Create policy for authenticated users to insert employees
CREATE POLICY "Allow authenticated users to insert employees" ON employees
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Create policy for authenticated users to update employees
CREATE POLICY "Allow authenticated users to update employees" ON employees
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Create policy for authenticated users to delete employees
CREATE POLICY "Allow authenticated users to delete employees" ON employees
  FOR DELETE USING (auth.role() = 'authenticated');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_employees_updated_at 
    BEFORE UPDATE ON employees 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data (optional - can be done via the app)
INSERT INTO employees (name, role, type, site, status, compliance, certifications, email, phone, hire_date) VALUES
('John Smith', 'Security Officer', 'Standard Officer', 'Corporate HQ Alpha', 'Active', 95, ARRAY['Basic Security', 'First Aid', 'Firearms'], 'john.smith@gs3.com', '+1-555-0123', '2023-01-15'),
('Sarah Johnson', 'Site Supervisor', 'Supervisor', 'Metro Hospital East', 'Active', 98, ARRAY['Advanced Security', 'Leadership', 'Emergency Response'], 'sarah.johnson@gs3.com', '+1-555-0124', '2022-08-20'),
('Mike Rodriguez', 'Operations Manager', 'Operations Management', 'Regional Office', 'Active', 100, ARRAY['Management', 'Risk Assessment', 'ISO 18788'], 'mike.rodriguez@gs3.com', '+1-555-0125', '2021-03-10'),
('Lisa Chen', 'Security Consultant', 'Consultant', 'Multiple', 'Active', 92, ARRAY['Consulting', 'Risk Analysis', 'Training'], 'lisa.chen@gs3.com', '+1-555-0126', '2022-11-05')
ON CONFLICT (id) DO NOTHING; 