import { useState, useEffect } from 'react';
import API from '../../api/axios';
import { Map, Landmark, Calendar, Users, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const STATUS_COLORS = {
  ACTIVE: 'var(--v-green)',
  UPCOMING: 'var(--v-saffron)',
  COMPLETED: 'var(--t-mute)',
  CANCELLED: '#fb7185',
};

export default function ElectionMap() {
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    API.get('/elections')
      .then(r => { setElections(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const statuses = ['ALL', 'ACTIVE', 'UPCOMING', 'COMPLETED'];
  const filtered = filter === 'ALL' ? elections : elections.filter(e => e.status === filter);

  const counts = {
    ALL: elections.length,
    ACTIVE: elections.filter(e => e.status === 'ACTIVE').length,
    UPCOMING: elections.filter(e => e.status === 'UPCOMING').length,
    COMPLETED: elections.filter(e => e.status === 'COMPLETED').length,
  };

  if (loading) return (
    <div className="loading-screen">
      <div className="v-spinner" style={{ margin: '0 auto 24px' }} />
      <div style={{ fontSize: '0.625rem', fontWeight: 900, color: 'var(--v-green)', letterSpacing: '0.3em' }}>MAPPING GRID...</div>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ padding: 40 }}>
      <div style={{ marginBottom: 40 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--v-green)', boxShadow: '0 0 10px var(--v-green)' }} />
          <span style={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--v-green)', letterSpacing: '0.2em' }}>GLOBAL GRID</span>
        </div>
        <h1 style={{ fontSize: '3rem', fontWeight: 900, color: '#fff', lineHeight: 1 }}>Election Map</h1>
        <p style={{ color: 'var(--t-dim)', marginTop: 12 }}>Live overview of all electoral events across the nation</p>
      </div>

      {}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 32 }}>
        {statuses.map(s => (
          <motion.button
            key={s}
            whileHover={{ y: -4 }}
            onClick={() => setFilter(s)}
            style={{
              padding: '20px 24px',
              borderRadius: 'var(--r-md)',
              background: filter === s ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.02)',
              border: `1px solid ${filter === s ? (STATUS_COLORS[s] || 'var(--glass-border)') : 'var(--glass-border)'}`,
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            <div style={{ fontSize: '1.75rem', fontWeight: 900, color: STATUS_COLORS[s] || '#fff' }}>{counts[s]}</div>
            <div style={{ fontSize: '0.625rem', fontWeight: 900, color: 'var(--t-mute)', letterSpacing: '0.15em', marginTop: 8 }}>{s}</div>
          </motion.button>
        ))}
      </div>

      {}
      {filtered.length === 0 ? (
        <div className="v-card" style={{ padding: 60, textAlign: 'center' }}>
          <Map size={48} color="var(--t-mute)" style={{ marginBottom: 16 }} />
          <p style={{ color: 'var(--t-mute)' }}>No elections found for this filter.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 20 }}>
          {filtered.map((e, i) => (
            <motion.div key={e.id} whileHover={{ y: -6 }} className="v-card" style={{ padding: 28 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                <div style={{ width: 44, height: 44, borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Landmark size={20} color="var(--v-saffron)" />
                </div>
                <span style={{ padding: '5px 12px', borderRadius: 'var(--r-full)', background: `${STATUS_COLORS[e.status]}15`, border: `1px solid ${STATUS_COLORS[e.status]}40`, color: STATUS_COLORS[e.status], fontSize: '0.625rem', fontWeight: 900, letterSpacing: '0.1em' }}>
                  {e.status}
                </span>
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#fff', marginBottom: 8, lineHeight: 1.4 }}>{e.title}</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--t-mute)', marginBottom: 16, lineHeight: 1.5 }}>{e.description?.substring(0, 80) || 'National electoral event.'}{e.description?.length > 80 ? '...' : ''}</p>
              <div style={{ display: 'flex', gap: 16, fontSize: '0.75rem', color: 'var(--t-dim)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Calendar size={12} />{new Date(e.startDate).toLocaleDateString()}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Users size={12} />{(e.candidates || []).length} candidates</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Zap size={12} />{e.electionType}</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
