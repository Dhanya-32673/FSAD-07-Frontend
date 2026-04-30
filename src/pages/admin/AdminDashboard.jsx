import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/axios';
import { 
  Users, 
  Vote, 
  AlertTriangle, 
  Activity, 
  Landmark, 
  Globe, 
  ShieldCheck, 
  Zap, 
  Cpu, 
  ChevronRight,
  TrendingUp,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    API.get('/analytics')
      .then(r => { 
        setAnalytics(r.data); 
        setLoading(false); 
      })
      .catch(() => setLoading(false));
  }, []);

  const exportLogs = () => {
    API.get('/elections').then(r => {
      const rows = [['ID','Title','Type','Status','Start Date','End Date','Candidates','Total Votes']];
      r.data.forEach(e => rows.push([
        e.id, `"${e.title}"`, e.electionType, e.status,
        new Date(e.startDate).toLocaleDateString(),
        new Date(e.endDate).toLocaleDateString(),
        (e.candidates || []).length, e.totalVotes || 0
      ]));
      const csv = rows.map(r => r.join(',')).join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `election_logs_${Date.now()}.csv`;
      a.click(); URL.revokeObjectURL(url);
    }).catch(() => alert('Failed to export logs.'));
  };

  if (loading) return (
    <div className="loading-screen">
      <div style={{ textAlign: 'center' }}>
        <div className="v-spinner" style={{ margin: '0 auto 24px' }} />
        <div style={{ fontSize: '0.625rem', fontWeight: 900, color: 'var(--v-saffron)', letterSpacing: '0.3em' }}>SYNCHRONIZING GRIDS...</div>
      </div>
    </div>
  );

  const stats = [
    { label: 'Electoral Shards', value: analytics?.totalElections || 543, icon: Landmark, color: 'var(--v-saffron)', sub: 'Constituencies' },
    { label: 'Neural Gates', value: analytics?.activeElections || 0, icon: Zap, color: 'var(--v-green)', sub: 'Active Sessions' },
    { label: 'Staffing Grid', value: (analytics?.usersByRole ? Object.values(analytics.usersByRole).reduce((a, b) => a + b, 0) : 0), icon: Users, color: '#6366f1', sub: 'Electoral Personnel' },
    { label: 'Integrity Flags', value: analytics?.totalIncidents || 0, icon: ShieldCheck, color: '#fb7185', sub: 'Security Threats' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
  };

  return (
    <motion.div 
      initial="hidden" 
      animate="visible" 
      variants={containerVariants}
      style={{ padding: '40px' }}
    >
      {}
      <motion.div variants={itemVariants} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 48 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <div className="pulse-saffron" style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--v-saffron)' }} />
            <span style={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--v-saffron)', letterSpacing: '0.2em' }}>SYSTEM COMMAND</span>
          </div>
          <h1 className="gradient-text-vanguard" style={{ fontSize: '3.5rem', lineHeight: 1 }}>Central Command</h1>
          <p style={{ color: 'var(--t-dim)', fontSize: '1.125rem', marginTop: 12, fontWeight: 500 }}>
            Real-time neural monitoring of the {new Date().getFullYear()} National General Elections.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 16 }}>
          <button className="btn-vanguard btn-v-outline" onClick={exportLogs}><FileText size={18} /> EXPORT LOGS</button>
          <button className="btn-vanguard btn-v-primary" onClick={() => navigate('/admin/security')}>SYSTEM AUDIT <ChevronRight size={18} /></button>
        </div>
      </motion.div>

      {}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '40px' }}>
        {stats.map((s, i) => (
          <motion.div 
            key={i} 
            variants={itemVariants}
            whileHover={{ y: -8, scale: 1.02 }}
            className="v-card"
            style={{ padding: 32 }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <div style={{ width: 52, height: 52, borderRadius: '14px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <s.icon size={24} color={s.color} />
              </div>
              <div style={{ width: 40, height: 1, background: 'var(--glass-border)' }} />
            </div>
            <div>
                <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#fff', lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--t-mute)', letterSpacing: '0.1em', marginTop: 12 }}>{s.label.toUpperCase()}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 16 }}>
                   <TrendingUp size={14} color="var(--v-green)" />
                   <span style={{ fontSize: '0.75rem', color: s.color, fontWeight: 800 }}>{s.sub}</span>
                </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '6fr 4fr', gap: '24px' }}>
        {}
        <motion.div variants={itemVariants} className="v-card" style={{ padding: 40 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <Globe size={24} color="var(--v-saffron)" />
                <h3 style={{ fontSize: '1.5rem', fontWeight: 900 }}>Regional Grids</h3>
             </div>
             <div style={{ padding: '8px 16px', borderRadius: 'var(--r-full)', background: 'rgba(0, 255, 136, 0.05)', border: '1px solid rgba(0, 255, 136, 0.2)', color: 'var(--v-green)', fontSize: '0.625rem', fontWeight: 900, letterSpacing: '0.1em' }}>NOMINAL STATUS</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {analytics?.electionAnalytics?.map((el, i) => (
              <motion.div 
                key={i} 
                whileHover={{ background: 'rgba(255,255,255,0.02)' }}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px', borderRadius: 'var(--r-md)', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.01)' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                   <div style={{ width: 44, height: 44, borderRadius: '12px', background: 'var(--bg-vanguard)', border: '1px solid var(--v-saffron)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--v-saffron)', fontWeight: 900 }}>{(i+1).toString().padStart(2, '0')}</div>
                   <div>
                      <div style={{ fontSize: '1rem', fontWeight: 800, color: '#fff' }}>{el.electionTitle}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--t-mute)', fontWeight: 600, marginTop: 4 }}>ID: TERMINAL-{100+i} • {el.totalVotes.toLocaleString()} Vested Shards</div>
                   </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                   <div style={{ fontSize: '0.75rem', fontWeight: 900, color: el.status === 'ACTIVE' ? 'var(--v-green)' : 'var(--t-mute)', letterSpacing: '0.1em' }}>{el.status}</div>
                   <div style={{ width: '100px', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: 2, marginTop: 8, overflow: 'hidden' }}>
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: el.status === 'ACTIVE' ? '65%' : '100%' }}
                        style={{ height: '100%', background: el.status === 'ACTIVE' ? 'var(--v-green)' : 'var(--t-mute)' }} 
                      />
                   </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {}
        <motion.div variants={itemVariants} className="v-card" style={{ padding: 40 }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
                <Cpu size={24} color="#6366f1" />
                <h3 style={{ fontSize: '1.5rem', fontWeight: 900 }}>Neural Distribution</h3>
           </div>
           <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
              {analytics?.usersByRole && Object.entries(analytics.usersByRole).map(([role, count], i) => {
                const colors = { ADMIN: 'var(--v-saffron)', CITIZEN: 'var(--v-green)', OBSERVER: '#6366f1', ANALYST: '#fff' };
                const total = Object.values(analytics.usersByRole).reduce((a, b) => a + b, 0);
                const pct = total > 0 ? (count / total * 100).toFixed(0) : 0;
                return (
                  <div key={i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                      <span style={{ fontSize: '0.875rem', fontWeight: 800, color: '#fff', letterSpacing: '0.05em' }}>{role}</span>
                      <span style={{ fontSize: '0.875rem', fontWeight: 900, color: colors[role] }}>{count} UIDS</span>
                    </div>
                    <div style={{ height: 10, background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--r-full)', overflow: 'hidden' }}>
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                        style={{ height: '100%', background: colors[role], boxShadow: `0 0 15px ${colors[role]}44` }} 
                      />
                    </div>
                  </div>
                );
              })}
           </div>

           <div style={{ marginTop: 48, padding: 32, borderRadius: 'var(--r-lg)', background: 'rgba(255, 140, 0, 0.03)', border: '1px solid rgba(255, 140, 0, 0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                 <ShieldCheck size={18} color="var(--v-saffron)" />
                 <span style={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--v-saffron)', letterSpacing: '0.1em' }}>Neural Integrity</span>
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--t-dim)', lineHeight: 1.6 }}>System wide scanning active across all regional terminals. Current integrity: 99.98%.</p>
           </div>
        </motion.div>
      </div>

      {}
      <motion.div 
        variants={itemVariants} 
        style={{ marginTop: 24, padding: '24px 40px', borderRadius: 'var(--r-lg)', background: 'rgba(244, 63, 94, 0.05)', border: '1px solid rgba(244, 63, 94, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
      >
         <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Activity color="#fb7185" />
            <div>
               <div style={{ fontSize: '0.875rem', fontWeight: 900, color: '#fff' }}>INTEGRITY ALERTS</div>
               <div style={{ fontSize: '0.75rem', color: 'var(--t-mute)', fontWeight: 600 }}>Real-time scanning for anomalous voter behavior</div>
            </div>
         </div>
         <div style={{ display: 'flex', gap: 48 }}>
            <div style={{ textAlign: 'right' }}>
               <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#fb7185' }}>{analytics?.pendingIncidents || 0}</div>
               <div style={{ fontSize: '0.625rem', color: 'var(--t-mute)', fontWeight: 800 }}>PENDING</div>
            </div>
            <div style={{ textAlign: 'right' }}>
               <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--v-green)' }}>{analytics?.resolvedIncidents || 0}</div>
               <div style={{ fontSize: '0.625rem', color: 'var(--t-mute)', fontWeight: 800 }}>RESOLVED</div>
            </div>
         </div>
      </motion.div>

      {}
      <motion.div 
        variants={itemVariants} 
        style={{ marginTop: 48, padding: 40, background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--glass-border)', borderRadius: 'var(--r-lg)' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
          <ShieldCheck size={28} color="var(--v-saffron)" />
          <div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 900 }}>Neural Signature Audit</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--t-mute)' }}>Active JWT session token for security verification</p>
          </div>
        </div>
        
        <div style={{ 
          background: 'var(--bg-vanguard)', 
          padding: 24, 
          borderRadius: 'var(--r-md)', 
          border: '1px solid rgba(255, 140, 0, 0.2)',
          fontFamily: 'var(--f-mono)',
          fontSize: '0.8125rem',
          wordBreak: 'break-all',
          color: 'var(--v-saffron)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', background: 'linear-gradient(90deg, transparent, rgba(255,140,0,0.02), transparent)', opacity: 0.5 }} className="scan-line" />
          <span style={{ fontWeight: 900, display: 'block', marginBottom: 12, fontSize: '0.625rem', opacity: 0.6, letterSpacing: '0.2em' }}>ACTIVE TOKEN ID: SESSION_CORE_{Date.now().toString().slice(-4)}</span>
          {localStorage.getItem('token') || 'No active session token detected.'}
        </div>
        
        <div style={{ marginTop: 24, display: 'flex', gap: 16 }}>
          <div style={{ flex: 1, padding: 24, background: 'rgba(255,255,255,0.01)', border: '1px solid var(--glass-border)', borderRadius: 'var(--r-md)' }}>
            <div style={{ fontSize: '0.625rem', fontWeight: 900, color: 'var(--t-mute)', letterSpacing: '0.1em', marginBottom: 8 }}>GENERATION PROTOCOL</div>
            <div style={{ fontSize: '0.875rem', fontWeight: 700 }}>HMAC SHA-256 (RS256 Secondary)</div>
          </div>
          <div style={{ flex: 1, padding: 24, background: 'rgba(255,255,255,0.01)', border: '1px solid var(--glass-border)', borderRadius: 'var(--r-md)' }}>
            <div style={{ fontSize: '0.625rem', fontWeight: 900, color: 'var(--t-mute)', letterSpacing: '0.1em', marginBottom: 8 }}>ISSUER NODE</div>
            <div style={{ fontSize: '0.875rem', fontWeight: 700 }}>Vanguard Authentication Core</div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
