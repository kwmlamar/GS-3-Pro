import { supabase } from './supabaseClient';

// Get all clients
export const getClients = async () => {
  try {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('status', 'Active')
      .order('name');

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching clients:', error);
    return { data: null, error };
  }
};

// Get client by ID
export const getClientById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching client:', error);
    return { data: null, error };
  }
};

// Search clients
export const searchClients = async (searchTerm) => {
  try {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .or(`name.ilike.%${searchTerm}%,contact_person.ilike.%${searchTerm}%,industry.ilike.%${searchTerm}%`)
      .eq('status', 'Active')
      .order('name');

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error searching clients:', error);
    return { data: null, error };
  }
};

// Get clients by industry
export const getClientsByIndustry = async (industry) => {
  try {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('industry', industry)
      .eq('status', 'Active')
      .order('name');

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching clients by industry:', error);
    return { data: null, error };
  }
};

// Get client statistics
export const getClientStats = async () => {
  try {
    // Get all active clients
    const { data: clients, error: clientsError } = await supabase
      .from('clients')
      .select('industry, status')
      .eq('status', 'Active');

    if (clientsError) throw clientsError;

    // Get total count
    const { count: total, error: countError } = await supabase
      .from('clients')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'Active');

    if (countError) throw countError;

    // Calculate industry counts
    const industries = [...new Set(clients.map(client => client.industry))];
    const industryCounts = industries.reduce((acc, industry) => {
      acc[industry] = clients.filter(client => client.industry === industry).length;
      return acc;
    }, {});

    return {
      data: {
        total: total || 0,
        active: total || 0,
        byIndustry: industryCounts,
        industries
      },
      error: null
    };
  } catch (error) {
    console.error('Error fetching client stats:', error);
    return { data: null, error };
  }
};

// Create a new client
export const createClient = async (clientData) => {
  try {
    const { data, error } = await supabase
      .from('clients')
      .insert([clientData])
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error creating client:', error);
    return { data: null, error };
  }
};

// Update a client
export const updateClient = async (id, updates) => {
  try {
    const { data, error } = await supabase
      .from('clients')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error updating client:', error);
    return { data: null, error };
  }
};

// Delete a client (soft delete by setting status to Inactive)
export const deleteClient = async (id) => {
  try {
    const { data, error } = await supabase
      .from('clients')
      .update({ status: 'Inactive' })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error deleting client:', error);
    return { data: null, error };
  }
}; 