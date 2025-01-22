import React from "react";

export const Card = React.memo(({ children, className = "" }) => (
  <div
    className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 ${className}`}
  >
    {children}
  </div>
));
