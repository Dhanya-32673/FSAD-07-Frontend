import { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  CheckCircle2, XCircle, AlertTriangle, Info, X
} from 'lucide-react';

const ToastContext = createContext(null);

const ICONS = {
  success: <CheckCircle2 size={18} />,
  error:   <XCircle size={18} />,
  warning: <AlertTriangle size={18} />,
  info:    <Info size={18} />,
};

const COLORS = {
  success: { bg: 'rgba(0, 255, 136, 0.08)', border: 'rgba(0, 255, 136, 0.3)',  icon: '#00FF88', bar: '#00FF88' },
  error:   { bg: 'rgba(244, 63, 94, 0.08)', border: 'rgba(244, 63, 94, 0.3)',  icon: '#fb7185', bar: '#fb7185' },
  warning: { bg: 'rgba(255, 140, 0, 0.08)', border: 'rgba(255, 140, 0, 0.3)', icon: '#FF8C00', bar: '#FF8C00' },
  info:    { bg: 'rgba(99, 102, 241, 0.08)', border: 'rgba(99, 102, 241, 0.3)', icon: '#818cf8', bar: '#818cf8' },
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback(({ message, type = 'info', duration = 3000 }) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type, duration }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration + 400); 
  }, []);

  const dismiss = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  
  toast.success = (msg, opts) => toast({ message: msg, type: 'success', ...opts });
  toast.error   = (msg, opts) => toast({ message: msg, type: 'error',   ...opts });
  toast.warning = (msg, opts) => toast({ message: msg, type: 'warning', ...opts });
  toast.info    = (msg, opts) => toast({ message: msg, type: 'info',    ...opts });

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastContainer toasts={toasts} dismiss={dismiss} />
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};

function ToastContainer({ toasts, dismiss }) {
  return (
    <div style={{
      position: 'fixed',
      top: 20,
      right: 20,
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      pointerEvents: 'none',
      maxWidth: 380,
      width: 'calc(100vw - 40px)',
    }}>
      <AnimatePresence initial={false}>
        {toasts.map(t => (
          <Toast key={t.id} toast={t} onDismiss={dismiss} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function Toast({ toast, onDismiss }) {
  const c = COLORS[toast.type] || COLORS.info;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 60, scale: 0.92 }}
      animate={{ opacity: 1, x: 0,  scale: 1    }}
      exit={{    opacity: 0, x: 60, scale: 0.92  }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      style={{
        pointerEvents: 'all',
        background: 'rgba(0, 4, 17, 0.92)',
        border: `1px solid ${c.border}`,
        borderRadius: 14,
        boxShadow: `0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px ${c.border}`,
        backdropFilter: 'blur(20px)',
        overflow: 'hidden',
        position: 'relative',
        cursor: 'pointer',
      }}
      onClick={() => onDismiss(toast.id)}
    >
      {}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 12,
        padding: '14px 16px',
      }}>
        {}
        <div style={{
          color: c.icon,
          flexShrink: 0,
          marginTop: 1,
          filter: `drop-shadow(0 0 6px ${c.icon}80)`,
        }}>
          {ICONS[toast.type]}
        </div>

        {}
        <span style={{
          flex: 1,
          fontSize: '0.875rem',
          fontWeight: 600,
          color: '#f8fafc',
          lineHeight: 1.5,
          fontFamily: 'Inter, sans-serif',
        }}>
          {toast.message}
        </span>

        {}
        <div style={{ color: '#475569', flexShrink: 0, marginTop: 1 }}>
          <X size={14} />
        </div>
      </div>

      {}
      <motion.div
        initial={{ scaleX: 1 }}
        animate={{ scaleX: 0 }}
        transition={{ duration: toast.duration / 1000, ease: 'linear' }}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 2,
          background: c.bar,
          transformOrigin: 'left',
          boxShadow: `0 0 6px ${c.bar}`,
        }}
      />
    </motion.div>
  );
}
