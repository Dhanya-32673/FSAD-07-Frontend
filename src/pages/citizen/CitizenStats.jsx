import { useState, useEffect } from 'react';
import API from '../../api/axios';
import { BarChart3, Landmark, Users, Vote, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CitizenStats() {
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/elections')
      .then(r => { setElections(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const totalVotes = elections.reduce((sum, e) => sum + (e.totalVotes || 0), 0);
  const totalCandidates = elections.reduce((sum, e) => sum + (e.candidates?.length || 0), 0);
  const activeCount = elections.filter(e => e.status === 'ACTIVE').length;
  const upcomingCount = elections.filter(e => e.status === 'UPCOMING').length;

  const summaryStats = [
    { label: 'Total Elections', value: elections.length, icon: Landmark, color: 'var(--v-saffron)' },
    { label: 'Active Now', value: activeCount, icon: TrendingUp, color: 'var(--v-green)' },
    { label: 'Total Candidates', value: totalCandidates, icon: Users, color: '#6366f1' },
    { label: 'Votes Cast', value: totalVotes, icon: Vote, color: '#fb7185' },
  ];

  if (loading) return (
    <div className="loading-screen">
      <div className="v-spinner" style={{ margin: '0 auto 24px' }} />
      <div style={{ fontSize: '0.625rem', fontWeight: 900, color: 'var(--v-green)', letterSpacing: '0.3em' }}>LOADING GRID...</div>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ padding: 40 }}>
      <div style={{ marginBottom: 40 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--v-green)', boxShadow: '0 0 10px var(--v-green)' }} />
          <span style={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--v-green)', letterSpacing: '0.2em' }}>GRID ANALYTICS</span>
        </div>
        <h1 style={{ fontSize: '3rem', fontWeight: 900, color: '#fff', lineHeight: 1 }}>Election Stats</h1>
        <p style={{ color: 'var(--t-dim)', marginTop: 12 }}>Real-time statistics from the national election grid</p>
      </div>

      {}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 40 }}>
        {summaryStats.map((s, i) => (
          <motion.div key={i} whileHover={{ y: -6 }} className="v-card" style={{ padding: 28 }}>
            <div style={{ width: 44, height: 44, borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
              <s.icon size={20} color={s.color} />
            </div>
            <div style={{ fontSize: '2.25rem', fontWeight: 900, color: '#fff', lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: '0.625rem', fontWeight: 900, color: 'var(--t-mute)', letterSpacing: '0.1em', marginTop: 10 }}>{s.label.toUpperCase()}</div>
          </motion.div>
        ))}
      </div>

      {}
      <div className="v-card" style={{ padding: 36 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
          <BarChart3 size={22} color="var(--v-green)" />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 900 }}>Election Breakdown</h3>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {elections.length === 0 ? (
            <p style={{ color: 'var(--t-mute)', textAlign: 'center', padding: 32 }}>No elections data available.</p>
          ) : elections.map((e, i) => {
            const maxVotes = Math.max(...elections.map(x => x.totalVotes || 0), 1);
            const pct = ((e.totalVotes || 0) / maxVotes * 100).toFixed(0);
            const statusColor = e.status === 'ACTIVE' ? 'var(--v-green)' : e.status === 'UPCOMING' ? 'var(--v-saffron)' : 'var(--t-mute)';
            return (
              <div key={e.id} style={{ padding: '20px 24px', borderRadius: 'var(--r-md)', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.01)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <div>
                    <span style={{ fontWeight: 800, color: '#fff', fontSize: '0.9rem' }}>{e.title}</span>
                    <span style={{ marginLeft: 12, padding: '2px 10px', borderRadius: 'var(--r-full)', background: `${statusColor}20`, color: statusColor, fontSize: '0.625rem', fontWeight: 900 }}>{e.status}</span>
                  </div>
                  <span style={{ fontSize: '0.875rem', fontWeight: 900, color: 'var(--v-green)' }}>{e.totalVotes || 0} votes</span>
                </div>
                <div style={{ height: 6, background: 'rgba(255,255,255,0.04)', borderRadius: 'var(--r-full)', overflow: 'hidden' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8, delay: i * 0.05 }}
                    style={{ height: '100%', background: statusColor, borderRadius: 'var(--r-full)' }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
