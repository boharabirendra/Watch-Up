import axios from "axios";
import { BASE_URL } from "../../constants/constants";
import { spinnerStart, spinnerStop } from "../../utils/common";

document.addEventListener("DOMContentLoaded", () => {
  const signupFormElement = document.getElementById("signupForm") as HTMLFormElement;
  const mainContainerElement = document.getElementById("main-container") as HTMLDivElement;
  const signupSpinnerElement = document.getElementById("signup__spinner") as HTMLSpanElement;
  const signupMessageElement = document.getElementById("signup-message") as HTMLParagraphElement;

  signupFormElement.addEventListener("submit", async (event) => {
    event.preventDefault();
    mainContainerElement.classList.add("opacity-50");
    spinnerStart(signupSpinnerElement);
    try {
      const formData = new FormData(signupFormElement);
      await axios.post(`${BASE_URL}/users/register`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      showSignupMessage(true, "");
    } catch (error: any) {
      console.error("Error during signup:", error);
      showSignupMessage(false, error);
    } finally {
      spinnerStop(signupSpinnerElement);
    }
  });

  const profileInputElement = document.getElementById("profile") as HTMLInputElement;
  const profileFileNameElement = document.getElementById("profileFileName");

  profileInputElement.addEventListener("change", (e: Event) => {
    const target = e.target as HTMLInputElement;
    if (profileFileNameElement) {
      profileFileNameElement.textContent = target.files?.[0]?.name || "";
    }
  });

  const showSignupMessage = (success: boolean, error: any) => {
    signupMessageElement.classList.remove("hidden");
    mainContainerElement.classList.remove("opacity-50");
    signupMessageElement.classList.remove("text-red-600");
    signupMessageElement.classList.add("text-green-600");
    if (success) {
      signupMessageElement.innerHTML = `User registered successfully, 
       Redirecting to login ...
      `;
      signupMessageElement.classList.add("text-green-600");
      setTimeout(() => {
        window.location.href = "../login/login.html";
      }, 2000);
    } else {
      signupMessageElement.classList.add("text-red-600");
      signupMessageElement.innerHTML = error.response.data.message;
    }
  };
});
