import { Router } from "express";
import { createConversation } from "../controllers/conversation.controller";
import { requireAuth } from "../middlewares/auth.middleware";

const router = Router();

router.post("/", requireAuth, createConversation);

export default router;
