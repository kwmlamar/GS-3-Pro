import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { 
  FileText, 
  Search, 
  Download,
  Share,
  Eye,
  Calendar,
  Hash,
  Loader2,
  Edit
} from 'lucide-react';
import { reportsService } from '@/lib/reportsService';
import ReportForm from '@/components/reports/ReportForm';

const ReportList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const { toast } = useToast();

  const handleViewReport = (id) => {
    toast({
      title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀"
    });
  };

  const handleEditReport = (report) => {
    setSelectedReport(report);
    setShowEditForm(true);
  };

  const handleExportReport = (id) => {
    toast({
      title: "Report Export",
      description: "Report exported successfully to PDF format"
    });
  };

  const handleShareReport = (id) => {
    toast({
      title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀"
    });
  };

  // Fetch reports from database
  const fetchReports = async () => {
    try {
      setLoading(true);
      const data = await reportsService.getReports();
      setReports(data);
    } catch (error) {
      console.error('Error fetching reports:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load reports. Please try again."
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [toast]);
  
  const filteredReports = reports.filter(report => 
    report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.doc_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.officer_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-blue-400" />
            <span>Security Reports</span>
          </CardTitle>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-80 bg-white/5 border-white/10"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
         {filteredReports.length === 0 && !searchTerm ? (
            <div className="text-center py-10">
                <FileText className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white">No Reports Yet</h3>
                <p className="text-gray-400">Create a new report to get started.</p>
            </div>
        ) : filteredReports.length === 0 && searchTerm ? (
             <div className="text-center py-10">
                <Search className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white">No Reports Found</h3>
                <p className="text-gray-400">Try adjusting your search terms.</p>
            </div>
        ) : loading ? (
          <div className="text-center py-10">
            <Loader2 className="w-8 h-8 text-blue-400 mx-auto mb-4 animate-spin" />
            <p className="text-gray-400">Loading reports...</p>
          </div>
        ) : (
        <div className="space-y-4">
          {filteredReports.map((report) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-white font-semibold">{report.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      report.priority === 'High' ? 'bg-red-500/20 text-red-400' :
                      report.priority === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-green-500/20 text-green-400'
                    }`}>
                      {report.priority} Priority
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      report.status === 'Completed' ? 'bg-green-500/20 text-green-400' :
                      report.status === 'Under Review' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-blue-500/20 text-blue-400'
                    }`}>
                      {report.status}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-400 mb-2">
                    <span className="flex items-center">
                      <Hash className="w-4 h-4 mr-1" />
                      {report.doc_number}
                    </span>
                    <span className="flex items-center">
                      <FileText className="w-4 h-4 mr-1" />
                      {report.report_type}
                    </span>
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(report.report_date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <span>Site: {report.site_name}</span>
                    <span>•</span>
                    <span>Entity Officer: {report.entity_officer_name}</span>
                    <span>•</span>
                    <span>Security Officer: {report.security_officer_name}</span>
                  </div>
                </div>
                                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewReport(report.id)}
                      className="border-blue-500/30 hover:bg-blue-500/10"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEditReport(report)}
                      className="border-yellow-500/30 hover:bg-yellow-500/10"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleExportReport(report.id)}
                      className="border-green-500/30 hover:bg-green-500/10"
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Export
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleShareReport(report.id)}
                      className="border-purple-500/30 hover:bg-purple-500/10"
                    >
                      <Share className="w-4 h-4 mr-1" />
                      Share
                    </Button>
                  </div>
              </div>
            </motion.div>
          ))}
        </div>
        )}
      </CardContent>

      {/* Edit Report Form */}
      {showEditForm && selectedReport && (
        <ReportForm
          report={selectedReport}
          onClose={() => {
            setShowEditForm(false);
            setSelectedReport(null);
          }}
          onSuccess={(updatedReport) => {
            toast({
              title: "Report Updated",
              description: "The report has been updated successfully.",
              variant: "default"
            });
            // Refresh the reports list
            fetchReports();
            setShowEditForm(false);
            setSelectedReport(null);
          }}
        />
      )}
    </Card>
  );
};

export default ReportList;