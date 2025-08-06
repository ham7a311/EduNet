import React from "react";
import { TrashIcon } from "@heroicons/react/24/solid";

export default function DeleteConfirmation({
  show,
  onConfirm,
  onCancel,
  loading,
  title,
  message,
  confirmText,
  cancelText,
  t,
}) {
  if (!show) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4 py-6"
      onClick={(e) => e.target === e.currentTarget && onCancel()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
    >
      <div className="bg-white dark:bg-gray-900 rounded-lg p-4 sm:p-6 w-full max-w-sm mx-auto shadow-xl">
        <div className="flex items-center mb-4">
          <div className="flex-shrink-0 w-10 h-10 mx-auto bg-red-100 rounded-full flex items-center justify-center">
            <TrashIcon className="h-6 w-6 text-red-600" />
          </div>
        </div>
        <div className="text-center">
          <h3 id="delete-modal-title" className="text-base sm:text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            {title}
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-4 sm:mb-6">
            {message}
          </p>
        </div>
        <div className="flex gap-3 justify-center">
          <button
            onClick={onCancel}
            className="px-3 sm:px-4 py-2 text-gray-700 bg-transparent border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
            disabled={loading}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="px-3 sm:px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            disabled={loading}
          >
            {loading ? t("feed.deleting") : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}