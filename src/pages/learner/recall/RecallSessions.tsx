import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { RefreshCw, Clock, ArrowRight } from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import EmptyState from '@/components/empty-states/EmptyState';
import { recallService } from '@/services/recallService';
import { skillService } from '@/services/skillService';
import { formatRelativeDate } from '@/utils/dateUtils';
import { getScoreColor } from '@/utils/scoreUtils';

const RecallSessions = () => {
  const navigate = useNavigate();
  const sessions = recallService.getRecallSessions();
  const dueRecalls = skillService.getDueRecalls();

  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Recall Sessions</h1>
          <p className="text-sm text-muted-foreground mt-1">Quick focused sessions to keep your skills sharp</p>
        </div>

        {/* Due Recalls */}
        {dueRecalls.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-warning">Due Now</h2>
            {dueRecalls.map(skill => (
              <motion.div
                key={skill.id}
                className="glass-card-hover p-4 flex items-center justify-between"
                whileHover={{ y: -2 }}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-warning/10">
                    <RefreshCw className="w-4 h-4 text-warning" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{skill.name}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" /> ~2 min · {skill.recallQuestions.length} questions
                    </p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate(`/learner/recall/${skill.id}`)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg bg-warning text-warning-foreground"
                >
                  Start <ArrowRight className="w-3 h-3" />
                </motion.button>
              </motion.div>
            ))}
          </div>
        )}

        {/* Past Sessions */}
        <div className="glass-card p-5">
          <h2 className="text-sm font-semibold text-foreground mb-4">Session History</h2>
          {sessions.length === 0 ? (
            <EmptyState icon={RefreshCw} title="No sessions yet" description="Complete your first recall session to see your history." />
          ) : (
            <div className="space-y-2">
              {sessions.map(session => (
                <div key={session.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                  <div>
                    <p className="text-sm font-medium text-foreground">{session.skillName}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatRelativeDate(session.date)} · {session.questionsAnswered}/{session.totalQuestions} answered · {Math.round(session.durationSeconds / 60)}m
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`text-sm font-bold ${getScoreColor(session.score)}`}>{session.score}%</span>
                    <p className={`text-xs ${session.passed ? 'text-healthy' : 'text-critical'}`}>
                      {session.passed ? 'Passed' : 'Failed'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default RecallSessions;
