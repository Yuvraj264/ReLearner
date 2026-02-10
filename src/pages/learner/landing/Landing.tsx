import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain, ArrowRight, Shield, RefreshCw, Target, TrendingUp, Clock, Zap } from 'lucide-react';
import AnimatedBackground from '@/components/AnimatedBackground';
import { useAuth } from '@/context/AuthContext';
import { ROLES } from '@/constants/roles';

const features = [
  { icon: RefreshCw, title: 'Smart Recall Engine', desc: 'Automated spaced repetition that adapts to your forgetting curve.' },
  { icon: Target, title: 'Skill Health Tracking', desc: 'Real-time monitoring of retention across every skill you learn.' },
  { icon: TrendingUp, title: 'Decay Prevention', desc: 'Proactive interventions before your knowledge fades away.' },
  { icon: Clock, title: '2-Minute Sessions', desc: 'Interview-focused micro-quizzes that respect your time.' },
  { icon: Shield, title: 'Research-Driven', desc: 'Built on cognitive science — not gamification gimmicks.' },
  { icon: Zap, title: 'Industry-Aligned', desc: 'Skills mapped to real roles, not abstract course catalogs.' },
];

const Landing = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleEnter = (role: 'learner' | 'admin') => {
    login(role);
    navigate(role === 'admin' ? '/admin' : '/learner');
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <AnimatedBackground />
      
      {/* Hero */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6">
        <motion.div
          className="text-center max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 mb-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Brain className="w-4 h-4 text-primary" />
            <span className="text-xs font-medium text-primary">Skill Retention Platform</span>
          </motion.div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight mb-6">
            <span className="text-foreground">Learning doesn't end</span>
            <br />
            <span className="gradient-text-primary">at completion.</span>
          </h1>

          <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed">
            Most platforms hand you a certificate and forget you. RetainIQ ensures you can still use your skills months later — through science-backed retention tracking and smart recall sessions.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleEnter('learner')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-primary-foreground btn-glow transition-all"
              style={{ background: 'linear-gradient(135deg, hsl(192 85% 48%), hsl(210 80% 50%))' }}
            >
              Enter as Learner
              <ArrowRight className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleEnter('admin')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-foreground border border-border hover:border-primary/40 hover:bg-accent transition-all"
            >
              Enter as Admin
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
        </motion.div>

        {/* Features */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto mt-24 mb-12"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1, delayChildren: 0.5 } },
          }}
        >
          {features.map((f, i) => (
            <motion.div
              key={i}
              className="glass-card-hover p-5"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <f.icon className="w-5 h-5 text-primary mb-3" />
              <h3 className="text-sm font-semibold text-foreground mb-1">{f.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.p
          className="text-xs text-muted-foreground/60 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          Built on cognitive science. No certificates. No fluff. Just real retention.
        </motion.p>
      </div>
    </div>
  );
};

export default Landing;
