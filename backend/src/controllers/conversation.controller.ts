import { Request, Response } from "express";
import { Prisma } from "../generated/prisma/client";
import { prisma } from "../lib/prisma";
import { getConversationForParticipant } from "../lib/conversationAccess";
import { getPaginationParams, getNextCursor } from "../lib/pagination";

export const createConversation = async (req: Request, res: Response) => {
    const { otherUserId } = req.body;
    const userId = req.userId as string;

    if (typeof otherUserId !== "string") {
        return res.status(400).json({ error: "otherUserId is required" });
    }

    if (otherUserId === userId) {
        return res.status(400).json({ error: "cannot start a conversation with yourself" });
    }

    const otherUser = await prisma.user.findUnique({ where: { id: otherUserId } });

    if (!otherUser) {
        return res.status(404).json({ error: "user not found" });
    }

    const [participantAId, participantBId] = [userId, otherUserId].sort();

    try {
        const conversation = await prisma.conversation.create({
            data: {
                participantAId,
                participantBId,
            },
        });

        return res.status(201).json(conversation);
    } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
            const existing = await prisma.conversation.findUnique({
                where: {
                    participantAId_participantBId: {
                        participantAId,
                        participantBId,
                    },
                },
            });

            return res.status(200).json(existing);
        }

        return res.status(500).json({ error: "something went wrong" });
    }
};

export const getConversationMessages = async (req: Request, res: Response) => {
    const conversationId = req.params.id;
    const userId = req.userId as string;

    if (typeof conversationId !== "string") {
        return res.status(400).json({ error: "invalid conversation id" });
    }

    const { conversation, isParticipant } = await getConversationForParticipant(conversationId, userId);

    if (!conversation) {
        return res.status(404).json({ error: "conversation not found" });
    }

    if (!isParticipant) {
        return res.status(403).json({ error: "not a participant of this conversation" });
    }

    const { take, cursorClause } = getPaginationParams(req.query.limit, req.query.cursor, 20, 50);

    const messages = await prisma.message.findMany({
        where: { conversationId },
        orderBy: { createdAt: "desc" },
        take,
        ...cursorClause,
    });

    const nextCursor = getNextCursor(messages, take);

    return res.status(200).json({ messages, nextCursor });
};
