import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Target,
  AlertTriangle,
  ArrowRight,
  Clock
} from "lucide-react";

import PageTransition from "@/components/PageTransition";
import StatCard from "@/components/cards/StatCard";
import SkillCard from "@/components/cards/SkillCard";
import RetentionChart from "@/components/charts/RetentionChart";
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

  const enrolledSkills = useMemo(
    () => skills.filter(s => s.status !== "completed"),
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

  const atRiskCount = learnedSkills.filter(
    s => s.retention && s.retention.health >= 40 && s.retention.health < 70
  ).length;

  const criticalCount = learnedSkills.filter(
    s => s.retention && s.retention.health < 40
  ).length;

  const retentionTrend = useMemo(() => {
    const history = learnedSkills.flatMap(s =>
      s.history?.map(h => ({
        date: h.createdAt,
        score: h.healthAfter ?? s.retention.health
      })) ?? []
    );

    return history.length > 1
      ? history.sort((a, b) => a.date.localeCompare(b.date))
      : [{ date: "Now", score: overallHealth }];
  }, [learnedSkills, overallHealth]);

  if (loading) return <DashboardSkeleton />;

  return (
    <PageTransition>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Your skill retention at a glance
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Overall Health"
            value={`${overallHealth}%`}
            icon={Target}
            variant="primary"
          />
          <StatCard
            label="Skills Learned"
            value={learnedSkills.length}
            icon={Target}
          />
          <StatCard
            label="At Risk"
            value={atRiskCount}
            icon={AlertTriangle}
            variant={atRiskCount > 0 ? "warning" : "default"}
          />
          <StatCard
            label="Critical"
            value={criticalCount}
            icon={AlertTriangle}
            variant={criticalCount > 0 ? "critical" : "default"}
          />
        </div>

        {/* Due Recalls */}
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
                    {dueRecalls.length} recall session
                    {dueRecalls.length > 1 ? "s" : ""} due
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {dueRecalls.map(s => s.title).join(", ")}
                  </p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() =>
                  navigate(`/learner/recall/${dueRecalls[0]._id}`)
                }
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
            <h2 className="text-sm font-semibold text-foreground mb-4">
              Retention Trend
            </h2>
            <RetentionChart data={retentionTrend} height={220} />
          </div>

          {/* Skills Overview */}
          <div className="glass-card p-5 space-y-4">
            <h2 className="text-sm font-semibold text-foreground">
              Skills Overview
            </h2>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Total Enrolled: {skills.length}</p>
              <p>Learned: {learnedSkills.length}</p>
              <p>Pending: {enrolledSkills.length}</p>
            </div>
          </div>
        </div>

        {/* Skills Grid */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-foreground">
              Your Skills
            </h2>
            <button
              onClick={() => navigate("/learner/skills")}
              className="text-xs text-primary hover:underline"
            >
              View all
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {skills.slice(0, 6).map(skill => (
              <SkillCard
                key={skill._id || skill.id}
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
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default LearnerDashboard;
