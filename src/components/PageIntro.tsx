import React from "react";

interface PageIntroProps {
  eyebrow?: string;
  title: string | React.ReactNode;
  description?: string | React.ReactNode;
  className?: string;
  align?: "left" | "center";
}

export default function PageIntro({
  eyebrow,
  title,
  description,
  className = "",
  align = "left",
}: PageIntroProps) {
  const isCentered = align === "center";

  return (
    <div
      className={`flex flex-col ${
        isCentered ? "items-center text-center mx-auto" : "items-start text-left"
      } ${className}`}
    >
      {eyebrow && (
        <span className="text-[11px] uppercase tracking-[0.14em] text-[#00B2FF] font-mono font-medium mb-3">
          {eyebrow}
        </span>
      )}

      <h1 className="font-display font-semibold text-[2rem] sm:text-4xl md:text-[2.75rem] text-white tracking-[-0.035em] leading-[1.08] max-w-2xl">
        {title}
      </h1>

      {description && (
        <p className="font-sans text-sm sm:text-[15px] text-neutral-400 leading-7 max-w-xl mt-4">
          {description}
        </p>
      )}
    </div>
  );
}
