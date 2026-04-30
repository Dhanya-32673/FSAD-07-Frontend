import { useState, useEffect } from 'react';
import API from '../../api/axios';
import { PieChart as RePie, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line } from 'recharts';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6'];

export default function ElectionAnalytics() {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => { API.get('/analytics').then(r => setAnalytics(r.data)); }, []);

  if (!analytics) return <div className="loading-screen"><div className="spinner"></div></div>;

  const severityData = analytics.incidentsBySeverity ? Object.entries(analytics.incidentsBySeverity).filter(([, v]) => v > 0).map(([name, value]) => ({ name, value })) : [];
  const categoryData = analytics.incidentsByCategory ? Object.entries(analytics.incidentsByCategory).filter(([, v]) => v > 0).map(([name, value]) => ({ name, value })) : [];

  return (
    <div className="animate-fade-in">
      <div className="page-header"><h1>Election Analytics</h1><p>Deep dive into election statistics</p></div>

      <div className="grid grid-2" style={{ marginBottom: 24 }}>
        <div className="glass-card" style={{ padding: 24 }}>
          <h3 style={{ marginBottom: 16 }}>Incidents by Severity</h3>
          {severityData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <RePie>
                <Pie data={severityData} cx="50%" cy="50%" outerRadius={90} innerRadius={40} dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {severityData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#f1f5f9' }} />
              </RePie>
            </ResponsiveContainer>
          ) : <p className="text-muted text-center" style={{ padding: 40 }}>No incidents reported</p>}
        </div>

        <div className="glass-card" style={{ padding: 24 }}>
          <h3 style={{ marginBottom: 16 }}>Incidents by Category</h3>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#f1f5f9' }} />
                <Bar dataKey="value" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <p className="text-muted text-center" style={{ padding: 40 }}>No incidents reported</p>}
        </div>
      </div>

      {}
      <div className="glass-card" style={{ padding: 24 }}>
        <h3 style={{ marginBottom: 16 }}>Election Comparison</h3>
        <table className="data-table">
          <thead><tr><th>Election</th><th>Status</th><th>Candidates</th><th>Total Votes</th><th>Incidents</th></tr></thead>
          <tbody>
            {analytics.electionAnalytics?.map(el => (
              <tr key={el.electionId}>
                <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{el.electionTitle}</td>
                <td><span className={`badge ${el.status === 'ACTIVE' ? 'badge-accent' : el.status === 'UPCOMING' ? 'badge-primary' : 'badge-neutral'}`}>{el.status}</span></td>
                <td>{el.totalCandidates}</td>
                <td style={{ fontWeight: 600 }}>{el.totalVotes}</td>
                <td><span className={`badge ${el.totalIncidents > 0 ? 'badge-warn' : 'badge-accent'}`}>{el.totalIncidents}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
