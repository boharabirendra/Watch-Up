import axios from "axios";
import { BASE_URL } from "../../constants/constants";
import { spinnerStart, spinnerStop } from "../../utils/common";

document.addEventListener("DOMContentLoaded", () => {
  const uploadSpinnerEl = document.getElementById("upload__spinner") as HTMLSpanElement;
  const uploadErrorEl = document.getElementById("upload-error") as HTMLParagraphElement;
  const uploadSuccessEl = document.getElementById("upload-success") as HTMLParagraphElement;
  const videoUploadFormEl = document.getElementById("videoUploadForm") as HTMLFormElement;

  videoUploadFormEl.addEventListener("submit", async (event) => {
    event.preventDefault();
    spinnerStart(uploadSpinnerEl);
    videoUploadFormEl.classList.add("opacity-25");
    const formData = new FormData(videoUploadFormEl);
    try {
      await axios.post(`${BASE_URL}/videos/add-video`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
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
      videoUploadFormEl.classList.remove("opacity-25");
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
