import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const allCommentGet = async (req, res) => {
    const result = await prisma.comment.findMany();
    res.json(result);
};

export const postCommentGet = async (req, res) => {
    const { postId } = req.params;
    const result = await prisma.comment.findMany({
        where: {
            postId: Number(postId),
        },
        select: {
            id: true,
            content: true,
            createdAt: true,
        },
    });
    res.json(result);
};

export const createCommentPost = async (req, res) => {
    const { content } = req.body;
    const { postId } = req.params;
    const result = await prisma.comment.create({
        data: {
            content,
            postId: Number(postId),
        },
    });
    res.json(result);
};

export const commentEditPut = async (req, res) => {
    const { commentId } = req.params;
    const { content } = req.body;
    const targetComment = await prisma.comment.findUnique({
        where: {
            id: Number(commentId),
        },
    });
    if (targetComment) {
        const result = await prisma.comment.update({
            where: {
                id: Number(commentId),
            },
            data: {
                content: content,
            },
        });
    } else {
        res.statusMessage = "The requested comment does not exist.";
        res.status(404).end();
    }
};

export const commentDelete = async (req, res) => {
    const { commentId } = req.params;
    const result = await prisma.comment.delete({
        where: {
            id: Number(commentId),
        },
    });
};