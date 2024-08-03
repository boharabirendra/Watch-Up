import { mustLoginMessage } from "../../utils/common";
import { getLikeStatus, updateLikeCount } from "./likes";

/**Like event section */
export const likesHandler = async () => {
    const likeButton = document.getElementById("likeButton") as HTMLButtonElement;
    const likePath = document.getElementById("likePath") as any;
    const likeCount = document.getElementById("likeCount") as HTMLSpanElement;
  
    const updateLikeUI = (liked: boolean) => {
      if (liked) {
        likePath.setAttribute("fill", "#065fd4");
        likePath.setAttribute("stroke", "#065fd4");
      } else {
        likePath.setAttribute("fill", "none");
        likePath.setAttribute("stroke", "currentColor");
      }
    };
    const searchParams = new URLSearchParams(window.location.search);
    const videoPublicId = searchParams.get("v");
  
    let isLiked: any;
    if (videoPublicId) {
      isLiked = await getLikeStatus(videoPublicId);
      updateLikeUI(isLiked ? true : false);
    }
  
    likeButton.addEventListener("click", async () => {
      if (!(await mustLoginMessage())) return;
      const searchParams = new URLSearchParams(window.location.search);
      const videoPublicId = searchParams.get("v");
      if (videoPublicId) {
        const response = await updateLikeCount(videoPublicId);
        updateLikeUI(response.liked);
        likeCount.innerHTML = response.likes;
      }
      likeButton.classList.add("scale-110");
      setTimeout(() => {
        likeButton.classList.remove("scale-110");
      }, 200);
    });
  };