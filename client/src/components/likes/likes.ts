import axios from "axios";
import { BASE_URL } from "../../constants/constants";

export const getLikeStatus = async (videoPublicId: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/likes/get-like-status/${videoPublicId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    return response.data.data;
  } catch (error) {
    console.log(error);
  }
};

export const updateLikeCount = async (videoPublicId: string) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/likes/update-like/${videoPublicId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    );
    return response.data.data;
  } catch (error) {
    console.log(error);
  }
};
