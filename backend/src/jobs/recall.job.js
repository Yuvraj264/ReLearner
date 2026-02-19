import cron from "node-cron";
import Skill from "../models/Skill.js";
import User from "../models/User.js";
import { transporter } from "../config/mailer.js";

cron.schedule("0 9 * * *", async () => {
  const now = new Date();

  const dueSkills = await Skill.find({
    "retention.nextRecall": { $lte: now }
  });

  for (const skill of dueSkills) {
    const user = await User.findById(skill.userId);
    if (!user) continue;

    await transporter.sendMail({
      to: user.email,
      subject: `Recall Reminder: ${skill.title}`,
      text: `Quick recall needed to maintain your skill strength.`
    });

    skill.retention.health = Math.max(
      skill.retention.health - 5,
      0
    );
    skill.retention.nextRecall = new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000
    );

    await skill.save();
  }
});
