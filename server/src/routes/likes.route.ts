import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";

import * as LikeController from "../controllers/likes.controller";

const router = Router();

router
  .route("/get-like-status/:videoPublicId")
  .get(authenticate, LikeController.getLikeStatus);

router
  .route("/update-like/:videoPublicId")
  .put(authenticate, LikeController.updateLikeCount);

router.route("/get-like-count/:videoPublicId").get(
    authenticate,
    LikeController.getLikeCount
)

export default router;
