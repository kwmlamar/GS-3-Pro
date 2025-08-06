import { createClient } from '@supabase/supabase-js';

// Read environment variables
const supabaseUrl = 'https://mvwvshrmufwssjbatcxq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im12d3ZzaHJtdWZ3c3NqYmF0Y3hxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3MDQ4MDgsImV4cCI6MjA2NTI4MDgwOH0.3iA_rlSR9fhNeyjRXKYxBm4E4qPchCsoRmWy28ou-eo';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testEntityStaffCreation() {
  try {
    console.log('Testing entity staff creation...');
    
    // Test data that matches what the form would send
    const testData = {
      name: 'Test Entity Staff',
      role: 'Test Role',
      type: 'Standard Officer',
      site: 'Test Site',
      status: 'Active',
      compliance: 100,
      certifications: ['Test Cert'],
      email: 'test@test.com',
      phone: '123-456-7890',
      hire_date: new Date().toISOString().split('T')[0],
      department_id: null,
      supervisor_id: null,
      notes: 'Test notes'
    };
    
    console.log('Test data:', testData);
    
    // Try to create entity staff using the same method as the service
    const { data, error } = await supabase
      .from('entity_staff')
      .insert([testData])
      .select(`
        *,
        departments (id, name, description),
        supervisor:entity_staff!supervisor_id (id, name, role, type)
      `)
      .single();
    
    if (error) {
      console.error('Error creating entity staff:', error);
      
      // Check if the error mentions employees table
      if (error.message && error.message.includes('employees')) {
        console.log('✅ Confirmed: The error is due to database functions/triggers still referencing employees table');
        console.log('This is likely caused by the validate_supervisor_assignment trigger function');
      }
    } else {
      console.log('✅ Entity staff creation is working');
      console.log('Created entity staff:', data);
      
      // Clean up test data
      await supabase
        .from('entity_staff')
        .delete()
        .eq('id', data.id);
      console.log('Cleaned up test data');
    }
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

testEntityStaffCreation(); 