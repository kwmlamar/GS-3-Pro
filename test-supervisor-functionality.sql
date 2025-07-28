-- Test supervisor functionality
-- Run this after adding the supervisor_id column

-- Test 1: Check if supervisor_id column exists
SELECT 'Testing supervisor_id column existence:' as test;
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'employees' AND column_name = 'supervisor_id';

-- Test 2: Update some employees with supervisor assignments
UPDATE employees 
SET supervisor_id = (
  SELECT id FROM employees 
  WHERE name = 'Mike Rodriguez' AND type = 'Operations Management'
)
WHERE name IN ('John Smith', 'Sarah Johnson', 'Lisa Chen')
AND supervisor_id IS NULL;

-- Test 3: Show employees with their supervisors
SELECT 'Employees with supervisors:' as test;
SELECT 
  e.name as employee_name,
  e.role as employee_role,
  s.name as supervisor_name,
  s.role as supervisor_role
FROM employees e
LEFT JOIN employees s ON e.supervisor_id = s.id
ORDER BY e.name;

-- Test 4: Show who reports to Mike Rodriguez
SELECT 'Direct reports of Mike Rodriguez:' as test;
SELECT 
  name,
  role,
  type
FROM employees 
WHERE supervisor_id = (SELECT id FROM employees WHERE name = 'Mike Rodriguez')
ORDER BY name;

-- Test 5: Test the view
SELECT 'Testing employees_with_supervisors view:' as test;
SELECT 
  name,
  role,
  supervisor_name,
  supervisor_role
FROM employees_with_supervisors
ORDER BY name; 