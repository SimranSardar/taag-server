import express from "express";
import { getStats, getSubscribers } from "../controllers/youtube.js";

const router = express.Router();

router.get("/getLikes", getStats);
router.get("/subscribers", getSubscribers);

export default router;
