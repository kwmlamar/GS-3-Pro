-- Create test staff data and relationships for EntityDetailsDialog testing
-- Run this in your Supabase SQL Editor

-- First, let's check what we have
SELECT 'Current state:' as info;
SELECT 'Sites:' as table_name, COUNT(*) as count FROM sites;
SELECT 'Entity staff:' as table_name, COUNT(*) as count FROM entity_staff;
SELECT 'Security staff:' as table_name, COUNT(*) as count FROM security_staff;
SELECT 'Entity staff entities:' as table_name, COUNT(*) as count FROM entity_staff_entities;
SELECT 'Security staff entities:' as table_name, COUNT(*) as count FROM security_staff_entities;

-- Add test entity staff if none exist
INSERT INTO entity_staff (first_name, last_name, email, phone, position, department, site, status) VALUES
('John', 'Smith', 'john.smith@gs3.com', '+1-555-0101', 'Site Manager', 'Operations', 'Corporate HQ Alpha', 'Active'),
('Sarah', 'Johnson', 'sarah.johnson@gs3.com', '+1-555-0102', 'HR Director', 'Human Resources', 'Corporate HQ Alpha', 'Active'),
('Mike', 'Davis', 'mike.davis@gs3.com', '+1-555-0103', 'IT Manager', 'IT', 'Metro Hospital West', 'Active'),
('Lisa', 'Wilson', 'lisa.wilson@gs3.com', '+1-555-0104', 'Administrative Assistant', 'Administration', 'Metro Hospital West', 'Active')
ON CONFLICT (id) DO NOTHING;

-- Add test security staff if none exist
INSERT INTO security_staff (first_name, last_name, email, phone, position, site, status) VALUES
('Robert', 'Anderson', 'robert.anderson@gs3.com', '+1-555-0201', 'Security Officer', 'Corporate HQ Alpha', 'Active'),
('Jennifer', 'Martinez', 'jennifer.martinez@gs3.com', '+1-555-0202', 'Security Supervisor', 'Corporate HQ Alpha', 'Active'),
('Michael', 'Brown', 'michael.brown@gs3.com', '+1-555-0203', 'Security Officer', 'Metro Hospital West', 'Active'),
('Emily', 'Taylor', 'emily.taylor@gs3.com', '+1-555-0204', 'Security Officer', 'Metro Hospital West', 'Active')
ON CONFLICT (id) DO NOTHING;

-- Get the IDs we just created
WITH entity_staff_ids AS (
  SELECT id FROM entity_staff WHERE first_name IN ('John', 'Sarah', 'Mike', 'Lisa')
),
security_staff_ids AS (
  SELECT id FROM security_staff WHERE first_name IN ('Robert', 'Jennifer', 'Michael', 'Emily')
),
site_ids AS (
  SELECT id FROM sites WHERE name IN ('Corporate HQ Alpha', 'Metro Hospital West')
)
-- Create entity staff relationships
INSERT INTO entity_staff_entities (entity_staff_id, site_id, is_primary, status)
SELECT 
  es.id as entity_staff_id,
  s.id as site_id,
  CASE 
    WHEN es.first_name IN ('John', 'Mike') THEN true
    ELSE false
  END as is_primary,
  'active' as status
FROM entity_staff es
CROSS JOIN sites s
WHERE es.first_name IN ('John', 'Sarah', 'Mike', 'Lisa')
  AND s.name IN ('Corporate HQ Alpha', 'Metro Hospital West')
  AND (
    (es.first_name IN ('John', 'Sarah') AND s.name = 'Corporate HQ Alpha') OR
    (es.first_name IN ('Mike', 'Lisa') AND s.name = 'Metro Hospital West')
  )
ON CONFLICT (entity_staff_id, site_id) DO NOTHING;

-- Create security staff relationships
INSERT INTO security_staff_entities (security_staff_id, site_id, is_primary, status)
SELECT 
  ss.id as security_staff_id,
  s.id as site_id,
  CASE 
    WHEN ss.first_name IN ('Robert', 'Michael') THEN true
    ELSE false
  END as is_primary,
  'active' as status
FROM security_staff ss
CROSS JOIN sites s
WHERE ss.first_name IN ('Robert', 'Jennifer', 'Michael', 'Emily')
  AND s.name IN ('Corporate HQ Alpha', 'Metro Hospital West')
  AND (
    (ss.first_name IN ('Robert', 'Jennifer') AND s.name = 'Corporate HQ Alpha') OR
    (ss.first_name IN ('Michael', 'Emily') AND s.name = 'Metro Hospital West')
  )
ON CONFLICT (security_staff_id, site_id) DO NOTHING;

-- Verify the test data was created
SELECT 'After creating test data:' as info;
SELECT 'Sites:' as table_name, COUNT(*) as count FROM sites;
SELECT 'Entity staff:' as table_name, COUNT(*) as count FROM entity_staff;
SELECT 'Security staff:' as table_name, COUNT(*) as count FROM security_staff;
SELECT 'Entity staff entities:' as table_name, COUNT(*) as count FROM entity_staff_entities;
SELECT 'Security staff entities:' as table_name, COUNT(*) as count FROM security_staff_entities;

-- Show the relationships
SELECT 'Entity staff relationships:' as info;
SELECT 
  es.first_name || ' ' || es.last_name as staff_name,
  s.name as site_name,
  ese.is_primary,
  ese.status
FROM entity_staff_entities ese
JOIN entity_staff es ON ese.entity_staff_id = es.id
JOIN sites s ON ese.site_id = s.id;

SELECT 'Security staff relationships:' as info;
SELECT 
  ss.first_name || ' ' || ss.last_name as staff_name,
  s.name as site_name,
  sse.is_primary,
  sse.status
FROM security_staff_entities sse
JOIN security_staff ss ON sse.security_staff_id = ss.id
JOIN sites s ON sse.site_id = s.id; 