import { BadRequestError } from "../errors/error.error";
import { NextFunction, Request, Response } from "express";

interface UploadedFile {
  path: string;
  size: number;
}

interface Files {
  profile?: UploadedFile[];
}

export const verifyUserProfile = (req: Request, res: Response, next: NextFunction) => {
  const files = req.files as Files;

  if (!files?.profile || files.profile.length === 0) {
    return next(new BadRequestError("Profile picture is required"));
  }

  const profileFile = files.profile[0];
  const profileFileSize = profileFile.size;
  const profileSizeInMB = profileFileSize / (1024 * 1024);

  if (profileSizeInMB > 5) {
    return next(new BadRequestError("Profile picture size should be less than or equal to 5MB"));
  }

  next();
};
