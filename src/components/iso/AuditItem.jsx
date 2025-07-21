import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const AuditItem = ({ audit }) => {
  const { toast } = useToast();
  
  const handleViewAudit = (id) => {
    toast({
      title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀"
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 rounded-lg bg-slate-800/50 border border-slate-700 hover:bg-slate-700/60 transition-colors"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-white font-semibold">{audit.type}</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              audit.standard === 'ISO 18788' ? 'bg-blue-500/20 text-blue-400' :
              audit.standard === 'ISO 14001' ? 'bg-green-500/20 text-green-400' :
              'bg-yellow-500/20 text-yellow-400'
            }`}>
              {audit.standard}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              audit.status === 'Completed' ? 'bg-green-500/20 text-green-400' :
              audit.status === 'In Progress' ? 'bg-yellow-500/20 text-yellow-400' :
              'bg-blue-500/20 text-blue-400'
            }`}>
              {audit.status}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-400">
            <span>Auditor: {audit.auditor}</span>
            <span className="hidden sm:inline">•</span>
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>{audit.date}</span>
            </div>
            <span className="hidden sm:inline">•</span>
            <span>{audit.site}</span>
            {audit.findings > 0 && (
              <>
                <span className="hidden sm:inline">•</span>
                <span className="text-yellow-400">{audit.findings} findings</span>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-3 ml-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleViewAudit(audit.id)}
            className="border-slate-600 hover:bg-slate-700 text-gray-300"
          >
            View Details
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default AuditItem;