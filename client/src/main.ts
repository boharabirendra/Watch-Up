import { IVideo } from "./interface/videoCard";
import { appendVideoCard } from "./utils/appendVideoCard";
import { getComments } from "./components/comments/comment";
import { VideoInfoCard } from "./components/cards/videoInfoCard";
import { VideoPlayer } from "./components/videoplayer/videoPlayer";
import { CommentInfoCard } from "./components/cards/commentInfoCard";

import { getVideosViews } from "./components/likes/likes";
import { likesHandler } from "./components/likes/likeHandler";

import { ViewTracker } from "./components/views/viewTracker";

import { throttle } from "./utils/throttle";
import { generateSkeleton } from "./components/cards/videoCardSkeleton";
import { logoutHandler, navbarHandler } from "./components/nav/navbarHandler";

import { FilterVideoCard } from "./components/cards/filterVideoCard";
import { handleComment, handleCommentDeletion, handleCommentEdit } from "./components/comments/commentHandler";
import { fetchVideoById, fetchSuggestionVideos, generateFilterVideosHTML, fetchVideos } from "./components/videos/video";

import { THROTTLING_TIME } from "./constants/constants";
import { CurrentView } from "./components/constants/constants";

class VideoController {
  private filter: string;
  private videoId: string;
  private gridPage: number;
  private filterPage: number;
  private hasMoreData: boolean;
  private suggestionPage: number;
  private videoPublicId: string | null;

  private viewUpdateInterval: number | null = null;
  private throttledHandleInfiniteScroll: () => void;
  private currentView: CurrentView = CurrentView.Grid;
  private currentViewTracker: ViewTracker | null = null;

  private mainVideoElement: HTMLVideoElement;
  private videoSearchElement: HTMLInputElement;
  private searchBtnElement: HTMLButtonElement;

  private videoGridElement: HTMLDivElement;
  private videoPlayerElement: HTMLDivElement;
  private suggestedVideosElement: HTMLDivElement;
  private videoInfoContainerElement: HTMLDivElement;
  private filterVideosContainerElement: HTMLDivElement;
  private videoCommentContainerElement: HTMLDivElement;

  constructor() {
    this.videoGridElement = document.getElementById("video-grid") as HTMLDivElement;
    this.videoSearchElement = document.getElementById("search") as HTMLInputElement;
    this.searchBtnElement = document.getElementById("search-btn") as HTMLButtonElement;
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

    this.throttledHandleInfiniteScroll = throttle(this.handleInfiniteScroll, THROTTLING_TIME);
    window.addEventListener("scroll", this.throttledHandleInfiniteScroll);

    this.setupFilterVideosListener();
    this.setupSuggestedVideosListener();
    this.setupInitialVideoGridListener();
    this.init();
  }

  private init(): void {
    this.videoGridElement.innerHTML = generateSkeleton();
    this.loadFromUrl();
    this.renderVideoGrid(this.filter);
    this.searchVideosByEnter();
    this.searchVideosUsingBtn();
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

      await likesHandler();
      handleComment();
      handleCommentEdit();
      handleCommentDeletion();
      this.setupCopyUrlButton();
    }
  }

  private showVideoGrid(): void {
    this.videoGridElement.classList.add("block");
    this.videoPlayerElement.classList.add("hidden");
    this.filterVideosContainerElement.classList.add("hidden");
    this.currentView = CurrentView.Grid;
  }

  private showVideoPlayer(): void {
    this.videoGridElement.classList.add("hidden");
    this.videoPlayerElement.classList.remove("hidden");
    this.filterVideosContainerElement.classList.add("hidden");
    this.currentView = CurrentView.Suggested;
  }

  private async showFilterVideoGrid() {
    this.videoGridElement.classList.add("hidden");
    this.videoPlayerElement.classList.add("hidden");
    this.filterVideosContainerElement.classList.remove("hidden");
    this.currentView = CurrentView.Filter;
  }

  /**Render initial videos */

  private setupInitialVideoGridListener(): void {
    this.videoGridElement.addEventListener("click", (event) => {
      const videoItem = (event.target as HTMLElement).closest(".video-item");
      if (videoItem) {
        this.videoPublicId = videoItem.getAttribute("data-videoPublicId");
        this.videoId = videoItem.getAttribute("data-videoId")!;
        this.loadVideo(this.videoPublicId!);
      }
    });
  }

  private async renderVideoGrid(filter: string) {
    const videos = await fetchVideos(filter);
    this.videoGridElement.innerHTML = "";
    for (let i = 0; i < videos.length; i++) {
      const newVideo = appendVideoCard(videos[i]);
      this.videoGridElement.appendChild(newVideo);
    }
  }

  /**Suggestion video section */
  private setupSuggestedVideosListener(): void {
    this.suggestedVideosElement.addEventListener("click", (e) => {
      const videoItem = (e.target as HTMLElement).closest(".video-item");
      if (videoItem) {
        const videoId = videoItem.getAttribute("data-videoPublicId");
        this.videoId = videoItem.getAttribute("data-videoId")!;
        if (videoId) this.loadVideo(videoId);
      }
    });
  }

  private async renderSuggestedVideos(currentVideoId: string) {
    const videos = await fetchSuggestionVideos(currentVideoId, this.suggestionPage);
    if (videos.length === 0) this.hasMoreData = false;
    this.suggestedVideosElement.innerHTML = "";
    for (let i = 0; i < videos.length; i++) {
      const newVideo = appendVideoCard(videos[i]);
      this.suggestedVideosElement.appendChild(newVideo);
    }
  }

  /**Render filter videos section*/

  private setupFilterVideosListener(): void {
    this.filterVideosContainerElement.addEventListener("click", (event) => {
      const videoItem = (event.target as HTMLElement).closest(".video-item");
      if (videoItem) {
        this.videoPublicId = videoItem.getAttribute("data-videoPublicId");
        this.videoId = videoItem.getAttribute("data-videoId")!;
        this.loadVideo(this.videoPublicId!);
      }
    });
  }
  private searchVideosByEnter() {
    this.videoSearchElement.addEventListener("keydown", async (event) => {
      if (event.key === "Enter") {
        this.filterVideos();
      }
    });
  }

  private filterVideos() {
    this.showFilterVideoGrid();
    this.mainVideoElement.pause();
    this.mainVideoElement.currentTime = 0;
    this.filter = this.videoSearchElement.value.trim();
    if (this.filter === "") return;
    this.filterPage = 1;
    this.renderFilterVideoGrid(this.filter);
  }

  private searchVideosUsingBtn() {
    this.searchBtnElement.addEventListener("click", () => {
      this.filterVideos();
    });
  }

  private async renderFilterVideoGrid(filter: string) {
    const videos = await generateFilterVideosHTML(filter);
    this.filterVideosContainerElement.innerHTML = videos;
  }

  /**Loading data with scroll event listener */
  private handleInfiniteScroll = () => {
    const endOfPage = window.innerHeight + window.pageYOffset >= document.body.offsetHeight - 100;
    if (endOfPage) {
      switch (this.currentView) {
        case CurrentView.Grid:
          this.loadMoreGridVideos(++this.gridPage);
          break;
        case CurrentView.Filter:
          this.loadMoreFilteredVideos(++this.filterPage);
          break;
        case CurrentView.Suggested:
          this.loadMoreSuggestedVideos(++this.suggestionPage);
          break;
      }
    }
  };

  private async loadMoreGridVideos(gridPage: number) {
    if (this.currentView !== CurrentView.Grid) return;
    if (!this.hasMoreData) return;
    const videos = await fetchVideos(this.filter, gridPage);
    if (videos.length === 0) this.hasMoreData = false;
    for (let i = 0; i < videos.length; i++) {
      const newVideo = appendVideoCard(videos[i]);
      this.videoGridElement.appendChild(newVideo);
    }
  }

  private async loadMoreSuggestedVideos(page: number) {
    if (this.currentView !== CurrentView.Suggested) return;
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
    if (this.currentView !== CurrentView.Filter) return;
    if (!this.filter) return;
    if (!this.hasMoreData) return;
    const videos = await fetchVideos(this.filter, page);
    if (videos.length === 0) this.hasMoreData = false;
    const newVideo = videos.map((video) => FilterVideoCard(video)).join("");
    this.filterVideosContainerElement.insertAdjacentHTML("beforeend", newVideo);
  }

  private loadVideoInfo(video: IVideo) {
    this.videoInfoContainerElement.innerHTML = VideoInfoCard(video);
  }

  private async loadCommentInfo() {
    const comments = await getComments(this.videoId);
    this.videoCommentContainerElement.innerHTML = CommentInfoCard(comments);
  }

  /**View updator */
  private async viewsUpdator(videoPublicId: string) {
    const viewElement = document.getElementById("video-views") as HTMLParagraphElement;
    if (viewElement) {
      const views = await getVideosViews(videoPublicId);
      viewElement.innerHTML = views.views + " views";
    }
  }

  /**Video player */
  private playVideo(videoUrl: string, videoPublicId: string): void {
    this.mainVideoElement.pause();
    this.mainVideoElement.currentTime = 0;
    if (this.currentViewTracker) {
      this.currentViewTracker.stopTracking();
    }
    new VideoPlayer(this.mainVideoElement, videoUrl);
    this.currentViewTracker = new ViewTracker(videoPublicId);
    this.mainVideoElement.addEventListener("play", () => this.currentViewTracker?.startTracking());
    this.mainVideoElement.addEventListener("pause", () => this.currentViewTracker?.stopTracking());
    this.mainVideoElement.addEventListener("ended", () => this.currentViewTracker?.stopTracking());
    window.scrollTo(0, 0);
    this.suggestionPage = 1;
    this.startViewUpdater(videoPublicId);
  }

  private startViewUpdater(videoPublicId: string) {
    this.stopViewUpdater();
    this.viewUpdateInterval = window.setInterval(() => {
      this.viewsUpdator(videoPublicId);
    }, 10000);
    this.viewsUpdator(videoPublicId);
  }

  private stopViewUpdater() {
    if (this.viewUpdateInterval !== null) {
      clearInterval(this.viewUpdateInterval);
      this.viewUpdateInterval = null;
    }
  }

  /**Copu current url */
  private copyCurrentUrlToClipboard(): void {
    const shareMsgElement = document.getElementById("share-msg") as HTMLSpanElement;
    const currentUrl: string = window.location.href;
    navigator.clipboard
      .writeText(currentUrl)
      .then(() => {
        shareMsgElement.innerHTML = "Copied";
        shareMsgElement.classList.add("text-semibold");
        setTimeout(() => {
          shareMsgElement.innerHTML = "Copy link";
          shareMsgElement.classList.remove("text-semibold");
        }, 1500);
      })
      .catch((err) => {
        console.error("Failed to copy URL: ", err);
      });
  }
  private setupCopyUrlButton(): void {
    const copyUrlButton = document.getElementById("share-btn") as HTMLButtonElement;
    if (copyUrlButton) {
      copyUrlButton.addEventListener("click", () => {
        this.copyCurrentUrlToClipboard();
      });
    } else {
      console.error("Copy URL button not found");
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
