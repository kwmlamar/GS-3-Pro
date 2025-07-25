import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Eye, Loader2 } from 'lucide-react';
import { observationsService } from '@/lib/reportsService';

const ObservationList = () => {
  const [observations, setObservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Fetch observations from database
  useEffect(() => {
    const fetchObservations = async () => {
      try {
        setLoading(true);
        const data = await observationsService.getObservations();
        setObservations(data);
      } catch (error) {
        console.error('Error fetching observations:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load observations. Please try again."
        });
      } finally {
        setLoading(false);
      }
    };

    fetchObservations();
  }, [toast]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Eye className="w-5 h-5 text-blue-400" />
          <span>Observations & Notes</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-10">
            <Loader2 className="w-8 h-8 text-blue-400 mx-auto mb-4 animate-spin" />
            <p className="text-gray-400">Loading observations...</p>
          </div>
        ) : observations.length === 0 ? (
          <div className="text-center py-10">
            <Eye className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white">No Observations Found</h3>
            <p className="text-gray-400">No observations have been recorded yet.</p>
          </div>
        ) : (
        <div className="space-y-4">
          {observations.map((observation) => (
            <motion.div
              key={observation.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-white font-semibold">{observation.type}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      observation.priority === 'High' ? 'bg-red-500/20 text-red-400' :
                      observation.priority === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-green-500/20 text-green-400'
                    }`}>
                      {observation.priority} Priority
                    </span>
                  </div>
                  <p className="text-gray-300 text-sm mb-2">{observation.description}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <span>{observation.location}</span>
                    <span>•</span>
                    <span>Observer: {observation.observer_name}</span>
                    <span>•</span>
                    <span>{new Date(observation.observation_date).toLocaleDateString()}</span>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => toast({ title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀" })}
                  className="border-blue-500/30 hover:bg-blue-500/10"
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

export default ObservationList;