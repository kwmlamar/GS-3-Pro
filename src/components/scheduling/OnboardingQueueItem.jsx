import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { CheckCircle, Clock, X, AlertTriangle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const OnboardingQueueItem = ({ person, onSchedule }) => {
  const { toast } = useToast();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 rounded-lg bg-slate-800/50 border border-slate-700 hover:bg-slate-700/60 transition-colors"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-white font-semibold">{person.name}</h3>
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400">
              {person.position}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-gray-400">Start Date</p>
              <p className="text-white">{person.startDate}</p>
            </div>
            <div>
              <p className="text-gray-400">Training Status</p>
              <div className="flex items-center space-x-1">
                {person.trainingStatus === 'Completed' ? (
                  <CheckCircle className="w-4 h-4 text-green-400" />
                ) : (
                  <Clock className="w-4 h-4 text-yellow-400" />
                )}
                <span className={person.trainingStatus === 'Completed' ? 'text-green-400' : 'text-yellow-400'}>
                  {person.trainingStatus}
                </span>
              </div>
            </div>
            <div>
              <p className="text-gray-400">Credentials</p>
              <div className="flex items-center space-x-1">
                {person.credentialsStatus === 'Approved' ? (
                  <CheckCircle className="w-4 h-4 text-green-400" />
                ) : (
                  <X className="w-4 h-4 text-red-400" />
                )}
                <span className={person.credentialsStatus === 'Approved' ? 'text-green-400' : 'text-red-400'}>
                  {person.credentialsStatus}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-3 ml-2">
          <Button 
            variant={person.canSchedule ? "default" : "outline"}
            size="sm"
            onClick={() => onSchedule(person.id, person.canSchedule)}
            className={person.canSchedule ? "bg-green-600 hover:bg-green-700" : "border-red-500/30 text-red-400"}
            disabled={!person.canSchedule}
          >
            {person.canSchedule ? (
              <>
                <CheckCircle className="w-4 h-4 mr-1" />
                Ready
              </>
            ) : (
              <>
                <AlertTriangle className="w-4 h-4 mr-1" />
                Cannot Schedule
              </>
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default OnboardingQueueItem;