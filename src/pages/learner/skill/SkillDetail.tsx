import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2, Circle, Lock, RefreshCw, Clock } from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import ScoreRing from '@/components/charts/ScoreRing';
import RetentionChart from '@/components/charts/RetentionChart';
import { skillService } from '@/services/skillService';
import { getSkillHealth } from '@/constants/skillLevels';
import { getScoreColor, getScoreLabel } from '@/utils/scoreUtils';
import { formatRelativeDate } from '@/utils/dateUtils';

const statusBadge = {
  healthy: 'bg-healthy/15 text-healthy border-healthy/20',
  at_risk: 'bg-warning/15 text-warning border-warning/20',
  critical: 'bg-critical/15 text-critical border-critical/20',
};

const statusLabel = { healthy: 'Healthy', at_risk: 'At Risk', critical: 'Critical' };

const SkillDetail = () => {
  const { skillId } = useParams();
  const navigate = useNavigate();
  const skill = skillService.getSkillById(skillId || '');

  if (!skill) {
    return (
      <PageTransition>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Skill not found.</p>
        </div>
      </PageTransition>
    );
  }

  const health = getSkillHealth(skill.healthScore);
  const allModulesComplete = skill.modules.every(m => m.completed);
  const canMarkLearned = allModulesComplete && skill.assessmentPassed && !skill.learned;

  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto space-y-6">
        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        {/* Header */}
        <div className="glass-card p-6">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div className="flex-1">
              <span className="text-xs font-medium text-primary uppercase tracking-wider">{skill.category} · {skill.role}</span>
              <h1 className="text-xl font-bold text-foreground mt-1">{skill.name}</h1>
              <p className="text-sm text-muted-foreground mt-2 max-w-lg">{skill.description}</p>
              {skill.learned && (
                <div className="flex items-center gap-3 mt-3">
                  <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full border ${statusBadge[health]}`}>
                    {statusLabel[health]}
                  </span>
                  <span className={`text-xs font-medium ${getScoreColor(skill.healthScore)}`}>
                    {getScoreLabel(skill.healthScore)}
                  </span>
                  {skill.lastRecallDate && (
                    <span className="text-xs text-muted-foreground">
                      Last recall: {formatRelativeDate(skill.lastRecallDate)}
                    </span>
                  )}
                </div>
              )}
            </div>
            {skill.learned && <ScoreRing score={skill.healthScore} size={90} strokeWidth={6} />}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Modules */}
          <div className="glass-card p-5">
            <h2 className="text-sm font-semibold text-foreground mb-4">Learning Modules</h2>
            <div className="space-y-2">
              {skill.modules.map((mod, i) => (
                <motion.div
                  key={mod.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  {mod.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-healthy flex-shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  )}
                  <span className={`text-sm flex-1 ${mod.completed ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {mod.title}
                  </span>
                  <span className="text-xs text-muted-foreground flex-shrink-0">{mod.duration}</span>
                </motion.div>
              ))}
            </div>

            {/* Skill Learned Button - LOCKED unless conditions met */}
            <div className="mt-4 pt-4 border-t border-border">
              {skill.learned ? (
                <div className="flex items-center gap-2 text-healthy text-sm">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="font-medium">Skill Learned</span>
                  <span className="text-xs text-muted-foreground ml-auto">
                    {skill.learnedDate && formatRelativeDate(skill.learnedDate)}
                  </span>
                </div>
              ) : (
                <button
                  disabled={!canMarkLearned}
                  className={`w-full py-2.5 text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition-colors ${
                    canMarkLearned
                      ? 'bg-primary text-primary-foreground btn-glow'
                      : 'bg-muted text-muted-foreground cursor-not-allowed'
                  }`}
                >
                  {canMarkLearned ? (
                    <>Mark Skill as Learned</>
                  ) : (
                    <><Lock className="w-3.5 h-3.5" /> Complete all modules & assessment</>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Recall History */}
          <div className="space-y-4">
            {skill.learned && (
              <>
                <div className="glass-card p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-semibold text-foreground">Retention Over Time</h2>
                  </div>
                  {skill.recallHistory.length > 1 ? (
                    <RetentionChart data={skill.recallHistory} height={180} />
                  ) : (
                    <p className="text-xs text-muted-foreground text-center py-8">Not enough data yet.</p>
                  )}
                </div>

                {skill.nextRecallDate && (
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => navigate(`/learner/recall/${skill.id}`)}
                    className="w-full glass-card p-4 flex items-center justify-between hover:border-primary/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <RefreshCw className="w-4 h-4 text-primary" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-medium text-foreground">Start Recall Session</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" /> ~2 min · {skill.recallQuestions.length} questions
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-primary font-medium">Begin →</span>
                  </motion.button>
                )}

                {/* History list */}
                <div className="glass-card p-5">
                  <h2 className="text-sm font-semibold text-foreground mb-3">Recall History</h2>
                  {skill.recallHistory.length === 0 ? (
                    <p className="text-xs text-muted-foreground">No recall sessions yet.</p>
                  ) : (
                    <div className="space-y-2">
                      {[...skill.recallHistory].reverse().map((r, i) => (
                        <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                          <span className="text-xs text-muted-foreground">{formatRelativeDate(r.date)}</span>
                          <span className={`text-sm font-semibold ${getScoreColor(r.score)}`}>{r.score}%</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default SkillDetail;
