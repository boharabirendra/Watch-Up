export const generateLoadingSkeleton = () => `
  <div class="flex flex-col lg:flex-row bg-gray-900 text-gray-200">
    <!-- Video Player Skeleton -->
    <div class="flex-1 lg:w-2/3 p-4">
      <div class="relative w-full h-0" style="padding-top: 56.25%;">
        <div class="absolute top-0 left-0 w-full h-full bg-gray-700 animate-pulse"></div>
      </div>
      <div class="mt-4">
        <div class="bg-gray-700 h-6 w-3/4 mb-2 animate-pulse"></div>
        <div class="bg-gray-700 h-4 w-full animate-pulse"></div>
      </div>
    </div>

    <!-- Suggested Videos Skeleton -->
    <div class="lg:w-1/3 p-4">
      <h2 class="bg-gray-700 h-6 w-1/2 mb-4 animate-pulse"></h2>
      <div class="space-y-4">
        ${Array(5).fill(null).map(() => `
          <div class="flex gap-2 animate-pulse">
            <div class="w-32 h-18 bg-gray-700 rounded-lg"></div>
            <div class="flex-1">
              <div class="bg-gray-700 h-4 w-full mb-2"></div>
              <div class="bg-gray-700 h-3 w-3/4 mb-1"></div>
              <div class="bg-gray-700 h-3 w-1/2"></div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  </div>
`;
