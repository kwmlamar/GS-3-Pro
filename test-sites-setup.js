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

const testSitesSetup = async () => {
  try {
    console.log('🔍 Testing database connection...');

    // Test 1: Check if sites table exists by trying to query it
    const { data: sitesTest, error: sitesError } = await supabase
      .from('sites')
      .select('count')
      .limit(1);

    if (sitesError) {
      console.log('📝 Sites table does not exist, creating it...');
      
      // Try to insert a test record to see if table exists
      const { data: testInsert, error: insertError } = await supabase
        .from('sites')
        .insert({
          name: 'Test Site',
          type: 'site',
          description: 'Test site for setup verification'
        })
        .select();

      if (insertError) {
        console.log('❌ Sites table does not exist and cannot be created automatically');
        console.log('💡 You may need to create the table manually in your Supabase dashboard');
        console.log('📋 Here is the SQL to create the sites table:');
        console.log(`
CREATE TABLE IF NOT EXISTS sites (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('site', 'region', 'national', 'global', 'special_activity')),
  parent_id BIGINT REFERENCES sites(id) ON DELETE SET NULL,
  client_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
  address JSONB DEFAULT '{}',
  gps_coordinates JSONB DEFAULT '{}',
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'maintenance')),
  description TEXT,
  contact_person VARCHAR(255),
  contact_email VARCHAR(255),
  contact_phone VARCHAR(50),
  security_level VARCHAR(50) DEFAULT 'standard' CHECK (security_level IN ('standard', 'enhanced', 'high', 'maximum')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
        `);
        return;
      } else {
        console.log('✅ Sites table exists and is accessible');
        // Clean up test record
        await supabase.from('sites').delete().eq('name', 'Test Site');
      }
    } else {
      console.log('✅ Sites table already exists');
    }

    // Test 2: Insert a simple test record
    console.log('🧪 Testing site insertion...');
    
    const { data: testSite, error: testError } = await supabase
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

    if (testError) {
      console.error('❌ Test site insertion failed:', testError);
    } else {
      console.log('✅ Test site inserted successfully:', testSite.name);
      
      // Clean up test record
      await supabase.from('sites').delete().eq('id', testSite.id);
      console.log('🧹 Test record cleaned up');
    }

    // Test 3: Check existing sites
    const { data: existingSites, error: fetchError } = await supabase
      .from('sites')
      .select('*');

    if (fetchError) {
      console.error('❌ Error fetching sites:', fetchError);
    } else {
      console.log(`📊 Found ${existingSites?.length || 0} existing sites`);
      
      if (existingSites && existingSites.length > 0) {
        const sitesByType = existingSites.reduce((acc, site) => {
          acc[site.type] = (acc[site.type] || 0) + 1;
          return acc;
        }, {});
        
        console.log('📈 Current hierarchy structure:');
        Object.entries(sitesByType).forEach(([type, count]) => {
          console.log(`  - ${count} ${type} sites`);
        });
      }
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
};

testSitesSetup(); 