import Activity from "../models/Activity.js";

// Get user activities, sorted by newest
export const getActivities = async (req, res) => {
    try {
        const activities = await Activity.find({ userId: req.user.id })
            .sort({ createdAt: -1 })
            .limit(20);

        res.json(activities);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch activities" });
    }
};

// Internal utility function to log an activity (called by other controllers)
export const logActivity = async (userId, type, title, description, metadata = {}) => {
    try {
        await Activity.create({
            userId,
            type,
            title,
            description,
            metadata
        });
    } catch (err) {
        console.error("Failed to log activity:", err);
    }
};
