import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Read environment variables
const supabaseUrl = 'https://mvwvshrmufwssjbatcxq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im12d3ZzaHJtdWZ3c3NqYmF0Y3hxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3MDQ4MDgsImV4cCI6MjA2NTI4MDgwOH0.3iA_rlSR9fhNeyjRXKYxBm4E4qPchCsoRmWy28ou-eo';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function fixEntityStaffTable() {
  try {
    console.log('Running entity_staff table fix...');
    
    // Read the SQL file
    const sqlContent = fs.readFileSync('fix-entity-staff-table.sql', 'utf8');
    
    // Execute the SQL
    const { data, error } = await supabase.rpc('exec_sql', { sql: sqlContent });
    
    if (error) {
      console.error('Error executing SQL:', error);
      
      // Try a simpler approach - just check if the table exists
      const { data: tables, error: tableError } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public')
        .eq('table_name', 'entity_staff');
      
      if (tableError) {
        console.error('Error checking table existence:', tableError);
        return;
      }
      
      console.log('Current tables:', tables);
      
      // Try to create the table manually
      const createTableSQL = `
        CREATE TABLE IF NOT EXISTS entity_staff (
          id BIGSERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          role VARCHAR(255) NOT NULL,
          type VARCHAR(100) NOT NULL,
          site VARCHAR(255) NOT NULL,
          status VARCHAR(50) DEFAULT 'Active',
          compliance INTEGER DEFAULT 100 CHECK (compliance >= 0 AND compliance <= 100),
          certifications TEXT[] DEFAULT '{}',
          email VARCHAR(255),
          phone VARCHAR(50),
          hire_date DATE DEFAULT CURRENT_DATE,
          department_id BIGINT,
          supervisor_id BIGINT REFERENCES entity_staff(id) ON DELETE SET NULL,
          notes TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `;
      
      console.log('Attempting to create table manually...');
      const { error: createError } = await supabase.rpc('exec_sql', { sql: createTableSQL });
      
      if (createError) {
        console.error('Error creating table:', createError);
      } else {
        console.log('Table created successfully');
      }
      
    } else {
      console.log('SQL executed successfully:', data);
    }
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

fixEntityStaffTable(); 