import { IVideo } from "../../interface/videoCard";
import { timeAndDateFormater } from "../../utils/dateFormatter";
import { DEFAULT_IMAGE_URL } from "../constants/constants";
import { mustLoginMessageCard } from "./mustLoginMessageCard";
import { VideoDescriptionCard } from "./videoDescriptionCard";

export const VideoInfoCard = (video: IVideo) => `
        <div class="mt-4">
          <div><h1 class="text-xl font-semibold">${video.title}</h1></div>
          <div class="min-w-12 mt-2 flex gap-4">
            <div>
              <img
                src="${video.userVideos[0].profileUrl || DEFAULT_IMAGE_URL}"
                class="h-12 w-12 rounded-full"
                alt="user"
              />
            </div>
            <div class="flex gap-4 items-center">
              <div>
                <p>@${video.userVideos[0].fullName}</p>
                <div class="flex gap-3 text-sm text-gray-400">
                  <p>${video.views} views</p>
                  <p>${timeAndDateFormater(video.createdAt)}</p>
                </div>
              </div>
             <div class="flex items-center gap-3">
                <button id="likeButton" class="flex items-center px-6 py-3 bg-bglikebtn rounded-full transition duration-300">
                  <svg id="likeSvg" class="w-6 h-6 mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path id="likePath" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11c.889-.086 1.416-.543 2.156-1.057a22.323 22.323 0 0 0 3.958-5.084a1.6 1.6 0 0 1 .582-.628 1.549 1.549 0 0 1 1.466-.087c.205.095.388.233.537.406a1.64 1.64 0 0 1 .384 1.279l-1.388 4.114M7 11H4v6.5A1.5 1.5 0 0 0 5.5 19v0A1.5 1.5 0 0 0 7 17.5V11Zm6.5-1h4.915c.286 0 .372.014.626.15.254.135.472.332.637.572a1.874 1.874 0 0 1 .215 1.673l-2.098 6.4C17.538 19.52 17.368 20 16.12 20c-2.303 0-4.79-.943-6.67-1.475" />
                  </svg>
                  <span id="likeCount">${video.likes}</span>
                  <span class="text-gray-400 px-2">|</span>
                  <span>likes</span>
                </button>
                ${mustLoginMessageCard()}
              </div>
            </div>
          </div>
         ${VideoDescriptionCard(video.description)}
        </div>
`;
