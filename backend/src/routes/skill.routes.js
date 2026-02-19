import express from "express";
import {
  getSkills,
  completeModule,
  completeAssessment
} from "../controllers/skill.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { requireBody } from "../middleware/validate.middleware.js";

const router = express.Router();

router.get("/", protect, getSkills);
router.post(
  "/:skillId/module",
  protect,
  requireBody(["moduleId"]),
  completeModule
);
router.post("/:skillId/assessment", protect, completeAssessment);

export default router;
