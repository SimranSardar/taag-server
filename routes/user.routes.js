import express from "express";
import { createUser } from "../controllers/user.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

router.post("/create", createUser);

export default router;
