const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Supabase configuration
const supabaseUrl = 'https://xyz.supabase.co';
const supabaseKey = 'your-supabase-anon-key'; // Replace with your actual key

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupNfcGpsDatabase() {
  try {
    console.log('🚀 Setting up NFC/GPS database tables...');

    // Read the SQL file
    const sqlContent = fs.readFileSync('create-nfc-gps-tables.sql', 'utf8');
    
    // Split the SQL into individual statements
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    console.log(`📝 Found ${statements.length} SQL statements to execute`);

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      console.log(`\n🔧 Executing statement ${i + 1}/${statements.length}:`);
      console.log(statement.substring(0, 100) + '...');

      try {
        const { error } = await supabase.rpc('exec_sql', { sql: statement });
        
        if (error) {
          console.error(`❌ Error executing statement ${i + 1}:`, error);
        } else {
          console.log(`✅ Statement ${i + 1} executed successfully`);
        }
      } catch (err) {
        console.error(`❌ Exception executing statement ${i + 1}:`, err.message);
      }
    }

    console.log('\n🎉 Database setup completed!');
    
    // Test the tables by querying them
    console.log('\n🧪 Testing table creation...');
    
    const { data: nfcTags, error: nfcError } = await supabase
      .from('nfc_tags')
      .select('count')
      .limit(1);
    
    if (nfcError) {
      console.error('❌ NFC tags table test failed:', nfcError);
    } else {
      console.log('✅ NFC tags table is accessible');
    }

    const { data: gpsLocations, error: gpsError } = await supabase
      .from('gps_locations')
      .select('count')
      .limit(1);
    
    if (gpsError) {
      console.error('❌ GPS locations table test failed:', gpsError);
    } else {
      console.log('✅ GPS locations table is accessible');
    }

    const { data: scanLogs, error: scanError } = await supabase
      .from('scan_logs')
      .select('count')
      .limit(1);
    
    if (scanError) {
      console.error('❌ Scan logs table test failed:', scanError);
    } else {
      console.log('✅ Scan logs table is accessible');
    }

  } catch (error) {
    console.error('💥 Fatal error during database setup:', error);
  }
}

// Alternative approach: Execute statements one by one
async function setupNfcGpsDatabaseAlternative() {
  try {
    console.log('🚀 Setting up NFC/GPS database tables (alternative method)...');

    // Create NFC tags table
    console.log('📱 Creating NFC tags table...');
    const { error: nfcError } = await supabase.rpc('exec_sql', {
      sql: `
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
      `
    });

    if (nfcError) {
      console.error('❌ Error creating NFC tags table:', nfcError);
    } else {
      console.log('✅ NFC tags table created successfully');
    }

    // Create GPS locations table
    console.log('📍 Creating GPS locations table...');
    const { error: gpsError } = await supabase.rpc('exec_sql', {
      sql: `
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
      `
    });

    if (gpsError) {
      console.error('❌ Error creating GPS locations table:', gpsError);
    } else {
      console.log('✅ GPS locations table created successfully');
    }

    // Create scan logs table
    console.log('📊 Creating scan logs table...');
    const { error: scanError } = await supabase.rpc('exec_sql', {
      sql: `
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
      `
    });

    if (scanError) {
      console.error('❌ Error creating scan logs table:', scanError);
    } else {
      console.log('✅ Scan logs table created successfully');
    }

    // Insert sample data
    console.log('📝 Inserting sample data...');
    
    const { error: insertError } = await supabase.rpc('exec_sql', {
      sql: `
        INSERT INTO nfc_tags (tag_id, name, description, site_id, location_description, coordinates, status, tag_type, battery_level) VALUES
        ('NFC-001-ALPHA', 'Main Entrance Tag', 'Primary entrance checkpoint for Building A', 1, 'Main Entrance - Building A', point(40.7128, -74.0060), 'Active', 'NFC', 95),
        ('NFC-002-BETA', 'Emergency Exit Tag', 'Emergency exit monitoring for East Wing', 2, 'Emergency Exit - East Wing', point(40.7589, -73.9851), 'Active', 'NFC', 88),
        ('NFC-003-GAMMA', 'Security Checkpoint C', 'Security checkpoint for retail plaza', 3, 'Security Checkpoint C', point(40.7505, -73.9934), 'Inactive', 'NFC', 45)
        ON CONFLICT (tag_id) DO NOTHING;
      `
    });

    if (insertError) {
      console.error('❌ Error inserting sample NFC data:', insertError);
    } else {
      console.log('✅ Sample NFC data inserted successfully');
    }

    console.log('🎉 Database setup completed successfully!');

  } catch (error) {
    console.error('💥 Fatal error during database setup:', error);
  }
}

// Run the setup
setupNfcGpsDatabaseAlternative(); 