import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, CheckCircle, XCircle, Award, BarChart2 } from "lucide-react";
import { Card } from "../components/Card";
import { PageLayout } from "../components/Layout";
import { StatCard } from "../components/StatCard";
import { decodeHTML, formatTime } from '../utils/utils';

const QuestionStatus = ({ status }) => {
  const statusStyles = {
    correct: "bg-green-100 text-green-700",
    incorrect: "bg-red-100 text-red-700",
    unattempted: "bg-gray-100 text-gray-700"
  };

  return (
    <span className={`px-3 py-1 rounded-full text-sm ${statusStyles[status]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const AnswerBox = ({ label, answer, isCorrect }) => (
//    Determine status hierarchy:
//  No answer = unattempted
//   Has answer + correct = correct
//     Has answer + incorrect = incorrect
  <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded">
    <p className="text-sm text-gray-500 mb-1">{label}:</p>
    <p className={`font-medium ${
      label === "Your Answer" 
        ? (!answer ? "text-gray-400" : isCorrect ? "text-green-600" : "text-red-600")
        : "text-green-600"
    }`}>
      {decodeHTML(answer || "Not attempted")}
    </p>
  </div>
);

const QuestionDifficulty = ({ difficulty, category }) => {
  const difficultyColors = {
    easy: "text-green-500",
    medium: "text-yellow-500",
    hard: "text-red-500"
  };

  return (
    <div className="flex gap-4 mt-3 text-sm">
      <span className={difficultyColors[difficulty.toLowerCase()]}>
        Difficulty: {difficulty}
      </span>
      <span className="text-gray-500">Category: {category}</span>
    </div>
  );
};
// green for easy
// yellow for medium
// red for hard

const QuestionCard = ({ index, question, userAnswer }) => {
  const isCorrect = userAnswer?.answer === question.correct_answer;
  const status = !userAnswer ? "unattempted" : isCorrect ? "correct" : "incorrect";

  return (
    <Card className="mb-4 last:mb-0">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          Question {index + 1}
        </h3>
        <QuestionStatus status={status} />
      </div>
      
      <p className="mb-4 text-gray-700 dark:text-gray-300">
        {decodeHTML(question.question)}
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnswerBox 
          label="Your Answer" 
          answer={userAnswer?.answer}
          isCorrect={isCorrect}
        />
        <AnswerBox 
          label="Correct Answer" 
          answer={question.correct_answer}
          isCorrect={true}
        />
      </div>
      
      <QuestionDifficulty 
        difficulty={question.difficulty}
        category={question.category}
      />
    </Card>
  );
};

const GradeHeader = ({grade }) => (
  <Card className="mb-6">
    <div className="flex items-center justify-between pb-2">
      <h1 className="text-2xl font-bold text-indigo-700 dark:text-indigo-300">
        Quiz Report
      </h1>
      <div className="flex items-center gap-2">
        <Award className="w-8 h-8 text-yellow-500" />
        <span className={`text-3xl font-bold ${grade.color}`}>
          {grade.grade}
        </span>
      </div>
    </div>
    <p className="text-lg text-gray-600 dark:text-gray-300">
      {grade.message}
    </p>
  </Card>
);

export default function ReportPage() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]);
  const [summary, setSummary] = useState({
    correct: 0,
    incorrect: 0,
    unattempted: 0,
    score: 0,
    timeSpent: 0,
  });

  const grade = useMemo(() => {
    const grades = {
      90: { grade: "A+", color: "text-green-600", message: "Outstanding Performance!" },
      80: { grade: "A", color: "text-green-500", message: "Excellent Work!" },
      70: { grade: "B", color: "text-blue-500", message: "Good Job!" },
      60: { grade: "C", color: "text-yellow-500", message: "Room for Improvement" },
      0: { grade: "F", color: "text-red-500", message: "Need More Practice" }
    };

     // Find highest grade threshold that the score exceeds
    const threshold = Object.keys(grades)
      .sort((a, b) => b - a)
      .find(threshold => summary.score >= threshold);
    
    return grades[threshold || 0];  // Default to lowest grade if no threshold met
  }, [summary.score]);

  const statCards = useMemo(() => [
    {
      icon: BarChart2,
      value: `${summary.score}%`,
      label: "Overall Score",
      color: "text-indigo-500",
    },
    {
      icon: CheckCircle,
      value: summary.correct,
      label: "Correct Answers",
      color: "text-green-500",
    },
    {
      icon: XCircle,
      value: summary.incorrect,
      label: "Incorrect Answers",
      color: "text-red-500",
    },
    {
      icon: Clock,
      value: formatTime(summary.timeSpent),
      label: "Time Taken",
      color: "text-blue-500",
    },
  ], [summary]);

  useEffect(() => {
    const loadQuizData = () => {
      const storedQuestions = localStorage.getItem("quiz_questions");
      const storedAnswers = localStorage.getItem("quiz_answers");
      const remainingTime = parseInt(localStorage.getItem("timeRemaining")) || 0;
      const email = localStorage.getItem("quiz_email");

      if (!storedQuestions || !storedAnswers || !email) {
        navigate("/");
        return;
      }
       // Calculate time spent by subtracting remaining time from total allotted time (30 mins = 1800 seconds)
      const parsedQuestions = JSON.parse(storedQuestions);
      const parsedAnswers = JSON.parse(storedAnswers);
      const actualTimeSpent = 1800 - remainingTime;

      const totalQuestions = parsedQuestions.length;
      const attempted = parsedAnswers.length;
      const correctCount = parsedAnswers.reduce((count, answer) => {
        const question = parsedQuestions[answer.questionIndex];
        return question.correct_answer === answer.answer ? count + 1 : count;
      }, 0);

      setQuestions(parsedQuestions);
      setUserAnswers(parsedAnswers);
      // Calculate correct answers by matching each user answer against question bank
      setSummary({
        correct: correctCount,
        incorrect: attempted - correctCount,
        unattempted: totalQuestions - attempted,
        score: Math.round((correctCount / totalQuestions) * 100), // Calculate percentage score
        timeSpent: actualTimeSpent,
      });
    };

    loadQuizData();
  }, [navigate]);

  return (
    <PageLayout>
      <GradeHeader score={summary.score} grade={grade} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statCards.map((card, index) => (
          <StatCard key={index} {...card} />
        ))}
      </div>

      <Card>
        <h2 className="text-xl font-bold mb-4">Question Analysis</h2>
        <div className="space-y-6">
          {questions.map((question, index) => {
            const userAnswer = userAnswers.find(
              (a) => a.questionIndex === index
            );
            return (
              <QuestionCard
                key={index}
                index={index}
                question={question}
                userAnswer={userAnswer}
              />
            );
          })}
        </div>
      </Card>

      <div className="flex justify-center gap-4 mt-6">
        <button
          onClick={() => navigate("/")}
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200"
        >
          Take Another Quiz
        </button>
        <button
          onClick={() => window.print()}
          className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all duration-200"
        >
          Print Report
        </button>
      </div>
    </PageLayout>
  );
}