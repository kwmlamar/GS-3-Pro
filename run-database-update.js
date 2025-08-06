const { supabase } = require('./src/lib/supabaseClient');
const fs = require('fs');

async function updateDatabaseFunctions() {
  try {
    console.log('Reading SQL file...');
    const sqlContent = fs.readFileSync('./update-database-functions.sql', 'utf8');
    
    console.log('Executing database function updates...');
    const { data, error } = await supabase.rpc('exec_sql', { sql: sqlContent });
    
    if (error) {
      console.error('Error updating database functions:', error);
      return;
    }
    
    console.log('Database functions updated successfully!');
  } catch (error) {
    console.error('Error:', error);
  }
}

updateDatabaseFunctions(); 