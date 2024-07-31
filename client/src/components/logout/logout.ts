import axios from "axios";
import { BASE_URL } from "../../constants/constants";

export const logoutUser = async () => {
  try {
    const response = await axios.put(
      `${BASE_URL}/users/logout`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    );
    if (response.status === 200) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userId");
      localStorage.removeItem("profileUrl");
    }
  } catch (error) {
    console.error("Error while logout: ", error);
  }
};
