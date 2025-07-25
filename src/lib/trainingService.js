import { supabase } from './supabaseClient';

// Training Courses
export const getTrainingCourses = async () => {
  try {
    const { data, error } = await supabase
      .from('training_courses')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching training courses:', error);
    throw error;
  }
};

export const getTrainingCourseById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('training_courses')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching training course:', error);
    throw error;
  }
};

export const createTrainingCourse = async (courseData) => {
  try {
    const { data, error } = await supabase
      .from('training_courses')
      .insert([courseData])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating training course:', error);
    throw error;
  }
};

export const updateTrainingCourse = async (id, updates) => {
  try {
    const { data, error } = await supabase
      .from('training_courses')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating training course:', error);
    throw error;
  }
};

export const deleteTrainingCourse = async (id) => {
  try {
    const { error } = await supabase
      .from('training_courses')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error deleting training course:', error);
    throw error;
  }
};

// Training Enrollments
export const getTrainingEnrollments = async () => {
  try {
    const { data, error } = await supabase
      .from('training_enrollments')
      .select(`
        *,
        training_courses (
          id,
          title,
          type,
          duration_hours
        ),
        employees (
          id,
          name,
          role,
          site
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching training enrollments:', error);
    throw error;
  }
};

export const getEnrollmentsByCourse = async (courseId) => {
  try {
    const { data, error } = await supabase
      .from('training_enrollments')
      .select(`
        *,
        employees (
          id,
          name,
          role,
          site
        )
      `)
      .eq('course_id', courseId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching course enrollments:', error);
    throw error;
  }
};

export const enrollEmployeeInCourse = async (enrollmentData) => {
  try {
    const { data, error } = await supabase
      .from('training_enrollments')
      .insert([enrollmentData])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error enrolling employee:', error);
    throw error;
  }
};

export const updateEnrollmentProgress = async (id, updates) => {
  try {
    const { data, error } = await supabase
      .from('training_enrollments')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating enrollment:', error);
    throw error;
  }
};

// Certificates
export const getCertificates = async () => {
  try {
    const { data, error } = await supabase
      .from('certificates')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching certificates:', error);
    throw error;
  }
};

export const getCertificateById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('certificates')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching certificate:', error);
    throw error;
  }
};

export const createCertificate = async (certificateData) => {
  try {
    const { data, error } = await supabase
      .from('certificates')
      .insert([certificateData])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating certificate:', error);
    throw error;
  }
};

// Certificate Issuances
export const getCertificateIssuances = async () => {
  try {
    const { data, error } = await supabase
      .from('certificate_issuances')
      .select(`
        *,
        certificates (
          id,
          name,
          template_name,
          validity_months
        ),
        employees (
          id,
          name,
          role,
          site
        )
      `)
      .order('issued_date', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching certificate issuances:', error);
    throw error;
  }
};

export const issueCertificate = async (issuanceData) => {
  try {
    const { data, error } = await supabase
      .from('certificate_issuances')
      .insert([issuanceData])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error issuing certificate:', error);
    throw error;
  }
};

// Analytics and Statistics
export const getTrainingStats = async () => {
  try {
    // Get total courses
    const { data: courses, error: coursesError } = await supabase
      .from('training_courses')
      .select('id', { count: 'exact' });

    if (coursesError) throw coursesError;

    // Get total enrollments
    const { data: enrollments, error: enrollmentsError } = await supabase
      .from('training_enrollments')
      .select('id', { count: 'exact' });

    if (enrollmentsError) throw enrollmentsError;

    // Get completed enrollments
    const { data: completed, error: completedError } = await supabase
      .from('training_enrollments')
      .select('id', { count: 'exact' })
      .eq('status', 'Completed');

    if (completedError) throw completedError;

    // Get total certificates issued
    const { data: certificates, error: certificatesError } = await supabase
      .from('certificate_issuances')
      .select('id', { count: 'exact' });

    if (certificatesError) throw certificatesError;

    return {
      totalCourses: courses?.length || 0,
      totalEnrollments: enrollments?.length || 0,
      completedEnrollments: completed?.length || 0,
      totalCertificatesIssued: certificates?.length || 0,
      completionRate: enrollments?.length > 0 ? (completed?.length / enrollments?.length * 100).toFixed(1) : 0
    };
  } catch (error) {
    console.error('Error fetching training stats:', error);
    throw error;
  }
};

export const getCourseStats = async (courseId) => {
  try {
    const { data, error } = await supabase
      .from('training_enrollments')
      .select('*')
      .eq('course_id', courseId);

    if (error) throw error;

    const totalEnrolled = data.length;
    const completed = data.filter(e => e.status === 'Completed').length;
    const inProgress = data.filter(e => e.status === 'In Progress').length;
    const enrolled = data.filter(e => e.status === 'Enrolled').length;

    return {
      totalEnrolled,
      completed,
      inProgress,
      enrolled,
      completionRate: totalEnrolled > 0 ? (completed / totalEnrolled * 100).toFixed(1) : 0
    };
  } catch (error) {
    console.error('Error fetching course stats:', error);
    throw error;
  }
};

// Search functionality
export const searchTrainingCourses = async (searchTerm) => {
  try {
    const { data, error } = await supabase
      .from('training_courses')
      .select('*')
      .or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,type.ilike.%${searchTerm}%`)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error searching training courses:', error);
    throw error;
  }
}; 