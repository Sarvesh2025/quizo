import React from "react";

export const NavigationButtons = React.memo(
  ({ currentIndex, totalQuestions, onPrevious, onNext }) => (
    <div className="flex justify-between items-center">
      <button
        onClick={onPrevious}
        disabled={currentIndex === 0}
        className="px-6 py-3 bg-indigo-600 text-white rounded-lg disabled:opacity-50 
        disabled:cursor-not-allowed hover:bg-indigo-700 transition-all duration-200"
      >
        Previous
      </button>
      <button
        onClick={onNext}
        disabled={currentIndex === totalQuestions - 1}
        className="px-6 py-3 bg-indigo-600 text-white rounded-lg disabled:opacity-50 
        disabled:cursor-not-allowed hover:bg-indigo-700 transition-all duration-200"
      >
        Next
      </button>
    </div>
  )
);
