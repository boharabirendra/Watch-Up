
export interface IUser {
  id?: number;
  fullName: string;
  email: string;
  password: string;
  profileUrl: string;
  imagePublicId: string;
  role: string
}

export type LoginCredentials = Pick<IUser, "email" | "password">;
export type UpdateUser = Pick<IUser, "id" | "fullName" | "profileUrl">;
export type ChangePassword = {
  id: number;
  newPassword: string;
  oldPassword: string;
};

export type UpdaterUserProfile = {
  id: number;
  profileUrl: string;
}


export type UserArgs = {
  id?: number;
  email?: string;
}

export interface GetUserQuery{
  q?: string;
  page: number;
  size: number;
}