import { Request, Response } from "express";
import { Prisma } from "../generated/prisma/client";
import { prisma } from "../lib/prisma";

export const createPost = async (req: Request, res: Response) => {
    const { caption, title, imageUrl } = req.body;

    const post = await prisma.post.create({
        data: {
            caption,
            title,
            imageUrl,
            authorId: req.userId as string,
        },
    });

    return res.status(201).json(post);
};


const DEFAULT_FEED_LIMIT = 10;
const MAX_FEED_LIMIT = 50;

export const getUserFeed = async (req: Request, res: Response) => {
    const { cursor, limit } = req.query;

    let take = DEFAULT_FEED_LIMIT;
    if (typeof limit === "string") {
        const parsedLimit = Number(limit);
        if (!Number.isNaN(parsedLimit) && parsedLimit > 0) {
            take = Math.min(parsedLimit, MAX_FEED_LIMIT);
        }
    }

    const follows = await prisma.follow.findMany({
        where: {
            followerId: req.userId as string,
        }
    });

    const followingIds = follows.map((follow) => follow.followingId);

    const posts = await prisma.post.findMany({
        where: {
            authorId: { in: followingIds }
        },
        take,
        orderBy: { createdAt: "desc" },
        ...(typeof cursor === "string"
            ? { skip: 1, cursor: { id: cursor } }
            : {}),
    });

    const nextCursor = posts.length === take ? posts[posts.length - 1]!.id : null;

    return res.status(200).json({ posts, nextCursor });
};

export const likePost = async (req: Request, res: Response) => {
    const userId = req.userId as string;
    const postId = req.params.id as string;

    try {
        const like = await prisma.like.create({
            data: {
                userId,
                postId,
            }
        });

        return res.status(201).json(like);

    } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
            if (err.code === "P2002") {
                return res.status(409).json({ error: "already liked" });
            }
            if (err.code === "P2003") {
                return res.status(404).json({ error: "Post not found" });
            }
        }

        return res.status(400).json({ error: "you cannot like this post" });
    }
}

export const unlikePost = async (req: Request, res: Response) => {
    const userId = req.userId as string;
    const postId = req.params.id as string;

    try {
        await prisma.like.delete({
            where: {
                userId_postId: {
                    userId,
                    postId,
                }
            }
        });

        return res.status(204).send();

    } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
            if (err.code === "P2025") {
                return res.status(404).json({ error: "there is no like to remove" });
            }
        }

        return res.status(400).json({ error: "you cannot unlike this post" });
    }
}