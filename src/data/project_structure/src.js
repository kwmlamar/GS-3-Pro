import { componentsFolder } from './components.js';
import { pagesFolder } from './pages.js';
import { routesFolder } from './routes.js';
import { libFolder } from './lib.js';
import { dataFolder } from './data.js';

const escapeContent = (content) => {
    if (!content) return '';
    return content.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
};

const App_jsx = {
  name: "App.jsx",
  type: "file",
  content: escapeContent(`
import React, { useEffect, useState, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Toaster } from '@/components/ui/toaster';
import Layout from '@/components/Layout';
import Dashboard from '@/pages/Dashboard';
import Assessments from '@/pages/Assessments';
import Sites from '@/pages/Sites';
import Employees from '@/pages/Employees';
import SecurityCompanies from '@/pages/SecurityCompanies';
import Training from '@/pages/Training';
import LiveClasses from '@/pages/LiveClasses';
import NFCManagement from '@/pages/NFCManagement';
import reportRoutes from '@/routes/reportRoutes';
import Scheduling from '@/pages/Scheduling';
import Analytics from '@/pages/Analytics';
import Messaging from '@/pages/Messaging';
import ISO from '@/pages/ISO';
import ExternalApp from '@/pages/ExternalApp';
import AdminSettings from '@/pages/AdminSettings';
import HealthSafety from '@/pages/HealthSafety';
import DeveloperPage from '@/pages/DeveloperPage';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/components/ui/use-toast';

const PerformancePage = () => <div className="text-white p-5"><h1>Performance Evaluations Page</h1><p>Content coming soon...</p></div>;
const IncidentsPage = () => <div className="text-white p-5"><h1>Incidents Page</h1><p>Content coming soon...</p></div>;
const ObservationsPage = () => <div className="text-white p-5"><h1>Observations Page</h1><p>Content coming soon...</p></div>;
const LoginManagementPage = () => <div className="text-white p-5"><h1>Login Management Page</h1><p>Content coming soon...</p></div>;

function App() {
  const { toast } = useToast();
  const [userRole, setUserRole] = useState(null);
  const [loadingRole, setLoadingRole] = useState(true);

  const checkUserSession = useCallback(async () => {
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) {
        if (sessionError.message.includes('bad_jwt')) {
          console.error("Bad JWT detected. Forcing sign-out.");
          await supabase.auth.signOut();
          setUserRole(null);
          toast({
            variant: "destructive",
            title: "Session Invalid",
            description: "Your session has expired or is invalid. Please log in again.",
          });
          return;
        }
        throw new Error(\`Supabase session error: \${sessionError.message}\`);
      }

      if (session?.user) {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('role, full_name')
          .eq('auth_user_id', session.user.id)
          .single();

        if (userError || !userData) {
          console.error('Error fetching user profile or user not found. Forcing sign-out.', userError?.message);
          await supabase.auth.signOut();
          setUserRole(null);
          toast({
            variant: "destructive",
            title: "User Profile Error",
            description: "Could not find your user profile. Please log in again or contact support.",
          });
        } else {
          setUserRole(userData.role);
        }
      } else {
        setUserRole(null);
      }
    } catch (error) {
      console.error('Critical error in user session check. Forcing sign-out.', error);
      await supabase.auth.signOut().catch(e => console.error("Sign out failed during error handling:", e));
      setUserRole(null);
      toast({
        variant: "destructive",
        title: "Application Error",
        description: "An unexpected error occurred. Please try logging in again.",
      });
    } finally {
      setLoadingRole(false);
    }
  }, [toast]);

  useEffect(() => {
    checkUserSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        setUserRole(null);
      } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
        checkUserSession();
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [checkUserSession]);

  if (loadingRole) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-black text-white p-4">
        <img  alt="GS-3 SecureOps Pro Logo loading" className="w-32 h-32 mb-6 animate-pulse" src="https://images.unsplash.com/photo-1575821104894-b683ce7525ff" />
        <h1 className="text-2xl font-semibold mb-2">GS-3 SecureOps Pro</h1>
        <p className="text-slate-400">Initializing Security Management Platform...</p>
        <div className="mt-8 w-16 h-16 border-4 border-dashed rounded-full animate-spin border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>GS-3 SecureOps Pro | Advanced Security Management</title>
        <meta name="description" content="GS-3 SecureOps Pro: Leading security operations platform with AI analytics, real-time monitoring, and comprehensive tools for protective services. Domain: gs-3.pro" />
        <link rel="canonical" href="https://gs-3.pro" />
      </Helmet>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-black">
          <Routes>
            <Route path="/developer" element={<DeveloperPage />} />
            <Route path="/" element={<Layout userRole={userRole} />}>
              <Route index element={<Dashboard userRole={userRole} />} />
              <Route path="assessments" element={<Assessments />} />
              <Route path="sites" element={<Sites />} />
              <Route path="employees" element={<Employees />} />
              <Route path="performance" element={<PerformancePage />} />
              <Route path="security-companies" element={<SecurityCompanies />} />
              <Route path="training" element={<Training />} />
              <Route path="live-classes" element={<LiveClasses />} />
              <Route path="nfc" element={<NFCManagement />} />
              {reportRoutes}
              <Route path="reports/incidents" element={<IncidentsPage />} />
              <Route path="reports/observations" element={<ObservationsPage />} />
              <Route path="scheduling" element={<Scheduling />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="messaging" element={<Messaging />} />
              <Route path="iso" element={<ISO />} />
              <Route path="health-safety" element={<HealthSafety />} />
              <Route path="external-app" element={<ExternalApp />} />
              <Route path="login-management" element={<LoginManagementPage />} />
              <Route path="admin-settings" element={userRole === 'admin' ? <AdminSettings /> : <Navigate to="/" replace />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
          <Toaster />
        </div>
      </Router>
    </>
  );
}

export default App;
`)
};

const main_jsx = {
  name: "main.jsx",
  type: "file",
  content: escapeContent(`
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/App';
import '@/index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
`)
};

const index_css = { name: "index.css", type: "file", content: `/* Content not available */` };

export const srcFolder = {
  name: "src",
  type: "folder",
  children: [
    componentsFolder,
    pagesFolder,
    routesFolder,
    dataFolder,
    libFolder,
    App_jsx,
    main_jsx,
    index_css
  ]
};