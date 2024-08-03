import { SIZE } from "../../constants/constants";
import { spinnerStart, spinnerStop } from "../../utils/common";
import { MyVideoCard } from "../cards/myvideosCard";
import { myVideoSkeletonHTML } from "../cards/videoCardSkeleton";
import { deleteVideoById, editVideoDetails, fetchVideoById, getMyVideos, publishVideo, unpublishVideo } from "./myvideos";

let page: number = 1;
let totalVideos: number = 0;
document.addEventListener("DOMContentLoaded", async () => {
  const prevElement = document.getElementById("prev") as HTMLSpanElement;
  const nextElement = document.getElementById("next") as HTMLSpanElement;
  const currentPage = document.getElementById("current-page") as HTMLSpanElement;
  const myVideosContainerElement = document.getElementById("myvideo-container") as HTMLDivElement;

  await renderVideos(page);

  prevElement.addEventListener("click", async () => {
    if (page > 1) {
      page = page - 1;
      await renderVideos(page);
      currentPage.innerHTML = page.toString();
    }
  });

  nextElement.addEventListener("click", async () => {
    if (page < Math.ceil(totalVideos / SIZE)) {
      page = page + 1;
      await renderVideos(page);
      currentPage.innerHTML = page.toString();
    }
  });

  myVideosContainerElement.addEventListener("click", async (event) => {
    const editVideoElement = (event.target as HTMLElement).closest(".edit-video") as HTMLButtonElement;
    const deleteVideoElement = (event.target as HTMLElement).closest(".delete-video") as HTMLButtonElement;
    const publishVideoElement = (event.target as HTMLElement).closest(".publish-video") as HTMLButtonElement;

    changeVideoVisibility(publishVideoElement);
    deleteVideo(deleteVideoElement);
    editVideoDetail(editVideoElement);
  });
});

async function changeVideoVisibility(publishVideoElement: HTMLButtonElement) {
  if (!publishVideoElement) return;
  const videoId = publishVideoElement.getAttribute("data-videoId");
  const visibility = publishVideoElement.getAttribute("data-visibility");
  if (!videoId) return;
  if (visibility === "published") {
    await unpublishVideo(videoId);
    publishVideoElement.innerHTML = "Make public";
    publishVideoElement.dataset.visibility = "unpublished";
  } else {
    await publishVideo(videoId);
    publishVideoElement.innerHTML = "Make private";
    publishVideoElement.dataset.visibility = "published";
  }
}

function deleteVideo(deleteVideoElement: HTMLButtonElement) {
  const videoDeleteModalElement = document.getElementById("video-delete-modal") as HTMLDivElement;
  const confirmVideoDeleteElement = document.getElementById("video-deletion") as HTMLButtonElement;
  const deleteVideoOverylayElement = document.getElementById("modal-overlay") as HTMLDivElement;
  const cancelVideoDeletionElement = document.getElementById("cancel-video-deletion") as HTMLButtonElement;

  if (!deleteVideoElement) return;
  videoDeleteModalElement.classList.remove("hidden");
  deleteVideoOverylayElement.classList.remove("hidden");

  const videoId = deleteVideoElement.getAttribute("data-videoId");
  if (videoId) {
    confirmVideoDeleteElement.addEventListener("click", async () => {
      await deleteVideoById(videoId);
      toggleDeletionModal();
      renderVideos(page);
    });
  }

  cancelVideoDeletionElement.addEventListener("click", () => {
    toggleDeletionModal();
  });

  deleteVideoOverylayElement.addEventListener("click", () => {
    toggleDeletionModal();
  });

  function toggleDeletionModal() {
    deleteVideoOverylayElement.classList.add("hidden");
    videoDeleteModalElement.classList.add("hidden");
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      toggleDeletionModal();
    }
  });
}

async function renderVideos(page: number) {
  const myVideosContainerElement = document.getElementById("myvideo-container") as HTMLDivElement;
  myVideosContainerElement.innerHTML = myVideoSkeletonHTML();

  const response: any = await getMyVideos(page);
  totalVideos = response.totalVideos;
  if (!response.videos.length) {
    myVideosContainerElement.innerHTML = "No, videos found!";
    return;
  }
  const videosHTML = response.videos.map((video: any) => MyVideoCard(video)).join("");
  myVideosContainerElement.innerHTML = videosHTML;
}

async function editVideoDetail(editVideoElement: HTMLButtonElement) {
  const titleInputElement = document.getElementById("title") as HTMLInputElement;
  const editFormElement = document.getElementById("edit-video-form") as HTMLFormElement;
  const descriptionElement = document.getElementById("description") as HTMLInputElement;
  const thumbnailElement = document.getElementById("thumbnail-upload") as HTMLInputElement;
  const videoEditModalElement = document.getElementById("video-edit-modal") as HTMLDivElement;
  const spinnerElement = document.getElementById("edit-thumbnail-spinner") as HTMLSpanElement;
  const deleteVideoOverylayElement = document.getElementById("modal-overlay") as HTMLDivElement;
  const messageElement = document.getElementById("edit-thumbnail-message") as HTMLParagraphElement;
  const thumbnailFileNameElement = document.getElementById("thumbnail-filename") as HTMLParagraphElement;

  if (!editVideoElement) return;
  videoEditModalElement.classList.remove("hidden");
  deleteVideoOverylayElement.classList.remove("hidden");

  const videoId = editVideoElement.getAttribute("data-videoId");
  if (videoId) {
    try {
      const videoDetail = await fetchVideoById(videoId);
      titleInputElement.value = videoDetail.title;
      descriptionElement.value = videoDetail.description;
      editFormElement.addEventListener("submit", async (event) => {
        event.preventDefault();
        spinnerStart(spinnerElement);
        editFormElement.classList.add("opacity-50");
        const formData = new FormData(editFormElement);
        await editVideoDetails(videoId, formData);
        spinnerStop(spinnerElement);
        editFormElement.classList.remove("opacity-50");
        renderVideos(page);
        toggleEditModal();
      });
    } catch (error) {
      spinnerStop(spinnerElement);
      editFormElement.classList.remove("opacity-50");
      messageElement.classList.add("text-red-500");
      messageElement.innerHTML = "Fail to update video detail";
    }
  }

  deleteVideoOverylayElement.addEventListener("click", () => {
    toggleEditModal();
  });

  function toggleEditModal() {
    deleteVideoOverylayElement.classList.add("hidden");
    videoEditModalElement.classList.add("hidden");
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      toggleEditModal();
    }
  });

  thumbnailElement.addEventListener("change", (e: Event) => {
    const target = e.target as HTMLInputElement;
    if (thumbnailFileNameElement) {
      thumbnailFileNameElement.textContent = target.files?.[0]?.name || "";
    }
  });
}
