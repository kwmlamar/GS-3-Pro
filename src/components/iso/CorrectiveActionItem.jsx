import React from 'react';
import { motion } from 'framer-motion';
import { User, Calendar, Flag, Building, CheckCircle, AlertCircle, Clock } from 'lucide-react';

const CorrectiveActionItem = ({ action }) => {
  const getStatusPill = (status) => {
    switch (status) {
      case 'Completed':
        return <span className="flex items-center text-xs font-medium text-green-400 bg-green-500/20 px-2 py-1 rounded-full"><CheckCircle className="w-3 h-3 mr-1.5" />{status}</span>;
      case 'In Progress':
        return <span className="flex items-center text-xs font-medium text-yellow-400 bg-yellow-500/20 px-2 py-1 rounded-full"><Clock className="w-3 h-3 mr-1.5" />{status}</span>;
      default:
        return <span className="flex items-center text-xs font-medium text-red-400 bg-red-500/20 px-2 py-1 rounded-full"><AlertCircle className="w-3 h-3 mr-1.5" />{status}</span>;
    }
  };

  const getPriorityPill = (priority) => {
    switch (priority) {
      case 'High':
        return <span className="flex items-center text-xs font-medium text-red-400"><Flag className="w-3 h-3 mr-1.5" />{priority}</span>;
      case 'Medium':
        return <span className="flex items-center text-xs font-medium text-yellow-400"><Flag className="w-3 h-3 mr-1.5" />{priority}</span>;
      default:
        return <span className="flex items-center text-xs font-medium text-green-400"><Flag className="w-3 h-3 mr-1.5" />{priority}</span>;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 rounded-lg bg-slate-800/50 border border-slate-700 hover:bg-slate-700/60 transition-colors"
    >
      <div className="flex flex-col sm:flex-row justify-between">
        <div className="flex-1 mb-3 sm:mb-0">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-white font-semibold">{action.iso_standard}</h3>
            {getStatusPill(action.status)}
          </div>
          <p className="text-sm text-slate-300 mb-3">{action.issue_description}</p>
          <p className="text-sm text-slate-400"><span className="font-semibold text-slate-300">Required Action:</span> {action.corrective_action_required}</p>
        </div>
        <div className="w-full sm:w-64 flex-shrink-0 sm:pl-4 sm:border-l sm:border-slate-700 space-y-2 text-sm">
          <div className="flex items-center text-slate-400">
            <Building className="w-4 h-4 mr-2 text-sky-400" />
            <span>Site: <span className="text-slate-200">{action.sites?.name || 'N/A'}</span></span>
          </div>
          <div className="flex items-center text-slate-400">
            <User className="w-4 h-4 mr-2 text-sky-400" />
            <span>POC: <span className="text-slate-200">{action.users?.full_name || 'Unassigned'}</span></span>
          </div>
          <div className="flex items-center text-slate-400">
            <Calendar className="w-4 h-4 mr-2 text-sky-400" />
            <span>Due: <span className="text-slate-200">{action.due_date}</span></span>
          </div>
          <div className="flex items-center text-slate-400">
            {getPriorityPill(action.priority_level)}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CorrectiveActionItem;