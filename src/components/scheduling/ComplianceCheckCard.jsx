import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, AlertTriangle, X } from 'lucide-react';

const ComplianceCheckCard = () => {
  const complianceRequirements = [
    'Current Security Training Certification', 'Valid Background Check (within 2 years)',
    'Site-Specific Training Completion', 'Equipment Certification',
    'Health & Safety Training', 'Emergency Response Training'
  ];

  return (
    <Card className="ios-card">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-white">
          <CheckCircle className="w-5 h-5 text-yellow-400" />
          <span>Compliance Verification System</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-lg bg-green-500/10">
              <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <h3 className="text-white font-semibold">Compliant Officers</h3>
              <p className="text-2xl font-bold text-green-400">234</p>
              <p className="text-gray-400 text-sm">Ready for Scheduling</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-yellow-500/10">
              <AlertTriangle className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <h3 className="text-white font-semibold">Training Due</h3>
              <p className="text-2xl font-bold text-yellow-400">12</p>
              <p className="text-gray-400 text-sm">Cannot Schedule</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-red-500/10">
              <X className="w-8 h-8 text-red-400 mx-auto mb-2" />
              <h3 className="text-white font-semibold">Non-Compliant</h3>
              <p className="text-2xl font-bold text-red-400">3</p>
              <p className="text-gray-400 text-sm">Immediate Action Required</p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-white font-semibold">Compliance Requirements</h3>
            {complianceRequirements.map((requirement, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-slate-800/50">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-white">{requirement}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ComplianceCheckCard;