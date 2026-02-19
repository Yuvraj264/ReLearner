import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Clock,
  ArrowRight,
  Brain,
  Zap,
  TrendingUp,
  Activity
} from "lucide-react";

import PageTransition from "@/components/PageTransition";
import SkillCard from "@/components/cards/SkillCard";
import CognitiveStability from "@/components/dashboard/CognitiveStability";
import RiskIndex from "@/components/dashboard/RiskIndex";
import RecallMomentum from "@/components/dashboard/RecallMomentum";
import WeeklyGrowth from "@/components/dashboard/WeeklyGrowth";
import { DashboardSkeleton } from "@/components/skeletons/DashboardSkeleton";

import { useLearner } from "@/context/LearnerContext";
import { calculateOverallScore } from "@/utils/scoreUtils";

const LearnerDashboard = () => {
  const navigate = useNavigate();
  const { skills, loading } = useLearner();

  const learnedSkills = useMemo(
    () => skills.filter(s => s.status === "completed"),
    [skills]
  );

  const dueRecalls = useMemo(() => {
    const now = Date.now();
    return learnedSkills.filter(
      s =>
        s.retention &&
        new Date(s.retention.nextRecall).getTime() <= now
    );
  }, [learnedSkills]);

  const healthScores = learnedSkills.map(s => s.retention?.health ?? 0);
  const overallHealth = calculateOverallScore(healthScores);

  // Mock data for new widgets (Replace with real data later)
  const averageRisk = 25; // Safe
  const currentStreak = 12;
  const weeklyGrowthRate = 4.2;
  const growthHistory = [
    { value: 10 }, { value: 15 }, { value: 12 }, { value: 18 }, { value: 24 }, { value: 28 }, { value: 32 }
  ];

  if (loading) return <DashboardSkeleton />;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto space-y-8 pb-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
              <Brain className="text-primary w-8 h-8" />
              Command Center
            </h1>
            <p className="text-muted-foreground mt-1 text-sm md:text-base">
              Real-time intelligence on your knowledge portfolio.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-medium text-primary flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              System Operational
            </div>
          </div>
        </div>

        {/* Intelligence Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <motion.div variants={item} className="w-full">
            <CognitiveStability score={overallHealth} />
          </motion.div>
          <motion.div variants={item} className="w-full">
            <RiskIndex riskScore={averageRisk} />
          </motion.div>
          <motion.div variants={item} className="w-full">
            <RecallMomentum streak={currentStreak} />
          </motion.div>
          <motion.div variants={item} className="w-full">
            <WeeklyGrowth growthRate={weeklyGrowthRate} history={growthHistory} />
          </motion.div>
        </motion.div>

        {/* Action Sector: Due Recalls */}
        {dueRecalls.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="relative overflow-hidden rounded-xl border border-warning/30 bg-background/40 backdrop-blur-xl p-6 shadow-2xl"
          >
            <div className="absolute top-0 left-0 w-1 h-full bg-warning"></div>
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-warning/10 border border-warning/20 shadow-[0_0_15px_rgba(255,165,0,0.3)]">
                  <Clock className="w-6 h-6 text-warning" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">
                    Action Required: {dueRecalls.length} Skills Critical
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Immediate recall session recommended to prevent memory decay.
                  </p>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(`/learner/recall/${dueRecalls[0]._id}`)}
                className="group relative inline-flex items-center gap-2 px-6 py-3 text-sm font-bold text-background bg-warning rounded-lg overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Initiate Recall Protocol <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Skills Matrix */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold text-foreground">Active Neural Nodes</h2>
            </div>
            <button
              onClick={() => navigate("/learner/skills")}
              className="text-xs font-mono text-muted-foreground hover:text-primary transition-colors uppercase tracking-wider"
            >
              [ View All Nodes ]
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {skills.slice(0, 6).map((skill, index) => (
              <motion.div
                key={skill._id || skill.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.05 }}
              >
                <SkillCard
                  id={skill._id || skill.id}
                  name={skill.title}
                  category={skill.category}
                  healthScore={skill.retention?.health ?? 0}
                  learned={skill.status === "completed"}
                  enrolled
                  nextRecallDate={skill.retention?.nextRecall}
                  lastRecallDate={skill.retention?.lastReviewed}
                  decayRate={skill.retention?.decayRate}
                  criticalThreshold={skill.retention?.criticalThreshold}
                  modulesCompleted={skill.completedModules}
                  totalModules={skill.totalModules}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default LearnerDashboard;
