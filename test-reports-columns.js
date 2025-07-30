import { supabase } from './src/lib/supabaseClient.js';

const testReportsColumns = async () => {
  console.log('🔍 Testing reports table structure...');
  
  try {
    // Test 1: Check if reports table exists and get its structure
    const { data: reports, error: reportsError } = await supabase
      .from('reports')
      .select('*')
      .limit(1);
    
    console.log('📋 Reports test:', reports);
    console.log('📋 Reports error:', reportsError);
    
    if (reports && reports.length > 0) {
      console.log('📋 Reports columns:', Object.keys(reports[0]));
      
      // Check for specific columns
      const sampleReport = reports[0];
      console.log('📋 site_id exists:', 'site_id' in sampleReport);
      console.log('📋 entity_officer_id exists:', 'entity_officer_id' in sampleReport);
      console.log('📋 security_officer_id exists:', 'security_officer_id' in sampleReport);
      console.log('📋 site_name exists:', 'site_name' in sampleReport);
      console.log('📋 officer_name exists:', 'officer_name' in sampleReport);
    }
    
    // Test 2: Check if sites table exists
    const { data: sites, error: sitesError } = await supabase
      .from('sites')
      .select('*')
      .limit(1);
    
    console.log('📋 Sites test:', sites);
    console.log('📋 Sites error:', sitesError);
    
    // Test 3: Check if entity_staff table exists
    const { data: entityStaff, error: entityStaffError } = await supabase
      .from('entity_staff')
      .select('*')
      .limit(1);
    
    console.log('📋 Entity staff test:', entityStaff);
    console.log('📋 Entity staff error:', entityStaffError);
    
    // Test 4: Check if security_staff table exists
    const { data: securityStaff, error: securityStaffError } = await supabase
      .from('security_staff')
      .select('*')
      .limit(1);
    
    console.log('📋 Security staff test:', securityStaff);
    console.log('📋 Security staff error:', securityStaffError);
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
};

testReportsColumns(); 