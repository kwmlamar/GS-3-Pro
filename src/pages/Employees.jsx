import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { 
  Users, 
  Plus, 
  Search, 
  Shield,
  UserCheck,
  GraduationCap,
  FileCheck,
  Star,
  AlertTriangle,
  Briefcase,
  Loader2
} from 'lucide-react';
import EmployeeForm from '@/components/employees/EmployeeForm';
import EmployeeDetail from '@/components/employees/EmployeeDetail';
import { 
  getEmployees, 
  searchEmployees, 
  getEmployeeStats, 
  initializeEmployeeData,
  getBackgroundCheckStats,
  getOnboardingStats,
  EMPLOYEE_TYPES 
} from '@/lib/employeeService';
import { testDatabaseConnection } from '@/lib/testConnection';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [backgroundStats, setBackgroundStats] = useState(null);
  const [onboardingStats, setOnboardingStats] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const { toast } = useToast();

  // Load employees on component mount
  useEffect(() => {
    loadEmployees();
    loadBackgroundStats();
    loadOnboardingStats();
  }, []);

  // Filter employees when search term changes
  useEffect(() => {
    // First filter out archived employees
    const activeEmployees = employees.filter(emp => emp.status !== 'Archived');
    
    if (searchTerm.trim() === '') {
      setFilteredEmployees(activeEmployees);
    } else {
      const filtered = activeEmployees.filter(emp => 
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.site.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredEmployees(filtered);
    }
  }, [searchTerm, employees]);

  const loadEmployees = async () => {
    setLoading(true);
    try {
      const { data, error } = await getEmployees();
      if (error) throw error;
      
      setEmployees(data || []);
      
      // Initialize sample data if no employees exist
      if (!data || data.length === 0) {
        const { data: initData } = await initializeEmployeeData();
        if (initData) {
          setEmployees(initData);
        }
      }
    } catch (error) {
      console.error('Error loading employees:', error);
      toast({
        title: "Error",
        description: "Failed to load employees. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const { data, error } = await getEmployeeStats();
      if (error) throw error;
      setStats(data);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const loadBackgroundStats = async () => {
    try {
      const { data, error } = await getBackgroundCheckStats();
      if (error) throw error;
      setBackgroundStats(data);
    } catch (error) {
      console.error('Error loading background stats:', error);
    }
  };

  const loadOnboardingStats = async () => {
    try {
      const { data, error } = await getOnboardingStats();
      if (error) throw error;
      setOnboardingStats(data);
    } catch (error) {
      console.error('Error loading onboarding stats:', error);
    }
  };

  const handleAddEmployee = () => {
    setShowAddForm(true);
  };

  const handleViewEmployee = (employee) => {
    setSelectedEmployee(employee);
  };

  const handleEmployeeUpdate = (updatedEmployee) => {
    setEmployees(prev => 
      prev.map(emp => emp.id === updatedEmployee.id ? updatedEmployee : emp)
    );
    setSelectedEmployee(null);
    // Refresh stats when employee is updated
    loadBackgroundStats();
    loadOnboardingStats();
  };

  const handleEmployeeCreated = (newEmployee) => {
    setEmployees(prev => [newEmployee, ...prev]);
    setShowAddForm(false);
    // Refresh stats when new employee is added
    loadBackgroundStats();
    loadOnboardingStats();
  };

  const handleTestConnection = async () => {
    const result = await testDatabaseConnection();
    toast({
      title: result.success ? "Database Test Successful" : "Database Test Failed",
      description: result.message,
      variant: result.success ? "default" : "destructive"
    });
  };

  // Generate employee types with real counts
  const employeeTypes = Object.entries(EMPLOYEE_TYPES).map(([type, config]) => {
    const count = employees.filter(emp => emp.type === type).length;
    return {
      type,
      description: config.description,
      requirements: config.requirements,
      count,
      icon: config.icon === 'Shield' ? Shield :
            config.icon === 'Users' ? Users :
            config.icon === 'Star' ? Star :
            config.icon === 'Briefcase' ? Briefcase :
            config.icon === 'GraduationCap' ? GraduationCap : Shield
    };
  });
  
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
            <Users className="w-8 h-8 mr-3 text-blue-400" />
            Security Staff Management
          </h1>
          <p className="text-gray-400 mt-1">Manage security personnel, credentials, and compliance efficiently.</p>
        </div>
        <Button onClick={handleAddEmployee} className="ios-button bg-blue-600 hover:bg-blue-700 mt-4 sm:mt-0">
          <Plus className="w-4 h-4 mr-2" />
          Add Employee
        </Button>
      </motion.div>

      <Tabs defaultValue="employees" className="space-y-6">
        <TabsList className={`${iosTabsListStyle} border-b border-slate-700`}>
                      <TabsTrigger value="employees" className={`${iosTabsTriggerStyle} ${iosTabsActiveTriggerStyle}`}>Security Staff</TabsTrigger>
          <TabsTrigger value="types" className={`${iosTabsTriggerStyle} ${iosTabsActiveTriggerStyle}`}>Employee Types</TabsTrigger>
          <TabsTrigger value="background" className={`${iosTabsTriggerStyle} ${iosTabsActiveTriggerStyle}`}>Background Checks</TabsTrigger>
          <TabsTrigger value="onboarding" className={`${iosTabsTriggerStyle} ${iosTabsActiveTriggerStyle}`}>Onboarding</TabsTrigger>
        </TabsList>

        <TabsContent value="employees" className="space-y-6">
          <Card className="ios-card">
            <CardHeader>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                <CardTitle className="flex items-center space-x-2 text-white">
                  <Users className="w-5 h-5 text-blue-400" />
                  <span>Active Security Staff ({filteredEmployees.length})</span>
                </CardTitle>
                <div className="relative mt-3 sm:mt-0">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search security staff..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full sm:w-80 bg-slate-700/50 border-slate-600 text-gray-200 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
                  <span className="ml-3 text-gray-400">Loading security staff...</span>
                </div>
              ) : filteredEmployees.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400 mb-2">
                    {searchTerm ? 'No security staff found matching your search.' : 'No security staff found.'}
                  </p>
                  {!searchTerm && (
                    <Button onClick={handleAddEmployee} className="mt-4">
                      <Plus className="w-4 h-4 mr-2" />
                      Add First Security Staff
                    </Button>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredEmployees.map((employee) => (
                    <motion.div
                      key={employee.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-lg bg-slate-800/40 border border-slate-700 hover:bg-slate-700/60 transition-colors cursor-pointer"
                      onClick={() => handleViewEmployee(employee)}
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                        <div className="flex-1 mb-3 sm:mb-0">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-white font-semibold text-lg">{employee.name}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              employee.type === 'Operations Management' ? 'bg-purple-500/20 text-purple-400' :
                              employee.type === 'Supervisor' ? 'bg-blue-500/20 text-blue-400' :
                              employee.type === 'Consultant' ? 'bg-green-500/20 text-green-400' :
                              employee.type === 'Dual-Role Hybrid' ? 'bg-orange-500/20 text-orange-400' :
                              'bg-gray-500/20 text-gray-400'
                            }`}>
                              {employee.type}
                            </span>
                            <div className="flex items-center space-x-1">
                              <div className={`w-2.5 h-2.5 rounded-full ${
                                employee.compliance >= 95 ? 'bg-green-500' :
                                employee.compliance >= 85 ? 'bg-yellow-500' : 'bg-red-500'
                              }`} />
                              <span className="text-xs text-gray-400">{employee.compliance}% Compliant</span>
                            </div>
                          </div>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-400">
                            <span>{employee.role}</span>
                            <span>•</span>
                            <span>
                              {employee.primaryEntity || employee.site || 'No entity assigned'}
                              {employee.entities && employee.entities.length > 1 && (
                                <span className="text-xs text-slate-500 ml-1">
                                  (+{employee.entities.length - 1} more)
                                </span>
                              )}
                            </span>
                            <span>•</span>
                            <span>{Array.isArray(employee.certifications) ? employee.certifications.length : 0} Certs</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className={`text-sm font-medium ${employee.status === 'Active' ? 'text-green-400' : 'text-red-400'}`}>{employee.status}</span>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewEmployee(employee);
                            }}
                            className="ios-button border-slate-600 hover:bg-slate-700"
                          >
                            View Profile
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

        <TabsContent value="types" className="space-y-6">
          <Card className="ios-card">
            <CardHeader>
                          <CardTitle className="text-white">Security Staff Role Definitions</CardTitle>
            <CardDescription className="text-gray-400">Overview of different security staff types and their requirements.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {employeeTypes.map((type, index) => (
                  <motion.div
                    key={type.type}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="ios-card h-full hover-lift">
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between text-white">
                          <div className="flex items-center space-x-2">
                            <type.icon className="w-6 h-6 text-blue-400" />
                            <span className="text-lg">{type.type}</span>
                          </div>
                          <span className="text-2xl font-bold text-blue-400">{type.count}</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-400 text-sm mb-3 h-12 overflow-hidden">{type.description}</p>
                        <div className="space-y-1.5">
                          <h4 className="text-white font-medium text-xs">Key Requirements:</h4>
                          {type.requirements.slice(0,2).map((req, idx) => (
                            <div key={idx} className="flex items-center space-x-1.5 text-xs text-gray-400">
                              <UserCheck className="w-3 h-3 text-green-400 flex-shrink-0" />
                              <span>{req}</span>
                            </div>
                          ))}
                           {type.requirements.length > 2 && <p className="text-xs text-slate-500">...and more</p>}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="background" className="space-y-6">
          <Card className="ios-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white">
                <Shield className="w-5 h-5 text-red-400" />
                <span>Background Check & Credentialing</span>
              </CardTitle>
              <CardDescription className="text-gray-400">System for managing employee vetting and credentials.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4 p-4 rounded-lg bg-slate-800/40">
                  <h3 className="text-white font-semibold">Background Check Components</h3>
                  {[
                    'Criminal History Verification', 'Employment History Verification', 'Education Verification',
                    'Reference Checks', 'Credit History (if applicable)', 'Drug Screening', 'Security Clearance'
                  ].map((check, index) => (
                    <div key={index} className="flex items-center space-x-2 p-2.5 rounded-md bg-slate-700/50">
                      <FileCheck className="w-4 h-4 text-green-400 flex-shrink-0" />
                      <span className="text-white text-sm">{check}</span>
                    </div>
                  ))}
                </div>
                <div className="space-y-4 p-4 rounded-lg bg-slate-800/40">
                  <h3 className="text-white font-semibold">Credentialing Status</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-md bg-green-500/10">
                      <span className="text-white">Completed Checks</span>
                      <span className="text-green-400 font-semibold">
                        {backgroundStats ? backgroundStats.completedChecks : '...'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-md bg-yellow-500/10">
                      <span className="text-white">In Progress</span>
                      <span className="text-yellow-400 font-semibold">
                        {backgroundStats ? backgroundStats.inProgress : '...'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-md bg-red-500/10">
                      <span className="text-white">Pending Review</span>
                      <span className="text-red-400 font-semibold">
                        {backgroundStats ? backgroundStats.pendingReview : '...'}
                      </span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400 mt-2">
                    Total Security Staff: {backgroundStats ? backgroundStats.totalEmployees : '...'}
                  </div>
                   <Button variant="outline" className="w-full mt-4 glass-button" onClick={() => toast({title: "🚧 Feature Not Implemented"})}>Manage Credentials</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="onboarding" className="space-y-6">
          <Card className="ios-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white">
                <GraduationCap className="w-5 h-5 text-purple-400" />
                <span>Onboarding & Qualification System</span>
              </CardTitle>
              <CardDescription className="text-gray-400">Streamlined process for new hires.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 rounded-lg bg-blue-500/10">
                    <Star className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                    <h3 className="text-white font-semibold">New Hires</h3>
                    <p className="text-2xl font-bold text-blue-400">
                      {onboardingStats ? onboardingStats.newHires : '...'}
                    </p>
                    <p className="text-gray-400 text-sm">This Month</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-yellow-500/10">
                    <AlertTriangle className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                    <h3 className="text-white font-semibold">In Training</h3>
                    <p className="text-2xl font-bold text-yellow-400">
                      {onboardingStats ? onboardingStats.inTraining : '...'}
                    </p>
                    <p className="text-gray-400 text-sm">Active</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-green-500/10">
                    <UserCheck className="w-8 h-8 text-green-400 mx-auto mb-2" />
                    <h3 className="text-white font-semibold">Qualified</h3>
                    <p className="text-2xl font-bold text-green-400">
                      {onboardingStats ? onboardingStats.qualified : '...'}
                    </p>
                    <p className="text-gray-400 text-sm">Ready for Duty</p>
                  </div>
                </div>
                
                <div className="p-4 rounded-lg bg-slate-800/40">
                  <h3 className="text-white font-semibold mb-3">Onboarding Process Steps</h3>
                  <div className="space-y-3">
                  {[
                    'Document Collection & Verification', 'Background Check Completion', 'Basic Security Training',
                    'Site-Specific Training', 'Equipment Assignment', 'Supervisor Introduction', 'First Week Mentoring'
                  ].map((step, index) => (
                    <div key={index} className="flex items-center space-x-3 p-2.5 rounded-md bg-slate-700/50">
                      <div className="w-6 h-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center font-semibold flex-shrink-0">
                        {index + 1}
                      </div>
                      <span className="text-white text-sm">{step}</span>
                    </div>
                  ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Employee Form Modal */}
      {showAddForm && (
        <EmployeeForm
          onClose={() => setShowAddForm(false)}
          onSuccess={handleEmployeeCreated}
        />
      )}

      {/* Employee Detail Modal */}
      {selectedEmployee && (
        <EmployeeDetail
          employee={selectedEmployee}
          onClose={() => setSelectedEmployee(null)}
          onUpdate={handleEmployeeUpdate}
        />
      )}
    </div>
  );
};

export default Employees;