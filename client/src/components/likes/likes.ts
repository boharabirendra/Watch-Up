import api from "../../utils/axiosInerceptor";

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

export const getVideosViews = async (videoPublicId: string) => {
  try {
    const response = await api.get(`/videos/views/${videoPublicId}`);
    return response.data.data;
  } catch (error) {
    console.log(error);
  }
};
