-- Setup multiple entities per employee
-- Run this in your Supabase SQL Editor

-- 1. Create the employee_entities junction table
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

-- 2. Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_employee_entities_employee_id ON employee_entities(employee_id);
CREATE INDEX IF NOT EXISTS idx_employee_entities_site_id ON employee_entities(site_id);
CREATE INDEX IF NOT EXISTS idx_employee_entities_primary ON employee_entities(employee_id, is_primary);

-- 3. Disable RLS for development
ALTER TABLE employee_entities DISABLE ROW LEVEL SECURITY;

-- 4. Create trigger to ensure only one primary entity per employee
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

-- Drop trigger if it exists
DROP TRIGGER IF EXISTS trigger_ensure_single_primary_entity ON employee_entities;

-- Create the trigger
CREATE TRIGGER trigger_ensure_single_primary_entity
  BEFORE INSERT OR UPDATE ON employee_entities
  FOR EACH ROW
  EXECUTE FUNCTION ensure_single_primary_entity();

-- 5. Migrate existing data (optional - run this if you want to migrate existing single-site assignments)
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

-- 6. Create a view for easier querying of employees with their entities
CREATE OR REPLACE VIEW employees_with_entities AS
SELECT 
  e.*,
  d.name as department_name,
  d.description as department_description,
  ARRAY_AGG(
    json_build_object(
      'site_id', ee.site_id,
      'site_name', s.name,
      'site_type', s.type,
      'is_primary', ee.is_primary,
      'assigned_date', ee.assigned_date
    ) ORDER BY ee.is_primary DESC, s.name
  ) FILTER (WHERE ee.site_id IS NOT NULL) as entities,
  (
    SELECT json_build_object(
      'site_id', ee2.site_id,
      'site_name', s2.name,
      'site_type', s2.type
    )
    FROM employee_entities ee2
    JOIN sites s2 ON s2.id = ee2.site_id
    WHERE ee2.employee_id = e.id AND ee2.is_primary = true
    LIMIT 1
  ) as primary_entity
FROM employees e
LEFT JOIN departments d ON d.id = e.department_id
LEFT JOIN employee_entities ee ON ee.employee_id = e.id
LEFT JOIN sites s ON s.id = ee.site_id
GROUP BY e.id, d.name, d.description;

-- 7. Create helper functions for managing employee entities
CREATE OR REPLACE FUNCTION add_employee_entity(
  p_employee_id BIGINT,
  p_site_id BIGINT,
  p_is_primary BOOLEAN DEFAULT false
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO employee_entities (employee_id, site_id, is_primary)
  VALUES (p_employee_id, p_site_id, p_is_primary)
  ON CONFLICT (employee_id, site_id) DO UPDATE SET
    is_primary = EXCLUDED.is_primary,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION remove_employee_entity(
  p_employee_id BIGINT,
  p_site_id BIGINT
)
RETURNS VOID AS $$
BEGIN
  DELETE FROM employee_entities 
  WHERE employee_id = p_employee_id AND site_id = p_site_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION set_primary_entity(
  p_employee_id BIGINT,
  p_site_id BIGINT
)
RETURNS VOID AS $$
BEGIN
  -- First, unset all primary entities for this employee
  UPDATE employee_entities 
  SET is_primary = false 
  WHERE employee_id = p_employee_id;
  
  -- Then set the specified entity as primary
  UPDATE employee_entities 
  SET is_primary = true 
  WHERE employee_id = p_employee_id AND site_id = p_site_id;
END;
$$ LANGUAGE plpgsql;

-- 8. Verify the setup
SELECT 
  'Table Structure' as check_type,
  table_name,
  column_name,
  data_type
FROM information_schema.columns 
WHERE table_name IN ('employee_entities', 'employees', 'sites')
ORDER BY table_name, ordinal_position;

-- 9. Show sample data
SELECT 
  'Sample Employee Entities' as check_type,
  e.name as employee_name,
  s.name as site_name,
  ee.is_primary,
  ee.assigned_date
FROM employee_entities ee
JOIN employees e ON e.id = ee.employee_id
JOIN sites s ON s.id = ee.site_id
ORDER BY e.name, ee.is_primary DESC
LIMIT 10;

-- 10. Show employees with multiple entities
SELECT 
  'Employees with Multiple Entities' as check_type,
  e.name as employee_name,
  COUNT(ee.site_id) as entity_count,
  STRING_AGG(s.name, ', ' ORDER BY ee.is_primary DESC, s.name) as entities
FROM employees e
JOIN employee_entities ee ON ee.employee_id = e.id
JOIN sites s ON s.id = ee.site_id
GROUP BY e.id, e.name
HAVING COUNT(ee.site_id) > 1
ORDER BY entity_count DESC, e.name; 