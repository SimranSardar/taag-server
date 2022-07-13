import express from "express";
import { getPostData } from "../controllers/instagram.js";

const router = express.Router();

router.get("/", getPostData);

export default router;
