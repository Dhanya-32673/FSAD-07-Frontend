import { useState, useEffect } from 'react';
import API from '../../api/axios';

export default function ElectionTracker() {
  const [elections, setElections] = useState([]);
  useEffect(() => { API.get('/elections').then(r => setElections(r.data)); }, []);

  const statusColors = { ACTIVE: 'badge-accent', UPCOMING: 'badge-primary', COMPLETED: 'badge-neutral', CANCELLED: 'badge-danger' };

  return (
    <div className="animate-fade-in">
      <div className="page-header"><h1>Election Tracker</h1><p>Track all elections and their progress</p></div>
      <div className="grid grid-2">
        {elections.map(el => (
          <div key={el.id} className="glass-card" style={{ padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <span className={`badge ${statusColors[el.status]}`}>{el.status}</span>
              <span className="badge badge-primary">{el.electionType}</span>
            </div>
            <h3 style={{ marginBottom: 8 }}>{el.title}</h3>
            <p className="text-sm text-muted" style={{ marginBottom: 16 }}>{el.description}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              <span>📅 {el.startDate ? new Date(el.startDate).toLocaleDateString() : 'TBD'}</span>
              <span>🗳️ {el.totalVotes || 0} votes</span>
              <span>👥 {el.candidates?.length || 0} candidates</span>
            </div>
            {el.candidates?.length > 0 && (
              <div style={{ marginTop: 16, padding: 12, background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)' }}>
                <div className="text-xs font-bold text-muted" style={{ marginBottom: 8 }}>CANDIDATES</div>
                {el.candidates.map(c => (
                  <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '0.875rem' }}>
                    <span>{c.name}</span>
                    <span className="text-muted">{c.party}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
