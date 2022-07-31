import express from "express";
import { getStats } from "../controllers/youtube.js";

const router = express.Router();

router.get("/getLikes", getStats);

export default router;
