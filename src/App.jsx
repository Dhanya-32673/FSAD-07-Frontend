import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Sidebar from './components/layout/Sidebar';
import Navbar from './components/layout/Navbar';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

import AdminDashboard from './pages/admin/AdminDashboard';
import ManageElections from './pages/admin/ManageElections';
import ManageUsers from './pages/admin/ManageUsers';
import ManageCandidates from './pages/admin/ManageCandidates';
import SystemSecurity from './pages/admin/SystemSecurity';

import CitizenDashboard from './pages/citizen/CitizenDashboard';
import ElectionTracker from './pages/citizen/ElectionTracker';
import VotingBooth from './pages/citizen/VotingBooth';
import ReportIssue from './pages/citizen/ReportIssue';
import Discussions from './pages/citizen/Discussions';
import ElectionMap from './pages/citizen/ElectionMap';
import CitizenStats from './pages/citizen/CitizenStats';

import ObserverDashboard from './pages/observer/ObserverDashboard';
import MonitorElection from './pages/observer/MonitorElection';
import ReportAnomaly from './pages/observer/ReportAnomaly';
import FairnessInsights from './pages/observer/FairnessInsights';

import AnalystDashboard from './pages/analyst/AnalystDashboard';
import ElectionAnalytics from './pages/analyst/ElectionAnalytics';
import GenerateReports from './pages/analyst/GenerateReports';
import RealTimeUpdates from './pages/analyst/RealTimeUpdates';

import './index.css';

import { motion } from 'framer-motion';

function DashboardLayout() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (user) {
      const themes = {
        ADMIN: 'var(--v-saffron)',
        CITIZEN: 'var(--v-green)',
        OBSERVER: 'var(--v-indigo)',
        ANALYST: 'var(--v-white)'
      };
      document.documentElement.style.setProperty('--v-primary', themes[user.role] || 'var(--v-saffron)');
    }
  }, [user]);

  
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [sidebarOpen]);

  return (
    <div className="app-layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="app-main">
        <Navbar onMenuToggle={() => setSidebarOpen(prev => !prev)} />
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="app-content"
        >
          <Outlet />
        </motion.div>
      </div>
    </div>
  );
}

function RootRedirect() {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="loading-screen">
      <div className="v-spinner" />
    </div>
  );
  if (!user) return <Navigate to="/login" replace />;
  const roleRoutes = { ADMIN: '/admin', CITIZEN: '/citizen', OBSERVER: '/observer', ANALYST: '/analyst' };
  return <Navigate to={roleRoutes[user.role] || '/login'} replace />;
}

function Unauthorized() {
  return (
    <div className="loading-screen">
      <div className="v-card" style={{ padding: '48px', textAlign: 'center', maxWidth: '400px' }}>
        <ShieldAlert size={48} color="#fb7185" style={{ marginBottom: 24 }} />
        <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#fff', marginBottom: 12 }}>Access Denied</h2>
        <p style={{ color: 'var(--t-dim)', fontSize: '0.875rem', marginBottom: 24 }}>You do not have the required security clearing for this sector.</p>
        <a href="/" className="btn-vanguard btn-v-primary" style={{ textDecoration: 'none' }}>Return to Hub</a>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <Routes>
          {}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {}
          <Route path="/" element={<RootRedirect />} />

          {}
          <Route element={<ProtectedRoute roles={['ADMIN']}><DashboardLayout /></ProtectedRoute>}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/elections" element={<ManageElections />} />
            <Route path="/admin/users" element={<ManageUsers />} />
            <Route path="/admin/candidates" element={<ManageCandidates />} />
            <Route path="/admin/incidents" element={<SystemSecurity />} />
            <Route path="/admin/security" element={<SystemSecurity />} />
          </Route>

          {}
          <Route element={<ProtectedRoute roles={['CITIZEN']}><DashboardLayout /></ProtectedRoute>}>
            <Route path="/citizen" element={<CitizenDashboard />} />
            <Route path="/citizen/elections" element={<ElectionTracker />} />
            <Route path="/citizen/vote" element={<VotingBooth />} />
            <Route path="/citizen/report" element={<ReportIssue />} />
            <Route path="/citizen/discussions" element={<Discussions />} />
            <Route path="/citizen/constituencies" element={<ElectionMap />} />
            <Route path="/citizen/stats" element={<CitizenStats />} />
          </Route>

          {}
          <Route element={<ProtectedRoute roles={['OBSERVER']}><DashboardLayout /></ProtectedRoute>}>
            <Route path="/observer" element={<ObserverDashboard />} />
            <Route path="/observer/monitor" element={<MonitorElection />} />
            <Route path="/observer/report" element={<ReportAnomaly />} />
            <Route path="/observer/insights" element={<FairnessInsights />} />
          </Route>

          {}
          <Route element={<ProtectedRoute roles={['ANALYST']}><DashboardLayout /></ProtectedRoute>}>
            <Route path="/analyst" element={<AnalystDashboard />} />
            <Route path="/analyst/analytics" element={<ElectionAnalytics />} />
            <Route path="/analyst/reports" element={<GenerateReports />} />
            <Route path="/analyst/live" element={<RealTimeUpdates />} />
          </Route>

              {}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
