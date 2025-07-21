import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { assessmentService } from '@/lib/assessmentService';
import AssessmentForm from '@/components/assessments/AssessmentForm';
import { 
  ClipboardCheck, 
  Plus, 
  Search, 
  MapPin, 
  Calendar,
  FileText,
  CheckCircle,
  AlertTriangle,
  ListChecks,
  ShoppingCart,
  Home,
  Loader2
} from 'lucide-react';

const Assessments = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [assessments, setAssessments] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingTemplates, setLoadingTemplates] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const { toast } = useToast();

  const serviceOptions = [
    'Physical Security Guards', 'Access Control Systems', 'CCTV Surveillance',
    'Alarm Systems & Monitoring', 'Perimeter Security Solutions', 'Mobile Patrol Services',
    'Emergency Response Planning', 'Risk Assessment & Consulting', 'Executive Protection',
    'Event Security Management', 'Cybersecurity Assessment (Basic)', 'Loss Prevention Services'
  ];

  const assessmentTemplates = [
    { title: 'Standard Commercial Site Assessment', icon: FileText, description: 'Comprehensive template for typical commercial properties.' },
    { title: 'High-Risk Facility Assessment', icon: AlertTriangle, description: 'Specialized template for critical infrastructure or high-threat environments.' },
    { title: 'Retail Security Assessment', icon: ShoppingCart, description: 'Focused on loss prevention and customer safety for retail spaces.' },
    { title: 'Residential Community Assessment', icon: Home, description: 'Tailored for HOAs and residential complexes.' },
  ];


  const handleCreateAssessment = () => {
    setSelectedAssessment(null);
    setShowForm(true);
  };

  const handleEditAssessment = (assessment) => {
    setSelectedAssessment(assessment);
    setShowForm(true);
  };

  const handleSaveAssessment = (savedAssessment) => {
    if (selectedAssessment) {
      // Update existing assessment in the list
      setAssessments(prev => prev.map(a => a.id === savedAssessment.id ? savedAssessment : a));
    } else {
      // Add new assessment to the list
      setAssessments(prev => [savedAssessment, ...prev]);
    }
  };

  // Load assessments from database
  useEffect(() => {
    const loadAssessments = async () => {
      try {
        setLoading(true);
        const data = await assessmentService.getAssessments({ search: searchTerm });
        setAssessments(data);
      } catch (error) {
        console.error('Error loading assessments:', error);
        toast({
          title: "Error loading assessments",
          description: "Failed to load assessments from database",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadAssessments();
  }, [searchTerm, toast]);

  // Load templates from database
  useEffect(() => {
    const loadTemplates = async () => {
      try {
        setLoadingTemplates(true);
        const data = await assessmentService.getAssessmentTemplates();
        setTemplates(data);
      } catch (error) {
        console.error('Error loading templates:', error);
        toast({
          title: "Error loading templates",
          description: "Failed to load assessment templates from database",
          variant: "destructive"
        });
      } finally {
        setLoadingTemplates(false);
      }
    };

    loadTemplates();
  }, [toast]);

  const handleViewAssessment = (id) => {
    toast({
      title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀"
    });
  };
  
  const iosTabsListStyle = "bg-transparent p-0 space-x-1";
  const iosTabsTriggerStyle = "text-gray-400 data-[state=active]:text-blue-400 data-[state=active]:border-blue-400 border-b-2 border-transparent rounded-none px-4 py-2.5 hover:text-blue-300 transition-all duration-200 text-sm font-medium";
  const iosTabsActiveTriggerStyle = "data-[state=active]:bg-transparent data-[state=active]:shadow-none";


  return (
    <div className="space-y-8 pb-10">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center">
            <ClipboardCheck className="w-8 h-8 mr-3 text-blue-400" />
            Security Assessments
          </h1>
          <p className="text-gray-400 mt-1">Evaluate, plan, and manage security solutions for clients.</p>
        </div>
        <Button onClick={handleCreateAssessment} className="ios-button bg-blue-600 hover:bg-blue-700 mt-4 sm:mt-0">
          <Plus className="w-4 h-4 mr-2" />
          New Assessment
        </Button>
      </motion.div>

      <Tabs defaultValue="assessments" className="space-y-6">
        <TabsList className={`${iosTabsListStyle} border-b border-slate-700`}>
          <TabsTrigger value="assessments" className={`${iosTabsTriggerStyle} ${iosTabsActiveTriggerStyle}`}>Active Assessments</TabsTrigger>
          <TabsTrigger value="templates" className={`${iosTabsTriggerStyle} ${iosTabsActiveTriggerStyle}`}>Assessment Templates</TabsTrigger>
          <TabsTrigger value="services" className={`${iosTabsTriggerStyle} ${iosTabsActiveTriggerStyle}`}>Service Checklist</TabsTrigger>
        </TabsList>

        <TabsContent value="assessments" className="space-y-6">
          <Card className="ios-card">
            <CardHeader>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                <CardTitle className="flex items-center space-x-2 text-white">
                  <ClipboardCheck className="w-5 h-5 text-blue-400" />
                  <span>Assessment Overview</span>
                </CardTitle>
                <div className="relative mt-3 sm:mt-0">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search assessments..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full sm:w-80 bg-slate-700/50 border-slate-600 text-gray-200 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
                  <span className="ml-2 text-gray-400">Loading assessments...</span>
                </div>
              ) : assessments.length === 0 ? (
                <div className="text-center py-8">
                  <ClipboardCheck className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400">No assessments found</p>
                  <p className="text-gray-500 text-sm mt-1">Create your first assessment to get started</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {assessments.map((assessment) => (
                    <motion.div
                      key={assessment.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-lg bg-slate-800/40 border border-slate-700 hover:bg-slate-700/60 transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                        <div className="flex-1 mb-3 sm:mb-0">
                          <div className="flex items-center space-x-3 mb-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              assessment.assessment_type === 'New Site' ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400'
                            }`}>
                              {assessment.assessment_type}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              assessment.priority === 'High' ? 'bg-red-500/20 text-red-400' :
                              assessment.priority === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-gray-500/20 text-gray-400'
                            }`}>
                              {assessment.priority} Priority
                            </span>
                          </div>
                          <h3 className="text-white font-semibold text-lg">{assessment.client_name}</h3>
                          <div className="flex items-center space-x-3 mt-1 text-sm text-gray-400">
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-3.5 h-3.5" />
                              <span>{assessment.location}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-3.5 h-3.5" />
                              <span>{assessment.scheduled_date}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-1.5">
                            {assessment.status === 'Completed' ? (
                              <CheckCircle className="w-4 h-4 text-green-400" />
                            ) : assessment.status === 'In Progress' ? (
                              <AlertTriangle className="w-4 h-4 text-yellow-400 animate-pulse" />
                            ) : (
                              <Calendar className="w-4 h-4 text-blue-400" />
                            )}
                            <span className="text-sm text-gray-300">{assessment.status}</span>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEditAssessment(assessment)}
                            className="ios-button border-slate-600 hover:bg-slate-700"
                          >
                            Edit
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <Card className="ios-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white">
                <FileText className="w-5 h-5 text-purple-400" />
                <span>Assessment Templates</span>
              </CardTitle>
              <CardDescription className="text-gray-400">Standardized templates for various assessment types.</CardDescription>
            </CardHeader>
            <CardContent>
              {loadingTemplates ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-purple-400" />
                  <span className="ml-2 text-gray-400">Loading templates...</span>
                </div>
              ) : templates.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400">No templates found</p>
                  <p className="text-gray-500 text-sm mt-1">Assessment templates will appear here</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {templates.map((template, index) => (
                    <motion.div
                      key={template.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-4 rounded-lg bg-slate-800/40 border border-slate-700 hover:bg-slate-700/60 transition-colors cursor-pointer flex items-start space-x-4"
                      onClick={() => toast({ title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀" })}
                    >
                      <FileText className="w-8 h-8 text-purple-400 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="text-white font-medium mb-1">{template.title}</h3>
                        <p className="text-gray-400 text-sm">{template.description}</p>
                        <span className="text-xs text-purple-400 mt-1">{template.template_type}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services" className="space-y-6">
          <Card className="ios-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white">
                <ListChecks className="w-5 h-5 text-green-400" />
                <span>Available Security Services Checklist</span>
              </CardTitle>
              <CardDescription className="text-gray-400">Standard list of services offered for assessments.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {serviceOptions.map((service, index) => (
                  <motion.div
                    key={service}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="flex items-center space-x-2 p-3 rounded-md bg-slate-800/40 border border-slate-700"
                  >
                    <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                    <span className="text-white text-sm">{service}</span>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Assessment Form Modal */}
      {showForm && (
        <AssessmentForm
          assessment={selectedAssessment}
          onClose={() => {
            setShowForm(false);
            setSelectedAssessment(null);
          }}
          onSave={handleSaveAssessment}
        />
      )}
    </div>
  );
};

export default Assessments;