import axios from "axios";
import { IVideo } from "../../interface/videoCard";
import { VideoCard } from "../cards/videoCard";
import { BASE_URL } from "../../constants/constants";

export async function fetchVideos(filter: string): Promise<string> {
  /**alter query if search text is there */
  const url = filter ? `${BASE_URL}/videos/get-videos?q=${filter}` : `${BASE_URL}/videos/get-videos`;
  try {
    const response = await axios.get(url);
    console.log(response);
    const videosArray: IVideo[] = response.data.data;
    console.log(videosArray);
    if (videosArray.length === 0) {
      return `<h1 class="text-xl">Sorry, no videos found! </h1>`;
    }
    const videos = videosArray.map((video: IVideo) => VideoCard(video)).join("");
    return videos;
  } catch (error) {
    console.log(error);
    return "";
  }
}

export async function fetchSuggestionVideos(videoPublicId: string): Promise<string> {
  const url = `${BASE_URL}/videos/get-suggestion-vidoes/${videoPublicId}`;
  try {
    const response = await axios.get(url);
    const videosArray: IVideo[] = response.data.data;
    const videos = videosArray.map((video: IVideo) => VideoCard(video)).join("");
    return videos;
  } catch (error) {
    console.log(error);
    return "";
  }
}

export const fetchVideoById = async (videoPublicId: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/videos/get-video/public/${videoPublicId}`);
    const video = response.data.data;
    return video ? video : null;
  } catch (error) {
    console.error(error);
    return null;
  }
};
