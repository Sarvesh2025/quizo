export const decodeHTML = (html) => {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
};

export const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
};

export const calculateGrade = (score) => {
  if (score >= 90) {
    return {
      grade: "A+",
      color: "text-green-600",
      message: "Outstanding Performance!",
    };
  }
  if (score >= 80) {
    return {
      grade: "A",
      color: "text-green-500",
      message: "Excellent Work!",
    };
  }
  if (score >= 70) {
    return {
      grade: "B",
      color: "text-blue-500",
      message: "Good Job!",
    };
  }
  if (score >= 60) {
    return {
      grade: "C",
      color: "text-yellow-500",
      message: "Room for Improvement",
    };
  }
  return {
    grade: "F",
    color: "text-red-500",
    message: "Need More Practice",
  };
};