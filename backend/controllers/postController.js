import { Prisma, PrismaClient } from '@prisma/client';
import { multer } from 'multer';

const prisma = new PrismaClient();

// multer config
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '/public/uploads/');
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

/* template, might need these later
export const postImgGet = async (req, res) => {
    res.sendFile(__dirname, '/index.html'); // change this
};

export const uploadImgPost = async (req, res) => {
    let filename = req.file.filename;
    await upload.single('image');
    res.json({
        message: 'Image uploaded successfully.',
        filename: filename,
    });
};
*/

export const allPostGet = async (req, res) => {
    const result = await prisma.post.findMany();
    res.json(result);
};

export const postCreatePost = async (req, res) => {
    const { title } = req.body;
    const { content } = req.body;
    const img = req.file? req.file.filename : undefined;
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