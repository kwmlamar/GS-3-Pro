import { supabase } from './supabaseClient';

// Reports Service
export const reportsService = {
  // Get all reports with optional filtering
  async getReports(filters = {}) {
    try {
      let query = supabase
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      if (filters.type) {
        query = query.eq('report_type', filters.type);
      }
      if (filters.site) {
        query = query.ilike('site_name', `%${filters.site}%`);
      }
      if (filters.officer) {
        query = query.ilike('officer_name', `%${filters.officer}%`);
      }
      if (filters.dateFrom) {
        query = query.gte('report_date', filters.dateFrom);
      }
      if (filters.dateTo) {
        query = query.lte('report_date', filters.dateTo);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching reports:', error);
      throw error;
    }
  },

  // Get a single report by ID
  async getReport(id) {
    try {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching report:', error);
      throw error;
    }
  },

  // Create a new report
  async createReport(reportData) {
    try {
      const { data, error } = await supabase
        .from('reports')
        .insert([reportData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating report:', error);
      throw error;
    }
  },

  // Update a report
  async updateReport(id, updateData) {
    try {
      const { data, error } = await supabase
        .from('reports')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating report:', error);
      throw error;
    }
  },

  // Delete a report
  async deleteReport(id) {
    try {
      const { error } = await supabase
        .from('reports')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting report:', error);
      throw error;
    }
  }
};

// Violations Service
export const violationsService = {
  // Get all violations with optional filtering
  async getViolations(filters = {}) {
    try {
      let query = supabase
        .from('violations')
        .select('*')
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      if (filters.severity) {
        query = query.eq('severity', filters.severity);
      }
      if (filters.type) {
        query = query.eq('type', filters.type);
      }
      if (filters.site) {
        query = query.ilike('site_name', `%${filters.site}%`);
      }
      if (filters.dateFrom) {
        query = query.gte('violation_date', filters.dateFrom);
      }
      if (filters.dateTo) {
        query = query.lte('violation_date', filters.dateTo);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching violations:', error);
      throw error;
    }
  },

  // Get a single violation by ID
  async getViolation(id) {
    try {
      const { data, error } = await supabase
        .from('violations')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching violation:', error);
      throw error;
    }
  },

  // Create a new violation
  async createViolation(violationData) {
    try {
      const { data, error } = await supabase
        .from('violations')
        .insert([violationData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating violation:', error);
      throw error;
    }
  },

  // Update a violation
  async updateViolation(id, updateData) {
    try {
      const { data, error } = await supabase
        .from('violations')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating violation:', error);
      throw error;
    }
  },

  // Delete a violation
  async deleteViolation(id) {
    try {
      const { error } = await supabase
        .from('violations')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting violation:', error);
      throw error;
    }
  }
};

// Observations Service
export const observationsService = {
  // Get all observations with optional filtering
  async getObservations(filters = {}) {
    try {
      let query = supabase
        .from('observations')
        .select('*')
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      if (filters.priority) {
        query = query.eq('priority', filters.priority);
      }
      if (filters.type) {
        query = query.eq('type', filters.type);
      }
      if (filters.site) {
        query = query.ilike('site_name', `%${filters.site}%`);
      }
      if (filters.followUpRequired !== undefined) {
        query = query.eq('follow_up_required', filters.followUpRequired);
      }
      if (filters.dateFrom) {
        query = query.gte('observation_date', filters.dateFrom);
      }
      if (filters.dateTo) {
        query = query.lte('observation_date', filters.dateTo);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching observations:', error);
      throw error;
    }
  },

  // Get a single observation by ID
  async getObservation(id) {
    try {
      const { data, error } = await supabase
        .from('observations')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching observation:', error);
      throw error;
    }
  },

  // Create a new observation
  async createObservation(observationData) {
    try {
      const { data, error } = await supabase
        .from('observations')
        .insert([observationData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating observation:', error);
      throw error;
    }
  },

  // Update an observation
  async updateObservation(id, updateData) {
    try {
      const { data, error } = await supabase
        .from('observations')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating observation:', error);
      throw error;
    }
  },

  // Delete an observation
  async deleteObservation(id) {
    try {
      const { error } = await supabase
        .from('observations')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting observation:', error);
      throw error;
    }
  }
};

// Report Templates Service
export const reportTemplatesService = {
  // Get all templates with optional filtering
  async getTemplates(filters = {}) {
    try {
      let query = supabase
        .from('report_templates')
        .select('*')
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters.type) {
        query = query.eq('template_type', filters.type);
      }
      if (filters.isActive !== undefined) {
        query = query.eq('is_active', filters.isActive);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching templates:', error);
      throw error;
    }
  },

  // Get a single template by ID
  async getTemplate(id) {
    try {
      const { data, error } = await supabase
        .from('report_templates')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching template:', error);
      throw error;
    }
  },

  // Create a new template
  async createTemplate(templateData) {
    try {
      const { data, error } = await supabase
        .from('report_templates')
        .insert([templateData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating template:', error);
      throw error;
    }
  },

  // Update a template
  async updateTemplate(id, updateData) {
    try {
      const { data, error } = await supabase
        .from('report_templates')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating template:', error);
      throw error;
    }
  },

  // Delete a template
  async deleteTemplate(id) {
    try {
      const { error } = await supabase
        .from('report_templates')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting template:', error);
      throw error;
    }
  }
};

// Utility function to generate document numbers
export const generateDocNumber = (type, date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  const typeMap = {
    'Incident': 'SIR',
    'Patrol': 'DPR', 
    'Inspection': 'EIR',
    'Assessment': 'SAR',
    'Violation': 'VR',
    'Observation': 'OL'
  };
  
  const prefix = typeMap[type] || 'RPT';
  return `${prefix}-${year}-${month}${day}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
}; 