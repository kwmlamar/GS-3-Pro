import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { 
  X, 
  Edit, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Shield, 
  User, 
  Star,
  CheckCircle,
  AlertCircle,
  Clock,
  GraduationCap,
  Archive,
  RotateCcw
} from 'lucide-react';
import EmployeeForm from './EmployeeForm';
import { updateEntityStaff } from '@/lib/entityStaffService';
import { updateSecurityStaff } from '@/lib/securityStaffService';

const EmployeeDetail = ({ employee, onClose, onUpdate, staffType = 'security' }) => {
  const [showEditForm, setShowEditForm] = useState(false);
  const { toast } = useToast();

  const handleArchive = async () => {
    if (!window.confirm(`Are you sure you want to archive ${employee.name}? They will be moved to the archive.`)) {
      return;
    }

    try {
      const updateFunction = staffType === 'entity' ? updateEntityStaff : updateSecurityStaff;
      const { error } = await updateFunction(employee.id, {
        ...employee,
        status: 'Archived'
      });

      if (error) throw error;

      toast({
        title: "Employee Archived",
        description: `${employee.name} has been moved to the archive.`,
        variant: "default"
      });

      onUpdate?.({ ...employee, status: 'Archived' });
      onClose();
    } catch (error) {
      console.error('Error archiving employee:', error);
      toast({
        title: "Error",
        description: "Failed to archive employee.",
        variant: "destructive"
      });
    }
  };

  const handleRestore = async () => {
    try {
      const updateFunction = staffType === 'entity' ? updateEntityStaff : updateSecurityStaff;
      const { error } = await updateFunction(employee.id, {
        ...employee,
        status: 'Active'
      });

      if (error) throw error;

      toast({
        title: "Employee Restored",
        description: `${employee.name} has been restored to active status.`,
        variant: "default"
      });

      onUpdate?.({ ...employee, status: 'Active' });
      onClose();
    } catch (error) {
      console.error('Error restoring employee:', error);
      toast({
        title: "Error",
        description: "Failed to restore employee.",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Inactive': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'On Leave': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'Terminated': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      case 'Archived': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getComplianceColor = (compliance) => {
    if (compliance >= 95) return 'text-green-400';
    if (compliance >= 85) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getComplianceIcon = (compliance) => {
    if (compliance >= 95) return <CheckCircle className="w-4 h-4 text-green-400" />;
    if (compliance >= 85) return <AlertCircle className="w-4 h-4 text-yellow-400" />;
    return <AlertCircle className="w-4 h-4 text-red-400" />;
  };

  const handleUpdate = (updatedEmployee) => {
    onUpdate?.(updatedEmployee);
    setShowEditForm(false);
    toast({
      title: "Employee Updated",
      description: `${updatedEmployee.name} has been updated successfully.`,
      variant: "default"
    });
  };

  if (showEditForm) {
    return (
      <EmployeeForm
        employee={employee}
        onClose={() => setShowEditForm(false)}
        onSuccess={handleUpdate}
        staffType={staffType}
      />
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <Card className="ios-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="flex items-center space-x-2 text-white">
                <User className="w-5 h-5 text-blue-400" />
                <span>Employee Profile</span>
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowEditForm(true)}
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Header Section */}
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                    {employee.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{employee.name}</h2>
                    <p className="text-gray-400">{employee.role}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge className={getStatusColor(employee.status)}>
                        {employee.status}
                      </Badge>
                      <div className="flex items-center space-x-1">
                        {getComplianceIcon(employee.compliance)}
                        <span className={`text-sm font-medium ${getComplianceColor(employee.compliance)}`}>
                          {employee.compliance}% Compliant
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="ios-card">
                  <CardHeader>
                    <CardTitle className="text-white text-lg">Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Mail className="w-4 h-4 text-blue-400" />
                      <span className="text-gray-300">{employee.email}</span>
                    </div>
                    {employee.phone && (
                      <div className="flex items-center space-x-3">
                        <Phone className="w-4 h-4 text-blue-400" />
                        <span className="text-gray-300">{employee.phone}</span>
                      </div>
                    )}
                                    <div className="flex items-center space-x-3">
                  <MapPin className="w-4 h-4 text-blue-400" />
                  <span className="text-gray-300">
                    {employee.entities && employee.entities.length > 0
                      ? employee.entities.map((entity, index) => (
                          <span key={entity.site_id} className="inline-flex items-center">
                            {entity.sites?.name || 'Unknown Entity'}
                            {entity.is_primary && (
                              <Badge className="ml-2 bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                                Primary
                              </Badge>
                            )}
                            {index < employee.entities.length - 1 && <span className="mx-1">, </span>}
                          </span>
                        ))
                      : employee.site || 'No entities assigned'
                    }
                  </span>
                </div>

                {/* Supervisor Information */}
                {employee.supervisor_name && (
                  <div className="flex items-center space-x-3">
                    <User className="w-4 h-4 text-purple-400" />
                    <span className="text-gray-300">
                      Reports to: <span className="text-purple-300 font-medium">{employee.supervisor_name}</span>
                      {employee.supervisor_role && (
                        <span className="text-gray-400 ml-1">({employee.supervisor_role})</span>
                      )}
                    </span>
                  </div>
                )}
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-4 h-4 text-blue-400" />
                      <span className="text-gray-300">
                        Hired: {new Date(employee.hire_date).toLocaleDateString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="ios-card">
                  <CardHeader>
                    <CardTitle className="text-white text-lg">Employment Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Employee Type:</span>
                      <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                        {employee.type}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Compliance Score:</span>
                      <span className={`font-semibold ${getComplianceColor(employee.compliance)}`}>
                        {employee.compliance}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Status:</span>
                      <Badge className={getStatusColor(employee.status)}>
                        {employee.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Certifications:</span>
                      <span className="text-white font-medium">
                        {Array.isArray(employee.certifications) ? employee.certifications.length : 0}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Certifications */}
              {employee.certifications && employee.certifications.length > 0 && (
                <Card className="ios-card">
                  <CardHeader>
                    <CardTitle className="text-white text-lg flex items-center space-x-2">
                      <Shield className="w-5 h-5 text-green-400" />
                      <span>Certifications & Training</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {Array.isArray(employee.certifications) ? employee.certifications.map((cert, index) => (
                        <div key={index} className="flex items-center space-x-2 p-3 rounded-lg bg-slate-700/50">
                          <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                          <span className="text-white text-sm">{cert}</span>
                        </div>
                      )) : (
                        <div className="flex items-center space-x-2 p-3 rounded-lg bg-slate-700/50">
                          <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                          <span className="text-white text-sm">{employee.certifications}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Notes & Comments */}
              {employee.notes && (
                <Card className="ios-card">
                  <CardHeader>
                    <CardTitle className="text-white text-lg flex items-center space-x-2">
                      <User className="w-5 h-5 text-blue-400" />
                      <span>Notes & Comments</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="p-4 rounded-lg bg-slate-700/50 border border-slate-600">
                      <p className="text-white whitespace-pre-wrap">{employee.notes}</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Quick Actions */}
              <Card className="ios-card">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                    <Button
                      variant="outline"
                      className="border-slate-600 text-slate-300 hover:bg-slate-700"
                      onClick={() => toast({ title: "Feature coming soon", description: "Training management will be available soon." })}
                    >
                      <GraduationCap className="w-4 h-4 mr-2" />
                      Manage Training
                    </Button>
                    <Button
                      variant="outline"
                      className="border-slate-600 text-slate-300 hover:bg-slate-700"
                      onClick={() => toast({ title: "Feature coming soon", description: "Schedule management will be available soon." })}
                    >
                      <Clock className="w-4 h-4 mr-2" />
                      View Schedule
                    </Button>
                    <Button
                      variant="outline"
                      className="border-slate-600 text-slate-300 hover:bg-slate-700"
                      onClick={() => toast({ title: "Feature coming soon", description: "Performance tracking will be available soon." })}
                    >
                      <Star className="w-4 h-4 mr-2" />
                      Performance Review
                    </Button>
                    {employee.status === 'Archived' ? (
                      <Button
                        onClick={handleRestore}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Restore
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        onClick={handleArchive}
                        className="border-purple-600 text-purple-300 hover:bg-purple-700/20"
                      >
                        <Archive className="w-4 h-4 mr-2" />
                        Archive
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EmployeeDetail; 