import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  console.error('Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in your .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const sampleClients = [
  {
    name: 'Acme Corporation',
    contact_person: 'John Smith',
    email: 'john.smith@acme.com',
    phone: '(555) 123-4567',
    industry: 'Technology',
    status: 'Active',
    address: {
      street: '123 Business Ave',
      city: 'New York',
      state: 'NY',
      zip: '10001'
    }
  },
  {
    name: 'Global Manufacturing Inc',
    contact_person: 'Sarah Johnson',
    email: 'sarah.johnson@globalmfg.com',
    phone: '(555) 234-5678',
    industry: 'Manufacturing',
    status: 'Active',
    address: {
      street: '456 Industrial Blvd',
      city: 'Chicago',
      state: 'IL',
      zip: '60601'
    }
  },
  {
    name: 'Metro Healthcare Systems',
    contact_person: 'Dr. Michael Chen',
    email: 'michael.chen@metrohealth.com',
    phone: '(555) 345-6789',
    industry: 'Healthcare',
    status: 'Active',
    address: {
      street: '789 Medical Center Dr',
      city: 'Los Angeles',
      state: 'CA',
      zip: '90210'
    }
  },
  {
    name: 'Premier Retail Group',
    contact_person: 'Lisa Martinez',
    email: 'lisa.martinez@premierretail.com',
    phone: '(555) 456-7890',
    industry: 'Retail',
    status: 'Active',
    address: {
      street: '321 Shopping Plaza',
      city: 'Miami',
      state: 'FL',
      zip: '33101'
    }
  },
  {
    name: 'Energy Solutions Corp',
    contact_person: 'Robert Wilson',
    email: 'robert.wilson@energysolutions.com',
    phone: '(555) 567-8901',
    industry: 'Energy',
    status: 'Active',
    address: {
      street: '654 Power Plant Rd',
      city: 'Houston',
      state: 'TX',
      zip: '77001'
    }
  },
  {
    name: 'Financial Services Ltd',
    contact_person: 'Jennifer Davis',
    email: 'jennifer.davis@financialservices.com',
    phone: '(555) 678-9012',
    industry: 'Finance',
    status: 'Active',
    address: {
      street: '987 Banking St',
      city: 'Boston',
      state: 'MA',
      zip: '02101'
    }
  }
];

async function setupClients() {
  console.log('🚀 Setting up clients data...');
  
  try {
    // Check if clients table exists and has data
    const { data: existingClients, error: checkError } = await supabase
      .from('clients')
      .select('id')
      .limit(1);

    if (checkError) {
      console.error('❌ Error checking clients table:', checkError);
      console.log('Please ensure the clients table has been created using create-clients-table.sql');
      return;
    }

    if (existingClients && existingClients.length > 0) {
      console.log('✅ Clients table already has data, skipping setup');
      return;
    }

    // Insert sample clients
    const { data, error } = await supabase
      .from('clients')
      .insert(sampleClients)
      .select();

    if (error) {
      console.error('❌ Error inserting clients:', error);
      return;
    }

    console.log(`✅ Successfully created ${data.length} clients:`);
    data.forEach(client => {
      console.log(`   - ${client.name} (${client.industry})`);
    });

    console.log('\n📊 Client Statistics:');
    console.log(`   Total Clients: ${data.length}`);
    
    const industries = [...new Set(data.map(client => client.industry))];
    console.log(`   Industries: ${industries.join(', ')}`);

    console.log('\n🎉 Client setup complete!');
    console.log('\nNext steps:');
    console.log('1. Navigate to the Security Companies page in your application');
    console.log('2. Try adding a new security company and selecting a client from the dropdown');
    console.log('3. View existing security companies to see client assignments');

  } catch (error) {
    console.error('❌ Unexpected error during client setup:', error);
  }
}

// Run the setup
setupClients()
  .then(() => {
    console.log('\n🎉 Client setup complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  }); 