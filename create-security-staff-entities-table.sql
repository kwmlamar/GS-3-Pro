-- Create security_staff_entities table for linking security staff to sites
CREATE TABLE IF NOT EXISTS security_staff_entities (
  id BIGSERIAL PRIMARY KEY,
  security_staff_id BIGINT REFERENCES security_staff(id) ON DELETE CASCADE,
  site_id BIGINT REFERENCES sites(id) ON DELETE CASCADE,
  is_primary BOOLEAN DEFAULT false,
  assignment_start_date DATE DEFAULT CURRENT_DATE,
  assignment_end_date DATE,
  status VARCHAR(50) DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive', 'Completed', 'Terminated')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(security_staff_id, site_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_security_staff_entities_staff_id ON security_staff_entities(security_staff_id);
CREATE INDEX IF NOT EXISTS idx_security_staff_entities_site_id ON security_staff_entities(site_id);
CREATE INDEX IF NOT EXISTS idx_security_staff_entities_is_primary ON security_staff_entities(is_primary);
CREATE INDEX IF NOT EXISTS idx_security_staff_entities_status ON security_staff_entities(status);

-- Enable Row Level Security (RLS)
ALTER TABLE security_staff_entities ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Allow authenticated users to read security_staff_entities" ON security_staff_entities
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to insert security_staff_entities" ON security_staff_entities
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update security_staff_entities" ON security_staff_entities
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete security_staff_entities" ON security_staff_entities
  FOR DELETE USING (auth.role() = 'authenticated');

-- Create trigger for updated_at
CREATE TRIGGER update_security_staff_entities_updated_at BEFORE UPDATE ON security_staff_entities
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Verify the table was created
SELECT 'Security staff entities table created successfully!' as status; 