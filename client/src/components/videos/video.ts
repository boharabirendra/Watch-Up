import axios from "axios";
import { IVideo } from "../../interface/videoCard";
import { BASE_URL, SIZE } from "../../constants/constants";
import { FilterVideoCard } from "../cards/filterVideoCard";

export async function fetchVideos(filter: string, page:number = 1) {
  const url = filter ? `${BASE_URL}/videos/get-videos?q=${filter}&size=${SIZE}&page=${page}` : `${BASE_URL}/videos/get-videos`;
  console.log({filter, page});
  try {
    const response = await axios.get(url);
    const videosArray: IVideo[] = response.data.data;
    return videosArray;
  } catch (error) {
    console.log(error);
    return [];
  }
}


export async function generateFilterVideosHTML(filter: string): Promise<string> {
  const videosArray = await fetchVideos(filter);
  if (videosArray.length === 0) {
    return `<h1 class="text-xl">Sorry, no videos found! </h1>`;
  }
  const videos = videosArray.map((video: IVideo) => FilterVideoCard(video)).join("");
  return videos;
}


export async function fetchSuggestionVideos(videoPublicId: string, page: number) {
  const url = `${BASE_URL}/videos/get-suggestion-vidoes?videoPublicId=${videoPublicId}&page=${page}&size=${SIZE}`;
  try {
    const response = await axios.get(url);
    const videosArray: IVideo[] = response.data.data;
    return videosArray;
  } catch (error) {
    console.log(error);
    return [];
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
