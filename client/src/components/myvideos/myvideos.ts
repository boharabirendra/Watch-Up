import api from "../../utils/axiosInerceptor";

export const getMyVideos = async () => {
  try {
    const response = await api.get(`/videos/myvidoes`);
    return response.data.data;
  } catch (error) {
    console.log(error);
  }
};

export const publishVideo = async (videoId: string) => {
  try {
    await api.put(`/videos/publish/${videoId}`);
  } catch (error) {
    console.log(error);
  }
};

export const unpublishVideo = async (videoId: string) => {
  try {
    await api.put(`/videos/unpublish/${videoId}`);
  } catch (error) {
    console.log(error);
  }
};

export const deleteVideoById = async (videoId: string) => {
  try {
    await api.delete(`/videos/delete/${videoId}`);
  } catch (error) {
    console.log(error);
  }
};

export const fetchVideoById = async (videoId: string) => {
  try {
    const response = await api.get(`/videos/get-video/${videoId}`);
    return response.data.data;
  } catch (error) {
    console.log(error);
  }
};

export const editVideoDetails = async (videoId: string, data: any) => {
  try {
    await api.put(`/videos/update-video/${videoId}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  } catch (error) {
    console.log(error);
  }
};
