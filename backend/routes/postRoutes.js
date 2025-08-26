import { Router } from "express";
import { 
    allPostGet, 
    specificPostGet, 
    postImgGet, 
    postCreatePost, 
    postEditPut, 
    postDelete,
    upvotePut,
    downvotePut } from "../controllers/postController.js";

const postRouter = Router();

postRouter.get(
    "/",
    allPostGet,
);
postRouter.post(
    "/new",
    postCreatePost,
);
postRouter.get(
    "/uploads/:imgName",
    postImgGet,
);
postRouter.get(
    "/:postId",
    specificPostGet,
);
postRouter.put(
    "/:postId",
    postEditPut,
);
postRouter.delete(
    "/:postId",
    postDelete,
);
postRouter.put(
    "/:postId/upvote",
    upvotePut,
);
postRouter.put(
    "/:postId/downvote",
    downvotePut,
);

export default postRouter;