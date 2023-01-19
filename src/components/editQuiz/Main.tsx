import Input from "@ui/Input";
import { FC } from "react";

interface IProps {
  setQuizName: (name: string) => void;
  quizName: string | undefined;
}

const Main: FC<IProps> = ({ setQuizName, quizName }) => {
  return (
    <div className="flex w-2/4 flex-col items-center p-10">
      <div className="flex w-full items-center gap-2 py-2">
        <p className="min-w-fit pr-2 text-sm font-semibold uppercase italic text-zinc-400">
          Quiz Name
        </p>
        <hr className="border-1 w-full border-zinc-400" />
      </div>
      <Input
        placeholder="Name of the quiz"
        onChange={(e) => setQuizName(e.target.value)}
        value={quizName}
      />
    </div>
  );
};

export default Main;
