import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { 
  GraduationCap, 
  Plus, 
  Search, 
  FileText,
  Award,
  Upload,
  Edit,
  Play,
  Users,
  Loader2,
  Trash2
} from 'lucide-react';
import { 
  getTrainingCourses, 
  getCertificates, 
  getTrainingStats, 
  getCourseStats,
  searchTrainingCourses,
  deleteTrainingCourse
} from '@/lib/trainingService';
import CourseForm from '@/components/training/CourseForm';

const Training = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [courses, setCourses] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const { toast } = useToast();

  // Load data on component mount
  useEffect(() => {
    loadTrainingData();
  }, []);

  const loadTrainingData = async () => {
    try {
      setLoading(true);
      const [coursesData, certificatesData, statsData] = await Promise.all([
        getTrainingCourses(),
        getCertificates(),
        getTrainingStats()
      ]);
      
      setCourses(coursesData || []);
      setCertificates(certificatesData || []);
      setStats(statsData || {});
    } catch (error) {
      console.error('Error loading training data:', error);
      toast({
        title: "Error loading training data",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = async (searchValue) => {
    setSearchTerm(searchValue);
    if (searchValue.trim()) {
      setSearchLoading(true);
      try {
        const searchResults = await searchTrainingCourses(searchValue);
        setCourses(searchResults || []);
      } catch (error) {
        console.error('Error searching courses:', error);
        toast({
          title: "Error searching courses",
          description: "Please try again.",
          variant: "destructive"
        });
      } finally {
        setSearchLoading(false);
      }
    } else {
      // Reset to all courses if search is cleared
      loadTrainingData();
    }
  };

  const handleCreateCourse = () => {
    setEditingCourse(null);
    setShowCourseForm(true);
  };

  const handleEditCourse = (course) => {
    setEditingCourse(course);
    setShowCourseForm(true);
  };

  const handleCourseFormSuccess = () => {
    loadTrainingData(); // Reload the data after creating/updating a course
  };

  const handleCloseCourseForm = () => {
    setShowCourseForm(false);
    setEditingCourse(null);
  };

  const handleDeleteCourse = async (course) => {
    if (!confirm(`Are you sure you want to delete "${course.title}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await deleteTrainingCourse(course.id);
      toast({
        title: "Course Deleted",
        description: `${course.title} has been deleted successfully.`,
        variant: "default"
      });
      loadTrainingData(); // Reload the data
    } catch (error) {
      console.error('Error deleting course:', error);
      toast({
        title: "Error",
        description: "Failed to delete course. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleUploadTemplate = () => {
    toast({
      title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀"
    });
  };

  const handleCertificateBuilder = () => {
    toast({
      title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀"
    });
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-white">Training & Certification</h1>
          <p className="text-gray-400 mt-2">Create, manage, and deliver comprehensive training programs</p>
        </div>
        <div className="flex space-x-3">
          <Button onClick={handleCreateCourse} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Create Course
          </Button>
          <Button onClick={handleUploadTemplate} variant="outline" className="border-white/20">
            <Upload className="w-4 h-4 mr-2" />
            Upload Template
          </Button>
        </div>
      </motion.div>

      {/* Training Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6"
      >
        <Card className="bg-blue-500/10 border-blue-500/20">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <GraduationCap className="w-8 h-8 text-blue-400" />
              <div>
                <p className="text-gray-400 text-sm">Total Courses</p>
                <p className="text-white text-2xl font-bold">{stats.totalCourses || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-500/10 border-green-500/20">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Users className="w-8 h-8 text-green-400" />
              <div>
                <p className="text-gray-400 text-sm">Total Enrollments</p>
                <p className="text-white text-2xl font-bold">{stats.totalEnrollments || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-purple-500/10 border-purple-500/20">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Award className="w-8 h-8 text-purple-400" />
              <div>
                <p className="text-gray-400 text-sm">Completed</p>
                <p className="text-white text-2xl font-bold">{stats.completedEnrollments || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-yellow-500/10 border-yellow-500/20">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <FileText className="w-8 h-8 text-yellow-400" />
              <div>
                <p className="text-gray-400 text-sm">Completion Rate</p>
                <p className="text-white text-2xl font-bold">{stats.completionRate || 0}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <Tabs defaultValue="courses" className="space-y-6">
        <TabsList className="bg-white/10 border border-white/20">
          <TabsTrigger value="courses">Training Courses</TabsTrigger>
          <TabsTrigger value="certificates">Certificates</TabsTrigger>
          <TabsTrigger value="content">Content Creator</TabsTrigger>
          <TabsTrigger value="delivery">Training Delivery</TabsTrigger>
        </TabsList>

        <TabsContent value="courses" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <GraduationCap className="w-5 h-5 text-blue-400" />
                  <span>Active Training Programs</span>
                </CardTitle>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search courses..."
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-10 w-80 bg-white/5 border-white/10"
                  />
                  {searchLoading && (
                    <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 animate-spin" />
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 text-blue-400 animate-spin mr-2" />
                  <span className="text-gray-400">Loading training courses...</span>
                </div>
              ) : courses.length === 0 ? (
                <div className="text-center py-8">
                  <GraduationCap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-white font-medium mb-2">No courses found</h3>
                  <p className="text-gray-400 text-sm">
                    {searchTerm ? 'No courses match your search criteria.' : 'No training courses available yet.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {courses.map((course) => (
                    <motion.div
                      key={course.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-white font-semibold">{course.title}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              course.type === 'Core Training' ? 'bg-blue-500/20 text-blue-400' : 
                              course.type === 'Specialized' ? 'bg-purple-500/20 text-purple-400' :
                              'bg-yellow-500/20 text-yellow-400'
                            }`}>
                              {course.type}
                            </span>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-400">
                            <span>Duration: {course.duration_hours} hours</span>
                            <span>•</span>
                            <span>Status: {course.status}</span>
                          </div>
                          {course.description && (
                            <p className="text-gray-400 text-sm mt-2">{course.description}</p>
                          )}
                        </div>
                                              <div className="flex items-center space-x-3">
                        <span className={`text-sm ${
                          course.status === 'Active' ? 'text-green-400' : 'text-gray-400'
                        }`}>
                          {course.status}
                        </span>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEditCourse(course)}
                            className="border-white/20 hover:bg-white/10"
                          >
                            Edit
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDeleteCourse(course)}
                            className="border-red-500/20 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="certificates" className="space-y-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Certificate Management</h2>
            <Button onClick={handleCertificateBuilder} className="bg-purple-600 hover:bg-purple-700">
              <Edit className="w-4 h-4 mr-2" />
              Certificate Builder
            </Button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 text-blue-400 animate-spin mr-2" />
              <span className="text-gray-400">Loading certificates...</span>
            </div>
          ) : certificates.length === 0 ? (
            <div className="text-center py-8">
              <Award className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-white font-medium mb-2">No certificates found</h3>
              <p className="text-gray-400 text-sm">No certificates available yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {certificates.map((cert, index) => (
                <motion.div
                  key={cert.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:scale-105 transition-transform duration-200">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Award className="w-5 h-5 text-yellow-400" />
                        <span className="text-lg">{cert.name}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Template</span>
                          <span className="text-white text-sm">{cert.template_name}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Valid For</span>
                          <span className="text-white text-sm">{cert.validity_months} months</span>
                        </div>
                        {cert.description && (
                          <div className="text-gray-400 text-sm mt-2">
                            {cert.description}
                          </div>
                        )}
                        <Button 
                          className="w-full mt-4" 
                          variant="outline"
                          onClick={() => toast({ title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀" })}
                        >
                          Customize Template
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Upload className="w-5 h-5 text-green-400" />
                <span>Drag & Drop Certificate Builder</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-white font-medium mb-2">Upload PDF Background</h3>
                <p className="text-gray-400 text-sm mb-4">
                  Upload a PDF template and use our drag-and-drop editor to create custom certificates
                </p>
                <Button onClick={handleUploadTemplate} className="bg-green-600 hover:bg-green-700">
                  Choose PDF File
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-purple-400" />
                <span>Dynamic Content Creator & Manager</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { title: 'Create Course', icon: GraduationCap, color: 'blue' },
                  { title: 'Build Lesson', icon: FileText, color: 'green' },
                  { title: 'Design Program', icon: Award, color: 'purple' },
                  { title: 'Manage Content', icon: Edit, color: 'yellow' }
                ].map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-6 rounded-lg bg-${item.color}-500/10 border border-${item.color}-500/20 hover:bg-${item.color}-500/20 transition-colors cursor-pointer`}
                    onClick={() => toast({ title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀" })}
                  >
                    <item.icon className={`w-8 h-8 text-${item.color}-400 mb-3`} />
                    <h3 className="text-white font-medium">{item.title}</h3>
                    <p className="text-gray-400 text-sm mt-1">
                      Create and manage training content
                    </p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="delivery" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Play className="w-5 h-5 text-red-400" />
                <span>Training Delivery Options</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-white font-semibold">Internal Training</h3>
                  <div className="space-y-3">
                    <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                      <div className="flex items-center space-x-3">
                        <Users className="w-5 h-5 text-blue-400" />
                        <div>
                          <h4 className="text-white font-medium">Employee Training</h4>
                          <p className="text-gray-400 text-sm">Internal staff and security personnel</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                      <div className="flex items-center space-x-3">
                        <GraduationCap className="w-5 h-5 text-green-400" />
                        <div>
                          <h4 className="text-white font-medium">Certification Programs</h4>
                          <p className="text-gray-400 text-sm">Professional development and compliance</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-white font-semibold">External Training</h3>
                  <div className="space-y-3">
                    <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
                      <div className="flex items-center space-x-3">
                        <Award className="w-5 h-5 text-purple-400" />
                        <div>
                          <h4 className="text-white font-medium">Client Training</h4>
                          <p className="text-gray-400 text-sm">Training services for client organizations</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                      <div className="flex items-center space-x-3">
                        <FileText className="w-5 h-5 text-yellow-400" />
                        <div>
                          <h4 className="text-white font-medium">Commercial Courses</h4>
                          <p className="text-gray-400 text-sm">Sellable training programs and content</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Course Form Modal */}
      {showCourseForm && (
        <CourseForm
          course={editingCourse}
          onClose={handleCloseCourseForm}
          onSuccess={handleCourseFormSuccess}
        />
      )}
    </div>
  );
};

export default Training;