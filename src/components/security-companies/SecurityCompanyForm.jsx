import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { X, Save, Building, Edit } from 'lucide-react';
import { createSecurityCompany, updateSecurityCompany, SERVICE_SPECIALIZATIONS, TIER_SYSTEM } from '@/lib/securityCompanyService';
import { getClients, createClient } from '@/lib/clientService';

const SecurityCompanyForm = ({ securityCompany = null, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    company_name: '',
    contact_person: '',
    contact_email: '',
    contact_phone: '',
    service_specialization: '',
    status: 'Active',
    vetting_status: 'Pending',
    tier: 1,
    client_id: null,
    hourly_rate: '',
    max_workers: '',
    current_workers: '',
    performance_rating: '',
    contract_start_date: new Date().toISOString().split('T')[0],
    contract_end_date: '',
    notes: '',
    address: {
      street: '',
      city: '',
      state: '',
      zip: ''
    },
    insurance_coverage: {
      general_liability: '',
      workers_comp: '',
      professional_liability: ''
    },
    certifications: ''
  });
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState([]);
  const [clientsLoading, setClientsLoading] = useState(true);
  const [showNewClientInput, setShowNewClientInput] = useState(false);
  const [newClient, setNewClient] = useState('');
  const { toast } = useToast();

  const isEditing = !!securityCompany;

  useEffect(() => {
    // Load clients
    const loadClients = async () => {
      try {
        const { data, error } = await getClients();
        if (error) throw error;
        setClients(data || []);
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
    if (securityCompany) {
      setFormData({
        company_name: securityCompany.company_name || '',
        contact_person: securityCompany.contact_person || '',
        contact_email: securityCompany.contact_email || '',
        contact_phone: securityCompany.contact_phone || '',
        service_specialization: securityCompany.service_specialization || '',
        status: securityCompany.status || 'Active',
        vetting_status: securityCompany.vetting_status || 'Pending',
        tier: securityCompany.tier || 1,
        client_id: securityCompany.client_id || null,
        hourly_rate: securityCompany.hourly_rate?.toString() || '',
        max_workers: securityCompany.max_workers?.toString() || '',
        current_workers: securityCompany.current_workers?.toString() || '',
        performance_rating: securityCompany.performance_rating?.toString() || '',
        contract_start_date: securityCompany.contract_start_date || new Date().toISOString().split('T')[0],
        contract_end_date: securityCompany.contract_end_date || '',
        notes: securityCompany.notes || '',
        address: securityCompany.address || {
          street: '',
          city: '',
          state: '',
          zip: ''
        },
        insurance_coverage: securityCompany.insurance_coverage || {
          general_liability: '',
          workers_comp: '',
          professional_liability: ''
        },
        certifications: Array.isArray(securityCompany.certifications) 
          ? securityCompany.certifications.join(', ') 
          : securityCompany.certifications || ''
      });
    }
  }, [securityCompany]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
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
        client_id: value ? parseInt(value) : null
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
        setClients(prev => [...prev, data]);
        
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

  const handleAddressChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: value
      }
    }));
  };

  const handleInsuranceChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      insurance_coverage: {
        ...prev.insurance_coverage,
        [field]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Prepare data for submission
      const submissionData = {
        ...formData,
        certifications: formData.certifications.split(',').map(cert => cert.trim()).filter(cert => cert),
        hourly_rate: formData.hourly_rate ? parseFloat(formData.hourly_rate) : null,
        max_workers: formData.max_workers ? parseInt(formData.max_workers) : null,
        current_workers: formData.current_workers ? parseInt(formData.current_workers) : null,
        performance_rating: formData.performance_rating ? parseFloat(formData.performance_rating) : null,
        // Handle empty date fields - convert empty strings to null
        contract_start_date: formData.contract_start_date && formData.contract_start_date.trim() !== '' ? formData.contract_start_date : null,
        contract_end_date: formData.contract_end_date && formData.contract_end_date.trim() !== '' ? formData.contract_end_date : null
      };

      let result;
      if (isEditing) {
        result = await updateSecurityCompany(securityCompany.id, submissionData);
      } else {
        result = await createSecurityCompany(submissionData);
      }

      if (result.error) {
        throw result.error;
      }

      toast({
        title: isEditing ? "Security Company Updated" : "Security Company Created",
        description: isEditing 
          ? "Security company information has been updated successfully."
          : "New security company has been added successfully.",
        variant: "default"
      });

      onSuccess(result.data);
    } catch (error) {
      console.error('Error saving security company:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save security company. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-900 rounded-lg border border-slate-700"
          onClick={(e) => e.stopPropagation()}
        >
          <Card className="border-0 bg-transparent">
            <CardHeader className="border-b border-slate-700">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2 text-white">
                  <Building className="w-5 h-5 text-blue-400" />
                  <span>{isEditing ? 'Edit Security Company' : 'Add New Security Company'}</span>
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company_name" className="text-white">Company Name *</Label>
                    <Input
                      id="company_name"
                      value={formData.company_name}
                      onChange={(e) => handleInputChange('company_name', e.target.value)}
                      className="bg-slate-800 border-slate-600 text-white"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact_person" className="text-white">Contact Person</Label>
                    <Input
                      id="contact_person"
                      value={formData.contact_person}
                      onChange={(e) => handleInputChange('contact_person', e.target.value)}
                      className="bg-slate-800 border-slate-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact_email" className="text-white">Contact Email</Label>
                    <Input
                      id="contact_email"
                      type="email"
                      value={formData.contact_email}
                      onChange={(e) => handleInputChange('contact_email', e.target.value)}
                      className="bg-slate-800 border-slate-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact_phone" className="text-white">Contact Phone</Label>
                    <Input
                      id="contact_phone"
                      value={formData.contact_phone}
                      onChange={(e) => handleInputChange('contact_phone', e.target.value)}
                      className="bg-slate-800 border-slate-600 text-white"
                    />
                  </div>
                </div>

                {/* Service Information */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="service_specialization" className="text-white">Service Specialization</Label>
                    <Select
                      value={formData.service_specialization}
                      onValueChange={(value) => handleInputChange('service_specialization', value)}
                    >
                      <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                        <SelectValue placeholder="Select specialization" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-600">
                        {Object.keys(SERVICE_SPECIALIZATIONS).map((specialization) => (
                          <SelectItem key={specialization} value={specialization} className="text-white">
                            {specialization}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status" className="text-white">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => handleInputChange('status', value)}
                    >
                      <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-600">
                        <SelectItem value="Active" className="text-white">Active</SelectItem>
                        <SelectItem value="Inactive" className="text-white">Inactive</SelectItem>
                        <SelectItem value="Pending Review" className="text-white">Pending Review</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vetting_status" className="text-white">Vetting Status</Label>
                    <Select
                      value={formData.vetting_status}
                      onValueChange={(value) => handleInputChange('vetting_status', value)}
                    >
                      <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-600">
                        <SelectItem value="Pending" className="text-white">Pending</SelectItem>
                        <SelectItem value="In Progress" className="text-white">In Progress</SelectItem>
                        <SelectItem value="Approved" className="text-white">Approved</SelectItem>
                        <SelectItem value="Rejected" className="text-white">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tier" className="text-white">Tier Classification</Label>
                    <Select
                      value={formData.tier?.toString()}
                      onValueChange={(value) => handleInputChange('tier', parseInt(value))}
                    >
                      <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-600">
                        {Object.entries(TIER_SYSTEM).map(([tier, config]) => (
                          <SelectItem key={tier} value={tier} className="text-white">
                            {config.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {formData.tier && TIER_SYSTEM[formData.tier] && (
                      <p className="text-xs text-gray-400 mt-1">
                        {TIER_SYSTEM[formData.tier].description}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="client_id" className="text-white">Assigned Client</Label>
                    {showNewClientInput ? (
                      <div className="space-y-2">
                        <Input
                          value={newClient}
                          onChange={(e) => setNewClient(e.target.value)}
                          placeholder="Enter new client name"
                          className="bg-slate-700/50 border-slate-600 text-white"
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
                        value={formData.client_id?.toString() || ''}
                        onValueChange={handleClientChange}
                        disabled={clientsLoading}
                      >
                        <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                          <SelectValue placeholder={clientsLoading ? "Loading clients..." : "Select a client or add new..."} />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-600">
                          <SelectItem value="" className="text-white">No client assigned</SelectItem>
                          {clientsLoading ? (
                            <SelectItem value="" disabled className="text-white">Loading clients...</SelectItem>
                          ) : (
                            <>
                              {clients.map((client) => (
                                <SelectItem key={client.id} value={client.id.toString()} className="text-white">
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
                    {formData.client_id && !showNewClientInput && (
                      <p className="text-xs text-gray-400 mt-1">
                        {clients.find(c => c.id === formData.client_id)?.contact_person && 
                          `Contact: ${clients.find(c => c.id === formData.client_id)?.contact_person}`
                        }
                      </p>
                    )}
                  </div>
                </div>

                {/* Performance & Contract Information */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="hourly_rate" className="text-white">Hourly Rate ($)</Label>
                    <Input
                      id="hourly_rate"
                      type="number"
                      step="0.01"
                      value={formData.hourly_rate}
                      onChange={(e) => handleInputChange('hourly_rate', e.target.value)}
                      className="bg-slate-800 border-slate-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="max_workers" className="text-white">Max Workers</Label>
                    <Input
                      id="max_workers"
                      type="number"
                      value={formData.max_workers}
                      onChange={(e) => handleInputChange('max_workers', e.target.value)}
                      className="bg-slate-800 border-slate-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="current_workers" className="text-white">Current Workers</Label>
                    <Input
                      id="current_workers"
                      type="number"
                      value={formData.current_workers}
                      onChange={(e) => handleInputChange('current_workers', e.target.value)}
                      className="bg-slate-800 border-slate-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="performance_rating" className="text-white">Performance Rating</Label>
                    <Input
                      id="performance_rating"
                      type="number"
                      step="0.1"
                      min="0"
                      max="5"
                      value={formData.performance_rating}
                      onChange={(e) => handleInputChange('performance_rating', e.target.value)}
                      className="bg-slate-800 border-slate-600 text-white"
                    />
                  </div>
                </div>

                {/* Contract Dates */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contract_start_date" className="text-white">Contract Start Date</Label>
                    <Input
                      id="contract_start_date"
                      type="date"
                      value={formData.contract_start_date}
                      onChange={(e) => handleInputChange('contract_start_date', e.target.value)}
                      className="bg-slate-800 border-slate-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contract_end_date" className="text-white">Contract End Date</Label>
                    <Input
                      id="contract_end_date"
                      type="date"
                      value={formData.contract_end_date}
                      onChange={(e) => handleInputChange('contract_end_date', e.target.value)}
                      className="bg-slate-800 border-slate-600 text-white"
                    />
                  </div>
                </div>

                {/* Address Information */}
                <div className="space-y-4">
                  <h3 className="text-white font-semibold">Address Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="street" className="text-white">Street Address</Label>
                      <Input
                        id="street"
                        value={formData.address.street}
                        onChange={(e) => handleAddressChange('street', e.target.value)}
                        className="bg-slate-800 border-slate-600 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city" className="text-white">City</Label>
                      <Input
                        id="city"
                        value={formData.address.city}
                        onChange={(e) => handleAddressChange('city', e.target.value)}
                        className="bg-slate-800 border-slate-600 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state" className="text-white">State</Label>
                      <Input
                        id="state"
                        value={formData.address.state}
                        onChange={(e) => handleAddressChange('state', e.target.value)}
                        className="bg-slate-800 border-slate-600 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zip" className="text-white">ZIP Code</Label>
                      <Input
                        id="zip"
                        value={formData.address.zip}
                        onChange={(e) => handleAddressChange('zip', e.target.value)}
                        className="bg-slate-800 border-slate-600 text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Insurance Information */}
                <div className="space-y-4">
                  <h3 className="text-white font-semibold">Insurance Coverage</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="general_liability" className="text-white">General Liability ($)</Label>
                      <Input
                        id="general_liability"
                        type="number"
                        value={formData.insurance_coverage.general_liability}
                        onChange={(e) => handleInsuranceChange('general_liability', e.target.value)}
                        className="bg-slate-800 border-slate-600 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="workers_comp" className="text-white">Workers Comp ($)</Label>
                      <Input
                        id="workers_comp"
                        type="number"
                        value={formData.insurance_coverage.workers_comp}
                        onChange={(e) => handleInsuranceChange('workers_comp', e.target.value)}
                        className="bg-slate-800 border-slate-600 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="professional_liability" className="text-white">Professional Liability ($)</Label>
                      <Input
                        id="professional_liability"
                        type="number"
                        value={formData.insurance_coverage.professional_liability}
                        onChange={(e) => handleInsuranceChange('professional_liability', e.target.value)}
                        className="bg-slate-800 border-slate-600 text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Certifications */}
                <div className="space-y-2">
                  <Label htmlFor="certifications" className="text-white">Certifications (comma-separated)</Label>
                  <Textarea
                    id="certifications"
                    value={formData.certifications}
                    onChange={(e) => handleInputChange('certifications', e.target.value)}
                    placeholder="e.g., State Security License, CPR Certification, First Aid Training"
                    className="bg-slate-800 border-slate-600 text-white"
                    rows={3}
                  />
                </div>

                {/* Notes */}
                <div className="space-y-2">
                  <Label htmlFor="notes" className="text-white">Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    placeholder="Additional notes about the security company..."
                    className="bg-slate-800 border-slate-600 text-white"
                    rows={4}
                  />
                </div>

                {/* Form Actions */}
                <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-700">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    className="border-slate-600 text-gray-400 hover:text-white"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {loading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Saving...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        {isEditing ? <Edit className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                        <span>{isEditing ? 'Update Security Company' : 'Create Security Company'}</span>
                      </div>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SecurityCompanyForm; 