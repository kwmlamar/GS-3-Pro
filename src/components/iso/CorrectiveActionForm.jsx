import React, { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabaseClient';
import { Save, Loader2 } from 'lucide-react';

const CorrectiveActionForm = ({ isOpen, setIsOpen, inspection, onSuccess }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    inspection_id: null,
    site_id: null,
    iso_standard: '',
    issue_description: '',
    corrective_action_required: '',
    assigned_poc_id: null,
    priority_level: 'Medium',
    due_date: '',
    status: 'Pending',
  });

  useEffect(() => {
    if (inspection) {
      setFormData(prev => ({
        ...prev,
        inspection_id: inspection.id,
        site_id: inspection.site_id, // Assuming inspection object has site_id
        iso_standard: inspection.standard || 'General', // Assuming inspection has standard
        issue_description: `Finding from ${inspection.type} inspection on ${inspection.date}.`,
      }));
    }
  }, [inspection]);

  const fetchUsers = useCallback(async () => {
    try {
      const { data, error } = await supabase.from('users').select('id, full_name');
      if (error) throw error;
      setUsers(data);
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error fetching users', description: error.message });
    }
  }, [toast]);

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen, fetchUsers]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.from('iso_corrective_actions').insert([formData]);
      if (error) throw error;
      toast({ title: 'Corrective action logged successfully' });
      onSuccess();
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error logging action', description: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Log Corrective Action</DialogTitle>
          <DialogDescription>
            Create a new corrective action plan for an inspection finding.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div>
            <Label htmlFor="issue_description">Issue Description</Label>
            <Textarea id="issue_description" name="issue_description" value={formData.issue_description} onChange={handleInputChange} required />
          </div>
          <div>
            <Label htmlFor="corrective_action_required">Corrective Action Required</Label>
            <Textarea id="corrective_action_required" name="corrective_action_required" value={formData.corrective_action_required} onChange={handleInputChange} required />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="assigned_poc_id">Point of Contact</Label>
              <Select name="assigned_poc_id" onValueChange={(value) => handleSelectChange('assigned_poc_id', value)}>
                <SelectTrigger><SelectValue placeholder="Assign a user..." /></SelectTrigger>
                <SelectContent>
                  {users.map(user => <SelectItem key={user.id} value={user.id}>{user.full_name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="priority_level">Priority Level</Label>
              <Select name="priority_level" defaultValue="Medium" onValueChange={(value) => handleSelectChange('priority_level', value)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="due_date">Due Date</Label>
            <Input id="due_date" name="due_date" type="date" value={formData.due_date} onChange={handleInputChange} required />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              {loading ? 'Saving...' : 'Save Action'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CorrectiveActionForm;