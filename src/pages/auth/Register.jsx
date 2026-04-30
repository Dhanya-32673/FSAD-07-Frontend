import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { ShieldCheck, ChevronRight, UserPlus, Mail, Lock, User, UserCircle, Globe, Landmark, Phone, Clock, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Register() {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    fullName: '',
    role: 'CITIZEN',
    phone: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [pendingRole, setPendingRole] = useState(null);
  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const roleRedirects = { ADMIN: '/admin', CITIZEN: '/citizen', OBSERVER: '/observer', ANALYST: '/analyst' };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await register(form);
      if (data.approvalStatus === 'APPROVED') {
        toast.success('Registration successful! Welcome aboard.');
        setTimeout(() => navigate(roleRedirects[data.role] || '/'), 600);
      } else {
        toast.warning('Request submitted. Awaiting Admin approval.');
        setPendingRole(data.role);
      }
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors && Object.keys(data.errors).length > 0) {
        const fieldErrors = Object.values(data.errors).join(' • ');
        setError(fieldErrors);
        toast.error(fieldErrors);
      } else {
        const msg = data?.message || 'Registration failed. Please try again.';
        setError(msg);
        toast.error(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  
  if (pendingRole) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-vanguard)', padding: '40px' }}>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ width: '100%', maxWidth: '500px' }}>
          <div className="v-card" style={{ padding: '56px', textAlign: 'center' }}>
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              style={{ width: 80, height: 80, borderRadius: '24px', background: 'rgba(255, 140, 0, 0.1)', border: '1px solid rgba(255, 140, 0, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 32px' }}
            >
              <Clock size={40} color="var(--v-saffron)" />
            </motion.div>
            <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#fff', marginBottom: 16 }}>Request Submitted</h2>
            <div style={{ padding: '12px 20px', borderRadius: 'var(--r-full)', background: 'rgba(255, 140, 0, 0.1)', border: '1px solid rgba(255, 140, 0, 0.3)', display: 'inline-block', marginBottom: 24 }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--v-saffron)', letterSpacing: '0.15em' }}>PENDING ADMIN APPROVAL</span>
            </div>
            <p style={{ color: 'var(--t-dim)', lineHeight: 1.8, marginBottom: 32 }}>
              Your <strong style={{ color: '#fff' }}>{pendingRole}</strong> access request has been submitted. An administrator will review your request and grant access once approved.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 24, background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--r-md)', border: '1px solid var(--glass-border)', textAlign: 'left', marginBottom: 32 }}>
              {['Request submitted to Admin queue', 'Admin will review your credentials', 'You\'ll be able to login once approved'].map((step, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <CheckCircle size={16} color="var(--v-green)" />
                  <span style={{ fontSize: '0.875rem', color: 'var(--t-dim)' }}>{step}</span>
                </div>
              ))}
            </div>
            <Link to="/login" className="btn-vanguard btn-v-primary" style={{ textDecoration: 'none', display: 'block' }}>
              Go to Login
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-vanguard)', padding: 'clamp(16px, 4vw, 40px)' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ width: '100%', maxWidth: '540px' }}
      >
        <div className="v-card" style={{ padding: 'clamp(24px, 5vw, 48px)' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div style={{ width: 64, height: 64, borderRadius: '20px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
              <UserPlus size={32} color="var(--v-saffron)" />
            </div>
            <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 900, color: '#fff', letterSpacing: '-0.02em' }}>Initialize Access</h2>
            <p style={{ color: 'var(--t-dim)', marginTop: 8 }}>Register your official national identifier</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div className="register-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--t-mute)' }} />
                <input className="v-input" style={{ paddingLeft: 48 }} type="text" name="fullName" placeholder="Full Name" value={form.fullName} onChange={handleChange} required />
              </div>
              <div style={{ position: 'relative' }}>
                <UserCircle size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--t-mute)' }} />
                <input className="v-input" style={{ paddingLeft: 48 }} type="text" name="username" placeholder="Username" value={form.username} onChange={handleChange} required />
              </div>
            </div>

            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--t-mute)' }} />
              <input className="v-input" style={{ paddingLeft: 48 }} type="email" name="email" placeholder="Official Email Address" value={form.email} onChange={handleChange} required />
            </div>

            <div className="register-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--t-mute)' }} />
                <input className="v-input" style={{ paddingLeft: 48 }} type="password" name="password" placeholder="Security Pass" value={form.password} onChange={handleChange} required />
              </div>
              <div style={{ position: 'relative' }}>
                <Phone size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--t-mute)' }} />
                <input className="v-input" style={{ paddingLeft: 48 }} type="text" name="phone" placeholder="Contact Number" value={form.phone} onChange={handleChange} />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--t-mute)', letterSpacing: '0.1em' }}>ASSIGNED PROTOCOL ROLE</label>
              <select className="v-input" style={{ appearance: 'none', cursor: 'pointer' }} name="role" value={form.role} onChange={handleChange}>
                <option value="CITIZEN">🗳️ CITIZEN STATUS — Instant Access</option>
                <option value="ADMIN">🛡️ ADMINISTRATIVE STATUS — Requires Approval</option>
                <option value="OBSERVER">👁️ NATIONAL OBSERVER — Requires Approval</option>
                <option value="ANALYST">📊 DATA ANALYST — Requires Approval</option>
              </select>
              {form.role !== 'CITIZEN' && (
                <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} style={{ padding: '10px 14px', borderRadius: 'var(--r-sm)', background: 'rgba(255, 140, 0, 0.08)', border: '1px solid rgba(255, 140, 0, 0.2)', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Clock size={14} color="var(--v-saffron)" />
                  <span style={{ fontSize: '0.75rem', color: 'var(--v-saffron)', fontWeight: 700 }}>This role requires Admin approval before login access is granted.</span>
                </motion.div>
              )}
            </div>

            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  exit={{ opacity: 0 }}
                  style={{ padding: '12px 16px', borderRadius: 'var(--r-sm)', background: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.2)', color: '#fb7185', fontSize: '0.8125rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 10 }}
                >
                  <ShieldCheck size={16} /> {error}
                </motion.div>
              )}
            </AnimatePresence>

            <button type="submit" disabled={loading} className="btn-vanguard btn-v-primary" style={{ width: '100%', marginTop: 12, height: '56px' }}>
              {loading ? <div className="v-spinner" style={{ width: 24, height: 24, borderWidth: 3 }} /> : (
                <>REGISTER ACCESS <ChevronRight size={18} /></>
              )}
            </button>
          </form>

          <div style={{ marginTop: 32, textAlign: 'center', borderTop: '1px solid var(--glass-border)', paddingTop: 24 }}>
            <span style={{ color: 'var(--t-dim)', fontSize: '0.875rem' }}>Already verified? </span>
            <Link to="/login" style={{ color: 'var(--v-saffron)', textDecoration: 'none', fontWeight: 800 }}>Enter Terminal</Link>
          </div>
        </div>

        <div style={{ marginTop: 32, display: 'flex', justifyContent: 'center', gap: 32, opacity: 0.6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Globe size={14} color="var(--v-white)" />
            <span style={{ fontSize: '0.625rem', color: 'var(--t-mute)', fontWeight: 800 }}>DISTRIBUTED LEDGER</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Landmark size={14} color="var(--v-white)" />
            <span style={{ fontSize: '0.625rem', color: 'var(--t-mute)', fontWeight: 800 }}>GOVT SECURED</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
