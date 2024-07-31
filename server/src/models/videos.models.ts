import prisma from "../db/prisma.db";
import { GetUserQuery } from "../interface/user.interface";
import { IVideo, updateVideoInfo } from "../interface/video.interface";

export const createVideo = (video: IVideo, userId: number) => {
  return prisma.$transaction(async (tx) => {
    const cVideo = await tx.video.create({
      data: {
        ...video,
      },
    });
    await tx.userVideo.create({
      data: {
        userId,
        videoId: cVideo.id,
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
    },
    include: {
      userVideos: {
        include: {
          user: {
            select: {
              id: true,
              profileUrl: true,
              fullName: true,
              email: true,
            },
          },
        },
      },
    },
    skip: (page - 1) * size,
    take: size,
  });
};

export const updateVideoDetail = (
  { title, description }: updateVideoInfo,
  id: number
) => {
  return prisma.video.update({
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
    include: {
      userVideos: {
        where: {
          userId,
        },
      },
    },
  });
};

export const getVideoByPublicId = (videoPublicId: string) => {
  return prisma.video.findMany({
    where: { videoPublicId },
    include: {
      userVideos: {
        include: {
          user: {
            select: {
              id: true,
              profileUrl: true,
              fullName: true,
              email: true,
            },
          },
        },
      },
    },
  });
};

export const getSuggestionVideos = (videoPublicId: string) => {
  return prisma.video.findMany({
    where: {
      videoPublicId: { not: videoPublicId },
    },
    include: {
      userVideos: {
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              email: true,
              profileUrl: true,
            },
          },
        },
      },
    },
  });
};
