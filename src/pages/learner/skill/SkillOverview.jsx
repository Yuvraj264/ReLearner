import { useParams } from "react-router-dom";
import { useState } from "react";
import { useSkills } from "../../../context/SkillContext";

const SkillOverview = () => {
  const { skillId } = useParams();
  const { skills, completeModule, completeAssessment, completeRecall } =
    useSkills();
  const [viewMode, setViewMode] = useState("default");

  const skill = skills.find(s => s.id === skillId);
  if (!skill) return null;

  const recallDue =
    skill.retention && Date.now() >= skill.retention.nextRecall;

  if (skill.status === "completed" && recallDue) {
    return (
      <div className="max-w-xl mx-auto mt-20">
        <h2 className="text-xl text-white font-semibold">
          Recall Session Due
        </h2>
        <p className="text-gray-400 mt-2">
          Quick revision to maintain skill strength.
        </p>

        <button
          onClick={() => completeRecall(skill.id)}
          className="mt-6 px-5 py-2 rounded bg-cyan-500 text-black"
        >
          Complete Recall
        </button>
      </div>
    );
  }

  if (skill.status === "completed" && viewMode === "default") {
    return (
      <div className="max-w-xl mx-auto mt-20">
        <h2 className="text-2xl font-semibold text-white">
          {skill.title}
        </h2>
        <p className="text-gray-400 mt-2">
          Skill Health: {skill.retention.health}%
        </p>

        <button
          onClick={() => setViewMode("revisit")}
          className="mt-6 px-5 py-2 rounded bg-cyan-500 text-black"
        >
          Revisit Course
        </button>
      </div>
    );
  }

  if (skill.status === "assessment") {
    return (
      <div className="max-w-xl mx-auto mt-20">
        <h2 className="text-xl text-white font-semibold">
          Final Assessment
        </h2>

        <button
          onClick={() => completeAssessment(skill.id)}
          className="mt-6 px-5 py-2 rounded bg-cyan-500 text-black"
        >
          Complete Assessment
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto mt-20">
      <h2 className="text-xl text-white font-semibold">
        {skill.title}
      </h2>

      <div className="mt-6 space-y-3">
        {skill.modules.map((module, index) => {
          const locked =
            index > 0 && !skill.modules[index - 1].completed;

          return (
            <div
              key={module.id}
              className="flex justify-between items-center p-3 rounded bg-neutral-900"
            >
              <span
                className={`${
                  locked ? "text-gray-500" : "text-gray-200"
                }`}
              >
                {module.title}
              </span>

              {!module.completed && !locked && (
                <button
                  onClick={() =>
                    completeModule(skill.id, module.id)
                  }
                  className="text-sm text-cyan-400"
                >
                  Mark Complete
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SkillOverview;
