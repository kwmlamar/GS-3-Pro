import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { healthSafetyService } from '@/lib/healthSafetyService';
import IncidentForm from '@/components/health-safety/IncidentForm';
import { ArrowLeft, Plus, Edit, Search, ShieldAlert, AlertTriangle, CheckCircle2, FileText } from 'lucide-react';

const HealthSafety = () => {
  const { toast } = useToast();
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [currentIncident, setCurrentIncident] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchInitialData = useCallback(async () => {
    setLoading(true);
    try {
      const incidentsData = await healthSafetyService.getIncidents();
      setIncidents(incidentsData);
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error fetching data', description: error.message });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  const handleFormSuccess = () => {
    fetchInitialData();
  };

  const handleEdit = (incident) => {
    setCurrentIncident(incident);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setCurrentIncident(null);
  };
  
  const handleUpdateStatus = async (incidentId, newStatus) => {
    if (!window.confirm(`Are you sure you want to change status to "${newStatus.replace('_',' ')}"?`)) return;
    setLoading(true);
    try {
      await healthSafetyService.updateIncidentStatus(incidentId, newStatus);
      toast({ title: 'Incident status updated successfully' });
      fetchInitialData();
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error updating status', description: error.message });
    } finally {
      setLoading(false);
    }
  };



  const filteredIncidents = incidents.filter(incident => 
    incident.site_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    incident.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    incident.reported_by_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && incidents.length === 0 && !showForm) {
    return <div className="text-center py-10 text-white">Loading Health & Safety Incidents...</div>;
  }

  return (
    <div className="space-y-8 pb-10">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between"
      >
        <div className="flex items-center space-x-3">
          <Link to="/" className="p-2 rounded-full hover:bg-slate-700/50 transition-colors bg-[#607D8B] hover:bg-[#546E7A] text-white">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center"><ShieldAlert className="w-8 h-8 mr-3 text-red-400" />Health & Safety</h1>
            <p className="text-gray-400 mt-1">Report and manage workplace health and safety incidents.</p>
          </div>
        </div>
        {!showForm && (
          <Button onClick={() => setShowForm(true)} className="bg-[#607D8B] hover:bg-[#546E7A] text-white mt-4 sm:mt-0">
            <Plus className="w-4 h-4 mr-2" />
            Report New Incident
          </Button>
        )}
      </motion.div>

      {showForm && (
        <IncidentForm
          incident={currentIncident}
          onClose={handleCloseForm}
          onSuccess={handleFormSuccess}
        />
      )}
      {!showForm && (
        <Card className="ios-card">
          <CardHeader>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
              <div>
                <CardTitle className="text-xl text-white">Incident Log</CardTitle>
                <CardDescription className="text-gray-400">Review all reported health and safety incidents.</CardDescription>
              </div>
              <div className="relative mt-3 sm:mt-0">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search incidents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full sm:w-72 bg-slate-700/50 border-slate-600 text-gray-200 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading && incidents.length === 0 ? <p className="text-center text-gray-400 py-4">Loading incidents...</p> :
            !loading && incidents.length === 0 ? <p className="text-center text-gray-400 py-4">No health & safety incidents reported yet. Click "Report New Incident" to get started.</p> :
            (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="ios-table-header">
                  <TableRow>
                    <TableHead>Site</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Reported By</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="dark-table-row-hover">
                  {filteredIncidents.map((incident) => (
                    <TableRow key={incident.id}>
                      <TableCell className="font-medium text-white">{incident.site_name}</TableCell>
                      <TableCell className="max-w-xs truncate" title={incident.description}>{incident.description}</TableCell>
                      <TableCell>{new Date(incident.incident_date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          incident.investigation_status === 'open' ? 'bg-yellow-500/20 text-yellow-400' :
                          incident.investigation_status === 'in_progress' ? 'bg-blue-500/20 text-blue-400' :
                          'bg-green-500/20 text-green-400'
                        }`}>
                          {incident.investigation_status.replace('_', ' ').toUpperCase()}
                        </span>
                      </TableCell>
                      <TableCell>{incident.reported_by_name}</TableCell>
                      <TableCell className="text-right space-x-1 md:space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(incident)} className="hover:bg-blue-500/20 text-blue-400 bg-[#607D8B] hover:bg-[#546E7A] p-1.5 md:p-2 h-auto md:h-8 w-auto md:w-8">
                          <Edit className="w-3.5 h-3.5 md:w-4 md:h-4" />
                        </Button>
                        {incident.investigation_status === 'open' && (
                          <Button variant="ghost" size="icon" onClick={() => handleUpdateStatus(incident.id, 'in_progress')} className="hover:bg-orange-500/20 text-orange-400 bg-[#607D8B] hover:bg-[#546E7A] p-1.5 md:p-2 h-auto md:h-8 w-auto md:w-8">
                            <Search className="w-3.5 h-3.5 md:w-4 md:h-4" />
                          </Button>
                        )}
                        {incident.investigation_status === 'in_progress' && (
                           <Button variant="ghost" size="icon" onClick={() => handleUpdateStatus(incident.id, 'closed')} className="hover:bg-green-500/20 text-green-400 bg-[#607D8B] hover:bg-[#546E7A] p-1.5 md:p-2 h-auto md:h-8 w-auto md:w-8">
                            <CheckCircle2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                          </Button>
                        )}
                        {incident.report_url && (
                           <Button variant="ghost" size="icon" onClick={() => toast({ title: "Feature Not Implemented", description: "Viewing/downloading reports is not yet implemented. 🚧"})} className="hover:bg-purple-500/20 text-purple-400 bg-[#607D8B] hover:bg-[#546E7A] p-1.5 md:p-2 h-auto md:h-8 w-auto md:w-8">
                            <FileText className="w-3.5 h-3.5 md:w-4 md:h-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default HealthSafety;