import { Router } from "express";
import { createPost, getUserFeed, likePost, unlikePost } from "../controllers/post.controller";
import { leaveComment, getComments } from "../controllers/comments.controller";
import { requireAuth } from "../middlewares/auth.middleware";

const router = Router();

router.post("/", requireAuth, createPost);
router.get("/", requireAuth, getUserFeed);
router.post("/:id/like", requireAuth, likePost);
router.delete("/:id/like", requireAuth, unlikePost);
router.post("/:id/comments", requireAuth, leaveComment);
router.get("/:id/comments", getComments);

export default router;
