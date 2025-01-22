import React from "react";

export const PageLayout = React.memo(({ children }) => (
  <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-gray-800 dark:to-gray-900 py-8 px-4">
    <div className="max-w-6xl mx-auto">{children}</div>
  </div>
));
