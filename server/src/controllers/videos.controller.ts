import { Request, Response } from "express";
import HttpStatusCode from "http-status-codes";

import { NotFoundError } from "../errors/error.error";
import { ApiResponse } from "../utils/ApiResponse.utils";
import { AuthRequest } from "../interface/auth.interface";
import * as VideoService from "../services/videos.service";
import { catchAsyncError } from "../utils/catchError.utils";


export const createVideo = catchAsyncError(async (req: AuthRequest, res: Response) => {
  const { id: userId } = req.user;
  const { title, description } = req.body;
  const files: any = req.files;
  const videoLocalPath = files.video[0].path;
  const thumbnailLocalPath = files.thumbnail[0].path;
  await VideoService.createVideo(
    {
      title,
      description,
      videoLocalPath,
      thumbnailLocalPath,
    },
    userId
  );
  res.status(HttpStatusCode.CREATED).json(new ApiResponse("Video uploaded successfully"));
});

export const getVideos = catchAsyncError(async (req: Request<any, any, any, any>, res: Response) => {
  const { q, size, page } = req.query;
  const videos = await VideoService.getVideos({ q, size, page });
  res.status(HttpStatusCode.OK).json(new ApiResponse("Videos list", videos));
});

export const getSuggestionVideos = catchAsyncError(async (req: Request<any, any, any, any>, res: Response) => {
  const { videoPublicId, page } = req.query;
  const videos = await VideoService.getSuggestionVideos(videoPublicId, Number(page));
  res.status(HttpStatusCode.OK).json(new ApiResponse("Videos list", videos));
});

export const updateVideoDetail = catchAsyncError(async (req: AuthRequest, res: Response) => {
  const videoInfo = req.body;
  const { videoId } = req.params;
  let thumbnail = "";
  const localFilePath: any = req.files;
  if (localFilePath.thumbnail) {
    thumbnail = localFilePath.thumbnail[0].path;
  }
  await VideoService.updateVideoDetail(videoInfo, thumbnail, Number(videoId));
  res.status(HttpStatusCode.OK).json(new ApiResponse("Video detail updated successfully"));
});

export const updateVideoViews = catchAsyncError(async (req: Request, res: Response) => {
  const { videoPublicId } = req.params;
  await VideoService.updateVideoViews(videoPublicId);
  res.status(HttpStatusCode.OK).json(new ApiResponse("Views updated successfully."));
});

export const deleteVideoById = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { id: userId } = req.user;
  await VideoService.deleteVideoById(Number(id), userId);
  res.status(HttpStatusCode.OK).json(new ApiResponse("Video deleted successfully"));
};

export const getVideoById = catchAsyncError(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { id: userId } = req.user;
  const video = await VideoService.getVideoById(Number(id), userId);
  if (!video) throw new NotFoundError("No video found");
  res.status(HttpStatusCode.OK).json(new ApiResponse("Video", video));
});

export const getVideoByPublicId = catchAsyncError(async (req: AuthRequest, res: Response) => {
  const { videoPublicId } = req.params;
  const video = await VideoService.getVideoByPublicId(videoPublicId);
  res.status(HttpStatusCode.OK).json(new ApiResponse("Video", video));
});

export const getMyVideos = catchAsyncError(async (req: AuthRequest, res: Response) => {
  const { id: userId } = req.user;
  const videos = await VideoService.getMyVideos(Number(userId));
  res.status(HttpStatusCode.OK).json(new ApiResponse("Videos list", videos));
});

export const publishVideo = catchAsyncError(async (req: Request, res: Response) => {
  const { id } = req.params;
  await VideoService.publishVideo(Number(id));
  res.status(HttpStatusCode.OK).json(new ApiResponse("Video published successfully"));
});

export const unpublishVideo = catchAsyncError(async (req: Request, res: Response) => {
  const { id } = req.params;
  await VideoService.unpublishVideo(Number(id));
  res.status(HttpStatusCode.OK).json(new ApiResponse("Video unpublished successfully"));
});
