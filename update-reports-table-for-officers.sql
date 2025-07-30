-- Update reports table to add site_id and replace officer_name with entity_officer_id and security_officer_id
-- This migration adds the new fields and removes the old officer_name field

-- Add new fields
ALTER TABLE reports 
ADD COLUMN IF NOT EXISTS site_id INTEGER REFERENCES sites(id),
ADD COLUMN IF NOT EXISTS entity_officer_id INTEGER REFERENCES entity_staff(id),
ADD COLUMN IF NOT EXISTS security_officer_id INTEGER REFERENCES security_staff(id);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_reports_site_id ON reports(site_id);
CREATE INDEX IF NOT EXISTS idx_reports_entity_officer_id ON reports(entity_officer_id);
CREATE INDEX IF NOT EXISTS idx_reports_security_officer_id ON reports(security_officer_id);

-- Note: The officer_name column will be kept for backward compatibility during transition
-- You can remove it later with: ALTER TABLE reports DROP COLUMN officer_name;

-- Update any existing reports to have default values (optional)
-- UPDATE reports SET site_id = NULL WHERE site_id IS NULL;
-- UPDATE reports SET entity_officer_id = NULL WHERE entity_officer_id IS NULL;
-- UPDATE reports SET security_officer_id = NULL WHERE security_officer_id IS NULL; 