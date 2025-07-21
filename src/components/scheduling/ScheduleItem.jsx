import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { MapPin, Clock } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const ScheduleItem = ({ schedule }) => {
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
            <h3 className="text-white font-semibold">{schedule.officer}</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              schedule.status === 'Confirmed' ? 'bg-green-500/20 text-green-400' :
              schedule.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-400' :
              'bg-red-500/20 text-red-400'
            }`}>
              {schedule.status}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              schedule.compliance === 'Qualified' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
            }`}>
              {schedule.compliance}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-400">
            <div className="flex items-center space-x-1">
              <MapPin className="w-4 h-4" />
              <span>{schedule.site}</span>
            </div>
            <span className="hidden sm:inline">•</span>
            <span>{schedule.shift}</span>
            <span className="hidden sm:inline">•</span>
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{schedule.time}</span>
            </div>
            <span className="hidden sm:inline">•</span>
            <span>{schedule.date}</span>
          </div>
        </div>
        <div className="flex items-center space-x-3 ml-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => toast({ title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀" })}
            className="border-slate-600 hover:bg-slate-700 text-gray-300"
          >
            Edit
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default ScheduleItem;