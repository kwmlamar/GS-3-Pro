import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  console.log('Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in your .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupReportsTables() {
  try {
    console.log('🚀 Setting up Reports Hub database tables...\n');

    // Read the SQL file
    const sqlFilePath = path.join(__dirname, 'create-reports-tables.sql');
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');

    console.log('📋 Executing SQL commands...');

    // Split the SQL into individual statements
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    let successCount = 0;
    let errorCount = 0;

    for (const statement of statements) {
      try {
        if (statement.trim()) {
          const { error } = await supabase.rpc('exec_sql', { sql: statement });
          if (error) {
            console.error(`❌ Error executing statement: ${error.message}`);
            errorCount++;
          } else {
            successCount++;
          }
        }
      } catch (err) {
        console.error(`❌ Error executing statement: ${err.message}`);
        errorCount++;
      }
    }

    console.log(`\n✅ Setup completed!`);
    console.log(`   Success: ${successCount} statements`);
    console.log(`   Errors: ${errorCount} statements`);

    if (errorCount === 0) {
      console.log('\n🎉 Reports Hub tables created successfully!');
      console.log('\n📊 Created tables:');
      console.log('   • reports');
      console.log('   • violations');
      console.log('   • observations');
      console.log('   • report_templates');
      
      console.log('\n📝 Sample data inserted:');
      console.log('   • 4 sample reports');
      console.log('   • 4 sample violations');
      console.log('   • 4 sample observations');
      console.log('   • 6 report templates');

      console.log('\n🔧 Next steps:');
      console.log('   1. Run your development server: npm run dev');
      console.log('   2. Navigate to /reports to see the Reports Hub');
      console.log('   3. The components will now load real data from the database');

    } else {
      console.log('\n⚠️  Some errors occurred during setup. Please check the output above.');
    }

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  }
}

// Test database connection
async function testConnection() {
  try {
    console.log('🔍 Testing database connection...');
    
    const { data, error } = await supabase
      .from('reports')
      .select('count')
      .limit(1);

    if (error) {
      console.error('❌ Database connection failed:', error.message);
      return false;
    }

    console.log('✅ Database connection successful!');
    return true;
  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
    return false;
  }
}

async function main() {
  console.log('🔧 Reports Hub Database Setup');
  console.log('==============================\n');

  const isConnected = await testConnection();
  if (!isConnected) {
    console.log('\n❌ Cannot proceed without database connection');
    process.exit(1);
  }

  await setupReportsTables();
}

main().catch(console.error); 