import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { 
  TrendingUp, 
  BarChart3, 
  PieChart,
  Activity,
  Brain,
  FileText,
  Download,
  Zap,
  Filter,
  CalendarRange,
  Users, 
  MapPin, 
  GraduationCap
} from 'lucide-react';

const Analytics = () => {
  const [query, setQuery] = useState('');
  const { toast } = useToast();

  const metrics = [
    { title: 'Incident Response Time', value: '4.2 min', change: '-12%', trend: 'down', color: 'green', icon: Activity },
    { title: 'Officer Efficiency', value: '94.8%', change: '+3.2%', trend: 'up', color: 'blue', icon: Users },
    { title: 'Site Coverage', value: '98.1%', change: '+1.5%', trend: 'up', color: 'purple', icon: MapPin },
    { title: 'Training Compliance', value: '96.3%', change: '+2.1%', trend: 'up', color: 'yellow', icon: GraduationCap }
  ];

  const aiInsights = [
    {
      type: 'Performance',
      title: 'Peak Incident Hours Identified',
      description: 'Analysis shows 67% of security incidents occur between 10 PM - 2 AM. Recommend increasing patrol frequency during these hours.',
      priority: 'High',
      action: 'Adjust Scheduling'
    },
    {
      type: 'Efficiency',
      title: 'Officer Rotation Optimization',
      description: 'Current rotation patterns show 15% efficiency loss. AI suggests new rotation schedule to improve coverage by 23%.',
      priority: 'Medium',
      action: 'Review Schedule'
    },
    {
      type: 'Training',
      title: 'Skills Gap Analysis',
      description: 'Emergency response training completion correlates with 34% faster incident resolution. Prioritize training for 12 officers.',
      priority: 'Medium',
      action: 'Schedule Training'
    }
  ];

  const handleAIQuery = () => {
    if (!query.trim()) {
      toast({
        title: "Please enter a query",
        description: "Ask the AI about your security operations data"
      });
      return;
    }
    
    toast({
      title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀"
    });
  };

  const handleGenerateReport = () => {
    toast({
      title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀"
    });
  };

  const handleExportData = () => {
    toast({
      title: "🚧 Data Export Not Implemented",
      description: "This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀"
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
            <BarChart3 className="w-8 h-8 mr-3 text-blue-400" />
            AI-Assisted Analytics
          </h1>
          <p className="text-gray-400 mt-1">Unlock actionable insights from your operational data.</p>
        </div>
        <div className="flex space-x-3 mt-4 sm:mt-0">
          <Button onClick={handleGenerateReport} className="ios-button bg-purple-600 hover:bg-purple-700">
            <FileText className="w-4 h-4 mr-2" />
            Generate Report
          </Button>
          <Button onClick={handleExportData} variant="outline" className="ios-button border-slate-600 hover:bg-slate-700">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
        </div>
      </motion.div>

      <div className="flex items-center space-x-4">
        <Button variant="outline" className="glass-button">
          <CalendarRange className="w-4 h-4 mr-2" /> Date Range
        </Button>
        <Button variant="outline" className="glass-button">
          <Filter className="w-4 h-4 mr-2" /> Filters
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="ios-card hover-lift">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">{metric.title}</p>
                    <p className="text-2xl font-bold text-white">{metric.value}</p>
                    <p className={`text-xs flex items-center mt-1 ${
                      metric.trend === 'up' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      <TrendingUp className={`w-3 h-3 mr-1 ${metric.trend === 'down' ? 'transform rotate-180' : ''}`} />
                      {metric.change}
                    </p>
                  </div>
                  <div className={`p-2.5 rounded-lg bg-gradient-to-br from-${metric.color}-500/20 to-${metric.color}-600/30`}>
                    <metric.icon className={`w-5 h-5 text-${metric.color}-400`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="ios-card h-full">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white">
                <Brain className="w-5 h-5 text-purple-400" />
                <span>AI Analytics Assistant</span>
              </CardTitle>
              <CardDescription className="text-gray-400">Ask natural language questions about your data.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    placeholder="E.g., 'Show incident trends for Site Alpha last month'"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="flex-1 bg-slate-700/50 border-slate-600 text-gray-200 focus:ring-blue-500 focus:border-blue-500"
                    onKeyPress={(e) => e.key === 'Enter' && handleAIQuery()}
                  />
                  <Button onClick={handleAIQuery} className="ios-button bg-purple-600 hover:bg-purple-700">
                    <Zap className="w-4 h-4 mr-1" />
                    Query AI
                  </Button>
                </div>
                
                <div className="space-y-2 pt-2">
                  <h4 className="text-white font-medium text-sm">Suggested Queries:</h4>
                  {[
                    'Incident trends last 30 days?',
                    'Highest risk sites?',
                    'Officer performance by region?',
                    'Predict staffing needs next month.'
                  ].map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => setQuery(suggestion)}
                      className="block w-full text-left p-2.5 rounded-lg bg-slate-800/40 hover:bg-slate-700/60 transition-colors text-gray-300 text-sm"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="ios-card h-full">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white">
                <BarChart3 className="w-5 h-5 text-blue-400" />
                <span>Performance Overview</span>
              </CardTitle>
              <CardDescription className="text-gray-400">Key operational charts and visualizations.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="h-64 bg-gradient-to-br from-blue-600/20 to-purple-700/20 rounded-lg border border-slate-700 flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="w-16 h-16 text-blue-400 mx-auto mb-4 opacity-70" />
                    <p className="text-white font-medium">Interactive Charts Area</p>
                    <p className="text-gray-400 text-sm">Real-time performance visualization (Coming Soon)</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="ios-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <Brain className="w-5 h-5 text-green-400" />
              <span>AI-Generated Insights</span>
            </CardTitle>
            <CardDescription className="text-gray-400">Actionable recommendations based on data analysis.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {aiInsights.map((insight, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="p-4 rounded-lg bg-slate-800/40 border border-slate-700 hover:bg-slate-700/60 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          insight.type === 'Performance' ? 'bg-blue-500/20 text-blue-400' :
                          insight.type === 'Efficiency' ? 'bg-green-500/20 text-green-400' :
                          'bg-purple-500/20 text-purple-400'
                        }`}>
                          {insight.type}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          insight.priority === 'High' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {insight.priority} Priority
                        </span>
                      </div>
                      <h3 className="text-white font-semibold mb-1">{insight.title}</h3>
                      <p className="text-gray-300 text-sm mb-3">{insight.description}</p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => toast({ title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀" })}
                      className="ios-button border-slate-600 hover:bg-slate-700 ml-4 mt-1"
                    >
                      {insight.action}
                    </Button>
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

export default Analytics;