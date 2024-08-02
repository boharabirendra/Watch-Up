import api from "./axiosInerceptor";

export const getUser = async () => {
  try {
    if (localStorage.getItem("accessToken")) {
      const response = await api.get(`/users/me`);
      return response.data.data;
    }
    return null;
  } catch (error) {
    console.log(error);
  }
};
