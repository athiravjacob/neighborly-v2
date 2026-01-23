import { Router } from "express";
import { authController } from "../../infrastructure/di/auth.di";
import { authenticateJwt } from "../middleware/authMiddlewaer";
import { RequireRole } from "../middleware/rbacMiddleware";
import { UserRole } from "../../domain/enums/UserRole";
import { profileController } from "../../infrastructure/di/profile.di";
import { uploadAvatar } from "../middleware/multerMiddleware";

const router = Router();

router.get("/",authenticateJwt,RequireRole(UserRole.HELPER,UserRole.SEEKER),profileController.getProfileDetails.bind(profileController));
router.patch("/personal",authenticateJwt,RequireRole(UserRole.HELPER,UserRole.SEEKER),profileController.updatePersonalDetails.bind(profileController))
router.patch("/avatar",authenticateJwt,RequireRole(UserRole.HELPER,UserRole.SEEKER),uploadAvatar.single("avatar"),profileController.updateProfilePicture.bind(profileController))

export default router;
