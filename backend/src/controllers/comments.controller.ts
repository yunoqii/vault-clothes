import { Request, Response } from "express";
import { Prisma } from "../generated/prisma/client";
import { prisma } from "../lib/prisma";

export const leaveComment = async (req: Request, res: Response) => {
    const authorId = req.userId as string;
    const { content, imageUrl } = req.body;
    const postId = req.params.id;

    if (typeof postId !== "string") {
        return res.status(400).json({ error: "invalid post id" });
    }

    try {
        const comment = await prisma.comment.create({
            data: {
                authorId,
                content,
                imageUrl,
                postId,
            }
        })

        res.status(201).json(comment);
    } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
            if (err.code === "P2003") {
                return res.status(404).json("Post not found");
            }

        }
        return res.status(400).json({ error: "you cannot leave comment on this post" });
    };
}

export const getComments = async (req: Request, res: Response) => {
    const postId = req.params.id as string;

    const comments = await prisma.comment.findMany({
        where: { postId },
    });

    return res.status(200).json(comments);
}

export const deleteComment = async (req: Request, res: Response) => {
    const userId = req.userId as string;
    const commentId = req.params.id;

    if (typeof commentId !== "string") {
        return res.status(400).json({ error: "invalid comment id" });
    }

    const result = await prisma.comment.deleteMany({
        where: {
            id: commentId,
            authorId: userId,
        }
    });

    if (result.count === 1) {
        return res.status(204).send();
    } else {
        return res.status(404).json({ error: "comment not found" });
    }
}