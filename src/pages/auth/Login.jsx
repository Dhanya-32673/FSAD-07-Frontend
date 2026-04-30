import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { ShieldCheck, ChevronRight, Lock, Globe, Landmark, Activity, Eye, EyeOff, Mail, KeyRound, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import heroImg from '../../assets/india_hero.png';

export default function Login() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  
  const [otpStep, setOtpStep] = useState(false);
  const [otp, setOtp] = useState('');
  const [adminUsername, setAdminUsername] = useState('');
  const [maskedEmail, setMaskedEmail] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  const { login, verifyOtp } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const roleRedirects = { ADMIN: '/admin', CITIZEN: '/citizen', OBSERVER: '/observer', ANALYST: '/analyst' };

  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [10, -10]);
  const rotateY = useTransform(x, [-100, 100], [-10, 10]);
  const handleMouseMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(event.clientX - rect.left - rect.width / 2);
    y.set(event.clientY - rect.top - rect.height / 2);
  };
  const handleMouseLeave = () => { x.set(0); y.set(0); };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await login(identifier, password);
      if (data.requiresOtp) {
        setAdminUsername(data.username);
        setMaskedEmail(data.maskedEmail);
        setOtpStep(true);
        startResendCooldown();
        toast.info('OTP sent to your registered email. Check your inbox.');
      } else {
        toast.success(`Welcome back! Redirecting to your dashboard...`);
        setTimeout(() => navigate(roleRedirects[data.role] || '/'), 600);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid credentials or unauthorized access attempt.';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await verifyOtp(adminUsername, otp);
      toast.success('Identity verified. Access granted!');
      setTimeout(() => navigate(roleRedirects[data.role] || '/admin'), 600);
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid OTP. Please check and try again.';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const startResendCooldown = () => {
    setResendCooldown(60);
    const interval = setInterval(() => {
      setResendCooldown(prev => {
        if (prev <= 1) { clearInterval(interval); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setError('');
    try {
      await login(identifier, password);
      startResendCooldown();
      setOtp('');
      toast.info('OTP resent. Check your inbox.');
    } catch (err) {
      setError('Failed to resend OTP. Please try again.');
      toast.error('Failed to resend OTP.');
    }
  };

  return (
    <div className="auth-split-layout">
      {}
      <div className="auth-hero">
        <motion.div style={{ position: 'absolute', inset: 0, zIndex: 0 }} initial={{ scale: 1.1, opacity: 0 }} animate={{ scale: 1, opacity: 0.6 }} transition={{ duration: 2 }}>
          <img src={heroImg} alt="Vanguard" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'contrast(1.2) brightness(0.6) saturate(0.8)' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, transparent, var(--bg-vanguard))' }} />
        </motion.div>
        <motion.div className="auth-hero-content" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 1 }} style={{ position: 'relative', zIndex: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
            <div style={{ width: 40, height: 2, background: 'var(--v-saffron)' }} />
            <span style={{ color: 'var(--v-saffron)', fontWeight: 800, fontSize: '0.75rem', letterSpacing: '0.4em' }}>NATIONAL PROTOCOL</span>
          </div>
          <h1 className="auth-hero-title">
            Bharat <span className="gradient-text-vanguard">Vanguard</span>
          </h1>
          <p style={{ fontSize: '1.125rem', color: 'var(--t-dim)', maxWidth: '500px', fontWeight: 500 }}>
            Unified secure gateway for the Republic of India's Digital Election Monitoring System.
          </p>
          <div style={{ marginTop: 48, display: 'flex', gap: 40, flexWrap: 'wrap' }}>
            <div>
              <div style={{ color: 'var(--v-white)', fontWeight: 800, fontSize: '1.375rem' }}>E-Voting</div>
              <div style={{ color: 'var(--t-mute)', fontSize: '0.6875rem', fontWeight: 800, marginTop: 4 }}>SECURE CHANNEL</div>
            </div>
            <div style={{ width: 1, background: 'var(--glass-border)' }} />
            <div>
              <div style={{ color: 'var(--v-white)', fontWeight: 800, fontSize: '1.375rem' }}>AI Audits</div>
              <div style={{ color: 'var(--t-mute)', fontSize: '0.6875rem', fontWeight: 800, marginTop: 4 }}>REALTIME BIAS SCAN</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right: Login Form */}
      <div className="auth-form-panel">
        <motion.div style={{ width: '100%', perspective: 1000, rotateX, rotateY }} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
          <div className="v-card" style={{ padding: 'clamp(28px, 5vw, 48px)' }}>
            <AnimatePresence mode="wait">
              {!otpStep ? (
                /* ── Step 1: Credentials ── */
                <motion.div key="credentials" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <div style={{ marginBottom: 36 }}>
                    <div style={{ width: 60, height: 60, borderRadius: '18px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                      <Landmark size={28} color="var(--v-saffron)" />
                    </div>
                    <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 800, color: '#fff' }}>Terminal Access</h2>
                    <p style={{ color: 'var(--t-dim)', marginTop: 8 }}>Authorized Personnel Only</p>
                  </div>

                  <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <div style={{ position: 'relative' }}>
                      <Globe size={18} style={{ position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)', color: 'var(--t-mute)' }} />
                      <input className="v-input" style={{ paddingLeft: 56 }} type="text" placeholder="Government ID / Username" value={identifier} onChange={e => setIdentifier(e.target.value)} required />
                    </div>
                    <div style={{ position: 'relative' }}>
                      <Lock size={18} style={{ position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)', color: 'var(--t-mute)' }} />
                      <input className="v-input" style={{ paddingLeft: 56, paddingRight: 56 }} type={showPass ? 'text' : 'password'} placeholder="Cryptographic Key" value={password} onChange={e => setPassword(e.target.value)} required />
                      <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--t-mute)' }}>
                        {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>

                    <AnimatePresence>
                      {error && (
                        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                          style={{ padding: '12px 16px', borderRadius: 'var(--r-sm)', background: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.2)', color: '#fb7185', fontSize: '0.8125rem', fontWeight: 600, display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                          <ShieldCheck size={16} style={{ flexShrink: 0, marginTop: 1 }} /> <span>{error}</span>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <button type="submit" disabled={loading} className="btn-vanguard btn-v-primary" style={{ width: '100%', height: '52px' }}>
                      {loading ? <div className="v-spinner" style={{ width: 22, height: 22, borderWidth: 3 }} /> : <>INITIATE SESSION <ChevronRight size={18} /></>}
                    </button>
                  </form>
                </motion.div>
              ) : (
                /* ── Step 2: OTP Verification ── */
                <motion.div key="otp" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                  <div style={{ marginBottom: 32 }}>
                    <div style={{ width: 60, height: 60, borderRadius: '18px', background: 'rgba(255, 140, 0, 0.08)', border: '1px solid rgba(255, 140, 0, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                      <KeyRound size={28} color="var(--v-saffron)" />
                    </div>
                    <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 800, color: '#fff' }}>OTP Verification</h2>
                    <p style={{ color: 'var(--t-dim)', marginTop: 8 }}>Admin 2-Factor Authentication</p>
                  </div>

                  {/* Email notice */}
                  <div style={{ padding: '14px 18px', borderRadius: 'var(--r-md)', background: 'rgba(255, 140, 0, 0.06)', border: '1px solid rgba(255, 140, 0, 0.2)', marginBottom: 24 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                      <Mail size={15} color="var(--v-saffron)" />
                      <span style={{ fontSize: '0.6875rem', fontWeight: 900, color: 'var(--v-saffron)', letterSpacing: '0.1em' }}>OTP DISPATCHED</span>
                    </div>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--t-dim)', lineHeight: 1.5 }}>
                      A 6-digit code has been sent to <strong style={{ color: '#fff' }}>{maskedEmail}</strong>. Valid for 5 minutes.
                    </p>
                  </div>

                  <form onSubmit={handleOtpSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <div style={{ position: 'relative' }}>
                      <KeyRound size={18} style={{ position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)', color: 'var(--t-mute)' }} />
                      <input
                        className="v-input"
                        style={{ paddingLeft: 56, fontSize: '1.375rem', fontWeight: 900, letterSpacing: '0.3em', textAlign: 'center' }}
                        type="text"
                        placeholder="000000"
                        maxLength={6}
                        value={otp}
                        onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                        required
                        autoFocus
                      />
                    </div>

                    <AnimatePresence>
                      {error && (
                        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                          style={{ padding: '12px 16px', borderRadius: 'var(--r-sm)', background: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.2)', color: '#fb7185', fontSize: '0.8125rem', fontWeight: 600, display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                          <ShieldCheck size={16} style={{ flexShrink: 0, marginTop: 1 }} /> <span>{error}</span>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <button type="submit" disabled={loading || otp.length < 6} className="btn-vanguard btn-v-primary" style={{ width: '100%', height: '52px' }}>
                      {loading ? <div className="v-spinner" style={{ width: 22, height: 22, borderWidth: 3 }} /> : <>VERIFY ACCESS <ChevronRight size={18} /></>}
                    </button>
                  </form>

                  {/* Resend + Back */}
                  <div style={{ marginTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                    <button onClick={() => { setOtpStep(false); setError(''); setOtp(''); }} style={{ background: 'none', border: 'none', color: 'var(--t-mute)', fontSize: '0.8125rem', cursor: 'pointer', fontWeight: 600 }}>
                      ← Back to Login
                    </button>
                    <button onClick={handleResend} disabled={resendCooldown > 0}
                      style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: resendCooldown > 0 ? 'var(--t-mute)' : 'var(--v-saffron)', fontSize: '0.8125rem', cursor: resendCooldown > 0 ? 'not-allowed' : 'pointer', fontWeight: 700 }}>
                      <RefreshCw size={13} />
                      {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend OTP'}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div style={{ marginTop: 36, paddingTop: 28, borderTop: '1px solid var(--glass-border)', textAlign: 'center' }}>
              <Link to="/register" style={{ color: 'var(--v-saffron)', textDecoration: 'none', fontSize: '0.8125rem', fontWeight: 800, letterSpacing: '0.05em' }}>
                REQUEST NEW ACCESS TERMINAL
              </Link>
            </div>
          </div>

          <div style={{ marginTop: 24, display: 'flex', justifyContent: 'center', gap: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div className="pulse-saffron" style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--v-saffron)' }} />
              <span style={{ fontSize: '0.5625rem', color: 'var(--t-mute)', fontWeight: 800 }}>LIVE ENCRYPTION</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Activity size={11} color="var(--v-green)" />
              <span style={{ fontSize: '0.5625rem', color: 'var(--t-mute)', fontWeight: 800 }}>SYSTEM NOMINAL</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

