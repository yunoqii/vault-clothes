import { Request, Response, NextFunction } from "express";
import { checkLoginRateLimit } from "../lib/loginAttempts";

export const loginRateLimit = async (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip ?? "unknown";
    const email = typeof req.body?.email === "string" ? req.body.email : "unknown";

    const { limited } = await checkLoginRateLimit(ip, email);

    if (limited) {
        return res.status(429).json({ error: "too many login attempts, try again later" });
    }

    next();
};
