// Script to run the reports table migration
// This adds the missing foreign key columns to the reports table

const runMigration = async () => {
  console.log('🚀 Running reports table migration...');
  
  try {
    // Import the migration SQL
    const fs = await import('fs');
    const path = await import('path');
    
    const migrationPath = path.join(process.cwd(), 'update-reports-table-for-officers.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    console.log('📋 Migration SQL:');
    console.log(migrationSQL);
    
    console.log('\n✅ Migration SQL ready to run');
    console.log('📝 Please run this SQL in your Supabase dashboard:');
    console.log('1. Go to your Supabase project dashboard');
    console.log('2. Navigate to the SQL Editor');
    console.log('3. Copy and paste the SQL above');
    console.log('4. Click "Run" to execute the migration');
    
  } catch (error) {
    console.error('❌ Error reading migration file:', error);
  }
};

runMigration(); 