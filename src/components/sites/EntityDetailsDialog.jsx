import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { 
  Users, 
  Shield, 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar,
  Loader2,
  X,
  ExternalLink,
  Network
} from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { getEntityStaff } from '@/lib/entityStaffService';
import { getSecurityStaff } from '@/lib/securityStaffService';

const EntityDetailsDialog = ({ isOpen, onClose, entity }) => {
  const [loading, setLoading] = useState(false);
  const [entityStaff, setEntityStaff] = useState([]);
  const [securityStaff, setSecurityStaff] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen && entity) {
      console.log('🚀 Dialog opened with entity:', entity);
      console.log('🔍 Entity ID:', entity.id);
      console.log('🔍 Entity Name:', entity.name);
      console.log('🔍 Entity Type:', entity.type);
      console.log('🔍 Entity object keys:', Object.keys(entity));
      fetchLinkedData();
    } else {
      console.log('Dialog not opened or entity is null:', { isOpen, entity });
    }
  }, [isOpen, entity]);

  const fetchLinkedData = async () => {
    if (!entity) {
      console.log('No entity provided to fetchLinkedData');
      return;
    }
    
    setLoading(true);
    try {
      console.log('🔍 Fetching linked data for entity:', entity);
      console.log('🔍 Entity ID type:', typeof entity.id);
      console.log('🔍 Entity ID value:', entity.id);
      
      // Test database connection first
      try {
        const { data: testData, error: testError } = await supabase
          .from('sites')
          .select('id, name')
          .limit(1);
        
        console.log('🔍 Database connection test:', { testData, testError });
      } catch (error) {
        console.error('🔍 Database connection failed:', error);
      }
      
      // Method 1: Try to fetch entity staff linked via entity_staff_entities table
      let entityStaffData = [];
      let entityStaffError = null;
      
      try {
        const { data, error } = await supabase
          .from('entity_staff_entities')
          .select(`
            entity_staff_id,
            is_primary,
            status,
            entity_staff (
              id,
              name,
              email,
              phone,
              role,
              department_id,
              departments (name)
            )
          `)
          .eq('site_id', entity.id);
        
        entityStaffData = data || [];
        entityStaffError = error;
      } catch (error) {
        console.log('Entity staff entities table not available, trying direct entity_staff table');
        entityStaffError = error;
      }

      console.log('📊 Entity staff data (via relationships):', entityStaffData);
      console.log('❌ Entity staff error (via relationships):', entityStaffError);

      // Method 2: Fetch entity staff linked via site column (fallback)
      let entityStaffLegacyData = [];
      let entityStaffLegacyError = null;
      
      try {
        const { data, error } = await supabase
          .from('entity_staff')
          .select(`
            id,
            name,
            email,
            phone,
            role,
            department_id,
            departments (name)
          `)
          .eq('site', entity.name);
        
        entityStaffLegacyData = data || [];
        entityStaffLegacyError = error;
      } catch (error) {
        console.log('Entity staff site column not available, using junction table only');
        entityStaffLegacyError = error;
      }

      console.log('📊 Entity staff data (via site column):', entityStaffLegacyData);
      console.log('❌ Entity staff error (via site column):', entityStaffLegacyError);

      // Combine both results
      const combinedEntityStaff = [
        ...(entityStaffData || []).map(item => ({
          ...item,
          source: 'relationship',
          entity_staff: item.entity_staff || {}
        })),
        ...(entityStaffLegacyData || []).map(item => ({
          entity_staff_id: item.id,
          is_primary: true,
          entity_staff: item,
          source: 'legacy'
        }))
      ];

      console.log('✅ Combined entity staff:', combinedEntityStaff);
      setEntityStaff(combinedEntityStaff);

      // Fetch security staff linked to this site
      let securityStaffData = [];
      let securityStaffError = null;
      
      try {
        const { data, error } = await supabase
          .from('security_staff_entities')
          .select(`
            security_staff_id,
            is_primary,
            status,
            security_staff (
              id,
              first_name,
              last_name,
              email,
              phone,
              position,
              security_company_id,
              subcontractor_profiles (company_name)
            )
          `)
          .eq('site_id', entity.id);
        
        securityStaffData = data || [];
        securityStaffError = error;
      } catch (error) {
        console.log('Security staff entities table not available, trying direct security_staff table');
        securityStaffError = error;
      }

      console.log('📊 Security staff data:', securityStaffData);
      console.log('❌ Security staff error:', securityStaffError);

      // Note: Security staff are linked through security_staff_entities table only
      // No direct site column exists in security_staff table
      let securityStaffLegacyData = [];
      let securityStaffLegacyError = null;
      
      console.log('📊 Security staff data (via site column): No direct site column available');
      console.log('❌ Security staff error (via site column): Using junction table only');

      // Combine both results (security staff only uses junction table)
      const combinedSecurityStaff = [
        ...(securityStaffData || []).map(item => ({
          ...item,
          source: 'relationship',
          security_staff: item.security_staff || {}
        }))
      ];

      console.log('✅ Combined security staff:', combinedSecurityStaff);
      setSecurityStaff(combinedSecurityStaff);

      console.log('🎯 Final state - Entity staff count:', combinedEntityStaff.length);
      console.log('🎯 Final state - Security staff count:', combinedSecurityStaff.length);
      console.log('🎯 Final state - Entity staff data:', combinedEntityStaff);
      console.log('🎯 Final state - Security staff data:', combinedSecurityStaff);
      
      // Log the results for debugging
      if (combinedEntityStaff.length === 0 && combinedSecurityStaff.length === 0) {
        console.log('No staff data found for this entity - this is normal for new entities');
      } else {
        console.log('Staff data loaded successfully');
      }
      
    } catch (error) {
      console.error('Error fetching linked data:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load entity details'
      });
    } finally {
      setLoading(false);
    }
  };

  const getEntityTypeIcon = (type) => {
    switch (type) {
      case 'site': return <Building2 className="w-4 h-4" />;
      case 'region': return <MapPin className="w-4 h-4" />;
      case 'national': return <Building2 className="w-4 h-4" />;
      case 'global': return <Building2 className="w-4 h-4" />;
      default: return <Building2 className="w-4 h-4" />;
    }
  };

  const formatAddress = (address) => {
    if (!address) return 'No address provided';
    if (typeof address === 'string') return address;
    if (typeof address === 'object') {
      return `${address.street || ''} ${address.city || ''} ${address.state || ''} ${address.zip || ''}`.trim() || 'Address available';
    }
    return 'Address available';
  };

  if (!entity || !isOpen) return null;

  // Add error boundary
  try {
    return (
    <AnimatePresence>
      {isOpen && (
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
            className="w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <Card className="ios-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-xl text-white flex items-center">
                  {getEntityTypeIcon(entity.type)}
                  <span className="ml-2">{entity.name}</span>
                  <Badge variant="outline" className="ml-3">
                    {entity.type?.charAt(0).toUpperCase() + entity.type?.slice(1).replace('_', ' ') || 'Unknown'}
                  </Badge>
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-400 hover:text-white">
                  <X className="w-4 h-4" />
                </Button>
              </CardHeader>

              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
                    <span className="ml-2 text-gray-400">Loading entity details...</span>
                  </div>
                ) : (
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-5 bg-slate-800/80 border border-slate-700">
                      <TabsTrigger value="overview" className="data-[state=active]:bg-slate-700 data-[state=active]:text-white text-slate-300">
                        Overview
                      </TabsTrigger>
                      <TabsTrigger value="entity_staff" className="data-[state=active]:bg-slate-700 data-[state=active]:text-white text-slate-300">
                        Entity Staff ({entityStaff.length})
                      </TabsTrigger>
                      <TabsTrigger value="security_staff" className="data-[state=active]:bg-slate-700 data-[state=active]:text-white text-slate-300">
                        Security Staff ({securityStaff.length})
                      </TabsTrigger>
                      <TabsTrigger value="relationships" className="data-[state=active]:bg-slate-700 data-[state=active]:text-white text-slate-300">
                        Relationships
                      </TabsTrigger>
                      <TabsTrigger value="hierarchy" className="data-[state=active]:bg-slate-700 data-[state=active]:text-white text-slate-300">
                        Hierarchy
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="mt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card className="bg-slate-800/50 border-slate-700">
                          <CardHeader>
                            <CardTitle className="text-lg text-white">Entity Information</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div>
                              <label className="text-sm text-gray-400">Name</label>
                              <p className="text-white font-medium">{entity.name}</p>
                            </div>
                            <div>
                              <label className="text-sm text-gray-400">Type</label>
                              <p className="text-white">{entity.type?.charAt(0).toUpperCase() + entity.type?.slice(1).replace('_', ' ') || 'Unknown'}</p>
                            </div>
                            <div>
                              <label className="text-sm text-gray-400">Address</label>
                              <p className="text-white">{formatAddress(entity.address)}</p>
                            </div>
                            {entity.client_name && (
                              <div>
                                <label className="text-sm text-gray-400">Client</label>
                                <p className="text-white">{entity.client_name}</p>
                              </div>
                            )}
                          </CardContent>
                        </Card>

                        <Card className="bg-slate-800/50 border-slate-700">
                          <CardHeader>
                            <CardTitle className="text-lg text-white">Staff Summary</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-400">Entity Staff</span>
                              <Badge variant="secondary">{entityStaff.length}</Badge>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-400">Security Staff</span>
                              <Badge variant="secondary">{securityStaff.length}</Badge>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-400">Total Staff</span>
                              <Badge variant="outline">{entityStaff.length + securityStaff.length}</Badge>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </TabsContent>

                    <TabsContent value="entity_staff" className="mt-4">
                      <Card className="bg-slate-800/50 border-slate-700">
                        <CardHeader>
                          <CardTitle className="text-lg text-white flex items-center">
                            <Users className="w-5 h-5 mr-2 text-blue-400" />
                            Entity Staff ({entityStaff.length})
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          {console.log('🎨 Rendering entity staff section with data:', entityStaff)}
                          {entityStaff.length === 0 ? (
                            <div className="text-center py-8 text-gray-400">
                              <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                              <p>No entity staff assigned to this location</p>
                              <p className="text-sm text-gray-500 mt-2">Entity staff can be assigned through the Entity Staff management page.</p>
                              <p className="text-xs text-gray-600 mt-1">The system checks both the new relationship table and legacy site column.</p>
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {entityStaff.map((item) => {
                                const staff = item.entity_staff || {};
                                console.log('🎨 Rendering entity staff item:', item);
                                if (!staff || !staff.name) {
                                  console.warn('Invalid entity staff data:', item);
                                  return null;
                                }
                                return (
                                  <Card key={item.entity_staff_id} className="bg-slate-700/50 border-slate-600">
                                    <CardHeader>
                                      <div className="flex items-center justify-between">
                                        <CardTitle className="text-md text-white">
                                          {staff.name || 'Unknown Staff'}
                                        </CardTitle>
                                        <div className="flex items-center gap-2">
                                          {item.is_primary && (
                                            <Badge variant="outline" className="text-xs">Primary</Badge>
                                          )}
                                          {item.source === 'legacy' && (
                                            <Badge variant="secondary" className="text-xs">Legacy</Badge>
                                          )}
                                        </div>
                                      </div>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                      <div className="flex items-center text-sm">
                                        <Mail className="w-4 h-4 mr-2 text-gray-400" />
                                        <span className="text-gray-300">{staff.email}</span>
                                      </div>
                                      {staff.phone && (
                                        <div className="flex items-center text-sm">
                                          <Phone className="w-4 h-4 mr-2 text-gray-400" />
                                          <span className="text-gray-300">{staff.phone}</span>
                                        </div>
                                      )}
                                      <div className="flex items-center text-sm">
                                        <Shield className="w-4 h-4 mr-2 text-gray-400" />
                                        <span className="text-gray-300">{staff.role || staff.position || 'No role'}</span>
                                      </div>
                                      {staff.departments && (
                                        <div className="flex items-center text-sm">
                                          <Building2 className="w-4 h-4 mr-2 text-gray-400" />
                                          <span className="text-gray-300">{staff.departments.name}</span>
                                        </div>
                                      )}
                                      <div className="flex items-center text-sm">
                                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                                        <span className="text-gray-300">Assignment dates not available</span>
                                      </div>
                                      {item.status && (
                                        <div className="flex items-center text-sm">
                                          <Badge variant={item.status === 'Active' ? 'default' : 'secondary'} className="text-xs">
                                            {item.status}
                                          </Badge>
                                        </div>
                                      )}
                                    </CardContent>
                                  </Card>
                                );
                              })}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="security_staff" className="mt-4">
                      <Card className="bg-slate-800/50 border-slate-700">
                        <CardHeader>
                          <CardTitle className="text-lg text-white flex items-center">
                            <Shield className="w-5 h-5 mr-2 text-green-400" />
                            Security Staff ({securityStaff.length})
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          {securityStaff.length === 0 ? (
                            <div className="text-center py-8 text-gray-400">
                              <Shield className="w-12 h-12 mx-auto mb-3 opacity-50" />
                              <p>No security staff assigned to this location</p>
                              <p className="text-sm text-gray-500 mt-2">Security staff can be assigned through the Security Staff management page.</p>
                              <p className="text-xs text-gray-600 mt-1">The system checks both the new relationship table and legacy site column.</p>
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {securityStaff.map((item) => {
                                const staff = item.security_staff || {};
                                if (!staff || !staff.name) {
                                  console.warn('Invalid security staff data:', item);
                                  return null;
                                }
                                return (
                                  <Card key={item.security_staff_id} className="bg-slate-700/50 border-slate-600">
                                    <CardHeader>
                                      <div className="flex items-center justify-between">
                                        <CardTitle className="text-md text-white">
                                          {staff.first_name && staff.last_name ? `${staff.first_name} ${staff.last_name}` : staff.first_name || staff.last_name || 'Unknown Staff'}
                                        </CardTitle>
                                        <div className="flex items-center gap-2">
                                          {item.is_primary && (
                                            <Badge variant="outline" className="text-xs">Primary</Badge>
                                          )}
                                          {item.source === 'legacy' && (
                                            <Badge variant="secondary" className="text-xs">Legacy</Badge>
                                          )}
                                        </div>
                                      </div>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                      <div className="flex items-center text-sm">
                                        <Mail className="w-4 h-4 mr-2 text-gray-400" />
                                        <span className="text-gray-300">{staff.email}</span>
                                      </div>
                                      {staff.phone && (
                                        <div className="flex items-center text-sm">
                                          <Phone className="w-4 h-4 mr-2 text-gray-400" />
                                          <span className="text-gray-300">{staff.phone}</span>
                                        </div>
                                      )}
                                      <div className="flex items-center text-sm">
                                        <Shield className="w-4 h-4 mr-2 text-gray-400" />
                                        <span className="text-gray-300">{staff.position || 'No position'}</span>
                                      </div>
                                      {staff.subcontractor_profiles && (
                                        <div className="flex items-center text-sm">
                                          <Building2 className="w-4 h-4 mr-2 text-gray-400" />
                                          <span className="text-gray-300">{staff.subcontractor_profiles.company_name}</span>
                                        </div>
                                      )}
                                      <div className="flex items-center text-sm">
                                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                                        <span className="text-gray-300">Assignment dates not available</span>
                                      </div>
                                      {item.status && (
                                        <div className="flex items-center text-sm">
                                          <Badge variant={item.status === 'Active' ? 'default' : 'secondary'} className="text-xs">
                                            {item.status}
                                          </Badge>
                                        </div>
                                      )}
                                    </CardContent>
                                  </Card>
                                );
                              })}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="relationships" className="mt-4">
                      <Card className="bg-slate-800/50 border-slate-700">
                        <CardHeader>
                          <CardTitle className="text-lg text-white flex items-center">
                            <Network className="w-5 h-5 mr-2 text-blue-400" />
                            Site Relationships
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div>
                              <label className="text-sm text-gray-400">Entity Staff Relationships</label>
                              <p className="text-white">
                                This entity has {entityStaff.length} entity staff members assigned through the entity_staff_entities table.
                              </p>
                              {entityStaff.length > 0 && (
                                <div className="mt-2">
                                  <p className="text-sm text-gray-400">Primary assignments: {entityStaff.filter(s => s.is_primary).length}</p>
                                  <p className="text-sm text-gray-400">Active assignments: {entityStaff.filter(s => s.status === 'Active').length}</p>
                                </div>
                              )}
                            </div>
                            <div>
                              <label className="text-sm text-gray-400">Security Staff Relationships</label>
                              <p className="text-white">
                                This entity has {securityStaff.length} security staff members assigned through the security_staff_entities table.
                              </p>
                              {securityStaff.length > 0 && (
                                <div className="mt-2">
                                  <p className="text-sm text-gray-400">Primary assignments: {securityStaff.filter(s => s.is_primary).length}</p>
                                  <p className="text-sm text-gray-400">Active assignments: {securityStaff.filter(s => s.status === 'Active').length}</p>
                                </div>
                              )}
                            </div>
                            <div>
                              <label className="text-sm text-gray-400">Database Tables Used</label>
                              <div className="space-y-1 mt-2">
                                <p className="text-sm text-gray-300">• entity_staff_entities (junction table)</p>
                                <p className="text-sm text-gray-300">• security_staff_entities (junction table)</p>
                                <p className="text-sm text-gray-300">• entity_staff (staff details)</p>
                                <p className="text-sm text-gray-300">• security_staff (security staff details)</p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="hierarchy" className="mt-4">
                      <Card className="bg-slate-800/50 border-slate-700">
                        <CardHeader>
                          <CardTitle className="text-lg text-white flex items-center">
                            <MapPin className="w-5 h-5 mr-2 text-purple-400" />
                            Hierarchy Information
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div>
                              <label className="text-sm text-gray-400">Entity Type</label>
                              <p className="text-white font-medium">{entity.type?.charAt(0).toUpperCase() + entity.type?.slice(1).replace('_', ' ') || 'Unknown'}</p>
                            </div>
                            {entity.parent_id && (
                              <div>
                                <label className="text-sm text-gray-400">Parent Entity</label>
                                <p className="text-white">ID: {entity.parent_id}</p>
                              </div>
                            )}
                            <div>
                              <label className="text-sm text-gray-400">Entity ID</label>
                              <p className="text-white font-mono text-sm">{entity.id}</p>
                            </div>
                            <div>
                              <label className="text-sm text-gray-400">Address</label>
                              <p className="text-white">{formatAddress(entity.address)}</p>
                            </div>
                            {entity.gps_coordinates && (
                              <div>
                                <label className="text-sm text-gray-400">GPS Coordinates</label>
                                <p className="text-white font-mono text-sm">{JSON.stringify(entity.gps_coordinates)}</p>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
          </AnimatePresence>
    );
  } catch (error) {
    console.error('Error rendering EntityDetailsDialog:', error);
    return (
      <AnimatePresence>
        {isOpen && (
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
              className="w-full max-w-4xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <Card className="ios-card">
                <CardHeader>
                  <CardTitle className="text-xl text-white">Error Loading Entity Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400">There was an error loading the entity details. Please try again.</p>
                  <Button onClick={onClose} className="mt-4">Close</Button>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }
  };

export default EntityDetailsDialog; 