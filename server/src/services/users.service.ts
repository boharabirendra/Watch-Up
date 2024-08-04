import bcryptjs from "bcryptjs";

import * as UserModel from "../models/users.models";

import loggerWithNameSpace from "../utils/logger.utils";
import { ApiResponse } from "../utils/ApiResponse.utils";
import { uploadImageOnCloudinary } from "../utils/cloudinary.utils";
import { generateAccessAndRefreshToken } from "../utils/generateTokens.utils";
import { generateHashedPassword } from "../utils/generateHashedPassword.utils";

import { IUser, UserArgs, UpdateUser, ChangePassword, LoginCredentials, UpdaterUserProfile } from "../interface/user.interface";
import { ConflictError, BadRequestError, InternalServerError, UnauthenticatedError, NotFoundError } from "../errors/error.error";

const logger = loggerWithNameSpace("[User Service]:");

/**create user */
export const registerUser = async (user: IUser) => {
  const existingUser = await isUserExists({ email: user.email });
  if (existingUser) throw new ConflictError(`User already exists.`);

  try {
    let uResponse;
    const password = await generateHashedPassword(user.password);
    if (user.profileUrl) {
      uResponse = await uploadImageOnCloudinary(user.profileUrl);
    }

    await UserModel.registerUser({
      ...user,
      password,
      profileUrl: uResponse?.secure_url || "",
      imagePublicId: uResponse?.public_id || "",
    });
  } catch (error) {
    logger.error(error);
    throw new InternalServerError("Internal server error");
  }
};

/**login user */
export const loginUser = async ({ email, password }: LoginCredentials) => {
  const existingUser = await isUserExists({ email });
  if (!existingUser) throw new NotFoundError(`Invalid password or email`);
  if (!(await isPasswordValid(password, existingUser.password))) throw new UnauthenticatedError("Invalid password or email");

  const payload = {
    id: existingUser.id,
    role: existingUser.role,
    email: existingUser.email,
    fullName: existingUser.fullName,
    profileUrl: existingUser.profileUrl,
  };
  try {
    const { accessToken, refreshToken } = generateAccessAndRefreshToken(payload);
    const user = await UserModel.getUserByEmail(email);
    const userWithOutPassword = { ...user, password: "" };
    return { accessToken, refreshToken, ...userWithOutPassword };
  } catch (error) {
    logger.error(error);
    throw new InternalServerError("Login failed.");
  }
};

/**change password */
export const changePassword = async ({ id, oldPassword, newPassword }: ChangePassword) => {
  const existingUser = await isUserExists({ id });
  if (!existingUser) throw new NotFoundError("User does not exist.");
  if (!(await isPasswordValid(oldPassword, existingUser.password))) throw new BadRequestError("Invalid old password");

  try {
    const password = await generateHashedPassword(newPassword);
    await UserModel.changePassword({ id, newPassword: password });
  } catch (error) {
    logger.error(error);
    throw new InternalServerError("Password change failed.");
  }
};

/**update user */
export const updateUser = async ({ id, fullName, profileUrl }: UpdateUser) => {
  try {
    if (profileUrl) {
      const cResponse = await uploadImageOnCloudinary(profileUrl);
      profileUrl = cResponse!.secure_url;
    }
    await UserModel.updateUser({ id, fullName, profileUrl });
  } catch (error) {
    logger.error(error);
    throw new InternalServerError("Failed to update user");
  }
};

/**get user by id  */
export const getUserById = async (id: number) => {
  try {
    const user = await UserModel.getUserById(id);
    return user;
  } catch (error) {
    logger.error(error);
    throw new InternalServerError("Error while fetching user");
  }
};

/**get user by email */
export const getUserByEmail = async (email: string) => {
  try {
    const user = await UserModel.getUserByEmail(email);
    return user;
  } catch (error) {
    logger.error(error);
    throw new InternalServerError("Error while fetching user");
  }
};

/* update profile */
export const updateUserProfile = async ({ id, profileUrl }: UpdaterUserProfile) => {
  try {
    const existingUser = await isUserExists({ id });
    if (existingUser?.imagePublicId) {
      const profile = await uploadImageOnCloudinary(profileUrl);
      await UserModel.updateUserProfile(id, profile!.secure_url, profile!.public_id);
    }
  } catch (error) {
    logger.error(error);
    throw new BadRequestError("Error while updating user profile");
  }
};

/*password matcher */
export const isPasswordValid = (plainPassword: string, hashedPassword: string) => bcryptjs.compare(plainPassword, hashedPassword);

/**user existence checker */
export const isUserExists = async ({ id, email }: UserArgs) => {
  try {
    return id ? UserModel.getUserById(id) : email ? UserModel.getUserByEmail(email) : null;
  } catch (error) {
    logger.error(error);
    throw new InternalServerError("Failed to get user data");
  }
};
