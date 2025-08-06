import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Network, Users, CheckCircle, Clock, TrendingUp, Activity, 
  FileText, BarChart3, DollarSign, Award, Target, Crown,
  Globe, BarChart, PieChart, TrendingDown, ArrowUpRight, Building2,
  Briefcase, Star, Zap, Shield, Trophy, Flag, MapPin, Brain,
  CalendarDays, Filter, Search, Eye, BarChart4
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { getRoleStats, getRoleActivities } from '@/lib/roleService';

const VicePresidentDashboard = ({ userRole, userName }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [stats, setStats] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [leadershipMetrics, setLeadershipMetrics] = useState({
    revenue: '$3.2M',
    growth: '+18%',
    marketShare: '28%',
    clientSatisfaction: 4.9,
    operationalEfficiency: 97,
    strategicGoals: 92,
    leadershipScore: 95,
    teamPerformance: 94
  });

  const [selectedView, setSelectedView] = useState('national');
  const [selectedSite, setSelectedSite] = useState('all');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [aiAnalytics, setAiAnalytics] = useState({
    insights: [
      "Revenue growth trend shows 18% increase across all regions",
      "Site performance varies by 12% between top and bottom performers",
      "Compliance rates are highest in Northeast region (99.2%)",
      "AI predicts 22% growth potential in Southwest market",
      "Resource allocation optimization could improve efficiency by 8%"
    ],
    recommendations: [
      "Focus on Southwest expansion for maximum ROI",
      "Implement standardized training across all sites",
      "Consider technology upgrades for bottom-performing sites",
      "Develop regional leadership programs",
      "Optimize scheduling based on AI predictions"
    ]
  });

  useEffect(() => {
    const fetchVPData = async () => {
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
          description: "Failed to load VP dashboard data." 
        });
      } finally {
        setLoading(false);
      }
    };

    if (userRole) {
      fetchVPData();
    }
  }, [userRole, toast]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const vpQuickActions = [
    { label: "Strategic Planning", icon: Target, path: "/reports", color: "bg-blue-600" },
    { label: "Executive Analytics", icon: BarChart3, path: "/analytics", color: "bg-green-600" },
    { label: "Organizational View", icon: Network, path: "/sites", color: "bg-purple-600" },
    { label: "Performance Review", icon: Activity, path: "/performance", color: "bg-orange-600" },
    { label: "Market Analysis", icon: BarChart, path: "/analytics", color: "bg-indigo-600" },
    { label: "Leadership Reports", icon: FileText, path: "/reports", color: "bg-pink-600" }
  ];

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-150px)] flex flex-col items-center justify-center text-white p-4">
        <div className="w-24 h-24 mb-4 animate-pulse bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
          <Building2 className="w-12 h-12 text-white" />
        </div>
        <p className="text-slate-300">Loading Vice President Dashboard...</p>
        <div className="mt-6 w-12 h-12 border-4 border-dashed rounded-full animate-spin border-indigo-400"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-white">{getGreeting()}, {userName}!</h1>
        <p className="text-gray-400 mt-1">Vice President Dashboard - Executive leadership and strategic oversight</p>
      </motion.div>

      {/* View Selection Controls */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="ios-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <Filter className="w-5 h-5 text-blue-400" />
              <span>View Controls</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* View Type Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">View Type</label>
                <div className="flex space-x-2">
                  {[
                    { value: 'national', label: 'National', icon: Globe },
                    { value: 'regional', label: 'Regional', icon: MapPin },
                    { value: 'site', label: 'Site', icon: Building2 }
                  ].map((view) => (
                    <Button
                      key={view.value}
                      variant={selectedView === view.value ? "default" : "outline"}
                      size="sm"
                      className={`flex items-center space-x-2 ${selectedView === view.value ? 'bg-blue-600' : 'glass-button'}`}
                      onClick={() => setSelectedView(view.value)}
                    >
                      <view.icon className="w-4 h-4" />
                      <span>{view.label}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Region Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Region</label>
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Regions</option>
                  <option value="northeast">Northeast</option>
                  <option value="southeast">Southeast</option>
                  <option value="midwest">Midwest</option>
                  <option value="southwest">Southwest</option>
                  <option value="west">West Coast</option>
                </select>
              </div>

              {/* Site Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Site</label>
                <select
                  value={selectedSite}
                  onChange={(e) => setSelectedSite(e.target.value)}
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Sites</option>
                  <option value="hq">Corporate HQ</option>
                  <option value="site1">Site Alpha</option>
                  <option value="site2">Site Beta</option>
                  <option value="site3">Site Gamma</option>
                  <option value="site4">Site Delta</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* VP Stats Grid */}
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
                      {stat.id === 'regions' && <Network className="w-5 h-5 text-purple-400" />}
                      {stat.id === 'officers' && <Users className="w-5 h-5 text-green-400" />}
                      {stat.id === 'compliance' && <CheckCircle className="w-5 h-5 text-emerald-400" />}
                      {stat.id === 'revenue' && <DollarSign className="w-5 h-5 text-green-400" />}
                      {stat.id === 'growth' && <TrendingUp className="w-5 h-5 text-blue-400" />}
                      {stat.id === 'strategic' && <Target className="w-5 h-5 text-orange-400" />}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* VP Quick Actions */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <h2 className="text-xl font-semibold text-white mb-3">Leadership Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {vpQuickActions.map(action => (
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
                <span>Leadership Updates</span>
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
                <p className="text-gray-400 text-center py-8">No recent leadership updates to display.</p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Leadership Metrics */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
          <Card className="ios-card h-full">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white">
                <Trophy className="w-5 h-5 text-yellow-400" />
                <span>Leadership Metrics</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-3 rounded-lg bg-slate-800/40">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white text-sm">Revenue</span>
                    <span className="text-green-400 font-medium">{leadershipMetrics.revenue}</span>
                  </div>
                  <div className="flex items-center text-xs text-green-400">
                    <ArrowUpRight className="w-3 h-3 mr-1" />
                    +18% from last quarter
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-800/40">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white text-sm">Growth Rate</span>
                    <span className="text-blue-400 font-medium">{leadershipMetrics.growth}</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div className="bg-blue-400 h-2 rounded-full" style={{ width: '18%' }}></div>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-800/40">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white text-sm">Leadership Score</span>
                    <span className="text-purple-400 font-medium">{leadershipMetrics.leadershipScore}%</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div className="bg-purple-400 h-2 rounded-full" style={{ width: '95%' }}></div>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-800/40">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white text-sm">Team Performance</span>
                    <span className="text-orange-400 font-medium">{leadershipMetrics.teamPerformance}%</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div className="bg-orange-400 h-2 rounded-full" style={{ width: '94%' }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Leadership Performance Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <Card className="ios-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <Star className="w-5 h-5 text-yellow-400" />
              <span>Leadership Performance Overview</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-5 h-5 text-green-400" />
                  <span className="text-white font-medium">Revenue Growth</span>
                </div>
                <p className="text-2xl font-bold text-green-400 mt-2">+18%</p>
                <p className="text-gray-400 text-sm">Year over year</p>
              </div>
              
              <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <div className="flex items-center space-x-2">
                  <Globe className="w-5 h-5 text-blue-400" />
                  <span className="text-white font-medium">Market Share</span>
                </div>
                <p className="text-2xl font-bold text-blue-400 mt-2">{leadershipMetrics.marketShare}</p>
                <p className="text-gray-400 text-sm">Industry position</p>
              </div>
              
              <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                <div className="flex items-center space-x-2">
                  <PieChart className="w-5 h-5 text-yellow-400" />
                  <span className="text-white font-medium">Efficiency</span>
                </div>
                <p className="text-2xl font-bold text-yellow-400 mt-2">{leadershipMetrics.operationalEfficiency}%</p>
                <p className="text-gray-400 text-sm">Operational excellence</p>
              </div>
              
              <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
                <div className="flex items-center space-x-2">
                  <Target className="w-5 h-5 text-purple-400" />
                  <span className="text-white font-medium">Strategic Goals</span>
                </div>
                <p className="text-2xl font-bold text-purple-400 mt-2">{leadershipMetrics.strategicGoals}%</p>
                <p className="text-gray-400 text-sm">On track</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Executive Leadership Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
        <Card className="ios-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <Crown className="w-5 h-5 text-yellow-400" />
              <span>Executive Leadership Tools</span>
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
                    <p className="text-gray-400 text-xs">Comprehensive leadership reports</p>
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
                    <p className="text-white font-medium">Executive Analytics</p>
                    <p className="text-gray-400 text-xs">Deep strategic insights</p>
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
                    <p className="text-gray-400 text-xs">Leadership hierarchy</p>
                  </div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* AI Analytics Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
        <Card className="ios-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <Brain className="w-5 h-5 text-purple-400" />
              <span>AI Analytics & Insights</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* AI Insights */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                  <Eye className="w-5 h-5 text-blue-400" />
                  <span>AI Insights</span>
                </h3>
                <div className="space-y-3">
                  {aiAnalytics.insights.map((insight, index) => (
                    <div key={index} className="p-3 rounded-lg bg-slate-800/40 border-l-4 border-blue-400">
                      <p className="text-white text-sm">{insight}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Recommendations */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                  <Target className="w-5 h-5 text-green-400" />
                  <span>AI Recommendations</span>
                </h3>
                <div className="space-y-3">
                  {aiAnalytics.recommendations.map((recommendation, index) => (
                    <div key={index} className="p-3 rounded-lg bg-slate-800/40 border-l-4 border-green-400">
                      <p className="text-white text-sm">{recommendation}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Monthly Schedule Report */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
        <Card className="ios-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <CalendarDays className="w-5 h-5 text-orange-400" />
              <span>Monthly Schedule Report</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Report Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <div className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-blue-400" />
                    <span className="text-white font-medium">Total Shifts</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-400 mt-2">1,247</p>
                  <p className="text-gray-400 text-sm">This month</p>
                </div>
                
                <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-white font-medium">Coverage Rate</span>
                  </div>
                  <p className="text-2xl font-bold text-green-400 mt-2">98.5%</p>
                  <p className="text-gray-400 text-sm">Scheduled vs actual</p>
                </div>
                
                <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-purple-400" />
                    <span className="text-white font-medium">Efficiency</span>
                  </div>
                  <p className="text-2xl font-bold text-purple-400 mt-2">94.2%</p>
                  <p className="text-gray-400 text-sm">Resource utilization</p>
                </div>
              </div>

              {/* Schedule Breakdown */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-md font-semibold text-white mb-3">Regional Breakdown</h4>
                  <div className="space-y-2">
                    {[
                      { region: 'Northeast', shifts: 312, coverage: '99.2%' },
                      { region: 'Southeast', shifts: 298, coverage: '97.8%' },
                      { region: 'Midwest', shifts: 285, coverage: '98.5%' },
                      { region: 'Southwest', shifts: 203, coverage: '96.9%' },
                      { region: 'West Coast', shifts: 149, coverage: '98.1%' }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-slate-800/40">
                        <span className="text-white text-sm">{item.region}</span>
                        <div className="flex items-center space-x-4">
                          <span className="text-gray-400 text-sm">{item.shifts} shifts</span>
                          <span className="text-green-400 text-sm font-medium">{item.coverage}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-md font-semibold text-white mb-3">Top Performing Sites</h4>
                  <div className="space-y-2">
                    {[
                      { site: 'Corporate HQ', efficiency: '99.5%', growth: '+12%' },
                      { site: 'Site Alpha', efficiency: '98.8%', growth: '+8%' },
                      { site: 'Site Beta', efficiency: '97.2%', growth: '+15%' },
                      { site: 'Site Gamma', efficiency: '96.5%', growth: '+6%' },
                      { site: 'Site Delta', efficiency: '95.8%', growth: '+9%' }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-slate-800/40">
                        <span className="text-white text-sm">{item.site}</span>
                        <div className="flex items-center space-x-4">
                          <span className="text-blue-400 text-sm font-medium">{item.efficiency}</span>
                          <span className="text-green-400 text-sm">{item.growth}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Key Performance Indicators */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}>
        <Card className="ios-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <Flag className="w-5 h-5 text-red-400" />
              <span>Key Performance Indicators</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <div className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-emerald-400" />
                  <span className="text-white font-medium">Compliance</span>
                </div>
                <p className="text-2xl font-bold text-emerald-400 mt-2">97%</p>
                <p className="text-gray-400 text-sm">Regulatory adherence</p>
              </div>
              
              <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <div className="flex items-center space-x-2">
                  <Briefcase className="w-5 h-5 text-blue-400" />
                  <span className="text-white font-medium">Client Retention</span>
                </div>
                <p className="text-2xl font-bold text-blue-400 mt-2">96%</p>
                <p className="text-gray-400 text-sm">Client satisfaction</p>
              </div>
              
              <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                <div className="flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  <span className="text-white font-medium">Innovation</span>
                </div>
                <p className="text-2xl font-bold text-yellow-400 mt-2">89%</p>
                <p className="text-gray-400 text-sm">New initiatives</p>
              </div>
              
              <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
                <div className="flex items-center space-x-2">
                  <Trophy className="w-5 h-5 text-purple-400" />
                  <span className="text-white font-medium">Excellence</span>
                </div>
                <p className="text-2xl font-bold text-purple-400 mt-2">94%</p>
                <p className="text-gray-400 text-sm">Quality metrics</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default VicePresidentDashboard; 