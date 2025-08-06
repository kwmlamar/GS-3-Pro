-- Fix database functions that still reference employees table
-- This script updates all database functions to use entity_staff instead of employees

-- 1. Update get_full_reporting_chain function
CREATE OR REPLACE FUNCTION get_full_reporting_chain(entity_staff_id BIGINT)
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
    FROM entity_staff e
    WHERE e.supervisor_id = entity_staff_id
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
    FROM entity_staff e
    INNER JOIN reporting_chain rc ON e.supervisor_id = rc.id
    WHERE e.status != 'Archived'
  )
  SELECT * FROM reporting_chain
  ORDER BY level, name;
END;
$$ LANGUAGE plpgsql;

-- 2. Update get_supervisor_chain function
CREATE OR REPLACE FUNCTION get_supervisor_chain(entity_staff_id BIGINT)
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
    FROM entity_staff e
    WHERE e.id = (
      SELECT supervisor_id 
      FROM entity_staff 
      WHERE id = entity_staff_id
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
    FROM entity_staff e
    INNER JOIN supervisor_chain sc ON e.id = sc.id
    WHERE e.id = (
      SELECT supervisor_id 
      FROM entity_staff 
      WHERE id = sc.id
    )
    AND e.status != 'Archived'
  )
  SELECT * FROM supervisor_chain
  ORDER BY level;
END;
$$ LANGUAGE plpgsql;

-- 3. Update get_direct_reports function
CREATE OR REPLACE FUNCTION get_direct_reports(entity_staff_id BIGINT)
RETURNS TABLE(
  id BIGINT,
  name VARCHAR(255),
  role VARCHAR(255),
  type VARCHAR(100),
  status VARCHAR(50),
  compliance INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    e.id,
    e.name,
    e.role,
    e.type,
    e.status,
    e.compliance
  FROM entity_staff e
  WHERE e.supervisor_id = entity_staff_id
  AND e.status != 'Archived'
  ORDER BY e.name;
END;
$$ LANGUAGE plpgsql;

-- 4. Update get_organizational_chart function
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
  SELECT 
    e.id,
    e.name,
    e.role,
    e.type,
    e.supervisor_id,
    s.name as supervisor_name,
    CASE 
      WHEN e.supervisor_id IS NULL THEN 0
      ELSE 1
    END as level,
    EXISTS(SELECT 1 FROM entity_staff WHERE supervisor_id = e.id AND status != 'Archived') as has_reports
  FROM entity_staff e
  LEFT JOIN entity_staff s ON e.supervisor_id = s.id
  WHERE e.status != 'Archived'
  ORDER BY level, e.name;
END;
$$ LANGUAGE plpgsql;

-- 5. Update validate_supervisor_assignment function
CREATE OR REPLACE FUNCTION validate_supervisor_assignment()
RETURNS TRIGGER AS $$
BEGIN
  -- Prevent circular references
  IF NEW.supervisor_id = NEW.id THEN
    RAISE EXCEPTION 'An employee cannot be their own supervisor';
  END IF;
  
  -- Check if supervisor exists and is active
  IF NEW.supervisor_id IS NOT NULL THEN
    IF NOT EXISTS (
      SELECT 1 FROM entity_staff 
      WHERE id = NEW.supervisor_id 
      AND status = 'Active'
    ) THEN
      RAISE EXCEPTION 'Supervisor must be an active employee';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 6. Update the trigger to use entity_staff table
DROP TRIGGER IF EXISTS validate_supervisor_trigger ON entity_staff;
CREATE TRIGGER validate_supervisor_trigger
  BEFORE INSERT OR UPDATE ON entity_staff
  FOR EACH ROW
  EXECUTE FUNCTION validate_supervisor_assignment();

-- 7. Update employees_with_supervisors view to entity_staff_with_supervisors
CREATE OR REPLACE VIEW entity_staff_with_supervisors AS
SELECT 
  e.id,
  e.name,
  e.role,
  e.type,
  e.site,
  e.status,
  e.compliance,
  e.email,
  e.phone,
  e.hire_date,
  e.department_id,
  e.supervisor_id,
  s.name as supervisor_name,
  s.role as supervisor_role,
  s.type as supervisor_type,
  d.name as department_name,
  d.description as department_description
FROM entity_staff e
LEFT JOIN entity_staff s ON e.supervisor_id = s.id
LEFT JOIN departments d ON e.department_id = d.id
WHERE e.status != 'Archived'
ORDER BY e.name;

-- Verify the functions were updated
SELECT 'Database functions updated successfully!' as status;
SELECT 'Functions updated:' as info;
SELECT 'get_full_reporting_chain' as function_name UNION ALL
SELECT 'get_supervisor_chain' UNION ALL
SELECT 'get_direct_reports' UNION ALL
SELECT 'get_organizational_chart' UNION ALL
SELECT 'validate_supervisor_assignment' UNION ALL
SELECT 'entity_staff_with_supervisors view'; 