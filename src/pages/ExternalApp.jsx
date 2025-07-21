import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { 
  ExternalLink, 
  Plus, 
  Settings,
  Globe,
  Smartphone,
  Monitor,
  Zap,
  Link2,
  CheckCircle,
  PowerOff,
  Users,
  AlertTriangle
} from 'lucide-react';

const ExternalApp = () => {
  const [appUrl, setAppUrl] = useState('');
  const [connectedAppFrameUrl, setConnectedAppFrameUrl] = useState('');
  const { toast } = useToast();

  const connectedApps = [
    {
      id: 1,
      name: 'Visitor Management System',
      type: 'Web Application',
      url: 'https://visitor.example.com',
      status: 'Connected',
      lastSync: '2 minutes ago',
      icon: Users
    },
    {
      id: 2,
      name: 'Asset Tracking Mobile App',
      type: 'Mobile Application',
      url: 'https://assets.example.com',
      status: 'Connected',
      lastSync: '15 minutes ago',
      icon: Smartphone
    },
    {
      id: 3,
      name: 'Emergency Response Portal',
      type: 'Web Portal',
      url: 'https://emergency.example.com',
      status: 'Disconnected',
      lastSync: '2 hours ago',
      icon: AlertTriangle
    }
  ];

  const integrationOptions = [
    {
      title: 'Web Application',
      description: 'Embed external web apps via iframe for seamless integration.',
      icon: Globe,
      features: ['Full screen embedding', 'Responsive design support', 'Cross-domain communication (if configured)']
    },
    {
      title: 'API Integration',
      description: 'Connect mobile or backend services via secure API endpoints.',
      icon: Zap,
      features: ['REST/GraphQL support', 'Real-time data sync', 'OAuth 2.0 authentication']
    },
    {
      title: 'Desktop Connector',
      description: 'Bridge desktop apps with web services for data exchange.',
      icon: Monitor,
      features: ['Local network access', 'Secure data tunneling', 'Scheduled sync tasks']
    }
  ];

  const handleConnectApp = () => {
    if (!appUrl.trim()) {
      toast({
        variant: "destructive",
        title: "URL Required",
        description: "Please enter the URL of the external application."
      });
      return;
    }
    // Basic URL validation (can be more robust)
    if (!appUrl.startsWith('http://') && !appUrl.startsWith('https://')) {
        toast({
            variant: "destructive",
            title: "Invalid URL",
            description: "Please enter a valid URL starting with http:// or https://."
        });
        return;
    }

    setConnectedAppFrameUrl(appUrl);
    toast({
      title: "Application Preview Loaded",
      description: `Previewing ${appUrl}. Note: Full integration may require further configuration.`
    });
  };

  const handleDisconnectApp = (appId) => {
    toast({
      title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀"
    });
  };

  const handleConfigureApp = (appId) => {
    toast({
      title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀"
    });
  };

  return (
    <div className="space-y-8 pb-10">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center">
            <Link2 className="w-8 h-8 mr-3 text-blue-400" />
            External App Integrations
          </h1>
          <p className="text-gray-400 mt-1">Connect and manage third-party applications within SecureOps Pro.</p>
        </div>
        <Button onClick={() => toast({ title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀" })} className="ios-button bg-blue-600 hover:bg-blue-700 mt-4 sm:mt-0">
          <Plus className="w-4 h-4 mr-2" />
          Add New Integration
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="ios-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <Zap className="w-5 h-5 text-blue-400" />
              <span>Quick Connect Web App</span>
            </CardTitle>
            <CardDescription className="text-gray-400">Enter a URL to preview and embed a web application.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
              <Input
                placeholder="Enter external application URL (e.g., https://example.com)"
                value={appUrl}
                onChange={(e) => setAppUrl(e.target.value)}
                className="flex-1 bg-slate-700/50 border-slate-600 text-gray-200 focus:ring-blue-500 focus:border-blue-500"
              />
              <Button onClick={handleConnectApp} className="ios-button bg-green-600 hover:bg-green-700">
                <Link2 className="w-4 h-4 mr-2" />
                Preview & Connect
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {connectedAppFrameUrl && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ delay: 0.2 }}
        >
          <Card className="ios-card">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-white">
                <div className="flex items-center space-x-2">
                  <Monitor className="w-5 h-5 text-yellow-400" />
                  <span>Integrated Application Preview</span>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setConnectedAppFrameUrl('')} className="text-red-400 hover:text-red-300">
                  <PowerOff className="w-4 h-4 mr-1" /> Close Preview
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <iframe
                src={connectedAppFrameUrl}
                title="External Application Preview"
                className="w-full h-[500px] rounded-lg border border-slate-700 bg-white"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              ></iframe>
               <p className="text-xs text-slate-500 mt-2">Note: Some applications may not allow embedding due to security policies (X-Frame-Options).</p>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: connectedAppFrameUrl ? 0.3 : 0.2 }}
      >
        <Card className="ios-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <Settings className="w-5 h-5 text-purple-400" />
              <span>Integration Methods</span>
            </CardTitle>
            <CardDescription className="text-gray-400">Explore different ways to integrate external services.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {integrationOptions.map((option, index) => (
                <motion.div
                  key={option.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: (connectedAppFrameUrl ? 0.4 : 0.3) + index * 0.1 }}
                  className="p-6 rounded-lg bg-slate-800/40 border border-slate-700 hover:bg-slate-700/60 transition-colors flex flex-col h-full"
                >
                  <option.icon className="w-10 h-10 text-blue-400 mb-3" />
                  <h3 className="text-white font-semibold text-lg mb-2">{option.title}</h3>
                  <p className="text-gray-400 text-sm mb-3 flex-grow">{option.description}</p>
                  <div className="space-y-1.5 mt-auto">
                    {option.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center space-x-1.5 text-xs text-gray-300">
                        <CheckCircle className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: connectedAppFrameUrl ? 0.5 : 0.4 }}
      >
        <Card className="ios-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <ExternalLink className="w-5 h-5 text-green-400" />
              <span>Currently Connected Applications</span>
            </CardTitle>
            <CardDescription className="text-gray-400">Manage your existing integrations.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {connectedApps.map((app) => (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-lg bg-slate-800/40 border border-slate-700 hover:bg-slate-700/60 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                    <div className="flex-1 mb-3 sm:mb-0">
                      <div className="flex items-center space-x-3 mb-1.5">
                        <app.icon className={`w-5 h-5 ${app.status === 'Connected' ? 'text-green-400' : 'text-red-400'}`} />
                        <h3 className="text-white font-semibold">{app.name}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          app.status === 'Connected' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                        }`}>
                          {app.status}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-400">
                        <span className="truncate max-w-[200px] sm:max-w-xs" title={app.url}>{app.url}</span>
                        <span>•</span>
                        <span>Last sync: {app.lastSync}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 mt-2 sm:mt-0">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleConfigureApp(app.id)}
                        className="ios-button border-slate-600 hover:bg-slate-700"
                      >
                        <Settings className="w-3.5 h-3.5 mr-1 sm:mr-0" /> <span className="hidden sm:inline ml-1">Config</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => window.open(app.url, '_blank')}
                        className="ios-button border-slate-600 hover:bg-slate-700"
                      >
                        <ExternalLink className="w-3.5 h-3.5 mr-1 sm:mr-0" /> <span className="hidden sm:inline ml-1">Open</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDisconnectApp(app.id)}
                        className="ios-button border-red-500/50 text-red-400 hover:bg-red-500/20"
                      >
                        <PowerOff className="w-3.5 h-3.5 mr-1 sm:mr-0" /> <span className="hidden sm:inline ml-1">Off</span>
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ExternalApp;