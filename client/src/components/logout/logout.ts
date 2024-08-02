import api from "../../utils/axiosInerceptor";

export const logoutUser = async () => {
  try {
    const response = await api.put(`/users/logout`);
    if (response.status === 200) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("profileUrl");
    }
  } catch (error) {
    console.error("Error while logout: ", error);
  }
};
