// Test if entity_staff_entities table exists and check its structure
// Copy and paste this into browser console

const testTableExistence = async () => {
  console.log('🔍 Testing table existence...');
  
  try {
    // Test 1: Check if entity_staff_entities table exists
    const { data: entityStaffEntities, error: entityStaffEntitiesError } = await supabase
      .from('entity_staff_entities')
      .select('*')
      .limit(1);
    
    console.log('📋 Entity staff entities test:', entityStaffEntities);
    console.log('📋 Entity staff entities error:', entityStaffEntitiesError);
    
    if (entityStaffEntitiesError) {
      console.log('❌ entity_staff_entities table error:', entityStaffEntitiesError.message);
      
      // Test 2: Maybe it's called employee_entities?
      const { data: employeeEntities, error: employeeEntitiesError } = await supabase
        .from('employee_entities')
        .select('*')
        .limit(1);
      
      console.log('📋 Employee entities test:', employeeEntities);
      console.log('📋 Employee entities error:', employeeEntitiesError);
      
      if (employeeEntitiesError) {
        console.log('❌ employee_entities table also doesn\'t exist');
      } else {
        console.log('✅ employee_entities table exists!');
        if (employeeEntities && employeeEntities.length > 0) {
          console.log('📋 Employee entities columns:', Object.keys(employeeEntities[0]));
        }
      }
    } else {
      console.log('✅ entity_staff_entities table exists!');
      if (entityStaffEntities && entityStaffEntities.length > 0) {
        console.log('📋 Entity staff entities columns:', Object.keys(entityStaffEntities[0]));
      }
    }
    
    // Test 3: Check if entity_staff table exists and has data
    const { data: entityStaff, error: entityStaffError } = await supabase
      .from('entity_staff')
      .select('*')
      .limit(1);
    
    console.log('📋 Entity staff test:', entityStaff);
    console.log('📋 Entity staff error:', entityStaffError);
    
    if (entityStaff && entityStaff.length > 0) {
      console.log('📋 Entity staff columns:', Object.keys(entityStaff[0]));
    }
    
    // Test 4: Check if sites table exists
    const { data: sites, error: sitesError } = await supabase
      .from('sites')
      .select('*')
      .limit(1);
    
    console.log('📋 Sites test:', sites);
    console.log('📋 Sites error:', sitesError);
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
};

testTableExistence(); 