import { supabase } from './src/lib/supabaseClient.js';

async function testEntityStaffTable() {
  try {
    console.log('Testing entity_staff table...');
    
    // Check if the table exists
    const { data: tables, error: tableError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'entity_staff');
    
    if (tableError) {
      console.error('Error checking table existence:', tableError);
      return;
    }
    
    console.log('Tables found:', tables);
    
    // Check table structure
    const { data: columns, error: columnError } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type, is_nullable')
      .eq('table_schema', 'public')
      .eq('table_name', 'entity_staff')
      .order('ordinal_position');
    
    if (columnError) {
      console.error('Error checking table structure:', columnError);
      return;
    }
    
    console.log('Table structure:', columns);
    
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