import { useState, useEffect } from 'react';
import API from '../../api/axios';
import { Download, FileText } from 'lucide-react';

export default function GenerateReports() {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => { API.get('/analytics').then(r => setAnalytics(r.data)); }, []);

  const exportCSV = () => {
    if (!analytics) return;
    let csv = 'Election,Status,Candidates,TotalVotes,Incidents\n';
    analytics.electionAnalytics?.forEach(el => {
      csv += `"${el.electionTitle}",${el.status},${el.totalCandidates},${el.totalVotes},${el.totalIncidents}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'election_report.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  const exportJSON = () => {
    if (!analytics) return;
    const blob = new Blob([JSON.stringify(analytics, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'election_report.json'; a.click();
    URL.revokeObjectURL(url);
  };

  if (!analytics) return <div className="loading-screen"><div className="spinner"></div></div>;

  return (
    <div className="animate-fade-in">
      <div className="page-header"><h1>Generate Reports</h1><p>Export election data and analytics</p></div>

      <div className="grid grid-2" style={{ marginBottom: 24 }}>
        <div className="glass-card" style={{ padding: 32, textAlign: 'center' }}>
          <FileText size={48} style={{ color: 'var(--primary-500)', marginBottom: 16 }} />
          <h3 style={{ marginBottom: 8 }}>CSV Report</h3>
          <p className="text-sm text-muted" style={{ marginBottom: 20 }}>Export election summary data as a CSV spreadsheet</p>
          <button className="btn btn-primary btn-lg" onClick={exportCSV}><Download size={18} /> Download CSV</button>
        </div>
        <div className="glass-card" style={{ padding: 32, textAlign: 'center' }}>
          <FileText size={48} style={{ color: 'var(--accent-500)', marginBottom: 16 }} />
          <h3 style={{ marginBottom: 8 }}>JSON Report</h3>
          <p className="text-sm text-muted" style={{ marginBottom: 20 }}>Export complete analytics data as JSON</p>
          <button className="btn btn-accent btn-lg" onClick={exportJSON}><Download size={18} /> Download JSON</button>
        </div>
      </div>

      {}
      <div className="glass-card" style={{ padding: 24 }}>
        <h3 style={{ marginBottom: 16 }}>Report Summary</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          <div style={{ padding: 16, background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)' }}>
            <div className="text-xs text-muted font-bold" style={{ textTransform: 'uppercase', marginBottom: 8 }}>Elections</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{analytics.totalElections}</div>
            <div className="text-xs text-muted">{analytics.activeElections} active</div>
          </div>
          <div style={{ padding: 16, background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)' }}>
            <div className="text-xs text-muted font-bold" style={{ textTransform: 'uppercase', marginBottom: 8 }}>Votes</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{analytics.totalVotesCast}</div>
            <div className="text-xs text-muted">{analytics.overallTurnoutPercentage}% turnout</div>
          </div>
          <div style={{ padding: 16, background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)' }}>
            <div className="text-xs text-muted font-bold" style={{ textTransform: 'uppercase', marginBottom: 8 }}>Incidents</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{analytics.totalIncidents}</div>
            <div className="text-xs text-muted">{analytics.resolvedIncidents} resolved</div>
          </div>
        </div>
      </div>
    </div>
  );
}
