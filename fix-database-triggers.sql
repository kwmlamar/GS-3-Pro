-- Fix Database Triggers
-- This script updates triggers to use the new entity_staff table

-- 1. Drop the old trigger on employees table (if it exists)
DROP TRIGGER IF EXISTS update_employees_updated_at ON employees;

-- 2. Create function to update updated_at timestamp (if it doesn't exist)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 3. Create the trigger on entity_staff table
DROP TRIGGER IF EXISTS update_entity_staff_updated_at ON entity_staff;
CREATE TRIGGER update_entity_staff_updated_at 
    BEFORE UPDATE ON entity_staff 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 4. Create indexes for entity_staff table (if they don't exist)
CREATE INDEX IF NOT EXISTS idx_entity_staff_name ON entity_staff USING gin(to_tsvector('english', name));
CREATE INDEX IF NOT EXISTS idx_entity_staff_role ON entity_staff USING gin(to_tsvector('english', role));
CREATE INDEX IF NOT EXISTS idx_entity_staff_site ON entity_staff USING gin(to_tsvector('english', site));
CREATE INDEX IF NOT EXISTS idx_entity_staff_type ON entity_staff(type);
CREATE INDEX IF NOT EXISTS idx_entity_staff_status ON entity_staff(status);

-- 5. Enable Row Level Security (RLS) on entity_staff table
ALTER TABLE entity_staff ENABLE ROW LEVEL SECURITY;

-- 6. Drop old policies (only if they exist)
DO $$
BEGIN
    -- Try to drop old policies, but don't fail if they don't exist
    BEGIN
        DROP POLICY IF EXISTS "Allow authenticated users to read employees" ON employees;
    EXCEPTION WHEN undefined_table THEN
        -- Table doesn't exist, which is fine
    END;
    
    BEGIN
        DROP POLICY IF EXISTS "Allow authenticated users to insert employees" ON employees;
    EXCEPTION WHEN undefined_table THEN
        -- Table doesn't exist, which is fine
    END;
    
    BEGIN
        DROP POLICY IF EXISTS "Allow authenticated users to update employees" ON employees;
    EXCEPTION WHEN undefined_table THEN
        -- Table doesn't exist, which is fine
    END;
    
    BEGIN
        DROP POLICY IF EXISTS "Allow authenticated users to delete employees" ON employees;
    EXCEPTION WHEN undefined_table THEN
        -- Table doesn't exist, which is fine
    END;
END $$;

-- 7. Create new policies for entity_staff table
DROP POLICY IF EXISTS "Allow authenticated users to read entity_staff" ON entity_staff;
CREATE POLICY "Allow authenticated users to read entity_staff" ON entity_staff
  FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow authenticated users to insert entity_staff" ON entity_staff;
CREATE POLICY "Allow authenticated users to insert entity_staff" ON entity_staff
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow authenticated users to update entity_staff" ON entity_staff;
CREATE POLICY "Allow authenticated users to update entity_staff" ON entity_staff
  FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow authenticated users to delete entity_staff" ON entity_staff;
CREATE POLICY "Allow authenticated users to delete entity_staff" ON entity_staff
  FOR DELETE USING (auth.role() = 'authenticated');

-- 8. Test the fix
SELECT 'Database triggers and policies updated successfully!' as status; 