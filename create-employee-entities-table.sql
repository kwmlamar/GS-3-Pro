-- Create employee-entities junction table for multiple entities per employee
-- Run this in your Supabase SQL Editor

-- Create the junction table for employee-entity relationships
CREATE TABLE IF NOT EXISTS employee_entities (
  id BIGSERIAL PRIMARY KEY,
  employee_id BIGINT NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  site_id BIGINT NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  is_primary BOOLEAN DEFAULT false,
  assigned_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(employee_id, site_id)
);

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_employee_entities_employee_id ON employee_entities(employee_id);
CREATE INDEX IF NOT EXISTS idx_employee_entities_site_id ON employee_entities(site_id);

-- Disable RLS for development
ALTER TABLE employee_entities DISABLE ROW LEVEL SECURITY;

-- Add a trigger to ensure only one primary entity per employee
CREATE OR REPLACE FUNCTION ensure_single_primary_entity()
RETURNS TRIGGER AS $$
BEGIN
  -- If this is being set as primary, unset all others for this employee
  IF NEW.is_primary = true THEN
    UPDATE employee_entities 
    SET is_primary = false 
    WHERE employee_id = NEW.employee_id AND id != NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_ensure_single_primary_entity
  BEFORE INSERT OR UPDATE ON employee_entities
  FOR EACH ROW
  EXECUTE FUNCTION ensure_single_primary_entity();

-- Migrate existing data (optional - run this if you want to migrate existing single-site assignments)
-- This will create employee_entities records for existing employees based on their site field
INSERT INTO employee_entities (employee_id, site_id, is_primary)
SELECT 
  e.id,
  s.id,
  true
FROM employees e
JOIN sites s ON s.name = e.site
WHERE NOT EXISTS (
  SELECT 1 FROM employee_entities ee WHERE ee.employee_id = e.id
)
ON CONFLICT (employee_id, site_id) DO NOTHING;

-- Verify the table was created
SELECT 'Employee entities table created successfully!' as status; 