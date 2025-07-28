// Check what columns exist in the tables
// Copy and paste this into browser console

const checkTableColumns = async () => {
  console.log('🔍 Checking table columns...');
  
  try {
    // Check entity_staff table structure
    const { data: entityStaffSample, error: entityStaffError } = await supabase
      .from('entity_staff')
      .select('*')
      .limit(1);
    
    console.log('📋 Entity staff sample:', entityStaffSample);
    console.log('📋 Entity staff error:', entityStaffError);
    
    if (entityStaffSample && entityStaffSample.length > 0) {
      console.log('📋 Entity staff columns:', Object.keys(entityStaffSample[0]));
    }
    
    // Check security_staff table structure
    const { data: securityStaffSample, error: securityStaffError } = await supabase
      .from('security_staff')
      .select('*')
      .limit(1);
    
    console.log('📋 Security staff sample:', securityStaffSample);
    console.log('📋 Security staff error:', securityStaffError);
    
    if (securityStaffSample && securityStaffSample.length > 0) {
      console.log('📋 Security staff columns:', Object.keys(securityStaffSample[0]));
    }
    
    // Check if site column exists in entity_staff
    const { data: entityStaffWithSite, error: entityStaffWithSiteError } = await supabase
      .from('entity_staff')
      .select('site')
      .limit(1);
    
    console.log('📋 Entity staff with site column:', entityStaffWithSite);
    console.log('📋 Entity staff with site error:', entityStaffWithSiteError);
    
  } catch (error) {
    console.error('❌ Check failed:', error);
  }
};

checkTableColumns(); 