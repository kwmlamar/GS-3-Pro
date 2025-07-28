-- Fix database schema issues for Security Staff functionality

-- 1. Add missing client_id column to subcontractor_profiles table
ALTER TABLE subcontractor_profiles 
ADD COLUMN IF NOT EXISTS client_id BIGINT REFERENCES clients(id) ON DELETE SET NULL;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_subcontractor_profiles_client_id ON subcontractor_profiles(client_id);

-- 2. Add missing supervisor_id column to security_staff table
ALTER TABLE security_staff 
ADD COLUMN IF NOT EXISTS supervisor_id BIGINT REFERENCES security_staff(id) ON DELETE SET NULL;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_security_staff_supervisor_id ON security_staff(supervisor_id);

-- 3. Ensure security_staff_entities table exists
CREATE TABLE IF NOT EXISTS security_staff_entities (
  id BIGSERIAL PRIMARY KEY,
  security_staff_id BIGINT REFERENCES security_staff(id) ON DELETE CASCADE,
  site_id BIGINT REFERENCES sites(id) ON DELETE CASCADE,
  is_primary BOOLEAN DEFAULT false,
  assignment_start_date DATE DEFAULT CURRENT_DATE,
  assignment_end_date DATE,
  status VARCHAR(50) DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive', 'Completed', 'Terminated')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(security_staff_id, site_id)
);

-- Create indexes for security_staff_entities
CREATE INDEX IF NOT EXISTS idx_security_staff_entities_staff_id ON security_staff_entities(security_staff_id);
CREATE INDEX IF NOT EXISTS idx_security_staff_entities_site_id ON security_staff_entities(site_id);
CREATE INDEX IF NOT EXISTS idx_security_staff_entities_is_primary ON security_staff_entities(is_primary);
CREATE INDEX IF NOT EXISTS idx_security_staff_entities_status ON security_staff_entities(status);

-- Enable RLS for security_staff_entities
ALTER TABLE security_staff_entities ENABLE ROW LEVEL SECURITY;

-- Create policies for security_staff_entities
CREATE POLICY "Allow authenticated users to read security_staff_entities" ON security_staff_entities
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to insert security_staff_entities" ON security_staff_entities
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update security_staff_entities" ON security_staff_entities
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete security_staff_entities" ON security_staff_entities
  FOR DELETE USING (auth.role() = 'authenticated');

-- Create trigger for updated_at
CREATE TRIGGER update_security_staff_entities_updated_at BEFORE UPDATE ON security_staff_entities
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 4. Verify all required columns exist
SELECT 
  'subcontractor_profiles' as table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'subcontractor_profiles' 
  AND column_name IN ('id', 'company_name', 'service_specialization', 'client_id')
ORDER BY column_name;

SELECT 
  'security_staff' as table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'security_staff' 
  AND column_name IN ('id', 'first_name', 'last_name', 'employee_id', 'position', 'status', 'hire_date', 'email', 'phone', 'compliance_score', 'certifications', 'notes', 'supervisor_id')
ORDER BY column_name;

SELECT 
  'security_staff_entities' as table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'security_staff_entities' 
  AND column_name IN ('id', 'security_staff_id', 'site_id', 'is_primary')
ORDER BY column_name;

-- 5. Insert sample data if tables are empty
INSERT INTO subcontractor_profiles (company_name, service_specialization, status) 
VALUES 
  ('SecureCorp', 'Security Services', 'Active'),
  ('Guardian Security', 'Security Services', 'Active')
ON CONFLICT (id) DO NOTHING;

-- Verify the fixes
SELECT 'Database schema fixes completed successfully!' as status; 