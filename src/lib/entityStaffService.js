import { supabase } from './supabaseClient';

// Entity staff types and their requirements
export const ENTITY_STAFF_TYPES = {
  'Employee': {
    description: 'General employee with basic responsibilities',
    requirements: ['Basic Training', 'Background Check', 'Company Policies'],
    icon: 'Shield'
  },
  'Site EHS Representative': {
    description: 'Environmental, Health & Safety representative for specific sites',
    requirements: ['EHS Certification', 'Safety Training', 'Incident Response', 'Regulatory Knowledge'],
    icon: 'AlertTriangle'
  },
  'Site Manager': {
    description: 'Manager responsible for day-to-day operations at specific sites',
    requirements: ['Management Experience', 'Leadership Training', 'Site-Specific Knowledge', 'Team Management'],
    icon: 'Building2'
  },
  'Regional Manager': {
    description: 'Manager overseeing multiple sites within a region',
    requirements: ['Regional Management Experience', 'Strategic Planning', 'Multi-Site Coordination', 'Advanced Leadership'],
    icon: 'MapPin'
  },
  'Executive': {
    description: 'Senior executive with strategic and organizational responsibilities',
    requirements: ['Executive Experience', 'Strategic Vision', 'Organizational Leadership', 'Industry Expertise'],
    icon: 'Crown'
  },
  'Standard Officer': {
    description: 'Basic security personnel for routine operations',
    requirements: ['Basic Security Training', 'Background Check', 'Physical Fitness'],
    icon: 'Shield'
  },
  'Dual-Role Hybrid': {
    description: 'Officers with multiple specializations and responsibilities',
    requirements: ['Multiple Certifications', 'Cross-Training', 'Advanced Background Check'],
    icon: 'Users'
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
  }
};

// Status options for entity staff
export const ENTITY_STAFF_STATUSES = [
  'Active',
  'Inactive', 
  'On Leave',
  'Terminated',
  'Archived'
];

// ============================================================================
// CRUD OPERATIONS
// ============================================================================

/**
 * Create a new entity staff member
 * @param {Object} entityStaffData - The entity staff data
 * @returns {Object} { data, error }
 */
export const createEntityStaff = async (entityStaffData) => {
  try {
    // Prepare the data for insertion
    const dataToInsert = {
      name: entityStaffData.name?.trim() || '',
      role: entityStaffData.role?.trim() || '',
      type: entityStaffData.type || 'Standard Officer',
      site: entityStaffData.site || 'Unassigned',
      status: entityStaffData.status || 'Active',
      compliance: entityStaffData.compliance || 100,
      certifications: Array.isArray(entityStaffData.certifications) 
        ? entityStaffData.certifications 
        : (entityStaffData.certifications ? entityStaffData.certifications.split(',').map(c => c.trim()) : []),
      email: entityStaffData.email || null,
      phone: entityStaffData.phone || null,
      hire_date: entityStaffData.hire_date || new Date().toISOString().split('T')[0],
      department_id: entityStaffData.department_id || null,
      supervisor_id: entityStaffData.supervisor_id || null,
      notes: entityStaffData.notes || null
    };

    // Validate required fields
    if (!dataToInsert.name) {
      throw new Error('Name is required');
    }
    if (!dataToInsert.role) {
      throw new Error('Role is required');
    }

    // Insert the entity staff member
    const { data, error } = await supabase
      .from('entity_staff')
      .insert([dataToInsert])
      .select(`
        *,
        departments (id, name, description),
        supervisor:entity_staff!supervisor_id (id, name, role, type)
      `)
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Error creating entity staff:', error);
    return { data: null, error };
  }
};

/**
 * Get all entity staff members
 * @param {Object} options - Query options
 * @returns {Object} { data, error }
 */
export const getEntityStaff = async (options = {}) => {
  try {
    let query = supabase
      .from('entity_staff')
      .select(`
        *,
        departments (id, name, description),
        supervisor:entity_staff!supervisor_id (id, name, role, type)
      `);

    // Apply filters
    if (options.status) {
      query = query.eq('status', options.status);
    }
    if (options.type) {
      query = query.eq('type', options.type);
    }
    if (options.department_id) {
      query = query.eq('department_id', options.department_id);
    }

    // Apply sorting
    const orderBy = options.orderBy || 'created_at';
    const orderDirection = options.orderDirection || 'desc';
    query = query.order(orderBy, { ascending: orderDirection === 'asc' });

    // Apply pagination
    if (options.limit) {
      query = query.limit(options.limit);
    }
    if (options.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 50) - 1);
    }

    const { data, error } = await query;

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Error fetching entity staff:', error);
    return { data: null, error };
  }
};

/**
 * Get entity staff member by ID
 * @param {number} id - The entity staff ID
 * @returns {Object} { data, error }
 */
export const getEntityStaffById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('entity_staff')
      .select(`
        *,
        departments (id, name, description),
        supervisor:entity_staff!supervisor_id (id, name, role, type)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching entity staff by ID:', error);
    return { data: null, error };
  }
};

/**
 * Update entity staff member
 * @param {number} id - The entity staff ID
 * @param {Object} updates - The updates to apply
 * @returns {Object} { data, error }
 */
export const updateEntityStaff = async (id, updates) => {
  try {
    // Prepare the data for update
    const dataToUpdate = {
      name: updates.name?.trim() || undefined,
      role: updates.role?.trim() || undefined,
      type: updates.type || undefined,
      site: updates.site || undefined,
      status: updates.status || undefined,
      compliance: updates.compliance !== undefined ? updates.compliance : undefined,
      certifications: Array.isArray(updates.certifications) 
        ? updates.certifications 
        : (updates.certifications ? updates.certifications.split(',').map(c => c.trim()) : undefined),
      email: updates.email || undefined,
      phone: updates.phone || undefined,
      hire_date: updates.hire_date || undefined,
      department_id: updates.department_id || undefined,
      supervisor_id: updates.supervisor_id || undefined,
      notes: updates.notes || undefined
    };

    // Remove undefined values
    Object.keys(dataToUpdate).forEach(key => {
      if (dataToUpdate[key] === undefined) {
        delete dataToUpdate[key];
      }
    });

    const { data, error } = await supabase
      .from('entity_staff')
      .update(dataToUpdate)
      .eq('id', id)
      .select(`
        *,
        departments (id, name, description),
        supervisor:entity_staff!supervisor_id (id, name, role, type)
      `)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error updating entity staff:', error);
    return { data: null, error };
  }
};

/**
 * Delete entity staff member
 * @param {number} id - The entity staff ID
 * @returns {Object} { error }
 */
export const deleteEntityStaff = async (id) => {
  try {
    const { error } = await supabase
      .from('entity_staff')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error deleting entity staff:', error);
    return { error };
  }
};

// ============================================================================
// SEARCH AND FILTER OPERATIONS
// ============================================================================

/**
 * Search entity staff members
 * @param {string} searchTerm - The search term
 * @param {Object} options - Search options
 * @returns {Object} { data, error }
 */
export const searchEntityStaff = async (searchTerm, options = {}) => {
  try {
    let query = supabase
      .from('entity_staff')
      .select(`
        *,
        departments (id, name, description),
        supervisor:entity_staff!supervisor_id (id, name, role, type)
      `)
      .or(`name.ilike.%${searchTerm}%,role.ilike.%${searchTerm}%,site.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`);

    // Apply additional filters
    if (options.status) {
      query = query.eq('status', options.status);
    }
    if (options.type) {
      query = query.eq('type', options.type);
    }

    const { data, error } = await query.order('name', { ascending: true });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error searching entity staff:', error);
    return { data: null, error };
  }
};

/**
 * Get entity staff by type
 * @param {string} type - The entity staff type
 * @returns {Object} { data, error }
 */
export const getEntityStaffByType = async (type) => {
  try {
    const { data, error } = await supabase
      .from('entity_staff')
      .select(`
        *,
        departments (id, name, description),
        supervisor:entity_staff!supervisor_id (id, name, role, type)
      `)
      .eq('type', type)
      .order('name', { ascending: true });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching entity staff by type:', error);
    return { data: null, error };
  }
};

/**
 * Get entity staff by status
 * @param {string} status - The entity staff status
 * @returns {Object} { data, error }
 */
export const getEntityStaffByStatus = async (status) => {
  try {
    const { data, error } = await supabase
      .from('entity_staff')
      .select(`
        *,
        departments (id, name, description),
        supervisor:entity_staff!supervisor_id (id, name, role, type)
      `)
      .eq('status', status)
      .order('name', { ascending: true });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching entity staff by status:', error);
    return { data: null, error };
  }
};

// ============================================================================
// STATISTICS AND ANALYTICS
// ============================================================================

/**
 * Get entity staff statistics
 * @returns {Object} { data, error }
 */
export const getEntityStaffStats = async () => {
  try {
    const { data: entityStaff, error } = await supabase
      .from('entity_staff')
      .select('type, status, compliance, department_id');

    if (error) throw error;

    const stats = {
      total: entityStaff.length,
      byType: {},
      byStatus: {},
      byDepartment: {},
      averageCompliance: 0,
      complianceDistribution: {
        excellent: 0, // 90-100
        good: 0,      // 80-89
        fair: 0,      // 70-79
        poor: 0       // 0-69
      }
    };

    let totalCompliance = 0;
    let activeCount = 0;

    entityStaff.forEach(staff => {
      // Count by type
      stats.byType[staff.type] = (stats.byType[staff.type] || 0) + 1;
      
      // Count by status
      stats.byStatus[staff.status] = (stats.byStatus[staff.status] || 0) + 1;
      
      // Count by department
      if (staff.department_id) {
        stats.byDepartment[staff.department_id] = (stats.byDepartment[staff.department_id] || 0) + 1;
      }
      
      // Calculate compliance
      if (staff.compliance && staff.status === 'Active') {
        totalCompliance += staff.compliance;
        activeCount++;
        
        // Compliance distribution
        if (staff.compliance >= 90) stats.complianceDistribution.excellent++;
        else if (staff.compliance >= 80) stats.complianceDistribution.good++;
        else if (staff.compliance >= 70) stats.complianceDistribution.fair++;
        else stats.complianceDistribution.poor++;
      }
    });

    stats.averageCompliance = activeCount > 0 ? Math.round(totalCompliance / activeCount) : 0;

    return { data: stats, error: null };
  } catch (error) {
    console.error('Error fetching entity staff stats:', error);
    return { data: null, error };
  }
};

// ============================================================================
// HIERARCHY AND SUPERVISION OPERATIONS
// ============================================================================

/**
 * Get potential supervisors (excluding the current entity staff member)
 * @param {number} excludeEntityStaffId - ID to exclude from results
 * @returns {Object} { data, error }
 */
export const getPotentialSupervisors = async (excludeEntityStaffId = null) => {
  try {
    let query = supabase
      .from('entity_staff')
      .select('id, name, role, type, status')
      .eq('status', 'Active')
      .order('name', { ascending: true });

    if (excludeEntityStaffId) {
      query = query.neq('id', excludeEntityStaffId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching potential supervisors:', error);
    return { data: null, error };
  }
};

/**
 * Get direct reports of an entity staff member
 * @param {number} entityStaffId - The entity staff ID
 * @returns {Object} { data, error }
 */
export const getDirectReports = async (entityStaffId) => {
  try {
    const { data, error } = await supabase
      .from('entity_staff')
      .select(`
        id, name, role, type, status, compliance, hire_date,
        departments (id, name, description)
      `)
      .eq('supervisor_id', entityStaffId)
      .eq('status', 'Active')
      .order('name', { ascending: true });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching direct reports:', error);
    return { data: null, error };
  }
};

/**
 * Get full reporting chain (all levels below an entity staff member)
 * @param {number} entityStaffId - The entity staff ID
 * @returns {Object} { data, error }
 */
export const getFullReportingChain = async (entityStaffId) => {
  try {
    const { data, error } = await supabase
      .rpc('get_full_reporting_chain', { entity_staff_id: entityStaffId });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching full reporting chain:', error);
    return { data: null, error };
  }
};

/**
 * Get supervisor chain (all levels above an entity staff member)
 * @param {number} entityStaffId - The entity staff ID
 * @returns {Object} { data, error }
 */
export const getSupervisorChain = async (entityStaffId) => {
  try {
    const { data, error } = await supabase
      .rpc('get_supervisor_chain', { entity_staff_id: entityStaffId });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching supervisor chain:', error);
    return { data: null, error };
  }
};

/**
 * Get organizational chart data
 * @returns {Object} { data, error }
 */
export const getOrganizationalChart = async () => {
  try {
    const { data, error } = await supabase
      .rpc('get_organizational_chart');

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching organizational chart:', error);
    return { data: null, error };
  }
};

/**
 * Update entity staff supervisor
 * @param {number} entityStaffId - The entity staff ID
 * @param {number} supervisorId - The supervisor ID
 * @returns {Object} { data, error }
 */
export const updateEntityStaffSupervisor = async (entityStaffId, supervisorId) => {
  try {
    const { data, error } = await supabase
      .from('entity_staff')
      .update({ supervisor_id: supervisorId })
      .eq('id', entityStaffId)
      .select(`
        *,
        departments (id, name, description),
        supervisor:entity_staff!supervisor_id (id, name, role, type)
      `)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error updating entity staff supervisor:', error);
    return { data: null, error };
  }
};

/**
 * Get entity staff with supervisor information
 * @returns {Object} { data, error }
 */
export const getEntityStaffWithSupervisors = async () => {
  try {
    const { data, error } = await supabase
      .from('entity_staff_with_supervisors')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching entity staff with supervisors:', error);
    return { data: null, error };
  }
};

// ============================================================================
// DEPARTMENT OPERATIONS
// ============================================================================

/**
 * Get all departments
 * @returns {Object} { data, error }
 */
export const getDepartments = async () => {
  try {
    const { data, error } = await supabase
      .from('departments')
      .select('id, name, description, is_active')
      .eq('is_active', true)
      .order('name', { ascending: true });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching departments:', error);
    return { data: null, error };
  }
};

/**
 * Create a new department
 * @param {Object} departmentData - The department data
 * @returns {Object} { data, error }
 */
export const createDepartment = async (departmentData) => {
  try {
    const { data, error } = await supabase
      .from('departments')
      .insert([departmentData])
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error creating department:', error);
    return { data: null, error };
  }
};

// ============================================================================
// INITIALIZATION AND SAMPLE DATA
// ============================================================================

/**
 * Initialize entity staff table with sample data
 * @returns {Object} { data, error }
 */
export const initializeEntityStaffData = async () => {
  const sampleEntityStaff = [
    {
      name: 'John Smith',
      role: 'Security Officer',
      type: 'Standard Officer',
      site: 'Corporate HQ Alpha',
      status: 'Active',
      compliance: 95,
      certifications: ['Basic Security', 'First Aid', 'Firearms'],
      email: 'john.smith@gs3.com',
      phone: '+1-555-0123',
      hire_date: '2023-01-15',
      notes: 'Reliable officer with excellent customer service skills. Handles high-traffic areas well.'
    },
    {
      name: 'Sarah Johnson',
      role: 'Site Supervisor',
      type: 'Supervisor',
      site: 'Metro Hospital East',
      status: 'Active',
      compliance: 98,
      certifications: ['Advanced Security', 'Leadership', 'Emergency Response'],
      email: 'sarah.johnson@gs3.com',
      phone: '+1-555-0124',
      hire_date: '2022-08-20',
      notes: 'Strong leadership qualities. Excellent at managing team dynamics and emergency situations.'
    },
    {
      name: 'Mike Rodriguez',
      role: 'Operations Manager',
      type: 'Operations Management',
      site: 'Regional Office',
      status: 'Active',
      compliance: 100,
      certifications: ['Management', 'Risk Assessment', 'ISO 18788'],
      email: 'mike.rodriguez@gs3.com',
      phone: '+1-555-0125',
      hire_date: '2021-03-10',
      notes: 'Strategic thinker with proven track record in operational efficiency. Key player in regional expansion.'
    },
    {
      name: 'Lisa Chen',
      role: 'Security Consultant',
      type: 'Consultant',
      site: 'Multiple',
      status: 'Active',
      compliance: 92,
      certifications: ['Consulting', 'Risk Analysis', 'Training'],
      email: 'lisa.chen@gs3.com',
      phone: '+1-555-0126',
      hire_date: '2022-11-05',
      notes: 'Expert in risk assessment and training. Valuable asset for client consultations and specialized projects.'
    }
  ];

  try {
    // Check if entity_staff table has data
    const { data: existingEntityStaff, error: checkError } = await supabase
      .from('entity_staff')
      .select('count')
      .limit(1);

    if (checkError) {
      console.error('Error checking entity staff table:', checkError);
      return { data: null, error: checkError };
    }

    if (!existingEntityStaff || existingEntityStaff.length === 0) {
      // Insert sample data
      const { data, error } = await supabase
        .from('entity_staff')
        .insert(sampleEntityStaff)
        .select();

      if (error) throw error;
      console.log('Sample entity staff data initialized');
      return { data, error: null };
    }

    return { data: existingEntityStaff, error: null };
  } catch (error) {
    console.error('Error initializing entity staff data:', error);
    return { data: null, error };
  }
};

// ============================================================================
// BACKGROUND CHECK AND ONBOARDING STATS
// ============================================================================

/**
 * Get background check statistics
 * @returns {Object} { data, error }
 */
export const getBackgroundCheckStats = async () => {
  try {
    const { data: entityStaff, error } = await supabase
      .from('entity_staff')
      .select('status, compliance, created_at');

    if (error) throw error;

    const totalEntityStaff = entityStaff.length;
    const activeEntityStaff = entityStaff.filter(staff => staff.status === 'Active').length;
    const highCompliance = entityStaff.filter(staff => staff.compliance >= 95).length;
    const mediumCompliance = entityStaff.filter(staff => staff.compliance >= 85 && staff.compliance < 95).length;
    const lowCompliance = entityStaff.filter(staff => staff.compliance < 85).length;

    // Calculate background check status based on compliance and status
    const completedChecks = highCompliance + Math.floor(mediumCompliance * 0.8);
    const inProgress = Math.floor(mediumCompliance * 0.2) + Math.floor(lowCompliance * 0.3);
    const pendingReview = Math.floor(lowCompliance * 0.7);

    return {
      data: {
        completedChecks,
        inProgress,
        pendingReview,
        totalEntityStaff,
        activeEntityStaff
      },
      error: null
    };
  } catch (error) {
    console.error('Error fetching background check stats:', error);
    return { data: null, error };
  }
};

/**
 * Get onboarding statistics
 * @returns {Object} { data, error }
 */
export const getOnboardingStats = async () => {
  try {
    const { data: entityStaff, error } = await supabase
      .from('entity_staff')
      .select('hire_date, status, created_at');

    if (error) throw error;

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
    
    // Calculate onboarding stats
    const newHires = entityStaff.filter(staff => {
      const hireDate = new Date(staff.hire_date);
      return hireDate >= thirtyDaysAgo;
    }).length;

    const inTraining = entityStaff.filter(staff => staff.status === 'On Leave').length;
    const qualified = entityStaff.filter(staff => staff.status === 'Active').length;

    return {
      data: {
        newHires,
        inTraining,
        qualified,
        totalEntityStaff: entityStaff.length
      },
      error: null
    };
  } catch (error) {
    console.error('Error fetching onboarding stats:', error);
    return { data: null, error };
  }
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Validate entity staff data
 * @param {Object} data - The entity staff data to validate
 * @returns {Object} { isValid, errors }
 */
export const validateEntityStaffData = (data) => {
  const errors = [];

  if (!data.name || data.name.trim().length === 0) {
    errors.push('Name is required');
  }

  if (!data.role || data.role.trim().length === 0) {
    errors.push('Role is required');
  }

  if (data.compliance !== undefined && (data.compliance < 0 || data.compliance > 100)) {
    errors.push('Compliance must be between 0 and 100');
  }

  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('Invalid email format');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Format entity staff data for display
 * @param {Object} entityStaff - The entity staff object
 * @returns {Object} Formatted entity staff data
 */
export const formatEntityStaffForDisplay = (entityStaff) => {
  return {
    ...entityStaff,
    displayName: entityStaff.name,
    displayRole: entityStaff.role,
    displayType: entityStaff.type,
    displayStatus: entityStaff.status,
    displayCompliance: `${entityStaff.compliance}%`,
    displayCertifications: Array.isArray(entityStaff.certifications) 
      ? entityStaff.certifications.join(', ')
      : entityStaff.certifications || 'None',
    displayHireDate: entityStaff.hire_date 
      ? new Date(entityStaff.hire_date).toLocaleDateString()
      : 'Not specified'
  };
}; 