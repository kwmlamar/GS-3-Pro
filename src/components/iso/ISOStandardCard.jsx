import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Leaf, Users } from 'lucide-react';

const ISOStandardCard = ({ standard, index }) => {
  const getIcon = () => {
    if (standard.standard === 'ISO 18788') return <Shield className="w-5 h-5 text-blue-400" />;
    if (standard.standard === 'ISO 14001') return <Leaf className="w-5 h-5 text-green-400" />;
    return <Users className="w-5 h-5 text-yellow-400" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="ios-card hover-lift">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {getIcon()}
              <span className="text-lg text-white">{standard.standard}</span>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              standard.status === 'Certified' ? 'bg-green-500/20 text-green-400' :
              standard.status === 'In Progress' ? 'bg-yellow-500/20 text-yellow-400' :
              'bg-red-500/20 text-red-400'
            }`}>
              {standard.status}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-gray-400 text-sm">{standard.title}</p>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Compliance</span>
                <span className="text-white font-semibold">{standard.compliance}%</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${
                    standard.compliance >= 95 ? 'bg-green-500' :
                    standard.compliance >= 85 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${standard.compliance}%` }}
                ></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-400">Last Audit</p>
                <p className="text-white">{standard.lastAudit}</p>
              </div>
              <div>
                <p className="text-gray-400">Next Audit</p>
                <p className="text-white">{standard.nextAudit}</p>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Open Findings</span>
              <span className={`font-semibold ${
                standard.findings === 0 ? 'text-green-400' :
                standard.findings <= 3 ? 'text-yellow-400' : 'text-red-400'
              }`}>
                {standard.findings}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ISOStandardCard;