import api from "./axiosInerceptor";

export const isUserAuthenticated = async (): Promise<boolean> => {
  try {
    await api.get(`/users/me`);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};
