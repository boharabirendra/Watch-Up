import prisma from "../db/prisma.db";

export const getLikeStatus = (videoPublicId: string, userId: number) => {
  return prisma.userLike.findFirst({
    where: {
      video: {
        videoPublicId,
      },
      user: {
        id: userId,
      },
    },
  });
};

export const updateLikeCount = async (
    videoPublicId: string,
    userId: number,
    increase: boolean = true
  ) => {
    return prisma.$transaction(async (tx) => {
      const video = await tx.video.findUnique({
        where: { videoPublicId },
        select: { id: true, likes: true },
      });
  
      if (!video) {
        throw new Error("Video not found");
      }
  
      if (increase) {
        await tx.video.update({
          where: { id: video.id },
          data: { likes: { increment: 1 } },
        });
  
        await tx.userLike.create({
          data: {
            videoId: video.id,
            userId,
          },
        });
        return {
            likes: video.likes + 1,
            liked: true
        }
      } else {
        await tx.video.update({
          where: { id: video.id },
          data: { likes: { decrement: 1 } },
        });
  
        await tx.userLike.deleteMany({
          where: {
            videoId: video.id,
            userId,
          },
        });
        return {
            likes: video.likes - 1,
            liked: false
        }
      }
    });
  };



export const getLikeCount = (videoPublicId: string) => {
  return prisma.video.findFirst({
    where: {
      videoPublicId,
    },
    select: {
      likes: true,
    },
  });
};
