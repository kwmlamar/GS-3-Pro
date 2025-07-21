import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { Siren, Plus, Search, BookOpen, Phone } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import GuideForm from '@/components/incident_command/GuideForm';
import ContactForm from '@/components/incident_command/ContactForm';

const IncidentCommand = () => {
  const { toast } = useToast();
  const [sites, setSites] = useState([]);
  const [selectedSite, setSelectedSite] = useState(null);
  const [guides, setGuides] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showGuideForm, setShowGuideForm] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);

  const fetchSites = useCallback(async () => {
    try {
      const { data, error } = await supabase.from('sites').select('id, name');
      if (error) throw error;
      setSites(data);
      if (data.length > 0) {
        setSelectedSite(data[0].id);
      }
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error fetching sites', description: error.message });
    }
  }, [toast]);

  const fetchDataForSite = useCallback(async () => {
    if (!selectedSite) return;
    setLoading(true);
    try {
      const { data: guidesData, error: guidesError } = await supabase
        .from('incident_command_guides')
        .select('*')
        .eq('site_id', selectedSite);
      if (guidesError) throw guidesError;
      setGuides(guidesData);

      const { data: contactsData, error: contactsError } = await supabase
        .from('incident_command_contacts')
        .select('*')
        .eq('site_id', selectedSite);
      if (contactsError) throw contactsError;
      setContacts(contactsData);
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error fetching site data', description: error.message });
    } finally {
      setLoading(false);
    }
  }, [selectedSite, toast]);

  useEffect(() => {
    fetchSites();
  }, [fetchSites]);

  useEffect(() => {
    fetchDataForSite();
  }, [fetchDataForSite]);

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
            <Siren className="w-8 h-8 mr-3 text-red-500" />
            Incident Command Center
          </h1>
          <p className="text-gray-400 mt-1">Manage emergency guides and contacts for each site.</p>
        </div>
        <div className="w-full sm:w-auto mt-4 sm:mt-0">
          <Select onValueChange={(value) => setSelectedSite(value)} value={selectedSite || ''}>
            <SelectTrigger className="w-full sm:w-72">
              <SelectValue placeholder="Select a site..." />
            </SelectTrigger>
            <SelectContent>
              {sites.map(site => <SelectItem key={site.id} value={site.id}>{site.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      <Tabs defaultValue="guides" className="space-y-6">
        <TabsList className={`${iosTabsListStyle} border-b border-slate-700`}>
          <TabsTrigger value="guides" className={`${iosTabsTriggerStyle} ${iosTabsActiveTriggerStyle}`}>Quick Guides</TabsTrigger>
          <TabsTrigger value="contacts" className={`${iosTabsTriggerStyle} ${iosTabsActiveTriggerStyle}`}>Emergency Contacts</TabsTrigger>
        </TabsList>

        <TabsContent value="guides">
          <Card className="ios-card">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center"><BookOpen className="mr-2 text-blue-400"/>Emergency Guides</CardTitle>
                <Button onClick={() => toast({ title: "🚧 Feature not implemented" })}><Plus className="mr-2 h-4 w-4"/>Add Guide</Button>
              </div>
              <CardDescription>Site-specific procedures for emergencies.</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? <p>Loading...</p> : guides.map(guide => <div key={guide.id} className="p-2 border-b border-slate-700">{guide.guide_title}</div>)}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contacts">
          <Card className="ios-card">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center"><Phone className="mr-2 text-green-400"/>Emergency Contacts</CardTitle>
                <Button onClick={() => toast({ title: "🚧 Feature not implemented" })}><Plus className="mr-2 h-4 w-4"/>Add Contact</Button>
              </div>
              <CardDescription>Key personnel and services to contact during an incident.</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? <p>Loading...</p> : contacts.map(contact => <div key={contact.id} className="p-2 border-b border-slate-700">{contact.contact_name} - {contact.contact_title}</div>)}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <GuideForm isOpen={showGuideForm} setIsOpen={setShowGuideForm} siteId={selectedSite} onSuccess={fetchDataForSite} />
      <ContactForm isOpen={showContactForm} setIsOpen={setShowContactForm} siteId={selectedSite} onSuccess={fetchDataForSite} />
    </div>
  );
};

export default IncidentCommand;