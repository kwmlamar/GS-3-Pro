-- Update employees_with_supervisors view to use entity_staff table
DROP VIEW IF EXISTS employees_with_supervisors;

CREATE OR REPLACE VIEW entity_staff_with_supervisors AS
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
  s.type as supervisor_type,
  EXISTS(SELECT 1 FROM entity_staff WHERE supervisor_id = e.id AND status != 'Archived') as has_reports
FROM entity_staff e
LEFT JOIN entity_staff s ON e.supervisor_id = s.id
WHERE e.status != 'Archived'
ORDER BY e.name;

-- Grant permissions on the new view
GRANT SELECT ON entity_staff_with_supervisors TO authenticated;
GRANT SELECT ON entity_staff_with_supervisors TO anon; 