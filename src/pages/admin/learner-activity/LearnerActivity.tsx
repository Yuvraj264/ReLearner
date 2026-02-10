import React from 'react';
import { motion } from 'framer-motion';
import { Users, UserCheck, UserX, TrendingDown } from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import StatCard from '@/components/cards/StatCard';
import { useAdmin } from '@/context/AdminContext';

const activityData = [
  { period: 'Today', active: 842, completed: 621, missed: 98 },
  { period: 'This Week', active: 1923, completed: 4210, missed: 580 },
  { period: 'This Month', active: 2650, completed: 12400, missed: 1850 },
];

const inactivityPatterns = [
  { range: 'Inactive 1-3 days', count: 245, pct: 8.6 },
  { range: 'Inactive 4-7 days', count: 124, pct: 4.4 },
  { range: 'Inactive 8-14 days', count: 67, pct: 2.4 },
  { range: 'Inactive 15+ days', count: 38, pct: 1.3 },
];

const LearnerActivity = () => {
  const { analytics } = useAdmin();

  return (
    <PageTransition>
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Learner Activity</h1>
          <p className="text-sm text-muted-foreground mt-1">Aggregate engagement and inactivity patterns (no personal data)</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Learners" value={analytics.totalLearners.toLocaleString()} icon={Users} variant="primary" />
          <StatCard label="Active This Week" value={analytics.activeThisWeek.toLocaleString()} icon={UserCheck} trend={{ value: 8, positive: true }} />
          <StatCard label="Inactive (7d+)" value="191" icon={UserX} variant="warning" />
          <StatCard label="Churn Risk" value="38" icon={TrendingDown} variant="critical" />
        </div>

        {/* Activity Breakdown */}
        <div className="glass-card p-5">
          <h2 className="text-sm font-semibold text-foreground mb-4">Activity Breakdown</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Period</th>
                  <th className="text-right py-3 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Active Learners</th>
                  <th className="text-right py-3 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Recalls Completed</th>
                  <th className="text-right py-3 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Recalls Missed</th>
                </tr>
              </thead>
              <tbody>
                {activityData.map((row, i) => (
                  <motion.tr
                    key={i}
                    className="border-b border-border/50 hover:bg-accent/30 transition-colors"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <td className="py-3 px-3 font-medium text-foreground">{row.period}</td>
                    <td className="py-3 px-3 text-right text-foreground">{row.active.toLocaleString()}</td>
                    <td className="py-3 px-3 text-right text-healthy">{row.completed.toLocaleString()}</td>
                    <td className="py-3 px-3 text-right text-critical">{row.missed.toLocaleString()}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Inactivity Patterns */}
        <div className="glass-card p-5">
          <h2 className="text-sm font-semibold text-foreground mb-4">Inactivity Patterns</h2>
          <div className="space-y-3">
            {inactivityPatterns.map((p, i) => (
              <div key={i} className="flex items-center gap-4">
                <span className="text-sm text-foreground w-40 flex-shrink-0">{p.range}</span>
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-warning rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${p.pct * 5}%` }}
                    transition={{ duration: 0.8, delay: i * 0.1 }}
                  />
                </div>
                <span className="text-xs text-muted-foreground w-16 text-right">{p.count} ({p.pct}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default LearnerActivity;
