import api from "../../utils/axiosInerceptor";

export const createComment = async (formData: FormData) => {
  try {
    await api.post(`/comments/create-comment`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  } catch (error) {
    console.log(error);
  }
};

export const getComments = async (videoId: string) => {
  try {
    const response = await api.get(`/comments/get-comments/${videoId}`);
    console.log(response.data.data);
    return response.data.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const deleteComment = async (id: string) => {
  try {
    await api.delete(`/comments/delete/${id}`);
  } catch (error) {
    console.log(error);
  }
};

export const updateComment = async (id: string, text: string) => {
  try {
    await api.put(`/comments/update/${id}`, { text });
  } catch (error) {
    console.log(error);
  }
};
