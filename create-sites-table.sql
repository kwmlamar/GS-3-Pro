-- Create sites table for hierarchy management
CREATE TABLE IF NOT EXISTS sites (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('site', 'region', 'national', 'global', 'special_activity')),
  parent_id BIGINT REFERENCES sites(id) ON DELETE SET NULL,
  client_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
  address JSONB DEFAULT '{}',
  gps_coordinates JSONB DEFAULT '{}',
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'maintenance')),
  description TEXT,
  contact_person VARCHAR(255),
  contact_email VARCHAR(255),
  contact_phone VARCHAR(50),
  security_level VARCHAR(50) DEFAULT 'standard' CHECK (security_level IN ('standard', 'enhanced', 'high', 'maximum')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_sites_name ON sites USING gin(to_tsvector('english', name));
CREATE INDEX IF NOT EXISTS idx_sites_type ON sites(type);
CREATE INDEX IF NOT EXISTS idx_sites_parent_id ON sites(parent_id);
CREATE INDEX IF NOT EXISTS idx_sites_client_id ON sites(client_id);
CREATE INDEX IF NOT EXISTS idx_sites_status ON sites(status);
CREATE INDEX IF NOT EXISTS idx_sites_security_level ON sites(security_level);

-- Create index for JSONB fields
CREATE INDEX IF NOT EXISTS idx_sites_address ON sites USING gin(address);
CREATE INDEX IF NOT EXISTS idx_sites_gps_coordinates ON sites USING gin(gps_coordinates);

-- Enable Row Level Security (RLS)
ALTER TABLE sites ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Allow authenticated users to read sites" ON sites
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to insert sites" ON sites
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update sites" ON sites
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete sites" ON sites
  FOR DELETE USING (auth.role() = 'authenticated');

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_sites_updated_at 
    BEFORE UPDATE ON sites 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample hierarchy data
-- Global level
INSERT INTO sites (name, type, description, security_level, contact_person, contact_email, contact_phone) VALUES
('GS-3 Global Operations', 'global', 'Global headquarters and operations center for GS-3 SecureOps Pro', 'maximum', 'Michael Grant', 'michael.grant@gs-3.com', '+1-555-0001')
ON CONFLICT (id) DO NOTHING;

-- National level
INSERT INTO sites (name, type, parent_id, description, security_level, contact_person, contact_email, contact_phone) VALUES
('GS-3 North America', 'national', (SELECT id FROM sites WHERE name = 'GS-3 Global Operations' AND type = 'global'), 'North American operations and regional headquarters', 'high', 'Sarah Johnson', 'sarah.johnson@gs-3.com', '+1-555-0002'),
('GS-3 Europe', 'national', (SELECT id FROM sites WHERE name = 'GS-3 Global Operations' AND type = 'global'), 'European operations and regional headquarters', 'high', 'David Wilson', 'david.wilson@gs-3.com', '+1-555-0003'),
('GS-3 Asia Pacific', 'national', (SELECT id FROM sites WHERE name = 'GS-3 Global Operations' AND type = 'global'), 'Asia Pacific operations and regional headquarters', 'high', 'Lisa Chen', 'lisa.chen@gs-3.com', '+1-555-0004')
ON CONFLICT (id) DO NOTHING;

-- Regional level
INSERT INTO sites (name, type, parent_id, description, security_level, contact_person, contact_email, contact_phone, address, gps_coordinates) VALUES
('Northeast Region', 'region', (SELECT id FROM sites WHERE name = 'GS-3 North America' AND type = 'national'), 'Northeast regional operations covering NY, NJ, CT, MA', 'enhanced', 'Robert Martinez', 'robert.martinez@gs-3.com', '+1-555-0005', '{"street": "123 Security Plaza", "city": "New York", "state": "NY", "zip": "10001", "country": "USA"}', '{"latitude": 40.7128, "longitude": -74.0060}'),
('Southeast Region', 'region', (SELECT id FROM sites WHERE name = 'GS-3 North America' AND type = 'national'), 'Southeast regional operations covering FL, GA, NC, SC', 'enhanced', 'Jennifer Davis', 'jennifer.davis@gs-3.com', '+1-555-0006', '{"street": "456 Safety Drive", "city": "Miami", "state": "FL", "zip": "33101", "country": "USA"}', '{"latitude": 25.7617, "longitude": -80.1918}'),
('Western Region', 'region', (SELECT id FROM sites WHERE name = 'GS-3 North America' AND type = 'national'), 'Western regional operations covering CA, OR, WA', 'enhanced', 'Thomas Anderson', 'thomas.anderson@gs-3.com', '+1-555-0007', '{"street": "789 Protection Way", "city": "Los Angeles", "state": "CA", "zip": "90210", "country": "USA"}', '{"latitude": 34.0522, "longitude": -118.2437}'),
('Central Europe', 'region', (SELECT id FROM sites WHERE name = 'GS-3 Europe' AND type = 'national'), 'Central European operations covering Germany, France, Switzerland', 'enhanced', 'Hans Mueller', 'hans.mueller@gs-3.com', '+1-555-0008', '{"street": "321 Sicherheit Strasse", "city": "Berlin", "state": "Berlin", "zip": "10115", "country": "Germany"}', '{"latitude": 52.5200, "longitude": 13.4050}'),
('Northern Europe', 'region', (SELECT id FROM sites WHERE name = 'GS-3 Europe' AND type = 'national'), 'Northern European operations covering UK, Netherlands, Scandinavia', 'enhanced', 'Emma Thompson', 'emma.thompson@gs-3.com', '+1-555-0009', '{"street": "654 Security Lane", "city": "London", "state": "England", "zip": "SW1A 1AA", "country": "UK"}', '{"latitude": 51.5074, "longitude": -0.1278}'),
('East Asia', 'region', (SELECT id FROM sites WHERE name = 'GS-3 Asia Pacific' AND type = 'national'), 'East Asian operations covering Japan, South Korea, Taiwan', 'enhanced', 'Yuki Tanaka', 'yuki.tanaka@gs-3.com', '+1-555-0010', '{"street": "987 Anzen Street", "city": "Tokyo", "state": "Tokyo", "zip": "100-0001", "country": "Japan"}', '{"latitude": 35.6762, "longitude": 139.6503}')
ON CONFLICT (id) DO NOTHING;

-- Site level (individual locations)
INSERT INTO sites (name, type, parent_id, description, security_level, contact_person, contact_email, contact_phone, address, gps_coordinates, client_id) VALUES
('Corporate HQ Alpha', 'site', (SELECT id FROM sites WHERE name = 'Northeast Region' AND type = 'region'), 'Main corporate headquarters with executive protection services', 'maximum', 'Alex Rodriguez', 'alex.rodriguez@gs-3.com', '+1-555-0011', '{"street": "1000 Executive Blvd", "city": "New York", "state": "NY", "zip": "10001", "country": "USA"}', '{"latitude": 40.7589, "longitude": -73.9851}', (SELECT id FROM users WHERE role = 'client_poc' LIMIT 1)),
('Metro Hospital East', 'site', (SELECT id FROM sites WHERE name = 'Northeast Region' AND type = 'region'), 'Healthcare facility security with specialized medical protocols', 'high', 'Maria Garcia', 'maria.garcia@gs-3.com', '+1-555-0012', '{"street": "500 Medical Center Dr", "city": "Boston", "state": "MA", "zip": "02115", "country": "USA"}', '{"latitude": 42.3601, "longitude": -71.0589}', (SELECT id FROM users WHERE role = 'client_poc' LIMIT 1)),
('Financial District Tower', 'site', (SELECT id FROM sites WHERE name = 'Northeast Region' AND type = 'region'), 'High-rise financial building with advanced access control', 'high', 'James Wilson', 'james.wilson@gs-3.com', '+1-555-0013', '{"street": "200 Wall Street", "city": "New York", "state": "NY", "zip": "10005", "country": "USA"}', '{"latitude": 40.7064, "longitude": -74.0090}', (SELECT id FROM users WHERE role = 'client_poc' LIMIT 1)),
('Miami Beach Resort', 'site', (SELECT id FROM sites WHERE name = 'Southeast Region' AND type = 'region'), 'Luxury resort security with VIP guest protection', 'enhanced', 'Carlos Mendez', 'carlos.mendez@gs-3.com', '+1-555-0014', '{"street": "300 Ocean Drive", "city": "Miami Beach", "state": "FL", "zip": "33139", "country": "USA"}', '{"latitude": 25.7907, "longitude": -80.1300}', (SELECT id FROM users WHERE role = 'client_poc' LIMIT 1)),
('Orlando Theme Park', 'site', (SELECT id FROM sites WHERE name = 'Southeast Region' AND type = 'region'), 'Entertainment venue with crowd management expertise', 'enhanced', 'Patricia Lee', 'patricia.lee@gs-3.com', '+1-555-0015', '{"street": "400 Magic Kingdom Way", "city": "Orlando", "state": "FL", "zip": "32830", "country": "USA"}', '{"latitude": 28.4177, "longitude": -81.5812}', (SELECT id FROM users WHERE role = 'client_poc' LIMIT 1)),
('Silicon Valley Tech Campus', 'site', (SELECT id FROM sites WHERE name = 'Western Region' AND type = 'region'), 'Technology campus with intellectual property protection', 'maximum', 'Kevin Chang', 'kevin.chang@gs-3.com', '+1-555-0016', '{"street": "1500 Innovation Ave", "city": "Palo Alto", "state": "CA", "zip": "94301", "country": "USA"}', '{"latitude": 37.4419, "longitude": -122.1430}', (SELECT id FROM users WHERE role = 'client_poc' LIMIT 1)),
('Hollywood Studio Lot', 'site', (SELECT id FROM sites WHERE name = 'Western Region' AND type = 'region'), 'Entertainment studio with celebrity protection services', 'high', 'Rachel Green', 'rachel.green@gs-3.com', '+1-555-0017', '{"street": "600 Studio Blvd", "city": "Burbank", "state": "CA", "zip": "91505", "country": "USA"}', '{"latitude": 34.1808, "longitude": -118.3089}', (SELECT id FROM users WHERE role = 'client_poc' LIMIT 1)),
('Berlin Government Complex', 'site', (SELECT id FROM sites WHERE name = 'Central Europe' AND type = 'region'), 'Government facility with diplomatic security protocols', 'maximum', 'Klaus Weber', 'klaus.weber@gs-3.com', '+1-555-0018', '{"street": "100 Regierungsstrasse", "city": "Berlin", "state": "Berlin", "zip": "10117", "country": "Germany"}', '{"latitude": 52.5200, "longitude": 13.4050}', (SELECT id FROM users WHERE role = 'client_poc' LIMIT 1)),
('Paris Luxury Hotel', 'site', (SELECT id FROM sites WHERE name = 'Central Europe' AND type = 'region'), 'Five-star hotel with concierge security services', 'enhanced', 'Pierre Dubois', 'pierre.dubois@gs-3.com', '+1-555-0019', '{"street": "50 Champs-Élysées", "city": "Paris", "state": "Île-de-France", "zip": "75008", "country": "France"}', '{"latitude": 48.8566, "longitude": 2.3522}', (SELECT id FROM users WHERE role = 'client_poc' LIMIT 1)),
('London Financial District', 'site', (SELECT id FROM sites WHERE name = 'Northern Europe' AND type = 'region'), 'Financial services hub with cyber security integration', 'high', 'William Brown', 'william.brown@gs-3.com', '+1-555-0020', '{"street": "25 Canary Wharf", "city": "London", "state": "England", "zip": "E14 5AB", "country": "UK"}', '{"latitude": 51.5074, "longitude": -0.1278}', (SELECT id FROM users WHERE role = 'client_poc' LIMIT 1)),
('Tokyo Corporate Tower', 'site', (SELECT id FROM sites WHERE name = 'East Asia' AND type = 'region'), 'Modern corporate tower with advanced surveillance systems', 'high', 'Hiroshi Yamamoto', 'hiroshi.yamamoto@gs-3.com', '+1-555-0021', '{"street": "1000 Shibuya Crossing", "city": "Tokyo", "state": "Tokyo", "zip": "150-0002", "country": "Japan"}', '{"latitude": 35.6762, "longitude": 139.6503}', (SELECT id FROM users WHERE role = 'client_poc' LIMIT 1)),
('Seoul Tech Campus', 'site', (SELECT id FROM sites WHERE name = 'East Asia' AND type = 'region'), 'Technology innovation center with research facility protection', 'maximum', 'Min-ji Park', 'min-ji.park@gs-3.com', '+1-555-0022', '{"street": "500 Gangnam-daero", "city": "Seoul", "state": "Seoul", "zip": "06142", "country": "South Korea"}', '{"latitude": 37.5665, "longitude": 126.9780}', (SELECT id FROM users WHERE role = 'client_poc' LIMIT 1))
ON CONFLICT (id) DO NOTHING;

-- Special Activity sites (mobile/event security)
INSERT INTO sites (name, type, parent_id, description, security_level, contact_person, contact_email, contact_phone, address, gps_coordinates) VALUES
('Major Sporting Event', 'special_activity', (SELECT id FROM sites WHERE name = 'Northeast Region' AND type = 'region'), 'Large-scale sporting event with crowd control and VIP protection', 'high', 'Michael O''Connor', 'michael.oconnor@gs-3.com', '+1-555-0023', '{"venue": "MetLife Stadium", "city": "East Rutherford", "state": "NJ", "zip": "07073", "country": "USA"}', '{"latitude": 40.8135, "longitude": -74.0744}'),
('International Conference', 'special_activity', (SELECT id FROM sites WHERE name = 'Central Europe' AND type = 'region'), 'International business conference with diplomatic security', 'maximum', 'Anna Schmidt', 'anna.schmidt@gs-3.com', '+1-555-0024', '{"venue": "Berlin Congress Center", "city": "Berlin", "state": "Berlin", "zip": "10117", "country": "Germany"}', '{"latitude": 52.5200, "longitude": 13.4050}'),
('Music Festival', 'special_activity', (SELECT id FROM sites WHERE name = 'Western Region' AND type = 'region'), 'Multi-day music festival with crowd management and artist protection', 'enhanced', 'Jessica Taylor', 'jessica.taylor@gs-3.com', '+1-555-0025', '{"venue": "Coachella Valley", "city": "Indio", "state": "CA", "zip": "92201", "country": "USA"}', '{"latitude": 33.7206, "longitude": -116.2156}'),
('Political Summit', 'special_activity', (SELECT id FROM sites WHERE name = 'Northern Europe' AND type = 'region'), 'High-level political summit with international security protocols', 'maximum', 'Robert MacLeod', 'robert.macleod@gs-3.com', '+1-555-0026', '{"venue": "London Summit Center", "city": "London", "state": "England", "zip": "SW1A 1AA", "country": "UK"}', '{"latitude": 51.5074, "longitude": -0.1278}')
ON CONFLICT (id) DO NOTHING;

-- Create a view for easier hierarchy queries
CREATE OR REPLACE VIEW site_hierarchy AS
WITH RECURSIVE hierarchy AS (
  -- Base case: top-level sites (no parent)
  SELECT 
    id, 
    name, 
    type, 
    parent_id, 
    client_id,
    address,
    gps_coordinates,
    status,
    security_level,
    contact_person,
    contact_email,
    contact_phone,
    description,
    created_at,
    updated_at,
    0 as level,
    ARRAY[name] as path
  FROM sites 
  WHERE parent_id IS NULL
  
  UNION ALL
  
  -- Recursive case: child sites
  SELECT 
    s.id, 
    s.name, 
    s.type, 
    s.parent_id, 
    s.client_id,
    s.address,
    s.gps_coordinates,
    s.status,
    s.security_level,
    s.contact_person,
    s.contact_email,
    s.contact_phone,
    s.description,
    s.created_at,
    s.updated_at,
    h.level + 1,
    h.path || s.name
  FROM sites s
  INNER JOIN hierarchy h ON s.parent_id = h.id
)
SELECT * FROM hierarchy ORDER BY path;

-- Create a function to get site statistics
CREATE OR REPLACE FUNCTION get_site_statistics()
RETURNS TABLE (
  total_sites BIGINT,
  active_sites BIGINT,
  sites_by_type JSONB,
  sites_by_security_level JSONB,
  hierarchy_depth INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::BIGINT as total_sites,
    COUNT(*) FILTER (WHERE status = 'active')::BIGINT as active_sites,
    jsonb_object_agg(type, count) FILTER (WHERE count > 0) as sites_by_type,
    jsonb_object_agg(security_level, count) FILTER (WHERE count > 0) as sites_by_security_level,
    MAX(level)::INTEGER as hierarchy_depth
  FROM (
    SELECT type, security_level, status, level, COUNT(*) as count
    FROM site_hierarchy
    GROUP BY type, security_level, status, level
  ) stats;
END;
$$ LANGUAGE plpgsql; 