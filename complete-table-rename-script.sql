-- Complete table rename script for employees to entity_staff
-- This script will rename both the employees table and the employee_entities table

-- First, create the updated trigger function
CREATE OR REPLACE FUNCTION ensure_single_primary_entity()
RETURNS TRIGGER AS $$
BEGIN
  -- If this is being set as primary, unset all others for this entity staff
  IF NEW.is_primary = true THEN
    UPDATE entity_staff_entities 
    SET is_primary = false 
    WHERE entity_staff_id = NEW.entity_staff_id AND id != NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Now run the main rename operations
DO $$
BEGIN
    -- Step 1: Rename employees table to entity_staff
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'employees') THEN
        -- Rename the table
        ALTER TABLE employees RENAME TO entity_staff;
        
        -- Update the table comment to reflect the new purpose
        COMMENT ON TABLE entity_staff IS 'Entity staff table for managing staff at different entities/sites';
        
        RAISE NOTICE 'Successfully renamed employees table to entity_staff';
    ELSE
        RAISE NOTICE 'employees table does not exist';
    END IF;

    -- Step 2: Rename employee_entities table to entity_staff_entities
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'employee_entities') THEN
        -- Rename the table
        ALTER TABLE employee_entities RENAME TO entity_staff_entities;
        
        -- Update the foreign key reference to point to entity_staff instead of employees
        ALTER TABLE entity_staff_entities 
        DROP CONSTRAINT IF EXISTS employee_entities_employee_id_fkey;
        
        ALTER TABLE entity_staff_entities 
        ADD CONSTRAINT entity_staff_entities_entity_staff_id_fkey 
        FOREIGN KEY (employee_id) REFERENCES entity_staff(id) ON DELETE CASCADE;
        
        -- Rename the column from employee_id to entity_staff_id
        ALTER TABLE entity_staff_entities RENAME COLUMN employee_id TO entity_staff_id;
        
        -- Update the unique constraint
        ALTER TABLE entity_staff_entities 
        DROP CONSTRAINT IF EXISTS employee_entities_employee_id_site_id_key;
        
        ALTER TABLE entity_staff_entities 
        ADD CONSTRAINT entity_staff_entities_entity_staff_id_site_id_key 
        UNIQUE(entity_staff_id, site_id);
        
        -- Update indexes
        DROP INDEX IF EXISTS idx_employee_entities_employee_id;
        DROP INDEX IF EXISTS idx_employee_entities_site_id;
        
        CREATE INDEX idx_entity_staff_entities_entity_staff_id ON entity_staff_entities(entity_staff_id);
        CREATE INDEX idx_entity_staff_entities_site_id ON entity_staff_entities(site_id);
        
        -- Drop and recreate the trigger
        DROP TRIGGER IF EXISTS trigger_ensure_single_primary_entity ON entity_staff_entities;
        
        CREATE TRIGGER trigger_ensure_single_primary_entity
          BEFORE INSERT OR UPDATE ON entity_staff_entities
          FOR EACH ROW
          EXECUTE FUNCTION ensure_single_primary_entity();
        
        -- Update the table comment
        COMMENT ON TABLE entity_staff_entities IS 'Entity staff entities junction table for multiple entities per entity staff';
        
        RAISE NOTICE 'Successfully renamed employee_entities table to entity_staff_entities';
    ELSE
        RAISE NOTICE 'employee_entities table does not exist';
    END IF;
END $$;

-- Verify the renames were successful
SELECT 'Tables renamed successfully!' as status, 
       'employees' as old_table_name, 
       'entity_staff' as new_table_name;

SELECT 'Junction table renamed successfully!' as status, 
       'employee_entities' as old_table_name, 
       'entity_staff_entities' as new_table_name;

-- Show the new table structure
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name IN ('entity_staff', 'entity_staff_entities')
ORDER BY table_name, ordinal_position; 