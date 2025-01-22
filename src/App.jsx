import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import StartPage from "./pages/StartPage";
import QuizPage from "./pages/QuizPage";
import ReportPage from "./pages/ReportPage";

function App() {
  return (
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
        <Router basename="/quizo">
          <Routes>
            <Route path="/" element={<StartPage />} />
            <Route path="/quiz" element={<QuizPage />} />
            <Route path="/report" element={<ReportPage />} />
          </Routes>
        </Router>
      </div>
  );
}

export default App;