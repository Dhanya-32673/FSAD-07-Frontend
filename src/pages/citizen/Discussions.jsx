import { useState, useEffect } from 'react';
import API from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { MessageSquare, Heart, Send, Plus, X } from 'lucide-react';

export default function Discussions() {
  const [discussions, setDiscussions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showNew, setShowNew] = useState(false);
  const [elections, setElections] = useState([]);
  const [form, setForm] = useState({ title: '', content: '', electionId: '' });
  const [comment, setComment] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchDiscussions();
    API.get('/elections').then(r => setElections(r.data));
  }, []);

  const fetchDiscussions = () => API.get('/discussions').then(r => setDiscussions(r.data));

  const createDiscussion = async (e) => {
    e.preventDefault();
    const payload = { ...form };
    if (payload.electionId) payload.electionId = parseInt(payload.electionId);
    else delete payload.electionId;
    await API.post('/discussions', payload);
    setShowNew(false); setForm({ title: '', content: '', electionId: '' });
    fetchDiscussions();
  };

  const like = async (id) => { await API.post(`/discussions/${id}/like`); fetchDiscussions(); };

  const addComment = async () => {
    if (!comment.trim() || !selected) return;
    const res = await API.post(`/discussions/${selected.id}/comments`, { content: comment });
    setSelected(res.data); setComment('');
    fetchDiscussions();
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div><h1>Civic Discussions</h1><p>Engage in conversations about elections and governance</p></div>
        <button className="btn btn-primary" onClick={() => setShowNew(true)}><Plus size={18} /> Start Discussion</button>
      </div>

      <div className="grid grid-2">
        <div>
          {discussions.map(d => (
            <div key={d.id} className="glass-card" onClick={() => { setSelected(d); setComment(''); }}
              style={{ padding: 20, marginBottom: 12, cursor: 'pointer', border: selected?.id === d.id ? '1px solid var(--primary-500)' : '1px solid var(--border-glass)' }}>
              <h4 style={{ marginBottom: 4 }}>{d.title}</h4>
              <p className="text-sm text-muted" style={{ marginBottom: 12 }}>{d.content.substring(0, 120)}...</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: 12, fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }} onClick={(e) => { e.stopPropagation(); like(d.id); }}>
                    <Heart size={14} style={{ color: 'var(--danger-400)' }} /> {d.likes}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MessageSquare size={14} /> {d.comments?.length || 0}</span>
                </div>
                <span className="text-xs text-muted">By {d.authorName} • {d.createdAt ? new Date(d.createdAt).toLocaleDateString() : ''}</span>
              </div>
            </div>
          ))}
          {discussions.length === 0 && <div className="glass-card" style={{ padding: 48, textAlign: 'center', color: 'var(--text-muted)' }}>No discussions yet. Start one!</div>}
        </div>

        <div>
          {selected ? (
            <div className="glass-card" style={{ padding: 24 }}>
              <h3 style={{ marginBottom: 4 }}>{selected.title}</h3>
              <p className="text-xs text-muted" style={{ marginBottom: 16 }}>By {selected.authorName} • {selected.createdAt ? new Date(selected.createdAt).toLocaleDateString() : ''}</p>
              <p className="text-sm" style={{ marginBottom: 20, lineHeight: 1.7 }}>{selected.content}</p>

              <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: 16 }}>
                <div className="text-xs font-bold text-muted" style={{ marginBottom: 12, textTransform: 'uppercase' }}>Comments ({selected.comments?.length || 0})</div>
                {selected.comments?.map(c => (
                  <div key={c.id} style={{ padding: 12, marginBottom: 8, background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ fontWeight: 600, fontSize: '0.8125rem', marginBottom: 4 }}>{c.authorName}</div>
                    <p className="text-sm">{c.content}</p>
                    <span className="text-xs text-muted">{c.createdAt ? new Date(c.createdAt).toLocaleDateString() : ''}</span>
                  </div>
                ))}
                <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                  <input className="form-input" placeholder="Add a comment..." value={comment} onChange={e => setComment(e.target.value)} onKeyDown={e => e.key === 'Enter' && addComment()} />
                  <button className="btn btn-primary" onClick={addComment}><Send size={16} /></button>
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-card" style={{ padding: 48, textAlign: 'center' }}>
              <MessageSquare size={48} style={{ color: 'var(--text-muted)', marginBottom: 12 }} />
              <p className="text-muted">Select a discussion to view details</p>
            </div>
          )}
        </div>
      </div>

      {}
      {showNew && (
        <div className="modal-overlay" onClick={() => setShowNew(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header"><h3>Start a Discussion</h3><button className="modal-close" onClick={() => setShowNew(false)}><X size={18} /></button></div>
            <form onSubmit={createDiscussion} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="form-group"><label>Title</label><input className="form-input" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required /></div>
              <div className="form-group"><label>Content</label><textarea className="form-textarea" value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} required style={{ minHeight: 120 }} /></div>
              <div className="form-group"><label>Related Election (Optional)</label><select className="form-select" value={form.electionId} onChange={e => setForm({ ...form, electionId: e.target.value })}><option value="">None</option>{elections.map(el => <option key={el.id} value={el.id}>{el.title}</option>)}</select></div>
              <button type="submit" className="btn btn-primary btn-lg w-full">Create Discussion</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
