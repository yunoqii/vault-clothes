import { Server as SocketIOServer, Socket } from "socket.io";
import { prisma } from "../lib/prisma";
import { getConversationForParticipant } from "../lib/conversationAccess";

export const setupChatSockets = (io: SocketIOServer) => {
    io.on("connection", (socket: Socket) => {
        socket.on("join_conversation", async (conversationId: string) => {
            const userId = socket.data.userId;

            const { conversation, isParticipant } = await getConversationForParticipant(
                conversationId,
                userId
            );

            if (!conversation) {
                return socket.emit("conversation_error", { message: "conversation not found" });
            }

            if (!isParticipant) {
                return socket.emit("conversation_error", { message: "not a participant of this conversation" });
            }

            socket.join(conversationId);
            console.log(`socket ${socket.id} joined conversation ${conversationId}`);
        });

        socket.on("send_message", async ({ conversationId, content }: { conversationId: string; content: string }) => {
            if (typeof conversationId !== "string" || typeof content !== "string" || !content.trim()) {
                return socket.emit("message_error", { message: "invalid payload" });
            }

            const userId = socket.data.userId;

            if (!socket.rooms.has(conversationId)) {
                const { conversation, isParticipant } = await getConversationForParticipant(
                    conversationId,
                    userId
                );

                if (!conversation) {
                    return socket.emit("message_error", { message: "conversation not found" });
                }

                if (!isParticipant) {
                    return socket.emit("message_error", { message: "not a participant of this conversation" });
                }

                socket.join(conversationId);
            }

            const message = await prisma.message.create({
                data: { conversationId, senderId: userId, content },
            });

            io.to(conversationId).emit("new_message", message);
        });
    });
};
