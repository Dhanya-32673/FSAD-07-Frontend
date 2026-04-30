import { useState, useEffect } from 'react';
import API from '../../api/axios';
import { Eye, MapPin, AlertTriangle, CheckCircle, Clock, Sparkles, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ObserverDashboard() {
  const [stations, setStations] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      API.get('/polling-stations'),
      API.get('/incidents/my-reports').catch(() => ({ data: [] })),
      API.get('/elections')
    ]).then(([sRes, iRes, eRes]) => {
      setStations(sRes.data);
      setIncidents(iRes.data);
      setElections(eRes.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="loading-screen">
      <div style={{ textAlign: 'center' }}>
        <div className="v-spinner" style={{ margin: '0 auto 24px' }} />
        <div style={{ fontSize: '0.625rem', fontWeight: 900, color: 'var(--v-aqua)', letterSpacing: '0.3em' }}>INITIALIZING OBSERVER GRID...</div>
      </div>
    </div>
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  const activeElections = elections.filter(e => e.status === 'ACTIVE');
  const totalVoters = stations.reduce((a, s) => a + s.totalVoters, 0);
  const totalCast = stations.reduce((a, s) => a + s.votesCast, 0);
  const turnout = totalVoters > 0 ? ((totalCast / totalVoters) * 100).toFixed(1) : 0;

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants} style={{ padding: '40px' }}>
      {}
      <motion.div variants={itemVariants} style={{ marginBottom: 48 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <div className="pulse-aqua" style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--v-aqua)' }} />
          <span style={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--v-aqua)', letterSpacing: '0.2em' }}>OBSERVER PROTOCOL</span>
        </div>
        <h1 className="gradient-text-vanguard" style={{ fontSize: '3.50rem', lineHeight: 1 }}>Observer Command</h1>
        <p style={{ color: 'var(--t-dim)', fontSize: '1.25rem', marginTop: 12, fontWeight: 500 }}>
          Monitor election activities and ensure integrity across the national grid.
        </p>
      </motion.div>

      <div className="grid grid-4" style={{ marginBottom: 32 }}>
        {[
          { label: 'Active Elections', value: activeElections.length, icon: Eye, color: 'var(--v-aqua)', bg: 'rgba(0,255,255,0.05)' },
          { label: 'Polling Stations', value: stations.length, icon: MapPin, color: 'var(--v-white)', bg: 'rgba(255,255,255,0.05)' },
          { label: 'Voter Turnout', value: `${turnout}%`, icon: CheckCircle, color: 'var(--v-green)', bg: 'rgba(0,255,136,0.05)' },
          { label: 'My Reports', value: incidents.length, icon: AlertTriangle, color: 'var(--v-saffron)', bg: 'rgba(255,153,51,0.05)' },
        ].map((s, i) => (
          <motion.div key={i} variants={itemVariants} className="glass-card stat-card">
            <div className="stat-icon" style={{ background: s.bg }}><s.icon size={24} style={{ color: s.color }} /></div>
            <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-2">
        <motion.div variants={itemVariants} className="glass-card" style={{ padding: 24 }}>
          <h3 style={{ marginBottom: 16 }}>Polling Station Status</h3>
          {stations.slice(0, 6).map(s => {
            const pct = s.totalVoters > 0 ? ((s.votesCast / s.totalVoters) * 100).toFixed(0) : 0;
            const statusColors = { NOT_STARTED: 'var(--t-mute)', IN_PROGRESS: 'var(--v-aqua)', COMPLETED: 'var(--v-green)' };
            return (
              <div key={s.id} style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: '0.875rem' }}>
                  <span style={{ fontWeight: 600 }}>{s.name}</span>
                  <span className="text-xs text-muted" style={{ color: 'var(--t-mute)' }}>{s.votesCast}/{s.totalVoters} ({pct}%)</span>
                </div>
                <div style={{ height: 6, background: 'rgba(255,255,255,0.05)', borderRadius: 10, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: statusColors[s.status], transition: 'width 1s ease' }}></div>
                </div>
                <div style={{ fontSize: '0.625rem', color: 'var(--t-dim)', marginTop: 4 }}>{s.location} • {s.status.replace('_', ' ')}</div>
              </div>
            );
          })}
        </motion.div>

        <motion.div variants={itemVariants} className="glass-card" style={{ padding: 24 }}>
          <h3 style={{ marginBottom: 16 }}>Recent Reports</h3>
          {incidents.length === 0 ? <p style={{ color: 'var(--t-dim)', fontSize: '0.875rem' }}>No reports submitted yet.</p> :
            incidents.slice(0, 5).map(inc => (
              <div key={inc.id} style={{ padding: 12, marginBottom: 8, background: 'rgba(255,255,255,0.02)', borderRadius: 8, border: '1px solid var(--glass-border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{inc.title}</span>
                  <span className={`badge ${inc.severity === 'CRITICAL' || inc.severity === 'HIGH' ? 'badge-danger' : 'badge-warn'}`}>{inc.severity}</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--t-dim)' }}>{inc.category} • {inc.status}</div>
              </div>
            ))
          }
        </motion.div>
      </div>
    </motion.div>
  );
}
