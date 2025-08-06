import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import PerformanceTicker from '@/components/PerformanceTicker';

const Layout = ({ userRole, onRoleChange }) => {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 1024);
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize(); 
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (window.innerWidth <= 1024) {
      setSidebarOpen(false);
    }
  }, [location]);

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-slate-900 to-black">
      <Sidebar isOpen={sidebarOpen} userRole={userRole} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ease-in-out ${sidebarOpen && window.innerWidth > 1024 ? 'lg:ml-64' : 'ml-0'}`}>
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} userRole={userRole} onRoleChange={onRoleChange} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
      {userRole && userRole !== 'client_poc' && <PerformanceTicker />}
    </div>
  );
};

export default Layout;