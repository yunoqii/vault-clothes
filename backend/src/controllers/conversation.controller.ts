import { Request, Response } from "express";
import { Prisma } from "../generated/prisma/client";
import { prisma } from "../lib/prisma";

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
