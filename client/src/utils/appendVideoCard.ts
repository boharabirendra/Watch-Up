import { IVideo } from "../interface/videoCard";
import { timeAndDateFormater } from "./dateFormatter";
import { formatDuration, formatViews } from "./formatDurationAndViews";

export const appendVideoCard = (video: IVideo) => {
  const videoCard = document.createElement("div");
  videoCard.className = "video-item group cursor-pointer flex flex-col w-full max-w-xs transition-all duration-300";
  videoCard.setAttribute("data-videoPublicId", video.videoPublicId);
  videoCard.setAttribute("data-videoId", video.id.toString());

  videoCard.innerHTML = `
      <div class="relative w-full h-44 overflow-hidden rounded-lg shadow-lg bg-gray-800">
        <img src="${video.thumbnailUrl}" alt="${video.title}" class="object-cover w-full h-full transition-transform duration-300" />
        <div class="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
          ${formatDuration(Math.trunc(video.duration))}
        </div>
      </div>
      <div class="mt-4 flex items-start">
        <div class="flex-shrink-0"> 
          <img src="${video.user.profileUrl || "/public/sample.jpeg"}" class="h-8 w-8 rounded-full object-cover" alt="${video.user.email}" />
        </div>
        <div class="ml-3 flex-1">
          <h4 class="text-sm font-semibold text-gray-200 line-clamp-2 leading-5 group-hover:text-blue-400 transition-colors duration-300">
            ${video.title}
          </h4>
          <p class="text-xs text-gray-400 mt-1 hover:text-gray-300 transition-colors duration-300">
            ${video.user.email}
          </p>
          <div class="text-xs text-gray-500 mt-1 flex gap-3">
            <p>${formatViews(video.views)} views</p>
            <p>${timeAndDateFormater(video.createdAt)}</p>
          </div>
        </div>
      </div>
    `;
    return videoCard;
};
