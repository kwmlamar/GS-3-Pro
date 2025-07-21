import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Users, MapPin, AlertTriangle, CheckCircle, Clock, TrendingUp, Activity, FileText, CalendarDays, Briefcase, Settings as SettingsIcon, BarChart3, Network } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

const Dashboard = ({ userRole }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [stats, setStats] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('User');

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      
      let fetchedStats = [
        { id: 'sites', title: 'Active Facilities', value: '0', icon: MapPin, change: '+0', color: 'text-blue-400', roles: ['admin', 'supervisor', 'operations_manager', 'executive', 'client_poc'] },
        { id: 'regions', title: 'Managed Regions', value: '0', icon: Network, change: '+0', color: 'text-purple-400', roles: ['admin', 'operations_manager', 'executive'] },
        { id: 'officers', title: 'Total Officers', value: '0', icon: Users, change: '+0', color: 'text-green-400', roles: ['admin', 'supervisor', 'operations_manager', 'executive'] },
        { id: 'alerts', title: 'Active Alerts', value: '0', icon: AlertTriangle, change: '0', color: 'text-yellow-400', roles: ['admin', 'supervisor', 'operations_manager', 'executive', 'hybrid_employee'] },
        { id: 'compliance', title: 'Compliance', value: '0%', icon: CheckCircle, change: '+0%', color: 'text-emerald-400', roles: ['admin', 'operations_manager', 'executive', 'consultant'] },
      ];
      
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: userData } = await supabase.from('users').select('full_name').eq('auth_user_id', user.id).single();
          if (userData) setUserName(userData.full_name || 'User');
        }

        const countsPromises = [
          supabase.from('sites').select('*', { count: 'exact', head: true }).eq('type', 'site'),
          supabase.from('sites').select('*', { count: 'exact', head: true }).eq('type', 'region'),
          supabase.from('users').select('*', { count: 'exact', head: true }).neq('role', 'client_poc'),
          supabase.from('notifications').select('*', { count: 'exact', head: true }).eq('read', false).neq('ticker_status', 'green')
        ];
        
        const [siteRes, regionRes, userRes, alertRes] = await Promise.all(countsPromises);
        
        fetchedStats = fetchedStats.map(s => {
          if (s.id === 'sites') return {...s, value: siteRes.count?.toString() ?? '0'};
          if (s.id === 'regions') return {...s, value: regionRes.count?.toString() ?? '0'};
          if (s.id === 'officers') return {...s, value: userRes.count?.toString() ?? '0'};
          if (s.id === 'alerts') return {...s, value: alertRes.count?.toString() ?? '0'};
          if (s.id === 'compliance') return {...s, value: '98%'}; // Placeholder
          return s;
        });

        const filteredStats = fetchedStats.filter(stat => userRole && (stat.roles.includes(userRole)));
        setStats(filteredStats);

        const { data: activityData, error: activityError } = await supabase
          .from('notifications')
          .select('id, message, created_at, type, ticker_status')
          .order('created_at', { ascending: false })
          .limit(5);

        if (activityError) throw activityError;
        
        const formattedActivities = activityData.map(act => ({
          id: act.id,
          message: act.message,
          time: new Date(act.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: act.ticker_status === 'red' ? 'critical' : act.ticker_status === 'yellow' || act.ticker_status === 'orange' ? 'warning' : act.type === 'training_alert' ? 'info' : 'success',
          type: act.type
        }));
        setRecentActivities(formattedActivities);
      } catch (error) {
        toast({ variant: "destructive", title: "Dashboard Error", description: "Failed to load some dashboard data." });
      } finally {
        setLoading(false);
      }
    };

    if (userRole) {
      fetchDashboardData();
    } else {
      setLoading(false);
    }
  }, [userRole, toast]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };
  
  const quickActions = [
    { label: "New Report", icon: FileText, roles: ['admin', 'supervisor', 'operations_manager', 'hybrid_employee'], path: '/reports/list'},
    { label: "View Schedule", icon: CalendarDays, roles: ['admin', 'supervisor', 'operations_manager', 'hybrid_employee'], path: '/scheduling'},
    { label: "Manage Hierarchy", icon: Network, roles: ['admin', 'operations_manager', 'executive'], path: '/sites'},
    { label: "Client Portal", icon: Briefcase, roles: ['client_poc'], path: '/'}, 
  ].filter(action => userRole && (action.roles.includes(userRole)));

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-150px)] flex flex-col items-center justify-center text-white p-4">
        <img  alt="GS-3 SecureOps Pro Logo loading" className="w-24 h-24 mb-4 animate-pulse" src="https://images.unsplash.com/photo-1575821104894-b683ce7525ff" />
        <p className="text-slate-300">Loading Dashboard Data...</p>
        <div className="mt-6 w-12 h-12 border-4 border-dashed rounded-full animate-spin border-blue-400"></div>
      </div>
    );
  }
  
  if (!userRole) {
     return (
      <div className="min-h-[calc(100vh-150px)] flex flex-col items-center justify-center text-white p-4 text-center">
        <img  alt="GS-3 SecureOps Pro Logo" className="w-28 h-28 mb-5" src="https://images.unsplash.com/photo-1590456744140-d196318f23cf" />
        <h1 className="text-3xl font-bold mb-3">Welcome to SecureOps Pro</h1>
        <p className="text-slate-400 mb-6 max-w-md">
          Your advanced security management platform. Please log in to access your personalized dashboard and operational tools.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-white">{getGreeting()}, {userName}!</h1>
        <p className="text-gray-400 mt-1">Here's your operational overview for today.</p>
      </motion.div>

      {stats.length > 0 && (
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${Math.min(stats.length, 5)} gap-6`}>
          {stats.map((stat, index) => (
            <motion.div key={stat.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
              <Card className="ios-card hover-lift">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400 mb-1">{stat.title}</p>
                      <p className="text-2xl font-bold text-white">{stat.value}</p>
                      {stat.change && <p className={`text-xs ${stat.color} flex items-center mt-1`}><TrendingUp className="w-3 h-3 mr-1" />{stat.change}</p>}
                    </div>
                    <div className="p-2.5 rounded-lg bg-gradient-to-br from-slate-700/50 to-slate-800/50"><stat.icon className={`w-5 h-5 ${stat.color}`} /></div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
      
      {quickActions.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <h2 className="text-xl font-semibold text-white mb-3">Quick Actions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {quickActions.map(action => (
              <Button key={action.label} variant="outline" className="glass-button justify-start text-left h-auto py-2.5 px-3 hover-lift" onClick={() => action.path ? navigate(action.path) : toast({title: "🚧 Feature Not Implemented"})}>
                <action.icon className="w-4 h-4 mr-2 text-blue-400 flex-shrink-0" />
                <span className="text-xs text-gray-200">{action.label}</span>
              </Button>
            ))}
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div className="lg:col-span-2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
          <Card className="ios-card h-full">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white"><Activity className="w-5 h-5 text-blue-400" /><span>Recent Activities</span></CardTitle>
            </CardHeader>
            <CardContent>
              {recentActivities.length > 0 ? (
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2 scrollbar-hide">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg bg-slate-800/40 hover:bg-slate-700/60 transition-colors">
                      <div className={`w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 ${activity.status === 'critical' ? 'bg-red-500 animate-ping' : activity.status === 'success' ? 'bg-green-500' : activity.status === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'}`} />
                      <div className="flex-1"><p className="text-white text-sm">{activity.message}</p><p className="text-gray-400 text-xs mt-0.5 flex items-center"><Clock className="w-3 h-3 mr-1" />{activity.time} - <span className="ml-1 capitalize">{activity.type.replace(/_/g, ' ')}</span></p></div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-center py-8">No recent activities to display.</p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
          <Card className="ios-card h-full">
            <CardHeader><CardTitle className="flex items-center space-x-2 text-white"><Shield className="w-5 h-5 text-green-400" /><span>System Status</span></CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: 'Core Systems', status: 'Operational', color: 'green' },
                  { name: 'NFC Network', status: 'Online', color: 'green' },
                  { name: 'Training Platform', status: userRole === 'admin' ? 'Maintenance' : 'Operational', color: userRole === 'admin' ? 'yellow' : 'green' },
                  { name: 'Analytics Engine', status: 'Active', color: 'green' },
                  { name: 'Database Connection', status: 'Secure', color: 'green' },
                ].map(sys => (
                  <div key={sys.name} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-800/40">
                    <span className="text-white text-sm">{sys.name}</span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full bg-${sys.color}-500/20 text-${sys.color}-400`}>{sys.status}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;