import bcryptjs from "bcryptjs";
export const generateHashedPassword = async (password: string) => {
  return bcryptjs.hash(password, 10);
};
