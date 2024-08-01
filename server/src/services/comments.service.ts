import * as CommentModel from "../models/comments.models";
import { IComment } from "../interface/comment.interface";
import loggerWithNameSpace from "../utils/logger.utils";
import { InternalServerError } from "../errors/error.error";

const logger = loggerWithNameSpace("Like Service");

export const createComment = async (comment: IComment) => {
  try {
    await CommentModel.createComment(comment);
  } catch (error) {
    logger.error(error);
    throw new InternalServerError("Error while adding comment");
  }
};

export const getComments = async (videoId: number, userId: number) => {
  try {
    const comments = await CommentModel.getComments(videoId);
    if (!comments?.userComment.length) {
      return [];
    }

    return comments.userComment.map((userComment) => ({
      id: userComment.comment.id,
      text: userComment.comment.text,
      createdAt: userComment.comment.createdAt,
      updatedAt: userComment.comment.updatedAt,
      owner: userComment.user.id === userId && true,
      user: {
        id: userComment.user.id,
        fullName: userComment.user.fullName,
        email: userComment.user.email,
        profileUrl: userComment.user.profileUrl,
      },
    }));
  } catch (error) {
    logger.error(error);
    throw new InternalServerError("Error while fetching comments");
  }
};

export const deleteCommentById = async (id: number) => {
  try {
    await CommentModel.deleteCommentById(id);
  } catch (error) {
    logger.error(error);
    throw new InternalServerError("Error while deleting comment");
  }
};

export const updateCommentById = async (id: number, text: string) => {
  try {
    await CommentModel.updateCommentById(id, text);
  } catch (error) {
    logger.error(error);
    throw new InternalServerError("Error while updateing comment");
  }
};
