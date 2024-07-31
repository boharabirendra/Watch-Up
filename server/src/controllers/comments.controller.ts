import { Request, Response } from "express";
import HttpStatusCode from "http-status-codes";
import { ApiResponse } from "../utils/ApiResponse.utils";
import { AuthRequest } from "../interface/auth.interface";
import { catchAsyncError } from "../utils/catchError.utils";
import * as CommentServce from "../services/comments.service";

export const createComment = catchAsyncError(
  async (req: AuthRequest, res: Response) => {
    const { id: userId } = req.user;
    const { text, videoId } = req.body;
    await CommentServce.createComment({ text, userId, videoId });
    res
      .status(HttpStatusCode.OK)
      .json(new ApiResponse("Comment added successfully"));
  }
);

export const getComments = catchAsyncError(
  async (req: Request, res: Response) => {
    const { videoId } = req.params;
    const comments = await CommentServce.getComments(Number(videoId));
    res
      .status(HttpStatusCode.OK)
      .json(new ApiResponse("Comments list", comments));
  }
);

export const deleteCommentById = catchAsyncError(
  async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    await CommentServce.deleteCommentById(Number(id));
    res
      .status(HttpStatusCode.OK)
      .json(new ApiResponse("Comment deleted successfully"));
  }
);

export const updateCommentById = catchAsyncError(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { text } = req.body;
    await CommentServce.updateCommentById(Number(id), text);
    res
      .status(HttpStatusCode.OK)
      .json(new ApiResponse("Comment updated succussfully."));
  }
);
