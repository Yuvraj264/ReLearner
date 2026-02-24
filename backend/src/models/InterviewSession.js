import mongoose from "mongoose";

const interviewSessionSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        skillId: { type: mongoose.Schema.Types.ObjectId, ref: 'Skill' },
        skillName: { type: String, required: true },
        metrics: {
            totalQuestions: Number,
            correctAnswers: Number,
            accuracy: Number,
            averageConfidence: Number,
            averageTimePerQuestion: Number,
            pressureScore: Number,
            pressureInterpretation: String,
            strongestSkill: String,
            weakestSkill: String,
        },
        difficultyLevel: Number,
    },
    { timestamps: true }
);

export default mongoose.model("InterviewSession", interviewSessionSchema);
