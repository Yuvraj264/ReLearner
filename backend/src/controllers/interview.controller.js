import InterviewSession from "../models/InterviewSession.js";
import { logActivity } from "./activity.controller.js";

export const saveSession = async (req, res) => {
    try {
        const { skillId, skillName, metrics, difficultyLevel } = req.body;

        const session = await InterviewSession.create({
            userId: req.user.id,
            skillId,
            skillName,
            metrics,
            difficultyLevel
        });

        await logActivity(
            req.user.id,
            "recall_completed", // Reusing this activity type nicely fits
            "Interview Simulation Finished",
            `Completed a pressure simulation on "${skillName}" with ${metrics.accuracy}% accuracy.`
        );

        res.status(201).json(session);
    } catch (error) {
        console.error("Failed to save interview session:", error);
        res.status(500).json({ message: "Failed to save session" });
    }
};

export const getHistory = async (req, res) => {
    try {
        const history = await InterviewSession.find({ userId: req.user.id })
            .sort({ createdAt: -1 })
            .limit(10);

        res.json(history);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch history" });
    }
};
