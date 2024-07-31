import bcryptjs from "bcryptjs";

import * as UserModel from "../models/users.models";

import {
  IUser,
  UserArgs,
  UpdateUser,
  ChangePassword,
  LoginCredentials,
  UpdaterUserProfile,
} from "../interface/user.interface";

import { generateAccessAndRefreshToken } from "../utils/generateTokens.utils";
import loggerWithNameSpace from "../utils/logger.utils";
import { uploadImageOnCloudinary } from "../utils/cloudinary.utils";
import { generateHashedPassword } from "../utils/generateHashedPassword.utils";

import {
  ConflictError,
  NotFoundError,
  BadRequestError,
  InternalServerError,
  UnauthenticatedError,
} from "../errors/error.error";

const logger = loggerWithNameSpace("[User Service]:");

/**create user */
export const registerUser = async (user: IUser) => {
  const existingUser = await isUserExists({ email: user.email });
  if (existingUser)
    throw new ConflictError(`User with email {${user.email}} already exists.`);

  try {
    const [password, uResponse] = await Promise.all([
      generateHashedPassword(user.password),
      user.profileUrl ? uploadImageOnCloudinary(user.profileUrl) : null,
    ]);

    await UserModel.registerUser({
      ...user,
      password,
      refreshToken: "",
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
  if (!existingUser)
    throw new NotFoundError(`User with email ${email} does not exist.`);
  if (!(await isPasswordValid(password, existingUser.password)))
    throw new UnauthenticatedError("Invalid password");

  const payload = {
    id: existingUser.id,
    fullName: existingUser.fullName,
    email: existingUser.email,
    role: existingUser.role,
    profileUrl: existingUser.profileUrl,
  };
  try {
    const { accessToken, refreshToken } =
      generateAccessAndRefreshToken(payload);
    await updateRefreshToken(existingUser.id, refreshToken);
    const user = await UserModel.getUserByEmail(email);
    const userWithOutPassword = { ...user, password: "" };
    return { accessToken, refreshToken, ...userWithOutPassword };
  } catch (error) {
    logger.error(error);
    throw new InternalServerError("Login failed.");
  }
};

/**change password */
export const changePassword = async ({
  id,
  oldPassword,
  newPassword,
}: ChangePassword) => {
  const existingUser = await isUserExists({ id });
  if (!existingUser) throw new NotFoundError("User does not exist.");
  if (!(await isPasswordValid(oldPassword, existingUser.password)))
    throw new BadRequestError("Invalid old password");

  try {
    const password = await generateHashedPassword(newPassword);
    await UserModel.changePassword({ id, newPassword: password });
  } catch (error) {
    logger.error(error);
    throw new InternalServerError("Password change failed.");
  }
};

/* logout user */
export const logoutUser = async (id: number) => {
  try {
    await UserModel.logoutUser(id);
  } catch (error) {
    logger.error(error);
    throw new InternalServerError("Failed to logout user");
  }
};

/** update refresh token  */
export const updateRefreshToken = async (id: number, refreshToken: string) => {
  try {
    const user = await UserModel.updateRefreshToken(id, refreshToken);
    const payload = {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
    };
    return generateAccessAndRefreshToken(payload);
  } catch (error) {
    logger.error(error);
    throw new InternalServerError("Failed to update refresh token");
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
export const updateUserProfile = async ({
  id,
  profileUrl,
}: UpdaterUserProfile) => {
  try {
    const existingUser = await isUserExists({ id });
    if (existingUser?.imagePublicId) {
      const profile = await uploadImageOnCloudinary(profileUrl);
      await UserModel.updateUserProfile(
        id,
        profile!.secure_url,
        profile!.public_id
      );
    }
  } catch (error) {
    logger.error(error);
    throw new BadRequestError("Error while updating user profile");
  }
};

/*password matcher */
const isPasswordValid = (plainPassword: string, hashedPassword: string) =>
  bcryptjs.compare(plainPassword, hashedPassword);

/**user existence checker */
const isUserExists = async ({ id, email }: UserArgs) => {
  try {
    return id
      ? UserModel.getUserById(id)
      : email
        ? UserModel.getUserByEmail(email)
        : null;
  } catch (error) {
    logger.error(error);
    throw new InternalServerError("Failed to get user data");
  }
};
