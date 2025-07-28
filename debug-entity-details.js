// Comprehensive debugging script for EntityDetailsDialog
// Copy and paste this into the browser console to debug

const debugEntityDetails = async () => {
  console.log('🔍 Starting comprehensive debug of EntityDetailsDialog...');
  
  try {
    // Step 1: Check what sites we have
    console.log('📊 Step 1: Checking sites...');
    const { data: sitesData, error: sitesError } = await supabase
      .from('sites')
      .select('id, name, type')
      .limit(5);
    
    console.log('Sites found:', sitesData);
    console.log('Sites error:', sitesError);
    
    if (!sitesData || sitesData.length === 0) {
      console.log('❌ No sites found - this is the problem!');
      return;
    }
    
    // Step 2: Check entity staff table
    console.log('📊 Step 2: Checking entity_staff table...');
    const { data: entityStaffData, error: entityStaffError } = await supabase
      .from('entity_staff')
      .select('id, first_name, last_name, email, site')
      .limit(10);
    
    console.log('Entity staff found:', entityStaffData);
    console.log('Entity staff error:', entityStaffError);
    
    // Step 3: Check security staff table
    console.log('📊 Step 3: Checking security_staff table...');
    const { data: securityStaffData, error: securityStaffError } = await supabase
      .from('security_staff')
      .select('id, first_name, last_name, email, site')
      .limit(10);
    
    console.log('Security staff found:', securityStaffData);
    console.log('Security staff error:', securityStaffError);
    
    // Step 4: Check entity_staff_entities table
    console.log('📊 Step 4: Checking entity_staff_entities table...');
    const { data: entityStaffEntitiesData, error: entityStaffEntitiesError } = await supabase
      .from('entity_staff_entities')
      .select('*')
      .limit(10);
    
    console.log('Entity staff entities found:', entityStaffEntitiesData);
    console.log('Entity staff entities error:', entityStaffEntitiesError);
    
    // Step 5: Check security_staff_entities table
    console.log('📊 Step 5: Checking security_staff_entities table...');
    const { data: securityStaffEntitiesData, error: securityStaffEntitiesError } = await supabase
      .from('security_staff_entities')
      .select('*')
      .limit(10);
    
    console.log('Security staff entities found:', securityStaffEntitiesData);
    console.log('Security staff entities error:', securityStaffEntitiesError);
    
    // Step 6: Test the exact queries the dialog uses
    console.log('📊 Step 6: Testing dialog queries...');
    const firstSite = sitesData[0];
    console.log('Testing with site:', firstSite);
    
    // Test entity staff query (via relationships)
    const { data: entityStaffViaRelationships, error: entityStaffViaRelationshipsError } = await supabase
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
    
    console.log('Entity staff via relationships:', entityStaffViaRelationships);
    console.log('Entity staff via relationships error:', entityStaffViaRelationshipsError);
    
    // Test entity staff query (via legacy site column)
    const { data: entityStaffViaLegacy, error: entityStaffViaLegacyError } = await supabase
      .from('entity_staff')
      .select(`
        id,
        first_name,
        last_name,
        email,
        phone,
        position,
        department_id,
        departments (name)
      `)
      .eq('site', firstSite.name);
    
    console.log('Entity staff via legacy site column:', entityStaffViaLegacy);
    console.log('Entity staff via legacy site column error:', entityStaffViaLegacyError);
    
    // Test security staff query (via relationships)
    const { data: securityStaffViaRelationships, error: securityStaffViaRelationshipsError } = await supabase
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
    
    console.log('Security staff via relationships:', securityStaffViaRelationships);
    console.log('Security staff via relationships error:', securityStaffViaRelationshipsError);
    
    // Test security staff query (via legacy site column)
    const { data: securityStaffViaLegacy, error: securityStaffViaLegacyError } = await supabase
      .from('security_staff')
      .select(`
        id,
        first_name,
        last_name,
        email,
        phone,
        position,
        company_id,
        security_companies (name)
      `)
      .eq('site', firstSite.name);
    
    console.log('Security staff via legacy site column:', securityStaffViaLegacy);
    console.log('Security staff via legacy site column error:', securityStaffViaLegacyError);
    
    // Step 7: Summary and recommendations
    console.log('📋 DEBUG SUMMARY:');
    console.log(`- Sites: ${sitesData?.length || 0}`);
    console.log(`- Entity staff: ${entityStaffData?.length || 0}`);
    console.log(`- Security staff: ${securityStaffData?.length || 0}`);
    console.log(`- Entity staff relationships: ${entityStaffEntitiesData?.length || 0}`);
    console.log(`- Security staff relationships: ${securityStaffEntitiesData?.length || 0}`);
    console.log(`- Entity staff via relationships for ${firstSite.name}: ${entityStaffViaRelationships?.length || 0}`);
    console.log(`- Entity staff via legacy for ${firstSite.name}: ${entityStaffViaLegacy?.length || 0}`);
    console.log(`- Security staff via relationships for ${firstSite.name}: ${securityStaffViaRelationships?.length || 0}`);
    console.log(`- Security staff via legacy for ${firstSite.name}: ${securityStaffViaLegacy?.length || 0}`);
    
    // Step 8: Recommendations
    console.log('💡 RECOMMENDATIONS:');
    
    if (entityStaffData?.length === 0 && securityStaffData?.length === 0) {
      console.log('❌ No staff data found at all. You need to create some staff first.');
      console.log('   Go to Entity Staff or Security Staff management to add staff.');
    } else if (entityStaffViaRelationships?.length === 0 && entityStaffViaLegacy?.length === 0) {
      console.log('❌ No staff linked to this site. You need to assign staff to sites.');
      console.log('   When creating staff, make sure to select the entities/sites they work at.');
    } else {
      console.log('✅ Staff data found! The dialog should work.');
    }
    
    // Step 9: Create test data if needed
    if (entityStaffData?.length > 0 && entityStaffViaRelationships?.length === 0) {
      console.log('🔧 Creating test relationship...');
      const testEntityStaff = entityStaffData[0];
      const testSite = sitesData[0];
      
      const { data: testRelationship, error: testRelationshipError } = await supabase
        .from('entity_staff_entities')
        .insert({
          entity_staff_id: testEntityStaff.id,
          site_id: testSite.id,
          is_primary: true,
          status: 'active'
        })
        .select();
      
      console.log('Test relationship created:', testRelationship);
      console.log('Test relationship error:', testRelationshipError);
    }
    
    console.log('✅ Debug completed!');
    
  } catch (error) {
    console.error('❌ Debug failed:', error);
  }
};

// Run the debug
debugEntityDetails(); 