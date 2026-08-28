import { Router } from "express";
import { followUser, unfollowUser, getProfile } from "../controllers/follow.controller";
import { requireAuth } from "../middlewares/auth.middleware";

const router = Router();

router.post("/:id/follow", requireAuth, followUser);
router.delete("/:id/follow", requireAuth, unfollowUser);
router.get("/:username", getProfile);

export default router;
