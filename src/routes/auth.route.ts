import { Router } from "express";
import authController from "../controllers/auth.controller";

const router = Router();

router.post("/auth/login", authController.login);
router.post("/auth-signup", authController.signup);

export default router;