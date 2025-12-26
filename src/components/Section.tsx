import { ReactNode } from "react";

interface SectionProps {
  children: ReactNode;
  className?: string;
  background?: "default" | "light" | "gradient";
  padding?: "default" | "large" | "small";
}

export default function Section({
  children,
  className = "",
  background = "default",
  padding = "default",
}: SectionProps) {
  const backgroundClasses = {
    default: "",
    light: "bg-white/80 backdrop-blur-sm",
    gradient: "bg-gradient-to-br from-white via-blue-50 to-blue-50",
  };

  const paddingClasses = {
    default: "py-20 px-6 sm:px-8 lg:px-12",
    large: "py-32 px-6 sm:px-8 lg:px-12",
    small: "py-12 px-6 sm:px-8 lg:px-12",
  };

  return (
    <section
      className={`${paddingClasses[padding]} ${backgroundClasses[background]} ${className}`}
    >
      {children}
    </section>
  );
}

