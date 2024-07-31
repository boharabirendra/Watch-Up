import { isUserAuthenticated } from "./verifyUser";

export function spinnerStart(spinner: HTMLSpanElement) {
  spinner.classList.remove("hidden");
}

export function spinnerStop(spinner: HTMLSpanElement) {
  spinner.classList.add("hidden");
}


export const mustLoginMessage = async() =>{
  const isUserLoggedIn = await isUserAuthenticated();
  if (!isUserLoggedIn) {
    const likeLoginMessage = document.getElementById(
      "must-login-message"
    ) as HTMLDivElement;
    likeLoginMessage.classList.remove("hidden");
    setTimeout(() => {
      likeLoginMessage.classList.add("hidden");
    }, 1000);
  }
  return isUserLoggedIn;
}