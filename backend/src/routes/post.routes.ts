import { Router } from "express";
import { createPost, getUserFeed } from "../controllers/post.controller";
import { requireAuth } from "../middlewares/auth.middleware";

const router = Router();

router.post("/", requireAuth, createPost);
router.get("/", requireAuth, getUserFeed);

export default router;
