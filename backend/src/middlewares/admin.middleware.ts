import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";

export const requireAdmin = async (req: Request, res: Response, next: NextFunction) => {
    const user = await prisma.user.findUnique({
        where: { id: req.userId as string },
    });

    if (user === null) {
        return res.status(404).json({ error: "user not found" });
    }

    if (user.role === "admin") {
        next();
    } else {
        return res.status(403).json({ error: "no permissions" });
    }

}