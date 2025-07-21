import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { Award, Plus, Search, FileCheck, HardHat, CheckSquare, ListChecks, ShieldCheck } from 'lucide-react';
import ISOStandardCard from '@/components/iso/ISOStandardCard';
import AuditItem from '@/components/iso/AuditItem';
import InspectionItem from '@/components/iso/InspectionItem';
import ReportTemplateItem from '@/components/iso/ReportTemplateItem';
import CorrectiveActionItem from '@/components/iso/CorrectiveActionItem';
import { supabase } from '@/lib/supabaseClient';

const ISO = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  const [correctiveActions, setCorrectiveActions] = useState([]);
  const [loadingActions, setLoadingActions] = useState(true);

  const fetchCorrectiveActions = useCallback(async () => {
    setLoadingActions(true);
    try {
      const { data, error } = await supabase
        .from('iso_corrective_actions')
        .select(`
          *,
          users (full_name),
          sites (name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCorrectiveActions(data);
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error fetching corrective actions', description: error.message });
    } finally {
      setLoadingActions(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchCorrectiveActions();
  }, [fetchCorrectiveActions]);

  const isoStandards = [
    { id: 1, standard: 'ISO 18788', title: 'Security Operations Management Systems', status: 'Certified', lastAudit: '2024-11-15', nextAudit: '2025-11-15', compliance: 98, findings: 2 },
    { id: 2, standard: 'ISO 14001', title: 'Environmental Management Systems', status: 'Certified', lastAudit: '2024-09-20', nextAudit: '2025-09-20', compliance: 95, findings: 3 },
    { id: 3, standard: 'ISO 45001', title: 'Occupational Health & Safety Management Systems', status: 'In Progress', lastAudit: '2025-02-10', nextAudit: '2025-08-10', compliance: 87, findings: 5 }
  ];

  const audits = [
    { id: 1, type: 'Internal Audit', standard: 'ISO 18788', auditor: 'Sarah Johnson', date: '2025-01-15', status: 'Completed', findings: 2, site: 'Corporate HQ Alpha' },
    { id: 2, type: 'External Audit', standard: 'ISO 14001', auditor: 'External Auditor Ltd.', date: '2025-03-20', status: 'Scheduled', findings: 0, site: 'All Sites' },
    { id: 3, type: 'Surveillance Audit', standard: 'ISO 45001', auditor: 'Mike Rodriguez', date: '2025-04-12', status: 'In Progress', findings: 1, site: 'Metro Hospital East' }
  ];

  const inspections = [
    { id: 1, title: 'Security Equipment Inspection', type: 'Security', inspector: 'John Smith', site: 'Corporate HQ Alpha', date: '2025-01-15', status: 'Passed', score: 95 },
    { id: 2, title: 'Environmental Compliance Check', type: 'Environmental', inspector: 'Lisa Chen', site: 'Retail Plaza Central', date: '2025-02-14', status: 'Minor Issues', score: 88 },
    { id: 3, title: 'Safety Protocol Review', type: 'Safety', inspector: 'Mike Rodriguez', site: 'Metro Hospital East', date: '2025-03-13', status: 'Passed', score: 92 }
  ];
  
  const reportTemplates = [
    'Monthly Compliance Report', 'Audit Findings Summary', 'Corrective Actions Report',
    'Management Review Report', 'Risk Assessment Report', 'Training Compliance Report'
  ];

  const handleCreateAudit = () => {
    toast({ title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀" });
  };

  const handleCreateInspection = () => {
    toast({ title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀" });
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
            <HardHat className="w-8 h-8 mr-3 text-blue-400" />
            ISO Compliance Management
          </h1>
          <p className="text-gray-400 mt-1">Manage ISO 18788, 14001, and 45001 standards, audits, and inspections.</p>
        </div>
        <div className="flex space-x-3 mt-4 sm:mt-0">
          <Button onClick={handleCreateAudit} className="ios-button bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Schedule Audit
          </Button>
          <Button onClick={handleCreateInspection} variant="outline" className="ios-button border-slate-600 hover:bg-slate-700">
            <CheckSquare className="w-4 h-4 mr-2" />
            New Inspection
          </Button>
        </div>
      </motion.div>

      <Tabs defaultValue="standards" className="space-y-6">
        <TabsList className={`${iosTabsListStyle} border-b border-slate-700`}>
          <TabsTrigger value="standards" className={`${iosTabsTriggerStyle} ${iosTabsActiveTriggerStyle}`}>ISO Standards</TabsTrigger>
          <TabsTrigger value="audits" className={`${iosTabsTriggerStyle} ${iosTabsActiveTriggerStyle}`}>Audits</TabsTrigger>
          <TabsTrigger value="inspections" className={`${iosTabsTriggerStyle} ${iosTabsActiveTriggerStyle}`}>Inspections</TabsTrigger>
          <TabsTrigger value="corrective_actions" className={`${iosTabsTriggerStyle} ${iosTabsActiveTriggerStyle}`}>Corrective Actions</TabsTrigger>
          <TabsTrigger value="reports" className={`${iosTabsTriggerStyle} ${iosTabsActiveTriggerStyle}`}>Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="standards" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isoStandards.map((standard, index) => (
              <ISOStandardCard key={standard.id} standard={standard} index={index} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="audits" className="space-y-6">
          <Card className="ios-card">
            <CardHeader>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                <CardTitle className="flex items-center space-x-2 text-white">
                  <Award className="w-5 h-5 text-purple-400" />
                  <span>ISO Audits Log</span>
                </CardTitle>
                <div className="relative mt-3 sm:mt-0">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search audits..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full sm:w-80 bg-slate-700/50 border-slate-600 text-gray-200 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <CardDescription className="text-gray-400 mt-1">Track internal and external ISO audits.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {audits.filter(audit => audit.type.toLowerCase().includes(searchTerm.toLowerCase()) || audit.standard.toLowerCase().includes(searchTerm.toLowerCase())).map((audit) => (
                  <AuditItem key={audit.id} audit={audit} />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inspections" className="space-y-6">
          <Card className="ios-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white">
                <ListChecks className="w-5 h-5 text-green-400" />
                <span>Security, Safety & Environmental Inspections</span>
              </CardTitle>
              <CardDescription className="text-gray-400 mt-1">Log and manage site inspections and security tours.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {inspections.map((inspection) => (
                  <InspectionItem key={inspection.id} inspection={inspection} onActionAdded={fetchCorrectiveActions} />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="corrective_actions" className="space-y-6">
          <Card className="ios-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white">
                <ShieldCheck className="w-5 h-5 text-yellow-400" />
                <span>Corrective Actions Tracker</span>
              </CardTitle>
              <CardDescription className="text-gray-400 mt-1">Monitor and manage all open and completed corrective actions.</CardDescription>
            </CardHeader>
            <CardContent>
              {loadingActions ? (
                <p className="text-center text-gray-400 py-4">Loading actions...</p>
              ) : (
                <div className="space-y-4">
                  {correctiveActions.map((action) => (
                    <CorrectiveActionItem key={action.id} action={action} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <Card className="ios-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white">
                <FileCheck className="w-5 h-5 text-blue-400" />
                <span>ISO Compliance Reports</span>
              </CardTitle>
              <CardDescription className="text-gray-400 mt-1">Generate and manage ISO compliance documentation.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {reportTemplates.map((template, index) => (
                  <ReportTemplateItem key={template} template={template} index={index} />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ISO;