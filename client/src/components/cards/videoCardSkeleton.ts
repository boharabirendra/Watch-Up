const skeletonNumberArray = [1, 2, 3, 4, 5, 6, 7, 8];
export const VideoSkeleton = () => `
 <div class="bg-gray-600 rounded-lg overflow-hidden animate-pulse">
    <div class="aspect-video bg-gray-300"></div>
    <div class="p-4">
      <!-- Avatar and title row -->
      <div class="flex items-center space-x-4">
        <div class="rounded-full bg-gray-300 h-10 w-10"></div>
        <div class="flex-1 space-y-2 py-1">
          <div class="h-4 bg-gray-300 rounded w-3/4"></div>
          <div class="h-4 bg-gray-300 rounded w-5/6"></div>
        </div>
      </div>
      <div class="space-y-2 mt-4">
        <div class="h-4 bg-gray-300 rounded w-1/2"></div>
        <div class="h-4 bg-gray-300 rounded w-1/4"></div>
      </div>
    </div>
  </div>
`;

export const generateSkeleton = () => {
  const skeletonHTML = skeletonNumberArray.map((item) => VideoSkeleton()).join("");
  return skeletonHTML;
};
