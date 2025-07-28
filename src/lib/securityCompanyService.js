import { supabase } from './supabaseClient';

// Security company service types and specializations
export const SERVICE_SPECIALIZATIONS = {
  'General Security': {
    description: 'Basic security services for various environments',
    requirements: ['Security License', 'Background Check', 'Basic Training'],
    icon: 'Shield'
  },
  'Event Security': {
    description: 'Specialized security for events and gatherings',
    requirements: ['Event Security Certification', 'Crowd Management Training', 'Emergency Response'],
    icon: 'Users'
  },
  'Corporate Security': {
    description: 'High-level security for corporate environments',
    requirements: ['Corporate Security Certification', 'Access Control Training', 'Executive Protection'],
    icon: 'Building'
  },
  'Healthcare Security': {
    description: 'Specialized security for healthcare facilities',
    requirements: ['Healthcare Security Certification', 'HIPAA Training', 'Medical Emergency Response'],
    icon: 'Heart'
  },
  'Retail Security': {
    description: 'Loss prevention and retail security services',
    requirements: ['Retail Security Certification', 'Loss Prevention Training', 'Customer Service'],
    icon: 'ShoppingBag'
  },
  'Industrial Security': {
    description: 'Security for industrial and manufacturing facilities',
    requirements: ['Industrial Security Certification', 'Safety Training', 'Hazmat Awareness'],
    icon: 'Factory'
  }
};

// Tier system configuration
export const TIER_SYSTEM = {
  1: {
    name: 'Tier 1 - Primary',
    description: 'Premium security companies with highest standards and capabilities',
    color: 'bg-gradient-to-r from-blue-600 to-purple-600',
    textColor: 'text-blue-400',
    badgeColor: 'bg-blue-500/20 text-blue-400',
    requirements: [
      'Minimum 5 years operational experience',
      'ISO 9001 certification',
      'Comprehensive insurance coverage ($5M+)',
      'Advanced training programs',
      '24/7 support capabilities',
      'Multi-site management experience'
    ],
    benefits: [
      'Priority assignment to high-value contracts',
      'Exclusive access to premium sites',
      'Reduced vetting requirements',
      'Direct client communication',
      'Performance bonus eligibility'
    ]
  },
  2: {
    name: 'Tier 2 - Standard',
    description: 'Established security companies with proven track record',
    color: 'bg-gradient-to-r from-green-600 to-teal-600',
    textColor: 'text-green-400',
    badgeColor: 'bg-green-500/20 text-green-400',
    requirements: [
      'Minimum 2 years operational experience',
      'State security license',
      'Basic insurance coverage ($1M+)',
      'Standard training programs',
      'Business hours support',
      'Single-site management capability'
    ],
    benefits: [
      'Standard contract assignments',
      'Regular site access',
      'Standard vetting process',
      'Supervised client communication',
      'Standard performance metrics'
    ]
  },
  3: {
    name: 'Tier 3 - Development',
    description: 'New or developing security companies building capabilities',
    color: 'bg-gradient-to-r from-orange-600 to-red-600',
    textColor: 'text-orange-400',
    badgeColor: 'bg-orange-500/20 text-orange-400',
    requirements: [
      'Valid security license',
      'Basic insurance coverage ($500K+)',
      'Fundamental training programs',
      'Limited support hours',
      'Single-site focus'
    ],
    benefits: [
      'Limited contract assignments',
      'Restricted site access',
      'Enhanced monitoring',
      'Supervised operations',
      'Development-focused metrics'
    ]
  }
};

// Create security company
export const createSecurityCompany = async (securityCompanyData) => {
  try {
    // Add client_id if provided
    const dataToInsert = {
      ...securityCompanyData,
      client_id: securityCompanyData.client_id || null
    };

    const { data, error } = await supabase
      .from('subcontractor_profiles')
      .insert([dataToInsert])
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error creating security company:', error);
    return { data: null, error };
  }
};

// Get all security companies
export const getSecurityCompanies = async () => {
  try {
    const { data, error } = await supabase
      .from('subcontractor_profiles')
      .select(`
        *,
        sites_assigned:subcontractor_sites(count)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      if (error.code === '42501') {
        console.error('RLS Policy Error: User not authenticated or missing permissions');
        return { 
          data: null, 
          error: { 
            message: 'Authentication required. Please log in or contact administrator to disable RLS for development.' 
          } 
        };
      }
      throw error;
    }
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching security companies:', error);
    return { data: null, error };
  }
};

// Get security company by ID
export const getSecurityCompanyById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('subcontractor_profiles')
      .select(`
        *,
        sites_assigned:subcontractor_sites(
          id,
          site_id,
          assigned_workers,
          start_date,
          end_date,
          status,
          sites(name, type, address)
        ),
        incidents:subcontractor_incidents(
          id,
          incident_type,
          description,
          date_occurred,
          severity,
          status
        ),
        performance_logs:subcontractor_performance_logs(
          id,
          rating,
          notes,
          date_logged,
          logged_by
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching security company:', error);
    return { data: null, error };
  }
};

// Update security company
export const updateSecurityCompany = async (id, updates) => {
  try {
    // Add client_id if provided
    const dataToUpdate = {
      ...updates,
      client_id: updates.client_id || null
    };

    const { data, error } = await supabase
      .from('subcontractor_profiles')
      .update(dataToUpdate)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error updating security company:', error);
    return { data: null, error };
  }
};

// Delete security company
export const deleteSecurityCompany = async (id) => {
  try {
    const { error } = await supabase
      .from('subcontractor_profiles')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error deleting security company:', error);
    return { error };
  }
};

// Search security companies
export const searchSecurityCompanies = async (searchTerm) => {
  try {
    const { data, error } = await supabase
      .from('subcontractor_profiles')
      .select('*')
      .or(`company_name.ilike.%${searchTerm}%,contact_person.ilike.%${searchTerm}%,service_specialization.ilike.%${searchTerm}%`)
      .order('company_name');

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error searching security companies:', error);
    return { data: null, error };
  }
};

// Get security companies by status
export const getSecurityCompaniesByStatus = async (status) => {
  try {
    const { data, error } = await supabase
      .from('subcontractor_profiles')
      .select('*')
      .eq('status', status)
      .order('company_name');

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching security companies by status:', error);
    return { data: null, error };
  }
};

// Get security companies by vetting status
export const getSecurityCompaniesByVettingStatus = async (vettingStatus) => {
  try {
    const { data, error } = await supabase
      .from('subcontractor_profiles')
      .select('*')
      .eq('vetting_status', vettingStatus)
      .order('company_name');

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching security companies by vetting status:', error);
    return { data: null, error };
  }
};

// Get security companies by tier
export const getSecurityCompaniesByTier = async (tier) => {
  try {
    const { data, error } = await supabase
      .from('subcontractor_profiles')
      .select('*')
      .eq('tier', tier)
      .order('company_name');

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching security companies by tier:', error);
    return { data: null, error };
  }
};

// Get security company statistics
export const getSecurityCompanyStats = async () => {
  try {
    // Get total count
    const { count: total, error: countError } = await supabase
      .from('subcontractor_profiles')
      .select('*', { count: 'exact', head: true });

    if (countError) throw countError;

    // Get by status
    const { data: byStatus, error: statusError } = await supabase
      .from('subcontractor_profiles')
      .select('status');

    if (statusError) throw statusError;

    // Get by vetting status
    const { data: byVettingStatus, error: vettingError } = await supabase
      .from('subcontractor_profiles')
      .select('vetting_status');

    if (vettingError) throw vettingError;

    // Get by tier
    const { data: byTier, error: tierError } = await supabase
      .from('subcontractor_profiles')
      .select('tier');

    if (tierError) throw tierError;

    // Calculate stats
    const statusCounts = byStatus.reduce((acc, item) => {
      acc[item.status] = (acc[item.status] || 0) + 1;
      return acc;
    }, {});

    const vettingCounts = byVettingStatus.reduce((acc, item) => {
      acc[item.vetting_status] = (acc[item.vetting_status] || 0) + 1;
      return acc;
    }, {});

    const tierCounts = byTier.reduce((acc, item) => {
      acc[item.tier] = (acc[item.tier] || 0) + 1;
      return acc;
    }, {});

    // Get top performers (rating >= 4.0)
    const { count: topPerformers, error: topError } = await supabase
      .from('subcontractor_profiles')
      .select('*', { count: 'exact', head: true })
      .gte('performance_rating', 4.0);

    if (topError) throw topError;

    return {
      data: {
        total,
        byStatus: statusCounts,
        byVettingStatus: vettingCounts,
        byTier: tierCounts,
        topPerformers
      },
      error: null
    };
  } catch (error) {
    console.error('Error fetching security company stats:', error);
    return { data: null, error };
  }
};

// Assign security company to site
export const assignSecurityCompanyToSite = async (securityCompanyId, siteId, assignmentData) => {
  try {
    const { data, error } = await supabase
      .from('subcontractor_sites')
      .insert([{
        subcontractor_id: securityCompanyId,
        site_id: siteId,
        ...assignmentData
      }])
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error assigning security company to site:', error);
    return { data: null, error };
  }
};

// Remove security company from site
export const removeSecurityCompanyFromSite = async (securityCompanyId, siteId) => {
  try {
    const { error } = await supabase
      .from('subcontractor_sites')
      .delete()
      .eq('subcontractor_id', securityCompanyId)
      .eq('site_id', siteId);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error removing security company from site:', error);
    return { error };
  }
};

// Get security company incidents
export const getSecurityCompanyIncidents = async (securityCompanyId) => {
  try {
    const { data, error } = await supabase
      .from('subcontractor_incidents')
      .select('*')
      .eq('subcontractor_id', securityCompanyId)
      .order('date_occurred', { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching security company incidents:', error);
    return { data: null, error };
  }
};

// Create security company incident
export const createSecurityCompanyIncident = async (incidentData) => {
  try {
    const { data, error } = await supabase
      .from('subcontractor_incidents')
      .insert([incidentData])
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error creating security company incident:', error);
    return { data: null, error };
  }
};

// Get security company performance logs
export const getSecurityCompanyPerformanceLogs = async (securityCompanyId, startDate = null, endDate = null) => {
  try {
    let query = supabase
      .from('subcontractor_performance_logs')
      .select('*')
      .eq('subcontractor_id', securityCompanyId)
      .order('date_logged', { ascending: false });

    if (startDate) {
      query = query.gte('date_logged', startDate);
    }
    if (endDate) {
      query = query.lte('date_logged', endDate);
    }

    const { data, error } = await query;

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching security company performance logs:', error);
    return { data: null, error };
  }
};

// Create security company performance log
export const createSecurityCompanyPerformanceLog = async (performanceData) => {
  try {
    const { data, error } = await supabase
      .from('subcontractor_performance_logs')
      .insert([performanceData])
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error creating security company performance log:', error);
    return { data: null, error };
  }
};

// Initialize sample security company data
export const initializeSecurityCompanyData = async () => {
  const sampleData = [
    {
      company_name: 'Metro Security Services',
      contact_person: 'John Smith',
      contact_email: 'john@metrosecurity.com',
      contact_phone: '(555) 123-4567',
      service_specialization: 'General Security',
      status: 'Active',
      vetting_status: 'Approved',
      tier: 1,
      client_id: 1, // Acme Corporation
      performance_rating: 4.5,
      address: {
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        zip: '10001'
      },
      insurance_info: {
        provider: 'Security Insurance Co',
        policy_number: 'SEC-2024-001',
        coverage_amount: 1000000,
        expiry_date: '2024-12-31'
      },
      certifications: ['State Security License', 'CPR Certification', 'First Aid Training'],
      notes: 'Reliable security provider with excellent track record'
    },
    {
      company_name: 'Elite Corporate Protection',
      contact_person: 'Sarah Johnson',
      contact_email: 'sarah@elitecorp.com',
      contact_phone: '(555) 234-5678',
      service_specialization: 'Corporate Security',
      status: 'Active',
      vetting_status: 'Approved',
      tier: 1,
      client_id: 6, // Financial Services Ltd
      performance_rating: 4.8,
      address: {
        street: '456 Business Ave',
        city: 'Los Angeles',
        state: 'CA',
        zip: '90210'
      },
      insurance_info: {
        provider: 'Corporate Insurance Group',
        policy_number: 'CORP-2024-002',
        coverage_amount: 2000000,
        expiry_date: '2024-11-30'
      },
      certifications: ['Corporate Security License', 'Executive Protection Training', 'Advanced Threat Assessment'],
      notes: 'Specialized in high-profile corporate security'
    },
    {
      company_name: 'EventGuard Solutions',
      contact_person: 'Mike Davis',
      contact_email: 'mike@eventguard.com',
      contact_phone: '(555) 345-6789',
      service_specialization: 'Event Security',
      status: 'Pending Review',
      vetting_status: 'In Progress',
      tier: 2,
      client_id: 3, // Metro Healthcare Systems
      performance_rating: 4.2,
      address: {
        street: '789 Event Blvd',
        city: 'Chicago',
        state: 'IL',
        zip: '60601'
      },
      insurance_info: {
        provider: 'Event Insurance Partners',
        policy_number: 'EVENT-2024-003',
        coverage_amount: 1500000,
        expiry_date: '2024-10-31'
      },
      certifications: ['Event Security License', 'Crowd Management', 'Emergency Response'],
      notes: 'Specialized in large-scale event security'
    }
  ];

  try {
    const { data, error } = await supabase
      .from('subcontractor_profiles')
      .insert(sampleData)
      .select();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error initializing security company data:', error);
    return { data: null, error };
  }
}; 