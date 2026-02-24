import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import skillRoutes from "./routes/skill.routes.js";
import recallRoutes from "./routes/recall.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import healthRoutes from "./routes/health.routes.js";

import authRoutes from "./routes/auth.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import activityRoutes from "./routes/activity.routes.js";
import interviewRoutes from "./routes/interview.routes.js";

const app = express();
app.use("/health", healthRoutes);

app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300
});
app.use(limiter);

app.use("/api/auth", authRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/recall", recallRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/interviews", interviewRoutes);

export default app;
