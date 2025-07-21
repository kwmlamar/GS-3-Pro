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
    
    // Test 2: Check if employees table exists
    const { data: employeesTest, error: employeesError } = await supabase
      .from('employees')
      .select('count')
      .limit(1);
    
    if (employeesError) {
      console.error('❌ Employees table test failed:', employeesError);
      return { 
        success: false, 
        error: employeesError,
        message: 'Employees table does not exist or is not accessible'
      };
    }
    
    console.log('✅ Employees table exists and is accessible');
    
    // Test 3: Try to get actual employee data
    const { data: employees, error: fetchError } = await supabase
      .from('employees')
      .select('*')
      .limit(5);
    
    if (fetchError) {
      console.error('❌ Employee data fetch failed:', fetchError);
      return { 
        success: false, 
        error: fetchError,
        message: 'Cannot fetch employee data'
      };
    }
    
    console.log('✅ Employee data fetch successful');
    console.log('📊 Found', employees?.length || 0, 'employees');
    
    return { 
      success: true, 
      employeeCount: employees?.length || 0,
      message: 'Database connection and employees table working correctly'
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