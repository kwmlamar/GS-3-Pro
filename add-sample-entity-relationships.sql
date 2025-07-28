-- Add sample entity staff and security staff relationships for testing
-- Run this in your Supabase SQL Editor

-- First, let's check what data we have
SELECT 'Current sites:' as info;
SELECT id, name, type FROM sites LIMIT 5;

SELECT 'Current entity staff:' as info;
SELECT id, first_name, last_name, email FROM entity_staff LIMIT 5;

SELECT 'Current security staff:' as info;
SELECT id, first_name, last_name, email FROM security_staff LIMIT 5;

-- Add sample entity staff relationships
-- This assumes you have some sites and entity staff already
INSERT INTO entity_staff_entities (entity_staff_id, site_id, is_primary, status) VALUES
-- Assuming entity_staff_id 1 and site_id 1 exist
(1, 1, true, 'active'),
(2, 1, false, 'active'),
(3, 2, true, 'active'),
(4, 2, false, 'active')
ON CONFLICT (entity_staff_id, site_id) DO NOTHING;

-- Add sample security staff relationships
-- This assumes you have some sites and security staff already
INSERT INTO security_staff_entities (security_staff_id, site_id, is_primary, status) VALUES
-- Assuming security_staff_id 1 and site_id 1 exist
(1, 1, true, 'active'),
(2, 1, false, 'active'),
(3, 2, true, 'active'),
(4, 2, false, 'active')
ON CONFLICT (security_staff_id, site_id) DO NOTHING;

-- Verify the relationships were created
SELECT 'Entity staff relationships:' as info;
SELECT 
  ese.entity_staff_id,
  ese.site_id,
  ese.is_primary,
  es.first_name,
  es.last_name,
  s.name as site_name
FROM entity_staff_entities ese
JOIN entity_staff es ON ese.entity_staff_id = es.id
JOIN sites s ON ese.site_id = s.id
LIMIT 10;

SELECT 'Security staff relationships:' as info;
SELECT 
  sse.security_staff_id,
  sse.site_id,
  sse.is_primary,
  ss.first_name,
  ss.last_name,
  s.name as site_name
FROM security_staff_entities sse
JOIN security_staff ss ON sse.security_staff_id = ss.id
JOIN sites s ON sse.site_id = s.id
LIMIT 10; 