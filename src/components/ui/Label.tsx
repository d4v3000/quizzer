import { FC } from "react";

interface IProps {
  text: string;
}

const Label: FC<IProps> = ({ text }) => {
  return (
    <div className="flex w-full items-center gap-2 py-2">
      <p className="min-w-fit pr-2 text-sm font-semibold uppercase italic text-zinc-400">
        {text}
      </p>
      <hr className="border-1 w-full border-zinc-400" />
    </div>
  );
};

export default Label;
