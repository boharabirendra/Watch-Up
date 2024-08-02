import jwt from "jsonwebtoken";
import { Request, Response } from "express";

import config from "../config";
import { getUserById } from "../services/users.service";
import { IPayload } from "../interface/payload.interface";
import { generateAccessAndRefreshToken } from "./generateTokens.utils";
import loggerWithNameSpace from "./logger.utils";

export const refreshToken = async (req: Request, res: Response) => {
  const logger = loggerWithNameSpace("Refresh token");
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ error: "Refresh token is required" });
  }

  try {
    const payload = jwt.verify(refreshToken, config.jwt.refresh_token_secret!) as IPayload;

    const user = await getUserById(payload.id);

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({ error: "Invalid refresh token" });
    }

    const { accessToken } = generateAccessAndRefreshToken(payload);
    res.status(200).json({ accessToken });
  } catch (error) {
    logger.error(error);
    res.status(401).json({ error: "Invalid refresh token" });
  }
};
