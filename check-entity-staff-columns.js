// Check what columns exist in entity_staff table
// Copy and paste this into browser console

const checkEntityStaffColumns = async () => {
  console.log('🔍 Checking entity_staff table structure...');
  
  try {
    // Get a sample record to see the actual column names
    const { data: entityStaffSample, error: entityStaffError } = await supabase
      .from('entity_staff')
      .select('*')
      .limit(1);
    
    console.log('📋 Entity staff sample:', entityStaffSample);
    console.log('📋 Entity staff error:', entityStaffError);
    
    if (entityStaffSample && entityStaffSample.length > 0) {
      const columns = Object.keys(entityStaffSample[0]);
      console.log('📋 Entity staff columns:', columns);
      
      // Check for name-related columns
      const nameColumns = columns.filter(col => 
        col.includes('name') || 
        col.includes('first') || 
        col.includes('last') ||
        col.includes('fname') ||
        col.includes('lname')
      );
      console.log('📋 Name-related columns:', nameColumns);
      
      // Check for contact columns
      const contactColumns = columns.filter(col => 
        col.includes('email') || 
        col.includes('phone') || 
        col.includes('contact')
      );
      console.log('📋 Contact-related columns:', contactColumns);
      
      // Check for position/role columns
      const positionColumns = columns.filter(col => 
        col.includes('position') || 
        col.includes('role') || 
        col.includes('title') ||
        col.includes('job')
      );
      console.log('📋 Position-related columns:', positionColumns);
    }
    
    // Also check the entity_staff_entities table
    const { data: entityStaffEntitiesSample, error: entityStaffEntitiesError } = await supabase
      .from('entity_staff_entities')
      .select('*')
      .limit(1);
    
    console.log('📋 Entity staff entities sample:', entityStaffEntitiesSample);
    console.log('📋 Entity staff entities error:', entityStaffEntitiesError);
    
    if (entityStaffEntitiesSample && entityStaffEntitiesSample.length > 0) {
      console.log('📋 Entity staff entities columns:', Object.keys(entityStaffEntitiesSample[0]));
    }
    
  } catch (error) {
    console.error('❌ Check failed:', error);
  }
};

checkEntityStaffColumns(); 