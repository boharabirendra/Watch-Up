import axios from "axios";
import { BASE_URL } from "../../constants/constants";
import { spinnerStart, spinnerStop } from "../../utils/common";

document.addEventListener("DOMContentLoaded", () => {
  const spinnerEl = document.getElementById("login-spinner") as HTMLSpanElement;
  const loginFormElement = document.getElementById("loginForm") as HTMLFormElement;
  const mainContainerElement = document.getElementById("main-container") as HTMLDivElement;
  const loginErrorElement = document.getElementById("login-error") as HTMLParagraphElement;

  loginFormElement.addEventListener("submit", async (event) => {
    event.preventDefault();
    spinnerStart(spinnerEl);
    mainContainerElement.classList.add("opacity-50");
    try {
      const formData = new FormData(loginFormElement);
      const response = await axios.post(`${BASE_URL}/users/login`, formData);
      const { accessToken, refreshToken } = response.data.data;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      window.location.href = "/";
    } catch (error: any) {
      loginErrorElement.innerHTML = error.response.data.message;
      loginErrorElement.classList.remove("hidden");
      mainContainerElement.classList.remove("opacity-50");
      setTimeout(() => {
        loginErrorElement.innerHTML = "";
        loginErrorElement.classList.add("hidden");
      }, 2000);
      console.error("Error during login:", error.response.data.message);
    } finally {
      spinnerStop(spinnerEl);
    }
  });
});
