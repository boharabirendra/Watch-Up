export const EditTextareaCard = (prevComment: string) => `
    <div class="w-full text-white">
      <textarea
        id="edit-comment-input-box"
        focus
        class="outline-none border-b-[1px] w-full bg-transparent border-gray-600 text-sm mb-2 resize-none"
      >${prevComment}</textarea>
      <div id="edit-comment">
        <div class="flex justify-end gap-2 items-center">
          <button
            id="edit-cancel-comment"
            class="text-gray-500 px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            id="edit-save-comment"
            class="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-600 transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
`;
