-- Simple fix for the validate_supervisor_assignment trigger function
-- This only fixes the trigger function that's causing the "employees" table error

-- 1. Drop the existing trigger first
DROP TRIGGER IF EXISTS validate_supervisor_trigger ON entity_staff;

-- 2. Update the validate_supervisor_assignment function to use entity_staff instead of employees
CREATE OR REPLACE FUNCTION validate_supervisor_assignment()
RETURNS TRIGGER AS $$
BEGIN
  -- Prevent circular references
  IF NEW.supervisor_id = NEW.id THEN
    RAISE EXCEPTION 'An employee cannot be their own supervisor';
  END IF;
  
  -- Check if supervisor exists and is active
  IF NEW.supervisor_id IS NOT NULL THEN
    IF NOT EXISTS (
      SELECT 1 FROM entity_staff 
      WHERE id = NEW.supervisor_id 
      AND status = 'Active'
    ) THEN
      RAISE EXCEPTION 'Supervisor must be an active employee';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. Recreate the trigger on entity_staff table
CREATE TRIGGER validate_supervisor_trigger
  BEFORE INSERT OR UPDATE ON entity_staff
  FOR EACH ROW
  EXECUTE FUNCTION validate_supervisor_assignment();

-- 4. Verify the fix
SELECT 'Trigger function updated successfully!' as status;
SELECT 'validate_supervisor_assignment function now uses entity_staff table' as info; 