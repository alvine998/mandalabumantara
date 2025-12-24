import { ReactNode } from "react";
import SwupLink from "./SwupLink";

interface ButtonProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline";
  href?: string;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
}

export default function Button({
  children,
  variant = "primary",
  href,
  onClick,
  className = "",
  type = "button",
}: ButtonProps) {
  const baseClasses =
    "px-6 py-2.5 rounded-full font-medium transition-all duration-300 transform hover:scale-105";

  const variantClasses = {
    primary:
      "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg hover:shadow-indigo-500/50",
    secondary:
      "bg-white text-slate-900 border-2 border-slate-200 hover:border-indigo-500",
    outline:
      "bg-transparent border-2 border-white text-white hover:bg-white/10",
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${className}`;

  if (href) {
    return (
      <SwupLink href={href} className={classes}>
        {children}
      </SwupLink>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes}>
      {children}
    </button>
  );
}

