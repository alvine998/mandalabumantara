import { ReactNode } from "react";

interface SwupLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  [key: string]: any;
}

export default function SwupLink({
  href,
  children,
  className,
  ...props
}: SwupLinkProps) {
  return (
    <a href={href} className={className} {...props}>
      {children}
    </a>
  );
}

