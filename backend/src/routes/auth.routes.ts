import { Router } from "express";
import { register, login } from "../controllers/auth.controller";
import { loginRateLimit } from "../middlewares/loginRateLimit.middleware";

const router = Router();

router.post("/register", register);
router.post("/login", loginRateLimit, login);

export default router;
