import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Eye } from 'lucide-react';

const ObservationList = () => {
  const { toast } = useToast();
  const observations = [
    {
      id: 1,
      type: 'Maintenance Issue',
      description: 'Lighting malfunction in parking area',
      priority: 'Medium',
      location: 'Parking Lot B',
      observer: 'Sarah Johnson',
      date: '2025-01-15'
    },
    {
      id: 2,
      type: 'Security Enhancement',
      description: 'Recommend additional camera coverage',
      priority: 'Low',
      location: 'East Wing Corridor',
      observer: 'Mike Rodriguez',
      date: '2025-01-13'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Eye className="w-5 h-5 text-blue-400" />
          <span>Observations & Notes</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
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
                    <span>Observer: {observation.observer}</span>
                    <span>•</span>
                    <span>{observation.date}</span>
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
      </CardContent>
    </Card>
  );
};

export default ObservationList;