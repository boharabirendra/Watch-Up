import api from "../../utils/axiosInerceptor";
import { isUserValid } from "../../utils/routeProtector";

document.addEventListener("DOMContentLoaded", () => {
  const newPasswordElement = document.getElementById("new-password") as HTMLInputElement;
  const confirmPasswordElement = document.getElementById("confirm-password") as HTMLInputElement;
  const changePasswordFormElement = document.getElementById("change-password-form") as HTMLFormElement;
  const changePasswordMessageElement = document.getElementById("change-password-message") as HTMLParagraphElement;

  changePasswordFormElement.addEventListener("submit", async (event) => {
    event.preventDefault();
    const newPassword = newPasswordElement.value.trim();
    const confirmPassword = confirmPasswordElement.value.trim();

    if (newPassword !== confirmPassword) {
      changePasswordMessageElement.classList.remove("hidden");
      changePasswordMessageElement.classList.add("text-red-600");
      changePasswordMessageElement.innerHTML = "New password & confirm password must be same";
      setTimeout(() => {
        changePasswordMessageElement.classList.add("hidden");
      }, 3000);
      return;
    }
    const formData = new FormData(changePasswordFormElement);
    try {
      await api.put(`/users/change-password`, formData);
      changePasswordMessageElement.classList.remove("hidden");
      changePasswordMessageElement.classList.add("text-green-500");
      changePasswordMessageElement.classList.remove("text-red-600");
      changePasswordMessageElement.innerHTML = "Password changed successfully.";
      changePasswordFormElement.reset();
    } catch (error: any) {
      console.log(error);
      changePasswordMessageElement.innerHTML = error.response.data.message;
    } finally {
      setTimeout(() => {
        changePasswordMessageElement.classList.add("hidden");
      }, 3000);
    }
  });
});

await isUserValid();
