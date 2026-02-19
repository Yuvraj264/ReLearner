import express from "express";
import { submitRecall } from "../controllers/recall.controller.js";
import { generateQuestions } from "../controllers/ai.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/generate", protect, generateQuestions);
router.post("/:skillId", protect, submitRecall);

export default router;
