import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { 
  AlertTriangle,
  Loader2
} from 'lucide-react';
import { violationsService } from '@/lib/reportsService';

const ViolationList = () => {
  const [violations, setViolations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Fetch violations from database
  useEffect(() => {
    const fetchViolations = async () => {
      try {
        setLoading(true);
        const data = await violationsService.getViolations();
        setViolations(data);
      } catch (error) {
        console.error('Error fetching violations:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load violations. Please try again."
        });
      } finally {
        setLoading(false);
      }
    };

    fetchViolations();
  }, [toast]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <AlertTriangle className="w-5 h-5 text-red-400" />
          <span>Violations & Events</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-10">
            <Loader2 className="w-8 h-8 text-red-400 mx-auto mb-4 animate-spin" />
            <p className="text-gray-400">Loading violations...</p>
          </div>
        ) : violations.length === 0 ? (
          <div className="text-center py-10">
            <AlertTriangle className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white">No Violations Found</h3>
            <p className="text-gray-400">No violations have been reported yet.</p>
          </div>
        ) : (
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
                    <span>Reported by: {violation.reported_by_name}</span>
                    <span>•</span>
                    <span>{new Date(violation.violation_date).toLocaleDateString()}</span>
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
        )}
      </CardContent>
    </Card>
  );
};

export default ViolationList;