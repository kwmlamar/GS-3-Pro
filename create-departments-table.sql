-- Create departments table
CREATE TABLE IF NOT EXISTS departments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    site_id BIGINT REFERENCES sites(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_departments_name ON departments(name);
CREATE INDEX IF NOT EXISTS idx_departments_site_id ON departments(site_id);
CREATE INDEX IF NOT EXISTS idx_departments_active ON departments(is_active);

-- Disable RLS for development (can be enabled later with proper policies)
ALTER TABLE departments DISABLE ROW LEVEL SECURITY;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_departments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_departments_updated_at
    BEFORE UPDATE ON departments
    FOR EACH ROW
    EXECUTE FUNCTION update_departments_updated_at();

-- Insert some sample departments
INSERT INTO departments (name, description, is_active) VALUES
    ('Security Operations', 'Core security operations and patrol duties', true),
    ('Management', 'Administrative and management functions', true),
    ('Training', 'Employee training and development', true),
    ('Compliance', 'Regulatory compliance and audit functions', true),
    ('Technology', 'IT and technical security systems', true),
    ('Client Relations', 'Client communication and relationship management', true),
    ('Emergency Response', 'Emergency and crisis response teams', true),
    ('Investigations', 'Security investigations and incident response', true)
ON CONFLICT (name) DO NOTHING;

-- Add department_id column to employees table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'employees' AND column_name = 'department_id') THEN
        ALTER TABLE employees ADD COLUMN department_id UUID REFERENCES departments(id) ON DELETE SET NULL;
    END IF;
END $$;

-- Create index for the new foreign key
CREATE INDEX IF NOT EXISTS idx_employees_department_id ON employees(department_id);

-- Note: No migration needed since employees table doesn't have a department column
-- The department_id column will be populated when employees are created/updated through the application

-- Create a view for easier department management
CREATE OR REPLACE VIEW department_summary AS
SELECT 
    d.id,
    d.name,
    d.description,
    d.is_active,
    COUNT(e.id) as employee_count,
    d.created_at,
    d.updated_at
FROM departments d
LEFT JOIN employees e ON d.id = e.department_id AND e.status = 'Active'
GROUP BY d.id, d.name, d.description, d.is_active, d.created_at, d.updated_at
ORDER BY d.name;

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON departments TO authenticated;
GRANT SELECT ON department_summary TO authenticated; 