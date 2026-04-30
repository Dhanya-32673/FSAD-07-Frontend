import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  BarChart3,
  Users,
  Vote,
  ShieldAlert,
  LogOut,
  LayoutDashboard,
  Map,
  Zap,
  Terminal,
  ChevronRight,
  Database,
  Cpu,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const toast = useToast();

  const handleLogout = () => {
    logout();
    toast.info('Session terminated. See you soon!');
  };

  const menuItems = {
    ADMIN: [
      { path: '/admin', label: 'Command Center', icon: LayoutDashboard },
      { path: '/admin/users', label: 'Identity Grid', icon: Users },
      { path: '/admin/candidates', label: 'Registry Logs', icon: Database },
      { path: '/admin/elections', label: 'Active Gates', icon: Zap },
      { path: '/admin/security', label: 'Neural Shield', icon: ShieldAlert },
    ],
    CITIZEN: [
      { path: '/citizen', label: 'Access Hub', icon: LayoutDashboard },
      { path: '/citizen/vote', label: 'Digital Ballot', icon: Vote },
      { path: '/citizen/constituencies', label: 'Global Map', icon: Map },
      { path: '/citizen/stats', label: 'Grid Analytics', icon: BarChart3 },
    ],
    OBSERVER: [
      { path: '/observer', label: 'Observer Hub', icon: LayoutDashboard },
      { path: '/observer/monitor', label: 'Monitor', icon: Zap },
      { path: '/observer/report', label: 'Report Anomaly', icon: ShieldAlert },
      { path: '/observer/insights', label: 'Insights', icon: BarChart3 },
    ],
    ANALYST: [
      { path: '/analyst', label: 'Analyst Hub', icon: LayoutDashboard },
      { path: '/analyst/analytics', label: 'Analytics', icon: BarChart3 },
      { path: '/analyst/reports', label: 'Reports', icon: Database },
      { path: '/analyst/live', label: 'Live Feed', icon: Zap },
    ],
  };

  const items = menuItems[user?.role] || [];

  
  const handleNavClick = () => {
    if (onClose) onClose();
  };

  return (
    <>
      {}
      <div
        className={`sidebar-overlay${isOpen ? ' open' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <div className={`app-sidebar${isOpen ? ' open' : ''}`}>
        {}
        <div style={{ padding: '28px 24px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ position: 'relative' }}>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                style={{ width: 44, height: 44, borderRadius: '14px', border: '2px solid var(--v-saffron)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <Cpu size={22} color="var(--v-saffron)" />
              </motion.div>
              <div style={{ position: 'absolute', top: -5, right: -5, width: 11, height: 11, borderRadius: '50%', background: 'var(--v-green)', border: '2px solid var(--v-navy)', boxShadow: '0 0 10px var(--v-green)' }} />
            </div>
            <div>
              <div style={{ fontSize: '1.125rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1 }}>BHARAT</div>
              <div style={{ fontSize: '0.5625rem', color: 'var(--v-saffron)', fontWeight: 800, letterSpacing: '0.2em', marginTop: 4 }}>VANGUARD OS</div>
            </div>
          </div>

          {}
          <button
            onClick={onClose}
            style={{ background: 'none', border: '1px solid var(--glass-border)', borderRadius: 8, color: 'var(--t-dim)', cursor: 'pointer', padding: 6, display: 'flex', alignItems: 'center' }}
            aria-label="Close menu"
            className="sidebar-close-btn"
          >
            <X size={18} />
          </button>
        </div>

        {}
        <nav style={{ flex: 1, padding: '8px 16px', overflowY: 'auto' }}>
          <div style={{ fontSize: '0.5625rem', fontWeight: 800, color: 'var(--t-mute)', letterSpacing: '0.15em', padding: '0 16px 14px' }}>SYSTEM CHANNELS</div>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {items.map((item) => (
              <motion.li key={item.path} whileHover={{ x: 4 }}>
                <NavLink
                  to={item.path}
                  end={item.path.split('/').length === 2}
                  onClick={handleNavClick}
                  style={({ isActive }) => ({
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '13px 16px',
                    borderRadius: 'var(--r-md)',
                    textDecoration: 'none',
                    color: isActive ? '#fff' : 'var(--t-dim)',
                    background: isActive ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
                    border: isActive ? '1px solid var(--glass-border)' : '1px solid transparent',
                    transition: 'all 0.2s ease',
                    position: 'relative',
                    overflow: 'hidden',
                  })}
                >
                  {({ isActive }) => (
                    <>
                      <item.icon size={19} strokeWidth={isActive ? 2.5 : 2} color={isActive ? 'var(--v-saffron)' : 'currentColor'} />
                      <span style={{ fontSize: '0.875rem', fontWeight: isActive ? 800 : 500, letterSpacing: '0.01em' }}>{item.label}</span>
                      {isActive && (
                        <motion.div
                          layoutId="active-nav-glow"
                          style={{ position: 'absolute', right: 0, top: '25%', bottom: '25%', width: 2, background: 'var(--v-saffron)', boxShadow: '0 0 15px var(--v-saffron)', borderRadius: '2px' }}
                        />
                      )}
                      <ChevronRight size={13} style={{ marginLeft: 'auto', opacity: isActive ? 0.8 : 0 }} />
                    </>
                  )}
                </NavLink>
              </motion.li>
            ))}
          </ul>
        </nav>

        {}
        <div style={{ padding: '20px', borderTop: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.01)' }}>
          <div style={{ fontSize: '0.5625rem', fontWeight: 800, color: 'var(--t-mute)', letterSpacing: '0.15em', marginBottom: '14px' }}>SESSION STATUS</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <div style={{ width: 30, height: 30, borderRadius: '8px', background: 'var(--v-navy)', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--v-green)', flexShrink: 0 }}>
              <Terminal size={14} />
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Grid.India.V1</div>
              <div style={{ fontSize: '0.5625rem', color: 'var(--v-green)', fontWeight: 800 }}>ACTIVE SESSION</div>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.02, background: 'rgba(244, 63, 94, 0.15)' }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            style={{ width: '100%', padding: '11px', borderRadius: 'var(--r-md)', background: 'rgba(244, 63, 94, 0.05)', border: '1px solid rgba(244, 63, 94, 0.2)', color: '#fb7185', fontSize: '0.6875rem', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}
          >
            <LogOut size={14} /> TERMINATE ACCESS
          </motion.button>
        </div>
      </div>
    </>
  );
}
