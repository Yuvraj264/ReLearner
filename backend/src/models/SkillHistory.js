import mongoose from "mongoose";

const skillHistorySchema = new mongoose.Schema(
  {
    skillId: mongoose.Schema.Types.ObjectId,
    userId: mongoose.Schema.Types.ObjectId,
    action: {
      type: String,
      enum: ["module_completed", "assessment_completed", "recall_completed"]
    },
    healthAfter: Number
  },
  { timestamps: true }
);

export default mongoose.model("SkillHistory", skillHistorySchema);
