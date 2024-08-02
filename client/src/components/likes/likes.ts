import api from "../../utils/axiosInerceptor";
import { BASE_URL } from "../../constants/constants";

export const getLikeStatus = async (videoPublicId: string) => {
  try {
    const response = await api.get(`/likes/get-like-status/${videoPublicId}`);
    return response.data.data;
  } catch (error) {
    console.log(error);
  }
};

export const updateLikeCount = async (videoPublicId: string) => {
  try {
    const response = await api.put(`/likes/update-like/${videoPublicId}`);
    return response.data.data;
  } catch (error) {
    console.log(error);
  }
};
