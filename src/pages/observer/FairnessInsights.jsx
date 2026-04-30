import { useState, useEffect } from 'react';
import API from '../../api/axios';
import { TrendingUp, Shield, AlertTriangle, CheckCircle } from 'lucide-react';

export default function FairnessInsights() {
  const [analytics, setAnalytics] = useState(null);
  const [incidents, setIncidents] = useState([]);

  useEffect(() => {
    API.get('/analytics').then(r => setAnalytics(r.data)).catch(() => {});
    API.get('/incidents').then(r => setIncidents(r.data));
  }, []);

  const resolved = incidents.filter(i => i.status === 'RESOLVED').length;
  const total = incidents.length;
  const resolutionRate = total > 0 ? ((resolved / total) * 100).toFixed(1) : 100;

  return (
    <div className="animate-fade-in">
      <div className="page-header"><h1>Fairness Insights</h1><p>Election transparency and fairness analysis</p></div>

      <div className="grid grid-3" style={{ marginBottom: 24 }}>
        <div className="glass-card stat-card">
          <div className="stat-icon" style={{ background: 'rgba(16,185,129,0.12)' }}><Shield size={24} style={{ color: 'var(--accent-500)' }} /></div>
          <div className="stat-value" style={{ color: 'var(--accent-500)' }}>{resolutionRate}%</div>
          <div className="stat-label">Incident Resolution Rate</div>
        </div>
        <div className="glass-card stat-card">
          <div className="stat-icon" style={{ background: 'rgba(245,158,11,0.12)' }}><AlertTriangle size={24} style={{ color: 'var(--warn-500)' }} /></div>
          <div className="stat-value" style={{ color: 'var(--warn-500)' }}>{total}</div>
          <div className="stat-label">Total Incidents Reported</div>
        </div>
        <div className="glass-card stat-card">
          <div className="stat-icon" style={{ background: 'rgba(99,102,241,0.12)' }}><TrendingUp size={24} style={{ color: 'var(--primary-500)' }} /></div>
          <div className="stat-value" style={{ color: 'var(--primary-500)' }}>{analytics?.overallTurnoutPercentage || 0}%</div>
          <div className="stat-label">Overall Voter Turnout</div>
        </div>
      </div>

      <div className="grid grid-2">
        <div className="glass-card" style={{ padding: 24 }}>
          <h3 style={{ marginBottom: 16 }}>Incidents by Category</h3>
          {analytics?.incidentsByCategory && Object.entries(analytics.incidentsByCategory).map(([cat, count]) => (
            <div key={cat} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border-glass)', fontSize: '0.875rem' }}>
              <span>{cat}</span>
              <span className={`badge ${count > 0 ? 'badge-warn' : 'badge-neutral'}`}>{count}</span>
            </div>
          ))}
        </div>

        <div className="glass-card" style={{ padding: 24 }}>
          <h3 style={{ marginBottom: 16 }}>Incidents by Severity</h3>
          {analytics?.incidentsBySeverity && Object.entries(analytics.incidentsBySeverity).map(([sev, count]) => {
            const colors = { LOW: 'var(--accent-500)', MEDIUM: 'var(--warn-500)', HIGH: 'var(--danger-500)', CRITICAL: 'var(--danger-400)' };
            return (
              <div key={sev} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: '0.875rem' }}>
                  <span>{sev}</span><span style={{ fontWeight: 600 }}>{count}</span>
                </div>
                <div style={{ height: 6, background: 'var(--bg-glass)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${total > 0 ? (count / total) * 100 : 0}%`, background: colors[sev], borderRadius: 'var(--radius-full)' }}></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {}
      <div className="glass-card" style={{ padding: 32, marginTop: 24, textAlign: 'center' }}>
        <h3 style={{ marginBottom: 16 }}>Election Fairness Score</h3>
        <div style={{
          width: 120, height: 120, borderRadius: '50%', margin: '0 auto 16px',
          background: `conic-gradient(var(--accent-500) ${resolutionRate * 3.6}deg, var(--bg-glass) 0deg)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            width: 96, height: 96, borderRadius: '50%', background: 'var(--bg-secondary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-400)',
          }}>{resolutionRate}%</div>
        </div>
        <p className="text-sm text-muted">Based on incident resolution rate and transparency metrics</p>
      </div>
    </div>
  );
}
