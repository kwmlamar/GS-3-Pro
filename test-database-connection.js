import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = 'https://mvwvshrmufwssjbatcxq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im12d3ZzaHJtdWZ3c3NqYmF0Y3hxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ5NzE5NzQsImV4cCI6MjA1MDU0Nzk3NH0.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testDatabaseConnection() {
  try {
    console.log('Testing database connection...');
    
    // Test if entity_staff table exists
    const { data: entityStaff, error: entityError } = await supabase
      .from('entity_staff')
      .select('count')
      .limit(1);
    
    if (entityError) {
      console.error('Error accessing entity_staff table:', entityError);
      return;
    }
    
    console.log('✅ entity_staff table exists and is accessible');
    
    // Test if employees table exists (should fail)
    const { data: employees, error: employeesError } = await supabase
      .from('employees')
      .select('count')
      .limit(1);
    
    if (employeesError) {
      console.log('✅ employees table does not exist (as expected):', employeesError.message);
    } else {
      console.log('⚠️ employees table still exists');
    }
    
    // Test the get_direct_reports function
    const { data: directReports, error: functionError } = await supabase
      .rpc('get_direct_reports', { entity_staff_id: 1 });
    
    if (functionError) {
      console.error('❌ Error with get_direct_reports function:', functionError);
    } else {
      console.log('✅ get_direct_reports function works');
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

testDatabaseConnection(); 