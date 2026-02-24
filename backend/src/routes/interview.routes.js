import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { saveSession, getHistory } from "../controllers/interview.controller.js";

const router = express.Router();

router.use(protect);
router.post("/", saveSession);
router.get("/history", getHistory);

export default router;
