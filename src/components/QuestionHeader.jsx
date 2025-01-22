import React from "react";

export const QuestionHeader = React.memo(
  ({ questionNumber, isStarred, onToggleStar }) => (
    <div className="flex justify-between items-center mb-4">
      <div className="flex items-center gap-4">
        <span className="text-lg font-semibold">Question {questionNumber}</span>
        <button
          onClick={onToggleStar}
          className={`p-2 rounded-full transition-all duration-200
          ${
            isStarred
              ? "text-yellow-400 hover:text-yellow-500"
              : "text-gray-400 hover:text-yellow-400"
          }`}
        >
          {isStarred ? "★" : "☆"}
        </button>
      </div>
    </div>
  )
);
