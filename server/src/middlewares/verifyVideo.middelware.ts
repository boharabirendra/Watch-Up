import { BadRequestError } from "../errors/error.error";
import { NextFunction, Request, Response } from "express";

interface UploadedFile {
  path: string;
  size: number;
}

interface Files {
  video?: UploadedFile[];
  thumbnail?: UploadedFile[];
}

export const verifyVideo = (req: Request, res: Response, next: NextFunction) => {
  const files = req.files as Files;

  if (!files?.video || files.video.length === 0) {
    return next(new BadRequestError("Video file is required"));
  }

  const videoFile = files.video[0];
  const videoFileSize = videoFile.size;
  const videoSizeInMB = videoFileSize / (1024 * 1024);

  if (videoSizeInMB > 400) {
    return next(new BadRequestError("Video size should be less than or equal to 400MB"));
  }

  if (!files?.thumbnail || files.thumbnail.length === 0) {
    return next(new BadRequestError("Thumbnail is required"));
  }
  next();
};

