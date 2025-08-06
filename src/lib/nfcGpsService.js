import { supabase } from './supabaseClient';

// Helper function to convert PostgreSQL point to lat/lng object
const pointToCoordinates = (point) => {
  if (!point) return null;
  // PostgreSQL point format: "(lat,lng)"
  const match = point.match(/\(([^,]+),([^)]+)\)/);
  if (match) {
    return {
      lat: parseFloat(match[1]),
      lng: parseFloat(match[2])
    };
  }
  return null;
};

// Helper function to convert lat/lng object to PostgreSQL point
const coordinatesToPoint = (coordinates) => {
  if (!coordinates || !coordinates.lat || !coordinates.lng) return null;
  return `(${coordinates.lat},${coordinates.lng})`;
};

// NFC Tags Service
export const nfcGpsService = {
  // Get all NFC tags
  async getNfcTags() {
    try {
      // First check if the table exists by trying a simple query
      const { data: tableCheck, error: tableError } = await supabase
        .from('nfc_tags')
        .select('id')
        .limit(1);

      if (tableError) {
        console.log('NFC tags table does not exist yet. Please run the database setup script.');
        return []; // Return empty array instead of throwing error
      }

      // If table exists, try to get data with relationships
      const { data, error } = await supabase
        .from('nfc_tags')
        .select(`
          *,
          sites (name),
          entity_staff (name)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        // If the join fails, try without relationships
        console.log('Join with sites table failed, trying without relationships...');
        const { data: simpleData, error: simpleError } = await supabase
          .from('nfc_tags')
          .select('*')
          .order('created_at', { ascending: false });

        if (simpleError) {
          console.error('Error fetching NFC tags:', simpleError);
          return [];
        }

        return simpleData.map(tag => ({
          ...tag,
          coordinates: pointToCoordinates(tag.coordinates),
          last_scan_at: tag.last_scan_at ? new Date(tag.last_scan_at).toLocaleString() : null,
          sites: { name: 'Unknown Site' }, // Default value
          entity_staff: { name: 'Unknown Staff' } // Default value
        }));
      }

      // Convert coordinates from PostgreSQL point format
      return data.map(tag => ({
        ...tag,
        coordinates: pointToCoordinates(tag.coordinates),
        last_scan_at: tag.last_scan_at ? new Date(tag.last_scan_at).toLocaleString() : null
      }));
    } catch (error) {
      console.error('Error fetching NFC tags:', error);
      return []; // Return empty array instead of throwing error
    }
  },

  // Get NFC tags by site
  async getNfcTagsBySite(siteId) {
    try {
      const { data, error } = await supabase
        .from('nfc_tags')
        .select(`
          *,
          sites (name),
          entity_staff (name)
        `)
        .eq('site_id', siteId)
        .order('created_at', { ascending: false });

      if (error) {
        // If the join fails, try without relationships
        console.log('Join with sites table failed, trying without relationships...');
        const { data: simpleData, error: simpleError } = await supabase
          .from('nfc_tags')
          .select('*')
          .eq('site_id', siteId)
          .order('created_at', { ascending: false });

        if (simpleError) {
          console.error('Error fetching NFC tags by site:', simpleError);
          return [];
        }

        return simpleData.map(tag => ({
          ...tag,
          coordinates: pointToCoordinates(tag.coordinates),
          last_scan_at: tag.last_scan_at ? new Date(tag.last_scan_at).toLocaleString() : null,
          sites: { name: 'Unknown Site' },
          entity_staff: { name: 'Unknown Staff' }
        }));
      }

      return data.map(tag => ({
        ...tag,
        coordinates: pointToCoordinates(tag.coordinates),
        last_scan_at: tag.last_scan_at ? new Date(tag.last_scan_at).toLocaleString() : null
      }));
    } catch (error) {
      console.error('Error fetching NFC tags by site:', error);
      return [];
    }
  },

  // Create new NFC tag
  async createNfcTag(tagData) {
    try {
      const { data, error } = await supabase
        .from('nfc_tags')
        .insert({
          ...tagData,
          coordinates: coordinatesToPoint(tagData.coordinates)
        })
        .select()
        .single();

      if (error) throw error;

      return {
        ...data,
        coordinates: pointToCoordinates(data.coordinates)
      };
    } catch (error) {
      console.error('Error creating NFC tag:', error);
      throw error;
    }
  },

  // Update NFC tag
  async updateNfcTag(id, updates) {
    try {
      const updateData = { ...updates };
      if (updates.coordinates) {
        updateData.coordinates = coordinatesToPoint(updates.coordinates);
      }

      const { data, error } = await supabase
        .from('nfc_tags')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return {
        ...data,
        coordinates: pointToCoordinates(data.coordinates)
      };
    } catch (error) {
      console.error('Error updating NFC tag:', error);
      throw error;
    }
  },

  // Delete NFC tag
  async deleteNfcTag(id) {
    try {
      const { error } = await supabase
        .from('nfc_tags')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting NFC tag:', error);
      throw error;
    }
  },

  // Get all GPS locations
  async getGpsLocations() {
    try {
      // First check if the table exists
      const { data: tableCheck, error: tableError } = await supabase
        .from('gps_locations')
        .select('id')
        .limit(1);

      if (tableError) {
        console.log('GPS locations table does not exist yet. Please run the database setup script.');
        return []; // Return empty array instead of throwing error
      }

      // Try to get data with relationships first
      const { data, error } = await supabase
        .from('gps_locations')
        .select(`
          *,
          sites (name),
          entity_staff (name)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        // If the join fails, try without relationships
        console.log('Join with sites table failed, trying without relationships...');
        const { data: simpleData, error: simpleError } = await supabase
          .from('gps_locations')
          .select('*')
          .order('created_at', { ascending: false });

        if (simpleError) {
          console.error('Error fetching GPS locations:', simpleError);
          return [];
        }

        return simpleData.map(location => ({
          ...location,
          coordinates: pointToCoordinates(location.coordinates),
          last_check_in_at: location.last_check_in_at ? new Date(location.last_check_in_at).toLocaleString() : null,
          sites: { name: 'Unknown Site' }, // Default value
          entity_staff: { name: 'Unknown Staff' } // Default value
        }));
      }

      return data.map(location => ({
        ...location,
        coordinates: pointToCoordinates(location.coordinates),
        last_check_in_at: location.last_check_in_at ? new Date(location.last_check_in_at).toLocaleString() : null
      }));
    } catch (error) {
      console.error('Error fetching GPS locations:', error);
      return []; // Return empty array instead of throwing error
    }
  },

  // Get GPS locations by site
  async getGpsLocationsBySite(siteId) {
    try {
      const { data, error } = await supabase
        .from('gps_locations')
        .select(`
          *,
          sites (name),
          entity_staff (name)
        `)
        .eq('site_id', siteId)
        .order('created_at', { ascending: false });

      if (error) {
        // If the join fails, try without relationships
        console.log('Join with sites table failed, trying without relationships...');
        const { data: simpleData, error: simpleError } = await supabase
          .from('gps_locations')
          .select('*')
          .eq('site_id', siteId)
          .order('created_at', { ascending: false });

        if (simpleError) {
          console.error('Error fetching GPS locations by site:', simpleError);
          return [];
        }

        return simpleData.map(location => ({
          ...location,
          coordinates: pointToCoordinates(location.coordinates),
          last_check_in_at: location.last_check_in_at ? new Date(location.last_check_in_at).toLocaleString() : null,
          sites: { name: 'Unknown Site' },
          entity_staff: { name: 'Unknown Staff' }
        }));
      }

      return data.map(location => ({
        ...location,
        coordinates: pointToCoordinates(location.coordinates),
        last_check_in_at: location.last_check_in_at ? new Date(location.last_check_in_at).toLocaleString() : null
      }));
    } catch (error) {
      console.error('Error fetching GPS locations by site:', error);
      return [];
    }
  },

  // Create new GPS location
  async createGpsLocation(locationData) {
    try {
      const { data, error } = await supabase
        .from('gps_locations')
        .insert({
          ...locationData,
          coordinates: coordinatesToPoint(locationData.coordinates)
        })
        .select()
        .single();

      if (error) throw error;

      return {
        ...data,
        coordinates: pointToCoordinates(data.coordinates)
      };
    } catch (error) {
      console.error('Error creating GPS location:', error);
      throw error;
    }
  },

  // Update GPS location
  async updateGpsLocation(id, updates) {
    try {
      const updateData = { ...updates };
      if (updates.coordinates) {
        updateData.coordinates = coordinatesToPoint(updates.coordinates);
      }

      const { data, error } = await supabase
        .from('gps_locations')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return {
        ...data,
        coordinates: pointToCoordinates(data.coordinates)
      };
    } catch (error) {
      console.error('Error updating GPS location:', error);
      throw error;
    }
  },

  // Delete GPS location
  async deleteGpsLocation(id) {
    try {
      const { error } = await supabase
        .from('gps_locations')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting GPS location:', error);
      throw error;
    }
  },

  // Log a scan
  async logScan(scanData) {
    try {
      const { data, error } = await supabase
        .from('scan_logs')
        .insert({
          ...scanData,
          coordinates: coordinatesToPoint(scanData.coordinates)
        })
        .select()
        .single();

      if (error) throw error;

      // Update the last scan time for the tag/location
      if (scanData.tag_id) {
        await supabase
          .from('nfc_tags')
          .update({
            last_scan_at: new Date().toISOString(),
            last_scan_by: scanData.scanned_by
          })
          .eq('id', scanData.tag_id);
      }

      if (scanData.gps_location_id) {
        await supabase
          .from('gps_locations')
          .update({
            last_check_in_at: new Date().toISOString(),
            last_check_in_by: scanData.scanned_by
          })
          .eq('id', scanData.gps_location_id);
      }

      return {
        ...data,
        coordinates: pointToCoordinates(data.coordinates)
      };
    } catch (error) {
      console.error('Error logging scan:', error);
      throw error;
    }
  },

  // Get scan logs
  async getScanLogs(filters = {}) {
    try {
      let query = supabase
        .from('scan_logs')
        .select(`
          *,
          nfc_tags (tag_id, name),
          gps_locations (name),
          entity_staff (name)
        `)
        .order('scan_timestamp', { ascending: false });

      if (filters.tag_id) {
        query = query.eq('tag_id', filters.tag_id);
      }

      if (filters.gps_location_id) {
        query = query.eq('gps_location_id', filters.gps_location_id);
      }

      if (filters.scanned_by) {
        query = query.eq('scanned_by', filters.scanned_by);
      }

      if (filters.scan_type) {
        query = query.eq('scan_type', filters.scan_type);
      }

      const { data, error } = await query;

      if (error) throw error;

      return data.map(log => ({
        ...log,
        coordinates: pointToCoordinates(log.coordinates),
        scan_timestamp: new Date(log.scan_timestamp).toLocaleString()
      }));
    } catch (error) {
      console.error('Error fetching scan logs:', error);
      throw error;
    }
  },

  // Get scan statistics
  async getScanStatistics() {
    try {
      // First check if the table exists
      const { data: tableCheck, error: tableError } = await supabase
        .from('scan_logs')
        .select('id')
        .limit(1);

      if (tableError) {
        console.log('Scan logs table does not exist yet. Please run the database setup script.');
        return {
          totalScans: 0,
          nfcScans: 0,
          gpsScans: 0,
          manualScans: 0,
          last24Hours: 0
        };
      }

      const { data, error } = await supabase
        .from('scan_logs')
        .select('scan_type, scan_timestamp')
        .gte('scan_timestamp', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()); // Last 24 hours

      if (error) {
        console.error('Error fetching scan statistics:', error);
        return {
          totalScans: 0,
          nfcScans: 0,
          gpsScans: 0,
          manualScans: 0,
          last24Hours: 0
        };
      }

      const stats = {
        totalScans: data.length,
        nfcScans: data.filter(log => log.scan_type === 'NFC').length,
        gpsScans: data.filter(log => log.scan_type === 'GPS').length,
        manualScans: data.filter(log => log.scan_type === 'Manual').length,
        last24Hours: data.length
      };

      return stats;
    } catch (error) {
      console.error('Error fetching scan statistics:', error);
      return {
        totalScans: 0,
        nfcScans: 0,
        gpsScans: 0,
        manualScans: 0,
        last24Hours: 0
      };
    }
  }
}; 