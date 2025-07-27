// Updated employeeService functions to work with the new departments table

import { supabase } from './supabaseClient';

// Get departments from the new departments table
export const getDepartments = async () => {
  try {
    const { data, error } = await supabase
      .from('departments')
      .select('id, name, description, is_active, site_id')
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

// Update department
export const updateDepartment = async (id, updates) => {
  try {
    const { data, error } = await supabase
      .from('departments')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error updating department:', error);
    return { data: null, error };
  }
};

// Get department by ID
export const getDepartmentById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('departments')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching department:', error);
    return { data: null, error };
  }
};

// Get department summary with employee counts
export const getDepartmentSummary = async () => {
  try {
    const { data, error } = await supabase
      .from('department_summary')
      .select('*')
      .order('name');

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching department summary:', error);
    return { data: null, error };
  }
};

// Updated createEmployee function to handle department_id
export const createEmployee = async (employeeData) => {
  try {
    // If department is provided as a string, try to find or create the department
    if (employeeData.department && !employeeData.department_id) {
      const { data: existingDept } = await supabase
        .from('departments')
        .select('id')
        .eq('name', employeeData.department)
        .eq('is_active', true)
        .single();

      if (existingDept) {
        employeeData.department_id = existingDept.id;
      } else {
        // Create new department
        const { data: newDept, error: deptError } = await createDepartment({
          name: employeeData.department,
          description: `Department for ${employeeData.department}`,
          is_active: true
        });

        if (deptError) throw deptError;
        employeeData.department_id = newDept.id;
      }
    }

    // Remove the string department field as we now use department_id
    const { department, ...employeeDataToSave } = employeeData;

    const { data, error } = await supabase
      .from('employees')
      .insert([employeeDataToSave])
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

// Updated getEmployees function to include department information
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
    console.error('Error fetching employees:', error);
    return { data: null, error };
  }
};

// Updated updateEmployee function to handle department changes
export const updateEmployee = async (id, updates) => {
  try {
    // Handle department updates
    if (updates.department && !updates.department_id) {
      const { data: existingDept } = await supabase
        .from('departments')
        .select('id')
        .eq('name', updates.department)
        .eq('is_active', true)
        .single();

      if (existingDept) {
        updates.department_id = existingDept.id;
      } else {
        // Create new department
        const { data: newDept, error: deptError } = await createDepartment({
          name: updates.department,
          description: `Department for ${updates.department}`,
          is_active: true
        });

        if (deptError) throw deptError;
        updates.department_id = newDept.id;
      }
    }

    // Remove the string department field
    const { department, ...updatesToSave } = updates;

    const { data, error } = await supabase
      .from('employees')
      .update(updatesToSave)
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