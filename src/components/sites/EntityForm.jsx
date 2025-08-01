import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabaseClient';
import { getClients, createClient } from '@/lib/clientService';
import { Save, ArrowLeft } from 'lucide-react';
import { siteTypes, iosInputStyle, iosButtonStyle } from '@/pages/Sites';

const EntityForm = ({ isEditing, currentSite, clients, allSitesForParent, onSuccess, onCancel }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [clientsList, setClientsList] = useState([]);
  const [clientsLoading, setClientsLoading] = useState(true);
  const [showNewClientInput, setShowNewClientInput] = useState(false);
  const [newClient, setNewClient] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    parent_id: null,
    client_id: null,
    address: '{}',
    gps_coordinates: '{}',
  });

  useEffect(() => {
    // Load clients
    const loadClients = async () => {
      try {
        const { data, error } = await getClients();
        if (error) throw error;
        setClientsList(data || []);
      } catch (error) {
        console.error('Error loading clients:', error);
        toast({
          title: "Error",
          description: "Failed to load clients.",
          variant: "destructive"
        });
      } finally {
        setClientsLoading(false);
      }
    };

    loadClients();
  }, [toast]);

  useEffect(() => {
    if (isEditing && currentSite) {
      setFormData({
        name: currentSite.name || '',
        type: currentSite.type || '',
        parent_id: currentSite.parent_id ? currentSite.parent_id.toString() : null,
        client_id: currentSite.client_id || null,
        address: currentSite.address ? JSON.stringify(currentSite.address, null, 2) : '{}',
        gps_coordinates: currentSite.gps_coordinates ? JSON.stringify(currentSite.gps_coordinates, null, 2) : '{}',
      });
    } else {
      setFormData({ name: '', type: '', parent_id: null, client_id: null, address: '{}', gps_coordinates: '{}' });
    }
  }, [isEditing, currentSite]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ 
      ...prev, 
      [name]: value === 'none' ? null : (name === 'parent_id' ? parseInt(value) : value)
    }));
  };

  const handleClientChange = (value) => {
    if (value === 'add_new') {
      setShowNewClientInput(true);
      setNewClient('');
    } else {
      setShowNewClientInput(false);
      setFormData(prev => ({
        ...prev,
        client_id: value === 'none' ? null : parseInt(value)
      }));
    }
  };

  const handleNewClientSubmit = async () => {
    if (newClient.trim()) {
      try {
        const { data, error } = await createClient({
          name: newClient.trim(),
          contact_person: '',
          email: '',
          phone: '',
          industry: 'General',
          status: 'Active',
          address: {
            street: '',
            city: '',
            state: '',
            zip: ''
          }
        });

        if (error) throw error;

        // Add the new client to the list
        setClientsList(prev => [...prev, data]);
        
        // Set the form data to use the new client
        setFormData(prev => ({
          ...prev,
          client_id: data.id
        }));
        
        setShowNewClientInput(false);
        setNewClient('');
        
        toast({
          title: "Client Created",
          description: `${newClient.trim()} has been added successfully.`,
          variant: "default"
        });
      } catch (error) {
        console.error('Error creating client:', error);
        toast({
          title: "Error",
          description: "Failed to create client. Please try again.",
          variant: "destructive"
        });
      }
    }
  };

  const validateJson = (jsonString, fieldName) => {
    try {
      JSON.parse(jsonString);
      return true;
    } catch (e) {
      toast({ variant: 'destructive', title: `Invalid JSON in ${fieldName}`, description: 'Please provide valid JSON data.' });
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateJson(formData.address, 'Address') || !validateJson(formData.gps_coordinates, 'GPS Coordinates')) {
      return;
    }

    const dataToSave = {
      ...formData,
      address: JSON.parse(formData.address),
      gps_coordinates: JSON.parse(formData.gps_coordinates),
      parent_id: formData.parent_id === '' || formData.parent_id === 'none' ? null : formData.parent_id,
      client_id: formData.client_id === '' || formData.client_id === 'none' ? null : formData.client_id,
    };
    
    setLoading(true);
    try {
      let error;
      if (isEditing && currentSite) {
        const { error: updateError } = await supabase.from('sites').update(dataToSave).eq('id', currentSite.id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase.from('sites').insert([dataToSave]);
        error = insertError;
      }

      if (error) throw error;
      toast({ title: `Entity ${isEditing ? 'updated' : 'created'} successfully` });
      onSuccess();
    } catch (error) {
      toast({ variant: 'destructive', title: `Error ${isEditing ? 'updating' : 'creating'} entity`, description: error.message });
    } finally {
      setLoading(false);
    }
  };

  const parentCandidates = useMemo(() => {
    if (!formData.type) return allSitesForParent;
    
    // Allow flexible parent-child relationships - any entity can be a parent of any other entity
    // Filter out the current entity being edited to prevent self-referencing
    return allSitesForParent.filter(s => !currentSite || s.id !== currentSite.id);
    
    // Previous restrictive logic commented out:
    // if (formData.type === 'site') return allSitesForParent.filter(s => s.type === 'region' || s.type === 'national' || s.type === 'global');
    // if (formData.type === 'region') return allSitesForParent.filter(s => s.type === 'national' || s.type === 'global');
    // if (formData.type === 'national') return allSitesForParent.filter(s => s.type === 'global');
    // if (formData.type === 'global') return [];
    // return allSitesForParent;
  }, [allSitesForParent, formData.type, currentSite]);

  // Debug logging to help identify issues
  console.log('EntityForm Debug:', {
    isEditing,
    currentSite,
    formData,
    parentCandidates: parentCandidates.length,
    allSitesForParent: allSitesForParent.length,
    parentIdType: typeof formData.parent_id,
    parentIdValue: formData.parent_id
  });

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
      <Card className="ios-card">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl text-white">{isEditing ? 'Edit Entity' : 'Create New Entity'}</CardTitle>
            <Button variant="ghost" size="icon" onClick={onCancel} className="text-slate-400 hover:text-white">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </div>
          <CardDescription className="text-gray-400">
            {isEditing ? `Updating details for ${currentSite?.name || 'entity'}.` : 'Fill in the details below.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="name" className="text-gray-300">Name</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required className={iosInputStyle} />
              </div>
              <div>
                <Label htmlFor="type" className="text-gray-300">Type</Label>
                <Select name="type" value={formData.type} onValueChange={(value) => handleSelectChange('type', value)} required>
                  <SelectTrigger className={iosInputStyle}><SelectValue placeholder="Select type..." /></SelectTrigger>
                  <SelectContent>
                    {siteTypes.map(type => <SelectItem key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ')}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="parent_id" className="text-gray-300">Parent Entity (Optional)</Label>
                <Select name="parent_id" value={formData.parent_id ? formData.parent_id.toString() : 'none'} onValueChange={(value) => handleSelectChange('parent_id', value)}>
                  <SelectTrigger className={iosInputStyle}><SelectValue placeholder="Select parent..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {parentCandidates.map(s => <SelectItem key={s.id} value={s.id.toString()}>{s.name} ({s.type})</SelectItem>)}
                  </SelectContent>
                </Select>
                <p className="text-xs text-slate-400 mt-1">Any entity can be a parent of any other entity type.</p>
              </div>
              <div>
                <Label htmlFor="client_id" className="text-gray-300">Client (Optional)</Label>
                {showNewClientInput ? (
                  <div className="space-y-2">
                    <Input
                      value={newClient}
                      onChange={(e) => setNewClient(e.target.value)}
                      placeholder="Enter new client name"
                      className={iosInputStyle}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleNewClientSubmit();
                        }
                      }}
                    />
                    <div className="flex space-x-2">
                      <Button
                        type="button"
                        size="sm"
                        onClick={handleNewClientSubmit}
                        className="bg-green-600 hover:bg-green-700 text-xs"
                      >
                        Add Client
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setShowNewClientInput(false);
                          setNewClient('');
                        }}
                        className="border-slate-600 text-slate-300 hover:bg-slate-700 text-xs"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Select 
                    name="client_id" 
                    value={formData.client_id ? formData.client_id.toString() : 'none'} 
                    onValueChange={handleClientChange}
                    disabled={clientsLoading}
                  >
                    <SelectTrigger className={iosInputStyle}>
                      <SelectValue placeholder={clientsLoading ? "Loading clients..." : "Select a client or add new..."} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {clientsLoading ? (
                        <SelectItem value="" disabled>Loading clients...</SelectItem>
                      ) : (
                        <>
                          {clientsList.map((client) => (
                            <SelectItem key={client.id} value={client.id.toString()}>
                              {client.name} - {client.industry}
                            </SelectItem>
                          ))}
                          <SelectItem value="add_new" className="text-blue-400 font-medium">
                            + Add New Client
                          </SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                )}
                <p className="text-xs text-slate-400 mt-1">Assign this entity to a specific client or create a new one.</p>
              </div>
            </div>
            <div>
              <Label htmlFor="address" className="text-gray-300">Address (JSON format)</Label>
              <Textarea id="address" name="address" value={formData.address} onChange={handleInputChange} rows={4} className={`${iosInputStyle} font-mono`} placeholder='{ "street": "123 Main St", "city": "Anytown", "zip": "12345" }' />
            </div>
            <div>
              <Label htmlFor="gps_coordinates" className="text-gray-300">GPS Coordinates (JSON format)</Label>
              <Textarea id="gps_coordinates" name="gps_coordinates" value={formData.gps_coordinates} onChange={handleInputChange} rows={3} className={`${iosInputStyle} font-mono`} placeholder='{ "latitude": 34.0522, "longitude": -118.2437 }' />
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <Button type="button" variant="outline" onClick={onCancel} className="text-gray-300 border-gray-600 hover:bg-slate-700">Cancel</Button>
              <Button type="submit" className={`${iosButtonStyle}`} disabled={loading}>
                <Save className="w-4 h-4 mr-2" />
                {loading ? (isEditing ? 'Saving...' : 'Creating...') : (isEditing ? 'Save Changes' : 'Create Entity')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default EntityForm;