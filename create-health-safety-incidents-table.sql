-- Create health_safety_incidents table
CREATE TABLE IF NOT EXISTS health_safety_incidents (
  id BIGSERIAL PRIMARY KEY,
  site_id BIGINT REFERENCES sites(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  incident_date DATE NOT NULL,
  reported_by_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  investigation_status VARCHAR(50) DEFAULT 'open' CHECK (investigation_status IN ('open', 'in_progress', 'closed')),
  report_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_health_safety_incidents_site_id ON health_safety_incidents(site_id);
CREATE INDEX IF NOT EXISTS idx_health_safety_incidents_reported_by_id ON health_safety_incidents(reported_by_id);
CREATE INDEX IF NOT EXISTS idx_health_safety_incidents_incident_date ON health_safety_incidents(incident_date);
CREATE INDEX IF NOT EXISTS idx_health_safety_incidents_investigation_status ON health_safety_incidents(investigation_status);
CREATE INDEX IF NOT EXISTS idx_health_safety_incidents_created_at ON health_safety_incidents(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE health_safety_incidents ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users to read all incidents
CREATE POLICY "Allow authenticated users to read health_safety_incidents" ON health_safety_incidents
  FOR SELECT USING (auth.role() = 'authenticated');

-- Create policy for authenticated users to insert incidents
CREATE POLICY "Allow authenticated users to insert health_safety_incidents" ON health_safety_incidents
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Create policy for authenticated users to update incidents
CREATE POLICY "Allow authenticated users to update health_safety_incidents" ON health_safety_incidents
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Create policy for authenticated users to delete incidents
CREATE POLICY "Allow authenticated users to delete health_safety_incidents" ON health_safety_incidents
  FOR DELETE USING (auth.role() = 'authenticated');

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_health_safety_incidents_updated_at 
    BEFORE UPDATE ON health_safety_incidents 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data (optional - can be done via the app)
-- Note: This requires sites table to exist and have data
-- INSERT INTO health_safety_incidents (site_id, description, incident_date, investigation_status) VALUES
-- (1, 'Slip and fall incident in main lobby', '2024-01-15', 'closed'),
-- (1, 'Minor equipment malfunction', '2024-01-20', 'in_progress'),
-- (2, 'Security breach attempt', '2024-01-25', 'open')
-- ON CONFLICT (id) DO NOTHING; 