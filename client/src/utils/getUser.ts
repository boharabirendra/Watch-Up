import axios from "axios";
import { BASE_URL } from "../constants/constants";

export const getUser = async () => {
  try {
    if (localStorage.getItem("accessToken")) {
      const response = await axios.get(`${BASE_URL}/users/me`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      return response.data.data;
    }
    return null;
  } catch (error) {
    console.log(error);
  }
};
