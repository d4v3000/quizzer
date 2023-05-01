import { FC, HTMLAttributes, ReactNode } from "react";

interface IProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

const TypeBox: FC<IProps> = ({ children, ...props }) => {
  return (
    <div
      tabIndex={0}
      {...props}
      className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-black p-4 shadow-md shadow-zinc-900 hover:scale-[1.03] focus-visible:shadow-white"
    >
      {children}
    </div>
  );
};

export default TypeBox;
