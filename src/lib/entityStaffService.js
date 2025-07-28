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

// Create entity staff
export const createEntityStaff = async (entityStaffData) => {
  try {
    // Handle department - if department name is provided, find or create the department
    let finalEntityStaffData = { ...entityStaffData };
    
    if (entityStaffData.department && !entityStaffData.department_id) {
      // Try to find existing department
      const { data: existingDept } = await supabase
        .from('departments')
        .select('id')
        .eq('name', entityStaffData.department)
        .eq('is_active', true)
        .single();

      if (existingDept) {
        finalEntityStaffData.department_id = existingDept.id;
      } else {
        // Create new department
        const { data: newDept, error: deptError } = await createDepartment({
          name: entityStaffData.department,
          description: `Department for ${entityStaffData.department}`,
          is_active: true
        });

        if (deptError) throw deptError;
        finalEntityStaffData.department_id = newDept.id;
      }
    }

    // Handle entities - extract entity IDs and remove from entity staff data
    const { department, entities, ...dataToSave } = finalEntityStaffData;

    const { data, error } = await supabase
      .from('entity_staff')
      .insert([dataToSave])
      .select(`
        *,
        departments (id, name, description)
      `)
      .single();

    if (error) throw error;

    // If entities are provided, create entity staff-entity relationships
    if (entities && entities.length > 0) {
      const entityStaffEntities = entities.map((entityId, index) => ({
        entity_staff_id: data.id,
        site_id: entityId,
        is_primary: index === 0 // First entity is primary
      }));

      const { error: entityError } = await supabase
        .from('entity_staff_entities')
        .insert(entityStaffEntities);

      if (entityError) {
        console.error('Error creating entity staff-entity relationships:', entityError);
        // Don't fail the entire operation, just log the error
      }
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error creating entity staff:', error);
    return { data: null, error };
  }
};

// Get all entity staff
export const getEntityStaff = async () => {
  try {
    const { data, error } = await supabase
      .from('entity_staff')
      .select(`
        *,
        departments (id, name, description)
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

    // Fetch entity staff entities for each entity staff member
    const entityStaffWithEntities = await Promise.all(
      data.map(async (entityStaff) => {
        const { data: entities } = await supabase
          .from('entity_staff_entities')
          .select(`
            site_id,
            is_primary,
            sites (id, name, type, parent_id)
          `)
          .eq('entity_staff_id', entityStaff.id);

        return {
          ...entityStaff,
          entities: entities || [],
          primaryEntity: entities?.find(e => e.is_primary)?.sites?.name || entityStaff.site || 'No entity assigned'
        };
      })
    );

    return { data: entityStaffWithEntities, error: null };
  } catch (error) {
    console.error('Error fetching entity staff:', error);
    return { data: null, error };
  }
};

// Get entity staff by ID
export const getEntityStaffById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('entity_staff')
      .select(`
        *,
        departments (id, name, description)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching entity staff:', error);
    return { data: null, error };
  }
};

// Update entity staff
export const updateEntityStaff = async (id, updates) => {
  try {
    // Handle department - if department name is provided, find or create the department
    let finalUpdates = { ...updates };
    
    if (updates.department && !updates.department_id) {
      // Try to find existing department
      const { data: existingDept } = await supabase
        .from('departments')
        .select('id')
        .eq('name', updates.department)
        .eq('is_active', true)
        .single();

      if (existingDept) {
        finalUpdates.department_id = existingDept.id;
      } else {
        // Create new department
        const { data: newDept, error: deptError } = await createDepartment({
          name: updates.department,
          description: `Department for ${updates.department}`,
          is_active: true
        });

        if (deptError) throw deptError;
        finalUpdates.department_id = newDept.id;
      }
    }

    // Handle entities - extract entity IDs and remove from entity staff data
    const { department, entities, ...dataToSave } = finalUpdates;

    const { data, error } = await supabase
      .from('entity_staff')
      .update(dataToSave)
      .eq('id', id)
      .select(`
        *,
        departments (id, name, description)
      `)
      .single();

    if (error) throw error;

    // If entities are provided, update entity staff-entity relationships
    if (entities !== undefined) {
      // Delete existing relationships
      await supabase
        .from('entity_staff_entities')
        .delete()
        .eq('entity_staff_id', id);

      // Create new relationships if entities are provided
      if (entities && entities.length > 0) {
        const entityStaffEntities = entities.map((entityId, index) => ({
          entity_staff_id: id,
          site_id: entityId,
          is_primary: index === 0 // First entity is primary
        }));

        const { error: entityError } = await supabase
          .from('entity_staff_entities')
          .insert(entityStaffEntities);

        if (entityError) {
          console.error('Error updating entity staff-entity relationships:', entityError);
          // Don't fail the entire operation, just log the error
        }
      }
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error updating entity staff:', error);
    return { data: null, error };
  }
};

// Delete entity staff
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

// Search entity staff
export const searchEntityStaff = async (searchTerm) => {
  try {
    const { data, error } = await supabase
      .from('entity_staff')
      .select('*')
      .or(`name.ilike.%${searchTerm}%,role.ilike.%${searchTerm}%,site.ilike.%${searchTerm}%`)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error searching entity staff:', error);
    return { data: null, error };
  }
};

// Get entity staff by type
export const getEntityStaffByType = async (type) => {
  try {
    const { data, error } = await supabase
      .from('entity_staff')
      .select('*')
      .eq('type', type)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching entity staff by type:', error);
    return { data: null, error };
  }
};

// Get entity staff statistics
export const getEntityStaffStats = async () => {
  try {
    const { data: entityStaff, error } = await supabase
      .from('entity_staff')
      .select('type, status, compliance');

    if (error) throw error;

    const stats = {
      total: entityStaff.length,
      byType: {},
      byStatus: {},
      averageCompliance: 0
    };

    let totalCompliance = 0;
    let activeCount = 0;

    entityStaff.forEach(staff => {
      // Count by type
      stats.byType[staff.type] = (stats.byType[staff.type] || 0) + 1;
      
      // Count by status
      stats.byStatus[staff.status] = (stats.byStatus[staff.status] || 0) + 1;
      
      // Calculate compliance
      if (staff.compliance && staff.status === 'Active') {
        totalCompliance += staff.compliance;
        activeCount++;
      }
    });

    stats.averageCompliance = activeCount > 0 ? Math.round(totalCompliance / activeCount) : 0;

    return { data: stats, error: null };
  } catch (error) {
    console.error('Error fetching entity staff stats:', error);
    return { data: null, error };
  }
};

// Initialize database with sample data
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
    // Check if entity_staff table exists and has data
    const { data: existingEntityStaff, error: checkError } = await supabase
      .from('entity_staff')
      .select('count')
      .limit(1);

    if (checkError && checkError.code === '42P01') {
      // Table doesn't exist, create it
      console.log('Creating entity staff table...');
      // Note: In a real app, you'd use migrations to create tables
      // For now, we'll assume the table exists
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

// Get background check statistics
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

// Get onboarding statistics
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

// Get departments from the departments table
export const getDepartments = async () => {
  try {
    const { data, error } = await supabase
      .from('departments')
      .select('id, name, description, is_active')
      .eq('is_active', true)
      .order('name');

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching departments:', error);
    return { data: null, error };
  }
};

// Create a new department
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

// Chain of Command Functions

// Get all entity staff that can be supervisors (excluding the current entity staff if editing)
export const getPotentialSupervisors = async (excludeEntityStaffId = null) => {
  try {
    let query = supabase
      .from('entity_staff')
      .select('id, name, role, type, status')
      .eq('status', 'Active')
      .order('name');

    if (excludeEntityStaffId) {
      query = query.neq('id', excludeEntityStaffId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

// Get direct reports of an entity staff member
export const getDirectReports = async (entityStaffId) => {
  try {
    const { data, error } = await supabase
      .rpc('get_direct_reports', { entity_staff_id: entityStaffId });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

// Get full reporting chain (all levels below an entity staff member)
export const getFullReportingChain = async (entityStaffId) => {
  try {
    const { data, error } = await supabase
      .rpc('get_full_reporting_chain', { entity_staff_id: entityStaffId });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

// Get supervisor chain (all levels above an entity staff member)
export const getSupervisorChain = async (entityStaffId) => {
  try {
    const { data, error } = await supabase
      .rpc('get_supervisor_chain', { entity_staff_id: entityStaffId });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

// Get organizational chart data
export const getOrganizationalChart = async () => {
  try {
    const { data, error } = await supabase
      .rpc('get_organizational_chart');

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

// Update entity staff supervisor
export const updateEntityStaffSupervisor = async (entityStaffId, supervisorId) => {
  try {
    const { data, error } = await supabase
      .from('entity_staff')
      .update({ supervisor_id: supervisorId })
      .eq('id', entityStaffId)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

// Get entity staff with supervisor information
export const getEntityStaffWithSupervisors = async () => {
  try {
    const { data, error } = await supabase
      .from('entity_staff_with_supervisors')
      .select('*')
      .order('name');

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}; 