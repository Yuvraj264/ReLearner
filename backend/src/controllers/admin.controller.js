import Skill from "../models/Skill.js";
import SkillHistory from "../models/SkillHistory.js";

export const platformStats = async (req, res) => {
  const totalSkills = await Skill.countDocuments();
  const completedSkills = await Skill.countDocuments({ status: "completed" });
  const atRiskSkills = await Skill.countDocuments({
    "retention.health": { $lt: 60 }
  });

  res.json({ totalSkills, completedSkills, atRiskSkills });
};

export const skillAnalytics = async (req, res) => {
  const skills = await Skill.find();

  const analytics = skills.map(skill => ({
    title: skill.title,
    status: skill.status,
    health: skill.retention?.health || null,
    completedModules: skill.completedModules,
    totalModules: skill.totalModules
  }));

  res.json(analytics);
};

export const skillTimeline = async (req, res) => {
  const history = await SkillHistory.find()
    .sort({ createdAt: -1 })
    .limit(100);

  res.json(history);
};
