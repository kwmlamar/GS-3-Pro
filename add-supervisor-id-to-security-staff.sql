-- Add supervisor_id column to security_staff table
ALTER TABLE security_staff 
ADD COLUMN IF NOT EXISTS supervisor_id BIGINT REFERENCES security_staff(id) ON DELETE SET NULL;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_security_staff_supervisor_id ON security_staff(supervisor_id);

-- Verify the column was added
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'security_staff' AND column_name = 'supervisor_id'; 