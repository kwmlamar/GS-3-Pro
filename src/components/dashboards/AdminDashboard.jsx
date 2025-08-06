import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Shield, Users, MapPin, AlertTriangle, CheckCircle, Clock, TrendingUp, Activity, 
  FileText, CalendarDays, Settings, BarChart3, Network, Code, LockKeyhole, Database,
  Server, Cpu, HardDrive, Wifi, Globe, Zap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { getRoleStats, getRoleActivities } from '@/lib/roleService';

const AdminDashboard = ({ userRole, userName }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [stats, setStats] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [systemStatus, setSystemStatus] = useState({
    core: 'operational',
    database: 'secure',
    nfc: 'online',
    training: 'maintenance',
    analytics: 'active',
    security: 'enabled'
  });

  useEffect(() => {
    const fetchAdminData = async () => {
      setLoading(true);
      
      try {
        // Fetch role-specific stats and activities
        const [statsData, activitiesData] = await Promise.all([
          getRoleStats(userRole),
          getRoleActivities(userRole)
        ]);

        if (statsData.data) {
          setStats(statsData.data);
        }

        if (activitiesData.data) {
          setRecentActivities(activitiesData.data);
        }

        // Simulate system status updates
        setSystemStatus({
          core: 'operational',
          database: 'secure',
          nfc: 'online',
          training: 'maintenance',
          analytics: 'active',
          security: 'enabled'
        });

      } catch (error) {
        toast({ 
          variant: "destructive", 
          title: "Dashboard Error", 
          description: "Failed to load admin dashboard data." 
        });
      } finally {
        setLoading(false);
      }
    };

    if (userRole) {
      fetchAdminData();
    }
  }, [userRole, toast]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const adminQuickActions = [
    { label: "System Settings", icon: Settings, path: "/admin-settings", color: "bg-blue-600" },
    { label: "User Management", icon: Users, path: "/login-management", color: "bg-green-600" },
    { label: "Developer Portal", icon: Code, path: "/developer", color: "bg-purple-600" },
    { label: "Analytics", icon: BarChart3, path: "/analytics", color: "bg-orange-600" },
    { label: "Security Audit", icon: Shield, path: "/admin-settings", color: "bg-red-600" },
    { label: "Database Admin", icon: Database, path: "/developer", color: "bg-indigo-600" }
  ];

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-150px)] flex flex-col items-center justify-center text-white p-4">
        <div className="w-24 h-24 mb-4 animate-pulse bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
          <Shield className="w-12 h-12 text-white" />
        </div>
        <p className="text-slate-300">Loading Administrative Dashboard...</p>
        <div className="mt-6 w-12 h-12 border-4 border-dashed rounded-full animate-spin border-blue-400"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-white">{getGreeting()}, {userName}!</h1>
        <p className="text-gray-400 mt-1">Administrative Dashboard - Complete system oversight and management</p>
      </motion.div>

      {/* Admin Stats Grid */}
      {stats.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          {stats.map((stat, index) => (
            <motion.div key={stat.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
              <Card className="ios-card hover-lift">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400 mb-1">{stat.title || stat.id}</p>
                      <p className="text-2xl font-bold text-white">{stat.value}</p>
                      {stat.change && <p className="text-xs text-green-400 flex items-center mt-1">
                        <TrendingUp className="w-3 h-3 mr-1" />{stat.change}
                      </p>}
                    </div>
                    <div className="p-2.5 rounded-lg bg-gradient-to-br from-slate-700/50 to-slate-800/50">
                      {stat.id === 'sites' && <MapPin className="w-5 h-5 text-blue-400" />}
                      {stat.id === 'regions' && <Network className="w-5 h-5 text-purple-400" />}
                      {stat.id === 'officers' && <Users className="w-5 h-5 text-green-400" />}
                      {stat.id === 'alerts' && <AlertTriangle className="w-5 h-5 text-yellow-400" />}
                      {stat.id === 'compliance' && <CheckCircle className="w-5 h-5 text-emerald-400" />}
                      {stat.id === 'security' && <Shield className="w-5 h-5 text-red-400" />}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Admin Quick Actions */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <h2 className="text-xl font-semibold text-white mb-3">Administrative Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {adminQuickActions.map(action => (
            <Button 
              key={action.label} 
              variant="outline" 
              className={`glass-button justify-start text-left h-auto py-2.5 px-3 hover-lift ${action.color} hover:${action.color}`}
              onClick={() => navigate(action.path)}
            >
              <action.icon className="w-4 h-4 mr-2 text-white flex-shrink-0" />
              <span className="text-xs text-white">{action.label}</span>
            </Button>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <motion.div className="lg:col-span-2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
          <Card className="ios-card h-full">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white">
                <Activity className="w-5 h-5 text-blue-400" />
                <span>System Activities</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentActivities.length > 0 ? (
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2 scrollbar-hide">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg bg-slate-800/40 hover:bg-slate-700/60 transition-colors">
                      <div className={`w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 ${
                        activity.status === 'critical' ? 'bg-red-500 animate-ping' : 
                        activity.status === 'success' ? 'bg-green-500' : 
                        activity.status === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                      }`} />
                      <div className="flex-1">
                        <p className="text-white text-sm">{activity.message}</p>
                        <p className="text-gray-400 text-xs mt-0.5 flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {activity.time} - <span className="ml-1 capitalize">{activity.type.replace(/_/g, ' ')}</span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-center py-8">No recent activities to display.</p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* System Status */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
          <Card className="ios-card h-full">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white">
                <Server className="w-5 h-5 text-green-400" />
                <span>System Status</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(systemStatus).map(([system, status]) => (
                  <div key={system} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-800/40">
                    <div className="flex items-center space-x-2">
                      {system === 'core' && <Cpu className="w-4 h-4 text-blue-400" />}
                      {system === 'database' && <Database className="w-4 h-4 text-green-400" />}
                      {system === 'nfc' && <Wifi className="w-4 h-4 text-purple-400" />}
                      {system === 'training' && <Globe className="w-4 h-4 text-yellow-400" />}
                      {system === 'analytics' && <BarChart3 className="w-4 h-4 text-orange-400" />}
                      {system === 'security' && <Shield className="w-4 h-4 text-red-400" />}
                      <span className="text-white text-sm capitalize">{system}</span>
                    </div>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      status === 'operational' || status === 'secure' || status === 'online' || status === 'active' || status === 'enabled'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {status}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Security Alerts Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <Card className="ios-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
              <span>Security Alerts & Monitoring</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                <div className="flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-red-400" />
                  <span className="text-white font-medium">Active Threats</span>
                </div>
                <p className="text-2xl font-bold text-red-400 mt-2">0</p>
                <p className="text-gray-400 text-sm">No active threats detected</p>
              </div>
              
              <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                <div className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-yellow-400" />
                  <span className="text-white font-medium">Security Score</span>
                </div>
                <p className="text-2xl font-bold text-yellow-400 mt-2">98%</p>
                <p className="text-gray-400 text-sm">Excellent security posture</p>
              </div>
              
              <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                <div className="flex items-center space-x-2">
                  <LockKeyhole className="w-5 h-5 text-green-400" />
                  <span className="text-white font-medium">Access Logs</span>
                </div>
                <p className="text-2xl font-bold text-green-400 mt-2">1,247</p>
                <p className="text-gray-400 text-sm">Today's access attempts</p>
              </div>
              
              <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <div className="flex items-center space-x-2">
                  <HardDrive className="w-5 h-5 text-blue-400" />
                  <span className="text-white font-medium">System Health</span>
                </div>
                <p className="text-2xl font-bold text-blue-400 mt-2">100%</p>
                <p className="text-gray-400 text-sm">All systems operational</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AdminDashboard; 