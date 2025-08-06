// Test script to verify NFC/GPS functionality
// This script can be run in the browser console or as a Node.js script

console.log('🧪 Testing NFC/GPS functionality...');

// Test the service functions
async function testNfcGpsService() {
  try {
    console.log('📱 Testing NFC/GPS service...');
    
    // Test getting NFC tags
    const nfcTags = await nfcGpsService.getNfcTags();
    console.log('✅ NFC tags fetched:', nfcTags.length);
    
    // Test getting GPS locations
    const gpsLocations = await nfcGpsService.getGpsLocations();
    console.log('✅ GPS locations fetched:', gpsLocations.length);
    
    // Test getting scan statistics
    const scanStats = await nfcGpsService.getScanStatistics();
    console.log('✅ Scan statistics fetched:', scanStats);
    
    return {
      nfcTags: nfcTags.length,
      gpsLocations: gpsLocations.length,
      scanStats
    };
  } catch (error) {
    console.error('❌ Error testing NFC/GPS service:', error);
    return null;
  }
}

// Test database connection
async function testDatabaseConnection() {
  try {
    console.log('🔌 Testing database connection...');
    
    const { data, error } = await supabase
      .from('sites')
      .select('id, name')
      .limit(1);
    
    if (error) {
      console.error('❌ Database connection failed:', error);
      return false;
    } else {
      console.log('✅ Database connection successful');
      return true;
    }
  } catch (error) {
    console.error('❌ Database connection error:', error);
    return false;
  }
}

// Test table existence
async function testTableExistence() {
  const tables = ['nfc_tags', 'gps_locations', 'scan_logs'];
  const results = {};
  
  for (const table of tables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('count')
        .limit(1);
      
      if (error) {
        console.log(`❌ Table ${table} does not exist or is not accessible`);
        results[table] = false;
      } else {
        console.log(`✅ Table ${table} exists and is accessible`);
        results[table] = true;
      }
    } catch (error) {
      console.log(`❌ Error checking table ${table}:`, error.message);
      results[table] = false;
    }
  }
  
  return results;
}

// Run all tests
async function runAllTests() {
  console.log('🚀 Starting NFC/GPS functionality tests...\n');
  
  // Test 1: Database connection
  const dbConnected = await testDatabaseConnection();
  
  // Test 2: Table existence
  const tableResults = await testTableExistence();
  
  // Test 3: Service functionality (only if tables exist)
  let serviceResults = null;
  if (Object.values(tableResults).some(exists => exists)) {
    serviceResults = await testNfcGpsService();
  }
  
  // Summary
  console.log('\n📊 Test Results Summary:');
  console.log('Database Connection:', dbConnected ? '✅ PASS' : '❌ FAIL');
  console.log('Table Existence:');
  Object.entries(tableResults).forEach(([table, exists]) => {
    console.log(`  ${table}:`, exists ? '✅ EXISTS' : '❌ MISSING');
  });
  
  if (serviceResults) {
    console.log('Service Functionality:');
    console.log(`  NFC Tags: ${serviceResults.nfcTags} found`);
    console.log(`  GPS Locations: ${serviceResults.gpsLocations} found`);
    console.log(`  Scan Stats: ${JSON.stringify(serviceResults.scanStats)}`);
  }
  
  return {
    dbConnected,
    tableResults,
    serviceResults
  };
}

// Export for use in browser console
if (typeof window !== 'undefined') {
  window.testNfcGps = {
    testDatabaseConnection,
    testTableExistence,
    testNfcGpsService,
    runAllTests
  };
  console.log('🧪 NFC/GPS test functions available as window.testNfcGps');
}

// Run tests if this is a Node.js environment
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    testDatabaseConnection,
    testTableExistence,
    testNfcGpsService,
    runAllTests
  };
} 