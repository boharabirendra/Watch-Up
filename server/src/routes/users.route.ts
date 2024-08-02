import { Router } from "express";

import * as UserController from "../controllers/users.controller";

import { loginBodySchema, updateBodySchema, registerUserBodySchema, changePasswordBodySchema } from "../schema/user.schema";

import { authenticate } from "../middlewares/auth.middleware";
import { verifyUser } from "../middlewares/me.auth.middlewares";
import { validateReqBody } from "../middlewares/validator.middleware";
import { upload, loginUserBodyParser, updateUserBodyParser, registerUserBodyParser, changePasswordBodyParser } from "../middlewares/multer.middleware";

import { refreshToken } from "../utils/refreshToken.utils";

const router = Router();

/**GET request */
router.route("/me").get(verifyUser);

/**POST request */
router.route("/refreshtoken").post(refreshToken);
router.route("/login").post(loginUserBodyParser, validateReqBody(loginBodySchema), UserController.loginUser);
router.route("/register").post(registerUserBodyParser, validateReqBody(registerUserBodySchema), UserController.registerUser);

/**PUT request */
router.route("/update-profile").put(authenticate, upload.single("profile"), UserController.updateUserProfile);
router.route("/update-user").put(authenticate, updateUserBodyParser, validateReqBody(updateBodySchema), UserController.updateUser);
router.route("/change-password").put(authenticate, changePasswordBodyParser, validateReqBody(changePasswordBodySchema), UserController.changePassword);

export default router;
