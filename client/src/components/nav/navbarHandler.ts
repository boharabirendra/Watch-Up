import { getUser } from "../../utils/getUser";
import { logoutUser } from "../logout/logout";
import { DEFAULT_IMAGE_URL } from "../constants/constants";

/** Get elements */
const sidebarLoginElement = document.getElementById("sidebar-login") as HTMLLIElement;
const navbarProfileElement = document.getElementById("nav-profile") as HTMLImageElement;
const sidebarSignupElement = document.getElementById("sidebar-signup") as HTMLLIElement;
const sidebarUploadElement = document.getElementById("sidebar-upload") as HTMLLIElement;
const sidebarLogoutElement = document.getElementById("sidebar-logout") as HTMLDivElement;
const sidebarChangeProfileElement = document.getElementById("sidebar-change-profile") as HTMLLIElement;
const sidebarChangePasswordElement = document.getElementById("sidebar-change-password") as HTMLLIElement;

export const navbarHandler = async () => {
  try {
    const user = await getUser();
    if (user) {
      navbarProfileElement.src = user.profileUrl || DEFAULT_IMAGE_URL;
      localStorage.setItem("userId", user.id);
      localStorage.setItem("profileUrl", user.profileUrl);
      
      sidebarLoginElement.classList.add("hidden");
      sidebarSignupElement.classList.add("hidden");
    } else {
      sidebarUploadElement.classList.add("hidden");
      sidebarLogoutElement.classList.add("hidden");
      sidebarChangeProfileElement.classList.add("hidden");
      sidebarChangePasswordElement.classList.add("hidden");
    }
  } catch (error) {
    console.log(error);
  }
};

export const logoutHandler = () => {
  sidebarLogoutElement.addEventListener("click", async (event) => {
    event.preventDefault();
    try {
      await logoutUser();
      navbarHandler();
      window.location.href = "/";
    } catch (error) {
      console.error(error);
    }
  });
};
