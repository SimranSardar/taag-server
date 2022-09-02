import express from "express";
import { getStats, getSubscribers } from "../controllers/youtube.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

router.get("/getLikes", auth, getStats);
router.get("/subscribers", auth, getSubscribers);

export default router;
