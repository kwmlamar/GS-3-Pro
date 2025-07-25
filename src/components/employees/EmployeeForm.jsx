import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { X, Save, UserPlus, Edit } from 'lucide-react';
import { createEmployee, updateEmployee, EMPLOYEE_TYPES } from '@/lib/employeeService';
import { supabase } from '@/lib/supabaseClient';

const EmployeeForm = ({ employee = null, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    type: '',
    site: '',
    department: '',
    status: 'Active',
    compliance: 100,
    certifications: '',
    email: '',
    phone: '',
    hire_date: new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(false);
  const [sites, setSites] = useState([]);
  const [sitesLoading, setSitesLoading] = useState(false);
  const { toast } = useToast();

  const isEditing = !!employee;

  // Fetch sites for the dropdown
  const fetchSites = useCallback(async () => {
    setSitesLoading(true);
    try {
      const { data: sitesData, error: sitesError } = await supabase
        .from('sites')
        .select(`
          id, 
          name, 
          type, 
          parent_id
        `);
      
      if (sitesError) throw sitesError;
      
      // Get parent names by fetching parent sites separately
      const parentIds = [...new Set(sitesData.map(s => s.parent_id).filter(id => id !== null))];
      let parentSites = [];
      
      if (parentIds.length > 0) {
        const { data: parentData, error: parentError } = await supabase
          .from('sites')
          .select('id, name')
          .in('id', parentIds);
        
        if (!parentError) {
          parentSites = parentData || [];
        }
      }
      
      const formattedSites = sitesData.map(s => ({
        ...s,
        parent_name: s.parent_id ? parentSites.find(p => p.id === s.parent_id)?.name || null : null,
      }));
      
      setSites(formattedSites);
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error fetching sites', description: error.message });
    } finally {
      setSitesLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchSites();
  }, [fetchSites]);

  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.name || '',
        role: employee.role || '',
        type: employee.type || '',
        site: employee.site || '',
        department: employee.department || '',
        status: employee.status || 'Active',
        compliance: employee.compliance || 100,
        certifications: Array.isArray(employee.certifications) 
          ? employee.certifications.join(', ') 
          : employee.certifications || '',
        email: employee.email || '',
        phone: employee.phone || '',
        hire_date: employee.hire_date || new Date().toISOString().split('T')[0]
      });
    }
  }, [employee]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const employeeData = {
        ...formData,
        certifications: formData.certifications
          .split(',')
          .map(cert => cert.trim())
          .filter(cert => cert.length > 0)
      };

      let result;
      if (isEditing) {
        result = await updateEmployee(employee.id, employeeData);
      } else {
        result = await createEmployee(employeeData);
      }

      if (result.error) {
        throw result.error;
      }

      toast({
        title: isEditing ? "Security Staff Updated" : "Security Staff Added",
        description: `${formData.name} has been ${isEditing ? 'updated' : 'added'} successfully.`,
        variant: "default"
      });

      onSuccess?.(result.data);
      onClose();
    } catch (error) {
      console.error('Error saving employee:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save security staff. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const employeeTypeOptions = Object.keys(EMPLOYEE_TYPES);

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
          className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <Card className="ios-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="flex items-center space-x-2 text-white">
                {isEditing ? <Edit className="w-5 h-5 text-blue-400" /> : <UserPlus className="w-5 h-5 text-green-400" />}
                <span>{isEditing ? 'Edit Security Staff' : 'Add New Security Staff'}</span>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-white">Full Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Enter full name"
                      className="bg-slate-700/50 border-slate-600 text-white"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role" className="text-white">Role</Label>
                    <Input
                      id="role"
                      value={formData.role}
                      onChange={(e) => handleInputChange('role', e.target.value)}
                      placeholder="Security Officer"
                      className="bg-slate-700/50 border-slate-600 text-white"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="department" className="text-white">Department</Label>
                    <Input
                      id="department"
                      value={formData.department}
                      onChange={(e) => handleInputChange('department', e.target.value)}
                      placeholder="Security Operations"
                      className="bg-slate-700/50 border-slate-600 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="type" className="text-white">Security Staff Type</Label>
                    <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                      <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                        <SelectValue placeholder="Select security staff type" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-600">
                        {employeeTypeOptions.map((type) => (
                          <SelectItem key={type} value={type} className="text-white">
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="site" className="text-white">Entity</Label>
                    <Select 
                      value={formData.site} 
                      onValueChange={(value) => handleInputChange('site', value)}
                      disabled={sitesLoading}
                    >
                      <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                        <SelectValue placeholder={sitesLoading ? "Loading entities..." : "Select an entity..."} />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-600">
                        {sites.map((site) => (
                          <SelectItem key={site.id} value={site.name} className="text-white">
                            {site.name} ({site.type}) {site.parent_name ? `- ${site.parent_name}` : ''}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="employee@gs3.com"
                      className="bg-slate-700/50 border-slate-600 text-white"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-white">Phone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="+1-555-0123"
                      className="bg-slate-700/50 border-slate-600 text-white"
                    />
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
                        <SelectItem value="On Leave" className="text-white">On Leave</SelectItem>
                        <SelectItem value="Terminated" className="text-white">Terminated</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="compliance" className="text-white">Compliance Score (%)</Label>
                    <Input
                      id="compliance"
                      type="number"
                      min="0"
                      max="100"
                      value={formData.compliance}
                      onChange={(e) => handleInputChange('compliance', parseInt(e.target.value) || 0)}
                      className="bg-slate-700/50 border-slate-600 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hire_date" className="text-white">Hire Date</Label>
                    <Input
                      id="hire_date"
                      type="date"
                      value={formData.hire_date}
                      onChange={(e) => handleInputChange('hire_date', e.target.value)}
                      className="bg-slate-700/50 border-slate-600 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="certifications" className="text-white">Certifications</Label>
                  <Textarea
                    id="certifications"
                    value={formData.certifications}
                    onChange={(e) => handleInputChange('certifications', e.target.value)}
                    placeholder="Basic Security, First Aid, Firearms (comma-separated)"
                    className="bg-slate-700/50 border-slate-600 text-white min-h-[80px]"
                  />
                  <p className="text-xs text-gray-400">Enter certifications separated by commas</p>
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
                        <span>{isEditing ? 'Update' : 'Save'} Security Staff</span>
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

export default EmployeeForm; 