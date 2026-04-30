import { useState, useEffect } from 'react';
import API from '../../api/axios';
import { Shield, CheckCircle, XCircle, Clock } from 'lucide-react';

export default function SystemSecurity() {
  const [incidents, setIncidents] = useState([]);

  useEffect(() => { API.get('/incidents').then(r => setIncidents(r.data)); }, []);

  const updateStatus = async (id, status) => {
    await API.put(`/incidents/${id}/status`, { status });
    API.get('/incidents').then(r => setIncidents(r.data));
  };

  const sevColors = { LOW: 'badge-neutral', MEDIUM: 'badge-warn', HIGH: 'badge-danger', CRITICAL: 'badge-danger' };
  const statusColors = { REPORTED: 'badge-warn', UNDER_REVIEW: 'badge-primary', RESOLVED: 'badge-accent', DISMISSED: 'badge-neutral' };

  return (
    <div className="animate-fade-in">
      <div className="page-header" style={{ marginBottom: 40 }}>
        <h1 className="gradient-text-vanguard" style={{ fontSize: '2.5rem', marginBottom: 8 }}>Integrity Monitor</h1>
        <p style={{ color: 'var(--t-dim)' }}>Real-time security surveillance and anomaly resolution</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, marginBottom: 40 }}>
        {[
          { label: 'Active Alerts', count: incidents.filter(i => i.status === 'REPORTED').length, icon: Clock, color: 'var(--v-saffron)', bg: 'rgba(255, 140, 0, 0.05)', border: 'rgba(255, 140, 0, 0.2)' },
          { label: 'Neutralized', count: incidents.filter(i => i.status === 'RESOLVED').length, icon: CheckCircle, color: 'var(--v-green)', bg: 'rgba(0, 255, 136, 0.05)', border: 'rgba(0, 255, 136, 0.2)' },
          { label: 'Declassified', count: incidents.filter(i => i.status === 'DISMISSED').length, icon: XCircle, color: 'var(--t-dim)', bg: 'rgba(255, 255, 255, 0.03)', border: 'var(--glass-border)' },
        ].map((s, i) => (
          <div key={i} className="v-card" style={{ padding: 32, display: 'flex', alignItems: 'center', gap: 24 }}>
            <div style={{ width: 56, height: 56, borderRadius: '16px', background: s.bg, border: `1px solid ${s.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <s.icon size={28} style={{ color: s.color }} />
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: '#fff', lineHeight: 1 }}>{s.count}</div>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--t-mute)', letterSpacing: '0.1em', marginTop: 4 }}>{s.label.toUpperCase()}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="v-table-container">
        <table className="v-table">
          <thead>
            <tr>
              <th>Incident Vector</th>
              <th>Category</th>
              <th>Threat Level</th>
              <th>Current State</th>
              <th>Reporting Node</th>
              <th>Timestamp</th>
              <th>Protocol Update</th>
            </tr>
          </thead>
          <tbody>
            {incidents.map(inc => (
              <tr key={inc.id}>
                <td>
                  <div style={{ fontWeight: 700, color: 'var(--t-main)' }}>{inc.title}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--v-saffron)', fontWeight: 600 }}>{inc.electionTitle}</div>
                </td>
                <td><span className="v-badge v-badge-slate">{inc.category}</span></td>
                <td>
                  <span className={`v-badge ${
                    inc.severity === 'CRITICAL' || inc.severity === 'HIGH' ? 'v-badge-saffron' : 'v-badge-slate'
                  }`} style={inc.severity === 'CRITICAL' ? { background: '#ff444422', color: '#ff4444', borderColor: '#ff444444' } : {}}>
                    {inc.severity}
                  </span>
                </td>
                <td>
                  <span className={`v-badge ${
                    inc.status === 'RESOLVED' ? 'v-badge-green' : 
                    inc.status === 'REPORTED' ? 'v-badge-saffron' : 'v-badge-slate'
                  }`}>
                    {inc.status}
                  </span>
                </td>
                <td style={{ fontSize: '0.875rem', fontWeight: 600 }}>{inc.reportedByName}</td>
                <td style={{ fontSize: '0.8125rem', color: 'var(--t-dim)' }}>
                  {inc.reportedAt ? new Date(inc.reportedAt).toLocaleDateString() : '—'}
                </td>
                <td>
                  <select className="v-select" value={inc.status} onChange={e => updateStatus(inc.id, e.target.value)}
                    style={{ fontSize: '0.75rem', padding: '8px 12px', minWidth: 140 }}>
                    <option value="REPORTED">Reported</option>
                    <option value="UNDER_REVIEW">Under Review</option>
                    <option value="RESOLVED">Resolved</option>
                    <option value="DISMISSED">Dismissed</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {incidents.length === 0 && (
          <div style={{ padding: 64, textAlign: 'center', color: 'var(--t-dim)' }}>
            <Shield size={48} style={{ margin: '0 auto 16px', opacity: 0.2 }} />
            <p>Shields fully operational. No integrity breaches detected in the current cycle.</p>
          </div>
        )}
      </div>
    </div>
  );
}
