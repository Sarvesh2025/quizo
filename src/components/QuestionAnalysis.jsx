import React from "react";

export const QuestionAnalysis = React.memo(
  ({ question, userAnswer, decodeHTML }) => {
    const getDifficultyColor = (difficulty) => {
      switch (difficulty.toLowerCase()) {
        case "easy":
          return "text-green-500";
        case "medium":
          return "text-yellow-500";
        case "hard":
          return "text-red-500";
        default:
          return "text-gray-500";
      }
    };

    const isCorrect = userAnswer?.answer === question.correct_answer;
    const status = !userAnswer
      ? "unattempted"
      : isCorrect
      ? "correct"
      : "incorrect";

    return (
      <div className="p-4 bg-white dark:bg-gray-700 rounded-lg shadow mb-4 last:mb-0">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Question {question.index + 1}
          </h3>
          <span
            className={`px-3 py-1 rounded-full text-sm ${
              status === "correct"
                ? "bg-green-100 text-green-700"
                : status === "incorrect"
                ? "bg-red-100 text-red-700"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        </div>
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          {decodeHTML(question.question)}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded">
            <p className="text-sm text-gray-500 mb-1">Your Answer:</p>
            <p
              className={`font-medium ${
                !userAnswer
                  ? "text-gray-400"
                  : isCorrect
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {userAnswer ? decodeHTML(userAnswer.answer) : "Not attempted"}
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded">
            <p className="text-sm text-gray-500 mb-1">Correct Answer:</p>
            <p className="font-medium text-green-600">
              {decodeHTML(question.correct_answer)}
            </p>
          </div>
        </div>
        <div className="flex gap-4 mt-3 text-sm">
          <span className={getDifficultyColor(question.difficulty)}>
            Difficulty: {question.difficulty}
          </span>
          <span className="text-gray-500">Category: {question.category}</span>
        </div>
      </div>
    );
  }
);
