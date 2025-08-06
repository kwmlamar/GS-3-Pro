-- NFC/GPS Database Setup for GS-3 PRO
-- Run this script in the Supabase SQL Editor

-- Create NFC tags table
CREATE TABLE IF NOT EXISTS nfc_tags (
  id BIGSERIAL PRIMARY KEY,
  tag_id VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  site_id BIGINT,
  location_description VARCHAR(500),
  coordinates POINT,
  status VARCHAR(50) DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive', 'Maintenance')),
  tag_type VARCHAR(50) DEFAULT 'NFC' CHECK (tag_type IN ('NFC', 'QR', 'RFID')),
  battery_level INTEGER DEFAULT 100 CHECK (battery_level >= 0 AND battery_level <= 100),
  last_scan_at TIMESTAMP WITH TIME ZONE,
  last_scan_by BIGINT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create GPS locations table
CREATE TABLE IF NOT EXISTS gps_locations (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  site_id BIGINT,
  coordinates POINT NOT NULL,
  radius_meters INTEGER DEFAULT 50 CHECK (radius_meters > 0),
  status VARCHAR(50) DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive', 'Maintenance')),
  location_type VARCHAR(50) DEFAULT 'Patrol' CHECK (location_type IN ('Patrol', 'Checkpoint', 'Emergency', 'Perimeter')),
  last_check_in_at TIMESTAMP WITH TIME ZONE,
  last_check_in_by BIGINT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create scan logs table
CREATE TABLE IF NOT EXISTS scan_logs (
  id BIGSERIAL PRIMARY KEY,
  tag_id BIGINT,
  gps_location_id BIGINT,
  scanned_by BIGINT,
  scan_type VARCHAR(50) NOT NULL CHECK (scan_type IN ('NFC', 'GPS', 'Manual')),
  coordinates POINT,
  scan_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notes TEXT,
  media_attachments TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add foreign key constraints (only if referenced tables exist)
DO $$
BEGIN
  -- Add foreign key for nfc_tags.site_id
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'sites') THEN
    ALTER TABLE nfc_tags ADD CONSTRAINT IF NOT EXISTS fk_nfc_tags_site_id 
      FOREIGN KEY (site_id) REFERENCES sites(id) ON DELETE SET NULL;
  END IF;
  
  -- Add foreign key for gps_locations.site_id
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'sites') THEN
    ALTER TABLE gps_locations ADD CONSTRAINT IF NOT EXISTS fk_gps_locations_site_id 
      FOREIGN KEY (site_id) REFERENCES sites(id) ON DELETE SET NULL;
  END IF;
  
  -- Add foreign key for scan_logs.tag_id
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'nfc_tags') THEN
    ALTER TABLE scan_logs ADD CONSTRAINT IF NOT EXISTS fk_scan_logs_tag_id 
      FOREIGN KEY (tag_id) REFERENCES nfc_tags(id) ON DELETE SET NULL;
  END IF;
  
  -- Add foreign key for scan_logs.gps_location_id
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'gps_locations') THEN
    ALTER TABLE scan_logs ADD CONSTRAINT IF NOT EXISTS fk_scan_logs_gps_location_id 
      FOREIGN KEY (gps_location_id) REFERENCES gps_locations(id) ON DELETE SET NULL;
  END IF;
  
  -- Add foreign key for nfc_tags.last_scan_by
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'entity_staff') THEN
    ALTER TABLE nfc_tags ADD CONSTRAINT IF NOT EXISTS fk_nfc_tags_last_scan_by 
      FOREIGN KEY (last_scan_by) REFERENCES entity_staff(id) ON DELETE SET NULL;
  END IF;
  
  -- Add foreign key for gps_locations.last_check_in_by
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'entity_staff') THEN
    ALTER TABLE gps_locations ADD CONSTRAINT IF NOT EXISTS fk_gps_locations_last_check_in_by 
      FOREIGN KEY (last_check_in_by) REFERENCES entity_staff(id) ON DELETE SET NULL;
  END IF;
  
  -- Add foreign key for scan_logs.scanned_by
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'entity_staff') THEN
    ALTER TABLE scan_logs ADD CONSTRAINT IF NOT EXISTS fk_scan_logs_scanned_by 
      FOREIGN KEY (scanned_by) REFERENCES entity_staff(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_nfc_tags_site_id ON nfc_tags(site_id);
CREATE INDEX IF NOT EXISTS idx_nfc_tags_status ON nfc_tags(status);
CREATE INDEX IF NOT EXISTS idx_nfc_tags_tag_id ON nfc_tags(tag_id);
CREATE INDEX IF NOT EXISTS idx_nfc_tags_last_scan ON nfc_tags(last_scan_at);

CREATE INDEX IF NOT EXISTS idx_gps_locations_site_id ON gps_locations(site_id);
CREATE INDEX IF NOT EXISTS idx_gps_locations_status ON gps_locations(status);
CREATE INDEX IF NOT EXISTS idx_gps_locations_coordinates ON gps_locations USING GIST(coordinates);

CREATE INDEX IF NOT EXISTS idx_scan_logs_tag_id ON scan_logs(tag_id);
CREATE INDEX IF NOT EXISTS idx_scan_logs_gps_location_id ON scan_logs(gps_location_id);
CREATE INDEX IF NOT EXISTS idx_scan_logs_scanned_by ON scan_logs(scanned_by);
CREATE INDEX IF NOT EXISTS idx_scan_logs_scan_timestamp ON scan_logs(scan_timestamp);

-- Enable Row Level Security (RLS)
ALTER TABLE nfc_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE gps_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE scan_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Allow authenticated users to read nfc_tags" ON nfc_tags
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to insert nfc_tags" ON nfc_tags
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update nfc_tags" ON nfc_tags
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete nfc_tags" ON nfc_tags
  FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to read gps_locations" ON gps_locations
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to insert gps_locations" ON gps_locations
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update gps_locations" ON gps_locations
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete gps_locations" ON gps_locations
  FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to read scan_logs" ON scan_logs
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to insert scan_logs" ON scan_logs
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update scan_logs" ON scan_logs
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete scan_logs" ON scan_logs
  FOR DELETE USING (auth.role() = 'authenticated');

-- Insert sample NFC tags data
INSERT INTO nfc_tags (tag_id, name, description, site_id, location_description, coordinates, status, tag_type, battery_level) VALUES
('NFC-001-ALPHA', 'Main Entrance Tag', 'Primary entrance checkpoint for Building A', 1, 'Main Entrance - Building A', point(40.7128, -74.0060), 'Active', 'NFC', 95),
('NFC-002-BETA', 'Emergency Exit Tag', 'Emergency exit monitoring for East Wing', 2, 'Emergency Exit - East Wing', point(40.7589, -73.9851), 'Active', 'NFC', 88),
('NFC-003-GAMMA', 'Security Checkpoint C', 'Security checkpoint for retail plaza', 3, 'Security Checkpoint C', point(40.7505, -73.9934), 'Inactive', 'NFC', 45),
('NFC-004-DELTA', 'Parking Lot Entrance', 'Vehicle access control for parking area', 1, 'Parking Lot Entrance', point(40.7135, -74.0055), 'Active', 'NFC', 92),
('NFC-005-EPSILON', 'Loading Dock Security', 'Loading dock security checkpoint', 2, 'Loading Dock Security', point(40.7595, -73.9845), 'Active', 'NFC', 78)
ON CONFLICT (tag_id) DO NOTHING;

-- Insert sample GPS locations data
INSERT INTO gps_locations (name, description, site_id, coordinates, radius_meters, status, location_type) VALUES
('Perimeter Point Alpha (North Gate)', 'North perimeter checkpoint for corporate HQ', 1, point(40.7128, -74.0060), 50, 'Active', 'Perimeter'),
('Parking Lot Patrol Zone 3', 'Parking lot patrol area for hospital', 2, point(40.7589, -73.9851), 100, 'Active', 'Patrol'),
('Emergency Response Point Bravo', 'Emergency response staging area', 1, point(40.7132, -74.0058), 75, 'Active', 'Emergency'),
('Retail Plaza Checkpoint', 'Main retail plaza security checkpoint', 3, point(40.7505, -73.9934), 60, 'Active', 'Checkpoint'),
('Loading Dock Zone', 'Loading dock security zone', 2, point(40.7595, -73.9845), 80, 'Active', 'Patrol')
ON CONFLICT (id) DO NOTHING;

-- Insert sample scan logs
INSERT INTO scan_logs (tag_id, scanned_by, scan_type, coordinates, notes) VALUES
(1, 1, 'NFC', point(40.7128, -74.0060), 'Regular patrol check-in'),
(2, 2, 'NFC', point(40.7589, -73.9851), 'Emergency exit verification'),
(4, 1, 'NFC', point(40.7135, -74.0055), 'Vehicle access granted'),
(5, 3, 'NFC', point(40.7595, -73.9845), 'Loading dock security check')
ON CONFLICT (id) DO NOTHING;

-- Verify the setup
SELECT 'NFC Tags' as table_name, COUNT(*) as count FROM nfc_tags
UNION ALL
SELECT 'GPS Locations' as table_name, COUNT(*) as count FROM gps_locations
UNION ALL
SELECT 'Scan Logs' as table_name, COUNT(*) as count FROM scan_logs; 