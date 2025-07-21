const escapeContent = (content) => {
    if (!content) return '';
    return content.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
};

const DeveloperPage_jsx = {
  name: "DeveloperPage.jsx",
  type: "file",
  content: escapeContent(`
import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  Code, Eye, Terminal, Save, History, Key, LogIn, Database, Cpu, Wrench, Package, 
  LayoutDashboard, Network, AlertTriangle, Users, ShieldCheck, Settings, Loader2 
} from 'lucide-react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabaseClient';
import { defaultOverviewContent } from '@/data/developerContent';
import FileTree from '@/components/developer/FileTree';
import CodeViewer from '@/components/developer/CodeViewer';

const iconMap = {
  LayoutDashboard,
  Network,
  AlertTriangle,
  Users,
  ShieldCheck,
  Settings,
  Database,
  Cpu,
  Wrench,
  Package,
  Code,
  Eye,
};

const DeveloperPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoadingLogin, setIsLoadingLogin] = useState(false);
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [overviewContent, setOverviewContent] = useState(defaultOverviewContent);
  const [versionSnapshots, setVersionSnapshots] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingSnapshots, setIsLoadingSnapshots] = useState(true);

  const { toast } = useToast();

  const fetchSnapshots = useCallback(async () => {
    setIsLoadingSnapshots(true);
    const { data, error } = await supabase
      .from('developer_portal_snapshots')
      .select('id, created_at, version_name')
      .order('created_at', { ascending: false });

    if (error) {
      toast({ variant: 'destructive', title: 'Error fetching snapshots', description: error.message });
    } else {
      setVersionSnapshots(data);
    }
    setIsLoadingSnapshots(false);
  }, [toast]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchSnapshots();
    }
  }, [isAuthenticated, fetchSnapshots]);

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoadingLogin(true);
    setTimeout(() => {
      if (username === 'mg@gs-3.com' && password === 'Developer2025!') {
        setIsAuthenticated(true);
        toast({ title: 'Login Successful', description: 'Welcome to the Developer Portal.' });
      } else {
        toast({ variant: 'destructive', title: 'Login Failed', description: 'Invalid credentials.' });
      }
      setIsLoadingLogin(false);
    }, 500);
  };
  
  const handleSaveSnapshot = async () => {
    setIsSaving(true);
    const versionName = \`v\${overviewContent.version} - \${new Date().toISOString()}\`;
    const { error } = await supabase
      .from('developer_portal_snapshots')
      .insert([{ version_name: versionName, snapshot_content: overviewContent }]);

    if (error) {
      toast({ variant: 'destructive', title: 'Failed to save snapshot', description: error.message });
    } else {
      toast({ title: 'Snapshot Saved', description: \`Version "\${versionName}" has been saved.\` });
      fetchSnapshots();
    }
    setIsSaving(false);
  };

  const handleLoadSnapshot = async (id) => {
    if (!id || id === 'latest') {
        setOverviewContent(defaultOverviewContent);
        toast({ title: 'Loaded Latest Version', description: 'Displaying the current project overview.' });
        return;
    };
    
    const { data, error } = await supabase
      .from('developer_portal_snapshots')
      .select('snapshot_content')
      .eq('id', id)
      .single();

    if (error) {
      toast({ variant: 'destructive', title: 'Failed to load snapshot', description: error.message });
    } else {
      setOverviewContent(data.snapshot_content);
      toast({ title: 'Snapshot Loaded', description: \`Version data has been loaded into the overview.\` });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 to-black p-4">
        <Helmet><title>Developer Portal Login</title></Helmet>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
          <Card className="w-[380px] ios-card">
            <CardHeader className="text-center">
              <div className="mx-auto bg-slate-700/50 p-3 rounded-full w-fit mb-4">
                <Key className="w-8 h-8 text-sky-400" />
              </div>
              <CardTitle className="text-2xl text-white">Developer Portal Access</CardTitle>
              <CardDescription className="text-slate-400">Enter credentials to continue</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-slate-300" htmlFor="username">Username</Label>
                  <Input id="username" type="email" placeholder="mg@gs-3.com" value={username} onChange={(e) => setUsername(e.target.value)} required className="bg-slate-700/50 border-slate-600 text-white" />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300" htmlFor="password">Password</Label>
                  <Input id="password" type="password" placeholder="••••••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required className="bg-slate-700/50 border-slate-600 text-white" />
                </div>
                <Button type="submit" disabled={isLoadingLogin} className="w-full bg-sky-600 hover:bg-sky-700 text-white">
                  {isLoadingLogin ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <LogIn className="w-4 h-4 mr-2" />}
                  Sign In
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <Helmet><title>Developer Portal | GS-3 SecureOps</title></Helmet>
      <div className="text-white p-4 sm:p-6 lg:p-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-white flex items-center"><Terminal className="w-8 h-8 mr-3 text-sky-400" />Developer Portal</h1>
        </motion.div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md bg-slate-800/80 border border-slate-700">
            <TabsTrigger value="overview" className="data-[state=active]:bg-slate-700 data-[state=active]:text-white text-slate-300"><Eye className="w-4 h-4 mr-2" />Overview</TabsTrigger>
            <TabsTrigger value="code" className="data-[state=active]:bg-slate-700 data-[state=active]:text-white text-slate-300"><Code className="w-4 h-4 mr-2" />Code Artifacts</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-4">
            <Card className="ios-card">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <CardTitle className="text-2xl text-white">{overviewContent.title}</CardTitle>
                    <CardDescription className="text-slate-400">Version: {overviewContent.version} | Last Updated: {overviewContent.lastUpdated}</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2 mt-4 sm:mt-0">
                    <Select onValueChange={handleLoadSnapshot} disabled={isLoadingSnapshots}>
                      <SelectTrigger className="w-[240px] glass-button">
                        <History className="w-4 h-4 mr-2" />
                        <SelectValue placeholder="Load Version Snapshot..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="latest">Latest Version (Default)</SelectItem>
                        {versionSnapshots.map(v => (
                          <SelectItem key={v.id} value={v.id}>{new Date(v.created_at).toLocaleString()} - {v.version_name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button onClick={handleSaveSnapshot} disabled={isSaving} className="bg-sky-600 hover:bg-sky-700">
                       {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                      {isSaving ? 'Saving...' : 'Save Snapshot'}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6 pt-4">
                <p className="text-slate-300">{overviewContent.description}</p>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Key Features</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {overviewContent.keyFeatures.map(feature => {
                      const Icon = iconMap[feature.icon] || Eye;
                      return (
                        <div key={feature.title} className="p-4 bg-slate-800/60 rounded-lg border border-slate-700 hover-lift">
                          <div className="flex items-center mb-2">
                             <Icon className="w-5 h-5 mr-3 text-sky-400" />
                            <h4 className="font-semibold text-white">{feature.title}</h4>
                          </div>
                          <p className="text-sm text-slate-400">{feature.description}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Technology Stack</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {overviewContent.techStack.map(tech => (
                      <div key={tech.name} className="p-4 bg-slate-800/60 rounded-lg border border-slate-700">
                        <h4 className="font-semibold text-white">{tech.name} <span className="text-xs text-slate-400 font-normal ml-1">{tech.version}</span></h4>
                        <p className="text-sm text-slate-400">{tech.type}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="code" className="mt-4">
            <Card className="ios-card">
              <div className="grid grid-cols-1 md:grid-cols-12 h-[calc(100vh-220px)] min-h-[600px]">
                <div className="md:col-span-3 lg:col-span-3 border-r border-slate-700 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-800/50">
                  <FileTree onFileSelect={setSelectedFile} />
                </div>
                <div className="md:col-span-9 lg:col-span-9 overflow-hidden">
                  <CodeViewer file={selectedFile} />
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default DeveloperPage;
`)
};

const reportsFolder = {
    name: "reports",
    type: "folder",
    children: [
        { name: "ObservationList.jsx", type: "file", content: `// Content not available` },
        { name: "ReportList.jsx", type: "file", content: `// Content not available` },
        { name: "TemplateList.jsx", type: "file", content: `// Content not available` },
        { name: "ViolationList.jsx", type: "file", content: `// Content not available` },
    ]
};

export const pagesFolder = {
    name: "pages",
    type: "folder",
    children: [
        { name: "AdminSettings.jsx", type: "file", content: `// Content available in codebase` },
        { name: "Analytics.jsx", type: "file", content: `// Content available in codebase` },
        { name: "Assessments.jsx", type: "file", content: `// Content available in codebase` },
        { name: "Dashboard.jsx", type: "file", content: `// Content available in codebase` },
        DeveloperPage_jsx,
        { name: "Employees.jsx", type: "file", content: `// Content available in codebase` },
        { name: "ExternalApp.jsx", type: "file", content: `// Content available in codebase` },
        { name: "HealthSafety.jsx", type: "file", content: `// Content available in codebase` },
        { name: "ISO.jsx", type: "file", content: `// Content available in codebase` },
        { name: "LiveClasses.jsx", type: "file", content: `// Content available in codebase` },
        { name: "Messaging.jsx", type: "file", content: `// Content available in codebase` },
        { name: "NFCManagement.jsx", type: "file", content: `// Content available in codebase` },
        { name: "Reports.jsx", type: "file", content: `// Content available in codebase` },
        { name: "Scheduling.jsx", type: "file", content: `// Content available in codebase` },
        { name: "Sites.jsx", type: "file", content: `// Content available in codebase` },
        { name: "Subcontractors.jsx", type: "file", content: `// Content available in codebase` },
        { name: "Training.jsx", type: "file", content: `// Content available in codebase` },
        reportsFolder
    ]
};