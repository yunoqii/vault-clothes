import { Router } from "express";
import { createConversation, getConversationMessages } from "../controllers/conversation.controller";
import { requireAuth } from "../middlewares/auth.middleware";

const router = Router();

router.post("/", requireAuth, createConversation);
router.get("/:id/messages", requireAuth, getConversationMessages);

export default router;
