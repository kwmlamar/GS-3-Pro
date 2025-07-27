-- Chain of Command System Setup
-- This script adds hierarchical reporting structure to employees

-- Add supervisor_id column to employees table
ALTER TABLE employees ADD COLUMN IF NOT EXISTS supervisor_id BIGINT REFERENCES employees(id);

-- Create index for better performance on supervisor queries
CREATE INDEX IF NOT EXISTS idx_employees_supervisor_id ON employees(supervisor_id);

-- Create a function to get all direct reports of an employee
CREATE OR REPLACE FUNCTION get_direct_reports(employee_id BIGINT)
RETURNS TABLE(
  id BIGINT,
  name VARCHAR(255),
  role VARCHAR(255),
  type VARCHAR(100),
  status VARCHAR(50),
  compliance INTEGER,
  hire_date DATE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    e.id,
    e.name,
    e.role,
    e.type,
    e.status,
    e.compliance,
    e.hire_date
  FROM employees e
  WHERE e.supervisor_id = employee_id
  AND e.status != 'Archived'
  ORDER BY e.name;
END;
$$ LANGUAGE plpgsql;

-- Create a function to get the full reporting chain (all levels below)
CREATE OR REPLACE FUNCTION get_full_reporting_chain(employee_id BIGINT)
RETURNS TABLE(
  id BIGINT,
  name VARCHAR(255),
  role VARCHAR(255),
  type VARCHAR(100),
  level INTEGER,
  path TEXT
) AS $$
BEGIN
  RETURN QUERY
  WITH RECURSIVE reporting_chain AS (
    -- Base case: direct reports
    SELECT 
      e.id,
      e.name,
      e.role,
      e.type,
      1 as level,
      e.name::TEXT as path
    FROM employees e
    WHERE e.supervisor_id = employee_id
    AND e.status != 'Archived'
    
    UNION ALL
    
    -- Recursive case: reports of reports
    SELECT 
      e.id,
      e.name,
      e.role,
      e.type,
      rc.level + 1,
      rc.path || ' > ' || e.name
    FROM employees e
    INNER JOIN reporting_chain rc ON e.supervisor_id = rc.id
    WHERE e.status != 'Archived'
  )
  SELECT * FROM reporting_chain
  ORDER BY level, name;
END;
$$ LANGUAGE plpgsql;

-- Create a function to get the supervisor chain (all levels above)
CREATE OR REPLACE FUNCTION get_supervisor_chain(employee_id BIGINT)
RETURNS TABLE(
  id BIGINT,
  name VARCHAR(255),
  role VARCHAR(255),
  type VARCHAR(100),
  level INTEGER,
  path TEXT
) AS $$
BEGIN
  RETURN QUERY
  WITH RECURSIVE supervisor_chain AS (
    -- Base case: direct supervisor
    SELECT 
      e.id,
      e.name,
      e.role,
      e.type,
      1 as level,
      e.name::TEXT as path
    FROM employees e
    WHERE e.id = (
      SELECT supervisor_id 
      FROM employees 
      WHERE id = employee_id
    )
    AND e.status != 'Archived'
    
    UNION ALL
    
    -- Recursive case: supervisors of supervisors
    SELECT 
      e.id,
      e.name,
      e.role,
      e.type,
      sc.level + 1,
      e.name || ' > ' || sc.path
    FROM employees e
    INNER JOIN supervisor_chain sc ON e.id = sc.id
    WHERE e.id = (
      SELECT supervisor_id 
      FROM employees 
      WHERE id = sc.id
    )
    AND e.status != 'Archived'
  )
  SELECT * FROM supervisor_chain
  ORDER BY level;
END;
$$ LANGUAGE plpgsql;

-- Create a view for employees with supervisor information
CREATE OR REPLACE VIEW employees_with_supervisors AS
SELECT 
  e.id,
  e.name,
  e.role,
  e.type,
  e.status,
  e.compliance,
  e.hire_date,
  e.supervisor_id,
  s.name as supervisor_name,
  s.role as supervisor_role,
  s.type as supervisor_type
FROM employees e
LEFT JOIN employees s ON e.supervisor_id = s.id
WHERE e.status != 'Archived'
ORDER BY e.name;

-- Create a function to validate supervisor assignments (prevent circular references)
CREATE OR REPLACE FUNCTION validate_supervisor_assignment()
RETURNS TRIGGER AS $$
BEGIN
  -- Prevent self-supervision
  IF NEW.supervisor_id = NEW.id THEN
    RAISE EXCEPTION 'Employee cannot be their own supervisor';
  END IF;
  
  -- Prevent circular references (employee cannot supervise their own supervisor)
  IF NEW.supervisor_id IS NOT NULL THEN
    IF EXISTS (
      WITH RECURSIVE supervisor_chain AS (
        SELECT id, supervisor_id FROM employees WHERE id = NEW.supervisor_id
        UNION ALL
        SELECT e.id, e.supervisor_id 
        FROM employees e 
        INNER JOIN supervisor_chain sc ON e.id = sc.supervisor_id
      )
      SELECT 1 FROM supervisor_chain WHERE id = NEW.id
    ) THEN
      RAISE EXCEPTION 'Circular supervisor assignment detected';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to validate supervisor assignments
DROP TRIGGER IF EXISTS validate_supervisor_trigger ON employees;
CREATE TRIGGER validate_supervisor_trigger
  BEFORE INSERT OR UPDATE ON employees
  FOR EACH ROW
  EXECUTE FUNCTION validate_supervisor_assignment();

-- Update existing employees with sample supervisor assignments
-- First, let's set up a basic hierarchy
UPDATE employees 
SET supervisor_id = (
  SELECT id FROM employees 
  WHERE name = 'Mike Rodriguez' AND type = 'Operations Management'
)
WHERE name IN ('John Smith', 'Sarah Johnson', 'Lisa Chen')
AND supervisor_id IS NULL;

-- Add some additional employees to create a more complex hierarchy
INSERT INTO employees (name, role, type, site, status, compliance, certifications, email, phone, hire_date, notes, supervisor_id) VALUES
('David Wilson', 'Security Officer', 'Standard Officer', 'Corporate HQ Alpha', 'Active', 88, ARRAY['Basic Security', 'First Aid'], 'david.wilson@gs3.com', '+1-555-0127', '2023-06-01', 'New hire, showing good potential. Needs additional training.', (SELECT id FROM employees WHERE name = 'John Smith')),
('Emily Davis', 'Security Officer', 'Standard Officer', 'Metro Hospital East', 'Active', 94, ARRAY['Basic Security', 'First Aid', 'CPR'], 'emily.davis@gs3.com', '+1-555-0128', '2023-03-15', 'Excellent communication skills. Great with patients and visitors.', (SELECT id FROM employees WHERE name = 'Sarah Johnson')),
('Robert Brown', 'Site Supervisor', 'Supervisor', 'Regional Office', 'Active', 96, ARRAY['Advanced Security', 'Leadership', 'Emergency Response'], 'robert.brown@gs3.com', '+1-555-0129', '2022-09-10', 'Strong operational background. Handles multiple sites effectively.', (SELECT id FROM employees WHERE name = 'Mike Rodriguez')),
('Jennifer Lee', 'Security Consultant', 'Consultant', 'Multiple', 'Active', 90, ARRAY['Consulting', 'Risk Analysis'], 'jennifer.lee@gs3.com', '+1-555-0130', '2023-01-20', 'Specializes in healthcare security. Valuable for medical facility contracts.', (SELECT id FROM employees WHERE name = 'Lisa Chen'))
ON CONFLICT (id) DO NOTHING;

-- Create a function to get organizational chart data
CREATE OR REPLACE FUNCTION get_organizational_chart()
RETURNS TABLE(
  id BIGINT,
  name VARCHAR(255),
  role VARCHAR(255),
  type VARCHAR(100),
  supervisor_id BIGINT,
  supervisor_name VARCHAR(255),
  level INTEGER,
  has_reports BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  WITH RECURSIVE org_chart AS (
    -- Top level (no supervisor)
    SELECT 
      e.id,
      e.name,
      e.role,
      e.type,
      e.supervisor_id,
      s.name as supervisor_name,
      0 as level,
      EXISTS(SELECT 1 FROM employees WHERE supervisor_id = e.id AND status != 'Archived') as has_reports
    FROM employees e
    LEFT JOIN employees s ON e.supervisor_id = s.id
    WHERE e.supervisor_id IS NULL
    AND e.status != 'Archived'
    
    UNION ALL
    
    -- All other levels
    SELECT 
      e.id,
      e.name,
      e.role,
      e.type,
      e.supervisor_id,
      s.name as supervisor_name,
      oc.level + 1,
      EXISTS(SELECT 1 FROM employees WHERE supervisor_id = e.id AND status != 'Archived') as has_reports
    FROM employees e
    LEFT JOIN employees s ON e.supervisor_id = s.id
    INNER JOIN org_chart oc ON e.supervisor_id = oc.id
    WHERE e.status != 'Archived'
  )
  SELECT * FROM org_chart
  ORDER BY level, name;
END;
$$ LANGUAGE plpgsql;

-- Verification queries
SELECT 'Chain of Command System Setup Complete!' as status;

-- Test the functions
SELECT 'Testing get_direct_reports for Mike Rodriguez:' as test;
SELECT * FROM get_direct_reports((SELECT id FROM employees WHERE name = 'Mike Rodriguez'));

SELECT 'Testing get_full_reporting_chain for Mike Rodriguez:' as test;
SELECT * FROM get_full_reporting_chain((SELECT id FROM employees WHERE name = 'Mike Rodriguez'));

SELECT 'Testing get_supervisor_chain for David Wilson:' as test;
SELECT * FROM get_supervisor_chain((SELECT id FROM employees WHERE name = 'David Wilson'));

SELECT 'Testing organizational chart:' as test;
SELECT * FROM get_organizational_chart(); 