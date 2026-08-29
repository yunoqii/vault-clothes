import { Request, Response } from "express";
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


export const getUserFeed = async (req: Request, res: Response) => {
    const follows = await prisma.follow.findMany({
        where: {
            followerId: req.userId as string,
        }
    });

    const followingIds = follows.map((follow) => follow.followingId);

    const posts = await prisma.post.findMany({
        where: {
            authorId: { in: followingIds }
        }
    });

    return res.status(200).json(posts);
}