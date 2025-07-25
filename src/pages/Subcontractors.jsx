import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabaseClient';
import { 
  getSubcontractors, 
  getSubcontractorStats, 
  searchSubcontractors,
  getSubcontractorsByStatus,
  getSubcontractorsByVettingStatus
} from '@/lib/subcontractorService';
import SubcontractorForm from '@/components/subcontractors/SubcontractorForm';
import { 
  Briefcase, 
  Plus, 
  Search, 
  Users,
  FileText,
  BarChart3,
  ShieldCheck,
  CheckCircle,
  AlertTriangle,
  Building,
  ListFilter,
  Star,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';

const Subcontractors = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [subcontractors, setSubcontractors] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedSubcontractor, setSelectedSubcontractor] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchSubcontractors();
    fetchStats();
  }, []);

  const fetchSubcontractors = async () => {
    setLoading(true);
    const { data, error } = await getSubcontractors();

    if (error) {
      console.error('Error fetching subcontractors:', error);
      toast({ 
        variant: "destructive", 
        title: "Error", 
        description: error.message || "Could not fetch subcontractors." 
      });
      setSubcontractors([]);
    } else {
      const formattedData = data.map(sc => ({
        ...sc,
        sites_count: sc.sites_assigned?.[0]?.count || 0
      }));
      setSubcontractors(formattedData);
    }
    setLoading(false);
  };

  const fetchStats = async () => {
    setStatsLoading(true);
    const { data, error } = await getSubcontractorStats();

    if (error) {
      console.error('Error fetching stats:', error);
    } else {
      setStats(data);
    }
    setStatsLoading(false);
  };


  const handleAddSubcontractor = () => {
    setSelectedSubcontractor(null);
    setShowForm(true);
  };

  const handleViewSubcontractor = (subcontractor) => {
    setSelectedSubcontractor(subcontractor);
    setShowForm(true);
  };
  
  const filteredSubcontractors = subcontractors.filter(sc => 
    sc.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (sc.contact_person && sc.contact_person.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (sc.service_specialization && sc.service_specialization.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
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
            <Briefcase className="w-8 h-8 mr-3 text-blue-400" />
            Subcontractor Management
          </h1>
          <p className="text-gray-400 mt-1">Oversee and manage third-party security service providers.</p>
        </div>
        <Button onClick={handleAddSubcontractor} className="ios-button bg-blue-600 hover:bg-blue-700 mt-4 sm:mt-0">
          <Plus className="w-4 h-4 mr-2" />
          Add Subcontractor
        </Button>
      </motion.div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className={`${iosTabsListStyle} border-b border-slate-700`}>
          <TabsTrigger value="overview" className={`${iosTabsTriggerStyle} ${iosTabsActiveTriggerStyle}`}>Overview</TabsTrigger>
          <TabsTrigger value="performance" className={`${iosTabsTriggerStyle} ${iosTabsActiveTriggerStyle}`}>Performance</TabsTrigger>
          <TabsTrigger value="compliance" className={`${iosTabsTriggerStyle} ${iosTabsActiveTriggerStyle}`}>Compliance</TabsTrigger>
          <TabsTrigger value="access" className={`${iosTabsTriggerStyle} ${iosTabsActiveTriggerStyle}`}>Data Access</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card className="ios-card">
            <CardHeader>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                <CardTitle className="flex items-center space-x-2 text-white">
                  <Briefcase className="w-5 h-5 text-blue-400" />
                  <span>Subcontractor Companies</span>
                </CardTitle>
                 <div className="flex items-center space-x-2 mt-3 sm:mt-0">
                    <Button variant="outline" size="sm" className="glass-button text-xs">
                      <ListFilter className="w-3.5 h-3.5 mr-1.5" /> Filter by Status
                    </Button>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        placeholder="Search subcontractors..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-full sm:w-64 bg-slate-700/50 border-slate-600 text-gray-200 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      />
                    </div>
                  </div>
              </div>
               <CardDescription className="text-gray-400 mt-1">Directory of all subcontracted security providers.</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                 <div className="flex justify-center items-center h-40">
                   <Users className="w-8 h-8 text-blue-400 animate-spin" />
                   <p className="ml-2 text-white">Loading subcontractors...</p>
                 </div>
              ) : filteredSubcontractors.length === 0 ? (
                <div className="text-center py-10">
                  <Briefcase className="w-12 h-12 text-gray-500 mx-auto mb-4 opacity-70" />
                  <h3 className="text-xl font-semibold text-white">No Subcontractors Found</h3>
                  <p className="text-gray-400">Try adjusting your search or add a new subcontractor.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredSubcontractors.map((sc) => (
                    <motion.div
                      key={sc.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-lg bg-slate-800/40 border border-slate-700 hover:bg-slate-700/60 transition-colors"
                    >
                                              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                          <div className="flex-1 mb-3 sm:mb-0">
                            <div className="flex items-center space-x-3 mb-1.5">
                              <h3 className="text-white font-semibold text-lg">{sc.company_name}</h3>
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                sc.status === 'Active' ? 'bg-green-500/20 text-green-400' : 
                                sc.status === 'Pending Review' ? 'bg-yellow-500/20 text-yellow-400' :
                                'bg-red-500/20 text-red-400'
                              }`}>
                                {sc.status || 'N/A'}
                              </span>
                              {sc.vetting_status && (
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                  sc.vetting_status === 'Approved' ? 'bg-blue-500/20 text-blue-400' :
                                  sc.vetting_status === 'In Progress' ? 'bg-yellow-500/20 text-yellow-400' :
                                  'bg-gray-500/20 text-gray-400'
                                }`}>
                                  {sc.vetting_status}
                                </span>
                              )}
                            </div>
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-400">
                              <div className="flex items-center space-x-1">
                                <Users className="w-3.5 h-3.5" />
                                <span>{sc.contact_person || 'N/A'}</span>
                              </div>
                              <span>•</span>
                              <span>{sc.service_specialization || 'General Security'}</span>
                              <span>•</span>
                              <div className="flex items-center space-x-1">
                                <Building className="w-3.5 h-3.5" />
                                <span>{sc.sites_count} Sites Assigned</span>
                              </div>
                              {sc.performance_rating > 0 && (
                                <>
                                  <span>•</span>
                                  <div className="flex items-center space-x-1">
                                    <Star className="w-3.5 h-3.5 text-yellow-400" />
                                    <span>{sc.performance_rating.toFixed(1)} Rating</span>
                                  </div>
                                </>
                              )}
                            </div>
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500 mt-1">
                              {sc.contact_email && (
                                <div className="flex items-center space-x-1">
                                  <Mail className="w-3 h-3" />
                                  <span>{sc.contact_email}</span>
                                </div>
                              )}
                              {sc.contact_phone && (
                                <div className="flex items-center space-x-1">
                                  <Phone className="w-3 h-3" />
                                  <span>{sc.contact_phone}</span>
                                </div>
                              )}
                              {sc.address && sc.address.city && (
                                <div className="flex items-center space-x-1">
                                  <MapPin className="w-3 h-3" />
                                  <span>{sc.address.city}, {sc.address.state}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        <div className="flex items-center space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewSubcontractor(sc)}
                            className="ios-button border-slate-600 hover:bg-slate-700"
                          >
                            View Details
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

        <TabsContent value="performance" className="space-y-6">
          <Card className="ios-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white">
                <BarChart3 className="w-5 h-5 text-purple-400" />
                <span>Subcontractor Performance Metrics</span>
              </CardTitle>
              <CardDescription className="text-gray-400 mt-1">Track KPIs and operational effectiveness of subcontractors.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 min-h-[300px] flex flex-col items-center justify-center">
                <BarChart3 className="w-16 h-16 text-gray-500 mx-auto mb-4 opacity-70" />
                <h3 className="text-xl font-semibold text-white">Performance Data Coming Soon</h3>
                <p className="text-gray-400">Detailed performance dashboards for each subcontractor will be available here.</p>
                 <Button className="mt-4 ios-button bg-purple-600 hover:bg-purple-700" onClick={() => toast({ title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀" })}>
                  Request Performance Metrics
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          <Card className="ios-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white">
                <ShieldCheck className="w-5 h-5 text-green-400" />
                <span>Compliance & Vetting Status</span>
              </CardTitle>
              <CardDescription className="text-gray-400 mt-1">Ensure all subcontractors meet required compliance standards.</CardDescription>
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <div className="flex justify-center items-center h-40">
                  <ShieldCheck className="w-8 h-8 text-green-400 animate-spin" />
                  <p className="ml-2 text-white">Loading compliance data...</p>
                </div>
              ) : stats ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-6 rounded-lg bg-green-500/10 border border-green-500/30 text-center">
                    <CheckCircle className="w-10 h-10 text-green-400 mx-auto mb-2" />
                    <h3 className="text-white font-semibold">Fully Vetted</h3>
                    <p className="text-3xl font-bold text-green-400 mt-1">{stats.byVettingStatus['Approved'] || 0}</p>
                    <p className="text-xs text-gray-400">Subcontractors</p>
                  </div>
                  <div className="p-6 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-center">
                    <AlertTriangle className="w-10 h-10 text-yellow-400 mx-auto mb-2" />
                    <h3 className="text-white font-semibold">Pending Review</h3>
                    <p className="text-3xl font-bold text-yellow-400 mt-1">{stats.byVettingStatus['In Progress'] || 0}</p>
                    <p className="text-xs text-gray-400">Subcontractors</p>
                  </div>
                  <div className="p-6 rounded-lg bg-blue-500/10 border border-blue-500/30 text-center">
                    <Star className="w-10 h-10 text-blue-400 mx-auto mb-2" />
                    <h3 className="text-white font-semibold">Top Performers</h3>
                    <p className="text-3xl font-bold text-blue-400 mt-1">{stats.topPerformers || 0}</p>
                    <p className="text-xs text-gray-400">4.0+ Rating</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <ShieldCheck className="w-12 h-12 text-gray-500 mx-auto mb-4 opacity-70" />
                  <h3 className="text-xl font-semibold text-white">No Compliance Data</h3>
                  <p className="text-gray-400">Compliance statistics will appear here once data is available.</p>
                </div>
              )}
              <Button variant="outline" className="w-full mt-6 glass-button" onClick={() => toast({title: "🚧 Feature Not Implemented"})}>
                View Full Compliance Dashboard
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="access" className="space-y-6">
          <Card className="ios-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white">
                <Users className="w-5 h-5 text-yellow-400" />
                <span>Client & Subcontractor Data Access Control</span>
              </CardTitle>
              <CardDescription className="text-gray-400 mt-1">Define data visibility and sharing permissions.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 min-h-[300px] flex flex-col items-center justify-center">
                <Users className="w-16 h-16 text-gray-500 mx-auto mb-4 opacity-70" />
                <h3 className="text-xl font-semibold text-white">Granular Data Access Configuration</h3>
                <p className="text-gray-400 max-w-md mx-auto">Set specific rules for what data clients can see regarding subcontractor operations and performance. (Coming Soon)</p>
                <Button className="mt-4 ios-button bg-yellow-600 hover:bg-yellow-700" onClick={() => toast({ title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀" })}>
                  Configure Access Rules
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>

      {showForm && (
        <SubcontractorForm
          subcontractor={selectedSubcontractor}
          onClose={() => {
            setShowForm(false);
            setSelectedSubcontractor(null);
          }}
          onSuccess={(newSubcontractor) => {
            if (selectedSubcontractor) {
              // Update existing subcontractor in the list
              setSubcontractors(prev => 
                prev.map(sc => 
                  sc.id === newSubcontractor.id ? newSubcontractor : sc
                )
              );
            } else {
              // Add new subcontractor to the list
              setSubcontractors(prev => [newSubcontractor, ...prev]);
            }
            fetchStats(); // Refresh stats
          }}
        />
      )}
    </div>
  );
};

export default Subcontractors;