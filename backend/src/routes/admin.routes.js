import express from "express";
import {
  platformStats,
  skillAnalytics,
  skillTimeline
} from "../controllers/admin.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { adminOnly } from "../middleware/admin.middleware.js";

const router = express.Router();

router.get("/stats", protect, adminOnly, platformStats);
router.get("/skills", protect, adminOnly, skillAnalytics);
router.get("/timeline", protect, adminOnly, skillTimeline);

export default router;
