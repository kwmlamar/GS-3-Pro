import { supabase } from './supabaseClient';

// Employee types and their requirements
export const EMPLOYEE_TYPES = {
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

// Create employee
export const createEmployee = async (employeeData) => {
  try {
    // Handle department - if department name is provided, find or create the department
    let finalEmployeeData = { ...employeeData };
    
    if (employeeData.department && !employeeData.department_id) {
      // Try to find existing department
      const { data: existingDept } = await supabase
        .from('departments')
        .select('id')
        .eq('name', employeeData.department)
        .eq('is_active', true)
        .single();

      if (existingDept) {
        finalEmployeeData.department_id = existingDept.id;
      } else {
        // Create new department
        const { data: newDept, error: deptError } = await createDepartment({
          name: employeeData.department,
          description: `Department for ${employeeData.department}`,
          is_active: true
        });

        if (deptError) throw deptError;
        finalEmployeeData.department_id = newDept.id;
      }
    }

    // Remove the department name field as we now use department_id
    const { department, ...dataToSave } = finalEmployeeData;

    const { data, error } = await supabase
      .from('employees')
      .insert([dataToSave])
      .select(`
        *,
        departments (id, name, description)
      `)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error creating employee:', error);
    return { data: null, error };
  }
};

// Get all employees
export const getEmployees = async () => {
  try {
    const { data, error } = await supabase
      .from('employees')
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
    return { data, error: null };
  } catch (error) {
          console.error('Error fetching security staff:', error);
    return { data: null, error };
  }
};

// Get employee by ID
export const getEmployeeById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('employees')
      .select(`
        *,
        departments (id, name, description)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching employee:', error);
    return { data: null, error };
  }
};

// Update employee
export const updateEmployee = async (id, updates) => {
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

    // Remove the department name field as we now use department_id
    const { department, ...dataToSave } = finalUpdates;

    const { data, error } = await supabase
      .from('employees')
      .update(dataToSave)
      .eq('id', id)
      .select(`
        *,
        departments (id, name, description)
      `)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error updating employee:', error);
    return { data: null, error };
  }
};

// Delete employee
export const deleteEmployee = async (id) => {
  try {
    const { error } = await supabase
      .from('employees')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error deleting employee:', error);
    return { error };
  }
};

// Search employees
export const searchEmployees = async (searchTerm) => {
  try {
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .or(`name.ilike.%${searchTerm}%,role.ilike.%${searchTerm}%,site.ilike.%${searchTerm}%`)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
          console.error('Error searching security staff:', error);
    return { data: null, error };
  }
};

// Get employees by type
export const getEmployeesByType = async (type) => {
  try {
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .eq('type', type)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
          console.error('Error fetching security staff by type:', error);
    return { data: null, error };
  }
};

// Get employee statistics
export const getEmployeeStats = async () => {
  try {
    const { data: employees, error } = await supabase
      .from('employees')
      .select('type, status, compliance');

    if (error) throw error;

    const stats = {
      total: employees.length,
      byType: {},
      byStatus: {},
      averageCompliance: 0
    };

    let totalCompliance = 0;
    let activeCount = 0;

    employees.forEach(emp => {
      // Count by type
      stats.byType[emp.type] = (stats.byType[emp.type] || 0) + 1;
      
      // Count by status
      stats.byStatus[emp.status] = (stats.byStatus[emp.status] || 0) + 1;
      
      // Calculate compliance
      if (emp.compliance && emp.status === 'Active') {
        totalCompliance += emp.compliance;
        activeCount++;
      }
    });

    stats.averageCompliance = activeCount > 0 ? Math.round(totalCompliance / activeCount) : 0;

    return { data: stats, error: null };
  } catch (error) {
    console.error('Error fetching employee stats:', error);
    return { data: null, error };
  }
};

// Initialize database with sample data
export const initializeEmployeeData = async () => {
  const sampleEmployees = [
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
    // Check if employees table exists and has data
    const { data: existingEmployees, error: checkError } = await supabase
      .from('employees')
      .select('count')
      .limit(1);

    if (checkError && checkError.code === '42P01') {
      // Table doesn't exist, create it
      console.log('Creating security staff table...');
      // Note: In a real app, you'd use migrations to create tables
      // For now, we'll assume the table exists
    }

    if (!existingEmployees || existingEmployees.length === 0) {
      // Insert sample data
      const { data, error } = await supabase
        .from('employees')
        .insert(sampleEmployees)
        .select();

      if (error) throw error;
      console.log('Sample employee data initialized');
      return { data, error: null };
    }

    return { data: existingEmployees, error: null };
  } catch (error) {
    console.error('Error initializing employee data:', error);
    return { data: null, error };
  }
};

// Get background check statistics
export const getBackgroundCheckStats = async () => {
  try {
    const { data: employees, error } = await supabase
      .from('employees')
      .select('status, compliance, created_at');

    if (error) throw error;

    const totalEmployees = employees.length;
    const activeEmployees = employees.filter(emp => emp.status === 'Active').length;
    const highCompliance = employees.filter(emp => emp.compliance >= 95).length;
    const mediumCompliance = employees.filter(emp => emp.compliance >= 85 && emp.compliance < 95).length;
    const lowCompliance = employees.filter(emp => emp.compliance < 85).length;

    // Calculate background check status based on compliance and status
    const completedChecks = highCompliance + Math.floor(mediumCompliance * 0.8);
    const inProgress = Math.floor(mediumCompliance * 0.2) + Math.floor(lowCompliance * 0.3);
    const pendingReview = Math.floor(lowCompliance * 0.7);

    return {
      data: {
        completedChecks,
        inProgress,
        pendingReview,
        totalEmployees,
        activeEmployees
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
    const { data: employees, error } = await supabase
      .from('employees')
      .select('hire_date, status, created_at');

    if (error) throw error;

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
    
    // Calculate onboarding stats
    const newHires = employees.filter(emp => {
      const hireDate = new Date(emp.hire_date);
      return hireDate >= thirtyDaysAgo;
    }).length;

    const inTraining = employees.filter(emp => emp.status === 'On Leave').length;
    const qualified = employees.filter(emp => emp.status === 'Active').length;

    return {
      data: {
        newHires,
        inTraining,
        qualified,
        totalEmployees: employees.length
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