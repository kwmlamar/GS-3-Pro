import { createClient } from '@supabase/supabase-js';

// Read environment variables
const supabaseUrl = 'https://mvwvshrmufwssjbatcxq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im12d3ZzaHJtdWZ3c3NqYmF0Y3hxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3MDQ4MDgsImV4cCI6MjA2NTI4MDgwOH0.3iA_rlSR9fhNeyjRXKYxBm4E4qPchCsoRmWy28ou-eo';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testEmployeesError() {
  try {
    console.log('Testing for employees table error...');
    
    // Test 1: Try to call the organizational chart function
    console.log('1. Testing get_organizational_chart function...');
    try {
      const { data, error } = await supabase.rpc('get_organizational_chart');
      
      if (error) {
        console.error('Error calling get_organizational_chart:', error);
        console.log('This confirms the database functions still reference employees table');
      } else {
        console.log('✅ get_organizational_chart function is working');
        console.log('Sample data:', data?.slice(0, 2));
      }
    } catch (error) {
      console.error('Exception calling get_organizational_chart:', error);
    }
    
    // Test 2: Try to call the supervisor chain function
    console.log('\n2. Testing get_supervisor_chain function...');
    try {
      const { data, error } = await supabase.rpc('get_supervisor_chain', { entity_staff_id: 1 });
      
      if (error) {
        console.error('Error calling get_supervisor_chain:', error);
      } else {
        console.log('✅ get_supervisor_chain function is working');
        console.log('Sample data:', data?.slice(0, 2));
      }
    } catch (error) {
      console.error('Exception calling get_supervisor_chain:', error);
    }
    
    // Test 3: Try to call the full reporting chain function
    console.log('\n3. Testing get_full_reporting_chain function...');
    try {
      const { data, error } = await supabase.rpc('get_full_reporting_chain', { entity_staff_id: 1 });
      
      if (error) {
        console.error('Error calling get_full_reporting_chain:', error);
      } else {
        console.log('✅ get_full_reporting_chain function is working');
        console.log('Sample data:', data?.slice(0, 2));
      }
    } catch (error) {
      console.error('Exception calling get_full_reporting_chain:', error);
    }
    
    // Test 4: Try to create entity staff (this should trigger the error)
    console.log('\n4. Testing entity staff creation...');
    try {
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
      
      const { data, error } = await supabase
        .from('entity_staff')
        .insert([testData])
        .select();
      
      if (error) {
        console.error('Error creating entity staff:', error);
        if (error.message && error.message.includes('employees')) {
          console.log('✅ Confirmed: The error is due to database functions still referencing employees table');
        }
      } else {
        console.log('✅ Entity staff creation is working');
        
        // Clean up test data
        if (data && data.length > 0) {
          await supabase
            .from('entity_staff')
            .delete()
            .eq('id', data[0].id);
          console.log('Cleaned up test data');
        }
      }
    } catch (error) {
      console.error('Exception creating entity staff:', error);
    }
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

testEmployeesError(); 