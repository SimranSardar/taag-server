import express from "express";
import {
  userLogin,
  requestPasswordReset,
  verifyResetToken,
  resetPassword,
} from "../controllers/auth.js";

const router = express.Router();

router.post("/login", userLogin);
router.post("/request-password-reset", requestPasswordReset);
router.get("/verify-reset-token", verifyResetToken);
router.post("/reset-password", resetPassword);

export default router;
