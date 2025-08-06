import React from "react";

export default function SortDropdown({ sortBy, setSortBy, t }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{t("feed.sort_by")}</span>
      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        className="text-xs sm:text-sm p-2 border rounded-lg focus:outline-none dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600"
      >
        <option value="likes">{t("feed.sort_likes")}</option>
        <option value="comments">{t("feed.sort_comments")}</option>
      </select>
    </div>
  );
}