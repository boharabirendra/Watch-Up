import express from "express";
import userRouter from "./users.route";
import videoRouter from "./videos.route";
import likeRouter from "./likes.route";
import commentRouter from "./comments.route";

const router = express();

router.use("/api/v1/users", userRouter);
router.use("/api/v1/videos", videoRouter);
router.use("/api/v1/likes", likeRouter);
router.use("/api/v1/comments", commentRouter);



export default router;
