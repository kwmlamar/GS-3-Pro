import { supabase } from './supabaseClient';

// Security staff types and their requirements
export const SECURITY_STAFF_TYPES = {
  'Standard Officer': {
    description: 'Basic security personnel for routine operations',
    requirements: ['Basic Security Training', 'Background Check', 'Physical Fitness'],
    icon: 'Shield'
  },
  'Supervisor': {
    description: 'Team leaders and site supervisors',
    requirements: ['Leadership Training', 'Management Certification', 'Experience'],
    icon: 'Star'
  },
  'Operations Management': {
    description: 'Regional and operational managers',
    requirements: ['Management Degree', 'Extensive Experience', 'Strategic Planning'],
    icon: 'Briefcase'
  },
  'Consultant': {
    description: 'Specialized security consultants and advisors',
    requirements: ['Expert Certification', 'Industry Experience', 'Consulting Skills'],
    icon: 'GraduationCap'
  },
  'Dual-Role Hybrid': {
    description: 'Officers with multiple specializations and responsibilities',
    requirements: ['Multiple Certifications', 'Cross-Training', 'Advanced Background Check'],
    icon: 'Users'
  },
  'Specialist': {
    description: 'Specialized security roles (K9, VIP, etc.)',
    requirements: ['Specialized Training', 'Advanced Certifications', 'Experience'],
    icon: 'Shield'
  }
};

// Create security staff
export const createSecurityStaff = async (securityStaffData) => {
  try {
    // Handle entities and supervisors - extract from security staff data
    const { entities, supervisor_ids, ...dataToSave } = securityStaffData;

    // Set primary supervisor (first one in the array) to supervisor_id field
    if (supervisor_ids && supervisor_ids.length > 0) {
      dataToSave.supervisor_id = supervisor_ids[0];
    }

    const { data, error } = await supabase
      .from('security_staff')
      .insert([dataToSave])
      .select(`
        *,
        subcontractor_profiles (id, company_name, service_specialization)
      `)
      .single();

    if (error) throw error;

    // If entities are provided, create security staff-entity relationships
    if (entities && entities.length > 0) {
      const securityStaffEntities = entities.map((entityId, index) => ({
        security_staff_id: data.id,
        site_id: entityId,
        is_primary: index === 0 // First entity is primary
      }));

      const { error: entityError } = await supabase
        .from('security_staff_entities')
        .insert(securityStaffEntities);

      if (entityError) {
        console.error('Error creating security staff-entity relationships:', entityError);
        // Don't fail the entire operation, just log the error
      }
    }

    // Add supervisor_ids back to the returned data for consistency
    const resultData = {
      ...data,
      supervisor_ids: supervisor_ids || []
    };

    return { data: resultData, error: null };
  } catch (error) {
    console.error('Error creating security staff:', error);
    return { data: null, error };
  }
};

// Get all security staff
export const getSecurityStaff = async () => {
  try {
    const { data, error } = await supabase
      .from('security_staff')
      .select(`
        *,
        subcontractor_profiles (id, company_name, service_specialization)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      // If it's an RLS error, try to provide helpful message
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

    // Add name field and fetch security staff entities for each security staff member
    const securityStaffWithEntities = await Promise.all(
      data.map(async (securityStaff) => {
        const { data: entities } = await supabase
          .from('security_staff_entities')
          .select(`
            site_id,
            is_primary,
            sites (id, name, type, parent_id)
          `)
          .eq('security_staff_id', securityStaff.id);

        return {
          ...securityStaff,
          name: `${securityStaff.first_name} ${securityStaff.last_name}`,
          role: securityStaff.position,
          type: securityStaff.position, // Use position as type for now
          entities: entities || [],
          primaryEntity: entities?.find(e => e.is_primary)?.sites?.name || 'No entity assigned'
        };
      })
    );

    return { data: securityStaffWithEntities, error: null };
  } catch (error) {
    console.error('Error fetching security staff:', error);
    return { data: null, error };
  }
};

// Get security staff by ID
export const getSecurityStaffById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('security_staff')
      .select(`
        *,
        subcontractor_profiles (id, company_name, service_specialization)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching security staff:', error);
    return { data: null, error };
  }
};

// Update security staff
export const updateSecurityStaff = async (id, updates) => {
  try {
    // Handle entities and supervisors - extract from security staff data
    const { entities, supervisor_ids, ...dataToUpdate } = updates;

    // Set primary supervisor (first one in the array) to supervisor_id field
    if (supervisor_ids && supervisor_ids.length > 0) {
      dataToUpdate.supervisor_id = supervisor_ids[0];
    } else {
      dataToUpdate.supervisor_id = null;
    }

    const { data, error } = await supabase
      .from('security_staff')
      .update(dataToUpdate)
      .eq('id', id)
      .select(`
        *,
        subcontractor_profiles (id, company_name, service_specialization)
      `)
      .single();

    if (error) throw error;

    // If entities are provided, update security staff-entity relationships
    if (entities !== undefined) {
      // Delete existing relationships
      await supabase
        .from('security_staff_entities')
        .delete()
        .eq('security_staff_id', id);

      // Create new relationships if entities are provided
      if (entities && entities.length > 0) {
        const securityStaffEntities = entities.map((entityId, index) => ({
          security_staff_id: id,
          site_id: entityId,
          is_primary: index === 0 // First entity is primary
        }));

        const { error: entityError } = await supabase
          .from('security_staff_entities')
          .insert(securityStaffEntities);

        if (entityError) {
          console.error('Error updating security staff-entity relationships:', entityError);
          // Don't fail the entire operation, just log the error
        }
      }
    }

    // Add supervisor_ids back to the returned data for consistency
    const resultData = {
      ...data,
      supervisor_ids: supervisor_ids || []
    };

    return { data: resultData, error: null };
  } catch (error) {
    console.error('Error updating security staff:', error);
    return { data: null, error };
  }
};

// Delete security staff
export const deleteSecurityStaff = async (id) => {
  try {
    const { error } = await supabase
      .from('security_staff')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error deleting security staff:', error);
    return { error };
  }
};

// Search security staff
export const searchSecurityStaff = async (searchTerm) => {
  try {
    const { data, error } = await supabase
      .from('security_staff')
      .select('*')
      .or(`first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%,position.ilike.%${searchTerm}%`)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    // Transform data to include name field for compatibility
    const transformedData = data.map(staff => ({
      ...staff,
      name: `${staff.first_name} ${staff.last_name}`,
      role: staff.position,
      type: staff.position
    }));

    return { data: transformedData, error: null };
  } catch (error) {
    console.error('Error searching security staff:', error);
    return { data: null, error };
  }
};

// Get security staff by type
export const getSecurityStaffByType = async (type) => {
  try {
    const { data, error } = await supabase
      .from('security_staff')
      .select('*')
      .eq('position', type)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    // Transform data to include name field for compatibility
    const transformedData = data.map(staff => ({
      ...staff,
      name: `${staff.first_name} ${staff.last_name}`,
      role: staff.position,
      type: staff.position
    }));

    return { data: transformedData, error: null };
  } catch (error) {
    console.error('Error fetching security staff by type:', error);
    return { data: null, error };
  }
};

// Get security staff statistics
export const getSecurityStaffStats = async () => {
  try {
    const { data: securityStaff, error } = await supabase
      .from('security_staff')
      .select('position, status, compliance_score');

    if (error) throw error;

    const stats = {
      total: securityStaff.length,
      byType: {},
      byStatus: {},
      byCompliance: {
        excellent: 0,
        good: 0,
        needsImprovement: 0
      }
    };

    securityStaff.forEach(staff => {
      // Count by type (using position as type)
      const type = staff.position;
      stats.byType[type] = (stats.byType[type] || 0) + 1;
      
      // Count by status
      stats.byStatus[staff.status] = (stats.byStatus[staff.status] || 0) + 1;
      
      // Count by compliance
      if (staff.compliance_score >= 95) {
        stats.byCompliance.excellent++;
      } else if (staff.compliance_score >= 85) {
        stats.byCompliance.good++;
      } else {
        stats.byCompliance.needsImprovement++;
      }
    });

    return { data: stats, error: null };
  } catch (error) {
    console.error('Error fetching security staff stats:', error);
    return { data: null, error };
  }
};

// Initialize sample security staff data
export const initializeSecurityStaffData = async () => {
  try {
    const sampleSecurityStaff = [
      {
        name: 'John Smith',
        role: 'Security Supervisor',
        type: 'Supervisor',
        status: 'Active',
        security_company_id: 1,
        position: 'Supervisor',
        hire_date: '2023-01-15',
        email: 'john.smith@security.com',
        phone: '+1-555-0101',
        compliance: 95,
        certifications: ['Security Supervisor License', 'First Aid', 'CPR'],
        background_check_status: 'Approved',
        drug_test_status: 'Passed',
        notes: 'Experienced supervisor with excellent leadership skills.'
      },
      {
        name: 'Sarah Johnson',
        role: 'Security Officer',
        type: 'Standard Officer',
        status: 'Active',
        security_company_id: 1,
        position: 'Security Officer',
        hire_date: '2023-03-20',
        email: 'sarah.johnson@security.com',
        phone: '+1-555-0102',
        compliance: 88,
        certifications: ['Security License', 'First Aid'],
        background_check_status: 'Approved',
        drug_test_status: 'Passed',
        notes: 'Reliable officer with good attention to detail.'
      },
      {
        name: 'Mike Davis',
        role: 'Operations Manager',
        type: 'Operations Management',
        status: 'Active',
        security_company_id: 1,
        position: 'Operations Manager',
        hire_date: '2022-11-10',
        email: 'mike.davis@security.com',
        phone: '+1-555-0103',
        compliance: 98,
        certifications: ['Management Certification', 'Security License', 'Advanced Training'],
        background_check_status: 'Approved',
        drug_test_status: 'Passed',
        notes: 'Senior operations manager with extensive experience.'
      }
    ];

    const { data, error } = await supabase
      .from('security_staff')
      .insert(sampleSecurityStaff)
      .select();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error initializing security staff data:', error);
    return { data: null, error };
  }
};

// Get background check statistics for security staff
export const getBackgroundCheckStats = async () => {
  try {
    const { data, error } = await supabase
      .from('security_staff')
      .select('background_check_status, drug_test_status');

    if (error) throw error;

    const stats = {
      totalSecurityStaff: data.length,
      completedChecks: data.filter(staff => staff.background_check_status === 'Approved').length,
      inProgress: data.filter(staff => staff.background_check_status === 'In Progress').length,
      pendingReview: data.filter(staff => staff.background_check_status === 'Pending').length,
      drugTestPassed: data.filter(staff => staff.drug_test_status === 'Passed').length,
      drugTestFailed: data.filter(staff => staff.drug_test_status === 'Failed').length
    };

    return { data: stats, error: null };
  } catch (error) {
    console.error('Error fetching background check stats:', error);
    return { data: null, error };
  }
};

// Get onboarding statistics for security staff
export const getOnboardingStats = async () => {
  try {
    const { data, error } = await supabase
      .from('security_staff')
      .select('hire_date, status, training_completion');

    if (error) throw error;

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const stats = {
      newHires: data.filter(staff => {
        const hireDate = new Date(staff.hire_date);
        return hireDate.getMonth() === currentMonth && hireDate.getFullYear() === currentYear;
      }).length,
      inTraining: data.filter(staff => staff.status === 'In Training').length,
      qualified: data.filter(staff => staff.status === 'Active' && staff.training_completion?.basic_training === true).length
    };

    return { data: stats, error: null };
  } catch (error) {
    console.error('Error fetching onboarding stats:', error);
    return { data: null, error };
  }
};

// Get security companies for dropdown
export const getSecurityCompanies = async () => {
  try {
    const { data, error } = await supabase
      .from('subcontractor_profiles')
      .select('id, company_name, service_specialization')
      .eq('status', 'Active')
      .order('company_name');

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching security companies:', error);
    return { data: null, error };
  }
};

// Get potential supervisors for security staff
export const getPotentialSupervisors = async (excludeSecurityStaffId = null) => {
  try {
    let query = supabase
      .from('security_staff')
      .select('id, first_name, last_name, position, status')
      .eq('status', 'Active');

    if (excludeSecurityStaffId) {
      query = query.neq('id', excludeSecurityStaffId);
    }

    const { data, error } = await query.order('first_name');

    if (error) throw error;
    
    // Transform data to include name field for compatibility
    const transformedData = data.map(staff => ({
      ...staff,
      name: `${staff.first_name} ${staff.last_name}`,
      role: staff.position,
      type: staff.position
    }));

    return { data: transformedData, error: null };
  } catch (error) {
    console.error('Error fetching potential supervisors:', error);
    return { data: null, error };
  }
};

// Get direct reports for a security staff member
export const getDirectReports = async (securityStaffId) => {
  try {
    const { data, error } = await supabase
      .from('security_staff')
      .select('id, first_name, last_name, position, status, compliance_score')
      .eq('supervisor_id', securityStaffId)
      .eq('status', 'Active')
      .order('first_name');

    if (error) throw error;
    
    // Transform data to include name field for compatibility
    const transformedData = data.map(staff => ({
      ...staff,
      name: `${staff.first_name} ${staff.last_name}`,
      role: staff.position,
      type: staff.position,
      compliance: staff.compliance_score
    }));

    return { data: transformedData, error: null };
  } catch (error) {
    console.error('Error fetching direct reports:', error);
    return { data: null, error };
  }
};

// Get full reporting chain for a security staff member
export const getFullReportingChain = async (securityStaffId) => {
  try {
    const { data, error } = await supabase
      .from('security_staff')
      .select('id, first_name, last_name, position, supervisor_id')
      .eq('id', securityStaffId)
      .single();

    if (error) throw error;

    // Transform the initial data
    const transformedData = {
      ...data,
      name: `${data.first_name} ${data.last_name}`,
      role: data.position,
      type: data.position
    };

    const chain = [transformedData];
    let currentId = data.supervisor_id;

    while (currentId) {
      const { data: supervisor, error: supervisorError } = await supabase
        .from('security_staff')
        .select('id, first_name, last_name, position, supervisor_id')
        .eq('id', currentId)
        .single();

      if (supervisorError) break;
      
      const transformedSupervisor = {
        ...supervisor,
        name: `${supervisor.first_name} ${supervisor.last_name}`,
        role: supervisor.position,
        type: supervisor.position
      };
      
      chain.push(transformedSupervisor);
      currentId = supervisor.supervisor_id;
    }

    return { data: chain, error: null };
  } catch (error) {
    console.error('Error fetching full reporting chain:', error);
    return { data: null, error };
  }
};

// Get supervisor chain for a security staff member
export const getSupervisorChain = async (securityStaffId) => {
  try {
    const { data, error } = await getFullReportingChain(securityStaffId);
    if (error) throw error;

    // Return only supervisors (exclude the original staff member)
    return { data: data.slice(1), error: null };
  } catch (error) {
    console.error('Error fetching supervisor chain:', error);
    return { data: null, error };
  }
};

// Get organizational chart for security staff
export const getOrganizationalChart = async () => {
  try {
    const { data, error } = await supabase
      .from('security_staff')
      .select(`
        id,
        first_name,
        last_name,
        position,
        status,
        compliance_score,
        supervisor_id,
        subcontractor_profiles (company_name)
      `)
      .eq('status', 'Active')
      .order('first_name');

    if (error) throw error;

    // Transform data and add supervisor names and determine hierarchy levels
    const transformedData = data.map(staff => ({
      ...staff,
      name: `${staff.first_name} ${staff.last_name}`,
      role: staff.position,
      type: staff.position,
      compliance: staff.compliance_score
    }));

    const chartData = transformedData.map(staff => {
      const supervisor = transformedData.find(s => s.id === staff.supervisor_id);
      return {
        ...staff,
        supervisor_name: supervisor?.name || null,
        has_reports: data.some(s => s.supervisor_id === staff.id),
        level: staff.supervisor_id ? 1 : 0
      };
    });

    return { data: chartData, error: null };
  } catch (error) {
    console.error('Error fetching organizational chart:', error);
    return { data: null, error };
  }
};

// Update security staff supervisor
export const updateSecurityStaffSupervisor = async (securityStaffId, supervisorId) => {
  try {
    const { data, error } = await supabase
      .from('security_staff')
      .update({ supervisor_id: supervisorId })
      .eq('id', securityStaffId)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error updating security staff supervisor:', error);
    return { data: null, error };
  }
};

// Get security staff with supervisors
export const getSecurityStaffWithSupervisors = async () => {
  try {
    const { data, error } = await supabase
      .from('security_staff')
      .select(`
        id,
        first_name,
        last_name,
        position,
        status,
        compliance_score,
        supervisor_id,
        subcontractor_profiles (company_name)
      `)
      .eq('status', 'Active')
      .order('first_name');

    if (error) throw error;

    // Transform data and add supervisor names
    const transformedData = data.map(staff => ({
      ...staff,
      name: `${staff.first_name} ${staff.last_name}`,
      role: staff.position,
      type: staff.position,
      compliance: staff.compliance_score
    }));

    const staffWithSupervisors = transformedData.map(staff => {
      const supervisor = transformedData.find(s => s.id === staff.supervisor_id);
      return {
        ...staff,
        supervisor_name: supervisor?.name || null
      };
    });

    return { data: staffWithSupervisors, error: null };
  } catch (error) {
    console.error('Error fetching security staff with supervisors:', error);
    return { data: null, error };
  }
}; 