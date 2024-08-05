import api from "../../utils/axiosInerceptor";
import { isUserLoggedIn } from "../../utils/routeProtector";
import { spinnerStart, spinnerStop } from "../../utils/common";

document.addEventListener("DOMContentLoaded", () => {
  const uploadSpinnerEl = document.getElementById("upload-spinner") as HTMLSpanElement;
  const uploadErrorEl = document.getElementById("upload-error") as HTMLParagraphElement;
  const uploadSuccessEl = document.getElementById("upload-success") as HTMLParagraphElement;
  const videoUploadFormEl = document.getElementById("videoUploadForm") as HTMLFormElement;

  videoUploadFormEl.addEventListener("submit", async (event) => {
    event.preventDefault();
    spinnerStart(uploadSpinnerEl);
    videoUploadFormEl.classList.add("opacity-50");
    const formData = new FormData(videoUploadFormEl);
    try {
      await api.post(`/videos/add-video`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      uploadSuccessEl.innerHTML = "Video uploaded successfully";
      setTimeout(() => {
        location.href = "../myvideos/myvideos.html";
      }, 2000);
    } catch (error: any) {
      console.log(error);
      uploadErrorEl.innerHTML = error.response.data.message;
    } finally {
      spinnerStop(uploadSpinnerEl);
      videoUploadFormEl.classList.remove("opacity-50");
    }
  });

  const videoFileNameElement = document.getElementById("videoFileName");
  const videoInput = document.getElementById("video") as HTMLInputElement;
  const thumbnailFileNameElement = document.getElementById("thumbnailFileName");
  const thumbnailInput = document.getElementById("thumbnail") as HTMLInputElement;

  videoInput.addEventListener("change", (e: Event) => {
    const target = e.target as HTMLInputElement;
    if (videoFileNameElement) {
      videoFileNameElement.textContent = target.files?.[0]?.name || "";
    }
  });

  thumbnailInput.addEventListener("change", (e: Event) => {
    const target = e.target as HTMLInputElement;
    if (thumbnailFileNameElement) {
      thumbnailFileNameElement.textContent = target.files?.[0]?.name || "";
    }
  });
});

await isUserLoggedIn();