export const VideoPlayerComponent = (title: string) => {
  return `
      <div class="basis-[75%]">
        <div class="flex flex-col gap-2">
           <div class="rounded-md overflow-hidden">
               <video id="player" controls autoplay class="h-full w-full object-cover"></video>
           </div>
          <h1 class="text-xl font-bold">${title}</h1>
        </div>
      </div>
    `;
};
