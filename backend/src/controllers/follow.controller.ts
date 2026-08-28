import { Request, Response } from "express";
import { Prisma } from "../generated/prisma/client";
import { prisma } from "../lib/prisma";

export const followUser = async (req: Request, res: Response) => {
    const followingId = req.params.id;
    const followerId = req.userId as string;

    if (typeof followingId !== "string") {
        return res.status(400).json({ error: "invalid user id" });
    }

    if (followingId === followerId) {
        return res.status(400).json({ error: "impossible to follow yourself" });
    }

    try {
        const follow = await prisma.follow.create({
            data: {
                followerId,
                followingId,
            },
        });

        return res.status(201).json(follow);
    } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
            if (err.code === "P2002") {
                return res.status(409).json({ error: "already following this user" });
            }
            if (err.code === "P2003") {
                return res.status(404).json({ error: "user not found" });
            }
        }

        return res.status(400).json({ error: "you cannot follow this user" });
    }
};

export const unfollowUser = async (req: Request, res: Response) => {
    const followingId = req.params.id;
    const followerId = req.userId as string;

    if (typeof followingId !== "string") {
        return res.status(400).json({ error: "invalid user id" });
    }

    try {
        await prisma.follow.delete({
            where: {
                followerId_followingId: {
                    followerId,
                    followingId,
                },
            },
        });

        return res.status(204).send();
    } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
            return res.status(404).json({ error: "you are not following this user" });
        }

        return res.status(400).json({ error: "you cannot unfollow this user" });
    }
};

export const getProfile = async (req: Request, res: Response) => {
    const { username } = req.params;

    if (typeof username !== "string") {
        return res.status(400).json({ error: "invalid username" });
    }

    const user = await prisma.user.findUnique({
        where: { username },
        select: {
            id: true,
            username: true,
            bio: true,
            avatarUrl: true,
            bannerUrl: true,
            createdAt: true,
            _count: {
                select: {
                    followers: true,
                    following: true,
                    posts: true,
                },
            },
        },
    });

    if (!user) {
        return res.status(404).json({ error: "user not found" });
    }

    return res.status(200).json(user);
};
