import prisma from "../db/prisma.db";
import { GetUserQuery } from "../interface/user.interface";
import { IVideo, updateVideoInfo } from "../interface/video.interface";

export const createVideo = (video: IVideo, userId: number) => {
  return prisma.$transaction(async (tx) => {
    const cVideo = await tx.video.create({
      data: {
        ...video,
        userId,
      },
    });
  });
};

export const getVideos = ({ q, size, page }: GetUserQuery) => {
  return prisma.video.findMany({
    where: {
      title: {
        contains: q,
        mode: "insensitive",
      },
      isPublished: true,
    },
    include: {
      user: true,
    },
    skip: (page - 1) * size,
    take: size,
  });
};

export const updateVideoDetail = ({ title, description }: updateVideoInfo, thumbnailUrl: string, id: number) => {
  return thumbnailUrl
    ? prisma.video.update({
        data: {
          title,
          description,
          thumbnailUrl,
        },
        where: {
          id,
        },
      })
    : prisma.video.update({
        data: {
          title,
          description,
        },
        where: {
          id,
        },
      });
};

export const updateVideoViews = (videoPublicId: string) => {
  return prisma.video.update({
    data: {
      views: { increment: 1 },
    },
    where: {
      videoPublicId,
    },
  });
};

export const deleteVideoById = (id: number) => {
  return prisma.video.delete({
    where: {
      id,
    },
  });
};

export const getVideoById = (id: number, userId: number) => {
  return prisma.video.findUnique({
    where: {
      id,
    },
  });
};

export const getVideoByPublicId = (videoPublicId: string) => {
  return prisma.video.findUnique({
    where: { videoPublicId },
    include: {user: true}
  });
};

export const getSuggestionVideos = (videoPublicId: string, page: number) => {
  return prisma.video.findMany({
    where: {
      videoPublicId: { not: videoPublicId },
      isPublished: true,
    },
    include: {
      user: true,
    },
    skip: (page - 1) * 4,
    take: 4,
  });
};

export const getMyVideos = async (userId: number) => {
  return prisma.video.findMany({
    where: { userId },
    include: {
      user: true,
      _count: { select: { userComment: true } },
    },
  });
};

export const publishVideo = (id: number) => {
  return prisma.video.update({
    data: {
      isPublished: true,
    },
    where: {
      id,
    },
  });
};

export const unpublishVideo = (id: number) => {
  return prisma.video.update({
    data: {
      isPublished: false,
    },
    where: {
      id,
    },
  });
};
