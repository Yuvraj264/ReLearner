import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Target, RefreshCw, AlertTriangle, ArrowRight, Clock } from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import StatCard from '@/components/cards/StatCard';
import SkillCard from '@/components/cards/SkillCard';
import RetentionChart from '@/components/charts/RetentionChart';
import { skillService } from '@/services/skillService';
import { recallService } from '@/services/recallService';
import { calculateOverallScore } from '@/utils/scoreUtils';

const LearnerDashboard = () => {
  const navigate = useNavigate();
  const learnedSkills = skillService.getLearnedSkills();
  const dueRecalls = skillService.getDueRecalls();
  const enrolledSkills = skillService.getEnrolledSkills();
  const recentSessions = recallService.getRecentSessions(3);
  const recallStats = recallService.getRecallStats();

  const healthScores = learnedSkills.map(s => s.healthScore);
  const overallHealth = calculateOverallScore(healthScores);
  const atRiskCount = learnedSkills.filter(s => s.healthScore >= 40 && s.healthScore < 70).length;
  const criticalCount = learnedSkills.filter(s => s.healthScore < 40).length;

  // Build a retention trend from learned skills' recall history
  const allHistory = learnedSkills.flatMap(s => s.recallHistory);
  const sortedHistory = [...allHistory].sort((a, b) => a.date.localeCompare(b.date));

  return (
    <PageTransition>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Your skill retention at a glance</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Overall Health" value={`${overallHealth}%`} icon={Target} variant="primary" trend={{ value: 5, positive: true }} />
          <StatCard label="Skills Learned" value={learnedSkills.length} icon={Target} />
          <StatCard label="At Risk" value={atRiskCount} icon={AlertTriangle} variant={atRiskCount > 0 ? 'warning' : 'default'} />
          <StatCard label="Critical" value={criticalCount} icon={AlertTriangle} variant={criticalCount > 0 ? 'critical' : 'default'} />
        </div>

        {/* Due Recalls CTA */}
        {dueRecalls.length > 0 && (
          <motion.div
            className="glass-card p-5 border-warning/30 glow-warning"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-warning/10">
                  <Clock className="w-5 h-5 text-warning" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">
                    {dueRecalls.length} recall session{dueRecalls.length > 1 ? 's' : ''} due
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {dueRecalls.map(s => s.name).join(', ')}
                  </p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate(`/learner/recall/${dueRecalls[0].id}`)}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-lg text-warning-foreground bg-warning btn-glow"
              >
                Start Now <ArrowRight className="w-3 h-3" />
              </motion.button>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Retention Trend */}
          <div className="lg:col-span-2 glass-card p-5">
            <h2 className="text-sm font-semibold text-foreground mb-4">Retention Trend</h2>
            <RetentionChart data={sortedHistory.length > 1 ? sortedHistory : [{ date: 'Now', score: overallHealth }]} height={220} />
          </div>

          {/* Recall Stats */}
          <div className="glass-card p-5 space-y-4">
            <h2 className="text-sm font-semibold text-foreground">Recall Performance</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Total Sessions</span>
                <span className="text-sm font-semibold text-foreground">{recallStats.total}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Pass Rate</span>
                <span className="text-sm font-semibold text-healthy">{recallStats.passRate}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Avg Score</span>
                <span className="text-sm font-semibold text-foreground">{recallStats.avgScore}</span>
              </div>
            </div>
            {recentSessions.length > 0 && (
              <div className="pt-3 border-t border-border">
                <p className="text-xs text-muted-foreground mb-2">Recent Sessions</p>
                {recentSessions.map(s => (
                  <div key={s.id} className="flex items-center justify-between py-1.5">
                    <span className="text-xs text-foreground truncate flex-1 mr-2">{s.skillName}</span>
                    <span className={`text-xs font-semibold ${s.passed ? 'text-healthy' : 'text-critical'}`}>{s.score}%</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Skills Grid */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-foreground">Your Skills</h2>
            <button onClick={() => navigate('/learner/skills')} className="text-xs text-primary hover:underline">View all</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {enrolledSkills.slice(0, 6).map(skill => (
              <SkillCard
                key={skill.id}
                id={skill.id}
                name={skill.name}
                category={skill.category}
                healthScore={skill.healthScore}
                learned={skill.learned}
                enrolled={skill.enrolled}
                nextRecallDate={skill.nextRecallDate}
                modulesCompleted={skill.modules.filter(m => m.completed).length}
                totalModules={skill.modules.length}
              />
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default LearnerDashboard;
