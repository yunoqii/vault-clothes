import { Router } from "express";
import { deleteComment } from "../controllers/comments.controller";
import { requireAuth } from "../middlewares/auth.middleware";

const router = Router();

router.delete("/:id", requireAuth, deleteComment);

export default router;
