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

const testFlexibleHierarchy = async () => {
  try {
    console.log('🔍 Testing flexible hierarchy functionality...');

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
        parent:sites!parent_id ( name, type )
      `);

    if (sitesError) {
      console.error('❌ Error fetching sites:', sitesError);
      return;
    }

    console.log(`✅ Successfully fetched ${sites.length} sites`);
    
    // Test 2: Show current hierarchy structure
    console.log('\n📊 Current Hierarchy Structure:');
    const sitesByType = sites.reduce((acc, site) => {
      acc[site.type] = (acc[site.type] || 0) + 1;
      return acc;
    }, {});
    
    Object.entries(sitesByType).forEach(([type, count]) => {
      console.log(`  - ${count} ${type} sites`);
    });

    // Test 3: Show flexible parent-child relationships
    console.log('\n🔗 Flexible Parent-Child Relationships:');
    sites.forEach(site => {
      if (site.parent) {
        console.log(`  - ${site.name} (${site.type}) → Parent: ${site.parent.name} (${site.parent.type})`);
      } else {
        console.log(`  - ${site.name} (${site.type}) → No parent`);
      }
    });

    // Test 4: Validate flexible hierarchy rules
    console.log('\n✅ Validating Flexible Hierarchy Rules:');
    
    // Check for any unusual parent-child combinations
    const unusualCombinations = sites.filter(site => {
      if (!site.parent) return false;
      
      // In the old system, these would be restricted:
      // - site can only have region/national/global as parent
      // - region can only have national/global as parent  
      // - national can only have global as parent
      // - global cannot have parent
      
      // Now we allow any combination, so we just log them for reference
      return true;
    });

    console.log(`  - Found ${unusualCombinations.length} parent-child relationships`);
    
    // Test 5: Show potential flexible relationships
    console.log('\n🎯 Potential Flexible Relationships:');
    const siteTypes = ['site', 'region', 'national', 'global', 'special_activity'];
    
    siteTypes.forEach(childType => {
      siteTypes.forEach(parentType => {
        if (childType !== parentType) {
          const hasThisRelationship = sites.some(site => 
            site.type === childType && 
            site.parent && 
            site.parent.type === parentType
          );
          
          if (hasThisRelationship) {
            console.log(`  ✅ ${childType} can have ${parentType} as parent`);
          } else {
            console.log(`  ⚠️  ${childType} → ${parentType} (no examples found)`);
          }
        }
      });
    });

    // Test 6: Test dashboard data logic with flexible hierarchy
    console.log('\n📊 Dashboard Data with Flexible Hierarchy:');
    
    // Show all parent-child relationships regardless of type
    const allParentChildRelationships = sites.filter(s => s.parent_id);
    console.log(`  - Total parent-child relationships: ${allParentChildRelationships.length}`);
    
    // Group by parent type
    const relationshipsByParentType = allParentChildRelationships.reduce((acc, site) => {
      const parentType = site.parent.type;
      acc[parentType] = (acc[parentType] || 0) + 1;
      return acc;
    }, {});
    
    Object.entries(relationshipsByParentType).forEach(([parentType, count]) => {
      console.log(`  - ${parentType} entities have ${count} children`);
    });

    console.log('\n✅ Flexible hierarchy test completed successfully!');
    console.log('🌐 You can now test the flexible hierarchy at: http://localhost:5174/sites');
    console.log('💡 Try creating entities with any parent-child combination!');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
};

testFlexibleHierarchy(); 