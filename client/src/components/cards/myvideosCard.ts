import { IVideo } from "../../interface/videoCard";

export const MyVideoCard = (video: IVideo) => `
         <div class="bg-bodybgcolor rounded-lg shadow-md overflow-hidden text-white border-gray-700">
            <img src="${video.thumbnailUrl}" alt="Video Thumbnail" class="w-full h-48 object-cover" />
            <div id="myvideo" class="p-4">
              <h3 class="text-xl font-semibold mb-2 line-clamp-1">${video.title}</h3>
              <div class="flex justify-between text-sm text-gray-100 mb-4">
                <span>Views: ${video.views}</span>
                <span class="">Likes: ${video.likes}</span>
                <span class="">Comments: ${video.commentCount}</span>
              </div>
              <div class="flex justify-between items-center">
                <button 
                    id="publish-video"
                    data-videoId="${video.id}"
                    data-visibility="${video.isPublished ? "published" : "unpublished"}"
                    title="${video.isPublished ? "Make it private" : "Make it public"}"
                    class="text-white px-4 py-2 rounded-full bg-bglikebtn transition-all duration-300 ease-in-out transform hover:scale-105" 
                    >${video.isPublished ? "Make private" : "Make public"}
                </button>
                <button id="edit-video"  data-videoId="${video.id}" class="rounded-full px-3 py-2 bg-indigo-500  transition-all duration-300 ease-in-out transform hover:scale-105">
                    <div class="flex gap-1 items-center">
                        <svg class="w-4 h-4 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                        <path fill-rule="evenodd" d="M11.32 6.176H5c-1.105 0-2 .949-2 2.118v10.588C3 20.052 3.895 21 5 21h11c1.105 0 2-.948 2-2.118v-7.75l-3.914 4.144A2.46 2.46 0 0 1 12.81 16l-2.681.568c-1.75.37-3.292-1.263-2.942-3.115l.536-2.839c.097-.512.335-.983.684-1.352l2.914-3.086Z" clip-rule="evenodd"/>
                        <path fill-rule="evenodd" d="M19.846 4.318a2.148 2.148 0 0 0-.437-.692 2.014 2.014 0 0 0-.654-.463 1.92 1.92 0 0 0-1.544 0 2.014 2.014 0 0 0-.654.463l-.546.578 2.852 3.02.546-.579a2.14 2.14 0 0 0 .437-.692 2.244 2.244 0 0 0 0-1.635ZM17.45 8.721 14.597 5.7 9.82 10.76a.54.54 0 0 0-.137.27l-.536 2.84c-.07.37.239.696.588.622l2.682-.567a.492.492 0 0 0 .255-.145l4.778-5.06Z" clip-rule="evenodd"/>
                        </svg>
                        Edit
                    </div>
                </button>
                <button id="delete-video"  data-videoId="${
                  video.id
                }" class="text-red-500 bg-opacity-10 rounded-full bg-red-500 px-3 py-2 transition-all duration-300 ease-in-out transform hover:scale-105">
                    <div class="flex gap-2 items-center">
                        <svg class="w-4 h-4 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"/>
                        </svg>
                        Delete
                    </div>
                </button>
              </div>
            </div>
          </div>
`;
