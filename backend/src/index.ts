import express from "express";
import cors from "cors";
import path from "path";
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import "dotenv/config";
import authRouter from "./routes/auth.routes";
import postRouter from "./routes/post.routes";
import followRouter from "./routes/follow.routes";
import commentRouter from "./routes/comment.routes";
import listingRouter from "./routes/listing.routes";
import adminRouter from "./routes/admin.routes";
import conversationRouter from "./routes/conversation.routes";
import { socketAuth } from "./middlewares/socketAuth.middleware";
import { setupChatSockets } from "./sockets/chat.socket";
const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));
app.use("/auth", authRouter);
app.use("/posts", postRouter);
app.use("/users", followRouter);
app.use("/comments", commentRouter);
app.use("/listings", listingRouter);
app.use("/admin", adminRouter);
app.use("/conversations", conversationRouter);


const httpServer = createServer(app);
const io = new SocketIOServer(httpServer, {
    cors: {
        origin: "*",
    },
});

io.use(socketAuth);

setupChatSockets(io);

io.on("connection", (socket) => {
    console.log(`socket connected: ${socket.id}`);

    socket.on("disconnect", (reason) => {
        console.log(`socket disconnected: ${socket.id} (${reason})`);
    });
});

httpServer.listen(Number(process.env.BACKEND_PORT), () => {
    console.log(`Server running on port ${process.env.BACKEND_PORT}`)
})
