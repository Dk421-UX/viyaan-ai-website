import React from "react";

interface SiteContainerProps {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
  id?: string;
}

export default function SiteContainer({
  children,
  className = "",
  as: Component = "div",
  id,
}: SiteContainerProps) {
  return (
    <Component
      id={id}
      className={`site-container ${className}`}
    >
      {children}
    </Component>
  );
}
