import { IVideo } from "./interface/videoCard";
import { appendVideoCard } from "./utils/appendVideoCard";
import { getComments } from "./components/comments/comment";
import { ViewTracker } from "./components/views/viewTracker";
import { VideoInfoCard } from "./components/cards/videoInfoCard";
import { VideoPlayer } from "./components/videoplayer/videoPlayer";
import { CommentInfoCard } from "./components/cards/commentInfoCard";

import { generateSkeleton } from "./components/cards/videoCardSkeleton";
import { logoutHandler, navbarHandler } from "./components/nav/navbarHandler";

import { getVideosViews } from "./components/likes/likes";
import { likesHandler } from "./components/likes/likeHandler";
import { handleComment, handleCommentDeletion, handleCommentEdit } from "./components/comments/commentHandler";
import { fetchVideoById, fetchSuggestionVideos, generateFilterVideosHTML, fetchVideos } from "./components/videos/video";
import { FilterVideoCard } from "./components/cards/filterVideoCard";

class VideoController {
  private filter: string;
  private videoId: string;
  private gridPage: number;
  private filterPage: number;
  private hasMoreData: boolean;
  private suggestionPage: number;
  private viewUpdateTimer: number;
  private videoPublicId: string | null;
  private videoGridElement: HTMLDivElement;
  private mainVideoElement: HTMLVideoElement;
  private videoPlayerElement: HTMLDivElement;
  private videoSearchElement: HTMLInputElement;
  private suggestedVideosElement: HTMLDivElement;
  private videoInfoContainerElement: HTMLDivElement;
  private filterVideosContainerElement: HTMLDivElement;
  private videoCommentContainerElement: HTMLDivElement;

  constructor() {
    this.videoGridElement = document.getElementById("video-grid") as HTMLDivElement;
    this.videoSearchElement = document.getElementById("search") as HTMLInputElement;
    this.mainVideoElement = document.getElementById("main-video") as HTMLVideoElement;
    this.videoPlayerElement = document.getElementById("video-player") as HTMLDivElement;
    this.suggestedVideosElement = document.getElementById("suggested-videos") as HTMLDivElement;
    this.videoInfoContainerElement = document.getElementById("video-info-container") as HTMLDivElement;
    this.filterVideosContainerElement = document.getElementById("filter-videos-container") as HTMLDivElement;
    this.videoCommentContainerElement = document.getElementById("video-comment-container") as HTMLDivElement;

    this.filter = "";
    this.videoId = "";
    this.gridPage = 1;
    this.filterPage = 1;
    this.hasMoreData = true;
    this.suggestionPage = 1;
    this.videoPublicId = "";
    this.viewUpdateTimer = 0;

    window.addEventListener("scroll", this.handleGridVideoInfiniteScroll);
    window.addEventListener("scroll", this.handleFilterVideoInfiniteScroll);
    window.addEventListener("scroll", this.handleSuggestedVideoInfiniteScroll);

    this.init();
  }

  private init(): void {
    this.videoGridElement.innerHTML = generateSkeleton();
    this.renderVideoGrid(this.filter);
    this.loadFromUrl();
    this.filterVideos();
    window.addEventListener("popstate", () => this.loadFromUrl());
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
      clearInterval(this.viewUpdateTimer);
    }
  }

  private async loadVideo(videoPublicId: string) {
    const video = await fetchVideoById(videoPublicId);
    if (video) {
      this.hasMoreData = true;
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
    this.filterVideosContainerElement.classList.add("hidden");
  }

  private playVideo(videoUrl: string, videoPublicId: string): void {
    new VideoPlayer(this.mainVideoElement, videoUrl);
    new ViewTracker(this.mainVideoElement, videoPublicId);
    this.suggestionPage = 1;
    this.viewUpdateTimer = setInterval(async () => {
      await this.viewsUpdator();
    }, 12000);
    window.scrollTo(0, 0);
  }

  /**Render initial videos */
  private async renderVideoGrid(filter: string) {
    const videos = await fetchVideos(filter);
    this.videoGridElement.innerHTML = "";
    if (videos.length === 0) this.hasMoreData = false;
    for (let i = 0; i < videos.length; i++) {
      const newVideo = appendVideoCard(videos[i]);
      this.videoGridElement.appendChild(newVideo);
    }
    this.videoGridElement.addEventListener("click", (event) => {
      const videoItem = (event.target as HTMLElement).closest(".video-item");
      if (videoItem) {
        this.videoPublicId = videoItem.getAttribute("data-videoPublicId");
        this.videoId = videoItem.getAttribute("data-videoId")!;
        this.loadVideo(this.videoPublicId!);
      }
    });
  }

  /**Render suggested videos */
  private async renderSuggestedVideos(currentVideoId: string) {
    const videos = await fetchSuggestionVideos(currentVideoId, this.suggestionPage);
    if (videos.length === 0) this.hasMoreData = false;
    for (let i = 0; i < videos.length; i++) {
      const newVideo = appendVideoCard(videos[i]);
      this.suggestedVideosElement.appendChild(newVideo);
    }
    this.suggestedVideosElement.addEventListener("click", (e) => {
      const videoItem = (e.target as HTMLElement).closest(".video-item");
      if (videoItem) {
        const videoId = videoItem.getAttribute("data-videoPublicId");
        this.videoId = videoItem.getAttribute("data-videoId")!;
        this.loadVideo(videoId!);
      }
    });
  }

  /**Render fileter videos */
  private async renderFilterVideoGrid(filter: string) {
    this.videoGridElement.innerHTML = "";
    const videos = await generateFilterVideosHTML(filter);
    this.filterVideosContainerElement.innerHTML = videos;
    this.filterVideosContainerElement.addEventListener("click", (event) => {
      const videoItem = (event.target as HTMLElement).closest(".video-item");
      if (videoItem) {
        this.videoPublicId = videoItem.getAttribute("data-videoPublicId");
        this.videoId = videoItem.getAttribute("data-videoId")!;
        this.loadVideo(this.videoPublicId!);
      }
    });
  }

  private handleSuggestedVideoInfiniteScroll = () => {
    const endOfPage = window.innerHeight + window.pageYOffset >= document.body.offsetHeight;
    if (endOfPage) {
      this.loadMoreSuggestedVideos(++this.suggestionPage);
    }
  };

  private handleFilterVideoInfiniteScroll = () => {
    const endOfPage = window.innerHeight + window.pageYOffset >= document.body.offsetHeight;
    if (endOfPage) {
      this.loadMoreFilteredVideos(++this.filterPage);
    }
  };

  private handleGridVideoInfiniteScroll = () => {
    const endOfPage = window.innerHeight + window.pageYOffset >= document.body.offsetHeight;
    if (endOfPage) {
      this.loadMoreGridVideos(++this.gridPage);
    }
  };


  private async loadMoreSuggestedVideos(page: number) {
    if (!this.videoPublicId) return;
    if (!this.hasMoreData) return;
    const videos = await fetchSuggestionVideos(this.videoPublicId, page);
    if (videos.length === 0) this.hasMoreData = false;
    for (let i = 0; i < videos.length; i++) {
      const newVideo = appendVideoCard(videos[i]);
      this.suggestedVideosElement.appendChild(newVideo);
    }
  }

  private async loadMoreFilteredVideos(page: number) {
    if (!this.filter) return;
    if (!this.hasMoreData) return;
    const videos = await fetchVideos(this.filter, page);
    if (videos.length === 0) this.hasMoreData = false;
    const newVideo = videos.map((video) => FilterVideoCard(video)).join("");
    this.filterVideosContainerElement.insertAdjacentHTML("beforeend", newVideo);
  }

  private async loadMoreGridVideos(gridPage: number) {
    if (!this.hasMoreData) return;
    const videos = await fetchVideos(this.filter, gridPage);
    if (videos.length === 0) this.hasMoreData = false;
    for (let i = 0; i < videos.length; i++) {
      const newVideo = appendVideoCard(videos[i]);
      this.videoGridElement.appendChild(newVideo);
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
        this.filterPage = 1;
        this.renderFilterVideoGrid(this.filter);
      }
    });
  }

  private async viewsUpdator() {
    const viewElement = document.getElementById("video-views") as HTMLParagraphElement;
    const urlParams = new URLSearchParams(window.location.search);
    const videoPublicId = urlParams.get("v");
    if (videoPublicId && viewElement) {
      const views = await getVideosViews(videoPublicId);
      viewElement.innerHTML = views.views + " views";
    }
  }
}

new VideoController();
navbarHandler();
logoutHandler();

document.addEventListener("DOMContentLoaded", () => {
  const sidebar = document.getElementById("sidebar") as HTMLDivElement;
  const overlay = document.getElementById("overlay") as HTMLDivElement;
  const videoSearchElement = document.getElementById("search") as HTMLInputElement;
  const sidebarToggle = document.getElementById("sidebar-toggle") as HTMLButtonElement;

  document.addEventListener("keydown", (event) => {
    if (event.key === "/") {
      event.preventDefault();
      videoSearchElement.focus();
    }
  });

  /**toggle sidbar */
  sidebarToggle.addEventListener("click", toggleSidebar);
  overlay.addEventListener("click", toggleSidebar);

  function toggleSidebar() {
    sidebar.classList.toggle("-translate-x-full");
    overlay.classList.toggle("hidden");
  }
});
