import { useAuth } from '../../context/AuthContext';
import { Bell, Search, User, ChevronDown, Activity, Menu } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Navbar({ onMenuToggle }) {
  const { user } = useAuth();

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="app-topbar"
      style={{
        background: 'rgba(0, 4, 17, 0.4)',
        borderBottom: '1px solid var(--glass-border)',
        backdropFilter: 'blur(40px)',
        minHeight: '68px',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
        position: 'sticky',
        top: 0,
        zIndex: 100,
        flexShrink: 0,
      }}
    >
      {}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
        {}
        <button
          className="hamburger-btn"
          onClick={onMenuToggle}
          aria-label="Toggle menu"
        >
          <Menu size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 3, height: 22, background: 'linear-gradient(to bottom, var(--v-saffron), #fff, var(--v-green))', borderRadius: 2 }} />
          <div>
            <div style={{ fontSize: '0.9375rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.1 }}>NATIONAL MONITOR</div>
            <div style={{ fontSize: '0.5625rem', color: 'var(--v-saffron)', fontWeight: 800, letterSpacing: '0.2em', marginTop: 3 }}>GOVT OF INDIA</div>
          </div>
        </div>
      </div>

      {}
      <div className="navbar-search" style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
        <Search size={16} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--t-mute)' }} />
        <input
          type="text"
          placeholder="Search grids, candidates, incidents..."
          className="v-input"
          style={{ paddingLeft: 48, height: '44px', fontSize: '0.8125rem' }}
        />
      </div>

      {}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
        <motion.div
          className="navbar-live-badge"
          whileHover={{ scale: 1.05 }}
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', borderRadius: 'var(--r-md)', background: 'rgba(0, 255, 136, 0.05)', border: '1px solid rgba(0, 255, 136, 0.2)', cursor: 'default' }}
        >
          <div className="pulse-saffron" style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--v-saffron)', boxShadow: '0 0 8px var(--v-saffron)', flexShrink: 0 }} />
          <span style={{ fontSize: '0.625rem', fontWeight: 800, color: 'var(--v-saffron)', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>LIVE FEED</span>
        </motion.div>

        <div className="navbar-divider" style={{ width: 1, height: 28, background: 'var(--glass-border)', flexShrink: 0 }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
          <div className="navbar-user-name" style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: '#fff', whiteSpace: 'nowrap', maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.fullName}</div>
            <div style={{ fontSize: '0.5625rem', color: 'var(--v-saffron)', fontWeight: 900, letterSpacing: '0.05em' }}>ID: {user?.username?.toUpperCase()}</div>
          </div>
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            style={{ width: 40, height: 40, borderRadius: '12px', background: 'var(--v-navy)', border: '1px solid var(--v-saffron)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: '0 6px 16px rgba(255, 140, 0, 0.2)', flexShrink: 0 }}
          >
            <User size={20} />
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
}
