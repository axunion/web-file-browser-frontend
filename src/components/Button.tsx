import { ButtonHTMLAttributes } from "react";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "outline" | "neutral";
  size?: "small" | "medium" | "large";
};

const baseClasses =
  "font-semibold rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";

const variantClasses = {
  primary: "bg-amber-700 hover:bg-amber-600 text-white focus:ring-amber-700",
  secondary:
    "bg-amber-200 text-amber-700 hover:bg-amber-300 focus:ring-amber-500",
  outline:
    "bg-transparent border border-amber-700 hover:bg-amber-100 focus:ring-amber-600",
  neutral: "bg-gray-100 text-black hover:bg-gray-200 focus:ring-gray-500",
};

const sizeClasses = {
  small: "px-3 py-1 text-sm",
  medium: "px-4 py-2 text-base",
  large: "px-6 py-3 text-lg",
};

const Button = ({
  children,
  variant = "primary",
  size = "medium",
  className = "",
  ...props
}: ButtonProps) => {
  const classes =
    baseClasses +
    " " +
    (variantClasses[variant] || "") +
    " " +
    (sizeClasses[size] || "") +
    (className ? " " + className : "");

  return (
    <button
      className={classes}
      {...props}
      aria-label={props["aria-label"] || "Button"}
    >
      {children}
    </button>
  );
};

export default Button;
