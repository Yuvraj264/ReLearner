import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { getActivities } from "../controllers/activity.controller.js";

const router = express.Router();

router.use(protect);

router.get("/", getActivities);

export default router;
