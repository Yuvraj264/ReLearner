import React from "react";
import { useNavigate } from "react-router-dom";
import PageTransition from "@/components/PageTransition";
import SkillCard from "@/components/cards/SkillCard";
import { useLearner } from "@/context/LearnerContext";

const LearnerSkills = () => {
  const navigate = useNavigate();
  const { skills } = useLearner();

  return (
    <PageTransition>
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            My Skills
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track learning, completion, and retention
          </p>
        </div>

        {skills.length === 0 && (
          <p className="text-muted-foreground">
            No skills enrolled yet.
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {skills.map(skill => (
            <SkillCard
              key={skill._id}
              id={skill._id}
              name={skill.title}
              category={skill.category}
              healthScore={skill.retention?.health ?? 0}
              learned={skill.status === "completed"}
              enrolled
              nextRecallDate={skill.retention?.nextRecall}
              modulesCompleted={skill.completedModules}
              totalModules={skill.totalModules}
              onClick={() =>
                navigate(`/learner/skills/${skill._id}`)
              }
            />
          ))}
        </div>
      </div>
    </PageTransition>
  );
};

export default LearnerSkills;
