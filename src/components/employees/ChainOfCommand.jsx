import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { 
  Users, 
  UserCheck, 
  TrendingUp, 
  Network, 
  ArrowUpDown,
  UserPlus,
  UserMinus,
  Building2,
  Crown,
  Star,
  Shield,
  GraduationCap,
  Briefcase
} from 'lucide-react';
import { 
  getOrganizationalChart, 
  getDirectReports, 
  getSupervisorChain,
  getEntityStaffWithSupervisors,
  updateEntityStaffSupervisor 
} from '@/lib/entityStaffService';

const ChainOfCommand = () => {
  const [orgChart, setOrgChart] = useState([]);
  const [employeesWithSupervisors, setEmployeesWithSupervisors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [directReports, setDirectReports] = useState([]);
  const [supervisorChain, setSupervisorChain] = useState([]);
  const [activeTab, setActiveTab] = useState('org_chart');
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [orgChartData, employeesData] = await Promise.all([
        getOrganizationalChart(),
        getEntityStaffWithSupervisors()
      ]);

      if (orgChartData.error) throw orgChartData.error;
      if (employeesData.error) throw employeesData.error;

      setOrgChart(orgChartData.data || []);
      setEmployeesWithSupervisors(employeesData.data || []);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error loading chain of command data',
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEmployeeSelect = async (employee) => {
    setSelectedEmployee(employee);
    
    try {
      const [reportsData, supervisorsData] = await Promise.all([
        getDirectReports(employee.id),
        getSupervisorChain(employee.id)
      ]);

      if (reportsData.error) throw reportsData.error;
      if (supervisorsData.error) throw supervisorsData.error;

      setDirectReports(reportsData.data || []);
      setSupervisorChain(supervisorsData.data || []);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error loading employee details',
        description: error.message
      });
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Operations Management':
        return <Crown className="w-4 h-4 text-purple-400" />;
      case 'Supervisor':
        return <Star className="w-4 h-4 text-yellow-400" />;
      case 'Consultant':
        return <GraduationCap className="w-4 h-4 text-green-400" />;
      case 'Standard Officer':
        return <Shield className="w-4 h-4 text-blue-400" />;
      default:
        return <Users className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Inactive':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'On Leave':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const renderOrgChartLevel = (employees, level = 0) => {
    return (
      <div className="space-y-4">
        {employees.map((employee) => (
          <motion.div
            key={employee.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`relative ${level > 0 ? 'ml-8 border-l-2 border-slate-600 pl-4' : ''}`}
          >
            <Card 
              className={`cursor-pointer transition-all hover:bg-slate-700/50 ${
                selectedEmployee?.id === employee.id ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => handleEmployeeSelect(employee)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getTypeIcon(employee.type)}
                    <div>
                      <h3 className="font-semibold text-white">{employee.name}</h3>
                      <p className="text-sm text-gray-400">{employee.role}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge className={`text-xs ${getStatusColor(employee.status)}`}>
                          {employee.status}
                        </Badge>
                        <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">
                          {employee.type}
                        </Badge>
                        {employee.has_reports && (
                          <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                            Has Reports
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-400">{employee.compliance}% Compliant</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Render direct reports */}
            {employee.has_reports && (
              <div className="mt-4">
                {renderOrgChartLevel(
                  orgChart.filter(emp => emp.supervisor_id === employee.id),
                  level + 1
                )}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-gray-400">Loading chain of command...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center">
            <Network className="w-8 h-8 mr-3 text-blue-400" />
            Chain of Command
          </h1>
          <p className="text-gray-400 mt-1">View and manage organizational hierarchy and reporting relationships.</p>
        </div>
      </motion.div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-slate-800 border border-slate-600">
          <TabsTrigger value="org_chart" className="text-white">Organizational Chart</TabsTrigger>
          <TabsTrigger value="employee_list" className="text-white">Employee List</TabsTrigger>
          <TabsTrigger value="employee_detail" className="text-white">Employee Details</TabsTrigger>
        </TabsList>

        <TabsContent value="org_chart" className="space-y-6">
          <Card className="ios-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white">
                <Network className="w-5 h-5 text-blue-400" />
                <span>Organizational Hierarchy</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {orgChart.length === 0 ? (
                <div className="text-center py-12">
                  <Network className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400">No organizational data available.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {renderOrgChartLevel(orgChart.filter(emp => emp.level === 0))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="employee_list" className="space-y-6">
          <Card className="ios-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white">
                <Users className="w-5 h-5 text-blue-400" />
                <span>All Employees with Supervisors</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {employeesWithSupervisors.map((employee) => (
                  <motion.div
                    key={employee.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-lg bg-slate-800/40 border border-slate-700 hover:bg-slate-700/60 transition-colors cursor-pointer"
                    onClick={() => handleEmployeeSelect(employee)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getTypeIcon(employee.type)}
                        <div>
                          <h3 className="font-semibold text-white">{employee.name}</h3>
                          <p className="text-sm text-gray-400">{employee.role}</p>
                          {employee.supervisor_name && (
                            <p className="text-xs text-blue-400">
                              Reports to: {employee.supervisor_name}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={`text-xs ${getStatusColor(employee.status)}`}>
                          {employee.status}
                        </Badge>
                        <p className="text-sm text-gray-400 mt-1">{employee.compliance}% Compliant</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="employee_detail" className="space-y-6">
          {selectedEmployee ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Employee Information */}
              <Card className="ios-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-white">
                    <UserCheck className="w-5 h-5 text-blue-400" />
                    <span>Employee Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      {getTypeIcon(selectedEmployee.type)}
                      <div>
                        <h3 className="font-semibold text-white text-lg">{selectedEmployee.name}</h3>
                        <p className="text-gray-400">{selectedEmployee.role}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-400">Type</p>
                        <p className="text-white">{selectedEmployee.type}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Status</p>
                        <Badge className={`text-xs ${getStatusColor(selectedEmployee.status)}`}>
                          {selectedEmployee.status}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Compliance</p>
                        <p className="text-white">{selectedEmployee.compliance}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Hire Date</p>
                        <p className="text-white">{new Date(selectedEmployee.hire_date).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Direct Reports */}
              <Card className="ios-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-white">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                    <span>Direct Reports ({directReports.length})</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {directReports.length === 0 ? (
                    <p className="text-gray-400">No direct reports</p>
                  ) : (
                    <div className="space-y-3">
                      {directReports.map((report) => (
                        <div key={report.id} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                          <div className="flex items-center space-x-3">
                            {getTypeIcon(report.type)}
                            <div>
                              <p className="font-medium text-white">{report.name}</p>
                              <p className="text-sm text-gray-400">{report.role}</p>
                            </div>
                          </div>
                          <Badge className={`text-xs ${getStatusColor(report.status)}`}>
                            {report.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Supervisor Chain */}
              <Card className="ios-card lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-white">
                    <ArrowUpDown className="w-5 h-5 text-purple-400" />
                    <span>Reporting Chain</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {supervisorChain.length === 0 ? (
                    <p className="text-gray-400">No supervisors in chain</p>
                  ) : (
                    <div className="flex items-center space-x-4">
                      {supervisorChain.map((supervisor, index) => (
                        <div key={supervisor.id} className="flex items-center space-x-2">
                          <div className="flex items-center space-x-2 p-3 bg-slate-700/30 rounded-lg">
                            {getTypeIcon(supervisor.type)}
                            <div>
                              <p className="font-medium text-white">{supervisor.name}</p>
                              <p className="text-sm text-gray-400">{supervisor.role}</p>
                            </div>
                          </div>
                          {index < supervisorChain.length - 1 && (
                            <ArrowUpDown className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card className="ios-card">
              <CardContent className="text-center py-12">
                <UserCheck className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400">Select an employee to view detailed information</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ChainOfCommand; 