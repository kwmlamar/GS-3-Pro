import React from 'react';
import { motion } from 'framer-motion';
import { FileCheck } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const ReportTemplateItem = ({ template, index }) => {
  const { toast } = useToast();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 }}
      className="p-4 rounded-lg bg-slate-800/50 border border-slate-700 hover:bg-slate-700/60 transition-colors cursor-pointer"
      onClick={() => toast({ title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀" })}
    >
      <FileCheck className="w-8 h-8 text-blue-400 mb-3" />
      <h3 className="text-white font-medium mb-2">{template}</h3>
      <p className="text-gray-400 text-sm">Generate comprehensive ISO compliance reports</p>
    </motion.div>
  );
};

export default ReportTemplateItem;