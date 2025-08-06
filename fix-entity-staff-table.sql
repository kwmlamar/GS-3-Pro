-- Fix entity_staff table structure
-- This script ensures the entity_staff table exists with the correct structure

-- First, check if the employees table exists and rename it to entity_staff
DO $$
BEGIN
    -- Check if employees table exists
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'employees') THEN
        -- Rename employees to entity_staff
        ALTER TABLE employees RENAME TO entity_staff;
        RAISE NOTICE 'Successfully renamed employees table to entity_staff';
    ELSE
        RAISE NOTICE 'employees table does not exist';
    END IF;
    
    -- Check if entity_staff table exists
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'entity_staff') THEN
        -- Create entity_staff table with the correct structure
        CREATE TABLE entity_staff (
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
          department_id BIGINT,
          supervisor_id BIGINT REFERENCES entity_staff(id) ON DELETE SET NULL,
          notes TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        -- Create indexes
        CREATE INDEX IF NOT EXISTS idx_entity_staff_name ON entity_staff USING gin(to_tsvector('english', name));
        CREATE INDEX IF NOT EXISTS idx_entity_staff_role ON entity_staff USING gin(to_tsvector('english', role));
        CREATE INDEX IF NOT EXISTS idx_entity_staff_site ON entity_staff USING gin(to_tsvector('english', site));
        CREATE INDEX IF NOT EXISTS idx_entity_staff_type ON entity_staff(type);
        CREATE INDEX IF NOT EXISTS idx_entity_staff_status ON entity_staff(status);
        CREATE INDEX IF NOT EXISTS idx_entity_staff_department_id ON entity_staff(department_id);
        CREATE INDEX IF NOT EXISTS idx_entity_staff_supervisor_id ON entity_staff(supervisor_id);
        
        RAISE NOTICE 'Successfully created entity_staff table';
    ELSE
        RAISE NOTICE 'entity_staff table already exists';
    END IF;
END $$;

-- Enable Row Level Security (RLS)
ALTER TABLE entity_staff ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Allow authenticated users to read entity_staff" ON entity_staff
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to insert entity_staff" ON entity_staff
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update entity_staff" ON entity_staff
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete entity_staff" ON entity_staff
  FOR DELETE USING (auth.role() = 'authenticated');

-- Create function to update updated_at timestamp if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_entity_staff_updated_at ON entity_staff;
CREATE TRIGGER update_entity_staff_updated_at 
    BEFORE UPDATE ON entity_staff 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data if table is empty
INSERT INTO entity_staff (name, role, type, site, status, compliance, certifications, email, phone, hire_date) 
SELECT * FROM (VALUES
    ('John Smith', 'Security Officer', 'Standard Officer', 'Corporate HQ Alpha', 'Active', 95, ARRAY['Basic Security', 'First Aid', 'Firearms'], 'john.smith@gs3.com', '+1-555-0123', '2023-01-15'),
    ('Sarah Johnson', 'Site Supervisor', 'Supervisor', 'Metro Hospital East', 'Active', 98, ARRAY['Advanced Security', 'Leadership', 'Emergency Response'], 'sarah.johnson@gs3.com', '+1-555-0124', '2022-08-20'),
    ('Mike Rodriguez', 'Operations Manager', 'Operations Management', 'Regional Office', 'Active', 100, ARRAY['Management', 'Risk Assessment', 'ISO 18788'], 'mike.rodriguez@gs3.com', '+1-555-0125', '2021-03-10'),
    ('Lisa Chen', 'Security Consultant', 'Consultant', 'Multiple', 'Active', 92, ARRAY['Consulting', 'Risk Analysis', 'Training'], 'lisa.chen@gs3.com', '+1-555-0126', '2022-11-05')
) AS v(name, role, type, site, status, compliance, certifications, email, phone, hire_date)
WHERE NOT EXISTS (SELECT 1 FROM entity_staff LIMIT 1);

-- Verify the table structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'entity_staff'
ORDER BY ordinal_position;

-- Show sample data
SELECT 'entity_staff table is ready!' as status;
SELECT COUNT(*) as total_records FROM entity_staff; 