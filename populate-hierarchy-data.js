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

const populateHierarchyData = async () => {
  try {
    console.log('🚀 Populating hierarchy data...');

    // Check if sites table exists
    const { data: existingSites, error: checkError } = await supabase
      .from('sites')
      .select('count')
      .limit(1);

    if (checkError) {
      console.error('❌ Sites table does not exist. Please create it first using the SQL in HIERARCHY_SETUP.md');
      return;
    }

    console.log('✅ Sites table found');

    // Check if data already exists
    const { data: sites, error: fetchError } = await supabase
      .from('sites')
      .select('*');

    if (fetchError) {
      console.error('❌ Error fetching sites:', fetchError);
      return;
    }

    if (sites && sites.length > 0) {
      console.log(`📊 Found ${sites.length} existing sites`);
      
      const sitesByType = sites.reduce((acc, site) => {
        acc[site.type] = (acc[site.type] || 0) + 1;
        return acc;
      }, {});
      
      console.log('📈 Current hierarchy structure:');
      Object.entries(sitesByType).forEach(([type, count]) => {
        console.log(`  - ${count} ${type} sites`);
      });
      
      console.log('✅ Hierarchy data already exists. No need to populate.');
      return;
    }

    console.log('📝 No existing data found. Creating sample hierarchy...');

    // Insert Global site
    const { data: globalSite, error: globalError } = await supabase
      .from('sites')
      .insert({
        name: 'GS-3 Global Operations',
        type: 'global',
        description: 'Global headquarters and operations center for GS-3 SecureOps Pro',
        security_level: 'maximum',
        contact_person: 'Michael Grant',
        contact_email: 'michael.grant@gs-3.com',
        contact_phone: '+1-555-0001'
      })
      .select()
      .single();

    if (globalError) {
      console.error('❌ Error creating global site:', globalError);
      return;
    }

    console.log('✅ Created global site');

    // Insert National sites
    const nationalSites = [
      {
        name: 'GS-3 North America',
        type: 'national',
        parent_id: globalSite.id,
        description: 'North American operations and regional headquarters',
        security_level: 'high',
        contact_person: 'Sarah Johnson',
        contact_email: 'sarah.johnson@gs-3.com',
        contact_phone: '+1-555-0002'
      },
      {
        name: 'GS-3 Europe',
        type: 'national',
        parent_id: globalSite.id,
        description: 'European operations and regional headquarters',
        security_level: 'high',
        contact_person: 'David Wilson',
        contact_email: 'david.wilson@gs-3.com',
        contact_phone: '+1-555-0003'
      },
      {
        name: 'GS-3 Asia Pacific',
        type: 'national',
        parent_id: globalSite.id,
        description: 'Asia Pacific operations and regional headquarters',
        security_level: 'high',
        contact_person: 'Lisa Chen',
        contact_email: 'lisa.chen@gs-3.com',
        contact_phone: '+1-555-0004'
      }
    ];

    for (const site of nationalSites) {
      try {
        await supabase.from('sites').insert(site);
        console.log(`✅ Created national site: ${site.name}`);
      } catch (error) {
        console.error(`❌ Error creating ${site.name}:`, error.message);
      }
    }

    // Get national site IDs
    const { data: nationalSitesData } = await supabase
      .from('sites')
      .select('id, name')
      .eq('type', 'national');

    const nationalSitesMap = {};
    nationalSitesData?.forEach(site => {
      nationalSitesMap[site.name] = site.id;
    });

    // Insert Regional sites
    const regionalSites = [
      {
        name: 'Northeast Region',
        type: 'region',
        parent_id: nationalSitesMap['GS-3 North America'],
        description: 'Northeast regional operations covering NY, NJ, CT, MA',
        security_level: 'enhanced',
        contact_person: 'Robert Martinez',
        contact_email: 'robert.martinez@gs-3.com',
        contact_phone: '+1-555-0005',
        address: { street: '123 Security Plaza', city: 'New York', state: 'NY', zip: '10001', country: 'USA' },
        gps_coordinates: { latitude: 40.7128, longitude: -74.0060 }
      },
      {
        name: 'Southeast Region',
        type: 'region',
        parent_id: nationalSitesMap['GS-3 North America'],
        description: 'Southeast regional operations covering FL, GA, NC, SC',
        security_level: 'enhanced',
        contact_person: 'Jennifer Davis',
        contact_email: 'jennifer.davis@gs-3.com',
        contact_phone: '+1-555-0006',
        address: { street: '456 Safety Drive', city: 'Miami', state: 'FL', zip: '33101', country: 'USA' },
        gps_coordinates: { latitude: 25.7617, longitude: -80.1918 }
      },
      {
        name: 'Western Region',
        type: 'region',
        parent_id: nationalSitesMap['GS-3 North America'],
        description: 'Western regional operations covering CA, OR, WA',
        security_level: 'enhanced',
        contact_person: 'Thomas Anderson',
        contact_email: 'thomas.anderson@gs-3.com',
        contact_phone: '+1-555-0007',
        address: { street: '789 Protection Way', city: 'Los Angeles', state: 'CA', zip: '90210', country: 'USA' },
        gps_coordinates: { latitude: 34.0522, longitude: -118.2437 }
      },
      {
        name: 'Central Europe',
        type: 'region',
        parent_id: nationalSitesMap['GS-3 Europe'],
        description: 'Central European operations covering Germany, France, Switzerland',
        security_level: 'enhanced',
        contact_person: 'Hans Mueller',
        contact_email: 'hans.mueller@gs-3.com',
        contact_phone: '+1-555-0008',
        address: { street: '321 Sicherheit Strasse', city: 'Berlin', state: 'Berlin', zip: '10115', country: 'Germany' },
        gps_coordinates: { latitude: 52.5200, longitude: 13.4050 }
      },
      {
        name: 'Northern Europe',
        type: 'region',
        parent_id: nationalSitesMap['GS-3 Europe'],
        description: 'Northern European operations covering UK, Netherlands, Scandinavia',
        security_level: 'enhanced',
        contact_person: 'Emma Thompson',
        contact_email: 'emma.thompson@gs-3.com',
        contact_phone: '+1-555-0009',
        address: { street: '654 Security Lane', city: 'London', state: 'England', zip: 'SW1A 1AA', country: 'UK' },
        gps_coordinates: { latitude: 51.5074, longitude: -0.1278 }
      },
      {
        name: 'East Asia',
        type: 'region',
        parent_id: nationalSitesMap['GS-3 Asia Pacific'],
        description: 'East Asian operations covering Japan, South Korea, Taiwan',
        security_level: 'enhanced',
        contact_person: 'Yuki Tanaka',
        contact_email: 'yuki.tanaka@gs-3.com',
        contact_phone: '+1-555-0010',
        address: { street: '987 Anzen Street', city: 'Tokyo', state: 'Tokyo', zip: '100-0001', country: 'Japan' },
        gps_coordinates: { latitude: 35.6762, longitude: 139.6503 }
      }
    ];

    for (const site of regionalSites) {
      try {
        await supabase.from('sites').insert(site);
        console.log(`✅ Created regional site: ${site.name}`);
      } catch (error) {
        console.error(`❌ Error creating ${site.name}:`, error.message);
      }
    }

    // Get regional site IDs
    const { data: regionalSitesData } = await supabase
      .from('sites')
      .select('id, name')
      .eq('type', 'region');

    const regionalSitesMap = {};
    regionalSitesData?.forEach(site => {
      regionalSitesMap[site.name] = site.id;
    });

    // Insert Individual sites
    const individualSites = [
      {
        name: 'Corporate HQ Alpha',
        type: 'site',
        parent_id: regionalSitesMap['Northeast Region'],
        description: 'Main corporate headquarters with executive protection services',
        security_level: 'maximum',
        contact_person: 'Alex Rodriguez',
        contact_email: 'alex.rodriguez@gs-3.com',
        contact_phone: '+1-555-0011',
        address: { street: '1000 Executive Blvd', city: 'New York', state: 'NY', zip: '10001', country: 'USA' },
        gps_coordinates: { latitude: 40.7589, longitude: -73.9851 }
      },
      {
        name: 'Metro Hospital East',
        type: 'site',
        parent_id: regionalSitesMap['Northeast Region'],
        description: 'Healthcare facility security with specialized medical protocols',
        security_level: 'high',
        contact_person: 'Maria Garcia',
        contact_email: 'maria.garcia@gs-3.com',
        contact_phone: '+1-555-0012',
        address: { street: '500 Medical Center Dr', city: 'Boston', state: 'MA', zip: '02115', country: 'USA' },
        gps_coordinates: { latitude: 42.3601, longitude: -71.0589 }
      },
      {
        name: 'Miami Beach Resort',
        type: 'site',
        parent_id: regionalSitesMap['Southeast Region'],
        description: 'Luxury resort security with VIP guest protection',
        security_level: 'enhanced',
        contact_person: 'Carlos Mendez',
        contact_email: 'carlos.mendez@gs-3.com',
        contact_phone: '+1-555-0014',
        address: { street: '300 Ocean Drive', city: 'Miami Beach', state: 'FL', zip: '33139', country: 'USA' },
        gps_coordinates: { latitude: 25.7907, longitude: -80.1300 }
      },
      {
        name: 'Silicon Valley Tech Campus',
        type: 'site',
        parent_id: regionalSitesMap['Western Region'],
        description: 'Technology campus with intellectual property protection',
        security_level: 'maximum',
        contact_person: 'Kevin Chang',
        contact_email: 'kevin.chang@gs-3.com',
        contact_phone: '+1-555-0016',
        address: { street: '1500 Innovation Ave', city: 'Palo Alto', state: 'CA', zip: '94301', country: 'USA' },
        gps_coordinates: { latitude: 37.4419, longitude: -122.1430 }
      },
      {
        name: 'Berlin Government Complex',
        type: 'site',
        parent_id: regionalSitesMap['Central Europe'],
        description: 'Government facility with diplomatic security protocols',
        security_level: 'maximum',
        contact_person: 'Klaus Weber',
        contact_email: 'klaus.weber@gs-3.com',
        contact_phone: '+1-555-0018',
        address: { street: '100 Regierungsstrasse', city: 'Berlin', state: 'Berlin', zip: '10117', country: 'Germany' },
        gps_coordinates: { latitude: 52.5200, longitude: 13.4050 }
      },
      {
        name: 'Tokyo Corporate Tower',
        type: 'site',
        parent_id: regionalSitesMap['East Asia'],
        description: 'Modern corporate tower with advanced surveillance systems',
        security_level: 'high',
        contact_person: 'Hiroshi Yamamoto',
        contact_email: 'hiroshi.yamamoto@gs-3.com',
        contact_phone: '+1-555-0021',
        address: { street: '1000 Shibuya Crossing', city: 'Tokyo', state: 'Tokyo', zip: '150-0002', country: 'Japan' },
        gps_coordinates: { latitude: 35.6762, longitude: 139.6503 }
      }
    ];

    for (const site of individualSites) {
      try {
        await supabase.from('sites').insert(site);
        console.log(`✅ Created individual site: ${site.name}`);
      } catch (error) {
        console.error(`❌ Error creating ${site.name}:`, error.message);
      }
    }

    // Insert Special Activity sites
    const specialActivitySites = [
      {
        name: 'Major Sporting Event',
        type: 'special_activity',
        parent_id: regionalSitesMap['Northeast Region'],
        description: 'Large-scale sporting event with crowd control and VIP protection',
        security_level: 'high',
        contact_person: 'Michael O\'Connor',
        contact_email: 'michael.oconnor@gs-3.com',
        contact_phone: '+1-555-0023',
        address: { venue: 'MetLife Stadium', city: 'East Rutherford', state: 'NJ', zip: '07073', country: 'USA' },
        gps_coordinates: { latitude: 40.8135, longitude: -74.0744 }
      },
      {
        name: 'International Conference',
        type: 'special_activity',
        parent_id: regionalSitesMap['Central Europe'],
        description: 'International business conference with diplomatic security',
        security_level: 'maximum',
        contact_person: 'Anna Schmidt',
        contact_email: 'anna.schmidt@gs-3.com',
        contact_phone: '+1-555-0024',
        address: { venue: 'Berlin Congress Center', city: 'Berlin', state: 'Berlin', zip: '10117', country: 'Germany' },
        gps_coordinates: { latitude: 52.5200, longitude: 13.4050 }
      }
    ];

    for (const site of specialActivitySites) {
      try {
        await supabase.from('sites').insert(site);
        console.log(`✅ Created special activity site: ${site.name}`);
      } catch (error) {
        console.error(`❌ Error creating ${site.name}:`, error.message);
      }
    }

    // Verify final data
    const { data: finalSites, error: finalError } = await supabase
      .from('sites')
      .select('*');

    if (finalError) {
      console.error('❌ Error counting final sites:', finalError);
    } else {
      console.log(`✅ Successfully created ${finalSites.length} sites in the hierarchy`);
      
      const sitesByType = finalSites.reduce((acc, site) => {
        acc[site.type] = (acc[site.type] || 0) + 1;
        return acc;
      }, {});
      
      console.log('📊 Final hierarchy structure:');
      Object.entries(sitesByType).forEach(([type, count]) => {
        console.log(`  - ${count} ${type} sites`);
      });
    }

    console.log('🎉 Hierarchy data population complete!');
    console.log('📱 You can now view the hierarchy at: http://localhost:5174/sites');

  } catch (error) {
    console.error('❌ Population failed:', error);
  }
};

populateHierarchyData(); 