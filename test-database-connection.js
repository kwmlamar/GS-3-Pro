// Test script to check database connection and data
import { supabase } from './src/lib/supabaseClient.js';

const testDatabaseConnection = async () => {
  console.log('🧪 Testing database connection and data...');
  
  try {
    // Test 1: Check if sites table has data
    console.log('📊 Testing sites table...');
    const { data: sitesData, error: sitesError } = await supabase
      .from('sites')
      .select('id, name, type')
      .limit(5);
    
    console.log('Sites data:', sitesData);
    console.log('Sites error:', sitesError);
    
    // Test 2: Check if entity_staff table has data
    console.log('📊 Testing entity_staff table...');
    const { data: entityStaffData, error: entityStaffError } = await supabase
      .from('entity_staff')
      .select('id, first_name, last_name, email')
      .limit(5);
    
    console.log('Entity staff data:', entityStaffData);
    console.log('Entity staff error:', entityStaffError);
    
    // Test 3: Check if entity_staff_entities table has data
    console.log('📊 Testing entity_staff_entities table...');
    const { data: entityStaffEntitiesData, error: entityStaffEntitiesError } = await supabase
      .from('entity_staff_entities')
      .select(`
        entity_staff_id,
        site_id,
        is_primary,
        entity_staff (id, first_name, last_name)
      `)
      .limit(5);
    
    console.log('Entity staff entities data:', entityStaffEntitiesData);
    console.log('Entity staff entities error:', entityStaffEntitiesError);
    
    // Test 4: Check if security_staff table has data
    console.log('📊 Testing security_staff table...');
    const { data: securityStaffData, error: securityStaffError } = await supabase
      .from('security_staff')
      .select('id, first_name, last_name, email')
      .limit(5);
    
    console.log('Security staff data:', securityStaffData);
    console.log('Security staff error:', securityStaffError);
    
    // Test 5: Check if security_staff_entities table has data
    console.log('📊 Testing security_staff_entities table...');
    const { data: securityStaffEntitiesData, error: securityStaffEntitiesError } = await supabase
      .from('security_staff_entities')
      .select(`
        security_staff_id,
        site_id,
        is_primary,
        security_staff (id, first_name, last_name)
      `)
      .limit(5);
    
    console.log('Security staff entities data:', securityStaffEntitiesData);
    console.log('Security staff entities error:', securityStaffEntitiesError);
    
    console.log('✅ Database connection test completed!');
    
  } catch (error) {
    console.error('❌ Database connection test failed:', error);
  }
};

// Run the test
testDatabaseConnection(); 