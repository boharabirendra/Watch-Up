import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import * as CommentController from "../controllers/comments.controller";
import { commentBodyParser } from "../middlewares/multer.middleware";
import { commentAuthenticator } from "../middlewares/comments.middleware";

const router = Router();

/**PUT request */
router.route("/update/:id").put(authenticate, CommentController.updateCommentById);

/**DELETE request */
router.route("/delete/:id").delete(authenticate, CommentController.deleteCommentById);

/**GET request */
router.route("/get-comments/:videoId").get(commentAuthenticator, CommentController.getComments);

/**POST request */
router.route("/create-comment").post(authenticate, commentBodyParser, CommentController.createComment);

export default router;
