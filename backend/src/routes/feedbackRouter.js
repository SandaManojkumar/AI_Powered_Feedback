import express from "express";
import { analyzeFeedback } from "../controllers/feedbackController.js";

const router = express.Router();

router.post("/", analyzeFeedback);

export default router;
