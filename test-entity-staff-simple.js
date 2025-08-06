import { createClient } from '@supabase/supabase-js';

// Read environment variables
const supabaseUrl = 'https://mvwvshrmufwssjbatcxq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im12d3ZzaHJtdWZ3c3NqYmF0Y3hxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3MDQ4MDgsImV4cCI6MjA2NTI4MDgwOH0.3iA_rlSR9fhNeyjRXKYxBm4E4qPchCsoRmWy28ou-eo';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testEntityStaffTable() {
  try {
    console.log('Testing entity_staff table...');
    
    // Try to query the entity_staff table
    const { data, error } = await supabase
      .from('entity_staff')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('Error querying entity_staff table:', error);
      
      // Check if the employees table exists
      const { data: employeesData, error: employeesError } = await supabase
        .from('employees')
        .select('*')
        .limit(1);
      
      if (employeesError) {
        console.error('Error querying employees table:', employeesError);
        console.log('Neither entity_staff nor employees table exists');
      } else {
        console.log('employees table exists, but entity_staff does not');
        console.log('Sample employees data:', employeesData);
      }
      
      return;
    }
    
    console.log('entity_staff table exists and is accessible');
    console.log('Sample data:', data);
    
    // Try to insert a test record
    const testData = {
      name: 'Test Employee',
      role: 'Test Role',
      type: 'Standard Officer',
      site: 'Test Site',
      status: 'Active',
      compliance: 100,
      certifications: ['Test Cert'],
      email: 'test@test.com',
      phone: '123-456-7890',
      hire_date: new Date().toISOString().split('T')[0]
    };
    
    console.log('Attempting to insert test data:', testData);
    
    const { data: insertData, error: insertError } = await supabase
      .from('entity_staff')
      .insert([testData])
      .select();
    
    if (insertError) {
      console.error('Error inserting test data:', insertError);
      return;
    }
    
    console.log('Successfully inserted test data:', insertData);
    
    // Clean up test data
    if (insertData && insertData.length > 0) {
      const { error: deleteError } = await supabase
        .from('entity_staff')
        .delete()
        .eq('id', insertData[0].id);
      
      if (deleteError) {
        console.error('Error deleting test data:', deleteError);
      } else {
        console.log('Successfully cleaned up test data');
      }
    }
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

testEntityStaffTable(); 