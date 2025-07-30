-- Update violations and observations tables to match reports table structure
-- This migration adds proper foreign key relationships for consistency

-- ============================================================================
-- VIOLATIONS TABLE MIGRATION
-- ============================================================================

-- Add new fields to violations table
ALTER TABLE violations 
ADD COLUMN IF NOT EXISTS entity_officer_id INTEGER REFERENCES entity_staff(id),
ADD COLUMN IF NOT EXISTS security_officer_id INTEGER REFERENCES security_staff(id);

-- Update site_id to have proper foreign key reference (if not already set)
-- Note: This assumes site_id already exists but may not have the foreign key constraint
ALTER TABLE violations 
DROP CONSTRAINT IF EXISTS violations_site_id_fkey;

ALTER TABLE violations 
ADD CONSTRAINT violations_site_id_fkey 
FOREIGN KEY (site_id) REFERENCES sites(id);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_violations_site_id ON violations(site_id);
CREATE INDEX IF NOT EXISTS idx_violations_entity_officer_id ON violations(entity_officer_id);
CREATE INDEX IF NOT EXISTS idx_violations_security_officer_id ON violations(security_officer_id);

-- ============================================================================
-- OBSERVATIONS TABLE MIGRATION  
-- ============================================================================

-- Add new fields to observations table
ALTER TABLE observations 
ADD COLUMN IF NOT EXISTS entity_officer_id INTEGER REFERENCES entity_staff(id),
ADD COLUMN IF NOT EXISTS security_officer_id INTEGER REFERENCES security_staff(id);

-- Update site_id to have proper foreign key reference (if not already set)
-- Note: This assumes site_id already exists but may not have the foreign key constraint
ALTER TABLE observations 
DROP CONSTRAINT IF EXISTS observations_site_id_fkey;

ALTER TABLE observations 
ADD CONSTRAINT observations_site_id_fkey 
FOREIGN KEY (site_id) REFERENCES sites(id);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_observations_site_id ON observations(site_id);
CREATE INDEX IF NOT EXISTS idx_observations_entity_officer_id ON observations(entity_officer_id);
CREATE INDEX IF NOT EXISTS idx_observations_security_officer_id ON observations(security_officer_id);

-- ============================================================================
-- MIGRATION NOTES
-- ============================================================================

-- Note: The existing name fields will be kept for backward compatibility during transition
-- You can remove them later with:
-- ALTER TABLE violations DROP COLUMN reported_by_name;
-- ALTER TABLE observations DROP COLUMN observer_name;

-- Update any existing records to have default values (optional)
-- UPDATE violations SET entity_officer_id = NULL WHERE entity_officer_id IS NULL;
-- UPDATE violations SET security_officer_id = NULL WHERE security_officer_id IS NULL;
-- UPDATE observations SET entity_officer_id = NULL WHERE entity_officer_id IS NULL;
-- UPDATE observations SET security_officer_id = NULL WHERE security_officer_id IS NULL;

-- ============================================================================
-- CONSISTENT STRUCTURE SUMMARY
-- ============================================================================

-- After this migration, all three tables will have consistent structure:

-- REPORTS TABLE:
-- - site_id INTEGER REFERENCES sites(id)
-- - entity_officer_id INTEGER REFERENCES entity_staff(id)  
-- - security_officer_id INTEGER REFERENCES security_staff(id)
-- - site_name VARCHAR(255) (legacy field)
-- - officer_name VARCHAR(255) (legacy field)

-- VIOLATIONS TABLE:
-- - site_id INTEGER REFERENCES sites(id)
-- - entity_officer_id INTEGER REFERENCES entity_staff(id)
-- - security_officer_id INTEGER REFERENCES security_staff(id)
-- - site_name VARCHAR(255) (legacy field)
-- - reported_by_name VARCHAR(255) (legacy field)

-- OBSERVATIONS TABLE:
-- - site_id INTEGER REFERENCES sites(id)
-- - entity_officer_id INTEGER REFERENCES entity_staff(id)
-- - security_officer_id INTEGER REFERENCES security_staff(id)
-- - site_name VARCHAR(255) (legacy field)
-- - observer_name VARCHAR(255) (legacy field)

-- This provides:
-- 1. Consistent foreign key relationships across all tables
-- 2. Better data integrity and referential integrity
-- 3. Enhanced filtering and reporting capabilities
-- 4. Backward compatibility with existing data
-- 5. Proper indexing for performance 