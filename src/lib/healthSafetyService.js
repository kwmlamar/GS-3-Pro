import { supabase } from './supabaseClient';

export const healthSafetyService = {
  // Fetch all incidents with related data
  async getIncidents() {
    const { data, error } = await supabase
      .from('health_safety_incidents')
      .select(`
        id, 
        site_id, 
        description, 
        incident_date, 
        investigation_status, 
        report_url,
        created_at,
        sites ( name )
      `)
      .order('incident_date', { ascending: false });

    if (error) throw error;

    return data.map(inc => ({
      ...inc,
      site_name: inc.sites?.name || 'N/A',
      reported_by_name: 'N/A (User info not available)'
    }));
  },

  // Fetch sites for dropdown
  async getSites() {
    const { data, error } = await supabase
      .from('sites')
      .select('id, name')
      .order('name');

    if (error) throw error;
    return data;
  },

  // Create new incident
  async createIncident(incidentData) {
    const { data, error } = await supabase
      .from('health_safety_incidents')
      .insert([incidentData])
      .select();

    if (error) throw error;
    return data[0];
  },

  // Update existing incident
  async updateIncident(id, updateData) {
    const { data, error } = await supabase
      .from('health_safety_incidents')
      .update(updateData)
      .eq('id', id)
      .select();

    if (error) throw error;
    return data[0];
  },

  // Update incident status
  async updateIncidentStatus(id, status) {
    const { data, error } = await supabase
      .from('health_safety_incidents')
      .update({ investigation_status: status })
      .eq('id', id)
      .select();

    if (error) throw error;
    return data[0];
  },

  // Delete incident
  async deleteIncident(id) {
    const { error } = await supabase
      .from('health_safety_incidents')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  },

  // Get incident statistics
  async getIncidentStats() {
    const { data, error } = await supabase
      .from('health_safety_incidents')
      .select('investigation_status, incident_date');

    if (error) throw error;

    const stats = {
      total: data.length,
      open: data.filter(inc => inc.investigation_status === 'open').length,
      inProgress: data.filter(inc => inc.investigation_status === 'in_progress').length,
      closed: data.filter(inc => inc.investigation_status === 'closed').length,
      thisMonth: data.filter(inc => {
        const incidentDate = new Date(inc.incident_date);
        const now = new Date();
        return incidentDate.getMonth() === now.getMonth() && 
               incidentDate.getFullYear() === now.getFullYear();
      }).length
    };

    return stats;
  },

  // Search incidents
  async searchIncidents(searchTerm) {
    const { data, error } = await supabase
      .from('health_safety_incidents')
      .select(`
        id, 
        site_id, 
        description, 
        incident_date, 
        investigation_status, 
        report_url,
        created_at,
        sites ( name )
      `)
      .or(`description.ilike.%${searchTerm}%,sites.name.ilike.%${searchTerm}%`)
      .order('incident_date', { ascending: false });

    if (error) throw error;

    return data.map(inc => ({
      ...inc,
      site_name: inc.sites?.name || 'N/A',
      reported_by_name: 'N/A (User info not available)'
    }));
  }
}; 