import { Router } from "express";
import {
    allCommentGet,
    postCommentGet,
    createCommentPost,
    commentEditPut,
    commentDelete,
    upvotePut,
    downvotePut,
} from "../controllers/commentController.js";

const commentRouter = Router();

commentRouter.get(
    "/",
    allCommentGet,
);
commentRouter.post(
    "/new",
    createCommentPost,
);
commentRouter.get(
    "/:postId",
    postCommentGet,
);
commentRouter.put(
    "/:postId/:commentId",
    commentEditPut,
);
commentRouter.delete(
    "/:postId/:commentId",
    commentDelete,
);
commentRouter.put(
    "/:postId/:commentId",
    upvotePut,
);
commentRouter.put(
    "/:postId/:commentId",
    downvotePut,
);

export default commentRouter;