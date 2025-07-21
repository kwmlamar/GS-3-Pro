import React, { useState } from 'react';
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
  Users
} from 'lucide-react';

const Training = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const courses = [
    {
      id: 1,
      title: 'Basic Security Fundamentals',
      type: 'Core Training',
      duration: '8 hours',
      enrolled: 45,
      completed: 38,
      status: 'Active'
    },
    {
      id: 2,
      title: 'Advanced Threat Assessment',
      type: 'Specialized',
      duration: '16 hours',
      enrolled: 23,
      completed: 19,
      status: 'Active'
    },
    {
      id: 3,
      title: 'Emergency Response Procedures',
      type: 'Core Training',
      duration: '12 hours',
      enrolled: 67,
      completed: 61,
      status: 'Active'
    }
  ];

  const certificates = [
    {
      id: 1,
      name: 'Security Officer Certification',
      template: 'Standard Template',
      issued: 156,
      valid: '2 years'
    },
    {
      id: 2,
      name: 'Firearms Qualification',
      template: 'Specialized Template',
      issued: 89,
      valid: '1 year'
    },
    {
      id: 3,
      name: 'First Aid Certification',
      template: 'Medical Template',
      issued: 203,
      valid: '2 years'
    }
  ];

  const handleCreateCourse = () => {
    toast({
      title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀"
    });
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
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-80 bg-white/5 border-white/10"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
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
                            course.type === 'Core Training' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'
                          }`}>
                            {course.type}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <span>Duration: {course.duration}</span>
                          <span>•</span>
                          <span>Enrolled: {course.enrolled}</span>
                          <span>•</span>
                          <span>Completed: {course.completed}</span>
                        </div>
                        <div className="mt-2">
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full" 
                              style={{ width: `${(course.completed / course.enrolled) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-400 mt-1">
                            {Math.round((course.completed / course.enrolled) * 100)}% completion rate
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-green-400 text-sm">{course.status}</span>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => toast({ title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀" })}
                          className="border-white/20 hover:bg-white/10"
                        >
                          Manage
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
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
                        <span className="text-white text-sm">{cert.template}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Issued</span>
                        <span className="text-white font-semibold">{cert.issued}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Valid For</span>
                        <span className="text-white text-sm">{cert.valid}</span>
                      </div>
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
    </div>
  );
};

export default Training;