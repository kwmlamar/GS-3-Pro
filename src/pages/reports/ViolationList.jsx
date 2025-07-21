import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { 
  AlertTriangle,
} from 'lucide-react';

const ViolationList = () => {
  const { toast } = useToast();
  const violations = [
    {
      id: 1,
      type: 'Safety Violation',
      description: 'Improper PPE usage in restricted area',
      severity: 'Medium',
      location: 'Building A - Floor 3',
      reportedBy: 'Lisa Chen',
      date: '2025-01-15'
    },
    {
      id: 2,
      type: 'Security Breach',
      description: 'Unauthorized access attempt',
      severity: 'High',
      location: 'Main Entrance',
      reportedBy: 'John Smith',
      date: '2025-01-14'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <AlertTriangle className="w-5 h-5 text-red-400" />
          <span>Violations & Events</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {violations.map((violation) => (
            <motion.div
              key={violation.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-white font-semibold">{violation.type}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      violation.severity === 'High' ? 'bg-red-500/20 text-red-400' :
                      violation.severity === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-green-500/20 text-green-400'
                    }`}>
                      {violation.severity} Severity
                    </span>
                  </div>
                  <p className="text-gray-300 text-sm mb-2">{violation.description}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <span>{violation.location}</span>
                    <span>•</span>
                    <span>Reported by: {violation.reportedBy}</span>
                    <span>•</span>
                    <span>{violation.date}</span>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => toast({ title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀" })}
                  className="border-red-500/30 hover:bg-red-500/10"
                >
                  View Details
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ViolationList;