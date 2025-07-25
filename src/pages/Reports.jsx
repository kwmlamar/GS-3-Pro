import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Outlet } from 'react-router-dom';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  FileText, 
  Plus, 
  Filter,
  AlertTriangle,
  Eye
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import ReportForm from '@/components/reports/ReportForm';


const ReportsLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleCreateReport = () => {
    setShowCreateForm(true);
  };
  
  const getActiveTab = () => {
    if (location.pathname.includes('/reports/list')) return 'list';
    if (location.pathname.includes('/reports/violations')) return 'violations';
    if (location.pathname.includes('/reports/observations')) return 'observations';
    if (location.pathname.includes('/reports/templates')) return 'templates';
    return 'list';
  };


  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-white">Reports & Documentation</h1>
          <p className="text-gray-400 mt-2">Manage security reports, violations, and observations</p>
        </div>
        <div className="flex space-x-3">
          <Button onClick={handleCreateReport} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Create Report
          </Button>
          <Button variant="outline" className="border-white/20" onClick={() => toast({ title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀" })}>
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
      </motion.div>

      <Tabs defaultValue={getActiveTab()} 
        onValueChange={(value) => navigate(`/reports/${value}`)} 
        className="space-y-6"
      >
        <TabsList className="bg-white/10 border border-white/20">
          <TabsTrigger value="list">Reports</TabsTrigger>
          <TabsTrigger value="violations">Violations</TabsTrigger>
          <TabsTrigger value="observations">Observations</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>
        <Outlet />
      </Tabs>

      {/* Report Creation Form */}
      {showCreateForm && (
        <ReportForm
          onClose={() => setShowCreateForm(false)}
          onSuccess={(newReport) => {
            toast({
              title: "Report Created",
              description: "The report has been created successfully.",
              variant: "default"
            });
            // Optionally refresh the reports list
            window.location.reload();
          }}
        />
      )}
    </div>
  );
};

export default ReportsLayout;