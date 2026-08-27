import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";

export const register = async (req: Request, res: Response) => {
    const { email, username, password } = req.body;

    const existingUser = await prisma.user.findFirst({
        where: {
            OR: [{ email }, { username }],
        },
    });

    if (existingUser) {
        const field = existingUser.email === email ? "email" : "username";
        return res.status(409).json({ error: `${field} is already taken` });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: {
            email,
            username,
            passwordHash,
        }
    });

    return res.status(201).json({
        id: user.id,
        email: user.email,
        username: user.username,
    })
};

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        return res.status(401).json({ error: "invalid email or password" });
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatches) {
        return res.status(401).json({ error: "invalid email or password" });
    }

    const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET as string,
        { expiresIn: "7d" }
    );

    return res.status(200).json({
        token,
        user: {
            id: user.id,
            email: user.email,
            username: user.username,
        },
    });
};
