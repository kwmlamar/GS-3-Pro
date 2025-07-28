// Browser console test script for EntityDetailsDialog
// Copy and paste this into the browser console to test

const testDialogData = async () => {
  console.log('🧪 Testing EntityDetailsDialog data fetching...');
  
  try {
    // Test 1: Check if sites table has data
    console.log('📊 Testing sites table...');
    const { data: sitesData, error: sitesError } = await supabase
      .from('sites')
      .select('id, name, type')
      .limit(5);
    
    console.log('Sites data:', sitesData);
    console.log('Sites error:', sitesError);
    
    if (sitesData && sitesData.length > 0) {
      // Test 2: Check entity staff for the first site
      const firstSite = sitesData[0];
      console.log('🔍 Testing entity staff for site:', firstSite);
      
      const { data: entityStaffData, error: entityStaffError } = await supabase
        .from('entity_staff_entities')
        .select(`
          entity_staff_id,
          is_primary,
          entity_staff (
            id,
            first_name,
            last_name,
            email,
            phone,
            position,
            department_id,
            departments (name)
          )
        `)
        .eq('site_id', firstSite.id);
      
      console.log('Entity staff data:', entityStaffData);
      console.log('Entity staff error:', entityStaffError);
      
      // Test 3: Check security staff for the first site
      console.log('🔍 Testing security staff for site:', firstSite);
      
      const { data: securityStaffData, error: securityStaffError } = await supabase
        .from('security_staff_entities')
        .select(`
          security_staff_id,
          is_primary,
          security_staff (
            id,
            first_name,
            last_name,
            email,
            phone,
            position,
            company_id,
            security_companies (name)
          )
        `)
        .eq('site_id', firstSite.id);
      
      console.log('Security staff data:', securityStaffData);
      console.log('Security staff error:', securityStaffError);
      
      // Test 4: Check if entity_staff table has data
      console.log('📊 Testing entity_staff table...');
      const { data: allEntityStaff, error: allEntityStaffError } = await supabase
        .from('entity_staff')
        .select('id, first_name, last_name, email')
        .limit(5);
      
      console.log('All entity staff data:', allEntityStaff);
      console.log('All entity staff error:', allEntityStaffError);
      
      // Test 5: Check if security_staff table has data
      console.log('📊 Testing security_staff table...');
      const { data: allSecurityStaff, error: allSecurityStaffError } = await supabase
        .from('security_staff')
        .select('id, first_name, last_name, email')
        .limit(5);
      
      console.log('All security staff data:', allSecurityStaff);
      console.log('All security staff error:', allSecurityStaffError);
      
      // Summary
      console.log('📋 Summary:');
      console.log(`- Sites found: ${sitesData?.length || 0}`);
      console.log(`- Entity staff found: ${allEntityStaff?.length || 0}`);
      console.log(`- Security staff found: ${allSecurityStaff?.length || 0}`);
      console.log(`- Entity staff relationships: ${entityStaffData?.length || 0}`);
      console.log(`- Security staff relationships: ${securityStaffData?.length || 0}`);
      
    } else {
      console.log('❌ No sites found in database');
    }
    
    console.log('✅ Database test completed!');
    
  } catch (error) {
    console.error('❌ Database test failed:', error);
  }
};

// Run the test
testDialogData(); 