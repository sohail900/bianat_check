import React from "react";
import { twMerge } from "tailwind-merge";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: string | JSX.Element;
}
const Button = ({ className, children, ...props }: ButtonProps) => {
  return (
    <button
      className={twMerge(
        "bg-blue-600 py-2 px-4 rounded-lg text-white hover:bg-blue-700 enabled:active:scale-95 transition-all duration-150 ease-in-out disabled:bg-black/70 disabled:ring-black/70",
        "focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:ring-offset-white",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
