import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Network, Users, CheckCircle, Clock, TrendingUp, Activity, 
  FileText, BarChart3, DollarSign, Award, Target, Crown,
  Globe, BarChart, PieChart, TrendingDown, ArrowUpRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { getRoleStats, getRoleActivities } from '@/lib/roleService';

const ExecutiveDashboard = ({ userRole, userName }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [stats, setStats] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [strategicMetrics, setStrategicMetrics] = useState({
    revenue: '$2.4M',
    growth: '+12%',
    marketShare: '23%',
    clientSatisfaction: 4.8,
    operationalEfficiency: 94,
    strategicGoals: 87
  });

  useEffect(() => {
    const fetchExecutiveData = async () => {
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
          description: "Failed to load executive dashboard data." 
        });
      } finally {
        setLoading(false);
      }
    };

    if (userRole) {
      fetchExecutiveData();
    }
  }, [userRole, toast]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const executiveQuickActions = [
    { label: "Strategic Reports", icon: FileText, path: "/reports", color: "bg-blue-600" },
    { label: "Analytics", icon: BarChart3, path: "/analytics", color: "bg-green-600" },
    { label: "Hierarchy View", icon: Network, path: "/sites", color: "bg-purple-600" },
    { label: "Performance", icon: Activity, path: "/performance", color: "bg-orange-600" },
    { label: "Market Analysis", icon: BarChart, path: "/analytics", color: "bg-indigo-600" },
    { label: "Strategic Planning", icon: Target, path: "/reports", color: "bg-pink-600" }
  ];

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-150px)] flex flex-col items-center justify-center text-white p-4">
        <div className="w-24 h-24 mb-4 animate-pulse bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
          <Crown className="w-12 h-12 text-white" />
        </div>
        <p className="text-slate-300">Loading Executive Dashboard...</p>
        <div className="mt-6 w-12 h-12 border-4 border-dashed rounded-full animate-spin border-purple-400"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-white">{getGreeting()}, {userName}!</h1>
        <p className="text-gray-400 mt-1">Executive Dashboard - Strategic overview and high-level metrics</p>
      </motion.div>

      {/* Executive Stats Grid */}
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
                      {stat.id === 'regions' && <Network className="w-5 h-5 text-purple-400" />}
                      {stat.id === 'officers' && <Users className="w-5 h-5 text-green-400" />}
                      {stat.id === 'compliance' && <CheckCircle className="w-5 h-5 text-emerald-400" />}
                      {stat.id === 'revenue' && <DollarSign className="w-5 h-5 text-green-400" />}
                      {stat.id === 'growth' && <TrendingUp className="w-5 h-5 text-blue-400" />}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Executive Quick Actions */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <h2 className="text-xl font-semibold text-white mb-3">Strategic Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {executiveQuickActions.map(action => (
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
                <span>Strategic Updates</span>
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
                <p className="text-gray-400 text-center py-8">No recent strategic updates to display.</p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Strategic Metrics */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
          <Card className="ios-card h-full">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white">
                <BarChart className="w-5 h-5 text-green-400" />
                <span>Strategic Metrics</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-3 rounded-lg bg-slate-800/40">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white text-sm">Revenue</span>
                    <span className="text-green-400 font-medium">{strategicMetrics.revenue}</span>
                  </div>
                  <div className="flex items-center text-xs text-green-400">
                    <ArrowUpRight className="w-3 h-3 mr-1" />
                    +12% from last quarter
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-800/40">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white text-sm">Growth Rate</span>
                    <span className="text-blue-400 font-medium">{strategicMetrics.growth}</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div className="bg-blue-400 h-2 rounded-full" style={{ width: '12%' }}></div>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-800/40">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white text-sm">Market Share</span>
                    <span className="text-purple-400 font-medium">{strategicMetrics.marketShare}</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div className="bg-purple-400 h-2 rounded-full" style={{ width: '23%' }}></div>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-800/40">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white text-sm">Client Satisfaction</span>
                    <span className="text-yellow-400 font-medium">{strategicMetrics.clientSatisfaction}/5</span>
                  </div>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Award 
                        key={star} 
                        className={`w-3 h-3 ${star <= strategicMetrics.clientSatisfaction ? 'text-yellow-400 fill-current' : 'text-gray-400'}`} 
                      />
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Strategic Performance Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <Card className="ios-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <Target className="w-5 h-5 text-green-400" />
              <span>Strategic Performance Overview</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-5 h-5 text-green-400" />
                  <span className="text-white font-medium">Revenue Growth</span>
                </div>
                <p className="text-2xl font-bold text-green-400 mt-2">+12%</p>
                <p className="text-gray-400 text-sm">Year over year</p>
              </div>
              
              <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <div className="flex items-center space-x-2">
                  <Globe className="w-5 h-5 text-blue-400" />
                  <span className="text-white font-medium">Market Expansion</span>
                </div>
                <p className="text-2xl font-bold text-blue-400 mt-2">+3</p>
                <p className="text-gray-400 text-sm">New regions</p>
              </div>
              
              <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                <div className="flex items-center space-x-2">
                  <PieChart className="w-5 h-5 text-yellow-400" />
                  <span className="text-white font-medium">Efficiency</span>
                </div>
                <p className="text-2xl font-bold text-yellow-400 mt-2">{strategicMetrics.operationalEfficiency}%</p>
                <p className="text-gray-400 text-sm">Operational excellence</p>
              </div>
              
              <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
                <div className="flex items-center space-x-2">
                  <Target className="w-5 h-5 text-purple-400" />
                  <span className="text-white font-medium">Strategic Goals</span>
                </div>
                <p className="text-2xl font-bold text-purple-400 mt-2">{strategicMetrics.strategicGoals}%</p>
                <p className="text-gray-400 text-sm">On track</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Executive Summary */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
        <Card className="ios-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <Crown className="w-5 h-5 text-yellow-400" />
              <span>Executive Summary</span>
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
                    <p className="text-white font-medium">Strategic Reports</p>
                    <p className="text-gray-400 text-xs">View comprehensive reports</p>
                  </div>
                </div>
              </Button>

              <Button 
                variant="outline" 
                className="glass-button h-auto py-4 px-4 text-left hover-lift"
                onClick={() => navigate('/analytics')}
              >
                <div className="flex items-center space-x-3">
                  <BarChart3 className="w-6 h-6 text-green-400" />
                  <div>
                    <p className="text-white font-medium">Analytics Dashboard</p>
                    <p className="text-gray-400 text-xs">Deep dive into metrics</p>
                  </div>
                </div>
              </Button>

              <Button 
                variant="outline" 
                className="glass-button h-auto py-4 px-4 text-left hover-lift"
                onClick={() => navigate('/sites')}
              >
                <div className="flex items-center space-x-3">
                  <Network className="w-6 h-6 text-purple-400" />
                  <div>
                    <p className="text-white font-medium">Organizational View</p>
                    <p className="text-gray-400 text-xs">Hierarchy and structure</p>
                  </div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ExecutiveDashboard; 