import { cn } from "@shared/lib/utils";
import React, { forwardRef } from "react";

interface TextBoxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

const TextBox = forwardRef<HTMLInputElement, TextBoxProps>(
  ({ className, ...props }: TextBoxProps, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "w-full bg-white rounded-lg border-2 transition-all focus:border-blue-600 outline-none border-gray-200 px-4 py-2 placeholder:text-gray",
          className
        )}
        {...props}
      />
    );
  }
);

TextBox.displayName = "TextBox";

export default TextBox;
