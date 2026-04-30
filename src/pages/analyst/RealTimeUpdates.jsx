import { useState, useEffect } from 'react';
import API from '../../api/axios';
import { Radio, RefreshCw } from 'lucide-react';

export default function RealTimeUpdates() {
  const [elections, setElections] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [autoRefresh, setAutoRefresh] = useState(false);

  const refresh = () => {
    API.get('/elections').then(r => setElections(r.data));
    API.get('/incidents').then(r => setIncidents(r.data));
    setLastUpdate(new Date());
  };

  useEffect(() => { refresh(); }, []);

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(refresh, 5000);
    return () => clearInterval(interval);
  }, [autoRefresh]);

  return (
    <div className="animate-fade-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div><h1>Real-Time Updates</h1><p>Live election data feed</p></div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div className="text-xs text-muted">Last update: {lastUpdate.toLocaleTimeString()}</div>
          <button className={`btn ${autoRefresh ? 'btn-accent' : 'btn-ghost'}`} onClick={() => setAutoRefresh(!autoRefresh)}>
            <Radio size={16} /> {autoRefresh ? 'Live' : 'Paused'}
          </button>
          <button className="btn btn-ghost" onClick={refresh}><RefreshCw size={16} /></button>
        </div>
      </div>

      <div className="grid grid-2">
        <div className="glass-card" style={{ padding: 24 }}>
          <h3 style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            {autoRefresh && <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent-500)', animation: 'pulse 2s infinite' }}></span>}
            Live Election Status
          </h3>
          {elections.map(el => (
            <div key={el.id} style={{ padding: 14, marginBottom: 8, background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{el.title}</span>
                <span className={`badge ${el.status === 'ACTIVE' ? 'badge-accent' : el.status === 'UPCOMING' ? 'badge-primary' : 'badge-neutral'}`}>{el.status}</span>
              </div>
              <div className="text-xs text-muted">{el.totalVotes || 0} votes • {el.candidates?.length || 0} candidates</div>
            </div>
          ))}
        </div>

        <div className="glass-card" style={{ padding: 24 }}>
          <h3 style={{ marginBottom: 16 }}>Recent Incidents</h3>
          {incidents.slice(0, 10).map(inc => (
            <div key={inc.id} style={{ padding: 12, marginBottom: 8, background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span className="text-sm" style={{ fontWeight: 600 }}>{inc.title}</span>
                <span className={`badge ${inc.severity === 'CRITICAL' ? 'badge-danger' : inc.severity === 'HIGH' ? 'badge-danger' : 'badge-warn'}`}>{inc.severity}</span>
              </div>
              <div className="text-xs text-muted">{inc.electionTitle} • {inc.category} • {inc.reportedAt ? new Date(inc.reportedAt).toLocaleString() : ''}</div>
            </div>
          ))}
          {incidents.length === 0 && <p className="text-muted text-sm">No incidents to display.</p>}
        </div>
      </div>
    </div>
  );
}
