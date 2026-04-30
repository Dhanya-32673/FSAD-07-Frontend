import { useState, useEffect } from 'react';
import API from '../../api/axios';
import { 
  Vote, 
  Clock, 
  CheckCircle, 
  Trophy, 
  Landmark, 
  Fingerprint, 
  ShieldCheck, 
  Zap, 
  Sparkles, 
  ChevronRight,
  MapPin,
  Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CitizenDashboard() {
  const [elections, setElections] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      API.get('/elections'),
      API.get('/votes/history').catch(() => ({ data: [] }))
    ]).then(([eRes, hRes]) => {
      setElections(eRes.data);
      setHistory(hRes.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const active = elections.filter(e => e.status === 'ACTIVE');
  const upcoming = elections.filter(e => e.status === 'UPCOMING');

  if (loading) return (
    <div className="loading-screen">
      <div style={{ textAlign: 'center' }}>
        <div className="v-spinner" style={{ margin: '0 auto 24px' }} />
        <div style={{ fontSize: '0.625rem', fontWeight: 900, color: 'var(--v-green)', letterSpacing: '0.3em' }}>INITIALIZING VOTER GRID...</div>
      </div>
    </div>
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.98 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', damping: 20 } }
  };

  return (
    <motion.div 
      initial="hidden" 
      animate="visible" 
      variants={containerVariants}
      style={{ padding: '40px' }}
    >
      {}
      <motion.div variants={itemVariants} style={{ marginBottom: 48 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <div className="pulse-saffron" style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--v-saffron)' }} />
          <span style={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--v-saffron)', letterSpacing: '0.2em' }}>CITIZEN PROTOCOL</span>
        </div>
        <h1 className="gradient-text-vanguard" style={{ fontSize: '3.50rem', lineHeight: 1 }}>Citizen Hub</h1>
        <p style={{ color: 'var(--t-dim)', fontSize: '1.25rem', marginTop: 12, fontWeight: 500 }}>
          Your digital gateway to national governance and democratic participation.
        </p>
      </motion.div>

      {}
      <div className="grid grid-4" style={{ marginBottom: '40px' }}>
        {[
          { label: 'Active Booths', value: active.length, icon: Landmark, color: 'var(--v-saffron)' },
          { label: 'Upcoming Events', value: upcoming.length, icon: Zap, color: 'var(--v-white)' },
          { label: 'Verified Votes', value: history.length, icon: Fingerprint, color: 'var(--v-green)' },
          { label: 'Total Indices', value: elections.length, icon: Vote, color: '#6366f1' },
        ].map((s, i) => (
          <motion.div 
            key={i} 
            variants={itemVariants}
            whileHover={{ y: -10, background: 'rgba(255,255,255,0.03)' }}
            className="v-card"
            style={{ padding: 28 }}
          >
            <div style={{ width: 44, height: 44, borderRadius: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
              <s.icon size={22} color={s.color} />
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: '#fff', lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: '0.6875rem', fontWeight: 800, color: 'var(--t-mute)', marginTop: 8, letterSpacing: '0.1em' }}>{s.label.toUpperCase()}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
        {}
        <motion.div variants={itemVariants} className="v-card" style={{ padding: 40 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
            <Sparkles size={24} color="var(--v-saffron)" />
            <h3 style={{ fontSize: '1.5rem', fontWeight: 900 }}>Live Electoral Booths</h3>
          </div>
          
          <AnimatePresence>
            {active.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                style={{ padding: '60px 40px', textAlign: 'center', border: '1px dashed var(--glass-border)', borderRadius: 'var(--r-lg)', background: 'rgba(255,255,255,0.01)' }}
              >
                <Activity size={32} color="var(--t-mute)" style={{ margin: '0 auto 16px' }} />
                <p style={{ color: 'var(--t-dim)', fontWeight: 500 }}>The grid is currently quiet. No active elections detected in your sector.</p>
              </motion.div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {active.map(el => (
                  <motion.div 
                    key={el.id} 
                    whileHover={{ scale: 1.01, background: 'rgba(255,255,255,0.02)' }}
                    style={{ padding: '24px', background: 'rgba(255,255,255,0.01)', borderRadius: 'var(--r-md)', border: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--v-green)', boxShadow: '0 0 10px var(--v-green)' }} />
                        <div style={{ fontWeight: 800, color: '#fff', fontSize: '1.125rem' }}>{el.title}</div>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--t-dim)', marginTop: 8, display: 'flex', alignItems: 'center', gap: 16 }}>
                         <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><MapPin size={12} /> NEW DELHI SECTOR</span>
                         <span style={{ color: 'var(--v-saffron)', fontWeight: 800 }}>{el.electionType}</span>
                      </div>
                    </div>
                    <button className="btn-vanguard btn-v-primary" style={{ padding: '12px 24px', fontSize: '0.8125rem' }}>ENTER BOOTH</button>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </motion.div>

        {}
        <motion.div variants={itemVariants} className="v-card" style={{ padding: 40 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
            <Trophy size={24} color="var(--v-green)" />
            <h3 style={{ fontSize: '1.5rem', fontWeight: 900 }}>Electoral Participation</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {history.length === 0 ? (
               <div style={{ padding: '60px 40px', textAlign: 'center', border: '1px dashed var(--glass-border)', borderRadius: 'var(--r-lg)', background: 'rgba(255,255,255,0.01)' }}>
                  <Fingerprint size={32} color="var(--t-mute)" style={{ margin: '0 auto 16px' }} />
                  <p style={{ color: 'var(--t-dim)', fontWeight: 500 }}>No cryptographic history found. Be the change by participating.</p>
               </div>
            ) : (
              history.map((v, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', background: 'rgba(255,255,255,0.01)', borderRadius: '16px', border: '1px solid var(--glass-border)' }}>
                  <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
                     <div style={{ width: 44, height: 44, borderRadius: '12px', background: 'rgba(0, 255, 136, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--v-green)' }}>
                        <CheckCircle size={20} />
                     </div>
                     <div>
                        <div style={{ fontWeight: 800, color: '#fff', fontSize: '0.9375rem' }}>{v.electionTitle}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--v-green)', marginTop: 4, fontWeight: 900 }}>VOTED: {v.candidateName.toUpperCase()}</div>
                     </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--t-mute)', fontWeight: 800 }}>{v.votedAt ? new Date(v.votedAt).toLocaleDateString() : 'VERIFIED'}</div>
                    <div style={{ fontSize: '0.625rem', color: 'var(--v-saffron)', marginTop: 4, fontWeight: 900, letterSpacing: '0.1em' }}>LEDGER SECURE</div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div style={{ marginTop: 40, padding: '32px', borderRadius: 'var(--r-lg)', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--glass-border)' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <ShieldCheck size={20} color="var(--v-green)" />
                <span style={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--v-green)', letterSpacing: '0.1em' }}>Voter Protection Active</span>
             </div>
             <p style={{ fontSize: '0.875rem', color: 'var(--t-dim)', lineHeight: 1.6 }}>Your identity is protected by the National Cryptographic Protocol. Every vote is a building block of Bharat's future.</p>
          </div>
        </motion.div>
      </div>

      {/* Footer Branded Status */}
      <div style={{ marginTop: 60, textAlign: 'center', opacity: 0.3 }}>
          <div style={{ fontSize: '0.6875rem', fontWeight: 900, color: 'var(--t-mute)', letterSpacing: '0.4em' }}>BHARAT VANGUARD • CITIZEN GATEWAY • EST. 2026</div>
      </div>
    </motion.div>
  );
}
