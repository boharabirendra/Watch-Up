import axios from "axios";
import { BASE_URL } from "./constants/constants";
import { mustLoginMessage } from "./utils/common";
import { CommentInfoCard } from "./components/cards/commentInfoCard";
import { EditTextareaCard } from "./components/cards/editTextAreaCard";
import { getLikeStatus, updateLikeCount } from "./components/likes/likes";
import { deleteComment, getComments, updateComment } from "./components/comments/comment";

/**Comment event section */
export const handleComment = () => {
  // Get elements
  const addCommentElement = document.getElementById("add-comment") as HTMLDivElement;
  const cancelCommentElement = document.getElementById("cancel-comment") as HTMLButtonElement;
  const submitCommentElement = document.getElementById("submit-comment") as HTMLButtonElement;
  const commentMessageElement = document.getElementById("comment-message") as HTMLParagraphElement;
  const commentInputBoxElement = document.getElementById("comment-input-box") as HTMLTextAreaElement;

  const updateSubmitButtonState = () => {
    const isEmpty = commentInputBoxElement.value.trim() === "";
    submitCommentElement.disabled = isEmpty;
    if (isEmpty) {
      submitCommentElement.classList.remove("bg-blue-800", "hover:bg-blue-600");
      submitCommentElement.classList.add("bg-gray-400", "text-gray-500", "cursor-not-allowed");
    } else {
      submitCommentElement.classList.add("bg-blue-800", "hover:bg-blue-600");
      submitCommentElement.classList.remove("bg-gray-400", "text-gray-500", "cursor-not-allowed");
    }
  };

  commentInputBoxElement.addEventListener("input", () => {
    addCommentElement.classList.remove("hidden");
    updateSubmitButtonState();
  });

  cancelCommentElement.addEventListener("click", () => {
    addCommentElement.classList.add("hidden");
    commentInputBoxElement.value = "";
    updateSubmitButtonState();
  });

  /**Create comment api call */
  submitCommentElement.addEventListener("click", async () => {
    if (!(await mustLoginMessage())) return;
    const formData = new FormData();
    const urlParams = new URLSearchParams(window.location.search);
    const videoId = urlParams.get("videoId")!;
    const comment = commentInputBoxElement.value.trim();
    if (comment === "") return;
    formData.append("text", comment);
    formData.append("videoId", videoId);
    try {
      await axios.post(`${BASE_URL}/comments/create-comment`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      commentMessageElement.classList.add("text-green-500");
      commentMessageElement.innerHTML = "Comment added successfully";
      commentInputBoxElement.value = "";

      /**Rerending comments after, comment add by user */
      setTimeout(async () => {
        const commentsContainerElement = document.getElementById("video-comment-container") as HTMLDivElement;
        const comments = await getComments(videoId);
        commentsContainerElement.innerHTML = CommentInfoCard(comments);
        handleComment();
      }, 1000);
    } catch (error: any) {
      commentMessageElement.classList.add("text-red-500");
      commentMessageElement.innerHTML = error.response.data.message;
    } finally {
      setTimeout(() => {
        commentMessageElement.innerHTML = "";
      }, 4000);
    }
  });
  updateSubmitButtonState();
};

/**Comment deletion */
export const handleCommentDeletion = () => {

  const commentDeleteModalElement = document.getElementById("comment-delete-modal") as HTMLDivElement;
  const confirmCommentDeleteElement = document.getElementById("comment-deletion") as HTMLButtonElement;
  const deleteCommentOverylayElement = document.getElementById("delete-modal-overlay") as HTMLDivElement;
  const alterCommentContainerElement = document.getElementById("video-comment-container") as HTMLDivElement;
  const cancelCommentDeletionElement = document.getElementById("cancel-comment-deletion") as HTMLButtonElement;
  
  alterCommentContainerElement.addEventListener("click", async (event) => {
    const commentItem = (event.target as HTMLElement).closest("#delete-comment");
    if (commentItem) {
      commentDeleteModalElement.classList.remove("hidden");
      deleteCommentOverylayElement.classList.remove("hidden");
      const commentId = commentItem.getAttribute("data-commentId");
      if (commentId) {
        try {
          confirmCommentDeleteElement.addEventListener("click", async () => {
            await deleteComment(commentId);
            await reRenderComments();
            commentDeleteModalElement.classList.add("hidden");
            deleteCommentOverylayElement.classList.add("hidden");
          });
        } catch (error) {
          console.log(error);
        }
      }
    }
  });

  cancelCommentDeletionElement.addEventListener("click", () => {
    toggleDeletionModal();
  });

  deleteCommentOverylayElement.addEventListener("click", ()=>{
    toggleDeletionModal();
  })

  function toggleDeletionModal() {
    deleteCommentOverylayElement.classList.add("hidden");
    commentDeleteModalElement.classList.add("hidden");
  }
};

/**Comment deletion */
export const handleCommentEdit = () => {

  const alterCommentContainerElement = document.getElementById("video-comment-container") as HTMLDivElement;

  alterCommentContainerElement.addEventListener("click", async (event) => {
    const commentEditElement = (event.target as HTMLElement).closest("#comment-edit");
    if (commentEditElement) {
      const commentId = commentEditElement.getAttribute("data-commentId");
      const commentDetailElement = (event.target as HTMLElement).closest("#comment-detail-container");
      if (commentDetailElement && commentId) {
        const commentTextElement = commentDetailElement.querySelector("#comment-text") as HTMLParagraphElement;
        if (commentTextElement) {
          commentDetailElement.innerHTML = EditTextareaCard(commentTextElement.innerText.trim());

          /**get elements */
          const commentSaveElement = document.getElementById("edit-save-comment") as HTMLButtonElement;
          const cancelCommentEditElement = document.getElementById("edit-cancel-comment") as HTMLButtonElement;
          const commentEditTextAreaElement = document.getElementById("edit-comment-input-box") as HTMLTextAreaElement;
          commentEditTextAreaElement.focus();
          
          cancelCommentEditElement.addEventListener("click", () => {
            reRenderComments();
          });

          commentSaveElement.addEventListener("click", async () => {
            const updatedCommentText = commentEditTextAreaElement.value.trim();
            await updateComment(commentId, updatedCommentText);
            await reRenderComments();
          });
        }
      }
    }
  });
};

/**Rerender comments */
export const reRenderComments = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const videoId = urlParams.get("videoId")!;
  const commentsContainerElement = document.getElementById("video-comment-container") as HTMLDivElement;
  const comments = await getComments(videoId);
  commentsContainerElement.innerHTML = CommentInfoCard(comments);
  handleCommentDeletion();
  handleComment();
};

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

document.addEventListener("DOMContentLoaded", () => {
  const sidebar = document.getElementById("sidebar") as HTMLDivElement;
  const overlay = document.getElementById("overlay") as HTMLDivElement;
  const sidebarToggle = document.getElementById("sidebar-toggle") as HTMLButtonElement;

  sidebarToggle.addEventListener("click", toggleSidebar);
  overlay.addEventListener("click", toggleSidebar);

  function toggleSidebar() {
    sidebar.classList.toggle("-translate-x-full");
    overlay.classList.toggle("hidden");
  }
});
