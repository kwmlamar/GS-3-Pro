import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { X, Save, UserPlus, Edit, Shield, AlertTriangle, Building2, MapPin, Crown, Users, Star, Briefcase, GraduationCap } from 'lucide-react';
import { createEmployee, updateEmployee, EMPLOYEE_TYPES, getDepartments, createDepartment } from '@/lib/employeeService';
import { supabase } from '@/lib/supabaseClient';

const EmployeeForm = ({ employee = null, onClose, onSuccess, staffType = 'security' }) => {
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
  const [departments, setDepartments] = useState([]);
  const [departmentsLoading, setDepartmentsLoading] = useState(false);
  const [showNewDepartmentInput, setShowNewDepartmentInput] = useState(false);
  const [newDepartment, setNewDepartment] = useState('');
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

  // Fetch departments for the dropdown
  const fetchDepartments = useCallback(async () => {
    setDepartmentsLoading(true);
    try {
      const { data, error } = await getDepartments();
      if (error) throw error;
      setDepartments(data || []);
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error fetching departments', description: error.message });
    } finally {
      setDepartmentsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchSites();
    fetchDepartments();
  }, [fetchSites, fetchDepartments]);

  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.name || '',
        role: employee.role || '',
        type: employee.type || '',
        site: employee.site || '',
        department: employee.departments?.name || '', // Use the department name from the joined data
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

  const handleDepartmentChange = (value) => {
    if (value === 'add_new') {
      setShowNewDepartmentInput(true);
      setNewDepartment('');
    } else {
      setShowNewDepartmentInput(false);
      setFormData(prev => ({
        ...prev,
        department: value
      }));
    }
  };

  const handleNewDepartmentSubmit = async () => {
    if (newDepartment.trim()) {
      try {
        const { data, error } = await createDepartment({
          name: newDepartment.trim(),
          description: `Department for ${newDepartment.trim()}`,
          is_active: true
        });

        if (error) throw error;

        // Add the new department to the list
        setDepartments(prev => [...prev, data]);
        
        // Set the form data to use the new department
        setFormData(prev => ({
          ...prev,
          department: data.name
        }));
        
        setShowNewDepartmentInput(false);
        setNewDepartment('');
        
        toast({
          title: "Department Created",
          description: `${newDepartment.trim()} has been added successfully.`,
          variant: "default"
        });
      } catch (error) {
        console.error('Error creating department:', error);
        toast({
          title: "Error",
          description: "Failed to create department. Please try again.",
          variant: "destructive"
        });
      }
    }
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

      const staffLabel = staffType === 'entity' ? 'Entity Staff' : 'Security Staff';
      toast({
        title: isEditing ? `${staffLabel} Updated` : `${staffLabel} Added`,
        description: `${formData.name} has been ${isEditing ? 'updated' : 'added'} successfully.`,
        variant: "default"
      });

      onSuccess?.(result.data);
      onClose();
    } catch (error) {
      console.error('Error saving employee:', error);
      const staffLabel = staffType === 'entity' ? 'Entity Staff' : 'Security Staff';
      toast({
        title: "Error",
        description: error.message || `Failed to save ${staffLabel.toLowerCase()}. Please try again.`,
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
                <span>{isEditing ? `Edit ${staffType === 'entity' ? 'Entity Staff' : 'Security Staff'}` : `Add New ${staffType === 'entity' ? 'Entity Staff' : 'Security Staff'}`}</span>
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
                    {showNewDepartmentInput ? (
                      <div className="space-y-2">
                        <Input
                          value={newDepartment}
                          onChange={(e) => setNewDepartment(e.target.value)}
                          placeholder="Enter new department name"
                          className="bg-slate-700/50 border-slate-600 text-white"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleNewDepartmentSubmit();
                            }
                          }}
                        />
                        <div className="flex space-x-2">
                          <Button
                            type="button"
                            size="sm"
                            onClick={handleNewDepartmentSubmit}
                            className="bg-green-600 hover:bg-green-700 text-xs"
                          >
                            Add Department
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setShowNewDepartmentInput(false);
                              setNewDepartment('');
                            }}
                            className="border-slate-600 text-slate-300 hover:bg-slate-700 text-xs"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Select 
                        value={formData.department} 
                        onValueChange={handleDepartmentChange}
                        disabled={departmentsLoading}
                      >
                        <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                          <SelectValue placeholder={departmentsLoading ? "Loading departments..." : "Select department or add new..."} />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-600">
                          {departments.map((dept) => (
                            <SelectItem key={dept.id} value={dept.name} className="text-white">
                              {dept.name}
                            </SelectItem>
                          ))}
                          <SelectItem value="add_new" className="text-blue-400 font-medium">
                            + Add New Department
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="type" className="text-white">{staffType === 'entity' ? 'Entity Staff' : 'Security Staff'} Type</Label>
                    <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                      <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                        <SelectValue placeholder={`Select ${staffType === 'entity' ? 'entity staff' : 'security staff'} type`} />
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
                        <span>{isEditing ? 'Update' : 'Save'} {staffType === 'entity' ? 'Entity Staff' : 'Security Staff'}</span>
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