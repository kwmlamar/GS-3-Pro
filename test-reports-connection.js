import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  console.log('Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in your .env.local file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testReportsConnection() {
  try {
    console.log('🔧 Reports Hub Connection Test');
    console.log('==============================\n');

    console.log('🔍 Testing database connection...');
    
    // Test basic connection
    const { data: testData, error: testError } = await supabase
      .from('employees')
      .select('count')
      .limit(1);

    if (testError) {
      console.error('❌ Database connection failed:', testError.message);
      return false;
    }

    console.log('✅ Database connection successful!');

    // Check if reports table exists
    console.log('\n📋 Checking for reports tables...');
    
    const tables = ['reports', 'violations', 'observations', 'report_templates'];
    
    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('count')
          .limit(1);
        
        if (error) {
          console.log(`❌ Table '${table}' does not exist or is not accessible`);
        } else {
          console.log(`✅ Table '${table}' exists and is accessible`);
        }
      } catch (err) {
        console.log(`❌ Error checking table '${table}': ${err.message}`);
      }
    }

    console.log('\n📝 Manual Setup Instructions:');
    console.log('1. Go to your Supabase dashboard');
    console.log('2. Navigate to the SQL Editor');
    console.log('3. Copy and paste the contents of create-reports-tables.sql');
    console.log('4. Execute the SQL commands');
    console.log('5. Verify the tables were created successfully');

    console.log('\n🔧 After manual setup:');
    console.log('1. Run your development server: npm run dev');
    console.log('2. Navigate to /reports to see the Reports Hub');
    console.log('3. Click "Create Report" to test the form');

    return true;
  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
    return false;
  }
}

testReportsConnection().catch(console.error); 