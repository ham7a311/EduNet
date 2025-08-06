import React from "react";
import { PencilIcon, TrashIcon, EllipsisHorizontalIcon } from "@heroicons/react/24/solid";

export default function CommentSection({
  postId,
  comments,
  showComments,
  openDropdowns,
  toggleDropdown,
  handleCommentSubmit,
  handleCommentChange,
  commentText,
  editComment,
  handleEditComment,
  setShowCommentDeleteConfirm,
  userId,
  t,
  closeAllDropdowns, // Kept because it’s used in the delete button handler
}) {
  if (!showComments) return null;

  const postComments = comments || [];

  return (
    <div className="mt-4 border-t pt-4">
      {postComments.length > 0 && (
        <div className="space-y-3 mb-4">
          {postComments.map((comment) => (
            <div key={comment.id} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 relative">
              <div className="flex justify-between items-start mb-1">
                <div className="flex-1">
                  <span className="font-semibold text-xs sm:text-sm text-indigo-600">
                    {comment.authorName}
                  </span>
                  <span className="text-xs text-gray-500 ml-2">
                    {comment.createdAt?.toDate?.()?.toLocaleString() || t("feed.just_now")}{" "}
                    {comment.editedAt && ` ${t("feed.edited")}`}
                  </span>
                </div>
                {comment.authorId === userId && (
                  <div className="dropdown-container relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleDropdown(comment.id);
                      }}
                      className="p-1 text-gray-400 hover:text-gray-600 focus:outline-none rounded"
                      aria-label={t("feed.comment_options")}
                    >
                      <EllipsisHorizontalIcon className="h-5 w-5" />
                    </button>
                    {openDropdowns.has(comment.id) && (
                      <div className="absolute right-0 top-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditComment(comment, postId);
                          }}
                          className="flex items-center gap-2 w-full px-4 py-2 text-xs sm:text-sm text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-t-lg transition-colors"
                        >
                          <PencilIcon className="h-4 w-4" />
                          {t("settings.buttons.edit")}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowCommentDeleteConfirm(comment.id);
                            closeAllDropdowns();
                          }}
                          className="flex items-center gap-2 w-full px-4 py-2 text-xs sm:text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-b-lg transition-colors"
                        >
                          <TrashIcon className="h-4 w-4" />
                          {t("feed.delete_comment.confirm")}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">{comment.content}</p>
            </div>
          ))}
        </div>
      )}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder={
            editComment ? t("feed.comment_placeholder.edit") : t("feed.comment_placeholder.write")
          }
          value={commentText || ""}
          onChange={(e) => handleCommentChange(postId, e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleCommentSubmit(postId);
            }
          }}
          className="flex-1 text-xs sm:text-sm p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600"
          maxLength={500}
        />
        <button
          onClick={() => handleCommentSubmit(postId)}
          disabled={!commentText?.trim()}
          className="px-3 py-2 bg-black text-white text-xs sm:text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {editComment ? t("feed.update_button") : t("feed.post_button")}
        </button>
      </div>
    </div>
  );
}