import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { X, Save, AlertTriangle, Edit, UploadCloud } from 'lucide-react';
import { healthSafetyService } from '@/lib/healthSafetyService';
import { supabase } from '@/lib/supabaseClient';

const IncidentForm = ({ incident = null, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    site_id: '',
    description: '',
    incident_date: new Date().toISOString().split('T')[0],
    investigation_status: 'open',
    report_file: null
  });
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const { toast } = useToast();

  const isEditing = !!incident;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        setCurrentUser(user);

        // Get sites for dropdown
        const sitesData = await healthSafetyService.getSites();
        setSites(sitesData);
      } catch (error) {
        console.error('Error fetching initial data:', error);
        toast({
          title: "Error",
          description: "Failed to load form data. Please try again.",
          variant: "destructive"
        });
      }
    };

    fetchData();
  }, [toast]);

  useEffect(() => {
    if (incident) {
      setFormData({
        site_id: incident.site_id || '',
        description: incident.description || '',
        incident_date: incident.incident_date ? new Date(incident.incident_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        investigation_status: incident.investigation_status || 'open',
        report_file: null
      });
    }
  }, [incident]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        report_file: file
      }));
      toast({
        title: "File Selected",
        description: `File "${file.name}" selected for upload.`,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      toast({
        title: "Authentication Required",
        description: "Please log in to report an incident.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const incidentData = {
        site_id: formData.site_id,
        description: formData.description,
        incident_date: formData.incident_date,
        reported_by_id: currentUser.id,
        investigation_status: formData.investigation_status,
      };

      let result;
      if (isEditing) {
        result = await healthSafetyService.updateIncident(incident.id, incidentData);
      } else {
        result = await healthSafetyService.createIncident(incidentData);
      }

      toast({
        title: isEditing ? "Incident Updated" : "Incident Reported",
        description: `Health & safety incident has been ${isEditing ? 'updated' : 'reported'} successfully.`,
        variant: "default"
      });

      onSuccess?.(result);
      onClose();
    } catch (error) {
      console.error('Error saving incident:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save incident. Please try again.",
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
          className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <Card className="ios-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="flex items-center space-x-2 text-white">
                {isEditing ? <Edit className="w-5 h-5 text-blue-400" /> : <AlertTriangle className="w-5 h-5 text-red-400" />}
                <span>{isEditing ? 'Edit Incident' : 'Report New Incident'}</span>
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
                    <Label htmlFor="site_id" className="text-white">Site</Label>
                    <Select value={formData.site_id} onValueChange={(value) => handleInputChange('site_id', value)}>
                      <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                        <SelectValue placeholder="Select site" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-600">
                        {sites.map((site) => (
                          <SelectItem key={site.id} value={site.id} className="text-white">
                            {site.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="incident_date" className="text-white">Incident Date</Label>
                    <Input
                      id="incident_date"
                      type="date"
                      value={formData.incident_date}
                      onChange={(e) => handleInputChange('incident_date', e.target.value)}
                      className="bg-slate-700/50 border-slate-600 text-white"
                      required
                    />
                  </div>

                  {isEditing && (
                    <div className="space-y-2">
                      <Label htmlFor="investigation_status" className="text-white">Investigation Status</Label>
                      <Select value={formData.investigation_status} onValueChange={(value) => handleInputChange('investigation_status', value)}>
                        <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-600">
                          <SelectItem value="open" className="text-white">Open</SelectItem>
                          <SelectItem value="in_progress" className="text-white">In Progress</SelectItem>
                          <SelectItem value="closed" className="text-white">Closed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-white">Description of Incident</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe what happened, when, where, and any relevant details..."
                    className="bg-slate-700/50 border-slate-600 text-white min-h-[120px]"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="report_file" className="text-white">Upload Report/Media (Optional)</Label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-600 border-dashed rounded-md bg-slate-800/30">
                    <div className="space-y-1 text-center">
                      <UploadCloud className="mx-auto h-12 w-12 text-slate-400" />
                      <div className="flex text-sm text-slate-500">
                        <label
                          htmlFor="report_file"
                          className="relative cursor-pointer rounded-md font-medium text-blue-400 hover:text-blue-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500 focus-within:ring-offset-slate-900"
                        >
                          <span>Upload a file</span>
                          <Input 
                            id="report_file" 
                            name="report_file" 
                            type="file" 
                            className="sr-only" 
                            onChange={handleFileChange}
                            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-slate-500">PDF, JPG, PNG, DOC up to 10MB</p>
                    </div>
                  </div>
                  {formData.report_file && (
                    <p className="text-sm text-green-400 mt-2">
                      File selected: {formData.report_file.name}
                    </p>
                  )}
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
                    className="bg-red-600 hover:bg-red-700"
                  >
                    {loading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Saving...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Save className="w-4 h-4" />
                        <span>{isEditing ? 'Update' : 'Report'} Incident</span>
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

export default IncidentForm; 