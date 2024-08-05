import { mustLoginMessage } from "../../utils/common";
import { CommentInfoCard } from "../cards/commentInfoCard";
import { EditTextareaCard } from "../cards/editTextAreaCard";
import { createComment, deleteComment, getComments, updateComment } from "./comment";

export const handleComment = () => {
  // Get elements
  const addCommentElement = document.getElementById("add-comment") as HTMLDivElement;
  const cancelCommentElement = document.getElementById("cancel-comment") as HTMLButtonElement;
  const submitCommentElement = document.getElementById("submit-comment") as HTMLButtonElement;
  const commentMessageElement = document.getElementById("comment-message") as HTMLParagraphElement;
  const commentInputBoxElement = document.getElementById("comment-input-box") as HTMLTextAreaElement;
  const commentsContainerElement = document.getElementById("video-comment-container") as HTMLDivElement;

  submitCommentElement.removeEventListener("click", handleSubmitComment);

  async function handleSubmitComment() {
    if (!(await mustLoginMessage())) return;
    const formData = new FormData();
    const urlParams = new URLSearchParams(window.location.search);
    const videoId = urlParams.get("videoId")!;
    const comment = commentInputBoxElement.value.trim();
    if (comment === "") return;
    formData.append("text", comment);
    formData.append("videoId", videoId);
    try {
      await createComment(formData);
      commentMessageElement.classList.add("text-green-500");
      commentMessageElement.innerHTML = "Comment added successfully";
      commentInputBoxElement.value = "";

      // Rerender comments after comment is added
      setTimeout(async () => {
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
      }, 3000);
    }
  }

  submitCommentElement.addEventListener("click", handleSubmitComment);

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

  updateSubmitButtonState();
};

/**Comment deletion */
export const handleCommentDeletion = () => {
  const commentDeleteModalElement = document.getElementById("comment-delete-modal") as HTMLDivElement;
  const confirmCommentDeleteElement = document.getElementById("comment-deletion") as HTMLButtonElement;
  const deleteCommentOverylayElement = document.getElementById("delete-modal-overlay") as HTMLDivElement;
  const alterCommentContainerElement = document.getElementById("video-comment-container") as HTMLDivElement;
  const cancelCommentDeletionElement = document.getElementById("cancel-comment-deletion") as HTMLButtonElement;

  let currentCommentId: string | null = null;
  confirmCommentDeleteElement.removeEventListener("click", handleDeleteClick);
  async function handleDeleteClick() {
    if (currentCommentId) {
      try {
        console.log({ currentCommentId });
        await deleteComment(currentCommentId);
        await reRenderComments();
        toggleDeletionModal();
      } catch (error) {
        console.log(error);
      }
    }
  }

  alterCommentContainerElement.addEventListener("click", (event) => {
    const commentItem = (event.target as HTMLElement).closest("#delete-comment");
    if (commentItem) {
      commentDeleteModalElement.classList.remove("hidden");
      deleteCommentOverylayElement.classList.remove("hidden");
      currentCommentId = commentItem.getAttribute("data-commentId");
    }
  });

  confirmCommentDeleteElement.addEventListener("click", handleDeleteClick);

  cancelCommentDeletionElement.addEventListener("click", toggleDeletionModal);

  deleteCommentOverylayElement.addEventListener("click", toggleDeletionModal);

  function toggleDeletionModal() {
    deleteCommentOverylayElement.classList.add("hidden");
    commentDeleteModalElement.classList.add("hidden");
    currentCommentId = null;
  }
};

/**Comment edition */
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

          commentEditTextAreaElement.addEventListener("input", () => {
            if (commentEditTextAreaElement.value.trim() === "") {
              commentSaveElement.disabled = true;
              commentSaveElement.classList.add("opacity-50", "cursor-not-allowed");
            } else {
              commentSaveElement.disabled = false;
              commentSaveElement.classList.remove("opacity-50", "cursor-not-allowed");
            }
          });

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
  handleComment();
  handleCommentDeletion();
  handleCommentEdit();
};
