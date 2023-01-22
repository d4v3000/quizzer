import { FC, HTMLAttributes, ReactNode } from "react";

interface IProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

const TypeBox: FC<IProps> = ({ children, ...props }) => {
  return (
    <div
      {...props}
      className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-black p-4 shadow-md shadow-zinc-900 hover:scale-[1.03]"
    >
      {children}
    </div>
  );
};

export default TypeBox;
