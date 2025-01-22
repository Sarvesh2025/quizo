import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { PageLayout } from "../components/Layout";
import { Card } from "../components/Card";
import { QuestionHeader }from '../components/QuestionHeader';
import {NavigationButtons}  from '../components/NavigationButtons';
import { decodeHTML, formatTime } from '../utils/utils';

export default function QuizPage() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState(30 * 60); // 30 minutes in seconds
  const [isLoading, setIsLoading] = useState(true);
  const [shuffledAnswers, setShuffledAnswers] = useState([]);
  const [starredQuestions, setStarredQuestions] = useState(new Set());

  useEffect(() => {
    // Checking validity of user
    const email = localStorage.getItem("quiz_email");
    if (!email) {
      navigate("/");
      return;
    }

    const fetchQuestions = async () => {
      try {
        const response = await axios.get("https://opentdb.com/api.php?amount=15");
        const questionsData = response.data.results;
        setQuestions(questionsData);

        // Created shuffled answer arrays for each question
      
        const initialShuffledAnswers = questionsData.map((question) => {
          const answers = [...question.incorrect_answers, question.correct_answer];
          return answers.sort(() => Math.random() - 0.5);
        });
        setShuffledAnswers(initialShuffledAnswers);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch questions:", error);
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, [navigate]);

  // Timer logic: Counts down from 30 minutes and automatic submission after time runs out

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);


  // Maintains array of user answers with their corresponding question indices
  const handleAnswerSelect = (answer) => {
    setUserAnswers((prev) => {
      const newAnswers = [...prev];
      const existingAnswerIndex = newAnswers.findIndex(
        (a) => a.questionIndex === currentQuestionIndex
      );

  
      if (existingAnswerIndex !== -1) {
        newAnswers[existingAnswerIndex] = {
          questionIndex: currentQuestionIndex,
          answer: answer,
        };
      } else {
        newAnswers.push({
          questionIndex: currentQuestionIndex,
          answer: answer,
        });
      }

      // Persist answers to localStorage for recovery/submission
      localStorage.setItem("quiz_answers", JSON.stringify(newAnswers));
      return newAnswers;
    });
  };

  const navigateToQuestion = (index) => {
    setCurrentQuestionIndex(index);
    setVisitedQuestions((prev) => new Set([...prev, index]));
  };

  // Saves quiz state to localStorage before navigation
  const handleSubmitQuiz = () => {
    localStorage.setItem("quiz_questions", JSON.stringify(questions));
    localStorage.setItem("timeRemaining", timeRemaining.toString());
    navigate("/report");
  };

  // Manages starred questions using Set for efficient lookups
  const toggleStarQuestion = (index) => {
    setStarredQuestions((prev) => {
      const newStarred = new Set(prev);
      if (newStarred.has(index)) {
        newStarred.delete(index);
      } else {
        newStarred.add(index);
      }
      return newStarred;
    });
  };

  // Priority: answered > starred > unattempted
  const getQuestionStatus = (index) => {
    const isAnswered = userAnswers.some((a) => a.questionIndex === index);
    const isStarred = starredQuestions.has(index);

    if (isAnswered) return "answered";
    if (isStarred) return "starred";
    return "unattempted";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-gray-800 dark:to-gray-900">
        <div className="text-2xl font-semibold text-indigo-700 dark:text-indigo-300 animate-pulse">
          Loading your quiz...
        </div>
      </div>
    );
  }

  
  const currentQuestion = questions[currentQuestionIndex];
  const currentShuffledAnswers = shuffledAnswers[currentQuestionIndex] || [];
  const currentUserAnswer = userAnswers.find(
    (a) => a.questionIndex === currentQuestionIndex
  );

  return (
    <PageLayout>
      
      <Card className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-indigo-700 dark:text-indigo-300">
          Quiz Challenge
        </h1>
        <div className="text-xl font-mono bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 px-4 py-2 rounded-lg">
          {formatTime(timeRemaining)}
        </div>
      </Card>

      <div className="flex gap-6">
        {/*question area */}
        <div className="flex-grow">
          <Card className="mb-6">
            <QuestionHeader 
              questionNumber={currentQuestionIndex + 1}
              isStarred={starredQuestions.has(currentQuestionIndex)}
              onToggleStar={() => toggleStarQuestion(currentQuestionIndex)}
            />

            <p className="text-lg mb-6">
              {decodeHTML(currentQuestion?.question)}
            </p>

            
            <div className="space-y-3">
              {currentShuffledAnswers.map((answer, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(answer)}
                  className={`w-full p-4 text-left rounded-lg transition-all duration-200
                    ${currentUserAnswer?.answer === answer
                      ? "bg-blue-500 text-white"
                      : "bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"
                    }`}
                >
                  <div className="flex items-center">
                    <span className="w-8 h-8 flex items-center justify-center rounded-full border-2 border-current mr-3">
                      {String.fromCharCode(65 + index)} {/* Converting 0-3 to A-D options */}
                    </span>
                    <span>{decodeHTML(answer)}</span>
                  </div>
                </button>
              ))}
            </div>
          </Card>

          <NavigationButtons 
            currentIndex={currentQuestionIndex}
            totalQuestions={questions.length}
            onPrevious={() => navigateToQuestion(currentQuestionIndex - 1)}
            onNext={() => navigateToQuestion(currentQuestionIndex + 1)}
          />
        </div>

        <div className="w-80">
          <Card className="sticky top-6">
            <h2 className="text-lg font-semibold mb-4">Question Navigator</h2>

            {/* Status indicator legend */}
            <div className="flex gap-4 mb-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Answered</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span>Starred</span>
              </div>
            </div>

        
            <div className="grid grid-cols-4 gap-2 mb-6">
              {questions.map((_, index) => {
                const status = getQuestionStatus(index);
                return (
                  <button
                    key={index}
                    onClick={() => navigateToQuestion(index)}
                    className={`relative p-3 rounded-lg flex items-center justify-center font-semibold transition-all duration-200
                      ${currentQuestionIndex === index ? "ring-2 ring-indigo-500" : ""}
                      ${status === "answered"
                        ? "bg-green-700 text-white"
                        : status === "starred"
                        ? "bg-red-500 text-white"
                        : "bg-gray-100 dark:bg-gray-700"
                      }`}
                  >
                    {index + 1}
                    {starredQuestions.has(index) && (
                      <span className="absolute -top-1 -right-1 text-yellow-400">★</span>
                    )}
                  </button>
                );
              })}
            </div>

            <button
              onClick={handleSubmitQuiz}
              className="w-full py-3 bg-green-700 text-white rounded-lg hover:bg-green-700 
                transition-all duration-200 font-semibold shadow-lg"
            >
              Submit Quiz
            </button>

  
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span>Answered</span>
                  <span>{userAnswers.length} / {questions.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Starred</span>
                  <span>{starredQuestions.size}</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
}