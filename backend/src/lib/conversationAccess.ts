import { prisma } from "./prisma";

export const getConversationForParticipant = async (conversationId: string, userId: string) => {
    const conversation = await prisma.conversation.findUnique({
        where: { id: conversationId },
    });

    if (!conversation) {
        return { conversation: null, isParticipant: false };
    }

    const isParticipant =
        conversation.participantAId === userId || conversation.participantBId === userId;

    return { conversation, isParticipant };
};
