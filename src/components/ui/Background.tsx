import { ReactNode } from "react";

interface IProps {
  children: ReactNode;
  className?: string;
}

function Background({ children, className }: IProps) {
  return (
    <div
      className={`rounded-lg border border-zinc-400 p-0 lg:p-2 ${className}`}
    >
      {children}
    </div>
  );
}

export default Background;
