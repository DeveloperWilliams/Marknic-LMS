import express from "express";
import {
  signup,
  login,
  resendVerificationEmail,
  verifyEmail,
  requestPasswordReset,
  updatePassword,
} from "../../controllers/authController";
import { protect } from "../../middleware/auth";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/resend-verification-email", resendVerificationEmail);
router.post("/verify-email", verifyEmail);
router.post("/request-password-reset", protect, requestPasswordReset);
router.post("/update-password", protect, updatePassword);



export default router;
