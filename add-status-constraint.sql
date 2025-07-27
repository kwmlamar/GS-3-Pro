-- Add status constraint to employees table
-- Run this in your Supabase SQL Editor

-- Add check constraint for status field to ensure only valid values
ALTER TABLE employees 
ADD CONSTRAINT check_status 
CHECK (status IN ('Active', 'Inactive', 'On Leave', 'Terminated', 'Archived'));

-- Verify the constraint was added
SELECT 
    constraint_name, 
    check_clause 
FROM information_schema.check_constraints 
WHERE constraint_name = 'check_status';

-- Test the constraint by trying to insert an invalid status (should fail)
-- INSERT INTO employees (name, role, type, site, status) VALUES ('Test', 'Test', 'Test', 'Test', 'Invalid');

-- Show current status values in the table
SELECT DISTINCT status FROM employees ORDER BY status; 