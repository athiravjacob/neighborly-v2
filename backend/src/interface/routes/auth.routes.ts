import { Router } from "express";
import { authController } from "../../infrastructure/di/auth.di";

const router = Router();

router.post(
  "/signup/email",authController.signupWithEmail.bind(authController)
);

export default router;
