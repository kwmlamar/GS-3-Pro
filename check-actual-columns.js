// Check what columns actually exist in entity_staff table
// Copy and paste this into browser console

const checkActualColumns = async () => {
  console.log('🔍 Checking actual columns in entity_staff table...');
  
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
      console.log('📋 Entity staff actual columns:', columns);
      
      // Check for name-related columns
      const nameColumns = columns.filter(col => 
        col.includes('name') || 
        col.includes('first') || 
        col.includes('last') ||
        col.includes('fname') ||
        col.includes('lname') ||
        col.includes('given') ||
        col.includes('surname')
      );
      console.log('📋 Name-related columns found:', nameColumns);
      
      // Check for contact columns
      const contactColumns = columns.filter(col => 
        col.includes('email') || 
        col.includes('phone') || 
        col.includes('contact')
      );
      console.log('📋 Contact-related columns found:', contactColumns);
      
      // Check for position/role columns
      const positionColumns = columns.filter(col => 
        col.includes('position') || 
        col.includes('role') || 
        col.includes('title') ||
        col.includes('job') ||
        col.includes('department')
      );
      console.log('📋 Position-related columns found:', positionColumns);
      
      // Show the actual data structure
      console.log('📋 Full sample record:', entityStaffSample[0]);
    }
    
  } catch (error) {
    console.error('❌ Check failed:', error);
  }
};

checkActualColumns(); 