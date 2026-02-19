import Skill from "../models/Skill.js";
import SkillHistory from "../models/SkillHistory.js";

export const submitRecall = async (req, res) => {
  const { skillId } = req.params;
  const { score = 1, difficulty = "medium" } = req.body;

  const skill = await Skill.findById(skillId);
  if (!skill) {
    return res.status(404).json({ message: "Skill not found" });
  }

  const multipliers = {
    easy: 3,
    medium: 5,
    hard: 8
  };

  const boost = score
    ? multipliers[difficulty]
    : -10;

  skill.retention.health = Math.min(
    Math.max(skill.retention.health + boost, 0),
    100
  );

  skill.retention.lastReviewed = new Date();
  skill.retention.nextRecall = new Date(
    Date.now() + 7 * 24 * 60 * 60 * 1000
  );

  await skill.save();
  res.json(skill);
};
