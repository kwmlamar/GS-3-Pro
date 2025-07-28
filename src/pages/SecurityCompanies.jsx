import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabaseClient';
import { 
  getSecurityCompanies, 
  getSecurityCompanyStats, 
  searchSecurityCompanies,
  getSecurityCompaniesByStatus,
  getSecurityCompaniesByVettingStatus,
  getSecurityCompaniesByTier,
  TIER_SYSTEM
} from '@/lib/securityCompanyService';
import { getClients } from '@/lib/clientService';
import SecurityCompanyForm from '@/components/security-companies/SecurityCompanyForm';
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
  MapPin,
  User
} from 'lucide-react';

const SecurityCompanies = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [securityCompanies, setSecurityCompanies] = useState([]);
  const [clients, setClients] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedSecurityCompany, setSelectedSecurityCompany] = useState(null);
  const [activeTier, setActiveTier] = useState(1);
  const { toast } = useToast();

  useEffect(() => {
    fetchSecurityCompanies();
    fetchStats();
    fetchClients();
  }, []);

  const fetchSecurityCompanies = async () => {
    setLoading(true);
    const { data, error } = await getSecurityCompanies();

    if (error) {
      console.error('Error fetching security companies:', error);
      toast({ 
        variant: "destructive", 
        title: "Error", 
        description: error.message || "Could not fetch security companies." 
      });
      setSecurityCompanies([]);
    } else {
      const formattedData = data.map(sc => ({
        ...sc,
        sites_count: sc.sites_assigned?.[0]?.count || 0
      }));
      setSecurityCompanies(formattedData);
    }
    setLoading(false);
  };

  const fetchStats = async () => {
    setStatsLoading(true);
    const { data, error } = await getSecurityCompanyStats();

    if (error) {
      console.error('Error fetching stats:', error);
    } else {
      setStats(data);
    }
    setStatsLoading(false);
  };

  const fetchClients = async () => {
    try {
      const { data, error } = await getClients();
      if (error) throw error;
      setClients(data || []);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const handleAddSecurityCompany = () => {
    setSelectedSecurityCompany(null);
    setShowForm(true);
  };

  const handleViewSecurityCompany = (securityCompany) => {
    setSelectedSecurityCompany(securityCompany);
    setShowForm(true);
  };
  
  const filteredSecurityCompanies = securityCompanies.filter(sc => {
    const matchesSearch = sc.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (sc.contact_person && sc.contact_person.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (sc.service_specialization && sc.service_specialization.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesTier = activeTier === 0 || sc.tier === activeTier;
    
    return matchesSearch && matchesTier;
  });

  const getClientName = (clientId) => {
    if (!clientId) return null;
    const client = clients.find(c => c.id === clientId);
    return client?.name || 'Unknown Client';
  };

  const getClientIndustry = (clientId) => {
    if (!clientId) return null;
    const client = clients.find(c => c.id === clientId);
    return client?.industry || 'Unknown Industry';
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
            <Briefcase className="w-8 h-8 mr-3 text-blue-400" />
            Security Companies Management
          </h1>
          <p className="text-gray-400 mt-1">Manage security company partnerships, performance, and client assignments.</p>
        </div>
        <Button onClick={handleAddSecurityCompany} className="ios-button bg-blue-600 hover:bg-blue-700 mt-4 sm:mt-0">
          <Plus className="w-4 h-4 mr-2" />
          Add Security Company
        </Button>
      </motion.div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className={`${iosTabsListStyle} border-b border-slate-700`}>
          <TabsTrigger value="overview" className={`${iosTabsTriggerStyle} ${iosTabsActiveTriggerStyle}`}>Overview</TabsTrigger>
          <TabsTrigger value="tiers" className={`${iosTabsTriggerStyle} ${iosTabsActiveTriggerStyle}`}>Tier System</TabsTrigger>
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
                  <span>Active Security Companies ({filteredSecurityCompanies.length})</span>
                </CardTitle>
                <div className="flex items-center space-x-2 mt-3 sm:mt-0">
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant={activeTier === 0 ? "default" : "outline"} 
                      size="sm" 
                      onClick={() => setActiveTier(0)}
                      className="text-xs"
                    >
                      All Tiers
                    </Button>
                    {Object.entries(TIER_SYSTEM).map(([tier, config]) => (
                      <Button
                        key={tier}
                        variant={activeTier === parseInt(tier) ? "default" : "outline"}
                        size="sm"
                        onClick={() => setActiveTier(parseInt(tier))}
                        className={`text-xs ${activeTier === parseInt(tier) ? config.badgeColor : ''}`}
                      >
                        Tier {tier}
                      </Button>
                    ))}
                  </div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search security companies..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-full sm:w-64 bg-slate-700/50 border-slate-600 text-gray-200 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
                  <span className="ml-3 text-gray-400">Loading security companies...</span>
                </div>
              ) : filteredSecurityCompanies.length === 0 ? (
                <div className="text-center py-12">
                  <Briefcase className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400 mb-2">
                    {searchTerm ? 'No security companies found matching your search.' : 'No security companies found.'}
                  </p>
                  {!searchTerm && (
                    <Button onClick={handleAddSecurityCompany} className="mt-4">
                      <Plus className="w-4 h-4 mr-2" />
                      Add First Security Company
                    </Button>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredSecurityCompanies.map((sc) => (
                    <motion.div
                      key={sc.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-lg bg-slate-800/40 border border-slate-700 hover:bg-slate-700/60 transition-colors cursor-pointer"
                      onClick={() => handleViewSecurityCompany(sc)}
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
                            {sc.tier && TIER_SYSTEM[sc.tier] && (
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${TIER_SYSTEM[sc.tier].badgeColor}`}>
                                {TIER_SYSTEM[sc.tier].name}
                              </span>
                            )}
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
                            <span>{sc.service_specialization || 'General Security'}</span>
                            <span>•</span>
                            <span>{sc.contact_person}</span>
                            {sc.client_id && (
                              <>
                                <span>•</span>
                                <span className="flex items-center space-x-1">
                                  <User className="w-3 h-3" />
                                  <span>{getClientName(sc.client_id)} ({getClientIndustry(sc.client_id)})</span>
                                </span>
                              </>
                            )}
                            <span>•</span>
                            <span>{sc.sites_count || 0} Sites</span>
                            {sc.performance_rating && (
                              <>
                                <span>•</span>
                                <span className="flex items-center space-x-1">
                                  <Star className="w-3 h-3 text-yellow-400" />
                                  <span>{sc.performance_rating}/5.0</span>
                                </span>
                              </>
                            )}
                          </div>
                          <div className="flex items-center space-x-2 mt-2 text-xs text-gray-500">
                            {sc.contact_email && (
                              <span className="flex items-center space-x-1">
                                <Mail className="w-3 h-3" />
                                <span>{sc.contact_email}</span>
                              </span>
                            )}
                            {sc.contact_phone && (
                              <span className="flex items-center space-x-1">
                                <Phone className="w-3 h-3" />
                                <span>{sc.contact_phone}</span>
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewSecurityCompany(sc);
                            }}
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

        <TabsContent value="tiers" className="space-y-6">
          <Card className="ios-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white">
                <Star className="w-5 h-5 text-purple-400" />
                <span>Security Company Tier System</span>
              </CardTitle>
              <CardDescription className="text-gray-400 mt-1">Manage and view security companies by their tier classification.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Object.entries(TIER_SYSTEM).map(([tier, config]) => {
                  const tierCompanies = securityCompanies.filter(sc => sc.tier === parseInt(tier));
                  const tierStats = stats?.byTier?.[tier] || 0;
                  
                  return (
                    <motion.div
                      key={tier}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: parseInt(tier) * 0.1 }}
                    >
                      <Card className={`ios-card h-full ${config.color} bg-opacity-10 border-opacity-30`}>
                        <CardHeader>
                          <CardTitle className="flex items-center justify-between text-white">
                            <div className="flex items-center space-x-2">
                              <Star className={`w-6 h-6 ${config.textColor}`} />
                              <span className="text-lg">{config.name}</span>
                            </div>
                            <span className="text-2xl font-bold text-white">{tierStats}</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-400 text-sm mb-4 h-12 overflow-hidden">{config.description}</p>
                          
                          <div className="space-y-3">
                            <div>
                              <h4 className="text-white font-medium text-xs mb-2">Requirements:</h4>
                              <div className="space-y-1">
                                {config.requirements.slice(0, 3).map((req, idx) => (
                                  <div key={idx} className="flex items-center space-x-1.5 text-xs text-gray-400">
                                    <CheckCircle className="w-3 h-3 text-green-400 flex-shrink-0" />
                                    <span>{req}</span>
                                  </div>
                                ))}
                                {config.requirements.length > 3 && (
                                  <p className="text-xs text-slate-500">...and {config.requirements.length - 3} more</p>
                                )}
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="text-white font-medium text-xs mb-2">Benefits:</h4>
                              <div className="space-y-1">
                                {config.benefits.slice(0, 2).map((benefit, idx) => (
                                  <div key={idx} className="flex items-center space-x-1.5 text-xs text-gray-400">
                                    <Star className="w-3 h-3 text-yellow-400 flex-shrink-0" />
                                    <span>{benefit}</span>
                                  </div>
                                ))}
                                {config.benefits.length > 2 && (
                                  <p className="text-xs text-slate-500">...and {config.benefits.length - 2} more</p>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full mt-4"
                            onClick={() => setActiveTier(parseInt(tier))}
                          >
                            View Tier {tier} Companies ({tierCompanies.length})
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
              
              {statsLoading ? (
                <div className="flex justify-center items-center h-20 mt-6">
                  <Star className="w-6 h-6 text-purple-400 animate-spin" />
                  <p className="ml-2 text-white">Loading tier statistics...</p>
                </div>
              ) : (
                <div className="mt-6 p-4 rounded-lg bg-slate-800/40">
                  <h3 className="text-white font-semibold mb-3">Tier Distribution</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Object.entries(TIER_SYSTEM).map(([tier, config]) => {
                      const tierCount = stats?.byTier?.[tier] || 0;
                      const total = stats?.total || 0;
                      const percentage = total > 0 ? Math.round((tierCount / total) * 100) : 0;
                      
                      return (
                        <div key={tier} className="text-center">
                          <div className={`w-16 h-16 rounded-full ${config.color} mx-auto mb-2 flex items-center justify-center`}>
                            <span className="text-white font-bold text-lg">{tierCount}</span>
                          </div>
                          <p className="text-white font-medium">{config.name}</p>
                          <p className="text-gray-400 text-sm">{percentage}% of total</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card className="ios-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white">
                <BarChart3 className="w-5 h-5 text-green-400" />
                <span>Performance Metrics</span>
              </CardTitle>
              <CardDescription className="text-gray-400">Track security company performance and KPIs.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <BarChart3 className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400">Performance metrics dashboard coming soon...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          <Card className="ios-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white">
                <ShieldCheck className="w-5 h-5 text-blue-400" />
                <span>Compliance & Vetting</span>
              </CardTitle>
              <CardDescription className="text-gray-400">Monitor compliance status and vetting processes.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <ShieldCheck className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400">Compliance dashboard coming soon...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="access" className="space-y-6">
          <Card className="ios-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white">
                <FileText className="w-5 h-5 text-purple-400" />
                <span>Data Access Control</span>
              </CardTitle>
              <CardDescription className="text-gray-400">Configure access permissions and data sharing.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400">Access control configuration coming soon...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Security Company Form Modal */}
      {showForm && (
        <SecurityCompanyForm
          securityCompany={selectedSecurityCompany}
          onClose={() => setShowForm(false)}
          onSuccess={(newSecurityCompany) => {
            if (selectedSecurityCompany) {
              setSecurityCompanies(prev => 
                prev.map(sc => sc.id === newSecurityCompany.id ? newSecurityCompany : sc)
              );
            } else {
              setSecurityCompanies(prev => [newSecurityCompany, ...prev]);
            }
            setShowForm(false);
            setSelectedSecurityCompany(null);
            fetchStats();
          }}
        />
      )}
    </div>
  );
};

export default SecurityCompanies; 