import { MyVideoCard } from "../cards/myvideosCard";
import { deleteVideoById, editVideoDetails, fetchVideoById, getMyVideos, publishVideo, unpublishVideo } from "./myvideos";

document.addEventListener("DOMContentLoaded", async () => {
  await renderVideos();

  const myVideosContainerElement = document.getElementById("myvideo-container") as HTMLDivElement;
  myVideosContainerElement.addEventListener("click", async (event) => {
    const publishVideoElement = (event.target as HTMLElement).closest("#publish-video") as HTMLButtonElement;
    const deleteVideoElement = (event.target as HTMLElement).closest("#delete-video") as HTMLButtonElement;
    const editVideoElement = (event.target as HTMLElement).closest("#edit-video") as HTMLButtonElement;
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
      renderVideos();
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

async function renderVideos() {
  const myVideosContainerElement = document.getElementById("myvideo-container") as HTMLDivElement;
  const myVideos: any = await getMyVideos();
  if (!myVideos.length) {
    myVideosContainerElement.innerHTML = "No, videos found!";
    return;
  }
  const videosHTML = myVideos.map((video: any) => MyVideoCard(video)).join("");
  myVideosContainerElement.innerHTML = videosHTML;
}

async function editVideoDetail(editVideoElement: HTMLButtonElement) {
  const titleInputElement = document.getElementById("title") as HTMLInputElement;
  const editFormElement = document.getElementById("edit-video-form") as HTMLFormElement;
  const descriptionElement = document.getElementById("description") as HTMLInputElement;
  const videoEditModalElement = document.getElementById("video-edit-modal") as HTMLDivElement;
  const deleteVideoOverylayElement = document.getElementById("modal-overlay") as HTMLDivElement;

  if (!editVideoElement) return;
  videoEditModalElement.classList.remove("hidden");
  deleteVideoOverylayElement.classList.remove("hidden");

  const videoId = editVideoElement.getAttribute("data-videoId");
  if (videoId) {
    console.log(videoId);
    const videoDetail = await fetchVideoById(videoId);
    titleInputElement.value = videoDetail.title;
    descriptionElement.value = videoDetail.description;
    editFormElement.addEventListener("submit", async (event) => {
      event.preventDefault();
      const formData = new FormData(editFormElement);
      await editVideoDetails(videoId, formData);
      location.reload();
      toggleEditModal();
    });
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
}
