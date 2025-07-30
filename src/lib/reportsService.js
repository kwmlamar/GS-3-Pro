import { supabase } from './supabaseClient';

// Reports Service
export const reportsService = {
  // Check if new columns exist
  async checkNewColumnsExist() {
    try {
      const { data, error } = await supabase
        .from('reports')
        .select('site_id, entity_officer_id, security_officer_id')
        .limit(1);
      
      return !error;
    } catch (error) {
      return false;
    }
  },

  // Get all reports with optional filtering
  async getReports(filters = {}) {
    try {
      const hasNewColumns = await this.checkNewColumnsExist();
      
      // Fetch from all three tables
      const [reportsData, violationsData, observationsData] = await Promise.all([
        // Fetch from reports table
        (async () => {
          try {
            let query = supabase
              .from('reports')
              .select(hasNewColumns ? `
                *,
                site:site_id(id, name, type),
                entity_officer:entity_officer_id(id, name, role),
                security_officer:security_officer_id(id, first_name, last_name, position)
              ` : '*')
              .order('created_at', { ascending: false });

            // Apply filters
            if (filters.status) {
              query = query.eq('status', filters.status);
            }
            if (filters.type && filters.type !== 'Violation' && filters.type !== 'Observation') {
              query = query.eq('report_type', filters.type);
            }
            if (filters.site && hasNewColumns) {
              query = query.eq('site_id', filters.site);
            }
            if (filters.entityOfficer && hasNewColumns) {
              query = query.eq('entity_officer_id', filters.entityOfficer);
            }
            if (filters.securityOfficer && hasNewColumns) {
              query = query.eq('security_officer_id', filters.securityOfficer);
            }
            if (filters.dateFrom) {
              query = query.gte('report_date', filters.dateFrom);
            }
            if (filters.dateTo) {
              query = query.lte('report_date', filters.dateTo);
            }

            const { data, error } = await query;
            if (error) throw error;
            
            // Transform the data to include officer names
            const transformedData = data.map(report => ({
              ...report,
              site_name: hasNewColumns ? (report.site?.name || 'Not assigned') : (report.site_name || 'Not assigned'),
              site_type: hasNewColumns ? (report.site?.type || null) : null,
              entity_officer_name: hasNewColumns ? (report.entity_officer?.name || 'Not assigned') : (report.officer_name || 'Not assigned'),
              security_officer_name: hasNewColumns ? (report.security_officer ? 
                `${report.security_officer.first_name} ${report.security_officer.last_name}` : 'Not assigned') : 'Not assigned',
              original_table: 'reports'
            }));
            
            return transformedData;
          } catch (error) {
            console.error('Error fetching reports:', error);
            return [];
          }
        })(),
        
        // Fetch from violations table
        (async () => {
          try {
            let query = supabase
              .from('violations')
              .select(hasNewColumns ? `
                *,
                site:site_id(id, name, type),
                entity_officer:entity_officer_id(id, name, role),
                security_officer:security_officer_id(id, first_name, last_name, position)
              ` : '*')
              .order('created_at', { ascending: false });

            // Apply filters
            if (filters.status) {
              query = query.eq('status', filters.status);
            }
            if (filters.type === 'Violation') {
              // Only include violations if specifically requested
            } else if (filters.type && filters.type !== 'Violation') {
              // Skip violations for other types
              return [];
            }
            if (filters.site && hasNewColumns) {
              query = query.eq('site_id', filters.site);
            }
            if (filters.entityOfficer && hasNewColumns) {
              query = query.eq('entity_officer_id', filters.entityOfficer);
            }
            if (filters.securityOfficer && hasNewColumns) {
              query = query.eq('security_officer_id', filters.securityOfficer);
            }
            if (filters.dateFrom) {
              query = query.gte('violation_date', filters.dateFrom);
            }
            if (filters.dateTo) {
              query = query.lte('violation_date', filters.dateTo);
            }

            const { data, error } = await query;
            if (error) throw error;
            
            // Transform violations to report format
            const transformedData = data.map(violation => ({
              id: violation.id,
              title: violation.type,
              report_type: 'Violation',
              doc_number: `VR-${violation.id}`,
              site_id: violation.site_id,
              site_name: hasNewColumns ? (violation.site?.name || 'Not assigned') : (violation.site_name || 'Not assigned'),
              site_type: hasNewColumns ? (violation.site?.type || null) : null,
              entity_officer_id: violation.entity_officer_id,
              entity_officer_name: hasNewColumns ? (violation.entity_officer?.name || 'Not assigned') : (violation.reported_by_name || 'Not assigned'),
              security_officer_id: violation.security_officer_id,
              security_officer_name: hasNewColumns ? (violation.security_officer ? 
                `${violation.security_officer.first_name} ${violation.security_officer.last_name}` : 'Not assigned') : 'Not assigned',
              report_date: violation.violation_date,
              status: violation.status,
              priority: violation.severity,
              description: violation.description,
              findings: violation.resolution_notes,
              recommendations: violation.corrective_actions,
              attachments: violation.attachments,
              created_at: violation.created_at,
              updated_at: violation.updated_at,
              original_table: 'violations'
            }));
            
            return transformedData;
          } catch (error) {
            console.error('Error fetching violations:', error);
            return [];
          }
        })(),
        
        // Fetch from observations table
        (async () => {
          try {
            let query = supabase
              .from('observations')
              .select(hasNewColumns ? `
                *,
                site:site_id(id, name, type),
                entity_officer:entity_officer_id(id, name, role),
                security_officer:security_officer_id(id, first_name, last_name, position)
              ` : '*')
              .order('created_at', { ascending: false });

            // Apply filters
            if (filters.status) {
              query = query.eq('status', filters.status);
            }
            if (filters.type === 'Observation') {
              // Only include observations if specifically requested
            } else if (filters.type && filters.type !== 'Observation') {
              // Skip observations for other types
              return [];
            }
            if (filters.site && hasNewColumns) {
              query = query.eq('site_id', filters.site);
            }
            if (filters.entityOfficer && hasNewColumns) {
              query = query.eq('entity_officer_id', filters.entityOfficer);
            }
            if (filters.securityOfficer && hasNewColumns) {
              query = query.eq('security_officer_id', filters.securityOfficer);
            }
            if (filters.dateFrom) {
              query = query.gte('observation_date', filters.dateFrom);
            }
            if (filters.dateTo) {
              query = query.lte('observation_date', filters.dateTo);
            }

            const { data, error } = await query;
            if (error) throw error;
            
            // Transform observations to report format
            const transformedData = data.map(observation => ({
              id: observation.id,
              title: observation.type,
              report_type: 'Observation',
              doc_number: `OL-${observation.id}`,
              site_id: observation.site_id,
              site_name: hasNewColumns ? (observation.site?.name || 'Not assigned') : (observation.site_name || 'Not assigned'),
              site_type: hasNewColumns ? (observation.site?.type || null) : null,
              entity_officer_id: observation.entity_officer_id,
              entity_officer_name: hasNewColumns ? (observation.entity_officer?.name || 'Not assigned') : (observation.observer_name || 'Not assigned'),
              security_officer_id: observation.security_officer_id,
              security_officer_name: hasNewColumns ? (observation.security_officer ? 
                `${observation.security_officer.first_name} ${observation.security_officer.last_name}` : 'Not assigned') : 'Not assigned',
              report_date: observation.observation_date,
              status: observation.status,
              priority: observation.priority,
              description: observation.description,
              findings: observation.follow_up_notes,
              recommendations: observation.follow_up_notes,
              attachments: observation.attachments,
              created_at: observation.created_at,
              updated_at: observation.updated_at,
              original_table: 'observations'
            }));
            
            return transformedData;
          } catch (error) {
            console.error('Error fetching observations:', error);
            return [];
          }
        })()
      ]);
      
      // Combine all results and sort by created_at
      const allReports = [...reportsData, ...violationsData, ...observationsData];
      allReports.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      
      return allReports;
    } catch (error) {
      console.error('Error fetching reports:', error);
      throw error;
    }
  },

  // Get a single report by ID
  async getReport(id) {
    try {
      const hasNewColumns = await this.checkNewColumnsExist();
      
      if (hasNewColumns) {
        // Use new structure with joins
        const { data, error } = await supabase
          .from('reports')
          .select(`
            *,
            site:site_id(id, name, type),
            entity_officer:entity_officer_id(id, name, role),
            security_officer:security_officer_id(id, first_name, last_name, position)
          `)
          .eq('id', id)
          .single();
        
        if (error) throw error;
        
        // Transform the data to include officer names
        const transformedData = {
          ...data,
          site_name: data.site?.name || 'Not assigned',
          site_type: data.site?.type || null,
          entity_officer_name: data.entity_officer?.name || 'Not assigned',
          security_officer_name: data.security_officer ? 
            `${data.security_officer.first_name} ${data.security_officer.last_name}` : 'Not assigned'
        };
        
        return transformedData;
      } else {
        // Use old structure without joins
        const { data, error } = await supabase
          .from('reports')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) throw error;
        
        // Transform the data to include officer names
        const transformedData = {
          ...data,
          site_name: data.site_name || 'Not assigned', // Use existing site_name field
          site_type: null, // Will be populated after migration
          entity_officer_name: data.officer_name || 'Not assigned', // Use existing officer_name field
          security_officer_name: 'Not assigned', // Will be populated after migration
          entity_officer_id: null, // Will be populated after migration
          security_officer_id: null, // Will be populated after migration
          site_id: null // Will be populated after migration
        };
        
        return transformedData;
      }
    } catch (error) {
      console.error('Error fetching report:', error);
      throw error;
    }
  },

  // Create a new report
  async createReport(reportData) {
    try {
      const hasNewColumns = await this.checkNewColumnsExist();
      
      // Determine which table to use based on report type
      const reportType = reportData.report_type;
      let targetTable = 'reports';
      let transformedData = reportData;
      
      if (reportType === 'Violation') {
        targetTable = 'violations';
        // Transform report data to violation format
        transformedData = {
          type: reportData.title,
          description: reportData.description,
          severity: reportData.priority === 'Critical' ? 'High' : reportData.priority,
          location: reportData.site_name || 'Not specified',
          site_id: reportData.site_id,
          site_name: reportData.site_name,
          reported_by_id: reportData.entity_officer_id || reportData.security_officer_id,
          reported_by_name: reportData.entity_officer_name || reportData.security_officer_name,
          violation_date: reportData.report_date,
          status: reportData.status,
          resolution_notes: reportData.findings,
          corrective_actions: reportData.recommendations,
          attachments: reportData.attachments,
          entity_officer_id: reportData.entity_officer_id,
          security_officer_id: reportData.security_officer_id
        };
      } else if (reportType === 'Observation') {
        targetTable = 'observations';
        // Transform report data to observation format
        transformedData = {
          type: reportData.title,
          description: reportData.description,
          priority: reportData.priority,
          location: reportData.site_name || 'Not specified',
          site_id: reportData.site_id,
          site_name: reportData.site_name,
          observer_id: reportData.entity_officer_id || reportData.security_officer_id,
          observer_name: reportData.entity_officer_name || reportData.security_officer_name,
          observation_date: reportData.report_date,
          status: reportData.status,
          follow_up_required: reportData.priority === 'High' || reportData.priority === 'Critical',
          follow_up_notes: reportData.recommendations,
          attachments: reportData.attachments,
          entity_officer_id: reportData.entity_officer_id,
          security_officer_id: reportData.security_officer_id
        };
      }
      
      console.log(`📋 Creating ${reportType} in ${targetTable} table`);
      
      if (targetTable === 'reports') {
        // Use existing reports logic
        if (hasNewColumns) {
          // Use new structure
          const { data, error } = await supabase
            .from('reports')
            .insert([transformedData])
            .select()
            .single();
          
          if (error) throw error;
          return data;
        } else {
          // Use old structure - remove new fields that don't exist yet
          const { site_id, entity_officer_id, security_officer_id, ...dataToSave } = transformedData;
          
          const { data, error } = await supabase
            .from('reports')
            .insert([dataToSave])
            .select()
            .single();
          
          if (error) throw error;
          return data;
        }
      } else if (targetTable === 'violations') {
        // Create in violations table
        const { data, error } = await supabase
          .from('violations')
          .insert([transformedData])
          .select()
          .single();
        
        if (error) throw error;
        return { ...data, report_type: 'Violation', original_table: 'violations' };
      } else if (targetTable === 'observations') {
        // Create in observations table
        const { data, error } = await supabase
          .from('observations')
          .insert([transformedData])
          .select()
          .single();
        
        if (error) throw error;
        return { ...data, report_type: 'Observation', original_table: 'observations' };
      }
    } catch (error) {
      console.error('Error creating report:', error);
      throw error;
    }
  },

  // Update a report
  async updateReport(id, updateData) {
    try {
      const hasNewColumns = await this.checkNewColumnsExist();
      
      if (hasNewColumns) {
        // Use new structure
        const { data, error } = await supabase
          .from('reports')
          .update(updateData)
          .eq('id', id)
          .select()
          .single();
        
        if (error) throw error;
        return data;
      } else {
        // Use old structure - remove new fields that don't exist yet
        const { site_id, entity_officer_id, security_officer_id, ...dataToUpdate } = updateData;
        
        const { data, error } = await supabase
          .from('reports')
          .update(dataToUpdate)
          .eq('id', id)
          .select()
          .single();
        
        if (error) throw error;
        return data;
      }
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