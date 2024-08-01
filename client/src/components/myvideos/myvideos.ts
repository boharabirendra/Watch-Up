import axios from "axios";
import { BASE_URL } from "../../constants/constants";

export const getMyVideos = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/videos/myvidoes`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    return response.data.data;
  } catch (error) {
    console.log(error);
  }
};

export const publishVideo = async (videoId: string) => {
  try {
    await axios.put(
      `${BASE_URL}/videos/publish/${videoId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    );
  } catch (error) {
    console.log(error);
  }
};

export const unpublishVideo = async (videoId: string) => {
  try {
    await axios.put(
      `${BASE_URL}/videos/unpublish/${videoId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    );
  } catch (error) {
    console.log(error);
  }
};

export const deleteVideoById = async (videoId: string) => {
  try {
    await axios.delete(`${BASE_URL}/videos/delete/${videoId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

export const fetchVideoById = async (videoId: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/videos/get-video/${videoId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    return response.data.data;
  } catch (error) {
    console.log(error);
  }
};

export const editVideoDetails = async (videoId: string, data: any) => {
  try {
    await axios.put(`${BASE_URL}/videos/update-video/${videoId}`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        "Content-Type": "multipart/form-data",
      },
    });
  } catch (error) {
    console.log(error);
  }
};
