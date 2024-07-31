import { Request, Response } from "express";
import HttpStatusCode from "http-status-codes";
import * as LikeService from "../services/likes.service";
import { ApiResponse } from "../utils/ApiResponse.utils";
import { AuthRequest } from "../interface/auth.interface";
import { catchAsyncError } from "../utils/catchError.utils";

export const getLikeStatus = catchAsyncError(
  async (req: AuthRequest, res: Response) => {
    const { id: userId } = req.user;
    const { videoPublicId } = req.params;
    const video = await LikeService.getLikeStatus(videoPublicId, userId);
    res.status(HttpStatusCode.OK).json(new ApiResponse("Like status", video));
  }
);

export const updateLikeCount = catchAsyncError(
  async (req: AuthRequest, res: Response) => {
    const { id: userId } = req.user;
    const { videoPublicId } = req.params;
    const likesStatus = await LikeService.updateLikeCount(
      videoPublicId,
      userId
    );
    res
      .status(HttpStatusCode.OK)
      .json(new ApiResponse("Likes count: ", likesStatus));
  }
);

export const getLikeCount = catchAsyncError(
  async (req: Request, res: Response) => {
    const { videoPublicId } = req.params;
    const likes = await LikeService.getLikeCount(videoPublicId);
    res.status(HttpStatusCode.OK).json(new ApiResponse("Likes count", likes));
  }
);
