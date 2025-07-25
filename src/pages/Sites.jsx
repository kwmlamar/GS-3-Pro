import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabaseClient';
import { ArrowLeft, Plus, Network, Search, ListFilter } from 'lucide-react';
import EntityForm from '@/components/sites/EntityForm';
import EntityTable from '@/components/sites/EntityTable';
import HierarchyDashboardTab from '@/components/sites/HierarchyDashboardTab';

export const siteTypes = ['site', 'region', 'special_activity', 'national', 'global'];
export const iosButtonStyle = "bg-[#607D8B] hover:bg-[#546E7A] text-white";
export const iosInputStyle = "bg-white text-gray-800 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500";
const iosTabsListStyle = "bg-transparent p-0 space-x-1";
const iosTabsTriggerStyle = "text-gray-400 data-[state=active]:text-blue-400 data-[state=active]:border-blue-400 border-b-2 border-transparent rounded-none px-4 py-2.5 hover:text-blue-300 transition-all duration-200 text-sm font-medium";
const iosTabsActiveTriggerStyle = "data-[state=active]:bg-transparent data-[state=active]:shadow-none";


const Sites = () => {
  const { toast } = useToast();
  const [sites, setSites] = useState([]);
  const [clients, setClients] = useState([]);
  const [allSitesForParentDropdown, setAllSitesForParentDropdown] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentSite, setCurrentSite] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('sites_list');
  const [selectedParentForDashboard, setSelectedParentForDashboard] = useState(null);

  const fetchSitesAndClients = useCallback(async () => {
    setLoading(true);
    try {
      const { data: sitesData, error: sitesError } = await supabase
        .from('sites')
        .select(`
          id, 
          name, 
          type, 
          parent_id, 
          client_id, 
          address, 
          gps_coordinates,
          parent:sites!parent_id ( name )
        `);

      if (sitesError) throw sitesError;
      const formattedSites = sitesData.map(s => ({
        ...s,
        parent_name: s.parent?.name,
        client_name: null // No client relationship for now
      }));
      setSites(formattedSites);
      setAllSitesForParentDropdown(sitesData.map(s => ({ id: s.id, name: s.name, type: s.type })));

      // Clients functionality disabled until users table exists
      setClients([]);

    } catch (error) {
      toast({ variant: 'destructive', title: 'Error fetching data', description: error.message });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchSitesAndClients();
  }, [fetchSitesAndClients]);

  const handleFormSubmitSuccess = () => {
    setShowForm(false);
    setIsEditing(false);
    setCurrentSite(null);
    fetchSitesAndClients();
  };

  const handleEdit = (site) => {
    setIsEditing(true);
    setCurrentSite(site);
    setShowForm(true);
  };

  const handleDelete = async (siteId) => {
    if (!window.confirm('Are you sure you want to delete this entity? This action cannot be undone.')) return;
    setLoading(true);
    try {
      const { error } = await supabase.from('sites').delete().eq('id', siteId);
      if (error) throw error;
      toast({ title: 'Entity deleted successfully' });
      fetchSitesAndClients(); 
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error deleting entity', description: error.message });
    } finally {
      setLoading(false);
    }
  };

  const filteredSites = sites.filter(site => 
    site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (site.type && site.type.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (site.client_name && site.client_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getDashboardData = (parentType, childType) => {
    if (selectedParentForDashboard) {
      return sites.filter(s => s.parent_id === selectedParentForDashboard && s.type === childType);
    }
    // If no parent is selected, we might want to show all children of that type, or an overview.
    // For now, let's show children of the first available parent of parentType if no specific parent is selected.
    const potentialParents = sites.filter(s => s.type === parentType);
    if (!selectedParentForDashboard && potentialParents.length > 0) {
        // This is a simplified logic. Ideally, you'd let user pick or show an aggregated view.
        // For this example, if no parent is selected, we'll show children of the first parent of that type.
        // Or, more simply, show all children of the childType if no parent is selected.
        return sites.filter(s => s.type === childType && potentialParents.some(p => p.id === s.parent_id));
    }
    return [];
  };

  if (loading && !showForm && !sites.length) { 
    return <div className="text-center py-10 text-white">Loading Hierarchy Builder...</div>;
  }

  return (
    <div className="space-y-8 pb-10">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between"
      >
        <div className="flex items-center space-x-3">
          {!showForm && (
            <Link to="/" className={`p-2 rounded-full hover:bg-slate-700/50 transition-colors ${iosButtonStyle}`}>
              <ArrowLeft className="w-5 h-5" />
            </Link>
          )}
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center">
              <Network className="w-8 h-8 mr-3 text-blue-400" />
              Hierarchy Builder
            </h1>
            <p className="text-gray-400 mt-1">Manage sites, regions, national, and global entities.</p>
          </div>
        </div>
        {!showForm && (
          <Button onClick={() => { setShowForm(true); setIsEditing(false); setCurrentSite(null);}} className={`${iosButtonStyle} mt-4 sm:mt-0`}>
            <Plus className="w-4 h-4 mr-2" />
            Add New Entity
          </Button>
        )}
      </motion.div>

      {showForm ? (
        <EntityForm
          isEditing={isEditing}
          currentSite={currentSite}
          clients={clients}
          allSitesForParent={allSitesForParentDropdown}
          onSuccess={handleFormSubmitSuccess}
          onCancel={() => { setShowForm(false); setIsEditing(false); setCurrentSite(null); }}
        />
      ) : (
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className={`${iosTabsListStyle} border-b border-slate-700`}>
            <TabsTrigger value="sites_list" className={`${iosTabsTriggerStyle} ${iosTabsActiveTriggerStyle}`}>Entities List</TabsTrigger>
            <TabsTrigger value="regional_dashboard" className={`${iosTabsTriggerStyle} ${iosTabsActiveTriggerStyle}`}>Regional View</TabsTrigger>
            <TabsTrigger value="national_dashboard" className={`${iosTabsTriggerStyle} ${iosTabsActiveTriggerStyle}`}>National View</TabsTrigger>
            <TabsTrigger value="global_dashboard" className={`${iosTabsTriggerStyle} ${iosTabsActiveTriggerStyle}`}>Global View</TabsTrigger>
          </TabsList>

          <TabsContent value="sites_list">
            <Card className="ios-card">
              <CardHeader>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                  <div>
                    <CardTitle className="text-xl text-white">All Entities</CardTitle>
                    <CardDescription className="text-gray-400">View and manage all registered sites, regions, and national/global entities.</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2 mt-3 sm:mt-0">
                    <Select onValueChange={(value) => setSearchTerm(value === 'all' ? '' : value)}>
                       <SelectTrigger className={`${iosInputStyle} w-auto text-xs`}>
                         <SelectValue placeholder="Filter by Type..." />
                       </SelectTrigger>
                       <SelectContent>
                         <SelectItem value="all">All Types</SelectItem>
                         {siteTypes.map(type => <SelectItem key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ')}</SelectItem>)}
                       </SelectContent>
                    </Select>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        placeholder="Search entities..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-full sm:w-64 bg-slate-700/50 border-slate-600 text-gray-200 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <EntityTable
                sites={filteredSites}
                loading={loading && sites.length === 0}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </Card>
          </TabsContent>

          <TabsContent value="regional_dashboard">
            <HierarchyDashboardTab
              title="Regional Dashboard"
              parentTypeForSelection="region"
              childTypeToDisplay="site"
              allSites={sites}
              loading={loading}
              selectedParent={selectedParentForDashboard}
              setSelectedParent={setSelectedParentForDashboard}
              getDashboardData={getDashboardData}
            />
          </TabsContent>
          <TabsContent value="national_dashboard">
            <HierarchyDashboardTab
              title="National Dashboard"
              parentTypeForSelection="national"
              childTypeToDisplay="region"
              allSites={sites}
              loading={loading}
              selectedParent={selectedParentForDashboard}
              setSelectedParent={setSelectedParentForDashboard}
              getDashboardData={getDashboardData}
            />
          </TabsContent>
          <TabsContent value="global_dashboard">
            <HierarchyDashboardTab
              title="Global Dashboard"
              parentTypeForSelection="global"
              childTypeToDisplay="national"
              allSites={sites}
              loading={loading}
              selectedParent={selectedParentForDashboard}
              setSelectedParent={setSelectedParentForDashboard}
              getDashboardData={getDashboardData}
            />
          </TabsContent>

        </Tabs>
      )}
    </div>
  );
};

export default Sites;