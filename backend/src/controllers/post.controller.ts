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
