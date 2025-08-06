import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  MapPin, Users, CheckCircle, Clock, TrendingUp, Activity, 
  FileText, GraduationCap, BookOpen, MessageSquare, Briefcase, Award,
  BarChart3, Bell, Star, Shield, CalendarDays, AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { getRoleStats, getRoleActivities } from '@/lib/roleService';

const ClientDashboard = ({ userRole, userName }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [stats, setStats] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [serviceMetrics, setServiceMetrics] = useState({
    serviceQuality: 98,
    responseTime: 92,
    satisfaction: 4.8,
    uptime: 99.9,
    incidents: 0,
    trainingCompletion: 100
  });

  useEffect(() => {
    const fetchClientData = async () => {
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

      } catch (error) {
        toast({ 
          variant: "destructive", 
          title: "Dashboard Error", 
          description: "Failed to load client dashboard data." 
        });
      } finally {
        setLoading(false);
      }
    };

    if (userRole) {
      fetchClientData();
    }
  }, [userRole, toast]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const clientQuickActions = [
    { label: "Service Reports", icon: FileText, path: "/reports", color: "bg-blue-600" },
    { label: "Training Portal", icon: GraduationCap, path: "/training", color: "bg-green-600" },
    { label: "Live Classes", icon: BookOpen, path: "/live-classes", color: "bg-purple-600" },
    { label: "Contact Support", icon: MessageSquare, path: "/messaging", color: "bg-orange-600" },
    { label: "Service Requests", icon: Briefcase, path: "/reports", color: "bg-indigo-600" },
    { label: "Feedback", icon: Star, path: "/messaging", color: "bg-pink-600" }
  ];

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-150px)] flex flex-col items-center justify-center text-white p-4">
        <div className="w-24 h-24 mb-4 animate-pulse bg-gradient-to-br from-blue-500 to-green-600 rounded-full flex items-center justify-center">
          <Briefcase className="w-12 h-12 text-white" />
        </div>
        <p className="text-slate-300">Loading Client Portal...</p>
        <div className="mt-6 w-12 h-12 border-4 border-dashed rounded-full animate-spin border-blue-400"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-white">{getGreeting()}, {userName}!</h1>
        <p className="text-gray-400 mt-1">Client Portal Dashboard - Service delivery and support overview</p>
      </motion.div>

      {/* Client Stats Grid */}
      {stats.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
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
                      {stat.id === 'officers' && <Users className="w-5 h-5 text-green-400" />}
                      {stat.id === 'compliance' && <CheckCircle className="w-5 h-5 text-emerald-400" />}
                      {stat.id === 'reports' && <FileText className="w-5 h-5 text-purple-400" />}
                      {stat.id === 'training' && <GraduationCap className="w-5 h-5 text-yellow-400" />}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Client Quick Actions */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <h2 className="text-xl font-semibold text-white mb-3">Client Services</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {clientQuickActions.map(action => (
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
                <span>Service Updates</span>
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
                <p className="text-gray-400 text-center py-8">No recent service updates to display.</p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Service Metrics */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
          <Card className="ios-card h-full">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white">
                <BarChart3 className="w-5 h-5 text-green-400" />
                <span>Service Quality</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-3 rounded-lg bg-slate-800/40">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white text-sm">Service Quality</span>
                    <span className="text-green-400 font-medium">{serviceMetrics.serviceQuality}%</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div className="bg-green-400 h-2 rounded-full" style={{ width: `${serviceMetrics.serviceQuality}%` }}></div>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-800/40">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white text-sm">Response Time</span>
                    <span className="text-blue-400 font-medium">{serviceMetrics.responseTime}%</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div className="bg-blue-400 h-2 rounded-full" style={{ width: `${serviceMetrics.responseTime}%` }}></div>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-800/40">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white text-sm">Satisfaction</span>
                    <span className="text-yellow-400 font-medium">{serviceMetrics.satisfaction}/5</span>
                  </div>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star} 
                        className={`w-4 h-4 ${star <= serviceMetrics.satisfaction ? 'text-yellow-400 fill-current' : 'text-gray-400'}`} 
                      />
                    ))}
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-800/40">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white text-sm">System Uptime</span>
                    <span className="text-emerald-400 font-medium">{serviceMetrics.uptime}%</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div className="bg-emerald-400 h-2 rounded-full" style={{ width: `${serviceMetrics.uptime}%` }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Service Performance Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <Card className="ios-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <Award className="w-5 h-5 text-green-400" />
              <span>Service Performance Overview</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                <div className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-green-400" />
                  <span className="text-white font-medium">Security Incidents</span>
                </div>
                <p className="text-2xl font-bold text-green-400 mt-2">{serviceMetrics.incidents}</p>
                <p className="text-gray-400 text-sm">This month</p>
              </div>
              
              <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <div className="flex items-center space-x-2">
                  <GraduationCap className="w-5 h-5 text-blue-400" />
                  <span className="text-white font-medium">Training Complete</span>
                </div>
                <p className="text-2xl font-bold text-blue-400 mt-2">{serviceMetrics.trainingCompletion}%</p>
                <p className="text-gray-400 text-sm">Required courses</p>
              </div>
              
              <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                <div className="flex items-center space-x-2">
                  <CalendarDays className="w-5 h-5 text-yellow-400" />
                  <span className="text-white font-medium">Service Hours</span>
                </div>
                <p className="text-2xl font-bold text-yellow-400 mt-2">24/7</p>
                <p className="text-gray-400 text-sm">Continuous coverage</p>
              </div>
              
              <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
                <div className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-purple-400" />
                  <span className="text-white font-medium">Client Rating</span>
                </div>
                <p className="text-2xl font-bold text-purple-400 mt-2">4.9/5</p>
                <p className="text-gray-400 text-sm">Overall satisfaction</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Service Requests Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
        <Card className="ios-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <Bell className="w-5 h-5 text-blue-400" />
              <span>Service Requests & Support</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Button 
                variant="outline" 
                className="glass-button h-auto py-4 px-4 text-left hover-lift"
                onClick={() => navigate('/reports')}
              >
                <div className="flex items-center space-x-3">
                  <FileText className="w-6 h-6 text-blue-400" />
                  <div>
                    <p className="text-white font-medium">Service Reports</p>
                    <p className="text-gray-400 text-xs">View detailed service reports</p>
                  </div>
                </div>
              </Button>

              <Button 
                variant="outline" 
                className="glass-button h-auto py-4 px-4 text-left hover-lift"
                onClick={() => navigate('/training')}
              >
                <div className="flex items-center space-x-3">
                  <GraduationCap className="w-6 h-6 text-green-400" />
                  <div>
                    <p className="text-white font-medium">Training Portal</p>
                    <p className="text-gray-400 text-xs">Access training materials</p>
                  </div>
                </div>
              </Button>

              <Button 
                variant="outline" 
                className="glass-button h-auto py-4 px-4 text-left hover-lift"
                onClick={() => navigate('/messaging')}
              >
                <div className="flex items-center space-x-3">
                  <MessageSquare className="w-6 h-6 text-orange-400" />
                  <div>
                    <p className="text-white font-medium">Contact Support</p>
                    <p className="text-gray-400 text-xs">Get help and support</p>
                  </div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Service Alerts */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
        <Card className="ios-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <AlertCircle className="w-5 h-5 text-yellow-400" />
              <span>Service Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <span className="text-white">Security Services</span>
                </div>
                <span className="text-green-400 text-sm font-medium">Operational</span>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <span className="text-white">Training Platform</span>
                </div>
                <span className="text-green-400 text-sm font-medium">Available</span>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <span className="text-white">Support System</span>
                </div>
                <span className="text-green-400 text-sm font-medium">Online</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ClientDashboard; 