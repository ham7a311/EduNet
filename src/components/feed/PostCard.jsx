import React from "react";
import {
  HeartIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  EllipsisHorizontalIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import CommentSection from "./CommentSection";

export default function PostCard({
  post,
  comments,
  showComments,
  openDropdowns,
  toggleComments,
  toggleDropdown,
  handleLike,
  handleEditPost,
  setShowDeleteConfirm,
  closeAllDropdowns, // Ensure this prop is received
  handleCommentSubmit,
  handleCommentChange,
  commentText,
  editComment,
  handleEditComment,
  setShowCommentDeleteConfirm,
  handleDeleteComment,
  userId,
  t,
}) {
  const hasLiked = post.likedBy?.includes(userId) || false; // Handle undefined likedBy
  const isAuthor = post.authorId === userId;

  return (
    <article
      key={post.id}
      className="bg-white shadow rounded-lg p-4 dark:bg-gray-900 transition-shadow hover:shadow-md relative"
    >
      <header className="mb-3 flex justify-between items-start">
        <div className="flex-1">
          <h3 className="font-bold text-sm sm:text-base xs:text-lg text-indigo-600">
            {post.name}{" "}
            {post.university && <span className="text-gray-500 font-normal"> - {post.university}</span>}
          </h3>
          <span className="text-xs text-gray-500">
            {post.createdAt?.toDate?.()?.toLocaleString() || t("feed.just_now")}{" "}
            {post.editedAt && ` ${t("feed.edited")}`}
          </span>
        </div>
        {isAuthor && (
          <div className="dropdown-container relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleDropdown(post.id);
              }}
              className="p-1 text-gray-400 hover:text-gray-600 focus:outline-none rounded"
              aria-label={t("feed.post_options")}
            >
              <EllipsisHorizontalIcon className="h-5 w-5" />
            </button>
            {openDropdowns.has(post.id) && (
              <div className="absolute right-0 top-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditPost(post);
                  }}
                  className="flex items-center gap-2 w-full px-4 py-2 text-xs sm:text-sm text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-t-lg transition-colors"
                >
                  <PencilIcon className="h-4 w-4" />
                  {t("settings.buttons.edit")}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDeleteConfirm(post.id);
                    closeAllDropdowns();
                  }}
                  className="flex items-center gap-2 w-full px-4 py-2 text-xs sm:text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-b-lg transition-colors"
                >
                  <TrashIcon className="h-4 w-4" />
                  {t("feed.delete_post.confirm")}
                </button>
              </div>
            )}
          </div>
        )}
      </header>
      {post.content && (
        <p className="text-gray-700 dark:text-gray-300 mt-2 whitespace-pre-wrap text-sm sm:text-base">
          {post.content}
        </p>
      )}
      {post.mediaUrl && (
        <div className="mt-3">
          {/\.(mp4|webm|ogg)$/i.test(post.mediaUrl) ? (
            <video
              controls
              className="w-full rounded-lg max-h-48 sm:max-h-60"
              preload="metadata"
            >
              <source src={post.mediaUrl} type="video/mp4" />
              {t("feed.video_unsupported")}
            </video>
          ) : (
            <img
              src={post.mediaUrl}
              alt={t("feed.post_media")}
              className="w-full rounded-lg object-cover max-h-48 sm:max-h-60"
              loading="lazy"
            />
          )}
        </div>
      )}
      <footer className="flex items-center gap-4 mt-4 text-gray-600 dark:text-gray-400">
        <button
          onClick={() => handleLike(post.id)}
          className={`flex items-center gap-1 transition-colors focus:outline-none rounded p-1 ${
            hasLiked ? "text-red-600 hover:text-red-700" : "hover:text-indigo-600 cursor-pointer"
          }`}
          title={hasLiked ? t("feed.like_button.unlike") : t("feed.like_button.like")}
          aria-label={t("feed.like_button.aria_label", {
            action: hasLiked ? t("feed.like_button.unlike") : t("feed.like_button.like"),
            count: post.likes || 0,
          })}
        >
          <HeartIcon className="h-5 w-5" />
          <span className="text-sm">{post.likes || 0}</span>
        </button>
        <button
          onClick={() => toggleComments(post.id)}
          className="flex items-center gap-1 hover:text-black transition-colors focus:outline-none rounded p-1"
          aria-label={t("feed.comments_label", { count: comments.length })}
        >
          <ChatBubbleOvalLeftEllipsisIcon className="h-5 w-5" />
          <span className="text-sm">{comments.length}</span>
        </button>
      </footer>
      {showComments && (
        <CommentSection
          postId={post.id}
          comments={comments}
          showComments={showComments}
          toggleComments={toggleComments}
          openDropdowns={openDropdowns}
          toggleDropdown={toggleDropdown}
          handleCommentSubmit={handleCommentSubmit}
          handleCommentChange={handleCommentChange}
          commentText={commentText}
          editComment={editComment}
          handleEditComment={handleEditComment}
          setShowCommentDeleteConfirm={setShowCommentDeleteConfirm}
          handleDeleteComment={handleDeleteComment}
          userId={userId}
          t={t}
          closeAllDropdowns={closeAllDropdowns} // Pass the prop here
        />
      )}
    </article>
  );
}