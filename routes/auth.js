import express from "express";
import { userLogin, requestPasswordResetBrand } from "../controllers/auth.js";

const router = express.Router();

router.post("/login", userLogin);
router.post("/request-password-reset", requestPasswordResetBrand);

export default router;
