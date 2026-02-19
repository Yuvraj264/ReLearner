import express from "express";
import { simulateEmail } from "../controllers/notification.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/simulate", protect, simulateEmail);

export default router;
