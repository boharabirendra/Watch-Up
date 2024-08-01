import { Router } from "express";

import { getUserQuerySchema } from "../schema/user.schema";
import { videoReqBodySchema } from "../schema/video.schema";

import * as VideoController from "../controllers/videos.controller";

import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/authorize.middleware";
import { verifyVideo } from "../middlewares/verifyVideo.middelware";
import { validateReqBody, validateReqQuery } from "../middlewares/validator.middleware";
import { updateVideoBodyParser, uploadVideoBodyParser } from "../middlewares/multer.middleware";

const router = Router();

/**GET request */
router.route("/myvidoes").get(authenticate, VideoController.getMyVideos);
router.route("/get-video/:id").get(authenticate, VideoController.getVideoById);
router.route("/get-video/public/:videoPublicId").get(VideoController.getVideoByPublicId);
router.route("/get-videos").get(validateReqQuery(getUserQuerySchema), VideoController.getVideos);
router.route("/get-suggestion-vidoes/:videoPublicId").get(VideoController.getSuggestionVideos);

/**PUT request */
router.route("/publish/:id").put(authenticate, VideoController.publishVideo);
router.route("/unpublish/:id").put(authenticate, VideoController.unpublishVideo);
router.route("/update-views/:videoPublicId").put(authenticate, VideoController.updateVideoViews);
router.route("/update-video/:videoId").put(authenticate, updateVideoBodyParser, VideoController.updateVideoDetail);

/**DELETE request */
router.route("/delete/:id").delete(authenticate, VideoController.deleteVideoById);

/**POST request */
router.route("/add-video").post(authenticate, authorize("CREATOR"), uploadVideoBodyParser, verifyVideo, validateReqBody(videoReqBodySchema), VideoController.createVideo);

export default router;
