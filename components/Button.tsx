import React, { MouseEventHandler, ReactNode } from "react";

export default function Button({
  children,
  className = "",
  onClick = () => {},
}: {
  children: ReactNode;
  className?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-3 rounded-lg bg-[#05B959] text-sm font-semibold hover:bg-[#278272] ${className}`}
    >
      {children}
    </button>
  );
}
