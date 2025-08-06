import { supabase } from './supabaseClient';

export const testDatabaseConnection = async () => {
  try {
    console.log('Testing database connection...');
    
    // Test 1: Basic connection
    const { data: connectionTest, error: connectionError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .limit(1);
    
    if (connectionError) {
      console.error('Connection test failed:', connectionError);
      return { success: false, error: connectionError };
    }
    
    console.log('✅ Database connection successful');
    
    // Test 2: Check if entity_staff table exists
    const { data: entityStaffTest, error: entityStaffError } = await supabase
      .from('entity_staff')
      .select('count')
      .limit(1);
    
    if (entityStaffError) {
      console.error('❌ Entity staff table test failed:', entityStaffError);
      return { 
        success: false, 
        error: entityStaffError,
        message: 'Entity staff table does not exist or is not accessible'
      };
    }
    
    console.log('✅ Entity staff table exists and is accessible');
    
    // Test 3: Try to get actual entity staff data
    const { data: entityStaff, error: fetchError } = await supabase
      .from('entity_staff')
      .select('*')
      .limit(5);
    
    if (fetchError) {
      console.error('❌ Entity staff data fetch failed:', fetchError);
      return { 
        success: false, 
        error: fetchError,
        message: 'Cannot fetch entity staff data'
      };
    }
    
    console.log('✅ Entity staff data fetch successful');
    console.log('📊 Found', entityStaff?.length || 0, 'entity staff members');
    
    return { 
      success: true, 
      entityStaffCount: entityStaff?.length || 0,
      message: 'Database connection and entity staff table working correctly'
    };
    
  } catch (error) {
    console.error('❌ Database test failed:', error);
    return { 
      success: false, 
      error,
      message: 'Database test failed'
    };
  }
}; 