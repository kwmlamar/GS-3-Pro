-- Add client_id column to subcontractor_profiles table
ALTER TABLE subcontractor_profiles 
ADD COLUMN IF NOT EXISTS client_id BIGINT REFERENCES clients(id) ON DELETE SET NULL;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_subcontractor_profiles_client_id ON subcontractor_profiles(client_id);

-- Update existing records to have a default client_id if needed
-- UPDATE subcontractor_profiles SET client_id = 1 WHERE client_id IS NULL;

-- Verify the column was added
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'subcontractor_profiles' AND column_name = 'client_id'; 