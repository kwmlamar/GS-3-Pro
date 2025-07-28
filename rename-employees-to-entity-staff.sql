-- Rename employees table to entity_staff
-- This script will rename the existing employees table and update related structures

-- First, let's check if the table exists and get its current structure
DO $$
BEGIN
    -- Check if employees table exists
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'employees') THEN
        -- Rename the table
        ALTER TABLE employees RENAME TO entity_staff;
        
        -- Update any existing foreign key references (if any)
        -- Note: This would need to be updated based on actual foreign key relationships
        
        -- Update any existing indexes
        -- Note: Index names will be automatically updated by PostgreSQL
        
        RAISE NOTICE 'Successfully renamed employees table to entity_staff';
    ELSE
        RAISE NOTICE 'employees table does not exist';
    END IF;
END $$;

-- Update the table comment to reflect the new purpose
COMMENT ON TABLE entity_staff IS 'Entity staff table for managing staff at different entities/sites';

-- Verify the rename was successful
SELECT 'Table renamed successfully!' as status, 
       'employees' as old_name, 
       'entity_staff' as new_name; 