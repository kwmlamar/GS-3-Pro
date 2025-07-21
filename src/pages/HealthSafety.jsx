import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabaseClient';
import { ArrowLeft, Plus, Edit, Trash2, Save, Search, ShieldAlert, AlertTriangle, CheckCircle2, FileText, UploadCloud } from 'lucide-react';

const HealthSafety = () => {
  const { toast } = useToast();
  const [incidents, setIncidents] = useState([]);
  const [sites, setSites] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentIncident, setCurrentIncident] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    site_id: '',
    description: '',
    incident_date: '',
    report_file: null, 
    investigation_status: 'open',
  });

  const fetchInitialData = useCallback(async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);

      const { data: sitesData, error: sitesError } = await supabase.from('sites').select('id, name');
      if (sitesError) throw sitesError;
      setSites(sitesData);

      const { data: incidentsData, error: incidentsError } = await supabase
        .from('health_safety_incidents')
        .select(`
          id, 
          site_id, 
          description, 
          incident_date, 
          investigation_status, 
          report_url,
          created_at,
          sites ( name ),
          users ( full_name )
        `)
        .order('incident_date', { ascending: false });
      
      if (incidentsError) throw incidentsError;
      setIncidents(incidentsData.map(inc => ({
        ...inc,
        site_name: inc.sites?.name || 'N/A',
        reported_by_name: inc.users?.full_name || 'N/A (System?)' 
      })));

    } catch (error) {
      toast({ variant: 'destructive', title: 'Error fetching data', description: error.message });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'report_file') {
      setFormData(prev => ({ ...prev, [name]: files ? files[0] : null }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({ site_id: '', description: '', incident_date: '', report_file: null, investigation_status: 'open' });
    setIsEditing(false);
    setCurrentIncident(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      toast({ variant: 'destructive', title: 'User not authenticated', description: 'Please log in to report an incident.' });
      return;
    }

    if (formData.report_file) {
        toast({
            title: "File Selected",
            description: `🚧 File upload for "${formData.report_file.name}" isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀`,
        });
    }
    
    const dataToSave = {
      site_id: formData.site_id,
      description: formData.description,
      incident_date: formData.incident_date,
      reported_by_id: currentUser.id,
      investigation_status: formData.investigation_status,
    };

    setLoading(true);
    try {
      let error;
      if (isEditing && currentIncident) {
        const { error: updateError } = await supabase.from('health_safety_incidents').update(dataToSave).eq('id', currentIncident.id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase.from('health_safety_incidents').insert([dataToSave]);
        error = insertError;
      }

      if (error) throw error;
      toast({ title: `Incident ${isEditing ? 'updated' : 'reported'} successfully` });
      resetForm();
      fetchInitialData();
    } catch (error) {
      toast({ variant: 'destructive', title: `Error ${isEditing ? 'updating' : 'reporting'} incident`, description: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (incident) => {
    setIsEditing(true);
    setCurrentIncident(incident);
    setFormData({
      site_id: incident.site_id || '',
      description: incident.description || '',
      incident_date: incident.incident_date ? new Date(incident.incident_date).toISOString().split('T')[0] : '',
      report_file: null, 
      investigation_status: incident.investigation_status || 'open',
    });
    setShowForm(true);
  };
  
  const handleUpdateStatus = async (incidentId, newStatus) => {
    if (!window.confirm(`Are you sure you want to change status to "${newStatus.replace('_',' ')}"?`)) return;
    setLoading(true);
    try {
      const { error } = await supabase
        .from('health_safety_incidents')
        .update({ investigation_status: newStatus })
        .eq('id', incidentId);
      if (error) throw error;
      toast({ title: 'Incident status updated successfully' });
      fetchInitialData();
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error updating status', description: error.message });
    } finally {
      setLoading(false);
    }
  };

  const iosButtonStyle = "bg-[#607D8B] hover:bg-[#546E7A] text-white";
  const iosInputStyle = "bg-white text-gray-800 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500";

  const filteredIncidents = incidents.filter(incident => 
    incident.site_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    incident.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    incident.reported_by_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && !sites.length && !incidents.length && !showForm) {
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
          <Link to="/" className={`p-2 rounded-full hover:bg-slate-700/50 transition-colors ${iosButtonStyle}`}>
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center"><ShieldAlert className="w-8 h-8 mr-3 text-red-400" />Health & Safety</h1>
            <p className="text-gray-400 mt-1">Report and manage workplace health and safety incidents.</p>
          </div>
        </div>
        {!showForm && (
          <Button onClick={() => { setShowForm(true); setIsEditing(false); resetForm(); }} className={`${iosButtonStyle} mt-4 sm:mt-0`}>
            <Plus className="w-4 h-4 mr-2" />
            Report New Incident
          </Button>
        )}
      </motion.div>

      {showForm ? (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <Card className="ios-card">
            <CardHeader>
              <CardTitle className="text-xl text-white">{isEditing ? 'Edit H&S Incident' : 'Report New H&S Incident'}</CardTitle>
              <CardDescription className="text-gray-400">
                {isEditing ? `Updating details for incident reported on ${new Date(currentIncident?.incident_date).toLocaleDateString()}.` : 'Fill in the details below.'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="site_id" className="text-gray-300">Site</Label>
                    <Select name="site_id" value={formData.site_id} onValueChange={(value) => handleSelectChange('site_id', value)} required>
                      <SelectTrigger className={iosInputStyle}><SelectValue placeholder="Select site..." /></SelectTrigger>
                      <SelectContent>
                        {sites.map(site => <SelectItem key={site.id} value={site.id}>{site.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="incident_date" className="text-gray-300">Incident Date</Label>
                    <Input id="incident_date" name="incident_date" type="date" value={formData.incident_date} onChange={handleInputChange} required className={iosInputStyle} />
                  </div>
                </div>
                <div>
                  <Label htmlFor="description" className="text-gray-300">Description of Incident</Label>
                  <Textarea id="description" name="description" value={formData.description} onChange={handleInputChange} required rows={4} className={`${iosInputStyle}`} placeholder="Describe what happened..." />
                </div>
                <div>
                  <Label htmlFor="report_file" className="text-gray-300">Upload Report/Media (Optional)</Label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-600 border-dashed rounded-md bg-slate-800/30">
                    <div className="space-y-1 text-center">
                      <UploadCloud className="mx-auto h-12 w-12 text-slate-400" />
                      <div className="flex text-sm text-slate-500">
                        <label
                          htmlFor="report_file"
                          className="relative cursor-pointer rounded-md font-medium text-blue-400 hover:text-blue-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500 focus-within:ring-offset-slate-900"
                        >
                          <span>Upload a file</span>
                          <Input id="report_file" name="report_file" type="file" className="sr-only" onChange={handleInputChange} />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-slate-500">PDF, JPG, PNG up to 10MB</p>
                    </div>
                  </div>
                  {formData.report_file && <p className="text-sm text-green-400 mt-2">File selected: {formData.report_file.name}</p>}
                </div>
                 {isEditing && (
                    <div>
                        <Label htmlFor="investigation_status" className="text-gray-300">Investigation Status</Label>
                        <Select name="investigation_status" value={formData.investigation_status} onValueChange={(value) => handleSelectChange('investigation_status', value)}>
                        <SelectTrigger className={iosInputStyle}><SelectValue placeholder="Select status..." /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="open">Open</SelectItem>
                            <SelectItem value="in_progress">In Progress</SelectItem>
                            <SelectItem value="closed">Closed</SelectItem>
                        </SelectContent>
                        </Select>
                    </div>
                )}
                <div className="flex justify-end space-x-3 pt-4">
                  <Button type="button" variant="outline" onClick={resetForm} className="text-gray-300 border-gray-600 hover:bg-slate-700">Cancel</Button>
                  <Button type="submit" className={`${iosButtonStyle}`} disabled={loading}>
                    <Save className="w-4 h-4 mr-2" />
                    {loading ? (isEditing ? 'Saving...' : 'Reporting...') : (isEditing ? 'Save Changes' : 'Report Incident')}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
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
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(incident)} className={`hover:bg-blue-500/20 text-blue-400 ${iosButtonStyle} p-1.5 md:p-2 h-auto md:h-8 w-auto md:w-8`}>
                          <Edit className="w-3.5 h-3.5 md:w-4 md:h-4" />
                        </Button>
                        {incident.investigation_status === 'open' && (
                          <Button variant="ghost" size="icon" onClick={() => handleUpdateStatus(incident.id, 'in_progress')} className={`hover:bg-orange-500/20 text-orange-400 ${iosButtonStyle} p-1.5 md:p-2 h-auto md:h-8 w-auto md:w-8`}>
                            <Search className="w-3.5 h-3.5 md:w-4 md:h-4" />
                          </Button>
                        )}
                        {incident.investigation_status === 'in_progress' && (
                           <Button variant="ghost" size="icon" onClick={() => handleUpdateStatus(incident.id, 'closed')} className={`hover:bg-green-500/20 text-green-400 ${iosButtonStyle} p-1.5 md:p-2 h-auto md:h-8 w-auto md:w-8`}>
                            <CheckCircle2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                          </Button>
                        )}
                        {incident.report_url && (
                           <Button variant="ghost" size="icon" onClick={() => toast({ title: "Feature Not Implemented", description: "Viewing/downloading reports is not yet implemented. 🚧"})} className={`hover:bg-purple-500/20 text-purple-400 ${iosButtonStyle} p-1.5 md:p-2 h-auto md:h-8 w-auto md:w-8`}>
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