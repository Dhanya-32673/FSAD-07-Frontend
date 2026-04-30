import { useState, useEffect } from 'react';
import API from '../../api/axios';
import { Database, User, Landmark, Search } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ManageCandidates() {
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    API.get('/elections')
      .then(r => { setElections(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const allCandidates = elections.flatMap(e =>
    (e.candidates || []).map(c => ({ ...c, electionTitle: e.title, electionId: e.id }))
  );

  const filtered = allCandidates.filter(c =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.party?.toLowerCase().includes(search.toLowerCase()) ||
    c.electionTitle?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div className="loading-screen">
      <div className="v-spinner" style={{ margin: '0 auto 24px' }} />
      <div style={{ fontSize: '0.625rem', fontWeight: 900, color: 'var(--v-saffron)', letterSpacing: '0.3em' }}>LOADING REGISTRY...</div>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ padding: 40 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <div className="pulse-saffron" style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--v-saffron)' }} />
            <span style={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--v-saffron)', letterSpacing: '0.2em' }}>CANDIDATE REGISTRY</span>
          </div>
          <h1 className="gradient-text-vanguard" style={{ fontSize: '3rem', lineHeight: 1 }}>Registry Logs</h1>
          <p style={{ color: 'var(--t-dim)', marginTop: 12 }}>{allCandidates.length} candidates across {elections.length} elections</p>
        </div>
      </div>

      {}
      <div className="v-card" style={{ padding: '16px 24px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
        <Search size={18} color="var(--t-mute)" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search candidates, parties, elections..."
          style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: '0.875rem' }}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="v-card" style={{ padding: 60, textAlign: 'center' }}>
          <Database size={48} color="var(--t-mute)" style={{ marginBottom: 16 }} />
          <p style={{ color: 'var(--t-mute)' }}>No candidates found. Add candidates via the Active Gates section.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
          {filtered.map((c, i) => (
            <motion.div key={c.id || i} whileHover={{ y: -4 }} className="v-card" style={{ padding: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
                <div style={{ width: 48, height: 48, borderRadius: '12px', background: 'rgba(255,140,0,0.1)', border: '1px solid rgba(255,140,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <User size={22} color="var(--v-saffron)" />
                </div>
                <div>
                  <div style={{ fontWeight: 900, color: '#fff', fontSize: '1rem' }}>{c.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--v-saffron)', fontWeight: 700 }}>{c.party}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--r-md)', border: '1px solid var(--glass-border)' }}>
                <Landmark size={14} color="var(--t-mute)" />
                <span style={{ fontSize: '0.75rem', color: 'var(--t-dim)', fontWeight: 600 }}>{c.electionTitle}</span>
              </div>
              {c.manifesto && (
                <p style={{ marginTop: 14, fontSize: '0.8rem', color: 'var(--t-mute)', lineHeight: 1.6 }}>{c.manifesto.substring(0, 100)}{c.manifesto.length > 100 ? '...' : ''}</p>
              )}
              <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                <span style={{ color: 'var(--t-mute)' }}>VOTE COUNT</span>
                <span style={{ color: 'var(--v-green)', fontWeight: 900 }}>{c.voteCount ?? 0}</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
