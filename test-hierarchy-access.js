import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Load environment variables from .env.local
const envPath = resolve('.env.local');
const envContent = readFileSync(envPath, 'utf8');
const envVars = {};

envContent.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=');
  if (key && valueParts.length > 0) {
    envVars[key.trim()] = valueParts.join('=').trim();
  }
});

const supabaseUrl = envVars.VITE_SUPABASE_URL;
const supabaseServiceKey = envVars.SUPABASE_SERVICE_ROLE_KEY || envVars.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const testHierarchyAccess = async () => {
  try {
    console.log('🔍 Testing hierarchy data access...');

    // Test 1: Fetch all sites with parent relationships
    const { data: sites, error: sitesError } = await supabase
      .from('sites')
      .select(`
        id, 
        name, 
        type, 
        parent_id, 
        client_id, 
        address, 
        gps_coordinates,
        parent:sites!parent_id ( name )
      `);

    if (sitesError) {
      console.error('❌ Error fetching sites:', sitesError);
      return;
    }

    console.log(`✅ Successfully fetched ${sites.length} sites`);
    
    // Test 2: Show hierarchy structure
    console.log('\n📊 Hierarchy Structure:');
    const sitesByType = sites.reduce((acc, site) => {
      acc[site.type] = (acc[site.type] || 0) + 1;
      return acc;
    }, {});
    
    Object.entries(sitesByType).forEach(([type, count]) => {
      console.log(`  - ${count} ${type} sites`);
    });

    // Test 3: Show some sample data
    console.log('\n📋 Sample Sites:');
    sites.slice(0, 5).forEach(site => {
      console.log(`  - ${site.name} (${site.type}) - Parent: ${site.parent?.name || 'None'}`);
    });

    // Test 4: Test dashboard data logic
    console.log('\n🎯 Testing Dashboard Logic:');
    
    // Regional dashboard - sites under regions
    const regionalSites = sites.filter(s => s.type === 'site' && s.parent_id);
    console.log(`  - Regional Dashboard: ${regionalSites.length} sites under regions`);
    
    // National dashboard - regions under nationals
    const nationalRegions = sites.filter(s => s.type === 'region' && s.parent_id);
    console.log(`  - National Dashboard: ${nationalRegions.length} regions under nationals`);
    
    // Global dashboard - nationals under global
    const globalNationals = sites.filter(s => s.type === 'national' && s.parent_id);
    console.log(`  - Global Dashboard: ${globalNationals.length} nationals under global`);

    console.log('\n✅ Hierarchy data access test completed successfully!');
    console.log('🌐 You can now view the hierarchy at: http://localhost:5174/sites');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
};

testHierarchyAccess(); 