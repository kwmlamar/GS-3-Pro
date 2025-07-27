import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, ShieldCheck, Users, Briefcase, GraduationCap, BookOpen, Nfc, BarChart2, MessageSquare, FileText, Settings, HardHat, ShieldAlert, X, CalendarDays, UserCheck, FileArchive, AlertTriangle, RadioTower, GitBranch, LockKeyhole, Network, Code, Building2, Archive
} from 'lucide-react';
import { cn } from '@/lib/utils';

const allRoles = ['admin', 'supervisor', 'operations_manager', 'consultant', 'hybrid_employee', 'client_poc', 'executive'];
const commonRoles = ['admin', 'supervisor', 'operations_manager', 'consultant', 'hybrid_employee'];
const clientRoles = ['client_poc', 'admin']; 
const executiveRoles = ['executive', 'admin']; 
const adminOnly = ['admin'];
const operationsAndAdmin = ['admin', 'operations_manager'];
const supervisorAndAbove = ['admin', 'supervisor', 'operations_manager'];

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/', roles: allRoles },
  { icon: Network, label: 'Hierarchy Builder', path: '/sites', roles: [...commonRoles, ...executiveRoles] }, 
  { icon: FileText, label: 'Reports Hub', path: '/reports', roles: allRoles },
  { icon: Nfc, label: 'NFC/GPS Tags', path: '/nfc', roles: [...supervisorAndAbove, 'hybrid_employee'] },
  { icon: CalendarDays, label: 'Scheduling', path: '/scheduling', roles: supervisorAndAbove },
  { icon: ShieldCheck, label: 'Assessments', path: '/assessments', roles: supervisorAndAbove },
  { icon: Briefcase, label: 'Subcontractors', path: '/subcontractors', roles: operationsAndAdmin },
  { icon: Users, label: 'Security Staff', path: '/employees', roles: supervisorAndAbove },
  { icon: Network, label: 'Chain of Command', path: '/chain-of-command', roles: supervisorAndAbove },
  { icon: Building2, label: 'Entity Staff', path: '/entity-staff', roles: supervisorAndAbove },
  { icon: UserCheck, label: 'Performance', path: '/performance', roles: supervisorAndAbove },
  { icon: Archive, label: 'Archive', path: '/archive', roles: supervisorAndAbove },
  { icon: ShieldAlert, label: 'Health & Safety', path: '/health-safety', roles: [...commonRoles, ...executiveRoles] },
  { icon: GraduationCap, label: 'Training', path: '/training', roles: [...commonRoles, ...clientRoles] },
  { icon: BookOpen, label: 'Live Classes', path: '/live-classes', roles: [...commonRoles, ...clientRoles] },
  { icon: AlertTriangle, label: 'Incidents', path: '/reports/incidents', roles: allRoles },
  { icon: FileArchive, label: 'Observations', path: '/reports/observations', roles: allRoles },
  { icon: BarChart2, label: 'Analytics', path: '/analytics', roles: [...operationsAndAdmin, ...executiveRoles] },
  { icon: RadioTower, label: 'Communications', path: '/messaging', roles: allRoles },
  { icon: HardHat, label: 'ISO Compliance', path: '/iso', roles: [...operationsAndAdmin, 'consultant'] },
  { icon: GitBranch, label: 'App Integrations', path: '/external-app', roles: adminOnly },
  { icon: LockKeyhole, label: 'Login Management', path: '/login-management', roles: adminOnly },
  { icon: Settings, label: 'Admin Settings', path: '/admin-settings', roles: adminOnly },
  { icon: Code, label: 'Developer Portal', path: '/developer', roles: adminOnly }
];

const Sidebar = ({ isOpen, userRole, toggleSidebar }) => {
  const availableNavItems = navItems.filter(item => userRole && item.roles.includes(userRole));

  const sidebarVariants = {
    open: { x: 0, transition: { type: 'spring', stiffness: 120, damping: 20 } },
    closed: { x: '-100%', transition: { type: 'spring', stiffness: 120, damping: 20 } },
  };
  
  const navLinkClass = ({ isActive }) =>
    cn(
      "flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 ease-in-out font-medium text-sm group",
      isActive
        ? "bg-gradient-to-r from-sky-600 to-indigo-700 text-white shadow-md scale-105"
        : "text-slate-300 hover:bg-slate-700/70 hover:text-sky-300 hover:scale-105 transform"
    );

  const iconClass = (isActive) => 
    cn(
      "w-5 h-5 group-hover:text-sky-300 transition-colors",
      isActive && "text-white"
    );

  return (
    <motion.aside 
      variants={sidebarVariants}
      initial="closed"
      animate={isOpen ? "open" : "closed"}
      className="w-64 h-screen p-4 space-y-4 nav-blur flex flex-col fixed top-0 left-0 z-40 lg:z-auto overflow-hidden"
    >
      <div className="flex items-center justify-between mb-5 flex-shrink-0">
        <Link to="/" className="flex items-center space-x-2 p-2">
          <img  alt="GS-3 SecureOps Pro Logo Favicon" className="h-8 w-8 filter brightness-0 invert" src="https://images.unsplash.com/photo-1575821104894-b683ce7525ff" />
          <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-slate-300 via-slate-100 to-sky-300">
            SecureOps
          </span>
        </Link>
        <button onClick={toggleSidebar} className="lg:hidden text-slate-400 hover:text-white p-2">
          <X className="w-5 h-5" />
        </button>
      </div>
      
      <nav className="flex-1 space-y-1.5 overflow-y-auto scrollbar-thin">
        {availableNavItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.path}
            end={item.path === "/"} 
            className={navLinkClass}
          >
            {({ isActive }) => (
              <>
                <item.icon className={iconClass(isActive)} />
                <span>{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto pt-4 border-t border-slate-700/60 flex-shrink-0">
        <p className="text-xs text-center text-slate-500 mt-4">
          &copy; {new Date().getFullYear()} GS-3 SecureOps Pro.
          <br />
          All rights reserved. Domain: gs-3.pro
        </p>
      </div>
    </motion.aside>
  );
};

export default Sidebar;