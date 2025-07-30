import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { X, Save, FileText, Edit, Plus } from 'lucide-react';
import { reportsService, generateDocNumber } from '@/lib/reportsService';
import { getEntityStaff } from '@/lib/entityStaffService';
import { getSecurityStaff } from '@/lib/securityStaffService';
import { supabase } from '@/lib/supabaseClient';

const REPORT_TYPES = [
  'Incident',
  'Patrol', 
  'Inspection',
  'Assessment',
  'Violation',
  'Observation',
  'Equipment',
  'Training',
  'Maintenance',
  'Other'
];

const PRIORITY_LEVELS = ['Low', 'Medium', 'High', 'Critical'];
const STATUS_OPTIONS = ['Draft', 'Under Review', 'Completed', 'Archived'];

const ReportForm = ({ report = null, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    report_type: '',
    doc_number: '',
    site_id: null,
    entity_officer_id: null,
    security_officer_id: null,
    report_date: new Date().toISOString().split('T')[0],
    status: 'Draft',
    priority: 'Medium',
    description: '',
    findings: '',
    recommendations: '',
    attachments: []
  });
  const [loading, setLoading] = useState(false);
  const [entityStaff, setEntityStaff] = useState([]);
  const [securityStaff, setSecurityStaff] = useState([]);
  const [entities, setEntities] = useState([]);
  const [loadingStaff, setLoadingStaff] = useState(true);
  const { toast } = useToast();

  const isEditing = !!report;

  // Fetch entity staff, security staff, and entities data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingStaff(true);
        const [entityStaffResult, securityStaffResult, entitiesResult] = await Promise.all([
          getEntityStaff(),
          getSecurityStaff(),
          supabase.from('sites').select('id, name, type').order('name')
        ]);

        if (entityStaffResult.error) {
          console.error('Error fetching entity staff:', entityStaffResult.error);
        } else {
          setEntityStaff(entityStaffResult.data || []);
        }

        if (securityStaffResult.error) {
          console.error('Error fetching security staff:', securityStaffResult.error);
        } else {
          setSecurityStaff(securityStaffResult.data || []);
        }

        if (entitiesResult.error) {
          console.error('Error fetching entities:', entitiesResult.error);
        } else {
          setEntities(entitiesResult.data || []);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: "Error",
          description: "Failed to load form data. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoadingStaff(false);
      }
    };

    fetchData();
  }, [toast]);

  useEffect(() => {
    if (report) {
      setFormData({
        title: report.title || '',
        report_type: report.report_type || '',
        doc_number: report.doc_number || '',
        site_id: report.site_id || null,
        site_name: report.site_name || '',
        entity_officer_id: report.entity_officer_id || null,
        security_officer_id: report.security_officer_id || null,
        report_date: report.report_date || new Date().toISOString().split('T')[0],
        status: report.status || 'Draft',
        priority: report.priority || 'Medium',
        description: report.description || '',
        findings: report.findings || '',
        recommendations: report.recommendations || '',
        attachments: report.attachments || []
      });
    } else {
      // Generate document number for new reports
      const docNumber = generateDocNumber('Report', new Date());
      setFormData(prev => ({
        ...prev,
        doc_number: docNumber
      }));
    }
  }, [report]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEntityChange = (value) => {
    const siteId = value ? parseInt(value) : null;
    const selectedSite = entities.find(site => site.id === siteId);
    
    setFormData(prev => ({
      ...prev,
      site_id: siteId,
      site_name: selectedSite?.name || '' // Auto-populate site_name from site selection
    }));
  };

  const handleReportTypeChange = (value) => {
    const docNumber = generateDocNumber(value, new Date());
    setFormData(prev => ({
      ...prev,
      report_type: value,
      doc_number: docNumber
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let result;
      if (isEditing) {
        result = await reportsService.updateReport(report.id, formData);
      } else {
        result = await reportsService.createReport(formData);
      }

      if (result.error) {
        throw result.error;
      }

      toast({
        title: isEditing ? "Report Updated" : "Report Created",
        description: `${formData.title} has been ${isEditing ? 'updated' : 'created'} successfully.`,
        variant: "default"
      });

      onSuccess?.(result);
      onClose();
    } catch (error) {
      console.error('Error saving report:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save report. Please try again.",
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
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <Card className="ios-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="flex items-center space-x-2 text-white">
                {isEditing ? <Edit className="w-5 h-5 text-blue-400" /> : <Plus className="w-5 h-5 text-green-400" />}
                <span>{isEditing ? 'Edit Report' : 'Create New Report'}</span>
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
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white border-b border-slate-600 pb-2">
                    Basic Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title" className="text-white">Report Title</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        placeholder="Enter report title"
                        className="bg-slate-700/50 border-slate-600 text-white"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="report_type" className="text-white">Report Type</Label>
                      <Select value={formData.report_type} onValueChange={handleReportTypeChange}>
                        <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                          <SelectValue placeholder="Select report type" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-600">
                          {REPORT_TYPES.map((type) => (
                            <SelectItem key={type} value={type} className="text-white">
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="doc_number" className="text-white">Document Number</Label>
                      <Input
                        id="doc_number"
                        value={formData.doc_number}
                        onChange={(e) => handleInputChange('doc_number', e.target.value)}
                        placeholder="Auto-generated"
                        className="bg-slate-700/50 border-slate-600 text-white"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="report_date" className="text-white">Report Date</Label>
                      <Input
                        id="report_date"
                        type="date"
                        value={formData.report_date}
                        onChange={(e) => handleInputChange('report_date', e.target.value)}
                        className="bg-slate-700/50 border-slate-600 text-white"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="site_id" className="text-white">Entity</Label>
                      <Select 
                        value={formData.site_id?.toString() || ''} 
                        onValueChange={handleEntityChange}
                        disabled={loadingStaff}
                      >
                        <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                          <SelectValue placeholder={loadingStaff ? "Loading..." : "Select entity"} />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-600">
                          <SelectItem value="" className="text-white">No entity selected</SelectItem>
                          {entities.map((entity) => (
                            <SelectItem key={entity.id} value={entity.id.toString()} className="text-white">
                              {entity.name} ({entity.type})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="entity_officer_id" className="text-white">Entity Officer</Label>
                      <Select 
                        value={formData.entity_officer_id?.toString() || ''} 
                        onValueChange={(value) => handleInputChange('entity_officer_id', value ? parseInt(value) : null)}
                        disabled={loadingStaff}
                      >
                        <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                          <SelectValue placeholder={loadingStaff ? "Loading..." : "Select entity officer"} />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-600">
                          <SelectItem value="" className="text-white">No entity officer assigned</SelectItem>
                          {entityStaff.map((staff) => (
                            <SelectItem key={staff.id} value={staff.id.toString()} className="text-white">
                              {staff.name} - {staff.role}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="security_officer_id" className="text-white">Security Officer</Label>
                      <Select 
                        value={formData.security_officer_id?.toString() || ''} 
                        onValueChange={(value) => handleInputChange('security_officer_id', value ? parseInt(value) : null)}
                        disabled={loadingStaff}
                      >
                        <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                          <SelectValue placeholder={loadingStaff ? "Loading..." : "Select security officer"} />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-600">
                          <SelectItem value="" className="text-white">No security officer assigned</SelectItem>
                          {securityStaff.map((staff) => (
                            <SelectItem key={staff.id} value={staff.id.toString()} className="text-white">
                              {staff.name} - {staff.role}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="priority" className="text-white">Priority</Label>
                      <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
                        <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-600">
                          {PRIORITY_LEVELS.map((priority) => (
                            <SelectItem key={priority} value={priority} className="text-white">
                              {priority}
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
                          {STATUS_OPTIONS.map((status) => (
                            <SelectItem key={status} value={status} className="text-white">
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Report Content */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white border-b border-slate-600 pb-2">
                    Report Content
                  </h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="description" className="text-white">Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        placeholder="Provide a detailed description of the incident, observation, or event..."
                        className="bg-slate-700/50 border-slate-600 text-white min-h-[100px]"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="findings" className="text-white">Findings</Label>
                      <Textarea
                        id="findings"
                        value={formData.findings}
                        onChange={(e) => handleInputChange('findings', e.target.value)}
                        placeholder="Document any findings, evidence, or observations..."
                        className="bg-slate-700/50 border-slate-600 text-white min-h-[100px]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="recommendations" className="text-white">Recommendations</Label>
                      <Textarea
                        id="recommendations"
                        value={formData.recommendations}
                        onChange={(e) => handleInputChange('recommendations', e.target.value)}
                        placeholder="Provide recommendations for improvement, corrective actions, or follow-up..."
                        className="bg-slate-700/50 border-slate-600 text-white min-h-[100px]"
                      />
                    </div>
                  </div>
                </div>

                {/* Attachments Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white border-b border-slate-600 pb-2">
                    Attachments
                  </h3>
                  <div className="space-y-2">
                    <Label className="text-white">File Attachments</Label>
                    <div className="border-2 border-dashed border-slate-600 rounded-lg p-6 text-center">
                      <FileText className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                      <p className="text-slate-400 text-sm">
                        {isEditing ? 'Update attachments' : 'Add attachments'} (Coming Soon)
                      </p>
                      <p className="text-slate-500 text-xs mt-1">
                        Support for images, documents, and other files
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 pt-4 border-t border-slate-600">
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
                        <span>{isEditing ? 'Update' : 'Create'} Report</span>
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

export default ReportForm; 