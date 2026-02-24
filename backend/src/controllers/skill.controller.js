import Skill from "../models/Skill.js";
import SkillHistory from "../models/SkillHistory.js";
import { logActivity } from "./activity.controller.js";

const computeReadiness = skill => {
  if (!skill.retention) return 0;

  return Math.min(
    Math.round(
      (skill.retention.health +
        (skill.completedModules / skill.totalModules) * 100) /
      2
    ),
    100
  );
};

export const getSkills = async (req, res) => {
  const skills = await Skill.find({ userId: req.user.id });
  res.json(skills);
};

export const completeModule = async (req, res) => {
  const skill = await Skill.findById(req.params.skillId);

  skill.modules.id(req.body.moduleId).completed = true;
  skill.completedModules++;

  if (skill.completedModules === skill.totalModules) {
    skill.status = "assessment";
  }

  await skill.save();

  await SkillHistory.create({
    skillId: skill._id,
    userId: skill.userId,
    action: "module_completed"
  });

  await logActivity(
    req.user.id,
    "module_completed",
    "Module Completed",
    `Completed a module in "${skill.title}".`
  );

  res.json(skill);
};

export const completeAssessment = async (req, res) => {
  const skill = await Skill.findById(req.params.skillId);

  skill.status = "completed";
  skill.retention = {
    health: 80,
    lastReviewed: new Date(),
    nextRecall: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
  };

  await skill.save();

  await SkillHistory.create({
    skillId: skill._id,
    userId: skill.userId,
    action: "assessment_completed",
    healthAfter: 80
  });

  await logActivity(
    req.user.id,
    "recall_completed",
    "Assessment Passed!",
    `Passed the assessment for "${skill.title}". Skill learned!`
  );

  res.json({
    ...skill.toObject(),
    readiness: computeReadiness(skill)
  });
};
