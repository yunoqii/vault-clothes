import { Server as SocketIOServer, Socket } from "socket.io";
import { prisma } from "../lib/prisma";

export const setupChatSockets = (io: SocketIOServer) => {
    io.on("connection", (socket: Socket) => {
        socket.on("join_conversation", async (conversationId: string) => {
            const conversation = await prisma.conversation.findUnique({
                where: { id: conversationId },
            });

            if (!conversation) {
                return socket.emit("conversation_error", { message: "conversation not found" });
            }

            const userId = socket.data.userId;

            if (conversation.participantAId !== userId && conversation.participantBId !== userId) {
                return socket.emit("conversation_error", { message: "not a participant of this conversation" });
            }

            socket.join(conversationId);
            console.log(`socket ${socket.id} joined conversation ${conversationId}`);
        });
    });
};
