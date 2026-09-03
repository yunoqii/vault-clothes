import { Socket } from "socket.io";
import jwt from "jsonwebtoken";

export const socketAuth = (socket: Socket, next: (err?: Error) => void) => {
    const token = socket.handshake.auth.token ?? socket.handshake.query.token;

    if (!token) {
        return next(new Error("no token provided"));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };
        socket.data.userId = decoded.userId;
        next();
    } catch {
        next(new Error("invalid or expired token"));
    }
};
