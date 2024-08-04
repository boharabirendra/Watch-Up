export const VideoSkeleton = () => `
 <div class="bg-gray-800 rounded-lg overflow-hidden animate-pulse">
    <div class="aspect-video bg-gray-400"></div>
    <div class="p-4">
      <div class="flex items-center space-x-4">
        <div class="rounded-full bg-slate-700 h-10 w-10"></div>
        <div class="flex-1 space-y-2 py-1">
          <div class="h-4 bg-gray-600 rounded w-3/4"></div>
          <div class="h-4 bg-gray-600 rounded w-5/6"></div>
        </div>
      </div>
      <div class="space-y-2 mt-4">
        <div class="h-4 bg-gray-400 rounded w-1/2"></div>
        <div class="h-4 bg-gray-400 rounded w-1/4"></div>
      </div>
    </div>
  </div>
`;

export const myVideoSkeletonHTML = () =>
  Array(5)
    .fill(null)
    .map(() => VideoSkeleton())
    .join("");

export const generateSkeleton = () =>
  Array(12)
    .fill(null)
    .map(() => VideoSkeleton())
    .join("");
