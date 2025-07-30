import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const allPostGet = async (req, res) => {
    const result = await prisma.post.findMany();
    res.json(result);
};

export const postCreatePost = async (req, res) => {
    const { title } = req.body;
    const { content } = req.body;
    const { imgURL } = req.body;
    const result = await prisma.post.create({
        data: {
            title,
            content,
            imgURL
        },
    })
    res.json(result);
};

export const postEditPut = async (req, res) => {
    const { postId } = req.params;
    const { content } = req.body;
    const { imgURL } = req.body;
    const targetPost = await prisma.findUnique({
        where: {
            id: Number(postId),
        },
    });
    if (targetPost) {
        const result = await prisma.update({
            where: {
                id: Number(postId),
            },
            data: {
                content,
                imgURL,
            }
        });
        res.json(result);
    } else {
        res.statusMessage = "The requested post does not exist.";
        res.status(404).end();
    }
};

export const postDelete = async (req, res) => {
    const { postId } = req.params;
    const deleteAttchComments = prisma.comment.deleteMany({
        where: {
            postId: Number(postId),
        },
    });
    const deletePost = prisma.post.delete({
        where: {
            id: Number(postId),
        },
    });
    const transaction = await prisma.$transaction([deleteAttchComments, deletePost]);
    res.json(transaction);
};