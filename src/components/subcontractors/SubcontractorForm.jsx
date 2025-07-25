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
import { createSubcontractor, updateSubcontractor, SERVICE_SPECIALIZATIONS } from '@/lib/subcontractorService';

const SubcontractorForm = ({ subcontractor = null, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    company_name: '',
    contact_person: '',
    contact_email: '',
    contact_phone: '',
    service_specialization: '',
    status: 'Active',
    vetting_status: 'Pending',
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
  const { toast } = useToast();

  const isEditing = !!subcontractor;

  useEffect(() => {
    if (subcontractor) {
      setFormData({
        company_name: subcontractor.company_name || '',
        contact_person: subcontractor.contact_person || '',
        contact_email: subcontractor.contact_email || '',
        contact_phone: subcontractor.contact_phone || '',
        service_specialization: subcontractor.service_specialization || '',
        status: subcontractor.status || 'Active',
        vetting_status: subcontractor.vetting_status || 'Pending',
        hourly_rate: subcontractor.hourly_rate?.toString() || '',
        max_workers: subcontractor.max_workers?.toString() || '',
        current_workers: subcontractor.current_workers?.toString() || '',
        performance_rating: subcontractor.performance_rating?.toString() || '',
        contract_start_date: subcontractor.contract_start_date || new Date().toISOString().split('T')[0],
        contract_end_date: subcontractor.contract_end_date || '',
        notes: subcontractor.notes || '',
        address: subcontractor.address || {
          street: '',
          city: '',
          state: '',
          zip: ''
        },
        insurance_coverage: subcontractor.insurance_coverage || {
          general_liability: '',
          workers_comp: '',
          professional_liability: ''
        },
        certifications: Array.isArray(subcontractor.certifications) 
          ? subcontractor.certifications.join(', ') 
          : subcontractor.certifications || ''
      });
    }
  }, [subcontractor]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
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
      const subcontractorData = {
        ...formData,
        hourly_rate: parseFloat(formData.hourly_rate) || 0,
        max_workers: parseInt(formData.max_workers) || 0,
        current_workers: parseInt(formData.current_workers) || 0,
        performance_rating: parseFloat(formData.performance_rating) || 0,
        certifications: formData.certifications
          .split(',')
          .map(cert => cert.trim())
          .filter(cert => cert.length > 0),
        insurance_coverage: {
          general_liability: parseInt(formData.insurance_coverage.general_liability) || 0,
          workers_comp: parseInt(formData.insurance_coverage.workers_comp) || 0,
          professional_liability: parseInt(formData.insurance_coverage.professional_liability) || 0
        }
      };

      let result;
      if (isEditing) {
        result = await updateSubcontractor(subcontractor.id, subcontractorData);
      } else {
        result = await createSubcontractor(subcontractorData);
      }

      if (result.error) {
        throw result.error;
      }

      toast({
        title: isEditing ? "Subcontractor Updated" : "Subcontractor Added",
        description: `${formData.company_name} has been ${isEditing ? 'updated' : 'added'} successfully.`,
        variant: "default"
      });

      onSuccess?.(result.data);
      onClose();
    } catch (error) {
      console.error('Error saving subcontractor:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save subcontractor. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const serviceSpecializationOptions = Object.keys(SERVICE_SPECIALIZATIONS);

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
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <Card className="ios-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="flex items-center space-x-2 text-white">
                {isEditing ? <Edit className="w-5 h-5 text-blue-400" /> : <Building className="w-5 h-5 text-green-400" />}
                <span>{isEditing ? 'Edit Subcontractor' : 'Add New Subcontractor'}</span>
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Company Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white border-b border-slate-600 pb-2">Company Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="company_name" className="text-white">Company Name</Label>
                      <Input
                        id="company_name"
                        value={formData.company_name}
                        onChange={(e) => handleInputChange('company_name', e.target.value)}
                        placeholder="Enter company name"
                        className="bg-slate-700/50 border-slate-600 text-white"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="service_specialization" className="text-white">Service Specialization</Label>
                      <Select value={formData.service_specialization} onValueChange={(value) => handleInputChange('service_specialization', value)}>
                        <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                          <SelectValue placeholder="Select specialization" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-600">
                          {serviceSpecializationOptions.map((specialization) => (
                            <SelectItem key={specialization} value={specialization} className="text-white">
                              {specialization}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="status" className="text-white">Status</Label>
                      <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                        <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-600">
                          <SelectItem value="Active" className="text-white">Active</SelectItem>
                          <SelectItem value="Inactive" className="text-white">Inactive</SelectItem>
                          <SelectItem value="Pending Review" className="text-white">Pending Review</SelectItem>
                          <SelectItem value="Suspended" className="text-white">Suspended</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="vetting_status" className="text-white">Vetting Status</Label>
                      <Select value={formData.vetting_status} onValueChange={(value) => handleInputChange('vetting_status', value)}>
                        <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-600">
                          <SelectItem value="Pending" className="text-white">Pending</SelectItem>
                          <SelectItem value="In Progress" className="text-white">In Progress</SelectItem>
                          <SelectItem value="Approved" className="text-white">Approved</SelectItem>
                          <SelectItem value="Rejected" className="text-white">Rejected</SelectItem>
                          <SelectItem value="Under Review" className="text-white">Under Review</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white border-b border-slate-600 pb-2">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contact_person" className="text-white">Contact Person</Label>
                      <Input
                        id="contact_person"
                        value={formData.contact_person}
                        onChange={(e) => handleInputChange('contact_person', e.target.value)}
                        placeholder="Enter contact person name"
                        className="bg-slate-700/50 border-slate-600 text-white"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contact_email" className="text-white">Email</Label>
                      <Input
                        id="contact_email"
                        type="email"
                        value={formData.contact_email}
                        onChange={(e) => handleInputChange('contact_email', e.target.value)}
                        placeholder="contact@company.com"
                        className="bg-slate-700/50 border-slate-600 text-white"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contact_phone" className="text-white">Phone</Label>
                      <Input
                        id="contact_phone"
                        value={formData.contact_phone}
                        onChange={(e) => handleInputChange('contact_phone', e.target.value)}
                        placeholder="(555) 123-4567"
                        className="bg-slate-700/50 border-slate-600 text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Address Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white border-b border-slate-600 pb-2">Address Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="street" className="text-white">Street Address</Label>
                      <Input
                        id="street"
                        value={formData.address.street}
                        onChange={(e) => handleAddressChange('street', e.target.value)}
                        placeholder="123 Business Ave"
                        className="bg-slate-700/50 border-slate-600 text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="city" className="text-white">City</Label>
                      <Input
                        id="city"
                        value={formData.address.city}
                        onChange={(e) => handleAddressChange('city', e.target.value)}
                        placeholder="New York"
                        className="bg-slate-700/50 border-slate-600 text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="state" className="text-white">State</Label>
                      <Input
                        id="state"
                        value={formData.address.state}
                        onChange={(e) => handleAddressChange('state', e.target.value)}
                        placeholder="NY"
                        className="bg-slate-700/50 border-slate-600 text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="zip" className="text-white">ZIP Code</Label>
                      <Input
                        id="zip"
                        value={formData.address.zip}
                        onChange={(e) => handleAddressChange('zip', e.target.value)}
                        placeholder="10001"
                        className="bg-slate-700/50 border-slate-600 text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Contract & Performance */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white border-b border-slate-600 pb-2">Contract & Performance</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="hourly_rate" className="text-white">Hourly Rate ($)</Label>
                      <Input
                        id="hourly_rate"
                        type="number"
                        step="0.01"
                        value={formData.hourly_rate}
                        onChange={(e) => handleInputChange('hourly_rate', e.target.value)}
                        placeholder="35.00"
                        className="bg-slate-700/50 border-slate-600 text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="max_workers" className="text-white">Max Workers</Label>
                      <Input
                        id="max_workers"
                        type="number"
                        value={formData.max_workers}
                        onChange={(e) => handleInputChange('max_workers', e.target.value)}
                        placeholder="25"
                        className="bg-slate-700/50 border-slate-600 text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="current_workers" className="text-white">Current Workers</Label>
                      <Input
                        id="current_workers"
                        type="number"
                        value={formData.current_workers}
                        onChange={(e) => handleInputChange('current_workers', e.target.value)}
                        placeholder="18"
                        className="bg-slate-700/50 border-slate-600 text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="performance_rating" className="text-white">Performance Rating (0-5)</Label>
                      <Input
                        id="performance_rating"
                        type="number"
                        step="0.1"
                        min="0"
                        max="5"
                        value={formData.performance_rating}
                        onChange={(e) => handleInputChange('performance_rating', e.target.value)}
                        placeholder="4.5"
                        className="bg-slate-700/50 border-slate-600 text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contract_start_date" className="text-white">Contract Start Date</Label>
                      <Input
                        id="contract_start_date"
                        type="date"
                        value={formData.contract_start_date}
                        onChange={(e) => handleInputChange('contract_start_date', e.target.value)}
                        className="bg-slate-700/50 border-slate-600 text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contract_end_date" className="text-white">Contract End Date</Label>
                      <Input
                        id="contract_end_date"
                        type="date"
                        value={formData.contract_end_date}
                        onChange={(e) => handleInputChange('contract_end_date', e.target.value)}
                        className="bg-slate-700/50 border-slate-600 text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Insurance Coverage */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white border-b border-slate-600 pb-2">Insurance Coverage ($)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="general_liability" className="text-white">General Liability</Label>
                      <Input
                        id="general_liability"
                        type="number"
                        value={formData.insurance_coverage.general_liability}
                        onChange={(e) => handleInsuranceChange('general_liability', e.target.value)}
                        placeholder="2000000"
                        className="bg-slate-700/50 border-slate-600 text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="workers_comp" className="text-white">Workers Compensation</Label>
                      <Input
                        id="workers_comp"
                        type="number"
                        value={formData.insurance_coverage.workers_comp}
                        onChange={(e) => handleInsuranceChange('workers_comp', e.target.value)}
                        placeholder="1000000"
                        className="bg-slate-700/50 border-slate-600 text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="professional_liability" className="text-white">Professional Liability</Label>
                      <Input
                        id="professional_liability"
                        type="number"
                        value={formData.insurance_coverage.professional_liability}
                        onChange={(e) => handleInsuranceChange('professional_liability', e.target.value)}
                        placeholder="500000"
                        className="bg-slate-700/50 border-slate-600 text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white border-b border-slate-600 pb-2">Additional Information</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="certifications" className="text-white">Certifications</Label>
                    <Textarea
                      id="certifications"
                      value={formData.certifications}
                      onChange={(e) => handleInputChange('certifications', e.target.value)}
                      placeholder="Security License, First Aid, Firearms (comma-separated)"
                      className="bg-slate-700/50 border-slate-600 text-white min-h-[80px]"
                    />
                    <p className="text-xs text-gray-400">Enter certifications separated by commas</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes" className="text-white">Notes</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => handleInputChange('notes', e.target.value)}
                      placeholder="Additional notes about the subcontractor..."
                      className="bg-slate-700/50 border-slate-600 text-white min-h-[80px]"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    className="border-slate-600 text-slate-300 hover:bg-slate-700"
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
                        <Save className="w-4 h-4" />
                        <span>{isEditing ? 'Update' : 'Save'} Subcontractor</span>
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

export default SubcontractorForm; 