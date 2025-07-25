import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { X, Save, GraduationCap, Edit } from 'lucide-react';
import { createTrainingCourse, updateTrainingCourse } from '@/lib/trainingService';

const COURSE_TYPES = {
  'Core Training': 'Essential training required for all security personnel',
  'Specialized': 'Advanced training for specific roles or skills',
  'Management': 'Leadership and management training for supervisors',
  'Compliance': 'Training required for regulatory compliance',
  'Elective': 'Optional training for professional development'
};

const CourseForm = ({ course = null, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: '',
    duration_hours: 8,
    status: 'Active',
    created_by: 'System Admin'
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const isEditing = !!course;

  useEffect(() => {
    if (course) {
      setFormData({
        title: course.title || '',
        description: course.description || '',
        type: course.type || '',
        duration_hours: course.duration_hours || 8,
        status: course.status || 'Active',
        created_by: course.created_by || 'System Admin'
      });
    }
  }, [course]);

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
      let result;
      if (isEditing) {
        result = await updateTrainingCourse(course.id, formData);
      } else {
        result = await createTrainingCourse(formData);
      }

      if (result.error) {
        throw result.error;
      }

      toast({
        title: isEditing ? "Course Updated" : "Course Created",
        description: `${formData.title} has been ${isEditing ? 'updated' : 'created'} successfully.`,
        variant: "default"
      });

      onSuccess?.(result);
      onClose();
    } catch (error) {
      console.error('Error saving course:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save course. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const courseTypeOptions = Object.keys(COURSE_TYPES);

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
                {isEditing ? <Edit className="w-5 h-5 text-blue-400" /> : <GraduationCap className="w-5 h-5 text-green-400" />}
                <span>{isEditing ? 'Edit Course' : 'Create New Course'}</span>
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
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-white">Course Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="Enter course title"
                      className="bg-slate-700/50 border-slate-600 text-white"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-white">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Enter detailed course description"
                      className="bg-slate-700/50 border-slate-600 text-white min-h-[100px]"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="type" className="text-white">Course Type</Label>
                      <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                        <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                          <SelectValue placeholder="Select course type" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-600">
                          {courseTypeOptions.map((type) => (
                            <SelectItem key={type} value={type} className="text-white">
                              <div className="flex flex-col">
                                <span>{type}</span>
                                <span className="text-xs text-gray-400">{COURSE_TYPES[type]}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="duration_hours" className="text-white">Duration (Hours)</Label>
                      <Input
                        id="duration_hours"
                        type="number"
                        min="1"
                        max="200"
                        value={formData.duration_hours}
                        onChange={(e) => handleInputChange('duration_hours', parseInt(e.target.value) || 1)}
                        className="bg-slate-700/50 border-slate-600 text-white"
                        required
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
                          <SelectItem value="Draft" className="text-white">Draft</SelectItem>
                          <SelectItem value="Archived" className="text-white">Archived</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="created_by" className="text-white">Created By</Label>
                      <Input
                        id="created_by"
                        value={formData.created_by}
                        onChange={(e) => handleInputChange('created_by', e.target.value)}
                        placeholder="System Admin"
                        className="bg-slate-700/50 border-slate-600 text-white"
                      />
                    </div>
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
                        <span>{isEditing ? 'Update' : 'Create'} Course</span>
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

export default CourseForm; 