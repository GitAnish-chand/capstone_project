import React from "react";
import clsx from "clsx";

export function Button({ children, className, size = "md", ...props }) {
  const sizes = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      className={clsx(
        "rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition font-medium",
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
