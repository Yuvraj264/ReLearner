import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle2, XCircle, Clock, ArrowRight } from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import { skillService } from '@/services/skillService';

const RecallQuiz = () => {
  const { skillId } = useParams();
  const navigate = useNavigate();
  const skill = skillService.getSkillById(skillId || '');

  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [results, setResults] = useState<boolean[]>([]);
  const [completed, setCompleted] = useState(false);

  if (!skill || skill.recallQuestions.length === 0) {
    return (
      <PageTransition>
        <div className="max-w-2xl mx-auto flex flex-col items-center justify-center h-64">
          <p className="text-muted-foreground mb-4">No recall questions available for this skill.</p>
          <button onClick={() => navigate(-1)} className="text-sm text-primary hover:underline">Go back</button>
        </div>
      </PageTransition>
    );
  }

  const questions = skill.recallQuestions;
  const question = questions[currentQ];
  const isCorrect = selected === question.correctIndex;

  const handleSelect = (idx: number) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    setResults(prev => [...prev, idx === question.correctIndex]);
  };

  const handleNext = () => {
    if (currentQ + 1 >= questions.length) {
      setCompleted(true);
    } else {
      setCurrentQ(prev => prev + 1);
      setSelected(null);
      setAnswered(false);
    }
  };

  const score = Math.round((results.filter(Boolean).length / questions.length) * 100);

  if (completed) {
    return (
      <PageTransition>
        <div className="max-w-lg mx-auto space-y-6 text-center pt-12">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            {score >= 70 ? (
              <CheckCircle2 className="w-16 h-16 text-healthy mx-auto mb-4" />
            ) : (
              <XCircle className="w-16 h-16 text-critical mx-auto mb-4" />
            )}
            <h1 className="text-2xl font-bold text-foreground">Recall Complete</h1>
            <p className="text-4xl font-extrabold mt-2" style={{ color: score >= 70 ? 'hsl(152, 58%, 42%)' : score >= 40 ? 'hsl(36, 88%, 52%)' : 'hsl(0, 68%, 52%)' }}>
              {score}%
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {results.filter(Boolean).length} of {questions.length} correct · {skill.name}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {score >= 70 ? 'Great retention! Keep it up.' : 'Consider reviewing this skill soon.'}
            </p>
          </motion.div>
          <div className="flex gap-3 justify-center mt-6">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/learner/recall')}
              className="px-5 py-2 text-sm font-medium rounded-lg border border-border text-foreground hover:bg-accent transition-colors"
            >
              Back to Recalls
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/learner/dashboard')}
              className="px-5 py-2 text-sm font-medium rounded-lg text-primary-foreground bg-primary btn-glow"
            >
              Dashboard
            </motion.button>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="max-w-2xl mx-auto space-y-6">
        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" /> Exit Quiz
        </button>

        <div className="glass-card p-6">
          {/* Progress */}
          <div className="flex items-center justify-between mb-6">
            <span className="text-xs text-muted-foreground">{skill.name}</span>
            <div className="flex items-center gap-2">
              <Clock className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Question {currentQ + 1}/{questions.length}</span>
            </div>
          </div>

          <div className="h-1 bg-muted rounded-full mb-6 overflow-hidden">
            <motion.div
              className="h-full bg-primary rounded-full"
              animate={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentQ}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <h2 className="text-lg font-semibold text-foreground mb-6">{question.question}</h2>

              <div className="space-y-3">
                {question.options.map((opt, idx) => {
                  let optClass = 'border-border hover:border-primary/40 hover:bg-accent/50';
                  if (answered) {
                    if (idx === question.correctIndex) optClass = 'border-healthy/50 bg-healthy/10';
                    else if (idx === selected) optClass = 'border-critical/50 bg-critical/10';
                    else optClass = 'border-border opacity-50';
                  }

                  return (
                    <motion.button
                      key={idx}
                      whileHover={!answered ? { scale: 1.01 } : {}}
                      whileTap={!answered ? { scale: 0.99 } : {}}
                      onClick={() => handleSelect(idx)}
                      className={`w-full text-left p-4 rounded-xl border text-sm transition-all ${optClass} ${answered ? 'cursor-default' : 'cursor-pointer'}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-xs font-medium flex-shrink-0">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="text-foreground">{opt}</span>
                        {answered && idx === question.correctIndex && <CheckCircle2 className="w-4 h-4 text-healthy ml-auto" />}
                        {answered && idx === selected && idx !== question.correctIndex && <XCircle className="w-4 h-4 text-critical ml-auto" />}
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {answered && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 rounded-xl bg-muted/50 border border-border"
                >
                  <p className="text-xs text-muted-foreground">{question.explanation}</p>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>

          {answered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 flex justify-end"
            >
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleNext}
                className="inline-flex items-center gap-1.5 px-5 py-2 text-sm font-medium rounded-lg text-primary-foreground bg-primary btn-glow"
              >
                {currentQ + 1 >= questions.length ? 'See Results' : 'Next'} <ArrowRight className="w-3 h-3" />
              </motion.button>
            </motion.div>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default RecallQuiz;
