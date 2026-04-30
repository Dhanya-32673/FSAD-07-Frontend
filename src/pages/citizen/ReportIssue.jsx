import { useState, useEffect } from 'react';
import API from '../../api/axios';
import { Send, AlertTriangle } from 'lucide-react';

export default function ReportIssue() {
  const [elections, setElections] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', category: 'IRREGULARITY', severity: 'MEDIUM', location: '', electionId: '' });
  const [message, setMessage] = useState('');
  const [myReports, setMyReports] = useState([]);

  useEffect(() => {
    API.get('/elections').then(r => setElections(r.data));
    API.get('/incidents/my-reports').then(r => setMyReports(r.data)).catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/incidents', { ...form, electionId: parseInt(form.electionId) });
      setMessage('Incident reported successfully!');
      setForm({ title: '', description: '', category: 'IRREGULARITY', severity: 'MEDIUM', location: '', electionId: '' });
      API.get('/incidents/my-reports').then(r => setMyReports(r.data));
    } catch (err) {
      setMessage('Failed: ' + (err.response?.data?.message || 'Unknown error'));
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header"><h1>Report an Issue</h1><p>Help keep elections fair by reporting irregularities</p></div>
      <div className="grid grid-2">
        <div className="glass-card" style={{ padding: 24 }}>
          <h3 style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}><AlertTriangle size={20} style={{ color: 'var(--warn-500)' }} /> New Report</h3>
          {message && <div style={{ padding: 12, background: 'rgba(16,185,129,0.1)', borderRadius: 'var(--radius-md)', color: 'var(--accent-400)', marginBottom: 16, fontSize: '0.875rem' }}>{message}</div>}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="form-group"><label>Election</label><select className="form-select" value={form.electionId} onChange={e => setForm({ ...form, electionId: e.target.value })} required><option value="">Select election</option>{elections.map(el => <option key={el.id} value={el.id}>{el.title}</option>)}</select></div>
            <div className="form-group"><label>Title</label><input className="form-input" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Brief description" required /></div>
            <div className="form-group"><label>Description</label><textarea className="form-textarea" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Detailed description of the issue" required /></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div className="form-group"><label>Category</label><select className="form-select" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}><option value="FRAUD">Fraud</option><option value="IRREGULARITY">Irregularity</option><option value="VIOLENCE">Violence</option><option value="TECHNICAL">Technical</option><option value="OTHER">Other</option></select></div>
              <div className="form-group"><label>Severity</label><select className="form-select" value={form.severity} onChange={e => setForm({ ...form, severity: e.target.value })}><option value="LOW">Low</option><option value="MEDIUM">Medium</option><option value="HIGH">High</option><option value="CRITICAL">Critical</option></select></div>
            </div>
            <div className="form-group"><label>Location</label><input className="form-input" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="Polling station or area" /></div>
            <button type="submit" className="btn btn-primary btn-lg w-full"><Send size={18} /> Submit Report</button>
          </form>
        </div>

        <div className="glass-card" style={{ padding: 24 }}>
          <h3 style={{ marginBottom: 16 }}>My Reports ({myReports.length})</h3>
          {myReports.length === 0 ? <p className="text-muted text-sm">No reports submitted yet.</p> :
            myReports.map(r => (
              <div key={r.id} style={{ padding: 12, marginBottom: 8, background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{r.title}</span>
                  <span className={`badge ${r.status === 'RESOLVED' ? 'badge-accent' : r.status === 'REPORTED' ? 'badge-warn' : 'badge-primary'}`}>{r.status}</span>
                </div>
                <div className="text-xs text-muted">{r.category} • {r.severity}</div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
}
