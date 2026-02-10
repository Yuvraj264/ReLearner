import React from 'react';
import { motion } from 'framer-motion';
import PageTransition from '@/components/PageTransition';
import { useAdmin } from '@/context/AdminContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const statusColor = { healthy: 'hsl(152, 58%, 42%)', at_risk: 'hsl(36, 88%, 52%)', critical: 'hsl(0, 68%, 52%)' };
const statusLabel = { healthy: 'Healthy', at_risk: 'At Risk', critical: 'Critical' };
const statusBadge = {
  healthy: 'bg-healthy/15 text-healthy border-healthy/20',
  at_risk: 'bg-warning/15 text-warning border-warning/20',
  critical: 'bg-critical/15 text-critical border-critical/20',
};

const SkillAnalytics = () => {
  const { analytics } = useAdmin();

  return (
    <PageTransition>
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Skill Analytics</h1>
          <p className="text-sm text-muted-foreground mt-1">Engagement and retention breakdown by skill</p>
        </div>

        {/* Decay Distribution */}
        <div className="glass-card p-5">
          <h2 className="text-sm font-semibold text-foreground mb-4">Score Distribution Across Skills</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={analytics.decayDistribution} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 16%, 16%)" vertical={false} />
              <XAxis dataKey="range" tick={{ fontSize: 11, fill: 'hsl(215, 15%, 52%)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'hsl(215, 15%, 52%)' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: 'hsl(225, 18%, 9%)', border: '1px solid hsl(222, 16%, 22%)', borderRadius: '0.75rem', fontSize: 12 }}
                labelStyle={{ color: 'hsl(215, 15%, 52%)' }}
              />
              <Bar dataKey="count" name="Skills" fill="hsl(192, 85%, 48%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Skills Table */}
        <div className="glass-card p-5">
          <h2 className="text-sm font-semibold text-foreground mb-4">Skill Engagement</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Skill</th>
                  <th className="text-right py-3 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Learners</th>
                  <th className="text-right py-3 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Avg Score</th>
                  <th className="text-right py-3 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody>
                {analytics.skillEngagement.map((s, i) => (
                  <motion.tr
                    key={i}
                    className="border-b border-border/50 hover:bg-accent/30 transition-colors"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <td className="py-3 px-3 font-medium text-foreground">{s.skill}</td>
                    <td className="py-3 px-3 text-right text-muted-foreground">{s.learners}</td>
                    <td className="py-3 px-3 text-right font-semibold" style={{ color: statusColor[s.status as keyof typeof statusColor] }}>
                      {s.avgScore}%
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full border ${statusBadge[s.status as keyof typeof statusBadge]}`}>
                        {statusLabel[s.status as keyof typeof statusLabel]}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default SkillAnalytics;
