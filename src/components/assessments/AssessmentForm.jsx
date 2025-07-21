import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { assessmentService } from '@/lib/assessmentService';
import { X, Save, Loader2 } from 'lucide-react';

const AssessmentForm = ({ assessment = null, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    client_name: '',
    location: '',
    assessment_type: 'New Site',
    status: 'Scheduled',
    priority: 'Medium',
    scheduled_date: '',
    assigned_to: '',
    description: '',
    risk_level: 'Medium',
    estimated_duration_hours: 4
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (assessment) {
      setFormData({
        title: assessment.title || '',
        client_name: assessment.client_name || '',
        location: assessment.location || '',
        assessment_type: assessment.assessment_type || 'New Site',
        status: assessment.status || 'Scheduled',
        priority: assessment.priority || 'Medium',
        scheduled_date: assessment.scheduled_date || '',
        assigned_to: assessment.assigned_to || '',
        description: assessment.description || '',
        risk_level: assessment.risk_level || 'Medium',
        estimated_duration_hours: assessment.estimated_duration_hours || 4
      });
    }
  }, [assessment]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.client_name || !formData.location || !formData.scheduled_date) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      
      if (assessment) {
        // Update existing assessment
        const updatedAssessment = await assessmentService.updateAssessment(assessment.id, formData);
        toast({
          title: "Assessment updated",
          description: "Assessment has been successfully updated"
        });
        onSave(updatedAssessment);
      } else {
        // Create new assessment
        const newAssessment = await assessmentService.createAssessment(formData);
        toast({
          title: "Assessment created",
          description: "New assessment has been successfully created"
        });
        onSave(newAssessment);
      }
      
      onClose();
    } catch (error) {
      console.error('Error saving assessment:', error);
      toast({
        title: "Error saving assessment",
        description: "Failed to save assessment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
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
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-white">
              {assessment ? 'Edit Assessment' : 'Create New Assessment'}
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
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-white">Assessment Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Enter assessment title"
                    className="bg-slate-700/50 border-slate-600 text-white"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="client_name" className="text-white">Client Name *</Label>
                  <Input
                    id="client_name"
                    value={formData.client_name}
                    onChange={(e) => handleInputChange('client_name', e.target.value)}
                    placeholder="Enter client name"
                    className="bg-slate-700/50 border-slate-600 text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location" className="text-white">Location *</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="Enter location"
                  className="bg-slate-700/50 border-slate-600 text-white"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="assessment_type" className="text-white">Assessment Type</Label>
                  <Select value={formData.assessment_type} onValueChange={(value) => handleInputChange('assessment_type', value)}>
                    <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="New Site">New Site</SelectItem>
                      <SelectItem value="Existing Site">Existing Site</SelectItem>
                      <SelectItem value="Security Review">Security Review</SelectItem>
                      <SelectItem value="Risk Assessment">Risk Assessment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority" className="text-white">Priority</Label>
                  <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
                    <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status" className="text-white">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                    <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Scheduled">Scheduled</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                      <SelectItem value="Cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="scheduled_date" className="text-white">Scheduled Date *</Label>
                  <Input
                    id="scheduled_date"
                    type="date"
                    value={formData.scheduled_date}
                    onChange={(e) => handleInputChange('scheduled_date', e.target.value)}
                    className="bg-slate-700/50 border-slate-600 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="assigned_to" className="text-white">Assigned To</Label>
                  <Input
                    id="assigned_to"
                    value={formData.assigned_to}
                    onChange={(e) => handleInputChange('assigned_to', e.target.value)}
                    placeholder="Enter assignee name"
                    className="bg-slate-700/50 border-slate-600 text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-white">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Enter assessment description"
                  className="bg-slate-700/50 border-slate-600 text-white"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="risk_level" className="text-white">Risk Level</Label>
                  <Select value={formData.risk_level} onValueChange={(value) => handleInputChange('risk_level', value)}>
                    <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="estimated_duration_hours" className="text-white">Estimated Duration (hours)</Label>
                  <Input
                    id="estimated_duration_hours"
                    type="number"
                    min="1"
                    value={formData.estimated_duration_hours}
                    onChange={(e) => handleInputChange('estimated_duration_hours', parseInt(e.target.value) || 0)}
                    className="bg-slate-700/50 border-slate-600 text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="ios-button border-slate-600 hover:bg-slate-700"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="ios-button bg-blue-600 hover:bg-blue-700"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      {assessment ? 'Update Assessment' : 'Create Assessment'}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default AssessmentForm; 