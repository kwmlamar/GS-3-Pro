-- Create entity_staff_with_supervisors view
CREATE OR REPLACE VIEW entity_staff_with_supervisors AS
SELECT 
    es.id,
    es.name,
    es.role,
    es.type,
    es.site,
    es.status,
    es.compliance,
    es.certifications,
    es.email,
    es.phone,
    es.hire_date,
    es.department_id,
    es.supervisor_id,
    es.notes,
    es.created_at,
    es.updated_at,
    supervisor.name as supervisor_name,
    supervisor.role as supervisor_role,
    d.name as department_name
FROM entity_staff es
LEFT JOIN entity_staff supervisor ON es.supervisor_id = supervisor.id
LEFT JOIN departments d ON es.department_id = d.id;

-- Grant permissions to the view
GRANT SELECT ON entity_staff_with_supervisors TO authenticated;

-- Add comment to the view
COMMENT ON VIEW entity_staff_with_supervisors IS 'Entity staff with supervisor and department information'; 