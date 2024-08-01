import * as VideoModel from "../models/videos.models";
import { InternalServerError, NotFoundError } from "../errors/error.error";

import { GetUserQuery } from "../interface/user.interface";
import { updateVideoInfo, UploadVideo } from "../interface/video.interface";

import loggerWithNameSpace from "../utils/logger.utils";
import { uploadImageOnCloudinary, uploadVideoOnCloudinary } from "../utils/cloudinary.utils";

const logger = loggerWithNameSpace("Video Service: ");

export const createVideo = async (video: UploadVideo, userId: number) => {
  try {
    const vResponse = await uploadVideoOnCloudinary(video.videoLocalPath);
    const tnResponse = await uploadImageOnCloudinary(video.thumbnailLocalPath);
    await VideoModel.createVideo(
      {
        title: video.title,
        description: video.description,
        duration: vResponse?.duration,
        videoPublicId: vResponse?.public_id || "",
        thumbnailUrl: tnResponse?.secure_url || "",
        playbackUrl: vResponse?.playback_url,
      },
      userId
    );
  } catch (error) {
    logger.error(error);
    throw new InternalServerError("Error while uploading video");
  }
};

export const getVideos = async ({ q, size, page }: GetUserQuery) => {
  try {
    const videos = await VideoModel.getVideos({ q, size, page });
    if (!videos) return null;
    return videos.map((video) => ({
      id: video.id,
      title: video.title,
      description: video.description,
      playbackUrl: video.playbackUrl,
      views: video.views,
      likes: video.likes,
      duration: video.duration,
      videoPublicId: video.videoPublicId,
      createdAt: video.createdAt,
      thumbnailUrl: video.thumbnailUrl,
      userVideos: video.userVideos.map((userVideo) => ({
        userId: userVideo.user.id,
        profileUrl: userVideo.user.profileUrl,
        fullName: userVideo.user.fullName,
        email: userVideo.user.email,
      })),
    }));
  } catch (error) {
    logger.error(error);
    throw new NotFoundError("No videos found");
  }
};

export const getSuggestionVideos = async (videoPublicId: string) => {
  try {
    const videos = await VideoModel.getSuggestionVideos(videoPublicId);
    if (!videos) return null;
    return videos.map((video) => ({
      id: video.id,
      title: video.title,
      description: video.description,
      playbackUrl: video.playbackUrl,
      views: video.views,
      likes: video.likes,
      duration: video.duration,
      videoPublicId: video.videoPublicId,
      createdAt: video.createdAt,
      thumbnailUrl: video.thumbnailUrl,
      userVideos: video.userVideos.map((userVideo) => ({
        userId: userVideo.user.id,
        profileUrl: userVideo.user.profileUrl,
        fullName: userVideo.user.fullName,
        email: userVideo.user.email,
      })),
    }));
  } catch (error) {
    logger.error(error);
    throw new NotFoundError("No videos found");
  }
};

export const updateVideoDetail = async (videoInfo: updateVideoInfo, thumbnail:string, id: number) => {
  try {
    if(thumbnail){
      const cResponse = await uploadImageOnCloudinary(thumbnail);
      await VideoModel.updateVideoDetail(videoInfo, cResponse!.secure_url, id);
    }else{
      await VideoModel.updateVideoDetail(videoInfo, "", id);
    }
  } catch (error) {
    logger.error(error);
    throw new InternalServerError("Error while updating video detail");
  }
};

export const updateVideoViews = async (videoPublicId: string) => {
  try {
    await VideoModel.updateVideoViews(videoPublicId);
  } catch (error) {
    logger.error(error);
    throw new InternalServerError("Error while updating video views");
  }
};

export const deleteVideoById = async (id: number, userId: number) => {
  try {
    await VideoModel.deleteVideoById(id);
  } catch (error) {
    logger.error(error);
    throw new InternalServerError("Error while deleting video");
  }
};

export const getVideoById = async (id: number, userId: number) => {
  try {
    const video = await VideoModel.getVideoById(id, userId);
    return video;
  } catch (error) {
    logger.error(error);
    throw new InternalServerError("Error while fetching video");
  }
};

export const getVideoByPublicId = async (videoPublicId: string) => {
  try {
    const videos = await VideoModel.getVideoByPublicId(videoPublicId);
    if (!videos) return null;
    return videos.map((video) => ({
      id: video.id,
      title: video.title,
      description: video.description,
      playbackUrl: video.playbackUrl,
      views: video.views,
      likes: video.likes,
      duration: video.duration,
      videoPublicId: video.videoPublicId,
      createdAt: video.createdAt,
      thumbnailUrl: video.thumbnailUrl,
      userVideos: video.userVideos.map((userVideo) => ({
        userId: userVideo.user.id,
        profileUrl: userVideo.user.profileUrl,
        fullName: userVideo.user.fullName,
        email: userVideo.user.email,
      })),
    }));
  } catch (error) {
    logger.error(error);
    throw new InternalServerError("Error while fetching video");
  }
};

export const getMyVideos = async (userId: number) => {
  try {
    const videos = await VideoModel.getMyVideos(userId);
    return videos;
  } catch (error) {
    logger.error(error);
    throw new InternalServerError("Error while fetching videos");
  }
};


export const publishVideo = async (id: number) =>{
  try {
    await VideoModel.publishVideo(id);
  } catch (error) {
    logger.error(error);
    throw new InternalServerError("Error while publishing vidoe");
  }
}

export const unpublishVideo = async (id: number) =>{
  try {
    await VideoModel.unpublishVideo(id);
  } catch (error) {
    logger.error(error);
    throw new InternalServerError("Error while un publishing video");
  }
}