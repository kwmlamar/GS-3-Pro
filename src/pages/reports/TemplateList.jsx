import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { FileText } from 'lucide-react';

const TemplateList = () => {
  const { toast } = useToast();
  const templates = [
    'Incident Report Template',
    'Daily Patrol Template',
    'Equipment Inspection Template',
    'Violation Report Template',
    'Observation Log Template',
    'Security Assessment Template'
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FileText className="w-5 h-5 text-purple-400" />
          <span>Dynamic Report Templates</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((template, index) => (
            <motion.div
              key={template}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
              onClick={() => toast({ title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀" })}
            >
              <FileText className="w-8 h-8 text-purple-400 mb-3" />
              <h3 className="text-white font-medium mb-2">{template}</h3>
              <p className="text-gray-400 text-sm">Customizable template with document control number</p>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TemplateList;