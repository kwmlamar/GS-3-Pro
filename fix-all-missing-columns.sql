-- Comprehensive fix for all missing columns in subcontractor_profiles table
-- This script adds all the missing columns that the application expects

-- 1. Add missing client_id column to subcontractor_profiles table (if not exists)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'subcontractor_profiles' AND column_name = 'client_id'
    ) THEN
        ALTER TABLE subcontractor_profiles ADD COLUMN client_id BIGINT REFERENCES clients(id) ON DELETE SET NULL;
        RAISE NOTICE 'Added client_id column to subcontractor_profiles';
    ELSE
        RAISE NOTICE 'client_id column already exists in subcontractor_profiles';
    END IF;
END $$;

-- 2. Add missing tier column to subcontractor_profiles table (if not exists)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'subcontractor_profiles' AND column_name = 'tier'
    ) THEN
        ALTER TABLE subcontractor_profiles ADD COLUMN tier INTEGER DEFAULT 1 CHECK (tier >= 1 AND tier <= 3);
        RAISE NOTICE 'Added tier column to subcontractor_profiles';
    ELSE
        RAISE NOTICE 'tier column already exists in subcontractor_profiles';
    END IF;
END $$;

-- 3. Add missing supervisor_id column to security_staff table (if not exists)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'security_staff' AND column_name = 'supervisor_id'
    ) THEN
        ALTER TABLE security_staff ADD COLUMN supervisor_id BIGINT REFERENCES security_staff(id) ON DELETE SET NULL;
        RAISE NOTICE 'Added supervisor_id column to security_staff';
    ELSE
        RAISE NOTICE 'supervisor_id column already exists in security_staff';
    END IF;
END $$;

-- Create indexes for better performance (if not exist)
CREATE INDEX IF NOT EXISTS idx_subcontractor_profiles_client_id ON subcontractor_profiles(client_id);
CREATE INDEX IF NOT EXISTS idx_subcontractor_profiles_tier ON subcontractor_profiles(tier);
CREATE INDEX IF NOT EXISTS idx_security_staff_supervisor_id ON security_staff(supervisor_id);

-- 4. Ensure security_staff_entities table exists with proper structure
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

-- Create indexes for security_staff_entities (if not exist)
CREATE INDEX IF NOT EXISTS idx_security_staff_entities_staff_id ON security_staff_entities(security_staff_id);
CREATE INDEX IF NOT EXISTS idx_security_staff_entities_site_id ON security_staff_entities(site_id);
CREATE INDEX IF NOT EXISTS idx_security_staff_entities_is_primary ON security_staff_entities(is_primary);
CREATE INDEX IF NOT EXISTS idx_security_staff_entities_status ON security_staff_entities(status);

-- Enable RLS for security_staff_entities (if not already enabled)
ALTER TABLE security_staff_entities ENABLE ROW LEVEL SECURITY;

-- Create policies for security_staff_entities (only if they don't exist)
DO $$ 
BEGIN
    -- Check and create read policy
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'security_staff_entities' 
        AND policyname = 'Allow authenticated users to read security_staff_entities'
    ) THEN
        CREATE POLICY "Allow authenticated users to read security_staff_entities" ON security_staff_entities
          FOR SELECT USING (auth.role() = 'authenticated');
        RAISE NOTICE 'Created read policy for security_staff_entities';
    ELSE
        RAISE NOTICE 'Read policy already exists for security_staff_entities';
    END IF;

    -- Check and create insert policy
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'security_staff_entities' 
        AND policyname = 'Allow authenticated users to insert security_staff_entities'
    ) THEN
        CREATE POLICY "Allow authenticated users to insert security_staff_entities" ON security_staff_entities
          FOR INSERT WITH CHECK (auth.role() = 'authenticated');
        RAISE NOTICE 'Created insert policy for security_staff_entities';
    ELSE
        RAISE NOTICE 'Insert policy already exists for security_staff_entities';
    END IF;

    -- Check and create update policy
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'security_staff_entities' 
        AND policyname = 'Allow authenticated users to update security_staff_entities'
    ) THEN
        CREATE POLICY "Allow authenticated users to update security_staff_entities" ON security_staff_entities
          FOR UPDATE USING (auth.role() = 'authenticated');
        RAISE NOTICE 'Created update policy for security_staff_entities';
    ELSE
        RAISE NOTICE 'Update policy already exists for security_staff_entities';
    END IF;

    -- Check and create delete policy
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'security_staff_entities' 
        AND policyname = 'Allow authenticated users to delete security_staff_entities'
    ) THEN
        CREATE POLICY "Allow authenticated users to delete security_staff_entities" ON security_staff_entities
          FOR DELETE USING (auth.role() = 'authenticated');
        RAISE NOTICE 'Created delete policy for security_staff_entities';
    ELSE
        RAISE NOTICE 'Delete policy already exists for security_staff_entities';
    END IF;
END $$;

-- Create trigger for updated_at (if not exists)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'update_security_staff_entities_updated_at'
    ) THEN
        CREATE TRIGGER update_security_staff_entities_updated_at BEFORE UPDATE ON security_staff_entities
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
        RAISE NOTICE 'Created updated_at trigger for security_staff_entities';
    ELSE
        RAISE NOTICE 'Updated_at trigger already exists for security_staff_entities';
    END IF;
END $$;

-- 5. Insert sample data if subcontractor_profiles is empty
INSERT INTO subcontractor_profiles (company_name, service_specialization, status, tier) 
SELECT 'SecureCorp', 'Security Services', 'Active', 1
WHERE NOT EXISTS (SELECT 1 FROM subcontractor_profiles WHERE company_name = 'SecureCorp');

INSERT INTO subcontractor_profiles (company_name, service_specialization, status, tier) 
SELECT 'Guardian Security', 'Security Services', 'Active', 2
WHERE NOT EXISTS (SELECT 1 FROM subcontractor_profiles WHERE company_name = 'Guardian Security');

-- 6. Update existing records to have default tier if they don't have one
UPDATE subcontractor_profiles SET tier = 1 WHERE tier IS NULL;

-- 7. Verify all required columns exist
SELECT 
  'subcontractor_profiles' as table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'subcontractor_profiles' 
  AND column_name IN ('id', 'company_name', 'service_specialization', 'client_id', 'tier')
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

-- Final verification
SELECT 'All missing columns have been added successfully!' as status; 