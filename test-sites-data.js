import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkSitesData() {
  try {
    console.log('🔍 Checking sites table data...');
    
    // Simple query to get all sites
    const { data, error } = await supabase
      .from('sites')
      .select('*')
      .limit(10);
    
    if (error) {
      console.error('❌ Error fetching sites:', error);
      return;
    }
    
    console.log('✅ Sites data found:', data.length, 'records');
    console.log('📋 Sample data:');
    data.forEach((site, index) => {
      console.log(`  ${index + 1}. ID: ${site.id}, Name: "${site.name}", Type: ${site.type}`);
    });
    
    // Check for sites without names
    const sitesWithoutNames = data.filter(site => !site.name);
    if (sitesWithoutNames.length > 0) {
      console.log('⚠️  Sites without names:', sitesWithoutNames.length);
      sitesWithoutNames.forEach(site => {
        console.log(`  - ID: ${site.id}, Name: "${site.name}", Type: ${site.type}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkSitesData(); 