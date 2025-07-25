import { supabase } from './supabaseClient';

// Employee types and their requirements
export const EMPLOYEE_TYPES = {
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
    const { data, error } = await supabase
      .from('employees')
      .insert([employeeData])
      .select()
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
      .select('*')
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
      .select('*')
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
    const { data, error } = await supabase
      .from('employees')
      .update(updates)
      .eq('id', id)
      .select()
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
      hire_date: '2023-01-15'
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
      hire_date: '2022-08-20'
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
      hire_date: '2021-03-10'
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
      hire_date: '2022-11-05'
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