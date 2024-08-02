import { IVideo } from "./interface/videoCard";
import { getComments } from "./components/comments/comment";
import { ViewTracker } from "./components/views/viewTracker";
import { VideoPlayer } from "./components/videoplayer/videoPlayer";
import { VideoInfoCard } from "./components/cards/videoInfoCard";
import { CommentInfoCard } from "./components/cards/commentInfoCard";

import { generateSkeleton } from "./components/cards/videoCardSkeleton";
import { logoutHandler, navbarHandler } from "./components/nav/navbarHandler";

import { fetchVideos, fetchVideoById, fetchSuggestionVideos, generateSuggestedVideoHtml } from "./components/videos/video";
import { likesHandler, handleComment, handleCommentDeletion, handleCommentEdit } from "./mainHandler";
import { appendVideoCard } from "./utils/appendVideoCard";

class VideoController {
  private page: number;
  private filter: string;
  private videoId: string;
  private videoPublicId: string | null;
  private videoGridElement: HTMLDivElement;
  private mainVideoElement: HTMLVideoElement;
  private videoPlayerElement: HTMLDivElement;
  private videoSearchElement: HTMLInputElement;
  private suggestedVideosElement: HTMLDivElement;
  private videoInfoContainerElement: HTMLDivElement;
  private videoCommentContainerElement: HTMLDivElement;

  constructor() {
    this.videoGridElement = document.getElementById("video-grid") as HTMLDivElement;
    this.videoSearchElement = document.getElementById("search") as HTMLInputElement;
    this.mainVideoElement = document.getElementById("main-video") as HTMLVideoElement;
    this.videoPlayerElement = document.getElementById("video-player") as HTMLDivElement;
    this.suggestedVideosElement = document.getElementById("suggested-videos") as HTMLDivElement;
    this.videoInfoContainerElement = document.getElementById("video-info-container") as HTMLDivElement;
    this.videoCommentContainerElement = document.getElementById("video-comment-container") as HTMLDivElement;

    this.page = 1;
    this.filter = "";
    this.videoId = "";
    this.videoPublicId = "";
    
    window.addEventListener("scroll", this.handleInfiniteScroll);

    this.init();
  }

  private init(): void {
    this.videoGridElement.innerHTML = generateSkeleton();
    this.renderVideoGrid(this.filter);
    this.loadFromUrl();
    window.addEventListener("popstate", () => this.loadFromUrl());
  }

  private async renderVideoGrid(filter: string) {
    const videos = await fetchVideos(filter);
    this.videoGridElement.innerHTML = videos;
    this.videoGridElement.addEventListener("click", (event) => {
      const videoItem = (event.target as HTMLElement).closest(".video-item");
      if (videoItem) {
        this.videoPublicId = videoItem.getAttribute("data-videoPublicId");
        this.videoId = videoItem.getAttribute("data-videoId")!;
        this.loadVideo(this.videoPublicId!);
      }
    });
  }

  private loadFromUrl(): void {
    const urlParams = new URLSearchParams(window.location.search);
    this.videoPublicId = urlParams.get("v");
    const videoId = urlParams.get("videoId");
    if (this.videoPublicId && videoId) {
      this.videoId = videoId;
      this.loadVideo(this.videoPublicId);
    } else {
      this.showVideoGrid();
    }
  }

  private async loadVideo(videoPublicId: string) {
    const video = await fetchVideoById(videoPublicId);
    if (video) {
      this.showVideoPlayer();
      this.playVideo(video.playbackUrl, videoPublicId);
      this.loadVideoInfo(video);
      await this.loadCommentInfo();
      await this.renderSuggestedVideos(videoPublicId);
      history.pushState(null, "", `?v=${videoPublicId}&videoId=${this.videoId}`);

      likesHandler();
      handleComment();
      handleCommentEdit();
      handleCommentDeletion();
    }
  }

  private showVideoGrid(): void {
    this.videoGridElement.classList.add("block");
    this.videoPlayerElement.classList.add("hidden");
  }

  private showVideoPlayer(): void {
    this.videoGridElement.classList.add("hidden");
    this.videoPlayerElement.classList.remove("hidden");
  }

  private playVideo(videoUrl: string, videoPublicId: string): void {
    new VideoPlayer(this.mainVideoElement, videoUrl);
    new ViewTracker(this.mainVideoElement, videoPublicId);
    window.scrollTo(0, 0);
  }

  private async renderSuggestedVideos(currentVideoId: string) {
    const videos = await generateSuggestedVideoHtml(currentVideoId, this.page);
    this.suggestedVideosElement.innerHTML = videos;
    this.suggestedVideosElement.addEventListener("click", (e) => {
      const videoItem = (e.target as HTMLElement).closest(".video-item");
      if (videoItem) {
        const videoId = videoItem.getAttribute("data-videoPublicId");
        this.videoId = videoItem.getAttribute("data-videoId")!;
        this.loadVideo(videoId!);
      }
    });
  }

  private handleInfiniteScroll = () => {
    const endOfPage = window.innerHeight + window.pageYOffset >= (document.body.offsetHeight - 100);
    if (endOfPage) {
      this.loadMoreSuggestedVideos(++this.page);
    }
  };

  private async loadMoreSuggestedVideos(page: number) {
    if (!this.videoPublicId) return;
    const videos = await fetchSuggestionVideos(this.videoPublicId, page);
    for (let i = 0; i < videos.length; i++) {
      const newVideo = appendVideoCard(videos[i]);
      this.suggestedVideosElement.appendChild(newVideo);
    }
  }
  

  private loadVideoInfo(video: IVideo) {
    this.videoInfoContainerElement.innerHTML = VideoInfoCard(video);
  }

  private async loadCommentInfo() {
    const comments = await getComments(this.videoId);
    this.videoCommentContainerElement.innerHTML = CommentInfoCard(comments);
  }

  private filterVideos() {
    this.videoSearchElement.addEventListener("keydown", async (event) => {
      if (event.key === "Enter") {
        this.filter = this.videoSearchElement.value.trim();
        if (this.filter === "") return;
        this.renderVideoGrid(this.filter);
      }
    });
  }
}

new VideoController();
navbarHandler();
logoutHandler();

/**Adding shortcut */
document.addEventListener("DOMContentLoaded", () => {
  const videoSearchElement = document.getElementById("search") as HTMLInputElement;
  document.addEventListener("keydown", (event) => {
    if (event.key === "/") {
      event.preventDefault();
      videoSearchElement.focus();
    }
  });
});
