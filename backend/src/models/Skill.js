import mongoose from "mongoose";

const moduleSchema = new mongoose.Schema({
  title: String,
  completed: Boolean
});

const retentionSchema = new mongoose.Schema({
  health: Number,
  lastReviewed: Date,
  nextRecall: Date,
  decayRate: { type: Number, default: 0.1 },
  criticalThreshold: { type: Number, default: 40 },
  volatilityIndex: { type: Number, default: 1.0 }
});

const skillSchema = new mongoose.Schema(
  {
    userId: mongoose.Schema.Types.ObjectId,
    title: String,
    totalModules: Number,
    completedModules: Number,
    status: {
      type: String,
      enum: ["learning", "assessment", "completed"]
    },
    modules: [moduleSchema],
    retention: retentionSchema
  },
  { timestamps: true }
);

export default mongoose.model("Skill", skillSchema);
