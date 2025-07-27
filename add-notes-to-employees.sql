-- Add notes column to employees table
-- Run this in your Supabase SQL Editor if the notes column doesn't exist

-- Add notes column if it doesn't exist
ALTER TABLE employees ADD COLUMN IF NOT EXISTS notes TEXT;

-- Update existing records with sample notes (optional)
UPDATE employees 
SET notes = CASE 
  WHEN name = 'John Smith' THEN 'Reliable officer with excellent customer service skills. Handles high-traffic areas well.'
  WHEN name = 'Sarah Johnson' THEN 'Strong leadership qualities. Excellent at managing team dynamics and emergency situations.'
  WHEN name = 'Mike Rodriguez' THEN 'Strategic thinker with proven track record in operational efficiency. Key player in regional expansion.'
  WHEN name = 'Lisa Chen' THEN 'Expert in risk assessment and training. Valuable asset for client consultations and specialized projects.'
  ELSE notes
END
WHERE notes IS NULL;

-- Verify the column was added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'employees' AND column_name = 'notes'; 