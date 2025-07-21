import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Calendar, PlusCircle } from 'lucide-react';
import CorrectiveActionForm from '@/components/iso/CorrectiveActionForm';

const InspectionItem = ({ inspection, onActionAdded }) => {
  const [showForm, setShowForm] = useState(false);

  const hasIssues = inspection.status !== 'Passed';

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 rounded-lg bg-slate-800/50 border border-slate-700 hover:bg-slate-700/60 transition-colors"
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="text-white font-semibold">{inspection.title}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                inspection.type === 'Security' ? 'bg-blue-500/20 text-blue-400' :
                inspection.type === 'Environmental' ? 'bg-green-500/20 text-green-400' :
                'bg-yellow-500/20 text-yellow-400'
              }`}>
                {inspection.type}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                inspection.status === 'Passed' ? 'bg-green-500/20 text-green-400' :
                inspection.status === 'Minor Issues' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-red-500/20 text-red-400'
              }`}>
                {inspection.status}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-400">
              <span>Inspector: {inspection.inspector}</span>
              <span className="hidden sm:inline">•</span>
              <span>{inspection.site}</span>
              <span className="hidden sm:inline">•</span>
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>{inspection.date}</span>
              </div>
              <span className="hidden sm:inline">•</span>
              <span className={`font-medium ${
                inspection.score >= 95 ? 'text-green-400' :
                inspection.score >= 85 ? 'text-yellow-400' : 'text-red-400'
              }`}>
                Score: {inspection.score}%
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-3 ml-2">
            {hasIssues && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowForm(true)}
                className="border-yellow-600 hover:bg-yellow-700/50 text-yellow-400"
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                Log Action
              </Button>
            )}
          </div>
        </div>
      </motion.div>
      <CorrectiveActionForm
        isOpen={showForm}
        setIsOpen={setShowForm}
        inspection={inspection}
        onSuccess={() => {
          setShowForm(false);
          if(onActionAdded) onActionAdded();
        }}
      />
    </>
  );
};

export default InspectionItem;