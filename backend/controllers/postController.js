import { Prisma, PrismaClient } from '@prisma/client';
import { multer } from 'multer';
import { path } from 'path';

const prisma = new PrismaClient();

// multer config
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now()+file.originalname)
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype ==='image/jpeg' || file.mimetype ==='image/jpg' || file.mimetype ==='image/png') {
       cb(null,true);
    } else {
       cb(null, false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5,
    },
    fileFilter: fileFilter,
});
// end of multer config

export const allPostGet = async (req, res) => {
    const result = await prisma.post.findMany();
    res.json(result);
};

export const specificPostGet = async (req, res) => {
    const { postId } = req.params;
    const result = await prisma.post.findUnique({
        where: {
            id: Number(postId),
        },
    });
    res.json(result);
};

export const postImgGet = async (req, res) => {
    const { imgName } = req.params;
    req.headerSent('content-Type', 'image/jpeg');
    res.sendFile(path.join(__dirname, '..', 'uploads', imgName));
};

export const postCreatePost = async (req, res) => {
    const { title } = req.body;
    const { content } = req.body;
    const img = req.file? req.file.filename : undefined;
    if (img !== undefined) {
        upload.single('image');
    };
    const result = await prisma.post.create({
        data: {
            title,
            content,
            img,
        },
    })
    res.json(result);
};

export const postEditPut = async (req, res) => {
    const { postId } = req.params;
    const { content } = req.body;
    const { imgURL } = req.body;
    const targetPost = await prisma.post.findUnique({
        where: {
            id: Number(postId),
        },
    });
    if (targetPost) {
        const result = await prisma.post.update({
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
    const deleteAttchComments = prisma.post.deleteMany({
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

export const upvotePut = async (req, res) => {
    const { postId } = req.params;
    const targetPost = await prisma.post.findUnique({
        where: {
            id: Number(postId),
        },
    });
    if (targetPost) {
        const result = await prisma.post.update({
            where: {
                id: Number(postId),
            },
            data: {
                upvote: Number(upvote) + 1,
            },
        });
        res.json(result);
    } else {
        res.statusMessage = "The requested post does not exist.";
        res.status(404).end();
    }
};


export const downvotePut = async (req, res) => {
    const { postId } = req.params;
    const targetPost = await prisma.post.findUnique({
        where: {
            id: Number(postId),
        },
    });
    if (targetPost) {
        const result = await prisma.post.update({
            where: {
                id: Number(postId),
            },
            data: {
                upvote: Number(upvote) - 1,
            },
        });
        res.json(result);
    } else {
        res.statusMessage = "The requested post does not exist.";
        res.status(404).end();
    }
};