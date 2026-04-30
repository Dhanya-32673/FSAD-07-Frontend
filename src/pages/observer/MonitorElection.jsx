import { useState, useEffect } from 'react';
import API from '../../api/axios';
import { MapPin, RefreshCw } from 'lucide-react';

export default function MonitorElection() {
  const [stations, setStations] = useState([]);
  const [elections, setElections] = useState([]);
  const [filterElection, setFilterElection] = useState('');

  useEffect(() => {
    API.get('/elections').then(r => setElections(r.data));
    fetchStations();
  }, []);

  const fetchStations = () => {
    const url = filterElection ? `/polling-stations/election/${filterElection}` : '/polling-stations';
    API.get(url).then(r => setStations(r.data));
  };

  useEffect(() => { fetchStations(); }, [filterElection]);

  const updateStation = async (id, data) => { await API.put(`/polling-stations/${id}`, data); fetchStations(); };

  const statusColors = { NOT_STARTED: 'badge-neutral', IN_PROGRESS: 'badge-accent', COMPLETED: 'badge-primary' };

  return (
    <div className="animate-fade-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div><h1>Monitor Election</h1><p>Live polling station monitoring</p></div>
        <div style={{ display: 'flex', gap: 12 }}>
          <select className="form-select" value={filterElection} onChange={e => setFilterElection(e.target.value)} style={{ minWidth: 200 }}>
            <option value="">All Elections</option>
            {elections.map(el => <option key={el.id} value={el.id}>{el.title}</option>)}
          </select>
          <button className="btn btn-ghost" onClick={fetchStations}><RefreshCw size={16} /></button>
        </div>
      </div>

      <div className="grid grid-2">
        {stations.map(s => {
          const pct = s.totalVoters > 0 ? ((s.votesCast / s.totalVoters) * 100).toFixed(1) : 0;
          return (
            <div key={s.id} className="glass-card" style={{ padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <h4>{s.name}</h4>
                <span className={`badge ${statusColors[s.status]}`}>{s.status.replace('_', ' ')}</span>
              </div>
              <div className="text-sm text-muted" style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                <MapPin size={14} /> {s.location}
              </div>
              <div style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: '0.875rem' }}>
                  <span>Voter Turnout</span>
                  <span style={{ fontWeight: 700, color: 'var(--accent-400)' }}>{pct}%</span>
                </div>
                <div style={{ height: 8, background: 'var(--bg-glass)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg, var(--primary-500), var(--accent-500))', borderRadius: 'var(--radius-full)', transition: 'width 1s ease' }}></div>
                </div>
                <div className="text-xs text-muted" style={{ marginTop: 4 }}>{s.votesCast} / {s.totalVoters} voters</div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <select className="form-select" value={s.status}
                  onChange={e => updateStation(s.id, { status: e.target.value })}
                  style={{ fontSize: '0.75rem', padding: '6px 28px 6px 10px', flex: 1 }}>
                  <option value="NOT_STARTED">Not Started</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="COMPLETED">Completed</option>
                </select>
              </div>
            </div>
          );
        })}
      </div>
      {stations.length === 0 && <div className="glass-card" style={{ padding: 48, textAlign: 'center', color: 'var(--text-muted)' }}>No polling stations found.</div>}
    </div>
  );
}
