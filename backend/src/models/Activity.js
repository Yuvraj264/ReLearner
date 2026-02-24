import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        type: {
            type: String,
            enum: ['recall_completed', 'skill_risk_change', 'new_skill_added', 'streak_milestone', 'module_completed'],
            required: true
        },
        title: { type: String, required: true },
        description: { type: String, required: true },
        metadata: { type: mongoose.Schema.Types.Mixed },
    },
    { timestamps: true }
);

export default mongoose.model("Activity", activitySchema);
