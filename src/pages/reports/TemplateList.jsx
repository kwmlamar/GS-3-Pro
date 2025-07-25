import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { FileText, Loader2 } from 'lucide-react';
import { reportTemplatesService } from '@/lib/reportsService';

const TemplateList = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Fetch templates from database
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoading(true);
        const data = await reportTemplatesService.getTemplates();
        setTemplates(data);
      } catch (error) {
        console.error('Error fetching templates:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load templates. Please try again."
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, [toast]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FileText className="w-5 h-5 text-purple-400" />
          <span>Dynamic Report Templates</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-10">
            <Loader2 className="w-8 h-8 text-purple-400 mx-auto mb-4 animate-spin" />
            <p className="text-gray-400">Loading templates...</p>
          </div>
        ) : templates.length === 0 ? (
          <div className="text-center py-10">
            <FileText className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white">No Templates Found</h3>
            <p className="text-gray-400">No report templates are available.</p>
          </div>
        ) : (
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
              <h3 className="text-white font-medium mb-2">{template.title}</h3>
              <p className="text-gray-400 text-sm">{template.description}</p>
            </motion.div>
          ))}
        </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TemplateList;