import cron from "node-cron";
import Skill from "../models/Skill.js";

cron.schedule("0 0 * * *", async () => {
  const skills = await Skill.find({ status: "completed" });

  for (const skill of skills) {
    if (!skill.retention) continue;

    const daysSinceReview =
      (Date.now() - skill.retention.lastReviewed) /
      (1000 * 60 * 60 * 24);

    if (daysSinceReview > 3) {
      skill.retention.health = Math.max(
        skill.retention.health - Math.floor(daysSinceReview),
        0
      );
      await skill.save();
    }
  }
});
