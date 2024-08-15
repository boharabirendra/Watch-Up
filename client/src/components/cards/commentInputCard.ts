export const CommentInputCard = () => `
  <div class="mt-8 flex gap-4">
    <div>
      <img
        src="${localStorage.getItem("profileUrl") || "./public/sample.jpeg"}"
        class="w-8 rounded-full"
        alt="user"
      />
    </div>
    <div id="comment-item" class="w-full">
      <div class="w-full">
        <textarea
          id="comment-input-box"
          placeholder="Add a comment"
          class="outline-none border-b-[1px] w-full bg-transparent border-gray-600 text-sm mb-2 resize-none"
        ></textarea>
        <div id="add-comment" class="hidden">
          <div class="flex justify-end gap-2 items-center">
            <p id="comment-message"></p>
            <button
              id="cancel-comment"
              class="text-gray-500 px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              id="submit-comment"
              class="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-600 transition-colors"
            >
              Comment
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
`;
