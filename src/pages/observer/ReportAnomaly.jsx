import { useState, useEffect } from 'react';
import API from '../../api/axios';
import { Send } from 'lucide-react';

export default function ReportAnomaly() {
  const [elections, setElections] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', category: 'FRAUD', severity: 'HIGH', location: '', electionId: '' });
  const [message, setMessage] = useState('');

  useEffect(() => { API.get('/elections').then(r => setElections(r.data)); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/incidents', { ...form, electionId: parseInt(form.electionId) });
      setMessage('Anomaly reported successfully!');
      setForm({ title: '', description: '', category: 'FRAUD', severity: 'HIGH', location: '', electionId: '' });
    } catch (err) {
      setMessage('Error: ' + (err.response?.data?.message || 'Failed'));
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header"><h1>Report Anomaly</h1><p>Document election irregularities and anomalies</p></div>
      <div className="glass-card" style={{ padding: 32, maxWidth: 640 }}>
        {message && <div style={{ padding: 12, background: 'rgba(16,185,129,0.1)', borderRadius: 'var(--radius-md)', color: 'var(--accent-400)', marginBottom: 16, fontSize: '0.875rem' }}>{message}</div>}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="form-group"><label>Election</label><select className="form-select" value={form.electionId} onChange={e => setForm({ ...form, electionId: e.target.value })} required><option value="">Select</option>{elections.map(el => <option key={el.id} value={el.id}>{el.title}</option>)}</select></div>
          <div className="form-group"><label>Title</label><input className="form-input" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required /></div>
          <div className="form-group"><label>Description</label><textarea className="form-textarea" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required /></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group"><label>Category</label><select className="form-select" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}><option value="FRAUD">Fraud</option><option value="IRREGULARITY">Irregularity</option><option value="VIOLENCE">Violence</option><option value="TECHNICAL">Technical</option><option value="OTHER">Other</option></select></div>
            <div className="form-group"><label>Severity</label><select className="form-select" value={form.severity} onChange={e => setForm({ ...form, severity: e.target.value })}><option value="LOW">Low</option><option value="MEDIUM">Medium</option><option value="HIGH">High</option><option value="CRITICAL">Critical</option></select></div>
          </div>
          <div className="form-group"><label>Location</label><input className="form-input" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} /></div>
          <button type="submit" className="btn btn-primary btn-lg w-full"><Send size={18} /> Submit Report</button>
        </form>
      </div>
    </div>
  );
}
