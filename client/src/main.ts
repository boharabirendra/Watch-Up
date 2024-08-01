import { IVideo } from "./interface/videoCard";
import { getComments } from "./components/comments/comment";
import { ViewTracker } from "./components/views/viewTracker";
import { VideoPlayer } from "./components/videoplayer/videoPlayer";
import { VideoInfoCard } from "./components/cards/videoInfoCard";
import { CommentInfoCard } from "./components/cards/commentInfoCard";
import { logoutHandler, navbarHandler } from "./components/nav/navbarHandler";

import { fetchVideos, fetchVideoById, fetchSuggestionVideos } from "./components/videos/video";
import { likesHandler, handleComment, handleCommentDeletion, handleCommentEdit } from "./mainHandler";

class VideoController {
  private filter: string;
  private videoId: string;
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

    this.filter = "";
    this.videoId = "";
    this.init();
  }

  private init(): void {
    this.renderVideoGrid(this.filter);
    this.loadFromUrl();
    window.addEventListener("popstate", () => this.loadFromUrl());
  }


  
  private async renderVideoGrid(filter: string) {
    const videos = await fetchVideos(filter);
    this.videoGridElement.innerHTML = videos;
    this.videoGridElement.addEventListener("click", (event) => {
      const videoItem = (event.target as HTMLElement).closest("#video-item");
      if (videoItem) {
        const videoPublicId = videoItem.getAttribute("data-videoPublicId");
        this.videoId = videoItem.getAttribute("data-videoId")!;
        this.loadVideo(videoPublicId!);
      }
    });
  }

  private loadFromUrl(): void {
    const urlParams = new URLSearchParams(window.location.search);
    const videoPublicId = urlParams.get("v");
    const videoId = urlParams.get("videoId");
    if (videoPublicId && videoId) {
      this.videoId = videoId;
      this.loadVideo(videoPublicId);
    } else {
      this.showVideoGrid();
    }
  }

  private async loadVideo(videoPublicId: string) {
    const video = await fetchVideoById(videoPublicId);
    if (video) {
      this.showVideoPlayer();
      this.playVideo(video[0].playbackUrl, videoPublicId);
      this.loadVideoInfo(video[0]);
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
    const videos = await fetchSuggestionVideos(currentVideoId);
    this.suggestedVideosElement.innerHTML = videos;
    this.suggestedVideosElement.addEventListener("click", (e) => {
      const videoItem = (e.target as HTMLElement).closest("#video-item");
      if (videoItem) {
        const videoId = videoItem.getAttribute("data-videoPublicId");
        this.videoId = videoItem.getAttribute("data-videoId")!;
        this.loadVideo(videoId!);
      }
    });
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
