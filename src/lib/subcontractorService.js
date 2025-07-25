import { supabase } from './supabaseClient';

// Subcontractor service types and specializations
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

// Create subcontractor
export const createSubcontractor = async (subcontractorData) => {
  try {
    const { data, error } = await supabase
      .from('subcontractor_profiles')
      .insert([subcontractorData])
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error creating subcontractor:', error);
    return { data: null, error };
  }
};

// Get all subcontractors
export const getSubcontractors = async () => {
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
    console.error('Error fetching subcontractors:', error);
    return { data: null, error };
  }
};

// Get subcontractor by ID
export const getSubcontractorById = async (id) => {
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
          severity,
          description,
          reported_date,
          resolved_date,
          status,
          sites(name)
        ),
        performance_logs:subcontractor_performance_logs(
          id,
          log_date,
          performance_score,
          attendance_rate,
          incident_count,
          client_satisfaction_rating,
          notes
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching subcontractor:', error);
    return { data: null, error };
  }
};

// Update subcontractor
export const updateSubcontractor = async (id, updates) => {
  try {
    const { data, error } = await supabase
      .from('subcontractor_profiles')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error updating subcontractor:', error);
    return { data: null, error };
  }
};

// Delete subcontractor
export const deleteSubcontractor = async (id) => {
  try {
    const { error } = await supabase
      .from('subcontractor_profiles')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error deleting subcontractor:', error);
    return { error };
  }
};

// Search subcontractors
export const searchSubcontractors = async (searchTerm) => {
  try {
    const { data, error } = await supabase
      .from('subcontractor_profiles')
      .select(`
        *,
        sites_assigned:subcontractor_sites(count)
      `)
      .or(`company_name.ilike.%${searchTerm}%,contact_person.ilike.%${searchTerm}%,service_specialization.ilike.%${searchTerm}%`)
      .order('company_name');

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error searching subcontractors:', error);
    return { data: null, error };
  }
};

// Get subcontractors by status
export const getSubcontractorsByStatus = async (status) => {
  try {
    const { data, error } = await supabase
      .from('subcontractor_profiles')
      .select(`
        *,
        sites_assigned:subcontractor_sites(count)
      `)
      .eq('status', status)
      .order('company_name');

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching subcontractors by status:', error);
    return { data: null, error };
  }
};

// Get subcontractors by vetting status
export const getSubcontractorsByVettingStatus = async (vettingStatus) => {
  try {
    const { data, error } = await supabase
      .from('subcontractor_profiles')
      .select(`
        *,
        sites_assigned:subcontractor_sites(count)
      `)
      .eq('vetting_status', vettingStatus)
      .order('company_name');

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching subcontractors by vetting status:', error);
    return { data: null, error };
  }
};

// Get subcontractor statistics
export const getSubcontractorStats = async () => {
  try {
    const { data, error } = await supabase
      .from('subcontractor_profiles')
      .select('status, vetting_status, performance_rating');

    if (error) throw error;

    const stats = {
      total: data.length,
      byStatus: {},
      byVettingStatus: {},
      averagePerformance: 0,
      topPerformers: 0
    };

    // Calculate status distribution
    data.forEach(sc => {
      stats.byStatus[sc.status] = (stats.byStatus[sc.status] || 0) + 1;
      stats.byVettingStatus[sc.vetting_status] = (stats.byVettingStatus[sc.vetting_status] || 0) + 1;
    });

    // Calculate average performance
    const validRatings = data.filter(sc => sc.performance_rating > 0);
    if (validRatings.length > 0) {
      stats.averagePerformance = validRatings.reduce((sum, sc) => sum + sc.performance_rating, 0) / validRatings.length;
      stats.topPerformers = validRatings.filter(sc => sc.performance_rating >= 4.0).length;
    }

    return { data: stats, error: null };
  } catch (error) {
    console.error('Error fetching subcontractor stats:', error);
    return { data: null, error };
  }
};

// Assign subcontractor to site
export const assignSubcontractorToSite = async (subcontractorId, siteId, assignmentData) => {
  try {
    const { data, error } = await supabase
      .from('subcontractor_sites')
      .insert([{
        subcontractor_id: subcontractorId,
        site_id: siteId,
        ...assignmentData
      }])
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error assigning subcontractor to site:', error);
    return { data: null, error };
  }
};

// Remove subcontractor from site
export const removeSubcontractorFromSite = async (subcontractorId, siteId) => {
  try {
    const { error } = await supabase
      .from('subcontractor_sites')
      .delete()
      .eq('subcontractor_id', subcontractorId)
      .eq('site_id', siteId);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error removing subcontractor from site:', error);
    return { error };
  }
};

// Get subcontractor incidents
export const getSubcontractorIncidents = async (subcontractorId) => {
  try {
    const { data, error } = await supabase
      .from('subcontractor_incidents')
      .select(`
        *,
        sites(name, type)
      `)
      .eq('subcontractor_id', subcontractorId)
      .order('reported_date', { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching subcontractor incidents:', error);
    return { data: null, error };
  }
};

// Create incident for subcontractor
export const createSubcontractorIncident = async (incidentData) => {
  try {
    const { data, error } = await supabase
      .from('subcontractor_incidents')
      .insert([incidentData])
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error creating subcontractor incident:', error);
    return { data: null, error };
  }
};

// Get subcontractor performance logs
export const getSubcontractorPerformanceLogs = async (subcontractorId, startDate = null, endDate = null) => {
  try {
    let query = supabase
      .from('subcontractor_performance_logs')
      .select(`
        *,
        sites(name, type)
      `)
      .eq('subcontractor_id', subcontractorId)
      .order('log_date', { ascending: false });

    if (startDate) {
      query = query.gte('log_date', startDate);
    }
    if (endDate) {
      query = query.lte('log_date', endDate);
    }

    const { data, error } = await query;

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching subcontractor performance logs:', error);
    return { data: null, error };
  }
};

// Create performance log for subcontractor
export const createSubcontractorPerformanceLog = async (performanceData) => {
  try {
    const { data, error } = await supabase
      .from('subcontractor_performance_logs')
      .insert([performanceData])
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error creating subcontractor performance log:', error);
    return { data: null, error };
  }
};

// Initialize sample subcontractor data
export const initializeSubcontractorData = async () => {
  const sampleSubcontractors = [
    {
      company_name: 'Alpha Security Services',
      contact_person: 'Michael Rodriguez',
      contact_email: 'michael.rodriguez@alphasecurity.com',
      contact_phone: '(555) 123-4567',
      service_specialization: 'Corporate Security',
      status: 'Active',
      vetting_status: 'Approved',
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
      notes: 'New subcontractor under review process.'
    }
  ];

  try {
    const { data, error } = await supabase
      .from('subcontractor_profiles')
      .insert(sampleSubcontractors)
      .select();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error initializing subcontractor data:', error);
    return { data: null, error };
  }
}; 