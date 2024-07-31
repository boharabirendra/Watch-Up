import axios from "axios";
import { BASE_URL } from "../constants/constants";

export const isUserAuthenticated = async (): Promise<boolean> => {
  try {
    await axios.get(`${BASE_URL}/users/me`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};
