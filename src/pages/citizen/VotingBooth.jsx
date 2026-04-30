import { useState, useEffect } from 'react';
import API from '../../api/axios';
import { Vote, CheckCircle, AlertCircle } from 'lucide-react';

export default function VotingBooth() {
  const [elections, setElections] = useState([]);
  const [selected, setSelected] = useState(null);
  const [votedMap, setVotedMap] = useState({});
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;
    API.get('/elections/status/ACTIVE').then(r => {
      if (!isMounted) return;
      setElections(r.data);
      r.data.forEach(el => {
        API.get(`/votes/check/${el.id}`).then(res => {
          if (isMounted) {
            setVotedMap(prev => ({ ...prev, [el.id]: res.data.hasVoted }));
          }
        });
      });
    });
    return () => { isMounted = false; };
  }, []);

  const castVote = async () => {
    if (!selected || !selectedCandidate) return;
    setMessage(''); setError('');
    try {
      const res = await API.post('/votes', { electionId: selected.id, candidateId: selectedCandidate });
      setMessage(res.data.message);
      setVotedMap({ ...votedMap, [selected.id]: true });
      setSelectedCandidate(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cast vote');
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header"><h1>Voting Booth</h1><p>Cast your vote in active elections</p></div>

      {elections.length === 0 ? (
        <div className="glass-card" style={{ padding: 48, textAlign: 'center' }}>
          <AlertCircle size={48} style={{ color: 'var(--text-muted)', marginBottom: 16 }} />
          <h3 style={{ marginBottom: 8 }}>No Active Elections</h3>
          <p className="text-muted">There are no elections currently accepting votes.</p>
        </div>
      ) : (
        <div className="grid grid-2">
          {}
          <div>
            <h4 style={{ marginBottom: 12 }}>Active Elections</h4>
            {elections.map(el => (
              <div key={el.id} className="glass-card" onClick={() => { setSelected(el); setSelectedCandidate(null); setMessage(''); setError(''); }}
                style={{
                  padding: 20, marginBottom: 12, cursor: 'pointer',
                  border: selected?.id === el.id ? '1px solid var(--primary-500)' : '1px solid var(--border-glass)',
                }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>{el.title}</div>
                    <div className="text-xs text-muted">{el.candidates?.length || 0} candidates</div>
                  </div>
                  {votedMap[el.id] ? (
                    <span className="badge badge-accent"><CheckCircle size={12} /> Voted</span>
                  ) : (
                    <span className="badge badge-warn">Pending</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {}
          <div>
            {selected ? (
              <div className="glass-card" style={{ padding: 24 }}>
                <h3 style={{ marginBottom: 4 }}>{selected.title}</h3>
                <p className="text-sm text-muted" style={{ marginBottom: 20 }}>{selected.description}</p>

                {message && <div style={{ padding: 12, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 'var(--radius-md)', color: 'var(--accent-400)', marginBottom: 16, fontSize: '0.875rem' }}><CheckCircle size={16} style={{ marginRight: 8, verticalAlign: 'middle' }} />{message}</div>}
                {error && <div style={{ padding: 12, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 'var(--radius-md)', color: 'var(--danger-400)', marginBottom: 16, fontSize: '0.875rem' }}>{error}</div>}

                {votedMap[selected.id] ? (
                  <div style={{ textAlign: 'center', padding: 32 }}>
                    <CheckCircle size={48} style={{ color: 'var(--accent-500)', marginBottom: 12 }} />
                    <h4>You have already voted</h4>
                    <p className="text-sm text-muted">Thank you for participating!</p>
                  </div>
                ) : (
                  <>
                    <div className="text-xs font-bold text-muted" style={{ marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Select a candidate</div>
                    {selected.candidates?.map(c => (
                      <div key={c.id} onClick={() => setSelectedCandidate(c.id)}
                        style={{
                          padding: 16, marginBottom: 8, borderRadius: 'var(--radius-md)',
                          background: selectedCandidate === c.id ? 'rgba(99,102,241,0.12)' : 'var(--bg-glass)',
                          border: selectedCandidate === c.id ? '2px solid var(--primary-500)' : '1px solid var(--border-glass)',
                          cursor: 'pointer', transition: 'all 150ms ease',
                        }}>
                        <div style={{ fontWeight: 600 }}>{c.name}</div>
                        <div className="text-xs" style={{ color: 'var(--primary-400)' }}>{c.party}</div>
                        {c.manifesto && <div className="text-xs text-muted" style={{ marginTop: 4 }}>{c.manifesto}</div>}
                      </div>
                    ))}
                    <button onClick={castVote} className="btn btn-primary btn-lg w-full" disabled={!selectedCandidate} style={{ marginTop: 16 }}>
                      <Vote size={18} /> Cast Vote
                    </button>
                  </>
                )}
              </div>
            ) : (
              <div className="glass-card" style={{ padding: 48, textAlign: 'center' }}>
                <Vote size={48} style={{ color: 'var(--text-muted)', marginBottom: 12 }} />
                <p className="text-muted">Select an election to start voting</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
