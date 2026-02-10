import React from 'react';
import { motion } from 'framer-motion';
import { Users, Target, TrendingUp, RefreshCw, AlertTriangle, Activity } from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import StatCard from '@/components/cards/StatCard';
import RetentionChart from '@/components/charts/RetentionChart';
import RecallBarChart from '@/components/charts/RecallBarChart';
import { useAdmin } from '@/context/AdminContext';

const AdminDashboard = () => {
  const { analytics } = useAdmin();

  return (
    <PageTransition>
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Platform-wide retention analytics</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Learners" value={analytics.totalLearners.toLocaleString()} icon={Users} variant="primary" />
          <StatCard label="Active This Week" value={analytics.activeThisWeek.toLocaleString()} icon={Activity} trend={{ value: 8, positive: true }} />
          <StatCard label="Avg Retention" value={`${analytics.averageRetention}%`} icon={TrendingUp} variant={analytics.averageRetention >= 70 ? 'healthy' : 'warning'} />
          <StatCard label="Recall Completion" value={`${analytics.recallCompletionRate}%`} icon={RefreshCw} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="glass-card p-5 text-center">
            <p className="stat-value text-healthy">{analytics.healthySkills}</p>
            <p className="stat-label">Healthy Skills</p>
          </div>
          <div className="glass-card p-5 text-center">
            <p className="stat-value text-warning">{analytics.atRiskSkills}</p>
            <p className="stat-label">At Risk Skills</p>
          </div>
          <div className="glass-card p-5 text-center">
            <p className="stat-value text-critical">{analytics.criticalSkills}</p>
            <p className="stat-label">Critical Skills</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-card p-5">
            <h2 className="text-sm font-semibold text-foreground mb-4">Retention Trend (Platform)</h2>
            <RetentionChart data={analytics.retentionTrend} height={250} />
          </div>
          <div className="glass-card p-5">
            <h2 className="text-sm font-semibold text-foreground mb-4">Weekly Recall Activity</h2>
            <RecallBarChart data={analytics.weeklyRecalls} height={250} />
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default AdminDashboard;
