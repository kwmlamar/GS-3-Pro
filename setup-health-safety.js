import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  console.log('Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in your .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupHealthSafety() {
  console.log('🔧 Setting up Health & Safety database...\n');

  try {
    console.log('📋 Testing database connection and creating health_safety_incidents table...');
    
    // First, let's test if the table already exists by trying to query it
    const { data: existingData, error: existingError } = await supabase
      .from('health_safety_incidents')
      .select('*')
      .limit(1);

    if (existingError && existingError.code === '42P01') {
      // Table doesn't exist, we need to create it manually in Supabase dashboard
      console.log('❌ Table health_safety_incidents does not exist');
      console.log('📋 Please run the following SQL in your Supabase dashboard:');
      console.log('\n' + '='.repeat(60));
      console.log(fs.readFileSync(path.join(__dirname, 'create-health-safety-incidents-table.sql'), 'utf8'));
      console.log('='.repeat(60));
      console.log('\n💡 After running the SQL, you can test the connection again');
      return;
    } else if (existingError) {
      console.error('❌ Error checking table:', existingError.message);
      return;
    }

    console.log('✅ Health & Safety incidents table created successfully!');

    // Test the connection by trying to fetch data
    console.log('\n🔍 Testing database connection...');
    
    const { data: sites, error: sitesError } = await supabase
      .from('sites')
      .select('id, name')
      .limit(1);

    if (sitesError) {
      console.log('⚠️  Warning: Could not fetch sites table:', sitesError.message);
      console.log('   This is expected if the sites table doesn\'t exist yet');
    } else {
      console.log('✅ Sites table accessible');
    }

    // Test health_safety_incidents table
    const { data: incidents, error: incidentsError } = await supabase
      .from('health_safety_incidents')
      .select('*')
      .limit(1);

    if (incidentsError) {
      console.error('❌ Error accessing health_safety_incidents table:', incidentsError.message);
      return;
    }

    console.log('✅ Health & Safety incidents table accessible');
    console.log(`📊 Current incidents count: ${incidents.length}`);

    // Test inserting a sample incident (if sites exist)
    if (sites && sites.length > 0) {
      console.log('\n🧪 Testing incident creation...');
      
      const sampleIncident = {
        site_id: sites[0].id,
        description: 'Test incident for database setup',
        incident_date: new Date().toISOString().split('T')[0],
        investigation_status: 'open'
      };

      const { data: newIncident, error: insertError } = await supabase
        .from('health_safety_incidents')
        .insert([sampleIncident])
        .select();

      if (insertError) {
        console.error('❌ Error inserting test incident:', insertError.message);
      } else {
        console.log('✅ Test incident created successfully');
        
        // Clean up test data
        const { error: deleteError } = await supabase
          .from('health_safety_incidents')
          .delete()
          .eq('id', newIncident[0].id);

        if (deleteError) {
          console.log('⚠️  Warning: Could not clean up test data:', deleteError.message);
        } else {
          console.log('✅ Test data cleaned up');
        }
      }
    }

    console.log('\n🎉 Health & Safety database setup completed successfully!');
    console.log('\n📝 Next steps:');
    console.log('   1. Make sure your sites table is populated');
    console.log('   2. Test the Health & Safety page in your application');
    console.log('   3. Verify that incidents can be created and managed');

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    console.log('\n💡 Troubleshooting tips:');
    console.log('   - Check your Supabase credentials');
    console.log('   - Ensure your database is accessible');
    console.log('   - Verify that RLS policies are properly configured');
  }
}

// Run the setup
setupHealthSafety(); 