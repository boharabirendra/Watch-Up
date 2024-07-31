import { Request, Response } from "express";
import HttpStatusCode from "http-status-codes";

import { BadRequestError } from "../errors/error.error";
import * as UserService from "../services/users.service";
import { AuthRequest } from "../interface/auth.interface";

import { ApiResponse } from "../utils/ApiResponse.utils";
import { catchAsyncError } from "../utils/catchError.utils";

/**Register user */
export const registerUser = catchAsyncError(
  async (req: Request, res: Response) => {
    const user = req.body;
    const localFilePath: any = req.files;
    if (localFilePath.profile) {
      user.profileUrl = localFilePath.profile[0].path;
    }
    await UserService.registerUser(user);
    res
      .status(HttpStatusCode.CREATED)
      .json(new ApiResponse("User created successfully"));
  }
);

/**Login user */
export const loginUser = catchAsyncError(
  async (req: Request, res: Response) => {
    const loginCredentials = req.body;
    const user = await UserService.loginUser(loginCredentials);
    res.cookie("accessToken", user.accessToken, { httpOnly: true });
    res.status(HttpStatusCode.OK).json(
      new ApiResponse("User logged In Successfully", {
        ...user,
      })
    );
  }
);

/**Change password */
export const changePassword = catchAsyncError(
  async (req: AuthRequest, res: Response) => {
    const { oldPassword, newPassword } = req.body;
    const { id } = req.user;
    await UserService.changePassword({ id, oldPassword, newPassword });
    res
      .status(HttpStatusCode.OK)
      .json(new ApiResponse("Password successfully changed."));
  }
);

/**Get user by email */
export const getUserById = catchAsyncError(
  async (req: AuthRequest, res: Response) => {
    const { id } = req.user;
    const user = await UserService.getUserById(id);
    res.status(HttpStatusCode.OK).json(new ApiResponse("User detail", user));
  }
);

/**Logout user */
export const logoutUser = catchAsyncError(
  async (req: AuthRequest, res: Response) => {
    const { id } = req.user;
    await UserService.logoutUser(id);
    res
      .status(HttpStatusCode.OK)
      .json(new ApiResponse("User logged out successfully"));
  }
);

/**Update user */
export const updateUser = catchAsyncError(
  async (req: AuthRequest, res: Response) => {
    let profileUrl = "";
    const localFilePath: any = req.files;
    if (localFilePath.profile) {
      profileUrl = localFilePath.profile[0].path;
    }
    const { fullName } = req.body;
    const { id } = req.user;
    await UserService.updateUser({ id, fullName, profileUrl });
    res
      .status(HttpStatusCode.OK)
      .json(new ApiResponse("User updated successfully"));
  }
);

/**update user profile */
export const updateUserProfile = catchAsyncError(
  async (req: AuthRequest, res: Response) => {
    const { id } = req.user;
    const profileUrl = req.file?.path;
    if (!profileUrl) {
      throw new BadRequestError("Profile image file is missing");
    }
    await UserService.updateUserProfile({ id, profileUrl });
    res
      .status(HttpStatusCode.OK)
      .json(new ApiResponse("User profile updated successfully"));
  }
);

/**Update refresh token */

// export const updateRefreshToken = catchAsyncError(async(req: AuthRequest, res:Response)=>{
//   const {id} = req.user;
//   await UserService.updateRefreshToken()
// })
