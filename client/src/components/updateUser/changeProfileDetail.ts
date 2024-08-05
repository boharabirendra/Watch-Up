import { getUser } from "../../utils/getUser";
import api from "../../utils/axiosInerceptor";
import { isUserValid } from "../../utils/routeProtector";
import { DEFAULT_IMAGE_URL } from "../constants/constants";
import { spinnerStart, spinnerStop } from "../../utils/common";

document.addEventListener("DOMContentLoaded", async () => {
  const changeProfileFullNameElement = document.getElementById("fullname") as HTMLInputElement;
  const changeProfilePictureElement = document.getElementById("profile-picture") as HTMLInputElement;
  const changeProfilePreviewElement = document.getElementById("profile-preview") as HTMLImageElement;
  const changeProfileFormElement = document.getElementById("update-profile-form") as HTMLFormElement;
  const changeProfileMessageElement = document.getElementById("update-profile-message") as HTMLDivElement;
  const changeProfileSpinnerElement = document.getElementById("profile-change-spinner") as HTMLSpanElement;
  const changeProfileUpdateAccountBtnElement = document.getElementById("update-account-btn") as HTMLButtonElement;

  changeProfileFullNameElement.addEventListener("focus", () => {
    changeUpdateAccountUI();
  });

  changeProfilePictureElement.addEventListener("change", () => {
    changeUpdateAccountUI();
  });

  try {
    const user = await getUser();
    changeProfileFullNameElement.value = user.fullName;
    changeProfilePreviewElement.src = user.profileUrl || DEFAULT_IMAGE_URL;

    changeProfileFormElement.addEventListener("submit", async (event) => {
      event.preventDefault();
      spinnerStart(changeProfileSpinnerElement);
      changeProfileFormElement.classList.add("opacity-25");

      const formData = new FormData(changeProfileFormElement);
      await api.put(`/users/update-user`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      showUpdateMessage(true);
    });
  } catch (error) {
    console.log(error);
    showUpdateMessage(false, error);
  }

  function changeUpdateAccountUI() {
    changeProfileUpdateAccountBtnElement.disabled = false;
    changeProfileUpdateAccountBtnElement.classList.add("bg-indigo-500");
    changeProfileUpdateAccountBtnElement.classList.remove("bg-gray-300");
    changeProfileUpdateAccountBtnElement.classList.remove("cursor-not-allowed");
  }

  changeProfilePictureElement.addEventListener("change", (event: Event): void => {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files[0]) {
      const reader = new FileReader();

      reader.onload = function (e: ProgressEvent<FileReader>) {
        if (e.target && typeof e.target.result === "string") {
          changeProfilePreviewElement.src = e.target.result;
        }
      };
      reader.readAsDataURL(target.files[0]);
    }
  });

  function showUpdateMessage(success: boolean, error?: any) {
    if (success) {
      changeProfileFormElement.reset();
      spinnerStop(changeProfileSpinnerElement);
      changeProfileFormElement.classList.remove("opacity-25");
      changeProfileMessageElement.classList.add("text-green-600");
      changeProfileMessageElement.innerHTML = "Profile updated successfully.";
    } else {
      changeProfileMessageElement.classList.add("text-red-600");
      changeProfileFormElement.innerHTML = error.response.data.message;
    }
  }
});

await isUserValid();
