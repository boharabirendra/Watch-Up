import { ICommentCard } from "../../interface/commentCard";
import { timeAndDateFormater } from "../../utils/dateFormatter";
import { isCommentUpdatedChecker } from "../../utils/isCommentUpdated";
import { DEFAULT_IMAGE_URL } from "../constants/constants";

export const CommentCard = (comment: ICommentCard) => `
  <div class="mt-8 flex gap-4">
      <div>
        <img src="${comment.user.profileUrl || DEFAULT_IMAGE_URL}" class="h-8 w-8 rounded-full overflow-hidden object-cover" alt="user" />
      </div>
      <div id="comment-detail-container" class="w-full">
        <div class="flex gap-2 text-[12px] text-gray-100">
            <p>@${comment.user.email}</p>
            <p>${timeAndDateFormater(comment.createdAt)}</p>
            <p>${isCommentUpdatedChecker(comment.createdAt, comment.updatedAt) ? "(edited)" : ""}</p>
        </div>
        <p id="comment-text" class="line-clamp-2">${comment.text}</p>
        <div class="flex gap-3 text-[10px] mt-1 cursor-pointer">
          ${
            comment.owner
              ? `
          <div id="comment-edit" data-commentId="${comment.id}" class="bg-blue-600 hover:bg-blue-800 rounded-full px-2 py-1 flex gap-1 items-center">
              <svg class="w-3 h-3 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"/>
              </svg>
              <button>Edit</button>
          </div>
          <div id="delete-comment" data-commentId="${comment.id}" class="bg-red-600 hover:bg-red-800 rounded-full px-2 py-1 flex gap-1">
             <svg class="w-3 h-3 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
              <path fill-rule="evenodd" d="M8.586 2.586A2 2 0 0 1 10 2h4a2 2 0 0 1 2 2v2h3a1 1 0 1 1 0 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V8a1 1 0 0 1 0-2h3V4a2 2 0 0 1 .586-1.414ZM10 6h4V4h-4v2Zm1 4a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Zm4 0a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Z" clip-rule="evenodd"/>
            </svg>
             <button>Delete</button>`
              : ""
          }
          </div>
        </div>
      </div>
  </div>
`;
