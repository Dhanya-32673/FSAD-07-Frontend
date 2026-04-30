import { useState, useEffect } from 'react';
import API from '../../api/axios';
import { Plus, Edit, Trash2, X, Users as UsersIcon } from 'lucide-react';

export default function ManageElections() {
  const [elections, setElections] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', electionType: 'NATIONAL', startDate: '', endDate: '', status: 'UPCOMING', candidates: [] });
  const [candidateForm, setCandidateForm] = useState({ name: '', party: '', manifesto: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchElections(); }, []);

  const fetchElections = () => API.get('/elections').then(r => setElections(r.data));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const payload = { 
        ...form, 
        startDate: form.startDate ? (form.startDate.includes(':') && form.startDate.split(':').length === 2 ? form.startDate + ':00' : form.startDate) : null,
        endDate: form.endDate ? (form.endDate.includes(':') && form.endDate.split(':').length === 2 ? form.endDate + ':00' : form.endDate) : null
      };

      if (editId) {
        await API.put(`/elections/${editId}`, payload);
      } else {
        await API.post('/elections', payload);
      }

      setShowModal(false); 
      setEditId(null);
      setForm({ title: '', description: '', electionType: 'NATIONAL', startDate: '', endDate: '', status: 'UPCOMING', candidates: [] });
      fetchElections();
    } catch (err) {
      console.error('Election submission failed:', err);
      setError(err.response?.data?.message || err.message || 'Operation failed. Please check your data and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (el) => {
    setEditId(el.id);
    setForm({ 
      title: el.title, 
      description: el.description || '', 
      electionType: el.electionType, 
      startDate: el.startDate ? el.startDate.slice(0, 16) : '', 
      endDate: el.endDate ? el.endDate.slice(0, 16) : '', 
      status: el.status, 
      candidates: el.candidates || [] 
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this election?')) { await API.delete(`/elections/${id}`); fetchElections(); }
  };

  const addCandidate = () => {
    if (candidateForm.name && candidateForm.party) {
      setForm({ ...form, candidates: [...form.candidates, { ...candidateForm }] });
      setCandidateForm({ name: '', party: '', manifesto: '' });
    }
  };

  const statusColors = { ACTIVE: 'badge-accent', UPCOMING: 'badge-primary', COMPLETED: 'badge-neutral', CANCELLED: 'badge-danger' };

  return (
    <div className="animate-fade-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
        <div>
          <h1 className="gradient-text-vanguard" style={{ fontSize: '2.5rem', marginBottom: 8 }}>Manage Elections</h1>
          <p style={{ color: 'var(--t-dim)' }}>Create, update, and oversee national election events</p>
        </div>
        <button className="btn-vanguard btn-v-primary" onClick={() => { setEditId(null); setShowModal(true); }}>
          <Plus size={20} /> New Election
        </button>
      </div>

      <div className="v-table-container">
        <table className="v-table">
          <thead>
            <tr>
              <th>Election Details</th>
              <th>Category</th>
              <th>Status</th>
              <th style={{ textAlign: 'center' }}>Candidates</th>
              <th style={{ textAlign: 'center' }}>Total Votes</th>
              <th>Timeline</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {elections.map(el => (
              <tr key={el.id}>
                <td>
                  <div style={{ fontWeight: 700, color: 'var(--t-main)', fontSize: '1rem' }}>{el.title}</div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--t-dim)', marginTop: 4 }}>{el.description?.substring(0, 80)}{el.description?.length > 80 ? '...' : ''}</div>
                </td>
                <td>
                  <span className="v-badge v-badge-slate">{el.electionType}</span>
                </td>
                <td>
                  <span className={`v-badge ${
                    el.status === 'ACTIVE' ? 'v-badge-green' : 
                    el.status === 'UPCOMING' ? 'v-badge-saffron' : 'v-badge-slate'
                  }`}>
                    {el.status}
                  </span>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontWeight: 600 }}>
                    <UsersIcon size={14} className="text-muted" />
                    {el.candidates?.length || 0}
                  </div>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <div style={{ fontWeight: 800, color: 'var(--v-green)' }}>{el.totalVotes || 0}</div>
                </td>
                <td>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 500 }}>{el.startDate ? new Date(el.startDate).toLocaleDateString() : 'N/A'}</div>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <button className="btn-vanguard btn-v-outline" style={{ padding: '8px 12px' }} onClick={() => handleEdit(el)}>
                      <Edit size={16} />
                    </button>
                    <button className="btn-vanguard btn-v-outline" style={{ padding: '8px 12px', color: '#ff4444', borderColor: 'rgba(255, 68, 68, 0.2)' }} onClick={() => handleDelete(el.id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {elections.length === 0 && (
          <div style={{ padding: 64, textAlign: 'center', color: 'var(--t-dim)' }}>
            <div style={{ marginBottom: 16, opacity: 0.5 }}><UsersIcon size={48} style={{ margin: '0 auto' }} /></div>
            <p>No active elections found in the database. Deploy a new election to begin.</p>
          </div>
        )}
      </div>

      {}
      {showModal && (
        <div className="v-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="v-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 700 }}>
            <div className="v-modal-header">
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{editId ? 'Modify Strategy' : 'Strategic Initialization'}</h2>
              <button style={{ background: 'none', border: 'none', color: 'var(--t-dim)', cursor: 'pointer' }} onClick={() => setShowModal(false)}>
                <X size={24} />
              </button>
            </div>
            
            <div className="v-modal-body">
              {error && (
                <div style={{ padding: '12px 16px', background: 'rgba(255, 68, 68, 0.1)', border: '1px solid rgba(255, 68, 68, 0.2)', borderRadius: 'var(--r-sm)', color: '#ff4444', fontSize: '0.875rem', marginBottom: 20 }}>
                  <strong>Operational Error:</strong> {error}
                </div>
              )}
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <div className="form-group">
                  <label className="v-label">Election Title</label>
                  <input className="v-input" placeholder="e.g. 2024 General Assembly" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
                </div>
                
                <div className="form-group">
                  <label className="v-label">Operational Briefing</label>
                  <textarea className="v-textarea" rows={3} placeholder="Describe the scope and purpose..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                  <div className="form-group">
                    <label className="v-label">Jurisdiction Type</label>
                    <select className="v-select" value={form.electionType} onChange={e => setForm({ ...form, electionType: e.target.value })}>
                      <option value="NATIONAL">National</option>
                      <option value="STATE">State</option>
                      <option value="LOCAL">Local</option>
                    </select>
                  </div>
                  {editId && (
                    <div className="form-group">
                      <label className="v-label">Deployment Status</label>
                      <select className="v-select" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                        <option value="UPCOMING">Upcoming</option>
                        <option value="ACTIVE">Active</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>
                    </div>
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                  <div className="form-group">
                    <label className="v-label">Activation Timestamp</label>
                    <input className="v-input" type="datetime-local" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label className="v-label">Termination Timestamp</label>
                    <input className="v-input" type="datetime-local" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} required />
                  </div>
                </div>

                {!editId && (
                  <div style={{ padding: 24, background: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--r-md)', border: '1px solid var(--glass-border)' }}>
                    <div className="v-label" style={{ marginBottom: 16 }}>Nominate Candidates</div>
                    <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
                      <input className="v-input" placeholder="Full Name" value={candidateForm.name} onChange={e => setCandidateForm({ ...candidateForm, name: e.target.value })} style={{ flex: 1.5 }} />
                      <input className="v-input" placeholder="Political Affiliation" value={candidateForm.party} onChange={e => setCandidateForm({ ...candidateForm, party: e.target.value })} style={{ flex: 1 }} />
                      <button type="button" className="btn-vanguard btn-v-primary" style={{ padding: '0 20px' }} onClick={addCandidate}>
                        <Plus size={20} />
                      </button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {form.candidates.map((c, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: 'var(--r-sm)', border: '1px solid var(--glass-border)' }}>
                          <div>
                            <span style={{ fontWeight: 700 }}>{c.name}</span>
                            <span style={{ color: 'var(--t-dim)', marginLeft: 8, fontSize: '0.8125rem' }}>[{c.party}]</span>
                          </div>
                          <button type="button" onClick={() => setForm({ ...form, candidates: form.candidates.filter((_, j) => j !== i) })} style={{ background: 'none', border: 'none', color: '#ff4444', cursor: 'pointer' }}>
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <button type="submit" disabled={loading} className="btn-vanguard btn-v-primary btn-lg" style={{ width: '100%', marginTop: 12, padding: '20px', opacity: loading ? 0.7 : 1 }}>
                  {loading ? 'Processing Strategic Command...' : (editId ? 'Authorize Strategic Update' : 'Initialize National Election')}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
