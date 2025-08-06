// Role-based service for managing permissions and dashboard configurations
import { supabase } from './supabaseClient';

// Define all available roles
export const ROLES = {
  ADMIN: 'admin',
  VICE_PRESIDENT: 'vice_president',
  EXECUTIVE: 'executive',
  OPERATIONS_MANAGER: 'operations_manager',
  CONSULTANT: 'consultant',
  SUPERVISOR: 'supervisor', 
  HYBRID_EMPLOYEE: 'hybrid_employee',
  CLIENT_POC: 'client_poc'
};

// Role hierarchy (higher roles have access to lower role features)
export const ROLE_HIERARCHY = {
  [ROLES.ADMIN]: 8,
  [ROLES.VICE_PRESIDENT]: 7,
  [ROLES.EXECUTIVE]: 6,
  [ROLES.OPERATIONS_MANAGER]: 5,
  [ROLES.CONSULTANT]: 4,
  [ROLES.SUPERVISOR]: 3,
  [ROLES.HYBRID_EMPLOYEE]: 2,
  [ROLES.CLIENT_POC]: 1
};

// Dashboard configurations for each role
export const ROLE_DASHBOARDS = {
  [ROLES.ADMIN]: {
    title: 'Administrative Dashboard',
    description: 'Complete system oversight and management',
    stats: [
      { id: 'sites', title: 'Active Facilities', icon: 'MapPin', color: 'text-blue-400' },
      { id: 'regions', title: 'Managed Regions', icon: 'Network', color: 'text-purple-400' },
      { id: 'officers', title: 'Total Officers', icon: 'Users', color: 'text-green-400' },
      { id: 'alerts', title: 'Active Alerts', icon: 'AlertTriangle', color: 'text-yellow-400' },
      { id: 'compliance', title: 'System Compliance', icon: 'CheckCircle', color: 'text-emerald-400' },
      { id: 'security', title: 'Security Status', icon: 'Shield', color: 'text-red-400' }
    ],
    quickActions: [
      { label: 'System Settings', icon: 'Settings', path: '/admin-settings' },
      { label: 'User Management', icon: 'Users', path: '/login-management' },
      { label: 'Developer Portal', icon: 'Code', path: '/developer' },
      { label: 'Analytics', icon: 'BarChart3', path: '/analytics' }
    ],
    widgets: ['recentActivities', 'systemStatus', 'securityAlerts', 'performanceMetrics']
  },
  
  [ROLES.VICE_PRESIDENT]: {
    title: 'Vice President Dashboard',
    description: 'Executive leadership and strategic oversight',
    stats: [
      { id: 'regions', title: 'Managed Regions', icon: 'Network', color: 'text-purple-400' },
      { id: 'officers', title: 'Total Officers', icon: 'Users', color: 'text-green-400' },
      { id: 'compliance', title: 'Compliance Rate', icon: 'CheckCircle', color: 'text-emerald-400' },
      { id: 'revenue', title: 'Revenue Metrics', icon: 'DollarSign', color: 'text-green-400' },
      { id: 'growth', title: 'Growth Rate', icon: 'TrendingUp', color: 'text-blue-400' },
      { id: 'strategic', title: 'Strategic Goals', icon: 'Target', color: 'text-orange-400' }
    ],
    quickActions: [
      { label: 'Strategic Planning', icon: 'Target', path: '/reports' },
      { label: 'Executive Analytics', icon: 'BarChart3', path: '/analytics' },
      { label: 'Organizational View', icon: 'Network', path: '/sites' },
      { label: 'Performance Review', icon: 'Activity', path: '/performance' },
      { label: 'Market Analysis', icon: 'BarChart', path: '/analytics' },
      { label: 'Leadership Reports', icon: 'FileText', path: '/reports' }
    ],
    widgets: ['recentActivities', 'vpMetrics', 'strategicOverview', 'leadershipSummary']
  },
  
  [ROLES.EXECUTIVE]: {
    title: 'Executive Dashboard',
    description: 'Strategic overview and high-level metrics',
    stats: [
      { id: 'regions', title: 'Managed Regions', icon: 'Network', color: 'text-purple-400' },
      { id: 'officers', title: 'Total Officers', icon: 'Users', color: 'text-green-400' },
      { id: 'compliance', title: 'Compliance Rate', icon: 'CheckCircle', color: 'text-emerald-400' },
      { id: 'revenue', title: 'Revenue Metrics', icon: 'DollarSign', color: 'text-green-400' },
      { id: 'growth', title: 'Growth Rate', icon: 'TrendingUp', color: 'text-blue-400' }
    ],
    quickActions: [
      { label: 'Strategic Reports', icon: 'FileText', path: '/reports' },
      { label: 'Analytics', icon: 'BarChart3', path: '/analytics' },
      { label: 'Hierarchy View', icon: 'Network', path: '/sites' },
      { label: 'Performance', icon: 'Activity', path: '/performance' }
    ],
    widgets: ['recentActivities', 'executiveMetrics', 'strategicOverview', 'complianceSummary']
  },
  
  [ROLES.OPERATIONS_MANAGER]: {
    title: 'Operations Dashboard',
    description: 'Operational oversight and management',
    stats: [
      { id: 'sites', title: 'Active Facilities', icon: 'MapPin', color: 'text-blue-400' },
      { id: 'officers', title: 'Total Officers', icon: 'Users', color: 'text-green-400' },
      { id: 'alerts', title: 'Active Alerts', icon: 'AlertTriangle', color: 'text-yellow-400' },
      { id: 'compliance', title: 'Compliance Rate', icon: 'CheckCircle', color: 'text-emerald-400' },
      { id: 'scheduling', title: 'Scheduled Shifts', icon: 'CalendarDays', color: 'text-purple-400' }
    ],
    quickActions: [
      { label: 'Manage Hierarchy', icon: 'Network', path: '/sites' },
      { label: 'Security Companies', icon: 'Briefcase', path: '/security-companies' },
      { label: 'Scheduling', icon: 'CalendarDays', path: '/scheduling' },
      { label: 'Analytics', icon: 'BarChart3', path: '/analytics' }
    ],
    widgets: ['recentActivities', 'operationalMetrics', 'schedulingOverview', 'complianceStatus']
  },
  
  [ROLES.SUPERVISOR]: {
    title: 'Supervisor Dashboard',
    description: 'Team management and oversight',
    stats: [
      { id: 'officers', title: 'Team Members', icon: 'Users', color: 'text-green-400' },
      { id: 'alerts', title: 'Active Alerts', icon: 'AlertTriangle', color: 'text-yellow-400' },
      { id: 'compliance', title: 'Team Compliance', icon: 'CheckCircle', color: 'text-emerald-400' },
      { id: 'scheduling', title: 'Today\'s Shifts', icon: 'CalendarDays', color: 'text-purple-400' },
      { id: 'reports', title: 'Pending Reports', icon: 'FileText', color: 'text-blue-400' }
    ],
    quickActions: [
      { label: 'New Report', icon: 'FileText', path: '/reports/list' },
      { label: 'View Schedule', icon: 'CalendarDays', path: '/scheduling' },
      { label: 'Team Management', icon: 'Users', path: '/employees' },
      { label: 'Assessments', icon: 'ShieldCheck', path: '/assessments' }
    ],
    widgets: ['recentActivities', 'teamMetrics', 'schedulingStatus', 'complianceOverview']
  },
  
  [ROLES.CONSULTANT]: {
    title: 'Consultant Dashboard',
    description: 'Consulting and advisory overview',
    stats: [
      { id: 'clients', title: 'Active Clients', icon: 'Briefcase', color: 'text-blue-400' },
      { id: 'projects', title: 'Active Projects', icon: 'FolderOpen', color: 'text-green-400' },
      { id: 'compliance', title: 'Compliance Rate', icon: 'CheckCircle', color: 'text-emerald-400' },
      { id: 'reports', title: 'Consulting Reports', icon: 'FileText', color: 'text-purple-400' },
      { id: 'training', title: 'Training Sessions', icon: 'GraduationCap', color: 'text-yellow-400' }
    ],
    quickActions: [
      { label: 'ISO Compliance', icon: 'HardHat', path: '/iso' },
      { label: 'Training', icon: 'GraduationCap', path: '/training' },
      { label: 'Reports', icon: 'FileText', path: '/reports' },
      { label: 'Analytics', icon: 'BarChart3', path: '/analytics' }
    ],
    widgets: ['recentActivities', 'consultingMetrics', 'complianceStatus', 'projectOverview']
  },
  
  [ROLES.HYBRID_EMPLOYEE]: {
    title: 'Employee Dashboard',
    description: 'Personal and operational overview',
    stats: [
      { id: 'shifts', title: 'My Shifts', icon: 'CalendarDays', color: 'text-blue-400' },
      { id: 'reports', title: 'My Reports', icon: 'FileText', color: 'text-green-400' },
      { id: 'training', title: 'Training Status', icon: 'GraduationCap', color: 'text-yellow-400' },
      { id: 'compliance', title: 'My Compliance', icon: 'CheckCircle', color: 'text-emerald-400' },
      { id: 'alerts', title: 'Active Alerts', icon: 'AlertTriangle', color: 'text-red-400' }
    ],
    quickActions: [
      { label: 'New Report', icon: 'FileText', path: '/reports/list' },
      { label: 'View Schedule', icon: 'CalendarDays', path: '/scheduling' },
      { label: 'Training', icon: 'GraduationCap', path: '/training' },
      { label: 'NFC Tags', icon: 'Nfc', path: '/nfc' }
    ],
    widgets: ['recentActivities', 'personalMetrics', 'scheduleStatus', 'trainingProgress']
  },
  
  [ROLES.CLIENT_POC]: {
    title: 'Client Portal Dashboard',
    description: 'Client-specific overview and access',
    stats: [
      { id: 'sites', title: 'My Facilities', icon: 'MapPin', color: 'text-blue-400' },
      { id: 'officers', title: 'Assigned Officers', icon: 'Users', color: 'text-green-400' },
      { id: 'compliance', title: 'Service Compliance', icon: 'CheckCircle', color: 'text-emerald-400' },
      { id: 'reports', title: 'Service Reports', icon: 'FileText', color: 'text-purple-400' },
      { id: 'training', title: 'Training Status', icon: 'GraduationCap', color: 'text-yellow-400' }
    ],
    quickActions: [
      { label: 'Service Reports', icon: 'FileText', path: '/reports' },
      { label: 'Training Portal', icon: 'GraduationCap', path: '/training' },
      { label: 'Live Classes', icon: 'BookOpen', path: '/live-classes' },
      { label: 'Contact Support', icon: 'MessageSquare', path: '/messaging' }
    ],
    widgets: ['recentActivities', 'serviceMetrics', 'complianceStatus', 'trainingOverview']
  }
};

// Check if user has permission for a specific feature
export const hasPermission = (userRole, requiredRole) => {
  if (!userRole || !requiredRole) return false;
  
  const userLevel = ROLE_HIERARCHY[userRole] || 0;
  const requiredLevel = ROLE_HIERARCHY[requiredRole] || 0;
  
  return userLevel >= requiredLevel;
};

// Get dashboard configuration for a role
export const getDashboardConfig = (role) => {
  return ROLE_DASHBOARDS[role] || ROLE_DASHBOARDS[ROLES.HYBRID_EMPLOYEE];
};

// Get user's accessible features based on role
export const getAccessibleFeatures = (userRole) => {
  const features = {
    dashboard: true,
    reports: hasPermission(userRole, ROLES.HYBRID_EMPLOYEE),
    scheduling: hasPermission(userRole, ROLES.SUPERVISOR),
    employees: hasPermission(userRole, ROLES.SUPERVISOR),
    hierarchy: hasPermission(userRole, ROLES.OPERATIONS_MANAGER),
    analytics: hasPermission(userRole, ROLES.OPERATIONS_MANAGER),
    admin: hasPermission(userRole, ROLES.ADMIN),
    training: hasPermission(userRole, ROLES.HYBRID_EMPLOYEE),
    nfc: hasPermission(userRole, ROLES.SUPERVISOR),
    iso: hasPermission(userRole, ROLES.OPERATIONS_MANAGER),
    securityCompanies: hasPermission(userRole, ROLES.OPERATIONS_MANAGER),
    developer: hasPermission(userRole, ROLES.ADMIN)
  };
  
  return features;
};

// Get role-specific statistics
export const getRoleStats = async (userRole) => {
  try {
    const stats = [];
    
    switch (userRole) {
      case ROLES.ADMIN:
        // Admin gets all stats
        const [sites, regions, officers, alerts, compliance] = await Promise.all([
          supabase.from('sites').select('*', { count: 'exact', head: true }).eq('type', 'site'),
          supabase.from('sites').select('*', { count: 'exact', head: true }).eq('type', 'region'),
          supabase.from('entity_staff').select('*', { count: 'exact', head: true }),
          supabase.from('notifications').select('*', { count: 'exact', head: true }).eq('read', false),
          Promise.resolve({ count: 98 }) // Placeholder for compliance
        ]);
        
        stats.push(
          { id: 'sites', value: sites.count?.toString() || '0' },
          { id: 'regions', value: regions.count?.toString() || '0' },
          { id: 'officers', value: officers.count?.toString() || '0' },
          { id: 'alerts', value: alerts.count?.toString() || '0' },
          { id: 'compliance', value: '98%' },
          { id: 'security', value: 'Secure' }
        );
        break;
        
      case ROLES.VICE_PRESIDENT:
        // VP gets executive-level stats with additional strategic metrics
        const [vpRegions, vpOfficers, vpCompliance] = await Promise.all([
          supabase.from('sites').select('*', { count: 'exact', head: true }).eq('type', 'region'),
          supabase.from('entity_staff').select('*', { count: 'exact', head: true }),
          Promise.resolve({ count: 97 })
        ]);
        
        stats.push(
          { id: 'regions', value: vpRegions.count?.toString() || '0' },
          { id: 'officers', value: vpOfficers.count?.toString() || '0' },
          { id: 'compliance', value: '97%' },
          { id: 'revenue', value: '$3.2M' },
          { id: 'growth', value: '+18%' },
          { id: 'strategic', value: '92%' }
        );
        break;
        
      case ROLES.EXECUTIVE:
        // Executive gets high-level stats
        const [execRegions, execOfficers, execCompliance] = await Promise.all([
          supabase.from('sites').select('*', { count: 'exact', head: true }).eq('type', 'region'),
          supabase.from('entity_staff').select('*', { count: 'exact', head: true }),
          Promise.resolve({ count: 95 })
        ]);
        
        stats.push(
          { id: 'regions', value: execRegions.count?.toString() || '0' },
          { id: 'officers', value: execOfficers.count?.toString() || '0' },
          { id: 'compliance', value: '95%' },
          { id: 'revenue', value: '$2.4M' },
          { id: 'growth', value: '+12%' }
        );
        break;
        
      case ROLES.OPERATIONS_MANAGER:
        // Operations manager gets operational stats
        const [opSites, opOfficers, opAlerts, opScheduling] = await Promise.all([
          supabase.from('sites').select('*', { count: 'exact', head: true }).eq('type', 'site'),
          supabase.from('entity_staff').select('*', { count: 'exact', head: true }),
          supabase.from('notifications').select('*', { count: 'exact', head: true }).eq('read', false),
          Promise.resolve({ count: 45 })
        ]);
        
        stats.push(
          { id: 'sites', value: opSites.count?.toString() || '0' },
          { id: 'officers', value: opOfficers.count?.toString() || '0' },
          { id: 'alerts', value: opAlerts.count?.toString() || '0' },
          { id: 'compliance', value: '96%' },
          { id: 'scheduling', value: opScheduling.count?.toString() || '0' }
        );
        break;
        
      case ROLES.SUPERVISOR:
        // Supervisor gets team-focused stats
        const [superOfficers, superAlerts, superScheduling, superReports] = await Promise.all([
          supabase.from('entity_staff').select('*', { count: 'exact', head: true }),
          supabase.from('notifications').select('*', { count: 'exact', head: true }).eq('read', false),
          Promise.resolve({ count: 12 }),
          Promise.resolve({ count: 8 })
        ]);
        
        stats.push(
          { id: 'officers', value: superOfficers.count?.toString() || '0' },
          { id: 'alerts', value: superAlerts.count?.toString() || '0' },
          { id: 'compliance', value: '94%' },
          { id: 'scheduling', value: superScheduling.count?.toString() || '0' },
          { id: 'reports', value: superReports.count?.toString() || '0' }
        );
        break;
        
      case ROLES.CONSULTANT:
        // Consultant gets consulting-focused stats
        stats.push(
          { id: 'clients', value: '12' },
          { id: 'projects', value: '8' },
          { id: 'compliance', value: '97%' },
          { id: 'reports', value: '15' },
          { id: 'training', value: '6' }
        );
        break;
        
      case ROLES.HYBRID_EMPLOYEE:
        // Employee gets personal stats
        stats.push(
          { id: 'shifts', value: '4' },
          { id: 'reports', value: '3' },
          { id: 'training', value: '85%' },
          { id: 'compliance', value: '92%' },
          { id: 'alerts', value: '2' }
        );
        break;
        
      case ROLES.CLIENT_POC:
        // Client gets service-focused stats
        stats.push(
          { id: 'sites', value: '3' },
          { id: 'officers', value: '8' },
          { id: 'compliance', value: '98%' },
          { id: 'reports', value: '12' },
          { id: 'training', value: '100%' }
        );
        break;
        
      default:
        // Default to employee stats
        stats.push(
          { id: 'shifts', value: '4' },
          { id: 'reports', value: '3' },
          { id: 'training', value: '85%' },
          { id: 'compliance', value: '92%' },
          { id: 'alerts', value: '2' }
        );
    }
    
    return { data: stats, error: null };
  } catch (error) {
    console.error('Error fetching role stats:', error);
    return { data: null, error };
  }
};

// Get role-specific activities
export const getRoleActivities = async (userRole) => {
  try {
    let query = supabase
      .from('notifications')
      .select('id, message, created_at, type, ticker_status')
      .order('created_at', { ascending: false })
      .limit(5);
    
    // Filter activities based on role
    if (userRole === ROLES.CLIENT_POC) {
      query = query.eq('type', 'client_notification');
    } else if (userRole === ROLES.HYBRID_EMPLOYEE) {
      query = query.in('type', ['personal_alert', 'training_reminder', 'schedule_update']);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    const formattedActivities = data.map(act => ({
      id: act.id,
      message: act.message,
      time: new Date(act.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: act.ticker_status === 'red' ? 'critical' : 
              act.ticker_status === 'yellow' || act.ticker_status === 'orange' ? 'warning' : 
              act.type === 'training_alert' ? 'info' : 'success',
      type: act.type
    }));
    
    return { data: formattedActivities, error: null };
  } catch (error) {
    console.error('Error fetching role activities:', error);
    return { data: null, error };
  }
}; 