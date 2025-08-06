-- Simple Database Fix
-- This script fixes the essential issues without touching non-existent tables

-- 1. Create the trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 2. Create trigger on entity_staff table
DROP TRIGGER IF EXISTS update_entity_staff_updated_at ON entity_staff;
CREATE TRIGGER update_entity_staff_updated_at 
    BEFORE UPDATE ON entity_staff 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 3. Enable RLS on entity_staff table
ALTER TABLE entity_staff ENABLE ROW LEVEL SECURITY;

-- 4. Create basic policies for entity_staff table
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

-- 5. Test the fix
SELECT 'Simple database fix completed successfully!' as status; 