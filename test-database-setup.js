// Simple test script to check NFC/GPS database setup
// Run this in the browser console

console.log('🔍 Testing NFC/GPS database setup...');

async function testDatabaseSetup() {
  const results = {
    nfcTags: false,
    gpsLocations: false,
    scanLogs: false,
    sites: false
  };

  try {
    // Test sites table (should exist)
    const { data: sitesData, error: sitesError } = await supabase
      .from('sites')
      .select('id, name')
      .limit(1);
    
    if (sitesError) {
      console.log('❌ Sites table error:', sitesError.message);
    } else {
      console.log('✅ Sites table exists and is accessible');
      results.sites = true;
    }

    // Test NFC tags table
    const { data: nfcData, error: nfcError } = await supabase
      .from('nfc_tags')
      .select('id, tag_id')
      .limit(1);
    
    if (nfcError) {
      console.log('❌ NFC tags table does not exist:', nfcError.message);
    } else {
      console.log('✅ NFC tags table exists and is accessible');
      console.log('📱 NFC tags found:', nfcData.length);
      results.nfcTags = true;
    }

    // Test GPS locations table
    const { data: gpsData, error: gpsError } = await supabase
      .from('gps_locations')
      .select('id, name')
      .limit(1);
    
    if (gpsError) {
      console.log('❌ GPS locations table does not exist:', gpsError.message);
    } else {
      console.log('✅ GPS locations table exists and is accessible');
      console.log('📍 GPS locations found:', gpsData.length);
      results.gpsLocations = true;
    }

    // Test scan logs table
    const { data: scanData, error: scanError } = await supabase
      .from('scan_logs')
      .select('id, scan_type')
      .limit(1);
    
    if (scanError) {
      console.log('❌ Scan logs table does not exist:', scanError.message);
    } else {
      console.log('✅ Scan logs table exists and is accessible');
      console.log('📊 Scan logs found:', scanData.length);
      results.scanLogs = true;
    }

    // Summary
    console.log('\n📋 Database Setup Summary:');
    console.log('Sites table:', results.sites ? '✅ EXISTS' : '❌ MISSING');
    console.log('NFC tags table:', results.nfcTags ? '✅ EXISTS' : '❌ MISSING');
    console.log('GPS locations table:', results.gpsLocations ? '✅ EXISTS' : '❌ MISSING');
    console.log('Scan logs table:', results.scanLogs ? '✅ EXISTS' : '❌ MISSING');

    if (!results.nfcTags || !results.gpsLocations || !results.scanLogs) {
      console.log('\n🚨 SETUP REQUIRED:');
      console.log('1. Copy the contents of nfc-gps-setup-supabase.sql');
      console.log('2. Open your Supabase SQL Editor');
      console.log('3. Paste and run the script');
      console.log('4. Refresh this page and run this test again');
    } else {
      console.log('\n🎉 All tables exist! NFC/GPS functionality should work.');
    }

    return results;

  } catch (error) {
    console.error('💥 Test failed:', error);
    return results;
  }
}

// Export for browser console
if (typeof window !== 'undefined') {
  window.testDatabaseSetup = testDatabaseSetup;
  console.log('🧪 Database test function available as window.testDatabaseSetup()');
}

// Run the test
testDatabaseSetup(); 