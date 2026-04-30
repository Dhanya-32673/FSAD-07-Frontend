import { useState, useEffect } from 'react';
import API from '../../api/axios';
import { BarChart3, TrendingUp, PieChart, Activity, Sparkles } from 'lucide-react';
import { PieChart as RePie, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

const COLORS = ['var(--v-saffron)', 'var(--v-green)', 'var(--v-aqua)', 'var(--v-white)', '#8b5cf6', '#ec4899'];

export default function AnalystDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/analytics')
      .then(r => { setAnalytics(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="loading-screen">
      <div style={{ textAlign: 'center' }}>
        <div className="v-spinner" style={{ margin: '0 auto 24px' }} />
        <div style={{ fontSize: '0.625rem', fontWeight: 900, color: 'var(--v-saffron)', letterSpacing: '0.3em' }}>ANALYZING NATIONAL DATA...</div>
      </div>
    </div>
  );

  const roleData = analytics?.usersByRole ? Object.entries(analytics.usersByRole).map(([name, value]) => ({ name, value })) : [];
  const incidentData = analytics?.incidentsByCategory ? Object.entries(analytics.incidentsByCategory).filter(([, v]) => v > 0).map(([name, value]) => ({ name, value })) : [];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants} style={{ padding: '40px' }}>
      {}
      <motion.div variants={itemVariants} style={{ marginBottom: 48 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <div className="pulse-saffron" style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--v-saffron)' }} />
          <span style={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--v-saffron)', letterSpacing: '0.2em' }}>ANALYTICS PROTOCOL</span>
        </div>
        <h1 className="gradient-text-vanguard" style={{ fontSize: '3.50rem', lineHeight: 1 }}>Neural Analytics</h1>
        <p style={{ color: 'var(--t-dim)', fontSize: '1.25rem', marginTop: 12, fontWeight: 500 }}>
          Comprehensive election data analysis and real-time trend monitoring.
        </p>
      </motion.div>

      <div className="grid grid-4" style={{ marginBottom: 32 }}>
        {[
          { label: 'Total Votes Cast', value: analytics?.totalVotesCast || 0, icon: BarChart3, color: 'var(--v-saffron)', bg: 'rgba(255,153,51,0.05)' },
          { label: 'Voter Turnout', value: `${analytics?.overallTurnoutPercentage || 0}%`, icon: TrendingUp, color: 'var(--v-green)', bg: 'rgba(0,255,136,0.05)' },
          { label: 'Active Elections', value: analytics?.activeElections || 0, icon: PieChart, color: 'var(--v-aqua)', bg: 'rgba(0,255,255,0.05)' },
          { label: 'Resolved Incidents', value: analytics?.resolvedIncidents || 0, icon: Activity, color: 'var(--v-white)', bg: 'rgba(255,255,255,0.05)' },
        ].map((s, i) => (
          <motion.div key={i} variants={itemVariants} className="glass-card stat-card">
            <div className="stat-icon" style={{ background: s.bg }}><s.icon size={24} style={{ color: s.color }} /></div>
            <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-2">
        {}
        <motion.div variants={itemVariants} className="glass-card" style={{ padding: 24 }}>
          <h3 style={{ marginBottom: 16, fontWeight: 800 }}>User Distribution</h3>
          {roleData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <RePie>
                <Pie data={roleData} cx="50%" cy="50%" outerRadius={90} innerRadius={50} dataKey="value" stroke="none" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {roleData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: 'rgba(10, 15, 25, 0.95)', border: '1px solid var(--glass-border)', borderRadius: 8, color: '#f1f5f9' }} />
              </RePie>
            </ResponsiveContainer>
          ) : <p style={{ color: 'var(--t-dim)', textAlign: 'center' }}>No data available</p>}
        </motion.div>

        {}
        <motion.div variants={itemVariants} className="glass-card" style={{ padding: 24 }}>
          <h3 style={{ marginBottom: 16, fontWeight: 800 }}>Election Votes Overview</h3>
          {analytics?.electionAnalytics?.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={analytics.electionAnalytics.map(e => ({ name: e.electionTitle.substring(0, 20), votes: e.totalVotes, incidents: e.totalIncidents }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: 'var(--t-mute)', fontSize: 11 }} axisLine={{ stroke: 'var(--glass-border)' }} />
                <YAxis tick={{ fill: 'var(--t-mute)', fontSize: 11 }} axisLine={{ stroke: 'var(--glass-border)' }} />
                <Tooltip contentStyle={{ background: 'rgba(10, 15, 25, 0.95)', border: '1px solid var(--glass-border)', borderRadius: 8, color: '#f1f5f9' }} />
                <Bar dataKey="votes" fill="var(--v-saffron)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="incidents" fill="var(--v-red)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <p style={{ color: 'var(--t-dim)', textAlign: 'center' }}>No election data</p>}
        </motion.div>
      </div>

      {}
      {analytics?.electionAnalytics?.map(el => (
        el.candidateVotes?.length > 0 && (
          <motion.div key={el.electionId} variants={itemVariants} className="glass-card" style={{ padding: 24, marginTop: 24 }}>
            <h3 style={{ marginBottom: 16, fontWeight: 800 }}>{el.electionTitle} — Candidate Results</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={el.candidateVotes.map(c => ({ name: c.candidateName, votes: c.voteCount, pct: c.percentage.toFixed(1) }))} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                <XAxis type="number" tick={{ fill: 'var(--t-mute)', fontSize: 11 }} axisLine={{ stroke: 'var(--glass-border)' }} />
                <YAxis dataKey="name" type="category" width={120} tick={{ fill: 'var(--t-mute)', fontSize: 11 }} axisLine={{ stroke: 'var(--glass-border)' }} />
                <Tooltip contentStyle={{ background: 'rgba(10, 15, 25, 0.95)', border: '1px solid var(--glass-border)', borderRadius: 8, color: '#f1f5f9' }} />
                <Bar dataKey="votes" fill="var(--v-green)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        )
      ))}
    </motion.div>
  );
}
