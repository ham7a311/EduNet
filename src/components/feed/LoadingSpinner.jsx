import React from "react";

export default function LoadingSpinner({ message }) {
  return (
    <div className="max-w-full sm:max-w-2xl mx-auto p-4">
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        <span className="ml-3 text-gray-600">{message}</span>
      </div>
    </div>
  );
}