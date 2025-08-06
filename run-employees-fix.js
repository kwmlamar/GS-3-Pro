import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Read environment variables
const supabaseUrl = 'https://mvwvshrmufwssjbatcxq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im12d3ZzaHJtdWZ3c3NqYmF0Y3hxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3MDQ4MDgsImV4cCI6MjA2NTI4MDgwOH0.3iA_rlSR9fhNeyjRXKYxBm4E4qPchCsoRmWy28ou-eo';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function fixEmployeesTableReferences() {
  try {
    console.log('Fixing database functions that reference employees table...');
    
    // Read the SQL file
    const sqlContent = fs.readFileSync('fix-employees-table-references.sql', 'utf8');
    
    // Split the SQL into individual statements
    const statements = sqlContent.split(';').filter(stmt => stmt.trim().length > 0);
    
    console.log(`Found ${statements.length} SQL statements to execute`);
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i].trim();
      if (statement.length === 0) continue;
      
      console.log(`Executing statement ${i + 1}/${statements.length}...`);
      
      try {
        const { data, error } = await supabase.rpc('exec_sql', { sql: statement + ';' });
        
        if (error) {
          console.error(`Error executing statement ${i + 1}:`, error);
          // Continue with other statements
        } else {
          console.log(`Statement ${i + 1} executed successfully`);
        }
      } catch (error) {
        console.error(`Error executing statement ${i + 1}:`, error);
      }
    }
    
    console.log('Database functions fix completed!');
    
    // Test if the functions work now
    console.log('Testing if the functions work now...');
    
    try {
      const { data, error } = await supabase.rpc('get_organizational_chart');
      
      if (error) {
        console.error('Error testing organizational chart function:', error);
      } else {
        console.log('✅ Organizational chart function is working!');
        console.log('Sample data:', data?.slice(0, 3));
      }
    } catch (error) {
      console.error('Error testing function:', error);
    }
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

fixEmployeesTableReferences(); 