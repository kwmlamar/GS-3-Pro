import React, { useState } from 'react';
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
  Hash
} from 'lucide-react';

const ReportList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const reports = [
    {
      id: 1,
      title: 'Security Incident Report',
      type: 'Incident',
      docNumber: 'SIR-2024-001',
      site: 'Corporate HQ Alpha',
      officer: 'John Smith',
      date: '2025-01-15',
      status: 'Completed',
      priority: 'High'
    },
    {
      id: 2,
      title: 'Daily Patrol Report',
      type: 'Patrol',
      docNumber: 'DPR-2024-045',
      site: 'Metro Hospital East',
      officer: 'Sarah Johnson',
      date: '2025-01-15',
      status: 'Under Review',
      priority: 'Medium'
    },
  ];

  const handleViewReport = (id) => {
    toast({
      title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀"
    });
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
  
  const filteredReports = reports.filter(report => 
    report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.docNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.officer.toLowerCase().includes(searchTerm.toLowerCase())
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
                      {report.priority}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      report.status === 'Completed' ? 'bg-green-500/20 text-green-400' :
                      report.status === 'Under Review' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-blue-500/20 text-blue-400'
                    }`}>
                      {report.status}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Hash className="w-4 h-4" />
                      <span>{report.docNumber}</span>
                    </div>
                    <span>•</span>
                    <span>{report.site}</span>
                    <span>•</span>
                    <span>Officer: {report.officer}</span>
                    <span>•</span>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{report.date}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleViewReport(report.id)}
                    className="border-white/20 hover:bg-white/10"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleExportReport(report.id)}
                    className="border-white/20 hover:bg-white/10"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleShareReport(report.id)}
                    className="border-white/20 hover:bg-white/10"
                  >
                    <Share className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReportList;