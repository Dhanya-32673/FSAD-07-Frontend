import { useState, useEffect } from 'react';
import API from '../../api/axios';
import { UserX, UserCheck, Trash2, Clock, CheckCircle, XCircle, Users, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [pending, setPending] = useState([]);
  const [tab, setTab] = useState('all'); 
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => { fetchUsers(); fetchPending(); }, []);

  const fetchUsers = () => API.get('/users').then(r => setUsers(r.data)).catch(() => {});
  const fetchPending = () => API.get('/users/pending').then(r => setPending(r.data)).catch(() => {});

  const toggleStatus = async (id) => {
    setActionLoading(id + '-toggle');
    await API.put(`/users/${id}/toggle-status`).catch(() => {});
    fetchUsers();
    setActionLoading(null);
  };

  const deleteUser = async (id) => {
    if (!confirm('Delete this user permanently?')) return;
    setActionLoading(id + '-delete');
    await API.delete(`/users/${id}`).catch(() => {});
    fetchUsers();
    setActionLoading(null);
  };

  const approveUser = async (id) => {
    setActionLoading(id + '-approve');
    await API.put(`/users/${id}/approve`).catch(() => {});
    fetchPending();
    fetchUsers();
    setActionLoading(null);
  };

  const rejectUser = async (id) => {
    setActionLoading(id + '-reject');
    await API.put(`/users/${id}/reject`).catch(() => {});
    fetchPending();
    fetchUsers();
    setActionLoading(null);
  };

  const roleColors = { ADMIN: 'var(--v-saffron)', CITIZEN: 'var(--v-green)', OBSERVER: '#6366f1', ANALYST: '#fff' };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ padding: 40 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <div className="pulse-saffron" style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--v-saffron)' }} />
            <span style={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--v-saffron)', letterSpacing: '0.2em' }}>PERSONNEL MANAGEMENT</span>
          </div>
          <h1 className="gradient-text-vanguard" style={{ fontSize: '3rem', lineHeight: 1 }}>Identity Grid</h1>
          <p style={{ color: 'var(--t-dim)', marginTop: 12 }}>Authorize and manage neural access for system operators</p>
        </div>
        {pending.length > 0 && (
          <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 1.5, repeat: Infinity }} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 20px', borderRadius: 'var(--r-md)', background: 'rgba(255, 140, 0, 0.1)', border: '1px solid rgba(255, 140, 0, 0.3)' }}>
            <AlertCircle size={18} color="var(--v-saffron)" />
            <span style={{ fontSize: '0.875rem', fontWeight: 900, color: 'var(--v-saffron)' }}>{pending.length} Pending Request{pending.length > 1 ? 's' : ''}</span>
          </motion.div>
        )}
      </div>

      {}
      <div style={{ display: 'flex', gap: 4, marginBottom: 28, padding: 4, borderRadius: 'var(--r-md)', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)', width: 'fit-content' }}>
        {[
          { id: 'all', label: 'All Personnel', icon: Users, count: users.length },
          { id: 'pending', label: 'Pending Approvals', icon: Clock, count: pending.length }
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 'var(--r-sm)', background: tab === t.id ? 'rgba(255,255,255,0.07)' : 'transparent', border: tab === t.id ? '1px solid var(--glass-border)' : '1px solid transparent', color: tab === t.id ? '#fff' : 'var(--t-dim)', fontWeight: tab === t.id ? 800 : 500, cursor: 'pointer', fontSize: '0.875rem', transition: 'all 0.2s' }}>
            <t.icon size={16} color={t.id === 'pending' && pending.length > 0 ? 'var(--v-saffron)' : 'currentColor'} />
            {t.label}
            {t.count > 0 && (
              <span style={{ padding: '2px 8px', borderRadius: 'var(--r-full)', background: t.id === 'pending' ? 'rgba(255,140,0,0.2)' : 'rgba(255,255,255,0.08)', color: t.id === 'pending' ? 'var(--v-saffron)' : 'var(--t-dim)', fontSize: '0.625rem', fontWeight: 900 }}>{t.count}</span>
            )}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {tab === 'pending' ? (
          <motion.div key="pending" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
            {pending.length === 0 ? (
              <div className="v-card" style={{ padding: 60, textAlign: 'center' }}>
                <CheckCircle size={48} color="var(--v-green)" style={{ marginBottom: 16 }} />
                <p style={{ color: 'var(--t-mute)', fontSize: '1rem' }}>No pending approval requests. All clear!</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {pending.map(u => (
                  <motion.div key={u.id} layout className="v-card" style={{ padding: '24px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                      <div style={{ width: 52, height: 52, borderRadius: '14px', background: `${roleColors[u.role]}15`, border: `1px solid ${roleColors[u.role]}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }}>
                        {u.role === 'ADMIN' ? '🛡️' : u.role === 'OBSERVER' ? '👁️' : '📊'}
                      </div>
                      <div>
                        <div style={{ fontWeight: 900, color: '#fff', fontSize: '1rem' }}>{u.fullName}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--v-saffron)', fontWeight: 700, marginTop: 2 }}>@{u.username} • {u.email}</div>
                        <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ padding: '3px 10px', borderRadius: 'var(--r-full)', background: `${roleColors[u.role]}20`, color: roleColors[u.role], fontSize: '0.625rem', fontWeight: 900, letterSpacing: '0.1em' }}>{u.role}</span>
                          <span style={{ padding: '3px 10px', borderRadius: 'var(--r-full)', background: 'rgba(255,140,0,0.1)', color: 'var(--v-saffron)', fontSize: '0.625rem', fontWeight: 900, letterSpacing: '0.1em' }}>PENDING</span>
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 12 }}>
                      <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                        disabled={actionLoading === u.id + '-approve'}
                        onClick={() => approveUser(u.id)}
                        style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 'var(--r-md)', background: 'rgba(0, 255, 136, 0.1)', border: '1px solid rgba(0, 255, 136, 0.3)', color: 'var(--v-green)', fontWeight: 900, fontSize: '0.8125rem', cursor: 'pointer' }}>
                        <CheckCircle size={16} /> APPROVE
                      </motion.button>
                      <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                        disabled={actionLoading === u.id + '-reject'}
                        onClick={() => rejectUser(u.id)}
                        style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 'var(--r-md)', background: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.2)', color: '#fb7185', fontWeight: 900, fontSize: '0.8125rem', cursor: 'pointer' }}>
                        <XCircle size={16} /> REJECT
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div key="all" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
            <div className="v-table-container">
              <table className="v-table">
                <thead>
                  <tr>
                    <th>Operator</th>
                    <th>Network ID</th>
                    <th>Access Level</th>
                    <th>Status</th>
                    <th>Approval</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id}>
                      <td>
                        <div style={{ fontWeight: 700, color: 'var(--t-main)' }}>{u.fullName}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--v-saffron)', fontWeight: 700, letterSpacing: '0.1em' }}>@{u.username?.toUpperCase()}</div>
                      </td>
                      <td style={{ fontFamily: 'var(--f-mono)', fontSize: '0.8125rem', color: 'var(--t-dim)' }}>{u.email}</td>
                      <td>
                        <span style={{ padding: '4px 10px', borderRadius: 'var(--r-full)', background: `${roleColors[u.role]}15`, color: roleColors[u.role] || '#fff', fontSize: '0.625rem', fontWeight: 900, letterSpacing: '0.1em', border: `1px solid ${roleColors[u.role]}30` }}>
                          {u.role}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ width: 8, height: 8, borderRadius: '50%', background: u.enabled ? 'var(--v-green)' : '#ff4444', boxShadow: u.enabled ? '0 0 10px var(--v-green)' : 'none' }} />
                          <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{u.enabled ? 'ONLINE' : 'LOCKED'}</span>
                        </div>
                      </td>
                      <td>
                        <span style={{ padding: '3px 10px', borderRadius: 'var(--r-full)', fontSize: '0.625rem', fontWeight: 900, letterSpacing: '0.1em',
                          background: u.approvalStatus === 'APPROVED' ? 'rgba(0,255,136,0.1)' : u.approvalStatus === 'PENDING' ? 'rgba(255,140,0,0.1)' : 'rgba(244,63,94,0.1)',
                          color: u.approvalStatus === 'APPROVED' ? 'var(--v-green)' : u.approvalStatus === 'PENDING' ? 'var(--v-saffron)' : '#fb7185' }}>
                          {u.approvalStatus || 'APPROVED'}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.8125rem', color: 'var(--t-dim)' }}>
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 10 }}>
                          <button className="btn-vanguard btn-v-outline" style={{ padding: '8px 12px' }} onClick={() => toggleStatus(u.id)} title={u.enabled ? 'Revoke Access' : 'Grant Access'}>
                            {u.enabled ? <UserX size={16} /> : <UserCheck size={16} />}
                          </button>
                          <button className="btn-vanguard btn-v-outline" style={{ padding: '8px 12px', color: '#ff4444', borderColor: 'rgba(255, 68, 68, 0.2)' }} onClick={() => deleteUser(u.id)}>
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {users.length === 0 && (
                <div style={{ padding: 64, textAlign: 'center', color: 'var(--t-dim)' }}>
                  <p>Scanning for active personnel... No UIDs found.</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
