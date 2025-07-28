const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables. Please check your .env.local file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const sampleSecurityCompanies = [
  {
    company_name: 'Alpha Security Services',
    contact_person: 'Michael Rodriguez',
    contact_email: 'michael.rodriguez@alphasecurity.com',
    contact_phone: '(555) 123-4567',
    service_specialization: 'Corporate Security',
    status: 'Active',
    vetting_status: 'Approved',
    tier: 1,
    client_id: 1, // Acme Corporation
    insurance_coverage: {
      general_liability: 2000000,
      workers_comp: 1000000,
      professional_liability: 500000
    },
    certifications: ['Corporate Security Certified', 'Executive Protection', 'Access Control'],
    address: {
      street: '123 Business Ave',
      city: 'New York',
      state: 'NY',
      zip: '10001'
    },
    contract_start_date: '2024-01-15',
    contract_end_date: '2024-12-31',
    hourly_rate: 45.00,
    max_workers: 25,
    current_workers: 18,
    performance_rating: 4.5,
    total_incidents: 2,
    resolved_incidents: 2,
    notes: 'Excellent corporate security provider with strong executive protection capabilities.'
  },
  {
    company_name: 'Guardian Event Security',
    contact_person: 'Sarah Johnson',
    contact_email: 'sarah.johnson@guardianevents.com',
    contact_phone: '(555) 234-5678',
    service_specialization: 'Event Security',
    status: 'Active',
    vetting_status: 'Approved',
    tier: 1,
    client_id: 6, // Financial Services Ltd
    insurance_coverage: {
      general_liability: 3000000,
      workers_comp: 1500000,
      event_liability: 2000000
    },
    certifications: ['Event Security Certified', 'Crowd Management', 'Emergency Response'],
    address: {
      street: '456 Event Plaza',
      city: 'Los Angeles',
      state: 'CA',
      zip: '90210'
    },
    contract_start_date: '2024-02-01',
    contract_end_date: '2024-11-30',
    hourly_rate: 35.00,
    max_workers: 50,
    current_workers: 35,
    performance_rating: 4.2,
    total_incidents: 1,
    resolved_incidents: 1,
    notes: 'Specialized in large-scale events and crowd management.'
  },
  {
    company_name: 'MediGuard Healthcare Security',
    contact_person: 'Dr. Jennifer Chen',
    contact_email: 'jennifer.chen@mediguard.com',
    contact_phone: '(555) 345-6789',
    service_specialization: 'Healthcare Security',
    status: 'Active',
    vetting_status: 'Approved',
    tier: 2,
    client_id: 3, // Metro Healthcare Systems
    insurance_coverage: {
      general_liability: 2500000,
      workers_comp: 1200000,
      medical_malpractice: 1000000
    },
    certifications: ['Healthcare Security Certified', 'HIPAA Compliance', 'Medical Emergency Response'],
    address: {
      street: '789 Medical Center Dr',
      city: 'Chicago',
      state: 'IL',
      zip: '60601'
    },
    contract_start_date: '2024-01-01',
    contract_end_date: '2024-12-31',
    hourly_rate: 40.00,
    max_workers: 30,
    current_workers: 22,
    performance_rating: 4.8,
    total_incidents: 0,
    resolved_incidents: 0,
    notes: 'Specialized healthcare security with excellent patient safety record.'
  },
  {
    company_name: 'RetailShield Loss Prevention',
    contact_person: 'David Thompson',
    contact_email: 'david.thompson@retailshield.com',
    contact_phone: '(555) 456-7890',
    service_specialization: 'Retail Security',
    status: 'Active',
    vetting_status: 'Approved',
    tier: 2,
    client_id: 4, // Premier Retail Group
    insurance_coverage: {
      general_liability: 1500000,
      workers_comp: 800000,
      theft_liability: 500000
    },
    certifications: ['Retail Security Certified', 'Loss Prevention', 'Customer Service'],
    address: {
      street: '321 Retail Blvd',
      city: 'Miami',
      state: 'FL',
      zip: '33101'
    },
    contract_start_date: '2024-03-01',
    contract_end_date: '2024-08-31',
    hourly_rate: 28.00,
    max_workers: 40,
    current_workers: 28,
    performance_rating: 4.0,
    total_incidents: 3,
    resolved_incidents: 3,
    notes: 'Specialized in retail loss prevention and customer service.'
  },
  {
    company_name: 'Industrial Safety Solutions',
    contact_person: 'Robert Wilson',
    contact_email: 'robert.wilson@industrialsafety.com',
    contact_phone: '(555) 567-8901',
    service_specialization: 'Industrial Security',
    status: 'Active',
    vetting_status: 'Approved',
    tier: 3,
    client_id: 2, // Global Manufacturing Inc
    insurance_coverage: {
      general_liability: 5000000,
      workers_comp: 2000000,
      environmental_liability: 1000000
    },
    certifications: ['Industrial Security Certified', 'Safety Training', 'Hazmat Awareness'],
    address: {
      street: '654 Industrial Park Rd',
      city: 'Houston',
      state: 'TX',
      zip: '77001'
    },
    contract_start_date: '2024-01-01',
    contract_end_date: '2024-12-31',
    hourly_rate: 42.00,
    max_workers: 35,
    current_workers: 25,
    performance_rating: 4.3,
    total_incidents: 1,
    resolved_incidents: 1,
    notes: 'Specialized in industrial and manufacturing facility security.'
  },
  {
    company_name: 'Premier Security Group',
    contact_person: 'Lisa Martinez',
    contact_email: 'lisa.martinez@premiersecurity.com',
    contact_phone: '(555) 678-9012',
    service_specialization: 'General Security',
    status: 'Pending Review',
    vetting_status: 'In Progress',
    tier: 3,
    client_id: 5, // Energy Solutions Corp
    insurance_coverage: {
      general_liability: 1000000,
      workers_comp: 500000
    },
    certifications: ['Security License', 'Basic Training'],
    address: {
      street: '987 Security Way',
      city: 'Phoenix',
      state: 'AZ',
      zip: '85001'
    },
    contract_start_date: '2024-04-01',
    contract_end_date: '2024-09-30',
    hourly_rate: 25.00,
    max_workers: 20,
    current_workers: 0,
    performance_rating: 0.0,
    total_incidents: 0,
    resolved_incidents: 0,
          notes: 'New security company under review process.'
  }
];

async function setupSecurityCompanies() {
  console.log('🚀 Setting up security company data...');

  try {
    // Check if security companies already exist
    const { data: existingSecurityCompanies, error: checkError } = await supabase
      .from('subcontractor_profiles')
      .select('id')
      .limit(1);

    if (checkError) {
      console.error('❌ Error checking existing security companies:', checkError);
      return;
    }

    if (existingSecurityCompanies && existingSecurityCompanies.length > 0) {
      console.log('⚠️  Security companies already exist. Skipping initialization.');
      return;
    }

    // Insert sample security companies
    const { data, error } = await supabase
      .from('subcontractor_profiles')
      .insert(sampleSecurityCompanies)
      .select();

    if (error) {
      console.error('❌ Error inserting security companies:', error);
      return;
    }

    console.log(`✅ Successfully created ${data.length} security companies:`);
    data.forEach(sc => {
      console.log(`   - ${sc.company_name} (${sc.service_specialization})`);
    });

    console.log('\n📊 Security Company Statistics:');
    console.log(`   Total Security Companies: ${data.length}`);
    console.log(`   Active: ${data.filter(sc => sc.status === 'Active').length}`);
    console.log(`   Pending Review: ${data.filter(sc => sc.status === 'Pending Review').length}`);
    console.log(`   Approved Vetting: ${data.filter(sc => sc.vetting_status === 'Approved').length}`);

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

// Run the setup
setupSecurityCompanies()
  .then(() => {
    console.log('\n🎉 Security company setup complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  }); 