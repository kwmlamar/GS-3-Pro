-- Add supervisor_id column to employees table
-- Run this in your Supabase SQL Editor

-- Add supervisor_id column to employees table
ALTER TABLE employees ADD COLUMN IF NOT EXISTS supervisor_id BIGINT REFERENCES employees(id);

-- Create index for better performance on supervisor queries
CREATE INDEX IF NOT EXISTS idx_employees_supervisor_id ON employees(supervisor_id);

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

-- Verification
SELECT 'Supervisor column added successfully!' as status;
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'employees' AND column_name = 'supervisor_id'; 