// Quick fix for NFC/GPS database issues
// Run this in the browser console

console.log('🔧 Quick fix for NFC/GPS database issues...');

async function quickFixNfcGps() {
  const results = {
    tablesExist: false,
    relationshipsExist: false,
    canQuery: false
  };

  try {
    // Test 1: Check if tables exist
    console.log('\n📋 Step 1: Checking if tables exist...');
    
    const tables = ['nfc_tags', 'gps_locations', 'scan_logs'];
    const tableResults = {};
    
    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('id')
          .limit(1);
        
        if (error) {
          console.log(`❌ Table ${table} does not exist:`, error.message);
          tableResults[table] = false;
        } else {
          console.log(`✅ Table ${table} exists`);
          tableResults[table] = true;
        }
      } catch (err) {
        console.log(`❌ Error checking table ${table}:`, err.message);
        tableResults[table] = false;
      }
    }
    
    results.tablesExist = Object.values(tableResults).some(exists => exists);
    
    // Test 2: Check if relationships work
    console.log('\n🔗 Step 2: Testing relationships...');
    
    if (tableResults.nfc_tags) {
      try {
        const { data, error } = await supabase
          .from('nfc_tags')
          .select(`
            *,
            sites (name)
          `)
          .limit(1);
        
        if (error) {
          console.log('❌ Relationship with sites table failed:', error.message);
          results.relationshipsExist = false;
        } else {
          console.log('✅ Relationships work correctly');
          results.relationshipsExist = true;
        }
      } catch (err) {
        console.log('❌ Error testing relationships:', err.message);
        results.relationshipsExist = false;
      }
    }
    
    // Test 3: Test simple queries
    console.log('\n🔍 Step 3: Testing simple queries...');
    
    if (tableResults.nfc_tags) {
      try {
        const { data, error } = await supabase
          .from('nfc_tags')
          .select('*')
          .limit(1);
        
        if (error) {
          console.log('❌ Simple query failed:', error.message);
          results.canQuery = false;
        } else {
          console.log('✅ Simple queries work');
          results.canQuery = true;
        }
      } catch (err) {
        console.log('❌ Error testing simple queries:', err.message);
        results.canQuery = false;
      }
    }
    
    // Summary and recommendations
    console.log('\n📊 Summary:');
    console.log('Tables exist:', results.tablesExist ? '✅' : '❌');
    console.log('Relationships work:', results.relationshipsExist ? '✅' : '❌');
    console.log('Can query data:', results.canQuery ? '✅' : '❌');
    
    if (!results.tablesExist) {
      console.log('\n🚨 ACTION REQUIRED:');
      console.log('1. Copy the contents of nfc-gps-setup-supabase.sql');
      console.log('2. Open your Supabase SQL Editor');
      console.log('3. Paste and run the script');
      console.log('4. Refresh this page and run this test again');
    } else if (!results.relationshipsExist) {
      console.log('\n⚠️  WARNING:');
      console.log('Tables exist but relationships are broken.');
      console.log('The app will work with default values for site names.');
      console.log('To fix relationships, run the updated SQL script.');
    } else {
      console.log('\n🎉 SUCCESS:');
      console.log('All NFC/GPS functionality should work correctly!');
    }
    
    return results;
    
  } catch (error) {
    console.error('💥 Quick fix failed:', error);
    return results;
  }
}

// Export for browser console
if (typeof window !== 'undefined') {
  window.quickFixNfcGps = quickFixNfcGps;
  console.log('🔧 Quick fix function available as window.quickFixNfcGps()');
}

// Run the quick fix
quickFixNfcGps(); 