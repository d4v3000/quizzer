import React, { ReactNode } from "react";

interface IProps {
  children: ReactNode;
  className?: string;
}

function Background({ children, className }: IProps) {
  return (
    <div className={`rounded-lg border border-slate-600 p-2 ${className}`}>
      {children}
    </div>
  );
}

export default Background;
