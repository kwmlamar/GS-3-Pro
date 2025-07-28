import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabaseClient';
import { Settings, Save, ListChecks, Users, BellRing, Shield, Key } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

const AdminSettings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const settingDefinitions = [
    { key: 'default_incident_distribution_high_severity', label: 'High Severity Incident Distribution', type: 'json', description: 'JSON defining levels (e.g., ["national"]) and roles (e.g., ["executive"]) for high severity incident report distribution.', icon: BellRing, category: 'Distribution' },
    { key: 'default_violation_distribution_critical', label: 'Critical Violation Distribution', type: 'json', description: 'JSON defining distribution for critical violations.', icon: BellRing, category: 'Distribution' },
    { key: 'allow_security_company_data_sharing', label: 'Allow Security Company Data Sharing with Client', type: 'boolean', description: 'If enabled, clients can view relevant data from assigned security companies.', icon: Users, category: 'Access Control' },
    { key: 'max_incident_attachment_size_mb', label: 'Max Incident Attachment Size (MB)', type: 'number', description: 'Maximum file size in MB for attachments to incident reports.', icon: Shield, category: 'System' },
    { key: 'auto_archive_reports_days', label: 'Auto-Archive Reports After (Days)', type: 'number', description: 'Number of days after which completed reports are auto-archived. 0 to disable.', icon: Save, category: 'System' },
    { key: 'api_key_external_integrations', label: 'External Integrations API Key', type: 'text', description: 'API Key for secure communication with external partner applications.', icon: Key, category: 'Integrations' }
  ];

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('admin_settings').select('setting_key, setting_value');
      if (error) throw error;
      
      const fetchedSettings = data.reduce((acc, { setting_key, setting_value }) => {
        acc[setting_key] = setting_value;
        return acc;
      }, {});

      const initialSettings = {};
      settingDefinitions.forEach(def => {
        initialSettings[def.key] = fetchedSettings[def.key] ?? (def.type === 'json' ? {} : (def.type === 'boolean' ? false : (def.type === 'number' ? 0 : '')));
      });
      setSettings(initialSettings);
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error fetching settings', description: error.message });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleInputChange = (key, value, type) => {
    if (type === 'number') {
      setSettings(prev => ({ ...prev, [key]: value === '' ? '' : Number(value) }));
    } else {
      setSettings(prev => ({ ...prev, [key]: value }));
    }
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    const upsertPromises = settingDefinitions.map(def => {
      let valueToSave = settings[def.key];
      if (def.type === 'json' && typeof valueToSave === 'string') {
        try {
          valueToSave = valueToSave.trim() === '' ? {} : JSON.parse(valueToSave);
        } catch (e) {
          toast({ variant: 'destructive', title: `Invalid JSON for ${def.label}`, description: 'Please correct the JSON format.' });
          return Promise.reject(new Error(`Invalid JSON for ${def.label}`));
        }
      }
      return supabase.from('admin_settings').upsert({ setting_key: def.key, setting_value: valueToSave, description: def.description }, { onConflict: 'setting_key' });
    });

    try {
      await Promise.all(upsertPromises);
      toast({ title: 'Settings Saved', description: 'All admin settings have been updated successfully.' });
    } catch (error) {
       if (!error.message.startsWith('Invalid JSON')) {
          toast({ variant: 'destructive', title: 'Error Saving Settings', description: error.message });
       }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-10 text-white">Loading Admin Settings...</div>;
  }

  const settingsByCategory = settingDefinitions.reduce((acc, setting) => {
    const category = setting.category || 'General';
    acc[category] = acc[category] ? [...acc[category], setting] : [setting];
    return acc;
  }, {});

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 pb-10">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white flex items-center"><Settings className="w-8 h-8 mr-3 text-blue-400" />Admin Settings</h1>
      </div>

      {Object.entries(settingsByCategory).map(([category, categorySettings]) => (
        <Card key={category} className="ios-card">
          <CardHeader>
            <CardTitle className="text-xl text-white flex items-center">
              {React.createElement(categorySettings[0].icon, { className: "w-6 h-6 mr-2 text-blue-400" })}
              {category} Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {categorySettings.map((def) => (
              <div key={def.key} className="space-y-2 p-4 border border-slate-700 rounded-lg bg-slate-800/40">
                <Label htmlFor={def.key} className="text-base font-medium text-gray-200 flex items-center">
                  {React.createElement(def.icon, { className: "w-4 h-4 mr-2 text-slate-400" })} {def.label}
                </Label>
                <p className="text-xs text-gray-400 mb-1">{def.description}</p>
                {def.type === 'json' && (
                  <Textarea id={def.key} value={typeof settings[def.key] === 'object' ? JSON.stringify(settings[def.key], null, 2) : settings[def.key]} onChange={(e) => handleInputChange(def.key, e.target.value, 'json')} rows={3} />
                )}
                {def.type === 'boolean' && (
                   <div className="flex items-center space-x-2 pt-1">
                      <Switch id={def.key} checked={!!settings[def.key]} onCheckedChange={(checked) => handleInputChange(def.key, checked, 'boolean')} className="data-[state=checked]:bg-blue-500" />
                      <Label htmlFor={def.key} className="text-sm text-gray-300">{settings[def.key] ? 'Enabled' : 'Disabled'}</Label>
                   </div>
                )}
                {def.type === 'number' && (
                  <Input id={def.key} type="number" value={settings[def.key] ?? ''} onChange={(e) => handleInputChange(def.key, e.target.value, 'number')} />
                )}
                 {def.type === 'text' && (
                  <Input id={def.key} type="text" value={settings[def.key] || ''} onChange={(e) => handleInputChange(def.key, e.target.value, 'text')} />
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
      
      <div className="flex justify-end mt-8">
        <Button onClick={handleSaveSettings} disabled={saving || loading} className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg text-base">
          <Save className="w-5 h-5 mr-2" />
          {saving ? 'Saving...' : 'Save All Settings'}
        </Button>
      </div>
    </motion.div>
  );
};

export default AdminSettings;