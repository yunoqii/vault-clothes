import { Request, Response } from "express";
import { Prisma } from "../generated/prisma/client";
import { prisma } from "../lib/prisma";
import { getPaginationParams, getNextCursor } from "../lib/pagination";

const ALLOWED_ROLES = ["user", "admin"];

const DEFAULT_USERS_LIMIT = 30;
const MAX_USERS_LIMIT = 100;

export const getAllUsers = async (req: Request, res: Response) => {
    const { cursor, limit } = req.query;
    const { take, cursorClause } = getPaginationParams(limit, cursor, DEFAULT_USERS_LIMIT, MAX_USERS_LIMIT);

    const users = await prisma.user.findMany({
        take,
        orderBy: { createdAt: "desc" },
        omit: { passwordHash: true },
        ...cursorClause,
    });

    const nextCursor = getNextCursor(users, take);

    return res.status(200).json({ users, nextCursor });
};

export const banUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { isBanned } = req.body;

    if (typeof id !== "string") {
        return res.status(400).json({ error: "invalid user id" });
    }

    if (typeof isBanned !== "boolean") {
        return res.status(400).json({ error: "isBanned must be a boolean" });
    }

    if (id === (req.userId as string)) {
        return res.status(400).json({ error: "you cannot ban yourself" });
    }

    const user = await prisma.user.findUnique({
        where: { id },
    });

    if (!user) {
        return res.status(404).json({ error: "user not found" });
    }

    const updatedUser = await prisma.user.update({
        where: { id },
        data: { isBanned },
        omit: { passwordHash: true },
    });

    return res.status(200).json(updatedUser);
};

export const changeUserRole = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { role } = req.body;

    if (typeof id !== "string") {
        return res.status(400).json({ error: "invalid user id" });
    }

    if (typeof role !== "string" || !ALLOWED_ROLES.includes(role)) {
        return res.status(400).json({ error: "invalid role" });
    }

    if (id === (req.userId as string)) {
        return res.status(400).json({ error: "you cannot change your own role" });
    }

    const user = await prisma.user.findUnique({
        where: { id },
    });

    if (!user) {
        return res.status(404).json({ error: "user not found" });
    }

    const updatedUser = await prisma.user.update({
        where: { id },
        data: { role },
        omit: { passwordHash: true },
    });

    return res.status(200).json(updatedUser);
};

export const adminDeleteComment = async (req: Request, res: Response) => {
    const { id } = req.params;

    if (typeof id !== "string") {
        return res.status(400).json({ error: "invalid comment id" });
    }

    try {
        await prisma.comment.delete({
            where: { id },
        });

        return res.status(204).send();
    } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
            if (err.code === "P2025") {
                return res.status(404).json({ error: "comment not found" });
            }
        }

        return res.status(400).json({ error: "could not delete comment" });
    }
};

export const adminDeleteListing = async (req: Request, res: Response) => {
    const { id } = req.params;

    if (typeof id !== "string") {
        return res.status(400).json({ error: "invalid listing id" });
    }

    try {
        await prisma.listing.delete({
            where: { id },
        });

        return res.status(204).send();
    } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
            if (err.code === "P2025") {
                return res.status(404).json({ error: "listing not found" });
            }
        }

        return res.status(400).json({ error: "could not delete listing" });
    }
};
