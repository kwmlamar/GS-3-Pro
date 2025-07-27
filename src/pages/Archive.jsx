import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { 
  Archive as ArchiveIcon, 
  Search, 
  RefreshCw, 
  Trash2, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Shield,
  CheckCircle,
  AlertCircle,
  RotateCcw,
  Filter,
  Users,
  Building2,
  FileText,
  AlertTriangle,
  GraduationCap,
  Briefcase,
  HardHat,
  Loader2
} from 'lucide-react';
import { getEmployees, updateEmployee, deleteEmployee } from '@/lib/employeeService';
import { supabase } from '@/lib/supabaseClient';
import EmployeeDetail from '@/components/employees/EmployeeDetail';

const Archive = () => {
  const [employees, setEmployees] = useState([]);
  const [sites, setSites] = useState([]);
  const [subcontractors, setSubcontractors] = useState([]);
  const [training, setTraining] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showEmployeeDetail, setShowEmployeeDetail] = useState(false);
  const [activeTab, setActiveTab] = useState('employees');
  const { toast } = useToast();

  const fetchArchivedData = async () => {
    setLoading(true);
    try {
      // Fetch archived employees
      const { data: employeesData, error: employeesError } = await getEmployees();
      if (employeesError) throw employeesError;
      const archivedEmployees = employeesData.filter(emp => emp.status === 'Archived');
      setEmployees(archivedEmployees);

      // Fetch archived sites
      const { data: sitesData, error: sitesError } = await supabase
        .from('sites')
        .select('*')
        .eq('is_active', false);
      if (!sitesError) setSites(sitesData || []);

      // Fetch archived subcontractors
      const { data: subcontractorsData, error: subcontractorsError } = await supabase
        .from('subcontractors')
        .select('*')
        .eq('status', 'Archived');
      if (!subcontractorsError) setSubcontractors(subcontractorsData || []);

      // Fetch archived training courses
      const { data: trainingData, error: trainingError } = await supabase
        .from('training_courses')
        .select('*')
        .eq('status', 'Archived');
      if (!trainingError) setTraining(trainingData || []);

      // Fetch archived incidents
      const { data: incidentsData, error: incidentsError } = await supabase
        .from('health_safety_incidents')
        .select('*')
        .eq('status', 'Archived');
      if (!incidentsError) setIncidents(incidentsData || []);

    } catch (error) {
      console.error('Error fetching archived data:', error);
      toast({
        title: "Error",
        description: "Failed to load archived data.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArchivedData();
  }, []);

  const handleRestore = async (item, type) => {
    try {
      let result;
      
      switch (type) {
        case 'employee':
          result = await updateEmployee(item.id, { ...item, status: 'Active' });
          break;
        case 'site':
          result = await supabase
            .from('sites')
            .update({ is_active: true })
            .eq('id', item.id);
          break;
        case 'subcontractor':
          result = await supabase
            .from('subcontractors')
            .update({ status: 'Active' })
            .eq('id', item.id);
          break;
        case 'training':
          result = await supabase
            .from('training_courses')
            .update({ status: 'Active' })
            .eq('id', item.id);
          break;
        case 'incident':
          result = await supabase
            .from('health_safety_incidents')
            .update({ status: 'Active' })
            .eq('id', item.id);
          break;
        default:
          throw new Error('Unknown item type');
      }

      if (result?.error) throw result.error;

      toast({
        title: "Item Restored",
        description: `${item.name || item.title || 'Item'} has been restored to active status.`,
        variant: "default"
      });

      fetchArchivedData();
      setShowEmployeeDetail(false);
    } catch (error) {
      console.error('Error restoring item:', error);
      toast({
        title: "Error",
        description: "Failed to restore item.",
        variant: "destructive"
      });
    }
  };

  const handlePermanentDelete = async (item, type) => {
    const itemName = item.name || item.title || 'Item';
    if (!window.confirm(`Are you sure you want to permanently delete ${itemName}? This action cannot be undone.`)) {
      return;
    }

    try {
      let result;
      
      switch (type) {
        case 'employee':
          result = await deleteEmployee(item.id);
          break;
        case 'site':
          result = await supabase
            .from('sites')
            .delete()
            .eq('id', item.id);
          break;
        case 'subcontractor':
          result = await supabase
            .from('subcontractors')
            .delete()
            .eq('id', item.id);
          break;
        case 'training':
          result = await supabase
            .from('training_courses')
            .delete()
            .eq('id', item.id);
          break;
        case 'incident':
          result = await supabase
            .from('health_safety_incidents')
            .delete()
            .eq('id', item.id);
          break;
        default:
          throw new Error('Unknown item type');
      }

      if (result?.error) throw result.error;

      toast({
        title: "Item Deleted",
        description: `${itemName} has been permanently deleted.`,
        variant: "default"
      });

      fetchArchivedData();
      setShowEmployeeDetail(false);
    } catch (error) {
      console.error('Error deleting item:', error);
      toast({
        title: "Error",
        description: "Failed to delete item.",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Inactive': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'On Leave': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'Terminated': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      case 'Archived': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getComplianceColor = (compliance) => {
    if (compliance >= 95) return 'text-green-400';
    if (compliance >= 85) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getComplianceIcon = (compliance) => {
    if (compliance >= 95) return <CheckCircle className="w-4 h-4 text-green-400" />;
    if (compliance >= 85) return <AlertCircle className="w-4 h-4 text-yellow-400" />;
    return <AlertCircle className="w-4 h-4 text-red-400" />;
  };

  const filterItems = (items, searchTerm) => {
    if (!searchTerm) return items;
    return items.filter(item => {
      const searchFields = [
        item.name || item.title || '',
        item.role || '',
        item.site || item.location || '',
        item.type || item.category || ''
      ].join(' ').toLowerCase();
      return searchFields.includes(searchTerm.toLowerCase());
    });
  };

  const getTabStats = () => {
    const filteredEmployees = filterItems(employees, searchTerm);
    const filteredSites = filterItems(sites, searchTerm);
    const filteredSubcontractors = filterItems(subcontractors, searchTerm);
    const filteredTraining = filterItems(training, searchTerm);
    const filteredIncidents = filterItems(incidents, searchTerm);

    return {
      employees: { total: employees.length, filtered: filteredEmployees.length },
      sites: { total: sites.length, filtered: filteredSites.length },
      subcontractors: { total: subcontractors.length, filtered: filteredSubcontractors.length },
      training: { total: training.length, filtered: filteredTraining.length },
      incidents: { total: incidents.length, filtered: filteredIncidents.length }
    };
  };

  const stats = getTabStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-blue-500 mx-auto mb-4"></div>
          <p className="text-white">Loading archived data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div className="flex items-center space-x-3">
          <ArchiveIcon className="w-8 h-8 text-purple-400" />
          <div>
            <h1 className="text-2xl font-bold text-white">System Archive</h1>
            <p className="text-slate-400">Manage archived items across all system modules</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={fetchArchivedData}
            className="border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="ios-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-blue-400" />
              <span className="text-white font-semibold">Employees</span>
            </div>
            <p className="text-2xl font-bold text-white mt-2">{stats.employees.total}</p>
          </CardContent>
        </Card>
        <Card className="ios-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Building2 className="w-5 h-5 text-green-400" />
              <span className="text-white font-semibold">Sites</span>
            </div>
            <p className="text-2xl font-bold text-white mt-2">{stats.sites.total}</p>
          </CardContent>
        </Card>
        <Card className="ios-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Briefcase className="w-5 h-5 text-orange-400" />
              <span className="text-white font-semibold">Subcontractors</span>
            </div>
            <p className="text-2xl font-bold text-white mt-2">{stats.subcontractors.total}</p>
          </CardContent>
        </Card>
        <Card className="ios-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <GraduationCap className="w-5 h-5 text-purple-400" />
              <span className="text-white font-semibold">Training</span>
            </div>
            <p className="text-2xl font-bold text-white mt-2">{stats.training.total}</p>
          </CardContent>
        </Card>
        <Card className="ios-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <span className="text-white font-semibold">Incidents</span>
            </div>
            <p className="text-2xl font-bold text-white mt-2">{stats.incidents.total}</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card className="ios-card">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Search archived items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-700/50 border-slate-600 text-white"
            />
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 bg-slate-800 border border-slate-600">
          <TabsTrigger value="employees" className="data-[state=active]:bg-slate-700 data-[state=active]:text-white">
            <Users className="w-4 h-4 mr-2" />
            Employees ({stats.employees.filtered})
          </TabsTrigger>
          <TabsTrigger value="sites" className="data-[state=active]:bg-slate-700 data-[state=active]:text-white">
            <Building2 className="w-4 h-4 mr-2" />
            Sites ({stats.sites.filtered})
          </TabsTrigger>
          <TabsTrigger value="subcontractors" className="data-[state=active]:bg-slate-700 data-[state=active]:text-white">
            <Briefcase className="w-4 h-4 mr-2" />
            Subcontractors ({stats.subcontractors.filtered})
          </TabsTrigger>
          <TabsTrigger value="training" className="data-[state=active]:bg-slate-700 data-[state=active]:text-white">
            <GraduationCap className="w-4 h-4 mr-2" />
            Training ({stats.training.filtered})
          </TabsTrigger>
          <TabsTrigger value="incidents" className="data-[state=active]:bg-slate-700 data-[state=active]:text-white">
            <AlertTriangle className="w-4 h-4 mr-2" />
            Incidents ({stats.incidents.filtered})
          </TabsTrigger>
        </TabsList>

        {/* Employees Tab */}
        <TabsContent value="employees" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {filterItems(employees, searchTerm).map((employee) => (
                <motion.div
                  key={employee.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="ios-card hover:bg-slate-700/30 transition-all duration-200 cursor-pointer group">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                            {employee.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <h3 className="text-white font-semibold group-hover:text-purple-300 transition-colors">
                              {employee.name}
                            </h3>
                            <p className="text-slate-400 text-sm">{employee.role}</p>
                          </div>
                        </div>
                        <Badge className={getStatusColor(employee.status)}>
                          {employee.status}
                        </Badge>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center space-x-2 text-sm">
                          <Mail className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-300">{employee.email}</span>
                        </div>
                        {employee.phone && (
                          <div className="flex items-center space-x-2 text-sm">
                            <Phone className="w-4 h-4 text-slate-400" />
                            <span className="text-slate-300">{employee.phone}</span>
                          </div>
                        )}
                        <div className="flex items-center space-x-2 text-sm">
                          <MapPin className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-300">{employee.site}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          {getComplianceIcon(employee.compliance)}
                          <span className={`font-medium ${getComplianceColor(employee.compliance)}`}>
                            {employee.compliance}% Compliant
                          </span>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedEmployee(employee);
                            setShowEmployeeDetail(true);
                          }}
                          className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"
                        >
                          <User className="w-4 h-4 mr-2" />
                          View
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleRestore(employee, 'employee')}
                          className="flex-1 bg-green-600 hover:bg-green-700"
                        >
                          <RotateCcw className="w-4 h-4 mr-2" />
                          Restore
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handlePermanentDelete(employee, 'employee')}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </TabsContent>

        {/* Sites Tab */}
        <TabsContent value="sites" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {filterItems(sites, searchTerm).map((site) => (
                <motion.div
                  key={site.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="ios-card hover:bg-slate-700/30 transition-all duration-200">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                            {site.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <h3 className="text-white font-semibold">{site.name}</h3>
                            <p className="text-slate-400 text-sm">{site.type}</p>
                          </div>
                        </div>
                        <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                          Archived
                        </Badge>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center space-x-2 text-sm">
                          <MapPin className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-300">{site.location || 'No location'}</span>
                        </div>
                        {site.description && (
                          <div className="flex items-center space-x-2 text-sm">
                            <FileText className="w-4 h-4 text-slate-400" />
                            <span className="text-slate-300">{site.description.substring(0, 50)}...</span>
                          </div>
                        )}
                      </div>

                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          onClick={() => handleRestore(site, 'site')}
                          className="flex-1 bg-green-600 hover:bg-green-700"
                        >
                          <RotateCcw className="w-4 h-4 mr-2" />
                          Restore
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handlePermanentDelete(site, 'site')}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </TabsContent>

        {/* Subcontractors Tab */}
        <TabsContent value="subcontractors" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {filterItems(subcontractors, searchTerm).map((subcontractor) => (
                <motion.div
                  key={subcontractor.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="ios-card hover:bg-slate-700/30 transition-all duration-200">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                            {subcontractor.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <h3 className="text-white font-semibold">{subcontractor.name}</h3>
                            <p className="text-slate-400 text-sm">{subcontractor.service_type}</p>
                          </div>
                        </div>
                        <Badge className={getStatusColor(subcontractor.status)}>
                          {subcontractor.status}
                        </Badge>
                      </div>

                      <div className="space-y-2 mb-4">
                        {subcontractor.email && (
                          <div className="flex items-center space-x-2 text-sm">
                            <Mail className="w-4 h-4 text-slate-400" />
                            <span className="text-slate-300">{subcontractor.email}</span>
                          </div>
                        )}
                        {subcontractor.phone && (
                          <div className="flex items-center space-x-2 text-sm">
                            <Phone className="w-4 h-4 text-slate-400" />
                            <span className="text-slate-300">{subcontractor.phone}</span>
                          </div>
                        )}
                        <div className="flex items-center space-x-2 text-sm">
                          <MapPin className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-300">{subcontractor.location || 'No location'}</span>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          onClick={() => handleRestore(subcontractor, 'subcontractor')}
                          className="flex-1 bg-green-600 hover:bg-green-700"
                        >
                          <RotateCcw className="w-4 h-4 mr-2" />
                          Restore
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handlePermanentDelete(subcontractor, 'subcontractor')}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </TabsContent>

        {/* Training Tab */}
        <TabsContent value="training" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {filterItems(training, searchTerm).map((course) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="ios-card hover:bg-slate-700/30 transition-all duration-200">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                            {course.title.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <h3 className="text-white font-semibold">{course.title}</h3>
                            <p className="text-slate-400 text-sm">{course.category}</p>
                          </div>
                        </div>
                        <Badge className={getStatusColor(course.status)}>
                          {course.status}
                        </Badge>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center space-x-2 text-sm">
                          <GraduationCap className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-300">{course.duration || 'No duration'}</span>
                        </div>
                        {course.description && (
                          <div className="flex items-center space-x-2 text-sm">
                            <FileText className="w-4 h-4 text-slate-400" />
                            <span className="text-slate-300">{course.description.substring(0, 50)}...</span>
                          </div>
                        )}
                      </div>

                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          onClick={() => handleRestore(course, 'training')}
                          className="flex-1 bg-green-600 hover:bg-green-700"
                        >
                          <RotateCcw className="w-4 h-4 mr-2" />
                          Restore
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handlePermanentDelete(course, 'training')}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </TabsContent>

        {/* Incidents Tab */}
        <TabsContent value="incidents" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {filterItems(incidents, searchTerm).map((incident) => (
                <motion.div
                  key={incident.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="ios-card hover:bg-slate-700/30 transition-all duration-200">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                            {incident.title.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <h3 className="text-white font-semibold">{incident.title}</h3>
                            <p className="text-slate-400 text-sm">{incident.type}</p>
                          </div>
                        </div>
                        <Badge className={getStatusColor(incident.status)}>
                          {incident.status}
                        </Badge>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center space-x-2 text-sm">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-300">
                            {new Date(incident.incident_date).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <MapPin className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-300">{incident.location || 'No location'}</span>
                        </div>
                        {incident.description && (
                          <div className="flex items-center space-x-2 text-sm">
                            <FileText className="w-4 h-4 text-slate-400" />
                            <span className="text-slate-300">{incident.description.substring(0, 50)}...</span>
                          </div>
                        )}
                      </div>

                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          onClick={() => handleRestore(incident, 'incident')}
                          className="flex-1 bg-green-600 hover:bg-green-700"
                        >
                          <RotateCcw className="w-4 h-4 mr-2" />
                          Restore
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handlePermanentDelete(incident, 'incident')}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </TabsContent>
      </Tabs>

      {/* Empty State */}
      {Object.values(stats).every(stat => stat.filtered === 0) && (
        <Card className="ios-card">
          <CardContent className="p-8 text-center">
            <ArchiveIcon className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              {searchTerm ? 'No matching archived items' : 'No archived items'}
            </h3>
            <p className="text-slate-400">
              {searchTerm 
                ? 'Try adjusting your search criteria.'
                : 'Items will appear here when they are archived.'
              }
            </p>
          </CardContent>
        </Card>
      )}

      {/* Employee Detail Modal */}
      {showEmployeeDetail && selectedEmployee && (
        <EmployeeDetail
          employee={selectedEmployee}
          onClose={() => {
            setShowEmployeeDetail(false);
            setSelectedEmployee(null);
          }}
          onUpdate={(updatedEmployee) => {
            fetchArchivedData();
            setShowEmployeeDetail(false);
            setSelectedEmployee(null);
          }}
        />
      )}
    </div>
  );
};

export default Archive; 