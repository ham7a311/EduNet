import React from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";

export default function CreatePostModal({
  show,
  text,
  setText,
  handleFileChange,
  selectedFile,
  fileInputKey,
  showName,
  setShowName,
  showUniversity,
  setShowUniversity,
  handlePostSubmit,
  closeModal,
  loading,
  error,
  editPost,
  userName,
  university,
  t,
}) {
  if (!show) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4 py-6"
      onClick={(e) => e.target === e.currentTarget && closeModal()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="bg-white dark:bg-gray-900 rounded-lg p-4 sm:p-6 w-full max-w-sm sm:max-w-md mx-auto max-h-[85vh] overflow-y-auto shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 id="modal-title" className="text-base sm:text-lg font-bold text-indigo-600">
            {editPost ? t("feed.edit_post") : t("feed.create_post")}
          </h2>
          <button
            onClick={closeModal}
            className="text-gray-500 hover:text-gray-700 focus:outline-none rounded"
            aria-label={t("feed.close_modal")}
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        <div className="space-y-3">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t("feed.post_placeholder")}
            className="w-full text-xs sm:text-sm p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600"
            rows="4"
            style={{ resize: "none", minHeight: "80px" }}
            maxLength={1000}
          />
          <div>
            <input
              key={fileInputKey}
              type="file"
              accept="image/*,video/*"
              onChange={handleFileChange}
              className="w-full text-xs sm:text-sm p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600"
            />
            <p className="text-xs text-gray-500 mt-1">{t("feed.file_input_label")}</p>
          </div>
          {selectedFile && (
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded border">
              <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                {t("feed.selected_file", { name: selectedFile.name })}
              </p>
              <p className="text-xs text-gray-500">
                {t("feed.file_size", { size: (selectedFile.size / 1024 / 1024).toFixed(2) })}
              </p>
            </div>
          )}
          <div className="space-y-2 pt-2 border-t dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="showName"
                checked={showName}
                onChange={(e) => setShowName(e.target.checked)}
                className="h-5 w-5 text-black accent-black border-2 border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500 transition-colors cursor-pointer"
              />
              <label
                htmlFor="showName"
                className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
              >
                {t("feed.show_name_label", { name: userName || "Anonymous" })}
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="showUniversity"
                checked={showUniversity}
                onChange={(e) => setShowUniversity(e.target.checked)}
                className="h-5 w-5 text-black accent-black focus:ring-offset-0 border-2 border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500 transition-colors cursor-pointer"
              />
              <label
                htmlFor="showUniversity"
                className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
              >
                {t("feed.show_university_label", { university: university || "Anonymous" })}
              </label>
            </div>
          </div>
        </div>
        {error && (
          <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-red-700 text-xs sm:text-sm">
            {error}
          </div>
        )}
        <div className="flex justify-end gap-3 mt-4 sm:mt-6">
          <button
            onClick={closeModal}
            className="px-3 sm:px-4 py-2 text-gray-700 bg-transparent border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
            disabled={loading}
          >
            {t("feed.cancel_button")}
          </button>
          <button
            onClick={handlePostSubmit}
            className="px-3 sm:px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            disabled={loading || (!text.trim() && !selectedFile)}
          >
            {loading
              ? editPost
                ? t("feed.updating")
                : t("feed.posting")
              : editPost
              ? t("feed.update_button")
              : t("feed.post_button")}
          </button>
        </div>
      </div>
    </div>
  );
}