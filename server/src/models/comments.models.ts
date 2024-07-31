import prisma from "../db/prisma.db";
import { IComment } from "../interface/comment.interface";

export const createComment = ({ text, videoId, userId }: IComment) => {
  return prisma.$transaction(async (tx) => {
    const comment = await tx.comment.create({
      data: {
        text,
      },
    });

    await tx.userComment.create({
      data: {
        userId,
        videoId: Number(videoId),
        commentId: comment.id,
      },
    });
  });
};



export const deleteCommentById = (id: number) => {
  return prisma.comment.delete({
    where: { id },
  });
};


export const getComments = async (videoId: number) => {
  return await prisma.video.findUnique({
    where: {
      id: videoId,
    },
    select: {
      userComment: {
        select: {
          comment: {
            select: {
              id: true,
              text: true,
              createdAt: true,
              updatedAt: true
            },
          },
          user: {
            select: {
              id: true,
              fullName: true,
              email: true,
              profileUrl: true,
            },
          },
        },
        orderBy: {
          comment: {
            createdAt: "desc",
          },
        },
      },
    },
  });
};

export const updateCommentById = (id: number, text: string) => {
  return prisma.comment.update({
    data: {
      text,
    },
    where: {
      id,
    },
  });
};
