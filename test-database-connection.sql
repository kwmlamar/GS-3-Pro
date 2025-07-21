-- Test database connection and list tables
-- Run this in your Supabase SQL Editor to check what's available

-- List all tables in the public schema
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Check if employees table exists
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'employees'
) as employees_table_exists;

-- Test a simple query
SELECT 'Database connection successful!' as test_result; 