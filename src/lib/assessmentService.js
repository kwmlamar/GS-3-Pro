import { supabase } from './supabaseClient';

export const assessmentService = {
  // Get all assessments with optional filtering
  async getAssessments(filters = {}) {
    try {
      let query = supabase
        .from('assessments')
        .select('*')
        .order('scheduled_date', { ascending: false });

      // Apply filters
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      if (filters.priority) {
        query = query.eq('priority', filters.priority);
      }
      if (filters.assessment_type) {
        query = query.eq('assessment_type', filters.assessment_type);
      }
      if (filters.search) {
        query = query.or(`client_name.ilike.%${filters.search}%,location.ilike.%${filters.search}%`);
      }

      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching assessments:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getAssessments:', error);
      throw error;
    }
  },

  // Get a single assessment by ID
  async getAssessment(id) {
    try {
      const { data, error } = await supabase
        .from('assessments')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching assessment:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in getAssessment:', error);
      throw error;
    }
  },

  // Create a new assessment
  async createAssessment(assessmentData) {
    try {
      const { data, error } = await supabase
        .from('assessments')
        .insert([assessmentData])
        .select()
        .single();

      if (error) {
        console.error('Error creating assessment:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in createAssessment:', error);
      throw error;
    }
  },

  // Update an assessment
  async updateAssessment(id, updateData) {
    try {
      const { data, error } = await supabase
        .from('assessments')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating assessment:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in updateAssessment:', error);
      throw error;
    }
  },

  // Delete an assessment
  async deleteAssessment(id) {
    try {
      const { error } = await supabase
        .from('assessments')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting assessment:', error);
        throw error;
      }

      return { success: true };
    } catch (error) {
      console.error('Error in deleteAssessment:', error);
      throw error;
    }
  },

  // Get assessment templates
  async getAssessmentTemplates() {
    try {
      const { data, error } = await supabase
        .from('assessment_templates')
        .select('*')
        .eq('is_active', true)
        .order('title');

      if (error) {
        console.error('Error fetching assessment templates:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getAssessmentTemplates:', error);
      throw error;
    }
  },

  // Get services for a specific assessment
  async getAssessmentServices(assessmentId) {
    try {
      const { data, error } = await supabase
        .from('assessment_services')
        .select('*')
        .eq('assessment_id', assessmentId)
        .order('service_name');

      if (error) {
        console.error('Error fetching assessment services:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getAssessmentServices:', error);
      throw error;
    }
  },

  // Update assessment services
  async updateAssessmentServices(assessmentId, services) {
    try {
      // First, delete existing services for this assessment
      const { error: deleteError } = await supabase
        .from('assessment_services')
        .delete()
        .eq('assessment_id', assessmentId);

      if (deleteError) {
        console.error('Error deleting existing assessment services:', deleteError);
        throw deleteError;
      }

      // Then insert the new services
      if (services && services.length > 0) {
        const servicesToInsert = services.map(service => ({
          assessment_id: assessmentId,
          service_name: service.name,
          is_included: service.is_included,
          notes: service.notes
        }));

        const { data, error: insertError } = await supabase
          .from('assessment_services')
          .insert(servicesToInsert)
          .select();

        if (insertError) {
          console.error('Error inserting assessment services:', insertError);
          throw insertError;
        }

        return data;
      }

      return [];
    } catch (error) {
      console.error('Error in updateAssessmentServices:', error);
      throw error;
    }
  },

  // Get assessment statistics
  async getAssessmentStats() {
    try {
      const { data, error } = await supabase
        .from('assessments')
        .select('status, priority, assessment_type');

      if (error) {
        console.error('Error fetching assessment stats:', error);
        throw error;
      }

      const stats = {
        total: data.length,
        byStatus: {},
        byPriority: {},
        byType: {}
      };

      data.forEach(assessment => {
        // Count by status
        stats.byStatus[assessment.status] = (stats.byStatus[assessment.status] || 0) + 1;
        
        // Count by priority
        stats.byPriority[assessment.priority] = (stats.byPriority[assessment.priority] || 0) + 1;
        
        // Count by type
        stats.byType[assessment.assessment_type] = (stats.byType[assessment.assessment_type] || 0) + 1;
      });

      return stats;
    } catch (error) {
      console.error('Error in getAssessmentStats:', error);
      throw error;
    }
  }
}; 