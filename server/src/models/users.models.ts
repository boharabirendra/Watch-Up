import prisma from "../db/prisma.db";
import { ChangePassword, IUser, UpdateUser } from "../interface/user.interface";

export const registerUser = (user: IUser) => {
  const { fullName, email, password, profileUrl, role, imagePublicId } =
    user;
  return prisma.user.create({
    data: {
      fullName,
      email,
      password,
      profileUrl,
      role,
      imagePublicId,
    },
  });
};

export const getUserByEmail = (email: string) => {
  return prisma.user.findUnique({
    where: {
      email,
    },
  });
};

export const getUserById = (id: number) => {
  return prisma.user.findUnique({
    where: {
      id,
    },
  });
};





export const changePassword = ({
  id,
  newPassword,
}: Pick<ChangePassword, "id" | "newPassword">) => {
  return prisma.user.update({
    data: {
      password: newPassword,
    },
    where: {
      id,
    },
  });
};

export const updateUser = ({ id, fullName, profileUrl }: UpdateUser) => {
  return profileUrl
    ? prisma.user.update({
        data: {
          fullName,
          profileUrl,
        },
        where: {
          id,
        },
      })
    : prisma.user.update({
        data: {
          fullName,
        },
        where: {
          id,
        },
      });
};

export const updateUserProfile = (
  id: number,
  newUrl: string,
  publicId: string
) => {
  return prisma.user.update({
    data: {
      profileUrl: newUrl,
      imagePublicId: publicId,
    },
    where: {
      id,
    },
  });
};
