// Test script to verify EmployeeForm creates proper relationships
// This can be run in the browser console

const testEmployeeFormRelationships = async () => {
  console.log('🧪 Testing EmployeeForm relationship creation...');
  
  try {
    // Test 1: Check if we have any entity staff with entities
    console.log('📊 Checking entity staff with entities...');
    const { data: entityStaffWithEntities, error: entityStaffError } = await supabase
      .from('entity_staff_entities')
      .select(`
        entity_staff_id,
        site_id,
        is_primary,
        entity_staff (id, first_name, last_name, email),
        sites (id, name, type)
      `)
      .limit(10);
    
    console.log('Entity staff relationships:', entityStaffWithEntities);
    console.log('Entity staff error:', entityStaffError);
    
    // Test 2: Check if we have any security staff with entities
    console.log('📊 Checking security staff with entities...');
    const { data: securityStaffWithEntities, error: securityStaffError } = await supabase
      .from('security_staff_entities')
      .select(`
        security_staff_id,
        site_id,
        is_primary,
        security_staff (id, first_name, last_name, email),
        sites (id, name, type)
      `)
      .limit(10);
    
    console.log('Security staff relationships:', securityStaffWithEntities);
    console.log('Security staff error:', securityStaffError);
    
    // Test 3: Check entity staff with legacy site column
    console.log('📊 Checking entity staff with legacy site column...');
    const { data: entityStaffLegacy, error: entityStaffLegacyError } = await supabase
      .from('entity_staff')
      .select('id, first_name, last_name, email, site')
      .not('site', 'is', null)
      .limit(10);
    
    console.log('Entity staff with legacy site:', entityStaffLegacy);
    console.log('Entity staff legacy error:', entityStaffLegacyError);
    
    // Test 4: Check security staff with legacy site column
    console.log('📊 Checking security staff with legacy site column...');
    const { data: securityStaffLegacy, error: securityStaffLegacyError } = await supabase
      .from('security_staff')
      .select('id, first_name, last_name, email, site')
      .not('site', 'is', null)
      .limit(10);
    
    console.log('Security staff with legacy site:', securityStaffLegacy);
    console.log('Security staff legacy error:', securityStaffLegacyError);
    
    // Summary
    console.log('📋 Relationship Summary:');
    console.log(`- Entity staff relationships: ${entityStaffWithEntities?.length || 0}`);
    console.log(`- Security staff relationships: ${securityStaffWithEntities?.length || 0}`);
    console.log(`- Entity staff with legacy site: ${entityStaffLegacy?.length || 0}`);
    console.log(`- Security staff with legacy site: ${securityStaffLegacy?.length || 0}`);
    
    // Test 5: Simulate creating a new entity staff with entities
    console.log('🔧 Testing entity staff creation with entities...');
    
    // Get a sample site
    const { data: sampleSites } = await supabase
      .from('sites')
      .select('id, name')
      .limit(1);
    
    if (sampleSites && sampleSites.length > 0) {
      const sampleSite = sampleSites[0];
      console.log('Sample site for testing:', sampleSite);
      
      // This would be the data structure that EmployeeForm sends
      const testEntityStaffData = {
        first_name: 'Test',
        last_name: 'Employee',
        email: 'test.employee@gs3.com',
        phone: '+1-555-0000',
        position: 'Test Position',
        department: 'Test Department',
        type: 'Employee',
        status: 'Active',
        entities: [sampleSite.id], // This is the key - array of site IDs
        supervisor_ids: []
      };
      
      console.log('Test entity staff data structure:', testEntityStaffData);
      console.log('Note: The entities array contains site IDs that will be used to create relationships');
    }
    
    console.log('✅ EmployeeForm relationship test completed!');
    
  } catch (error) {
    console.error('❌ EmployeeForm relationship test failed:', error);
  }
};

// Run the test
testEmployeeFormRelationships(); 