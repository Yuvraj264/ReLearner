import React from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Calendar, Target, RefreshCw, TrendingUp } from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import ScoreRing from '@/components/charts/ScoreRing';
import { useAuth } from '@/context/AuthContext';
import { skillService } from '@/services/skillService';
import { recallService } from '@/services/recallService';
import { calculateOverallScore } from '@/utils/scoreUtils';
import { formatDate } from '@/utils/dateUtils';

const LearnerProfile = () => {
  const { user } = useAuth();
  const learnedSkills = skillService.getLearnedSkills();
  const enrolledSkills = skillService.getEnrolledSkills();
  const recallStats = recallService.getRecallStats();
  const overallHealth = calculateOverallScore(learnedSkills.map(s => s.healthScore));

  return (
    <PageTransition>
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-foreground">Profile</h1>

        <div className="glass-card p-6 flex items-center gap-6">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="w-8 h-8 text-primary" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-foreground">{user?.name}</h2>
            <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {user?.email}</span>
              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Joined {user?.joinedAt ? formatDate(user.joinedAt) : 'N/A'}</span>
            </div>
          </div>
          <ScoreRing score={overallHealth} size={70} strokeWidth={5} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="glass-card p-5 text-center">
            <Target className="w-5 h-5 text-primary mx-auto mb-2" />
            <p className="stat-value">{enrolledSkills.length}</p>
            <p className="stat-label">Skills Enrolled</p>
          </div>
          <div className="glass-card p-5 text-center">
            <RefreshCw className="w-5 h-5 text-primary mx-auto mb-2" />
            <p className="stat-value">{recallStats.total}</p>
            <p className="stat-label">Recall Sessions</p>
          </div>
          <div className="glass-card p-5 text-center">
            <TrendingUp className="w-5 h-5 text-primary mx-auto mb-2" />
            <p className="stat-value">{recallStats.passRate}%</p>
            <p className="stat-label">Pass Rate</p>
          </div>
        </div>

        <div className="glass-card p-5">
          <h2 className="text-sm font-semibold text-foreground mb-4">Skill Health Overview</h2>
          <div className="space-y-3">
            {learnedSkills.map(skill => (
              <div key={skill.id} className="flex items-center gap-3">
                <span className="text-sm text-foreground flex-1 truncate">{skill.name}</span>
                <div className="w-32 h-1.5 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{
                      backgroundColor: skill.healthScore >= 70 ? 'hsl(152, 58%, 42%)' : skill.healthScore >= 40 ? 'hsl(36, 88%, 52%)' : 'hsl(0, 68%, 52%)',
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.healthScore}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                  />
                </div>
                <span className="text-xs font-semibold text-foreground w-8 text-right">{skill.healthScore}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default LearnerProfile;
