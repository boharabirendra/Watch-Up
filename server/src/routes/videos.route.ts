import { Router } from "express";

import { getUserQuerySchema } from "../schema/user.schema";
import { videoReqBodySchema } from "../schema/video.schema";

import * as VideoController from "../controllers/videos.controller";

import {
  validateReqBody,
  validateReqQuery,
} from "../middlewares/validator.middleware";
import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/authorize.middleware";
import { verifyVideo } from "../middlewares/verifyVideo.middelware";
import { uploadVideoBodyParser } from "../middlewares/multer.middleware";

const router = Router();

router
  .route("/add-video")
  .post(
    authenticate,
    authorize("CREATOR"),
    uploadVideoBodyParser,
    verifyVideo,
    validateReqBody(videoReqBodySchema),
    VideoController.createVideo
  );

router
  .route("/get-videos")
  .get(validateReqQuery(getUserQuerySchema), VideoController.getVideos);

router
  .route("/get-suggestion-vidoes/:videoPublicId")
  .get(VideoController.getSuggestionVideos);

router.route("/get-video/:id").get(authenticate, VideoController.getVideoById);

router
  .route("/get-video/public/:videoPublicId")
  .get(VideoController.getVideoByPublicId);

router
  .route("/update-video/:id")
  .put(
    authenticate,
    validateReqBody(videoReqBodySchema),
    VideoController.updateVideoDetail
  );

router
  .route("/update-views/:videoPublicId")
  .put(authenticate, VideoController.updateVideoViews);

router
  .route("/delete/:id")
  .delete(authenticate, VideoController.deleteVideoById);

export default router;
