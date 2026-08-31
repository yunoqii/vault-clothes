import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "no token provided" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };
        req.userId = decoded.userId;

        const user = await prisma.user.findUnique({
            where: {
                id: req.userId,
            }
        });

        if (!user) {
            return res.status(404).json({ error: "user not found" });
        }

        if (user.isBanned === false) {
            next();
        } else {
            return res.status(403).json({ error: "Oops you're banned" });
        }

    } catch {
        return res.status(401).json({ error: "invalid or expired token" });
    }
};
