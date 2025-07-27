-- Update employees table for archive functionality
-- Run this in your Supabase SQL Editor

-- 1. Add check constraint for status field (if not already exists)
DO $$ 
BEGIN
    -- Check if constraint already exists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.check_constraints 
        WHERE constraint_name = 'check_status'
    ) THEN
        -- Add the constraint
        ALTER TABLE employees 
        ADD CONSTRAINT check_status 
        CHECK (status IN ('Active', 'Inactive', 'On Leave', 'Terminated', 'Archived'));
        
        RAISE NOTICE 'Status constraint added successfully';
    ELSE
        RAISE NOTICE 'Status constraint already exists';
    END IF;
END $$;

-- 2. Add notes column if it doesn't exist
ALTER TABLE employees ADD COLUMN IF NOT EXISTS notes TEXT;

-- 3. Update existing employees to have notes if they don't have any
UPDATE employees 
SET notes = CASE 
  WHEN name = 'John Smith' THEN 'Reliable officer with excellent customer service skills. Handles high-traffic areas well.'
  WHEN name = 'Sarah Johnson' THEN 'Strong leadership qualities. Excellent at managing team dynamics and emergency situations.'
  WHEN name = 'Mike Rodriguez' THEN 'Strategic thinker with proven track record in operational efficiency. Key player in regional expansion.'
  WHEN name = 'Lisa Chen' THEN 'Expert in risk assessment and training. Valuable asset for client consultations and specialized projects.'
  ELSE COALESCE(notes, 'No notes available.')
END
WHERE notes IS NULL;

-- 4. Insert sample archived employees for testing (if they don't exist)
INSERT INTO employees (name, role, type, site, status, compliance, certifications, email, phone, hire_date, notes) VALUES
('Alex Thompson', 'Former Security Officer', 'Standard Officer', 'Corporate HQ Alpha', 'Archived', 85, ARRAY['Basic Security', 'First Aid'], 'alex.thompson@gs3.com', '+1-555-0127', '2022-06-15', 'Left company for personal reasons. Good performance record.'),
('Maria Garcia', 'Former Site Supervisor', 'Supervisor', 'Metro Hospital West', 'Archived', 92, ARRAY['Advanced Security', 'Leadership'], 'maria.garcia@gs3.com', '+1-555-0128', '2021-09-10', 'Relocated to different city. Excellent leadership skills.'),
('David Chen', 'Former Operations Manager', 'Operations Management', 'Regional Office', 'Archived', 95, ARRAY['Management', 'Risk Assessment'], 'david.chen@gs3.com', '+1-555-0129', '2020-12-01', 'Career advancement opportunity. Strong operational background.'),
('Sarah Wilson', 'Former Security Consultant', 'Consultant', 'Multiple', 'Archived', 88, ARRAY['Consulting', 'Risk Analysis'], 'sarah.wilson@gs3.com', '+1-555-0130', '2022-03-20', 'Started own consulting business. Valuable experience gained.')
ON CONFLICT (id) DO NOTHING;

-- 5. Verify the setup
SELECT 
    'Table Structure' as check_type,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'employees' 
ORDER BY ordinal_position;

-- 6. Show current status distribution
SELECT 
    'Status Distribution' as check_type,
    status,
    COUNT(*) as count
FROM employees 
GROUP BY status 
ORDER BY status;

-- 7. Show sample archived employees
SELECT 
    'Sample Archived Employees' as check_type,
    name,
    role,
    status,
    LEFT(notes, 50) || '...' as notes_preview
FROM employees 
WHERE status = 'Archived'
ORDER BY name; 