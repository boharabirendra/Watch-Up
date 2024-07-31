import { InternalServerError } from "../errors/error.error";
import * as LikeModel from "../models/likes.models";
import loggerWithNameSpace from "../utils/logger.utils";

const logger = loggerWithNameSpace("Like service ");
export const getLikeStatus = async (videoPublicId: string, userId: number) => {
  try {
    const video = await LikeModel.getLikeStatus(videoPublicId, userId);
    return video;
  } catch (error) {
    logger.error(error);
    throw new InternalServerError("Error while fetching video like status");
  }
};

export const updateLikeCount = async (
  videoPublicId: string,
  userId: number
) => {
  try {
    const isLikeExist = await LikeModel.getLikeStatus(videoPublicId, userId);
    const updatedLikeCount = await LikeModel.updateLikeCount(
      videoPublicId,
      userId,
      !isLikeExist
    );
    return updatedLikeCount;
  } catch (error) {
    logger.error(error);
    throw new InternalServerError("Error while updating like count");
  }
};

export const getLikeCount = async (videoPublicId: string) => {
  try {
    const likes = await LikeModel.getLikeCount(videoPublicId);
    return likes;
  } catch (error) {
    logger.error(error);
    throw new InternalServerError("Error while fetching likes count");
  }
};
